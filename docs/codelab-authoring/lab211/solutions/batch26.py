# Batch 26 — J1.L.P0023 (Fruit Shop: catalogue + cart + order history, 350 LOC).
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.L.P0023 — Fruit Shop (350 LOC)
# ════════════════════════════════════════════════════════════════

FRUIT = '''package entity;

import java.io.Serializable;

/**
 * One product line in the shop's catalogue.
 *
 * `quantity` is the stock still on the shelf, not the amount someone is buying.
 * Those two numbers are different things that both want to be called
 * "quantity", and mixing them up is the single most expensive mistake in this
 * assignment - so the amount being bought lives on Item instead, and never on
 * Fruit.
 *
 * Serializable because a Fruit is pure data with no behaviour of its own: it
 * holds fields, hands them back, and describes itself. Every rule about fruit
 * (is this id taken? is there enough stock?) lives in bo.FruitManager, because
 * those questions can only be answered by looking at the WHOLE catalogue, and
 * an object that only knows about itself cannot answer them.
 */
public class Fruit implements Serializable {

    private String id;
    private String name;
    private double price;
    private int quantity;
    private String origin;

    public Fruit(String id, String name, double price, int quantity, String origin) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.origin = origin;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    @Override
    public String toString() {
        return id + " - " + name + " (" + origin + ")";
    }
}
'''

ITEM = '''package entity;

import java.io.Serializable;

/**
 * One line of a cart: this much of this fruit, at this price.
 *
 * Note what is NOT here: a reference to the Fruit object. An Item copies the
 * name and the price at the moment of sale instead of pointing at the
 * catalogue. That looks like duplication and it is deliberate - the shop owner
 * can raise the price of Mango tomorrow, and yesterday's orders must still show
 * what the customer actually paid. Hold a reference and the whole order history
 * quietly rewrites itself the moment a price changes, which is the kind of bug
 * nobody notices until an accountant does.
 *
 * The fruit id is kept as well, because that is what stock is deducted against
 * when the order is confirmed - two fruits can share a name, they cannot share
 * an id.
 */
public class Item implements Serializable {

    private String fruitId;
    private String fruitName;
    private double price;
    private int quantity;

    public Item(String fruitId, String fruitName, double price, int quantity) {
        this.fruitId = fruitId;
        this.fruitName = fruitName;
        this.price = price;
        this.quantity = quantity;
    }

    public String getFruitId() {
        return fruitId;
    }

    public String getFruitName() {
        return fruitName;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /** What this line costs. Never stored - a stored total can disagree with itself. */
    public double getAmount() {
        return price * quantity;
    }

    @Override
    public String toString() {
        return fruitName + " x " + quantity;
    }
}
'''

CART = '''package entity;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * What one customer is buying: an ArrayList of Item, plus the two rules that
 * only make sense when you own that list.
 *
 * WHY THIS IS A CLASS AND NOT JUST AN ArrayList&lt;Item&gt;.
 *
 * The brief's own guideline says "hashTable.set(&lt;customer name&gt;, &lt;list of
 * items bought&gt;)", and it would compile perfectly well to pass a bare
 * ArrayList&lt;Item&gt; around. The problem is that a bare list has no opinion
 * about its contents. Order the same fruit twice and you get two lines for
 * Coconut; the total is still right, but the receipt is wrong and the stock
 * check ("how many Coconut has this customer already reserved?") has to be
 * written out by hand at every call site - which means it will be written
 * differently at one of them.
 *
 * Putting add(), quantityOf() and getTotal() on a type gives those three
 * questions exactly one answer each. The ArrayList the brief asks for is still
 * there, one field down; it is just no longer everybody's problem.
 */
public class Cart implements Serializable {

    private final ArrayList<Item> items = new ArrayList<>();

    public ArrayList<Item> getItems() {
        return items;
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    /** Add a purchase of `quantity` units of `fruit`, merging with any line already there. */
    public void add(Fruit fruit, int quantity) {
        addItem(new Item(fruit.getId(), fruit.getName(), fruit.getPrice(), quantity));
    }

    /**
     * Merge one line in.
     *
     * Lines merge when the id AND the price match. Same id at a different price
     * means the owner changed the price between two visits, and squashing those
     * into one line would have to pick a price to show - so it keeps them apart
     * and the receipt stays truthful.
     */
    public void addItem(Item incoming) {
        for (Item existing : items) {
            if (existing.getFruitId().equals(incoming.getFruitId())
                    && existing.getPrice() == incoming.getPrice()) {
                existing.setQuantity(existing.getQuantity() + incoming.getQuantity());
                return;
            }
        }
        items.add(new Item(incoming.getFruitId(), incoming.getFruitName(),
                incoming.getPrice(), incoming.getQuantity()));
    }

    /** Fold another cart into this one - used when a returning customer buys again. */
    public void merge(Cart other) {
        for (Item item : other.getItems()) {
            addItem(item);
        }
    }

    /**
     * How much of this fruit is already in the cart.
     *
     * This is what makes the stock check honest while shopping: the shelf has
     * ten Coconut, three are already in this cart, so the most you may add now
     * is seven - even though nothing has been deducted from the shelf yet.
     */
    public int quantityOf(String fruitId) {
        int total = 0;
        for (Item item : items) {
            if (item.getFruitId().equals(fruitId)) {
                total += item.getQuantity();
            }
        }
        return total;
    }

    public double getTotal() {
        double total = 0;
        for (Item item : items) {
            total += item.getAmount();
        }
        return total;
    }
}
'''

MONEY = '''package utils;

/**
 * One place that turns a number into money on the screen.
 *
 * The brief prints prices as "2$" and "6$" - no decimal point when there is
 * nothing after it. Formatting with plain %.2f would print "2.00$" everywhere
 * and diff against every line of the expected screen, and formatting with
 * String.valueOf() would print "2.0$" and, worse, "6.300000000000001$" the
 * first time somebody sells three fruits at 2.10$.
 *
 * So: round to two decimals first (that is the shop's real precision), then
 * drop trailing zeros and a stranded decimal point. 2.0 -> "2$", 1.5 -> "1.5$",
 * 1.25 -> "1.25$".
 */
public class Money {

    private Money() {
    }

    public static String format(double amount) {
        String text = String.format("%.2f", amount);
        while (text.endsWith("0")) {
            text = text.substring(0, text.length() - 1);
        }
        if (text.endsWith(".")) {
            text = text.substring(0, text.length() - 1);
        }
        return text + "$";
    }
}
'''

VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, and every check on what came back.
 *
 * ONE static Scanner for the whole program. Opening a second Scanner on
 * System.in is the classic way to lose input: each one buffers ahead, so the
 * second reads from where the first stopped buffering, not from where the user
 * stopped typing.
 *
 * Everything reads whole LINES. Mixing nextInt() with nextLine() leaves the
 * newline in the buffer and the next name read comes back empty - which in this
 * program would mean an order filed under the customer "".
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /**
     * A non-empty line that does not contain the delimiter used by the data
     * files. Rejecting '|' at the keyboard is much cheaper than escaping it on
     * the way out and un-escaping it on the way back in.
     */
    public static String getText(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (line.isEmpty()) {
                System.out.println("This field must not be empty.");
                continue;
            }
            if (line.indexOf('|') >= 0) {
                System.out.println("The character '|' is not allowed.");
                continue;
            }
            return line;
        }
    }

    /**
     * An integer inside [min, max].
     *
     * The out-of-range message is passed IN rather than built here, because the
     * brief words the same rule differently in different places - "Quantity
     * must be greater than 0." while ordering, "Please choose from 1 to 4." at
     * the menu. One reader, the caller's wording.
     */
    public static int getInt(String message, int min, int max, String error) {
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
                System.out.println("You must input a number.");
            }
        }
    }

    public static double getDouble(String message, double min, double max, String error) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                double value = Double.parseDouble(line);
                if (value < min || value > max) {
                    System.out.println(error);
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /** Y or N, and nothing else gets through. */
    public static boolean getYesNo(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (line.equalsIgnoreCase("Y")) {
                return true;
            }
            if (line.equalsIgnoreCase("N")) {
                return false;
            }
            System.out.println("Please answer Y or N.");
        }
    }
}
'''

FRUIT_MANAGER = '''package bo;

