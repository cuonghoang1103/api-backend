/**
 * codelab-seed-oop.mjs — HAND-AUTHORED, authoritative content for the Java Core
 * module "Object-Oriented Programming Fundamentals". Replaces the AI-generated
 * lesson + exercises of that ONE module with a curated, complete, beginner→
 * advanced OOP curriculum so a learner can understand OOP fundamentals 100%.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE DATA seed — reuses the admin services (createExercise / deleteExercise /
 * commitLesson) so it maintains slugs, trackId denorm and the FTS tsvector.
 * It calls NO LLM and does NOT restart anything, so it is SAFE to run while AI
 * jobs are in flight (it just writes rows). Idempotent: re-running rebuilds the
 * module's exercises from scratch (delete-all → re-create the curated 10) and
 * overwrites the lesson.
 *
 *   docker exec cuonghoangdev_backend node scripts/codelab-seed-oop.mjs --dry     # preview
 *   docker exec cuonghoangdev_backend node scripts/codelab-seed-oop.mjs --apply   # write
 *
 * IMPORTANT: run this AFTER any generic bulk regen of java-core, and do NOT let
 * the AI bulk-gen top-up this module afterwards (it is already at 10) — this is
 * the source of truth for OOP Fundamentals.
 */
import { PrismaClient } from '@prisma/client';

const { createExercise, deleteExercise } = await import('../dist/services/codeLab.service.js');
const { commitLesson } = await import('../dist/services/codeLab.lesson.service.js');

const prisma = new PrismaClient();
const ADMIN = 1;
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const TRACK_SLUG = 'java-core';
const MODULE_SLUG = 'object-oriented-programming-fundamentals';

// ── DocBlock builders (keep the lesson literal readable) ───────────
const h = (text) => ({ type: 'heading', text });
const p = (html) => ({ type: 'prose', html });
const c = (title, code) => ({ type: 'code', title, language: 'java', code });
const mm = (code) => ({ type: 'mermaid', code });
const lk = (items) => ({ type: 'links', items });

