/**
 * Spring Boot — Chương 1: ⭐ Java hiện đại (1): kiểu dữ liệu và mô hình hoá (soạn 18/11/2026, agent sb trên máy nhà).
 * GIỮ title chương + slug bài đầu của khung (seeder neo chương bằng slug bài đầu: sb-1-1-record-var).
 * Mọi output trong chương chạy thật: Java 21.0.12.1 (Temurin) trong container maven:3.9-eclipse-temurin-21,
 * Jackson 3.1.7, Node.js 22.22.2, TypeScript 5.9.3 — mã nguồn ở ~/vbg-dp/scratchpad/sb/lab/c1/ (r11…r15, lab1).
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua java()/bash()/… của _chung.mjs.
 */
import { java, bash, out, tl, giai } from './_chung.mjs';

/* ═══════════════════════════ 1.1 — Record, var và tính bất biến ═══════════════════════════ */
const MA_CLASS_CU = java(`
public final class LabClass {
    private final long id;
    private final String name;
    private final int capacity;

    public LabClass(long id, String name, int capacity) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public int getCapacity() { return capacity; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LabClass other)) return false;
        return id == other.id && capacity == other.capacity && Objects.equals(name, other.name);
    }

    @Override
    public int hashCode() { return Objects.hash(id, name, capacity); }

    @Override
    public String toString() {
        return "LabClass[id=" + id + ", name=" + name + ", capacity=" + capacity + "]";
    }
}`);
const MA_RECORD = java(`public record Lab(long id, String name, int capacity) {}`);
const OUT_JAVAP = out(`$ wc -l LabClass.java Lab.java
 32 LabClass.java
  1 Lab.java
$ javac -d out Lab.java && javap -p out/Lab.class
Compiled from "Lab.java"
public final class Lab extends java.lang.Record {
  private final long id;
  private final java.lang.String name;
  private final int capacity;
  public Lab(long, java.lang.String, int);
  public final java.lang.String toString();
  public final int hashCode();
  public final boolean equals(java.lang.Object);
  public long id();
  public java.lang.String name();
  public int capacity();
}`);
const MA_DEMO1 = java(`
public class Demo1 {
    record Lab(long id, String name, int capacity) {}

    public static void main(String[] args) {
        var a = new Lab(1, "Lab AI", 30);
        var b = new Lab(1, "Lab AI", 30);
        System.out.println(a);
        System.out.println("a.name()     = " + a.name());
        System.out.println("a == b       = " + (a == b));
        System.out.println("a.equals(b)  = " + a.equals(b));
        System.out.println("same hash    = " + (a.hashCode() == b.hashCode()));
        var bigger = new Lab(a.id(), a.name(), 40);   // "change" = make a new one
        System.out.println(bigger + " | a vẫn là " + a.capacity());
    }
}`);
const OUT_DEMO1 = out(`$ java Demo1.java
Lab[id=1, name=Lab AI, capacity=30]
a.name()     = Lab AI
a == b       = false
a.equals(b)  = true
same hash    = true
Lab[id=1, name=Lab AI, capacity=40] | a vẫn là 30`);
const MA_COMPACT = java(`
record Lab(long id, String name, int capacity) {
    Lab {                                   // compact constructor: runs BEFORE the fields are assigned
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0, got " + capacity);
        name = name.strip();                // you may normalise a parameter
    }
    Lab withCapacity(int c) { return new Lab(id, name, c); }   // a hand-written "wither"
}

record Schedule(String lab, List<String> slots) {}               // shallow: the List can still change
record SafeSchedule(String lab, List<String> slots) {
    SafeSchedule { slots = List.copyOf(slots); }                  // defensive copy
}

public static void main(String[] args) {
    System.out.println(new Lab(1, "  Lab AI  ", 30));
    System.out.println(new Lab(1, "Lab AI", 30).withCapacity(45));

    var slots = new ArrayList<>(List.of("08:00", "10:00"));
    var s = new Schedule("Lab AI", slots);
    var safe = new SafeSchedule("Lab AI", slots);
    slots.add("13:00");                     // someone edits the original list
    System.out.println("record thường: " + s.slots());
    System.out.println("record an toàn: " + safe.slots());
    try { safe.slots().add("15:00"); }
    catch (UnsupportedOperationException e) { System.out.println("safe.slots().add -> " + e); }

    new Lab(2, "Lab IoT", 0);
}`);
const OUT_COMPACT = out(`$ java Compact.java
Lab[id=1, name=Lab AI, capacity=30]
Lab[id=1, name=Lab AI, capacity=45]
record thường: [08:00, 10:00, 13:00]
record an toàn: [08:00, 10:00]
safe.slots().add -> java.lang.UnsupportedOperationException
Exception in thread "main" java.lang.IllegalArgumentException: capacity must be > 0, got 0
	at Compact$Lab.<init>(Compact.java:7)
	at Compact.main(Compact.java:31)`);
const MA_VAR = java(`
var labs = new HashMap<String, List<Integer>>();   // the full type is on the right — read it once
labs.put("Alpha", List.of(30, 36));
for (var e : labs.entrySet()) System.out.println(e.getKey() + " -> " + e.getValue());

var n = 10;          // int
var big = 10L;       // long
var list = new ArrayList<>();   // ArrayList<Object> — the element type is lost!
list.add("Lab AI"); list.add(42);
System.out.println(((Object) n).getClass().getSimpleName() + " " + ((Object) big).getClass().getSimpleName() + " " + list);`);
const OUT_VAR = out(`$ java VarDemo.java
Alpha -> [30, 36]
Integer Long [Lab AI, 42]`);
const MA_VAR_SAI = java(`
public class VarSai {
    var count = 0;                       // a field
    public static void main(String[] args) {
        var x;                           // no initializer
        var y = null;                    // null has no type
        var f = () -> 1;                 // a lambda needs a target type
    }
}`);
const OUT_VAR_SAI = out(`$ javac VarSai.java
VarSai.java:2: error: 'var' is not allowed here
    var count = 0;
    ^
1 error
$ javac VarSai.java          # after deleting the field line
VarSai.java:3: error: cannot infer type for local variable x
  (cannot use 'var' on variable without initializer)
VarSai.java:4: error: cannot infer type for local variable y
  (variable initializer is 'null')
VarSai.java:5: error: cannot infer type for local variable f
  (lambda expression needs an explicit target-type)
3 errors`);
const MA_KE_THUA = java(`
public class KeThua {
    record Lab(long id, String name) {}
    static class LabProxy extends Lab {               // what Hibernate/Spring proxies need to do
        LabProxy() { super(0, null); }
    }
    record Booking(long id) {
        private String note;                          // an extra instance field
    }
}`);
const OUT_KE_THUA = out(`$ javac KeThua.java
KeThua.java:7: error: field declaration must be static
        private String note;
                       ^
  (consider replacing field with record component)
1 error
$ javac KeThua.java          # after deleting the note line
KeThua.java:3: error: cannot inherit from final Lab
    static class LabProxy extends Lab {
                                  ^
1 error`);
const MA_JSON = java(`
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.json.JsonMapper;

public class JsonDemo {
    // The "entity with setters" many student projects bind straight from the request
    public static class User {
        private String name; private boolean admin;
        public String getName() { return name; }       public void setName(String n) { name = n; }
        public boolean isAdmin() { return admin; }     public void setAdmin(boolean a) { admin = a; }
    }
    // A record DTO: exactly the fields a client is allowed to send
    public record SignupRequest(String name) {}
    public record Lab(long id, String name, int capacity) {}

    public static void main(String[] args) {
        var json = JsonMapper.builder()
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)   // same as Spring Boot's default
                .build();
        System.out.println(json.writeValueAsString(new Lab(1, "Lab AI", 30)));
        System.out.println(json.readValue("""
                {"id":2,"name":"Lab IoT","capacity":24}""", Lab.class));

        String body = """
                {"name":"Minh","admin":true}""";                              // the attacker adds one field
        User u = json.readValue(body, User.class);
        System.out.println("User.admin sau khi bind  = " + u.isAdmin());
        SignupRequest r = json.readValue(body, SignupRequest.class);
        System.out.println("SignupRequest            = " + r);
    }
}`);
const OUT_JSON = out(`$ java -cp jackson-databind-3.1.7.jar:jackson-core-3.1.7.jar:jackson-annotations-2.21.jar JsonDemo.java
{"id":1,"name":"Lab AI","capacity":30}
Lab[id=2, name=Lab IoT, capacity=24]
User.admin sau khi bind  = true
SignupRequest            = SignupRequest[name=Minh]`);
const OUT_FREEZE = out(`$ node freeze.mjs        # Node.js 22.22.2
TypeError: Cannot assign to read only property 'name' of object '#<Object>'
{ id: 1, name: 'Lab AI', slots: [ '08:00', '10:00' ] }
{ id: 1, name: 'Lab AI', slots: [ '08:00', '10:00' ], capacity: 40 } true`);

const L11_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Records, var and immutability</h2>
<p class="lead">Almost every Spring Boot class you write that is not a controller, service or repository is a small bag of data: a request body, a response, an event, a row from a query. Java 16 gave that bag its own keyword — <strong>record</strong> — and this lesson shows what it generates, where it is the right tool (DTOs, values, events), where it is the wrong one (JPA entities), and why "an object that never changes" is the cheapest bug-prevention you will ever buy.</p>

<h3>The problem: 32 lines to say "a lab has an id, a name and a capacity"</h3>
<p>Before records, a correct value class in Java looked like this. Every field appears five times, and every time you add a field you must remember to update <code>equals</code>, <code>hashCode</code> and <code>toString</code> — forget one and you get the bugs of lesson 1.5.</p>
${MA_CLASS_CU}
<p>The same thing as a record is one line:</p>
${MA_RECORD}
<p>The compiler does not just "save typing" — it generates real members. <code>javap</code> (the class-file disassembler that ships with the JDK) shows exactly what is inside:</p>
${OUT_JAVAP}
<div class="kv-grid">
  <div class="kv"><span class="k">final class … extends java.lang.Record</span><span class="v">A record cannot be extended and cannot extend another class (it may implement interfaces).</span></div>
  <div class="kv"><span class="k">private final fields</span><span class="v">One per component. Assigned once in the constructor, never again.</span></div>
  <div class="kv"><span class="k">Canonical constructor</span><span class="v"><code>Lab(long, String, int)</code> — takes every component, in order.</span></div>
  <div class="kv"><span class="k">Accessors <code>id()</code>, <code>name()</code></span><span class="v">No <code>get</code> prefix. Jackson 3, Spring and JPA projections all understand this naming.</span></div>
  <div class="kv"><span class="k">equals / hashCode / toString</span><span class="v">Based on <em>all</em> components — two records with the same data are equal.</span></div>
</div>

<h3>Value semantics, measured</h3>
${MA_DEMO1}
${OUT_DEMO1}
<p>Two separate objects (<code>a == b</code> is false) are still <em>equal</em> because their data is equal — that is what "value" means. And there is no <code>setCapacity</code>: to "change" a record you build a new one. The old one is untouched, so any other code still holding <code>a</code> keeps seeing 30.</p>

<h3>Compact constructors: validate once, at the door</h3>
<p>A record may declare a <strong>compact constructor</strong> — no parameter list, no field assignments. It runs before the fields are set, so it is the single place to reject bad data or normalise it. A <em>wither</em> method (<code>withCapacity</code>) returns a modified copy.</p>
${MA_COMPACT}
${OUT_COMPACT}
<div class="pitfall"><p><strong>Trap — records are only <em>shallowly</em> immutable.</strong> The field <code>slots</code> is final, but it points at an <code>ArrayList</code> that anyone holding the original list can still edit — the output shows <code>13:00</code> appearing inside a "final" record. Fix it in the compact constructor with <code>List.copyOf</code> (or <code>Set.copyOf</code>, <code>Map.copyOf</code>): you get an unmodifiable copy, and later attempts to <code>add</code> throw.</p></div>

<h3>var: local type inference (Java 10)</h3>
<p><code>var</code> lets the compiler infer the type of a <strong>local variable</strong> from its initializer. It is still static typing — the variable has exactly one type, fixed at compile time; you just do not write it twice.</p>
${MA_VAR}
${OUT_VAR}
<p>Two lessons from that output. <code>var big = 10L</code> is a <code>long</code>, not an <code>int</code> — the literal decides. And <code>var list = new ArrayList&lt;&gt;()</code> silently becomes <code>ArrayList&lt;Object&gt;</code>: the diamond has nothing to infer from, so the list happily accepts both a string and the number 42. Write <code>new ArrayList&lt;String&gt;()</code> when you use <code>var</code>.</p>
<p>Where <code>var</code> is <em>not</em> allowed — the compiler messages, from a real run:</p>
${MA_VAR_SAI}
${OUT_VAR_SAI}
<div class="callout"><strong>Team rule of thumb.</strong> Use <code>var</code> when the right-hand side already names the type (<code>new</code>, a factory like <code>List.of</code>, a cast) or in a <code>for</code> loop over entries. Avoid it when the right-hand side is a method whose return type a reader cannot guess: <code>var result = service.process(x);</code> hides information in a code review.</div>

<h3>Why immutability matters for a backend</h3>
<ul>
  <li><strong>Threads.</strong> A Spring Boot server handles each request on its own thread (Tomcat starts with up to 200; Chapter 2). An object nobody can change can be shared between all of them with no locks. The Java Memory Model also guarantees that once a constructor finishes, every thread sees the correct values of its <code>final</code> fields (JLS §17.5).</li>
  <li><strong>Hash keys.</strong> If an object is a key in a <code>HashMap</code>/<code>HashSet</code> and then changes, the map loses it (lesson 1.5 shows it happening). A record whose components are immutable cannot do that.</li>
  <li><strong>Reasoning.</strong> When a method receives a record, you know it cannot be modified behind your back by the caller — no defensive copies everywhere.</li>
  <li><strong>Caching.</strong> Chapter 13 stores objects in Redis; an immutable value can be cached and shared safely.</li>
</ul>

<h3>Where records go in a Spring Boot project — and where they don't</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Request/response DTOs</span><span class="v"><code>record CreateBookingRequest(long labId, LocalDate date, …)</code> — Jackson binds JSON into the canonical constructor; Bean Validation annotations go on the components (Chapter 5).</span></div>
  <div class="kv"><span class="k">✅ Query projections</span><span class="v"><code>record LabSummary(String name, long bookings)</code> as the result of a JPQL/JDBC query (Chapter 6).</span></div>
  <div class="kv"><span class="k">✅ Events, config, value objects</span><span class="v"><code>record BookingApproved(long id, Instant at)</code>; <code>@ConfigurationProperties</code> records (Chapter 3); <code>TimeSlot</code>, <code>Money</code>.</span></div>
  <div class="kv"><span class="k">❌ JPA entities</span><span class="v">Hibernate needs a no-argument constructor, mutable fields (it fills them after loading and changes them on dirty checking) and the ability to <em>subclass</em> your entity to build lazy-loading proxies. A record is final, has no no-arg constructor and cannot change.</span></div>
</div>
<p>The proxy rule is not theory — try to subclass a record and the compiler refuses, and it also refuses extra instance fields:</p>
${MA_KE_THUA}
${OUT_KE_THUA}

<h3>Records and JSON: Jackson 3 (the version inside Spring Boot 4)</h3>
<p>Spring Boot 4 ships Jackson 3, whose packages moved from <code>com.fasterxml.jackson</code> to <code>tools.jackson</code>. It reads and writes records with no annotations at all:</p>
${MA_JSON}
${OUT_JSON}
<div class="callout warn"><strong>🕵️ Hacker's corner — mass assignment.</strong> The last two lines are the reason serious teams never bind a request straight into an entity. The body contained one extra field, <code>"admin":true</code>; the class with a <code>setAdmin</code> setter obediently set it. On <strong>4 March 2012</strong>, Egor Homakov used exactly this class of bug in GitHub (a Ruby on Rails app) to add his own public key to the <code>rails</code> organisation and push a commit to the Rails repository, to prove the point after his report was dismissed. GitHub fixed it the same day and Rails changed its defaults (strong parameters). <strong>How to defend:</strong> (1) a record DTO per endpoint containing only the fields a client may set; (2) map DTO → entity by hand in the service; (3) never put role, owner, price or status in a create/update DTO. Chapter 10 attacks a LabFlow endpoint this way and fixes it.</div>

<h3>Compared with Node.js / TypeScript</h3>
<p>JavaScript has no value type with generated equality: two object literals with the same content are never <code>===</code>. <code>Object.freeze</code> is shallow — exactly like a record holding a mutable list — and TypeScript's <code>readonly</code> exists only at compile time. A real run:</p>
${OUT_FREEZE}
<p>So in an interview: "A Java record is like a frozen TypeScript object type with structural <code>equals</code>/<code>hashCode</code> generated for you — and its immutability is enforced by the compiler <em>and</em> at run time, not just by the type checker."</p>

<h3>Everyday picture</h3>
<p>A record is a printed receipt: it states the facts at one moment, and if something changes you get a new receipt instead of someone scribbling on the old one. Two receipts with the same items and total are the same receipt for accounting purposes, even if they are two pieces of paper. An entity is the customer's loyalty card: one identity that lives for years and whose points change every week.</p>

<h3>On the job</h3>
<p>In a code review at a Vietnamese outsourcing company, a reviewer will flag a 60-line Lombok-free DTO class with "use a record". They will also flag the opposite: an <code>@Entity record</code> that compiles but fails at start-up. If your team is still on Java 11 (some banks are), records are not available — Lombok's <code>@Value</code> is the older equivalent, and you will recognise it after this lesson.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What does a record generate, and what can't it do?"</strong> — Private final fields, a canonical constructor, accessors without <code>get</code>, and <code>equals</code>/<code>hashCode</code>/<code>toString</code> over all components. It is final, cannot extend a class, cannot declare extra instance fields; it may implement interfaces, add methods, static fields and a compact constructor.</li>
  <li><strong>"Can a record be a JPA entity?"</strong> — No: JPA needs a no-arg constructor, mutable state and subclassable classes for lazy proxies. Use records for DTOs and projections, a normal class for the entity.</li>
  <li><strong>"Is a record immutable?"</strong> — Shallowly. Its fields cannot be reassigned, but a component that is a mutable object (a list) can still change; copy it with <code>List.copyOf</code> in the compact constructor.</li>
  <li><strong>"Does <code>var</code> make Java dynamically typed?"</strong> — No. The type is inferred once at compile time and never changes; it only works for local variables with an initializer.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write <code>record TimeSlot(LocalDate date, LocalTime start, LocalTime end)</code> whose compact constructor rejects <code>start</code> not before <code>end</code> and times outside 07:00–21:00.</li>
  <li>Add <code>boolean overlaps(TimeSlot other)</code>. 08:00–10:00 and 10:00–12:00 must <em>not</em> overlap; 08:00–10:00 and 09:30–11:00 must.</li>
  <li>Write <code>record Room(String name, List&lt;String&gt; equipment)</code> and prove, with a small <code>main</code>, that without a defensive copy the equipment can change from outside — then fix it.</li>
  <li>Run <code>javap -p</code> on your <code>TimeSlot</code> class and find the method you wrote among the generated ones.</li>