import entity.Cart;
import entity.Fruit;
import entity.Item;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;

/**
 * The catalogue: the ArrayList of Fruit the brief asks for, and every rule that
 * needs to see the whole list to be answerable.
 *
 * It throws and it never prints. A method that prints its own error can only be
 * used by a console program; a method that throws can be used by the console,
 * by a test, and by whatever this becomes next.
 *
 * It also owns its file. The class that holds the collection is the only class
 * that knows when the collection changed, so it is the only class that can save
 * at the right moment; a save() called from the controller is a save that will
 * be forgotten on the day a second controller appears.
 */
public class FruitManager {

    private static final String DATA_FILE = "fruits.txt";

    private final ArrayList<Fruit> fruits = new ArrayList<>();

    public FruitManager() {
        load();
    }

    public ArrayList<Fruit> getFruits() {
        return fruits;
    }

    public int size() {
        return fruits.size();
    }

    public boolean isEmpty() {
        return fruits.isEmpty();
    }

    public Fruit get(int index) {
        return fruits.get(index);
    }

    public Fruit findById(String id) {
        for (Fruit fruit : fruits) {
            if (fruit.getId().equalsIgnoreCase(id)) {
                return fruit;
            }
        }
        return null;
    }

    /** The id is the identity of a product, so a duplicate is refused, not renamed. */
    public void add(Fruit fruit) throws Exception {
        if (findById(fruit.getId()) != null) {
            throw new Exception("Fruit ID " + fruit.getId() + " already exists.");
        }
        fruits.add(fruit);
        save();
    }

    /**
     * May this customer add `wanted` more of this fruit?
     *
     * `alreadyInCart` is what the same customer has already put in the cart but
     * not yet paid for. Without it the shop happily sells eleven Coconut out of
     * a shelf of ten, one order of six followed by one of five, because each
     * check on its own looks fine.
     */
    public void checkOrderable(Fruit fruit, int wanted, int alreadyInCart) throws Exception {
        int remaining = fruit.getQuantity() - alreadyInCart;
        if (remaining <= 0) {
            throw new Exception(fruit.getName() + " is out of stock.");
        }
        if (wanted > remaining) {
            throw new Exception("Only " + remaining + " " + fruit.getName() + " left in stock.");
        }
    }

    /**
     * Deduct a confirmed order from the shelf.
     *
     * Stock moves HERE, at confirmation, and not when an item is put in the
     * cart. A cart that has not been paid for is a wish, and a shop that
     * decrements on every wish loses its whole stock to customers who changed
     * their mind. The cart holds the reservation instead (see
     * Cart.quantityOf), which is why nothing is lost by waiting.
     *
     * Every line is re-checked before anything is written, then everything is
     * written. Deducting as you go would leave the shelf half-updated if line
     * three turned out to be impossible.
     */
    public void checkout(Cart cart) throws Exception {
        for (Item item : cart.getItems()) {
            Fruit fruit = findById(item.getFruitId());
            if (fruit == null) {
                throw new Exception(item.getFruitName() + " is no longer sold.");
            }
            if (fruit.getQuantity() < item.getQuantity()) {
                throw new Exception("Only " + fruit.getQuantity() + " " + fruit.getName() + " left in stock.");
            }
        }
        for (Item item : cart.getItems()) {
            Fruit fruit = findById(item.getFruitId());
            fruit.setQuantity(fruit.getQuantity() - item.getQuantity());
        }
        save();
    }

    // ── persistence ──────────────────────────────────────────────
    //
    // A plain pipe-delimited text file, not serialization: the shop owner can
    // open it, read it, and fix a typo in it. A .dat full of serialized objects
    // is unreadable by anyone and stops loading the day a field is added to
    // Fruit. Validator.getText() already refuses '|' at the keyboard, so no
    // value can ever break the format.

    private void save() {
        PrintWriter writer = null;
        try {
            writer = new PrintWriter(new FileWriter(DATA_FILE));
            for (Fruit fruit : fruits) {
                writer.println(fruit.getId() + "|" + fruit.getName() + "|" + fruit.getPrice()
                        + "|" + fruit.getQuantity() + "|" + fruit.getOrigin());
            }
        } catch (Exception e) {
            // Nothing useful can be done here and bo must not print, so the
            // shop stays open on its in-memory data rather than dying at the
            // till because a disk was full.
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }

    private void load() {
        File file = new File(DATA_FILE);
        if (!file.exists()) {
            // The very first run has no file. That is not an error.
            return;
        }
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\\\\|");
                if (parts.length != 5) {
                    continue;
                }
                fruits.add(new Fruit(parts[0], parts[1], Double.parseDouble(parts[2]),
                        Integer.parseInt(parts[3]), parts[4]));
            }
        } catch (Exception e) {
            // A corrupt line is skipped above; anything worse leaves the shop
            // with whatever loaded before it.
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (Exception ignored) {
            }
        }
    }
}
'''

ORDER_MANAGER = '''package bo;

import entity.Cart;
import entity.Item;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Hashtable;

/**
 * The order book: Hashtable&lt;customer name, Cart&gt;, exactly as the brief's
 * guideline spells it out.
 *
 * AND an ArrayList of the names beside it, which is the part the brief does not
 * mention and the program cannot do without. A Hashtable has no order at all -
 * it hands its keys back in bucket order, which is a function of the hash of
 * the strings and has nothing to do with who shopped first. The brief's own
 * expected screen shows Marry Carie above John Smith because that is the order
 * they bought in, so the order of purchase has to be recorded somewhere, and a
 * hash table is precisely the structure that throws it away.
 *
 * So the Hashtable answers "what did this customer buy?" in one step, and the
 * ArrayList answers "in what order did they arrive?". Neither can do the
 * other's job.
 */
public class OrderManager {

    private static final String DATA_FILE = "orders.txt";

    private final Hashtable<String, Cart> orders = new Hashtable<String, Cart>();
    private final ArrayList<String> customers = new ArrayList<>();

    public OrderManager() {
        load();
    }

    public boolean isEmpty() {
        return customers.isEmpty();
    }

    public ArrayList<String> getCustomers() {
        return customers;
    }

    public Cart getOrder(String customer) {
        return orders.get(customer);
    }

    /**
     * File a paid cart under a customer name.
     *
     * The key is the name, because the brief says so, and that is a real
     * modelling flaw worth being able to defend: two different people called
     * John Smith are one customer to this program. Given the key, the least bad
     * behaviour is to MERGE - a returning customer's second visit is added to
     * their history. Overwriting would silently delete an order that was really
     * placed and really paid for, and losing a sale is worse than conflating
     * two shoppers.
     */
    public void place(String customer, Cart cart) {
        Cart existing = orders.get(customer);
        if (existing == null) {
            // Hashtable, unlike HashMap, throws on a null key or value - so the
            // caller must never hand us a name that failed validation.
            orders.put(customer, cart);
            customers.add(customer);
        } else {
            existing.merge(cart);
        }
        save();
    }

    // ── persistence ──────────────────────────────────────────────
    //
    // Two record types in one file: "C|name" opens a customer, and each "I|..."
    // after it is a line of that customer's cart. Reading is a single pass with
    // one variable holding "the cart we are filling in", which is all a nested
    // structure needs when the nesting is only one deep.

