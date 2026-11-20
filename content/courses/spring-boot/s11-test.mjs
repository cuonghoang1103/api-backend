/**
 * spring-boot/s11-test.mjs — Chương 11: Kiểm thử (soạn 20/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / JUnit Jupiter 6.0.3 / AssertJ 3.27.7 / Mockito 5.23.0 / Testcontainers 2.0.5 / JaCoCo 0.8.15
 * trên Temurin 21.0.12.1, PostgreSQL 16.15 trong container của Testcontainers; Node 22.23.5 (node:test) để so sánh.
 * Mã demo: scratchpad/sb/lab/c11/app (labflow.Lab11App + src/test), node/*; Lab 11: lab/c11/lab11/{starter,giai,cham.sh,dot-bien.txt}.
 * Output: ~/.rtq-sb/c11/o (lọc ⇒ o/web bằng lab/c11/web-out.sh). Hằng MA.. / OUT.. sinh bằng tam/s11/build.sh + gen-ma.mjs.
 */
import { java, bash, xml, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 11.1 =====
const MA111_POM = xml("    <!-- Chương 11: mỗi lát test của Boot 4 là một starter riêng -->\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc-test</artifactId><scope>test</scope></dependency>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa-test</artifactId><scope>test</scope></dependency>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security-test</artifactId><scope>test</scope></dependency>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-testcontainers</artifactId><scope>test</scope></dependency>\n    <dependency><groupId>org.testcontainers</groupId><artifactId>testcontainers-postgresql</artifactId><scope>test</scope></dependency>");
const MA111_QUY = java("/** 11.1 — Quy tắc khung giờ của MỘT lượt đặt. Java thuần: không Spring, không CSDL ⇒ test đơn vị chạy trong mili giây. */\npublic final class QuyTacDat {\n    public static final LocalTime MO = LocalTime.of(7, 0), DONG = LocalTime.of(22, 0);\n    public static final Duration NGAN_NHAT = Duration.ofMinutes(30), DAI_NHAT = Duration.ofHours(4);\n\n    private QuyTacDat() { }\n\n    /** Rỗng = hợp lệ; có giá trị = lý do từ chối (trả thẳng cho người dùng). */\n    public static Optional<String> loi(LocalDateTime start, LocalDateTime end, LocalDateTime now) {\n        if (start == null || end == null) return Optional.of(\"cần startAt và endAt\");\n        if (!end.isAfter(start)) return Optional.of(\"endAt phải sau startAt\");\n        if (!start.toLocalDate().equals(end.toLocalDate())) return Optional.of(\"lượt đặt phải nằm trong một ngày\");\n        if (!tron(start) || !tron(end)) return Optional.of(\"giờ phải tròn 15 phút\");\n        Duration d = Duration.between(start, end);\n        if (d.compareTo(NGAN_NHAT) < 0) return Optional.of(\"ngắn nhất 30 phút\");\n        if (d.compareTo(DAI_NHAT) > 0) return Optional.of(\"dài nhất 4 giờ\");\n        if (start.toLocalTime().isBefore(MO) || end.toLocalTime().isAfter(DONG)) return Optional.of(\"phòng mở 07:00–22:00\");\n        if (!start.isAfter(now)) return Optional.of(\"không đặt giờ đã qua\");\n        return Optional.empty();\n    }\n\n    private static boolean tron(LocalDateTime t) { return t.getMinute() % 15 == 0 && t.getSecond() == 0 && t.getNano() == 0; }\n}");
const MA111_TEST = java("/** 11.1 — test đơn vị cho QuyTacDat: không Spring, không CSDL. */\n@DisplayName(\"QuyTacDat — khung giờ một lượt đặt\")\nclass QuyTacDatTest {\n    static final LocalDateTime BAY_GIO = LocalDateTime.parse(\"2030-02-01T06:00\");   // \"bây giờ\" cố định ⇒ test không phụ thuộc ngày chạy\n\n    static LocalDateTime t(String hhmm) { return LocalDateTime.parse(\"2030-02-01T\" + hhmm); }\n\n    @Test\n    @DisplayName(\"08:00–10:00 sáng mai là hợp lệ\")\n    void luotHaiTiengHopLe() {\n        assertThat(QuyTacDat.loi(t(\"08:00\"), t(\"10:00\"), BAY_GIO)).isEmpty();\n    }\n\n    @Nested\n    @DisplayName(\"giờ kết thúc\")\n    class KetThuc {\n        @Test\n        @DisplayName(\"bằng giờ bắt đầu ⇒ từ chối\")\n        void bangGioBatDau() {\n            assertThat(QuyTacDat.loi(t(\"08:00\"), t(\"08:00\"), BAY_GIO)).contains(\"endAt phải sau startAt\");\n        }\n\n        @Test\n        @DisplayName(\"trước giờ bắt đầu ⇒ từ chối\")\n        void truocGioBatDau() {\n            assertThat(QuyTacDat.loi(t(\"10:00\"), t(\"08:00\"), BAY_GIO)).contains(\"endAt phải sau startAt\");\n        }\n\n        @Test\n        @DisplayName(\"sang ngày hôm sau ⇒ từ chối\")\n        void sangNgayKhac() {\n            assertThat(QuyTacDat.loi(t(\"21:00\"), LocalDateTime.parse(\"2030-02-02T01:00\"), BAY_GIO))\n                .contains(\"lượt đặt phải nằm trong một ngày\");\n        }\n    }\n\n    @ParameterizedTest(name = \"{0}–{1} ⇒ \\\"{2}\\\"\")\n    @DisplayName(\"các biên của quy tắc\")\n    @CsvSource(delimiter = '|', textBlock = \"\"\"\n        07:00 | 07:30 | ''\n        06:45 | 08:00 | phòng mở 07:00–22:00\n        21:00 | 22:00 | ''\n        21:00 | 22:15 | phòng mở 07:00–22:00\n        08:00 | 08:15 | ngắn nhất 30 phút\n        08:00 | 12:00 | ''\n        08:00 | 12:15 | dài nhất 4 giờ\n        08:10 | 09:10 | giờ phải tròn 15 phút\n        \"\"\")\n    void bien(String tu, String den, String mongDoi) {\n        assertThat(QuyTacDat.loi(t(tu), t(den), BAY_GIO).orElse(\"\")).isEqualTo(mongDoi);\n    }\n\n    static Stream<Arguments> daQua() {\n        LocalDateTime bayGio = t(\"09:00\");\n        return Stream.of(\n            Arguments.of(\"hôm qua\", LocalDateTime.parse(\"2030-01-31T08:00\"), bayGio),\n            Arguments.of(\"đang diễn ra\", t(\"08:00\"), bayGio),\n            Arguments.of(\"đúng bây giờ\", t(\"09:00\"), bayGio));\n    }\n\n    @ParameterizedTest(name = \"{0}\")\n    @DisplayName(\"giờ đã qua ⇒ từ chối\")\n    @MethodSource(\"daQua\")\n    void gioDaQua(String ten, LocalDateTime start, LocalDateTime bayGio) {\n        assertThat(QuyTacDat.loi(start, start.plusHours(1), bayGio)).contains(\"không đặt giờ đã qua\");\n    }\n}");
const OUT111 = out("$ ./mvnw test -Dtest=QuyTacDatTest,VongDoiTest\nRunning QuyTacDat — khung giờ một lượt đặt\nRunning giờ kết thúc\nTests run: 15, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.011 s -- in giờ kết thúc\nTests run: 0, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.289 s -- in QuyTacDat — khung giờ một lượt đặt");
const MA111_VONG = java("@TestMethodOrder(MethodOrderer.MethodName.class)\nclass VongDoiTest {\n    int dem = 0;\n\n    VongDoiTest() { System.out.println(\"  new VongDoiTest()  @\" + Integer.toHexString(System.identityHashCode(this))); }\n\n    @BeforeAll static void truocHet() { System.out.println(\"@BeforeAll\"); }\n    @BeforeEach void truocMoi(TestInfo i) { System.out.println(\"  @BeforeEach  \" + i.getDisplayName()); }\n    @AfterEach void sauMoi() { System.out.println(\"  @AfterEach   dem = \" + dem); }\n    @AfterAll static void sauCung() { System.out.println(\"@AfterAll\"); }\n\n    @Test void a() { dem++; System.out.println(\"    a()\"); assertThat(dem).isEqualTo(1); }\n    @Test void b() { dem++; System.out.println(\"    b()\"); assertThat(dem).isEqualTo(1); }\n}");
const OUT111_VONG = out("Running labflow.VongDoiTest\n@BeforeAll\n  new VongDoiTest()  @4b3c354a\n  @BeforeEach  a()\n    a()\n  @AfterEach   dem = 1\n  new VongDoiTest()  @7b64240d\n  @BeforeEach  b()\n    b()\n  @AfterEach   dem = 1\n@AfterAll\nTests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.022 s -- in labflow.VongDoiTest\nResults:\nTests run: 17, Failures: 0, Errors: 0, Skipped: 0");
const MA111_LOI = java("@Tag(\"demo\")\nclass ThongBaoLoiTest {\n    List<String> ma = List.of(\"IOT-01\", \"NET-02\", \"AI-03\");\n\n    @Test void junitAssertTrue() { assertTrue(ma.contains(\"AI-04\")); }\n\n    @Test void junitAssertEquals() { assertEquals(4, ma.size()); }\n\n    @Test void assertjContains() { assertThat(ma).contains(\"AI-04\"); }\n\n    @Test void assertjMem() {\n        LocalDateTime bayGio = LocalDateTime.parse(\"2030-02-01T06:00\");\n        SoftAssertions.assertSoftly(s -> {\n            s.assertThat(QuyTacDat.loi(LocalDateTime.parse(\"2030-02-01T06:30\"), LocalDateTime.parse(\"2030-02-01T07:30\"), bayGio))\n             .as(\"06:30–07:30\").isEmpty();\n            s.assertThat(QuyTacDat.loi(LocalDateTime.parse(\"2030-02-01T08:00\"), LocalDateTime.parse(\"2030-02-01T12:30\"), bayGio))\n             .as(\"08:00–12:30\").isEmpty();\n            s.assertThat(ma).as(\"số phòng\").hasSize(3);\n        });\n    }\n}");
const OUT111_LOI = out("$ ./mvnw test -Dgroups=demo -Dnhom.bo=khong -Dtest=ThongBaoLoiTest\nERROR Tests run: 4, Failures: 4, Errors: 0, Skipped: 0, Time elapsed: 1.087 s <<< FAILURE! -- in labflow.ThongBaoLoiTest\nERROR labflow.ThongBaoLoiTest.junitAssertEquals -- Time elapsed: 0.052 s <<< FAILURE!\norg.opentest4j.AssertionFailedError: expected: <4> but was: <3>\nERROR labflow.ThongBaoLoiTest.assertjContains -- Time elapsed: 0.068 s <<< FAILURE!\njava.lang.AssertionError: \nExpecting ListN:\n  [\"IOT-01\", \"NET-02\", \"AI-03\"]\nto contain:\n  [\"AI-04\"]\nbut could not find the following element(s):\n  [\"AI-04\"]\nERROR labflow.ThongBaoLoiTest.assertjMem -- Time elapsed: 0.922 s <<< FAILURE!\norg.assertj.core.error.AssertJMultipleFailuresError: \nMultiple Failures (2 failures)\n-- failure 1 --\n[06:30–07:30] \nExpecting an empty Optional but was containing value: \"phòng mở 07:00–22:00\"\n-- failure 2 --\n[08:00–12:30] \nExpecting an empty Optional but was containing value: \"dài nhất 4 giờ\"\nERROR labflow.ThongBaoLoiTest.junitAssertTrue -- Time elapsed: 0.003 s <<< FAILURE!\norg.opentest4j.AssertionFailedError: expected: <true> but was: <false>");
const MA111_NODE = js("import { test, describe } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { loi } from './quy-tac.mjs';\n\ndescribe('QuyTacDat — khung giờ một lượt đặt', () => {\n  test('08:00–10:00 là hợp lệ', () => assert.equal(loi('08:00', '10:00'), null));\n  for (const [tu, den, mong] of [\n    ['07:00', '07:30', null], ['06:45', '08:00', 'phòng mở 07:00–22:00'],\n    ['08:00', '08:15', 'ngắn nhất 30 phút'], ['08:00', '12:15', 'dài nhất 4 giờ'],\n  ]) test(`${tu}–${den} ⇒ ${mong}`, () => assert.equal(loi(tu, den), mong));\n  test('cố ý đỏ: so danh sách', () => assert.deepEqual(['IOT-01', 'NET-02', 'AI-03'], ['IOT-01', 'NET-02', 'AI-04']));\n});");
const OUT111_NODE = out("$ node --test --test-reporter=spec\n▶ QuyTacDat — khung giờ một lượt đặt\n  ✔ 08:00–10:00 là hợp lệ (0.89707ms)\n  ✔ 07:00–07:30 ⇒ null (0.189114ms)\n  ✔ 06:45–08:00 ⇒ phòng mở 07:00–22:00 (0.191091ms)\n  ✔ 08:00–08:15 ⇒ ngắn nhất 30 phút (0.988534ms)\n  ✔ 08:00–12:15 ⇒ dài nhất 4 giờ (0.136324ms)\n  ✖ cố ý đỏ: so danh sách (1.959226ms)\n✖ QuyTacDat — khung giờ một lượt đặt (5.587144ms)\nℹ tests 6\nℹ suites 1\nℹ pass 5\nℹ fail 1\nℹ cancelled 0\nℹ skipped 0\nℹ todo 0\nℹ duration_ms 103.333856\n✖ failing tests:\ntest at quy-tac.test.mjs:11:3\n✖ cố ý đỏ: so danh sách (1.959226ms)\n  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:\n  + actual - expected\n    [\n      'IOT-01',\n      'NET-02',\n  +   'AI-03'\n  -   'AI-04'\n    ]");

const L111_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>JUnit 5 and AssertJ</h2>
<p class="lead">For ten chapters we proved LabFlow works by running curl by hand and reading the answer. That proof is gone the moment someone edits the code. This chapter turns those checks into tests that a machine runs in about half a minute on every change. We start with the smallest and fastest kind: a unit test of plain Java, with no Spring and no database. All outputs below come from Spring Boot 4.1.2, which ships JUnit Jupiter 6.0.3, AssertJ 3.27.7 and Mockito 5.23.0.</p>

<h3>In everyday life first</h3>
<p>A cook tastes the sauce on its own before it goes on the plate. If the sauce is too salty, she knows within a second, and she knows exactly which pot is to blame. Tasting the finished dinner also matters, but when it tastes wrong you do not know whether it was the sauce, the rice or the oven. Software tests work the same way. A <strong>unit test</strong> checks one small piece in isolation and fails fast with a precise reason. An <strong>integration test</strong> checks pieces working together (lessons 11.3–11.5). A healthy project has many of the first kind and fewer of the second — the <strong>test pyramid</strong>.</p>

<h3>"JUnit 5" in 2026: what you actually get</h3>
<p>People still say "JUnit 5" for the programming model (<code>@Test</code>, <code>@BeforeEach</code>, <code>@ExtendWith</code>…). The version number moved on: Spring Boot 4 brings <strong>JUnit 6.0.3</strong>, which keeps the same annotations and the same package <code>org.junit.jupiter.api</code>, needs Java 17+, and drops the old JUnit 4 runner. Everything in this chapter also compiles on JUnit 5.10+ (Spring Boot 3), so the code works in an SWP391 project that is one version behind.</p>
<p>Boot 4 also split testing into one starter per slice. LabFlow needs four, plus Testcontainers for lesson 11.4:</p>
${MA111_POM}
<p>Each of these pulls in <code>spring-boot-starter-test</code>, which brings JUnit Jupiter, AssertJ, Mockito, Hamcrest, JsonPath and JSONassert. You never add JUnit by hand.</p>

<h3>A rule worth testing</h3>
<p>Nothing in the Lab 10 code checks that <code>endAt</code> is after <code>startAt</code>, that the room is open, or that a booking is not in the past. We add those rules in one plain Java class. It returns an <code>Optional&lt;String&gt;</code> with the reason, or empty when the slot is valid, and it takes "now" as a parameter instead of calling <code>LocalDateTime.now()</code> itself — that single choice is what makes it testable:</p>
${MA111_QUY}
<p><code>BookingService.dat</code> now calls it first and turns a reason into <strong>400</strong> before it locks anything (lesson 11.2 tests that order).</p>

<h3>The test class</h3>
${MA111_TEST}
<ul>
  <li><code>@Test</code> marks a test method. It returns <code>void</code>, needs no <code>public</code>, and passes if it ends without throwing.</li>
  <li><code>@DisplayName</code> is the sentence a human reads in the IDE and in reports. Method names stay short identifiers.</li>
  <li><code>@Nested</code> groups related cases in an inner class, so the report reads like a specification: "giờ kết thúc → bằng giờ bắt đầu ⇒ từ chối".</li>
  <li><code>@ParameterizedTest</code> + <code>@CsvSource</code> runs one method per row. Inside the text block, <code>''</code> means an empty string. <code>@MethodSource</code> takes rows from a static method when they are objects, not text.</li>
  <li>Every test follows the same three steps: prepare (arrange), call (act), check (assert). Here the first two fit in one line.</li>
</ul>

<h3>Run it</h3>
${OUT111}
<ul>
  <li><strong>15 tests in 0.011 s</strong>: 1 plain, 3 nested, 8 CSV rows, 3 method-source rows. Unit tests this fast can run on every save.</li>
  <li>The two "Tests run" lines look odd: Surefire 3.5.6 credits all 15 to the nested class and 0 to the outer one when both have <code>@DisplayName</code>. That is a reporting quirk, not a bug in your tests — trust the final total, or the IDE tree.</li>
</ul>

<h3>Which values to test: boundaries</h3>
<p>The CSV rows are not random. Each rule has a boundary, and bugs live on boundaries: <code>&lt;</code> written where <code>&lt;=</code> was meant. So we test both sides of each edge — 07:00 is accepted and 06:45 is refused, 22:00 accepted and 22:15 refused, 4 hours accepted and 4 h 15 refused, 30 minutes accepted and 15 refused. This is <strong>boundary value analysis</strong>; grouping inputs that behave alike ("any time before opening") is <strong>equivalence partitioning</strong>. If you have taken SWT301, these are the same techniques, now written as code that runs by itself.</p>

<h3>The life cycle of a test class</h3>
${MA111_VONG}
${OUT111_VONG}
<ul>
  <li>JUnit creates a <strong>new object for every test</strong> (two different hash codes). Field <code>dem</code> starts at 0 each time, so tests cannot leak state into each other through fields.</li>
  <li><code>@BeforeAll</code>/<code>@AfterAll</code> run once and must be <code>static</code>, because no instance exists yet. <code>@TestInstance(Lifecycle.PER_CLASS)</code> changes this, and then shared fields become your problem.</li>
  <li>Test order is not guaranteed by default. <code>@TestMethodOrder</code> here only makes the printout stable; a test that needs another test to run first is a bug.</li>
</ul>

<h3>Why AssertJ: read the failure, not the code</h3>
<p>A test is judged on the day it fails. This class fails on purpose (tag <code>demo</code>, excluded from the normal build by <code>&lt;excludedGroups&gt;</code> in the pom):</p>
${MA111_LOI}
${OUT111_LOI}
<ul>
  <li><code>assertTrue</code> says only "expected: &lt;true&gt; but was: &lt;false&gt;". You must open the code to learn what was being checked.</li>
  <li>AssertJ's <code>assertThat(list).contains(…)</code> prints the whole list, what was missing, and reads like English. Auto-completion after <code>assertThat(x).</code> shows only checks that make sense for that type.</li>
  <li><code>SoftAssertions</code> keeps going after the first failure and reports <strong>both</strong> broken rules at once (06:30 refused for opening hours, 4 h 30 refused for length), each labelled with <code>.as(…)</code>.</li>
</ul>

<h3>🕵️ Hacker corner — Apple "goto fail", 2014</h3>
<p>In February 2014 Apple shipped iOS 7.0.6 to fix CVE-2014-1266. In the function that verified a TLS server's signature, one line had been duplicated: <code>goto fail;</code> appeared twice. The second copy always ran, skipped the real signature check, and returned "success". Any attacker on the same Wi-Fi could present a fake certificate for a bank and iPhones accepted it. Adam Langley's analysis showed the code compiled cleanly and every "happy path" worked; only a test that fed a <em>bad</em> signature and expected a refusal would have caught it.</p>
<p><strong>What you do:</strong> write more "must refuse" tests than "must accept" tests for anything that guards money, identity or data. <code>QuyTacDatTest</code> has 4 accepting cases and 11 refusing ones, on purpose.</p>

<h3>Compared with Node.js</h3>
<p>Node 22 has a test runner built in (<code>node:test</code> + <code>node:assert</code>), and many teams use Jest or Vitest. The same rule, the same idea:</p>
${MA111_NODE}
${OUT111_NODE}
<ul>
  <li>A <code>for</code> loop over an array plays the role of <code>@ParameterizedTest</code>; <code>describe</code> plays <code>@Nested</code>.</li>
  <li><code>assert.deepEqual</code> prints a clear diff, close to AssertJ. JUnit's own <code>assertEquals</code> is the weaker one here.</li>
  <li>Node needs no build step, so the loop "save, test" is very short. Java gets close with IDE test runners and Maven's <code>-Dtest=</code>.</li>
</ul>

<h3>In real life and at work</h3>
<ul>
  <li>In a company, the CI pipeline (chapter 17) runs <code>./mvnw test</code> on every pull request; a red test blocks the merge. Your tests are the only reviewer who reads every line, every time.</li>
  <li>Bug report "bookings can end before they start": first write a failing test that reproduces it, then fix the code, then watch the test turn green. The test stays forever and the bug cannot quietly come back.</li>
  <li>For SWP391, a test class named by rule, with <code>@DisplayName</code> sentences, is also your evidence when the lecturer asks "how do you know this works?".</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Unit test vs integration test?"</strong> — A unit test checks one class in isolation, fast, no I/O; an integration test checks several parts together (database, HTTP, Spring context). You want many of the first, fewer of the second.</li>
  <li><strong>"@BeforeEach vs @BeforeAll?"</strong> — BeforeEach runs before every test on a fresh instance; BeforeAll runs once per class and is static unless the class uses PER_CLASS lifecycle.</li>
  <li><strong>"How do you choose test inputs?"</strong> — Equivalence partitions plus both sides of each boundary; plus the refusal paths, not just the happy path.</li>
  <li><strong>"Why AssertJ over assertEquals?"</strong> — Fluent, type-specific checks and failure messages that show the actual data; soft assertions for several checks at once.</li>
  <li><strong>"JUnit 4 vs 5?"</strong> — <code>@Before</code> → <code>@BeforeEach</code>, <code>@RunWith</code> → <code>@ExtendWith</code>, a new platform with Jupiter as the engine, nested and parameterized tests built in. JUnit 6 keeps the Jupiter API and requires Java 17.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Predict what <code>QuyTacDat.loi</code> returns, with "now" = 06:00 the same day, for: 21:45–22:00, 07:00–11:00, 06:59–08:00, 21:30–22:15, 18:00–22:00, 07:00–07:15.</li>
  <li>Add two rows to the CSV that test the 30-minute boundary from the "too short" side and from the "just long enough" side, at the end of the day.</li>
  <li>Explain in one sentence why <code>VongDoiTest</code> prints two different hash codes, and what would change with <code>@TestInstance(PER_CLASS)</code>.</li>
</ol>
<p><strong>Done when:</strong> all six predictions match the answers, your two rows pass, and your sentence mentions "a new instance per test".</p></div>
${giai('Show the answers', `<p>Real output of the six inputs:</p><ul><li>21:45–22:00 ⇒ "ngắn nhất 30 phút"</li><li>07:00–11:00 ⇒ valid</li><li>06:59–08:00 ⇒ "giờ phải tròn 15 phút" (rounding is checked before opening hours)</li><li>21:30–22:15 ⇒ "phòng mở 07:00–22:00"</li><li>18:00–22:00 ⇒ valid (exactly 4 hours, ending exactly at closing)</li><li>07:00–07:15 ⇒ "ngắn nhất 30 phút"</li></ul><p>Rows for task 2, e.g. <code>21:45 | 22:00 | ngắn nhất 30 phút</code> and <code>21:30 | 22:00 | ''</code>. Task 3: JUnit builds a new test object for each method, so the counter restarts at 0; with PER_CLASS one object serves both tests, <code>b()</code> would see <code>dem = 2</code> and its assertion would fail.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Unit test</strong> — checks one unit (a class, a function) alone, without network, database or framework.</li>
  <li><strong>Assertion</strong> — the check that decides pass or fail.</li>
  <li><strong>Parameterized test</strong> — one test method run for many input rows.</li>
  <li><strong>Boundary value / equivalence partition</strong> — techniques to pick few inputs that find many bugs.</li>
  <li><strong>Soft assertion</strong> — collects several failures and reports them together.</li>
  <li><strong>Test pyramid</strong> — many fast unit tests at the bottom, fewer slower integration and end-to-end tests above.</li>
  <li><strong>JUnit Platform / Jupiter</strong> — the launcher that build tools talk to, and the engine that runs <code>@Test</code> methods.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Unit tests check plain Java in milliseconds; keep rules in classes that take their inputs (even "now") as parameters.</li>
  <li><code>@Nested</code>, <code>@DisplayName</code> and <code>@ParameterizedTest</code> turn a test class into a readable specification.</li>
  <li>Test both sides of every boundary, and test refusals more than acceptances.</li>
  <li>JUnit creates a new instance per test; <code>@BeforeAll</code> is static.</li>
  <li>AssertJ failure messages show the data; soft assertions show every broken rule at once.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.junit.org/current/user-guide/', '🧪', 'JUnit User Guide', 'Nested, parameterized and dynamic tests, tags, life cycle.')}
${tl('https://assertj.github.io/doc/', '✅', 'AssertJ documentation', 'Assertions for collections, Optional, exceptions; soft assertions.')}
${tl('https://martinfowler.com/articles/practical-test-pyramid.html', '📐', 'Ham Vocke — The Practical Test Pyramid', 'Which tests to write, and how many of each.')}
${tl('https://www.imperialviolet.org/2014/02/22/applebug.html', '🕵️', 'Adam Langley — Apple\'s SSL/TLS bug', 'The duplicated goto fail line, explained.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>QuyTacDatTest</code>, <code>VongDoiTest</code>, <code>ThongBaoLoiTest</code> in <code>lab/c11/app</code>; Spring Boot 4.1.2, JUnit Jupiter 6.0.3, AssertJ 3.27.7, Maven Surefire 3.5.6, Temurin 21.0.12.1; Node 22.23.5 (20/11/2026).</li>
  <li>Apple security update for iOS 7.0.6 (CVE-2014-1266), 21/2/2014; Adam Langley, ImperialViolet, 22/2/2014.</li>
</ul>
</div>
`;

const L111_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>JUnit 5 và AssertJ</h2>
<p class="lead">Suốt mười chương, ta chứng minh LabFlow chạy đúng bằng cách gõ curl bằng tay rồi đọc kết quả. Bằng chứng đó mất ngay khi có người sửa mã. Chương này biến các phép kiểm ấy thành test mà máy tự chạy trong khoảng nửa phút sau mỗi lần sửa. Ta bắt đầu từ loại nhỏ và nhanh nhất: test đơn vị cho Java thuần, không Spring, không CSDL. Mọi output dưới đây chạy trên Spring Boot 4.1.2, đi kèm JUnit Jupiter 6.0.3, AssertJ 3.27.7 và Mockito 5.23.0.</p>

<h3>Đời thường trước đã</h3>
<p>Người đầu bếp nếm riêng nồi nước sốt trước khi rưới lên đĩa. Sốt mặn thì cô biết ngay trong một giây, và biết đúng nồi nào có lỗi. Nếm cả bữa tối cũng cần, nhưng khi bữa ăn dở thì không biết do sốt, do cơm hay do lò. Test phần mềm cũng vậy. <strong>Test đơn vị</strong> (unit test) kiểm một mảnh nhỏ tách riêng, hỏng thì báo nhanh và chỉ đúng lý do. <strong>Test tích hợp</strong> (integration test) kiểm nhiều mảnh chạy cùng nhau (bài 11.3–11.5). Dự án khoẻ có thật nhiều loại thứ nhất và ít hơn loại thứ hai — đó là <strong>kim tự tháp test</strong>.</p>

<h3>"JUnit 5" năm 2026: thật ra bạn nhận được gì</h3>
<p>Người ta vẫn gọi "JUnit 5" cho cách viết (<code>@Test</code>, <code>@BeforeEach</code>, <code>@ExtendWith</code>…). Số phiên bản thì đã đi tiếp: Spring Boot 4 mang <strong>JUnit 6.0.3</strong>, giữ nguyên các annotation và gói <code>org.junit.jupiter.api</code>, cần Java 17 trở lên, và bỏ hẳn trình chạy JUnit 4 cũ. Mọi mã trong chương này cũng biên dịch được với JUnit 5.10+ (Spring Boot 3), nên dùng được trong dự án SWP391 chậm một phiên bản.</p>
<p>Boot 4 còn tách phần test thành mỗi lát một starter. LabFlow cần bốn cái, cộng Testcontainers cho bài 11.4:</p>
${MA111_POM}
<p>Mỗi starter này kéo theo <code>spring-boot-starter-test</code>, trong đó có JUnit Jupiter, AssertJ, Mockito, Hamcrest, JsonPath và JSONassert. Bạn không bao giờ phải tự thêm JUnit.</p>

<h3>Một quy tắc đáng để test</h3>
<p>Mã của Lab 10 không có dòng nào kiểm <code>endAt</code> phải sau <code>startAt</code>, phòng có đang mở cửa, hay lượt đặt có nằm trong quá khứ. Ta thêm các quy tắc đó vào một lớp Java thuần. Lớp trả về <code>Optional&lt;String&gt;</code> chứa lý do, hoặc rỗng khi khung giờ hợp lệ. Nó nhận "bây giờ" qua tham số thay vì tự gọi <code>LocalDateTime.now()</code> — chính lựa chọn đó làm nó test được:</p>
${MA111_QUY}
<p><code>BookingService.dat</code> giờ gọi nó đầu tiên và đổi lý do thành <strong>400</strong> trước khi khoá bất cứ thứ gì (bài 11.2 test đúng thứ tự này).</p>

<h3>Lớp test</h3>
${MA111_TEST}
<ul>
  <li><code>@Test</code> đánh dấu một phương thức test. Nó trả <code>void</code>, không cần <code>public</code>, và đạt nếu chạy xong mà không ném lỗi.</li>
  <li><code>@DisplayName</code> là câu người đọc thấy trong IDE và báo cáo. Tên phương thức vẫn là định danh ngắn.</li>
  <li><code>@Nested</code> gom các trường hợp liên quan vào một lớp con, nên báo cáo đọc như một bản đặc tả: "giờ kết thúc → bằng giờ bắt đầu ⇒ từ chối".</li>
  <li><code>@ParameterizedTest</code> + <code>@CsvSource</code> chạy phương thức một lần cho mỗi dòng. Trong khối văn bản, <code>''</code> nghĩa là chuỗi rỗng. <code>@MethodSource</code> lấy dòng từ một phương thức static khi dữ liệu là đối tượng chứ không phải chữ.</li>
  <li>Mọi test đều ba bước: chuẩn bị (arrange), gọi (act), kiểm (assert). Ở đây hai bước đầu gọn trong một dòng.</li>
</ul>

<h3>Chạy thử</h3>
${OUT111}
<ul>
  <li><strong>15 test trong 0,011 giây</strong>: 1 test thường, 3 test lồng, 8 dòng CSV, 3 dòng từ phương thức. Test đơn vị nhanh cỡ này thì chạy được sau mỗi lần lưu tệp.</li>
  <li>Hai dòng "Tests run" trông lạ: Surefire 3.5.6 ghi cả 15 cho lớp lồng và 0 cho lớp ngoài khi cả hai có <code>@DisplayName</code>. Đó là tật của phần báo cáo, không phải lỗi test — hãy tin con số tổng cuối cùng, hoặc cây test trong IDE.</li>
</ul>

<h3>Chọn giá trị nào để test: các biên</h3>
<p>Các dòng CSV không chọn bừa. Mỗi quy tắc có một biên, và lỗi sống ở biên: viết <code>&lt;</code> chỗ đáng lẽ là <code>&lt;=</code>. Nên ta test cả hai phía của mỗi mép — 07:00 được nhận còn 06:45 bị từ chối, 22:00 được nhận còn 22:15 bị từ chối, 4 giờ được nhận còn 4 giờ 15 bị từ chối, 30 phút được nhận còn 15 phút bị từ chối. Đó là <strong>phân tích giá trị biên</strong>; còn gom các đầu vào cư xử giống nhau ("mọi giờ trước khi mở cửa") là <strong>phân vùng tương đương</strong>. Nếu bạn đã học SWT301, đây chính là các kỹ thuật đó, giờ viết thành mã tự chạy.</p>

<h3>Vòng đời của một lớp test</h3>
${MA111_VONG}
${OUT111_VONG}
<ul>
  <li>JUnit tạo <strong>một đối tượng mới cho mỗi test</strong> (hai mã băm khác nhau). Trường <code>dem</code> mỗi lần đều bắt đầu từ 0, nên các test không truyền trạng thái cho nhau qua trường.</li>
  <li><code>@BeforeAll</code>/<code>@AfterAll</code> chạy một lần và phải là <code>static</code>, vì lúc đó chưa có đối tượng nào. <code>@TestInstance(Lifecycle.PER_CLASS)</code> đổi điều này, và khi đó trường dùng chung thành việc của bạn.</li>
  <li>Mặc định thứ tự test không được bảo đảm. <code>@TestMethodOrder</code> ở đây chỉ để bản in ổn định; test nào cần test khác chạy trước là test lỗi.</li>
</ul>

<h3>Vì sao AssertJ: đọc thông báo lỗi, không phải đọc mã</h3>
<p>Một test được đánh giá vào ngày nó hỏng. Lớp này cố ý hỏng (gắn tag <code>demo</code>, bị <code>&lt;excludedGroups&gt;</code> trong pom loại khỏi lần build thường):</p>
${MA111_LOI}
${OUT111_LOI}
<ul>
  <li><code>assertTrue</code> chỉ nói "expected: &lt;true&gt; but was: &lt;false&gt;". Bạn phải mở mã mới biết đang kiểm gì.</li>
  <li><code>assertThat(list).contains(…)</code> của AssertJ in cả danh sách, phần tử thiếu, và đọc như một câu tiếng Anh. Gợi ý tự động sau <code>assertThat(x).</code> chỉ hiện những phép kiểm hợp với kiểu đó.</li>
  <li><code>SoftAssertions</code> chạy tiếp sau lỗi đầu tiên và báo <strong>cả hai</strong> quy tắc bị vi phạm cùng lúc (06:30 bị từ chối vì giờ mở cửa, 4 giờ 30 bị từ chối vì quá dài), mỗi lỗi có nhãn từ <code>.as(…)</code>.</li>
</ul>

<h3>🕵️ Góc hacker — "goto fail" của Apple, 2014</h3>
<p>Tháng 2/2014 Apple phát hành iOS 7.0.6 để vá CVE-2014-1266. Trong hàm kiểm chữ ký của máy chủ TLS, một dòng bị chép đôi: <code>goto fail;</code> xuất hiện hai lần. Bản thứ hai luôn chạy, bỏ qua bước kiểm chữ ký thật và trả "thành công". Kẻ tấn công cùng mạng Wi-Fi có thể đưa ra chứng chỉ giả của ngân hàng và iPhone vẫn nhận. Bài phân tích của Adam Langley cho thấy mã biên dịch sạch, mọi "đường vui" đều chạy; chỉ một test đưa vào chữ ký <em>sai</em> và đòi bị từ chối mới bắt được nó.</p>
<p><strong>Bạn làm gì:</strong> với thứ canh giữ tiền, danh tính hay dữ liệu, viết nhiều test "phải từ chối" hơn test "phải chấp nhận". <code>QuyTacDatTest</code> có 4 trường hợp chấp nhận và 11 trường hợp từ chối, là cố ý.</p>

<h3>So với Node.js</h3>
<p>Node 22 có sẵn trình chạy test (<code>node:test</code> + <code>node:assert</code>), nhiều nhóm dùng Jest hoặc Vitest. Cùng quy tắc, cùng ý tưởng:</p>
${MA111_NODE}
${OUT111_NODE}
<ul>
  <li>Vòng <code>for</code> qua một mảng đóng vai <code>@ParameterizedTest</code>; <code>describe</code> đóng vai <code>@Nested</code>.</li>
  <li><code>assert.deepEqual</code> in phần khác nhau rất rõ, gần bằng AssertJ. <code>assertEquals</code> của chính JUnit mới là bên yếu hơn.</li>
  <li>Node không cần bước build nên vòng "lưu, test" rất ngắn. Java đến gần nhờ trình chạy test của IDE và <code>-Dtest=</code> của Maven.</li>
</ul>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Ở công ty, pipeline CI (chương 17) chạy <code>./mvnw test</code> cho mỗi pull request; test đỏ là không được merge. Test của bạn là người review duy nhất đọc mọi dòng, mọi lần.</li>
  <li>Báo lỗi "lượt đặt kết thúc trước khi bắt đầu": viết trước một test hỏng tái hiện lỗi, rồi sửa mã, rồi nhìn test chuyển xanh. Test ở lại mãi mãi và lỗi không thể âm thầm quay lại.</li>
  <li>Với SWP391, một lớp test đặt tên theo quy tắc, có câu <code>@DisplayName</code>, cũng là bằng chứng khi giảng viên hỏi "sao em biết chỗ này chạy đúng?".</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Test đơn vị khác test tích hợp thế nào?"</strong> — Test đơn vị kiểm một lớp tách riêng, nhanh, không I/O; test tích hợp kiểm nhiều phần cùng nhau (CSDL, HTTP, context Spring). Cần thật nhiều loại đầu, ít hơn loại sau.</li>
  <li><strong>"@BeforeEach khác @BeforeAll?"</strong> — BeforeEach chạy trước mỗi test trên một đối tượng mới; BeforeAll chạy một lần mỗi lớp và là static, trừ khi lớp dùng vòng đời PER_CLASS.</li>
  <li><strong>"Chọn dữ liệu test thế nào?"</strong> — Phân vùng tương đương cộng hai phía của mỗi biên; cộng các đường từ chối, không chỉ đường vui.</li>
  <li><strong>"Vì sao dùng AssertJ thay assertEquals?"</strong> — Phép kiểm theo kiểu, đọc trôi, thông báo lỗi in ra dữ liệu thật; soft assertion cho nhiều phép kiểm một lúc.</li>
  <li><strong>"JUnit 4 khác 5?"</strong> — <code>@Before</code> → <code>@BeforeEach</code>, <code>@RunWith</code> → <code>@ExtendWith</code>, nền tảng mới với Jupiter làm engine, có sẵn test lồng và test tham số. JUnit 6 giữ API Jupiter và cần Java 17.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Đoán <code>QuyTacDat.loi</code> trả gì, với "bây giờ" là 06:00 cùng ngày, cho: 21:45–22:00, 07:00–11:00, 06:59–08:00, 21:30–22:15, 18:00–22:00, 07:00–07:15.</li>
  <li>Thêm hai dòng vào CSV để test biên 30 phút từ phía "quá ngắn" và phía "vừa đủ dài", vào cuối ngày.</li>
  <li>Giải thích trong một câu vì sao <code>VongDoiTest</code> in hai mã băm khác nhau, và điều gì đổi khi có <code>@TestInstance(PER_CLASS)</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> cả sáu dự đoán khớp đáp án, hai dòng của bạn chạy xanh, và câu giải thích có ý "mỗi test một đối tượng mới".</p></div>
${giai('Xem đáp án', `<p>Output thật của sáu đầu vào:</p><ul><li>21:45–22:00 ⇒ "ngắn nhất 30 phút"</li><li>07:00–11:00 ⇒ hợp lệ</li><li>06:59–08:00 ⇒ "giờ phải tròn 15 phút" (kiểm làm tròn trước giờ mở cửa)</li><li>21:30–22:15 ⇒ "phòng mở 07:00–22:00"</li><li>18:00–22:00 ⇒ hợp lệ (đúng 4 giờ, kết thúc đúng giờ đóng cửa)</li><li>07:00–07:15 ⇒ "ngắn nhất 30 phút"</li></ul><p>Hai dòng cho bài 2, ví dụ <code>21:45 | 22:00 | ngắn nhất 30 phút</code> và <code>21:30 | 22:00 | ''</code>. Bài 3: JUnit dựng một đối tượng test mới cho mỗi phương thức nên bộ đếm về 0; với PER_CLASS một đối tượng phục vụ cả hai test, <code>b()</code> sẽ thấy <code>dem = 2</code> và phép kiểm của nó hỏng.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Test đơn vị (unit test)</strong> — kiểm một đơn vị (một lớp, một hàm) đứng riêng, không mạng, không CSDL, không framework.</li>
  <li><strong>Assertion (phép kiểm)</strong> — câu quyết định đạt hay hỏng.</li>
  <li><strong>Test tham số (parameterized test)</strong> — một phương thức test chạy cho nhiều dòng dữ liệu.</li>
  <li><strong>Giá trị biên / phân vùng tương đương</strong> — kỹ thuật chọn ít đầu vào mà tìm được nhiều lỗi.</li>
  <li><strong>Soft assertion</strong> — gom nhiều lỗi rồi báo cùng lúc.</li>
  <li><strong>Kim tự tháp test</strong> — đáy là thật nhiều test đơn vị nhanh, phía trên ít test tích hợp và đầu-cuối chậm hơn.</li>
  <li><strong>JUnit Platform / Jupiter</strong> — bộ khởi chạy mà công cụ build nói chuyện cùng, và engine chạy các phương thức <code>@Test</code>.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Test đơn vị kiểm Java thuần trong vài mili giây; đặt quy tắc trong lớp nhận mọi đầu vào (kể cả "bây giờ") qua tham số.</li>
  <li><code>@Nested</code>, <code>@DisplayName</code> và <code>@ParameterizedTest</code> biến lớp test thành một bản đặc tả dễ đọc.</li>
  <li>Test hai phía của mọi biên, và test đường từ chối nhiều hơn đường chấp nhận.</li>
  <li>JUnit tạo một đối tượng mới cho mỗi test; <code>@BeforeAll</code> là static.</li>
  <li>Thông báo lỗi của AssertJ in ra dữ liệu; soft assertion cho thấy mọi quy tắc hỏng cùng lúc.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.junit.org/current/user-guide/', '🧪', 'JUnit User Guide', 'Test lồng, test tham số, test động, tag, vòng đời.')}
${tl('https://assertj.github.io/doc/', '✅', 'Tài liệu AssertJ', 'Phép kiểm cho collection, Optional, exception; soft assertion.')}
${tl('https://martinfowler.com/articles/practical-test-pyramid.html', '📐', 'Ham Vocke — The Practical Test Pyramid', 'Viết test loại nào, mỗi loại bao nhiêu.')}
${tl('https://www.imperialviolet.org/2014/02/22/applebug.html', '🕵️', 'Adam Langley — Apple\'s SSL/TLS bug', 'Giải thích dòng goto fail bị chép đôi.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>QuyTacDatTest</code>, <code>VongDoiTest</code>, <code>ThongBaoLoiTest</code> ở <code>lab/c11/app</code>; Spring Boot 4.1.2, JUnit Jupiter 6.0.3, AssertJ 3.27.7, Maven Surefire 3.5.6, Temurin 21.0.12.1; Node 22.23.5 (20/11/2026).</li>
  <li>Bản cập nhật bảo mật iOS 7.0.6 của Apple (CVE-2014-1266), 21/2/2014; Adam Langley, ImperialViolet, 22/2/2014.</li>
</ul>
</div>
`;

// ===== Bài 11.2 =====
const MA112_SVC = java("/** Kiểm khung giờ TRƯỚC khi khoá gì (11.1). Thứ tự khoá CỐ ĐỊNH: phòng rồi sinh viên (không bao giờ ngược lại) ⇒ không deadlock. */\n@Transactional\npublic BookingView dat(BookingRequest r) {\n    QuyTacDat.loi(r.startAt(), r.endAt(), LocalDateTime.now(clock)).ifPresent(l -> { throw LoiNghiepVu.sai(l); });\n    Lab lab = labs.khoaTheoMa(r.labCode()).orElseThrow(() -> LoiNghiepVu.khongThay(\"lab \" + r.labCode()));\n    Student st = students.khoaTheoMa(r.studentCode()).orElseThrow(() -> LoiNghiepVu.khongThay(\"sinh viên \" + r.studentCode()));\n    bookings.trung(lab, r.startAt(), r.endAt(), Limit.of(1)).stream().findFirst().ifPresent(id -> { throw LoiNghiepVu.trung(id); });\n    LocalDate ngay = r.startAt().toLocalDate();\n    if (bookings.trongNgay(st, ngay.atStartOfDay(), ngay.plusDays(1).atStartOfDay()) >= 2) throw LoiNghiepVu.hanMuc(r.studentCode());\n    Booking b = bookings.save(new Booking(lab, st, r.startAt(), r.endAt()));\n    bookings.flush();\n    return bookings.view(b.getId());\n}");
const MA112_CLOCK = java("@SpringBootApplication\npublic class Lab11App {\n    public static void main(String[] args) { SpringApplication.run(Lab11App.class, args); }\n\n    /** 11.2 — \"bây giờ\" là một bean: production dùng đồng hồ thật, test truyền Clock.fixed(...). */\n    @Bean\n    Clock clock() { return Clock.systemDefaultZone(); }\n}");
const MA112_TEST = java("/** 11.2 — test đơn vị BookingService: ba repository là mock, đồng hồ cố định. Không Spring, không CSDL. */\n@ExtendWith(MockitoExtension.class)\nclass BookingServiceTest {\n    @Mock LabRepository labs;\n    @Mock StudentRepository students;\n    @Mock BookingRepository bookings;\n\n    /** 06:00 sáng 01/02/2030 giờ Việt Nam. */\n    final Clock dongHo = Clock.fixed(Instant.parse(\"2030-01-31T23:00:00Z\"), ZoneId.of(\"Asia/Ho_Chi_Minh\"));\n    final Lab iot = new Lab();\n    final Student lan = new Student();\n    BookingService svc;\n\n    static final LocalDateTime TAM_GIO = LocalDateTime.parse(\"2030-02-01T08:00\"), MUOI_GIO = LocalDateTime.parse(\"2030-02-01T10:00\");\n    static final BookingRequest YEU_CAU = new BookingRequest(\"IOT-01\", \"SE180123\", TAM_GIO, MUOI_GIO);\n\n    @BeforeEach\n    void taoService() { svc = new BookingService(labs, students, bookings, dongHo); }\n\n    /** Phòng và sinh viên có thật — dùng chung cho mọi test cần đi qua bước khoá. */\n    void coPhongVaSinhVien() {\n        when(labs.khoaTheoMa(\"IOT-01\")).thenReturn(Optional.of(iot));\n        when(students.khoaTheoMa(\"SE180123\")).thenReturn(Optional.of(lan));\n    }\n\n    @Test\n    void datThanhCong_luuMotLuotPENDING() {\n        coPhongVaSinhVien();\n        when(bookings.trung(eq(iot), eq(TAM_GIO), eq(MUOI_GIO), any(Limit.class))).thenReturn(List.of());\n        when(bookings.trongNgay(eq(lan), any(), any())).thenReturn(1L);\n        when(bookings.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));\n        BookingView ketQua = new BookingView(41L, \"IOT-01\", \"SE180123\", TAM_GIO, MUOI_GIO, \"PENDING\", 0);\n        when(bookings.view(any())).thenReturn(ketQua);\n\n        assertThat(svc.dat(YEU_CAU)).isEqualTo(ketQua);\n\n        ArgumentCaptor<Booking> daLuu = ArgumentCaptor.forClass(Booking.class);\n        verify(bookings).save(daLuu.capture());\n        assertThat(daLuu.getValue().getStatus()).isEqualTo(\"PENDING\");\n        verify(bookings).flush();\n    }\n\n    @Test\n    void khoaPhongTruocRoiMoiKhoaSinhVien() {\n        coPhongVaSinhVien();\n        when(bookings.trung(any(), any(), any(), any())).thenReturn(List.of(7L));\n        assertThatThrownBy(() -> svc.dat(YEU_CAU)).isInstanceOf(ResponseStatusException.class);\n        InOrder thuTu = inOrder(labs, students);\n        thuTu.verify(labs).khoaTheoMa(\"IOT-01\");\n        thuTu.verify(students).khoaTheoMa(\"SE180123\");\n    }\n\n    @Test\n    void trungGio_409_vaKhongLuuGi() {\n        coPhongVaSinhVien();\n        when(bookings.trung(any(), any(), any(), any())).thenReturn(List.of(7L));\n\n        assertThatThrownBy(() -> svc.dat(YEU_CAU))\n            .isInstanceOf(ResponseStatusException.class)\n            .hasMessageContaining(\"409\").hasMessageContaining(\"trùng giờ với lượt đặt 7\");\n        verify(bookings, never()).save(any());\n    }\n\n    @Test\n    void daCoHaiLuotTrongNgay_409() {\n        coPhongVaSinhVien();\n        when(bookings.trung(any(), any(), any(), any())).thenReturn(List.of());\n        when(bookings.trongNgay(eq(lan), eq(TAM_GIO.toLocalDate().atStartOfDay()), eq(TAM_GIO.toLocalDate().plusDays(1).atStartOfDay())))\n            .thenReturn(2L);\n\n        assertThatThrownBy(() -> svc.dat(YEU_CAU)).hasMessageContaining(\"đã có 2 lượt trong ngày\");\n        verify(bookings, never()).save(any());\n    }\n\n    @Test\n    void phongKhongTonTai_404() {\n        when(labs.khoaTheoMa(\"XYZ-99\")).thenReturn(Optional.empty());\n        assertThatThrownBy(() -> svc.dat(new BookingRequest(\"XYZ-99\", \"SE180123\", TAM_GIO, MUOI_GIO)))\n            .hasMessageContaining(\"404\").hasMessageContaining(\"lab XYZ-99 không tồn tại\");\n        verifyNoInteractions(students);\n    }\n\n    @Test\n    void khungGioSai_400_truocKhiChamCSDL() {\n        assertThatThrownBy(() -> svc.dat(new BookingRequest(\"IOT-01\", \"SE180123\", MUOI_GIO, TAM_GIO)))\n            .hasMessageContaining(\"400\").hasMessageContaining(\"endAt phải sau startAt\");\n        verifyNoInteractions(labs, students, bookings);\n    }\n\n    @Test\n    void duyetBanCu_409_khongDoiTrangThai() {\n        Booking b = new Booking(iot, lan, TAM_GIO, MUOI_GIO);             // version = 0\n        when(bookings.findById(18L)).thenReturn(Optional.of(b));\n        assertThatThrownBy(() -> svc.duyet(18L, 3)).hasMessageContaining(\"bạn đang xem bản 3, bản hiện tại là 0\");\n        assertThat(b.getStatus()).isEqualTo(\"PENDING\");\n        verify(bookings, never()).flush();\n    }\n\n    @Test\n    void gioDaQuaTheoDongHo_400() {\n        // đồng hồ đứng ở 06:00 01/02/2030 ⇒ 08:00–10:00 ngày 31/01 đã qua\n        BookingRequest homQua = new BookingRequest(\"IOT-01\", \"SE180123\", TAM_GIO.minusDays(1), MUOI_GIO.minusDays(1));\n        assertThatThrownBy(() -> svc.dat(homQua)).hasMessageContaining(\"không đặt giờ đã qua\");\n    }\n}");
const OUT112 = out("$ ./mvnw test -Dtest=BookingServiceTest\nRunning labflow.BookingServiceTest\nMockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3\nOpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended\nWARNING: A Java agent has been loaded dynamically (/m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)\nWARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning\nWARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information\nWARNING: Dynamic loading of agents will be disallowed by default in a future release\nTests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.568 s -- in labflow.BookingServiceTest");
const MA112_POM = xml("<plugin>\n  <!-- 11.2: đặt đường dẫn jar Mockito vào thuộc tính org.mockito:mockito-core:jar -->\n  <groupId>org.apache.maven.plugins</groupId>\n  <artifactId>maven-dependency-plugin</artifactId>\n  <executions><execution><goals><goal>properties</goal></goals></execution></executions>\n</plugin>\n<plugin>\n  <groupId>org.apache.maven.plugins</groupId>\n  <artifactId>maven-surefire-plugin</artifactId>\n  <configuration>\n    <!-- @{argLine} giữ agent của JaCoCo; thêm Mockito làm agent thay vì tự gắn lúc chạy -->\n    <argLine>@{argLine} -javaagent:${org.mockito:mockito-core:jar} -Xshare:off</argLine>\n    <excludedGroups>${nhom.bo}</excludedGroups>\n  </configuration>\n</plugin>");
const MA112_BAY = java("@Tag(\"demo\")\n@ExtendWith(MockitoExtension.class)\nclass MockitoBayTest {\n    @Mock LabRepository labs;\n    @Mock StudentRepository students;\n    @Mock BookingRepository bookings;\n    @InjectMocks BookingService svc;      // không có mock nào kiểu Clock ⇒ Mockito truyền null, KHÔNG báo gì\n\n    static final BookingRequest R = new BookingRequest(\"IOT-01\", \"SE180123\",\n        LocalDateTime.parse(\"2030-02-01T08:00\"), LocalDateTime.parse(\"2030-02-01T10:00\"));\n\n    @Test\n    void injectMocksImLangTruyenNull() { svc.dat(R); }\n\n    @Test\n    void stubThuaBiStrictStubsBat() {\n        when(labs.findByCode(any())).thenReturn(Optional.empty());   // không dòng nào trong test gọi findByCode\n        when(students.findByStudentCode(\"SE180123\")).thenReturn(Optional.empty());\n        students.findByStudentCode(\"SE180124\");                       // gọi với ĐỐI SỐ KHÁC\n    }\n}");
const OUT112_BAY = out("$ ./mvnw test -Dtest=BookingServiceTest,MockitoBayTest -Dnhom.bo=khong    # sau khi gắn Mockito làm agent\nRunning labflow.BookingServiceTest\nTests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.408 s -- in labflow.BookingServiceTest\nRunning labflow.MockitoBayTest\nERROR Tests run: 2, Failures: 0, Errors: 2, Skipped: 0, Time elapsed: 0.062 s <<< FAILURE! -- in labflow.MockitoBayTest\nERROR labflow.MockitoBayTest.injectMocksImLangTruyenNull -- Time elapsed: 0.027 s <<< ERROR!\njava.lang.NullPointerException: clock\nERROR labflow.MockitoBayTest.stubThuaBiStrictStubsBat -- Time elapsed: 0.021 s <<< ERROR!\norg.mockito.exceptions.misusing.UnnecessaryStubbingException: \nUnnecessary stubbings detected.\nClean & maintainable test code requires zero unnecessary code.\nFollowing stubbings are unnecessary (click to navigate to relevant line of code):\n  1. -> at labflow.MockitoBayTest.stubThuaBiStrictStubsBat(MockitoBayTest.java:32)\n  2. -> at labflow.MockitoBayTest.stubThuaBiStrictStubsBat(MockitoBayTest.java:33)\nPlease remove unnecessary stubbings or use 'lenient' strictness. More info: javadoc for UnnecessaryStubbingException class.");
const MA112_NODE = js("import { test, mock } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { dat } from './dat.mjs';\n\ntest('trùng giờ ⇒ 409 và không lưu gì', async () => {\n  const repo = { trung: mock.fn(async () => 7), save: mock.fn() };\n  await assert.rejects(dat(repo, { labCode: 'IOT-01' }), { status: 409, message: 'trùng giờ với lượt đặt 7' });\n  assert.equal(repo.save.mock.callCount(), 0);\n  console.log('trung được gọi với:', repo.trung.mock.calls[0].arguments);\n});");
const OUT112_NODE = out("$ node --test --test-reporter=spec dat.test.mjs\ntrung được gọi với: [ 'IOT-01', undefined, undefined ]\n✔ trùng giờ ⇒ 409 và không lưu gì (3.709454ms)\nℹ tests 1");
const OUT112_DOT = out("$ ./mvnw test -Dtest=BookingServiceTest\n# đột biến M3 (cho 3 lượt một ngày): BookingService.java — \">= 2) throw LoiNghiepVu.hanMuc\" ⇒ \"> 2) throw LoiNghiepVu.hanMuc\"\nERROR labflow.BookingServiceTest.daCoHaiLuotTrongNgay_409 -- Time elapsed: 0.030 s <<< FAILURE!\njava.lang.AssertionError: \nExpecting throwable message:\n  \"Cannot invoke \"labflow.Booking.getId()\" because \"b\" is null\"\nto contain:\n  \"đã có 2 lượt trong ngày\"\nbut did not.");

const L112_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Mockito: unit-testing services</h2>
<p class="lead"><code>BookingService.dat</code> is where LabFlow's business rules meet: slot rules, room lock, student lock, overlap check, two-per-day limit, save. Testing it through HTTP and PostgreSQL is possible (lesson 11.4), but slow and imprecise. Here we test it alone, in about a second, by replacing its three repositories with <strong>mocks</strong> — fake objects that answer what we tell them and remember how they were called.</p>

<h3>In everyday life first</h3>
<p>A flight school does not hand a student a real Airbus for the first lesson. It uses a simulator: the instruments react exactly as the instructor programmed ("engine 2 fails at 3,000 feet"), and afterwards the instructor reviews what the student touched, in which order. A mock is that simulator for a dependency. You program the answers (<em>stubbing</em>) and afterwards you check the calls (<em>verification</em>). And like a simulator, it is only as truthful as its program — remember this for the end of the lesson.</p>

<h3>The code under test</h3>
${MA112_SVC}
<p>It needs three repositories and, new in this chapter, a <code>Clock</code>. "Now" becomes a bean, so production uses the real clock and a test uses a fixed one:</p>
${MA112_CLOCK}

<h3>The test</h3>
${MA112_TEST}
<ul>
  <li><code>@ExtendWith(MockitoExtension.class)</code> creates every <code>@Mock</code> field before each test and checks for misuse after it. No Spring context is started.</li>
  <li>We build the service with <code>new</code>. That is a feature of constructor injection (lesson 3.3): the test is just Java. <code>Lab</code> and <code>Student</code> have protected constructors, which a test in the same package may call.</li>
  <li><strong>Stubbing</strong>: <code>when(x.m(args)).thenReturn(v)</code>. <code>thenAnswer(i -&gt; i.getArgument(0))</code> returns what was passed, the way <code>save</code> really behaves.</li>
  <li><strong>Matchers</strong>: <code>eq(…)</code>, <code>any()</code>. When one argument uses a matcher, all of them must.</li>
  <li><strong>Verification</strong>: <code>verify(bookings).flush()</code>, <code>verify(bookings, never()).save(any())</code>, <code>verifyNoInteractions(…)</code>. <code>ArgumentCaptor</code> catches the object passed to <code>save</code> so we can check it was <code>PENDING</code>.</li>
  <li><code>InOrder</code> checks that the room is locked before the student — the fixed lock order from lesson 7.5 that prevents deadlocks. A teammate who "tidies" the two lines into the other order now gets a red test instead of a deadlock in production.</li>
</ul>
${OUT112}
<ul>
  <li><strong>8 tests in about 2.5 seconds</strong>, most of it starting Mockito. No database, no port.</li>
  <li>The warning block is real and will become an error in a future JDK: Mockito attaches itself as a Java agent at run time, and JDK 21 warns about dynamically loaded agents.</li>
</ul>

<h3>Silencing the agent warning the right way</h3>
<p>Mockito's documentation asks you to load it as an agent when the JVM starts. In Maven that is two plugins: one exposes the jar path as a property, the other passes it to the test JVM. <code>@{argLine}</code> keeps JaCoCo's agent (lesson 11.6) in the same line:</p>
${MA112_POM}

<h3>Two traps</h3>
${MA112_BAY}
${OUT112_BAY}
<ul>
  <li><strong><code>@InjectMocks</code> silently passes <code>null</code></strong> for any constructor parameter it has no mock for. The test compiles, the service is built, and it fails later with <code>NullPointerException: clock</code> — far from the cause. Building the object with <code>new</code> makes the compiler catch a missing dependency.</li>
  <li><strong>Strict stubs.</strong> <code>MockitoExtension</code> fails a test that stubs something nobody calls (<code>UnnecessaryStubbingException</code>). It feels strict, but an unused stub usually means the test no longer tests what its name says. Only mark a stub <code>lenient()</code> when you really share it between tests that use it differently.</li>
</ul>

<h3>When NOT to mock</h3>
<ul>
  <li><strong>Do not mock what you are testing.</strong> Mocking a method of <code>BookingService</code> inside a test of <code>BookingService</code> tests nothing.</li>
  <li><strong>Do not mock value objects</strong> (<code>BookingRequest</code>, <code>LocalDateTime</code>, a <code>List</code>). Create real ones.</li>
  <li><strong>Do not mock a query to test the query.</strong> Our tests stub <code>bookings.trung(…)</code>; they prove the service <em>reacts</em> correctly to "there is an overlap", never that the JPQL finds the overlap. Lesson 11.4 changes one character of that query: every test in this lesson stays green.</li>
  <li><strong>Mock at your boundary</strong>: repositories, an e-mail sender, an HTTP client, a clock. Prefer a real object when it is fast and has no side effects.</li>
</ul>

<h3>🕵️ Hacker corner — Zune, 31 December 2008</h3>
<p>On 31 December 2008, Microsoft's 30 GB Zune music players froze worldwide at the same moment. The clock driver converted "days since 1980" to a year in a loop like <code>while (days &gt; 365)</code>; on day 366 of a leap year neither branch reduced <code>days</code>, so the loop never ended. Microsoft's advice was to wait until the next day. The code had been tested — just never on that date, because tests used the real clock and nobody ran them on a leap year's last day.</p>
<p><strong>What you do:</strong> never let code under test call <code>now()</code> directly. Inject a <code>Clock</code> and test the dangerous dates with <code>Clock.fixed(…)</code>: 31/12 of a leap year, 29/2, the hour clocks change in other countries, midnight. Attackers also exploit time: tokens, coupons, reservations that should expire.</p>

<h3>Compared with Node.js</h3>
<p>In JavaScript every object is open, so a "mock" is often just an object with fake functions. <code>node:test</code> has <code>mock.fn()</code>, which records calls like Mockito:</p>
${MA112_NODE}
${OUT112_NODE}
<ul>
  <li>No library and no extension needed — but also no type checking: if <code>save</code> is renamed, this fake still has the old name and the test still passes.</li>
  <li>Jest adds <code>jest.mock('./repo')</code>, which replaces a whole module; Mockito has no equivalent, and Spring teams use dependency injection instead.</li>
</ul>

<h3>In real life and at work</h3>
<ul>
  <li>A code review comment you will hear: "this test has 14 <code>when</code> lines and checks one thing". Too many stubs means the class does too much or the test is at the wrong level.</li>
  <li>When a bug report says "sometimes the system lets a student book three times", the fastest reproduction is a Mockito test where <code>trongNgay</code> returns 2.</li>
  <li>Mocks shine for things you cannot or should not call in a test: payment gateways, SMS, e-mail, a slow partner API.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Mock vs stub vs spy?"</strong> — A stub returns prepared answers; a mock also records calls so you can verify them (Mockito mocks do both); a spy wraps a real object and lets most calls through.</li>
  <li><strong>"@Mock vs @MockitoBean?"</strong> — <code>@Mock</code> is plain Mockito, no Spring. <code>@MockitoBean</code> (Spring Framework 6.2+, replaces Boot's <code>@MockBean</code>) puts a mock into a Spring test context (lesson 11.3).</li>
  <li><strong>"How do you test code that uses the current time?"</strong> — Inject <code>java.time.Clock</code>; use <code>Clock.fixed</code> in tests.</li>
  <li><strong>"What can a unit test with mocks not catch?"</strong> — Wrong queries, mapping and transaction problems, wiring, security configuration. That is what integration tests are for.</li>
  <li><strong>"verify vs assert?"</strong> — Assert checks results (state); verify checks interactions. Prefer state; verify only interactions that matter (save never called, lock order).</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write <code>sinhVienKhongTonTai_404</code>: the room exists, the student does not. Check the message and that nothing was saved.</li>
  <li>Change <code>&gt;= 2</code> to <code>&gt; 2</code> in <code>dat</code>. Which test of this lesson turns red, and with what message? Put the code back.</li>
  <li>Of the 8 bugs that Lab 11 plants (overlap boundary, cancelled bookings, daily limit, "now", booking for someone else, self-approval, IDOR, stale version), predict which ones a suite made only of the tests in lessons 11.1–11.3 can catch.</li>
</ol>
<p><strong>Done when:</strong> your test passes and fails if you delete the <code>orElseThrow</code> for students; task 2 names <code>daCoHaiLuotTrongNgay_409</code>; task 3 matches the answer.</p></div>
${giai('Show the answers', `<p>1. Stub <code>labs.khoaTheoMa("IOT-01")</code> with the room and <code>students.khoaTheoMa("SE999999")</code> with <code>Optional.empty()</code>; expect a message containing "404" and "sinh viên SE999999 không tồn tại"; <code>verify(bookings, never()).save(any())</code>. Strict stubs will fail the test if you also stub <code>trung</code>, because it is never reached.</p><p>2. <code>daCoHaiLuotTrongNgay_409</code>: with <code>&gt; 2</code> the service goes on to <code>save</code>, which is not stubbed and returns <code>null</code>, so the assertion sees a <code>NullPointerException</code> instead of the expected message:</p>${OUT112_DOT}<p>The Lab 11 grader recorded this mutant as killed by the solution.</p><p>3. The Lab 11 trap "mocks only" (tests of 11.1–11.3) killed the daily limit, "now", booking for someone else, self-approval and stale version — <strong>5 of 8</strong>. It missed the overlap boundary, the cancelled-booking filter (both live in JPQL) and IDOR (it lives in <code>Quyen</code>, which the web test mocks).</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Mock</strong> — a fake object with programmed answers that records its calls.</li>
  <li><strong>Stubbing</strong> — telling a mock what to return (<code>when … thenReturn</code>).</li>
  <li><strong>Verification</strong> — checking that a call happened, did not happen, or happened in order.</li>
  <li><strong>Argument captor / matcher</strong> — catch an argument to inspect it / match arguments loosely.</li>
  <li><strong>Strict stubs</strong> — Mockito mode that fails tests with unused stubs.</li>
  <li><strong>Test double</strong> — the umbrella term: dummy, stub, spy, mock, fake.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Mockito lets you test a service alone in about a second: stub the repositories, call, assert results, verify important calls.</li>
  <li>Constructor injection makes tests plain Java; prefer <code>new</code> over <code>@InjectMocks</code>.</li>
  <li>Inject a <code>Clock</code>; never call <code>now()</code> in code you want to test.</li>
  <li>Load Mockito as a JVM agent to remove the JDK 21 warning before it becomes an error.</li>
  <li>Mocks only test reactions. Queries, security and wiring need the integration tests of the next lessons.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html', '🍵', 'Mockito documentation', 'Stubbing, verification, strictness, and section 0.3 on the Java agent.')}
${tl('https://martinfowler.com/articles/mocksArentStubs.html', '📐', 'Martin Fowler — Mocks Aren\'t Stubs', 'State vs behaviour verification.')}
${tl('https://docs.spring.io/spring-boot/reference/testing/index.html', '🍃', 'Spring Boot — Testing', 'Where plain unit tests end and Spring test slices begin.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>BookingServiceTest</code>, <code>MockitoBayTest</code> in <code>lab/c11/app</code>; Mockito 5.23.0, Byte Buddy 1.18.15, JUnit Jupiter 6.0.3, Temurin 21.0.12.1; Node 22.23.5 (20/11/2026).</li>
  <li>Zune 30 GB freeze, 31/12/2008: Microsoft Zune support statement and the published driver code (rtc.c) analysed in the press, January 2009.</li>
</ul>
</div>
`;

const L112_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Mockito: test đơn vị cho service</h2>
<p class="lead"><code>BookingService.dat</code> là nơi các quy tắc nghiệp vụ của LabFlow gặp nhau: quy tắc khung giờ, khoá phòng, khoá sinh viên, kiểm trùng, giới hạn hai lượt mỗi ngày, lưu. Test nó qua HTTP và PostgreSQL thì được (bài 11.4) nhưng chậm và không chỉ đúng chỗ. Ở đây ta test nó đứng riêng, trong khoảng một giây, bằng cách thay ba repository bằng <strong>mock</strong> — đối tượng giả trả lời đúng điều ta dặn và nhớ mình đã bị gọi thế nào.</p>

<h3>Đời thường trước đã</h3>
<p>Trường dạy bay không giao cho học viên một chiếc Airbus thật ở buổi đầu. Họ dùng buồng lái mô phỏng: đồng hồ phản ứng đúng như giáo viên lập trình ("động cơ 2 hỏng ở độ cao 3.000 bộ"), và sau buổi tập giáo viên xem lại học viên đã chạm vào gì, theo thứ tự nào. Mock chính là buồng mô phỏng cho một phụ thuộc. Bạn lập trình câu trả lời (<em>stubbing</em>) và sau đó kiểm các lời gọi (<em>verification</em>). Và như buồng mô phỏng, nó chỉ đúng tới mức chương trình của nó — hãy nhớ điều này cho cuối bài.</p>

<h3>Đoạn mã được test</h3>
${MA112_SVC}
<p>Nó cần ba repository và, mới ở chương này, một <code>Clock</code>. "Bây giờ" trở thành một bean, nên production dùng đồng hồ thật còn test dùng đồng hồ đứng yên:</p>
${MA112_CLOCK}

<h3>Lớp test</h3>
${MA112_TEST}
<ul>
  <li><code>@ExtendWith(MockitoExtension.class)</code> tạo mọi trường <code>@Mock</code> trước mỗi test và kiểm dùng sai sau mỗi test. Không có context Spring nào được khởi động.</li>
  <li>Ta dựng service bằng <code>new</code>. Đó là cái lợi của tiêm qua constructor (bài 3.3): test chỉ là Java. <code>Lab</code> và <code>Student</code> có constructor protected, test cùng gói được phép gọi.</li>
  <li><strong>Stubbing</strong>: <code>when(x.m(đối số)).thenReturn(v)</code>. <code>thenAnswer(i -&gt; i.getArgument(0))</code> trả lại đúng thứ được truyền vào, giống <code>save</code> thật.</li>
  <li><strong>Matcher</strong>: <code>eq(…)</code>, <code>any()</code>. Một đối số dùng matcher thì mọi đối số phải dùng matcher.</li>
  <li><strong>Verification</strong>: <code>verify(bookings).flush()</code>, <code>verify(bookings, never()).save(any())</code>, <code>verifyNoInteractions(…)</code>. <code>ArgumentCaptor</code> bắt đối tượng truyền vào <code>save</code> để ta kiểm nó là <code>PENDING</code>.</li>
  <li><code>InOrder</code> kiểm phòng bị khoá trước sinh viên — thứ tự khoá cố định của bài 7.5 để không deadlock. Bạn cùng nhóm nào "dọn" hai dòng đó theo thứ tự ngược lại giờ sẽ nhận một test đỏ, thay vì một deadlock trên production.</li>
</ul>
${OUT112}
<ul>
  <li><strong>8 test trong khoảng 2,5 giây</strong>, phần lớn là thời gian khởi động Mockito. Không CSDL, không cổng mạng.</li>
  <li>Khối cảnh báo là thật và sẽ thành lỗi ở JDK tương lai: Mockito tự gắn mình làm Java agent lúc đang chạy, và JDK 21 cảnh báo agent nạp động.</li>
</ul>

<h3>Tắt cảnh báo agent cho đúng cách</h3>
<p>Tài liệu Mockito yêu cầu nạp nó làm agent ngay khi JVM khởi động. Trong Maven đó là hai plugin: một cái đưa đường dẫn jar ra thành thuộc tính, cái kia truyền nó cho JVM chạy test. <code>@{argLine}</code> giữ agent của JaCoCo (bài 11.6) trên cùng dòng:</p>
${MA112_POM}

<h3>Hai cái bẫy</h3>
${MA112_BAY}
${OUT112_BAY}
<ul>
  <li><strong><code>@InjectMocks</code> lặng lẽ truyền <code>null</code></strong> cho mọi tham số constructor mà nó không có mock. Test biên dịch được, service vẫn được dựng, rồi hỏng muộn với <code>NullPointerException: clock</code> — xa nguyên nhân. Dựng đối tượng bằng <code>new</code> thì trình biên dịch bắt được phụ thuộc bị thiếu.</li>
  <li><strong>Strict stubs.</strong> <code>MockitoExtension</code> đánh hỏng test nào stub một thứ không ai gọi (<code>UnnecessaryStubbingException</code>). Nghe khắt khe, nhưng stub thừa thường có nghĩa test không còn kiểm đúng điều tên nó nói. Chỉ đánh dấu <code>lenient()</code> khi bạn thật sự dùng chung stub cho nhiều test dùng nó khác nhau.</li>
</ul>

<h3>Khi nào KHÔNG nên mock</h3>
<ul>
  <li><strong>Đừng mock chính thứ đang test.</strong> Mock một phương thức của <code>BookingService</code> trong test của <code>BookingService</code> là không test gì cả.</li>
  <li><strong>Đừng mock đối tượng giá trị</strong> (<code>BookingRequest</code>, <code>LocalDateTime</code>, một <code>List</code>). Tạo đối tượng thật.</li>
  <li><strong>Đừng mock một truy vấn để test truy vấn đó.</strong> Test của ta stub <code>bookings.trung(…)</code>; chúng chứng minh service <em>phản ứng</em> đúng với "có trùng", không bao giờ chứng minh JPQL tìm ra chỗ trùng. Bài 11.4 đổi đúng một ký tự trong câu truy vấn đó: mọi test của bài này vẫn xanh.</li>
  <li><strong>Mock ở ranh giới của bạn</strong>: repository, bộ gửi email, HTTP client, đồng hồ. Thứ gì nhanh và không có tác dụng phụ thì dùng đồ thật.</li>
</ul>

<h3>🕵️ Góc hacker — Zune, 31/12/2008</h3>
<p>Ngày 31/12/2008, máy nghe nhạc Zune 30 GB của Microsoft trên toàn thế giới cùng lúc đứng hình. Driver đồng hồ đổi "số ngày kể từ 1980" ra năm bằng một vòng lặp kiểu <code>while (days &gt; 365)</code>; vào ngày thứ 366 của năm nhuận, không nhánh nào giảm <code>days</code>, nên vòng lặp không bao giờ dừng. Lời khuyên của Microsoft là chờ sang ngày hôm sau. Mã có được test — chỉ là chưa bao giờ ở ngày đó, vì test dùng đồng hồ thật và không ai chạy test vào ngày cuối của một năm nhuận.</p>
<p><strong>Bạn làm gì:</strong> đừng bao giờ để mã cần test tự gọi <code>now()</code>. Tiêm một <code>Clock</code> và test các ngày nguy hiểm bằng <code>Clock.fixed(…)</code>: 31/12 năm nhuận, 29/2, giờ đổi giờ mùa hè ở nước khác, nửa đêm. Kẻ tấn công cũng khai thác thời gian: token, mã giảm giá, lượt giữ chỗ lẽ ra phải hết hạn.</p>

<h3>So với Node.js</h3>
<p>Trong JavaScript mọi đối tượng đều mở, nên "mock" thường chỉ là một đối tượng có hàm giả. <code>node:test</code> có <code>mock.fn()</code>, ghi lại lời gọi như Mockito:</p>
${MA112_NODE}
${OUT112_NODE}
<ul>
  <li>Không cần thư viện hay extension — nhưng cũng không kiểm kiểu: nếu <code>save</code> bị đổi tên, hàm giả vẫn mang tên cũ và test vẫn xanh.</li>
  <li>Jest có thêm <code>jest.mock('./repo')</code> thay cả một module; Mockito không có thứ tương đương, đội Spring dùng tiêm phụ thuộc thay vào đó.</li>
</ul>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Một nhận xét review bạn sẽ nghe: "test này có 14 dòng <code>when</code> mà chỉ kiểm một điều". Quá nhiều stub nghĩa là lớp làm quá nhiều việc, hoặc test đặt sai tầng.</li>
  <li>Khi báo lỗi nói "thỉnh thoảng hệ thống cho sinh viên đặt ba lượt", cách tái hiện nhanh nhất là một test Mockito cho <code>trongNgay</code> trả 2.</li>
  <li>Mock toả sáng với thứ không thể hoặc không nên gọi trong test: cổng thanh toán, SMS, email, API đối tác chậm.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Mock, stub, spy khác nhau thế nào?"</strong> — Stub trả câu trả lời soạn sẵn; mock còn ghi lại lời gọi để kiểm (mock của Mockito làm cả hai); spy bọc một đối tượng thật và cho phần lớn lời gọi đi qua.</li>
  <li><strong>"@Mock khác @MockitoBean?"</strong> — <code>@Mock</code> là Mockito thuần, không Spring. <code>@MockitoBean</code> (Spring Framework 6.2+, thay <code>@MockBean</code> của Boot) đặt mock vào context test của Spring (bài 11.3).</li>
  <li><strong>"Test mã dùng giờ hiện tại thế nào?"</strong> — Tiêm <code>java.time.Clock</code>; trong test dùng <code>Clock.fixed</code>.</li>
  <li><strong>"Test đơn vị có mock không bắt được gì?"</strong> — Truy vấn sai, lỗi ánh xạ và giao dịch, lỗi nối bean, cấu hình bảo mật. Đó là việc của test tích hợp.</li>
  <li><strong>"verify khác assert?"</strong> — Assert kiểm kết quả (trạng thái); verify kiểm tương tác. Ưu tiên trạng thái; chỉ verify những tương tác quan trọng (không bao giờ gọi save, thứ tự khoá).</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết <code>sinhVienKhongTonTai_404</code>: phòng có thật, sinh viên không. Kiểm thông báo và không có gì được lưu.</li>
  <li>Đổi <code>&gt;= 2</code> thành <code>&gt; 2</code> trong <code>dat</code>. Test nào của bài này chuyển đỏ, với thông báo gì? Rồi trả mã về.</li>
  <li>Trong 8 lỗi mà Lab 11 cài vào (biên nối đuôi, lượt đã huỷ, giới hạn trong ngày, "bây giờ", đặt hộ người khác, tự duyệt, IDOR, phiên bản cũ), đoán xem bộ test chỉ gồm các test của bài 11.1–11.3 bắt được những lỗi nào.</li>
</ol>
<p><strong>Đạt khi:</strong> test của bạn xanh và đỏ khi bạn xoá <code>orElseThrow</code> của sinh viên; bài 2 nêu <code>daCoHaiLuotTrongNgay_409</code>; bài 3 khớp đáp án.</p></div>
${giai('Xem đáp án', `<p>1. Stub <code>labs.khoaTheoMa("IOT-01")</code> trả phòng và <code>students.khoaTheoMa("SE999999")</code> trả <code>Optional.empty()</code>; đòi thông báo có "404" và "sinh viên SE999999 không tồn tại"; <code>verify(bookings, never()).save(any())</code>. Nếu bạn stub thêm <code>trung</code>, strict stubs sẽ đánh hỏng test vì nó không bao giờ được gọi tới.</p><p>2. <code>daCoHaiLuotTrongNgay_409</code>: với <code>&gt; 2</code> service đi tiếp tới <code>save</code>, mà <code>save</code> không được stub nên trả <code>null</code>, phép kiểm nhận một <code>NullPointerException</code> thay vì thông báo mong đợi:</p>${OUT112_DOT}<p>Máy chấm Lab 11 ghi đột biến này bị lời giải diệt.</p><p>3. Bẫy "chỉ mock" của Lab 11 (test của 11.1–11.3) diệt được giới hạn trong ngày, "bây giờ", đặt hộ, tự duyệt và phiên bản cũ — <strong>5 trên 8</strong>. Nó bỏ sót biên nối đuôi, bộ lọc lượt đã huỷ (cả hai nằm trong JPQL) và IDOR (nằm trong <code>Quyen</code>, mà test tầng web lại mock).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Mock</strong> — đối tượng giả có câu trả lời lập trình sẵn và ghi lại lời gọi.</li>
  <li><strong>Stubbing</strong> — dặn mock trả gì (<code>when … thenReturn</code>).</li>
  <li><strong>Verification</strong> — kiểm một lời gọi đã xảy ra, không xảy ra, hay xảy ra đúng thứ tự.</li>
  <li><strong>Argument captor / matcher</strong> — bắt đối số để soi / khớp đối số lỏng.</li>
  <li><strong>Strict stubs</strong> — chế độ của Mockito đánh hỏng test có stub thừa.</li>
  <li><strong>Test double</strong> — tên gọi chung: dummy, stub, spy, mock, fake.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mockito cho phép test một service đứng riêng trong khoảng một giây: stub repository, gọi, assert kết quả, verify lời gọi quan trọng.</li>
  <li>Tiêm qua constructor làm test thành Java thuần; dùng <code>new</code> thay <code>@InjectMocks</code>.</li>
  <li>Tiêm <code>Clock</code>; đừng gọi <code>now()</code> trong mã bạn muốn test.</li>
  <li>Nạp Mockito làm agent của JVM để bỏ cảnh báo JDK 21 trước khi nó thành lỗi.</li>
  <li>Mock chỉ test phản ứng. Truy vấn, bảo mật và nối bean cần test tích hợp ở các bài sau.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html', '🍵', 'Tài liệu Mockito', 'Stubbing, verification, strictness, và mục 0.3 về Java agent.')}
${tl('https://martinfowler.com/articles/mocksArentStubs.html', '📐', 'Martin Fowler — Mocks Aren\'t Stubs', 'Kiểm trạng thái và kiểm hành vi.')}
${tl('https://docs.spring.io/spring-boot/reference/testing/index.html', '🍃', 'Spring Boot — Testing', 'Test đơn vị thuần dừng ở đâu, lát test của Spring bắt đầu từ đâu.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>BookingServiceTest</code>, <code>MockitoBayTest</code> ở <code>lab/c11/app</code>; Mockito 5.23.0, Byte Buddy 1.18.15, JUnit Jupiter 6.0.3, Temurin 21.0.12.1; Node 22.23.5 (20/11/2026).</li>
  <li>Sự cố Zune 30 GB đứng máy, 31/12/2008: thông báo hỗ trợ của Microsoft và mã driver (rtc.c) được báo chí phân tích, tháng 1/2009.</li>
</ul>
</div>
`;

// ===== Bài 11.3 =====
const MA113_CU = java("class BookingController {\n\n    private final LabRepository labs; private final BookingService svc; private final EntityManager em;\n    BookingController(LabRepository labs, BookingService svc, EntityManager em) { this.labs = labs; this.svc = svc; this.em = em; }\n\n    @GetMapping(\"/bookings/search\")\n    List<BookingView> tim(@RequestParam String status, Authentication a) {\n        if (!Set.of(\"PENDING\", \"APPROVED\", \"CANCELLED\").contains(status))\n            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, \"status không hợp lệ\");\n        return em.createQuery(BookingRepository.VIEW + \"where s.studentCode = :me and b.status = :st order by b.startAt, b.id\",\n                BookingView.class).setParameter(\"me\", a.getName()).setParameter(\"st\", status).getResultList();\n    }");
const MA113_NGAY = java("@Tag(\"demo\")\n@WebMvcTest(BookingController.class)\nclass WebMvcNgayThoTest {\n    @Autowired MockMvcTester mvc;\n    @MockitoBean BookingService svc;\n    @MockitoBean LabRepository labs;\n\n    @Test\n    void datLuot() {\n        assertThat(mvc.post().uri(\"/bookings\").with(jwt().jwt(j -> j.subject(\"SE180123\")))\n                .contentType(MediaType.APPLICATION_JSON)\n                .content(\"{\\\"labCode\\\":\\\"IOT-01\\\",\\\"startAt\\\":\\\"2030-02-01T08:00\\\",\\\"endAt\\\":\\\"2030-02-01T10:00\\\"}\"))\n            .hasStatus(201);\n    }\n\n    @Test\n    void khongToken() {\n        assertThat(mvc.post().uri(\"/bookings\").contentType(MediaType.APPLICATION_JSON)\n                .content(\"{\\\"labCode\\\":\\\"IOT-01\\\",\\\"startAt\\\":\\\"2030-02-01T08:00\\\",\\\"endAt\\\":\\\"2030-02-01T10:00\\\"}\"))\n            .hasStatus(401);\n    }\n\n    @Test\n    void sinhVienDuyetLuot() {\n        assertThat(mvc.patch().uri(\"/bookings/18/approve\").with(jwt().jwt(j -> j.subject(\"SE180123\"))\n                    .authorities(new SimpleGrantedAuthority(\"ROLE_STUDENT\")))\n                .contentType(MediaType.APPLICATION_JSON).content(\"{\\\"version\\\":0}\"))\n            .hasStatus(403);\n    }\n}");
const OUT113A = out("$ ./mvnw test -Dtest=WebMvcNgayThoTest    # controller cũ: còn EntityManager\nAPPLICATION FAILED TO START\nDescription:\nParameter 2 of constructor in labflow.BookingController required a bean of type 'jakarta.persistence.EntityManager' that could not be found.\nAction:\nConsider defining a bean of type 'jakarta.persistence.EntityManager' in your configuration.");
const MA113_REPO = java("/** 11.3: chuyển từ controller (EntityManager) về đây ⇒ controller test được bằng @WebMvcTest. */\n@Query(VIEW + \"where s.studentCode = :me and b.status = :st order by b.startAt, b.id\")\nList<BookingView> cuaToiTheoTrangThai(@Param(\"me\") String me, @Param(\"st\") String status);");
const MA113_TIM = java("@GetMapping(\"/bookings/search\")\nList<BookingView> tim(@RequestParam String status, Authentication a) {\n    if (!Set.of(\"PENDING\", \"APPROVED\", \"CANCELLED\").contains(status))\n        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, \"status không hợp lệ\");\n    return svc.cuaToi(a.getName(), status);\n}");
const OUT113B = out("$ ./mvnw test -Dtest=WebMvcNgayThoTest    # sau khi chuyển truy vấn về repository\nERROR labflow.WebMvcNgayThoTest.sinhVienDuyetLuot -- Time elapsed: 0.027 s <<< FAILURE!\norg.opentest4j.AssertionFailedError: \n[HTTP status code] \nexpected: 403\n but was: 200\nERROR labflow.WebMvcNgayThoTest.khongToken -- Time elapsed: 0.012 s <<< FAILURE!\norg.opentest4j.AssertionFailedError: \n[HTTP status code] \nexpected: 401\n but was: 403\nERROR Tests run: 3, Failures: 2, Errors: 0, Skipped: 0, Time elapsed: 0.481 s <<< FAILURE! -- in labflow.WebMvcNgayThoTest");
const MA113_TEST = java("/** 11.3 — chỉ tầng web của BookingController: MVC + chuỗi bảo mật THẬT của ứng dụng (BaoMat); service là mock. */\n@WebMvcTest(BookingController.class)\n@Import(BaoMat.class)\n@org.springframework.test.context.TestPropertySource(properties = \"labflow.jwt.secret=chi-dung-trong-test-dai-hon-32-byte-0000\")\nclass BookingControllerWebTest {\n    @Autowired MockMvcTester mvc;\n    @Autowired MockMvc mockMvc;\n    @MockitoBean BookingService svc;\n    @MockitoBean LabRepository labs;\n    @MockitoBean JdbcClient db;                    // BaoMat cần (UserDetailsService, admin đầu tiên) — tầng web không dùng tới\n    @MockitoBean(name = \"quyen\") Quyen quyen;      // @PreAuthorize(\"@quyen…\") tìm bean TÊN \"quyen\"\n\n    static final LocalDateTime T8 = LocalDateTime.parse(\"2030-02-01T08:00\"), T10 = LocalDateTime.parse(\"2030-02-01T10:00\");\n    static final String BODY = \"{\\\"labCode\\\":\\\"IOT-01\\\",\\\"studentCode\\\":\\\"SE180124\\\",\\\"startAt\\\":\\\"2030-02-01T08:00\\\",\\\"endAt\\\":\\\"2030-02-01T10:00\\\"}\";\n\n    static JwtRequestPostProcessor sv(String code) {\n        return jwt().jwt(j -> j.subject(code)).authorities(new SimpleGrantedAuthority(\"ROLE_STUDENT\"));\n    }\n    static JwtRequestPostProcessor admin() {\n        return jwt().jwt(j -> j.subject(\"admin\")).authorities(new SimpleGrantedAuthority(\"ROLE_ADMIN\"));\n    }\n\n    @Test\n    void datHopLe_201_kieuMockMvcCoDien() throws Exception {\n        when(svc.dat(any())).thenReturn(new BookingView(41L, \"IOT-01\", \"SE180123\", T8, T10, \"PENDING\", 0));\n        mockMvc.perform(post(\"/bookings\").with(sv(\"SE180123\")).contentType(MediaType.APPLICATION_JSON).content(BODY))\n            .andExpect(status().isCreated())\n            .andExpect(jsonPath(\"$.status\").value(\"PENDING\"))\n            .andExpect(jsonPath(\"$.startAt\").value(\"2030-02-01T08:00:00\"));\n    }\n\n    @Test\n    void datHopLe_201_kieuMockMvcTester() {\n        when(svc.dat(any())).thenReturn(new BookingView(41L, \"IOT-01\", \"SE180123\", T8, T10, \"PENDING\", 0));\n        assertThat(mvc.post().uri(\"/bookings\").with(sv(\"SE180123\")).contentType(MediaType.APPLICATION_JSON).content(BODY))\n            .hasStatus(201)\n            .bodyJson().isLenientlyEqualTo(\"\"\"\n                {\"id\":41,\"labCode\":\"IOT-01\",\"studentCode\":\"SE180123\",\"status\":\"PENDING\",\"version\":0}\"\"\");\n    }\n\n    @Test\n    void sinhVienKhongDatHoNguoiKhac() {\n        when(svc.dat(any())).thenReturn(new BookingView(41L, \"IOT-01\", \"SE180123\", T8, T10, \"PENDING\", 0));\n        assertThat(mvc.post().uri(\"/bookings\").with(sv(\"SE180123\")).contentType(MediaType.APPLICATION_JSON).content(BODY)).hasStatus(201);\n        ArgumentCaptor<BookingRequest> r = ArgumentCaptor.forClass(BookingRequest.class);\n        verify(svc).dat(r.capture());\n        assertThat(r.getValue().studentCode()).isEqualTo(\"SE180123\");      // body ghi SE180124, token là SE180123\n    }\n\n    @Test\n    void trungGio_409_ProblemDetail() {\n        when(svc.dat(any())).thenThrow(LoiNghiepVu.trung(7L));\n        assertThat(mvc.post().uri(\"/bookings\").with(sv(\"SE180123\")).contentType(MediaType.APPLICATION_JSON).content(BODY))\n            .hasStatus(409)\n            .hasContentType(MediaType.APPLICATION_PROBLEM_JSON)\n            .bodyJson().isLenientlyEqualTo(\"\"\"\n                {\"status\":409,\"title\":\"Conflict\",\"detail\":\"trùng giờ với lượt đặt 7\",\"instance\":\"/bookings\"}\"\"\");\n    }\n\n    @Test\n    void statusSai_400_khongGoiService() {\n        assertThat(mvc.get().uri(\"/bookings/search?status=XYZ\").with(sv(\"SE180123\")))\n            .hasStatus(400).bodyJson().extractingPath(\"$.detail\").isEqualTo(\"status không hợp lệ\");\n        verifyNoInteractions(svc);\n    }\n\n    @Test\n    void khongToken_401() {\n        assertThat(mvc.post().uri(\"/bookings\").contentType(MediaType.APPLICATION_JSON).content(BODY)).hasStatus(401);\n        verifyNoInteractions(svc);\n    }\n\n    @Test\n    void sinhVienDuyet_403_adminDuyet_200() {\n        when(svc.duyet(18L, 0)).thenReturn(new BookingView(18L, \"IOT-01\", \"SE180124\", T8, T10, \"APPROVED\", 1));\n        assertThat(mvc.patch().uri(\"/bookings/18/approve\").with(sv(\"SE180123\"))\n            .contentType(MediaType.APPLICATION_JSON).content(\"{\\\"version\\\":0}\")).hasStatus(403);\n        assertThat(mvc.patch().uri(\"/bookings/18/approve\").with(admin())\n            .contentType(MediaType.APPLICATION_JSON).content(\"{\\\"version\\\":0}\"))\n            .hasStatus(200).bodyJson().extractingPath(\"$.status\").isEqualTo(\"APPROVED\");\n    }\n\n    @Test\n    void huyLuotCuaNguoiKhac_403() {\n        when(quyen.chuHoacAdmin(eq(18L), any(Authentication.class))).thenReturn(false);\n        assertThat(mvc.patch().uri(\"/bookings/18/cancel\").with(sv(\"SE180123\"))).hasStatus(403);\n        verifyNoInteractions(svc);\n    }\n}");
const OUT113C = out("$ ./mvnw test -Dtest=BookingControllerWebTest\nINFO [main] labflow.BookingControllerWebTest         : Started BookingControllerWebTest in 2.932 seconds (process running for 4.351)\nTests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.085 s -- in labflow.BookingControllerWebTest");
const MA113_CHAT = java("static final String KY_VONG = \"\"\"\n    {\"id\":41,\"labCode\":\"IOT-01\",\"studentCode\":\"SE180123\",\"status\":\"PENDING\",\"version\":0}\"\"\";\n\nvoid coLuot() {\n    when(svc.dat(any())).thenReturn(new BookingView(41L, \"IOT-01\", \"SE180123\",\n        LocalDateTime.parse(\"2030-02-01T08:00\"), LocalDateTime.parse(\"2030-02-01T10:00\"), \"PENDING\", 0));\n}\n\nMockMvcTester.MockMvcRequestBuilder goi() {\n    return mvc.post().uri(\"/bookings\").with(jwt().jwt(j -> j.subject(\"SE180123\"))).contentType(MediaType.APPLICATION_JSON)\n        .content(\"{\\\"labCode\\\":\\\"IOT-01\\\",\\\"startAt\\\":\\\"2030-02-01T08:00\\\",\\\"endAt\\\":\\\"2030-02-01T10:00\\\"}\");\n}\n\n@Test void soLong() { coLuot(); assertThat(goi()).hasStatus(201).bodyJson().isLenientlyEqualTo(KY_VONG); }\n\n@Test void soChat() { coLuot(); assertThat(goi()).hasStatus(201).bodyJson().isStrictlyEqualTo(KY_VONG); }");
const OUT113_CHAT = out("$ ./mvnw test -Dtest=JsonChatTest -Dnhom.bo=khong\nERROR Tests run: 2, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 4.662 s <<< FAILURE! -- in labflow.JsonChatTest\nERROR labflow.JsonChatTest.soChat -- Time elapsed: 0.339 s <<< FAILURE!\njava.lang.AssertionError: \n[JSON content] JSON comparison failure: \nUnexpected: endAt\nUnexpected: startAt");

const L113_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Testing controllers with @WebMvcTest</h2>
<p class="lead">The service is tested. What is left in a controller is everything HTTP: URL and method, JSON in and out, status codes, <code>ProblemDetail</code> bodies, and who may call what. <code>@WebMvcTest</code> starts only that web layer — no database, no Tomcat — and lets you fire fake requests at it in a few seconds. This lesson also shows the two ways such a test lies to you, both measured.</p>

<h3>In everyday life first</h3>
<p>A theatre rehearses the front desk before opening night: the cashier, the ticket scanner and the usher are real, but the show behind the curtain is replaced by an actor who always says "the show is sold out" or "seat 12B, enjoy". You check that the desk asks for a ticket, refuses people without one, and sends VIPs to the right door. A slice test is that rehearsal: the real web front (controllers, JSON, security filters), with the service behind it played by a mock.</p>

<h3>First attempt: the context does not even start</h3>
<p>The Lab 10 controller still held one query itself, through <code>EntityManager</code>:</p>
${MA113_CU}
<p>A naive slice test — just the controller and two <code>@MockitoBean</code>s:</p>
${MA113_NGAY}
${OUT113A}
<p><code>@WebMvcTest</code> loads controllers, <code>@ControllerAdvice</code>, filters, converters and Jackson — and nothing from JPA. That is the point of a slice. A controller that needs <code>EntityManager</code> is doing a repository's job. The test exposed a design smell, so we fix the design, not the test: the query moves into the repository, and the controller calls the service.</p>
${MA113_REPO}
${MA113_TIM}

<h3>Second attempt: green where it should be red</h3>
${OUT113B}
<ul>
  <li><strong>A student approved a booking: 200.</strong> <code>@PreAuthorize</code> did nothing, because <code>@EnableMethodSecurity</code> lives on our <code>BaoMat</code> configuration, and a slice does not load <code>@Configuration</code> classes. A test of that route that expected 200 would have passed and proved nothing.</li>
  <li><strong>No token: 403, not 401.</strong> Without our chain, Spring Boot's default one applies: form login, HTTP Basic and CSRF on. The CSRF filter rejects the POST before anyone asks for a token.</li>
  <li><strong>And the POST with <code>jwt()</code> passed (201)?</strong> The <code>jwt()</code> post-processor of <code>spring-security-test</code> calls <code>CsrfFilter.skipRequest</code> (we checked the bytecode of 7.1.2), because a bearer-token request needs no CSRF token. So the request skipped exactly the filter that rejected the anonymous one.</li>
</ul>
<p>Lesson: a slice test without your real security configuration tests a different application.</p>

<h3>The real test: your security chain, a mocked service</h3>
${MA113_TEST}
<ul>
  <li><code>@Import(BaoMat.class)</code> brings the real <code>SecurityFilterChain</code>, JWT decoder and <code>@EnableMethodSecurity</code>. Its other beans need a <code>JdbcClient</code>, so we mock it; the web layer never uses it.</li>
  <li><code>@MockitoBean(name = "quyen")</code>: the expression <code>@quyen.chuHoacAdmin(…)</code> looks the bean up <em>by name</em>. <code>@MockitoBean</code> (Spring Framework 6.2+) replaces Boot's <code>@MockBean</code>, which no longer exists in Boot 4.</li>
  <li><code>jwt()</code> puts a ready-made authentication in the request: subject and authorities, no signature, no token string. Real tokens come in lesson 11.5.</li>
  <li>Two styles side by side. <code>MockMvc</code> + <code>andExpect(jsonPath…)</code> is the classic one you will see in most projects. <code>MockMvcTester</code> (Spring Framework 6.2+) is AssertJ-based: no checked exceptions, one fluent chain, and failure messages that show the response.</li>
  <li><code>ArgumentCaptor</code> proves the rule from lesson 9.6: the body said <code>SE180124</code>, the service received <code>SE180123</code> from the token.</li>
  <li>The 409 test checks the whole <code>ProblemDetail</code>: status, title, detail and <code>instance</code>, with content type <code>application/problem+json</code> — the contract a frontend depends on.</li>
</ul>
${OUT113C}
<p>Eight tests in about four seconds, and the context took under three. It is cached: the next <code>@WebMvcTest</code> with the same configuration starts in milliseconds.</p>

<h3>Lenient or strict JSON?</h3>
<p><code>isLenientlyEqualTo</code> checks that the fields you list are there with those values and ignores everything else. Convenient, and dangerous for responses:</p>
${MA113_CHAT}
${OUT113_CHAT}
<p>Same response, same expected JSON: lenient passes, strict fails and names the two fields we did not list (<code>startAt</code>, <code>endAt</code>). Here they are harmless. If a refactor ever adds <code>passwordHash</code> or a reset token to a response, only a strict comparison — or an explicit "field does not exist" check — turns red.</p>

<h3>🕵️ Hacker corner — Grindr, October 2020</h3>
<p>In October 2020 security researcher Wassime Bouimadaghene found that Grindr's "forgot password" endpoint returned the password-reset token in its JSON response. Anyone who knew a user's e-mail address could request a reset, read the token from the response and take over the account. Troy Hunt confirmed it against a test account; Grindr fixed it after TechCrunch reported it on 2 October 2020. The endpoint worked "correctly" from a functional point of view — the e-mail was sent — and the extra field was simply never checked.</p>
<p><strong>What you do:</strong> response DTOs (lesson 10.1) instead of entities; strict JSON assertions for sensitive endpoints, or <code>extractingPath("$.resetToken")</code> + "does not exist"; review every new field in a response as part of the API contract.</p>

<h3>Compared with Node.js</h3>
<p>The usual Express tool is <code>supertest</code>: <code>request(app).post('/bookings').set('Authorization', …).expect(201)</code>. It calls the app without opening a port, like MockMvc. Two differences matter. Express has no "slice": you either import the whole app (and its database connection) or build a small app with only the router and fake services yourself. And there is no <code>jwt()</code> helper, so tests usually sign a real token with a test secret — closer to lesson 11.5.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Frontend and backend agree on status codes and error bodies; a controller test per error case is the cheapest way to keep that agreement.</li>
  <li>If a slice test needs ten <code>@MockitoBean</code>s, the controller depends on too much. That is design feedback, not a testing problem.</li>
  <li>Security configuration belongs in the test. Teams that exclude security from slices "to make tests easier" ship routes where <code>@PreAuthorize</code> has never been exercised.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"@WebMvcTest vs @SpringBootTest?"</strong> — WebMvcTest loads only the MVC layer (controllers, advice, filters, Jackson), fast; SpringBootTest loads the whole application. Use the slice for HTTP behaviour, the full context for flows.</li>
  <li><strong>"Why does my @WebMvcTest fail with 'No qualifying bean'?"</strong> — The controller depends on something outside the slice: mock it with <code>@MockitoBean</code>, or move that dependency behind a service.</li>
  <li><strong>"My test returns 403 on POST — why?"</strong> — Usually CSRF from the default security chain; import your own configuration, or use <code>csrf()</code> for session-based apps.</li>
  <li><strong>"MockMvc vs a real HTTP call?"</strong> — MockMvc runs the DispatcherServlet in memory, no network, no servlet container. Real calls (RANDOM_PORT) also test Tomcat, filters order and serialization over the wire.</li>
  <li><strong>"How do you test a ProblemDetail response?"</strong> — Status, content type <code>application/problem+json</code>, and the fields <code>title</code>, <code>detail</code>, <code>instance</code> as JSON.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write <code>lichNgay_congKhai_200</code>: <code>GET /labs/IOT-01/bookings?date=2030-02-01</code> without any token returns 200 and a JSON array (the service is mocked).</li>
  <li>Write <code>thieuNgay_400</code>: the same URL without <code>date</code>. Which status and which <code>detail</code> do you expect? Run it and compare.</li>
  <li>In <code>WebMvcNgayThoTest</code>, which single annotation makes <code>sinhVienDuyetLuot</code> correct, and which one makes <code>khongToken</code> correct?</li>
</ol>
<p><strong>Done when:</strong> tests 1 and 2 pass with your own assertions; for task 3 you name <code>@Import(BaoMat.class)</code> for both and explain why.</p></div>
${giai('Show the answers', `<p>1. <code>when(svc.lichNgay("IOT-01", LocalDate.parse("2030-02-01"))).thenReturn(List.of())</code>, then <code>assertThat(mvc.get().uri("/labs/IOT-01/bookings?date=2030-02-01")).hasStatus(200).bodyJson().isEqualTo("[]")</code>. The route is <code>permitAll</code> in <code>BaoMat</code>, so no <code>with(…)</code> is needed.</p><p>2. A missing <code>@RequestParam</code> is <code>MissingServletRequestParameterException</code>; with ProblemDetail enabled Spring answers 400 with detail "Required parameter 'date' is not present." Check it with <code>extractingPath("$.detail")</code>.</p><p>3. Both: <code>@Import(BaoMat.class)</code>. It brings <code>@EnableMethodSecurity</code> (so <code>hasRole('ADMIN')</code> runs and the student gets 403) and our chain with CSRF disabled and the bearer entry point (so no token gives 401 instead of the default chain's CSRF 403). Then add the <code>@MockitoBean</code>s it needs, as in <code>BookingControllerWebTest</code>.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Test slice</strong> — a test that loads one layer of Spring (web, JPA, JSON…), not the whole app.</li>
  <li><strong>MockMvc / MockMvcTester</strong> — call controllers in memory through the real DispatcherServlet; the second with AssertJ.</li>
  <li><strong>@MockitoBean</strong> — a Mockito mock registered in the Spring test context, replacing or adding a bean.</li>
  <li><strong>Request post-processor</strong> — <code>jwt()</code>, <code>csrf()</code>, <code>user()</code>: change the fake request before it is sent.</li>
  <li><strong>Lenient vs strict JSON</strong> — ignore unlisted fields vs fail on them.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li><code>@WebMvcTest</code> tests HTTP behaviour in seconds: routes, JSON, statuses, ProblemDetail, security.</li>
  <li>A controller that needs JPA cannot be sliced: move queries behind the service.</li>
  <li>Import your real security configuration, or the slice tests Boot's default chain and <code>@PreAuthorize</code> silently does nothing.</li>
  <li><code>jwt()</code> skips CSRF and fakes an authenticated user; <code>@MockitoBean(name=…)</code> for beans used in SpEL.</li>
  <li>Use strict JSON (or explicit absence checks) where an extra field would be a leak.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/testing/mockmvc/assertj.html', '🍃', 'Spring Framework — MockMvcTester (AssertJ integration)', 'Requests, JSON paths and ProblemDetail with AssertJ.')}
${tl('https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html', '🍃', 'Spring Boot — Testing Spring Boot applications', 'Auto-configured MVC tests and what each slice includes.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/index.html', '🔐', 'Spring Security — MockMvc support', 'jwt(), csrf(), user() and @WithMockUser.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>WebMvcNgayThoTest</code>, <code>BookingControllerWebTest</code>, <code>JsonChatTest</code> in <code>lab/c11/app</code>; Spring Boot 4.1.2, Spring Security 7.1.2 (bytecode of <code>JwtRequestPostProcessor</code> read with <code>javap</code>), Temurin 21.0.12.1 (20/11/2026).</li>
  <li>Grindr password-reset flaw: TechCrunch, 2/10/2020; Troy Hunt's confirmation published the same day.</li>
</ul>
</div>
`;

const L113_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Test controller bằng @WebMvcTest</h2>
<p class="lead">Service đã được test. Thứ còn lại trong controller là mọi chuyện HTTP: URL và method, JSON vào và ra, mã trạng thái, thân <code>ProblemDetail</code>, và ai được gọi gì. <code>@WebMvcTest</code> chỉ khởi động đúng tầng web đó — không CSDL, không Tomcat — và cho bạn bắn request giả vào nó trong vài giây. Bài này cũng cho thấy hai kiểu loại test này nói dối bạn, cả hai đều đo thật.</p>

<h3>Đời thường trước đã</h3>
<p>Nhà hát tập dượt quầy đón khách trước đêm diễn: thu ngân, máy quét vé, người dẫn chỗ là thật, còn buổi diễn sau tấm màn được thay bằng một diễn viên lúc nào cũng nói "hết vé rồi" hoặc "ghế 12B, chúc vui". Bạn kiểm quầy có hỏi vé, có từ chối người không vé, có đưa khách VIP đi đúng cửa. Test lát cắt chính là buổi tập đó: mặt tiền web thật (controller, JSON, bộ lọc bảo mật), còn service phía sau do một mock đóng.</p>

<h3>Lần thử đầu: context còn không khởi động nổi</h3>
<p>Controller của Lab 10 vẫn tự giữ một câu truy vấn, qua <code>EntityManager</code>:</p>
${MA113_CU}
<p>Một test lát cắt "ngây thơ" — chỉ controller và hai <code>@MockitoBean</code>:</p>
${MA113_NGAY}
${OUT113A}
<p><code>@WebMvcTest</code> nạp controller, <code>@ControllerAdvice</code>, filter, converter và Jackson — không nạp gì của JPA. Đó chính là ý nghĩa của lát cắt. Controller cần <code>EntityManager</code> là đang làm việc của repository. Test đã chỉ ra một mùi thiết kế, nên ta sửa thiết kế chứ không sửa test: câu truy vấn chuyển vào repository, controller gọi service.</p>
${MA113_REPO}
${MA113_TIM}

<h3>Lần thử hai: xanh ở chỗ đáng lẽ phải đỏ</h3>
${OUT113B}
<ul>
  <li><strong>Sinh viên duyệt được lượt đặt: 200.</strong> <code>@PreAuthorize</code> không làm gì, vì <code>@EnableMethodSecurity</code> nằm trên cấu hình <code>BaoMat</code> của ta, mà lát cắt không nạp lớp <code>@Configuration</code>. Một test cho tuyến này mà đòi 200 sẽ xanh và chẳng chứng minh được gì.</li>
  <li><strong>Không token: 403, không phải 401.</strong> Không có chuỗi của ta thì chuỗi mặc định của Spring Boot được dùng: form login, HTTP Basic và bật CSRF. Bộ lọc CSRF chặn POST trước khi ai kịp hỏi token.</li>
  <li><strong>Thế sao POST có <code>jwt()</code> lại qua (201)?</strong> Bộ hậu xử lý <code>jwt()</code> của <code>spring-security-test</code> gọi <code>CsrfFilter.skipRequest</code> (ta đã đọc bytecode của bản 7.1.2), vì request mang bearer token không cần token CSRF. Nên request đó né đúng cái bộ lọc đã chặn request ẩn danh.</li>
</ul>
<p>Bài học: test lát cắt không có cấu hình bảo mật thật của bạn là đang test một ứng dụng khác.</p>

<h3>Test thật: chuỗi bảo mật của bạn, service là mock</h3>
${MA113_TEST}
<ul>
  <li><code>@Import(BaoMat.class)</code> mang vào <code>SecurityFilterChain</code> thật, bộ giải mã JWT và <code>@EnableMethodSecurity</code>. Các bean khác của nó cần <code>JdbcClient</code> nên ta mock; tầng web không bao giờ dùng tới.</li>
  <li><code>@MockitoBean(name = "quyen")</code>: biểu thức <code>@quyen.chuHoacAdmin(…)</code> tìm bean <em>theo tên</em>. <code>@MockitoBean</code> (Spring Framework 6.2+) thay <code>@MockBean</code> của Boot, thứ đã không còn ở Boot 4.</li>
  <li><code>jwt()</code> đặt sẵn một đối tượng xác thực vào request: subject và quyền, không chữ ký, không chuỗi token. Token thật để bài 11.5.</li>
  <li>Hai kiểu viết đặt cạnh nhau. <code>MockMvc</code> + <code>andExpect(jsonPath…)</code> là kiểu cổ điển bạn sẽ gặp ở hầu hết dự án. <code>MockMvcTester</code> (Spring Framework 6.2+) dựa trên AssertJ: không có checked exception, một chuỗi gọi liền, và thông báo lỗi in ra phản hồi.</li>
  <li><code>ArgumentCaptor</code> chứng minh quy tắc của bài 9.6: thân request ghi <code>SE180124</code>, service nhận <code>SE180123</code> lấy từ token.</li>
  <li>Test 409 kiểm trọn <code>ProblemDetail</code>: status, title, detail và <code>instance</code>, với kiểu nội dung <code>application/problem+json</code> — hợp đồng mà frontend dựa vào.</li>
</ul>
${OUT113C}
<p>Tám test trong khoảng bốn giây, context mất chưa tới ba giây. Nó được lưu đệm: <code>@WebMvcTest</code> kế tiếp với cùng cấu hình khởi động trong vài mili giây.</p>

<h3>So JSON lỏng hay chặt?</h3>
<p><code>isLenientlyEqualTo</code> kiểm các trường bạn liệt kê có mặt với đúng giá trị và bỏ qua mọi thứ khác. Tiện, và nguy hiểm với phản hồi:</p>
${MA113_CHAT}
${OUT113_CHAT}
<p>Cùng phản hồi, cùng JSON mong đợi: so lỏng thì xanh, so chặt thì đỏ và gọi tên hai trường ta không liệt kê (<code>startAt</code>, <code>endAt</code>). Ở đây chúng vô hại. Nếu một lần tái cấu trúc nào đó thêm <code>passwordHash</code> hay token đặt lại mật khẩu vào phản hồi, chỉ phép so chặt — hoặc một phép kiểm "trường này không tồn tại" — mới chuyển đỏ.</p>

<h3>🕵️ Góc hacker — Grindr, tháng 10/2020</h3>
<p>Tháng 10/2020, nhà nghiên cứu bảo mật Wassime Bouimadaghene phát hiện tuyến "quên mật khẩu" của Grindr trả token đặt lại mật khẩu ngay trong phản hồi JSON. Ai biết email của một người dùng cũng có thể yêu cầu đặt lại, đọc token từ phản hồi và chiếm tài khoản. Troy Hunt xác nhận bằng một tài khoản thử; Grindr vá sau khi TechCrunch đưa tin ngày 2/10/2020. Xét về chức năng, tuyến đó chạy "đúng" — email vẫn được gửi — chỉ là trường thừa kia chưa bao giờ bị kiểm.</p>
<p><strong>Bạn làm gì:</strong> DTO phản hồi (bài 10.1) thay vì entity; so JSON chặt cho các tuyến nhạy cảm, hoặc <code>extractingPath("$.resetToken")</code> + "không tồn tại"; coi mỗi trường mới trong phản hồi là một phần của hợp đồng API và review nó.</p>

<h3>So với Node.js</h3>
<p>Công cụ quen thuộc với Express là <code>supertest</code>: <code>request(app).post('/bookings').set('Authorization', …).expect(201)</code>. Nó gọi ứng dụng mà không mở cổng, giống MockMvc. Có hai khác biệt đáng kể. Express không có "lát cắt": bạn hoặc nạp cả ứng dụng (kèm kết nối CSDL), hoặc tự dựng một ứng dụng nhỏ chỉ có router và service giả. Và không có thứ như <code>jwt()</code>, nên test thường ký một token thật bằng bí mật dành cho test — gần với bài 11.5 hơn.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Frontend và backend thống nhất mã trạng thái và thân lỗi; mỗi trường hợp lỗi một test controller là cách rẻ nhất giữ thoả thuận đó.</li>
  <li>Test lát cắt mà cần mười <code>@MockitoBean</code> nghĩa là controller phụ thuộc quá nhiều thứ. Đó là phản hồi về thiết kế, không phải chuyện test.</li>
  <li>Cấu hình bảo mật phải có trong test. Đội nào bỏ bảo mật khỏi lát cắt "cho test dễ" sẽ phát hành những tuyến mà <code>@PreAuthorize</code> chưa từng được chạy thử.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@WebMvcTest khác @SpringBootTest?"</strong> — WebMvcTest chỉ nạp tầng MVC (controller, advice, filter, Jackson), nhanh; SpringBootTest nạp cả ứng dụng. Dùng lát cắt cho hành vi HTTP, context đầy đủ cho cả luồng.</li>
  <li><strong>"Sao @WebMvcTest của tôi hỏng với 'No qualifying bean'?"</strong> — Controller phụ thuộc thứ nằm ngoài lát cắt: mock nó bằng <code>@MockitoBean</code>, hoặc đưa phụ thuộc đó ra sau một service.</li>
  <li><strong>"Test của tôi trả 403 cho POST — vì sao?"</strong> — Thường là CSRF của chuỗi bảo mật mặc định; nạp cấu hình của chính bạn, hoặc dùng <code>csrf()</code> với ứng dụng dùng session.</li>
  <li><strong>"MockMvc khác gọi HTTP thật?"</strong> — MockMvc chạy DispatcherServlet trong bộ nhớ, không mạng, không servlet container. Gọi thật (RANDOM_PORT) còn test cả Tomcat, thứ tự filter và tuần tự hoá trên đường truyền.</li>
  <li><strong>"Test một phản hồi ProblemDetail thế nào?"</strong> — Status, kiểu nội dung <code>application/problem+json</code>, và các trường <code>title</code>, <code>detail</code>, <code>instance</code> dưới dạng JSON.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết <code>lichNgay_congKhai_200</code>: <code>GET /labs/IOT-01/bookings?date=2030-02-01</code> không có token nào trả 200 và một mảng JSON (service là mock).</li>
  <li>Viết <code>thieuNgay_400</code>: cùng URL nhưng thiếu <code>date</code>. Bạn đoán status và <code>detail</code> nào? Chạy rồi so.</li>
  <li>Trong <code>WebMvcNgayThoTest</code>, chỉ một annotation nào làm <code>sinhVienDuyetLuot</code> đúng, và annotation nào làm <code>khongToken</code> đúng?</li>
</ol>
<p><strong>Đạt khi:</strong> test 1 và 2 xanh với phép kiểm của chính bạn; bài 3 bạn nêu <code>@Import(BaoMat.class)</code> cho cả hai và giải thích vì sao.</p></div>
${giai('Xem đáp án', `<p>1. <code>when(svc.lichNgay("IOT-01", LocalDate.parse("2030-02-01"))).thenReturn(List.of())</code>, rồi <code>assertThat(mvc.get().uri("/labs/IOT-01/bookings?date=2030-02-01")).hasStatus(200).bodyJson().isEqualTo("[]")</code>. Tuyến này là <code>permitAll</code> trong <code>BaoMat</code> nên không cần <code>with(…)</code>.</p><p>2. Thiếu <code>@RequestParam</code> là <code>MissingServletRequestParameterException</code>; khi bật ProblemDetail, Spring trả 400 với detail "Required parameter 'date' is not present." Kiểm bằng <code>extractingPath("$.detail")</code>.</p><p>3. Cả hai: <code>@Import(BaoMat.class)</code>. Nó mang <code>@EnableMethodSecurity</code> vào (nên <code>hasRole('ADMIN')</code> chạy và sinh viên nhận 403) và chuỗi của ta với CSRF tắt và điểm vào bearer (nên không token thì 401 thay vì 403 CSRF của chuỗi mặc định). Rồi thêm các <code>@MockitoBean</code> nó cần, như trong <code>BookingControllerWebTest</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Lát cắt test (test slice)</strong> — test chỉ nạp một tầng của Spring (web, JPA, JSON…), không phải cả ứng dụng.</li>
  <li><strong>MockMvc / MockMvcTester</strong> — gọi controller trong bộ nhớ qua DispatcherServlet thật; cái sau đi với AssertJ.</li>
  <li><strong>@MockitoBean</strong> — mock Mockito được đăng ký vào context test của Spring, thay hoặc thêm một bean.</li>
  <li><strong>Request post-processor</strong> — <code>jwt()</code>, <code>csrf()</code>, <code>user()</code>: sửa request giả trước khi gửi.</li>
  <li><strong>JSON lỏng / chặt</strong> — bỏ qua trường không liệt kê / đánh hỏng khi gặp chúng.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>@WebMvcTest</code> test hành vi HTTP trong vài giây: tuyến, JSON, mã trạng thái, ProblemDetail, bảo mật.</li>
  <li>Controller cần JPA thì không cắt lát được: đưa truy vấn ra sau service.</li>
  <li>Nạp cấu hình bảo mật thật, nếu không lát cắt test chuỗi mặc định của Boot và <code>@PreAuthorize</code> lặng lẽ không làm gì.</li>
  <li><code>jwt()</code> bỏ qua CSRF và giả một người dùng đã xác thực; <code>@MockitoBean(name=…)</code> cho bean được dùng trong SpEL.</li>
  <li>So JSON chặt (hoặc kiểm vắng mặt tường minh) ở nơi một trường thừa là một vụ lộ dữ liệu.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/testing/mockmvc/assertj.html', '🍃', 'Spring Framework — MockMvcTester (tích hợp AssertJ)', 'Request, JSON path và ProblemDetail với AssertJ.')}
${tl('https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html', '🍃', 'Spring Boot — Testing Spring Boot applications', 'Test MVC tự cấu hình và mỗi lát cắt nạp những gì.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/index.html', '🔐', 'Spring Security — hỗ trợ MockMvc', 'jwt(), csrf(), user() và @WithMockUser.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>WebMvcNgayThoTest</code>, <code>BookingControllerWebTest</code>, <code>JsonChatTest</code> ở <code>lab/c11/app</code>; Spring Boot 4.1.2, Spring Security 7.1.2 (bytecode của <code>JwtRequestPostProcessor</code> đọc bằng <code>javap</code>), Temurin 21.0.12.1 (20/11/2026).</li>
  <li>Lỗ hổng đặt lại mật khẩu của Grindr: TechCrunch, 2/10/2020; xác nhận của Troy Hunt công bố cùng ngày.</li>
</ul>
</div>
`;

// ===== Bài 11.4 =====
const MA114_TC = java("/** 11.4 — MỘT PostgreSQL thật cho mọi test cần CSDL. @ServiceConnection ⇒ Boot tự đặt url/user/password từ container. */\n@TestConfiguration(proxyBeanMethods = false)\nclass TcConfig {\n    @Bean\n    @ServiceConnection\n    PostgreSQLContainer postgres() { return new PostgreSQLContainer(\"postgres:16\"); }\n}");
const MA114_REPO = java("/** 11.4 — câu JPQL chạy trên PostgreSQL THẬT (Flyway dựng schema). Mỗi test tự rollback (@DataJpaTest là @Transactional). */\n@DataJpaTest\n@Import(TcConfig.class)\n@ActiveProfiles(\"dev\")\nclass BookingRepositoryTcTest {\n    @Autowired BookingRepository bookings;\n    @Autowired LabRepository labs;\n    @Autowired StudentRepository students;\n    @Autowired JdbcClient db;\n\n    Lab iot, net;\n    Student an;\n\n    static LocalDateTime t(String hhmm) { return LocalDateTime.parse(\"2030-02-01T\" + hhmm); }\n\n    @BeforeEach\n    void coSanMotLuot() {\n        iot = labs.findByCode(\"IOT-01\").orElseThrow();\n        net = labs.findByCode(\"NET-02\").orElseThrow();\n        an = students.findByStudentCode(\"SE180124\").orElseThrow();\n        bookings.saveAndFlush(new Booking(iot, an, t(\"08:00\"), t(\"10:00\")));    // An giữ IOT-01 08:00–10:00\n    }\n\n    @Test\n    void postgresThat() {\n        System.out.println(\"CSDL test: \" + db.sql(\"select version()\").query(String.class).single());\n        System.out.println(\"Flyway: \" + db.sql(\"select string_agg(coalesce(version, 'R') || ' ' || description, ' · ' order by installed_rank) from flyway_schema_history\")\n            .query(String.class).single());\n    }\n\n    @ParameterizedTest(name = \"{0}–{1} ⇒ trùng: {2}\")\n    @CsvSource({\n        \"10:00, 12:00, false\",     // nối đuôi: bắt đầu đúng lúc An kết thúc\n        \"06:00, 08:00, false\",     // nối đầu\n        \"09:45, 11:00, true\",      // chồng 15 phút cuối\n        \"07:00, 13:00, true\",      // bao trùm\n        \"08:30, 09:30, true\",      // nằm trong\n        \"08:00, 10:00, true\" })    // trùng khít\n    void trung(String tu, String den, boolean coTrung) {\n        assertThat(bookings.trung(iot, t(tu), t(den), Limit.of(1))).hasSize(coTrung ? 1 : 0);\n    }\n\n    @Test\n    void phongKhacKhongTinh() {\n        assertThat(bookings.trung(net, t(\"08:00\"), t(\"10:00\"), Limit.of(1))).isEmpty();\n    }\n\n    @Test\n    void luotDaHuyKhongChanAi() {\n        Booking b = bookings.findAll().getFirst();\n        b.cancel();\n        bookings.flush();\n        assertThat(bookings.trung(iot, t(\"08:00\"), t(\"10:00\"), Limit.of(1))).isEmpty();\n    }\n\n    @Test\n    void demLuotTrongNgay_boQuaLuotHuy() {\n        bookings.save(new Booking(net, an, t(\"13:00\"), t(\"15:00\")));\n        Booking huy = bookings.save(new Booking(net, an, t(\"16:00\"), t(\"17:00\")));\n        huy.cancel();\n        bookings.save(new Booking(net, an, LocalDateTime.parse(\"2030-02-02T08:00\"), LocalDateTime.parse(\"2030-02-02T09:00\")));  // hôm sau\n        bookings.flush();\n        assertThat(bookings.trongNgay(an, t(\"00:00\"), LocalDateTime.parse(\"2030-02-02T00:00\"))).isEqualTo(2);\n    }\n\n    @Test\n    void phanTrangCuaSinhVien() {\n        bookings.save(new Booking(net, an, t(\"13:00\"), t(\"15:00\")));\n        bookings.flush();\n        var p = bookings.cuaSinhVien(\"SE180124\", PageRequest.of(0, 1, Sort.by(\"startAt\")));\n        assertThat(p.getTotalElements()).isEqualTo(2);\n        assertThat(p.getContent()).extracting(BookingView::labCode).containsExactly(\"IOT-01\");\n    }\n}");
const MA114_SONG = java("/** 11.4 — cả ứng dụng + PostgreSQL thật: 10 sinh viên đặt CÙNG một khung giờ CÙNG lúc ⇒ đúng 1 người được. */\n@SpringBootTest(properties = \"labflow.jwt.secret=chi-dung-trong-test-dai-hon-32-byte-0000\")\n@Import(TcConfig.class)\n@ActiveProfiles(\"dev\")\nclass DatSongSongTcTest {\n    @Autowired BookingService svc;\n    @Autowired JdbcClient db;\n\n    static final LocalDateTime T8 = LocalDateTime.parse(\"2030-02-01T08:00\"), T10 = LocalDateTime.parse(\"2030-02-01T10:00\");\n\n    @AfterEach\n    void donDuLieu() { db.sql(\"delete from bookings\").update(); }   // không có rollback tự động: đây không phải @DataJpaTest\n\n    @Test\n    void muoiNguoiCungLuc_chiMotNguoiDuoc() throws Exception {\n        List<String> sv = db.sql(\"select student_code from students order by student_code limit 10\").query(String.class).list();\n        CountDownLatch xuatPhat = new CountDownLatch(1);\n        try (ExecutorService pool = Executors.newFixedThreadPool(10)) {\n            List<Future<String>> kq = sv.stream().map(code -> pool.submit(() -> {\n                xuatPhat.await();\n                try { svc.dat(new BookingRequest(\"IOT-01\", code, T8, T10)); return \"201\"; }\n                catch (ResponseStatusException e) { return String.valueOf(e.getStatusCode().value()); }\n            })).toList();\n            xuatPhat.countDown();\n            Map<String, Long> dem = new TreeMap<>();\n            for (Future<String> f : kq) dem.merge(f.get(10, TimeUnit.SECONDS), 1L, Long::sum);\n            System.out.println(\"Kết quả 10 lượt đặt song song: \" + dem);\n            assertThat(dem).containsExactlyEntriesOf(new TreeMap<>(Map.of(\"201\", 1L, \"409\", 9L)));\n        }\n        assertThat(db.sql(\"select count(*) from bookings\").query(Long.class).single()).isEqualTo(1);\n    }\n}");
const OUT114 = out("$ ./mvnw test -Dtest=BookingRepositoryTcTest,DatSongSongTcTest\nINFO [main] tc.testcontainers/ryuk:0.14.0            : Creating container for image: testcontainers/ryuk:0.14.0\nINFO [main] tc.testcontainers/ryuk:0.14.0            : Container testcontainers/ryuk:0.14.0 started in PT2.708529069S\nINFO [main] tc.postgres:16                           : Creating container for image: postgres:16\nINFO [main] tc.postgres:16                           : Container postgres:16 started in PT15.542531222S\nINFO [main] tc.postgres:16                           : Container is started (JDBC URL: jdbc:postgresql://localhost:32769/test?loggerLevel=OFF)\nINFO [main] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:32769/test?loggerLevel=OFF (PostgreSQL 16.15)\nINFO [main] o.f.core.internal.command.DbMigrate      : Successfully applied 7 migrations to schema \"public\", now at version v5 (execution time 00:00.038s)\nINFO [main] labflow.BookingRepositoryTcTest          : Started BookingRepositoryTcTest in 24.953 seconds (process running for 26.45)\nCSDL test: PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit\nFlyway: 1 baseline · 2 reference labs · 3 lab building · 4 accounts · 5 profile · R dev students · R lab usage\nTests run: 11, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 26.25 s -- in labflow.BookingRepositoryTcTest\nINFO [main] tc.postgres:16                           : Creating container for image: postgres:16\nINFO [main] tc.postgres:16                           : Container postgres:16 started in PT6.814308623S\nINFO [main] tc.postgres:16                           : Container is started (JDBC URL: jdbc:postgresql://localhost:32770/test?loggerLevel=OFF)\nINFO [main] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:32770/test?loggerLevel=OFF (PostgreSQL 16.15)\nINFO [main] o.f.core.internal.command.DbMigrate      : Successfully applied 7 migrations to schema \"public\", now at version v5 (execution time 00:00.061s)\nINFO [main] labflow.DatSongSongTcTest                : Started DatSongSongTcTest in 9.719 seconds (process running for 36.959)\nKết quả 10 lượt đặt song song: {201=1, 409=9}\nTests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 10.06 s -- in labflow.DatSongSongTcTest\nTests run: 12, Failures: 0, Errors: 0, Skipped: 0");
const OUT114_SQL = out("Hibernate: select b1_0.id from bookings b1_0 where b1_0.lab_id=? and b1_0.status<>'CANCELLED' and b1_0.start_at<? and b1_0.end_at>? order by b1_0.id fetch first ? rows only");
const OUT114_DOT = out("$ ./mvnw test -Dtest=BookingServiceTest,BookingRepositoryTcTest\n# đột biến M1 (nối đuôi 10:00 bị tính là trùng): BookingRepository.java — \"b.endAt > :start\" ⇒ \"b.endAt >= :start\"\nERROR Tests run: 11, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 9.098 s <<< FAILURE! -- in labflow.BookingRepositoryTcTest\nERROR labflow.BookingRepositoryTcTest.trung(String, String, boolean)[1] -- Time elapsed: 0.090 s <<< FAILURE!\nExpected size: 0 but was: 1 in:\nTests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.402 s -- in labflow.BookingServiceTest\nERROR Tests run: 19, Failures: 1, Errors: 0, Skipped: 0");
const MA114_CHUNG = java("/** 11.4 — container TĨNH: một PostgreSQL cho CẢ lần chạy, dù có bao nhiêu ApplicationContext. Dùng: @ImportTestcontainers(TcChung.class). */\ninterface TcChung {\n    @ServiceConnection\n    PostgreSQLContainer PG = new PostgreSQLContainer(\"postgres:16\");\n}");
const OUT114_CHUNG = out("# Cách 1: @Bean @ServiceConnection trong TcConfig — mỗi ApplicationContext một container\nINFO [main] tc.postgres:16                           : Container postgres:16 started in PT8.562633091S\nINFO [main] labflow.BaoMatTest                       : Started BaoMatTest in 23.724 seconds (process running for 26.425)\nINFO [main] labflow.BookingControllerWebTest         : Started BookingControllerWebTest in 1.435 seconds (process running for 29.236)\nINFO [main] tc.postgres:16                           : Container postgres:16 started in PT5.57590424S\nINFO [main] labflow.BookingRepositoryTcTest          : Started BookingRepositoryTcTest in 6.309 seconds (process running for 35.979)\nINFO [main] tc.postgres:16                           : Container postgres:16 started in PT5.926807041S\nINFO [main] labflow.DatSongSongTcTest                : Started DatSongSongTcTest in 7.357 seconds (process running for 44.382)\nINFO [main] tc.postgres:16                           : Container postgres:16 started in PT6.42523798S\nINFO [main] labflow.DauCuoiJwtTest                   : Started DauCuoiJwtTest in 8.49 seconds (process running for 53.223)\nTests run: 55, Failures: 0, Errors: 0, Skipped: 0\nTotal time:  01:05 min\n\n# Cách 2: container tĩnh trong TcChung + @ImportTestcontainers — một container cho cả lần chạy\nINFO [main] tc.postgres:16                           : Container postgres:16 started in PT9.293098437S\nINFO [main] labflow.BaoMatTest                       : Started BaoMatTest in 19.616 seconds (process running for 21.238)\nINFO [main] labflow.BookingControllerWebTest         : Started BookingControllerWebTest in 0.963 seconds (process running for 23.082)\nINFO [main] labflow.BookingRepositoryTcTest          : Started BookingRepositoryTcTest in 0.569 seconds (process running for 23.939)\nINFO [main] labflow.DatSongSongTcTest                : Started DatSongSongTcTest in 1.139 seconds (process running for 26.057)\nINFO [main] labflow.DauCuoiJwtTest                   : Started DauCuoiJwtTest in 1.463 seconds (process running for 27.786)\nTests run: 55, Failures: 0, Errors: 0, Skipped: 0\nTotal time:  35.162 s");

const L114_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Integration tests with Testcontainers</h2>
<p class="lead">Lesson 11.2 ended with a warning: mocks prove the service reacts to "there is an overlap", never that the query finds one. The query, the Flyway migrations, the locks and the transaction all live in PostgreSQL, so they can only be tested against PostgreSQL. Testcontainers starts a real one in Docker for the test run and throws it away afterwards. This lesson measures what that costs and what it catches.</p>

<h3>In everyday life first</h3>
<p>A car maker can test the engine on a bench and the brakes on a rig, but before a model is sold it drives on a real road, in rain, with a real driver. Nobody wants to learn on the motorway that the brakes and the wet asphalt disagree. For LabFlow, PostgreSQL is the road: <code>fetch first ? rows only</code>, <code>timestamp</code> comparisons, <code>for update</code> locks and <code>flyway_schema_history</code> behave as PostgreSQL decides, not as a mock or an H2 database imitates.</p>

<h3>Why not H2?</h3>
<p>Many tutorials test with H2, an in-memory database. It is fast and needs no Docker, but it is a <em>different</em> database: other SQL dialect, other locking, other types. LabFlow's migrations use PostgreSQL syntax (identity columns, <code>on conflict</code>, partial indexes from chapter 8), and lesson 7.4 depended on PostgreSQL's exact isolation behaviour. A test that passes on H2 tells you about H2.</p>

<h3>One container, declared as a bean</h3>
${MA114_TC}
<p><code>@ServiceConnection</code> is the whole wiring: Boot reads the container's JDBC URL, user and password and builds the <code>DataSource</code> from them. No <code>spring.datasource.url</code> in test properties, no fixed port. Testcontainers 2.0 moved the class to <code>org.testcontainers.postgresql.PostgreSQLContainer</code> (artifact <code>testcontainers-postgresql</code>); old tutorials import it from <code>org.testcontainers.containers</code>.</p>
<p>On your machine this needs only Docker running. (Our lab runs Maven itself inside a container, so the script also mounts <code>/var/run/docker.sock</code> and sets <code>TESTCONTAINERS_HOST_OVERRIDE=localhost</code>; on a laptop with Docker Desktop you need none of that.)</p>

<h3>@DataJpaTest: the repository against real PostgreSQL</h3>
${MA114_REPO}
<ul>
  <li><code>@DataJpaTest</code> is the JPA slice: entities, repositories, Flyway, a <code>DataSource</code> — no web layer. It is <code>@Transactional</code>, so every test <strong>rolls back</strong> at the end: the booking created in <code>@BeforeEach</code> never accumulates.</li>
  <li>We did not need <code>@AutoConfigureTestDatabase(replace = NONE)</code>, the line most tutorials add: Boot did not try to replace our data source with an embedded one, because it came from a <code>@ServiceConnection</code>.</li>
  <li><code>@ActiveProfiles("dev")</code> also runs the <code>db/dev</code> migration, so the seed students exist — the same data as in every chapter so far.</li>
  <li>The six CSV rows are the boundaries of "overlap": touching at the end, touching at the start, overlapping the last 15 minutes, covering, inside, identical.</li>
</ul>

<h3>Concurrency: ten students, one slot, one winner</h3>
${MA114_SONG}
<ul>
  <li><code>@SpringBootTest</code> starts the whole application. It is <strong>not</strong> transactional, and must not be: ten threads each run their own transaction and must see each other's commits. So we clean up by hand in <code>@AfterEach</code>.</li>
  <li>A <code>CountDownLatch</code> holds all ten threads at the line and releases them together, so the requests really race.</li>
</ul>

<h3>Run it</h3>
${OUT114}
<ul>
  <li>Testcontainers first starts <strong>Ryuk</strong> (2.7 s), a small container that deletes every container of this run when the JVM exits — even if the test crashes.</li>
  <li>PostgreSQL <strong>16.15</strong> starts on a random free port (32769, then 32770). The first start took 15.5 s on a busy machine; later ones 5–9 s. Flyway applied all 7 migrations in 38 ms.</li>
  <li>The 11 repository tests themselves took about a second (26.25 s in total, 24.95 s of it starting the context and the container).</li>
  <li>Ten concurrent bookings: <strong>{201=1, 409=9}</strong>, one row in the table. The room lock from lesson 7.5 holds under real concurrency, in a test that runs on every build.</li>
</ul>
<p>Hibernate printed the real SQL of the overlap query (<code>spring.jpa.show-sql</code> is on in <code>@DataJpaTest</code>):</p>
${OUT114_SQL}

<h3>The bug that every mock test missed</h3>
<p>We planted one character in the overlap query — <code>b.endAt &gt; :start</code> became <code>b.endAt &gt;= :start</code>, so a booking that starts exactly when another ends counts as overlapping — and ran the Mockito tests and the repository tests on that code:</p>
${OUT114_DOT}
<p>All 8 Mockito tests stay green: they stub <code>trung(…)</code> and never run it. The real-database test fails on exactly one row, the boundary "10:00–12:00 after 08:00–10:00". In production this bug would refuse every back-to-back booking, the most common booking pattern in a lab.</p>

<h3>The cost, and how to cut it</h3>
<p>A <code>@Bean</code> container belongs to its Spring context. Each test class with a different configuration (a slice, a full context, one with <code>RANDOM_PORT</code>…) gets a new context, and therefore a new PostgreSQL. A <code>static</code> container in an interface, imported with <code>@ImportTestcontainers(TcChung.class)</code>, is started once and shared by every context in the JVM:</p>
${MA114_CHUNG}
${OUT114_CHUNG}
<ul>
  <li>Same 55 tests. <strong>Four</strong> PostgreSQL containers and 65 s with the bean, <strong>one</strong> container and 35 s with the static field.</li>
  <li>Sharing has a price: data survives between test classes. Every test that commits (not rolled back) must clean up, as <code>DatSongSongTcTest</code> does, or tests start failing depending on their order.</li>
  <li>Keep the number of distinct context configurations small (same properties, same profiles), so Spring's context cache can reuse them too.</li>
</ul>

<h3>🕵️ Hacker corner — TSB Bank, April 2018</h3>
<p>Over the weekend of 20–22 April 2018 the British bank TSB moved 5.2 million customers to a new banking platform. On Monday about 1.9 million could not log in, some saw other people's accounts, and fraudsters phoned confused customers pretending to be the bank. The independent Slaughter and May review (2019) found that testing had not been done against an environment representative of production, and that capacity and integration testing were cut short to meet the date. Regulators fined TSB £48.65 million in 2022.</p>
<p><strong>What you do:</strong> test against the same kind of database, the same migrations and the same concurrency you run in production; treat "it passed on the test database" as evidence only if the test database is the real thing.</p>

<h3>Compared with Node.js</h3>
<p>Testcontainers exists for Node too (<code>@testcontainers/postgresql</code>): <code>new PostgreSqlContainer('postgres:16').start()</code> in a Jest/Vitest <code>beforeAll</code>, then pass <code>getConnectionUri()</code> to Prisma and run <code>prisma migrate deploy</code>. What Spring adds is <code>@ServiceConnection</code> (no URL plumbing), <code>@DataJpaTest</code>'s automatic rollback, and the context cache. In Node you write those parts yourself, usually as one global setup file.</p>

<h3>In real life and at work</h3>
<ul>
  <li>CI servers (chapter 17) have Docker, so these tests run on every pull request. A 35-second suite is fine; a 10-minute one gets skipped by people, so watch the container count.</li>
  <li>Use the same image tag as production (<code>postgres:16</code> here, matching 16.15 in every chapter). Testing on 17 while production runs 16 is the TSB mistake in miniature.</li>
  <li>For SWP391: an integration test that proves "two students cannot book the same slot" is the strongest evidence you can show a lecturer about concurrency.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Why Testcontainers instead of H2?"</strong> — Same database engine, dialect, locking and migrations as production; H2 tests H2.</li>
  <li><strong>"@DataJpaTest vs @SpringBootTest?"</strong> — DataJpaTest: JPA slice, transactional, rolls back each test. SpringBootTest: the whole app, not transactional by default; you clean up.</li>
  <li><strong>"Why not make the concurrency test @Transactional?"</strong> — Worker threads have their own transactions and would not see the test's uncommitted data; and the rollback would hide what really happened.</li>
  <li><strong>"How do you keep Testcontainers suites fast?"</strong> — One shared static container, few distinct context configurations, reuse images; parallelize only with isolated data.</li>
  <li><strong>"What does @ServiceConnection do?"</strong> — It turns a container into connection details (URL, user, password) that Boot's auto-configuration uses, replacing <code>@DynamicPropertySource</code> boilerplate.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a row to <code>trung</code> for a booking 07:45–08:00 next to An's 08:00–10:00. Predict, then run.</li>
  <li>Write <code>phongKhacCungGio_haiNguoiCungDuoc</code> in <code>DatSongSongTcTest</code>: ten students, five on IOT-01 and five on NET-02, same slot. Predict the result map.</li>
  <li>Plant the cancelled-booking mutant (remove <code>and b.status &lt;&gt; 'CANCELLED'</code>). Which test of this lesson turns red?</li>
</ol>
<p><strong>Done when:</strong> your predictions match, test 2 passes with an exact map, and you name the test for task 3.</p></div>
${giai('Show the answers', `<p>1. <code>07:45, 08:00, false</code> — it ends exactly when An starts, the "touching at the start" case, like the 06:00–08:00 row.</p><p>2. <code>{201=2, 409=8}</code>: one winner per room. Each room has its own lock row, so the two races do not interfere.</p><p>3. <code>luotDaHuyKhongChanAi</code>: with the filter removed, An's cancelled booking still overlaps 08:00–10:00 and the list has one id. In the Lab 11 grader, this mutant (M2) is killed only by suites that run the query against PostgreSQL.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Integration test</strong> — tests your code together with real infrastructure (database, HTTP, Spring context).</li>
  <li><strong>Testcontainers</strong> — library that starts throw-away Docker containers from tests.</li>
  <li><strong>Ryuk</strong> — Testcontainers' cleanup container: removes everything when the JVM exits.</li>
  <li><strong>@ServiceConnection</strong> — Boot annotation that turns a container into connection properties.</li>
  <li><strong>Context cache</strong> — Spring reuses an application context across test classes with the same configuration.</li>
  <li><strong>Mutation</strong> — a small deliberate bug planted to check whether the tests notice it.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Queries, migrations, locks and transactions can only be tested against the real database engine.</li>
  <li><code>@ServiceConnection</code> + a <code>PostgreSQLContainer</code> = a real PostgreSQL with zero configuration.</li>
  <li><code>@DataJpaTest</code> rolls back; <code>@SpringBootTest</code> does not — clean up after committing tests.</li>
  <li>A one-character query bug passed 8 mock tests and failed 1 real-database test.</li>
  <li>One static shared container: 1 PostgreSQL instead of 4, 35 s instead of 65 s.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/testing/testcontainers.html', '🍃', 'Spring Boot — Testcontainers', '@ServiceConnection, @ImportTestcontainers, containers at development time.')}
${tl('https://java.testcontainers.org/modules/databases/postgres/', '🐳', 'Testcontainers — PostgreSQL module', 'Images, init scripts, reuse.')}
${tl('https://www.tsb.co.uk/news-releases/slaughter-and-may/', '🏦', 'Slaughter and May — independent review of the TSB IT migration', 'What went wrong with testing, in 280 pages.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>BookingRepositoryTcTest</code>, <code>DatSongSongTcTest</code>, <code>TcConfig</code>, <code>TcChung</code> in <code>lab/c11/app</code>; mutant run with <code>dot-demo.sh</code>; Spring Boot 4.1.2, Testcontainers 2.0.5, Ryuk 0.14.0, PostgreSQL 16.15, Flyway 12.4.0, Hibernate 7.4.13 (20/11/2026).</li>
  <li>TSB: Slaughter and May independent review, 19/11/2019; FCA and PRA final notices, 20/12/2022.</li>
</ul>
</div>
`;

const L114_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Test tích hợp với Testcontainers</h2>
<p class="lead">Bài 11.2 kết thúc bằng một lời cảnh báo: mock chứng minh service phản ứng với "có trùng", chứ không bao giờ chứng minh câu truy vấn tìm ra chỗ trùng. Câu truy vấn, các migration Flyway, khoá và giao dịch đều sống trong PostgreSQL, nên chỉ test được trên PostgreSQL. Testcontainers dựng một PostgreSQL thật trong Docker cho lần chạy test rồi vứt đi sau đó. Bài này đo cái giá của nó và những gì nó bắt được.</p>

<h3>Đời thường trước đã</h3>
<p>Hãng xe có thể thử động cơ trên bệ và thử phanh trên giàn, nhưng trước khi bán một mẫu xe, họ chạy nó trên đường thật, dưới mưa, với tài xế thật. Không ai muốn phát hiện trên cao tốc rằng phanh và mặt đường ướt không hợp nhau. Với LabFlow, PostgreSQL là con đường đó: <code>fetch first ? rows only</code>, phép so <code>timestamp</code>, khoá <code>for update</code> và <code>flyway_schema_history</code> cư xử theo cách PostgreSQL quyết định, không phải theo cách một mock hay CSDL H2 bắt chước.</p>

<h3>Sao không dùng H2?</h3>
<p>Nhiều bài hướng dẫn test bằng H2, một CSDL trong bộ nhớ. Nó nhanh và không cần Docker, nhưng là một CSDL <em>khác</em>: phương ngữ SQL khác, cách khoá khác, kiểu dữ liệu khác. Migration của LabFlow dùng cú pháp PostgreSQL (cột identity, <code>on conflict</code>, chỉ mục một phần ở chương 8), và bài 7.4 dựa vào đúng hành vi cô lập của PostgreSQL. Test xanh trên H2 chỉ nói cho bạn biết về H2.</p>

<h3>Một container, khai báo như một bean</h3>
${MA114_TC}
<p><code>@ServiceConnection</code> là toàn bộ phần nối dây: Boot đọc JDBC URL, user và mật khẩu của container rồi dựng <code>DataSource</code> từ đó. Không có <code>spring.datasource.url</code> trong thuộc tính test, không có cổng cố định. Testcontainers 2.0 đã chuyển lớp sang <code>org.testcontainers.postgresql.PostgreSQLContainer</code> (artifact <code>testcontainers-postgresql</code>); hướng dẫn cũ còn import từ <code>org.testcontainers.containers</code>.</p>
<p>Trên máy bạn chỉ cần Docker đang chạy. (Phòng lab của ta chạy chính Maven trong một container, nên script gắn thêm <code>/var/run/docker.sock</code> và đặt <code>TESTCONTAINERS_HOST_OVERRIDE=localhost</code>; trên laptop có Docker Desktop bạn không cần gì trong số đó.)</p>

<h3>@DataJpaTest: repository chạy trên PostgreSQL thật</h3>
${MA114_REPO}
<ul>
  <li><code>@DataJpaTest</code> là lát cắt JPA: entity, repository, Flyway, một <code>DataSource</code> — không có tầng web. Nó là <code>@Transactional</code>, nên mỗi test <strong>rollback</strong> khi kết thúc: lượt đặt tạo trong <code>@BeforeEach</code> không bao giờ dồn lại.</li>
  <li>Ta không cần dòng <code>@AutoConfigureTestDatabase(replace = NONE)</code> mà phần lớn hướng dẫn thêm vào: Boot không tìm cách thay data source của ta bằng CSDL nhúng, vì nó đến từ một <code>@ServiceConnection</code>.</li>
  <li><code>@ActiveProfiles("dev")</code> chạy thêm migration <code>db/dev</code>, nên các sinh viên mẫu có sẵn — đúng dữ liệu của mọi chương trước.</li>
  <li>Sáu dòng CSV là các biên của "trùng": chạm ở cuối, chạm ở đầu, chồng 15 phút cuối, bao trùm, nằm trong, trùng khít.</li>
</ul>

<h3>Đồng thời: mười sinh viên, một khung giờ, một người thắng</h3>
${MA114_SONG}
<ul>
  <li><code>@SpringBootTest</code> khởi động cả ứng dụng. Nó <strong>không</strong> có giao dịch, và không được có: mười luồng mỗi luồng chạy giao dịch riêng và phải thấy dữ liệu đã commit của nhau. Nên ta tự dọn trong <code>@AfterEach</code>.</li>
  <li><code>CountDownLatch</code> giữ cả mười luồng ở vạch xuất phát rồi thả cùng lúc, nên các request thật sự tranh nhau.</li>
</ul>

<h3>Chạy thử</h3>
${OUT114}
<ul>
  <li>Testcontainers khởi động <strong>Ryuk</strong> trước (2,7 giây), một container nhỏ xoá mọi container của lần chạy khi JVM thoát — kể cả khi test chết giữa chừng.</li>
  <li>PostgreSQL <strong>16.15</strong> chạy trên một cổng trống ngẫu nhiên (32769, rồi 32770). Lần đầu mất 15,5 giây trên máy đang bận; các lần sau 5–9 giây. Flyway áp đủ 7 migration trong 38 ms.</li>
  <li>Bản thân 11 test repository chỉ chạy khoảng một giây (tổng 26,25 giây, trong đó 24,95 giây là khởi động context và container).</li>
  <li>Mười lượt đặt đồng thời: <strong>{201=1, 409=9}</strong>, một dòng trong bảng. Khoá phòng của bài 7.5 đứng vững dưới tranh chấp thật, trong một test chạy ở mọi lần build.</li>
</ul>
<p>Hibernate in ra câu SQL thật của truy vấn kiểm trùng (<code>spring.jpa.show-sql</code> bật sẵn trong <code>@DataJpaTest</code>):</p>
${OUT114_SQL}

<h3>Lỗi mà mọi test mock đều bỏ sót</h3>
<p>Ta cài một ký tự vào câu kiểm trùng — <code>b.endAt &gt; :start</code> thành <code>b.endAt &gt;= :start</code>, tức lượt bắt đầu đúng lúc lượt khác kết thúc bị coi là trùng — rồi chạy test Mockito và test repository trên mã đó:</p>
${OUT114_DOT}
<p>Cả 8 test Mockito vẫn xanh: chúng stub <code>trung(…)</code> và không bao giờ chạy nó. Test trên CSDL thật hỏng đúng một dòng, biên "10:00–12:00 sau 08:00–10:00". Trên production lỗi này sẽ từ chối mọi lượt đặt nối đuôi, kiểu đặt phổ biến nhất ở phòng lab.</p>

<h3>Cái giá, và cách cắt giảm</h3>
<p>Container khai bằng <code>@Bean</code> thuộc về context Spring của nó. Mỗi lớp test có cấu hình khác (một lát cắt, một context đầy đủ, một cái có <code>RANDOM_PORT</code>…) nhận một context mới, và vì thế một PostgreSQL mới. Container <code>static</code> trong một interface, nạp bằng <code>@ImportTestcontainers(TcChung.class)</code>, chỉ khởi động một lần và dùng chung cho mọi context trong JVM:</p>
${MA114_CHUNG}
${OUT114_CHUNG}
<ul>
  <li>Cùng 55 test. <strong>Bốn</strong> container PostgreSQL và 65 giây với bean, <strong>một</strong> container và 35 giây với trường static.</li>
  <li>Dùng chung có giá: dữ liệu sống sót giữa các lớp test. Mọi test có commit (không rollback) phải tự dọn, như <code>DatSongSongTcTest</code>, không thì test bắt đầu hỏng tuỳ thứ tự chạy.</li>
  <li>Giữ ít cấu hình context khác nhau (cùng thuộc tính, cùng profile), để bộ đệm context của Spring cũng tái dùng được.</li>
</ul>

<h3>🕵️ Góc hacker — ngân hàng TSB, tháng 4/2018</h3>
<p>Cuối tuần 20–22/4/2018, ngân hàng Anh TSB chuyển 5,2 triệu khách hàng sang nền tảng ngân hàng mới. Sáng thứ Hai khoảng 1,9 triệu người không đăng nhập được, một số thấy tài khoản của người khác, và kẻ lừa đảo gọi điện cho khách đang hoang mang, giả làm ngân hàng. Bản đánh giá độc lập của Slaughter and May (2019) kết luận việc test không được làm trên môi trường đủ giống production, và test tải lẫn test tích hợp bị cắt ngắn để kịp ngày. Cơ quan quản lý phạt TSB 48,65 triệu bảng năm 2022.</p>
<p><strong>Bạn làm gì:</strong> test trên cùng loại CSDL, cùng migration và cùng mức đồng thời như production; chỉ coi "xanh trên CSDL test" là bằng chứng khi CSDL test là đồ thật.</p>

<h3>So với Node.js</h3>
<p>Testcontainers cũng có cho Node (<code>@testcontainers/postgresql</code>): <code>new PostgreSqlContainer('postgres:16').start()</code> trong <code>beforeAll</code> của Jest/Vitest, rồi đưa <code>getConnectionUri()</code> cho Prisma và chạy <code>prisma migrate deploy</code>. Thứ Spring thêm vào là <code>@ServiceConnection</code> (không phải tự nối URL), rollback tự động của <code>@DataJpaTest</code>, và bộ đệm context. Ở Node bạn tự viết các phần đó, thường gom vào một tệp thiết lập toàn cục.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Máy CI (chương 17) có Docker, nên các test này chạy ở mọi pull request. Bộ test 35 giây thì ổn; bộ test 10 phút sẽ bị người ta bỏ qua, nên hãy để ý số container.</li>
  <li>Dùng đúng tag image như production (<code>postgres:16</code> ở đây, khớp 16.15 của mọi chương). Test trên 17 trong khi production chạy 16 là lỗi của TSB thu nhỏ.</li>
  <li>Với SWP391: một test tích hợp chứng minh "hai sinh viên không đặt được cùng một khung giờ" là bằng chứng mạnh nhất về xử lý đồng thời bạn có thể đưa giảng viên xem.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Sao dùng Testcontainers thay H2?"</strong> — Cùng engine CSDL, phương ngữ, cách khoá và migration như production; H2 thì chỉ test H2.</li>
  <li><strong>"@DataJpaTest khác @SpringBootTest?"</strong> — DataJpaTest: lát cắt JPA, có giao dịch, rollback sau mỗi test. SpringBootTest: cả ứng dụng, mặc định không giao dịch; bạn tự dọn.</li>
  <li><strong>"Sao không để test đồng thời là @Transactional?"</strong> — Các luồng làm việc có giao dịch riêng, không thấy dữ liệu chưa commit của test; và rollback sẽ che mất điều thật sự đã xảy ra.</li>
  <li><strong>"Giữ bộ test Testcontainers nhanh thế nào?"</strong> — Một container static dùng chung, ít cấu hình context khác nhau, tái dùng image; chỉ chạy song song khi dữ liệu tách biệt.</li>
  <li><strong>"@ServiceConnection làm gì?"</strong> — Biến một container thành thông tin kết nối (URL, user, mật khẩu) cho auto-configuration của Boot dùng, thay cho đoạn <code>@DynamicPropertySource</code> viết tay.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm một dòng vào <code>trung</code> cho lượt 07:45–08:00 cạnh lượt 08:00–10:00 của An. Đoán trước, rồi chạy.</li>
  <li>Viết <code>phongKhacCungGio_haiNguoiCungDuoc</code> trong <code>DatSongSongTcTest</code>: mười sinh viên, năm người đặt IOT-01 và năm người đặt NET-02, cùng khung giờ. Đoán bảng kết quả.</li>
  <li>Cài đột biến lượt đã huỷ (xoá <code>and b.status &lt;&gt; 'CANCELLED'</code>). Test nào của bài này chuyển đỏ?</li>
</ol>
<p><strong>Đạt khi:</strong> các dự đoán khớp, test 2 xanh với bảng kết quả chính xác, và bạn nêu đúng tên test của bài 3.</p></div>
${giai('Xem đáp án', `<p>1. <code>07:45, 08:00, false</code> — nó kết thúc đúng lúc An bắt đầu, trường hợp "chạm ở đầu", giống dòng 06:00–08:00.</p><p>2. <code>{201=2, 409=8}</code>: mỗi phòng một người thắng. Mỗi phòng có dòng khoá riêng, nên hai cuộc đua không ảnh hưởng nhau.</p><p>3. <code>luotDaHuyKhongChanAi</code>: bỏ bộ lọc thì lượt đã huỷ của An vẫn trùng 08:00–10:00 và danh sách có một id. Trong máy chấm Lab 11, đột biến này (M2) chỉ bị diệt bởi bộ test chạy truy vấn trên PostgreSQL.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Test tích hợp</strong> — test mã của bạn cùng hạ tầng thật (CSDL, HTTP, context Spring).</li>
  <li><strong>Testcontainers</strong> — thư viện dựng container Docker dùng-một-lần từ trong test.</li>
  <li><strong>Ryuk</strong> — container dọn dẹp của Testcontainers: xoá mọi thứ khi JVM thoát.</li>
  <li><strong>@ServiceConnection</strong> — annotation của Boot biến một container thành thuộc tính kết nối.</li>
  <li><strong>Bộ đệm context</strong> — Spring tái dùng application context giữa các lớp test có cùng cấu hình.</li>
  <li><strong>Đột biến (mutation)</strong> — một lỗi nhỏ cài cố ý để xem test có nhận ra không.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Truy vấn, migration, khoá và giao dịch chỉ test được trên đúng engine CSDL thật.</li>
  <li><code>@ServiceConnection</code> + một <code>PostgreSQLContainer</code> = PostgreSQL thật, không cần cấu hình.</li>
  <li><code>@DataJpaTest</code> rollback; <code>@SpringBootTest</code> thì không — dọn sau các test có commit.</li>
  <li>Một lỗi một ký tự trong truy vấn qua mặt 8 test mock và hỏng ở 1 test CSDL thật.</li>
  <li>Một container static dùng chung: 1 PostgreSQL thay vì 4, 35 giây thay vì 65 giây.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/testing/testcontainers.html', '🍃', 'Spring Boot — Testcontainers', '@ServiceConnection, @ImportTestcontainers, container lúc phát triển.')}
${tl('https://java.testcontainers.org/modules/databases/postgres/', '🐳', 'Testcontainers — module PostgreSQL', 'Image, script khởi tạo, tái dùng.')}
${tl('https://www.tsb.co.uk/news-releases/slaughter-and-may/', '🏦', 'Slaughter and May — đánh giá độc lập vụ chuyển hệ thống của TSB', 'Việc test đã sai ở đâu, trong 280 trang.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>BookingRepositoryTcTest</code>, <code>DatSongSongTcTest</code>, <code>TcConfig</code>, <code>TcChung</code> ở <code>lab/c11/app</code>; lượt chạy đột biến bằng <code>dot-demo.sh</code>; Spring Boot 4.1.2, Testcontainers 2.0.5, Ryuk 0.14.0, PostgreSQL 16.15, Flyway 12.4.0, Hibernate 7.4.13 (20/11/2026).</li>
  <li>TSB: đánh giá độc lập của Slaughter and May, 19/11/2019; quyết định xử phạt của FCA và PRA, 20/12/2022.</li>
</ul>
</div>
`;

// ===== Bài 11.5 =====
const MA115_BAO = java("/** 11.5 — cả ứng dụng (chuỗi bảo mật thật, Quyen thật, PostgreSQL thật), gọi qua MockMvc. */\n@SpringBootTest(properties = \"labflow.jwt.secret=chi-dung-trong-test-dai-hon-32-byte-0000\")\n@AutoConfigureMockMvc\n@Import(TcConfig.class)\n@ActiveProfiles(\"dev\")\nclass BaoMatTest {\n    @Autowired MockMvcTester mvc;\n    @Autowired JdbcClient db;\n    @Autowired @Qualifier(\"requestMappingHandlerMapping\") RequestMappingHandlerMapping hm;\n\n    long cuaAn;\n\n    static JwtRequestPostProcessor sv(String code) {\n        return jwt().jwt(j -> j.subject(code)).authorities(new SimpleGrantedAuthority(\"ROLE_STUDENT\"));\n    }\n\n    @BeforeEach\n    void anCoMotLuot() {\n        cuaAn = db.sql(\"\"\"\n            insert into bookings (lab_id, student_id, start_at, end_at)\n            select l.id, s.id, timestamp '2030-02-01 08:00', timestamp '2030-02-01 10:00'\n            from labs l, students s where l.code = 'IOT-01' and s.student_code = 'SE180124' returning id\"\"\").query(Long.class).single();\n    }\n\n    @AfterEach\n    void don() { db.sql(\"delete from bookings\").update(); }\n\n    @Test\n    void khongToken_401_kemWWWAuthenticate() {\n        assertThat(mvc.get().uri(\"/bookings/{id}\", cuaAn)).hasStatus(401)\n            .satisfies(r -> assertThat(r.getResponse().getHeader(\"WWW-Authenticate\")).startsWith(\"Bearer\"));   // Security 7 thêm resource_metadata=…\n    }\n\n    @Test\n    void tokenRac_401_invalidToken() {\n        assertThat(mvc.get().uri(\"/bookings/{id}\", cuaAn).header(\"Authorization\", \"Bearer abc.def.ghi\"))\n            .hasStatus(401)\n            .satisfies(r -> assertThat(r.getResponse().getHeader(\"WWW-Authenticate\")).contains(\"error=\\\"invalid_token\\\"\"));\n    }\n\n    @Test\n    void lanXemLuotCuaAn_403_anXem_200() {\n        assertThat(mvc.get().uri(\"/bookings/{id}\", cuaAn).with(sv(\"SE180123\"))).hasStatus(403);\n        assertThat(mvc.get().uri(\"/bookings/{id}\", cuaAn).with(sv(\"SE180124\")))\n            .hasStatus(200).bodyJson().extractingPath(\"$.studentCode\").isEqualTo(\"SE180124\");\n    }\n\n    @Test\n    void lanHuyLuotCuaAn_403_vaCSDLKhongDoi() {\n        assertThat(mvc.patch().uri(\"/bookings/{id}/cancel\", cuaAn).with(sv(\"SE180123\"))).hasStatus(403);\n        assertThat(db.sql(\"select status from bookings where id = ?\").param(cuaAn).query(String.class).single()).isEqualTo(\"PENDING\");\n    }\n\n    @Test\n    @WithMockUser(username = \"SE180123\", roles = \"STUDENT\")\n    void withMockUser_danhSachCuaNguoiKhac_403() {\n        assertThat(mvc.get().uri(\"/bookings?studentCode=SE180124\")).hasStatus(403);\n        assertThat(mvc.get().uri(\"/bookings?studentCode=SE180123\")).hasStatus(200);\n    }\n\n    @Test\n    @WithMockUser(username = \"admin\", roles = \"ADMIN\")\n    void withMockUser_adminXemDuoc() {\n        assertThat(mvc.get().uri(\"/bookings/{id}\", cuaAn)).hasStatus(200);\n    }\n\n    /** Từ bài 10.2: không liệt kê tay — hỏi Spring MVC mọi tuyến GET có {id}; tuyến thêm sau này cũng bị kiểm. */\n    @TestFactory\n    Stream<DynamicTest> moiTuyenGetCoId_lanKhongDocDuocCuaAn() {\n        return hm.getHandlerMethods().keySet().stream()\n            .filter(i -> i.getMethodsCondition().getMethods().contains(RequestMethod.GET))\n            .flatMap(i -> i.getPatternValues().stream()).filter(p -> p.contains(\"{id}\")).sorted()\n            .map(p -> DynamicTest.dynamicTest(\"GET \" + p, () ->\n                assertThat(mvc.get().uri(p, cuaAn).with(sv(\"SE180123\"))).hasStatus4xxClientError()));\n    }\n}");
const OUT115_LAN1 = out("$ ./mvnw test -Dtest=BaoMatTest,DauCuoiJwtTest    # lần chạy đầu\nERROR labflow.BaoMatTest.khongToken_401_kemWWWAuthenticate -- Time elapsed: 0.026 s <<< FAILURE!\norg.opentest4j.AssertionFailedError: \n[check primary value for HTTP header 'WWW-Authenticate'] \nexpected: \"Bearer\"\n but was: \"Bearer resource_metadata=\"http://localhost/.well-known/oauth-protected-resource\"\"\nERROR Tests run: 7, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 22.31 s <<< FAILURE! -- in labflow.BaoMatTest");
const MA115_DAU = java("/** 11.5 — đầu-cuối thật: Tomcat trên cổng ngẫu nhiên, đăng ký → đăng nhập → JWT thật → gọi API như frontend. */\n@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,\n                properties = \"labflow.jwt.secret=chi-dung-trong-test-dai-hon-32-byte-0000\")\n@Import(TcConfig.class)\n@ActiveProfiles(\"dev\")\nclass DauCuoiJwtTest {\n    @LocalServerPort int port;\n    @Autowired JdbcClient db;\n    @Autowired JwtEncoder enc;\n    final HttpClient http = HttpClient.newHttpClient();\n    final String matKhau = \"mk-\" + UUID.randomUUID();     // sinh lúc chạy: không có mật khẩu nào nằm trong mã\n\n    record Tra(int status, String body, String wwwAuth) { }\n\n    Tra goi(String method, String path, String token, String json) throws Exception {\n        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create(\"http://localhost:\" + port + path))\n            .method(method, json == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(json));\n        if (json != null) b.header(\"Content-Type\", \"application/json\");\n        if (token != null) b.header(\"Authorization\", \"Bearer \" + token);\n        HttpResponse<String> r = http.send(b.build(), HttpResponse.BodyHandlers.ofString());\n        return new Tra(r.statusCode(), r.body(), r.headers().firstValue(\"WWW-Authenticate\").orElse(\"\"));\n    }\n\n    String dangKyVaDangNhap(String code) throws Exception {\n        assertThat(goi(\"POST\", \"/auth/register\", null, \"{\\\"studentCode\\\":\\\"\" + code + \"\\\",\\\"password\\\":\\\"\" + matKhau + \"\\\"}\").status()).isEqualTo(201);\n        Tra t = goi(\"POST\", \"/auth/login\", null, \"{\\\"username\\\":\\\"\" + code + \"\\\",\\\"password\\\":\\\"\" + matKhau + \"\\\"}\");\n        assertThat(t.status()).isEqualTo(200);\n        return t.body().replaceAll(\".*\\\"access_token\\\":\\\"([^\\\"]+)\\\".*\", \"$1\");\n    }\n\n    @AfterEach\n    void don() {\n        db.sql(\"delete from bookings\").update();\n        db.sql(\"delete from refresh_tokens\").update();\n        db.sql(\"delete from accounts where role = 'STUDENT'\").update();\n    }\n\n    @Test\n    void dangNhapRoiDatLuot_201_xemCuaNguoiKhac_403() throws Exception {\n        String binh = dangKyVaDangNhap(\"SE180125\"), chi = dangKyVaDangNhap(\"SE180126\");\n        Tra dat = goi(\"POST\", \"/bookings\", binh, \"{\\\"labCode\\\":\\\"AI-03\\\",\\\"startAt\\\":\\\"2030-02-01T08:00\\\",\\\"endAt\\\":\\\"2030-02-01T10:00\\\"}\");\n        System.out.println(\"POST /bookings ⇒ \" + dat.status() + \" \" + dat.body());\n        assertThat(dat.status()).isEqualTo(201);\n        String id = dat.body().replaceAll(\".*\\\"id\\\":(\\\\d+).*\", \"$1\");\n        assertThat(goi(\"GET\", \"/bookings/\" + id, binh, null).status()).isEqualTo(200);\n        assertThat(goi(\"GET\", \"/bookings/\" + id, chi, null).status()).isEqualTo(403);\n        assertThat(goi(\"GET\", \"/bookings/\" + id, null, null).status()).isEqualTo(401);\n    }\n\n    @Test\n    void tokenHetHan_401() throws Exception {\n        Instant now = Instant.now();\n        JwtClaimsSet c = JwtClaimsSet.builder().issuer(\"labflow\").subject(\"SE180125\").issuedAt(now.minusSeconds(3600))\n            .expiresAt(now.minusSeconds(120)).claim(\"roles\", List.of(\"STUDENT\")).build();   // hết hạn 120 s > độ lệch 60 s\n        String cu = enc.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), c)).getTokenValue();\n        Tra t = goi(\"GET\", \"/bookings/search?status=PENDING\", cu, null);\n        System.out.println(\"token hết hạn ⇒ \" + t.status() + \" · WWW-Authenticate: \" + t.wwwAuth());\n        assertThat(t.status()).isEqualTo(401);\n        assertThat(t.wwwAuth()).contains(\"invalid_token\").contains(\"Jwt expired\");\n    }\n\n    @Test\n    void suaRoleTrongToken_401() throws Exception {\n        String[] p = dangKyVaDangNhap(\"SE180125\").split(\"\\\\.\");\n        String payload = new String(Base64.getUrlDecoder().decode(p[1]), StandardCharsets.UTF_8);\n        String gia = payload.replace(\"\\\"STUDENT\\\"\", \"\\\"ADMIN\\\"\");\n        System.out.println(\"payload thật: \" + payload.replaceAll(\"\\\"(iat|exp)\\\":\\\\d+\", \"\\\"$1\\\":…\"));\n        String tokenGia = p[0] + \".\" + Base64.getUrlEncoder().withoutPadding().encodeToString(gia.getBytes(StandardCharsets.UTF_8)) + \".\" + p[2];\n        Tra t = goi(\"GET\", \"/bookings?studentCode=SE180124\", tokenGia, null);\n        System.out.println(\"token sửa role ⇒ \" + t.status() + \" · WWW-Authenticate: \" + t.wwwAuth());\n        assertThat(t.status()).isEqualTo(401);\n    }\n}");
const OUT115_DAU = out("POST /bookings ⇒ 201 {\"id\":1,\"labCode\":\"AI-03\",\"studentCode\":\"SE180125\",\"startAt\":\"2030-02-01T08:00:00\",\"endAt\":\"2030-02-01T10:00:00\",\"status\":\"PENDING\",\"version\":0}\ntoken hết hạn ⇒ 401 · WWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"An error occurred while attempting to decode the Jwt: Jwt expired at 2026-11-20T03:58:58Z\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\", resource_metadata=\"http://localhost:39889/.well-known/oauth-protected-resource\"\npayload thật: {\"iss\":\"labflow\",\"sub\":\"SE180125\",\"exp\":…,\"iat\":…,\"roles\":[\"STUDENT\"]}\ntoken sửa role ⇒ 401 · WWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"An error occurred while attempting to decode the Jwt: Signed JWT rejected: Invalid signature\", error_uri=\"https://tools.ietf.org/html/rfc6750#section-3.1\", resource_metadata=\"http://localhost:39889/.well-known/oauth-protected-resource\"\nTests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 8.720 s -- in labflow.DauCuoiJwtTest");
const OUT115_XANH = out("$ ./mvnw test -Dtest=BaoMatTest,DauCuoiJwtTest    # sau khi sửa phép kiểm header\nINFO [main] labflow.BaoMatTest                       : Started BaoMatTest in 23.724 seconds (process running for 26.425)\nTests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 26.08 s -- in labflow.BaoMatTest\nINFO [main] labflow.DauCuoiJwtTest                   : Started DauCuoiJwtTest in 8.49 seconds (process running for 53.223)\nTests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 9.755 s -- in labflow.DauCuoiJwtTest");

const L115_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Testing secured endpoints</h2>
<p class="lead">Chapters 9 and 10 built LabFlow's defences: JWT, roles, ownership checks, refusal of tampered tokens. Every one of them was verified once, by hand, with curl. This lesson turns them into tests at three levels of realism — a fake user, a fake token, a real token over real HTTP — and shows what each level can and cannot prove. The first run of these tests also found something new in Spring Security 7.</p>

<h3>In everyday life first</h3>
<p>A company tests its office access control three ways. A guard checks the badge list on paper ("is Lan allowed on floor 5?"). Then someone walks to the door with a badge printed for the test. Finally a real employee badges in through the real reader, in the morning rush. Each test catches different faults: the paper check misses a broken reader, the printed badge misses an expired one. Security tests in Spring are the same three steps: <code>@WithMockUser</code>, <code>jwt()</code>, and a real token against a running server.</p>

<h3>Level 1 and 2: the full application through MockMvc</h3>
${MA115_BAO}
<ul>
  <li><code>@SpringBootTest</code> + <code>@AutoConfigureMockMvc</code>: the whole app, the real filter chain, the real <code>Quyen</code> bean querying the real PostgreSQL (shared container from 11.4). Requests still go through MockMvc, without a network.</li>
  <li><code>@WithMockUser(username, roles)</code> puts a ready <code>Authentication</code> into the security context. Method security (<code>@PreAuthorize</code>) sees it; the JWT filter is never involved. Fine for "who may do what", useless for "is the token valid".</li>
  <li><code>jwt()</code> builds a <code>JwtAuthenticationToken</code> with the subject and authorities you choose — closer to production, because controllers see a <code>Jwt</code> principal, but the signature, expiry and issuer are still not checked.</li>
  <li>The IDOR checks from lesson 10.2 now run against the real ownership query: Lan reads An's booking ⇒ 403, cancels it ⇒ 403 <em>and the row is still PENDING</em>. A test that only checks the status code would not notice a bug that returns 403 after cancelling.</li>
  <li>The <code>@TestFactory</code> asks Spring MVC for every GET route with <code>{id}</code> and attacks each as Lan. A route added next month is tested without anyone writing a test.</li>
</ul>

<h3>The first run: a surprise from Spring Security 7</h3>
${OUT115_LAN1}
<p>The status was right (401). The <code>WWW-Authenticate</code> header was not the bare <code>Bearer</code> that every Spring Security 6 tutorial shows: version 7 appends <code>resource_metadata="…/.well-known/oauth-protected-resource"</code>, from the OAuth 2.0 Protected Resource Metadata standard (RFC 9728), so a client can discover how to get a token. Nothing is wrong with the application; the test was too exact about a header it does not own. We now check that the header <em>starts with</em> <code>Bearer</code>:</p>
${OUT115_XANH}
<p>This is why security tests are worth writing even when "nothing changed": an upgrade of the framework changed the HTTP contract, and only a test saw it.</p>

<h3>Level 3: a real token over real HTTP</h3>
${MA115_DAU}
<ul>
  <li><code>RANDOM_PORT</code> starts real Tomcat on a free port; <code>java.net.http.HttpClient</code> talks to it like a browser or a React app would.</li>
  <li>The password is generated at run time (<code>"mk-" + UUID</code>), so no credential sits in the source code or in Git — the secret scanners of chapter 10 stay quiet.</li>
  <li>For the expired token we sign one ourselves with the application's own <code>JwtEncoder</code>, expired 120 s ago — more than the 60 s clock skew of lesson 9.4. No sleeping in tests.</li>
  <li>For the tampered token we decode the payload, change <code>STUDENT</code> to <code>ADMIN</code>, re-encode, and keep the original signature.</li>
</ul>
${OUT115_DAU}
<ul>
  <li>Register, log in, book: <strong>201</strong> with the booking for SE180125 — the identity came from the token, not from the body.</li>
  <li>Expired: <strong>401</strong>, <code>error="invalid_token"</code>, "Jwt expired at …".</li>
  <li>Tampered role: <strong>401</strong>, "Signed JWT rejected: Invalid signature". The payload line shows exactly what an attacker can read — and that reading is not the same as changing.</li>
</ul>

<h3>401 or 403? The table your tests should cover</h3>
<ul>
  <li><strong>No token / bad token / expired / wrong signature</strong> ⇒ 401 (you are not authenticated) with <code>WWW-Authenticate: Bearer …</code>.</li>
  <li><strong>Valid token, wrong role</strong> (student approves) ⇒ 403.</li>
  <li><strong>Valid token, someone else's object</strong> ⇒ 403 here (or 404 if you chose the owner-scoped query of lesson 10.2) — the same for "not yours" and "does not exist".</li>
  <li><strong>Public routes</strong> (<code>/labs</code>, <code>/auth/login</code>) ⇒ 200 without any token. Test this too: a rule change that locks the login page locks everyone out.</li>
</ul>

<h3>🕵️ Hacker corner — First American Financial, May 2019</h3>
<p>In May 2019 Brian Krebs reported that First American Financial, a large US title insurer, exposed about 885 million mortgage documents going back to 2003: bank account numbers, statements, Social Security numbers, driver's licence images. A customer who received a link to his own document noticed that changing the number in the URL showed other people's documents — no login needed. It was an IDOR. The company's own penetration test had found the flaw in January 2019, and it was not fixed. The US SEC fined the company in 2021 for its disclosure controls.</p>
<p><strong>What you do:</strong> an IDOR test per object route that runs on every build (the <code>@TestFactory</code> above), so a finding cannot sit unfixed for months: the build is red until it is fixed. Check the data, not only the status.</p>

<h3>Compared with Node.js</h3>
<p>In Express, the common pattern is <code>supertest</code> plus a token signed in the test with <code>jsonwebtoken</code> and the test secret: <code>jwt.sign({ sub: 'SE180123', roles: ['STUDENT'] }, process.env.JWT_SECRET)</code>. That is level 3 without the port. There is no <code>@WithMockUser</code> equivalent, because there is no global security context: middleware reads <code>req.headers.authorization</code> each time. Route discovery like the <code>@TestFactory</code> is possible (<code>app._router.stack</code>) but relies on Express internals.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Security reviews in companies ask for a "permission matrix": every route × every role ⇒ expected status. A parameterized test over that matrix is the executable version of the document.</li>
  <li>Framework upgrades (Spring Security 6 → 7) change headers, defaults and error bodies. A security suite turns "we upgraded and something feels different" into a precise failing line.</li>
  <li>Bug bounty reports for your SWP391 product would most likely be IDOR or broken role checks. These are also the cheapest tests to write.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"401 vs 403?"</strong> — 401: not authenticated (no or invalid credentials), comes with <code>WWW-Authenticate</code>. 403: authenticated but not allowed.</li>
  <li><strong>"@WithMockUser vs jwt() vs a real token?"</strong> — WithMockUser fakes the security context (tests authorization rules); jwt() fakes an authenticated JWT (also tests code that reads claims); a real token tests decoding, signature, expiry and the filter chain.</li>
  <li><strong>"How do you test that an expired token is rejected without waiting?"</strong> — Sign a token with an expiry in the past using the app's encoder (or a fixed clock), beyond the allowed skew.</li>
  <li><strong>"How do you test for IDOR systematically?"</strong> — For every object route, call it as a different user with an existing id; expect 403/404 and an unchanged database. Generate the route list from the framework.</li>
  <li><strong>"Should security be disabled in tests to make them easier?"</strong> — No; then the tests check a different application. Use test helpers to authenticate instead.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Predict the status in <code>BaoMatTest</code>'s setup for: no token on <code>GET /bookings/search?status=PENDING</code>; Lan's <code>jwt()</code> on <code>GET /bookings?studentCode=SE180124</code>; admin's <code>jwt()</code> on <code>GET /bookings/999999</code>; Lan's <code>jwt()</code> on <code>GET /bookings/999999</code>; no token on <code>GET /labs</code>.</li>
  <li>Write <code>anHuyLuotCuaLan_403</code>, the mirror of <code>lanHuyLuotCuaAn_403</code>, and make sure it checks the database too.</li>
  <li>Explain why <code>tokenHetHan_401</code> cannot be written with <code>@WithMockUser</code>.</li>
</ol>
<p><strong>Done when:</strong> the five predictions match; your test passes, and fails when you replace <code>a.getName()::equals</code> in <code>Quyen</code> with <code>x -&gt; true</code>; your explanation mentions the JWT filter.</p></div>
${giai('Show the answers', `<p>1. 401 (search needs authentication); 403 (<code>chinhMinhHoacAdmin</code>); 404 (admin passes the check, the service finds nothing); 403 (<code>Quyen</code> finds no owner and returns false — the same as "not yours"); 200 (<code>/labs</code> is <code>permitAll</code>). The 404 and the second 403 are exactly what <code>LuongChinhTest</code> and lesson 10.2 recorded.</p><p>2. Insert a booking for SE180123 in the test, call <code>PATCH /bookings/{id}/cancel</code> with <code>sv("SE180124")</code>, expect 403, then read <code>status</code> from the table and expect PENDING. With the mutant <code>.map(x -&gt; true)</code> (M7 of Lab 11) the cancel succeeds and both assertions fail.</p><p>3. <code>@WithMockUser</code> puts an authentication straight into the security context; no token is ever parsed, so there is nothing that could be expired. Only a request with a real <code>Authorization: Bearer …</code> header goes through the JWT filter and its validators.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>@WithMockUser</strong> — runs a test as a fake authenticated user (name, roles).</li>
  <li><strong>jwt() post-processor</strong> — adds a fake JWT authentication to one MockMvc request.</li>
  <li><strong>RANDOM_PORT</strong> — starts the real embedded server on a free port for end-to-end tests.</li>
  <li><strong>Permission matrix</strong> — table of route × role ⇒ allowed or not; the basis of security tests.</li>
  <li><strong>RFC 9728 resource metadata</strong> — the <code>resource_metadata</code> parameter Spring Security 7 adds to <code>WWW-Authenticate</code>.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Three levels: <code>@WithMockUser</code> for rules, <code>jwt()</code> for claims, real tokens over HTTP for the whole JWT path.</li>
  <li>Test the full 401/403 table, including public routes and tampered or expired tokens.</li>
  <li>For IDOR, check the database stayed unchanged, and generate the route list instead of writing it.</li>
  <li>Generate test credentials at run time; never commit them.</li>
  <li>Security tests catch framework changes too: Spring Security 7 changed <code>WWW-Authenticate</code>.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/test/index.html', '🔐', 'Spring Security — Testing', '@WithMockUser, method security tests, MockMvc support.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/oauth2.html', '🔐', 'Spring Security — Testing OAuth 2.0', 'jwt(), opaqueToken() and authorities.')}
${tl('https://www.rfc-editor.org/rfc/rfc9728', '📜', 'RFC 9728 — OAuth 2.0 Protected Resource Metadata', 'Where the new resource_metadata parameter comes from.')}
${tl('https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/', '🕵️', 'Krebs — First American Financial leaked 885 million records', 'An IDOR found, reported, and not fixed.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>BaoMatTest</code>, <code>DauCuoiJwtTest</code> in <code>lab/c11/app</code>; Spring Boot 4.1.2, Spring Security 7.1.2, Nimbus JOSE+JWT 10.9.1, PostgreSQL 16.15 via Testcontainers 2.0.5 (20/11/2026).</li>
  <li>First American Financial: KrebsOnSecurity, 24/5/2019; SEC order, 15/6/2021.</li>
</ul>
</div>
`;

const L115_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Test endpoint có bảo mật</h2>
<p class="lead">Chương 9 và 10 dựng các lớp phòng thủ của LabFlow: JWT, vai trò, kiểm chủ sở hữu, từ chối token bị sửa. Mỗi thứ mới được kiểm một lần, bằng tay, bằng curl. Bài này biến chúng thành test ở ba mức chân thực — người dùng giả, token giả, token thật qua HTTP thật — và chỉ ra mỗi mức chứng minh được gì, không chứng minh được gì. Lần chạy đầu của các test này còn tìm ra một điều mới ở Spring Security 7.</p>

<h3>Đời thường trước đã</h3>
<p>Công ty kiểm hệ thống ra vào văn phòng theo ba cách. Bảo vệ dò danh sách thẻ trên giấy ("Lan có được lên tầng 5 không?"). Rồi một người cầm thẻ in riêng cho buổi thử đi tới cửa. Cuối cùng một nhân viên thật quẹt thẻ qua đầu đọc thật, vào giờ cao điểm buổi sáng. Mỗi cách bắt một loại lỗi: dò giấy không thấy đầu đọc hỏng, thẻ in thử không thấy thẻ hết hạn. Test bảo mật trong Spring cũng ba bước như vậy: <code>@WithMockUser</code>, <code>jwt()</code>, và token thật gọi vào server đang chạy.</p>

<h3>Mức 1 và 2: cả ứng dụng qua MockMvc</h3>
${MA115_BAO}
<ul>
  <li><code>@SpringBootTest</code> + <code>@AutoConfigureMockMvc</code>: cả ứng dụng, chuỗi filter thật, bean <code>Quyen</code> thật truy vấn PostgreSQL thật (container dùng chung từ bài 11.4). Request vẫn đi qua MockMvc, không qua mạng.</li>
  <li><code>@WithMockUser(username, roles)</code> đặt sẵn một <code>Authentication</code> vào security context. Bảo mật phương thức (<code>@PreAuthorize</code>) nhìn thấy nó; filter JWT không hề tham gia. Hợp cho câu hỏi "ai được làm gì", vô dụng cho câu hỏi "token có hợp lệ không".</li>
  <li><code>jwt()</code> dựng một <code>JwtAuthenticationToken</code> với subject và quyền bạn chọn — gần production hơn, vì controller thấy principal là <code>Jwt</code>, nhưng chữ ký, hạn dùng và issuer vẫn chưa được kiểm.</li>
  <li>Các phép kiểm IDOR của bài 10.2 giờ chạy trên truy vấn chủ sở hữu thật: Lan đọc lượt của An ⇒ 403, huỷ nó ⇒ 403 <em>và dòng đó vẫn PENDING</em>. Test chỉ kiểm mã trạng thái sẽ không nhận ra một lỗi trả 403 sau khi đã huỷ xong.</li>
  <li><code>@TestFactory</code> hỏi Spring MVC mọi tuyến GET có <code>{id}</code> rồi tấn công từng tuyến dưới danh nghĩa Lan. Tuyến thêm vào tháng sau tự được test mà không ai phải viết test.</li>
</ul>

<h3>Lần chạy đầu: một bất ngờ từ Spring Security 7</h3>
${OUT115_LAN1}
<p>Mã trạng thái đúng (401). Header <code>WWW-Authenticate</code> thì không phải chữ <code>Bearer</code> trơn như mọi hướng dẫn Spring Security 6: bản 7 nối thêm <code>resource_metadata="…/.well-known/oauth-protected-resource"</code>, theo chuẩn OAuth 2.0 Protected Resource Metadata (RFC 9728), để client tự tìm cách lấy token. Ứng dụng không sai gì; test đã quá khắt khe với một header không thuộc về nó. Giờ ta kiểm header <em>bắt đầu bằng</em> <code>Bearer</code>:</p>
${OUT115_XANH}
<p>Đây là lý do test bảo mật đáng viết kể cả khi "không có gì thay đổi": một lần nâng cấp framework đã đổi hợp đồng HTTP, và chỉ có test nhìn thấy.</p>

<h3>Mức 3: token thật qua HTTP thật</h3>
${MA115_DAU}
<ul>
  <li><code>RANDOM_PORT</code> khởi động Tomcat thật trên một cổng trống; <code>java.net.http.HttpClient</code> nói chuyện với nó như trình duyệt hay ứng dụng React.</li>
  <li>Mật khẩu được sinh lúc chạy (<code>"mk-" + UUID</code>), nên không có thông tin đăng nhập nào nằm trong mã nguồn hay trong Git — máy quét bí mật của chương 10 im lặng.</li>
  <li>Với token hết hạn, ta tự ký một cái bằng chính <code>JwtEncoder</code> của ứng dụng, hết hạn từ 120 giây trước — hơn độ lệch đồng hồ 60 giây của bài 9.4. Không phải ngủ chờ trong test.</li>
  <li>Với token bị sửa, ta giải mã phần payload, đổi <code>STUDENT</code> thành <code>ADMIN</code>, mã hoá lại và giữ nguyên chữ ký gốc.</li>
</ul>
${OUT115_DAU}
<ul>
  <li>Đăng ký, đăng nhập, đặt lượt: <strong>201</strong> với lượt của SE180125 — danh tính lấy từ token, không từ thân request.</li>
  <li>Hết hạn: <strong>401</strong>, <code>error="invalid_token"</code>, "Jwt expired at …".</li>
  <li>Sửa vai trò: <strong>401</strong>, "Signed JWT rejected: Invalid signature". Dòng payload cho thấy đúng thứ kẻ tấn công đọc được — và đọc được không có nghĩa là sửa được.</li>
</ul>

<h3>401 hay 403? Bảng mà test của bạn phải phủ</h3>
<ul>
  <li><strong>Không token / token rác / hết hạn / sai chữ ký</strong> ⇒ 401 (bạn chưa được xác thực) kèm <code>WWW-Authenticate: Bearer …</code>.</li>
  <li><strong>Token hợp lệ, sai vai trò</strong> (sinh viên duyệt lượt) ⇒ 403.</li>
  <li><strong>Token hợp lệ, đối tượng của người khác</strong> ⇒ 403 ở đây (hoặc 404 nếu bạn chọn truy vấn theo chủ của bài 10.2) — như nhau cho "không phải của bạn" và "không tồn tại".</li>
  <li><strong>Tuyến công khai</strong> (<code>/labs</code>, <code>/auth/login</code>) ⇒ 200 không cần token. Test cả cái này: một thay đổi quy tắc khoá nhầm trang đăng nhập là khoá ngoài tất cả mọi người.</li>
</ul>

<h3>🕵️ Góc hacker — First American Financial, tháng 5/2019</h3>
<p>Tháng 5/2019 Brian Krebs đưa tin First American Financial, một công ty bảo hiểm quyền sở hữu nhà đất lớn của Mỹ, để lộ khoảng 885 triệu tài liệu thế chấp từ năm 2003: số tài khoản ngân hàng, sao kê, số an sinh xã hội, ảnh bằng lái. Một khách hàng nhận đường liên kết tới tài liệu của chính mình đã nhận ra: đổi con số trên URL là thấy tài liệu của người khác — không cần đăng nhập. Đó là IDOR. Chính đợt kiểm thử xâm nhập nội bộ của công ty đã tìm ra lỗi này từ tháng 1/2019, và nó không được vá. Năm 2021, SEC của Mỹ phạt công ty vì quy trình công bố thông tin.</p>
<p><strong>Bạn làm gì:</strong> mỗi tuyến đối tượng một test IDOR chạy ở mọi lần build (<code>@TestFactory</code> ở trên), để một phát hiện không thể nằm im hàng tháng: build đỏ cho tới khi vá xong. Kiểm cả dữ liệu, không chỉ mã trạng thái.</p>

<h3>So với Node.js</h3>
<p>Với Express, cách thường gặp là <code>supertest</code> cộng một token ký ngay trong test bằng <code>jsonwebtoken</code> và bí mật dành cho test: <code>jwt.sign({ sub: 'SE180123', roles: ['STUDENT'] }, process.env.JWT_SECRET)</code>. Đó là mức 3 mà không cần cổng. Không có thứ tương đương <code>@WithMockUser</code>, vì không có security context toàn cục: middleware đọc <code>req.headers.authorization</code> mỗi lần. Tự liệt kê tuyến như <code>@TestFactory</code> thì làm được (<code>app._router.stack</code>) nhưng dựa vào phần ruột của Express.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Buổi review bảo mật ở công ty hay đòi một "ma trận quyền": mỗi tuyến × mỗi vai trò ⇒ mã trạng thái mong đợi. Một test tham số chạy qua ma trận đó là phiên bản chạy được của tài liệu.</li>
  <li>Nâng cấp framework (Spring Security 6 → 7) làm đổi header, giá trị mặc định và thân lỗi. Bộ test bảo mật biến cảm giác "nâng cấp xong thấy là lạ" thành một dòng lỗi chính xác.</li>
  <li>Nếu sản phẩm SWP391 của bạn có báo cáo săn lỗi, khả năng cao nhất là IDOR hoặc kiểm vai trò hỏng. Đây cũng là những test rẻ nhất để viết.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"401 khác 403?"</strong> — 401: chưa xác thực (không có hoặc sai thông tin), đi kèm <code>WWW-Authenticate</code>. 403: đã xác thực nhưng không được phép.</li>
  <li><strong>"@WithMockUser, jwt() và token thật khác nhau ra sao?"</strong> — WithMockUser giả security context (test quy tắc phân quyền); jwt() giả một xác thực JWT (test thêm mã đọc claim); token thật test cả giải mã, chữ ký, hạn dùng và chuỗi filter.</li>
  <li><strong>"Test token hết hạn bị từ chối mà không phải chờ thế nào?"</strong> — Ký một token có hạn trong quá khứ bằng encoder của ứng dụng (hoặc đồng hồ cố định), vượt độ lệch cho phép.</li>
  <li><strong>"Test IDOR có hệ thống thế nào?"</strong> — Với mỗi tuyến đối tượng, gọi bằng một người dùng khác với id có thật; đòi 403/404 và CSDL không đổi. Sinh danh sách tuyến từ framework.</li>
  <li><strong>"Có nên tắt bảo mật trong test cho dễ không?"</strong> — Không; khi đó test kiểm một ứng dụng khác. Dùng công cụ hỗ trợ xác thực của test thay vào đó.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Đoán mã trạng thái trong thiết lập của <code>BaoMatTest</code> cho: không token gọi <code>GET /bookings/search?status=PENDING</code>; <code>jwt()</code> của Lan gọi <code>GET /bookings?studentCode=SE180124</code>; <code>jwt()</code> của admin gọi <code>GET /bookings/999999</code>; <code>jwt()</code> của Lan gọi <code>GET /bookings/999999</code>; không token gọi <code>GET /labs</code>.</li>
  <li>Viết <code>anHuyLuotCuaLan_403</code>, bản đối xứng của <code>lanHuyLuotCuaAn_403</code>, và nhớ kiểm cả CSDL.</li>
  <li>Giải thích vì sao <code>tokenHetHan_401</code> không viết được bằng <code>@WithMockUser</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> năm dự đoán khớp; test của bạn xanh, và đỏ khi bạn thay <code>a.getName()::equals</code> trong <code>Quyen</code> bằng <code>x -&gt; true</code>; lời giải thích có nhắc tới filter JWT.</p></div>
${giai('Xem đáp án', `<p>1. 401 (search cần xác thực); 403 (<code>chinhMinhHoacAdmin</code>); 404 (admin qua phép kiểm, service không tìm thấy gì); 403 (<code>Quyen</code> không tìm ra chủ và trả false — giống hệt "không phải của bạn"); 200 (<code>/labs</code> là <code>permitAll</code>). Số 404 và số 403 thứ hai đúng là thứ <code>LuongChinhTest</code> và bài 10.2 đã ghi lại.</p><p>2. Chèn một lượt của SE180123 trong test, gọi <code>PATCH /bookings/{id}/cancel</code> với <code>sv("SE180124")</code>, đòi 403, rồi đọc <code>status</code> từ bảng và đòi PENDING. Với đột biến <code>.map(x -&gt; true)</code> (M7 của Lab 11) lệnh huỷ thành công và cả hai phép kiểm đều hỏng.</p><p>3. <code>@WithMockUser</code> đặt thẳng một đối tượng xác thực vào security context; không có token nào được phân tích, nên chẳng có gì để hết hạn. Chỉ request mang header <code>Authorization: Bearer …</code> thật mới đi qua filter JWT và các bộ kiểm của nó.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>@WithMockUser</strong> — chạy test dưới danh nghĩa một người dùng giả đã xác thực (tên, vai trò).</li>
  <li><strong>jwt() post-processor</strong> — thêm một xác thực JWT giả vào một request MockMvc.</li>
  <li><strong>RANDOM_PORT</strong> — khởi động server nhúng thật trên một cổng trống cho test đầu-cuối.</li>
  <li><strong>Ma trận quyền</strong> — bảng tuyến × vai trò ⇒ được hay không; nền của test bảo mật.</li>
  <li><strong>RFC 9728 resource metadata</strong> — tham số <code>resource_metadata</code> mà Spring Security 7 thêm vào <code>WWW-Authenticate</code>.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Ba mức: <code>@WithMockUser</code> cho quy tắc, <code>jwt()</code> cho claim, token thật qua HTTP cho cả đường đi của JWT.</li>
  <li>Test trọn bảng 401/403, kể cả tuyến công khai và token bị sửa hay hết hạn.</li>
  <li>Với IDOR, kiểm CSDL không đổi, và sinh danh sách tuyến thay vì viết tay.</li>
  <li>Sinh thông tin đăng nhập cho test lúc chạy; không bao giờ commit chúng.</li>
  <li>Test bảo mật bắt cả thay đổi của framework: Spring Security 7 đã đổi <code>WWW-Authenticate</code>.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/test/index.html', '🔐', 'Spring Security — Testing', '@WithMockUser, test bảo mật phương thức, hỗ trợ MockMvc.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/oauth2.html', '🔐', 'Spring Security — Testing OAuth 2.0', 'jwt(), opaqueToken() và quyền.')}
${tl('https://www.rfc-editor.org/rfc/rfc9728', '📜', 'RFC 9728 — OAuth 2.0 Protected Resource Metadata', 'Tham số resource_metadata mới đến từ đâu.')}
${tl('https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/', '🕵️', 'Krebs — First American Financial để lộ 885 triệu hồ sơ', 'Một IDOR được tìm ra, được báo, và không được vá.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>BaoMatTest</code>, <code>DauCuoiJwtTest</code> ở <code>lab/c11/app</code>; Spring Boot 4.1.2, Spring Security 7.1.2, Nimbus JOSE+JWT 10.9.1, PostgreSQL 16.15 qua Testcontainers 2.0.5 (20/11/2026).</li>
  <li>First American Financial: KrebsOnSecurity, 24/5/2019; quyết định của SEC, 15/6/2021.</li>
</ul>
</div>
`;

// ===== Bài 11.6 =====
const MA116_DOT = out("M1|BookingRepository.java|b.endAt > :start|b.endAt >= :start|nối đuôi 10:00 bị tính là trùng\nM2|BookingRepository.java|where b.lab = :lab and b.status <> 'CANCELLED'|where b.lab = :lab|lượt đã huỷ vẫn chặn người khác\nM3|BookingService.java|>= 2) throw LoiNghiepVu.hanMuc|> 2) throw LoiNghiepVu.hanMuc|cho 3 lượt một ngày\nM4|QuyTacDat.java|if (!start.isAfter(now))|if (start.isBefore(now))|đặt được đúng giờ hiện tại\nM5|BookingController.java|Quyen.laAdmin(a) ? r : new BookingRequest(r.labCode(), a.getName(), r.startAt(), r.endAt())|r|sinh viên đặt hộ người khác\nM6|BookingController.java|@PreAuthorize(\"hasRole('ADMIN')\")|@PreAuthorize(\"isAuthenticated()\")|sinh viên tự duyệt\nM7|Quyen.java|.map(a.getName()::equals).orElse(false)|.map(x -> true).orElse(false)|IDOR: ai đăng nhập cũng xem/huỷ được lượt có thật\nM8|BookingService.java|if (b.getVersion() != version) throw LoiNghiepVu.cu(version, b.getVersion());|// (đột biến: bỏ kiểm version)|duyệt bản cũ được");
const MA116_CHAM = bash("while IFS='|' read -r ma tep goc moi mota; do\n  ( d=\"$TMP/$ma\"; chep \"$DA\" \"$d\"; f=\"$d/src/main/java/labflow/$tep\"\n    python3 -c \"import sys;p,a,b=sys.argv[1:];s=open(p).read();assert s.count(a)==1,'không thấy chuỗi gốc';open(p,'w').write(s.replace(a,b))\" \"$f\" \"$goc\" \"$moi\" || { echo \"$ma LỖI-CÀI\" > \"$d/kq\"; exit; }\n    if chay \"$d\"; then echo \"$ma SỐNG\" > \"$d/kq\"; else echo \"$ma DIỆT\" > \"$d/kq\"; fi ) &\n  while [ \"$(jobs -rp | wc -l)\" -ge 3 ]; do sleep 2; done\ndone < <(grep -v '^#' \"$DIR/dot-bien.txt\")\nwait");
const OUT116_STARTER = out("$ bash lab11/cham.sh lab11/starter\n✓ 1. bộ test xanh trên mã đúng (1 test)\n✗ 2. M1 SỐNG — nối đuôi 10:00 bị tính là trùng\n✗ 3. M2 SỐNG — lượt đã huỷ vẫn chặn người khác\n✗ 4. M3 SỐNG — cho 3 lượt một ngày\n✗ 5. M4 SỐNG — đặt được đúng giờ hiện tại\n✗ 6. M5 SỐNG — sinh viên đặt hộ người khác\n✗ 7. M6 SỐNG — sinh viên tự duyệt\n✗ 8. M7 SỐNG — IDOR: ai đăng nhập cũng xem/huỷ được lượt có thật\n✗ 9. M8 SỐNG — duyệt bản cũ được\n✗ 10. độ phủ dòng 3 lớp chính = 24.1% (< 80%)\nĐIỂM: 1/10   (chấm mất 45 giây)");
const OUT116_GIAI = out("$ bash lab11/cham.sh lab11/giai    # lần 1\n✓ 1. bộ test xanh trên mã đúng (59 test)\n✓ 2. M1 diệt — nối đuôi 10:00 bị tính là trùng\n✓ 3. M2 diệt — lượt đã huỷ vẫn chặn người khác\n✓ 4. M3 diệt — cho 3 lượt một ngày\n✓ 5. M4 diệt — đặt được đúng giờ hiện tại\n✓ 6. M5 diệt — sinh viên đặt hộ người khác\n✓ 7. M6 diệt — sinh viên tự duyệt\n✓ 8. M7 diệt — IDOR: ai đăng nhập cũng xem/huỷ được lượt có thật\n✓ 9. M8 diệt — duyệt bản cũ được\n✓ 10. độ phủ dòng 3 lớp chính = 98.1% (≥ 80%)\nĐIỂM: 10/10   (chấm mất 173 giây)\n$ bash lab11/cham.sh lab11/giai    # lần 2\n✓ 1. bộ test xanh trên mã đúng (59 test)\nĐIỂM: 10/10   (chấm mất 142 giây)\n$ bash lab11/cham.sh lab11/giai    # lần 3\n✓ 1. bộ test xanh trên mã đúng (59 test)\nĐIỂM: 10/10   (chấm mất 151 giây)");
const OUT116_MOCK = out("$ bash lab11/cham.sh bay/chimock\n✓ 1. bộ test xanh trên mã đúng (31 test)\n✗ 2. M1 SỐNG — nối đuôi 10:00 bị tính là trùng\n✗ 3. M2 SỐNG — lượt đã huỷ vẫn chặn người khác\n✗ 8. M7 SỐNG — IDOR: ai đăng nhập cũng xem/huỷ được lượt có thật\n✗ 10. độ phủ dòng 3 lớp chính = 57.4% (< 80%)\nĐIỂM: 6/10   (chấm mất 66 giây)");
const MA116_KA = java("@Test\nvoid chayQuaMoiThu() {\n    var sv = jwt().jwt(j -> j.subject(\"SE180123\")).authorities(new SimpleGrantedAuthority(\"ROLE_STUDENT\"));\n    var ad = jwt().jwt(j -> j.subject(\"admin\")).authorities(new SimpleGrantedAuthority(\"ROLE_ADMIN\"));\n    String[] khung = { \"08:00|10:00\", \"10:00|12:00\", \"13:00|14:00\", \"15:00|16:00\", \"10:00|08:00\", \"06:00|08:00\" };\n    for (String k : khung) {\n        String[] p = k.split(\"\\\\|\");\n        mvc.post().uri(\"/bookings\").with(sv).contentType(MediaType.APPLICATION_JSON)\n           .content(\"{\\\"labCode\\\":\\\"IOT-01\\\",\\\"startAt\\\":\\\"2030-02-01T\" + p[0] + \"\\\",\\\"endAt\\\":\\\"2030-02-01T\" + p[1] + \"\\\"}\").exchange();\n    }\n    mvc.post().uri(\"/bookings/batch\").with(sv).contentType(MediaType.APPLICATION_JSON)\n       .content(\"[{\\\"labCode\\\":\\\"NET-02\\\",\\\"startAt\\\":\\\"2030-02-02T08:00\\\",\\\"endAt\\\":\\\"2030-02-02T09:00\\\"}]\").exchange();\n    // … gọi đủ mọi tuyến còn lại, không một assertThat nào");
const OUT116_KA = out("$ bash lab11/cham.sh bay/khongassert\n✓ 1. bộ test xanh trên mã đúng (1 test)\n✗ 2. M1 SỐNG — nối đuôi 10:00 bị tính là trùng\n✗ 3. M2 SỐNG — lượt đã huỷ vẫn chặn người khác\n✗ 4. M3 SỐNG — cho 3 lượt một ngày\n✗ 5. M4 SỐNG — đặt được đúng giờ hiện tại\n✗ 6. M5 SỐNG — sinh viên đặt hộ người khác\n✗ 7. M6 SỐNG — sinh viên tự duyệt\n✗ 8. M7 SỐNG — IDOR: ai đăng nhập cũng xem/huỷ được lượt có thật\n✗ 9. M8 SỐNG — duyệt bản cũ được\nĐIỂM: 2/10   (chấm mất 110 giây)");
const OUT116_QBM = out("$ bash lab11/cham.sh bay/quenbaomat\n✓ 1. bộ test xanh trên mã đúng (49 test)\n✗ 8. M7 SỐNG — IDOR: ai đăng nhập cũng xem/huỷ được lượt có thật\nĐIỂM: 9/10   (chấm mất 130 giây)");
const MA116_LUONG = java("/** Lab 11 (lời giải) — luồng chính đi qua MỌI tầng: đặt → xem lịch → đặt lô → huỷ → duyệt. */\n@SpringBootTest(properties = \"labflow.jwt.secret=chi-dung-trong-test-dai-hon-32-byte-0000\")\n@AutoConfigureMockMvc\n@ImportTestcontainers(TcChung.class)\n@ActiveProfiles(\"dev\")\nclass LuongChinhTest {\n    @Autowired MockMvcTester mvc;\n    @Autowired JdbcClient db;\n\n    static JwtRequestPostProcessor sv(String code) {\n        return jwt().jwt(j -> j.subject(code)).authorities(new SimpleGrantedAuthority(\"ROLE_STUDENT\"));\n    }\n    static JwtRequestPostProcessor admin() {\n        return jwt().jwt(j -> j.subject(\"admin\")).authorities(new SimpleGrantedAuthority(\"ROLE_ADMIN\"));\n    }\n    static String luot(String lab, String tu, String den) {\n        return \"{\\\"labCode\\\":\\\"\" + lab + \"\\\",\\\"startAt\\\":\\\"2030-02-01T\" + tu + \"\\\",\\\"endAt\\\":\\\"2030-02-01T\" + den + \"\\\"}\";\n    }\n\n    @AfterEach\n    void don() { db.sql(\"delete from bookings\").update(); }\n\n    long dat(String code, String lab, String tu, String den) throws Exception {\n        var r = mvc.post().uri(\"/bookings\").with(sv(code)).contentType(MediaType.APPLICATION_JSON).content(luot(lab, tu, den)).exchange();\n        assertThat(r).hasStatus(201);\n        return ((Number) com.jayway.jsonpath.JsonPath.read(r.getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8), \"$.id\")).longValue();\n    }\n\n    @Test\n    void datRoiXemLichNgay_congKhai() throws Exception {\n        dat(\"SE180123\", \"IOT-01\", \"08:00\", \"10:00\");\n        dat(\"SE180124\", \"IOT-01\", \"10:00\", \"12:00\");\n        assertThat(mvc.get().uri(\"/labs/IOT-01/bookings?date=2030-02-01\"))\n            .hasStatus(200).bodyJson().extractingPath(\"$[*].studentCode\").asArray().containsExactly(\"SE180123\", \"SE180124\");\n        assertThat(mvc.get().uri(\"/labs\")).hasStatus(200).bodyJson().extractingPath(\"$[*].code\").asArray().contains(\"IOT-01\", \"NET-02\", \"AI-03\");\n    }\n\n    @Test\n    void khungGioSai_400_quaHTTP() throws Exception {\n        assertThat(mvc.post().uri(\"/bookings\").with(sv(\"SE180123\")).contentType(MediaType.APPLICATION_JSON).content(luot(\"IOT-01\", \"10:00\", \"08:00\")))\n            .hasStatus(400).bodyJson().extractingPath(\"$.detail\").isEqualTo(\"endAt phải sau startAt\");\n    }\n\n    @Test\n    void datLo_luotThuBaTrongNgay_409_vaRollbackCaLo() throws Exception {\n        String lo = \"[\" + luot(\"IOT-01\", \"08:00\", \"09:00\") + \",\" + luot(\"NET-02\", \"13:00\", \"14:00\") + \",\" + luot(\"AI-03\", \"15:00\", \"16:00\") + \"]\";\n        assertThat(mvc.post().uri(\"/bookings/batch\").with(sv(\"SE180123\")).contentType(MediaType.APPLICATION_JSON).content(lo))\n            .hasStatus(409).bodyJson().extractingPath(\"$.detail\").isEqualTo(\"sinh viên SE180123 đã có 2 lượt trong ngày\");\n        assertThat(db.sql(\"select count(*) from bookings\").query(Long.class).single()).isZero();\n    }\n\n    @Test\n    void huyLuotCuaMinh_roiNguoiKhacDatDuoc() throws Exception {\n        long id = dat(\"SE180123\", \"IOT-01\", \"08:00\", \"10:00\");\n        assertThat(mvc.patch().uri(\"/bookings/{id}/cancel\", id).with(sv(\"SE180123\")))\n            .hasStatus(200).bodyJson().extractingPath(\"$.status\").isEqualTo(\"CANCELLED\");\n        dat(\"SE180124\", \"IOT-01\", \"08:00\", \"10:00\");\n    }\n\n    @Test\n    void adminDuyetDungBan_200_banCu_409() throws Exception {\n        long id = dat(\"SE180123\", \"IOT-01\", \"08:00\", \"10:00\");\n        assertThat(mvc.patch().uri(\"/bookings/{id}/approve\", id).with(admin()).contentType(MediaType.APPLICATION_JSON).content(\"{\\\"version\\\":0}\"))\n            .hasStatus(200).bodyJson().extractingPath(\"$.version\").isEqualTo(1);\n        assertThat(mvc.patch().uri(\"/bookings/{id}/approve\", id).with(admin()).contentType(MediaType.APPLICATION_JSON).content(\"{\\\"version\\\":0}\"))\n            .hasStatus(409);\n    }\n\n    @Test\n    void danhSachCuaToi_vaTimTheoTrangThai() throws Exception {\n        dat(\"SE180123\", \"IOT-01\", \"08:00\", \"10:00\");\n        assertThat(mvc.get().uri(\"/bookings?studentCode=SE180123\").with(sv(\"SE180123\")))\n            .hasStatus(200).bodyJson().extractingPath(\"$.total\").isEqualTo(1);\n        assertThat(mvc.get().uri(\"/bookings/search?status=PENDING\").with(sv(\"SE180123\")))\n            .hasStatus(200).bodyJson().extractingPath(\"$[0].labCode\").isEqualTo(\"IOT-01\");\n        assertThat(mvc.get().uri(\"/bookings/999999\").with(admin())).hasStatus(404);\n    }\n}");

const L116_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6 · Lab</span>
<h2>Chapter 11 lab: a test suite that catches real bugs</h2>
<p class="lead">LabFlow works, and it has exactly one test. Your job is to write the suite that lets the team change the code without fear. The grader does not count your tests or trust your coverage number. It plants eight realistic bugs in the code, one at a time, runs <em>your</em> suite against each, and gives a point only when your tests turn red. This is <strong>mutation testing</strong>, done by hand, and it is the most honest measure of a test suite there is.</p>

<h3>The situation</h3>
<p>The team will refactor <code>BookingService</code> next sprint and upgrade Spring Boot after that. The lecturer of the project course asks one question before approving: "how will you know you broke nothing?" Your answer is a suite that runs in under a few minutes, uses the real database where it matters, and fails for every one of the bugs below.</p>

<h3>Your tasks</h3>
<div class="callout ok"><ol>
  <li>Start from <code>lab11/starter</code>: the code of lessons 11.1–11.5 (main class <code>labflow.Lab11App</code>, <code>QuyTacDat</code>, <code>Clock</code> bean, query moved into the repository) with only <code>TcChung</code> and one example test.</li>
  <li>Write tests at the right level for each rule: unit tests for <code>QuyTacDat</code>, Mockito tests for <code>BookingService</code>, <code>@WebMvcTest</code> for the controller (with the real security configuration), Testcontainers for queries and concurrency, full-context tests for ownership and tokens.</li>
  <li>Keep it fast: one shared PostgreSQL (<code>@ImportTestcontainers(TcChung.class)</code>), few context configurations, clean up after tests that commit.</li>
  <li>Run the grader: <code>bash lab11/cham.sh "$PWD/your-project"</code> (needs Docker). It copies your project, so your working tree is never modified.</li>
</ol></div>

<h3>Done when</h3>
<ul>
  <li>The grader prints <strong>10/10 three times in a row</strong>:
    <ol>
      <li>Your suite is green on the correct code (a red suite scores 0: it cannot tell bugs from noise).</li>
      <li>Your suite turns red when a booking that starts exactly when another ends is treated as an overlap.</li>
      <li>… when cancelled bookings still block the slot.</li>
      <li>… when a student may book three times a day.</li>
      <li>… when a booking may start exactly "now".</li>
      <li>… when a student can book in someone else's name.</li>
      <li>… when a student can approve bookings.</li>
      <li>… when any logged-in user can view or cancel any existing booking (IDOR).</li>
      <li>… when an approval with a stale version is accepted.</li>
      <li>Line coverage of <code>BookingService</code>, <code>BookingController</code> and <code>QuyTacDat</code> together is at least 80% (JaCoCo, already in the POM).</li>
    </ol></li>
  <li>No test depends on the order in which classes run; no password or secret is written in the test code.</li>
</ul>
${giai('Show how the grader plants the bugs (after you have written your tests)', `<p>Each line: id | file | original text | mutated text | description. The grader replaces the text in a copy, runs <code>mvn test</code>, and counts the mutant as killed if the build fails.</p>${MA116_DOT}${MA116_CHAM}`)}

<h3>What the starting point and the solution scored</h3>
<p>The starter: green, and useless — every bug survives:</p>
${OUT116_STARTER}
<p>The solution (tests of lessons 11.1–11.5 plus one flow test), three runs, each <strong>10/10</strong> in under three minutes on a busy machine:</p>
${OUT116_GIAI}

<h3>Three shortcuts we graded</h3>
<ul>
  <li><strong>"Unit tests are enough"</strong> — only the tests of 11.1–11.3 (pure Java, Mockito, <code>@WebMvcTest</code>). Fast, and blind to everything that lives in SQL or in a mocked bean:
${OUT116_MOCK}
  Both query bugs survive (the queries are stubbed) and so does IDOR (<code>Quyen</code> is a mock in the web slice). <strong>6/10.</strong></li>
  <li><strong>"100% coverage"</strong> — one test that calls every route and every rule, and checks nothing:
${MA116_KA}
${OUT116_KA}
  Coverage is perfect and <strong>no bug is caught</strong>. Coverage measures which lines ran, not whether anyone looked at the result. <strong>2/10</strong> (green + coverage).</li>
  <li><strong>"Security was tested in chapter 10"</strong> — everything except the full-context security tests of 11.5:
${OUT116_QBM}
  All business bugs die, the IDOR survives: the flow tests only ever cancel their own bookings. <strong>9/10</strong> — and the missing point is the one that leaks data.</li>
</ul>

<h3>🕵️ Hacker corner — CrowdStrike, 19 July 2024</h3>
<p>On 19 July 2024 a content update for CrowdStrike's Falcon sensor ("Channel File 291") crashed about 8.5 million Windows computers: airports, hospitals, banks and TV stations went down for days. The root-cause analysis (6 August 2024) explains that the new template type defined 21 input fields while the sensor code supplied 20. The tests of that template type had used a wildcard for the 21st field, so the out-of-bounds read was never exercised, and the content validator had a bug that let the file through. The code had tests; the tests did not test the case that mattered, and nobody measured that.</p>
<p><strong>What you do:</strong> judge tests by the bugs they catch, not by their number or coverage. Mutation testing (by hand like this lab, or with PIT for Java and Stryker for JavaScript) makes that measurable. Release in stages so that a bug the tests missed reaches a few machines, not all of them.</p>

<h3>Compared with Node.js</h3>
<p>The same lab in an Express project: Vitest or Jest for unit tests with <code>vi.fn()</code>/<code>jest.fn()</code>, supertest for routes, <code>@testcontainers/postgresql</code> plus <code>prisma migrate deploy</code> for the database, a token signed with the test secret for security. Mutation testing has a mature tool there, <strong>Stryker</strong>, which generates hundreds of mutants automatically; Java's equivalent is <strong>PIT</strong> (<code>pitest-maven</code>). Hand-picked mutants like ours are fewer but each one is a bug that really happened in a project like this.</p>

<h3>Scoring out of 10</h3>
<table>
  <tr><th>Part</th><th>Points</th></tr>
  <tr><td>Grader item 1 (green on correct code) — required for any other point</td><td>1</td></tr>
  <tr><td>Grader items 2–9 (one per killed mutant)</td><td>1 each (8)</td></tr>
  <tr><td>Grader item 10 (line coverage ≥ 80% of the three main classes)</td><td>1</td></tr>
</table>
<p>For a course grade, also look at the time: a suite that needs more than five minutes here will be skipped by your teammates.</p>

${giai('Show the solution (only after your own attempt)', `<p>The solution is the test classes of this chapter: <code>QuyTacDatTest</code> (11.1), <code>BookingServiceTest</code> (11.2), <code>BookingControllerWebTest</code> (11.3), <code>BookingRepositoryTcTest</code> and <code>DatSongSongTcTest</code> (11.4), <code>BaoMatTest</code> and <code>DauCuoiJwtTest</code> (11.5) — all switched to <code>@ImportTestcontainers(TcChung.class)</code> — plus one flow test that drives every main route through the full application:</p>${MA116_LUONG}<p>Which test kills which mutant: M1 the row "10:00, 12:00, false" of <code>trung</code>; M2 <code>luotDaHuyKhongChanAi</code>; M3 <code>daCoHaiLuotTrongNgay_409</code> and the batch test; M4 the "đúng bây giờ" row; M5 <code>sinhVienKhongDatHoNguoiKhac</code>; M6 <code>sinhVienDuyet_403_adminDuyet_200</code>; M7 the IDOR tests of <code>BaoMatTest</code>; M8 <code>duyetBanCu_409_khongDoiTrangThai</code> and the approve flow test.</p>`)}

<h3>🎤 What the interviewer will ask (Chapter 11)</h3>
<ol>
  <li><strong>"How do you structure tests in a Spring Boot project?"</strong> — A pyramid: many plain unit tests, Mockito for services, slices (<code>@WebMvcTest</code>, <code>@DataJpaTest</code>) for layers, a few <code>@SpringBootTest</code> flows with Testcontainers.</li>
  <li><strong>"Is 90% coverage good?"</strong> — It says which lines ran, not that results were checked; a suite with no assertions reached 100% and caught nothing. Mutation score is the better measure.</li>
  <li><strong>"Why are your integration tests slow and how would you fix it?"</strong> — Too many contexts and containers; share one static container, align context configuration, keep slices for fast feedback.</li>
  <li><strong>"How do you test concurrency?"</strong> — Start many threads behind a latch against a real database, assert the exact outcome (one winner) and the database state; no <code>@Transactional</code> on the test.</li>
  <li><strong>"What is mutation testing?"</strong> — Plant small bugs automatically or by hand; the share of mutants your tests kill measures their strength. PIT for Java, Stryker for JavaScript.</li>
</ol>

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Mutation testing / mutant</strong> — measuring tests by planting small bugs; a mutant is "killed" when a test fails.</li>
  <li><strong>Mutation score</strong> — killed mutants ÷ all mutants.</li>
  <li><strong>Line coverage</strong> — share of lines executed by the tests (JaCoCo); necessary, never sufficient.</li>
  <li><strong>Flaky test</strong> — passes or fails without a code change, usually from shared data, time or order.</li>
  <li><strong>Permission matrix</strong> — route × role ⇒ expected status, as tests.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>The grader rewards tests that fail for real bugs; that is what tests are for.</li>
  <li>Each level of test catches its own class of bug: mocks miss SQL, slices miss ownership queries, flow tests miss other people's data.</li>
  <li>100% coverage without assertions caught 0 of 8 bugs.</li>
  <li>The full solution ran in under three minutes with one shared PostgreSQL.</li>
  <li>Keep the suite honest after the lab: every bug fixed in the future gets a test that would have caught it.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://pitest.org/', '🧬', 'PIT — mutation testing for Java', 'Automatic mutants, Maven plugin, reports.')}
${tl('https://stryker-mutator.io/', '🧬', 'Stryker Mutator', 'Mutation testing for JavaScript and TypeScript.')}
${tl('https://www.jacoco.org/jacoco/trunk/doc/', '📊', 'JaCoCo documentation', 'What line and branch coverage measure.')}
${tl('https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf', '🕵️', 'CrowdStrike — Channel File 291 root cause analysis', 'How a tested change still crashed 8.5 million machines.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>lab/c11/lab11/{starter, giai, cham.sh, dot-bien.txt}</code> and the three shortcut suites; Spring Boot 4.1.2, JUnit Jupiter 6.0.3, Mockito 5.23.0, Testcontainers 2.0.5, JaCoCo 0.8.15, PostgreSQL 16.15 (20/11/2026).</li>
  <li>CrowdStrike: Preliminary Post Incident Review, 24/7/2024; Root Cause Analysis, 6/8/2024; Microsoft estimate of 8.5 million devices, 20/7/2024.</li>
</ul>
</div>
`;

const L116_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6 · Lab</span>
<h2>Lab chương 11: bộ test bắt được lỗi thật</h2>
<p class="lead">LabFlow chạy được, và có đúng một test. Việc của bạn là viết bộ test cho phép cả nhóm sửa mã mà không sợ. Máy chấm không đếm số test của bạn, cũng không tin con số độ phủ. Nó cài tám lỗi rất thật vào mã, từng lỗi một, chạy bộ test <em>của bạn</em> với mỗi lỗi, và chỉ cho điểm khi test của bạn chuyển đỏ. Đây là <strong>kiểm thử đột biến</strong> (mutation testing) làm bằng tay, thước đo trung thực nhất cho một bộ test.</p>

<h3>Tình huống</h3>
<p>Sprint tới nhóm sẽ tái cấu trúc <code>BookingService</code>, sau đó nâng cấp Spring Boot. Giảng viên môn đồ án hỏi một câu trước khi duyệt: "làm sao các em biết mình không làm hỏng gì?" Câu trả lời của bạn là một bộ test chạy trong vài phút, dùng CSDL thật ở chỗ cần, và đỏ với từng lỗi một trong danh sách dưới đây.</p>

<h3>Việc của bạn</h3>
<div class="callout ok"><ol>
  <li>Bắt đầu từ <code>lab11/starter</code>: mã của bài 11.1–11.5 (lớp chính <code>labflow.Lab11App</code>, <code>QuyTacDat</code>, bean <code>Clock</code>, truy vấn đã chuyển vào repository) với chỉ <code>TcChung</code> và một test mẫu.</li>
  <li>Viết test đúng tầng cho mỗi quy tắc: test đơn vị cho <code>QuyTacDat</code>, Mockito cho <code>BookingService</code>, <code>@WebMvcTest</code> cho controller (kèm cấu hình bảo mật thật), Testcontainers cho truy vấn và đồng thời, test context đầy đủ cho quyền sở hữu và token.</li>
  <li>Giữ cho nhanh: một PostgreSQL dùng chung (<code>@ImportTestcontainers(TcChung.class)</code>), ít cấu hình context, dọn dữ liệu sau các test có commit.</li>
  <li>Chạy máy chấm: <code>bash lab11/cham.sh "$PWD/du-an-cua-ban"</code> (cần Docker). Nó chép dự án của bạn ra chỗ khác, nên cây làm việc của bạn không bao giờ bị sửa.</li>
</ol></div>

<h3>Đạt khi</h3>
<ul>
  <li>Máy chấm in <strong>10/10 ba lần liền</strong>:
    <ol>
      <li>Bộ test của bạn xanh trên mã đúng (bộ test đỏ được 0 điểm: nó không phân biệt được lỗi với nhiễu).</li>
      <li>Bộ test chuyển đỏ khi lượt bắt đầu đúng lúc lượt khác kết thúc bị coi là trùng.</li>
      <li>… khi lượt đã huỷ vẫn chặn khung giờ.</li>
      <li>… khi sinh viên đặt được ba lượt một ngày.</li>
      <li>… khi lượt đặt được phép bắt đầu đúng "bây giờ".</li>
      <li>… khi sinh viên đặt được dưới tên người khác.</li>
      <li>… khi sinh viên duyệt được lượt đặt.</li>
      <li>… khi bất kỳ ai đã đăng nhập cũng xem hoặc huỷ được mọi lượt đặt có thật (IDOR).</li>
      <li>… khi lệnh duyệt với phiên bản cũ được chấp nhận.</li>
      <li>Độ phủ dòng của <code>BookingService</code>, <code>BookingController</code> và <code>QuyTacDat</code> gộp lại ít nhất 80% (JaCoCo, có sẵn trong POM).</li>
    </ol></li>
  <li>Không test nào phụ thuộc thứ tự chạy các lớp; không có mật khẩu hay bí mật nào viết trong mã test.</li>
</ul>
${giai('Xem máy chấm cài lỗi thế nào (sau khi bạn đã viết test)', `<p>Mỗi dòng: mã | tệp | đoạn gốc | đoạn đột biến | mô tả. Máy chấm thay đoạn văn bản trong một bản sao, chạy <code>mvn test</code>, và tính đột biến là bị diệt nếu build hỏng.</p>${MA116_DOT}${MA116_CHAM}`)}

<h3>Điểm xuất phát và lời giải được bao nhiêu</h3>
<p>Bản khởi đầu: xanh, và vô dụng — mọi lỗi đều sống sót:</p>
${OUT116_STARTER}
<p>Lời giải (test của bài 11.1–11.5 cộng một test luồng chính), ba lần chạy, mỗi lần <strong>10/10</strong>, dưới ba phút trên một máy đang bận:</p>
${OUT116_GIAI}

<h3>Ba lối tắt chúng tôi đã chấm</h3>
<ul>
  <li><strong>"Test đơn vị là đủ"</strong> — chỉ có test của 11.1–11.3 (Java thuần, Mockito, <code>@WebMvcTest</code>). Nhanh, và mù với mọi thứ nằm trong SQL hoặc trong một bean bị mock:
${OUT116_MOCK}
  Cả hai lỗi truy vấn sống sót (truy vấn đã bị stub) và IDOR cũng vậy (<code>Quyen</code> là mock trong lát cắt web). <strong>6/10.</strong></li>
  <li><strong>"Độ phủ 100%"</strong> — một test gọi mọi tuyến và mọi quy tắc, và không kiểm gì:
${MA116_KA}
${OUT116_KA}
  Độ phủ hoàn hảo và <strong>không bắt được lỗi nào</strong>. Độ phủ đo dòng nào đã chạy, không đo có ai nhìn vào kết quả hay không. <strong>2/10</strong> (xanh + độ phủ).</li>
  <li><strong>"Bảo mật đã test ở chương 10 rồi"</strong> — có mọi thứ trừ các test bảo mật context đầy đủ của 11.5:
${OUT116_QBM}
  Mọi lỗi nghiệp vụ bị diệt, IDOR sống sót: test luồng chỉ toàn huỷ lượt của chính mình. <strong>9/10</strong> — và điểm bị mất lại đúng là điểm làm lộ dữ liệu.</li>
</ul>

<h3>🕵️ Góc hacker — CrowdStrike, 19/7/2024</h3>
<p>Ngày 19/7/2024, một bản cập nhật nội dung cho cảm biến Falcon của CrowdStrike ("Channel File 291") làm sập khoảng 8,5 triệu máy Windows: sân bay, bệnh viện, ngân hàng và đài truyền hình tê liệt nhiều ngày. Bản phân tích nguyên nhân gốc (6/8/2024) giải thích: kiểu template mới khai 21 trường đầu vào, trong khi mã của cảm biến chỉ cung cấp 20. Test của kiểu template đó dùng ký tự đại diện cho trường thứ 21, nên phép đọc vượt biên chưa bao giờ được chạy tới, và bộ kiểm nội dung có lỗi nên để tệp lọt qua. Mã có test; test không test đúng trường hợp quan trọng, và không ai đo điều đó.</p>
<p><strong>Bạn làm gì:</strong> đánh giá test bằng số lỗi nó bắt được, không bằng số lượng hay độ phủ. Kiểm thử đột biến (bằng tay như lab này, hoặc bằng PIT cho Java và Stryker cho JavaScript) làm việc đó đo được. Phát hành theo từng đợt để lỗi mà test bỏ sót chỉ tới vài máy, không phải tất cả.</p>

<h3>So với Node.js</h3>
<p>Cùng lab này ở một dự án Express: Vitest hoặc Jest cho test đơn vị với <code>vi.fn()</code>/<code>jest.fn()</code>, supertest cho tuyến, <code>@testcontainers/postgresql</code> cộng <code>prisma migrate deploy</code> cho CSDL, token ký bằng bí mật dành cho test cho phần bảo mật. Kiểm thử đột biến ở đó có công cụ rất chín, <strong>Stryker</strong>, tự sinh hàng trăm đột biến; bên Java tương đương là <strong>PIT</strong> (<code>pitest-maven</code>). Đột biến chọn tay như của ta ít hơn, nhưng mỗi cái là một lỗi đã thật sự xảy ra ở dự án kiểu này.</p>

<h3>Thang 10 điểm</h3>
<table>
  <tr><th>Phần</th><th>Điểm</th></tr>
  <tr><td>Mục 1 của máy chấm (xanh trên mã đúng) — bắt buộc để có mọi điểm khác</td><td>1</td></tr>
  <tr><td>Mục 2–9 (mỗi đột biến bị diệt)</td><td>mỗi mục 1 (8)</td></tr>
  <tr><td>Mục 10 (độ phủ dòng ≥ 80% của ba lớp chính)</td><td>1</td></tr>
</table>
<p>Khi chấm cho môn học, nhìn thêm thời gian: bộ test cần hơn năm phút ở đây sẽ bị bạn cùng nhóm bỏ qua.</p>

${giai('Xem lời giải (chỉ sau khi đã tự làm)', `<p>Lời giải là các lớp test của chương này: <code>QuyTacDatTest</code> (11.1), <code>BookingServiceTest</code> (11.2), <code>BookingControllerWebTest</code> (11.3), <code>BookingRepositoryTcTest</code> và <code>DatSongSongTcTest</code> (11.4), <code>BaoMatTest</code> và <code>DauCuoiJwtTest</code> (11.5) — tất cả chuyển sang <code>@ImportTestcontainers(TcChung.class)</code> — cộng một test luồng chính đi qua mọi tuyến chính trên cả ứng dụng:</p>${MA116_LUONG}<p>Test nào diệt đột biến nào: M1 dòng "10:00, 12:00, false" của <code>trung</code>; M2 <code>luotDaHuyKhongChanAi</code>; M3 <code>daCoHaiLuotTrongNgay_409</code> và test đặt lô; M4 dòng "đúng bây giờ"; M5 <code>sinhVienKhongDatHoNguoiKhac</code>; M6 <code>sinhVienDuyet_403_adminDuyet_200</code>; M7 các test IDOR của <code>BaoMatTest</code>; M8 <code>duyetBanCu_409_khongDoiTrangThai</code> và test luồng duyệt.</p>`)}

<h3>🎤 Phỏng vấn viên sẽ hỏi (Chương 11)</h3>
<ol>
  <li><strong>"Bạn tổ chức test trong dự án Spring Boot thế nào?"</strong> — Theo kim tự tháp: thật nhiều test đơn vị thuần, Mockito cho service, lát cắt (<code>@WebMvcTest</code>, <code>@DataJpaTest</code>) cho từng tầng, vài luồng <code>@SpringBootTest</code> với Testcontainers.</li>
  <li><strong>"Độ phủ 90% là tốt chưa?"</strong> — Nó nói dòng nào đã chạy, không nói kết quả có được kiểm; một bộ test không có assertion nào đạt 100% và không bắt được gì. Điểm đột biến là thước đo tốt hơn.</li>
  <li><strong>"Test tích hợp của bạn chậm, bạn sửa thế nào?"</strong> — Quá nhiều context và container; dùng chung một container static, thống nhất cấu hình context, giữ lát cắt cho phản hồi nhanh.</li>
  <li><strong>"Test đồng thời thế nào?"</strong> — Khởi động nhiều luồng sau một chốt chặn trên CSDL thật, kiểm đúng kết quả (một người thắng) và trạng thái CSDL; không đặt <code>@Transactional</code> lên test.</li>
  <li><strong>"Kiểm thử đột biến là gì?"</strong> — Cài những lỗi nhỏ, tự động hoặc bằng tay; tỉ lệ đột biến bị test diệt đo độ mạnh của bộ test. PIT cho Java, Stryker cho JavaScript.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Kiểm thử đột biến / đột biến</strong> — đo bộ test bằng cách cài lỗi nhỏ; đột biến "bị diệt" khi có test hỏng.</li>
  <li><strong>Điểm đột biến</strong> — số đột biến bị diệt ÷ tổng số đột biến.</li>
  <li><strong>Độ phủ dòng</strong> — tỉ lệ dòng được test chạy qua (JaCoCo); cần, nhưng không bao giờ đủ.</li>
  <li><strong>Test chập chờn (flaky)</strong> — lúc xanh lúc đỏ dù mã không đổi, thường do dữ liệu dùng chung, thời gian hoặc thứ tự.</li>
  <li><strong>Ma trận quyền</strong> — tuyến × vai trò ⇒ mã trạng thái mong đợi, viết thành test.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Máy chấm thưởng cho test hỏng khi có lỗi thật; đó chính là việc của test.</li>
  <li>Mỗi tầng test bắt một loại lỗi riêng: mock bỏ sót SQL, lát cắt bỏ sót truy vấn quyền sở hữu, test luồng bỏ sót dữ liệu của người khác.</li>
  <li>Độ phủ 100% mà không có assertion bắt được 0 trên 8 lỗi.</li>
  <li>Lời giải đầy đủ chạy dưới ba phút với một PostgreSQL dùng chung.</li>
  <li>Giữ bộ test trung thực sau lab: mỗi lỗi sửa sau này đi kèm một test lẽ ra đã bắt được nó.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://pitest.org/', '🧬', 'PIT — kiểm thử đột biến cho Java', 'Đột biến tự động, plugin Maven, báo cáo.')}
${tl('https://stryker-mutator.io/', '🧬', 'Stryker Mutator', 'Kiểm thử đột biến cho JavaScript và TypeScript.')}
${tl('https://www.jacoco.org/jacoco/trunk/doc/', '📊', 'Tài liệu JaCoCo', 'Độ phủ dòng và độ phủ nhánh đo gì.')}
${tl('https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf', '🕵️', 'CrowdStrike — phân tích nguyên nhân gốc Channel File 291', 'Vì sao một thay đổi có test vẫn làm sập 8,5 triệu máy.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>lab/c11/lab11/{starter, giai, cham.sh, dot-bien.txt}</code> và ba bộ test lối tắt; Spring Boot 4.1.2, JUnit Jupiter 6.0.3, Mockito 5.23.0, Testcontainers 2.0.5, JaCoCo 0.8.15, PostgreSQL 16.15 (20/11/2026).</li>
  <li>CrowdStrike: Preliminary Post Incident Review, 24/7/2024; Root Cause Analysis, 6/8/2024; ước tính 8,5 triệu thiết bị của Microsoft, 20/7/2024.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ11 = [
  Q('Surefire printed "Tests run: 15 … in giờ kết thúc" and "Tests run: 0 … in QuyTacDat — khung giờ một lượt đặt". What do you conclude?|||Surefire in "Tests run: 15 … in giờ kết thúc" và "Tests run: 0 … in QuyTacDat — khung giờ một lượt đặt". Bạn kết luận gì?', [
    'The outer class lost its tests; the CSV rows did not run|||Lớp ngoài bị mất test; các dòng CSV không chạy',
    'A reporting quirk with @DisplayName + @Nested; trust the final total (17 with VongDoiTest)|||Tật báo cáo khi có @DisplayName + @Nested; tin con số tổng cuối (17 cùng VongDoiTest)',
    'JUnit 6 does not support @Nested|||JUnit 6 không hỗ trợ @Nested',
    '15 tests failed silently|||15 test hỏng âm thầm',
  ], 1),
  Q('VongDoiTest printed two different hash codes and dem = 1 after both a() and b(). Why?|||VongDoiTest in hai mã băm khác nhau và dem = 1 sau cả a() lẫn b(). Vì sao?', [
    'JUnit creates a new test instance for every test method|||JUnit tạo một đối tượng test mới cho mỗi phương thức test',
    '@BeforeEach resets every field to 0|||@BeforeEach đặt mọi trường về 0',
    'The tests ran in parallel|||Các test chạy song song',
    'int fields are static by default in tests|||Trường int trong test mặc định là static',
  ], 0),
  Q('Which failure message tells you what was wrong without opening the code?|||Thông báo lỗi nào cho bạn biết sai gì mà không phải mở mã?', [
    'assertTrue(list.contains("AI-04")): expected <true> but was <false>|||assertTrue(list.contains("AI-04")): expected <true> but was <false>',
    'AssertJ assertThat(list).contains("AI-04"): prints the list and the missing element|||AssertJ assertThat(list).contains("AI-04"): in cả danh sách và phần tử thiếu',
    'Both are equally precise|||Cả hai chính xác như nhau',
    'Neither; you always need a debugger|||Không cái nào; luôn cần debugger',
  ], 1),
  Q('@InjectMocks BookingService with mocks for the three repositories but none for Clock. What happened?|||@InjectMocks BookingService với mock cho ba repository nhưng không có Clock. Chuyện gì xảy ra?', [
    'Compilation error|||Lỗi biên dịch',
    'Mockito created a real system clock|||Mockito tự tạo đồng hồ hệ thống thật',
    'null was passed silently; the test failed later with NullPointerException: clock|||null được truyền âm thầm; test hỏng sau đó với NullPointerException: clock',
    'UnnecessaryStubbingException|||UnnecessaryStubbingException',
  ], 2),
  Q('We changed "b.endAt > :start" to "b.endAt >= :start" in the overlap query. Which tests turned red?|||Ta đổi "b.endAt > :start" thành "b.endAt >= :start" trong truy vấn kiểm trùng. Test nào chuyển đỏ?', [
    'All 8 Mockito tests of BookingService|||Cả 8 test Mockito của BookingService',
    'None — the change is harmless|||Không test nào — thay đổi vô hại',
    'Only the Testcontainers row "10:00–12:00 ⇒ no overlap"; the Mockito tests stayed green|||Chỉ dòng Testcontainers "10:00–12:00 ⇒ không trùng"; test Mockito vẫn xanh',
    'Only the controller test|||Chỉ test controller',
  ], 2),
  Q('A naive @WebMvcTest without @Import(BaoMat.class): a student approves a booking. Result?|||@WebMvcTest ngây thơ không có @Import(BaoMat.class): sinh viên duyệt lượt. Kết quả?', [
    '403, because @PreAuthorize("hasRole(\'ADMIN\')") is on the method|||403, vì @PreAuthorize("hasRole(\'ADMIN\')") nằm trên phương thức',
    '200, because @EnableMethodSecurity lives in BaoMat, which the slice did not load|||200, vì @EnableMethodSecurity nằm trong BaoMat mà lát cắt không nạp',
    '401, no token|||401, không có token',
    '500, no database|||500, không có CSDL',
  ], 1),
  Q('In the same naive slice, a POST without token got 403 but a POST with jwt() got 201. Why?|||Cũng lát cắt ngây thơ đó, POST không token nhận 403 còn POST có jwt() nhận 201. Vì sao?', [
    'jwt() calls CsrfFilter.skipRequest; the default chain\'s CSRF filter rejected only the anonymous POST|||jwt() gọi CsrfFilter.skipRequest; bộ lọc CSRF của chuỗi mặc định chỉ chặn POST ẩn danh',
    'jwt() makes the user ADMIN|||jwt() biến người dùng thành ADMIN',
    'POST is always allowed in tests|||POST luôn được phép trong test',
    'The default chain disables CSRF|||Chuỗi mặc định tắt CSRF',
  ], 0),
  Q('Same 55 tests: TcConfig (@Bean container) vs TcChung (static container + @ImportTestcontainers). What did we measure?|||Cùng 55 test: TcConfig (container @Bean) so với TcChung (container static + @ImportTestcontainers). Ta đo được gì?', [
    'Same time; Testcontainers always reuses containers|||Bằng thời gian; Testcontainers luôn tái dùng container',
    '4 containers / 65 s vs 1 container / 35 s|||4 container / 65 giây so với 1 container / 35 giây',
    '1 container / 65 s vs 4 containers / 35 s|||1 container / 65 giây so với 4 container / 35 giây',
    'The static version failed because data was shared|||Bản static hỏng vì dữ liệu dùng chung',
  ], 1),
  Q('The first run of BaoMatTest failed on WWW-Authenticate. What had changed?|||Lần chạy đầu của BaoMatTest hỏng ở WWW-Authenticate. Cái gì đã đổi?', [
    'The app returned 403 instead of 401|||Ứng dụng trả 403 thay vì 401',
    'Spring Security 7 appends resource_metadata=… (RFC 9728) after "Bearer"|||Spring Security 7 nối resource_metadata=… (RFC 9728) sau "Bearer"',
    'The header was missing|||Header bị thiếu',
    'Tomcat removed the header in MockMvc|||Tomcat bỏ header trong MockMvc',
  ], 1),
  Q('The "no assertions" suite reached 100% line coverage. How many of the 8 planted bugs did it catch?|||Bộ test "không assertion" đạt độ phủ dòng 100%. Nó bắt được bao nhiêu trong 8 lỗi được cài?', [
    '8 — every line ran|||8 — dòng nào cũng chạy',
    '4|||4',
    '0 — coverage shows lines ran, not that results were checked|||0 — độ phủ cho biết dòng đã chạy, không cho biết kết quả có được kiểm',
    'It could not be graded|||Không chấm được',
  ], 2),
];
const L = (n, slug, en, vi, description, content) => ({
  title: `11.${n} — ${en}|||11.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 11 — Testing|||Chương 11 — Kiểm thử',
  description: 'Bộ test thật cho LabFlow trên Spring Boot 4.1.2 (JUnit 6, AssertJ, Mockito, Testcontainers): quy tắc khung giờ 15 test trong 11 ms; Mockito với Clock cố định và thứ tự khoá; @WebMvcTest thiếu cấu hình bảo mật cho sinh viên tự duyệt; PostgreSQL thật: 10 người cùng đặt ⇒ 1 được, lỗi JPQL một ký tự qua mặt 8 test mock; container dùng chung 65 ⇒ 35 giây; Security 7 thêm resource_metadata; Lab 11 chấm bằng 8 đột biến.',
  lessons: [
    L(1, 'sb-11-1-junit5', 'JUnit 5 and AssertJ', 'JUnit 5 và AssertJ',
      'QuyTacDat (Java thuần, nhận "bây giờ" qua tham số); @Test, @DisplayName, @Nested, @ParameterizedTest với @CsvSource/@MethodSource: 15 test trong 0,011 giây; giá trị biên và phân vùng tương đương; vòng đời (đối tượng mới mỗi test); assertTrue so với AssertJ và SoftAssertions; Boot 4 mang JUnit 6.0.3; node:test; goto fail của Apple 2014.',
      L111_EN + L111_VI),
    L(2, 'sb-11-2-mockito', 'Mockito: unit-testing services', 'Mockito: test đơn vị cho service',
      'BookingService.dat với ba repository mock và Clock cố định: stubbing, matcher, verify/never/verifyNoInteractions, ArgumentCaptor, InOrder kiểm thứ tự khoá phòng → sinh viên; 8 test ~2,5 giây; cảnh báo tự gắn agent trên JDK 21 và cách nạp Mockito làm agent; bẫy @InjectMocks truyền null, strict stubs; khi nào không nên mock; đột biến >= 2 ⇒ > 2 bị bắt; mock.fn của Node; Zune 31/12/2008.',
      L112_EN + L112_VI),
    L(3, 'sb-11-3-mockmvc', 'Testing controllers with @WebMvcTest', 'Test controller bằng @WebMvcTest',
      '@WebMvcTest ngây thơ: context không lên vì controller dùng EntityManager ⇒ chuyển truy vấn vào repository; không nạp BaoMat ⇒ sinh viên duyệt được (200), không token ⇒ 403 CSRF, jwt() gọi CsrfFilter.skipRequest; bản đúng: @Import(BaoMat), @MockitoBean(name="quyen"), MockMvc và MockMvcTester, ProblemDetail 409, ArgumentCaptor chống đặt hộ; JSON lỏng xanh, chặt đỏ; supertest; Grindr 2020.',
      L113_EN + L113_VI),
    L(4, 'sb-11-4-testcontainers', 'Integration tests with Testcontainers', 'Test tích hợp với Testcontainers',
      'PostgreSQL 16.15 thật bằng @ServiceConnection (Testcontainers 2.0.5, Ryuk); @DataJpaTest rollback mỗi test, sáu biên của "trùng", SQL Hibernate sinh ra; @SpringBootTest 10 luồng cùng đặt ⇒ {201=1, 409=9}; đột biến >= trong JPQL: 8 test Mockito xanh, 1 test CSDL đỏ; container @Bean 4 cái / 65 giây vs static dùng chung 1 cái / 35 giây; vì sao không H2; Testcontainers cho Node; TSB 2018.',
      L114_EN + L114_VI),
    L(5, 'sb-11-5-test-security', 'Testing secured endpoints', 'Test endpoint có bảo mật',
      'Ba mức: @WithMockUser, jwt(), token thật qua RANDOM_PORT; IDOR với Quyen thật và kiểm CSDL không đổi; @TestFactory quét mọi tuyến GET có {id}; Spring Security 7 thêm resource_metadata (RFC 9728) vào WWW-Authenticate; đăng ký → đăng nhập → 201, token hết hạn và token sửa role ⇒ 401 kèm lý do; mật khẩu test sinh lúc chạy; bảng 401/403; First American Financial 2019.',
      L115_EN + L115_VI),
    L(6, 'sb-11-6-lab-11', 'Chapter 11 lab + interview questions', 'Lab chương 11 + câu hỏi phỏng vấn',
      'Viết bộ test cho LabFlow, chấm bằng 8 đột biến cài vào mã (biên nối đuôi, lượt huỷ, giới hạn ngày, "bây giờ", đặt hộ, tự duyệt, IDOR, phiên bản cũ) + độ phủ ≥ 80%: khởi đầu 1/10, lời giải 10/10 ×3 dưới 3 phút; bẫy chỉ mock 6/10, độ phủ 100% không assertion 2/10, quên test bảo mật 9/10; PIT và Stryker; CrowdStrike 2024; câu phỏng vấn cả chương.',
      L116_EN + L116_VI),
    {
      title: '11.7 — Chapter 11 quiz|||11.7 — Kiểm tra chương 11',
      slug: 'sb-11-7-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về số đo thật của chương: báo cáo Surefire với @Nested, vòng đời test, thông báo lỗi AssertJ, @InjectMocks truyền null, đột biến JPQL mà mock bỏ sót, lát cắt thiếu cấu hình bảo mật, jwt() và CSRF, container dùng chung 65 ⇒ 35 giây, resource_metadata của Security 7, độ phủ 100% không assertion.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something you saw run in this chapter — 15 tests in 11 ms, a null clock from @InjectMocks, a one-character query bug that eight mock tests missed, a student approving bookings in a slice without security, four containers turned into one, and a suite with 100% coverage that caught nothing. Pass mark 7/10.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là điều bạn đã thấy chạy trong chương — 15 test trong 11 ms, một đồng hồ null do @InjectMocks, một lỗi truy vấn một ký tự mà tám test mock bỏ sót, một sinh viên tự duyệt lượt trong lát cắt thiếu bảo mật, bốn container thành một, và một bộ test độ phủ 100% mà không bắt được gì. Đạt từ 7/10.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ11 },
    },
  ],
};