</ol>
<p><strong>Done when:</strong> your <code>main</code> prints <code>false</code> for the touching slots and <code>true</code> for the overlapping ones, and <code>Room</code> throws <code>UnsupportedOperationException</code> when someone tries to add equipment.</p></div>
${giai('Show one solution', `${java(`
record TimeSlot(LocalDate date, LocalTime start, LocalTime end) {
    static final LocalTime OPEN = LocalTime.of(7, 0), CLOSE = LocalTime.of(21, 0);
    TimeSlot {
        if (!start.isBefore(end)) throw new IllegalArgumentException("start must be before end");
        if (start.isBefore(OPEN) || end.isAfter(CLOSE)) throw new IllegalArgumentException("labs open 07:00–21:00");
    }
    boolean overlaps(TimeSlot o) { return date.equals(o.date) && start.isBefore(o.end) && o.start.isBefore(end); }
}
record Room(String name, List<String> equipment) {
    Room { equipment = List.copyOf(equipment); }
}`)}
<p>The overlap test is the classic interval rule: two half-open intervals [a, b) and [c, d) overlap exactly when <code>a &lt; d</code> and <code>c &lt; b</code>. Using strict "before" makes touching slots legal. This same <code>TimeSlot</code> is used in the Chapter 1 lab (lesson 1.6), where the test suite checks exactly these cases.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Record</span><span class="v">A final, shallowly immutable data class whose constructor, accessors, equals, hashCode and toString are generated from its components (Java 16, JEP 395).</span></div>
  <div class="kv"><span class="k">Component</span><span class="v">One entry in the record header, e.g. <code>int capacity</code>; becomes a private final field plus an accessor.</span></div>
  <div class="kv"><span class="k">Compact constructor</span><span class="v">A constructor without a parameter list that validates or normalises the components before they are assigned.</span></div>
  <div class="kv"><span class="k">Value semantics</span><span class="v">Equality by content, not by identity.</span></div>
  <div class="kv"><span class="k">Defensive copy</span><span class="v">Copying a mutable argument (e.g. <code>List.copyOf</code>) so outside code cannot change your object's state.</span></div>
  <div class="kv"><span class="k">var</span><span class="v">Local-variable type inference (Java 10, JEP 286): the static type is taken from the initializer.</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data Transfer Object — the shape of data crossing a boundary (HTTP, queue), separate from the entity.</span></div>
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Binding every field of a request into an object, letting a client set fields it should not (role, owner, price).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A record turns 32 lines of value class into one, and the compiler generates the members you saw with <code>javap</code>.</li>
  <li>Validate in the compact constructor; "change" a record by creating a new one; copy mutable components.</li>
  <li><code>var</code> is static typing with less repetition — local variables only, and beware the diamond <code>new ArrayList&lt;&gt;()</code>.</li>
  <li>Records for DTOs, projections, events and config; normal classes for JPA entities.</li>
  <li>A record DTO with only the allowed fields is your first defence against mass assignment.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://openjdk.org/jeps/395', '📄', 'JEP 395: Records', 'The design goals and the exact rules for components, constructors and accessors.')}
${tl('https://openjdk.org/jeps/286', '📄', 'JEP 286: Local-Variable Type Inference', 'Why var is limited to local variables, and the style guide that came with it.')}

<h3>Sources</h3>
<ul>
  <li>Java Language Specification 21, §8.10 Record Classes and §17.5 final Field Semantics: <a href="https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10" target="_blank" rel="noopener">docs.oracle.com/javase/specs/jls/se21</a></li>
  <li>Egor Homakov's GitHub mass-assignment incident (4 March 2012) and GitHub's response: <a href="https://github.blog/news-insights/the-library/public-key-security-vulnerability-and-mitigation/" target="_blank" rel="noopener">github.blog — Public Key Security Vulnerability and Mitigation</a></li>
  <li>Hibernate ORM user guide, entity requirements (no-arg constructor, non-final class for proxies): <a href="https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#entity-pojo" target="_blank" rel="noopener">docs.jboss.org/hibernate/orm</a></li>
  <li>Jackson 3.0 release notes (package <code>tools.jackson</code>): <a href="https://github.com/FasterXML/jackson/wiki/Jackson-Release-3.0" target="_blank" rel="noopener">github.com/FasterXML/jackson/wiki/Jackson-Release-3.0</a></li>
</ul>
</div>
`;

const L11_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Record, var và tính bất biến</h2>
<p class="lead">Gần như mọi class bạn viết trong một dự án Spring Boot mà không phải controller, service hay repository đều là một "túi dữ liệu" nhỏ: thân request, response, sự kiện, một dòng kết quả truy vấn. Java 16 cho túi đó một từ khoá riêng — <strong>record</strong>. Bài này cho bạn thấy record sinh ra những gì, chỗ nào dùng đúng (DTO, giá trị, sự kiện), chỗ nào dùng sai (entity JPA), và vì sao "đối tượng không bao giờ đổi" là cách chống lỗi rẻ nhất bạn từng có.</p>

<h3>Vấn đề: 32 dòng chỉ để nói "phòng lab có id, tên và sức chứa"</h3>
<p>Trước khi có record, một class giá trị viết đúng trong Java trông thế này. Mỗi trường xuất hiện năm lần, và mỗi lần thêm trường bạn phải nhớ sửa <code>equals</code>, <code>hashCode</code>, <code>toString</code> — quên một chỗ là gặp đúng các lỗi ở bài 1.5.</p>
${MA_CLASS_CU}
<p>Cùng nội dung đó viết bằng record chỉ một dòng:</p>
${MA_RECORD}
<p>Trình biên dịch không chỉ "gõ hộ" — nó sinh ra thành viên thật. <code>javap</code> (công cụ dịch ngược tệp class có sẵn trong JDK) cho thấy chính xác bên trong có gì:</p>
${OUT_JAVAP}
<div class="kv-grid">
  <div class="kv"><span class="k">final class … extends java.lang.Record</span><span class="v">Record không cho ai kế thừa và không kế thừa class nào khác (vẫn được implement interface).</span></div>
  <div class="kv"><span class="k">Trường private final</span><span class="v">Mỗi thành phần một trường. Gán đúng một lần trong constructor, không bao giờ gán lại.</span></div>
  <div class="kv"><span class="k">Constructor chuẩn (canonical)</span><span class="v"><code>Lab(long, String, int)</code> — nhận đủ mọi thành phần, đúng thứ tự.</span></div>
  <div class="kv"><span class="k">Accessor <code>id()</code>, <code>name()</code></span><span class="v">Không có tiền tố <code>get</code>. Jackson 3, Spring và projection của JPA đều hiểu cách đặt tên này.</span></div>
  <div class="kv"><span class="k">equals / hashCode / toString</span><span class="v">Tính trên <em>mọi</em> thành phần — hai record cùng dữ liệu là bằng nhau.</span></div>
</div>

<h3>Ngữ nghĩa giá trị — chạy thật</h3>
${MA_DEMO1}
${OUT_DEMO1}
<p>Hai đối tượng riêng biệt (<code>a == b</code> là false) vẫn <em>bằng nhau</em> vì dữ liệu bằng nhau — đó là nghĩa của "giá trị". Và không có <code>setCapacity</code>: muốn "đổi" record thì tạo record mới. Bản cũ không bị đụng tới, nên đoạn mã nào khác đang giữ <code>a</code> vẫn thấy 30.</p>

<h3>Compact constructor: kiểm một lần, ngay ở cửa</h3>
<p>Record có thể khai báo <strong>compact constructor</strong> — không có danh sách tham số, không gán trường. Nó chạy trước khi trường được gán, nên là chỗ duy nhất để chặn dữ liệu xấu hoặc chuẩn hoá dữ liệu. Phương thức kiểu <em>wither</em> (<code>withCapacity</code>) trả về một bản sao đã sửa.</p>
${MA_COMPACT}
${OUT_COMPACT}
<div class="pitfall"><p><strong>Bẫy — record chỉ bất biến <em>nông</em>.</strong> Trường <code>slots</code> là final, nhưng nó trỏ tới một <code>ArrayList</code> mà ai giữ danh sách gốc vẫn sửa được — output cho thấy <code>13:00</code> xuất hiện trong một record "final". Sửa trong compact constructor bằng <code>List.copyOf</code> (hoặc <code>Set.copyOf</code>, <code>Map.copyOf</code>): bạn được một bản sao không sửa được, ai cố <code>add</code> sẽ nhận exception.</p></div>

<h3>var: suy luận kiểu biến cục bộ (Java 10)</h3>
<p><code>var</code> để trình biên dịch tự suy kiểu của <strong>biến cục bộ</strong> từ giá trị khởi tạo. Đây vẫn là kiểu tĩnh — biến có đúng một kiểu, cố định lúc biên dịch; bạn chỉ không phải viết kiểu hai lần.</p>
${MA_VAR}
${OUT_VAR}
<p>Hai bài học từ output đó. <code>var big = 10L</code> là <code>long</code>, không phải <code>int</code> — chữ số quyết định kiểu. Còn <code>var list = new ArrayList&lt;&gt;()</code> lặng lẽ thành <code>ArrayList&lt;Object&gt;</code>: dấu kim cương không có gì để suy, nên danh sách nhận cả chuỗi lẫn số 42. Khi dùng <code>var</code>, hãy viết <code>new ArrayList&lt;String&gt;()</code>.</p>
<p>Những chỗ <em>không</em> được dùng <code>var</code> — thông báo của trình biên dịch, chạy thật:</p>
${MA_VAR_SAI}
${OUT_VAR_SAI}
<div class="callout"><strong>Luật nhóm hay dùng.</strong> Dùng <code>var</code> khi vế phải đã nêu kiểu (<code>new</code>, hàm tạo như <code>List.of</code>, phép ép kiểu) hoặc trong vòng <code>for</code> duyệt entry. Tránh dùng khi vế phải là một phương thức mà người đọc không đoán được kiểu trả về: <code>var result = service.process(x);</code> giấu thông tin khi review mã.</div>

<h3>Vì sao bất biến quan trọng với backend</h3>
<ul>
  <li><strong>Luồng.</strong> Server Spring Boot xử lý mỗi request trên một luồng riêng (Tomcat mặc định tối đa 200 luồng; Chương 2). Đối tượng không ai sửa được thì chia cho mọi luồng mà không cần khoá. Mô hình bộ nhớ Java còn bảo đảm: constructor chạy xong thì mọi luồng thấy đúng giá trị các trường <code>final</code> (JLS §17.5).</li>
  <li><strong>Khoá băm.</strong> Đối tượng làm khoá trong <code>HashMap</code>/<code>HashSet</code> mà bị đổi thì map "đánh rơi" nó (bài 1.5 cho thấy chuyện đó xảy ra thật). Record có thành phần bất biến thì không thể gây lỗi này.</li>
  <li><strong>Dễ suy luận.</strong> Phương thức nhận một record thì biết chắc bên gọi không sửa lén nó sau lưng — không cần chép phòng thủ khắp nơi.</li>
  <li><strong>Cache.</strong> Chương 13 lưu đối tượng vào Redis; giá trị bất biến thì cache và dùng chung an toàn.</li>
</ul>

<h3>Record đặt ở đâu trong dự án Spring Boot — và chỗ nào không</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ DTO request/response</span><span class="v"><code>record CreateBookingRequest(long labId, LocalDate date, …)</code> — Jackson gắn JSON vào constructor chuẩn; annotation Bean Validation đặt trên thành phần (Chương 5).</span></div>
  <div class="kv"><span class="k">✅ Projection truy vấn</span><span class="v"><code>record LabSummary(String name, long bookings)</code> làm kết quả của truy vấn JPQL/JDBC (Chương 6).</span></div>
  <div class="kv"><span class="k">✅ Sự kiện, cấu hình, value object</span><span class="v"><code>record BookingApproved(long id, Instant at)</code>; record <code>@ConfigurationProperties</code> (Chương 3); <code>TimeSlot</code>, <code>Money</code>.</span></div>
  <div class="kv"><span class="k">❌ Entity JPA</span><span class="v">Hibernate cần constructor không tham số, trường sửa được (nó điền sau khi nạp và sửa khi dirty checking) và phải <em>kế thừa</em> được entity để tạo proxy nạp lười. Record là final, không có constructor rỗng và không đổi được.</span></div>
</div>
<p>Luật proxy không phải lý thuyết — thử kế thừa một record là trình biên dịch từ chối, và nó cũng từ chối trường thể hiện thêm:</p>
${MA_KE_THUA}
${OUT_KE_THUA}

<h3>Record và JSON: Jackson 3 (bản nằm trong Spring Boot 4)</h3>
<p>Spring Boot 4 đi kèm Jackson 3, các package chuyển từ <code>com.fasterxml.jackson</code> sang <code>tools.jackson</code>. Nó đọc ghi record mà không cần một annotation nào:</p>
${MA_JSON}
${OUT_JSON}
<div class="callout warn"><strong>🕵️ Góc hacker — mass assignment (gán hàng loạt).</strong> Hai dòng cuối là lý do các nhóm làm nghiêm túc không bao giờ gắn request thẳng vào entity. Thân request có thêm đúng một trường, <code>"admin":true</code>; class có setter <code>setAdmin</code> ngoan ngoãn gán luôn. Ngày <strong>4/3/2012</strong>, Egor Homakov dùng đúng loại lỗi này trên GitHub (một ứng dụng Ruby on Rails) để thêm khoá công khai của mình vào tổ chức <code>rails</code> rồi đẩy một commit lên kho mã Rails — để chứng minh sau khi báo lỗi bị gạt đi. GitHub vá ngay trong ngày, còn Rails đổi mặc định (strong parameters). <strong>Cách phòng:</strong> (1) mỗi endpoint một record DTO chỉ chứa trường client được gửi; (2) tự chép DTO → entity trong service; (3) không bao giờ để role, chủ sở hữu, giá hay trạng thái trong DTO tạo/sửa. Chương 10 tấn công một endpoint LabFlow theo đúng cách này rồi vá.</div>

<h3>So với Node.js / TypeScript</h3>
<p>JavaScript không có kiểu giá trị tự sinh phép so sánh: hai object literal cùng nội dung không bao giờ <code>===</code>. <code>Object.freeze</code> chỉ nông — giống hệt record chứa danh sách sửa được — còn <code>readonly</code> của TypeScript chỉ tồn tại lúc biên dịch. Chạy thật:</p>
${OUT_FREEZE}
<p>Nên khi phỏng vấn: "Record của Java giống một kiểu object TypeScript bị đóng băng, có sẵn <code>equals</code>/<code>hashCode</code> theo cấu trúc — và tính bất biến được trình biên dịch <em>lẫn</em> lúc chạy bảo đảm, không chỉ bộ kiểm kiểu."</p>

<h3>Liên hệ đời thường</h3>
<p>Record giống tờ hoá đơn đã in: nó ghi sự thật ở một thời điểm, có gì thay đổi thì in hoá đơn mới chứ không ai viết đè lên tờ cũ. Hai tờ hoá đơn cùng món, cùng tổng tiền là một hoá đơn đối với kế toán, dù là hai tờ giấy. Còn entity giống thẻ tích điểm của khách: một danh tính sống nhiều năm, điểm thay đổi mỗi tuần.</p>

<h3>Khi đi làm</h3>
<p>Trong buổi review mã ở một công ty outsource Việt Nam, người review sẽ đánh dấu một class DTO 60 dòng với lời nhắn "dùng record đi". Họ cũng đánh dấu chiều ngược lại: một <code>@Entity record</code> biên dịch được nhưng chết lúc khởi động. Nếu nhóm còn ở Java 11 (vài ngân hàng vẫn vậy) thì chưa có record — <code>@Value</code> của Lombok là thứ tương đương cũ hơn, học xong bài này bạn sẽ nhận ra nó.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"Record sinh ra những gì, và không làm được gì?"</strong> — Trường private final, constructor chuẩn, accessor không có <code>get</code>, và <code>equals</code>/<code>hashCode</code>/<code>toString</code> trên mọi thành phần. Nó là final, không kế thừa class, không khai báo thêm trường thể hiện; được implement interface, thêm phương thức, trường static và compact constructor.</li>
  <li><strong>"Record làm entity JPA được không?"</strong> — Không: JPA cần constructor rỗng, trạng thái sửa được, và class kế thừa được để làm proxy nạp lười. Record dùng cho DTO và projection, entity là class thường.</li>
  <li><strong>"Record có bất biến không?"</strong> — Nông thôi. Trường không gán lại được, nhưng thành phần là đối tượng sửa được (một danh sách) thì vẫn đổi; chép bằng <code>List.copyOf</code> trong compact constructor.</li>
  <li><strong>"<code>var</code> có biến Java thành kiểu động không?"</strong> — Không. Kiểu được suy một lần lúc biên dịch rồi cố định; chỉ dùng cho biến cục bộ có giá trị khởi tạo.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết <code>record TimeSlot(LocalDate date, LocalTime start, LocalTime end)</code> có compact constructor chặn <code>start</code> không trước <code>end</code> và giờ nằm ngoài 07:00–21:00.</li>
  <li>Thêm <code>boolean overlaps(TimeSlot other)</code>. 08:00–10:00 và 10:00–12:00 phải <em>không</em> trùng; 08:00–10:00 và 09:30–11:00 phải trùng.</li>
  <li>Viết <code>record Room(String name, List&lt;String&gt; equipment)</code> và chứng minh bằng một <code>main</code> nhỏ rằng không chép phòng thủ thì thiết bị bị đổi từ bên ngoài — rồi sửa.</li>
  <li>Chạy <code>javap -p</code> trên class <code>TimeSlot</code> của bạn và tìm phương thức bạn tự viết giữa đám phương thức được sinh ra.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>main</code> in <code>false</code> cho hai khung giờ chạm nhau và <code>true</code> cho hai khung giờ chồng nhau, và <code>Room</code> ném <code>UnsupportedOperationException</code> khi ai đó cố thêm thiết bị.</p></div>
${giai('Xem một lời giải', `${java(`
record TimeSlot(LocalDate date, LocalTime start, LocalTime end) {
    static final LocalTime OPEN = LocalTime.of(7, 0), CLOSE = LocalTime.of(21, 0);
    TimeSlot {
        if (!start.isBefore(end)) throw new IllegalArgumentException("start must be before end");
        if (start.isBefore(OPEN) || end.isAfter(CLOSE)) throw new IllegalArgumentException("labs open 07:00–21:00");
    }
    boolean overlaps(TimeSlot o) { return date.equals(o.date) && start.isBefore(o.end) && o.start.isBefore(end); }
}
record Room(String name, List<String> equipment) {
    Room { equipment = List.copyOf(equipment); }
}`)}
<p>Phép kiểm trùng là luật khoảng kinh điển: hai khoảng nửa mở [a, b) và [c, d) chồng nhau đúng khi <code>a &lt; d</code> và <code>c &lt; b</code>. Dùng "trước" nghiêm ngặt thì hai khung chạm nhau là hợp lệ. Chính <code>TimeSlot</code> này được dùng lại trong lab Chương 1 (bài 1.6), nơi bộ kiểm tra thử đúng các trường hợp trên.</p>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Record</span><span class="v">Class dữ liệu final, bất biến nông; constructor, accessor, equals, hashCode, toString sinh từ các thành phần (Java 16, JEP 395).</span></div>
  <div class="kv"><span class="k">Thành phần (component)</span><span class="v">Một mục trong phần đầu record, ví dụ <code>int capacity</code>; thành một trường private final cộng một accessor.</span></div>
  <div class="kv"><span class="k">Compact constructor</span><span class="v">Constructor không có danh sách tham số, dùng để kiểm hoặc chuẩn hoá thành phần trước khi gán.</span></div>
  <div class="kv"><span class="k">Ngữ nghĩa giá trị</span><span class="v">Bằng nhau theo nội dung, không theo danh tính.</span></div>
  <div class="kv"><span class="k">Chép phòng thủ</span><span class="v">Chép đối số sửa được (vd. <code>List.copyOf</code>) để mã bên ngoài không đổi được trạng thái đối tượng của bạn.</span></div>
  <div class="kv"><span class="k">var</span><span class="v">Suy luận kiểu biến cục bộ (Java 10, JEP 286): kiểu tĩnh lấy từ giá trị khởi tạo.</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data Transfer Object — hình dạng dữ liệu đi qua ranh giới (HTTP, hàng đợi), tách khỏi entity.</span></div>
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Gắn mọi trường của request vào đối tượng, khiến client đặt được trường không được phép (vai trò, chủ sở hữu, giá).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Record biến 32 dòng class giá trị thành một dòng; trình biên dịch sinh các thành viên bạn đã thấy qua <code>javap</code>.</li>
  <li>Kiểm trong compact constructor; "đổi" record bằng cách tạo record mới; chép thành phần sửa được.</li>
  <li><code>var</code> là kiểu tĩnh bớt lặp — chỉ biến cục bộ, và cẩn thận với <code>new ArrayList&lt;&gt;()</code>.</li>
  <li>Record cho DTO, projection, sự kiện, cấu hình; class thường cho entity JPA.</li>
  <li>Record DTO chỉ chứa trường được phép là lớp phòng thủ đầu tiên trước mass assignment.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://openjdk.org/jeps/395', '📄', 'JEP 395: Records', 'Mục tiêu thiết kế và luật chính xác cho thành phần, constructor, accessor.')}
${tl('https://openjdk.org/jeps/286', '📄', 'JEP 286: Local-Variable Type Inference', 'Vì sao var chỉ dành cho biến cục bộ, kèm hướng dẫn phong cách.')}

<h3>Nguồn</h3>
<ul>
  <li>Java Language Specification 21, §8.10 Record Classes và §17.5 final Field Semantics: <a href="https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10" target="_blank" rel="noopener">docs.oracle.com/javase/specs/jls/se21</a></li>
  <li>Sự cố mass assignment của Egor Homakov trên GitHub (4/3/2012) và phản hồi của GitHub: <a href="https://github.blog/news-insights/the-library/public-key-security-vulnerability-and-mitigation/" target="_blank" rel="noopener">github.blog — Public Key Security Vulnerability and Mitigation</a></li>
  <li>Hướng dẫn Hibernate ORM, yêu cầu với entity (constructor rỗng, class không final để làm proxy): <a href="https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#entity-pojo" target="_blank" rel="noopener">docs.jboss.org/hibernate/orm</a></li>
  <li>Ghi chú phát hành Jackson 3.0 (package <code>tools.jackson</code>): <a href="https://github.com/FasterXML/jackson/wiki/Jackson-Release-3.0" target="_blank" rel="noopener">github.com/FasterXML/jackson/wiki/Jackson-Release-3.0</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.2 — Sealed, pattern matching và switch expression ═══════════════════════════ */
const MA_STATUS = java(`
sealed interface BookingStatus permits Pending, Approved, Rejected, Cancelled {}
record Pending() implements BookingStatus {}
record Approved(String by, LocalDateTime at) implements BookingStatus {}
record Rejected(String by, String reason) implements BookingStatus {}
record Cancelled(LocalDateTime at, boolean late) implements BookingStatus {}

static String describe(BookingStatus s) {
    return switch (s) {                                          // no default: the compiler knows all 4 kinds
        case Pending p -> "Chờ duyệt";
        case Approved(var by, var at) -> "Đã duyệt bởi " + by + " lúc " + at.toLocalTime();
        case Rejected(var by, var reason) when reason.isBlank() -> "Bị từ chối bởi " + by;
        case Rejected(var by, var reason) -> "Bị từ chối bởi " + by + ": " + reason;
        case Cancelled(var at, var late) -> late ? "Huỷ muộn (tính phí)" : "Đã huỷ";
    };
}

public static void main(String[] args) {
    var t = LocalDateTime.of(2026, 11, 18, 9, 30);
    for (BookingStatus s : List.of(new Pending(), new Approved("cô Lan", t),
            new Rejected("thầy Hùng", "trùng lịch thi"), new Rejected("thầy Hùng", " "),
            new Cancelled(t, true))) {
        System.out.println(describe(s));
    }
}`);
const OUT_STATUS = out(`$ java Status.java
Chờ duyệt
Đã duyệt bởi cô Lan lúc 09:30
Bị từ chối bởi thầy Hùng: trùng lịch thi
Bị từ chối bởi thầy Hùng
Huỷ muộn (tính phí)`);
const OUT_THEM = out(`$ javac ThemTrangThai.java      # same file + "record NoShow() implements BookingStatus {}" in permits
ThemTrangThai.java:13: error: the switch expression does not cover all possible input values
        return switch (s) {
               ^
1 error`);
const MA_CU = java(`
// Java 8 style: instanceof + a manual cast
static double areaOld(Object o) {
    if (o instanceof Circle) {
        Circle c = (Circle) o;
        return Math.PI * c.r() * c.r();
    } else if (o instanceof Square) {
        Square s = (Square) o;
        return s.side() * s.side();
    }
    return 0;                                   // "silent default" — a new shape nobody handled lands here
}
// Java 16+: instanceof with a pattern — test and bind in one step
static double areaPattern(Object o) {
    if (o instanceof Circle c && c.r() > 0) return Math.PI * c.r() * c.r();
    if (o instanceof Square(double side)) return side * side;   // record pattern (Java 21)
    return 0;
}
// classic switch statement: forget a break and you fall into the next case
static String oldSwitch(int code) {
    String r = "";
    switch (code) {
        case 1: r += "PENDING ";
        case 2: r += "APPROVED ";
            break;
        default: r += "UNKNOWN";
    }
    return r;
}
static String nullSafe(Object o) {
    return switch (o) {
        case null -> "null — xử lý được ngay trong switch (Java 21)";
        case String s -> "chuỗi " + s.length() + " ký tự";
        default -> "khác";
    };
}
public static void main(String[] args) {
    System.out.printf("%.2f %.2f%n", areaOld(new Circle(1)), areaPattern(new Square(3)));
    System.out.println("oldSwitch(1) = " + oldSwitch(1));
    System.out.println(nullSafe(null));
    String s = null;
    switch (s) { case "A" -> System.out.println("A"); default -> System.out.println("khác"); }
}`);
const OUT_CU = out(`$ java Cu.java
3.14 9.00
oldSwitch(1) = PENDING APPROVED 
null — xử lý được ngay trong switch (Java 21)
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.hashCode()" because "<local2>" is null
	at Cu.main(Cu.java:46)`);
const MA_TROI = java(`
sealed interface BookingStatus permits Pending, Approved {}
record Pending() implements BookingStatus {}
record Approved(String by) implements BookingStatus {}
record Hacked() implements BookingStatus {}            // not in the permits list
static String f(BookingStatus s) {
    return switch (s) {
        case Approved a -> "duyệt";
        case Approved a when a.by().equals("admin") -> "admin duyệt";   // can never be reached
        case Pending p -> "chờ";
    };
}`);
const OUT_TROI = out(`$ javac Troi.java
Troi.java:5: error: class is not allowed to extend sealed class: BookingStatus (as it is not listed in its 'permits' clause)
    record Hacked() implements BookingStatus {}
    ^
Troi.java:9: error: this case label is dominated by a preceding case label
            case Approved a when a.by().equals("admin") -> "admin duyệt";
                 ^
2 errors
$ javac Gach.java      # case Approved(var by, _) -> by;
Gach.java:4: error: unnamed variables are a preview feature and are disabled by default.
        return switch (o) { case Approved(var by, _) -> by; default -> "?"; };
                                                   ^
  (use --enable-preview to enable unnamed variables)
1 error`);
const MA_TS = java(`
type BookingStatus =
  | { kind: "pending" }
  | { kind: "approved"; by: string }
  | { kind: "rejected"; by: string; reason: string }
  | { kind: "noShow" };

function describe(s: BookingStatus): string {
  switch (s.kind) {
    case "pending": return "Chờ duyệt";
    case "approved": return "Đã duyệt bởi " + s.by;
    case "rejected": return "Bị từ chối: " + s.reason;
    default: {
      const never: never = s;
      return never;
    }
  }
}`);
const OUT_TS = out(`$ tsc --noEmit --strict status.ts      # TypeScript 5.9.3
status.ts(13,13): error TS2322: Type '{ kind: "noShow"; }' is not assignable to type 'never'.`);

const L12_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Sealed types, pattern matching and switch expressions</h2>
<p class="lead">A LabFlow booking is always in exactly one of a few states: pending, approved, rejected, cancelled. Each state carries different data — who approved it, why it was rejected, when it was cancelled. Java 17–21 gives you a way to write that down so precisely that the <em>compiler</em> refuses to build your project if any code forgets a state. This lesson builds that model, shows the compiler catching a forgotten case, and connects it to one of the most expensive "forgotten state" bugs in history.</p>

<h3>The old ways and their holes</h3>
<p>Before Java 17 you had two options. An <code>enum Status { PENDING, APPROVED, … }</code> is a closed set, but every constant has the same fields — so "rejected reason" and "approved by" end up as nullable columns on the booking that are only meaningful in some states. Or a class hierarchy (<code>abstract class Status</code>), which can carry different data, but anyone can add a subclass anywhere and no switch can know it has seen them all. Both lead to the same line in the code: <code>default: // should not happen</code>.</p>

<h3>sealed: a closed hierarchy</h3>
<p>A <strong>sealed</strong> interface or class lists, with <code>permits</code>, exactly which types may implement it. Combined with records, each state becomes its own small type with only the data that makes sense for it — a <strong>sum type</strong>, or "algebraic data type" in functional languages:</p>
${MA_STATUS}
${OUT_STATUS}
<p>Look at what the <code>switch</code> does in one expression:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">switch expression</span><span class="v"><code>return switch (s) { … };</code> produces a value. Arrows (<code>-&gt;</code>) never fall through.</span></div>
  <div class="kv"><span class="k">Type pattern</span><span class="v"><code>case Pending p</code> — matches when <code>s</code> is a <code>Pending</code> and binds it to <code>p</code>.</span></div>
  <div class="kv"><span class="k">Record pattern</span><span class="v"><code>case Approved(var by, var at)</code> — matches <em>and</em> pulls out the components (Java 21, JEP 440).</span></div>
  <div class="kv"><span class="k">Guard</span><span class="v"><code>when reason.isBlank()</code> — an extra condition; the more specific case must come first.</span></div>
  <div class="kv"><span class="k">Exhaustiveness</span><span class="v">No <code>default</code>: the compiler knows the four permitted types and checks that every one is handled.</span></div>
</div>

<h3>The payoff: add a state, and the compiler lists every place to update</h3>
<p>Product asks for a new state: the student did not show up. Add <code>record NoShow()</code> to the <code>permits</code> list and rebuild:</p>
${OUT_THEM}
<p>That error is the whole point. In the Chapter 1 lab the same change produces three errors — one per switch over <code>BookingStatus</code> in the service — and the build stays red until every one has decided what a no-show means. With <code>default</code> in those switches, the code would have compiled and quietly treated a no-show like whatever the default branch did.</p>
<div class="callout"><strong>Rule:</strong> when you switch over a sealed type or an enum, <em>do not</em> write <code>default</code>. Let exhaustiveness work for you.</div>

<h3>How we got here: instanceof, casts and fall-through</h3>
${MA_CU}
${OUT_CU}
<ul>
  <li><strong>Pattern for instanceof</strong> (Java 16): <code>o instanceof Circle c</code> tests and casts in one step, and <code>c</code> is usable in the rest of the condition (<code>&amp;&amp; c.r() &gt; 0</code>).</li>
  <li><strong>Fall-through:</strong> <code>oldSwitch(1)</code> printed <code>PENDING APPROVED</code> — case 1 has no <code>break</code>, so it ran case 2 as well. The arrow form makes that impossible.</li>
  <li><strong>null:</strong> a classic <code>switch</code> on a null string throws <code>NullPointerException</code> (last line). Java 21's pattern switch can say <code>case null</code> explicitly.</li>
</ul>

<h3>What the compiler forbids — and why that is good</h3>
${MA_TROI}
${OUT_TROI}
<ul>
  <li>Nobody outside the permitted list can join the hierarchy — not a teammate, not a library.</li>
  <li>A guarded case after an unguarded one of the same type is unreachable, and the compiler says so ("dominated").</li>
  <li><code>_</code> for "I do not need this component" is final only in Java 22 (JEP 456); in Java 21 it is a preview feature. On 21, write <code>var ignored</code> or just a type pattern.</li>
</ul>

<h3>Using it in Spring Boot</h3>
<ul>
  <li><strong>Domain state:</strong> the service decides allowed transitions with a switch over the current state (the lab does exactly this: an approved booking may only be cancelled).</li>
  <li><strong>Results instead of exceptions:</strong> <code>sealed interface BookingResult permits Created, Conflict, LabClosed</code> and the controller turns each into 201, 409 or 422.</li>
  <li><strong>Storage:</strong> the database still stores a <code>status</code> column (and nullable columns such as <code>rejected_reason</code>); the repository maps a row to the right record. JSON can carry a type field — Jackson supports sealed hierarchies with <code>@JsonTypeInfo</code> (Chapter 4).</li>
</ul>

<h3>🕵️ Real incident — Knight Capital, 1 August 2012</h3>
<div class="callout warn"><p>Knight Capital, then one of the largest US market makers, deployed new trading code to eight servers; one server did not get it. The new code re-used an old flag that, on that eighth server, still switched on a long-dead function called "Power Peg". For about 45 minutes that server sent millions of orders; Knight lost more than <strong>$460 million</strong> and was sold within months (SEC order, 16 October 2013). The root cause is a state whose meaning changed while some code still interpreted it the old way — exactly what an implicit <code>default</code> branch or a reused enum constant does silently. <strong>Defence in code:</strong> model states as a closed sealed type, never repurpose a constant, switch without <code>default</code> so a new state breaks the build; <strong>in operations:</strong> automated deployment to every server and a kill switch (Chapter 17).</p></div>

<h3>Compared with TypeScript</h3>
<p>TypeScript expresses the same idea with a <em>discriminated union</em> and the <code>never</code> trick; a real run with the forgotten <code>noShow</code> case:</p>
${MA_TS}
${OUT_TS}
<p>The difference: in TypeScript exhaustiveness is a convention you must remember to write; in Java the switch expression enforces it by itself, and <code>permits</code> also stops new subtypes at run time.</p>

<h3>Everyday picture</h3>
<p>A parcel tracking page shows exactly one of a fixed list of states — accepted, in transit, out for delivery, delivered, returned — and each state shows different details (which warehouse, which courier, who signed). When the company adds "held at customs", every screen, SMS template and report must learn it. Sealed types make the compiler the person who walks around the office checking that every screen did.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is a sealed class and why use it?"</strong> — A class or interface that lists its permitted subtypes. It models a closed set of alternatives, and lets switch expressions be checked for exhaustiveness without a <code>default</code>.</li>
  <li><strong>"Enum or sealed interface?"</strong> — Enum when every alternative has the same shape (a simple status code); sealed + records when alternatives carry different data.</li>
  <li><strong>"What changed in switch from Java 8 to 21?"</strong> — Arrow labels without fall-through, switch as an expression that yields a value, type and record patterns, guards with <code>when</code>, <code>case null</code>, and compile-time exhaustiveness.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Model a payment for a lab booking fee: <code>sealed interface Payment permits Cash, BankTransfer, Momo</code> with records carrying different data (amount for all; bank code and reference for the transfer; phone number for Momo).</li>
  <li>Write <code>String receiptLine(Payment p)</code> with a switch expression and record patterns, no <code>default</code>. Transfers over 5 000 000 VND print "needs accountant check" (use a guard).</li>
  <li>Add <code>record Card(String last4, long amount)</code> to <code>permits</code> and read the compiler error before fixing it.</li>
</ol>
<p><strong>Done when:</strong> the build fails with "does not cover all possible input values" after step 3, and passes again after you add the case.</p></div>
${giai('Show one solution', `${java(`
sealed interface Payment permits Cash, BankTransfer, Momo, Card {}
record Cash(long amount) implements Payment {}
record BankTransfer(long amount, String bank, String ref) implements Payment {}
record Momo(long amount, String phone) implements Payment {}
record Card(String last4, long amount) implements Payment {}

static String receiptLine(Payment p) {
    return switch (p) {
        case Cash(var amount) -> "Tiền mặt " + amount;
        case BankTransfer(var amount, var bank, var ref) when amount > 5_000_000 -> "CK " + bank + " " + ref + " — needs accountant check";
        case BankTransfer(var amount, var bank, var ref) -> "CK " + bank + " " + ref + " " + amount;
        case Momo(var amount, var phone) -> "Momo " + phone.substring(phone.length() - 3) + " " + amount;
        case Card(var last4, var amount) -> "Thẻ ****" + last4 + " " + amount;
    };
}`)}
<p>Note the guarded <code>BankTransfer</code> case comes <em>before</em> the general one; in the other order the compiler reports "dominated". Masking the phone number is not decoration — receipts are often printed or emailed, and a full phone number is personal data.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sealed class / interface</span><span class="v">A type that restricts its direct subtypes to a <code>permits</code> list (Java 17, JEP 409).</span></div>
  <div class="kv"><span class="k">Sum type (ADT)</span><span class="v">A value that is exactly one of several alternatives, each with its own data.</span></div>
  <div class="kv"><span class="k">Switch expression</span><span class="v">A switch that yields a value, with arrow labels and no fall-through (Java 14).</span></div>
  <div class="kv"><span class="k">Type pattern / record pattern</span><span class="v"><code>case Pending p</code> / <code>case Approved(var by, var at)</code> — match and bind (Java 21, JEP 441 and 440).</span></div>
  <div class="kv"><span class="k">Guard</span><span class="v">A <code>when</code> condition attached to a case.</span></div>
  <div class="kv"><span class="k">Exhaustiveness</span><span class="v">The compiler's proof that every possible input is handled.</span></div>
  <div class="kv"><span class="k">Dominance</span><span class="v">A case that can never run because an earlier, more general case already matches.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Sealed + records model "one of these, each with its own data" precisely.</li>
  <li>A switch expression over a sealed type needs no <code>default</code>, and adding a type breaks the build at every switch that must change.</li>
  <li>Java 21 adds record patterns, guards and <code>case null</code>; <code>_</code> needs Java 22.</li>
  <li>Never repurpose a state; let the compiler find every place a new state matters.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://openjdk.org/jeps/441', '📄', 'JEP 441: Pattern Matching for switch', 'Exhaustiveness, dominance, null handling — the rules behind every error in this lesson.')}
${tl('https://openjdk.org/jeps/409', '📄', 'JEP 409: Sealed Classes', 'permits, non-sealed, and how sealed types work across packages and modules.')}

<h3>Sources</h3>
<ul>
  <li>JEP 440 Record Patterns and JEP 456 Unnamed Variables &amp; Patterns: <a href="https://openjdk.org/jeps/440" target="_blank" rel="noopener">openjdk.org/jeps/440</a>, <a href="https://openjdk.org/jeps/456" target="_blank" rel="noopener">openjdk.org/jeps/456</a></li>
  <li>SEC, In the Matter of Knight Capital Americas LLC, Release No. 70694 (16 October 2013): <a href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">sec.gov/litigation/admin/2013/34-70694.pdf</a></li>
  <li>TypeScript Handbook, Narrowing — exhaustiveness checking with never: <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking" target="_blank" rel="noopener">typescriptlang.org/docs/handbook/2/narrowing.html</a></li>
</ul>
</div>
`;

const L12_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Sealed, pattern matching và switch expression</h2>
<p class="lead">Một lượt đặt phòng LabFlow luôn ở đúng một trong vài trạng thái: chờ duyệt, đã duyệt, bị từ chối, đã huỷ. Mỗi trạng thái mang dữ liệu khác nhau — ai duyệt, vì sao từ chối, huỷ lúc nào. Java 17–21 cho bạn cách viết điều đó chính xác tới mức <em>trình biên dịch</em> từ chối build dự án nếu có đoạn mã nào quên một trạng thái. Bài này dựng mô hình đó, cho thấy trình biên dịch bắt được trường hợp bị quên, và nối nó với một trong những lỗi "quên trạng thái" đắt nhất lịch sử.</p>

<h3>Cách cũ và lỗ hổng của nó</h3>
<p>Trước Java 17 bạn có hai lựa chọn. <code>enum Status { PENDING, APPROVED, … }</code> là tập đóng, nhưng mọi hằng có cùng các trường — nên "lý do từ chối" và "người duyệt" thành cột cho phép null trên lượt đặt, chỉ có nghĩa ở vài trạng thái. Hoặc một cây class (<code>abstract class Status</code>) mang được dữ liệu khác nhau, nhưng ai cũng thêm được lớp con ở bất cứ đâu và không switch nào biết mình đã xét đủ. Cả hai dẫn tới cùng một dòng mã: <code>default: // không thể xảy ra</code>.</p>

<h3>sealed: cây kiểu đóng</h3>
<p>Interface hay class <strong>sealed</strong> liệt kê bằng <code>permits</code> chính xác những kiểu nào được implement nó. Kết hợp với record, mỗi trạng thái thành một kiểu nhỏ riêng, chỉ mang dữ liệu hợp lý với nó — một <strong>kiểu tổng (sum type)</strong>, hay "kiểu dữ liệu đại số" trong các ngôn ngữ hàm:</p>
${MA_STATUS}
${OUT_STATUS}
<p>Nhìn xem <code>switch</code> làm gì trong một biểu thức:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Switch expression</span><span class="v"><code>return switch (s) { … };</code> trả ra một giá trị. Mũi tên (<code>-&gt;</code>) không bao giờ rơi xuống nhánh dưới.</span></div>
  <div class="kv"><span class="k">Type pattern</span><span class="v"><code>case Pending p</code> — khớp khi <code>s</code> là <code>Pending</code> và gán nó vào <code>p</code>.</span></div>
  <div class="kv"><span class="k">Record pattern</span><span class="v"><code>case Approved(var by, var at)</code> — khớp <em>và</em> tách luôn các thành phần (Java 21, JEP 440).</span></div>
  <div class="kv"><span class="k">Guard (điều kiện phụ)</span><span class="v"><code>when reason.isBlank()</code> — thêm điều kiện; case cụ thể hơn phải đứng trước.</span></div>
  <div class="kv"><span class="k">Tính đầy đủ</span><span class="v">Không có <code>default</code>: trình biên dịch biết bốn kiểu được phép và kiểm rằng kiểu nào cũng được xử lý.</span></div>
</div>

<h3>Phần thưởng: thêm trạng thái, trình biên dịch liệt kê mọi chỗ phải sửa</h3>
<p>Bên sản phẩm muốn thêm trạng thái: sinh viên không đến. Thêm <code>record NoShow()</code> vào <code>permits</code> rồi build lại:</p>
${OUT_THEM}
<p>Lỗi đó chính là mục đích. Trong lab Chương 1, cùng thay đổi này sinh ra ba lỗi — mỗi switch trên <code>BookingStatus</code> trong service một lỗi — và build đỏ cho tới khi từng chỗ quyết định "không đến" nghĩa là gì. Nếu các switch đó có <code>default</code>, mã vẫn biên dịch được và lặng lẽ coi "không đến" giống nhánh mặc định.</p>
<div class="callout"><strong>Luật:</strong> khi switch trên kiểu sealed hoặc enum, <em>đừng</em> viết <code>default</code>. Để tính đầy đủ làm việc cho bạn.</div>

<h3>Đường đi tới đây: instanceof, ép kiểu và rơi nhánh</h3>
${MA_CU}
${OUT_CU}
<ul>
  <li><strong>Pattern cho instanceof</strong> (Java 16): <code>o instanceof Circle c</code> vừa kiểm vừa ép kiểu, và <code>c</code> dùng được ngay trong phần còn lại của điều kiện (<code>&amp;&amp; c.r() &gt; 0</code>).</li>
  <li><strong>Rơi nhánh:</strong> <code>oldSwitch(1)</code> in <code>PENDING APPROVED</code> — case 1 thiếu <code>break</code> nên chạy luôn case 2. Dạng mũi tên khiến chuyện này không thể xảy ra.</li>
  <li><strong>null:</strong> <code>switch</code> cổ điển trên chuỗi null ném <code>NullPointerException</code> (dòng cuối). Pattern switch của Java 21 viết thẳng được <code>case null</code>.</li>
</ul>

<h3>Trình biên dịch cấm gì — và vì sao như vậy là tốt</h3>
${MA_TROI}
${OUT_TROI}
<ul>
  <li>Không ai ngoài danh sách được phép chen vào cây kiểu — không đồng đội nào, không thư viện nào.</li>
  <li>Case có guard đứng sau case không guard cùng kiểu thì không bao giờ tới được, và trình biên dịch nói thẳng ("dominated").</li>
  <li><code>_</code> với nghĩa "tôi không cần thành phần này" chỉ chính thức từ Java 22 (JEP 456); ở Java 21 là tính năng xem trước. Trên 21, viết <code>var ignored</code> hoặc chỉ dùng type pattern.</li>
</ul>

<h3>Dùng trong Spring Boot</h3>
<ul>
  <li><strong>Trạng thái nghiệp vụ:</strong> service quyết định bước chuyển hợp lệ bằng switch trên trạng thái hiện tại (lab làm đúng việc này: lượt đã duyệt chỉ được huỷ).</li>
  <li><strong>Kết quả thay cho exception:</strong> <code>sealed interface BookingResult permits Created, Conflict, LabClosed</code> và controller đổi từng loại thành 201, 409 hay 422.</li>
  <li><strong>Lưu trữ:</strong> cơ sở dữ liệu vẫn lưu cột <code>status</code> (và cột cho phép null như <code>rejected_reason</code>); repository đổi mỗi dòng thành đúng record. JSON có thể mang trường loại — Jackson hỗ trợ cây sealed với <code>@JsonTypeInfo</code> (Chương 4).</li>
</ul>

<h3>🕵️ Sự cố thật — Knight Capital, 1/8/2012</h3>
<div class="callout warn"><p>Knight Capital, khi đó là một trong những nhà tạo lập thị trường lớn nhất nước Mỹ, triển khai mã giao dịch mới lên tám máy chủ; một máy không được cập nhật. Mã mới dùng lại một cờ cũ — mà trên máy thứ tám, cờ đó vẫn bật một chức năng chết từ lâu tên "Power Peg". Trong khoảng 45 phút máy đó gửi hàng triệu lệnh; Knight mất hơn <strong>460 triệu đô la</strong> và bị bán lại vài tháng sau (quyết định của SEC, 16/10/2013). Gốc rễ: một trạng thái đổi nghĩa trong khi vẫn còn mã hiểu theo nghĩa cũ — đúng thứ mà nhánh <code>default</code> ngầm định hay hằng enum bị dùng lại gây ra một cách lặng lẽ. <strong>Phòng trong mã:</strong> mô hình hoá trạng thái bằng kiểu sealed đóng, không bao giờ dùng lại hằng cho nghĩa mới, switch không <code>default</code> để trạng thái mới làm build đỏ; <strong>trong vận hành:</strong> triển khai tự động lên mọi máy và có công tắc ngắt khẩn cấp (Chương 17).</p></div>

<h3>So với TypeScript</h3>
<p>TypeScript diễn đạt cùng ý bằng <em>discriminated union</em> và mẹo <code>never</code>; chạy thật với case <code>noShow</code> bị quên:</p>
${MA_TS}
${OUT_TS}
<p>Khác biệt: ở TypeScript, tính đầy đủ là quy ước bạn phải nhớ tự viết; ở Java, switch expression tự ép buộc, và <code>permits</code> còn chặn kiểu con mới cả lúc chạy.</p>

<h3>Liên hệ đời thường</h3>
<p>Trang theo dõi đơn hàng hiện đúng một trạng thái trong danh sách cố định — đã nhận, đang vận chuyển, đang giao, đã giao, hoàn hàng — và mỗi trạng thái hiện chi tiết khác nhau (kho nào, shipper nào, ai ký nhận). Khi công ty thêm "giữ ở hải quan", mọi màn hình, mẫu tin nhắn, báo cáo đều phải biết. Kiểu sealed biến trình biên dịch thành người đi khắp văn phòng kiểm từng màn hình đã sửa chưa.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"Sealed class là gì, dùng để làm gì?"</strong> — Class hay interface liệt kê các kiểu con được phép. Nó mô hình hoá một tập lựa chọn đóng, và cho phép kiểm tính đầy đủ của switch expression mà không cần <code>default</code>.</li>
  <li><strong>"Chọn enum hay sealed interface?"</strong> — Enum khi mọi lựa chọn cùng hình dạng (mã trạng thái đơn giản); sealed + record khi mỗi lựa chọn mang dữ liệu khác nhau.</li>
  <li><strong>"switch thay đổi gì từ Java 8 tới 21?"</strong> — Nhãn mũi tên không rơi nhánh, switch làm biểu thức trả giá trị, type pattern và record pattern, guard bằng <code>when</code>, <code>case null</code>, và kiểm tính đầy đủ lúc biên dịch.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Mô hình hoá việc trả phí đặt phòng: <code>sealed interface Payment permits Cash, BankTransfer, Momo</code> với các record mang dữ liệu khác nhau (số tiền ở mọi loại; mã ngân hàng và mã tham chiếu cho chuyển khoản; số điện thoại cho Momo).</li>
  <li>Viết <code>String receiptLine(Payment p)</code> bằng switch expression và record pattern, không <code>default</code>. Chuyển khoản trên 5 000 000 đồng in "cần kế toán kiểm" (dùng guard).</li>
  <li>Thêm <code>record Card(String last4, long amount)</code> vào <code>permits</code> và đọc lỗi trình biên dịch trước khi sửa.</li>
</ol>
<p><strong>Đạt khi:</strong> build lỗi "does not cover all possible input values" sau bước 3, và xanh lại sau khi bạn thêm case.</p></div>
${giai('Xem một lời giải', `${java(`
sealed interface Payment permits Cash, BankTransfer, Momo, Card {}
record Cash(long amount) implements Payment {}
record BankTransfer(long amount, String bank, String ref) implements Payment {}
record Momo(long amount, String phone) implements Payment {}
record Card(String last4, long amount) implements Payment {}

static String receiptLine(Payment p) {
    return switch (p) {
        case Cash(var amount) -> "Tiền mặt " + amount;
        case BankTransfer(var amount, var bank, var ref) when amount > 5_000_000 -> "CK " + bank + " " + ref + " — needs accountant check";
        case BankTransfer(var amount, var bank, var ref) -> "CK " + bank + " " + ref + " " + amount;
        case Momo(var amount, var phone) -> "Momo " + phone.substring(phone.length() - 3) + " " + amount;
        case Card(var last4, var amount) -> "Thẻ ****" + last4 + " " + amount;
    };
}`)}
<p>Chú ý case <code>BankTransfer</code> có guard đứng <em>trước</em> case tổng quát; đảo thứ tự là trình biên dịch báo "dominated". Che số điện thoại không phải trang trí — biên lai hay được in hoặc gửi email, và số điện thoại đầy đủ là dữ liệu cá nhân.</p>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sealed class / interface</span><span class="v">Kiểu giới hạn các kiểu con trực tiếp trong danh sách <code>permits</code> (Java 17, JEP 409).</span></div>
  <div class="kv"><span class="k">Kiểu tổng (ADT)</span><span class="v">Giá trị là đúng một trong vài lựa chọn, mỗi lựa chọn có dữ liệu riêng.</span></div>
  <div class="kv"><span class="k">Switch expression</span><span class="v">Switch trả ra giá trị, nhãn mũi tên, không rơi nhánh (Java 14).</span></div>
  <div class="kv"><span class="k">Type pattern / record pattern</span><span class="v"><code>case Pending p</code> / <code>case Approved(var by, var at)</code> — khớp và gán (Java 21, JEP 441 và 440).</span></div>
  <div class="kv"><span class="k">Guard</span><span class="v">Điều kiện <code>when</code> gắn vào một case.</span></div>
  <div class="kv"><span class="k">Tính đầy đủ (exhaustiveness)</span><span class="v">Bằng chứng của trình biên dịch rằng mọi đầu vào có thể đều được xử lý.</span></div>
  <div class="kv"><span class="k">Bị lấn át (dominance)</span><span class="v">Case không bao giờ chạy vì một case tổng quát hơn phía trước đã khớp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Sealed + record mô hình hoá chính xác "một trong những thứ này, mỗi thứ có dữ liệu riêng".</li>
  <li>Switch expression trên kiểu sealed không cần <code>default</code>, và thêm một kiểu làm build đỏ ở mọi switch cần sửa.</li>
  <li>Java 21 thêm record pattern, guard và <code>case null</code>; <code>_</code> cần Java 22.</li>
  <li>Không dùng lại trạng thái cho nghĩa mới; để trình biên dịch tìm mọi chỗ trạng thái mới có ảnh hưởng.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://openjdk.org/jeps/441', '📄', 'JEP 441: Pattern Matching for switch', 'Tính đầy đủ, lấn át, xử lý null — luật đứng sau mọi lỗi trong bài này.')}
${tl('https://openjdk.org/jeps/409', '📄', 'JEP 409: Sealed Classes', 'permits, non-sealed, và sealed hoạt động thế nào qua package và module.')}

<h3>Nguồn</h3>
<ul>
  <li>JEP 440 Record Patterns và JEP 456 Unnamed Variables &amp; Patterns: <a href="https://openjdk.org/jeps/440" target="_blank" rel="noopener">openjdk.org/jeps/440</a>, <a href="https://openjdk.org/jeps/456" target="_blank" rel="noopener">openjdk.org/jeps/456</a></li>
  <li>SEC, In the Matter of Knight Capital Americas LLC, Release No. 70694 (16/10/2013): <a href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">sec.gov/litigation/admin/2013/34-70694.pdf</a></li>
  <li>TypeScript Handbook, Narrowing — kiểm tính đầy đủ bằng never: <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking" target="_blank" rel="noopener">typescriptlang.org/docs/handbook/2/narrowing.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.3 — Generics, interface hàm và lambda ═══════════════════════════ */
const MA_ERASURE = java(`
List<String> names = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();
System.out.println("cùng một class lúc chạy? " + (names.getClass() == numbers.getClass()));

List raw = names;                 // raw type: the compiler only warns
raw.add(42);                      // an Integer goes into a List<String>
System.out.println("size = " + names.size() + " — chưa ai phát hiện");
String first = names.get(0);      // it blows up HERE, far from the real mistake`);
const OUT_ERASURE = out(`$ java Erasure.java
Erasure.java:10: warning: [unchecked] unchecked call to add(E) as a member of the raw type List
        raw.add(42);
               ^
cùng một class lúc chạy? true
size = 1 — chưa ai phát hiện
Exception in thread "main" java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String (java.lang.Integer and java.lang.String are in module java.base of loader 'bootstrap')
	at Erasure.main(Erasure.java:12)`);
const MA_PECS = java(`
// ? extends: you can READ Numbers out (Producer Extends)
static double sum(List<? extends Number> xs) {
    double s = 0;
    for (Number x : xs) s += x.doubleValue();
    return s;
}
// ? super: you can WRITE Integers in (Consumer Super)
static void fillSlots(List<? super Integer> out, int n) {
    for (int i = 0; i < n; i++) out.add(8 + 2 * i);
}
// A generic method: T is inferred from the argument
static <T extends Comparable<T>> T max(List<T> xs) {
    T best = xs.get(0);
    for (T x : xs) if (x.compareTo(best) > 0) best = x;
    return best;
}
public static void main(String[] args) {
    System.out.println(sum(List.of(30, 24, 36)) + " " + sum(List.of(1.5, 2.5)));
    List<Number> slots = new ArrayList<>();
    List<Object> anything = new ArrayList<>();
    fillSlots(slots, 3); fillSlots(anything, 2);
    System.out.println(slots + " " + anything);
    System.out.println(max(List.of("Lab AI", "Lab IoT", "Lab Mạng")) + " " + max(List.of(30, 24, 36)));
}`);
const OUT_PECS = out(`$ java Pecs.java
90.0 4.0
[8, 10, 12] [8, 10]
Lab Mạng 36`);
const OUT_PECS_SAI = out(`$ javac PecsSai.java
PecsSai.java:3: error: incompatible types: int cannot be converted to CAP#1
    static void f(List<? extends Number> xs) { xs.add(1); }
                                                      ^
  where CAP#1 is a fresh type-variable:
    CAP#1 extends Number from capture of ? extends Number
PecsSai.java:5: error: incompatible types: ArrayList<String> cannot be converted to List<Object>
    public static void main(String[] a) { g(new ArrayList<String>()); }
                                            ^
2 errors`);
const MA_LAMBDA = java(`
record Lab(String name, String building, int capacity) {}

var labs = List.of(new Lab("Lab AI", "Alpha", 30), new Lab("Lab IoT", "Beta", 24), new Lab("Lab Mạng", "Alpha", 36));

Predicate<Lab> inAlpha = lab -> lab.building().equals("Alpha");
Predicate<Lab> big = lab -> lab.capacity() >= 32;
Function<Lab, String> label = Lab::name;                         // method reference
Function<String, String> shout = String::toUpperCase;
Supplier<List<String>> fresh = ArrayList::new;                   // constructor reference
Consumer<String> print = System.out::println;                    // bound to one particular object
BinaryOperator<Integer> plus = Integer::sum;

List<String> out = fresh.get();
for (Lab l : labs) if (inAlpha.and(big.negate()).test(l)) out.add(label.andThen(shout).apply(l));
out.forEach(print);
System.out.println("tổng chỗ = " + labs.stream().map(Lab::capacity).reduce(0, plus));

// A Comparator built from lambdas — the same shape as Spring Data's Sort
var sorted = new ArrayList<>(labs);
sorted.sort(Comparator.comparing(Lab::building).thenComparing(Lab::capacity, Comparator.reverseOrder()));
sorted.forEach(l -> System.out.println(l.building() + " " + l.capacity() + " " + l.name()));`);
const OUT_LAMBDA = out(`$ java Lambda.java
LAB AI
tổng chỗ = 90
Alpha 36 Lab Mạng
Alpha 30 Lab AI
Beta 24 Lab IoT`);
const OUT_CAPTURE = out(`$ javac Capture.java        # int count = 0;  Runnable r = () -> count++;
Capture.java:5: error: local variables referenced from a lambda expression must be final or effectively final
        Runnable r = () -> count++;
                           ^
1 error`);
const MA_AN = java(`
Runnable a = new Runnable() { public void run() { System.out.println("anonymous class"); } };
Runnable b = () -> System.out.println("lambda");
a.run(); b.run();
System.out.println(a.getClass().getName() + " | " + b.getClass().getName());`);
const OUT_AN = out(`$ javac -d out AnVsLambda.java && ls out
AnVsLambda$1.class
AnVsLambda.class
$ java -cp out AnVsLambda
anonymous class
lambda
AnVsLambda$1 | AnVsLambda$$Lambda/0x00007f7290000c30
$ javap -c -p -cp out AnVsLambda | grep -E "invokedynamic|new  |lambda\\$"
       0: new           #7                  // class AnVsLambda$1
       8: invokedynamic #10,  0             // InvokeDynamic #0:run:()Ljava/lang/Runnable;
      47: invokedynamic #35,  0             // InvokeDynamic #1:makeConcatWithConstants:(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
  private static void lambda$main$0();`);
const MA_TX = java(`
// A toy version of Spring's TransactionTemplate.execute(...): a fixed "template", the middle passed in as a lambda
static <T> T inTransaction(Supplier<T> work) {
    System.out.println("BEGIN");
    try {
        T result = work.get();
        System.out.println("COMMIT");
        return result;
    } catch (RuntimeException e) {
        System.out.println("ROLLBACK because " + e.getMessage());
        throw e;
    }
}
public static void main(String[] args) {
    long id = inTransaction(() -> { System.out.println("  INSERT booking"); return 101L; });
    System.out.println("id = " + id);
    try {
        inTransaction(() -> { System.out.println("  INSERT booking"); throw new IllegalStateException("lab đã kín lịch"); });
    } catch (IllegalStateException e) { System.out.println("caller sees: " + e.getMessage()); }
}`);
const OUT_TX = out(`$ java TxTemplate.java
BEGIN
  INSERT booking
COMMIT
id = 101
BEGIN
  INSERT booking
ROLLBACK because lab đã kín lịch
caller sees: lab đã kín lịch`);
const MA_SPRING_LAMBDA = java(`
// Preview — these run for real in Chapters 6 and 9
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/labs/**").permitAll()
        .anyRequest().authenticated());

List<Lab> labs = jdbc.sql("SELECT id, name FROM lab")
        .query((rs, rowNum) -> new Lab(rs.getLong("id"), rs.getString("name")))
        .list();

Long id = txTemplate.execute(status -> bookingRepository.save(booking).getId());`);

const L13_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Generics, functional interfaces and lambdas</h2>
<p class="lead">Open any Spring Boot class and you will see <code>JpaRepository&lt;Booking, Long&gt;</code>, <code>ResponseEntity&lt;List&lt;LabDto&gt;&gt;</code>, and lambdas passed into almost every configuration method. This lesson explains the two ideas behind them — generics (types with parameters) and functions as values — down to what the compiler and the JVM actually do, so that the error messages Spring gives you stop looking like noise.</p>

<h3>Generics: a type with a parameter</h3>
<p><code>List&lt;String&gt;</code> means "a list whose elements are strings". The parameter lets the compiler check every <code>add</code> and saves you a cast on every <code>get</code>. In Spring, <code>interface BookingRepository extends JpaRepository&lt;Booking, Long&gt;</code> tells Spring Data the entity type and the id type, and every inherited method — <code>findById(Long)</code> returning <code>Optional&lt;Booking&gt;</code> — is typed for you.</p>

<h3>Type erasure: the parameter disappears at run time</h3>
<p>Java added generics in Java 5 (2004) without changing the JVM, so the compiler checks the type parameters and then <strong>erases</strong> them: at run time a <code>List&lt;String&gt;</code> and a <code>List&lt;Integer&gt;</code> are the same class. If you bypass the check with a <em>raw type</em>, the mistake travels until someone reads the element:</p>
${MA_ERASURE}
${OUT_ERASURE}
<p>Three consequences you will meet in Spring:</p>
<ul>
  <li><strong>The crash is far from the cause.</strong> The bad <code>add</code> was on line 10; the exception is on line 12 — in a real project, possibly another class, another day. Treat every <code>unchecked</code> warning as a bug report.</li>
  <li><strong>You cannot write <code>new T()</code> or <code>T.class</code>.</strong> That is why Spring APIs ask for a <code>Class&lt;T&gt;</code> argument (<code>query(Lab.class)</code>) or a <code>ParameterizedTypeReference</code> when calling another API for a <code>List&lt;LabDto&gt;</code>.</li>
  <li><strong>Overloads that differ only by type argument clash.</strong> <code>void f(List&lt;String&gt;)</code> and <code>void f(List&lt;Integer&gt;)</code> have the same erasure and do not compile together.</li>
</ul>

<h3>Wildcards: ? extends and ? super (PECS)</h3>
<p>A <code>List&lt;Integer&gt;</code> is <em>not</em> a <code>List&lt;Number&gt;</code> — if it were, you could add a <code>Double</code> into a list of integers. Wildcards let a method accept a family of types, with a rule known as <strong>PECS: Producer Extends, Consumer Super</strong>.</p>
${MA_PECS}
${OUT_PECS}
<p>And the two things the compiler stops — adding to an <code>? extends</code> list, and passing <code>ArrayList&lt;String&gt;</code> where <code>List&lt;Object&gt;</code> is expected:</p>
${OUT_PECS_SAI}
<div class="callout"><strong>Read it in the JDK.</strong> <code>Collections.copy(List&lt;? super T&gt; dest, List&lt;? extends T&gt; src)</code> is PECS in one signature: the source produces, the destination consumes. <code>&lt;T extends Comparable&lt;T&gt;&gt;</code> in <code>max</code> is a <em>bounded type parameter</em>: "any T that can compare itself" — so it works for strings and numbers (note that <code>"Lab Mạng"</code> wins because <code>M</code> sorts after <code>I</code> and <code>A</code>).</div>

<h3>Functions as values: functional interfaces and lambdas</h3>
<p>A <strong>functional interface</strong> is an interface with exactly one abstract method. A <strong>lambda</strong> is a short way to write an object that implements it. The JDK ships the common shapes in <code>java.util.function</code>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Function&lt;T, R&gt;</span><span class="v">T in, R out — <code>apply</code>. Map an entity to a DTO.</span></div>
  <div class="kv"><span class="k">Predicate&lt;T&gt;</span><span class="v">T in, boolean out — <code>test</code>. Combine with <code>and</code>, <code>or</code>, <code>negate</code>.</span></div>
  <div class="kv"><span class="k">Supplier&lt;T&gt;</span><span class="v">nothing in, T out — <code>get</code>. Lazy values, <code>orElseGet</code>, <code>orElseThrow</code>.</span></div>
  <div class="kv"><span class="k">Consumer&lt;T&gt;</span><span class="v">T in, nothing out — <code>accept</code>. <code>forEach</code>.</span></div>
  <div class="kv"><span class="k">BiFunction, UnaryOperator, BinaryOperator</span><span class="v">Two inputs; same type in and out; two of the same type in, one out (<code>reduce</code>).</span></div>
</div>
${MA_LAMBDA}
${OUT_LAMBDA}
<p>Four kinds of <strong>method reference</strong> appear above: a static method (<code>Integer::sum</code>), an instance method of an arbitrary object (<code>Lab::name</code>, <code>String::toUpperCase</code>), an instance method of one particular object (<code>System.out::println</code>), and a constructor (<code>ArrayList::new</code>). They are just shorter lambdas.</p>

<h3>Capturing variables: "effectively final"</h3>
<p>A lambda may read local variables from the surrounding method, but only if they are never reassigned:</p>
${OUT_CAPTURE}
<p>This is not pedantry. The lambda may run later, on another thread (Chapter 2 hands lambdas to an executor); if it could change a local variable, two threads would race on it. If you really need a counter, use an <code>AtomicInteger</code> — or better, a stream that returns the count.</p>

<h3>Under the hood: a lambda is not an anonymous class</h3>
${MA_AN}
${OUT_AN}
<p>The anonymous class became a real file, <code>AnVsLambda$1.class</code>, created with <code>new</code>. The lambda produced no file: the compiler moved its body into a private method <code>lambda$main$0</code> and left an <code>invokedynamic</code> instruction that asks the JVM, the first time it runs, to build the implementing object. Fewer classes to load, and the JVM is free to reuse the same object when nothing is captured. Inside a lambda, <code>this</code> means the enclosing object, not the lambda.</p>

<h3>Why Spring uses lambdas everywhere: the template pattern</h3>
<p>Many Spring APIs have a fixed part (open a transaction, get a connection, run the filter chain) and a variable part (your code). Passing the variable part as a lambda is the cleanest way to express that. Here is a toy version of <code>TransactionTemplate</code> that really runs:</p>
${MA_TX}
${OUT_TX}
<p>And this is how the real APIs look — the same shapes you just wrote:</p>
${MA_SPRING_LAMBDA}
<p><code>auth -&gt; auth…</code> is a <code>Customizer</code>; <code>(rs, rowNum) -&gt; …</code> is a <code>RowMapper&lt;Lab&gt;</code>; <code>status -&gt; …</code> is a <code>TransactionCallback&lt;Long&gt;</code>. All three are functional interfaces.</p>

<h3>Compared with Node.js / TypeScript</h3>
<p>In JavaScript, functions are values from day one and closures may capture and <em>modify</em> any variable — safe there because your code runs on one thread. TypeScript generics are also erased (they vanish entirely when compiled to JavaScript), so the "far-away crash" exists there too whenever someone writes <code>as any</code>. The Java difference: generics are checked on every call, and a lambda is always typed by the interface it implements.</p>

<h3>Everyday picture</h3>
<p>A generic is a labelled storage box: "box of screws" accepts screws only, and you never need to check what you pull out. Erasure means the label is only checked at the warehouse door; if someone sneaks a bolt in through the back, you discover it when you try to use it as a screw. A lambda is the instruction slip you hand to a delivery service: "ring twice, leave at the guard house". The company (the template) handles the route; your slip handles the part only you know.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is type erasure, and what does it prevent you from doing?"</strong> — Generic type arguments are checked at compile time and removed from bytecode. You cannot do <code>new T()</code>, <code>T.class</code>, <code>instanceof List&lt;String&gt;</code>, or overload on type arguments; frameworks ask for a <code>Class&lt;T&gt;</code> instead.</li>
  <li><strong>"Explain <code>? extends</code> vs <code>? super</code>."</strong> — PECS: read from an <code>? extends T</code> producer, write into a <code>? super T</code> consumer. <code>List&lt;Integer&gt;</code> is not a subtype of <code>List&lt;Number&gt;</code>.</li>
  <li><strong>"What is a functional interface? Name four from java.util.function."</strong> — One abstract method; Function, Predicate, Supplier, Consumer.</li>
  <li><strong>"Why must captured variables be effectively final?"</strong> — The lambda may run later or on another thread; capturing a copy of a value that never changes avoids races and surprises.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write a generic <code>record Page&lt;T&gt;(List&lt;T&gt; items, int page, int size, long total)</code> with a method <code>&lt;R&gt; Page&lt;R&gt; map(Function&lt;T, R&gt; f)</code> — the same idea as Spring Data's <code>Page.map</code>.</li>
  <li>Use it: turn a <code>Page&lt;Lab&gt;</code> into a <code>Page&lt;String&gt;</code> of names with a method reference.</li>
  <li>Write <code>static &lt;T&gt; T retry(int times, Supplier&lt;T&gt; work)</code> that calls <code>work</code> until it succeeds or the attempts run out, then rethrows the last exception. Test it with a supplier that fails twice.</li>
</ol>
<p><strong>Done when:</strong> <code>map</code> keeps <code>page</code>, <code>size</code> and <code>total</code> unchanged, and <code>retry(3, …)</code> succeeds on the third attempt while <code>retry(2, …)</code> throws.</p></div>
${giai('Show one solution', `${java(`
record Page<T>(List<T> items, int page, int size, long total) {
    <R> Page<R> map(Function<T, R> f) {
        return new Page<>(items.stream().map(f).toList(), page, size, total);
    }
}
static <T> T retry(int times, Supplier<T> work) {
    RuntimeException last = null;
    for (int i = 1; i <= times; i++) {
        try { return work.get(); }
        catch (RuntimeException e) { last = e; System.out.println("attempt " + i + " failed: " + e.getMessage()); }
    }
    throw last;
}`)}
${out(`$ java Practice13.java
Page[items=[Lab AI, Lab IoT], page=0, size=2, total=3]
attempt 1 failed: timeout
attempt 2 failed: timeout
ok on attempt 3
attempt 1 failed: timeout
attempt 2 failed: timeout
retry(2) threw: timeout`)}
<p>Spring Retry and Resilience4j are this idea with back-off, jitter and limits. Never retry an operation that is not idempotent (creating a booking!) without an idempotency key — lesson 4.5.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Generic type / type parameter</span><span class="v"><code>List&lt;T&gt;</code>; <code>T</code> is filled in by the user of the type.</span></div>
  <div class="kv"><span class="k">Type erasure</span><span class="v">Type arguments are checked by the compiler and removed from bytecode.</span></div>
  <div class="kv"><span class="k">Raw type</span><span class="v">A generic type used without arguments (<code>List</code>); turns off checking — legacy only.</span></div>
  <div class="kv"><span class="k">Wildcard, PECS</span><span class="v"><code>? extends T</code> to read, <code>? super T</code> to write.</span></div>
  <div class="kv"><span class="k">Functional interface</span><span class="v">An interface with exactly one abstract method; target type of a lambda.</span></div>
  <div class="kv"><span class="k">Lambda</span><span class="v"><code>(args) -&gt; body</code> — an implementation of a functional interface.</span></div>
  <div class="kv"><span class="k">Method reference</span><span class="v"><code>Lab::name</code>, <code>ArrayList::new</code> — a lambda that only calls one method.</span></div>
  <div class="kv"><span class="k">Effectively final</span><span class="v">A local variable never reassigned after initialisation; required for capture.</span></div>
  <div class="kv"><span class="k">invokedynamic</span><span class="v">The JVM instruction that builds lambda objects at first use.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Generics are checked at compile time and erased at run time; raw types move the crash far from the bug.</li>
  <li>PECS: <code>? extends</code> to read, <code>? super</code> to write.</li>
  <li>A lambda implements a functional interface; four kinds of method reference shorten it further.</li>
  <li>Captured locals must be effectively final; lambdas compile to <code>invokedynamic</code>, not to anonymous classes.</li>
  <li>Spring passes your code into its templates as lambdas: security config, row mappers, transactions.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.oracle.com/javase/tutorial/java/generics/index.html', '📘', 'The Java Tutorials — Generics', 'Bounded types, wildcards, erasure and its restrictions, with exercises.')}
${tl('https://cr.openjdk.org/~briangoetz/lambda/lambda-translation.html', '⚙️', 'Brian Goetz — Translation of Lambda Expressions', 'How javac and invokedynamic turn a lambda into an object.')}

<h3>Sources</h3>
<ul>
  <li>Java Language Specification 21, §4.6 Type Erasure and §15.27 Lambda Expressions: <a href="https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.6" target="_blank" rel="noopener">docs.oracle.com/javase/specs/jls/se21</a></li>
  <li>Joshua Bloch, <em>Effective Java</em>, 3rd ed., Item 31 "Use bounded wildcards to increase API flexibility" (origin of the PECS mnemonic).</li>
  <li>Spring Framework reference — JdbcClient and TransactionTemplate: <a href="https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html" target="_blank" rel="noopener">docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html</a></li>
</ul>
</div>
`;

const L13_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Generics, interface hàm và lambda</h2>
<p class="lead">Mở bất kỳ class Spring Boot nào bạn cũng thấy <code>JpaRepository&lt;Booking, Long&gt;</code>, <code>ResponseEntity&lt;List&lt;LabDto&gt;&gt;</code>, và lambda được truyền vào gần như mọi phương thức cấu hình. Bài này giải thích hai ý tưởng đứng sau — generics (kiểu có tham số) và hàm như một giá trị — tới tận chỗ trình biên dịch và JVM làm gì thật, để thông báo lỗi của Spring thôi trông như chữ vô nghĩa.</p>

<h3>Generics: kiểu có tham số</h3>
<p><code>List&lt;String&gt;</code> nghĩa là "danh sách mà phần tử là chuỗi". Tham số giúp trình biên dịch kiểm mọi lần <code>add</code> và bỏ được phép ép kiểu ở mọi lần <code>get</code>. Trong Spring, <code>interface BookingRepository extends JpaRepository&lt;Booking, Long&gt;</code> báo cho Spring Data kiểu entity và kiểu id, và mọi phương thức kế thừa — <code>findById(Long)</code> trả <code>Optional&lt;Booking&gt;</code> — đều có kiểu sẵn cho bạn.</p>

<h3>Type erasure: tham số biến mất lúc chạy</h3>
<p>Java thêm generics ở Java 5 (2004) mà không đổi JVM, nên trình biên dịch kiểm tham số kiểu rồi <strong>xoá</strong> chúng đi: lúc chạy, <code>List&lt;String&gt;</code> và <code>List&lt;Integer&gt;</code> là cùng một class. Nếu bạn lách bộ kiểm bằng <em>raw type</em>, lỗi đi xa cho tới khi có người đọc phần tử ra:</p>
${MA_ERASURE}
${OUT_ERASURE}
<p>Ba hệ quả bạn sẽ gặp trong Spring:</p>
<ul>
  <li><strong>Chỗ nổ ở xa chỗ gây lỗi.</strong> Lệnh <code>add</code> sai ở dòng 10; exception ở dòng 12 — trong dự án thật có thể là class khác, ngày khác. Coi mọi cảnh báo <code>unchecked</code> là một báo cáo lỗi.</li>
  <li><strong>Không viết được <code>new T()</code> hay <code>T.class</code>.</strong> Vì thế API của Spring đòi đối số <code>Class&lt;T&gt;</code> (<code>query(Lab.class)</code>) hoặc <code>ParameterizedTypeReference</code> khi gọi API khác lấy <code>List&lt;LabDto&gt;</code>.</li>
  <li><strong>Nạp chồng chỉ khác tham số kiểu thì đụng nhau.</strong> <code>void f(List&lt;String&gt;)</code> và <code>void f(List&lt;Integer&gt;)</code> xoá ra giống nhau, không biên dịch chung được.</li>
</ul>

<h3>Wildcard: ? extends và ? super (PECS)</h3>
<p><code>List&lt;Integer&gt;</code> <em>không phải</em> <code>List&lt;Number&gt;</code> — nếu phải, bạn sẽ thêm được <code>Double</code> vào danh sách số nguyên. Wildcard cho một phương thức nhận cả họ kiểu, theo luật <strong>PECS: Producer Extends, Consumer Super</strong> — nguồn cho ra thì extends, nơi nhận vào thì super.</p>
${MA_PECS}
${OUT_PECS}
<p>Và hai việc trình biên dịch chặn — thêm vào danh sách <code>? extends</code>, và truyền <code>ArrayList&lt;String&gt;</code> vào chỗ cần <code>List&lt;Object&gt;</code>:</p>
${OUT_PECS_SAI}
<div class="callout"><strong>Đọc ngay trong JDK.</strong> <code>Collections.copy(List&lt;? super T&gt; dest, List&lt;? extends T&gt; src)</code> là PECS trong một chữ ký: nguồn cho ra, đích nhận vào. <code>&lt;T extends Comparable&lt;T&gt;&gt;</code> trong <code>max</code> là <em>tham số kiểu có chặn</em>: "T nào tự so sánh được" — nên dùng được cho cả chuỗi lẫn số (để ý <code>"Lab Mạng"</code> thắng vì <code>M</code> đứng sau <code>I</code> và <code>A</code>).</div>

<h3>Hàm là giá trị: interface hàm và lambda</h3>
<p><strong>Interface hàm</strong> (functional interface) là interface có đúng một phương thức trừu tượng. <strong>Lambda</strong> là cách viết ngắn một đối tượng implement nó. JDK có sẵn các dạng hay dùng trong <code>java.util.function</code>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Function&lt;T, R&gt;</span><span class="v">vào T, ra R — <code>apply</code>. Đổi entity thành DTO.</span></div>
  <div class="kv"><span class="k">Predicate&lt;T&gt;</span><span class="v">vào T, ra boolean — <code>test</code>. Ghép bằng <code>and</code>, <code>or</code>, <code>negate</code>.</span></div>
  <div class="kv"><span class="k">Supplier&lt;T&gt;</span><span class="v">không vào, ra T — <code>get</code>. Giá trị lười, <code>orElseGet</code>, <code>orElseThrow</code>.</span></div>
  <div class="kv"><span class="k">Consumer&lt;T&gt;</span><span class="v">vào T, không ra — <code>accept</code>. <code>forEach</code>.</span></div>
  <div class="kv"><span class="k">BiFunction, UnaryOperator, BinaryOperator</span><span class="v">Hai đầu vào; vào ra cùng kiểu; hai đầu vào cùng kiểu ra một (<code>reduce</code>).</span></div>
</div>
${MA_LAMBDA}
${OUT_LAMBDA}
<p>Phía trên có đủ bốn loại <strong>method reference</strong>: phương thức static (<code>Integer::sum</code>), phương thức của một đối tượng bất kỳ (<code>Lab::name</code>, <code>String::toUpperCase</code>), phương thức của một đối tượng cụ thể (<code>System.out::println</code>), và constructor (<code>ArrayList::new</code>). Chúng chỉ là lambda viết gọn hơn.</p>

<h3>Bắt biến từ ngoài: "effectively final"</h3>
<p>Lambda được đọc biến cục bộ của phương thức bao quanh, nhưng chỉ khi biến đó không bao giờ bị gán lại:</p>
${OUT_CAPTURE}
<p>Đây không phải khó tính. Lambda có thể chạy sau, trên luồng khác (Chương 2 giao lambda cho executor); nếu nó sửa được biến cục bộ, hai luồng sẽ tranh nhau sửa. Cần bộ đếm thật thì dùng <code>AtomicInteger</code> — hoặc tốt hơn, một stream trả về số đếm.</p>

<h3>Bên dưới: lambda không phải anonymous class</h3>
${MA_AN}
${OUT_AN}
<p>Anonymous class thành một tệp thật, <code>AnVsLambda$1.class</code>, được tạo bằng <code>new</code>. Lambda không sinh tệp nào: trình biên dịch chuyển thân nó vào phương thức private <code>lambda$main$0</code> và để lại lệnh <code>invokedynamic</code>, nhờ JVM — ở lần chạy đầu — dựng đối tượng implement. Ít class phải nạp hơn, và JVM được phép dùng lại cùng một đối tượng khi lambda không bắt biến nào. Trong lambda, <code>this</code> là đối tượng bao quanh, không phải chính lambda.</p>

<h3>Vì sao Spring dùng lambda khắp nơi: mẫu template</h3>
<p>Nhiều API của Spring có phần cố định (mở giao dịch, lấy kết nối, chạy chuỗi filter) và phần thay đổi (mã của bạn). Truyền phần thay đổi bằng lambda là cách diễn đạt gọn nhất. Đây là bản đồ chơi của <code>TransactionTemplate</code>, chạy thật:</p>
${MA_TX}
${OUT_TX}
<p>Và API thật trông thế này — đúng các dạng bạn vừa viết:</p>
${MA_SPRING_LAMBDA}
<p><code>auth -&gt; auth…</code> là một <code>Customizer</code>; <code>(rs, rowNum) -&gt; …</code> là <code>RowMapper&lt;Lab&gt;</code>; <code>status -&gt; …</code> là <code>TransactionCallback&lt;Long&gt;</code>. Cả ba đều là interface hàm.</p>

<h3>So với Node.js / TypeScript</h3>
<p>Trong JavaScript, hàm là giá trị từ ngày đầu và closure được bắt và <em>sửa</em> mọi biến — an toàn ở đó vì mã của bạn chạy trên một luồng. Generics của TypeScript cũng bị xoá (biến mất hẳn khi biên dịch ra JavaScript), nên "nổ ở xa" vẫn xảy ra mỗi khi có người viết <code>as any</code>. Khác biệt của Java: generics được kiểm ở mọi lời gọi, và lambda luôn có kiểu là interface nó implement.</p>

<h3>Liên hệ đời thường</h3>
<p>Generic giống thùng chứa có dán nhãn: "thùng ốc vít" chỉ nhận ốc vít, lấy ra không cần kiểm lại. Erasure nghĩa là nhãn chỉ được kiểm ở cửa kho; ai lén nhét bu-lông qua cửa sau thì tới lúc dùng như ốc vít bạn mới phát hiện. Lambda là tờ ghi chú bạn đưa cho dịch vụ giao hàng: "bấm chuông hai lần, gửi ở phòng bảo vệ". Công ty (template) lo tuyến đường; tờ ghi chú của bạn lo phần chỉ bạn biết.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"Type erasure là gì, nó cấm bạn làm gì?"</strong> — Tham số kiểu generic được kiểm lúc biên dịch rồi bị xoá khỏi bytecode. Không viết được <code>new T()</code>, <code>T.class</code>, <code>instanceof List&lt;String&gt;</code>, hay nạp chồng theo tham số kiểu; framework đòi <code>Class&lt;T&gt;</code> thay vào.</li>
  <li><strong>"Giải thích <code>? extends</code> và <code>? super</code>."</strong> — PECS: đọc từ nguồn <code>? extends T</code>, ghi vào đích <code>? super T</code>. <code>List&lt;Integer&gt;</code> không phải kiểu con của <code>List&lt;Number&gt;</code>.</li>
  <li><strong>"Interface hàm là gì? Kể bốn cái trong java.util.function."</strong> — Một phương thức trừu tượng; Function, Predicate, Supplier, Consumer.</li>
  <li><strong>"Vì sao biến bị bắt phải effectively final?"</strong> — Lambda có thể chạy sau hoặc trên luồng khác; bắt bản sao của một giá trị không đổi tránh tranh chấp và bất ngờ.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết record generic <code>record Page&lt;T&gt;(List&lt;T&gt; items, int page, int size, long total)</code> có phương thức <code>&lt;R&gt; Page&lt;R&gt; map(Function&lt;T, R&gt; f)</code> — cùng ý với <code>Page.map</code> của Spring Data.</li>
  <li>Dùng thử: đổi <code>Page&lt;Lab&gt;</code> thành <code>Page&lt;String&gt;</code> chứa tên phòng bằng method reference.</li>
  <li>Viết <code>static &lt;T&gt; T retry(int times, Supplier&lt;T&gt; work)</code> gọi <code>work</code> cho tới khi thành công hoặc hết lượt, rồi ném lại exception cuối. Thử với một supplier lỗi hai lần.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>map</code> giữ nguyên <code>page</code>, <code>size</code>, <code>total</code>, và <code>retry(3, …)</code> thành công ở lần thứ ba còn <code>retry(2, …)</code> ném exception.</p></div>
${giai('Xem một lời giải', `${java(`
record Page<T>(List<T> items, int page, int size, long total) {
    <R> Page<R> map(Function<T, R> f) {
        return new Page<>(items.stream().map(f).toList(), page, size, total);
    }
}
static <T> T retry(int times, Supplier<T> work) {
    RuntimeException last = null;
    for (int i = 1; i <= times; i++) {
        try { return work.get(); }
        catch (RuntimeException e) { last = e; System.out.println("attempt " + i + " failed: " + e.getMessage()); }
    }
    throw last;
}`)}
${out(`$ java Practice13.java
Page[items=[Lab AI, Lab IoT], page=0, size=2, total=3]
attempt 1 failed: timeout
attempt 2 failed: timeout
ok on attempt 3
attempt 1 failed: timeout
attempt 2 failed: timeout
retry(2) threw: timeout`)}
<p>Spring Retry và Resilience4j chính là ý này cộng thêm giãn cách, độ lệch ngẫu nhiên và giới hạn. Đừng bao giờ thử lại một thao tác không idempotent (tạo lượt đặt!) khi chưa có khoá idempotency — bài 4.5.</p>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểu generic / tham số kiểu</span><span class="v"><code>List&lt;T&gt;</code>; <code>T</code> do người dùng kiểu điền vào.</span></div>
  <div class="kv"><span class="k">Type erasure</span><span class="v">Tham số kiểu được trình biên dịch kiểm rồi xoá khỏi bytecode.</span></div>
  <div class="kv"><span class="k">Raw type</span><span class="v">Kiểu generic dùng không kèm tham số (<code>List</code>); tắt bộ kiểm — chỉ còn trong mã cũ.</span></div>
  <div class="kv"><span class="k">Wildcard, PECS</span><span class="v"><code>? extends T</code> để đọc, <code>? super T</code> để ghi.</span></div>
  <div class="kv"><span class="k">Interface hàm</span><span class="v">Interface có đúng một phương thức trừu tượng; kiểu đích của lambda.</span></div>
  <div class="kv"><span class="k">Lambda</span><span class="v"><code>(tham số) -&gt; thân</code> — một bản implement interface hàm.</span></div>
  <div class="kv"><span class="k">Method reference</span><span class="v"><code>Lab::name</code>, <code>ArrayList::new</code> — lambda chỉ gọi một phương thức.</span></div>
  <div class="kv"><span class="k">Effectively final</span><span class="v">Biến cục bộ không bị gán lại sau khi khởi tạo; điều kiện để lambda bắt được.</span></div>
  <div class="kv"><span class="k">invokedynamic</span><span class="v">Lệnh JVM dựng đối tượng lambda ở lần dùng đầu tiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Generics được kiểm lúc biên dịch và xoá lúc chạy; raw type đẩy chỗ nổ ra xa chỗ lỗi.</li>
  <li>PECS: <code>? extends</code> để đọc, <code>? super</code> để ghi.</li>
  <li>Lambda implement một interface hàm; bốn loại method reference viết gọn hơn nữa.</li>
  <li>Biến cục bộ bị bắt phải effectively final; lambda biên dịch thành <code>invokedynamic</code>, không thành anonymous class.</li>
  <li>Spring đưa mã của bạn vào template của nó bằng lambda: cấu hình bảo mật, row mapper, giao dịch.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://docs.oracle.com/javase/tutorial/java/generics/index.html', '📘', 'The Java Tutorials — Generics', 'Kiểu có chặn, wildcard, erasure và các giới hạn của nó, có bài tập.')}
${tl('https://cr.openjdk.org/~briangoetz/lambda/lambda-translation.html', '⚙️', 'Brian Goetz — Translation of Lambda Expressions', 'javac và invokedynamic biến lambda thành đối tượng thế nào.')}

<h3>Nguồn</h3>
<ul>
  <li>Java Language Specification 21, §4.6 Type Erasure và §15.27 Lambda Expressions: <a href="https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.6" target="_blank" rel="noopener">docs.oracle.com/javase/specs/jls/se21</a></li>
  <li>Joshua Bloch, <em>Effective Java</em>, bản 3, Item 31 "Use bounded wildcards to increase API flexibility" (gốc của câu nhớ PECS).</li>
  <li>Tài liệu Spring Framework — JdbcClient và TransactionTemplate: <a href="https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html" target="_blank" rel="noopener">docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.4 — Exception: checked vs unchecked ═══════════════════════════ */
const OUT_CHECKED = out(`$ javac Checked.java        # static String readConfig() { return Files.readString(Path.of("labflow.yml")); }
Checked.java:3: error: unreported exception IOException; must be caught or declared to be thrown
    static String readConfig() { return Files.readString(Path.of("labflow.yml")); }
                                                        ^
1 error`);
const MA_DEEP = java(`
static int depth = 0;
static void down() { depth++; down(); }
public static void main(String[] args) {
    try { down(); }
    catch (StackOverflowError e) { System.out.println("StackOverflowError sau " + depth + " lần gọi — là Error, không phải Exception" ); }
}`);
const OUT_DEEP = out(`$ java -cp out Deep
StackOverflowError sau 21971 lần gọi — là Error, không phải Exception
$ java -Xss256k -cp out Deep          # smaller thread stack
StackOverflowError sau 1796 lần gọi — là Error, không phải Exception`);
const MA_TWR = java(`
static class Res implements AutoCloseable {
    private final String name; private final boolean failOnClose;
    Res(String name, boolean failOnClose) { this.name = name; this.failOnClose = failOnClose; System.out.println("open " + name); }
    @Override public void close() {
        System.out.println("close " + name);
        if (failOnClose) throw new IllegalStateException("close " + name + " failed");
    }
}
public static void main(String[] args) {
    try (var conn = new Res("connection", false); var stmt = new Res("statement", true)) {
        System.out.println("query…");
        throw new RuntimeException("query failed");
    } catch (RuntimeException e) {
        System.out.println("caught: " + e.getMessage());
        for (Throwable s : e.getSuppressed()) System.out.println("  suppressed: " + s.getMessage());
    }
}`);
const OUT_TWR = out(`$ java Twr.java
open connection
open statement
query…
close statement
close connection
caught: query failed
  suppressed: close statement failed`);
const MA_CHAIN = java(`
static class BookingRepository {
    void insert(long labId) throws SQLException {
        throw new SQLException("duplicate key value violates unique constraint \\"booking_no_overlap\\"", "23505");
    }
}
static class BookingConflictException extends RuntimeException {
    final long labId;
    BookingConflictException(long labId, Throwable cause) {
        super("Lab " + labId + " is already booked for that slot", cause);
        this.labId = labId;
    }
}
static class BookingService {
    final BookingRepository repo = new BookingRepository();
    void book(long labId) {
        try { repo.insert(labId); }
        catch (SQLException e) {
            if ("23505".equals(e.getSQLState())) throw new BookingConflictException(labId, e);   // keep the cause
            throw new RuntimeException(e);
        }
    }
    void bookBad(long labId) {
        try { repo.insert(labId); }
        catch (SQLException e) { throw new RuntimeException(e.getMessage()); }                   // cause lost
    }
}`);
const OUT_CHAIN = out(`$ java -cp out Chain
Exception in thread "main" Chain$BookingConflictException: Lab 7 is already booked for that slot
	at Chain$BookingService.book(Chain.java:21)
	at Chain.main(Chain.java:32)
Caused by: java.sql.SQLException: duplicate key value violates unique constraint "booking_no_overlap"
	at Chain$BookingRepository.insert(Chain.java:6)
	at Chain$BookingService.book(Chain.java:19)
	... 1 more`);
const OUT_CHAIN_BAD = out(`$ java -cp out Chain bad        # same call through bookBad()
Exception in thread "main" java.lang.RuntimeException: duplicate key value violates unique constraint "booking_no_overlap"
	at Chain$BookingService.bookBad(Chain.java:27)
	at Chain.main(Chain.java:32)`);
const MA_FINALLY = java(`
static int f() {
    try { throw new IllegalStateException("lỗi thật"); }
    finally { return 0; }                // swallows the exception
}
static void swallow() {
    try { Integer.parseInt("30a"); }
    catch (Exception e) { }              // "let it continue for now"
}
public static void main(String[] args) {
    System.out.println("f() = " + f());
    swallow();
    System.out.println("swallow(): không một dòng log nào");
}`);
const OUT_FINALLY = out(`$ java Finally.java
f() = 0
swallow(): không một dòng log nào`);
const OUT_NODE_REJECT = out(`$ node -e "Promise.reject(new Error('lab đã kín lịch'))"; echo "node exit=$?"      # Node.js 22.22.2
[eval]:1
Promise.reject(new Error('lab đã kín lịch'))
               ^

Error: lab đã kín lịch
    at [eval]:1:16
    …
Node.js v22.22.2
node exit=1`);
const MA_ADVICE = java(`
// Preview of Chapter 5: one place turns a business exception into an HTTP answer
@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(BookingConflictException.class)
    ProblemDetail conflict(BookingConflictException e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        pd.setProperty("labId", e.labId);
        return pd;                       // 409 + application/problem+json, no stack trace
    }
}`);

const L14_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Exceptions: checked vs unchecked</h2>
<p class="lead">Every backend bug report starts with a stack trace. This lesson teaches you to read one in seconds, explains Java's unusual split between checked and unchecked exceptions (and why Spring took a side), shows how to close resources without leaks, and lists the four exception habits that turn a five-minute fix into a lost afternoon — each reproduced for real.</p>

<h3>The family tree</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Throwable</span><span class="v">The root. Anything you can <code>throw</code>.</span></div>
  <div class="kv"><span class="k">Error</span><span class="v">The JVM is in trouble: <code>OutOfMemoryError</code>, <code>StackOverflowError</code>. Do not catch it to "recover" in normal code.</span></div>
  <div class="kv"><span class="k">Exception (checked)</span><span class="v"><code>IOException</code>, <code>SQLException</code>… The compiler forces callers to catch them or declare <code>throws</code>.</span></div>
  <div class="kv"><span class="k">RuntimeException (unchecked)</span><span class="v"><code>IllegalArgumentException</code>, <code>NullPointerException</code>, every Spring <code>DataAccessException</code>. No declaration needed.</span></div>
</div>
<p>"Checked" means checked <em>by the compiler</em>. Read a file without handling <code>IOException</code> and the build stops:</p>
${OUT_CHECKED}
<p>And an <code>Error</code> really is a different branch — a runaway recursion fills the thread's stack; the depth depends on the stack size (<code>-Xss</code>) and changes slightly from run to run:</p>
${MA_DEEP}
${OUT_DEEP}

<h3>Checked or unchecked — and why Spring chose unchecked</h3>
<p>The idea behind checked exceptions: a method's signature should tell you what can go wrong, and the compiler should make you deal with it. In practice, in a layered backend, the service that calls a repository usually <em>cannot</em> do anything useful with an <code>SQLException</code> — so it either wraps it or adds <code>throws SQLException</code> to every method up to the controller, leaking database details into every layer.</p>
<p>Spring took a clear position (since 2003): it translates <code>SQLException</code> into its own unchecked hierarchy — <code>DataAccessException</code>, with subclasses such as <code>DuplicateKeyException</code> and <code>DataIntegrityViolationException</code> — based on the vendor error code. Your service catches only what it can handle; everything else travels up to one central handler. Kotlin, C# and modern Java libraries made the same choice.</p>
<div class="callout warn"><strong>The fact that matters in Chapter 6.</strong> By default <code>@Transactional</code> rolls back on <code>RuntimeException</code> and <code>Error</code> — <em>not</em> on checked exceptions. A method that throws a checked exception after an <code>INSERT</code> commits the insert. That is one more reason to model business failures as unchecked exceptions (or set <code>rollbackFor</code>). Chapter 6.5 proves it against PostgreSQL.</div>

<h3>try-with-resources: closing things without leaks</h3>
<p>Connections, files and streams must be closed even when something fails. Anything that implements <code>AutoCloseable</code> can be declared in <code>try ( … )</code>: Java closes it automatically, in <strong>reverse order</strong>, and if closing also fails, that second exception is attached as <em>suppressed</em> instead of hiding the first one:</p>
${MA_TWR}
${OUT_TWR}
<p>Before Java 7, the same thing took a <code>finally</code> block with nested <code>try</code>s, and the usual bug was that an exception from <code>close()</code> replaced the real one. In Spring you rarely write this for JDBC — <code>JdbcClient</code> and JPA close connections for you — but you will for files, HTTP clients and streams.</p>

<h3>Your own exceptions: say what happened in business terms</h3>
<p>A good business exception is unchecked, has a name from the domain, carries the data a handler needs, and <strong>keeps the original cause</strong>. Compare a correct wrap and a lossy one, both throwing on a duplicate booking (SQLState <code>23505</code> = PostgreSQL unique violation):</p>
${MA_CHAIN}
${OUT_CHAIN}
${OUT_CHAIN_BAD}
<p>The second trace has no <code>Caused by</code>: the SQL state, the original class and the repository line are gone. On a production server with thousands of log lines, that is the difference between "the unique constraint fired" and "something somewhere said duplicate".</p>

<h3>Reading a stack trace in ten seconds</h3>
<ol>
  <li><strong>First line:</strong> exception class and message — <em>what</em> happened.</li>
  <li><strong>The last <code>Caused by:</code></strong> is the root cause. In a Spring Boot start-up failure there may be five of them; read the bottom one first (you met this in lesson 0.1 with the DataSource error).</li>
  <li><strong>The first <code>at</code> line in your package</strong> (<code>com.cuongthai…</code>) — skip framework frames — is where your code was involved.</li>
  <li><code>... 1 more</code> means "the remaining frames are identical to the trace above" — Java removes the duplicate tail.</li>
</ol>

<h3>Four habits that cost afternoons — reproduced</h3>
${MA_FINALLY}
${OUT_FINALLY}
<ul>
  <li><strong>Returning from <code>finally</code></strong> swallows the exception completely: <code>f()</code> "succeeds" with 0. Never return or throw from <code>finally</code>.</li>
  <li><strong>Empty catch:</strong> <code>"30a"</code> was not a number, and nothing in the program or the log says so. If you truly expect and ignore an exception, write a comment explaining why, and log at debug level.</li>
  <li><strong>Losing the cause:</strong> <code>new RuntimeException(e.getMessage())</code>, as shown above. Always pass <code>e</code> itself.</li>
  <li><strong><code>catch (Exception e) { e.printStackTrace(); }</code></strong> prints to the console, outside your logging system, and then continues as if nothing happened. Log with the logger (<code>log.error("…", e)</code>) and rethrow or handle.</li>
</ul>

<h3>Exceptions in a Spring Boot API</h3>
<p>The rule in this course: the service throws business exceptions; one <code>@RestControllerAdvice</code> turns each into an HTTP answer in the standard <code>ProblemDetail</code> format (RFC 9457). The client gets a status code and a clear message — never a stack trace.</p>
${MA_ADVICE}

<h3>🕵️ Hacker's corner — error output is reconnaissance</h3>
<div class="callout warn"><p>A stack trace or debug page in an HTTP response tells an attacker your framework versions, class names, SQL and file paths. In <strong>September 2015</strong>, Patreon was breached through a publicly reachable development server running the <strong>Werkzeug debugger</strong> — an interactive error page that lets whoever sees it run Python code on the server; about 15 GB of data, including source code and user records, was later published. Not Java, but the same mistake: a developer-only error tool exposed to the internet. <strong>How to defend in Spring Boot:</strong> keep <code>server.error.include-stacktrace=never</code> (the default) and <code>include-message</code> off for unexpected errors; return <code>ProblemDetail</code> with your own message; log the full trace server-side with a request id; never deploy DevTools or debug profiles to production (Chapter 10, Chapter 15).</p></div>

<h3>Compared with Node.js</h3>
<p>JavaScript has no checked exceptions and no compiler that forces you to handle anything. The equivalent of a forgotten exception is an unhandled promise rejection — and since Node.js 15 it kills the process:</p>
${OUT_NODE_REJECT}
<p>In Express 4 you must pass async errors to <code>next(err)</code> yourself (Express 5 does it for rejected promises); in Spring, an exception thrown anywhere in the request thread reaches the <code>@RestControllerAdvice</code> automatically and the server keeps running.</p>

<h3>Everyday picture</h3>
<p>A stack trace is a chain of passed-on complaints. A customer complains to the waiter (controller), who asks the head chef (service), who blames the supplier (repository): "the fish never arrived". A good restaurant keeps the whole chain on paper — <em>Caused by</em> — so the manager calls the supplier, not the waiter. A bad one writes only "customer unhappy" and throws the rest away.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Checked vs unchecked exceptions — which do you use for business errors and why?"</strong> — Unchecked: callers that cannot handle them are not forced to declare them, a central handler maps them to HTTP, and <code>@Transactional</code> rolls back on them by default.</li>
  <li><strong>"Does <code>@Transactional</code> roll back on every exception?"</strong> — No: only <code>RuntimeException</code> and <code>Error</code> by default; use <code>rollbackFor</code> for checked ones.</li>
  <li><strong>"What does try-with-resources do that try/finally did badly?"</strong> — Closes in reverse order automatically and keeps a close() failure as a suppressed exception instead of hiding the original.</li>
  <li><strong>"Error vs Exception?"</strong> — Errors (OutOfMemoryError, StackOverflowError) mean the JVM itself is in trouble; applications should not try to recover from them in normal code.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write <code>LabNotFoundException</code> and <code>LabClosedException</code> (unchecked), each with the data a handler would need (lab id; opening hours).</li>
  <li>Write <code>Lab findOpenLab(long id, LocalTime at)</code> over a <code>Map</code> that throws the right one.</li>
  <li>Write a method that reads <code>labs.csv</code> with <code>Files.newBufferedReader</code> in a try-with-resources, and wraps <code>IOException</code> into an unchecked <code>LabImportException</code> <em>with the cause</em>. Run it on a missing file and check that the trace shows <code>Caused by: java.nio.file.NoSuchFileException</code>.</li>
</ol>
<p><strong>Done when:</strong> the trace for the missing file has two parts — your exception on top and <code>NoSuchFileException</code> under <code>Caused by</code>.</p></div>
${giai('Show one solution', `${java(`
static class LabImportException extends RuntimeException {
    LabImportException(Path file, Throwable cause) { super("cannot import " + file, cause); }
}
static List<String> importLabs(Path file) {
    try (var reader = Files.newBufferedReader(file)) {
        return reader.lines().skip(1).toList();
    } catch (IOException e) {
        throw new LabImportException(file, e);
    }
}`)}
${out(`$ javac -d out Practice14.java && java -cp out Practice14
Exception in thread "main" Practice14$LabImportException: cannot import labs.csv
	at Practice14.importLabs(Practice14.java:13)
	at Practice14.main(Practice14.java:16)
Caused by: java.nio.file.NoSuchFileException: labs.csv
	at java.base/sun.nio.fs.UnixException.translateToIOException(UnixException.java:92)
	… (9 more JDK frames: Files.newByteChannel, Files.newBufferedReader …)
	at Practice14.importLabs(Practice14.java:10)
	... 1 more`)}
<p>The top line tells the operator what the application was doing; the <code>Caused by</code> tells the developer exactly which file and which system call failed.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Checked exception</span><span class="v">Subclass of <code>Exception</code> (not of <code>RuntimeException</code>); must be caught or declared.</span></div>
  <div class="kv"><span class="k">Unchecked exception</span><span class="v">Subclass of <code>RuntimeException</code>; no declaration required.</span></div>
  <div class="kv"><span class="k">Error</span><span class="v">Serious JVM problem (<code>OutOfMemoryError</code>, <code>StackOverflowError</code>).</span></div>
  <div class="kv"><span class="k">Stack trace</span><span class="v">The chain of method calls active when the exception was thrown, newest first.</span></div>
  <div class="kv"><span class="k">Cause / exception chaining</span><span class="v">The original exception kept inside a wrapper; printed as <code>Caused by:</code>.</span></div>
  <div class="kv"><span class="k">try-with-resources</span><span class="v"><code>try (Res r = …)</code> — closes <code>AutoCloseable</code> resources automatically in reverse order.</span></div>
  <div class="kv"><span class="k">Suppressed exception</span><span class="v">A secondary exception (often from <code>close()</code>) attached to the primary one.</span></div>
  <div class="kv"><span class="k">DataAccessException</span><span class="v">Spring's unchecked translation of database errors.</span></div>
  <div class="kv"><span class="k">ProblemDetail</span><span class="v">Spring's type for the standard JSON error body of RFC 9457.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Error ≠ Exception; checked exceptions are enforced by the compiler, unchecked are not.</li>
  <li>Spring (and this course) use unchecked exceptions for business failures — and <code>@Transactional</code> only rolls back on those by default.</li>
  <li>Use try-with-resources; closing happens in reverse order and failures become suppressed.</li>
  <li>Always keep the cause; read the last <code>Caused by</code> first.</li>
  <li>Never return from <code>finally</code>, never leave a catch empty, never send a stack trace to the client.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/data-access/dao.html', '🌱', 'Spring — Consistent Exception Hierarchy', 'How Spring translates SQLException into DataAccessException subclasses.')}
${tl('https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html', '📘', 'The Java Tutorials — Exceptions', 'The checked/unchecked controversy explained by the language designers.')}

<h3>Sources</h3>
<ul>
  <li>Spring Framework reference — Rolling back a declarative transaction (default rollback rules): <a href="https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html" target="_blank" rel="noopener">docs.spring.io/…/declarative/rolling-back.html</a></li>
  <li>Detectify Labs, "How Patreon got hacked – publicly exposed Werkzeug Debugger" (Frans Rosén, 2 October 2015): <a href="https://labs.detectify.com/writeups/how-patreon-got-hacked-publicly-exposed-werkzeug-debugger/" target="_blank" rel="noopener">labs.detectify.com</a></li>
  <li>Node.js 15 changelog — unhandled rejections throw by default: <a href="https://nodejs.org/en/blog/release/v15.0.0" target="_blank" rel="noopener">nodejs.org/en/blog/release/v15.0.0</a></li>
  <li>RFC 9457, Problem Details for HTTP APIs: <a href="https://www.rfc-editor.org/rfc/rfc9457" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc9457</a></li>
</ul>
</div>
`;

const L14_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Exception: checked vs unchecked</h2>
<p class="lead">Mọi báo lỗi backend đều bắt đầu bằng một stack trace. Bài này dạy bạn đọc nó trong vài giây, giải thích cách Java tách exception thành checked và unchecked (và vì sao Spring chọn một phía), cách đóng tài nguyên không rò rỉ, và bốn thói quen biến một lần sửa năm phút thành mất cả buổi chiều — mỗi thói quen đều được tái hiện chạy thật.</p>

<h3>Cây gia phả</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Throwable</span><span class="v">Gốc. Bất cứ thứ gì <code>throw</code> được.</span></div>
  <div class="kv"><span class="k">Error</span><span class="v">Chính JVM gặp nạn: <code>OutOfMemoryError</code>, <code>StackOverflowError</code>. Đừng bắt nó để "cứu" trong mã thông thường.</span></div>
  <div class="kv"><span class="k">Exception (checked)</span><span class="v"><code>IOException</code>, <code>SQLException</code>… Trình biên dịch buộc bên gọi phải bắt hoặc khai <code>throws</code>.</span></div>
  <div class="kv"><span class="k">RuntimeException (unchecked)</span><span class="v"><code>IllegalArgumentException</code>, <code>NullPointerException</code>, mọi <code>DataAccessException</code> của Spring. Không cần khai báo.</span></div>
</div>
<p>"Checked" nghĩa là được <em>trình biên dịch</em> kiểm. Đọc tệp mà không xử lý <code>IOException</code> là build dừng:</p>
${OUT_CHECKED}
<p>Còn <code>Error</code> thật sự là một nhánh khác — đệ quy mất kiểm soát làm đầy stack của luồng; độ sâu tuỳ cỡ stack (<code>-Xss</code>) và hơi khác nhau giữa các lần chạy:</p>
${MA_DEEP}
${OUT_DEEP}

<h3>Checked hay unchecked — và vì sao Spring chọn unchecked</h3>
<p>Ý tưởng của checked exception: chữ ký phương thức phải cho biết điều gì có thể hỏng, và trình biên dịch phải bắt bạn xử lý. Thực tế, trong backend chia tầng, service gọi repository thường <em>không làm được</em> gì hữu ích với <code>SQLException</code> — nên nó hoặc bọc lại, hoặc thêm <code>throws SQLException</code> vào mọi phương thức lên tới controller, làm chi tiết cơ sở dữ liệu rò sang mọi tầng.</p>
<p>Spring chọn rõ (từ 2003): nó dịch <code>SQLException</code> sang cây unchecked của riêng nó — <code>DataAccessException</code>, với các lớp con như <code>DuplicateKeyException</code>, <code>DataIntegrityViolationException</code> — dựa trên mã lỗi của từng hệ quản trị. Service chỉ bắt thứ nó xử lý được; còn lại đi lên một bộ xử lý trung tâm. Kotlin, C# và các thư viện Java hiện đại cũng chọn như vậy.</p>
<div class="callout warn"><strong>Dữ kiện quan trọng ở Chương 6.</strong> Mặc định <code>@Transactional</code> rollback khi gặp <code>RuntimeException</code> và <code>Error</code> — <em>không</em> rollback với checked exception. Phương thức ném checked exception sau một lệnh <code>INSERT</code> sẽ commit lệnh insert đó. Thêm một lý do để mô hình hoá lỗi nghiệp vụ bằng unchecked exception (hoặc đặt <code>rollbackFor</code>). Bài 6.5 chứng minh trên PostgreSQL.</div>

<h3>try-with-resources: đóng tài nguyên không rò rỉ</h3>
<p>Kết nối, tệp, luồng dữ liệu phải được đóng kể cả khi có lỗi. Mọi thứ implement <code>AutoCloseable</code> đều khai được trong <code>try ( … )</code>: Java tự đóng, theo <strong>thứ tự ngược</strong>, và nếu đóng cũng lỗi thì exception thứ hai được gắn vào dạng <em>suppressed</em> thay vì che mất exception đầu:</p>
${MA_TWR}
${OUT_TWR}
<p>Trước Java 7, việc này cần khối <code>finally</code> với <code>try</code> lồng nhau, và lỗi hay gặp là exception từ <code>close()</code> thay chỗ lỗi thật. Trong Spring bạn hiếm khi viết thế này cho JDBC — <code>JdbcClient</code> và JPA tự đóng kết nối — nhưng sẽ viết cho tệp, HTTP client và stream.</p>

<h3>Exception của riêng bạn: nói chuyện bằng ngôn ngữ nghiệp vụ</h3>
<p>Một exception nghiệp vụ tốt là unchecked, có tên lấy từ nghiệp vụ, mang dữ liệu mà bộ xử lý cần, và <strong>giữ nguyên nguyên nhân gốc</strong>. So sánh một lần bọc đúng và một lần bọc làm mất thông tin, cả hai cùng ném khi đặt trùng (SQLState <code>23505</code> = vi phạm ràng buộc duy nhất của PostgreSQL):</p>
${MA_CHAIN}
${OUT_CHAIN}
${OUT_CHAIN_BAD}
<p>Trace thứ hai không có <code>Caused by</code>: mất SQLState, mất class gốc, mất dòng trong repository. Trên server production với hàng nghìn dòng log, đó là khác biệt giữa "ràng buộc duy nhất đã chặn" và "đâu đó có ai nói trùng".</p>

<h3>Đọc stack trace trong mười giây</h3>
<ol>
  <li><strong>Dòng đầu:</strong> class exception và thông điệp — chuyện <em>gì</em> đã xảy ra.</li>
  <li><strong><code>Caused by:</code> cuối cùng</strong> là nguyên nhân gốc. Lỗi khởi động Spring Boot có thể có năm cái; đọc cái dưới cùng trước (bạn đã gặp ở bài 0.1 với lỗi DataSource).</li>
  <li><strong>Dòng <code>at</code> đầu tiên thuộc package của bạn</strong> (<code>com.cuongthai…</code>) — bỏ qua các dòng của framework — là chỗ mã của bạn dính vào.</li>
  <li><code>... 1 more</code> nghĩa là "các dòng còn lại giống hệt trace phía trên" — Java cắt phần đuôi trùng.</li>
</ol>

<h3>Bốn thói quen làm mất cả buổi chiều — tái hiện thật</h3>
${MA_FINALLY}
${OUT_FINALLY}
<ul>
  <li><strong>return trong <code>finally</code></strong> nuốt trọn exception: <code>f()</code> "thành công" với 0. Không bao giờ return hay throw trong <code>finally</code>.</li>
  <li><strong>catch rỗng:</strong> <code>"30a"</code> không phải số, và không chỗ nào trong chương trình hay log nói ra. Nếu thật sự chờ và bỏ qua một exception, viết chú thích giải thích vì sao, và log ở mức debug.</li>
  <li><strong>Làm mất nguyên nhân:</strong> <code>new RuntimeException(e.getMessage())</code>, như trên. Luôn truyền chính <code>e</code>.</li>
  <li><strong><code>catch (Exception e) { e.printStackTrace(); }</code></strong> in ra console, nằm ngoài hệ thống log, rồi chạy tiếp như không có gì. Log bằng logger (<code>log.error("…", e)</code>) rồi ném lại hoặc xử lý.</li>
</ul>

<h3>Exception trong API Spring Boot</h3>
<p>Luật của khoá này: service ném exception nghiệp vụ; một <code>@RestControllerAdvice</code> duy nhất đổi từng loại thành câu trả lời HTTP theo định dạng chuẩn <code>ProblemDetail</code> (RFC 9457). Client nhận mã trạng thái và thông điệp rõ ràng — không bao giờ nhận stack trace.</p>
${MA_ADVICE}

<h3>🕵️ Góc hacker — output lỗi là bản đồ trinh sát</h3>
<div class="callout warn"><p>Stack trace hay trang gỡ lỗi trong response HTTP cho kẻ tấn công biết phiên bản framework, tên class, câu SQL và đường dẫn tệp. Tháng <strong>9/2015</strong>, Patreon bị xâm nhập qua một server phát triển mở ra Internet đang chạy <strong>trình gỡ lỗi Werkzeug</strong> — trang lỗi tương tác cho phép ai nhìn thấy nó chạy mã Python trên server; khoảng 15 GB dữ liệu, gồm mã nguồn và hồ sơ người dùng, sau đó bị công bố. Không phải Java, nhưng cùng một sai lầm: công cụ lỗi chỉ dành cho lập trình viên lại lộ ra Internet. <strong>Cách phòng trong Spring Boot:</strong> giữ <code>server.error.include-stacktrace=never</code> (mặc định) và tắt <code>include-message</code> cho lỗi không lường trước; trả <code>ProblemDetail</code> với thông điệp của bạn; log đầy đủ trace ở phía server kèm mã request; không bao giờ đưa DevTools hay profile gỡ lỗi lên production (Chương 10, Chương 15).</p></div>

<h3>So với Node.js</h3>
<p>JavaScript không có checked exception và không có trình biên dịch nào ép bạn xử lý. Thứ tương đương với một exception bị quên là promise bị từ chối mà không ai bắt — và từ Node.js 15 nó giết luôn tiến trình:</p>
${OUT_NODE_REJECT}
<p>Ở Express 4 bạn phải tự chuyển lỗi bất đồng bộ cho <code>next(err)</code> (Express 5 tự làm với promise bị từ chối); trong Spring, exception ném ở bất cứ đâu trên luồng request tự đi tới <code>@RestControllerAdvice</code> và server vẫn sống.</p>

<h3>Liên hệ đời thường</h3>
<p>Stack trace là một chuỗi lời phàn nàn được chuyền tay. Khách phàn nàn với phục vụ (controller), phục vụ hỏi bếp trưởng (service), bếp trưởng đổ cho nhà cung cấp (repository): "cá chưa giao tới". Nhà hàng tốt ghi lại cả chuỗi — <em>Caused by</em> — để quản lý gọi nhà cung cấp chứ không mắng phục vụ. Nhà hàng tồi chỉ ghi "khách không vui" rồi vứt phần còn lại.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"Checked và unchecked — bạn dùng loại nào cho lỗi nghiệp vụ, vì sao?"</strong> — Unchecked: bên gọi không xử lý được thì không bị ép khai báo, một bộ xử lý trung tâm đổi chúng thành HTTP, và <code>@Transactional</code> mặc định rollback với chúng.</li>
  <li><strong>"<code>@Transactional</code> có rollback với mọi exception không?"</strong> — Không: mặc định chỉ <code>RuntimeException</code> và <code>Error</code>; checked thì dùng <code>rollbackFor</code>.</li>
  <li><strong>"try-with-resources làm được gì mà try/finally làm dở?"</strong> — Tự đóng theo thứ tự ngược và giữ lỗi của close() dưới dạng suppressed thay vì che mất lỗi gốc.</li>
  <li><strong>"Error khác Exception thế nào?"</strong> — Error (OutOfMemoryError, StackOverflowError) nghĩa là chính JVM gặp nạn; ứng dụng không nên cố phục hồi trong mã thông thường.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết <code>LabNotFoundException</code> và <code>LabClosedException</code> (unchecked), mỗi cái mang dữ liệu mà bộ xử lý cần (id phòng; giờ mở cửa).</li>
  <li>Viết <code>Lab findOpenLab(long id, LocalTime at)</code> trên một <code>Map</code>, ném đúng loại exception.</li>
  <li>Viết phương thức đọc <code>labs.csv</code> bằng <code>Files.newBufferedReader</code> trong try-with-resources, bọc <code>IOException</code> thành <code>LabImportException</code> unchecked <em>kèm nguyên nhân</em>. Chạy với tệp không tồn tại và kiểm trace có <code>Caused by: java.nio.file.NoSuchFileException</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> trace của tệp thiếu có hai phần — exception của bạn ở trên và <code>NoSuchFileException</code> dưới <code>Caused by</code>.</p></div>
${giai('Xem một lời giải', `${java(`
static class LabImportException extends RuntimeException {
    LabImportException(Path file, Throwable cause) { super("cannot import " + file, cause); }
}
static List<String> importLabs(Path file) {
    try (var reader = Files.newBufferedReader(file)) {
        return reader.lines().skip(1).toList();
    } catch (IOException e) {
        throw new LabImportException(file, e);
    }
}`)}
${out(`$ javac -d out Practice14.java && java -cp out Practice14
Exception in thread "main" Practice14$LabImportException: cannot import labs.csv
	at Practice14.importLabs(Practice14.java:13)
	at Practice14.main(Practice14.java:16)
Caused by: java.nio.file.NoSuchFileException: labs.csv
	at java.base/sun.nio.fs.UnixException.translateToIOException(UnixException.java:92)
	… (9 more JDK frames: Files.newByteChannel, Files.newBufferedReader …)
	at Practice14.importLabs(Practice14.java:10)
	... 1 more`)}
<p>Dòng trên cùng cho người vận hành biết ứng dụng đang làm gì; dòng <code>Caused by</code> cho lập trình viên biết chính xác tệp nào và lời gọi hệ thống nào hỏng.</p>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Checked exception</span><span class="v">Lớp con của <code>Exception</code> (không thuộc <code>RuntimeException</code>); phải bắt hoặc khai báo.</span></div>
  <div class="kv"><span class="k">Unchecked exception</span><span class="v">Lớp con của <code>RuntimeException</code>; không cần khai báo.</span></div>
  <div class="kv"><span class="k">Error</span><span class="v">Sự cố nghiêm trọng của JVM (<code>OutOfMemoryError</code>, <code>StackOverflowError</code>).</span></div>
  <div class="kv"><span class="k">Stack trace</span><span class="v">Chuỗi lời gọi phương thức đang chạy lúc ném exception, mới nhất ở trên.</span></div>
  <div class="kv"><span class="k">Nguyên nhân / nối exception</span><span class="v">Exception gốc được giữ trong exception bọc ngoài; in ra dạng <code>Caused by:</code>.</span></div>
  <div class="kv"><span class="k">try-with-resources</span><span class="v"><code>try (Res r = …)</code> — tự đóng tài nguyên <code>AutoCloseable</code> theo thứ tự ngược.</span></div>
  <div class="kv"><span class="k">Suppressed exception</span><span class="v">Exception phụ (thường từ <code>close()</code>) gắn vào exception chính.</span></div>
  <div class="kv"><span class="k">DataAccessException</span><span class="v">Bản dịch unchecked của Spring cho lỗi cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k">ProblemDetail</span><span class="v">Kiểu của Spring cho thân lỗi JSON chuẩn RFC 9457.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Error ≠ Exception; checked do trình biên dịch ép buộc, unchecked thì không.</li>
  <li>Spring (và khoá này) dùng unchecked cho lỗi nghiệp vụ — và <code>@Transactional</code> mặc định chỉ rollback với loại đó.</li>
  <li>Dùng try-with-resources; đóng theo thứ tự ngược, lỗi khi đóng thành suppressed.</li>
  <li>Luôn giữ nguyên nhân; đọc <code>Caused by</code> cuối cùng trước.</li>
  <li>Không return trong <code>finally</code>, không để catch rỗng, không gửi stack trace cho client.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://docs.spring.io/spring-framework/reference/data-access/dao.html', '🌱', 'Spring — Consistent Exception Hierarchy', 'Spring dịch SQLException sang các lớp con DataAccessException thế nào.')}
${tl('https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html', '📘', 'The Java Tutorials — Exceptions', 'Cuộc tranh luận checked/unchecked do chính người thiết kế ngôn ngữ giải thích.')}

<h3>Nguồn</h3>
<ul>
  <li>Tài liệu Spring Framework — Rolling back a declarative transaction (luật rollback mặc định): <a href="https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html" target="_blank" rel="noopener">docs.spring.io/…/declarative/rolling-back.html</a></li>
  <li>Detectify Labs, "How Patreon got hacked – publicly exposed Werkzeug Debugger" (Frans Rosén, 2/10/2015): <a href="https://labs.detectify.com/writeups/how-patreon-got-hacked-publicly-exposed-werkzeug-debugger/" target="_blank" rel="noopener">labs.detectify.com</a></li>
  <li>Nhật ký thay đổi Node.js 15 — promise bị từ chối không ai bắt sẽ ném lỗi: <a href="https://nodejs.org/en/blog/release/v15.0.0" target="_blank" rel="noopener">nodejs.org/en/blog/release/v15.0.0</a></li>
  <li>RFC 9457, Problem Details for HTTP APIs: <a href="https://www.rfc-editor.org/rfc/rfc9457" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc9457</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.5 — Collections ═══════════════════════════ */
const MA_LISTPERF = java(`
static final int N = 100_000;
static void run(String name, List<Integer> list, boolean print) {
    var rnd = new Random(42);
    list.clear();
    start(); for (int i = 0; i < N; i++) list.add(i);                        String addEnd = ms();
    start(); long s = 0; for (int i = 0; i < 20_000; i++) s += list.get(rnd.nextInt(N)); String get = ms();
    start(); for (int x : list) s += x;                                       String iter = ms();
    start(); for (int i = 0; i < 20_000; i++) list.add(0, i);                String addFront = ms();
    start(); for (int i = 0; i < 20_000; i++) list.add(list.size() / 2, i);  String addMid = ms();
    if (print) System.out.printf("%-10s add cuối %s | get ngẫu nhiên %s | duyệt %s | chèn đầu %s | chèn giữa %s%n",
            name, addEnd, get, iter, addFront, addMid);
}
public static void main(String[] args) {
    for (int round = 0; round < 3; round++) {                                 // 2 warm-up rounds for the JIT, print round 3
        run("ArrayList", new ArrayList<>(), round == 2);
        run("LinkedList", new LinkedList<>(), round == 2);
    }
}`);
const OUT_LISTPERF = out(`$ java ListPerf.java        # run 1
ArrayList  add cuối      0.4 ms | get ngẫu nhiên      1.0 ms | duyệt      0.3 ms | chèn đầu   5284.7 ms | chèn giữa    103.0 ms
LinkedList add cuối     10.7 ms | get ngẫu nhiên    712.4 ms | duyệt      0.5 ms | chèn đầu      0.4 ms | chèn giữa   1898.5 ms
$ java ListPerf.java        # run 2
ArrayList  add cuối      0.7 ms | get ngẫu nhiên      1.3 ms | duyệt      0.4 ms | chèn đầu   5343.0 ms | chèn giữa    110.4 ms
LinkedList add cuối     16.2 ms | get ngẫu nhiên    715.5 ms | duyệt      0.3 ms | chèn đầu      0.1 ms | chèn giữa   1859.8 ms`);
const MA_HM = java(`
static int tableLength(HashMap<?, ?> m) throws Exception {          // peek at the private array (needs --add-opens)
    Field f = HashMap.class.getDeclaredField("table"); f.setAccessible(true);
    Object[] t = (Object[]) f.get(m); return t == null ? 0 : t.length;
}
static int spread(Object key) { int h = key.hashCode(); return h ^ (h >>> 16); }   // exactly HashMap.hash()

var m = new HashMap<String, Integer>();
System.out.println("rỗng: table = " + tableLength(m));
for (int i = 1; i <= 25; i++) {
    int before = tableLength(m);
    m.put("lab-" + i, i);
    int after = tableLength(m);
    if (after != before) System.out.println("sau phần tử thứ " + i + ": table " + before + " -> " + after);
}
for (String k : List.of("Lab AI", "Lab IoT", "Lab Mạng"))
    System.out.printf("%-9s hashCode=%11d  bucket (n=16) = %2d%n", k, k.hashCode(), spread(k) & 15);`);
const OUT_HM = out(`$ java --add-opens java.base/java.util=ALL-UNNAMED Hm.java
rỗng: table = 0
sau phần tử thứ 1: table 0 -> 16
sau phần tử thứ 13: table 16 -> 32
sau phần tử thứ 25: table 32 -> 64
Lab AI    hashCode=-2026617925  bucket (n=16) = 15
Lab IoT   hashCode= 1599362715  bucket (n=16) = 15
Lab Mạng  hashCode=-1951814784  bucket (n=16) =  9
"Aa".hashCode()=2112  "BB".hashCode()=2112`);
const MA_EQ = java(`
static class LabNoHash {                              // has equals, FORGOT hashCode
    final String name; LabNoHash(String n) { name = n; }
    @Override public boolean equals(Object o) { return o instanceof LabNoHash l && l.name.equals(name); }
}
static class MutableLab {                             // equals + hashCode, but the field can change
    String name; MutableLab(String n) { name = n; }
    @Override public boolean equals(Object o) { return o instanceof MutableLab l && l.name.equals(name); }
    @Override public int hashCode() { return name.hashCode(); }
}
record Lab(String name) {}

var s1 = new HashSet<LabNoHash>(); s1.add(new LabNoHash("Lab AI")); s1.add(new LabNoHash("Lab AI"));
System.out.println("quên hashCode: size = " + s1.size() + ", contains = " + s1.contains(new LabNoHash("Lab AI")));
var s2 = new HashSet<Lab>(); s2.add(new Lab("Lab AI")); s2.add(new Lab("Lab AI"));
System.out.println("record      : size = " + s2.size() + ", contains = " + s2.contains(new Lab("Lab AI")));

var key = new MutableLab("Lab AI");
var s3 = new HashSet<MutableLab>(); s3.add(key);
key.name = "Lab AI 2";                                // change the key AFTER it is in the set
System.out.println("đổi khoá    : contains(chính nó) = " + s3.contains(key) + ", size = " + s3.size() + ", remove = " + s3.remove(key));`);
const OUT_EQ = out(`$ java EqHash.java
quên hashCode: size = 2, contains = false
record      : size = 1, contains = true
đổi khoá    : contains(chính nó) = false, size = 1, remove = false`);
const MA_DOS = java(`
// 2^k strings with the SAME hashCode, built from "Aa"/"BB" (both = 2112)
static List<String> colliding(int k) {
    List<String> out = new ArrayList<>(List.of(""));
    for (int i = 0; i < k; i++) {
        List<String> next = new ArrayList<>();
        for (String s : out) { next.add(s + "Aa"); next.add(s + "BB"); }
        out = next;
    }
    return out;
}
static final class BadKey {                 // constant hashCode, NOT Comparable
    final int id; BadKey(int id) { this.id = id; }
    @Override public int hashCode() { return 42; }
    @Override public boolean equals(Object o) { return o instanceof BadKey b && b.id == id; }
}`);
const OUT_DOS = out(`$ java HashDos.java
65536 chuỗi, số hashCode khác nhau = 1  (ví dụ AaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa, AaAaAaAaAaAaAaAaAaAaAaAaAaAaAaBB)
65 536 chuỗi thường       :      8.4 ms
65 536 chuỗi cùng hashCode :     29.9 ms  (bucket thành cây đỏ-đen vì String là Comparable)
20 000 Integer thường      :      1.6 ms
20 000 BadKey cùng hashCode:    846.8 ms  (không so sánh được ⇒ dò tuyến tính)`);
const MA_BAT = java(`
try { List.of("Lab AI").add("x"); } catch (Exception e) { System.out.println("List.of(..).add      -> " + e.getClass().getSimpleName()); }
try { List.of("Lab AI", null); } catch (Exception e) { System.out.println("List.of(.., null)    -> " + e.getClass().getSimpleName()); }
var arr = new String[] {"Lab AI", "Lab IoT"};
var view = Arrays.asList(arr);
view.set(0, "Lab Mạng");
System.out.println("Arrays.asList.set    -> mảng gốc giờ là " + Arrays.toString(arr));
try { view.add("x"); } catch (Exception e) { System.out.println("Arrays.asList.add    -> " + e.getClass().getSimpleName()); }

var bookings = new ArrayList<>(List.of("b1-cancelled", "b2", "b3-cancelled", "b4"));
try { for (String b : bookings) if (b.endsWith("cancelled")) bookings.remove(b); }
catch (Exception e) { System.out.println("xoá trong for-each   -> " + e.getClass().getSimpleName()); }
bookings.removeIf(b -> b.endsWith("cancelled"));
System.out.println("removeIf             -> " + bookings);

System.out.println("Map.of thứ tự        -> " + Map.of("Alpha", 1, "Beta", 2, "Gamma", 3, "Delta", 4, "Omega", 5).keySet());`);
const OUT_BAT = out(`$ java Bat.java
List.of(..).add      -> UnsupportedOperationException
List.of(.., null)    -> NullPointerException
Arrays.asList.set    -> mảng gốc giờ là [Lab Mạng, Lab IoT]
Arrays.asList.add    -> UnsupportedOperationException
xoá trong for-each   -> ConcurrentModificationException
removeIf             -> [b2, b4]
Map.of thứ tự        -> [Delta, Beta, Omega, Alpha, Gamma]
$ java Bat.java | tail -1      # same program, new JVM
Map.of thứ tự        -> [Alpha, Omega, Beta, Delta, Gamma]`);
const MA_MAPS = java(`
static class Lru<K, V> extends LinkedHashMap<K, V> {          // an LRU cache in 6 lines
    final int max;
    Lru(int max) { super(16, 0.75f, true); this.max = max; }   // true = order by ACCESS
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> e) { return size() > max; }
}
public static void main(String[] args) {
    var hm = new HashMap<String, Integer>(); var lhm = new LinkedHashMap<String, Integer>(); var tm = new TreeMap<String, Integer>();
    for (String k : List.of("Robot", "Mạng", "AI", "IoT", "Đồ hoạ")) { hm.put(k, 1); lhm.put(k, 1); tm.put(k, 1); }
    System.out.println("HashMap       " + hm.keySet());
    System.out.println("LinkedHashMap " + lhm.keySet());
    System.out.println("TreeMap       " + tm.keySet());

    var cache = new Lru<String, String>(2);
    cache.put("lab:1", "Lab AI"); cache.put("lab:2", "Lab IoT"); cache.get("lab:1"); cache.put("lab:3", "Lab Mạng");
    System.out.println("LRU(2)        " + cache.keySet() + "  (lab:2 lâu nhất không dùng ⇒ bị đẩy)");

    // One room's day: key = start time, value = end time. TreeMap finds the neighbours in O(log n)
    var day = new TreeMap<LocalTime, LocalTime>();
    day.put(LocalTime.of(8, 0), LocalTime.of(10, 0));
    day.put(LocalTime.of(13, 0), LocalTime.of(15, 0));
    for (var req : List.of(new LocalTime[]{LocalTime.of(9, 30), LocalTime.of(11, 0)}, new LocalTime[]{LocalTime.of(10, 0), LocalTime.of(12, 0)},
                           new LocalTime[]{LocalTime.of(12, 0), LocalTime.of(13, 30)})) {
        var before = day.floorEntry(req[0]);            // the booking that starts at or before mine
        var after = day.ceilingKey(req[0]);              // the booking that starts at or after mine
        boolean clash = (before != null && before.getValue().isAfter(req[0])) || (after != null && after.isBefore(req[1]));
        System.out.println("đặt " + req[0] + "–" + req[1] + " : " + (clash ? "TRÙNG" : "được"));
    }
}`);
const OUT_MAPS = out(`$ java Maps.java
HashMap       [AI, Đồ hoạ, Mạng, Robot, IoT]
LinkedHashMap [Robot, Mạng, AI, IoT, Đồ hoạ]
TreeMap       [AI, IoT, Mạng, Robot, Đồ hoạ]
LRU(2)        [lab:1, lab:3]  (lab:2 lâu nhất không dùng ⇒ bị đẩy)
đặt 09:30–11:00 : TRÙNG
đặt 10:00–12:00 : được
đặt 12:00–13:30 : TRÙNG`);

const L15_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Collections: choosing List, Set, Map — and equals/hashCode</h2>
<p class="lead">"How does HashMap work?" is the single most common Java interview question in Vietnam, and "which collection would you use here?" comes right after it. This lesson answers both with measurements instead of folklore: ArrayList against LinkedList timed on this machine, a HashMap's internal table watched while it grows, a broken <code>hashCode</code> making a Set hold duplicates, and the 2011 attack that forced Java to change HashMap's design.</p>

<h3>The map of the territory</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">List — ordered, duplicates allowed, by index</span><span class="v"><strong>ArrayList</strong> (default choice), LinkedList (rarely), <code>List.of</code> (immutable).</span></div>
  <div class="kv"><span class="k">Set — no duplicates</span><span class="v"><strong>HashSet</strong> (no order), LinkedHashSet (insertion order), TreeSet (sorted).</span></div>
  <div class="kv"><span class="k">Map — key → value</span><span class="v"><strong>HashMap</strong>, LinkedHashMap (insertion or access order), TreeMap (sorted keys, range queries), ConcurrentHashMap (Chapter 2).</span></div>
  <div class="kv"><span class="k">Queue / Deque</span><span class="v">ArrayDeque (stack or queue), PriorityQueue (smallest first).</span></div>
</div>

<h3>ArrayList vs LinkedList — measured, not guessed</h3>
<p>An <code>ArrayList</code> is a resizable array: elements sit next to each other in memory. A <code>LinkedList</code> is a chain of node objects, each pointing to the next and previous. The textbook says LinkedList is better for insertions. Here is what really happens on Java 21 with 100 000 elements (two warm-up rounds so the JIT compiler has done its work; a micro-benchmark like this shows orders of magnitude, not exact numbers — use JMH for precise ones):</p>
${MA_LISTPERF}
${OUT_LISTPERF}
<ul>
  <li><strong>Random <code>get</code>:</strong> ~1 ms vs ~710 ms. LinkedList must walk node by node to index <em>i</em>.</li>
  <li><strong>Insert at the front:</strong> LinkedList wins hugely (0.4 ms vs 5.3 s) — ArrayList shifts every element each time. If you need that, use <code>ArrayDeque</code>, which is built for both ends.</li>
  <li><strong>Insert in the middle:</strong> the "LinkedList is good at insertions" myth breaks — it is <em>18 times slower</em> here, because it first has to walk to the middle, while ArrayList's shift is one fast memory copy.</li>
  <li><strong>Iteration:</strong> both fast here; in real programs ArrayList is friendlier to the CPU cache and each LinkedList node costs an extra object (about 24 bytes) per element.</li>
</ul>
<div class="callout"><strong>Rule:</strong> use <code>ArrayList</code> unless you have measured a reason not to. Even Joshua Bloch, who wrote LinkedList, has said he never uses it.</div>

<h3>Inside HashMap</h3>
<p>A <code>HashMap</code> is an array of <em>buckets</em>. To store a key it (1) calls <code>hashCode()</code>, (2) mixes the high bits into the low bits (<code>h ^ (h &gt;&gt;&gt; 16)</code>), (3) picks bucket <code>hash &amp; (n − 1)</code> where <em>n</em> is the array length (always a power of two), and (4) inside that bucket compares keys with <code>equals</code>. Watching the private array grow:</p>
${MA_HM}
${OUT_HM}
<ul>
  <li><strong>Lazy table:</strong> no array until the first <code>put</code>; then 16 buckets.</li>
  <li><strong>Load factor 0.75:</strong> when the size passes 16 × 0.75 = 12, the table doubles (at the 13th element), then again at 25 (32 × 0.75 = 24). Each resize re-distributes every entry — if you know you will store 10 000 entries, create the map with enough capacity up front.</li>
  <li><strong>Collisions are normal:</strong> "Lab AI" and "Lab IoT" landed in the same bucket 15 of 16. And <code>"Aa"</code> and <code>"BB"</code> have the <em>same</em> hashCode, 2112 — remember that pair.</li>
  <li><strong>Treeification (Java 8+):</strong> when one bucket holds more than 8 entries (and the table has at least 64 buckets), it changes from a linked list to a red-black tree, so a bad bucket costs O(log n) instead of O(n).</li>
</ul>

<h3>equals and hashCode: the contract, broken twice</h3>
<p>The rule: <strong>if <code>a.equals(b)</code> then <code>a.hashCode() == b.hashCode()</code></strong>. HashMap and HashSet rely on it — the hash picks the bucket, <code>equals</code> confirms the match. Break it and the collection quietly misbehaves:</p>
${MA_EQ}
${OUT_EQ}
<ul>
  <li><strong>Forgot hashCode:</strong> two "equal" labs got different identity hashes, went into different buckets, and the Set kept both — and cannot find either with a new equal object.</li>
  <li><strong>Changed a key after inserting:</strong> the object sits in the bucket of its <em>old</em> hash. The set cannot find it, cannot remove it — a memory leak with a size of 1.</li>
  <li><strong>The fix is the record from lesson 1.1:</strong> generated, consistent <code>equals</code>/<code>hashCode</code>, and no setters.</li>
</ul>
<div class="pitfall"><p><strong>Trap for Chapter 6 — JPA entities.</strong> Do not base an entity's <code>equals</code>/<code>hashCode</code> on a database-generated id: before saving, the id is null; after saving, it changes — exactly the "changed key" bug above if the entity was in a <code>HashSet</code>. The usual answers are a natural business key, or an id-based equals with a constant hashCode. Lombok's <code>@Data</code> on an entity gets this wrong; Chapter 6 shows it.</p></div>

<h3>🕵️ Hacker's corner — HashDoS (28C3, December 2011)</h3>
<p>If attackers can choose the keys, they can choose keys that all collide. Using the "Aa"/"BB" trick, 16 rounds give 65 536 strings with one single hashCode. A real run on Java 21:</p>
${MA_DOS}
${OUT_DOS}
<div class="callout warn"><p>At the 28th Chaos Communication Congress (28 December 2011), Alexander Klink and Julian Wälde showed that web frameworks put request parameters into hash tables — so one POST with a few hundred thousand colliding parameter names could keep a server's CPU busy for minutes; it affected PHP, ASP.NET, Python, Ruby and Java servers (oCERT-2011-003). Tomcat responded by limiting the number of parameters per request (<code>maxParameterCount</code>: 10 000 in the 2012 fix, 1 000 by default in Tomcat 11, the version inside Spring Boot 4); Java 8 changed HashMap so that crowded buckets become balanced trees (JEP 180) — which is why the 65 536 colliding <em>strings</em> above cost only 30 ms instead of minutes. The protection only works for keys that are <code>Comparable</code>: the <code>BadKey</code> class, with no ordering, was still over 500 times slower than normal keys. <strong>How to defend:</strong> keep request size and parameter limits (Tomcat's defaults, plus Spring's <code>spring.servlet.multipart.*</code> and JSON size limits), use <code>String</code>/<code>Long</code>/records as map keys from user input, and never write a hashCode that returns a constant.</p></div>

<h3>Immutable collections and four classic traps</h3>
${MA_BAT}
${OUT_BAT}
<ul>
  <li><strong><code>List.of</code>, <code>Set.of</code>, <code>Map.of</code></strong> are truly immutable and reject <code>null</code>. Perfect for constants and for returning data from a method.</li>
  <li><strong><code>Arrays.asList</code></strong> is a fixed-size <em>view</em> of the array: <code>set</code> writes through to the array, <code>add</code> fails.</li>
  <li><strong>Removing inside a for-each</strong> throws <code>ConcurrentModificationException</code> (even on one thread). Use <code>removeIf</code> or an explicit <code>Iterator.remove()</code>.</li>
  <li><strong><code>Map.of</code>/<code>Set.of</code> iteration order changes between JVM runs</strong> — on purpose (randomised per run), so nobody depends on it. If the order reaches a JSON response or a test assertion, use <code>LinkedHashMap</code> or sort.</li>
</ul>

<h3>Choosing a Map: order, sorting, caching, ranges</h3>
${MA_MAPS}
${OUT_MAPS}
<ul>
  <li><strong>HashMap</strong> — no promised order. <strong>LinkedHashMap</strong> — insertion order (or access order). <strong>TreeMap</strong> — sorted keys.</li>
  <li><strong>Vietnamese sorting:</strong> TreeMap put "Đồ hoạ" <em>last</em>, because <code>String.compareTo</code> compares Unicode code points and Đ (U+0110) comes after every ASCII letter. For names shown to users, sort with <code>Collator.getInstance(Locale.forLanguageTag("vi"))</code> — or let PostgreSQL sort with a Vietnamese collation.</li>
  <li><strong>LRU cache in six lines:</strong> <code>LinkedHashMap</code> with access order plus <code>removeEldestEntry</code>. Chapter 13 replaces it with Redis.</li>
  <li><strong>Range questions:</strong> <code>floorEntry</code>/<code>ceilingKey</code> answer "which booking starts just before/after 09:30?" in O(log n) — the in-memory version of the overlap check LabFlow will later do in SQL with an exclusion constraint (Chapter 7).</li>
</ul>

<h3>Compared with Node.js / JavaScript</h3>
<p>JavaScript has one array type (backed by the engine as a dense array when it can) and <code>Map</code>/<code>Set</code> that always keep insertion order and compare keys by identity — two equal-looking objects are two different keys, and there is no way to plug in your own <code>hashCode</code>. In Java you decide ordering and equality explicitly by picking the class.</p>

<h3>Everyday picture</h3>
<p>A HashMap is a wall of pigeonholes in a dormitory mail room, labelled by the last digits of the room number. The postman (hashCode) goes straight to the right pigeonhole; inside it there are a few letters to check by name (equals). If a prankster mails 60 000 letters all for rooms ending in 12, one pigeonhole overflows and every resident ending in 12 waits — that is HashDoS. Java's fix is to sort an overflowing pigeonhole alphabetically so the search stays quick.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does HashMap work internally?"</strong> — Array of buckets; index from the spread hash and <code>n − 1</code>; collisions chained in the bucket and compared with <code>equals</code>; resize ×2 at load factor 0.75; buckets with more than 8 entries become red-black trees (table ≥ 64). get/put O(1) on average.</li>
  <li><strong>"What happens if you override equals but not hashCode?"</strong> — Equal objects land in different buckets; HashSet keeps duplicates and lookups fail.</li>
  <li><strong>"ArrayList or LinkedList?"</strong> — ArrayList almost always: O(1) random access, cache-friendly; LinkedList only wins for many inserts/removes at known iterator positions; for both ends use ArrayDeque.</li>
  <li><strong>"Is HashMap thread-safe? What do you use instead?"</strong> — No. <code>ConcurrentHashMap</code>, not <code>Collections.synchronizedMap</code> or Hashtable (Chapter 2).</li>
  <li><strong>"Why should a map key be immutable?"</strong> — Changing it changes its hash; the entry is stranded in the old bucket and can neither be found nor removed.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Given a list of 10 booking records <code>(student, labName)</code>, count bookings per lab with a <code>Map</code> and <code>merge</code>, and print the labs <em>sorted by Vietnamese name</em> (use a <code>TreeMap</code> with a Collator).</li>
  <li>Write <code>class StudentKey</code> with a mutable <code>code</code> field, override only <code>equals</code>, and show with a <code>HashSet</code> that duplicates appear. Then turn it into a record and show they disappear.</li>
  <li>Change <code>ListPerf</code> to insert 20 000 elements at the front of an <code>ArrayDeque</code> with <code>addFirst</code>, and compare it with the two lists.</li>
</ol>
<p><strong>Done when:</strong> "Đồ hoạ" is printed between "Cơ khí" and "Mạng" (not at the end), and your measurement shows ArrayDeque in the same range as LinkedList at the front.</p></div>
${giai('Show one solution for step 1', `${java(`
record Booking(String student, String lab) {}

var bookings = List.of(new Booking("An", "Mạng"), new Booking("Bình", "Đồ hoạ"), new Booking("Chi", "Cơ khí"),
        new Booking("Dũng", "Mạng"), new Booking("Em", "AI"), new Booking("Giang", "Đồ hoạ"));
var counts = new TreeMap<String, Integer>(Collator.getInstance(Locale.forLanguageTag("vi")));
for (var b : bookings) counts.merge(b.lab(), 1, Integer::sum);
System.out.println(counts);`)}
${out(`$ java Practice15.java
{AI=1, Cơ khí=1, Đồ hoạ=2, Mạng=2}`)}
<p><code>merge(key, 1, Integer::sum)</code> inserts 1 the first time and adds 1 afterwards — one line instead of a get/null-check/put dance. The Collator knows that Đ sorts right after D in Vietnamese.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket</span><span class="v">One slot of a HashMap's internal array, holding entries whose hashes map to it.</span></div>
  <div class="kv"><span class="k">Load factor</span><span class="v">Fill ratio (0.75 by default) at which the table doubles.</span></div>
  <div class="kv"><span class="k">Collision</span><span class="v">Two keys in the same bucket — normal, handled with equals.</span></div>
  <div class="kv"><span class="k">Treeify</span><span class="v">Turning a crowded bucket into a red-black tree (Java 8, JEP 180).</span></div>
  <div class="kv"><span class="k">equals/hashCode contract</span><span class="v">Equal objects must have equal hash codes.</span></div>
  <div class="kv"><span class="k">HashDoS</span><span class="v">Denial of service by sending keys that all collide.</span></div>
  <div class="kv"><span class="k">Unmodifiable collection</span><span class="v"><code>List.of</code>, <code>List.copyOf</code>… — any change throws.</span></div>
  <div class="kv"><span class="k">ConcurrentModificationException</span><span class="v">Thrown when a collection changes structurally during iteration (fail-fast).</span></div>
  <div class="kv"><span class="k">LRU</span><span class="v">Least Recently Used — evict the entry unused for the longest time.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Default to ArrayList, HashMap, HashSet; choose Linked*/Tree* only for order, sorting or ranges.</li>
  <li>HashMap = buckets + hash + equals; resizes at 0.75; crowded buckets become trees.</li>
  <li>equals and hashCode go together; map keys must not change — records solve both.</li>
  <li><code>List.of</code> is immutable and null-hostile; <code>Map.of</code> order is random per run.</li>
  <li>Attacker-chosen keys can collide on purpose (HashDoS); limits and Comparable keys keep you safe.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://openjdk.org/jeps/180', '📄', 'JEP 180: Handle Frequent HashMap Collisions with Balanced Trees', 'The Java 8 change made in response to HashDoS.')}
${tl('https://fahrplan.events.ccc.de/congress/2011/Fahrplan/events/4680.en.html', '🎥', '28C3 — Efficient Denial of Service Attacks on Web Application Platforms', 'Klink and Wälde\'s original talk (December 2011).')}

<h3>Sources</h3>
<ul>
  <li>OpenJDK source, <code>java.util.HashMap</code> (DEFAULT_LOAD_FACTOR, TREEIFY_THRESHOLD = 8, MIN_TREEIFY_CAPACITY = 64): <a href="https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/util/HashMap.java" target="_blank" rel="noopener">github.com/openjdk/jdk21u</a></li>
  <li>oCERT advisory 2011-003, multiple implementations denial-of-service via hash algorithm collision: <a href="https://ocert.org/advisories/ocert-2011-003.html" target="_blank" rel="noopener">ocert.org/advisories/ocert-2011-003.html</a></li>
  <li>Apache Tomcat configuration reference, HTTP connector <code>maxParameterCount</code>: <a href="https://tomcat.apache.org/tomcat-11.0-doc/config/http.html" target="_blank" rel="noopener">tomcat.apache.org/tomcat-11.0-doc/config/http.html</a></li>
  <li>Javadoc <code>java.util.Map</code> — "Unmodifiable Maps" (iteration order unspecified and subject to change): <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html#unmodifiable" target="_blank" rel="noopener">docs.oracle.com/en/java/javase/21</a></li>
</ul>
</div>
`;

const L15_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Collections: chọn đúng List, Set, Map — và equals/hashCode</h2>
<p class="lead">"HashMap hoạt động thế nào?" là câu phỏng vấn Java phổ biến nhất ở Việt Nam, và "chỗ này bạn dùng collection nào?" đến ngay sau đó. Bài này trả lời cả hai bằng số đo thay vì truyền miệng: ArrayList đọ LinkedList bấm giờ trên chính máy này, mảng bên trong HashMap được theo dõi lúc lớn dần, một <code>hashCode</code> viết hỏng làm Set chứa phần tử trùng, và cuộc tấn công năm 2011 đã buộc Java đổi thiết kế HashMap.</p>

<h3>Bản đồ tổng quát</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">List — có thứ tự, cho trùng, truy cập theo chỉ số</span><span class="v"><strong>ArrayList</strong> (lựa chọn mặc định), LinkedList (hiếm khi), <code>List.of</code> (bất biến).</span></div>
  <div class="kv"><span class="k">Set — không trùng</span><span class="v"><strong>HashSet</strong> (không thứ tự), LinkedHashSet (thứ tự chèn), TreeSet (đã sắp xếp).</span></div>
  <div class="kv"><span class="k">Map — khoá → giá trị</span><span class="v"><strong>HashMap</strong>, LinkedHashMap (thứ tự chèn hoặc truy cập), TreeMap (khoá đã sắp, truy vấn khoảng), ConcurrentHashMap (Chương 2).</span></div>
  <div class="kv"><span class="k">Queue / Deque</span><span class="v">ArrayDeque (ngăn xếp hoặc hàng đợi), PriorityQueue (nhỏ nhất ra trước).</span></div>
</div>

<h3>ArrayList vs LinkedList — đo thật, không đoán</h3>
<p><code>ArrayList</code> là mảng tự giãn: phần tử nằm sát nhau trong bộ nhớ. <code>LinkedList</code> là chuỗi đối tượng nút, mỗi nút trỏ tới nút trước và sau. Sách giáo khoa nói LinkedList chèn tốt hơn. Đây là chuyện thật trên Java 21 với 100 000 phần tử (hai vòng làm nóng để trình biên dịch JIT làm xong việc; phép đo vi mô kiểu này chỉ cho thấy bậc độ lớn, không phải số chính xác — cần chính xác thì dùng JMH):</p>
${MA_LISTPERF}
${OUT_LISTPERF}
<ul>
  <li><strong><code>get</code> ngẫu nhiên:</strong> ~1 ms so với ~710 ms. LinkedList phải đi từng nút tới chỉ số <em>i</em>.</li>
  <li><strong>Chèn đầu:</strong> LinkedList thắng đậm (0,4 ms so với 5,3 giây) — ArrayList phải dời mọi phần tử mỗi lần. Cần việc đó thì dùng <code>ArrayDeque</code>, sinh ra cho cả hai đầu.</li>
  <li><strong>Chèn giữa:</strong> huyền thoại "LinkedList chèn giỏi" sụp đổ — ở đây nó <em>chậm hơn 18 lần</em>, vì phải đi bộ tới giữa trước, còn việc dời của ArrayList chỉ là một lần chép bộ nhớ rất nhanh.</li>
  <li><strong>Duyệt:</strong> ở đây cả hai đều nhanh; trong chương trình thật ArrayList thân thiện với bộ đệm CPU hơn, và mỗi nút LinkedList tốn thêm một đối tượng (khoảng 24 byte) cho mỗi phần tử.</li>
</ul>
<div class="callout"><strong>Luật:</strong> dùng <code>ArrayList</code> trừ khi bạn đã đo được lý do để không dùng. Chính Joshua Bloch, người viết LinkedList, từng nói ông không bao giờ dùng nó.</div>

<h3>Bên trong HashMap</h3>
<p><code>HashMap</code> là một mảng các <em>bucket</em> (ngăn). Để lưu một khoá, nó (1) gọi <code>hashCode()</code>, (2) trộn các bit cao xuống bit thấp (<code>h ^ (h &gt;&gt;&gt; 16)</code>), (3) chọn ngăn <code>hash &amp; (n − 1)</code> với <em>n</em> là độ dài mảng (luôn là luỹ thừa của 2), và (4) trong ngăn đó so khoá bằng <code>equals</code>. Theo dõi mảng private lớn dần:</p>
${MA_HM}
${OUT_HM}
<ul>
  <li><strong>Mảng tạo lười:</strong> chưa có mảng cho tới lần <code>put</code> đầu; sau đó 16 ngăn.</li>
  <li><strong>Hệ số tải 0,75:</strong> khi số phần tử vượt 16 × 0,75 = 12, mảng gấp đôi (ở phần tử thứ 13), rồi lại gấp ở phần tử 25 (32 × 0,75 = 24). Mỗi lần giãn phải chia lại mọi phần tử — biết trước sẽ lưu 10 000 phần tử thì tạo map với sức chứa đủ ngay từ đầu.</li>
  <li><strong>Va chạm là bình thường:</strong> "Lab AI" và "Lab IoT" rơi cùng ngăn 15 trong 16 ngăn. Còn <code>"Aa"</code> và <code>"BB"</code> có hashCode <em>giống hệt</em>, 2112 — nhớ cặp này.</li>
  <li><strong>Biến thành cây (Java 8+):</strong> khi một ngăn chứa hơn 8 phần tử (và mảng có ít nhất 64 ngăn), ngăn đổi từ danh sách liên kết sang cây đỏ-đen, nên một ngăn xấu tốn O(log n) thay vì O(n).</li>
</ul>

<h3>equals và hashCode: bản hợp đồng, bị phá hai lần</h3>
<p>Luật: <strong>nếu <code>a.equals(b)</code> thì <code>a.hashCode() == b.hashCode()</code></strong>. HashMap và HashSet dựa vào nó — hash chọn ngăn, <code>equals</code> xác nhận khớp. Phá luật là collection lặng lẽ chạy sai:</p>
${MA_EQ}
${OUT_EQ}
<ul>
  <li><strong>Quên hashCode:</strong> hai phòng "bằng nhau" mang hash danh tính khác nhau, vào hai ngăn khác nhau, và Set giữ cả hai — rồi dùng một đối tượng bằng nhau mới thì không tìm được cái nào.</li>
  <li><strong>Đổi khoá sau khi đã thêm:</strong> đối tượng nằm ở ngăn của hash <em>cũ</em>. Set không tìm được, không xoá được — rò bộ nhớ với kích thước 1.</li>
  <li><strong>Cách sửa chính là record ở bài 1.1:</strong> <code>equals</code>/<code>hashCode</code> sinh tự động, nhất quán, và không có setter.</li>
</ul>
<div class="pitfall"><p><strong>Bẫy cho Chương 6 — entity JPA.</strong> Đừng tính <code>equals</code>/<code>hashCode</code> của entity theo id do cơ sở dữ liệu sinh: trước khi lưu id là null; sau khi lưu nó đổi — đúng lỗi "đổi khoá" ở trên nếu entity đang nằm trong <code>HashSet</code>. Cách thường dùng là khoá nghiệp vụ tự nhiên, hoặc equals theo id với hashCode hằng số. <code>@Data</code> của Lombok trên entity làm sai chỗ này; Chương 6 cho thấy.</p></div>

<h3>🕵️ Góc hacker — HashDoS (28C3, tháng 12/2011)</h3>
<p>Nếu kẻ tấn công chọn được khoá, họ chọn được những khoá va chạm hết với nhau. Dùng mẹo "Aa"/"BB", 16 vòng cho 65 536 chuỗi chỉ có một hashCode duy nhất. Chạy thật trên Java 21:</p>
${MA_DOS}
${OUT_DOS}
<div class="callout warn"><p>Tại Chaos Communication Congress lần thứ 28 (28/12/2011), Alexander Klink và Julian Wälde chỉ ra rằng các framework web bỏ tham số request vào bảng băm — nên một POST với vài trăm nghìn tên tham số va chạm có thể giữ CPU của server bận hàng phút; lỗi ảnh hưởng server PHP, ASP.NET, Python, Ruby và Java (oCERT-2011-003). Tomcat đáp lại bằng giới hạn số tham số mỗi request (<code>maxParameterCount</code>: 10 000 ở bản vá 2012, mặc định 1 000 ở Tomcat 11 — bản nằm trong Spring Boot 4); Java 8 đổi HashMap để ngăn quá đông thành cây cân bằng (JEP 180) — vì thế 65 536 <em>chuỗi</em> va chạm ở trên chỉ tốn 30 ms thay vì hàng phút. Lớp bảo vệ này chỉ có tác dụng với khoá <code>Comparable</code>: class <code>BadKey</code>, không có thứ tự, vẫn chậm hơn khoá thường hơn 500 lần. <strong>Cách phòng:</strong> giữ giới hạn kích thước request và số tham số (mặc định của Tomcat, cùng <code>spring.servlet.multipart.*</code> và giới hạn kích thước JSON), dùng <code>String</code>/<code>Long</code>/record làm khoá map lấy từ dữ liệu người dùng, và không bao giờ viết hashCode trả hằng số.</p></div>

<h3>Collection bất biến và bốn cái bẫy kinh điển</h3>
${MA_BAT}
${OUT_BAT}
<ul>
  <li><strong><code>List.of</code>, <code>Set.of</code>, <code>Map.of</code></strong> bất biến thật và từ chối <code>null</code>. Hợp cho hằng số và cho dữ liệu trả ra từ phương thức.</li>
  <li><strong><code>Arrays.asList</code></strong> là <em>khung nhìn</em> cỡ cố định lên mảng: <code>set</code> ghi xuyên xuống mảng, <code>add</code> thì lỗi.</li>
  <li><strong>Xoá trong vòng for-each</strong> ném <code>ConcurrentModificationException</code> (kể cả khi chỉ có một luồng). Dùng <code>removeIf</code> hoặc <code>Iterator.remove()</code>.</li>
  <li><strong>Thứ tự duyệt của <code>Map.of</code>/<code>Set.of</code> đổi giữa các lần chạy JVM</strong> — cố ý (xáo ngẫu nhiên mỗi lần chạy) để không ai dựa vào nó. Nếu thứ tự lọt vào response JSON hay câu kiểm trong test, dùng <code>LinkedHashMap</code> hoặc sắp xếp.</li>
</ul>

<h3>Chọn Map: thứ tự, sắp xếp, cache, khoảng</h3>
${MA_MAPS}
${OUT_MAPS}
<ul>
  <li><strong>HashMap</strong> — không hứa thứ tự. <strong>LinkedHashMap</strong> — thứ tự chèn (hoặc thứ tự truy cập). <strong>TreeMap</strong> — khoá đã sắp.</li>
  <li><strong>Sắp xếp tiếng Việt:</strong> TreeMap đặt "Đồ hoạ" <em>cuối cùng</em>, vì <code>String.compareTo</code> so mã Unicode và Đ (U+0110) đứng sau mọi chữ ASCII. Với tên hiện cho người dùng, sắp bằng <code>Collator.getInstance(Locale.forLanguageTag("vi"))</code> — hoặc để PostgreSQL sắp theo collation tiếng Việt.</li>
  <li><strong>Cache LRU trong sáu dòng:</strong> <code>LinkedHashMap</code> theo thứ tự truy cập cộng <code>removeEldestEntry</code>. Chương 13 thay nó bằng Redis.</li>
  <li><strong>Câu hỏi về khoảng:</strong> <code>floorEntry</code>/<code>ceilingKey</code> trả lời "lượt nào bắt đầu ngay trước/sau 09:30?" trong O(log n) — bản trong bộ nhớ của phép kiểm trùng mà LabFlow sau này làm bằng SQL với exclusion constraint (Chương 7).</li>
</ul>

<h3>So với Node.js / JavaScript</h3>
<p>JavaScript có một loại mảng (engine lưu dạng mảng đặc khi có thể) và <code>Map</code>/<code>Set</code> luôn giữ thứ tự chèn, so khoá theo danh tính — hai object trông giống nhau là hai khoá khác nhau, và không có cách nào gắn <code>hashCode</code> của riêng bạn. Trong Java bạn quyết định thứ tự và phép bằng nhau một cách tường minh bằng việc chọn class.</p>

<h3>Liên hệ đời thường</h3>
<p>HashMap giống bức tường hộc thư ở phòng thư ký túc xá, mỗi hộc dán hai số cuối của số phòng. Người đưa thư (hashCode) đi thẳng tới đúng hộc; trong hộc có vài lá thư phải dò theo tên (equals). Nếu ai đó chơi khăm gửi 60 000 lá thư toàn cho phòng có đuôi 12, một hộc tràn và mọi người ở phòng đuôi 12 phải chờ — đó là HashDoS. Cách Java sửa là xếp hộc bị tràn theo thứ tự chữ cái để vẫn tìm nhanh.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"HashMap hoạt động bên trong thế nào?"</strong> — Mảng các ngăn; chỉ số từ hash đã trộn và <code>n − 1</code>; va chạm xếp chuỗi trong ngăn, so bằng <code>equals</code>; giãn ×2 ở hệ số tải 0,75; ngăn hơn 8 phần tử thành cây đỏ-đen (mảng ≥ 64). get/put trung bình O(1).</li>
  <li><strong>"Ghi đè equals mà không ghi đè hashCode thì sao?"</strong> — Đối tượng bằng nhau rơi vào ngăn khác nhau; HashSet giữ phần tử trùng và tra cứu thất bại.</li>
  <li><strong>"ArrayList hay LinkedList?"</strong> — Gần như luôn ArrayList: truy cập ngẫu nhiên O(1), thân thiện bộ đệm; LinkedList chỉ thắng khi chèn/xoá nhiều ở vị trí iterator đã biết; thao tác hai đầu thì dùng ArrayDeque.</li>
  <li><strong>"HashMap có an toàn đa luồng không? Dùng gì thay?"</strong> — Không. <code>ConcurrentHashMap</code>, không phải <code>Collections.synchronizedMap</code> hay Hashtable (Chương 2).</li>
  <li><strong>"Vì sao khoá của map nên bất biến?"</strong> — Đổi khoá là đổi hash; phần tử kẹt ở ngăn cũ, không tìm được cũng không xoá được.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Cho danh sách 10 record lượt đặt <code>(student, labName)</code>, đếm số lượt theo phòng bằng <code>Map</code> và <code>merge</code>, rồi in các phòng <em>sắp theo tên tiếng Việt</em> (dùng <code>TreeMap</code> với Collator).</li>
  <li>Viết <code>class StudentKey</code> có trường <code>code</code> sửa được, chỉ ghi đè <code>equals</code>, và cho thấy bằng <code>HashSet</code> rằng phần tử trùng xuất hiện. Rồi đổi thành record và cho thấy chúng biến mất.</li>
  <li>Sửa <code>ListPerf</code> để chèn 20 000 phần tử vào đầu một <code>ArrayDeque</code> bằng <code>addFirst</code>, và so với hai loại list.</li>
</ol>
<p><strong>Đạt khi:</strong> "Đồ hoạ" được in giữa "Cơ khí" và "Mạng" (không phải cuối cùng), và số đo cho thấy ArrayDeque cùng tầm với LinkedList khi chèn đầu.</p></div>
${giai('Xem lời giải bước 1', `${java(`
record Booking(String student, String lab) {}

var bookings = List.of(new Booking("An", "Mạng"), new Booking("Bình", "Đồ hoạ"), new Booking("Chi", "Cơ khí"),
        new Booking("Dũng", "Mạng"), new Booking("Em", "AI"), new Booking("Giang", "Đồ hoạ"));
var counts = new TreeMap<String, Integer>(Collator.getInstance(Locale.forLanguageTag("vi")));
for (var b : bookings) counts.merge(b.lab(), 1, Integer::sum);
System.out.println(counts);`)}
${out(`$ java Practice15.java
{AI=1, Cơ khí=1, Đồ hoạ=2, Mạng=2}`)}
<p><code>merge(key, 1, Integer::sum)</code> chèn 1 ở lần đầu và cộng thêm 1 các lần sau — một dòng thay cho điệu nhảy get/kiểm null/put. Collator biết rằng trong tiếng Việt Đ đứng ngay sau D.</p>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket (ngăn)</span><span class="v">Một ô trong mảng bên trong HashMap, chứa các phần tử có hash rơi vào đó.</span></div>
  <div class="kv"><span class="k">Hệ số tải (load factor)</span><span class="v">Tỉ lệ đầy (mặc định 0,75) mà tại đó mảng gấp đôi.</span></div>
  <div class="kv"><span class="k">Va chạm (collision)</span><span class="v">Hai khoá cùng một ngăn — bình thường, xử lý bằng equals.</span></div>
  <div class="kv"><span class="k">Treeify</span><span class="v">Biến ngăn quá đông thành cây đỏ-đen (Java 8, JEP 180).</span></div>
  <div class="kv"><span class="k">Hợp đồng equals/hashCode</span><span class="v">Đối tượng bằng nhau phải có hash bằng nhau.</span></div>
  <div class="kv"><span class="k">HashDoS</span><span class="v">Từ chối dịch vụ bằng cách gửi các khoá va chạm hết với nhau.</span></div>
  <div class="kv"><span class="k">Collection không sửa được</span><span class="v"><code>List.of</code>, <code>List.copyOf</code>… — mọi thay đổi đều ném exception.</span></div>
  <div class="kv"><span class="k">ConcurrentModificationException</span><span class="v">Ném ra khi collection đổi cấu trúc giữa lúc đang duyệt (fail-fast).</span></div>
  <div class="kv"><span class="k">LRU</span><span class="v">Least Recently Used — loại phần tử lâu nhất không được dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mặc định dùng ArrayList, HashMap, HashSet; chỉ chọn Linked*/Tree* khi cần thứ tự, sắp xếp hoặc khoảng.</li>
  <li>HashMap = ngăn + hash + equals; giãn ở 0,75; ngăn đông thành cây.</li>
  <li>equals và hashCode đi cùng nhau; khoá map không được đổi — record giải quyết cả hai.</li>
  <li><code>List.of</code> bất biến và ghét null; thứ tự <code>Map.of</code> ngẫu nhiên mỗi lần chạy.</li>
  <li>Khoá do kẻ tấn công chọn có thể cố ý va chạm (HashDoS); giới hạn và khoá Comparable giữ bạn an toàn.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://openjdk.org/jeps/180', '📄', 'JEP 180: Handle Frequent HashMap Collisions with Balanced Trees', 'Thay đổi của Java 8 ra đời để đáp lại HashDoS.')}
${tl('https://fahrplan.events.ccc.de/congress/2011/Fahrplan/events/4680.en.html', '🎥', '28C3 — Efficient Denial of Service Attacks on Web Application Platforms', 'Bài nói gốc của Klink và Wälde (12/2011).')}

<h3>Nguồn</h3>
<ul>
  <li>Mã nguồn OpenJDK, <code>java.util.HashMap</code> (DEFAULT_LOAD_FACTOR, TREEIFY_THRESHOLD = 8, MIN_TREEIFY_CAPACITY = 64): <a href="https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/util/HashMap.java" target="_blank" rel="noopener">github.com/openjdk/jdk21u</a></li>
  <li>Cảnh báo oCERT 2011-003, nhiều nền tảng bị từ chối dịch vụ qua va chạm hàm băm: <a href="https://ocert.org/advisories/ocert-2011-003.html" target="_blank" rel="noopener">ocert.org/advisories/ocert-2011-003.html</a></li>
  <li>Tài liệu cấu hình Apache Tomcat, HTTP connector <code>maxParameterCount</code>: <a href="https://tomcat.apache.org/tomcat-11.0-doc/config/http.html" target="_blank" rel="noopener">tomcat.apache.org/tomcat-11.0-doc/config/http.html</a></li>
  <li>Javadoc <code>java.util.Map</code> — "Unmodifiable Maps" (thứ tự duyệt không xác định và có thể đổi): <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html#unmodifiable" target="_blank" rel="noopener">docs.oracle.com/en/java/javase/21</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.6 — Lab chương 1 ═══════════════════════════ */
const MA_LAB_STARTER = java(`
import java.time.*;
import java.util.*;

public class LabFlowStarter {
    // ── Mô hình ──────────────────────────────────────────────────────────────
    record Lab(long id, String name, String building, int capacity) {
        Lab {
            Objects.requireNonNull(name, "name");
            if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        }
    }
    record TimeSlot(LocalDate date, LocalTime start, LocalTime end) {
        static final LocalTime OPEN = LocalTime.of(7, 0), CLOSE = LocalTime.of(21, 0);
        TimeSlot {
            if (!start.isBefore(end)) throw new IllegalArgumentException("start must be before end");
            if (start.isBefore(OPEN) || end.isAfter(CLOSE)) throw new IllegalArgumentException("labs open 07:00–21:00");
        }
        boolean overlaps(TimeSlot o) { throw new UnsupportedOperationException("TODO overlaps"); }
    }
    sealed interface BookingStatus permits Pending, Approved, Rejected, Cancelled {}
    record Pending() implements BookingStatus {}
    record Approved(String by) implements BookingStatus {}
    record Rejected(String by, String reason) implements BookingStatus {}
    record Cancelled(Instant at) implements BookingStatus {}

    record Booking(long id, long labId, String studentId, TimeSlot slot, BookingStatus status) {
        boolean active() { return switch (status) { case Pending p -> true; case Approved a -> true; case Rejected r -> false; case Cancelled c -> false; }; }
        Booking with(BookingStatus s) { return new Booking(id, labId, studentId, slot, s); }
    }
    static final class BookingConflictException extends RuntimeException {
        BookingConflictException(String msg) { super(msg); }
    }
    static final class NotFoundException extends RuntimeException {
        NotFoundException(String what, long id) { super(what + " " + id + " not found"); }
    }

    // ── Dịch vụ (bộ nhớ trong) ───────────────────────────────────────────────
    static final class BookingService {
        private final Map<Long, Lab> labs = new HashMap<>();
        private final Map<Long, Booking> bookings = new LinkedHashMap<>();   // giữ thứ tự tạo
        private long nextId = 1;

        void addLab(Lab lab) { labs.put(lab.id(), lab); }

        Booking book(long labId, String studentId, TimeSlot slot) {
            throw new UnsupportedOperationException("TODO book");
        }
        Booking approve(long id, String by) { return transition(id, new Approved(by)); }
        Booking reject(long id, String by, String reason) { return transition(id, new Rejected(by, reason)); }
        Booking cancel(long id, Instant at) { return transition(id, new Cancelled(at)); }

        private Booking transition(long id, BookingStatus next) {
            throw new UnsupportedOperationException("TODO transition");
        }
        Map<String, Long> countByStatus() {
            return Map.of();   // TODO
        }
    }

    // ── Kiểm tra (chạy: java LabFlow.java) ──────────────────────────────────
    static int pass = 0, fail = 0;
    static void check(String name, Runnable r) {
        try { r.run(); pass++; System.out.println("PASS " + name); }
        catch (Throwable t) { fail++; System.out.println("FAIL " + name + " — " + t); }
    }
    static void expect(Class<? extends Throwable> type, Runnable r) {
        try { r.run(); } catch (Throwable t) { if (type.isInstance(t)) return; throw new AssertionError("expected " + type.getSimpleName() + " got " + t); }
        throw new AssertionError("expected " + type.getSimpleName());
    }
    static void eq(Object want, Object got) { if (!Objects.equals(want, got)) throw new AssertionError("want " + want + " got " + got); }

    public static void main(String[] args) {
        var d = LocalDate.of(2026, 11, 20);
        TimeSlot s8 = new TimeSlot(d, LocalTime.of(8, 0), LocalTime.of(10, 0));
        var svc = new BookingService();
        svc.addLab(new Lab(1, "Lab AI", "Alpha", 30));
        svc.addLab(new Lab(2, "Lab IoT", "Beta", 24));

        check("1 record equals theo giá trị", () -> eq(new Lab(9, "X", "A", 1), new Lab(9, "X", "A", 1)));
        check("2 capacity 0 bị chặn", () -> expect(IllegalArgumentException.class, () -> new Lab(3, "X", "A", 0)));
        check("3 khung giờ ngoài 07–21 bị chặn", () -> expect(IllegalArgumentException.class, () -> new TimeSlot(d, LocalTime.of(20, 0), LocalTime.of(22, 0))));
        check("4 đặt được", () -> eq(1L, svc.book(1, "SE1001", s8).id()));
        check("5 trùng giờ cùng phòng ⇒ 409", () -> expect(BookingConflictException.class,
                () -> svc.book(1, "SE1002", new TimeSlot(d, LocalTime.of(9, 0), LocalTime.of(11, 0)))));
        check("6 sát giờ (10:00) không tính là trùng", () -> svc.book(1, "SE1002", new TimeSlot(d, LocalTime.of(10, 0), LocalTime.of(12, 0))));
        check("7 phòng khác cùng giờ được", () -> svc.book(2, "SE1003", s8));
        check("8 sinh viên tối đa 2 lượt/ngày", () -> {
            svc.book(2, "SE1001", new TimeSlot(d, LocalTime.of(13, 0), LocalTime.of(14, 0)));
            expect(BookingConflictException.class, () -> svc.book(2, "SE1001", new TimeSlot(d, LocalTime.of(15, 0), LocalTime.of(16, 0))));
        });
        check("9 duyệt rồi huỷ được, huỷ rồi không duyệt lại", () -> {
            svc.approve(1, "cô Lan");
            svc.cancel(1, Instant.parse("2026-11-19T10:00:00Z"));
            expect(IllegalStateException.class, () -> svc.approve(1, "cô Lan"));
        });
        check("10 huỷ xong thì giờ đó đặt lại được", () -> svc.book(1, "SE1004", s8));
        check("11 phòng không tồn tại ⇒ NotFound", () -> expect(NotFoundException.class, () -> svc.book(99, "SE1", s8)));
        System.out.println(svc.countByStatus());
        System.out.println(pass + " pass, " + fail + " fail");
    }
}`);
const MA_LAB_GIAI = java(`
// TimeSlot
boolean overlaps(TimeSlot o) { return date.equals(o.date) && start.isBefore(o.end) && o.start.isBefore(end); }

// BookingService
Booking book(long labId, String studentId, TimeSlot slot) {
    if (!labs.containsKey(labId)) throw new NotFoundException("Lab", labId);
    for (Booking b : bookings.values())
        if (b.labId() == labId && b.active() && b.slot().overlaps(slot))
            throw new BookingConflictException("Lab " + labId + " already booked " + b.slot().start() + "–" + b.slot().end());
    long sameDay = bookings.values().stream()
            .filter(b -> b.studentId().equals(studentId) && b.active() && b.slot().date().equals(slot.date())).count();
    if (sameDay >= 2) throw new BookingConflictException("Student " + studentId + " already has 2 bookings on " + slot.date());
    var b = new Booking(nextId++, labId, studentId, slot, new Pending());
    bookings.put(b.id(), b);
    return b;
}
Booking approve(long id, String by) { return transition(id, new Approved(by)); }
Booking reject(long id, String by, String reason) { return transition(id, new Rejected(by, reason)); }
Booking cancel(long id, Instant at) { return transition(id, new Cancelled(at)); }

private Booking transition(long id, BookingStatus next) {
    var cur = Optional.ofNullable(bookings.get(id)).orElseThrow(() -> new NotFoundException("Booking", id));
    boolean ok = switch (cur.status()) {
        case Pending p -> true;                                   // chờ duyệt ⇒ đi đâu cũng được
        case Approved a -> next instanceof Cancelled;             // đã duyệt ⇒ chỉ được huỷ
        case Rejected r -> false;
        case Cancelled c -> false;
    };
    if (!ok) throw new IllegalStateException(cur.status().getClass().getSimpleName() + " -> " + next.getClass().getSimpleName() + " not allowed");
    var updated = cur.with(next);
    bookings.put(id, updated);
    return updated;
}
Map<String, Long> countByStatus() {
    var out = new TreeMap<String, Long>();
    for (Booking b : bookings.values()) {
        String k = switch (b.status()) {
            case Pending p -> "PENDING"; case Approved a -> "APPROVED";
            case Rejected r -> "REJECTED"; case Cancelled c -> "CANCELLED";
        };
        out.merge(k, 1L, Long::sum);
    }
    return out;
}`);
const OUT_LAB_STARTER = out(`$ java LabFlowStarter.java
PASS 1 record equals theo giá trị
PASS 2 capacity 0 bị chặn
PASS 3 khung giờ ngoài 07–21 bị chặn
FAIL 4 đặt được — java.lang.UnsupportedOperationException: TODO book
FAIL 5 trùng giờ cùng phòng ⇒ 409 — java.lang.AssertionError: expected BookingConflictException got java.lang.UnsupportedOperationException: TODO book
FAIL 6 sát giờ (10:00) không tính là trùng — java.lang.UnsupportedOperationException: TODO book
FAIL 7 phòng khác cùng giờ được — java.lang.UnsupportedOperationException: TODO book
FAIL 8 sinh viên tối đa 2 lượt/ngày — java.lang.UnsupportedOperationException: TODO book
FAIL 9 duyệt rồi huỷ được, huỷ rồi không duyệt lại — java.lang.UnsupportedOperationException: TODO transition
FAIL 10 huỷ xong thì giờ đó đặt lại được — java.lang.UnsupportedOperationException: TODO book
FAIL 11 phòng không tồn tại ⇒ NotFound — java.lang.AssertionError: expected NotFoundException got java.lang.UnsupportedOperationException: TODO book
{}
3 pass, 8 fail`);
const OUT_LAB_XONG = out(`$ java LabFlow.java
PASS 1 record equals theo giá trị
PASS 2 capacity 0 bị chặn
PASS 3 khung giờ ngoài 07–21 bị chặn
PASS 4 đặt được
PASS 5 trùng giờ cùng phòng ⇒ 409
PASS 6 sát giờ (10:00) không tính là trùng
PASS 7 phòng khác cùng giờ được
PASS 8 sinh viên tối đa 2 lượt/ngày
PASS 9 duyệt rồi huỷ được, huỷ rồi không duyệt lại
PASS 10 huỷ xong thì giờ đó đặt lại được
PASS 11 phòng không tồn tại ⇒ NotFound
{CANCELLED=1, PENDING=4}
11 pass, 0 fail`);
const OUT_LAB_NOSHOW = out(`$ javac LabFlowNoShow.java        # solution + "record NoShow() implements BookingStatus {}" in permits
LabFlowNoShow.java:64: error: the switch expression does not cover all possible input values
LabFlowNoShow.java:78: error: the switch expression does not cover all possible input values
LabFlowNoShow.java:28: error: the switch expression does not cover all possible input values
3 errors`);

const L16_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.6 · Lab</span>
<h2>Chapter 1 lab: model LabFlow in modern Java + interview questions</h2>
<p class="lead">Time to use everything from this chapter in one program: records with validation, a sealed state machine, exhaustive switches, business exceptions and the right collections. You will build the in-memory core of LabFlow's booking rules — the same rules the Spring Boot API enforces in later chapters, and the same problem as Project 1 of the Node.js course, so you can compare the two solutions side by side. No Spring, no database: just Java 21 and one file.</p>

<h3>The specification</h3>
<ul>
  <li>A <strong>Lab</strong> has an id, a name, a building and a capacity &gt; 0.</li>
  <li>A <strong>TimeSlot</strong> is a date plus start and end times; start before end; inside opening hours 07:00–21:00. Slots that only touch (08:00–10:00 and 10:00–12:00) do not overlap.</li>
  <li>A <strong>Booking</strong> is Pending → Approved or Rejected; Pending or Approved → Cancelled. Rejected and Cancelled are final.</li>
  <li><strong>Rules:</strong> no two <em>active</em> bookings (Pending or Approved) of the same lab may overlap; a student may hold at most 2 active bookings per day; a cancelled slot can be booked again.</li>
  <li>Errors: <code>NotFoundException</code> (unknown lab or booking), <code>BookingConflictException</code> (overlap or the per-day limit — later an HTTP 409), <code>IllegalStateException</code> (forbidden transition).</li>
</ul>

<h3>Starter file</h3>
<p>The model and the test harness are given; three methods are left as <code>TODO</code>. Save this as <code>LabFlowStarter.java</code> and run it with <code>java LabFlowStarter.java</code> — the single-file launcher compiles and runs it, no Maven needed.</p>
${MA_LAB_STARTER}
<p>As delivered, it really prints:</p>
${OUT_LAB_STARTER}

<h3>Your tasks</h3>
<ol>
  <li>Implement <code>TimeSlot.overlaps</code> (lesson 1.1 practice).</li>
  <li>Implement <code>book</code>: unknown lab ⇒ <code>NotFoundException</code>; overlap with an active booking of the same lab ⇒ <code>BookingConflictException</code>; third active booking of the student that day ⇒ <code>BookingConflictException</code>; otherwise store a new <code>Pending</code> booking with the next id.</li>
  <li>Implement <code>transition</code> with a switch over the <em>current</em> status — no <code>default</code> — following the state rules above.</li>
  <li>Implement <code>countByStatus</code> returning a sorted map such as <code>{CANCELLED=1, PENDING=4}</code>.</li>
  <li><strong>Break it on purpose:</strong> add <code>record NoShow()</code> to the <code>permits</code> list, rebuild, and write down how many places the compiler sends you to. Then decide what a no-show means for each one (is it active? which transitions lead to it?).</li>
</ol>
<p><strong>Done when:</strong> <code>11 pass, 0 fail</code>, and step 5 has been answered in a short comment in your file.</p>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">3 pts — tests</span><span class="v">All 11 checks pass (deduct 1 per failing group: overlap, per-day limit, transitions).</span></div>
  <div class="kv"><span class="k">2 pts — exhaustive switches</span><span class="v">No <code>default</code> over <code>BookingStatus</code>; adding NoShow breaks the build in every relevant place.</span></div>
  <div class="kv"><span class="k">2 pts — immutability</span><span class="v">Bookings are records; a transition stores a <em>new</em> record (<code>with(...)</code>), never mutates.</span></div>
  <div class="kv"><span class="k">2 pts — exceptions</span><span class="v">Business errors are unchecked, specific, with messages that name the lab/booking/student.</span></div>
  <div class="kv"><span class="k">1 pt — collections</span><span class="v">A justified choice of maps (e.g. LinkedHashMap to keep creation order; TreeMap for sorted stats).</span></div>
</div>

${giai('Show the reference solution (try first!)', `${MA_LAB_GIAI}
${OUT_LAB_XONG}
<p>And step 5 — adding <code>NoShow</code> to the solution — really gives three compile errors, one per switch over the status:</p>
${OUT_LAB_NOSHOW}
<p>Design notes. (1) The per-day count uses a stream (Chapter 2) — a loop with a counter is equally fine. (2) Scanning every booking is O(n); with thousands of bookings you would keep a <code>Map&lt;Long, TreeMap&lt;LocalDateTime, Booking&gt;&gt;</code> per lab (lesson 1.5) — or, from Chapter 7 on, let PostgreSQL enforce it with an exclusion constraint, which is also the only version that stays correct when two requests arrive at the same moment. (3) <code>transition</code> decides on the current state only; a richer model would also check <em>who</em> may approve (Chapter 9).</p>`)}

<h3>Compare with the Node.js course</h3>
<p>Project 1 of the Node.js course solves the same booking rules in TypeScript. Typical differences you will notice: TypeScript's union of object types with a <code>kind</code> field instead of sealed records (and a manual <code>never</code> check for exhaustiveness); <code>Date</code> objects instead of separate <code>LocalDate</code>/<code>LocalTime</code> types (timezone bugs are easier to write); thrown <code>Error</code> subclasses with no checked/unchecked distinction. Being able to explain these trade-offs is exactly what "full-stack Node + Spring" interviews look for.</p>

<h3>🎤 Chapter 1 interview questions — and how to answer</h3>
<ol>
  <li><strong>"What is the difference between <code>==</code> and <code>equals</code>? What does a record do here?"</strong> — <code>==</code> compares references for objects; <code>equals</code> compares meaning. A record generates <code>equals</code>/<code>hashCode</code> over all components, so two records with the same data are equal (lesson 1.1 output: <code>a == b</code> false, <code>a.equals(b)</code> true).</li>
  <li><strong>"Explain HashMap internals and the equals/hashCode contract."</strong> — Buckets, spread hash, <code>equals</code> within a bucket, resize at 0.75, treeify after 8; equal objects must share a hash code or HashSet keeps duplicates (lesson 1.5, measured).</li>
  <li><strong>"Checked vs unchecked — which do you use in a Spring service?"</strong> — Unchecked business exceptions mapped centrally to HTTP; mention that <code>@Transactional</code> rolls back only on unchecked by default.</li>
  <li><strong>"What do sealed classes and pattern matching give you over an enum or a class hierarchy?"</strong> — Different data per alternative <em>and</em> a closed set the compiler can check; adding a state breaks the build where it matters (3 errors in this lab).</li>
  <li><strong>"Why is immutability useful in a multi-threaded server?"</strong> — Immutable objects can be shared across request threads without locks, final fields are safely published, and they are safe as map keys and cache values.</li>
</ol>

<h3>📌 Chapter 1 checklist</h3>
<ul>
  <li>I can write a record with a compact constructor and explain why it is not a JPA entity.</li>
  <li>I can model states with sealed records and switch over them without <code>default</code>.</li>
  <li>I can read generic signatures (<code>? extends</code>, <code>? super</code>) and pass lambdas/method references to them.</li>
  <li>I can design unchecked business exceptions that keep their cause, and read a stack trace from the last <code>Caused by</code>.</li>
  <li>I can choose List/Set/Map implementations and explain HashMap and HashDoS.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>JEP 330 Launch Single-File Source-Code Programs (<code>java File.java</code>): <a href="https://openjdk.org/jeps/330" target="_blank" rel="noopener">openjdk.org/jeps/330</a></li>
  <li>All outputs on this page: Java 21.0.12.1 (Temurin), code in the course lab folder <code>lab/c1/lab1</code>, run 18 November 2026.</li>
</ul>
</div>
`;

const L16_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.6 · Lab</span>
<h2>Lab chương 1: mô hình hoá LabFlow bằng Java hiện đại + câu hỏi phỏng vấn</h2>
<p class="lead">Đến lúc dùng mọi thứ của chương trong một chương trình: record có kiểm tra, máy trạng thái sealed, switch đầy đủ, exception nghiệp vụ và đúng loại collection. Bạn sẽ dựng phần lõi trong bộ nhớ của luật đặt phòng LabFlow — đúng các luật mà API Spring Boot ép buộc ở các chương sau, và cùng đề với Dự án 1 của khoá Node.js, để bạn so hai lời giải cạnh nhau. Không Spring, không cơ sở dữ liệu: chỉ Java 21 và một tệp.</p>

<h3>Đặc tả</h3>
<ul>
  <li><strong>Lab</strong> có id, tên, toà nhà và sức chứa &gt; 0.</li>
  <li><strong>TimeSlot</strong> là một ngày cộng giờ bắt đầu và kết thúc; bắt đầu trước kết thúc; trong giờ mở cửa 07:00–21:00. Hai khung chỉ chạm nhau (08:00–10:00 và 10:00–12:00) không tính là trùng.</li>
  <li><strong>Booking</strong> đi từ Pending → Approved hoặc Rejected; Pending hoặc Approved → Cancelled. Rejected và Cancelled là trạng thái cuối.</li>
  <li><strong>Luật:</strong> hai lượt <em>đang hiệu lực</em> (Pending hoặc Approved) của cùng một phòng không được trùng giờ; mỗi sinh viên tối đa 2 lượt hiệu lực mỗi ngày; khung giờ đã huỷ thì đặt lại được.</li>
  <li>Lỗi: <code>NotFoundException</code> (phòng hoặc lượt không tồn tại), <code>BookingConflictException</code> (trùng giờ hoặc vượt giới hạn ngày — sau này là HTTP 409), <code>IllegalStateException</code> (bước chuyển bị cấm).</li>
</ul>

<h3>Tệp khởi đầu</h3>
<p>Mô hình và bộ kiểm tra có sẵn; ba phương thức để <code>TODO</code>. Lưu thành <code>LabFlowStarter.java</code> rồi chạy <code>java LabFlowStarter.java</code> — trình chạy tệp đơn tự biên dịch và chạy, không cần Maven.</p>
${MA_LAB_STARTER}
<p>Nguyên trạng, nó in ra thật:</p>
${OUT_LAB_STARTER}

<h3>Việc của bạn</h3>
<ol>
  <li>Viết <code>TimeSlot.overlaps</code> (bài thực hành 1.1).</li>
  <li>Viết <code>book</code>: phòng không tồn tại ⇒ <code>NotFoundException</code>; trùng với lượt hiệu lực của cùng phòng ⇒ <code>BookingConflictException</code>; lượt hiệu lực thứ ba của sinh viên trong ngày ⇒ <code>BookingConflictException</code>; còn lại lưu một lượt <code>Pending</code> mới với id kế tiếp.</li>
  <li>Viết <code>transition</code> bằng switch trên trạng thái <em>hiện tại</em> — không <code>default</code> — theo luật trạng thái ở trên.</li>
  <li>Viết <code>countByStatus</code> trả về map đã sắp, ví dụ <code>{CANCELLED=1, PENDING=4}</code>.</li>
  <li><strong>Cố tình phá:</strong> thêm <code>record NoShow()</code> vào danh sách <code>permits</code>, build lại, và ghi lại trình biên dịch đưa bạn tới mấy chỗ. Rồi quyết định "không đến" nghĩa là gì ở từng chỗ (có tính là hiệu lực không? bước chuyển nào dẫn tới nó?).</li>
</ol>
<p><strong>Đạt khi:</strong> <code>11 pass, 0 fail</code>, và bước 5 được trả lời bằng một chú thích ngắn trong tệp.</p>

<h3>Thang điểm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">3 điểm — kiểm tra</span><span class="v">Qua cả 11 mục (trừ 1 điểm mỗi nhóm hỏng: trùng giờ, giới hạn ngày, bước chuyển).</span></div>
  <div class="kv"><span class="k">2 điểm — switch đầy đủ</span><span class="v">Không có <code>default</code> trên <code>BookingStatus</code>; thêm NoShow làm build đỏ ở mọi chỗ liên quan.</span></div>
  <div class="kv"><span class="k">2 điểm — bất biến</span><span class="v">Lượt đặt là record; mỗi bước chuyển lưu một record <em>mới</em> (<code>with(...)</code>), không sửa tại chỗ.</span></div>
  <div class="kv"><span class="k">2 điểm — exception</span><span class="v">Lỗi nghiệp vụ là unchecked, cụ thể, thông điệp nêu rõ phòng/lượt/sinh viên.</span></div>
  <div class="kv"><span class="k">1 điểm — collection</span><span class="v">Chọn map có lý do (vd. LinkedHashMap để giữ thứ tự tạo; TreeMap cho thống kê đã sắp).</span></div>
</div>

${giai('Xem lời giải tham khảo (tự làm trước!)', `${MA_LAB_GIAI}
${OUT_LAB_XONG}
<p>Và bước 5 — thêm <code>NoShow</code> vào lời giải — cho ra đúng ba lỗi biên dịch thật, mỗi switch trên trạng thái một lỗi:</p>
${OUT_LAB_NOSHOW}
<p>Ghi chú thiết kế. (1) Phép đếm theo ngày dùng stream (Chương 2) — vòng lặp với biến đếm cũng ổn. (2) Duyệt mọi lượt đặt là O(n); với hàng nghìn lượt bạn sẽ giữ <code>Map&lt;Long, TreeMap&lt;LocalDateTime, Booking&gt;&gt;</code> cho mỗi phòng (bài 1.5) — hoặc, từ Chương 7, để PostgreSQL ép buộc bằng exclusion constraint, cũng là phiên bản duy nhất còn đúng khi hai request tới cùng một lúc. (3) <code>transition</code> chỉ xét trạng thái hiện tại; mô hình đầy đủ hơn còn kiểm <em>ai</em> được duyệt (Chương 9).</p>`)}

<h3>So với khoá Node.js</h3>
<p>Dự án 1 của khoá Node.js giải cùng bộ luật đặt phòng bằng TypeScript. Khác biệt bạn sẽ thấy: union các kiểu object có trường <code>kind</code> thay cho record sealed (và tự viết kiểm <code>never</code> để có tính đầy đủ); đối tượng <code>Date</code> thay cho hai kiểu riêng <code>LocalDate</code>/<code>LocalTime</code> (dễ viết lỗi múi giờ hơn); ném các lớp con của <code>Error</code> mà không phân biệt checked/unchecked. Giải thích được những đánh đổi này chính là điều các buổi phỏng vấn "full-stack Node + Spring" tìm kiếm.</p>

<h3>🎤 Câu hỏi phỏng vấn chương 1 — và cách trả lời</h3>
<ol>
  <li><strong>"<code>==</code> khác <code>equals</code> thế nào? Record làm gì ở đây?"</strong> — Với đối tượng, <code>==</code> so tham chiếu; <code>equals</code> so ý nghĩa. Record sinh <code>equals</code>/<code>hashCode</code> trên mọi thành phần, nên hai record cùng dữ liệu là bằng nhau (output bài 1.1: <code>a == b</code> false, <code>a.equals(b)</code> true).</li>
  <li><strong>"Giải thích bên trong HashMap và hợp đồng equals/hashCode."</strong> — Ngăn, hash đã trộn, <code>equals</code> trong ngăn, giãn ở 0,75, thành cây sau 8; đối tượng bằng nhau phải chung hash, nếu không HashSet giữ phần tử trùng (bài 1.5, đã đo).</li>
  <li><strong>"Checked hay unchecked — bạn dùng loại nào trong service Spring?"</strong> — Exception nghiệp vụ unchecked, đổi sang HTTP ở một chỗ trung tâm; nhắc rằng <code>@Transactional</code> mặc định chỉ rollback với unchecked.</li>
  <li><strong>"Sealed class và pattern matching cho bạn gì hơn enum hay cây class?"</strong> — Dữ liệu khác nhau cho mỗi lựa chọn <em>và</em> một tập đóng mà trình biên dịch kiểm được; thêm trạng thái là build đỏ đúng chỗ cần sửa (3 lỗi trong lab này).</li>
  <li><strong>"Vì sao bất biến hữu ích trong server đa luồng?"</strong> — Đối tượng bất biến chia cho mọi luồng request mà không cần khoá, trường final được công bố an toàn, và dùng an toàn làm khoá map hay giá trị cache.</li>
</ol>

<h3>📌 Danh sách tự kiểm chương 1</h3>
<ul>
  <li>Tôi viết được record có compact constructor và giải thích vì sao nó không làm entity JPA.</li>
  <li>Tôi mô hình hoá trạng thái bằng record sealed và switch trên chúng không cần <code>default</code>.</li>
  <li>Tôi đọc được chữ ký generic (<code>? extends</code>, <code>? super</code>) và truyền lambda/method reference vào.</li>
  <li>Tôi thiết kế được exception nghiệp vụ unchecked giữ nguyên nguyên nhân, và đọc stack trace từ <code>Caused by</code> cuối.</li>
  <li>Tôi chọn được List/Set/Map và giải thích được HashMap cùng HashDoS.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>JEP 330 Launch Single-File Source-Code Programs (<code>java File.java</code>): <a href="https://openjdk.org/jeps/330" target="_blank" rel="noopener">openjdk.org/jeps/330</a></li>
  <li>Mọi output trong trang này: Java 21.0.12.1 (Temurin), mã ở thư mục lab của khoá <code>lab/c1/lab1</code>, chạy ngày 18/11/2026.</li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.7 — Quiz ═══════════════════════════ */
const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ1 = [
  Q('Which members does the compiler generate for record Lab(long id, String name)?|||Trình biên dịch sinh những thành viên nào cho record Lab(long id, String name)?', [
    'Getters getId()/getName() and setters|||Getter getId()/getName() và setter',
    'Private final fields, a canonical constructor, accessors id()/name(), equals, hashCode, toString|||Trường private final, constructor chuẩn, accessor id()/name(), equals, hashCode, toString',
    'Only a constructor and toString|||Chỉ constructor và toString',
    'A no-argument constructor for JPA|||Một constructor rỗng cho JPA',
  ], 1),
  Q('A record has a component List<String> slots. Someone keeps the original ArrayList and adds to it. What happens?|||Một record có thành phần List<String> slots. Ai đó giữ ArrayList gốc rồi thêm phần tử. Chuyện gì xảy ra?', [
    'Compile error|||Lỗi biên dịch',
    'UnsupportedOperationException|||UnsupportedOperationException',
    'The record now shows the new element — records are only shallowly immutable unless you copy (List.copyOf)|||Record hiện luôn phần tử mới — record chỉ bất biến nông nếu không chép (List.copyOf)',
    'The record silently ignores the change|||Record lặng lẽ bỏ qua thay đổi',
  ], 2),
  Q('What is the type of list in: var list = new ArrayList<>();|||list có kiểu gì trong: var list = new ArrayList<>();', [
    'ArrayList<String>|||ArrayList<String>', 'ArrayList<Object>|||ArrayList<Object>', 'It does not compile|||Không biên dịch được', 'It is decided at run time|||Được quyết định lúc chạy',
  ], 1),
  Q('Why can a record not be a Hibernate entity?|||Vì sao record không làm entity Hibernate được?', [
    'Records cannot have annotations|||Record không gắn annotation được',
    'Records are final, have no no-arg constructor and cannot change — Hibernate needs all three|||Record là final, không có constructor rỗng và không đổi được — Hibernate cần cả ba điều đó',
    'Records cannot be serialised to JSON|||Record không chuyển sang JSON được',
    'Records are slower|||Record chậm hơn',
  ], 1),
  Q('You add record NoShow() to a sealed interface\'s permits list. Switch expressions over it without default now…|||Bạn thêm record NoShow() vào permits của một sealed interface. Các switch expression trên nó không có default giờ sẽ…', [
    'Fall into the first case|||Rơi vào case đầu tiên',
    'Throw MatchException at run time|||Ném MatchException lúc chạy',
    'Fail to compile with "does not cover all possible input values"|||Không biên dịch được với lỗi "does not cover all possible input values"',
    'Return null|||Trả null',
  ], 2),
  Q('Which statement about type erasure is true?|||Phát biểu nào về type erasure là đúng?', [
    'List<String> and List<Integer> are the same class at run time|||List<String> và List<Integer> là cùng một class lúc chạy',
    'You can write new T() in a generic method|||Có thể viết new T() trong phương thức generic',
    'Raw types are checked at run time|||Raw type được kiểm lúc chạy',
    'Erasure only applies to arrays|||Erasure chỉ áp dụng cho mảng',
  ], 0),
  Q('A method must add Integers into whatever list it receives. The best parameter type is…|||Một phương thức phải thêm Integer vào danh sách được truyền vào. Kiểu tham số tốt nhất là…', [
    'List<? extends Integer>|||List<? extends Integer>', 'List<? super Integer>|||List<? super Integer>', 'List<Object>|||List<Object>', 'List<?>|||List<?>',
  ], 1),
  Q('By default, @Transactional rolls back when the method throws…|||Mặc định @Transactional rollback khi phương thức ném…', [
    'Any Exception|||Bất kỳ Exception nào',
    'Only checked exceptions|||Chỉ checked exception',
    'RuntimeException and Error|||RuntimeException và Error',
    'Nothing — rollback must be configured|||Không gì cả — phải cấu hình rollback',
  ], 2),
  Q('A class overrides equals but not hashCode. Two equal instances are added to a HashSet. Size?|||Một class ghi đè equals nhưng không ghi đè hashCode. Thêm hai thể hiện bằng nhau vào HashSet. Kích thước?', [
    '1|||1', '2|||2', '0|||0', 'It throws|||Ném exception',
  ], 1),
  Q('How did Java 8 reduce the damage of HashDoS (many keys with the same hash)?|||Java 8 giảm tác hại của HashDoS (nhiều khoá cùng hash) bằng cách nào?', [
    'Random hash seeds for every String|||Seed băm ngẫu nhiên cho mọi String',
    'Crowded buckets turn into balanced trees, which helps for Comparable keys|||Ngăn quá đông biến thành cây cân bằng, có tác dụng với khoá Comparable',
    'HashMap rejects more than 10 000 keys|||HashMap từ chối quá 10 000 khoá',
    'It switched HashMap to a TreeMap|||Đổi HashMap thành TreeMap',
  ], 1),
];

export default {
  title: 'Chapter 1 — ⭐ Modern Java (1): types and data modelling|||Chương 1 — ⭐ Java hiện đại (1): kiểu dữ liệu và mô hình hoá',
  description: 'Java 21 bạn sẽ dùng suốt khoá, chạy thật từng dòng: record và bất biến, sealed + pattern matching, generics + lambda, exception, collections (đo thật ArrayList/LinkedList, HashMap bên trong, HashDoS), lab mô hình hoá LabFlow và câu hỏi phỏng vấn.',
  lessons: [
    {
      title: '1.1 — Records, var and immutability|||1.1 — Record, var và tính bất biến',
      slug: 'sb-1-1-record-var',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Record sinh gì (javap), compact constructor, bất biến nông, var và các lỗi của nó, vì sao record không làm entity, Jackson 3 và mass assignment (GitHub 2012).',
      content: L11_EN + L11_VI,
    },
    {
      title: '1.2 — Sealed types, pattern matching and switch expressions|||1.2 — Sealed, pattern matching và switch expression',
      slug: 'sb-1-2-pattern-matching',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Máy trạng thái lượt đặt bằng sealed + record, switch đầy đủ không default, record pattern và guard, lỗi biên dịch khi thêm trạng thái, Knight Capital 2012, so với TypeScript.',
      content: L12_EN + L12_VI,
    },
    {
      title: '1.3 — Generics, functional interfaces and lambdas|||1.3 — Generics, interface hàm và lambda',
      slug: 'sb-1-3-generics-lambda',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Type erasure và raw type, PECS, Function/Predicate/Supplier/Consumer, method reference, effectively final, invokedynamic, mẫu template của Spring.',
      content: L13_EN + L13_VI,
    },
    {
      title: '1.4 — Exceptions: checked vs unchecked|||1.4 — Exception: checked vs unchecked',
      slug: 'sb-1-4-exception-java',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Cây Throwable, vì sao Spring chọn unchecked, @Transactional và rollback, try-with-resources, giữ nguyên nhân, đọc stack trace, bốn thói quen xấu, Patreon 2015.',
      content: L14_EN + L14_VI,
    },
    {
      title: '1.5 — Collections: choosing List, Set, Map — and equals/hashCode|||1.5 — Collections: chọn đúng List, Set, Map — và equals/hashCode',
      slug: 'sb-1-5-collections',
      type: 'LESSON',
      isFreePreview: false,
      description: 'ArrayList vs LinkedList đo thật, HashMap bên trong (bucket, 0,75, treeify), equals/hashCode hỏng, HashDoS 2011, collection bất biến, TreeMap/LinkedHashMap/LRU, sắp xếp tiếng Việt.',
      content: L15_EN + L15_VI,
    },
    {
      title: '1.6 — Chapter 1 lab + interview questions|||1.6 — Lab chương 1 + câu hỏi phỏng vấn',
      slug: 'sb-1-6-lab-1',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Lõi luật đặt phòng LabFlow bằng record + sealed + exception + collections: tệp khởi đầu, 11 mục kiểm, thang điểm, lời giải ẩn, 5 câu phỏng vấn Java core.',
      content: L16_EN + L16_VI,
    },
    {
      title: '1.7 — Chapter 1 quiz|||1.7 — Kiểm tra chương 1',
      slug: 'sb-1-7-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về record, var, sealed, generics, exception, @Transactional, HashMap và HashDoS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from something you saw running in this chapter — a javap listing, a compiler error, a measurement. If you miss one, the explanation is in the lesson named in the question's topic.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ thứ bạn đã thấy chạy thật trong chương — một bảng javap, một lỗi biên dịch, một số đo. Sai câu nào thì lời giải nằm trong bài có cùng chủ đề.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ1 },
    },
  ],
};