    private void save() {
        PrintWriter writer = null;
        try {
            writer = new PrintWriter(new FileWriter(DATA_FILE));
            for (String customer : customers) {
                writer.println("C|" + customer);
                for (Item item : orders.get(customer).getItems()) {
                    writer.println("I|" + item.getFruitId() + "|" + item.getFruitName()
                            + "|" + item.getPrice() + "|" + item.getQuantity());
                }
            }
        } catch (Exception e) {
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }

    private void load() {
        File file = new File(DATA_FILE);
        if (!file.exists()) {
            return;
        }
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String line;
            Cart current = null;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\\\\|");
                if (parts.length == 2 && "C".equals(parts[0])) {
                    current = new Cart();
                    orders.put(parts[1], current);
                    customers.add(parts[1]);
                } else if (parts.length == 5 && "I".equals(parts[0]) && current != null) {
                    current.addItem(new Item(parts[1], parts[2],
                            Double.parseDouble(parts[3]), Integer.parseInt(parts[4])));
                }
            }
        } catch (Exception e) {
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (Exception ignored) {
            }
        }
    }
}
'''

CONTROLLER = '''package controller;

import bo.FruitManager;
import bo.OrderManager;
import entity.Cart;
import entity.Fruit;
import entity.Item;
import utils.Money;
import utils.Validator;

/**
 * The three menu actions. Each one reads through Validator, asks bo, and
 * reports what bo said.
 *
 * This layer exists because the alternative is a Main with three hundred lines
 * in it. The shopping loop alone is a small state machine - pick, quantity,
 * confirm or keep going, name - and it has no business sitting inside a switch
 * statement next to the menu banner.
 */
public class ShopController {

    /**
     * The buyer's table, copied from the brief character for character -
     * including the leading space on both lines, which the "View orders" screen
     * does not have. The two screens in the brief are inconsistent; the marker
     * diffs each screen against its own picture, so both are reproduced as
     * printed rather than tidied into one.
     */
    private static final String CART_HEADER = " Product | Quantity | Price | Amount";
    private static final String ORDER_HEADER = "Product | Quantity | Price | Amount";
    private static final String LIST_HEADER =
            "| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |";
    private static final String STOCK_HEADER =
            "| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ | ++ Quantity ++ |";

    private final FruitManager fruitManager;
    private final OrderManager orderManager;

    public ShopController(FruitManager fruitManager, OrderManager orderManager) {
        this.fruitManager = fruitManager;
        this.orderManager = orderManager;
    }

    // ── 1. Create Fruit ──────────────────────────────────────────

    /**
     * Keep creating fruits until the owner answers N, then show the catalogue.
     *
     * Each field is validated as it is typed rather than all at the end. A
     * price of -1 caught on the way in costs one retyped line; caught after the
     * origin it costs the whole product.
     */
    public void createFruit() {
        boolean more = true;
        while (more) {
            String id = readFreeId();
            String name = Validator.getText("Fruit name: ");
            double price = Validator.getDouble("Price: ", Double.MIN_VALUE, Double.MAX_VALUE,
                    "Price must be greater than 0.");
            int quantity = Validator.getInt("Quantity: ", 0, Integer.MAX_VALUE,
                    "Quantity must not be negative.");
            String origin = Validator.getText("Origin: ");
            try {
                fruitManager.add(new Fruit(id, name, price, quantity, origin));
                System.out.println("Fruit " + id + " has been created.");
            } catch (Exception e) {
                // Unreachable while readFreeId() guards the id, and kept
                // anyway: bo owns the rule, so the caller handles the rule
                // being broken. The day a second caller appears, this is the
                // line that stops it corrupting the catalogue.
                System.out.println(e.getMessage());
            }
            more = Validator.getYesNo("Do you want to continue (Y/N)? ");
        }
        System.out.println("List of Fruit:");
        showStock();
    }

    /** Ask for an id until one is free, so the owner retypes one field, not five. */
    private String readFreeId() {
        while (true) {
            String id = Validator.getText("Fruit ID: ");
            if (fruitManager.findById(id) == null) {
                return id;
            }
            System.out.println("Fruit ID " + id + " already exists.");
        }
    }

    /** The owner's view: the buyer's table plus the one column only the owner needs. */
    private void showStock() {
        if (fruitManager.isEmpty()) {
            System.out.println("There is no fruit in the shop yet.");
            return;
        }
        System.out.println(STOCK_HEADER);
        for (int i = 0; i < fruitManager.size(); i++) {
            Fruit fruit = fruitManager.get(i);
            System.out.printf("%12d  %-18s %-14s %-13s %d%n", i + 1, fruit.getName(),
                    fruit.getOrigin(), Money.format(fruit.getPrice()), fruit.getQuantity());
        }
    }

    // ── 2. View orders ───────────────────────────────────────────

    /**
     * Every order, in the order the customers bought.
     *
     * Iterating the ArrayList of names and looking each one up in the Hashtable
     * - not iterating the Hashtable, whose order is a property of the hash
     * function. Print it straight from the table and the report reshuffles
     * itself when a customer named "Zoe" happens to land in an earlier bucket
     * than "Anna".
     */
    public void viewOrders() {
        if (orderManager.isEmpty()) {
            System.out.println("There is no order yet.");
            return;
        }
        for (String customer : orderManager.getCustomers()) {
            Cart cart = orderManager.getOrder(customer);
            System.out.println("Customer: " + customer);
            System.out.println(ORDER_HEADER);
            for (int i = 0; i < cart.getItems().size(); i++) {
                Item item = cart.getItems().get(i);
                System.out.printf("%d. %-16s %8d %8s %8s%n", i + 1, item.getFruitName(),
                        item.getQuantity(), Money.format(item.getPrice()),
                        Money.format(item.getAmount()));
            }
            System.out.println("Total: " + Money.format(cart.getTotal()));
        }
    }

    // ── 3. Shopping ──────────────────────────────────────────────

    /**
     * One shopping trip: pick a fruit, say how many, and either pay or keep
     * going. The cart lives for exactly as long as this method does.
     *
     * The brief's loop has no way out other than answering Y, which would trap
     * a customer who changed their mind about everything. Item 0 leaves, and
     * because stock is only deducted at checkout, leaving costs the shop
     * nothing.
     */
    public void shopping() {
        if (fruitManager.isEmpty()) {
            System.out.println("There is no fruit in the shop yet.");
            return;
        }
        Cart cart = new Cart();
        while (true) {
            System.out.println("List of Fruit:");
            showCatalogue();
            int item = Validator.getInt("Please choose item (0 to return to main screen): ",
                    0, fruitManager.size(), "Please choose from 0 to " + fruitManager.size() + ".");
            if (item == 0) {
                if (!cart.isEmpty()) {
                    System.out.println("Your order has been cancelled.");
                }
                return;
            }

            Fruit fruit = fruitManager.get(item - 1);
            System.out.println("You selected: " + fruit.getName());
            int quantity = Validator.getInt("Please input quantity: ", 1, Integer.MAX_VALUE,
                    "Quantity must be greater than 0.");
            try {
                fruitManager.checkOrderable(fruit, quantity, cart.quantityOf(fruit.getId()));
            } catch (Exception e) {
                System.out.println(e.getMessage());
                continue;
            }
            cart.add(fruit, quantity);

            // Brief prints this one without a question mark and the "continue"
            // prompt with one. Copied as written; the marker diffs the screen.
            if (!Validator.getYesNo("Do you want to order now (Y/N) ")) {
                continue;
            }
            checkout(cart);
            return;
        }
    }

    /** The buyer's table: the brief's four columns, and no stock figures. */
    private void showCatalogue() {
        System.out.println(LIST_HEADER);
        for (int i = 0; i < fruitManager.size(); i++) {
            Fruit fruit = fruitManager.get(i);
            System.out.printf("%12d  %-18s %-14s %s%n", i + 1, fruit.getName(),
                    fruit.getOrigin(), Money.format(fruit.getPrice()));
        }
    }