// ═══════════════════════════════════════════════════════════════════
// LESSON — a complete textbook chapter on OOP fundamentals in Java.
// ═══════════════════════════════════════════════════════════════════
const LESSON = [
  h('Introduction'),
  p('<p><strong>Object-Oriented Programming (OOP)</strong> is a way of structuring a program around <em>objects</em> — self-contained units that bundle together <strong>data</strong> (what the thing knows) and <strong>behavior</strong> (what the thing can do). Instead of a long list of functions operating on loose variables, you model your problem as a set of collaborating objects, each responsible for its own data.</p>'),
  p('<p>OOP rests on <strong>four pillars</strong>: <strong>Encapsulation</strong> (hide and protect internal state), <strong>Inheritance</strong> (build new types from existing ones), <strong>Polymorphism</strong> (one interface, many implementations), and <strong>Abstraction</strong> (expose the essentials, hide the detail). This module builds the <em>foundation</em> — classes, objects, state, constructors, encapsulation, <code>static</code> members, object identity, and immutability. Inheritance, polymorphism and interfaces are covered in depth in the next module.</p>'),
  p('<p>By the end you will be able to design a well-encapsulated class from scratch, control object initialization with constructors, decide what is shared vs per-object, correctly compare objects, and build immutable value types — the everyday building blocks of professional Java code.</p>'),
  mm('classDiagram\n  class Object\n  class Class\n  class Instance\n  Class --> Instance : new creates\n  note "A class is the blueprint. An instance is a concrete object built from it."'),

  h('Classes and Objects'),
  p('<p>A <strong>class</strong> is a blueprint. It declares what data every object of that type will hold (its <em>fields</em>) and what it can do (its <em>methods</em>). An <strong>object</strong> (or <em>instance</em>) is a concrete thing created from that blueprint with the <code>new</code> keyword. One class, many independent objects.</p>'),
  c('Defining a class', 'public class Dog {\n    // fields = the state each Dog carries\n    String name;\n    String breed;\n    int age;\n\n    // method = behavior\n    void bark() {\n        System.out.println(name + " says: Woof!");\n    }\n}'),
  c('Creating and using objects', 'Dog max = new Dog();      // a brand-new Dog object\nmax.name = "Max";\nmax.breed = "Labrador";\nmax.age = 3;\n\nDog buddy = new Dog();     // a SECOND, independent object\nbuddy.name = "Buddy";\n\nmax.bark();                // => Max says: Woof!\nbuddy.bark();              // => Buddy says: Woof!\n// max and buddy have SEPARATE state; changing one never affects the other.'),
  p('<p>Each object keeps its own copy of the fields. <code>max</code> and <code>buddy</code> are two distinct objects in memory — they share the <em>class</em> (the blueprint) but not the <em>data</em>.</p>'),

  h('Instance Variables and State'),
  p('<p><strong>Instance variables</strong> (fields) are declared in the class but outside any method. Every object gets its own set. If you do not assign them, Java gives them <em>default values</em>: <code>0</code> for numbers, <code>false</code> for <code>boolean</code>, and <strong><code>null</code> for object references</strong> (including <code>String</code>).</p>'),
  c('Default field values', 'public class Account {\n    int balance;        // defaults to 0\n    boolean active;     // defaults to false\n    String owner;       // defaults to null  <-- danger\n}\n\nAccount a = new Account();\nSystem.out.println(a.balance);          // => 0\nSystem.out.println(a.active);           // => false\nSystem.out.println(a.owner);            // => null\nSystem.out.println(a.owner.length());   // NullPointerException!'),
  p('<p><strong>Common mistake:</strong> assuming a <code>String</code> field starts as <code>""</code>. It starts as <code>null</code>, and calling a method on it throws a <code>NullPointerException</code>. Initialize your fields explicitly — usually in a constructor.</p>'),

  h('Methods and the this Keyword'),
  p('<p>The keyword <code>this</code> is a reference to <em>the current object</em> — the one the method is running on. Its two main uses are: (1) disambiguating a field from a parameter of the same name, and (2) calling one constructor from another (<code>this(...)</code>, shown below).</p>'),
  c('this resolves a name clash', 'public class Circle {\n    double radius;\n\n    void setRadius(double radius) {\n        // parameter "radius" shadows the field; this.radius picks the field\n        this.radius = radius;\n    }\n\n    double area() {\n        return Math.PI * this.radius * this.radius;\n    }\n}'),

  h('Constructors: Initializing Objects'),
  p('<p>A <strong>constructor</strong> runs when you use <code>new</code>. It has the same name as the class and no return type, and its job is to put the object into a valid initial state. If you write none, Java supplies an empty <em>default constructor</em>; the moment you write your own, that free one disappears.</p>'),
  c('A parameterized constructor', 'public class Student {\n    String name;\n    int gradeLevel;\n\n    Student(String name, int gradeLevel) {\n        this.name = name;\n        this.gradeLevel = gradeLevel;\n    }\n}\n\nStudent s = new Student("Ana", 10);   // fully initialized, no null fields'),
  p('<p><strong>Constructor overloading</strong> means providing several constructors with different parameter lists. Java picks the right one by the arguments you pass. Use <code>this(...)</code> to <em>chain</em> them so the real work lives in one place — it must be the first statement.</p>'),
  c('Overloading + chaining with this()', 'public class Book {\n    String title;\n    String author;\n    int year;\n\n    Book(String title, String author, int year) {\n        this.title = title;\n        this.author = author;\n        this.year = year;\n    }\n\n    // "unknown year" convenience constructor delegates to the main one\n    Book(String title, String author) {\n        this(title, author, -1);\n    }\n}'),

  h('Access Modifiers'),
  p('<p>Access modifiers control <em>who</em> can see a member. From most open to most closed:</p><ul><li><code>public</code> — everyone.</li><li><code>protected</code> — same package and subclasses.</li><li><em>(no modifier)</em> — package-private: same package only.</li><li><code>private</code> — the declaring class only.</li></ul><p>The professional default is: fields <code>private</code>, expose behavior through <code>public</code> methods. That is the mechanism behind encapsulation.</p>'),

  h('Encapsulation: Protecting Your Data'),
  p('<p><strong>Encapsulation</strong> — the first pillar — means keeping fields <code>private</code> and exposing controlled access through <strong>getters</strong> and <strong>setters</strong>. This lets a class <em>guard its invariants</em>: a setter can reject invalid values, so an object can never be put into a broken state from the outside.</p>'),
  mm('classDiagram\n  class BankAccount {\n    -double balance\n    +getBalance() double\n    +deposit(double amount)\n    +withdraw(double amount)\n  }\n  note "balance is private. The only way in is through validated methods."'),
  c('Encapsulation with validation', 'public class BankAccount {\n    private double balance;   // no one can set this directly\n\n    public double getBalance() {\n        return balance;\n    }\n\n    public void deposit(double amount) {\n        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");\n        balance += amount;\n    }\n\n    public void withdraw(double amount) {\n        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");\n        if (amount > balance) throw new IllegalStateException("insufficient funds");\n        balance -= amount;\n    }\n}'),
  p('<p>Because the field is private, you are free to change <em>how</em> balance is stored later (cents as a <code>long</code>, a database, add logging) without breaking any caller — they only ever touched the methods. That freedom is the whole point of encapsulation.</p>'),

  h('Static Members: Shared by the Class'),
  p('<p>A <code>static</code> member belongs to the <strong>class itself</strong>, not to any one object — there is exactly one copy, shared by all instances. Use it for values that are the same for every object (a constant), for counters/ID generators shared across instances, and for utility or <em>factory</em> methods that do not need an instance.</p>'),
  c('Static field, counter, and factory method', 'public class Employee {\n    private static int nextId = 1;      // ONE counter shared by all employees\n    public static final String COMPANY = "Acme"; // shared constant\n\n    private final int id;\n    private final String name;\n\n    private Employee(int id, String name) {  // private: force use of the factory\n        this.id = id;\n        this.name = name;\n    }\n\n    // static FACTORY method: assigns the next id automatically\n    public static Employee hire(String name) {\n        return new Employee(nextId++, name);\n    }\n\n    public int getId() { return id; }\n}\n\nEmployee a = Employee.hire("Ana");   // id 1\nEmployee b = Employee.hire("Bo");    // id 2\nSystem.out.println(a.getId() + ", " + b.getId());   // => 1, 2\nSystem.out.println(Employee.COMPANY);                // => Acme (called on the CLASS)'),
  p('<p><strong>Rule of thumb:</strong> if a method does not read or write any instance field, it can be <code>static</code>. Access static members through the class name (<code>Employee.COMPANY</code>), not through an object.</p>'),

  h('Object Identity: equals, hashCode and toString'),
  p('<p>Every class inherits three methods from <code>Object</code> that you should usually override for <em>value</em> types:</p><ul><li><code>toString()</code> — a readable description (used when you print the object).</li><li><code>equals()</code> — logical equality. By default <code>==</code> and <code>equals</code> compare <em>references</em> (same object in memory). For values you want "same contents = equal".</li><li><code>hashCode()</code> — an int consistent with <code>equals</code>, required so the object works correctly as a <code>HashMap</code> key or in a <code>HashSet</code>.</li></ul><p><strong>The contract:</strong> if two objects are <code>equals</code>, they MUST have the same <code>hashCode</code>. Always override the two together.</p>'),
  c('Overriding all three on a value type', 'import java.util.Objects;\n\npublic final class Money {\n    private final long cents;\n    private final String currency;\n\n    public Money(long cents, String currency) {\n        this.cents = cents;\n        this.currency = currency;\n    }\n\n    @Override public String toString() {\n        return String.format("%.2f %s", cents / 100.0, currency);\n    }\n\n    @Override public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Money)) return false;\n        Money m = (Money) o;\n        return cents == m.cents && currency.equals(m.currency);\n    }\n\n    @Override public int hashCode() {\n        return Objects.hash(cents, currency);\n    }\n}\n\nMoney a = new Money(500, "USD");\nMoney b = new Money(500, "USD");\nSystem.out.println(a == b);        // => false (two different objects)\nSystem.out.println(a.equals(b));   // => true  (same value)\nSystem.out.println(a);             // => 5.00 USD'),

  h('Immutability and final'),
  p('<p>An <strong>immutable</strong> object cannot change after construction. The recipe: make the class <code>final</code>, make every field <code>private final</code>, set them only in the constructor, and provide no setters (return a <em>new</em> object for a "change"). Immutable objects are simpler to reason about and inherently thread-safe — <code>String</code>, <code>Integer</code> and <code>LocalDate</code> all work this way.</p>'),
  c('An immutable value type', 'public final class Point {\n    private final int x;\n    private final int y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    public int getX() { return x; }\n    public int getY() { return y; }\n\n    // "changing" returns a NEW Point; the original is untouched\n    public Point withX(int newX) {\n        return new Point(newX, this.y);\n    }\n}'),

  h('Composition over Inheritance'),
  p('<p>Objects relate in two ways: <strong>is-a</strong> (inheritance, next module) and <strong>has-a</strong> (<em>composition</em> — an object holds other objects and delegates to them). Composition is usually the more flexible choice: a <code>Car</code> <em>has an</em> <code>Engine</code> rather than <em>being</em> one.</p>'),
  c('Composition and delegation', 'public class Engine {\n    public void start() { System.out.println("Engine started"); }\n}\n\npublic class Car {\n    private final Engine engine = new Engine();   // Car HAS-A Engine\n\n    public void start() {\n        engine.start();          // delegate to the part it owns\n        System.out.println("Car ready");\n    }\n}'),

  h('Modern Java: record and enum'),
  p('<p>A <code>record</code> (Java 16+) is a concise, immutable value type: the compiler generates the constructor, getters, <code>equals</code>, <code>hashCode</code> and <code>toString</code> for you. It is the modern way to write the <code>Money</code>/<code>Point</code> classes above.</p>'),
  c('A record', 'public record Money(long cents, String currency) {}\n\nMoney a = new Money(500, "USD");\nMoney b = new Money(500, "USD");\nSystem.out.println(a.equals(b));   // => true  (auto-generated)\nSystem.out.println(a.cents());     // => 500  (auto getter)\nSystem.out.println(a);             // => Money[cents=500, currency=USD]'),
  p('<p>An <code>enum</code> is a special class with a fixed set of instances. Enums can have fields, constructors and methods — they are full objects, not just names.</p>'),
  c('An enum with state and behavior', 'public enum Planet {\n    EARTH(5.976e24, 6.37814e6),\n    MARS(6.421e23, 3.3972e6);\n\n    private final double mass;\n    private final double radius;\n\n    Planet(double mass, double radius) {\n        this.mass = mass;\n        this.radius = radius;\n    }\n\n    public double gravity() {\n        return 6.67300E-11 * mass / (radius * radius);\n    }\n}\n\nSystem.out.printf("%.2f%n", Planet.EARTH.gravity());   // => 9.80'),

  h('Common Mistakes and Gotchas'),
  p('<ul><li><strong>NullPointerException from uninitialized fields</strong> — object/String fields default to <code>null</code>; initialize in a constructor.</li><li><strong>Confusing static and instance</strong> — a static field is shared by ALL objects; changing it affects everyone. Do not make per-object data static.</li><li><strong>Overriding equals but not hashCode</strong> — breaks <code>HashMap</code>/<code>HashSet</code>. Always override both.</li><li><strong>Comparing objects with ==</strong> — that tests reference identity, not value; use <code>equals</code> (and <code>.equals</code> for <code>String</code>!).</li><li><strong>Leaking mutable state</strong> — returning a reference to an internal mutable object (e.g. a <code>List</code>) lets callers modify your private state; return a copy or an unmodifiable view.</li></ul>'),

  h('Best Practices and Summary'),
  p('<p><strong>Design principles:</strong> give each class one clear responsibility; keep fields <code>private</code> and expose intent through methods; validate in constructors and setters so an object is never in an invalid state; prefer immutability for value types; prefer composition over inheritance.</p>'),
  p('<p><strong>Key takeaways:</strong> a class is a blueprint, an object is an instance; each object owns its instance state; constructors guarantee a valid starting state; <code>static</code> means shared-by-the-class; override <code>equals</code>+<code>hashCode</code>+<code>toString</code> for value types; <code>final</code> fields + no setters give you immutable, thread-safe objects.</p>'),
  lk([
    { label: 'Oracle Java Tutorials — Classes and Objects', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/', note: 'Official primer on classes, objects, constructors.' },
    { label: 'Object.equals / hashCode contract', url: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Object.html', note: 'The exact contract you must honor.' },
    { label: 'Records (JEP 395)', url: 'https://docs.oracle.com/en/java/javase/17/language/records.html', note: 'Modern immutable value types.' },
    { label: 'Enum types', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html', note: 'Enums as full classes.' },
  ]),
];

// ═══════════════════════════════════════════════════════════════════
// EXERCISES — exactly 10, difficulty ramp EASY→HARD, one distinct
// OOP-fundamentals sub-topic each. Every field is hand-written.
// ═══════════════════════════════════════════════════════════════════
const EXERCISES = [
  // ── 1. EASY — classes, fields, constructor, toString ──────────────
  {
    title: 'Model a 2D Point Class',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['class definition', 'instance fields', 'constructor', 'toString', 'instance methods'],
    prerequisites: ['basic Java syntax', 'variables and types'],
    tags: ['oop', 'class', 'constructor', 'tostring'],
    problemHtml:
      '<p>Create a class <code>Point</code> that models a point in 2D space. This is your first real class — a blueprint with its own state and behavior.</p>' +
      '<p>Your <code>Point</code> class must have:</p>' +
      '<ul>' +
      '<li>Two <code>private int</code> fields: <code>x</code> and <code>y</code>.</li>' +
      '<li>A constructor <code>Point(int x, int y)</code> that initializes both fields (use <code>this</code> to resolve the name clash).</li>' +
      '<li>Getters <code>int getX()</code> and <code>int getY()</code>.</li>' +
      '<li><code>String toString()</code> returning the point as <code>(x, y)</code> — e.g. <code>(3, 4)</code>.</li>' +
      '<li><code>double distanceTo(Point other)</code> returning the Euclidean distance to another point.</li>' +
      '</ul>' +
      '<p>The <code>main</code> method is provided — it reads four integers and uses your class.</p>',
    inputSpec: 'Four integers separated by whitespace: x1 y1 x2 y2.',
    outputSpec: 'Line 1: the first point via toString. Line 2: the second point. Line 3: "Distance: D" where D is the distance formatted to exactly 2 decimals.',
    constraints: '-1000 <= each coordinate <= 1000. Use Math.sqrt or Math.hypot for the distance.',
    examplesJson: [
      { input: '0 0 3 4', output: '(0, 0)\n(3, 4)\nDistance: 5.00', explanation: 'sqrt(3^2 + 4^2) = 5.00.' },
      { input: '1 1 1 1', output: '(1, 1)\n(1, 1)\nDistance: 0.00', explanation: 'Same point, distance 0.' },
    ],
    hintsJson: [
      'Declare the fields as private int x, y; inside the class.',
      'In the constructor, write this.x = x; because the parameter has the same name as the field.',
      'toString can use String.format("(%d, %d)", x, y) or simple concatenation.',
      'distanceTo: double dx = x - other.x; double dy = y - other.y; return Math.sqrt(dx*dx + dy*dy);',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Point {\n    // TODO: private int fields x and y\n\n    // TODO: constructor Point(int x, int y)\n\n    // TODO: getX(), getY()\n\n    // TODO: toString() -> "(x, y)"\n\n    // TODO: distanceTo(Point other) -> Euclidean distance\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Point p1 = new Point(sc.nextInt(), sc.nextInt());\n        Point p2 = new Point(sc.nextInt(), sc.nextInt());\n        System.out.println(p1);\n        System.out.println(p2);\n        System.out.printf("Distance: %.2f%n", p1.distanceTo(p2));\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Point {\n    private int x;\n    private int y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    public int getX() { return x; }\n    public int getY() { return y; }\n\n    @Override\n    public String toString() {\n        return "(" + x + ", " + y + ")";\n    }\n\n    public double distanceTo(Point other) {\n        int dx = x - other.x;\n        int dy = y - other.y;\n        return Math.sqrt(dx * dx + dy * dy);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Point p1 = new Point(sc.nextInt(), sc.nextInt());\n        Point p2 = new Point(sc.nextInt(), sc.nextInt());\n        System.out.println(p1);\n        System.out.println(p2);\n        System.out.printf("Distance: %.2f%n", p1.distanceTo(p2));\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>The fields are <code>private</code> because state should be encapsulated even in a simple class. In the constructor, <code>this.x</code> refers to the field while <code>x</code> alone refers to the parameter. Because <code>distanceTo</code> is a method <em>of</em> <code>Point</code>, it can read <code>other.x</code> directly — a class can access the private fields of another object of the same class. <code>toString</code> is called automatically by <code>System.out.println(p1)</code>.</p>',
    diagramMermaid: 'classDiagram\n  class Point {\n    -int x\n    -int y\n    +getX() int\n    +getY() int\n    +toString() String\n    +distanceTo(Point other) double\n  }',
  },
  // ── 2. EASY — instance state + methods ────────────────────────────
  {
    title: 'Build a Rectangle With Behavior',
    difficulty: 'EASY',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['instance fields', 'instance methods', 'object state', 'derived values'],
    prerequisites: ['class definition', 'constructor'],
    tags: ['oop', 'class', 'methods', 'state'],
    problemHtml:
      '<p>Create a class <code>Rectangle</code> that stores a width and a height and can compute things about itself. This exercise is about giving an object useful <em>behavior</em>, not just data.</p>' +
      '<p><code>Rectangle</code> must have:</p>' +
      '<ul>' +
      '<li><code>private double width</code> and <code>private double height</code>.</li>' +
      '<li>A constructor <code>Rectangle(double width, double height)</code>.</li>' +
      '<li><code>double area()</code> — width times height.</li>' +
      '<li><code>double perimeter()</code> — 2 times (width plus height).</li>' +
      '<li><code>boolean isSquare()</code> — true when width equals height.</li>' +
      '<li><code>void scale(double factor)</code> — multiply BOTH width and height by factor (this MUTATES the object).</li>' +
      '</ul>' +
      '<p>The provided <code>main</code> reads the dimensions and a scale factor.</p>',
    inputSpec: 'Three numbers: width, height, factor (doubles), whitespace-separated.',
    outputSpec: 'Line 1: "Area: A" (2 decimals). Line 2: "Perimeter: P" (2 decimals). Line 3: "Square: true|false". Line 4 after scaling: "Scaled area: A2" (2 decimals).',
    constraints: '0 < width, height <= 1e6. 0 < factor <= 1000.',
    examplesJson: [
      { input: '4 4 2', output: 'Area: 16.00\nPerimeter: 16.00\nSquare: true\nScaled area: 64.00', explanation: '4x4 is a square; scaling by 2 makes it 8x8 with area 64.' },
      { input: '3 5 1.5', output: 'Area: 15.00\nPerimeter: 16.00\nSquare: false\nScaled area: 33.75', explanation: 'After scaling: 4.5 x 7.5 = 33.75.' },
    ],
    hintsJson: [
      'area() and perimeter() do not take parameters — they read the object\'s own fields.',
      'isSquare() can just return width == height;',
      'scale(factor) changes the fields: width *= factor; height *= factor; so later calls see the new size.',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Rectangle {\n    // TODO: private double width, height\n    // TODO: constructor\n    // TODO: area(), perimeter(), isSquare(), scale(double factor)\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Rectangle r = new Rectangle(sc.nextDouble(), sc.nextDouble());\n        double factor = sc.nextDouble();\n        System.out.printf("Area: %.2f%n", r.area());\n        System.out.printf("Perimeter: %.2f%n", r.perimeter());\n        System.out.println("Square: " + r.isSquare());\n        r.scale(factor);\n        System.out.printf("Scaled area: %.2f%n", r.area());\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Rectangle {\n    private double width;\n    private double height;\n\n    public Rectangle(double width, double height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public double area() { return width * height; }\n\n    public double perimeter() { return 2 * (width + height); }\n\n    public boolean isSquare() { return width == height; }\n\n    public void scale(double factor) {\n        width *= factor;\n        height *= factor;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Rectangle r = new Rectangle(sc.nextDouble(), sc.nextDouble());\n        double factor = sc.nextDouble();\n        System.out.printf("Area: %.2f%n", r.area());\n        System.out.printf("Perimeter: %.2f%n", r.perimeter());\n        System.out.println("Square: " + r.isSquare());\n        r.scale(factor);\n        System.out.printf("Scaled area: %.2f%n", r.area());\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>Notice how <code>area()</code> and <code>perimeter()</code> take no arguments — they operate on the object\'s own <code>width</code> and <code>height</code>. That is the essence of an <em>instance method</em>: behavior tied to a specific object\'s state. <code>scale()</code> mutates the fields, so the second <code>area()</code> call after scaling returns the new value. If you wanted an immutable rectangle, <code>scale</code> would instead return a <em>new</em> <code>Rectangle</code> (see the immutability exercise).</p>',
    diagramMermaid: 'classDiagram\n  class Rectangle {\n    -double width\n    -double height\n    +area() double\n    +perimeter() double\n    +isSquare() boolean\n    +scale(double factor) void\n  }',
  },
  // ── 3. MEDIUM — constructor overloading + this() chaining ─────────
  {
    title: 'Overload Constructors for a Book Catalog Entry',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['constructor overloading', 'constructor chaining with this()', 'default values', 'this keyword'],
    prerequisites: ['constructor', 'instance fields'],
    tags: ['oop', 'constructor', 'overloading', 'this'],
    problemHtml:
      '<p>Build a <code>Book</code> class that supports being created in three different ways, using <strong>constructor overloading</strong> and <strong>chaining with <code>this()</code></strong> so the real initialization lives in exactly one place.</p>' +
      '<p><code>Book</code> fields (all <code>private</code>): <code>String title</code>, <code>String author</code>, <code>int year</code>, <code>int copies</code>.</p>' +
      '<p>Provide three constructors:</p>' +
      '<ul>' +
      '<li><code>Book(String title, String author, int year, int copies)</code> — the full one; all others must delegate to it via <code>this(...)</code>.</li>' +
      '<li><code>Book(String title, String author, int year)</code> — defaults <code>copies</code> to <code>1</code>.</li>' +
      '<li><code>Book(String title, String author)</code> — defaults <code>year</code> to <code>-1</code> (unknown) and <code>copies</code> to <code>1</code>.</li>' +
      '</ul>' +
      '<p>Also add <code>String describe()</code> returning <code>"TITLE by AUTHOR (YEAR) x COPIES"</code>, and when the year is <code>-1</code> print <code>Unknown</code> instead of the number.</p>',
    inputSpec: 'Three lines, each describing one book to create:\n1) title|author|year|copies\n2) title|author|year\n3) title|author\n(Fields are separated by a pipe "|".)',
    outputSpec: 'For each of the three books, one line: its describe() output.',
    constraints: 'Every constructor except the full one MUST call this(...) as its first statement (do not duplicate the assignments). copies >= 1.',
    examplesJson: [
      { input: 'Dune|Herbert|1965|3\nSapiens|Harari|2011\nBeowulf|Unknown', output: 'Dune by Herbert (1965) x 3\nSapiens by Harari (2011) x 1\nBeowulf by Unknown (Unknown) x 1', explanation: 'Second book defaults copies to 1; third defaults year to -1 (shown as Unknown) and copies to 1.' },
    ],
    hintsJson: [
      'Write the 4-argument constructor first with the actual this.field = ... assignments.',
      'The 3-argument constructor body is just: this(title, author, year, 1);',
      'The 2-argument constructor body is just: this(title, author, -1, 1);',
      'this(...) MUST be the first line of the constructor — nothing can come before it.',
      'In describe(), use (year == -1 ? "Unknown" : String.valueOf(year)).',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Book {\n    private String title;\n    private String author;\n    private int year;\n    private int copies;\n\n    // TODO: full constructor (title, author, year, copies)\n\n    // TODO: 3-arg constructor -> this(title, author, year, 1)\n\n    // TODO: 2-arg constructor -> this(title, author, -1, 1)\n\n    // TODO: String describe()\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] a = sc.nextLine().split("\\\\|");\n        String[] b = sc.nextLine().split("\\\\|");\n        String[] c = sc.nextLine().split("\\\\|");\n        Book b1 = new Book(a[0], a[1], Integer.parseInt(a[2]), Integer.parseInt(a[3]));\n        Book b2 = new Book(b[0], b[1], Integer.parseInt(b[2]));\n        Book b3 = new Book(c[0], c[1]);\n        System.out.println(b1.describe());\n        System.out.println(b2.describe());\n        System.out.println(b3.describe());\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Book {\n    private String title;\n    private String author;\n    private int year;\n    private int copies;\n\n    public Book(String title, String author, int year, int copies) {\n        this.title = title;\n        this.author = author;\n        this.year = year;\n        this.copies = copies;\n    }\n\n    public Book(String title, String author, int year) {\n        this(title, author, year, 1);\n    }\n\n    public Book(String title, String author) {\n        this(title, author, -1, 1);\n    }\n\n    public String describe() {\n        String y = (year == -1) ? "Unknown" : String.valueOf(year);\n        return title + " by " + author + " (" + y + ") x " + copies;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] a = sc.nextLine().split("\\\\|");\n        String[] b = sc.nextLine().split("\\\\|");\n        String[] c = sc.nextLine().split("\\\\|");\n        Book b1 = new Book(a[0], a[1], Integer.parseInt(a[2]), Integer.parseInt(a[3]));\n        Book b2 = new Book(b[0], b[1], Integer.parseInt(b[2]));\n        Book b3 = new Book(c[0], c[1]);\n        System.out.println(b1.describe());\n        System.out.println(b2.describe());\n        System.out.println(b3.describe());\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>Only the four-argument constructor assigns fields; the others <em>delegate</em> to it with <code>this(...)</code>. This is <strong>constructor chaining</strong> — it removes duplicated assignment code and guarantees every <code>Book</code>, however it was created, goes through the same single initialization path. If you later add validation, you add it in one place. Note that <code>this(...)</code> must be the very first statement in a constructor; the compiler enforces it.</p>',
    diagramMermaid: 'flowchart TD\n  A[Book title author] --> C[full constructor]\n  B[Book title author year] --> C\n  D[Book title author year copies] --> C\n  C --> E[fields initialized once]',
  },
  // ── 4. MEDIUM — encapsulation + validated invariants ──────────────
  {
    title: 'Enforce Invariants With an Encapsulated Bank Account',
    difficulty: 'MEDIUM',
    estimatedMinutes: 40,
    points: 30,
    concepts: ['encapsulation', 'private fields', 'validation in methods', 'protecting invariants', 'access modifiers'],
    prerequisites: ['constructor', 'instance methods'],
    tags: ['oop', 'encapsulation', 'validation'],
    problemHtml:
      '<p>Model a <code>BankAccount</code> that can <strong>never</strong> be put into an invalid state from the outside. This is the core value of <strong>encapsulation</strong>: the balance is private, and the only ways to change it are validated methods.</p>' +
      '<p>Requirements:</p>' +
      '<ul>' +
      '<li><code>private double balance;</code> — no public setter, no way to assign it directly.</li>' +
      '<li>Constructor <code>BankAccount(double opening)</code>; if <code>opening &lt; 0</code>, start at <code>0</code> instead.</li>' +
      '<li><code>double getBalance()</code>.</li>' +
      '<li><code>void deposit(double amount)</code> — must throw <code>IllegalArgumentException</code> if amount is not positive.</li>' +
      '<li><code>boolean withdraw(double amount)</code> — return <code>false</code> (and change nothing) if amount is not positive OR exceeds the balance; otherwise subtract and return <code>true</code>.</li>' +
      '</ul>' +
      '<p>The provided <code>main</code> reads an opening balance then a series of commands.</p>',
    inputSpec: 'First line: the opening balance (double). Then one command per line until "END": "DEPOSIT amount", "WITHDRAW amount", or "BALANCE".',
    outputSpec: 'For DEPOSIT: print "Deposited amount" (2 decimals) or "Rejected" if it threw. For WITHDRAW: print "OK" or "Denied". For BALANCE: print the balance to 2 decimals.',
    constraints: 'A rejected deposit/withdraw must NOT change the balance. Handle the exception from deposit with try/catch in the driver (already provided).',
    examplesJson: [
      { input: '100\nDEPOSIT 50\nWITHDRAW 200\nWITHDRAW 30\nBALANCE\nEND', output: 'Deposited 50.00\nDenied\nOK\nBALANCE: 120.00', explanation: 'Deposit 50 -> 150. Withdraw 200 denied (exceeds balance). Withdraw 30 -> 120.' },
    ],
    hintsJson: [
      'Make balance private and provide NO setBalance method — that is what protects it.',
      'In the constructor: this.balance = Math.max(0, opening);',
      'deposit: if (amount <= 0) throw new IllegalArgumentException("bad amount"); else balance += amount;',
      'withdraw: return false early on bad amount or amount > balance; otherwise balance -= amount; return true;',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass BankAccount {\n    // TODO: private double balance\n    // TODO: constructor BankAccount(double opening) clamping negatives to 0\n    // TODO: getBalance()\n    // TODO: void deposit(double amount) -> throws IllegalArgumentException on <= 0\n    // TODO: boolean withdraw(double amount)\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        BankAccount acc = new BankAccount(Double.parseDouble(sc.nextLine().trim()));\n        String line;\n        while (!(line = sc.nextLine()).equals("END")) {\n            String[] t = line.split(" ");\n            if (t[0].equals("DEPOSIT")) {\n                try { acc.deposit(Double.parseDouble(t[1])); System.out.printf("Deposited %.2f%n", Double.parseDouble(t[1])); }\n                catch (IllegalArgumentException e) { System.out.println("Rejected"); }\n            } else if (t[0].equals("WITHDRAW")) {\n                System.out.println(acc.withdraw(Double.parseDouble(t[1])) ? "OK" : "Denied");\n            } else if (t[0].equals("BALANCE")) {\n                System.out.printf("BALANCE: %.2f%n", acc.getBalance());\n            }\n        }\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass BankAccount {\n    private double balance;\n\n    public BankAccount(double opening) {\n        this.balance = Math.max(0, opening);\n    }\n\n    public double getBalance() { return balance; }\n\n    public void deposit(double amount) {\n        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");\n        balance += amount;\n    }\n\n    public boolean withdraw(double amount) {\n        if (amount <= 0 || amount > balance) return false;\n        balance -= amount;\n        return true;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        BankAccount acc = new BankAccount(Double.parseDouble(sc.nextLine().trim()));\n        String line;\n        while (!(line = sc.nextLine()).equals("END")) {\n            String[] t = line.split(" ");\n            if (t[0].equals("DEPOSIT")) {\n                try { acc.deposit(Double.parseDouble(t[1])); System.out.printf("Deposited %.2f%n", Double.parseDouble(t[1])); }\n                catch (IllegalArgumentException e) { System.out.println("Rejected"); }\n            } else if (t[0].equals("WITHDRAW")) {\n                System.out.println(acc.withdraw(Double.parseDouble(t[1])) ? "OK" : "Denied");\n            } else if (t[0].equals("BALANCE")) {\n                System.out.printf("BALANCE: %.2f%n", acc.getBalance());\n            }\n        }\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>The single most important line is the one you do NOT write: there is no <code>setBalance</code>. Because <code>balance</code> is <code>private</code> and every mutation goes through <code>deposit</code>/<code>withdraw</code>, the class can <em>guarantee</em> its invariants — balance never goes negative, deposits are always positive. Callers cannot bypass the rules. This is encapsulation doing real work: the object owns and defends its state.</p>',
    diagramMermaid: 'classDiagram\n  class BankAccount {\n    -double balance\n    +getBalance() double\n    +deposit(double amount) void\n    +withdraw(double amount) boolean\n  }\n  note "No setter. balance can only change through validated methods."',
  },
  // ── 5. MEDIUM — static fields, counter, factory method ────────────
  {
    title: 'Auto-Assign IDs With Static Members',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 30,
    concepts: ['static fields', 'static vs instance', 'static factory method', 'shared class state', 'static constant'],
    prerequisites: ['constructor', 'encapsulation'],
    tags: ['oop', 'static', 'factory'],
    problemHtml:
      '<p>Build an <code>Employee</code> class that assigns each new employee a unique, auto-incrementing ID, and tracks how many employees exist — using <code>static</code> members shared across all instances.</p>' +
      '<p>Requirements:</p>' +
      '<ul>' +
      '<li><code>private static int nextId = 1;</code> — the shared counter (one copy for the whole class).</li>' +
      '<li><code>private static int count = 0;</code> — how many employees have been created.</li>' +
      '<li><code>private final int id;</code> and <code>private final String name;</code> — per-object state.</li>' +
      '<li>A <code>private</code> constructor, so objects can only be made through the factory.</li>' +
      '<li><code>public static Employee hire(String name)</code> — a <strong>static factory method</strong> that creates the employee, assigns <code>nextId++</code> as its id, increments <code>count</code>, and returns it.</li>' +
      '<li><code>int getId()</code>, <code>String getName()</code>, and <code>public static int getCount()</code>.</li>' +
      '</ul>',
    inputSpec: 'Each line is a name to hire, until a line "COUNT". Hire each name in order.',
    outputSpec: 'For every hired employee, print "id: name". After the COUNT line, print "Total: N".',
    constraints: 'IDs start at 1 and increase by 1 per hire. getCount and nextId are STATIC — accessed via the class, not an instance.',
    examplesJson: [
      { input: 'Ana\nBo\nCy\nCOUNT', output: '1: Ana\n2: Bo\n3: Cy\nTotal: 3', explanation: 'The shared nextId gives 1, 2, 3; count reaches 3.' },
    ],
    hintsJson: [
      'nextId and count are declared static — they belong to the class, so all Employees share one copy.',
      'The constructor is private; the only way to create an Employee is Employee.hire(name).',
      'Inside hire: int id = nextId++; count++; return new Employee(id, name);',
      'getCount() is static: call it as Employee.getCount(), not on an instance.',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Employee {\n    // TODO: private static int nextId = 1, count = 0\n    // TODO: private final int id; private final String name;\n    // TODO: private constructor(int id, String name)\n    // TODO: public static Employee hire(String name)\n    // TODO: getId(), getName(), static getCount()\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line;\n        while (!(line = sc.nextLine()).equals("COUNT")) {\n            Employee e = Employee.hire(line);\n            System.out.println(e.getId() + ": " + e.getName());\n        }\n        System.out.println("Total: " + Employee.getCount());\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nclass Employee {\n    private static int nextId = 1;\n    private static int count = 0;\n\n    private final int id;\n    private final String name;\n\n    private Employee(int id, String name) {\n        this.id = id;\n        this.name = name;\n    }\n\n    public static Employee hire(String name) {\n        Employee e = new Employee(nextId++, name);\n        count++;\n        return e;\n    }\n\n    public int getId() { return id; }\n    public String getName() { return name; }\n    public static int getCount() { return count; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line;\n        while (!(line = sc.nextLine()).equals("COUNT")) {\n            Employee e = Employee.hire(line);\n            System.out.println(e.getId() + ": " + e.getName());\n        }\n        System.out.println("Total: " + Employee.getCount());\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p><code>nextId</code> and <code>count</code> are <code>static</code>: there is exactly one of each for the whole class, shared by every <code>Employee</code>. That is why the IDs keep increasing across different objects — they all read and bump the same counter. The per-object <code>id</code> and <code>name</code> are <code>final</code> instance fields, unique to each employee. The <strong>static factory method</strong> <code>hire</code> centralizes creation (and the id/count bookkeeping); making the constructor <code>private</code> forces everyone to use it, so the counter can never be bypassed.</p>',
    diagramMermaid: 'classDiagram\n  class Employee {\n    -static int nextId\n    -static int count\n    -final int id\n    -final String name\n    +static hire(String name) Employee\n    +static getCount() int\n  }\n  note "static = one copy for the class. id and name = one per object."',
  },
  // ── 6. MEDIUM — equals, hashCode, toString on a value type ────────
  {
    title: 'Give a Fraction Correct Equality',
    difficulty: 'MEDIUM',
    estimatedMinutes: 40,
    points: 35,
    concepts: ['equals override', 'hashCode override', 'toString override', 'value equality vs reference equality', 'equals-hashCode contract'],
    prerequisites: ['encapsulation', 'constructor'],
    tags: ['oop', 'equals', 'hashcode', 'value-object'],
    problemHtml:
      '<p>Create an immutable <code>Fraction</code> value type where two fractions are <strong>equal when they represent the same reduced value</strong> (so <code>2/4</code> equals <code>1/2</code>). This means overriding <code>equals</code>, <code>hashCode</code> and <code>toString</code> correctly.</p>' +
      '<p>Requirements:</p>' +
      '<ul>' +
      '<li>Constructor <code>Fraction(int numerator, int denominator)</code> that <strong>reduces</strong> to lowest terms (divide both by their GCD; keep the sign on the numerator).</li>' +
      '<li><code>toString()</code> returning <code>"n/d"</code> in reduced form.</li>' +
      '<li><code>equals(Object)</code> — true when both reduced numerator and denominator match. Handle <code>null</code> and a different type safely.</li>' +
      '<li><code>hashCode()</code> — consistent with <code>equals</code> (use <code>Objects.hash(num, den)</code> on the reduced values).</li>' +
      '</ul>' +
      '<p>Because you reduce in the constructor, equal fractions automatically have equal fields, so <code>equals</code>/<code>hashCode</code> become straightforward.</p>',
    inputSpec: 'Two lines, each "numerator denominator". Build a Fraction from each.',
    outputSpec: 'Line 1: first fraction (reduced) via toString. Line 2: second fraction. Line 3: "Equal: true|false" from equals. Line 4: "SameHash: true|false" comparing the two hashCodes.',
    constraints: 'Denominator is never 0. Reduce using the greatest common divisor. If equals is true, SameHash MUST also be true (that is the contract you are implementing).',
    examplesJson: [
      { input: '2 4\n1 2', output: '1/2\n1/2\nEqual: true\nSameHash: true', explanation: '2/4 reduces to 1/2, so both are equal and share a hashCode.' },
      { input: '3 4\n2 3', output: '3/4\n2/3\nEqual: false\nSameHash: false', explanation: 'Different values.' },
    ],
    hintsJson: [
      'Write a gcd helper: while (b != 0) { int t = b; b = a % b; a = t; } return Math.abs(a);',
      'In the constructor divide numerator and denominator by the gcd so state is always canonical.',
      'equals: if (this == o) return true; if (!(o instanceof Fraction)) return false; then compare fields.',
      'hashCode: return Objects.hash(num, den); import java.util.Objects.',
      'Because you reduced in the constructor, 2/4 and 1/2 store identical fields -> equal and same hash for free.',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\nimport java.util.Objects;\n\nfinal class Fraction {\n    private final int num;\n    private final int den;\n\n    public Fraction(int numerator, int denominator) {\n        // TODO: reduce by gcd (keep sign on numerator) and assign num, den\n    }\n\n    // TODO: toString() -> "num/den"\n    // TODO: equals(Object o)\n    // TODO: hashCode()\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Fraction a = new Fraction(sc.nextInt(), sc.nextInt());\n        Fraction b = new Fraction(sc.nextInt(), sc.nextInt());\n        System.out.println(a);\n        System.out.println(b);\n        System.out.println("Equal: " + a.equals(b));\n        System.out.println("SameHash: " + (a.hashCode() == b.hashCode()));\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\nimport java.util.Objects;\n\nfinal class Fraction {\n    private final int num;\n    private final int den;\n\n    public Fraction(int numerator, int denominator) {\n        int g = gcd(Math.abs(numerator), Math.abs(denominator));\n        if (g == 0) g = 1;\n        int sign = (denominator < 0) ? -1 : 1;\n        this.num = sign * numerator / g;\n        this.den = Math.abs(denominator) / g;\n    }\n\n    private static int gcd(int a, int b) {\n        while (b != 0) { int t = b; b = a % b; a = t; }\n        return Math.abs(a);\n    }\n\n    @Override public String toString() { return num + "/" + den; }\n\n    @Override public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Fraction)) return false;\n        Fraction f = (Fraction) o;\n        return num == f.num && den == f.den;\n    }\n\n    @Override public int hashCode() { return Objects.hash(num, den); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Fraction a = new Fraction(sc.nextInt(), sc.nextInt());\n        Fraction b = new Fraction(sc.nextInt(), sc.nextInt());\n        System.out.println(a);\n        System.out.println(b);\n        System.out.println("Equal: " + a.equals(b));\n        System.out.println("SameHash: " + (a.hashCode() == b.hashCode()));\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>The trick is to make the state <em>canonical</em>: by reducing in the constructor, <code>2/4</code> and <code>1/2</code> end up with identical <code>num</code> and <code>den</code>, so field comparison in <code>equals</code> just works. The <strong>equals/hashCode contract</strong> says equal objects must return equal hash codes — <code>Objects.hash(num, den)</code> over the same reduced fields guarantees it. Without a correct <code>hashCode</code>, a <code>Fraction</code> used as a <code>HashMap</code> key or in a <code>HashSet</code> would misbehave. Always override the two together.</p>',
    diagramMermaid: 'flowchart TD\n  A[new Fraction 2 and 4] --> B[reduce by gcd]\n  B --> C[store 1 and 2]\n  D[new Fraction 1 and 2] --> C\n  C --> E[equal fields so equals true and same hashCode]',
  },
  // ── 7. MEDIUM — immutability with final fields ────────────────────
  {
    title: 'Design an Immutable Temperature Type',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 30,
    concepts: ['immutability', 'final fields', 'no setters', 'returning a new object', 'defensive design'],
    prerequisites: ['constructor', 'instance methods'],
    tags: ['oop', 'immutability', 'final', 'value-object'],
    problemHtml:
      '<p>Create an <strong>immutable</strong> <code>Temperature</code> class. Once built, a <code>Temperature</code> can never change — any "modification" returns a brand-new object, leaving the original untouched. This is how <code>String</code> and <code>LocalDate</code> work.</p>' +
      '<p>Requirements:</p>' +
      '<ul>' +
      '<li>The class is <code>final</code>, with a single <code>private final double celsius;</code> field.</li>' +
      '<li>Constructor <code>Temperature(double celsius)</code>. NO setters.</li>' +
      '<li><code>double toCelsius()</code> and <code>double toFahrenheit()</code> (C * 9/5 + 32).</li>' +
      '<li><code>Temperature warmer(double delta)</code> — returns a NEW <code>Temperature</code> that is <code>delta</code> degrees Celsius warmer; the original is unchanged.</li>' +
      '</ul>' +
      '<p>The <code>main</code> proves immutability by warming a temperature and then printing the original again.</p>',
    inputSpec: 'Two numbers: the starting Celsius value and a delta (doubles).',
    outputSpec: 'Line 1: "Original: C F" (the start, Celsius and Fahrenheit, 1 decimal each). Line 2: "Warmer: C F" (after warmer(delta)). Line 3: "Original still: C" (the ORIGINAL object again, proving it did not change).',
    constraints: 'warmer() MUST NOT modify the object it is called on — it returns a new instance. The field is final, so the compiler will help enforce this.',
    examplesJson: [
      { input: '20 5', output: 'Original: 20.0 68.0\nWarmer: 25.0 77.0\nOriginal still: 20.0', explanation: 'warmer(5) returns a new 25C object; the original 20C is unchanged.' },
    ],
    hintsJson: [
      'Declare: public final class Temperature { private final double celsius; }',
      'The field is final -> it can only be set in the constructor, never again.',
      'toFahrenheit(): return celsius * 9 / 5 + 32;',
      'warmer(delta): return new Temperature(this.celsius + delta);  // a NEW object, do not touch this one',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nfinal class Temperature {\n    private final double celsius;\n\n    public Temperature(double celsius) {\n        this.celsius = celsius;\n    }\n\n    // TODO: toCelsius(), toFahrenheit()\n    // TODO: Temperature warmer(double delta) -> returns a NEW Temperature\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Temperature t = new Temperature(sc.nextDouble());\n        double delta = sc.nextDouble();\n        System.out.printf("Original: %.1f %.1f%n", t.toCelsius(), t.toFahrenheit());\n        Temperature w = t.warmer(delta);\n        System.out.printf("Warmer: %.1f %.1f%n", w.toCelsius(), w.toFahrenheit());\n        System.out.printf("Original still: %.1f%n", t.toCelsius());\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nfinal class Temperature {\n    private final double celsius;\n\n    public Temperature(double celsius) {\n        this.celsius = celsius;\n    }\n\n    public double toCelsius() { return celsius; }\n\n    public double toFahrenheit() { return celsius * 9 / 5 + 32; }\n\n    public Temperature warmer(double delta) {\n        return new Temperature(celsius + delta);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Temperature t = new Temperature(sc.nextDouble());\n        double delta = sc.nextDouble();\n        System.out.printf("Original: %.1f %.1f%n", t.toCelsius(), t.toFahrenheit());\n        Temperature w = t.warmer(delta);\n        System.out.printf("Warmer: %.1f %.1f%n", w.toCelsius(), w.toFahrenheit());\n        System.out.printf("Original still: %.1f%n", t.toCelsius());\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>Immutability comes from three choices: the field is <code>private final</code> (set once, in the constructor), there are no setters, and <code>warmer()</code> returns a <em>new</em> object instead of mutating this one. The last line proves it — the original still reads 20C after we made a warmer copy. Immutable objects are easier to reason about (their value never surprises you), safe to share, and inherently thread-safe. This is the recommended default for value types like money, dates, and coordinates.</p>',
    diagramMermaid: 'flowchart LR\n  A[Temperature 20C] --> B[call warmer 5]\n  B --> C[NEW Temperature 25C]\n  A --> D[original still 20C unchanged]',
  },
  // ── 8. MEDIUM — composition and delegation (has-a) ────────────────
  {
    title: 'Compose a Playlist From Songs',
    difficulty: 'MEDIUM',
    estimatedMinutes: 40,
    points: 35,
    concepts: ['composition', 'has-a relationship', 'delegation', 'object collaboration', 'encapsulating a collection'],
    prerequisites: ['classes and objects', 'instance methods'],
    tags: ['oop', 'composition', 'delegation'],
    problemHtml:
      '<p>Model a <code>Playlist</code> that <strong>has</strong> a list of <code>Song</code> objects. This is <strong>composition</strong> (a has-a relationship) — the <code>Playlist</code> owns its songs and delegates work to them, rather than inheriting from anything.</p>' +
      '<p>Class <code>Song</code>:</p>' +
      '<ul><li><code>private final String title;</code> and <code>private final int seconds;</code> with a constructor and getters.</li></ul>' +
      '<p>Class <code>Playlist</code>:</p>' +
      '<ul>' +
      '<li>A <code>private final List&lt;Song&gt; songs = new ArrayList&lt;&gt;();</code> (the composition — the list is owned and private).</li>' +
      '<li><code>void add(Song s)</code>.</li>' +
      '<li><code>int totalSeconds()</code> — sum of every song\'s length (delegate to each Song\'s getter).</li>' +
      '<li><code>String longest()</code> — the title of the longest song (assume no ties).</li>' +
      '</ul>' +
      '<p>The provided <code>main</code> reads songs and builds the playlist.</p>',
    inputSpec: 'First line: N, the number of songs. Then N lines of "title seconds" (title is one word). ',
    outputSpec: 'Line 1: "Total: S" (total seconds). Line 2: "Longest: TITLE".',
    constraints: '1 <= N <= 1000. Keep the songs list private — expose only the methods. Do not use inheritance.',
    examplesJson: [
      { input: '3\nIntro 60\nSolo 245\nOutro 90', output: 'Total: 395\nLongest: Solo', explanation: '60 + 245 + 90 = 395; Solo is the longest at 245s.' },
    ],
    hintsJson: [
      'Playlist HAS-A list of Song: private final List<Song> songs = new ArrayList<>();',
      'totalSeconds loops the songs and adds up s.getSeconds() — it delegates to each Song.',
      'longest tracks the max: keep a reference to the Song with the biggest getSeconds().',
      'import java.util.List and java.util.ArrayList.',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.*;\n\nclass Song {\n    private final String title;\n    private final int seconds;\n    public Song(String title, int seconds) { this.title = title; this.seconds = seconds; }\n    public String getTitle() { return title; }\n    public int getSeconds() { return seconds; }\n}\n\nclass Playlist {\n    // TODO: private final List<Song> songs = new ArrayList<>();\n    // TODO: add(Song s)\n    // TODO: int totalSeconds()\n    // TODO: String longest()\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        Playlist pl = new Playlist();\n        for (int i = 0; i < n; i++) {\n            String[] t = sc.nextLine().split(" ");\n            pl.add(new Song(t[0], Integer.parseInt(t[1])));\n        }\n        System.out.println("Total: " + pl.totalSeconds());\n        System.out.println("Longest: " + pl.longest());\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.*;\n\nclass Song {\n    private final String title;\n    private final int seconds;\n    public Song(String title, int seconds) { this.title = title; this.seconds = seconds; }\n    public String getTitle() { return title; }\n    public int getSeconds() { return seconds; }\n}\n\nclass Playlist {\n    private final List<Song> songs = new ArrayList<>();\n\n    public void add(Song s) { songs.add(s); }\n\n    public int totalSeconds() {\n        int total = 0;\n        for (Song s : songs) total += s.getSeconds();\n        return total;\n    }\n\n    public String longest() {\n        Song best = songs.get(0);\n        for (Song s : songs) if (s.getSeconds() > best.getSeconds()) best = s;\n        return best.getTitle();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        Playlist pl = new Playlist();\n        for (int i = 0; i < n; i++) {\n            String[] t = sc.nextLine().split(" ");\n            pl.add(new Song(t[0], Integer.parseInt(t[1])));\n        }\n        System.out.println("Total: " + pl.totalSeconds());\n        System.out.println("Longest: " + pl.longest());\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p><code>Playlist</code> <em>has-a</em> list of <code>Song</code> — that is <strong>composition</strong>. It does not extend anything; it builds richer behavior by <em>owning</em> smaller objects and <strong>delegating</strong> to them (<code>totalSeconds</code> asks each <code>Song</code> for its length). Keeping the <code>songs</code> list <code>private</code> means callers cannot corrupt it directly — they must go through <code>add</code>. Composition is usually more flexible than inheritance: you can change what a <code>Playlist</code> is made of without being locked into a class hierarchy. "Favor composition over inheritance" is one of the most repeated pieces of OOP advice.</p>',
    diagramMermaid: 'classDiagram\n  class Playlist {\n    -List~Song~ songs\n    +add(Song s) void\n    +totalSeconds() int\n    +longest() String\n  }\n  class Song {\n    -String title\n    -int seconds\n  }\n  Playlist o-- Song : has many',
  },
  // ── 9. HARD — enum as a full class (fields + behavior) ────────────
  {
    title: 'Model Arithmetic Operators as an Enum',
    difficulty: 'HARD',
    estimatedMinutes: 45,
    points: 45,
    concepts: ['enum types', 'enum with fields and constructor', 'constant-specific method bodies', 'enum as a class', 'values() and valueOf'],
    prerequisites: ['classes and objects', 'methods', 'static members'],
    tags: ['oop', 'enum', 'polymorphism-lite'],
    problemHtml:
      '<p>An <code>enum</code> is a special class with a fixed set of instances — and those instances can carry data and behavior. Build an <code>Operation</code> enum that models the four arithmetic operators, each knowing its own symbol and how to apply itself.</p>' +
      '<p>Requirements for <code>enum Operation</code>:</p>' +
      '<ul>' +
      '<li>Four constants: <code>ADD</code>, <code>SUB</code>, <code>MUL</code>, <code>DIV</code>.</li>' +
      '<li>A <code>private final String symbol</code> field set through the enum constructor (<code>"+"</code>, <code>"-"</code>, <code>"*"</code>, <code>"/"</code>), with a getter.</li>' +
      '<li>An <code>public abstract double apply(double a, double b)</code>, implemented by each constant with a <strong>constant-specific method body</strong> (e.g. <code>ADD</code> returns <code>a + b</code>).</li>' +
      '<li>A <code>public static Operation fromSymbol(String s)</code> that finds the constant with that symbol (loop over <code>values()</code>).</li>' +
      '</ul>' +
      '<p>The <code>main</code> reads expressions like <code>6 * 7</code> and evaluates them.</p>',
    inputSpec: 'One expression per line as "a SYMBOL b" (a and b are doubles, SYMBOL is one of + - * /), until a line "END".',
    outputSpec: 'For each expression, print "a SYMBOL b = result" with the result to 2 decimals.',
    constraints: 'Use a constant-specific body for each operator (not one big switch). DIV inputs never divide by zero in the tests.',
    examplesJson: [
      { input: '6 * 7\n10 - 4\n9 / 2\nEND', output: '6.00 * 7.00 = 42.00\n10.00 - 4.00 = 6.00\n9.00 / 2.00 = 4.50', explanation: 'Each operator applies its own constant-specific apply().' },
    ],
    hintsJson: [
      'Enum constants can override a method: ADD("+") { public double apply(double a, double b) { return a + b; } },',
      'Declare the shared abstract method after the constants: public abstract double apply(double a, double b);',
      'The constructor stores the symbol: Operation(String symbol) { this.symbol = symbol; }',
      'fromSymbol: for (Operation o : values()) if (o.getSymbol().equals(s)) return o; then throw for unknown.',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nenum Operation {\n    // TODO: ADD("+") { ... }, SUB("-") { ... }, MUL("*") { ... }, DIV("/") { ... };\n    // TODO: private final String symbol; constructor; getSymbol();\n    // TODO: public abstract double apply(double a, double b);\n    // TODO: public static Operation fromSymbol(String s)\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line;\n        while (!(line = sc.nextLine()).equals("END")) {\n            String[] t = line.split(" ");\n            double a = Double.parseDouble(t[0]);\n            Operation op = Operation.fromSymbol(t[1]);\n            double b = Double.parseDouble(t[2]);\n            System.out.printf("%.2f %s %.2f = %.2f%n", a, op.getSymbol(), b, op.apply(a, b));\n        }\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.Scanner;\n\nenum Operation {\n    ADD("+") { public double apply(double a, double b) { return a + b; } },\n    SUB("-") { public double apply(double a, double b) { return a - b; } },\n    MUL("*") { public double apply(double a, double b) { return a * b; } },\n    DIV("/") { public double apply(double a, double b) { return a / b; } };\n\n    private final String symbol;\n\n    Operation(String symbol) { this.symbol = symbol; }\n\n    public String getSymbol() { return symbol; }\n\n    public abstract double apply(double a, double b);\n\n    public static Operation fromSymbol(String s) {\n        for (Operation o : values()) if (o.symbol.equals(s)) return o;\n        throw new IllegalArgumentException("Unknown operator: " + s);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line;\n        while (!(line = sc.nextLine()).equals("END")) {\n            String[] t = line.split(" ");\n            double a = Double.parseDouble(t[0]);\n            Operation op = Operation.fromSymbol(t[1]);\n            double b = Double.parseDouble(t[2]);\n            System.out.printf("%.2f %s %.2f = %.2f%n", a, op.getSymbol(), b, op.apply(a, b));\n        }\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>This shows an <code>enum</code> is a real class: each constant has a <code>symbol</code> field (set via the enum constructor) and its own implementation of <code>apply</code> through a <strong>constant-specific method body</strong>. Calling <code>op.apply(a, b)</code> dispatches to the right constant\'s code — a clean, type-safe alternative to a big <code>switch</code>. <code>values()</code> returns all constants, which <code>fromSymbol</code> searches. This pattern (an enum that carries behavior) is a professional favorite for modeling a fixed set of strategies.</p>',
    diagramMermaid: 'classDiagram\n  class Operation {\n    -String symbol\n    +apply(double a, double b) double\n    +getSymbol() String\n    +static fromSymbol(String s) Operation\n  }\n  note "ADD SUB MUL DIV are the fixed instances, each with its own apply."',
  },
  // ── 10. HARD — capstone: everything working together ──────────────
  {
    title: 'Capstone: Build an Encapsulated Inventory',
    difficulty: 'HARD',
    estimatedMinutes: 60,
    points: 60,
    concepts: ['encapsulation', 'immutable value object', 'equals and hashCode as a map key', 'composition', 'combining OOP fundamentals'],
    prerequisites: ['encapsulation', 'equals and hashCode', 'immutability', 'composition'],
    tags: ['oop', 'capstone', 'equals', 'hashmap', 'encapsulation'],
    problemHtml:
      '<p>Put every fundamental together. Build an <code>Inventory</code> that tracks stock quantities per product. The <code>Product</code> is an <strong>immutable value object</strong> identified by its SKU, used as a <code>HashMap</code> key — so <code>equals</code>/<code>hashCode</code> must be correct or the whole thing breaks.</p>' +
      '<p><strong>Product</strong> (immutable):</p>' +
      '<ul><li><code>final class</code>, <code>private final String sku;</code> and <code>private final String name;</code>, a constructor and getters.</li>' +
      '<li><code>equals</code>/<code>hashCode</code> based on <strong>sku only</strong> (the SKU is the identity — two entries with the same SKU are the same product).</li></ul>' +
      '<p><strong>Inventory</strong> (encapsulated):</p>' +
      '<ul>' +
      '<li><code>private final Map&lt;Product, Integer&gt; stock = new HashMap&lt;&gt;();</code> (private — the only access is via methods).</li>' +
      '<li><code>void add(Product p, int qty)</code> — add to the existing quantity (use <code>merge</code>).</li>' +
      '<li><code>boolean remove(String sku, int qty)</code> — remove qty of that SKU; return <code>false</code> and change nothing if there is not enough (or the SKU is absent).</li>' +
      '<li><code>int distinctProducts()</code> and <code>int totalUnits()</code>.</li>' +
      '</ul>',
    inputSpec: 'Commands, one per line, until "END":\n"ADD sku name qty" (name is one word),\n"REMOVE sku qty",\n"REPORT".',
    outputSpec: 'ADD prints nothing. REMOVE prints "OK" or "DENIED". REPORT prints "Distinct: D, Units: U".',
    constraints: 'Product equality is by SKU only. Removing by SKU must find the product even though you only have the SKU string (build a lookup Product, or key by SKU). A denied remove must not change any quantity.',
    examplesJson: [
      { input: 'ADD A1 Widget 10\nADD A1 Widget 5\nADD B2 Gadget 3\nREMOVE A1 4\nREMOVE B2 9\nREPORT\nEND', output: 'OK\nDENIED\nDistinct: 2, Units: 14', explanation: 'A1: 10 + 5 = 15, minus 4 = 11. B2: 3, cannot remove 9 (DENIED). Distinct 2 (A1,B2); units 11 + 3 = 14.' },
    ],
    hintsJson: [
      'Product.equals/hashCode use only sku: Objects.hash(sku), and compare sku in equals.',
      'Because equality is by sku, new Product(sku, "") is equal to the stored product and works as a map key for lookup/remove.',
      'add: stock.merge(p, qty, Integer::sum);',
      'remove: Product key = new Product(sku, ""); Integer have = stock.get(key); if (have == null || have < qty) return false; then stock.put(key, have - qty); return true;',
      'distinctProducts is stock.size(); totalUnits sums the map values.',
    ],
    starterCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.*;\n\nfinal class Product {\n    private final String sku;\n    private final String name;\n    public Product(String sku, String name) { this.sku = sku; this.name = name; }\n    public String getSku() { return sku; }\n    public String getName() { return name; }\n    // TODO: equals/hashCode based on sku ONLY\n}\n\nclass Inventory {\n    private final Map<Product, Integer> stock = new HashMap<>();\n    // TODO: add(Product p, int qty)\n    // TODO: boolean remove(String sku, int qty)\n    // TODO: int distinctProducts()\n    // TODO: int totalUnits()\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Inventory inv = new Inventory();\n        String line;\n        while (!(line = sc.nextLine()).equals("END")) {\n            String[] t = line.split(" ");\n            switch (t[0]) {\n                case "ADD": inv.add(new Product(t[1], t[2]), Integer.parseInt(t[3])); break;\n                case "REMOVE": System.out.println(inv.remove(t[1], Integer.parseInt(t[2])) ? "OK" : "DENIED"); break;\n                case "REPORT": System.out.println("Distinct: " + inv.distinctProducts() + ", Units: " + inv.totalUnits()); break;\n            }\n        }\n    }\n}' },
    ],
    solutionCodeJson: [
      { name: 'Main.java', language: 'java', code:
'import java.util.*;\n\nfinal class Product {\n    private final String sku;\n    private final String name;\n    public Product(String sku, String name) { this.sku = sku; this.name = name; }\n    public String getSku() { return sku; }\n    public String getName() { return name; }\n\n    @Override public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Product)) return false;\n        return sku.equals(((Product) o).sku);\n    }\n\n    @Override public int hashCode() { return Objects.hash(sku); }\n}\n\nclass Inventory {\n    private final Map<Product, Integer> stock = new HashMap<>();\n\n    public void add(Product p, int qty) {\n        stock.merge(p, qty, Integer::sum);\n    }\n\n    public boolean remove(String sku, int qty) {\n        Product key = new Product(sku, "");\n        Integer have = stock.get(key);\n        if (have == null || have < qty) return false;\n        stock.put(key, have - qty);\n        return true;\n    }\n\n    public int distinctProducts() { return stock.size(); }\n\n    public int totalUnits() {\n        int total = 0;\n        for (int q : stock.values()) total += q;\n        return total;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Inventory inv = new Inventory();\n        String line;\n        while (!(line = sc.nextLine()).equals("END")) {\n            String[] t = line.split(" ");\n            switch (t[0]) {\n                case "ADD": inv.add(new Product(t[1], t[2]), Integer.parseInt(t[3])); break;\n                case "REMOVE": System.out.println(inv.remove(t[1], Integer.parseInt(t[2])) ? "OK" : "DENIED"); break;\n                case "REPORT": System.out.println("Distinct: " + inv.distinctProducts() + ", Units: " + inv.totalUnits()); break;\n            }\n        }\n    }\n}' },
    ],
    solutionExplanationHtml:
      '<p>This capstone uses every fundamental at once. <code>Product</code> is an <strong>immutable value object</strong> whose identity is its SKU — so <code>equals</code>/<code>hashCode</code> use only <code>sku</code>. That is exactly what lets <code>new Product(sku, "")</code> act as a lookup key for <code>remove</code>: the map finds the stored entry because they are <code>equals</code> and share a <code>hashCode</code>. <code>Inventory</code> <strong>encapsulates</strong> a private <code>Map</code> (<strong>composition</strong>) and exposes only validated operations, so a denied removal never corrupts the quantities. If <code>Product</code> got <code>hashCode</code> wrong, the map lookups would silently fail — proof that the equals/hashCode contract is not academic, but load-bearing.</p>',
    diagramMermaid: 'classDiagram\n  class Product {\n    -String sku\n    -String name\n    +equals(Object o) boolean\n    +hashCode() int\n  }\n  class Inventory {\n    -Map~Product~Integer~ stock\n    +add(Product p, int qty) void\n    +remove(String sku, int qty) boolean\n    +totalUnits() int\n  }\n  Inventory o-- Product : keys by',
  },
];

// ═══════════════════════════════════════════════════════════════════
async function main() {
  const track = await prisma.codeTrack.findFirst({ where: { slug: TRACK_SLUG }, select: { id: true } });
  if (!track) throw new Error(`Track ${TRACK_SLUG} not found`);
  const mod = await prisma.codeModule.findFirst({ where: { trackId: track.id, slug: MODULE_SLUG }, select: { id: true, name: true } });
  if (!mod) throw new Error(`Module ${MODULE_SLUG} not found in ${TRACK_SLUG}`);

  const existing = await prisma.codeExercise.findMany({ where: { moduleId: mod.id }, select: { id: true, title: true } });
  console.log(`[oop-seed] module "${mod.name}" (id ${mod.id}) — ${existing.length} existing exercises, ${EXERCISES.length} curated to write.`);
  console.log(`[oop-seed] lesson: ${LESSON.length} blocks.`);

  if (!APPLY) {
    console.log('  ~ DRY. Would DELETE all existing exercises and CREATE:');
    EXERCISES.forEach((e, i) => console.log(`     ${i + 1}. [${e.difficulty}] ${e.title}`));
    console.log('  ~ Would overwrite the module lesson. Pass --apply to write.');
    await prisma.$disconnect();
    return;
  }

  for (const e of existing) await deleteExercise(e.id);
  console.log(`  ✓ deleted ${existing.length} old exercises`);

  let n = 0;
  for (let i = 0; i < EXERCISES.length; i++) {
    const e = EXERCISES[i];
    await createExercise({ ...e, moduleId: mod.id, language: 'java', status: 'PUBLISHED', sortOrder: i }, ADMIN);
    n++;
    console.log(`  ✓ [${e.difficulty}] ${e.title}`);
  }
  console.log(`  ✓ created ${n} curated exercises`);

  await commitLesson(ADMIN, { moduleId: mod.id, blocks: LESSON, model: 'hand-authored' });
  console.log(`  ✓ lesson committed (${LESSON.length} blocks)`);

  await prisma.$disconnect();
  console.log('[oop-seed] done.');
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