    /** Show the receipt, take the name, deduct the stock, file the order. */
    private void checkout(Cart cart) {
        System.out.println(CART_HEADER);
        for (Item item : cart.getItems()) {
            System.out.printf(" %-16s %8d %8s %8s%n", item.getFruitName(), item.getQuantity(),
                    Money.format(item.getPrice()), Money.format(item.getAmount()));
        }
        System.out.println("Total: " + Money.format(cart.getTotal()));

        String name = Validator.getText("Input your name: ");
        try {
            // Stock first: if the shelf cannot cover the cart, nothing is filed
            // and nothing is charged.
            fruitManager.checkout(cart);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println("Your order has been cancelled.");
            return;
        }
        orderManager.place(name, cart);
        System.out.println("Thank you " + name + ", your order has been saved.");
    }
}
'''

MAIN = '''package ui;

import bo.FruitManager;
import bo.OrderManager;
import controller.ShopController;
import utils.Validator;

/**
 * The menu and the screen, and nothing else.
 *
 * The two managers are built here, once, and handed to the controller. Making
 * them static fields of the controller would work and would also mean there can
 * only ever be one shop - the sort of decision that is free to take and
 * expensive to undo.
 */
public class Main {

    public static void main(String[] args) {
        FruitManager fruitManager = new FruitManager();
        OrderManager orderManager = new OrderManager();
        ShopController controller = new ShopController(fruitManager, orderManager);

        boolean running = true;
        while (running) {
            // A blank line before every menu. When stdin is a file rather than
            // a person, prompts and answers run together; the separator is what
            // keeps the transcript readable.
            System.out.println();
            System.out.println("FRUIT SHOP SYSTEM");
            System.out.println("1. Create Fruit");
            System.out.println("2. View orders");
            System.out.println("3. Shopping (for buyer)");
            System.out.println("4. Exit");
            System.out.println("(Please choose 1 to create product, 2 to view order, "
                    + "3 for shopping, 4 to Exit program).");

            int choice = Validator.getInt("Your choice: ", 1, 4, "Please choose from 1 to 4.");
            switch (choice) {
                case 1:
                    controller.createFruit();
                    break;
                case 2:
                    controller.viewOrders();
                    break;
                case 3:
                    controller.shopping();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }
}
'''


# RUN 0 — the shop's first day, from an empty catalogue.
#
# Every line is a keystroke a marker would type. The awkward ones are
# deliberate: a repeated fruit id, a price of 0, a quantity of 0 and of -2, an
# order of 99 out of a shelf of 5, and an order of 8 Coconut AFTER three have
# already been sold - which is how the stock deduction is proved rather than
# assumed.
RUN0_IN = '''1
F001
Coconut
2
10
Vietnam
Y
F001
F002
Orange
3
5
US
Y
F003
Apple
0
4
2
Thailand
N
3
1
0
-2
3
N
2
99
2
2
Y
Marry Carie
2
3
1
8
1
7
Y
John Smith
2
4
'''

# RUN 1 — a SECOND process in the same working directory.
#
# Nothing is created before the first two screens, so everything they show came
# off the disk: both of yesterday's customers, and a Coconut shelf that is empty
# because yesterday's 3 + 7 were really deducted. Then Marry Carie shops again
# under the same name, which is the Hashtable's key collision, on purpose.
RUN1_IN = '''2
3
1
1
3
2
Y
Marry Carie
2
1
F004
Grape
6
4
France
N
3
0
abc
9
4
'''


# The real console, captured from the runs above and pasted back unchanged.
RUN0_OUT = '''
FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: Fruit ID: Fruit name: Price: Quantity: Origin: Fruit F001 has been created.
Do you want to continue (Y/N)? Fruit ID: Fruit ID F001 already exists.
Fruit ID: Fruit name: Price: Quantity: Origin: Fruit F002 has been created.
Do you want to continue (Y/N)? Fruit ID: Fruit name: Price: Price must be greater than 0.
Price: Quantity: Origin: Fruit F003 has been created.
Do you want to continue (Y/N)? List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ | ++ Quantity ++ |
           1  Coconut            Vietnam        2$            10
           2  Orange             US             3$            5
           3  Apple              Thailand       4$            2

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
Please choose item (0 to return to main screen): You selected: Coconut
Please input quantity: Quantity must be greater than 0.
Please input quantity: Quantity must be greater than 0.
Please input quantity: Do you want to order now (Y/N) List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
Please choose item (0 to return to main screen): You selected: Orange
Please input quantity: Only 5 Orange left in stock.
List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
Please choose item (0 to return to main screen): You selected: Orange
Please input quantity: Do you want to order now (Y/N)  Product | Quantity | Price | Amount
 Coconut                 3       2$       6$
 Orange                  2       3$       6$
Total: 12$
Input your name: Thank you Marry Carie, your order has been saved.

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: Customer: Marry Carie
Product | Quantity | Price | Amount
1. Coconut                 3       2$       6$
2. Orange                  2       3$       6$
Total: 12$

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
Please choose item (0 to return to main screen): You selected: Coconut
Please input quantity: Only 7 Coconut left in stock.
List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
Please choose item (0 to return to main screen): You selected: Coconut
Please input quantity: Do you want to order now (Y/N)  Product | Quantity | Price | Amount
 Coconut                 7       2$      14$
Total: 14$
Input your name: Thank you John Smith, your order has been saved.

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: Customer: Marry Carie
Product | Quantity | Price | Amount
1. Coconut                 3       2$       6$
2. Orange                  2       3$       6$
Total: 12$
Customer: John Smith
Product | Quantity | Price | Amount
1. Coconut                 7       2$      14$
Total: 14$

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: Goodbye.'''

RUN1_OUT = '''
FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: Customer: Marry Carie
Product | Quantity | Price | Amount
1. Coconut                 3       2$       6$
2. Orange                  2       3$       6$
Total: 12$
Customer: John Smith
Product | Quantity | Price | Amount
1. Coconut                 7       2$      14$
Total: 14$

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
Please choose item (0 to return to main screen): You selected: Coconut
Please input quantity: Coconut is out of stock.
List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
Please choose item (0 to return to main screen): You selected: Apple
Please input quantity: Do you want to order now (Y/N)  Product | Quantity | Price | Amount
 Apple                   2       4$       8$
Total: 8$
Input your name: Thank you Marry Carie, your order has been saved.

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: Customer: Marry Carie
Product | Quantity | Price | Amount
1. Coconut                 3       2$       6$
2. Orange                  2       3$       6$
3. Apple                   2       4$       8$
Total: 20$
Customer: John Smith
Product | Quantity | Price | Amount
1. Coconut                 7       2$      14$
Total: 14$

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: Fruit ID: Fruit name: Price: Quantity: Origin: Fruit F004 has been created.
Do you want to continue (Y/N)? List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ | ++ Quantity ++ |
           1  Coconut            Vietnam        2$            0
           2  Orange             US             3$            3
           3  Apple              Thailand       4$            0
           4  Grape              France         6$            4

FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1  Coconut            Vietnam        2$
           2  Orange             US             3$
           3  Apple              Thailand       4$
           4  Grape              France         6$
Please choose item (0 to return to main screen): 
FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit
(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program).
Your choice: You must input a number.
Your choice: Please choose from 1 to 4.
Your choice: Goodbye.'''

solution(
    'J1.L.P0023',
    title_vi='Quản lý cửa hàng hoa quả (sản phẩm và mua hàng)',
    files=[('src/entity/Fruit.java', FRUIT),
           ('src/entity/Item.java', ITEM),
           ('src/entity/Cart.java', CART),
           ('src/bo/FruitManager.java', FRUIT_MANAGER),
           ('src/bo/OrderManager.java', ORDER_MANAGER),
           ('src/controller/ShopController.java', CONTROLLER),
           ('src/utils/Money.java', MONEY),
           ('src/utils/Validator.java', VALIDATOR),
           ('src/ui/Main.java', MAIN)],
    main_class='ui.Main',
    runs=[(RUN0_IN, RUN0_OUT), (RUN1_IN, RUN1_OUT)],
    explain_en='''<p><strong>There are three things in this program, not one.</strong> A catalogue that
the owner fills in, a cart that exists for the length of one shopping trip, and an order book that
outlives everything. They have different lifetimes and different owners, and almost every wrong answer
to this assignment comes from mashing two of them together — most often by storing "how many are being
bought" on the Fruit itself, which works until a second customer walks in. Nine files across
<code>entity</code> / <code>bo</code> / <code>controller</code> / <code>utils</code> / <code>ui</code>:
this is the ≥7-file band, and the controller earns its place because the shopping loop is a small state
machine (pick, quantity, confirm or continue, name) that has no business sitting inside the menu
switch.</p>
<p><strong>Why <code>Cart</code> is a class and not an <code>ArrayList&lt;Item&gt;</code>.</strong> The
brief's own guideline writes <code>hashTable.set(&lt;customer name&gt;, &lt;list of items bought&gt;)</code>,
and a bare list compiles perfectly. The problem is that a bare list has no opinion about its contents.
Order Coconut twice and you get two Coconut lines; the total is still right, but the receipt is wrong,
and the question the stock check depends on — "how many Coconut has this customer <em>already</em> put
in?" — has to be written out by hand at every call site, which means it will be written differently at
one of them. Giving that question one home (<code>quantityOf</code>), next to <code>add</code> and
<code>getTotal</code>, is the whole difference. The ArrayList the brief asks for is still there; it is
just no longer everybody's problem.</p>
<p><strong>An <code>Item</code> holds a copy of the price, not a reference to the
<code>Fruit</code>.</strong> That looks like duplication and it is the point. The owner can raise the
price of Mango tomorrow, and yesterday's receipts must still show what the customer actually paid. Hold
a reference and the entire order history quietly rewrites itself the moment a price changes — a bug
nobody notices until an accountant does. The fruit <em>id</em> is copied as well, because that is what
stock is deducted against: two fruits can share a name, they cannot share an id.</p>
<p><strong>The Hashtable throws away the one thing the report needs.</strong> The brief requires
<code>Hashtable&lt;customer, cart&gt;</code>, and a hash table has no order — it returns keys in bucket
order, which is a function of the hash of the strings and has nothing to do with who shopped first. But
the brief's own expected screen shows Marry Carie above John Smith precisely because that is the order
they bought in. So an <code>ArrayList&lt;String&gt;</code> of names is kept beside the table: the
Hashtable answers "what did this customer buy?" in one step, the ArrayList answers "in what order did
they arrive?", and neither can do the other's job. <code>viewOrders()</code> iterates the list and looks
each name up — print straight from the table and the report reshuffles itself the day a customer called
Zoe lands in an earlier bucket than Anna. (Two smaller Hashtable facts worth knowing at the defence: it
is synchronized, which you are paying for and not using, and unlike <code>HashMap</code> it throws on a
null key or value — which is another reason the name is validated as non-empty before it ever reaches
<code>place()</code>.)</p>
<p><strong>The key is a name, and that is a real modelling flaw — own it.</strong> Two different people
called John Smith are one customer to this program. The brief says to key by name, so the program keys
by name; given that, the least bad behaviour on a collision is to <strong>merge</strong>, so a returning
customer's second visit is added to their history. Overwriting would silently delete an order that was
really placed and really paid for, and losing a sale is worse than conflating two shoppers. Run 1 does
exactly this on purpose: Marry Carie shops a second time and her order grows from two lines to three,
total 12$ → 20$. In real code the key would be a customer id and the name would be an attribute.</p>
<p><strong>Stock is the interesting rule, and it has two halves.</strong> Nothing is deducted from the
shelf when an item goes into the cart — a cart that has not been paid for is a wish, and a shop that
decrements on every wish loses its stock to people who changed their mind. Instead the cart holds the
reservation: the check is <code>fruit.getQuantity() - cart.quantityOf(id)</code>, so the shelf of ten
Coconut with three already in the cart offers seven. Without that second term the shop cheerfully sells
eleven out of ten — an order of six then an order of five, each of which looks fine on its own. The
deduction happens once, in <code>FruitManager.checkout()</code>, and it re-checks <em>every</em> line
before it writes <em>any</em> line; deducting as it goes would leave the shelf half-updated when line
three turns out to be impossible.</p>
<p><strong>What the runs actually prove about stock.</strong> Ordering 0 and −2 are both refused with
<code>Quantity must be greater than 0.</code> and the prompt comes back. Ordering 99 Orange out of a
shelf of 5 gives <code>Only 5 Orange left in stock.</code> Then — and this is the part that cannot be
faked — after Marry buys 3 Coconut, John asking for 8 is told <code>Only 7 Coconut left in stock.</code>
The 7 is arithmetic the program did on its own state. In run 1, a brand-new process, Coconut answers
<code>Coconut is out of stock.</code>, because 3 + 7 really did leave the shelf at zero.</p>
<p><strong>Money: the brief says <code>double</code>, and here is what that costs.</strong> The expected
screens print <code>2$</code> and <code>6$</code>, so the price is a real number formatted for display,
and <code>double</code> is what the brief's arithmetic implies. Fine — but say the rest out loud at the
defence, because it is the one place this assignment teaches a habit that is wrong outside it. Java
prints <code>0.1 + 0.2</code> as <code>0.30000000000000004</code>. In shop terms: a receipt for three
fruits at 1.15$ plus two at 2.30$ comes to <code>8.049999999999999</code>, so
<code>total == 8.05</code> is <strong>false</strong> — a cash drawer that checks for exact payment
rejects the exact payment. Accumulate that order a thousand times and the takings read
<code>3449.999999999945</code>, five hundredths of a nanodollar short of 3450, and the drift only grows.
The same thousand orders in integer minor units come to <code>345000</code> cents, exactly, every time.
Real money code therefore uses <code>BigDecimal</code> (with an explicit
<code>RoundingMode</code>) or a <code>long</code> of cents, and never <code>==</code> on a total. What
saves the screen here is only that Java's <code>%.2f</code> happens to round
<code>3.4499999999999997</code> back up to <code>3.45</code> — display luck, not correctness.</p>
<p><strong>Why there is a <code>Money</code> class for six lines of code.</strong> The brief prints
<code>2$</code>, not <code>2.00$</code> and not <code>2.0$</code>. Plain <code>%.2f</code> would diff
against every line of the expected screen; plain string concatenation would print
<code>6.300000000000001$</code> the first time somebody sells three fruits at 2.10$ (that is a measured
figure, not a worry). So: round to two decimals — that is the shop's real precision — then drop trailing
zeros and a stranded decimal point. 2.0 → <code>2$</code>, 1.5 → <code>1.5$</code>, 1.25 →
<code>1.25$</code>. One method, one place to change when the shop starts trading in đồng.</p>
<p><strong>The data files, and the only honest way to prove they work.</strong> The brief does not ask
for persistence; a shop that forgets its stock overnight is not a shop, so each manager owns a plain
pipe-delimited text file (<code>fruits.txt</code>, <code>orders.txt</code>). Pipe-delimited text rather
than serialization, because the owner can open it and fix a typo, and because a
<code>.dat</code> of serialized objects stops loading the day a field is added to <code>Fruit</code>.
<code>Validator.getText()</code> refuses <code>|</code> at the keyboard, so no value can ever break the
format — cheaper than escaping on the way out and un-escaping on the way back. The class that holds the
collection saves it, because it is the only class that knows when the collection changed. And the proof
is not that the file exists: <strong>run 1 is a second JVM in the same directory</strong>, and its first
two screens — both customers, and a Coconut shelf at 0 — are drawn entirely from disk before anything
new is created.</p>
<p><strong>Where the brief contradicts itself.</strong> Four places, all copied as printed rather than
tidied, because the marker diffs each screen against its own picture. (1) The confirmation table's
header is <code>&nbsp;Product | Quantity | Price | Amount</code> with a <em>leading space</em>; the View
orders header has none. (2) View orders numbers its rows <code>1.</code>, <code>2.</code>; the
confirmation table does not. (3) <code>Do you want to continue (Y/N)?</code> has a question mark;
<code>Do you want to order now (Y/N)</code> does not. (4) The main-screen list renders as items 2–5 on
the sheet while the sentence under it says to press 1 to 4 — that one is a numbering accident in the
document, and the sentence is the instruction, so the menu is 1–4. There is also a gap rather than a
contradiction: the shopping loop as described has <em>no exit</em> except answering Y, which would trap
a customer who changed their mind about everything. Item <code>0</code> leaves, and because stock is
only deducted at checkout, leaving costs the shop nothing.</p>
<p><strong>How it was verified.</strong> Two scripted runs in one working directory, in order. Run 0
builds the shop from nothing and takes the abuse: a duplicate fruit id, a price of 0, a quantity of 0
and −2, an order larger than the shelf, an order abandoned with N and resumed, then two complete
purchases. Run 1 starts a fresh JVM in the same directory and re-reads everything, refuses the
sold-out Coconut, files a second order under an existing name to show the merge, adds a fruit, backs out
of shopping with 0, and finishes with a non-numeric menu choice and an out-of-range one. Both consoles
are diffed character for character against the transcripts recorded here; nothing in them was written
by hand.</p>
<p><strong>What an examiner asks.</strong> "Where is stock deducted, and why not earlier?" — at
checkout, because a cart is not a sale, and the reservation lives in the cart. "What happens if two
customers have the same name?" — they merge, and here is why that is the least bad answer to a key the
brief chose. "Your Hashtable has no order; why is the report in the right one?" — because the order of
purchase is kept in an ArrayList beside it. "Why is <code>Item</code> not just a reference to
<code>Fruit</code>?" — because a receipt records what was paid, not what is currently charged. Have the
0.1 + 0.2 figure ready for the money question; it turns a shrug into an answer.</p>''',
    explain_vi='''<p><strong>Chương trình này có ba thứ, không phải một.</strong> Một danh mục hàng do chủ
shop nhập, một giỏ hàng chỉ sống đúng một lượt mua, và một sổ đơn hàng tồn tại lâu hơn tất cả. Chúng có
vòng đời khác nhau và chủ sở hữu khác nhau, và gần như mọi lời giải sai đều đến từ việc gộp hai trong ba
thứ đó lại — hay gặp nhất là nhét "đang mua bao nhiêu" vào chính đối tượng Fruit, chạy ngon cho tới khi
có khách thứ hai. Chín tệp trong <code>entity</code> / <code>bo</code> / <code>controller</code> /
<code>utils</code> / <code>ui</code>: đây là nhóm ≥7 tệp, và <code>controller</code> xứng đáng có mặt vì
vòng lặp mua hàng là một máy trạng thái nhỏ (chọn hàng, nhập số lượng, chốt hay mua tiếp, nhập tên) —
không việc gì phải nằm trong câu switch của thực đơn.</p>
<p><strong>Vì sao <code>Cart</code> là một lớp chứ không phải một <code>ArrayList&lt;Item&gt;</code>.</strong>
Chính phần Hướng dẫn của đề viết <code>hashTable.set(&lt;customer name&gt;, &lt;list of items bought&gt;)</code>,
và truyền một list trần thì vẫn biên dịch ngon lành. Vấn đề là list trần không có ý kiến gì về nội dung
của nó. Mua Coconut hai lần thì có hai dòng Coconut; tổng tiền vẫn đúng, nhưng hoá đơn thì sai, và câu
hỏi mà việc kiểm tồn kho phụ thuộc vào — "khách này <em>đã</em> bỏ bao nhiêu quả Coconut vào giỏ rồi?" —
phải viết tay lại ở mọi chỗ gọi, nghĩa là sẽ có một chỗ viết khác đi. Cho câu hỏi đó đúng một nơi ở
(<code>quantityOf</code>), nằm cạnh <code>add</code> và <code>getTotal</code>, chính là toàn bộ khác
biệt. Cái ArrayList mà đề yêu cầu vẫn còn nguyên; nó chỉ không còn là chuyện của tất cả mọi người
nữa.</p>
<p><strong>Một <code>Item</code> giữ bản sao của giá, không giữ tham chiếu tới
<code>Fruit</code>.</strong> Trông như trùng lặp dữ liệu, và đó chính là chủ ý. Ngày mai chủ shop tăng
giá Mango, nhưng hoá đơn hôm qua vẫn phải hiện đúng số tiền khách đã trả. Giữ tham chiếu thì toàn bộ lịch
sử đơn hàng tự viết lại lặng lẽ ngay khi giá đổi — loại lỗi không ai phát hiện ra cho tới khi kế toán
phát hiện. Mã <em>id</em> của quả cũng được sao lại, vì đó mới là thứ dùng để trừ tồn kho: hai loại quả
có thể trùng tên, nhưng không thể trùng id.</p>
<p><strong>Hashtable vứt đi đúng cái thứ mà báo cáo cần.</strong> Đề bắt dùng
<code>Hashtable&lt;tên khách, giỏ hàng&gt;</code>, mà bảng băm thì <em>không có thứ tự</em> — nó trả khoá
ra theo thứ tự bucket, tức là theo hàm băm của chuỗi, chẳng liên quan gì tới ai mua trước. Nhưng chính
màn hình mẫu của đề lại xếp Marry Carie trên John Smith, đúng vì đó là thứ tự họ mua. Vậy nên bên cạnh
bảng băm có thêm một <code>ArrayList&lt;String&gt;</code> chứa tên khách: Hashtable trả lời "khách này mua
gì?" trong một bước, ArrayList trả lời "họ đến theo thứ tự nào?", và không cái nào làm thay việc của cái
kia được. <code>viewOrders()</code> duyệt list rồi tra từng tên — in thẳng từ bảng băm thì báo cáo sẽ tự
xáo lại vào ngày có một khách tên Zoe rơi vào bucket sớm hơn Anna. (Hai chi tiết nhỏ về Hashtable nên
nhớ để bảo vệ: nó đồng bộ hoá sẵn, tức bạn đang trả giá cho một tính năng không dùng; và khác
<code>HashMap</code>, nó ném lỗi với khoá hoặc giá trị null — thêm một lý do để tên khách phải được kiểm
tra khác rỗng trước khi tới được <code>place()</code>.)</p>
<p><strong>Khoá là cái tên, và đó là một khiếm khuyết mô hình thật — hãy nhận nó.</strong> Hai người khác
nhau cùng tên John Smith, với chương trình này, là một khách. Đề bảo khoá theo tên thì chương trình khoá
theo tên; đã vậy thì cách xử lý đụng độ ít tệ nhất là <strong>gộp</strong>, để lần mua thứ hai của khách
cũ được cộng vào lịch sử của họ. Ghi đè sẽ lặng lẽ xoá mất một đơn hàng có thật và đã thanh toán thật, mà
mất một đơn hàng còn tệ hơn là nhầm hai người làm một. Lần chạy 1 làm đúng điều này một cách cố ý: Marry
Carie mua lần hai và đơn của cô ấy tăng từ hai dòng lên ba, tổng 12$ → 20$. Trong mã thật, khoá phải là
mã khách hàng, còn tên chỉ là một thuộc tính.</p>
<p><strong>Tồn kho mới là luật đáng chú ý, và nó có hai nửa.</strong> Không trừ gì khỏi kệ hàng lúc bỏ
món vào giỏ — giỏ chưa thanh toán chỉ là một nguyện vọng, và một cửa hàng trừ kho theo nguyện vọng sẽ mất
sạch hàng vào tay những người đổi ý. Thay vào đó, chính cái giỏ giữ phần đặt trước: phép kiểm là
<code>fruit.getQuantity() - cart.quantityOf(id)</code>, nên kệ có mười quả Coconut mà giỏ đã giữ ba thì
chỉ còn bán được bảy. Thiếu số hạng thứ hai đó, cửa hàng vui vẻ bán mười một quả trên kệ mười — một đơn
sáu rồi một đơn năm, mà đơn nào đứng riêng cũng hợp lệ. Việc trừ kho xảy ra đúng một lần, trong
<code>FruitManager.checkout()</code>, và nó kiểm lại <em>mọi</em> dòng trước khi ghi <em>bất kỳ</em>
dòng nào; trừ dần từng dòng sẽ để lại cái kệ cập nhật dở dang khi dòng thứ ba hoá ra không khả thi.</p>
<p><strong>Các lần chạy chứng minh được gì về tồn kho.</strong> Nhập 0 và −2 đều bị từ chối bằng
<code>Quantity must be greater than 0.</code> rồi hỏi lại. Đặt 99 quả Orange trên kệ 5 quả thì ra
<code>Only 5 Orange left in stock.</code> Rồi — và đây là phần không thể bịa — sau khi Marry mua 3
Coconut, John hỏi 8 quả thì nhận <code>Only 7 Coconut left in stock.</code> Con số 7 là phép tính chương
trình tự làm trên trạng thái của chính nó. Sang lần chạy 1, một tiến trình hoàn toàn mới, Coconut trả lời
<code>Coconut is out of stock.</code>, vì 3 + 7 thật sự đã vét cạn kệ hàng.</p>
<p><strong>Tiền: đề dùng <code>double</code>, và đây là cái giá của nó.</strong> Màn hình mẫu in
<code>2$</code> và <code>6$</code>, nên giá là số thực được định dạng lúc hiển thị, và
<code>double</code> là thứ mà phép tính của đề ngụ ý. Được thôi — nhưng hãy nói nốt phần còn lại khi bảo
vệ, vì đây là chỗ duy nhất bài này dạy một thói quen sai ở ngoài đời. Java in <code>0.1 + 0.2</code> ra
là <code>0.30000000000000004</code>. Quy về ngôn ngữ cửa hàng: hoá đơn ba quả giá 1.15$ cộng hai quả giá
2.30$ ra <code>8.049999999999999</code>, nên <code>total == 8.05</code> là <strong>false</strong> — cái
ngăn kéo tiền kiểm tra khách trả đúng số sẽ từ chối đúng số tiền đó. Cộng dồn đơn hàng ấy một nghìn lần
thì doanh thu đọc ra <code>3449.999999999945</code>, hụt 3450 một khoảng bé xíu, và sai số chỉ lớn dần.
Cũng một nghìn đơn ấy tính bằng đơn vị nguyên (xu) ra <code>345000</code> xu, chính xác, lần nào cũng
vậy. Vì thế mã tiền tệ thật dùng <code>BigDecimal</code> (kèm <code>RoundingMode</code> khai báo rõ) hoặc
một <code>long</code> đếm xu, và không bao giờ so sánh <code>==</code> trên tổng tiền. Ở đây màn hình thoát
nạn chỉ vì <code>%.2f</code> của Java tình cờ làm tròn <code>3.4499999999999997</code> lên
<code>3.45</code> — may ở khâu hiển thị, không phải đúng ở khâu tính toán.</p>
<p><strong>Vì sao có hẳn một lớp <code>Money</code> cho sáu dòng lệnh.</strong> Đề in <code>2$</code>,
không phải <code>2.00$</code> cũng không phải <code>2.0$</code>. Dùng <code>%.2f</code> trần thì lệch với
mọi dòng của màn hình mẫu; nối chuỗi trần thì sẽ in ra <code>6.300000000000001$</code> ngay lần đầu có
người bán ba quả giá 2.10$ (đây là con số đo được thật, không phải lo xa). Nên: làm tròn hai chữ số thập
phân — đó là độ chính xác thật của cửa hàng — rồi bỏ các số 0 thừa và dấu chấm bơ vơ. 2.0 →
<code>2$</code>, 1.5 → <code>1.5$</code>, 1.25 → <code>1.25$</code>. Một phương thức, một chỗ để sửa vào
ngày cửa hàng chuyển sang bán bằng đồng.</p>
<p><strong>Tệp dữ liệu, và cách duy nhất trung thực để chứng minh nó chạy.</strong> Đề không yêu cầu lưu
tệp; nhưng một cửa hàng quên sạch tồn kho sau mỗi đêm thì không phải cửa hàng, nên mỗi lớp quản lý tự sở
hữu một tệp văn bản phân tách bằng dấu <code>|</code> (<code>fruits.txt</code>, <code>orders.txt</code>).
Văn bản chứ không phải serialization, vì chủ shop mở ra đọc và sửa được một lỗi gõ, và vì một tệp
<code>.dat</code> chứa đối tượng đã tuần tự hoá sẽ ngừng đọc được vào ngày <code>Fruit</code> có thêm một
trường. <code>Validator.getText()</code> đã chặn ký tự <code>|</code> ngay lúc nhập, nên không giá trị nào
phá được định dạng — rẻ hơn nhiều so với thoát ký tự lúc ghi rồi giải mã lúc đọc. Lớp nào giữ tập dữ liệu
thì lớp đó ghi tệp, vì nó là lớp duy nhất biết tập dữ liệu vừa thay đổi. Và bằng chứng không phải là "tệp
có tồn tại": <strong>lần chạy 1 là một JVM thứ hai trong cùng thư mục</strong>, và hai màn hình đầu tiên
của nó — đủ cả hai khách, và kệ Coconut bằng 0 — hoàn toàn được dựng từ đĩa trước khi có bất cứ thứ gì
mới được tạo.</p>
<p><strong>Chỗ đề tự mâu thuẫn với chính nó.</strong> Bốn chỗ, đều được chép y nguyên chứ không dọn cho
đẹp, vì người chấm dò từng màn hình theo đúng ảnh của nó. (1) Dòng tiêu đề bảng xác nhận là
<code>&nbsp;Product | Quantity | Price | Amount</code> có <em>một dấu cách ở đầu</em>; tiêu đề ở màn View
orders thì không. (2) View orders đánh số dòng <code>1.</code>, <code>2.</code>; bảng xác nhận thì không.
(3) <code>Do you want to continue (Y/N)?</code> có dấu hỏi; <code>Do you want to order now (Y/N)</code>
thì không. (4) Danh sách ở màn hình chính hiển thị thành mục 2–5 trong đề, trong khi câu ngay dưới bảo
bấm 1 đến 4 — đây là lỗi đánh số của tài liệu, và câu chữ mới là chỉ dẫn, nên thực đơn đánh 1–4. Ngoài ra
còn một lỗ hổng chứ không phải mâu thuẫn: vòng lặp mua hàng như đề mô tả <em>không có lối ra</em> nào
ngoài việc trả lời Y, tức là nhốt luôn vị khách đổi ý toàn tập. Mục <code>0</code> để thoát, và vì tồn kho
chỉ bị trừ lúc thanh toán nên việc thoát ra chẳng tốn của cửa hàng đồng nào.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai lần chạy có kịch bản, trong cùng một thư mục làm việc,
theo thứ tự. Lần 0 dựng cửa hàng từ số không và hứng đủ đòn: id quả bị trùng, giá bằng 0, số lượng 0 và
−2, đơn hàng lớn hơn kệ, một đơn bị bỏ dở bằng N rồi mua tiếp, rồi hai lần mua trọn vẹn. Lần 1 khởi động
một JVM mới trong đúng thư mục đó và đọc lại tất cả, từ chối quả Coconut đã hết, ghi một đơn nữa dưới một
cái tên đã có để cho thấy phép gộp, thêm một loại quả, thoát khỏi màn mua hàng bằng 0, và kết thúc bằng
một lựa chọn thực đơn không phải số cùng một lựa chọn ngoài khoảng. Cả hai màn hình đều được so từng ký
tự với bản ghi lưu trong tệp này; không dòng nào trong đó được viết bằng tay.</p>
<p><strong>Người chấm sẽ hỏi gì.</strong> "Tồn kho bị trừ ở đâu, và tại sao không trừ sớm hơn?" — ở lúc
thanh toán, vì giỏ hàng chưa phải là một giao dịch, và phần giữ chỗ nằm trong giỏ. "Hai khách trùng tên
thì sao?" — chúng được gộp, và đây là lý do đó là câu trả lời ít tệ nhất cho cái khoá mà đề đã chọn.
"Hashtable của em không có thứ tự, sao báo cáo lại đúng thứ tự?" — vì thứ tự mua được giữ trong một
ArrayList nằm cạnh nó. "Sao <code>Item</code> không đơn giản là tham chiếu tới <code>Fruit</code>?" — vì
hoá đơn ghi lại số tiền đã trả, không phải số tiền đang niêm yết. Hãy thủ sẵn con số 0.1 + 0.2 cho câu
hỏi về tiền; nó biến một cái nhún vai thành một câu trả lời.</p>''',
    hints_en=[
        'Three lifetimes, three owners: the catalogue (ArrayList of Fruit), one trip\'s cart, and the order book. Never put "how many are being bought" on Fruit.',
        'Make the cart a class. quantityOf(fruitId) is the method that lets you refuse the 11th Coconut off a shelf of 10 before anything is deducted.',
        'Deduct stock at confirmation, not when an item goes in the cart — and re-check every line before you write any line.',
        'An Item copies the name and price; it must not reference the Fruit, or old receipts change when the owner changes a price.',
        'Hashtable has no order. Keep an ArrayList of customer names beside it so View orders lists people in the order they bought.',
        'Format money in one place: %.2f then strip trailing zeros, so 2.0 prints as "2$" like the brief and 2.10 * 3 never prints as 6.300000000000001$.',
    ],
    hints_vi=[
        'Ba vòng đời, ba chủ sở hữu: danh mục hàng (ArrayList các Fruit), giỏ hàng của một lượt mua, và sổ đơn hàng. Đừng bao giờ nhét "đang mua bao nhiêu" vào Fruit.',
        'Hãy làm giỏ hàng thành một lớp. quantityOf(fruitId) chính là phương thức giúp từ chối quả Coconut thứ 11 trên kệ 10 quả, trước khi trừ bất cứ thứ gì.',
        'Trừ tồn kho lúc xác nhận đơn, không phải lúc bỏ vào giỏ — và kiểm lại mọi dòng trước khi ghi bất kỳ dòng nào.',
        'Item sao chép tên và giá; tuyệt đối không tham chiếu tới Fruit, kẻo hoá đơn cũ đổi theo mỗi lần chủ shop đổi giá.',
        'Hashtable không có thứ tự. Giữ thêm một ArrayList tên khách bên cạnh để View orders liệt kê đúng thứ tự người ta đã mua.',
        'Định dạng tiền ở một chỗ duy nhất: %.2f rồi cắt số 0 thừa, để 2.0 in ra "2$" đúng như đề và 2.10 * 3 không bao giờ in ra 6.300000000000001$.',
    ],
)


# ── Vietnamese brief ─────────────────────────────────────────────
#
# The brief translated, with every string the PROGRAM prints left in English —
# the marker diffs the console against the original sheet, so a translated
# prompt is a failed diff.
VI = {
    'J1.L.P0023': '''<h3>Bối cảnh</h3>
<p>Hệ thống quản lý cửa hàng hoa quả viết bằng Java về cơ bản được xây dựng để quản lý một cửa hàng hoa
quả. Trong cửa hàng hoa quả, quản lý sản phẩm và việc mua bán là hai việc rất quan trọng. Tin học hoá hệ
thống giúp giảm công sức, làm việc hiệu quả hơn và tăng cơ hội doanh thu cho chủ cửa hàng.</p>
<h3>Đặc tả chương trình</h3>
<p>Chương trình cung cấp cho chủ cửa hàng các công cụ để vận hành công việc kinh doanh. Các chức năng như
sau:</p>
<h4>1. Màn hình chính</h4>
<pre>FRUIT SHOP SYSTEM
1. Create Fruit
2. View orders
3. Shopping (for buyer)
4. Exit</pre>
<p>(Bấm 1 để tạo sản phẩm, 2 để xem đơn hàng, 3 để mua hàng, 4 để thoát chương trình.)</p>
<h4>2. Chi tiết chức năng</h4>
<h4>2.1. Dành cho chủ cửa hàng — Tạo sản phẩm (Fruit)</h4>
<ul>
<li>Một Fruit có các thuộc tính: Fruit Id, Fruit Name, Price, Quantity và Origin.</li>
<li>Từ màn hình chính, chọn mục (1) để tạo Fruit. Sau khi tạo xong mỗi Fruit, hệ thống hiện thông báo:
<code>Do you want to continue (Y/N)?</code> Người dùng chọn Y để tạo tiếp; nếu chọn N thì chương trình
quay về màn hình chính và hiển thị toàn bộ các Fruit đã được tạo.</li>
</ul>
<h4>2.2. Xem đơn hàng (View orders)</h4>
<ul>
<li>Xem danh sách đơn hàng: ai mua và mua bao nhiêu sản phẩm.</li>
</ul>
<pre>Customer: Marry Carie
Product | Quantity | Price | Amount
1. Apple       3          1$      3$
2. Mango       2          2$      4$
Total: 7$
Customer: John Smith
Product | Quantity | Price | Amount
1. JackFruit   3          3$      9$
2. Mango       2          2$      4$
Total: 13$</pre>
<h4>2.3. Mua hàng (Shopping)</h4>
<p>Khách chọn mục 3, chương trình hiển thị toàn bộ hoa quả. Ví dụ:</p>
<pre>List of Fruit:
| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |
           1    Coconut           Vietnam         2$
           2    Orange            US              3$
           3    Apple             Thailand        4$
           4    Grape             France          6$</pre>
<p>Để đặt hàng, khách chọn Item. Ví dụ khi khách chọn mục 1, chương trình hiện:</p>
<pre>You selected: Coconut
Please input quantity:</pre>
<p>Sau khi khách nhập số lượng, chương trình hiện thông báo <code>Do you want to order now (Y/N)</code>.
Nếu khách chọn N, chương trình quay lại danh sách hoa quả để mua tiếp. Nếu chọn Y, chương trình hiển
thị:</p>
<pre> Product | Quantity | Price | Amount
 Coconut       3          2$      6$
Total: 6$
Input your name:</pre>
<p>Khách nhập tên của mình để hoàn tất việc đặt hàng. Chương trình quay về màn hình chính.</p>
<h3>Yêu cầu kỹ thuật</h3>
<ol>
<li>Viết theo phong cách lập trình hướng đối tượng.</li>
<li>Chỉ dùng các lớp và hàm lõi của Java.</li>
<li>Bắt buộc chỉ dùng <code>ArrayList</code> và <code>Hashtable</code> để lưu dữ liệu.</li>
</ol>
<h3>Hướng dẫn</h3>
<ul>
<li><strong>Slot 1 — Thiết kế mã nguồn, tạo Fruit</strong>: tạo lớp <code>Fruit</code> với các thuộc tính
Fruit Id, Fruit Name, Price, Quantity, Origin. Dùng <code>ArrayList</code> để lưu các Fruit.</li>
<li><strong>Slot 2 — Mua hàng</strong>: dùng <code>ArrayList</code> để lưu các món khách đã mua, và dùng
<code>Hashtable</code> để lưu đơn hàng của khách. Ví dụ:
<code>hashTable.set(&lt;tên khách&gt;, &lt;danh sách món đã mua&gt;)</code>.</li>
<li><strong>Slot 3 — Mua hàng</strong> (tiếp).</li>
<li><strong>Slot 4 — Xem đơn hàng</strong>.</li>
<li><strong>Slot 5 — Rà soát lại chương trình</strong>.</li>
</ul>
<p><em>Lưu ý khi làm bài:</em> mọi chuỗi chương trình in ra màn hình đều giữ nguyên tiếng Anh đúng như
đề — người chấm so từng ký tự với ảnh màn hình trong đề, nên một dòng nhắc bị dịch là một dòng sai.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
