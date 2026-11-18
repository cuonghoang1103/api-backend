/**
 * spring-boot/s02-java-hien-dai-2.mjs — Chương 2 ⭐ Java hiện đại (2): Stream, đồng thời và JVM (soạn 18/11/2026, agent sb).
 * Mọi output là chạy thật: Temurin 21.0.12.1 (JDK, container 4 CPU), ứng dụng Spring Boot 4.1.2 trên Temurin 21.0.13 JRE.
 * Mã nguồn demo: ~/.rtq-sb/c2/w ; ứng dụng đo luồng: scratchpad/sb/lab/c2/luong ; NullAway: lab/c2/nullaway ; lab: lab/c2/labstats.
 * Các hằng MA.. và OUT.. sinh bằng scratchpad/sb/tam/s02/build.sh + gen-ma.mjs (chuỗi JSON, không cần escape template).
 */
import { java, yml, out, tl, giai } from './_chung.mjs';

// ===== Bài 2.1 =====
const MA21_DATA = java("record Booking(long id, String lab, String student, String status, int hours, LocalDate date) {}\n\nclass Data {\n    static final List<Booking> BOOKINGS = List.of(\n        new Booking(1, \"Lab AI\",   \"an\",   \"APPROVED\", 2, LocalDate.of(2026, 11, 20)),\n        new Booking(2, \"Lab IoT\",  \"binh\", \"PENDING\",  3, LocalDate.of(2026, 11, 20)),\n        new Booking(3, \"Lab AI\",   \"chi\",  \"APPROVED\", 1, LocalDate.of(2026, 11, 21)),\n        new Booking(4, \"Lab Mạng\", \"an\",   \"REJECTED\", 2, LocalDate.of(2026, 11, 21)),\n        new Booking(5, \"Lab IoT\",  \"dung\", \"APPROVED\", 4, LocalDate.of(2026, 11, 22)),\n        new Booking(6, \"Lab AI\",   \"binh\", \"CANCELLED\",2, LocalDate.of(2026, 11, 22)),\n        new Booking(7, \"Lab Mạng\", \"chi\",  \"APPROVED\", 3, LocalDate.of(2026, 11, 23)));\n}");
const MA21_STREAMS = java("import java.util.*;\nimport java.util.stream.*;\n\npublic class Streams {\n    public static void main(String[] args) {\n        List<Booking> all = Data.BOOKINGS;\n\n        // 1. filter → map → toList\n        List<String> approvedStudents = all.stream()\n            .filter(b -> b.status().equals(\"APPROVED\"))\n            .map(Booking::student)\n            .distinct()\n            .sorted()\n            .toList();\n        System.out.println(\"approved students = \" + approvedStudents);\n\n        // 2. reduce và các phép gộp có sẵn\n        int totalHours = all.stream().mapToInt(Booking::hours).sum();\n        int viaReduce  = all.stream().map(Booking::hours).reduce(0, Integer::sum);\n        System.out.println(\"total hours = \" + totalHours + \" (reduce: \" + viaReduce + \")\");\n        IntSummaryStatistics st = all.stream().mapToInt(Booking::hours).summaryStatistics();\n        System.out.println(\"stats = \" + st);\n\n        // 3. groupingBy: đếm lượt theo lab (TreeMap để in có thứ tự)\n        Map<String, Long> perLab = all.stream()\n            .collect(Collectors.groupingBy(Booking::lab, TreeMap::new, Collectors.counting()));\n        System.out.println(\"bookings per lab = \" + perLab);\n\n        // 4. groupingBy + downstream: tổng giờ đã duyệt theo lab\n        Map<String, Integer> approvedHours = all.stream()\n            .filter(b -> b.status().equals(\"APPROVED\"))\n            .collect(Collectors.groupingBy(Booking::lab, TreeMap::new, Collectors.summingInt(Booking::hours)));\n        System.out.println(\"approved hours per lab = \" + approvedHours);\n\n        // 5. partitioningBy: hai nhóm đúng/sai\n        Map<Boolean, List<Long>> split = all.stream()\n            .collect(Collectors.partitioningBy(b -> b.hours() >= 3,\n                     Collectors.mapping(Booking::id, Collectors.toList())));\n        System.out.println(\"long (>=3h) vs short = \" + split);\n\n        // 6. toMap: id → booking\n        Map<Long, String> byId = all.stream()\n            .collect(Collectors.toMap(Booking::id, Booking::student));\n        System.out.println(\"byId.get(5) = \" + byId.get(5L));\n\n        // 7. toMap với khoá trùng: thiếu hàm gộp ⇒ nổ\n        try {\n            Map<String, Integer> hoursByStudent = all.stream()\n                .collect(Collectors.toMap(Booking::student, Booking::hours));\n            System.out.println(hoursByStudent);\n        } catch (IllegalStateException e) {\n            System.out.println(\"toMap without merge -> \" + e);\n        }\n        Map<String, Integer> hoursByStudent = all.stream()\n            .collect(Collectors.toMap(Booking::student, Booking::hours, Integer::sum, TreeMap::new));\n        System.out.println(\"toMap with Integer::sum = \" + hoursByStudent);\n\n        // 8. joining\n        String labs = all.stream().map(Booking::lab).distinct().collect(Collectors.joining(\", \", \"[\", \"]\"));\n        System.out.println(\"labs = \" + labs);\n    }\n}\n\n/** Dữ liệu mẫu dùng chung cho các demo Chương 2. */");
const OUT21_STREAMS = out("$ java Streams.java\napproved students = [an, chi, dung]\ntotal hours = 17 (reduce: 17)\nstats = IntSummaryStatistics{count=7, sum=17, min=1, average=2.428571, max=4}\nbookings per lab = {Lab AI=3, Lab IoT=2, Lab Mạng=2}\napproved hours per lab = {Lab AI=3, Lab IoT=4, Lab Mạng=3}\nlong (>=3h) vs short = {false=[1, 3, 4, 6], true=[2, 5, 7]}\nbyId.get(5) = dung\ntoMap without merge -> java.lang.IllegalStateException: Duplicate key an (attempted merging values 2 and 2)\ntoMap with Integer::sum = {an=4, binh=5, chi=4, dung=4}\nlabs = [Lab AI, Lab IoT, Lab Mạng]");
const MA21_LAZY = java("import java.util.*;\nimport java.util.stream.*;\n\npublic class Lazy {\n    public static void main(String[] args) {\n        List<String> labs = List.of(\"Lab AI\", \"Lab IoT\", \"Lab Mạng\", \"Lab Robot\");\n\n        System.out.println(\"-- 1. no terminal operation:\");\n        Stream<String> s = labs.stream().filter(l -> { System.out.println(\"  filter \" + l); return true; });\n        System.out.println(\"  (stream built, nothing printed above)\");\n\n        System.out.println(\"-- 2. findFirst: one element at a time, stops early:\");\n        Optional<String> first = labs.stream()\n            .filter(l -> { System.out.println(\"  filter \" + l); return l.contains(\"o\"); })\n            .map(l -> { System.out.println(\"  map    \" + l); return l.toUpperCase(); })\n            .findFirst();\n        System.out.println(\"  result = \" + first.get());\n\n        System.out.println(\"-- 3. sorted is a barrier: it must see everything first:\");\n        labs.stream()\n            .peek(l -> System.out.println(\"  before sorted \" + l))\n            .sorted()\n            .peek(l -> System.out.println(\"  after  sorted \" + l))\n            .limit(1)\n            .forEach(l -> {});\n\n        System.out.println(\"-- 4. a stream can be consumed once:\");\n        Stream<String> once = labs.stream();\n        System.out.println(\"  count = \" + once.count());\n        try { once.count(); } catch (IllegalStateException e) { System.out.println(\"  \" + e); }\n\n        System.out.println(\"-- 5. toList() vs Collectors.toList():\");\n        List<String> a = labs.stream().toList();\n        List<String> b = labs.stream().collect(Collectors.toList());\n        b.add(\"Lab mới\");\n        System.out.println(\"  Collectors.toList() \" + b.getClass().getSimpleName() + \" accepted add: \" + b.size());\n        try { a.add(\"Lab mới\"); } catch (UnsupportedOperationException e) { System.out.println(\"  Stream.toList() add -> \" + e); }\n    }\n}");
const OUT21_LAZY = out("$ java Lazy.java\n-- 1. no terminal operation:\n  (stream built, nothing printed above)\n-- 2. findFirst: one element at a time, stops early:\n  filter Lab AI\n  filter Lab IoT\n  map    Lab IoT\n  result = LAB IOT\n-- 3. sorted is a barrier: it must see everything first:\n  before sorted Lab AI\n  before sorted Lab IoT\n  before sorted Lab Mạng\n  before sorted Lab Robot\n  after  sorted Lab AI\n-- 4. a stream can be consumed once:\n  count = 4\n  java.lang.IllegalStateException: stream has already been operated upon or closed\n-- 5. toList() vs Collectors.toList():\n  Collectors.toList() ArrayList accepted add: 5\n  Stream.toList() add -> java.lang.UnsupportedOperationException");
const MA21_EAGER = java("const labs = ['Lab AI', 'Lab IoT', 'Lab Mạng', 'Lab Robot'];\nconst first = labs\n  .filter(l => { console.log('  filter', l); return l.includes('o'); })\n  .map(l => { console.log('  map   ', l); return l.toUpperCase(); })[0];\nconsole.log('  result =', first);");
const MA21_PAR = java("import java.util.*;\nimport java.util.stream.*;\n\npublic class Parallel {\n    public static void main(String[] args) {\n        // 1. Gom kết quả bằng tác dụng phụ vào ArrayList dùng chung — SAI\n        for (int run = 1; run <= 3; run++) {\n            List<Integer> shared = new ArrayList<>();\n            try {\n                IntStream.range(0, 100_000).parallel().forEach(shared::add);\n                System.out.println(\"run \" + run + \": forEach(shared::add) size = \" + shared.size() + \" (expected 100000)\");\n            } catch (RuntimeException e) {\n                System.out.println(\"run \" + run + \": forEach(shared::add) -> \" + e);\n            }\n        }\n        // 2. Đúng: để collector tự gom\n        List<Integer> ok = IntStream.range(0, 100_000).parallel().boxed().toList();\n        System.out.println(\"toList() size = \" + ok.size());\n\n        // 3. parallel dùng chung ForkJoinPool.commonPool\n        System.out.println(\"cores = \" + Runtime.getRuntime().availableProcessors()\n            + \", commonPool parallelism = \" + java.util.concurrent.ForkJoinPool.commonPool().getParallelism());\n        Set<String> threads = Collections.synchronizedSet(new TreeSet<>());\n        IntStream.range(0, 1_000).parallel().forEach(i -> threads.add(Thread.currentThread().getName().replaceAll(\"\\\\d+$\", \"N\")));\n        System.out.println(\"threads used = \" + threads);\n    }\n}");
const OUT21_PAR = out("$ java Parallel.java        # container limited to 4 CPUs\nrun 1: forEach(shared::add) size = 48310 (expected 100000)\nrun 2: forEach(shared::add) size = 74265 (expected 100000)\nrun 3: forEach(shared::add) size = 22578 (expected 100000)\ntoList() size = 100000\ncores = 4, commonPool parallelism = 3\nthreads used = [ForkJoinPool.commonPool-worker-N, main]");
const MA21_PERF = java("import java.util.stream.*;\n\npublic class Perf {\n    static long forLoop(int[] a) { long s = 0; for (int x : a) if (x % 3 == 0) s += (long) x * x; return s; }\n    static long stream(int[] a)  { return IntStream.of(a).filter(x -> x % 3 == 0).mapToLong(x -> (long) x * x).sum(); }\n    static long par(int[] a)     { return IntStream.of(a).parallel().filter(x -> x % 3 == 0).mapToLong(x -> (long) x * x).sum(); }\n\n    interface F { long run(int[] a); }\n    static void time(String name, F f, int[] a) {\n        for (int i = 0; i < 20; i++) f.run(a);             // khởi động JIT\n        long best = Long.MAX_VALUE, r = 0;\n        for (int i = 0; i < 10; i++) { long t = System.nanoTime(); r = f.run(a); best = Math.min(best, System.nanoTime() - t); }\n        System.out.printf(\"%-8s n=%,11d  best %7.2f ms  (sum=%d)%n\", name, a.length, best / 1e6, r);\n    }\n    public static void main(String[] args) {\n        for (int n : new int[]{1_000, 10_000_000}) {\n            int[] a = IntStream.range(0, n).toArray();\n            time(\"for\", Perf::forLoop, a);\n            time(\"stream\", Perf::stream, a);\n            time(\"parallel\", Perf::par, a);\n        }\n    }\n}");
const MA21_STARVE = java("import java.util.*;\nimport java.util.stream.*;\n\npublic class Starve {\n    static void callSlowApi(int i) {                       // giả lập gọi HTTP 200 ms\n        try { Thread.sleep(200); } catch (InterruptedException e) { throw new RuntimeException(e); }\n    }\n    public static void main(String[] args) throws Exception {\n        long t0 = System.nanoTime();\n        Thread report = new Thread(() -> {                  // một yêu cầu khác cũng dùng parallel stream\n            try { Thread.sleep(20); } catch (InterruptedException e) {}\n            long t = System.nanoTime();\n            long s = IntStream.range(0, 1_000).parallel().map(x -> x * 2).sum();\n            System.out.printf(\"tiny parallel sum=%d took %d ms%n\", s, (System.nanoTime() - t) / 1_000_000);\n        });\n        report.start();\n        IntStream.range(0, 16).parallel().forEach(Starve::callSlowApi);   // 16 lời gọi chậm\n        System.out.printf(\"16 slow calls via parallel stream: %d ms%n\", (System.nanoTime() - t0) / 1_000_000);\n        report.join();\n    }\n}");
const OUT21_STARVE = out("$ java Starve.java\ntiny parallel sum=999000 took 1 ms\n16 slow calls via parallel stream: 804 ms");
const OUT21_PERF = out("$ java Perf.java        # run 1\nfor      n=      1,000  best    0.02 ms  (sum=111277611)\nstream   n=      1,000  best    0.03 ms  (sum=111277611)\nparallel n=      1,000  best    0.04 ms  (sum=111277611)\nfor      n= 10,000,000  best    6.74 ms  (sum=430663335518801415)\nstream   n= 10,000,000  best    8.85 ms  (sum=430663335518801415)\nparallel n= 10,000,000  best    3.70 ms  (sum=430663335518801415)\n$ java Perf.java        # run 2\nfor      n=      1,000  best    0.01 ms  (sum=111277611)\nstream   n=      1,000  best    0.04 ms  (sum=111277611)\nparallel n=      1,000  best    0.05 ms  (sum=111277611)\nfor      n= 10,000,000  best    8.86 ms  (sum=430663335518801415)\nstream   n= 10,000,000  best   11.89 ms  (sum=430663335518801415)\nparallel n= 10,000,000  best    7.09 ms  (sum=430663335518801415)");
const OUT21_EAGER = out("$ node eager.mjs        # Node.js 22.22.2\n  filter Lab AI\n  filter Lab IoT\n  filter Lab Mạng\n  filter Lab Robot\n  map    Lab IoT\n  map    Lab Robot\n  result = LAB IOT");

const L21_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The Stream API</h2>
<p class="lead">A backend spends most of its day turning one list into another: rows into DTOs, bookings into a report, a request's items into a total. The Stream API (Java 8) is the vocabulary for that — <code>filter</code>, <code>map</code>, <code>reduce</code>, <code>collect</code> — and every Spring codebase you join will be full of it. This lesson runs every operation you will meet at work, shows the three surprises that bite beginners (laziness, single use, unmodifiable results), measures stream vs <code>for</code> vs <code>parallel</code>, and explains when a plain loop is the better choice.</p>

<h3>The sample data used in the whole chapter</h3>
<p>Seven LabFlow bookings as records (lesson 1.1). Each demo file in this chapter is self-contained: the same <code>Booking</code> record and list sit at the bottom of the file, so <code>java File.java</code> runs it with no build tool.</p>
${MA21_DATA}

<h3>A pipeline: source → intermediate operations → one terminal operation</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Source</span><span class="v"><code>list.stream()</code>, <code>Stream.of(…)</code>, <code>IntStream.range(0, n)</code>, <code>Files.lines(path)</code>, <code>map.entrySet().stream()</code>.</span></div>
  <div class="kv"><span class="k">Intermediate (lazy, return a Stream)</span><span class="v"><code>filter</code>, <code>map</code>, <code>flatMap</code>, <code>distinct</code>, <code>sorted</code>, <code>peek</code>, <code>limit</code>, <code>skip</code>, <code>mapToInt</code>.</span></div>
  <div class="kv"><span class="k">Terminal (runs the pipeline)</span><span class="v"><code>toList</code>, <code>collect</code>, <code>forEach</code>, <code>reduce</code>, <code>sum</code>, <code>count</code>, <code>findFirst</code>, <code>anyMatch</code>, <code>min</code>/<code>max</code>.</span></div>
</div>
<p>A stream is <em>not</em> a collection. It stores nothing; it describes a computation over a source, and the computation happens only when a terminal operation asks for a result.</p>

<h3>The operations you will use every week</h3>
${MA21_STREAMS}
${OUT21_STREAMS}
<ul>
  <li><strong>filter → map → toList</strong> is the bread and butter: "the students who have an approved booking". <code>Booking::student</code> is a method reference (lesson 1.3).</li>
  <li><strong>mapToInt(…).sum()</strong> beats <code>map(…).reduce(0, Integer::sum)</code>: same 17, but no boxing of every number into an <code>Integer</code>. <code>summaryStatistics()</code> gives count/min/max/average in one pass.</li>
  <li><strong>groupingBy</strong> is SQL's <code>GROUP BY</code>. The second argument chooses the map type (a <code>TreeMap</code> for sorted keys), the third is a <em>downstream collector</em> applied to each group: <code>counting()</code>, <code>summingInt(…)</code>, <code>mapping(…)</code>, <code>toList()</code>.</li>
  <li><strong>partitioningBy</strong> is a <code>groupingBy</code> with exactly two keys, <code>false</code> and <code>true</code>.</li>
  <li><strong>toMap</strong> throws <code>IllegalStateException: Duplicate key</code> the moment two elements produce the same key — "an" has two bookings. Real data always has duplicates you did not expect, so pass a merge function (<code>Integer::sum</code>, or <code>(a, b) -&gt; a</code> to keep the first).</li>
</ul>
<div class="callout"><strong>Compared with SQL.</strong> <code>filter</code> = <code>WHERE</code>, <code>map</code> = the <code>SELECT</code> list, <code>groupingBy(…, counting())</code> = <code>GROUP BY … COUNT(*)</code>, <code>sorted</code> = <code>ORDER BY</code>, <code>limit</code> = <code>LIMIT</code>. Rule of thumb from Chapter 6 on: if the data lives in PostgreSQL, let the database do the grouping and send back 3 rows, instead of loading 300 000 rows into Java to group them with a stream.</div>

<h3>Surprise 1 — streams are lazy, and they work one element at a time</h3>
${MA21_LAZY}
${OUT21_LAZY}
<p>Read the output section by section:</p>
<ol>
  <li>Building a pipeline without a terminal operation prints nothing — the <code>filter</code> lambda never ran. A stream you build and forget does no work (and no side effects).</li>
  <li>With <code>findFirst</code>, each element travels the whole pipeline before the next one starts ("vertical" processing): Lab AI fails the filter, Lab IoT passes the filter <em>and</em> the map, and the stream stops — Lab Mạng and Lab Robot are never touched. That is called <strong>short-circuiting</strong> (<code>findFirst</code>, <code>anyMatch</code>, <code>limit</code>).</li>
  <li><code>sorted</code> is a <strong>stateful</strong> operation: it cannot emit its first element until it has seen them all, so even with <code>limit(1)</code> every element passes "before sorted".</li>
  <li>A stream can be consumed <strong>once</strong>. Keep the <code>List</code>, not the <code>Stream</code>, in a variable, and call <code>.stream()</code> again when you need it.</li>
  <li><code>Stream.toList()</code> (Java 16) returns an <strong>unmodifiable</strong> list; <code>Collectors.toList()</code> today returns an <code>ArrayList</code> but the Javadoc promises nothing about mutability. If you need to add to the result, say so: <code>Collectors.toCollection(ArrayList::new)</code>.</li>
</ol>
<p>JavaScript arrays look identical but behave differently: <code>filter</code> walks the whole array and builds a new array, then <code>map</code> walks that one. Same input, real run:</p>
${MA21_EAGER}
${OUT21_EAGER}
<p>Node evaluated <code>filter</code> four times and <code>map</code> twice to get one element; the Java stream did two and one. On ten items that does not matter; on a million rows read from a file it is the difference between one pass and several intermediate arrays.</p>

<h3>Surprise 2 — parallel streams and shared state</h3>
<p><code>.parallel()</code> splits the source into chunks and runs them on the <strong>ForkJoinPool common pool</strong>. It is tempting, and it is where beginners create their first race condition:</p>
${MA21_PAR}
${OUT21_PAR}
<p>Three runs, three different wrong sizes — <code>ArrayList</code> is not thread-safe, so concurrent <code>add</code> calls overwrite each other (on some runs it even throws <code>ArrayIndexOutOfBoundsException</code>). The fix is not "use a synchronized list"; it is to stop mutating shared state and let the terminal operation assemble the result (<code>toList()</code>, <code>collect</code>), which is designed for parallel use. Lesson 2.4 explains why <code>add</code> loses data.</p>
<p>Note also <code>commonPool parallelism = 3</code> on a 4-CPU container: the common pool has <em>cores − 1</em> workers, plus the calling thread. Every parallel stream in the whole JVM shares those threads — including the ones inside every request your Spring app is serving.</p>

<h3>Measured: for vs stream vs parallel</h3>
${MA21_PERF}
${OUT21_PERF}
<ul>
  <li>On 1 000 elements everything finishes in hundredths of a millisecond; <code>parallel</code> is <em>not</em> faster — splitting and joining cost more than the work.</li>
  <li>On 10 million elements the sequential stream is a little slower than the hand-written loop (≈ 9–12 ms vs 7–9 ms), and <code>parallel</code> wins on 4 CPUs (≈ 4–7 ms). The numbers move between runs; a serious comparison uses JMH (lesson 1.5).</li>
  <li>In a web request, the list is usually tens of DTOs. Choose by readability, not by microseconds.</li>
</ul>

<h3>On the job — never put blocking calls in a parallel stream</h3>
<p>A classic pull request: "the report calls a slow external API once per lab; let's add <code>.parallel()</code> to make it faster".</p>
${MA21_STARVE}
${OUT21_STARVE}
<p>Sixteen 200 ms calls took ≈ 800 ms: four threads at a time (3 common-pool workers + the caller), four rounds. On a 2-CPU production container it would be 1 worker + caller — 1.6 s. And while those threads sleep, every other parallel stream in the application waits for them. The right tools for concurrent I/O are an executor or <code>CompletableFuture</code> (lesson 2.3) and virtual threads (lesson 2.5, where the same 16 calls take ≈ 200 ms).</p>

<h3>When a for loop is better</h3>
<ul>
  <li>You need to <strong>break</strong> out on a complex condition, or <strong>throw a checked exception</strong> from the body (lambdas cannot throw checked exceptions — lesson 1.4).</li>
  <li>You are updating several variables at once (a running total <em>and</em> a counter <em>and</em> a max).</li>
  <li>The pipeline has grown past ~5 steps with nested lambdas, and nobody can read it in a code review.</li>
</ul>
<p>Streams are for transforming data; loops are for algorithms with control flow. Both are "modern Java".</p>

<h3>Everyday picture</h3>
<p>A stream is a coffee-shop assembly line: the cashier takes an order (source), the barista filters out cancelled orders, the next station adds milk (map), and the last person hands cups to customers (terminal). Nobody starts brewing until a customer is waiting — that is laziness. If the first customer only wants "the first latte", the line stops after one latte — short-circuiting. And four baristas sharing one milk jug without taking turns is the parallel <code>ArrayList</code>: spilled milk and missing cups.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is the difference between an intermediate and a terminal operation?"</strong> — Intermediate operations are lazy and return a new stream; nothing runs until a terminal operation (collect, toList, forEach, reduce, count, findFirst…) is called. A stream can only be consumed once.</li>
  <li><strong>"<code>map</code> vs <code>flatMap</code>?"</strong> — <code>map</code> turns each element into one element; <code>flatMap</code> turns each element into a stream and flattens them (e.g., labs → their bookings → one stream of all bookings).</li>
  <li><strong>"What happens with <code>Collectors.toMap</code> when keys collide?"</strong> — <code>IllegalStateException: Duplicate key</code>, unless you pass a merge function.</li>
  <li><strong>"When would you use a parallel stream on a server?"</strong> — Rarely: only for large CPU-bound work with no shared mutable state, measured first. Never for blocking I/O, because all parallel streams share the common pool (cores − 1 threads).</li>
  <li><strong>"Is a stream faster than a for loop?"</strong> — Usually slightly slower for simple loops on primitives, and the difference is irrelevant for typical request sizes. Choose by readability.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Using the sample data, compute the number of <em>approved</em> hours per student, sorted by student name.</li>
  <li>Find the lab with the most bookings (any status). Hint: <code>groupingBy</code> then stream the map's <code>entrySet()</code> and take <code>max(Map.Entry.comparingByValue())</code>.</li>
  <li>Build a <code>Map&lt;LocalDate, List&lt;Long&gt;&gt;</code> from date to booking ids, with dates in order.</li>
  <li>Rewrite exercise 1 as a plain <code>for</code> loop and decide which version you would rather review.</li>
</ol>
<p><strong>Done when:</strong> exercise 1 prints <code>{an=2, chi=4, dung=4}</code>, exercise 2 prints <code>Lab AI=3</code>, and exercise 3 has four dates from 2026-11-20 to 2026-11-23.</p></div>
${giai('Show one solution', `${java(`
Map<String, Integer> approvedByStudent = all.stream()
    .filter(b -> b.status().equals("APPROVED"))
    .collect(Collectors.groupingBy(Booking::student, TreeMap::new, Collectors.summingInt(Booking::hours)));

Map.Entry<String, Long> busiest = all.stream()
    .collect(Collectors.groupingBy(Booking::lab, Collectors.counting()))
    .entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .orElseThrow();

Map<LocalDate, List<Long>> idsByDate = all.stream()
    .collect(Collectors.groupingBy(Booking::date, TreeMap::new,
             Collectors.mapping(Booking::id, Collectors.toList())));`)}
<p><code>orElseThrow()</code> appears because <code>max</code> returns an <code>Optional</code> — the stream might have been empty. That is the subject of the next lesson.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stream</span><span class="v">A lazy, single-use sequence of elements with operations, built from a source; it stores nothing.</span></div>
  <div class="kv"><span class="k">Intermediate operation</span><span class="v">Returns a new stream and runs only when a terminal operation pulls data (filter, map, sorted…).</span></div>
  <div class="kv"><span class="k">Terminal operation</span><span class="v">Produces a result or side effect and consumes the stream (collect, toList, reduce, forEach…).</span></div>
  <div class="kv"><span class="k">Collector</span><span class="v">A recipe for accumulating elements into a result: toList, groupingBy, toMap, joining, counting…</span></div>
  <div class="kv"><span class="k">Downstream collector</span><span class="v">The collector applied to each group inside groupingBy/partitioningBy.</span></div>
  <div class="kv"><span class="k">Short-circuiting</span><span class="v">An operation that can finish without seeing every element (findFirst, anyMatch, limit).</span></div>
  <div class="kv"><span class="k">Stateful operation</span><span class="v">Needs to see other elements before emitting (sorted, distinct).</span></div>
  <div class="kv"><span class="k">ForkJoinPool common pool</span><span class="v">The JVM-wide pool (cores − 1 workers) used by parallel streams and, by default, CompletableFuture.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>source → lazy intermediate operations → one terminal operation; a stream runs once.</li>
  <li><code>groupingBy</code> + downstream collectors is GROUP BY in Java; <code>toMap</code> needs a merge function for real data.</li>
  <li><code>Stream.toList()</code> is unmodifiable.</li>
  <li>Parallel streams: no shared mutable state, no blocking I/O, measure before using.</li>
  <li>If the data is in the database, aggregate in SQL; streams are for what is already in memory.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html', '📄', 'java.util.stream package summary', 'The official explanation of laziness, statelessness, non-interference and reduction.')}
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html', '📄', 'Collectors (Java 21)', 'Every built-in collector, with the exact guarantees of toList and toMap.')}

<h3>Sources</h3>
<ul>
  <li>Java SE 21 API, <code>Stream.toList()</code> ("returns an unmodifiable List") and <code>Collectors.toMap</code> ("IllegalStateException if duplicate keys"): <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html" target="_blank" rel="noopener">docs.oracle.com — Stream</a></li>
  <li><code>ForkJoinPool.commonPool()</code> parallelism defaults to the number of processors minus one: <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ForkJoinPool.html" target="_blank" rel="noopener">docs.oracle.com — ForkJoinPool</a></li>
  <li>All outputs above: run on 18/11/2026 with Temurin 21.0.12.1 in a container limited to 4 CPUs; Node.js 22.22.2.</li>
</ul>
</div>
`;

const L21_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Stream API</h2>
<p class="lead">Phần lớn thời gian một backend làm đúng một việc: biến danh sách này thành danh sách khác — hàng trong bảng thành DTO, lượt đặt thành báo cáo, các món trong yêu cầu thành tổng tiền. Stream API (Java 8) là bộ từ vựng cho việc đó — <code>filter</code>, <code>map</code>, <code>reduce</code>, <code>collect</code> — và dự án Spring nào bạn vào cũng đầy nó. Bài này chạy thật mọi thao tác bạn sẽ gặp khi đi làm, chỉ ra ba điều bất ngờ hay làm người mới vấp (lười, chỉ dùng một lần, kết quả không sửa được), đo stream vs <code>for</code> vs <code>parallel</code>, và nói khi nào vòng lặp thường lại là lựa chọn tốt hơn.</p>

<h3>Dữ liệu mẫu dùng suốt chương</h3>
<p>Bảy lượt đặt LabFlow dạng record (bài 1.1). Mỗi tệp demo trong chương tự chứa đủ: record <code>Booking</code> và danh sách nằm ở cuối tệp, nên chỉ cần <code>java TenTep.java</code> là chạy, không cần công cụ build.</p>
${MA21_DATA}

<h3>Một pipeline: nguồn → các thao tác trung gian → đúng một thao tác kết thúc</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nguồn</span><span class="v"><code>list.stream()</code>, <code>Stream.of(…)</code>, <code>IntStream.range(0, n)</code>, <code>Files.lines(path)</code>, <code>map.entrySet().stream()</code>.</span></div>
  <div class="kv"><span class="k">Trung gian (lười, trả về Stream)</span><span class="v"><code>filter</code>, <code>map</code>, <code>flatMap</code>, <code>distinct</code>, <code>sorted</code>, <code>peek</code>, <code>limit</code>, <code>skip</code>, <code>mapToInt</code>.</span></div>
  <div class="kv"><span class="k">Kết thúc (làm pipeline chạy)</span><span class="v"><code>toList</code>, <code>collect</code>, <code>forEach</code>, <code>reduce</code>, <code>sum</code>, <code>count</code>, <code>findFirst</code>, <code>anyMatch</code>, <code>min</code>/<code>max</code>.</span></div>
</div>
<p>Stream <em>không phải</em> collection. Nó không chứa gì; nó mô tả một phép tính trên nguồn, và phép tính chỉ xảy ra khi có thao tác kết thúc đòi kết quả.</p>

<h3>Những thao tác tuần nào cũng dùng</h3>
${MA21_STREAMS}
${OUT21_STREAMS}
<ul>
  <li><strong>filter → map → toList</strong> là cơm bữa: "những sinh viên có lượt đặt đã duyệt". <code>Booking::student</code> là method reference (bài 1.3).</li>
  <li><strong>mapToInt(…).sum()</strong> hơn <code>map(…).reduce(0, Integer::sum)</code>: cùng ra 17 nhưng không phải đóng hộp từng số thành <code>Integer</code>. <code>summaryStatistics()</code> cho đếm/min/max/trung bình trong một lượt.</li>
  <li><strong>groupingBy</strong> chính là <code>GROUP BY</code> của SQL. Đối số thứ hai chọn kiểu Map (<code>TreeMap</code> để khoá có thứ tự), đối số thứ ba là <em>collector hạ nguồn</em> áp lên từng nhóm: <code>counting()</code>, <code>summingInt(…)</code>, <code>mapping(…)</code>, <code>toList()</code>.</li>
  <li><strong>partitioningBy</strong> là <code>groupingBy</code> có đúng hai khoá <code>false</code> và <code>true</code>.</li>
  <li><strong>toMap</strong> ném <code>IllegalStateException: Duplicate key</code> ngay khi hai phần tử ra cùng khoá — "an" có hai lượt đặt. Dữ liệu thật luôn có trùng mà bạn không ngờ, nên hãy truyền hàm gộp (<code>Integer::sum</code>, hoặc <code>(a, b) -&gt; a</code> để giữ cái đầu).</li>
</ul>
<div class="callout"><strong>So với SQL.</strong> <code>filter</code> = <code>WHERE</code>, <code>map</code> = danh sách cột sau <code>SELECT</code>, <code>groupingBy(…, counting())</code> = <code>GROUP BY … COUNT(*)</code>, <code>sorted</code> = <code>ORDER BY</code>, <code>limit</code> = <code>LIMIT</code>. Quy tắc từ Chương 6 trở đi: dữ liệu nằm trong PostgreSQL thì để cơ sở dữ liệu gom nhóm và trả về 3 hàng, đừng nạp 300 000 hàng vào Java rồi gom bằng stream.</div>

<h3>Bất ngờ 1 — stream lười, và xử lý từng phần tử một</h3>
${MA21_LAZY}
${OUT21_LAZY}
<p>Đọc output theo từng đoạn:</p>
<ol>
  <li>Dựng pipeline mà không có thao tác kết thúc thì không in gì — lambda của <code>filter</code> chưa từng chạy. Stream dựng xong bỏ đó không làm việc gì (và không gây tác dụng phụ nào).</li>
  <li>Với <code>findFirst</code>, mỗi phần tử đi hết pipeline rồi phần tử sau mới bắt đầu (xử lý "theo chiều dọc"): Lab AI trượt filter, Lab IoT qua filter <em>và</em> map, rồi stream dừng — Lab Mạng và Lab Robot không bị đụng tới. Đó gọi là <strong>ngắt sớm</strong> (short-circuiting: <code>findFirst</code>, <code>anyMatch</code>, <code>limit</code>).</li>
  <li><code>sorted</code> là thao tác <strong>có trạng thái</strong>: chưa thấy hết thì chưa thể nhả phần tử đầu, nên dù có <code>limit(1)</code> mọi phần tử vẫn qua "before sorted".</li>
  <li>Stream chỉ dùng được <strong>một lần</strong>. Giữ <code>List</code> trong biến, đừng giữ <code>Stream</code>, cần thì gọi lại <code>.stream()</code>.</li>
  <li><code>Stream.toList()</code> (Java 16) trả list <strong>không sửa được</strong>; <code>Collectors.toList()</code> hôm nay trả <code>ArrayList</code> nhưng Javadoc không hứa gì về việc sửa được. Cần thêm phần tử vào kết quả thì nói rõ: <code>Collectors.toCollection(ArrayList::new)</code>.</li>
</ol>
<p>Mảng JavaScript nhìn giống hệt nhưng chạy khác: <code>filter</code> đi hết mảng và tạo mảng mới, rồi <code>map</code> mới đi mảng đó. Cùng đầu vào, chạy thật:</p>
${MA21_EAGER}
${OUT21_EAGER}
<p>Node gọi <code>filter</code> bốn lần và <code>map</code> hai lần để lấy một phần tử; stream Java gọi hai và một. Mười phần tử thì không sao; một triệu hàng đọc từ tệp thì đó là khác biệt giữa một lượt duyệt và nhiều mảng trung gian.</p>

<h3>Bất ngờ 2 — parallel stream và trạng thái dùng chung</h3>
<p><code>.parallel()</code> chia nguồn thành nhiều khúc và chạy chúng trên <strong>common pool của ForkJoinPool</strong>. Rất hấp dẫn, và cũng là chỗ người mới tạo ra race condition đầu tiên của mình:</p>
${MA21_PAR}
${OUT21_PAR}
<p>Ba lần chạy, ba kích thước sai khác nhau — <code>ArrayList</code> không an toàn luồng, các lệnh <code>add</code> đồng thời ghi đè lên nhau (có lần còn ném <code>ArrayIndexOutOfBoundsException</code>). Cách sửa không phải "dùng list synchronized", mà là thôi sửa trạng thái dùng chung, để thao tác kết thúc tự lắp kết quả (<code>toList()</code>, <code>collect</code>) — chúng được thiết kế cho chạy song song. Bài 2.4 giải thích vì sao <code>add</code> làm mất dữ liệu.</p>
<p>Để ý thêm <code>commonPool parallelism = 3</code> trên container 4 CPU: common pool có <em>số nhân − 1</em> luồng thợ, cộng luồng gọi. Mọi parallel stream trong cả JVM dùng chung các luồng đó — kể cả các stream bên trong mọi request mà ứng dụng Spring đang phục vụ.</p>

<h3>Đo thật: for vs stream vs parallel</h3>
${MA21_PERF}
${OUT21_PERF}
<ul>
  <li>Với 1 000 phần tử, mọi cách đều xong trong vài phần trăm mili giây; <code>parallel</code> <em>không</em> nhanh hơn — chia và gộp tốn hơn chính phần việc.</li>
  <li>Với 10 triệu phần tử, stream tuần tự chậm hơn vòng lặp viết tay một chút (≈ 9–12 ms so với 7–9 ms), còn <code>parallel</code> thắng trên 4 CPU (≈ 4–7 ms). Số đo dao động giữa các lần; so sánh nghiêm túc phải dùng JMH (bài 1.5).</li>
  <li>Trong một request web, danh sách thường chỉ vài chục DTO. Chọn theo độ dễ đọc, không theo micro giây.</li>
</ul>

<h3>Đi làm — đừng bao giờ đặt lời gọi chặn vào parallel stream</h3>
<p>Một pull request kinh điển: "báo cáo gọi một API ngoài chậm cho từng lab; thêm <code>.parallel()</code> cho nhanh".</p>
${MA21_STARVE}
${OUT21_STARVE}
<p>Mười sáu lời gọi 200 ms mất ≈ 800 ms: mỗi lúc chỉ bốn luồng (3 luồng thợ của common pool + luồng gọi), chạy bốn đợt. Trên container production 2 CPU sẽ là 1 luồng thợ + luồng gọi — 1,6 giây. Và trong lúc các luồng đó ngủ, mọi parallel stream khác của ứng dụng phải chờ. Công cụ đúng cho I/O đồng thời là executor hoặc <code>CompletableFuture</code> (bài 2.3) và virtual thread (bài 2.5, ở đó cùng 16 lời gọi mất ≈ 200 ms).</p>

<h3>Khi nào vòng for tốt hơn</h3>
<ul>
  <li>Cần <strong>break</strong> theo điều kiện phức tạp, hoặc <strong>ném checked exception</strong> trong thân (lambda không ném được checked exception — bài 1.4).</li>
  <li>Đang cập nhật nhiều biến cùng lúc (tổng dồn <em>và</em> bộ đếm <em>và</em> giá trị lớn nhất).</li>
  <li>Pipeline đã dài quá ~5 bước với lambda lồng nhau, không ai đọc nổi khi review.</li>
</ul>
<p>Stream để biến đổi dữ liệu; vòng lặp cho thuật toán có luồng điều khiển. Cả hai đều là "Java hiện đại".</p>

<h3>Hình ảnh đời thường</h3>
<p>Stream là dây chuyền quán cà phê: thu ngân nhận đơn (nguồn), pha chế bỏ các đơn đã huỷ (filter), quầy sau thêm sữa (map), người cuối đưa ly cho khách (kết thúc). Chưa có khách chờ thì chưa ai pha — đó là lười. Khách đầu chỉ cần "ly latte đầu tiên" thì dây chuyền dừng sau một ly — ngắt sớm. Còn bốn người pha chế dùng chung một bình sữa mà không chờ lượt chính là <code>ArrayList</code> chạy song song: sữa đổ, ly thiếu.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Thao tác trung gian và thao tác kết thúc khác nhau thế nào?"</strong> — Trung gian thì lười và trả về stream mới; không gì chạy cho tới khi gọi thao tác kết thúc (collect, toList, forEach, reduce, count, findFirst…). Một stream chỉ tiêu thụ được một lần.</li>
  <li><strong>"<code>map</code> khác <code>flatMap</code>?"</strong> — <code>map</code> biến mỗi phần tử thành một phần tử; <code>flatMap</code> biến mỗi phần tử thành một stream rồi trải phẳng (ví dụ lab → các lượt đặt của nó → một stream mọi lượt đặt).</li>
  <li><strong>"<code>Collectors.toMap</code> gặp khoá trùng thì sao?"</strong> — <code>IllegalStateException: Duplicate key</code>, trừ khi truyền hàm gộp.</li>
  <li><strong>"Trên server, khi nào dùng parallel stream?"</strong> — Hiếm: chỉ cho việc tính toán lớn, không có trạng thái dùng chung, và đã đo trước. Không bao giờ cho I/O chặn, vì mọi parallel stream dùng chung common pool (số nhân − 1 luồng).</li>
  <li><strong>"Stream có nhanh hơn vòng for không?"</strong> — Thường chậm hơn chút với vòng lặp đơn giản trên kiểu nguyên thuỷ, và chênh lệch không đáng kể với kích thước request thông thường. Chọn theo độ dễ đọc.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Với dữ liệu mẫu, tính số giờ <em>đã duyệt</em> theo từng sinh viên, sắp theo tên sinh viên.</li>
  <li>Tìm lab có nhiều lượt đặt nhất (mọi trạng thái). Gợi ý: <code>groupingBy</code> rồi stream <code>entrySet()</code> của Map và lấy <code>max(Map.Entry.comparingByValue())</code>.</li>
  <li>Dựng <code>Map&lt;LocalDate, List&lt;Long&gt;&gt;</code> từ ngày tới các id lượt đặt, ngày theo thứ tự.</li>
  <li>Viết lại bài 1 bằng vòng <code>for</code> thường và tự quyết bạn muốn review bản nào hơn.</li>
</ol>
<p><strong>Đạt khi:</strong> bài 1 in <code>{an=2, chi=4, dung=4}</code>, bài 2 in <code>Lab AI=3</code>, bài 3 có bốn ngày từ 2026-11-20 tới 2026-11-23.</p></div>
${giai('Xem một lời giải', `${java(`
Map<String, Integer> approvedByStudent = all.stream()
    .filter(b -> b.status().equals("APPROVED"))
    .collect(Collectors.groupingBy(Booking::student, TreeMap::new, Collectors.summingInt(Booking::hours)));

Map.Entry<String, Long> busiest = all.stream()
    .collect(Collectors.groupingBy(Booking::lab, Collectors.counting()))
    .entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .orElseThrow();

Map<LocalDate, List<Long>> idsByDate = all.stream()
    .collect(Collectors.groupingBy(Booking::date, TreeMap::new,
             Collectors.mapping(Booking::id, Collectors.toList())));`)}
<p><code>orElseThrow()</code> xuất hiện vì <code>max</code> trả về <code>Optional</code> — stream có thể rỗng. Đó là chủ đề bài sau.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stream</span><span class="v">Dãy phần tử lười, dùng một lần, kèm các thao tác, dựng từ một nguồn; không chứa dữ liệu.</span></div>
  <div class="kv"><span class="k">Thao tác trung gian</span><span class="v">Trả về stream mới, chỉ chạy khi thao tác kết thúc kéo dữ liệu (filter, map, sorted…).</span></div>
  <div class="kv"><span class="k">Thao tác kết thúc</span><span class="v">Tạo kết quả hoặc tác dụng phụ và tiêu thụ stream (collect, toList, reduce, forEach…).</span></div>
  <div class="kv"><span class="k">Collector</span><span class="v">Công thức gom phần tử thành kết quả: toList, groupingBy, toMap, joining, counting…</span></div>
  <div class="kv"><span class="k">Collector hạ nguồn</span><span class="v">Collector áp lên từng nhóm bên trong groupingBy/partitioningBy.</span></div>
  <div class="kv"><span class="k">Ngắt sớm (short-circuiting)</span><span class="v">Thao tác có thể xong mà không cần thấy hết phần tử (findFirst, anyMatch, limit).</span></div>
  <div class="kv"><span class="k">Thao tác có trạng thái</span><span class="v">Phải thấy các phần tử khác rồi mới nhả kết quả (sorted, distinct).</span></div>
  <div class="kv"><span class="k">Common pool của ForkJoinPool</span><span class="v">Pool dùng chung toàn JVM (số nhân − 1 luồng thợ) cho parallel stream và mặc định cho CompletableFuture.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>nguồn → thao tác trung gian lười → đúng một thao tác kết thúc; stream chạy một lần.</li>
  <li><code>groupingBy</code> + collector hạ nguồn là GROUP BY trong Java; <code>toMap</code> với dữ liệu thật cần hàm gộp.</li>
  <li><code>Stream.toList()</code> không sửa được.</li>
  <li>Parallel stream: không trạng thái dùng chung, không I/O chặn, đo trước khi dùng.</li>
  <li>Dữ liệu ở cơ sở dữ liệu thì gom bằng SQL; stream dành cho thứ đã nằm trong bộ nhớ.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html', '📄', 'Tổng quan gói java.util.stream', 'Giải thích chính thức về lười, không trạng thái, không can thiệp nguồn và phép gộp.')}
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html', '📄', 'Collectors (Java 21)', 'Mọi collector có sẵn, với cam kết chính xác của toList và toMap.')}

<h3>Nguồn</h3>
<ul>
  <li>Java SE 21 API, <code>Stream.toList()</code> ("returns an unmodifiable List") và <code>Collectors.toMap</code> ("IllegalStateException if duplicate keys"): <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html" target="_blank" rel="noopener">docs.oracle.com — Stream</a></li>
  <li>Độ song song mặc định của <code>ForkJoinPool.commonPool()</code> = số bộ xử lý trừ một: <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ForkJoinPool.html" target="_blank" rel="noopener">docs.oracle.com — ForkJoinPool</a></li>
  <li>Mọi output trên: chạy ngày 18/11/2026 với Temurin 21.0.12.1 trong container giới hạn 4 CPU; Node.js 22.22.2.</li>
</ul>
</div>
`;

// ===== Bài 2.2 =====
const MA22_OPT = java("import java.time.LocalDate;\nimport java.util.*;\n\npublic class Opt {\n    static final Map<Long, Booking> DB = new HashMap<>();\n    static { for (Booking b : Data.BOOKINGS) DB.put(b.id(), b); }\n\n    // Kiểu trả về nói thật: có thể không có\n    static Optional<Booking> findById(long id) { return Optional.ofNullable(DB.get(id)); }\n\n    static Booking defaultBooking() {\n        System.out.println(\"    (defaultBooking() was called)\");\n        return new Booking(0, \"none\", \"none\", \"NONE\", 0, LocalDate.of(2026, 1, 1));\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"findById(5)  = \" + findById(5));\n        System.out.println(\"findById(99) = \" + findById(99));\n\n        // map / filter / orElse: không một dòng if != null nào\n        String who = findById(5).filter(b -> b.status().equals(\"APPROVED\")).map(Booking::student).orElse(\"nobody\");\n        System.out.println(\"approved student of #5 = \" + who);\n        System.out.println(\"student of #99 = \" + findById(99).map(Booking::student).orElse(\"nobody\"));\n\n        // orElse luôn chạy đối số; orElseGet chỉ chạy khi rỗng\n        System.out.println(\"-- orElse with a present value:\");\n        findById(5).orElse(defaultBooking());\n        System.out.println(\"-- orElseGet with a present value:\");\n        findById(5).orElseGet(Opt::defaultBooking);\n        System.out.println(\"-- orElseGet with an empty value:\");\n        findById(99).orElseGet(Opt::defaultBooking);\n\n        // orElseThrow: cách service báo \"không tìm thấy\"\n        try {\n            findById(99).orElseThrow(() -> new NoSuchElementException(\"booking 99 not found\"));\n        } catch (NoSuchElementException e) { System.out.println(\"orElseThrow -> \" + e.getMessage()); }\n\n        // Những cách dùng sai\n        try { findById(99).get(); } catch (NoSuchElementException e) { System.out.println(\"get() on empty -> \" + e); }\n        try { Optional.of(DB.get(99L)); } catch (NullPointerException e) { System.out.println(\"Optional.of(null) -> NullPointerException\"); }\n\n        // ifPresentOrElse và Optional::stream\n        findById(2).ifPresentOrElse(b -> System.out.println(\"found #2 for \" + b.student()),\n                                    () -> System.out.println(\"missing\"));\n        List<String> students = List.of(1L, 99L, 3L, 42L).stream()\n            .map(Opt::findById).flatMap(Optional::stream).map(Booking::student).toList();\n        System.out.println(\"students of ids [1, 99, 3, 42] = \" + students);\n    }\n}");
const OUT22_OPT = out("$ java Opt.java\nfindById(5)  = Optional[Booking[id=5, lab=Lab IoT, student=dung, status=APPROVED, hours=4, date=2026-11-22]]\nfindById(99) = Optional.empty\napproved student of #5 = dung\nstudent of #99 = nobody\n-- orElse with a present value:\n    (defaultBooking() was called)\n-- orElseGet with a present value:\n-- orElseGet with an empty value:\n    (defaultBooking() was called)\norElseThrow -> booking 99 not found\nget() on empty -> java.util.NoSuchElementException: No value present\nOptional.of(null) -> NullPointerException\nfound #2 for binh\nstudents of ids [1, 99, 3, 42] = [an, chi]");
const MA22_NPE = java("public class Npe {\n    record Building(String name) {}\n    record Lab(String name, Building building) {}\n    record Booking(long id, Lab lab) {}\n\n    public static void main(String[] args) {\n        Booking b = new Booking(7, new Lab(\"Lab Mạng\", null));   // lab chưa gán toà nhà\n        String where = b.lab().building().name().toUpperCase();\n        System.out.println(where);\n    }\n}");
const OUT22_NPE = out("$ java Npe.java\nException in thread \"main\" java.lang.NullPointerException: Cannot invoke \"Npe$Building.name()\" because the return value of \"Npe$Lab.building()\" is null\n\tat Npe.main(Npe.java:8)");
const MA22_FIELD = java("import java.io.*;\nimport java.util.Optional;\n\npublic class OptField {\n    record Student(String name, Optional<String> phone) implements Serializable {}\n\n    public static void main(String[] args) throws IOException {\n        Student s = new Student(\"an\", Optional.of(\"0901234567\"));\n        try (var out = new ObjectOutputStream(new ByteArrayOutputStream())) {\n            out.writeObject(s);\n        } catch (NotSerializableException e) {\n            System.out.println(\"NotSerializableException: \" + e.getMessage());\n        }\n        Student t = new Student(\"binh\", null);         // Optional field can itself be null\n        System.out.println(\"phone present? \" + t.phone().isPresent());\n    }\n}");
const OUT22_FIELD = out("$ java OptField.java\nNotSerializableException: java.util.Optional\nException in thread \"main\" java.lang.NullPointerException: Cannot invoke \"java.util.Optional.isPresent()\" because the return value of \"OptField$Student.phone()\" is null\n\tat OptField.main(OptField.java:15)");
const MA22_PKG = java("@NullMarked\npackage labflow;\n\nimport org.jspecify.annotations.NullMarked;");
const MA22_SVC = java("package labflow;\n\nimport java.util.HashMap;\nimport java.util.Map;\nimport org.jspecify.annotations.Nullable;\n\npublic class LabService {\n    private final Map<Long, String> names = new HashMap<>();\n\n    /** Có thể không tìm thấy ⇒ khai báo rõ @Nullable. */\n    public @Nullable String findName(long id) {\n        return names.get(id);\n    }\n\n    public int nameLength(long id) {\n        String name = findName(id);\n        return name.length();                 // quên kiểm null\n    }\n\n    public String greet(String name) {        // trong @NullMarked: tham số mặc định KHÔNG null\n        return \"Hello \" + name.trim();\n    }\n\n    public String caller() {\n        return greet(null);                   // truyền null vào chỗ không cho null\n    }\n}");
const OUT22_NA = out("$ mvn -q compile        # Error Prone 2.42.0 + NullAway 0.12.10\n[ERROR] src/main/java/labflow/LabService.java:[17,20] [NullAway] dereferenced expression name is @Nullable\n    (see http://t.uber.com/nullaway )\n[ERROR] src/main/java/labflow/LabService.java:[25,22] [NullAway] passing @Nullable parameter 'null' where @NonNull is required\n    (see http://t.uber.com/nullaway )\n[ERROR] BUILD FAILURE");
const OUT22_JAVAC = out("$ javac -cp jspecify-1.0.0.jar -d out src/main/java/labflow/*.java && echo \"plain javac: OK\"\nplain javac: OK");
const OUT22_SPRING = out("$ javap -cp spring-data-commons-4.1.1.jar org.springframework.data.repository.CrudRepository | grep findById\n  public abstract java.util.Optional<T> findById(ID);\n$ javap -v -cp spring-core-7.0.10.jar org.springframework.util.package-info | grep NullMarked\n    org.jspecify.annotations.NullMarked\n$ javap -v -cp spring-core-7.0.10.jar org.springframework.util.StringUtils    # method hasText(String)\n  public static boolean hasText(java.lang.String);\n    RuntimeVisibleTypeAnnotations:\n      0: #487(): METHOD_FORMAL_PARAMETER, param_index=0\n        org.jspecify.annotations.Nullable\n$ jar tf spring-core-7.0.10.jar | grep -c package-info.class\n50");

const L22_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Optional and null safety</h2>
<p class="lead">Tony Hoare, who added the null reference to ALGOL W in 1965, called it his "billion-dollar mistake" in a 2009 talk. In Java a null hides in any reference and explodes far from where it was born. This lesson shows the three tools a Spring Boot 4 developer actually has: <code>Optional</code> as an honest return type, the JVM's helpful <code>NullPointerException</code> messages, and the JSpecify <code>@Nullable</code> annotations that Spring Framework 7 now puts on its whole API — checked at compile time by NullAway, run for real below.</p>

<h3>Optional: a return type that admits "maybe nothing"</h3>
<p>Spring Data's <code>findById</code> returns <code>Optional&lt;T&gt;</code>, not <code>T</code>. The type forces the caller to decide what "not found" means. Our in-memory version behaves the same:</p>
${MA22_OPT}
${OUT22_OPT}
<div class="kv-grid">
  <div class="kv"><span class="k">Optional.ofNullable(x)</span><span class="v">Wraps a value that may be null: empty if null. <code>Optional.of(null)</code> throws immediately — use <code>of</code> only when null would be a bug.</span></div>
  <div class="kv"><span class="k">map / filter / flatMap</span><span class="v">Transform the value if present; an empty Optional passes through untouched. Replaces chains of <code>if (x != null)</code>.</span></div>
  <div class="kv"><span class="k">orElse(v)</span><span class="v">Default value. <strong>The argument is always evaluated</strong> — the output shows <code>defaultBooking()</code> running even though booking 5 exists.</span></div>
  <div class="kv"><span class="k">orElseGet(supplier)</span><span class="v">Default computed only when empty. Use it when the default is expensive (a query, a new object, a log line).</span></div>
  <div class="kv"><span class="k">orElseThrow(…)</span><span class="v">The service-layer idiom: <code>repo.findById(id).orElseThrow(() -&gt; new BookingNotFoundException(id))</code>; Chapter 5 turns that exception into a 404 ProblemDetail.</span></div>
  <div class="kv"><span class="k">get()</span><span class="v">Throws <code>NoSuchElementException: No value present</code> on empty — it is the same bug as dereferencing null, just with a different name. Prefer <code>orElseThrow()</code>, which says what it does.</span></div>
  <div class="kv"><span class="k">Optional::stream</span><span class="v">Turns an Optional into a stream of 0 or 1 elements: <code>flatMap(Optional::stream)</code> drops the missing ids 99 and 42 in one step.</span></div>
</div>

<h3>Where Optional does not belong</h3>
<p>Optional was designed by the JDK team for <strong>return types</strong> of methods that may have no result. Brian Goetz (Java language architect) has repeated it many times: not for fields, not for parameters, not for collections.</p>
${MA22_FIELD}
${OUT22_FIELD}
<ul>
  <li><strong>Fields:</strong> <code>Optional</code> is not <code>Serializable</code> (first line of output), JPA cannot map it, and the field can itself be <code>null</code> — the second error is a <code>NullPointerException</code> thrown <em>by the Optional</em>. You now have three states instead of two.</li>
  <li><strong>Parameters:</strong> <code>book(Optional&lt;String&gt; note)</code> forces every caller to wrap; overload the method or accept a nullable parameter annotated <code>@Nullable</code>.</li>
  <li><strong>Collections:</strong> never <code>Optional&lt;List&lt;X&gt;&gt;</code> — return an empty list. "No bookings" is <code>List.of()</code>, not "maybe a list".</li>
  <li><strong>Performance:</strong> each Optional is an object. In a hot loop over millions of elements, <code>OptionalInt</code> or a plain check is cheaper.</li>
</ul>

<h3>When null escapes anyway: helpful NullPointerException messages</h3>
<p>Since Java 14 (JEP 358, on by default from 15) the JVM tells you <em>which</em> reference was null, not just the line:</p>
${MA22_NPE}
${OUT22_NPE}
<p>Line 8 has four calls; the message names the guilty one — <code>building()</code> returned null. When you read a production log in Chapter 15, this sentence is usually enough to find the bug without a debugger. (Before Java 14 the log said only <code>java.lang.NullPointerException at Npe.main(Npe.java:8)</code>, and you guessed among four candidates.)</p>

<h3>Spring Framework 7: JSpecify annotations on the whole API</h3>
<p>Spring Boot 4 runs on Spring Framework 7, which replaced its own <code>org.springframework.lang.Nullable</code> with the cross-vendor <strong>JSpecify</strong> standard. The model is: a package marked <code>@NullMarked</code> means "nothing here is null unless it says <code>@Nullable</code>". You can see it inside the real jars:</p>
${OUT22_SPRING}
<p>All 50 packages of <code>spring-core</code> are <code>@NullMarked</code>, and <code>StringUtils.hasText</code> declares that its parameter may be null. Your IDE (IntelliJ understands JSpecify) and Kotlin read these annotations. But the Java compiler itself ignores them:</p>
${MA22_PKG}
${MA22_SVC}
${OUT22_JAVAC}
<p>Plain <code>javac</code> accepts both bugs. Add <strong>NullAway</strong> (an Error Prone plugin from Uber) to the build and the same code fails to compile, pointing at the exact columns:</p>
${OUT22_NA}
<p>This is how teams move null bugs from "3 a.m. production alert" to "red build in the pull request". The Spring team itself compiles Spring Framework 7 with NullAway.</p>

<h3>🕵️ Real incident — Google Cloud, 12 June 2025</h3>
<div class="callout warn"><p>On 29 May 2025 Google added a new quota-policy check to <strong>Service Control</strong>, the component that admits every Google Cloud API request. The new code path had no error handling for missing data and no feature flag. On <strong>12 June 2025 at 10:49 (US/Pacific)</strong> a policy change with <strong>unintended blank fields</strong> was replicated to every region within seconds; the code read the blank field, hit a <strong>null pointer</strong>, and the binary crashed — then restarted and crashed again, in every region at once. Many Google Cloud and Workspace APIs returned 503 errors; downstream services built on Google Cloud went down with them. Most regions recovered within about 2 hours; the incident lasted about 3 hours in total.</p>
<p><strong>Lessons for your code:</strong> (1) data coming from outside — config, database rows, JSON — can always be blank; validate it at the boundary (Chapter 5) and model "maybe absent" in the type (<code>Optional</code> return, <code>@Nullable</code>); (2) one bad record must fail <em>one request</em>, not crash the process — handle the exception where the data is read; (3) ship new code paths behind a feature flag and roll them out gradually. Google's own report lists exactly these three.</p></div>

<h3>Compared with Node.js / TypeScript</h3>
<p>TypeScript with <code>strictNullChecks</code> builds null-safety into the type checker: <code>string | null</code> must be narrowed before use, and optional chaining <code>a?.b?.c ?? "default"</code> is the everyday syntax. Java has no <code>?.</code> operator; <code>Optional.map</code> chains and JSpecify + NullAway give you the same safety, but you must opt in. In an interview: "TypeScript makes null part of the type by default; in Java I use Optional for return values and JSpecify with NullAway in the build, which is what Spring 7 itself does."</p>

<h3>Everyday picture</h3>
<p>Asking reception "is there a parcel for me?" — a good receptionist answers "yes, here it is" or "no, nothing today" (Optional). A bad one hands you an empty box without saying so (null), and you only notice when you try to open it at home. <code>orElse</code> is ordering a backup pizza <em>before</em> checking whether the first one arrived; <code>orElseGet</code> orders it only if the first one did not come.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"orElse vs orElseGet?"</strong> — <code>orElse</code> always evaluates its argument; <code>orElseGet</code> calls the supplier only when the Optional is empty. Expensive default ⇒ <code>orElseGet</code>.</li>
  <li><strong>"Should a JPA entity field be Optional?"</strong> — No: not serializable, not mappable, and the field itself can be null. Return <code>Optional</code> from a getter or repository method instead.</li>
  <li><strong>"Why does Spring Data return Optional from findById but a List from findAll?"</strong> — One result may be absent; many results are naturally "zero or more", so an empty list already says "nothing".</li>
  <li><strong>"How do you prevent NullPointerException in a large codebase?"</strong> — Optional for absent return values, validation at boundaries, <code>@NullMarked</code>/<code>@Nullable</code> (JSpecify) checked by NullAway in CI, and readable helpful NPE messages for what slips through.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write <code>Optional&lt;Booking&gt; latestApprovedOf(String student)</code> over the sample data (latest = greatest date). <code>latestApprovedOf("chi")</code> must be booking 7; <code>latestApprovedOf("binh")</code> must be empty.</li>
  <li>Using it, print the lab name or <code>"no approved booking"</code> — no <code>if</code>, no <code>get()</code>.</li>
  <li>Add a <code>@NullMarked</code> package with a method <code>@Nullable String noteOf(long id)</code> and a caller that calls <code>.length()</code> on it. Confirm that plain <code>javac</code> accepts it, then explain in one sentence what NullAway would report.</li>
</ol>
<p><strong>Done when:</strong> the program prints <code>Lab Mạng</code> for chi and <code>no approved booking</code> for binh.</p></div>
${giai('Show one solution', `${java(`
static Optional<Booking> latestApprovedOf(String student) {
    return Data.BOOKINGS.stream()
        .filter(b -> b.student().equals(student) && b.status().equals("APPROVED"))
        .max(Comparator.comparing(Booking::date));
}

System.out.println(latestApprovedOf("chi").map(Booking::lab).orElse("no approved booking"));
System.out.println(latestApprovedOf("binh").map(Booking::lab).orElse("no approved booking"));`)}
<p><code>max</code> already returns an <code>Optional</code>, so the method needs no null at all. NullAway would report "dereferenced expression … is @Nullable" on the <code>.length()</code> call — exactly the first error in the output above.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Optional&lt;T&gt;</span><span class="v">A container holding zero or one value, meant for method return types that may have no result.</span></div>
  <div class="kv"><span class="k">orElse / orElseGet / orElseThrow</span><span class="v">Unwrap with a default (always evaluated), a lazy default, or an exception.</span></div>
  <div class="kv"><span class="k">Helpful NPE</span><span class="v">JEP 358 (Java 14): the NullPointerException message names the expression that was null.</span></div>
  <div class="kv"><span class="k">JSpecify</span><span class="v">A standard set of nullness annotations (<code>@NullMarked</code>, <code>@Nullable</code>, <code>@NonNull</code>) shared by Spring, Google, JetBrains and others.</span></div>
  <div class="kv"><span class="k">@NullMarked</span><span class="v">Applied to a package or class: types are non-null by default inside it.</span></div>
  <div class="kv"><span class="k">NullAway</span><span class="v">An Error Prone compiler plugin that fails the build when a nullable value is dereferenced or passed where non-null is required.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Return <code>Optional</code> when "no result" is normal; unwrap with <code>map</code>/<code>orElseGet</code>/<code>orElseThrow</code>, avoid <code>get()</code>.</li>
  <li>No Optional in fields, parameters or around collections.</li>
  <li>Read the helpful NPE message — it names the null.</li>
  <li>Spring 7 is <code>@NullMarked</code>; JSpecify + NullAway turn null bugs into compile errors.</li>
  <li>Data from outside can be blank: validate at the boundary, fail one request not the process (Google Cloud, June 2025).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://jspecify.dev/docs/user-guide/', '📄', 'JSpecify user guide', 'The meaning of @NullMarked, @Nullable and how tools interpret them.')}
${tl('https://docs.spring.io/spring-framework/reference/core/null-safety.html', '🌱', 'Spring Framework — Null-safety', 'How Spring 7 annotates its API with JSpecify and how to check your own code with NullAway.')}

<h3>Sources</h3>
<ul>
  <li>Google Cloud incident report, 12 June 2025 (Service Control null pointer, blank fields, crash loop, 3 hours): <a href="https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW" target="_blank" rel="noopener">status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW</a></li>
  <li>JEP 358: Helpful NullPointerExceptions: <a href="https://openjdk.org/jeps/358" target="_blank" rel="noopener">openjdk.org/jeps/358</a></li>
  <li>Tony Hoare, "Null References: The Billion Dollar Mistake", QCon London 2009: <a href="https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/" target="_blank" rel="noopener">infoq.com</a></li>
  <li>NullAway: <a href="https://github.com/uber/NullAway" target="_blank" rel="noopener">github.com/uber/NullAway</a>. Outputs above: Temurin 21.0.12.1, Error Prone 2.42.0, NullAway 0.12.10, spring-core 7.0.10, spring-data-commons 4.1.1 — run on 18/11/2026.</li>
</ul>
</div>
`;

const L22_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Optional và an toàn null</h2>
<p class="lead">Tony Hoare, người đưa tham chiếu null vào ALGOL W năm 1965, gọi nó là "sai lầm tỷ đô" của mình trong một bài nói năm 2009. Trong Java, null nấp trong mọi tham chiếu và nổ ở chỗ cách xa nơi nó sinh ra. Bài này cho bạn ba công cụ mà người viết Spring Boot 4 thật sự có: <code>Optional</code> làm kiểu trả về trung thực, thông điệp <code>NullPointerException</code> "biết nói" của JVM, và chú thích JSpecify <code>@Nullable</code> mà Spring Framework 7 nay gắn lên toàn bộ API — được NullAway kiểm ngay lúc biên dịch, chạy thật bên dưới.</p>

<h3>Optional: kiểu trả về dám nói "có thể không có gì"</h3>
<p><code>findById</code> của Spring Data trả <code>Optional&lt;T&gt;</code>, không phải <code>T</code>. Kiểu dữ liệu buộc nơi gọi phải quyết "không tìm thấy" nghĩa là gì. Bản trong bộ nhớ của ta chạy y như vậy:</p>
${MA22_OPT}
${OUT22_OPT}
<div class="kv-grid">
  <div class="kv"><span class="k">Optional.ofNullable(x)</span><span class="v">Bọc một giá trị có thể null: null thì rỗng. <code>Optional.of(null)</code> ném lỗi ngay — chỉ dùng <code>of</code> khi null là bug.</span></div>
  <div class="kv"><span class="k">map / filter / flatMap</span><span class="v">Biến đổi giá trị nếu có; Optional rỗng đi qua nguyên vẹn. Thay cho chuỗi <code>if (x != null)</code>.</span></div>
  <div class="kv"><span class="k">orElse(v)</span><span class="v">Giá trị mặc định. <strong>Đối số luôn được tính</strong> — output cho thấy <code>defaultBooking()</code> vẫn chạy dù lượt đặt 5 có tồn tại.</span></div>
  <div class="kv"><span class="k">orElseGet(supplier)</span><span class="v">Mặc định chỉ được tính khi rỗng. Dùng khi tạo mặc định tốn kém (một truy vấn, một đối tượng mới, một dòng log).</span></div>
  <div class="kv"><span class="k">orElseThrow(…)</span><span class="v">Thành ngữ ở tầng service: <code>repo.findById(id).orElseThrow(() -&gt; new BookingNotFoundException(id))</code>; Chương 5 biến exception đó thành ProblemDetail 404.</span></div>
  <div class="kv"><span class="k">get()</span><span class="v">Ném <code>NoSuchElementException: No value present</code> khi rỗng — vẫn là bug dùng null, chỉ đổi tên. Ưu tiên <code>orElseThrow()</code>, tên nói rõ việc nó làm.</span></div>
  <div class="kv"><span class="k">Optional::stream</span><span class="v">Biến Optional thành stream 0 hoặc 1 phần tử: <code>flatMap(Optional::stream)</code> bỏ các id thiếu 99 và 42 trong một bước.</span></div>
</div>

<h3>Optional không thuộc về những chỗ này</h3>
<p>Nhóm JDK thiết kế Optional cho <strong>kiểu trả về</strong> của phương thức có thể không có kết quả. Brian Goetz (kiến trúc sư ngôn ngữ Java) nhắc nhiều lần: không dùng cho field, không cho tham số, không cho collection.</p>
${MA22_FIELD}
${OUT22_FIELD}
<ul>
  <li><strong>Field:</strong> <code>Optional</code> không <code>Serializable</code> (dòng output đầu), JPA không ánh xạ được, và chính field đó vẫn có thể <code>null</code> — lỗi thứ hai là <code>NullPointerException</code> do <em>chính cái Optional</em> gây ra. Giờ bạn có ba trạng thái thay vì hai.</li>
  <li><strong>Tham số:</strong> <code>book(Optional&lt;String&gt; note)</code> bắt mọi nơi gọi phải bọc; hãy nạp chồng phương thức hoặc nhận tham số có thể null được chú thích <code>@Nullable</code>.</li>
  <li><strong>Collection:</strong> không bao giờ <code>Optional&lt;List&lt;X&gt;&gt;</code> — trả list rỗng. "Không có lượt đặt nào" là <code>List.of()</code>, không phải "có thể có một list".</li>
  <li><strong>Hiệu năng:</strong> mỗi Optional là một đối tượng. Trong vòng lặp nóng qua hàng triệu phần tử, <code>OptionalInt</code> hoặc một phép kiểm thường rẻ hơn.</li>
</ul>

<h3>Khi null vẫn lọt: thông điệp NullPointerException biết nói</h3>
<p>Từ Java 14 (JEP 358, bật mặc định từ 15), JVM cho biết <em>tham chiếu nào</em> null, không chỉ số dòng:</p>
${MA22_NPE}
${OUT22_NPE}
<p>Dòng 8 có bốn lời gọi; thông điệp chỉ đúng thủ phạm — <code>building()</code> trả null. Khi đọc log production ở Chương 15, câu này thường đủ để tìm ra bug mà không cần debugger. (Trước Java 14 log chỉ ghi <code>java.lang.NullPointerException at Npe.main(Npe.java:8)</code>, và bạn đoán giữa bốn ứng viên.)</p>

<h3>Spring Framework 7: chú thích JSpecify trên toàn bộ API</h3>
<p>Spring Boot 4 chạy trên Spring Framework 7, bản đã thay <code>org.springframework.lang.Nullable</code> của riêng nó bằng chuẩn chung <strong>JSpecify</strong>. Mô hình là: gói được đánh <code>@NullMarked</code> nghĩa là "trong này không gì null trừ khi ghi <code>@Nullable</code>". Bạn thấy được điều đó ngay trong jar thật:</p>
${OUT22_SPRING}
<p>Cả 50 gói của <code>spring-core</code> đều <code>@NullMarked</code>, và <code>StringUtils.hasText</code> khai báo tham số của nó có thể null. IDE (IntelliJ hiểu JSpecify) và Kotlin đọc các chú thích này. Nhưng bản thân trình biên dịch Java thì bỏ qua:</p>
${MA22_PKG}
${MA22_SVC}
${OUT22_JAVAC}
<p><code>javac</code> thường chấp nhận cả hai bug. Thêm <strong>NullAway</strong> (plugin Error Prone của Uber) vào bước build thì cùng mã đó biên dịch thất bại, chỉ đúng cột:</p>
${OUT22_NA}
<p>Đây là cách các nhóm chuyển bug null từ "cảnh báo production lúc 3 giờ sáng" thành "build đỏ trong pull request". Chính nhóm Spring biên dịch Spring Framework 7 với NullAway.</p>

<h3>🕵️ Sự cố thật — Google Cloud, 12/6/2025</h3>
<div class="callout warn"><p>Ngày 29/5/2025 Google thêm một phép kiểm chính sách hạn mức mới vào <strong>Service Control</strong>, thành phần cho phép đi qua mọi request API của Google Cloud. Nhánh mã mới không xử lý lỗi khi thiếu dữ liệu và không có cờ tính năng (feature flag). Ngày <strong>12/6/2025 lúc 10:49 (giờ Thái Bình Dương Mỹ)</strong>, một thay đổi chính sách có <strong>trường trống ngoài ý muốn</strong> được nhân bản tới mọi vùng trong vài giây; mã đọc trường trống, gặp <strong>con trỏ null</strong>, và tiến trình sập — khởi động lại rồi sập tiếp, ở mọi vùng cùng lúc. Nhiều API Google Cloud và Workspace trả lỗi 503; các dịch vụ xây trên Google Cloud sập theo. Phần lớn vùng hồi phục trong khoảng 2 giờ; cả sự cố kéo dài khoảng 3 giờ.</p>
<p><strong>Bài học cho mã của bạn:</strong> (1) dữ liệu từ ngoài vào — cấu hình, hàng trong cơ sở dữ liệu, JSON — luôn có thể trống; kiểm ở biên (Chương 5) và mô hình hoá "có thể vắng" ngay trong kiểu (<code>Optional</code> trả về, <code>@Nullable</code>); (2) một bản ghi hỏng chỉ được làm hỏng <em>một request</em>, không được làm sập tiến trình — xử lý exception ngay chỗ đọc dữ liệu; (3) đưa nhánh mã mới ra sau cờ tính năng và bật dần. Báo cáo của chính Google liệt kê đúng ba điều này.</p></div>

<h3>So với Node.js / TypeScript</h3>
<p>TypeScript bật <code>strictNullChecks</code> là có an toàn null ngay trong bộ kiểm kiểu: <code>string | null</code> phải được thu hẹp trước khi dùng, và optional chaining <code>a?.b?.c ?? "default"</code> là cú pháp hằng ngày. Java không có toán tử <code>?.</code>; chuỗi <code>Optional.map</code> cùng JSpecify + NullAway cho bạn độ an toàn tương đương, nhưng phải tự bật. Khi phỏng vấn: "TypeScript mặc định đưa null vào kiểu; trong Java tôi dùng Optional cho giá trị trả về và JSpecify với NullAway trong build, đúng như Spring 7 làm."</p>

<h3>Hình ảnh đời thường</h3>
<p>Hỏi lễ tân "có bưu phẩm của tôi không?" — lễ tân tốt trả lời "có, đây" hoặc "không, hôm nay chưa có" (Optional). Lễ tân tồi đưa bạn một hộp rỗng mà không nói gì (null), về nhà mở ra mới biết. <code>orElse</code> là đặt thêm một chiếc pizza dự phòng <em>trước khi</em> xem chiếc đầu đã tới chưa; <code>orElseGet</code> chỉ đặt khi chiếc đầu không tới.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"orElse khác orElseGet?"</strong> — <code>orElse</code> luôn tính đối số; <code>orElseGet</code> chỉ gọi supplier khi Optional rỗng. Mặc định tốn kém ⇒ <code>orElseGet</code>.</li>
  <li><strong>"Field của entity JPA có nên là Optional?"</strong> — Không: không serializable, không ánh xạ được, và chính field vẫn có thể null. Hãy trả <code>Optional</code> từ getter hoặc phương thức repository.</li>
  <li><strong>"Vì sao Spring Data trả Optional cho findById nhưng List cho findAll?"</strong> — Một kết quả có thể vắng; nhiều kết quả vốn là "không hoặc nhiều", list rỗng đã nói "không có gì".</li>
  <li><strong>"Làm sao ngăn NullPointerException trong một codebase lớn?"</strong> — Optional cho giá trị trả về có thể vắng, kiểm dữ liệu ở biên, <code>@NullMarked</code>/<code>@Nullable</code> (JSpecify) được NullAway kiểm trong CI, và đọc thông điệp NPE biết nói cho những gì còn lọt.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết <code>Optional&lt;Booking&gt; latestApprovedOf(String student)</code> trên dữ liệu mẫu (mới nhất = ngày lớn nhất). <code>latestApprovedOf("chi")</code> phải là lượt đặt 7; <code>latestApprovedOf("binh")</code> phải rỗng.</li>
  <li>Dùng nó in tên lab hoặc <code>"no approved booking"</code> — không <code>if</code>, không <code>get()</code>.</li>
  <li>Tạo gói <code>@NullMarked</code> có phương thức <code>@Nullable String noteOf(long id)</code> và một nơi gọi <code>.length()</code> trên nó. Xác nhận <code>javac</code> thường chấp nhận, rồi giải thích trong một câu NullAway sẽ báo gì.</li>
</ol>
<p><strong>Đạt khi:</strong> chương trình in <code>Lab Mạng</code> cho chi và <code>no approved booking</code> cho binh.</p></div>
${giai('Xem một lời giải', `${java(`
static Optional<Booking> latestApprovedOf(String student) {
    return Data.BOOKINGS.stream()
        .filter(b -> b.student().equals(student) && b.status().equals("APPROVED"))
        .max(Comparator.comparing(Booking::date));
}

System.out.println(latestApprovedOf("chi").map(Booking::lab).orElse("no approved booking"));
System.out.println(latestApprovedOf("binh").map(Booking::lab).orElse("no approved booking"));`)}
<p><code>max</code> vốn đã trả <code>Optional</code>, nên phương thức không cần null chút nào. NullAway sẽ báo "dereferenced expression … is @Nullable" ở lời gọi <code>.length()</code> — đúng lỗi đầu tiên trong output phía trên.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Optional&lt;T&gt;</span><span class="v">Hộp chứa không hoặc một giá trị, dành cho kiểu trả về của phương thức có thể không có kết quả.</span></div>
  <div class="kv"><span class="k">orElse / orElseGet / orElseThrow</span><span class="v">Mở hộp với giá trị mặc định (luôn được tính), mặc định lười, hoặc một exception.</span></div>
  <div class="kv"><span class="k">NPE biết nói</span><span class="v">JEP 358 (Java 14): thông điệp NullPointerException nêu biểu thức đã null.</span></div>
  <div class="kv"><span class="k">JSpecify</span><span class="v">Bộ chú thích null chuẩn (<code>@NullMarked</code>, <code>@Nullable</code>, <code>@NonNull</code>) dùng chung bởi Spring, Google, JetBrains và nhiều bên khác.</span></div>
  <div class="kv"><span class="k">@NullMarked</span><span class="v">Gắn lên gói hoặc lớp: bên trong, kiểu mặc định là không null.</span></div>
  <div class="kv"><span class="k">NullAway</span><span class="v">Plugin biên dịch Error Prone làm build thất bại khi giá trị có thể null bị dùng hoặc bị truyền vào chỗ đòi không null.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Trả <code>Optional</code> khi "không có kết quả" là bình thường; mở bằng <code>map</code>/<code>orElseGet</code>/<code>orElseThrow</code>, tránh <code>get()</code>.</li>
  <li>Không Optional ở field, tham số hay bọc collection.</li>
  <li>Đọc thông điệp NPE biết nói — nó gọi tên thứ đã null.</li>
  <li>Spring 7 đã <code>@NullMarked</code>; JSpecify + NullAway biến bug null thành lỗi biên dịch.</li>
  <li>Dữ liệu từ ngoài có thể trống: kiểm ở biên, hỏng một request chứ đừng sập tiến trình (Google Cloud, 6/2025).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://jspecify.dev/docs/user-guide/', '📄', 'Hướng dẫn JSpecify', 'Ý nghĩa của @NullMarked, @Nullable và cách các công cụ hiểu chúng.')}
${tl('https://docs.spring.io/spring-framework/reference/core/null-safety.html', '🌱', 'Spring Framework — Null-safety', 'Cách Spring 7 chú thích API bằng JSpecify và cách kiểm mã của bạn bằng NullAway.')}

<h3>Nguồn</h3>
<ul>
  <li>Báo cáo sự cố Google Cloud ngày 12/6/2025 (con trỏ null ở Service Control, trường trống, khởi động lại liên tục, 3 giờ): <a href="https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW" target="_blank" rel="noopener">status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW</a></li>
  <li>JEP 358: Helpful NullPointerExceptions: <a href="https://openjdk.org/jeps/358" target="_blank" rel="noopener">openjdk.org/jeps/358</a></li>
  <li>Tony Hoare, "Null References: The Billion Dollar Mistake", QCon London 2009: <a href="https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/" target="_blank" rel="noopener">infoq.com</a></li>
  <li>NullAway: <a href="https://github.com/uber/NullAway" target="_blank" rel="noopener">github.com/uber/NullAway</a>. Output phía trên: Temurin 21.0.12.1, Error Prone 2.42.0, NullAway 0.12.10, spring-core 7.0.10, spring-data-commons 4.1.1 — chạy ngày 18/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 2.3 =====
const MA23_THREADS = java("public class Threads {\n    public static void main(String[] args) throws InterruptedException {\n        Runnable task = () -> System.out.println(\"  running on \" + Thread.currentThread().getName());\n\n        System.out.println(\"run() — just a method call:\");\n        new Thread(task, \"worker-A\").run();\n\n        System.out.println(\"start() — a new OS thread:\");\n        Thread t = new Thread(task, \"worker-B\");\n        t.start();\n        t.join();                                         // chờ worker-B xong\n\n        System.out.println(\"threads alive in an idle JVM: \" + Thread.getAllStackTraces().size());\n\n        // Tạo 10 000 luồng nền tảng, mỗi luồng ngủ 10 ms\n        long t0 = System.nanoTime();\n        Thread[] ts = new Thread[10_000];\n        for (int i = 0; i < ts.length; i++) {\n            ts[i] = new Thread(() -> { try { Thread.sleep(10); } catch (InterruptedException e) {} });\n            ts[i].start();\n        }\n        for (Thread x : ts) x.join();\n        System.out.printf(\"10 000 platform threads started and joined in %d ms%n\", (System.nanoTime() - t0) / 1_000_000);\n    }\n}");
const OUT23_THREADS = out("$ java Threads.java\nrun() — just a method call:\n  running on main\nstart() — a new OS thread:\n  running on worker-B\nthreads alive in an idle JVM: 6\n10 000 platform threads started and joined in 3554 ms");
const MA23_POOL = java("import java.util.*;\nimport java.util.concurrent.*;\n\npublic class Pool {\n    static String checkLab(int id) throws InterruptedException {\n        Thread.sleep(200);                                 // giả lập gọi DB 200 ms\n        return \"lab \" + id + \" ok on \" + Thread.currentThread().getName();\n    }\n    public static void main(String[] args) throws Exception {\n        ExecutorService pool = Executors.newFixedThreadPool(4);\n        long t0 = System.nanoTime();\n        List<Future<String>> futures = new ArrayList<>();\n        for (int i = 1; i <= 12; i++) {\n            final int id = i;\n            futures.add(pool.submit(() -> checkLab(id)));     // Callable: có giá trị trả về\n        }\n        for (Future<String> f : futures) System.out.println(\"  \" + f.get());   // get() chặn tới khi xong\n        System.out.printf(\"12 tasks x 200 ms on 4 threads: %d ms%n\", (System.nanoTime() - t0) / 1_000_000);\n\n        // Hết giờ: không chờ mãi một việc treo\n        Future<String> slow = pool.submit(() -> { Thread.sleep(5_000); return \"late\"; });\n        try { slow.get(300, TimeUnit.MILLISECONDS); }\n        catch (TimeoutException e) { System.out.println(\"get(300 ms) -> TimeoutException, cancel: \" + slow.cancel(true)); }\n\n        // Exception trong task được gói vào ExecutionException\n        Future<Integer> bad = pool.submit(() -> Integer.parseInt(\"abc\"));\n        try { bad.get(); } catch (ExecutionException e) { System.out.println(\"get() -> \" + e.getCause()); }\n\n        pool.shutdown();                                   // không nhận việc mới, làm nốt việc cũ\n        System.out.println(\"terminated: \" + pool.awaitTermination(5, TimeUnit.SECONDS));\n    }\n}");
const OUT23_POOL = out("$ java Pool.java\n  lab 1 ok on pool-1-thread-1\n  lab 2 ok on pool-1-thread-2\n  lab 3 ok on pool-1-thread-3\n  lab 4 ok on pool-1-thread-4\n  lab 5 ok on pool-1-thread-3\n  lab 6 ok on pool-1-thread-2\n  lab 7 ok on pool-1-thread-1\n  lab 8 ok on pool-1-thread-4\n  lab 9 ok on pool-1-thread-2\n  lab 10 ok on pool-1-thread-3\n  lab 11 ok on pool-1-thread-1\n  lab 12 ok on pool-1-thread-4\n12 tasks x 200 ms on 4 threads: 606 ms\nget(300 ms) -> TimeoutException, cancel: true\nget() -> java.lang.NumberFormatException: For input string: \"abc\"\nterminated: true");
const MA23_NOSHUT = java("import java.util.concurrent.*;\n\npublic class NoShutdown {\n    public static void main(String[] args) {\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n        pool.submit(() -> System.out.println(\"report sent\"));\n        System.out.println(\"main() finished\");\n        // quên pool.shutdown(): luồng của pool không phải daemon ⇒ JVM không thoát\n    }\n}");
const OUT23_NOSHUT = out("$ timeout 5 java NoShutdown.java; echo \"exit=$?\"\nmain() finished\nreport sent\nexit=124");
const MA23_CF = java("import java.util.concurrent.*;\n\npublic class Cf {\n    static void sleep(long ms) { try { Thread.sleep(ms); } catch (InterruptedException e) { throw new RuntimeException(e); } }\n    static String lab(long id)      { sleep(300); return \"Lab AI\"; }                 // gọi DB\n    static int bookings(long id)    { sleep(400); return 3; }                        // gọi DB khác\n    static String weather()         { sleep(200); return \"rain\"; }                   // gọi API ngoài\n    static String weatherBroken()   { sleep(100); throw new IllegalStateException(\"weather API 503\"); }\n\n    public static void main(String[] args) {\n        long t0 = System.nanoTime();\n        String s1 = lab(1) + \", \" + bookings(1) + \" bookings, \" + weather();\n        System.out.printf(\"sequential: %s — %d ms%n\", s1, (System.nanoTime() - t0) / 1_000_000);\n\n        ExecutorService io = Executors.newFixedThreadPool(8);\n        t0 = System.nanoTime();\n        CompletableFuture<String> fLab = CompletableFuture.supplyAsync(() -> lab(1), io);\n        CompletableFuture<Integer> fCount = CompletableFuture.supplyAsync(() -> bookings(1), io);\n        CompletableFuture<String> fWeather = CompletableFuture.supplyAsync(Cf::weather, io);\n        String s2 = fLab.thenCombine(fCount, (l, c) -> l + \", \" + c + \" bookings\")\n                        .thenCombine(fWeather, (x, w) -> x + \", \" + w)\n                        .join();\n        System.out.printf(\"parallel:   %s — %d ms%n\", s2, (System.nanoTime() - t0) / 1_000_000);\n\n        // Một nguồn lỗi: dùng giá trị dự phòng thay vì làm hỏng cả trang\n        String s3 = CompletableFuture.supplyAsync(Cf::weatherBroken, io)\n            .exceptionally(ex -> \"weather unavailable (\" + ex.getCause().getMessage() + \")\")\n            .join();\n        System.out.println(\"fallback:   \" + s3);\n\n        // Đặt hạn chót\n        try {\n            CompletableFuture.supplyAsync(() -> { sleep(2_000); return \"slow\"; }, io)\n                .orTimeout(500, TimeUnit.MILLISECONDS).join();\n        } catch (CompletionException e) { System.out.println(\"orTimeout:  \" + e.getCause()); }\n\n        // thenApply chạy ở đâu? Không truyền executor ⇒ common pool\n        CompletableFuture.supplyAsync(() -> Thread.currentThread().getName())\n            .thenAccept(n -> System.out.println(\"default executor: \" + n)).join();\n        io.shutdown();\n    }\n}");
const OUT23_CF = out("$ java Cf.java\nsequential: Lab AI, 3 bookings, rain — 905 ms\nparallel:   Lab AI, 3 bookings, rain — 404 ms\nfallback:   weather unavailable (weather API 503)\norTimeout:  java.util.concurrent.TimeoutException\ndefault executor: ForkJoinPool.commonPool-worker-1");
const MA23_CTRL = java("package com.cuongthai.labflow;\n\nimport java.util.concurrent.atomic.AtomicInteger;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.PostMapping;\nimport org.springframework.web.bind.annotation.RequestParam;\nimport org.springframework.web.bind.annotation.RestController;\n\n@RestController\npublic class ThreadController {\n\n    /** Luồng nào đang phục vụ request này? */\n    @GetMapping(\"/who\")\n    String who() {\n        return Thread.currentThread().toString() + \"\\n\";\n    }\n\n    /** Giả lập một việc chờ I/O (gọi DB/API chậm) mất ms mili giây. */\n    @GetMapping(\"/slow\")\n    String slow(@RequestParam(defaultValue = \"100\") long ms) throws InterruptedException {\n        Thread.sleep(ms);\n        return Thread.currentThread().getName() + \"\\n\";\n    }\n}");
const OUT23_WHO = out("$ curl -s localhost:8080/who; curl -s localhost:8080/who\nThread[#23,http-nio-8080-exec-2,5,main]\nThread[#24,http-nio-8080-exec-3,5,main]");
const OUT23_LOADP = out("$ java Load.java /slow?ms=1000 1000        # 1000 concurrent requests, each waits 1 s on the server\n# platform threads: server.tomcat.threads.max=200 (default), accept-count=2000\n1000 requests in 5284 ms | p50 3159 ms, max 5272 ms | distinct server threads: 200\n1000 requests in 5122 ms | p50 2989 ms, max 4986 ms | distinct server threads: 200\n1000 requests in 5206 ms | p50 3061 ms, max 5025 ms | distinct server threads: 200");

const L23_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Threads, ExecutorService and CompletableFuture</h2>
<p class="lead">Node.js runs your JavaScript on one thread and hides waiting behind an event loop. A Spring Boot server does the opposite: by default every HTTP request gets its <em>own</em> thread from Tomcat's pool of up to 200, and your code simply blocks while it waits for the database. To write correct Spring code — and to answer half of the "Java core" interview — you need to know what a thread is, why we never create them by hand in a server, how a pool queues work, and how <code>CompletableFuture</code> runs three slow calls at once. Everything below runs for real, including 1 000 requests fired at a real Spring Boot 4 app.</p>

<h3>A thread is a separate path of execution</h3>
<p>A process (one <code>java</code> command) owns memory; inside it, each <strong>thread</strong> has its own call stack and runs code independently, sharing the heap with the others. In Java 21 the classic <code>Thread</code> is a <strong>platform thread</strong>: a thin wrapper over one operating-system thread.</p>
${MA23_THREADS}
${OUT23_THREADS}
<ul>
  <li><code>run()</code> is just a method call — it ran on <code>main</code>. Only <code>start()</code> asks the OS for a new thread. Mixing them up is a classic interview trap.</li>
  <li><code>join()</code> waits for a thread to finish.</li>
  <li>An "idle" JVM already has 6 Java threads (main, Reference Handler, Finalizer, Signal Dispatcher, …) plus GC and JIT threads you do not see here.</li>
  <li>Starting and joining 10 000 platform threads took ≈ 3,5 s: each one costs a system call, kernel bookkeeping and a reserved stack (1 MB by default on 64-bit Linux, <code>-Xss</code>). That is why servers <strong>reuse</strong> threads in a pool instead of creating one per task.</li>
</ul>

<h3>ExecutorService: a pool of reusable threads and a queue of work</h3>
${MA23_POOL}
${OUT23_POOL}
<div class="kv-grid">
  <div class="kv"><span class="k">newFixedThreadPool(4)</span><span class="v">Four threads, an unbounded queue. Twelve 200 ms tasks ran in three waves: 600 ms. Thread names repeat — <code>pool-1-thread-1</code> handled labs 1, 7 and 11.</span></div>
  <div class="kv"><span class="k">submit(Callable) → Future</span><span class="v">A <code>Future</code> is a receipt for a result that is not ready yet. <code>get()</code> blocks until it is.</span></div>
  <div class="kv"><span class="k">get(timeout)</span><span class="v">Never wait forever on a remote call. After 300 ms we gave up and <code>cancel(true)</code> interrupted the sleeping task.</span></div>
  <div class="kv"><span class="k">ExecutionException</span><span class="v">An exception inside a task does not crash anything; it is stored and rethrown, wrapped, when you call <code>get()</code>. If you never call <code>get()</code>, the error disappears silently.</span></div>
  <div class="kv"><span class="k">shutdown / awaitTermination</span><span class="v">Stop accepting work, finish what is queued, then let the threads die.</span></div>
</div>
<p>Forget <code>shutdown()</code> and the pool's non-daemon threads keep the JVM alive after <code>main</code> ends — <code>timeout</code> had to kill it (exit code 124):</p>
${MA23_NOSHUT}
${OUT23_NOSHUT}
<div class="pitfall"><p><strong>Trap — <code>Executors.newFixedThreadPool</code> / <code>newCachedThreadPool</code> in production.</strong> The fixed pool's queue is unbounded: if work arrives faster than it is done, the queue grows until <code>OutOfMemoryError</code> (lesson 2.6). The cached pool has no thread limit: a traffic spike creates thousands of threads. In Spring you rarely create pools yourself — Boot provides a configured <code>ThreadPoolTaskExecutor</code> for <code>@Async</code> (Chapter 14) with <code>spring.task.execution.pool.*</code> properties and a bounded queue.</p></div>

<h3>CompletableFuture: three slow calls in the time of the slowest</h3>
<p>A "lab detail" page needs the lab (300 ms), its booking count (400 ms) and the weather (200 ms). Called one after another they cost the sum; started together they cost the maximum.</p>
${MA23_CF}
${OUT23_CF}
<ul>
  <li><code>supplyAsync(supplier, executor)</code> starts work on another thread and returns at once.</li>
  <li><code>thenCombine</code> waits for two futures and merges their results; <code>thenApply</code> transforms one; <code>thenCompose</code> chains a call that itself returns a future; <code>allOf</code> waits for many.</li>
  <li><code>exceptionally</code> turns a failure into a fallback value — the page shows "weather unavailable" instead of a 500.</li>
  <li><code>orTimeout</code> (Java 9) puts a deadline on the whole chain.</li>
  <li>Without an executor argument, async stages run on the <strong>common pool</strong> — the same few threads used by parallel streams (lesson 2.1). For I/O, always pass your own executor (or, from lesson 2.5, a virtual-thread executor).</li>
</ul>
<div class="callout"><strong>Compared with Node.js.</strong> <code>CompletableFuture</code> is Java's <code>Promise</code>: <code>thenApply</code> ≈ <code>.then(x =&gt; …)</code>, <code>thenCompose</code> ≈ <code>.then(x =&gt; anotherPromise)</code>, <code>allOf</code> ≈ <code>Promise.all</code>, <code>exceptionally</code> ≈ <code>.catch</code>. The difference: a JS promise's callbacks run on the single event-loop thread; a CompletableFuture's stages run on threads of an executor, so they can run truly in parallel — and can race on shared data (lesson 2.4).</div>

<h3>Inside Spring Boot: one request = one Tomcat thread</h3>
<p>A minimal controller (the full project is in the lab folder of this chapter) that reports which thread serves it, and a <code>/slow</code> endpoint that waits like a slow database query:</p>
${MA23_CTRL}
${OUT23_WHO}
<p>Two requests, two threads from Tomcat's pool: <code>http-nio-8080-exec-2</code>, <code>exec-3</code>. Now fire <strong>1 000 requests at the same moment</strong>, each waiting 1 s on the server (load generator: <code>Load.java</code> in the lab folder, one TCP connection per request):</p>
${OUT23_LOADP}
<p>Exactly <strong>200 distinct threads</strong> served the requests — <code>server.tomcat.threads.max</code> defaults to 200. 1 000 requests ÷ 200 threads = 5 waves of 1 s ⇒ ≈ 5,2 s; the median client waited 3 s for a request that needs 1 s of work. That is the "thread-per-request" model's ceiling: while a thread sleeps waiting for I/O it does nothing, yet it cannot serve anyone else. (We raised <code>server.tomcat.accept-count</code> from 100 to 2 000 so that the operating system's connection queue would not drop connections and blur the measurement — in production a reverse proxy usually sits in front.)</p>
<p>Two ways out: more threads (memory-expensive, lesson 2.5 shows 10 000 platform threads) or threads that cost almost nothing while they wait — <strong>virtual threads</strong>, lesson 2.5, where the same test finishes in ≈ 1,3 s.</p>

<h3>On the job — the slow dependency that takes the whole app down</h3>
<p>A typical incident: an external payment or SMS API starts answering in 30 s instead of 300 ms. Each request that calls it holds a Tomcat thread for 30 s; within seconds all 200 threads are stuck there, and even <code>/health</code> and the login page time out — the app looks "down" although CPU is idle. The defences, all covered later in the course: a <strong>timeout on every outbound call</strong> (as with <code>get(300 ms)</code> and <code>orTimeout</code> above), a separate bounded pool for the risky call (a "bulkhead"), and a circuit breaker that fails fast while the dependency is sick.</p>

<h3>Everyday picture</h3>
<p>A thread pool is a restaurant with 200 waiters. Each waiter takes one table, walks the order to the kitchen and <em>stands there waiting</em> until the dish is ready. If the kitchen is slow, all 200 waiters end up standing in the kitchen, and new customers wait at the door even though the waiters are not busy doing anything. <code>CompletableFuture</code> is a waiter who orders the soup, the main course and the drink at three counters at once instead of one after another.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Difference between <code>start()</code> and <code>run()</code>?"</strong> — <code>start()</code> creates a new thread that then calls <code>run()</code>; calling <code>run()</code> directly executes it on the current thread.</li>
  <li><strong>"Runnable vs Callable?"</strong> — <code>Runnable.run()</code> returns nothing and cannot throw checked exceptions; <code>Callable.call()</code> returns a value and may throw. <code>submit(Callable)</code> gives a <code>Future</code> of that value.</li>
  <li><strong>"Why use a thread pool instead of new Thread()?"</strong> — Creating platform threads is expensive (system call, stack memory); a pool reuses a bounded number of threads and queues the rest, protecting the machine from overload.</li>
  <li><strong>"How many requests can Spring Boot handle concurrently?"</strong> — With the default Tomcat settings, 200 at a time (<code>server.tomcat.threads.max</code>); further connections wait in the queue up to <code>max-connections</code> (8 192) and <code>accept-count</code> (100). With virtual threads enabled, the limit becomes memory and downstream resources such as the DB pool.</li>
  <li><strong>"CompletableFuture vs JavaScript Promise?"</strong> — Same composition model (then/all/catch); but Java stages run on executor threads in parallel, so shared state needs synchronisation, and you should pass an executor for I/O instead of using the common pool.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Copy <code>Cf.java</code>. Add a fourth call <code>equipment()</code> (250 ms) and combine all four with <code>CompletableFuture.allOf</code>; the total must stay ≈ 400 ms.</li>
  <li>Make <code>bookings()</code> throw. Return the page with <code>"bookings: unknown"</code> instead of failing — the other three values must still appear.</li>
  <li>With <code>bookings()</code> working again, change the executor to <code>Executors.newFixedThreadPool(2)</code> and predict the new total before you run it. Explain the number.</li>
</ol>
<p><strong>Done when:</strong> step 1 prints four values in ≈ 400 ms, step 2 prints <code>bookings: unknown</code> with the other values, and your prediction for step 3 is within 100 ms of the measurement.</p></div>
${giai('Show one solution', `${java(`
CompletableFuture<String> fLab = CompletableFuture.supplyAsync(() -> lab(1), io);
CompletableFuture<String> fCount = CompletableFuture.supplyAsync(() -> "bookings: " + bookings(1), io)
        .exceptionally(ex -> "bookings: unknown");
CompletableFuture<String> fWeather = CompletableFuture.supplyAsync(Cf::weather, io);
CompletableFuture<String> fEquip = CompletableFuture.supplyAsync(Cf::equipment, io);

CompletableFuture.allOf(fLab, fCount, fWeather, fEquip).join();   // waits for all four
String page = String.join(", ", fLab.join(), fCount.join(), fWeather.join(), fEquip.join());`)}
<p>With 2 threads and tasks of 300, 400, 200 and 250 ms: the two threads start lab (300) and bookings (400); at 300 ms the first thread takes weather (ends at 500), at 400 ms the second takes equipment (ends at 650) ⇒ ≈ 650 ms. A pool smaller than the number of independent waits turns parallel work back into partly sequential work.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Platform thread</span><span class="v">A <code>java.lang.Thread</code> backed one-to-one by an operating-system thread.</span></div>
  <div class="kv"><span class="k">Runnable / Callable</span><span class="v">A task without / with a return value (Callable may throw checked exceptions).</span></div>
  <div class="kv"><span class="k">ExecutorService</span><span class="v">A pool of threads plus a work queue; you submit tasks instead of creating threads.</span></div>
  <div class="kv"><span class="k">Future</span><span class="v">A handle to a result that will be available later; <code>get()</code> blocks.</span></div>
  <div class="kv"><span class="k">CompletableFuture</span><span class="v">A Future you can compose (thenApply, thenCombine, allOf, exceptionally) without blocking.</span></div>
  <div class="kv"><span class="k">Thread-per-request</span><span class="v">The servlet model: each HTTP request is handled start to finish by one thread from the server's pool.</span></div>
  <div class="kv"><span class="k">server.tomcat.threads.max</span><span class="v">Maximum Tomcat worker threads in Spring Boot; default 200.</span></div>
  <div class="kv"><span class="k">Bulkhead</span><span class="v">Isolating a risky dependency in its own bounded pool so it cannot exhaust the threads everyone else needs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>start()</code> creates a thread; platform threads are expensive, so servers pool them.</li>
  <li><code>ExecutorService</code> + <code>Future</code>: submit, get with a timeout, always shut down; exceptions come back wrapped.</li>
  <li><code>CompletableFuture</code> runs independent waits in parallel; pass your own executor for I/O; add fallbacks and timeouts.</li>
  <li>Spring MVC on Tomcat = one thread per request, 200 by default; slow I/O fills the pool and requests queue.</li>
  <li>Every outbound call needs a timeout.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html', '📄', 'CompletableFuture (Java 21)', 'All composition methods and the rules for which thread runs each stage.')}
${tl('https://docs.spring.io/spring-boot/appendix/application-properties/index.html#appendix.application-properties.server', '🌱', 'Spring Boot — server.tomcat.* properties', 'threads.max, accept-count, max-connections and their defaults.')}

<h3>Sources</h3>
<ul>
  <li>Spring Boot application properties: <code>server.tomcat.threads.max</code> = 200, <code>server.tomcat.accept-count</code> = 100, <code>server.tomcat.max-connections</code> = 8192: <a href="https://docs.spring.io/spring-boot/appendix/application-properties/index.html" target="_blank" rel="noopener">docs.spring.io/spring-boot</a></li>
  <li>Brian Goetz et al., <em>Java Concurrency in Practice</em> (2006), ch. 6–8 (task execution, thread pools).</li>
  <li>Outputs above: Spring Boot 4.1.2 / Tomcat 11 on Temurin 21.0.13 (JRE image), Java demos on Temurin 21.0.12.1, app container limited to 4 CPUs and 1 GB — run on 18/11/2026.</li>
</ul>
</div>
`;

const L23_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Thread, ExecutorService và CompletableFuture</h2>
<p class="lead">Node.js chạy JavaScript của bạn trên một luồng và giấu việc chờ sau vòng lặp sự kiện. Server Spring Boot làm ngược lại: mặc định mỗi request HTTP được một luồng <em>riêng</em> lấy từ pool tối đa 200 luồng của Tomcat, và mã của bạn cứ thế chặn trong lúc chờ cơ sở dữ liệu. Muốn viết mã Spring đúng — và trả lời được một nửa vòng phỏng vấn "Java core" — bạn cần biết luồng là gì, vì sao server không bao giờ tự tay tạo luồng, pool xếp hàng việc ra sao, và <code>CompletableFuture</code> chạy ba lời gọi chậm cùng lúc thế nào. Mọi thứ dưới đây chạy thật, kể cả 1 000 request bắn vào một ứng dụng Spring Boot 4 thật.</p>

<h3>Luồng là một mạch thực thi riêng</h3>
<p>Một tiến trình (một lệnh <code>java</code>) sở hữu bộ nhớ; bên trong, mỗi <strong>luồng</strong> có call stack riêng và chạy mã độc lập, dùng chung heap với các luồng khác. Trong Java 21, <code>Thread</code> cổ điển là <strong>luồng nền tảng</strong> (platform thread): một lớp bọc mỏng quanh đúng một luồng của hệ điều hành.</p>
${MA23_THREADS}
${OUT23_THREADS}
<ul>
  <li><code>run()</code> chỉ là gọi phương thức — nó chạy trên <code>main</code>. Chỉ <code>start()</code> mới xin hệ điều hành một luồng mới. Nhầm hai cái là bẫy phỏng vấn kinh điển.</li>
  <li><code>join()</code> chờ một luồng chạy xong.</li>
  <li>JVM "rảnh" đã có sẵn 6 luồng Java (main, Reference Handler, Finalizer, Signal Dispatcher, …) cộng các luồng GC và JIT không hiện ở đây.</li>
  <li>Tạo rồi chờ 10 000 luồng nền tảng mất ≈ 3,5 giây: mỗi luồng tốn một lời gọi hệ thống, sổ sách của nhân và một stack giữ sẵn (mặc định 1 MB trên Linux 64 bit, <code>-Xss</code>). Vì thế server <strong>tái dùng</strong> luồng trong pool thay vì tạo một luồng cho mỗi việc.</li>
</ul>

<h3>ExecutorService: một pool luồng tái dùng và một hàng đợi việc</h3>
${MA23_POOL}
${OUT23_POOL}
<div class="kv-grid">
  <div class="kv"><span class="k">newFixedThreadPool(4)</span><span class="v">Bốn luồng, hàng đợi không giới hạn. Mười hai việc 200 ms chạy thành ba đợt: 600 ms. Tên luồng lặp lại — <code>pool-1-thread-1</code> xử lý lab 1, 7 và 11.</span></div>
  <div class="kv"><span class="k">submit(Callable) → Future</span><span class="v"><code>Future</code> là biên nhận cho một kết quả chưa có. <code>get()</code> chặn tới khi có.</span></div>
  <div class="kv"><span class="k">get(timeout)</span><span class="v">Đừng bao giờ chờ mãi một lời gọi từ xa. Sau 300 ms ta bỏ cuộc và <code>cancel(true)</code> ngắt việc đang ngủ.</span></div>
  <div class="kv"><span class="k">ExecutionException</span><span class="v">Exception trong việc không làm sập gì cả; nó được cất lại và ném ra, có bọc, khi bạn gọi <code>get()</code>. Không bao giờ gọi <code>get()</code> thì lỗi biến mất trong im lặng.</span></div>
  <div class="kv"><span class="k">shutdown / awaitTermination</span><span class="v">Thôi nhận việc mới, làm nốt việc đã xếp, rồi cho các luồng kết thúc.</span></div>
</div>
<p>Quên <code>shutdown()</code> thì các luồng không phải daemon của pool giữ JVM sống sau khi <code>main</code> kết thúc — <code>timeout</code> phải giết nó (mã thoát 124):</p>
${MA23_NOSHUT}
${OUT23_NOSHUT}
<div class="pitfall"><p><strong>Bẫy — <code>Executors.newFixedThreadPool</code> / <code>newCachedThreadPool</code> trên production.</strong> Hàng đợi của pool cố định không giới hạn: việc tới nhanh hơn việc xong thì hàng đợi phình tới <code>OutOfMemoryError</code> (bài 2.6). Pool cached không giới hạn số luồng: một đợt tăng tải tạo ra hàng nghìn luồng. Trong Spring bạn hiếm khi tự tạo pool — Boot cung cấp sẵn <code>ThreadPoolTaskExecutor</code> đã cấu hình cho <code>@Async</code> (Chương 14), chỉnh bằng các thuộc tính <code>spring.task.execution.pool.*</code>, có hàng đợi giới hạn.</p></div>

<h3>CompletableFuture: ba lời gọi chậm trong thời gian của lời gọi chậm nhất</h3>
<p>Trang "chi tiết lab" cần thông tin lab (300 ms), số lượt đặt (400 ms) và thời tiết (200 ms). Gọi lần lượt thì tốn tổng; khởi động cùng lúc thì chỉ tốn cái lớn nhất.</p>
${MA23_CF}
${OUT23_CF}
<ul>
  <li><code>supplyAsync(supplier, executor)</code> khởi động việc trên luồng khác và trả về ngay.</li>
  <li><code>thenCombine</code> chờ hai future và gộp kết quả; <code>thenApply</code> biến đổi một kết quả; <code>thenCompose</code> nối một lời gọi mà bản thân nó trả future; <code>allOf</code> chờ nhiều future.</li>
  <li><code>exceptionally</code> biến thất bại thành giá trị dự phòng — trang hiện "weather unavailable" thay vì lỗi 500.</li>
  <li><code>orTimeout</code> (Java 9) đặt hạn chót cho cả chuỗi.</li>
  <li>Không truyền executor thì các bước bất đồng bộ chạy trên <strong>common pool</strong> — chính vài luồng mà parallel stream dùng (bài 2.1). Với I/O, luôn truyền executor của riêng bạn (hoặc, từ bài 2.5, executor virtual thread).</li>
</ul>
<div class="callout"><strong>So với Node.js.</strong> <code>CompletableFuture</code> là <code>Promise</code> của Java: <code>thenApply</code> ≈ <code>.then(x =&gt; …)</code>, <code>thenCompose</code> ≈ <code>.then(x =&gt; mộtPromiseKhác)</code>, <code>allOf</code> ≈ <code>Promise.all</code>, <code>exceptionally</code> ≈ <code>.catch</code>. Khác biệt: callback của promise JS chạy trên đúng một luồng vòng lặp sự kiện; các bước của CompletableFuture chạy trên luồng của executor, nên chạy song song thật — và có thể tranh chấp dữ liệu dùng chung (bài 2.4).</div>

<h3>Bên trong Spring Boot: một request = một luồng Tomcat</h3>
<p>Một controller tối giản (cả dự án nằm trong thư mục lab của chương) cho biết luồng nào đang phục vụ nó, và endpoint <code>/slow</code> chờ giống một truy vấn cơ sở dữ liệu chậm:</p>
${MA23_CTRL}
${OUT23_WHO}
<p>Hai request, hai luồng trong pool của Tomcat: <code>http-nio-8080-exec-2</code>, <code>exec-3</code>. Giờ bắn <strong>1 000 request cùng một lúc</strong>, mỗi request chờ 1 giây trên server (máy bắn tải: <code>Load.java</code> trong thư mục lab, mỗi request một kết nối TCP):</p>
${OUT23_LOADP}
<p>Đúng <strong>200 luồng khác nhau</strong> đã phục vụ — <code>server.tomcat.threads.max</code> mặc định là 200. 1 000 request ÷ 200 luồng = 5 đợt 1 giây ⇒ ≈ 5,2 giây; khách ở giữa phải chờ 3 giây cho một request chỉ cần 1 giây làm việc. Đó là trần của mô hình "mỗi request một luồng": luồng ngủ chờ I/O thì không làm gì, nhưng cũng không phục vụ được ai khác. (Ta nâng <code>server.tomcat.accept-count</code> từ 100 lên 2 000 để hàng đợi kết nối của hệ điều hành không làm rơi kết nối, kẻo số đo bị nhiễu — trên production thường có reverse proxy đứng trước.)</p>
<p>Hai lối ra: thêm luồng (tốn bộ nhớ, bài 2.5 cho thấy 10 000 luồng nền tảng) hoặc dùng luồng gần như không tốn gì khi chờ — <strong>virtual thread</strong>, bài 2.5, ở đó cùng phép thử xong trong ≈ 1,3 giây.</p>

<h3>Đi làm — một phụ thuộc chậm kéo sập cả ứng dụng</h3>
<p>Một sự cố điển hình: API thanh toán hay SMS bên ngoài bỗng trả lời sau 30 giây thay vì 300 ms. Mỗi request gọi nó giữ một luồng Tomcat 30 giây; vài giây sau cả 200 luồng kẹt ở đó, đến <code>/health</code> và trang đăng nhập cũng hết giờ — ứng dụng trông như "chết" dù CPU đang rảnh. Cách phòng, đều có ở phần sau của khoá: <strong>hết giờ cho mọi lời gọi ra ngoài</strong> (như <code>get(300 ms)</code> và <code>orTimeout</code> ở trên), một pool giới hạn riêng cho lời gọi rủi ro ("vách ngăn" — bulkhead), và cầu dao (circuit breaker) trả lỗi ngay khi phụ thuộc đang ốm.</p>

<h3>Hình ảnh đời thường</h3>
<p>Pool luồng là nhà hàng có 200 người phục vụ. Mỗi người nhận một bàn, mang đơn vào bếp rồi <em>đứng đó chờ</em> tới khi món xong. Bếp chậm thì cả 200 người đứng chật trong bếp, khách mới chờ ở cửa dù chẳng người phục vụ nào thật sự đang làm gì. <code>CompletableFuture</code> là người phục vụ gọi súp, món chính và đồ uống ở ba quầy cùng lúc thay vì lần lượt từng quầy.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"<code>start()</code> khác <code>run()</code> thế nào?"</strong> — <code>start()</code> tạo luồng mới rồi luồng đó gọi <code>run()</code>; gọi thẳng <code>run()</code> thì chạy trên luồng hiện tại.</li>
  <li><strong>"Runnable khác Callable?"</strong> — <code>Runnable.run()</code> không trả gì và không ném được checked exception; <code>Callable.call()</code> trả giá trị và được phép ném. <code>submit(Callable)</code> cho <code>Future</code> của giá trị đó.</li>
  <li><strong>"Vì sao dùng pool luồng thay vì new Thread()?"</strong> — Tạo luồng nền tảng đắt (lời gọi hệ thống, bộ nhớ stack); pool tái dùng một số luồng có giới hạn và xếp hàng phần còn lại, bảo vệ máy khỏi quá tải.</li>
  <li><strong>"Spring Boot xử lý đồng thời được bao nhiêu request?"</strong> — Cấu hình Tomcat mặc định: 200 cùng lúc (<code>server.tomcat.threads.max</code>); kết nối thêm chờ trong hàng tới <code>max-connections</code> (8 192) và <code>accept-count</code> (100). Bật virtual thread thì giới hạn chuyển sang bộ nhớ và tài nguyên phía sau như pool kết nối DB.</li>
  <li><strong>"CompletableFuture so với Promise của JavaScript?"</strong> — Cùng mô hình ghép (then/all/catch); nhưng các bước Java chạy song song trên luồng executor, nên trạng thái dùng chung cần đồng bộ, và với I/O nên truyền executor thay vì dùng common pool.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Chép <code>Cf.java</code>. Thêm lời gọi thứ tư <code>equipment()</code> (250 ms) và gộp cả bốn bằng <code>CompletableFuture.allOf</code>; tổng vẫn phải ≈ 400 ms.</li>
  <li>Cho <code>bookings()</code> ném lỗi. Trả trang với <code>"bookings: unknown"</code> thay vì thất bại — ba giá trị kia vẫn phải hiện.</li>
  <li>Cho <code>bookings()</code> chạy bình thường lại, đổi executor thành <code>Executors.newFixedThreadPool(2)</code> và đoán tổng thời gian mới trước khi chạy. Giải thích con số.</li>
</ol>
<p><strong>Đạt khi:</strong> bước 1 in bốn giá trị trong ≈ 400 ms, bước 2 in <code>bookings: unknown</code> cùng các giá trị khác, và dự đoán ở bước 3 lệch số đo không quá 100 ms.</p></div>
${giai('Xem một lời giải', `${java(`
CompletableFuture<String> fLab = CompletableFuture.supplyAsync(() -> lab(1), io);
CompletableFuture<String> fCount = CompletableFuture.supplyAsync(() -> "bookings: " + bookings(1), io)
        .exceptionally(ex -> "bookings: unknown");
CompletableFuture<String> fWeather = CompletableFuture.supplyAsync(Cf::weather, io);
CompletableFuture<String> fEquip = CompletableFuture.supplyAsync(Cf::equipment, io);

CompletableFuture.allOf(fLab, fCount, fWeather, fEquip).join();   // chờ cả bốn
String page = String.join(", ", fLab.join(), fCount.join(), fWeather.join(), fEquip.join());`)}
<p>Với 2 luồng và các việc 300, 400, 200, 250 ms: hai luồng bắt đầu lab (300) và bookings (400); ở mốc 300 ms luồng đầu nhận weather (xong ở 500), ở mốc 400 ms luồng thứ hai nhận equipment (xong ở 650) ⇒ ≈ 650 ms. Pool nhỏ hơn số việc chờ độc lập thì việc song song lại thành tuần tự một phần.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Luồng nền tảng (platform thread)</span><span class="v"><code>java.lang.Thread</code> gắn một-một với một luồng hệ điều hành.</span></div>
  <div class="kv"><span class="k">Runnable / Callable</span><span class="v">Việc không có / có giá trị trả về (Callable được ném checked exception).</span></div>
  <div class="kv"><span class="k">ExecutorService</span><span class="v">Pool luồng kèm hàng đợi việc; bạn nộp việc thay vì tự tạo luồng.</span></div>
  <div class="kv"><span class="k">Future</span><span class="v">Tay cầm tới một kết quả sẽ có sau; <code>get()</code> chặn.</span></div>
  <div class="kv"><span class="k">CompletableFuture</span><span class="v">Future ghép được (thenApply, thenCombine, allOf, exceptionally) mà không chặn.</span></div>
  <div class="kv"><span class="k">Mỗi request một luồng</span><span class="v">Mô hình servlet: mỗi request HTTP do một luồng trong pool của server xử lý từ đầu tới cuối.</span></div>
  <div class="kv"><span class="k">server.tomcat.threads.max</span><span class="v">Số luồng thợ Tomcat tối đa trong Spring Boot; mặc định 200.</span></div>
  <div class="kv"><span class="k">Vách ngăn (bulkhead)</span><span class="v">Cách ly một phụ thuộc rủi ro vào pool giới hạn riêng để nó không vét cạn luồng mà mọi phần khác cần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>start()</code> tạo luồng; luồng nền tảng đắt nên server dùng pool.</li>
  <li><code>ExecutorService</code> + <code>Future</code>: nộp việc, get có hết giờ, luôn shutdown; exception trả về dưới dạng bọc.</li>
  <li><code>CompletableFuture</code> chạy song song các việc chờ độc lập; truyền executor riêng cho I/O; thêm dự phòng và hết giờ.</li>
  <li>Spring MVC trên Tomcat = mỗi request một luồng, mặc định 200; I/O chậm làm đầy pool và request phải xếp hàng.</li>
  <li>Mọi lời gọi ra ngoài đều cần hết giờ.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html', '📄', 'CompletableFuture (Java 21)', 'Mọi phương thức ghép và quy tắc bước nào chạy trên luồng nào.')}
${tl('https://docs.spring.io/spring-boot/appendix/application-properties/index.html#appendix.application-properties.server', '🌱', 'Spring Boot — các thuộc tính server.tomcat.*', 'threads.max, accept-count, max-connections và giá trị mặc định.')}

<h3>Nguồn</h3>
<ul>
  <li>Thuộc tính Spring Boot: <code>server.tomcat.threads.max</code> = 200, <code>server.tomcat.accept-count</code> = 100, <code>server.tomcat.max-connections</code> = 8192: <a href="https://docs.spring.io/spring-boot/appendix/application-properties/index.html" target="_blank" rel="noopener">docs.spring.io/spring-boot</a></li>
  <li>Brian Goetz và cộng sự, <em>Java Concurrency in Practice</em> (2006), chương 6–8 (thực thi việc, pool luồng).</li>
  <li>Output phía trên: Spring Boot 4.1.2 / Tomcat 11 trên Temurin 21.0.13 (ảnh JRE), demo Java trên Temurin 21.0.12.1, container ứng dụng giới hạn 4 CPU và 1 GB — chạy ngày 18/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 2.4 =====
const MA24_COUNTER = java("import java.util.concurrent.atomic.*;\n\npublic class Counter {\n    static int plain = 0;\n    static int locked = 0;\n    static final Object LOCK = new Object();\n    static final AtomicInteger atomic = new AtomicInteger();\n    static final LongAdder adder = new LongAdder();\n\n    static long run(Runnable inc) throws InterruptedException {\n        Thread[] ts = new Thread[4];\n        long t0 = System.nanoTime();\n        for (int i = 0; i < 4; i++) {\n            ts[i] = new Thread(() -> { for (int k = 0; k < 1_000_000; k++) inc.run(); });\n            ts[i].start();\n        }\n        for (Thread t : ts) t.join();\n        return (System.nanoTime() - t0) / 1_000_000;\n    }\n    public static void main(String[] args) throws InterruptedException {\n        System.out.println(\"4 threads x 1 000 000 increments, expected 4000000\");\n        long ms = run(() -> plain++);\n        System.out.printf(\"  plain++       = %,9d  (%d ms)%n\", plain, ms);\n        ms = run(() -> { synchronized (LOCK) { locked++; } });\n        System.out.printf(\"  synchronized  = %,9d  (%d ms)%n\", locked, ms);\n        ms = run(atomic::incrementAndGet);\n        System.out.printf(\"  AtomicInteger = %,9d  (%d ms)%n\", atomic.get(), ms);\n        ms = run(adder::increment);\n        System.out.printf(\"  LongAdder     = %,9d  (%d ms)%n\", adder.sum(), ms);\n    }\n}");
const OUT24_COUNTER = out("$ java Counter.java\n4 threads x 1 000 000 increments, expected 4000000\n  plain++       = 1,325,539  (10 ms)\n  synchronized  = 4,000,000  (142 ms)\n  AtomicInteger = 4,000,000  (65 ms)\n  LongAdder     = 4,000,000  (15 ms)");
const MA24_INC = java("public class Inc {\n    int count;\n    void inc() { count++; }\n}");
const OUT24_JAVAP = out("$ javac Inc.java && javap -c Inc\n  void inc();\n    Code:\n       0: aload_0\n       1: dup\n       2: getfield      #7                  // Field count:I\n       5: iconst_1\n       6: iadd\n       7: putfield      #7                  // Field count:I\n      10: return");
const MA24_MAP = java("import java.util.*;\nimport java.util.concurrent.*;\n\npublic class MapRace {\n    static void hammer(Runnable body) throws InterruptedException {\n        try (ExecutorService ex = Executors.newFixedThreadPool(4)) {\n            for (int t = 0; t < 4; t++) ex.submit(() -> { for (int i = 0; i < 100_000; i++) body.run(); });\n        }                                                   // close() = shutdown + chờ xong (Java 19+)\n    }\n    public static void main(String[] args) throws InterruptedException {\n        String[] labs = {\"Lab AI\", \"Lab IoT\", \"Lab Mạng\", \"Lab Robot\"};\n        System.out.println(\"4 threads x 100 000 bookings each over 4 labs, expected total 400000\");\n\n        Map<String, Integer> hm = new HashMap<>();\n        hammer(() -> hm.merge(labs[ThreadLocalRandom.current().nextInt(4)], 1, Integer::sum));\n        System.out.println(\"  HashMap.merge                 total = \" + hm.values().stream().mapToInt(i -> i).sum());\n\n        Map<String, Integer> chm1 = new ConcurrentHashMap<>();\n        hammer(() -> {                                      // check-then-act: hai thao tác an toàn ≠ một thao tác an toàn\n            String k = labs[ThreadLocalRandom.current().nextInt(4)];\n            Integer old = chm1.get(k);\n            chm1.put(k, old == null ? 1 : old + 1);\n        });\n        System.out.println(\"  ConcurrentHashMap get+put     total = \" + chm1.values().stream().mapToInt(i -> i).sum());\n\n        Map<String, Integer> chm2 = new ConcurrentHashMap<>();\n        hammer(() -> chm2.merge(labs[ThreadLocalRandom.current().nextInt(4)], 1, Integer::sum));\n        System.out.println(\"  ConcurrentHashMap.merge       total = \" + chm2.values().stream().mapToInt(i -> i).sum());\n    }\n}");
const OUT24_MAP = out("$ java MapRace.java\n4 threads x 100 000 bookings each over 4 labs, expected total 400000\n  HashMap.merge                 total = 248477\n  ConcurrentHashMap get+put     total = 259052\n  ConcurrentHashMap.merge       total = 400000");
const MA24_VIS = java("public class Visibility {\n    static boolean stop = false;            // thử lại với: static volatile boolean stop\n    public static void main(String[] args) throws InterruptedException {\n        Thread worker = new Thread(() -> {\n            long spins = 0;\n            while (!stop) spins++;           // JIT được phép đọc stop một lần rồi lặp mãi\n            System.out.println(\"worker saw stop=true after \" + spins + \" spins\");\n        });\n        worker.start();\n        Thread.sleep(500);\n        stop = true;\n        System.out.println(\"main set stop=true\");\n        worker.join(2_000);\n        System.out.println(worker.isAlive() ? \"worker is STILL running after 2 s\" : \"worker finished\");\n        System.exit(0);\n    }\n}");
const OUT24_VIS = out("$ java Visibility.java\nmain set stop=true\nworker is STILL running after 2 s");
const OUT24_VISV = out("$ java VisibilityVolatile.java        # same code, field declared volatile\nmain set stop=true\nworker saw stop=true after 1594962122 spins\nworker finished");
const MA24_DL = java("public class Deadlock {\n    static final Object labA = new Object(), labB = new Object();\n\n    static void book(String who, Object first, Object second) {\n        synchronized (first) {\n            sleep(100);\n            synchronized (second) { System.out.println(who + \" booked both labs\"); }\n        }\n    }\n    static void sleep(long ms) { try { Thread.sleep(ms); } catch (InterruptedException e) {} }\n\n    public static void main(String[] args) {\n        new Thread(() -> book(\"an\", labA, labB), \"booking-an\").start();   // khoá A rồi B\n        new Thread(() -> book(\"binh\", labB, labA), \"booking-binh\").start(); // khoá B rồi A\n    }\n}");
const OUT24_DL = out("$ java Deadlock.java &        # hangs forever; in another terminal:\n$ jcmd <pid> Thread.print        # same as jstack <pid>\nFound one Java-level deadlock:\n=============================\n\"booking-an\":\n  waiting to lock monitor 0x00007fd0dc0019d0 (object 0x00000000e1843a28, a java.lang.Object),\n  which is held by \"booking-binh\"\n\n\"booking-binh\":\n  waiting to lock monitor 0x00007fd0e0001010 (object 0x00000000e1843a18, a java.lang.Object),\n  which is held by \"booking-an\"\n\nJava stack information for the threads listed above:\n===================================================\n\"booking-an\":\n\tat Deadlock.book(Deadlock.java:7)\n\t- waiting to lock <0x00000000e1843a28> (a java.lang.Object)\n\t- locked <0x00000000e1843a18> (a java.lang.Object)\n\tat Deadlock.lambda$main$0(Deadlock.java:13)\n\tat Deadlock$$Lambda/0x00007fd12814c208.run(Unknown Source)\n\tat java.lang.Thread.runWith(java.base@21.0.12.1/Thread.java:1596)\n\tat java.lang.Thread.run(java.base@21.0.12.1/Thread.java:1583)\n\"booking-binh\":\n\tat Deadlock.book(Deadlock.java:7)\n\t- waiting to lock <0x00000000e1843a18> (a java.lang.Object)\n\t- locked <0x00000000e1843a28> (a java.lang.Object)\n\tat Deadlock.lambda$main$1(Deadlock.java:14)\n\tat Deadlock$$Lambda/0x00007fd12814c428.run(Unknown Source)\n\tat java.lang.Thread.runWith(java.base@21.0.12.1/Thread.java:1596)\n\tat java.lang.Thread.run(java.base@21.0.12.1/Thread.java:1583)\n\nFound 1 deadlock.");
const MA24_LO = java("import java.util.concurrent.TimeUnit;\nimport java.util.concurrent.locks.ReentrantLock;\n\npublic class LockOrder {\n    record Lab(int id, ReentrantLock lock) {}\n    static final Lab A = new Lab(1, new ReentrantLock()), B = new Lab(2, new ReentrantLock());\n\n    // Cách 1: luôn khoá theo cùng một thứ tự (id nhỏ trước) ⇒ không thể vòng chờ\n    static void bookOrdered(String who, Lab x, Lab y) {\n        Lab first = x.id() < y.id() ? x : y, second = first == x ? y : x;\n        first.lock().lock();\n        try { sleep(100); second.lock().lock(); try { System.out.println(who + \" booked both labs (ordered)\"); } finally { second.lock().unlock(); } }\n        finally { first.lock().unlock(); }\n    }\n    // Cách 2: tryLock có hạn ⇒ bỏ cuộc thay vì treo vĩnh viễn\n    static void bookTry(String who, Lab x, Lab y) throws InterruptedException {\n        x.lock().lock();\n        try {\n            sleep(100);\n            if (y.lock().tryLock(300, TimeUnit.MILLISECONDS)) {\n                try { System.out.println(who + \" booked both labs (tryLock)\"); } finally { y.lock().unlock(); }\n            } else System.out.println(who + \" gave up after 300 ms -> retry later / return 409\");\n        } finally { x.lock().unlock(); }\n    }\n    static void sleep(long ms) { try { Thread.sleep(ms); } catch (InterruptedException e) {} }\n\n    public static void main(String[] args) throws Exception {\n        Thread t1 = new Thread(() -> bookOrdered(\"an\", A, B)), t2 = new Thread(() -> bookOrdered(\"binh\", B, A));\n        t1.start(); t2.start(); t1.join(); t2.join();\n        Thread t3 = new Thread(() -> { try { bookTry(\"an\", A, B); } catch (InterruptedException e) {} });\n        Thread t4 = new Thread(() -> { try { bookTry(\"binh\", B, A); } catch (InterruptedException e) {} });\n        t3.start(); t4.start(); t3.join(); t4.join();\n    }\n}");
const OUT24_LO = out("$ java LockOrder.java\nan booked both labs (ordered)\nbinh booked both labs (ordered)\nan gave up after 300 ms -> retry later / return 409\nbinh gave up after 300 ms -> retry later / return 409");
const MA24_SDF = java("import java.text.*;\nimport java.util.*;\nimport java.util.concurrent.*;\n\npublic class Sdf {\n    // \"Tiết kiệm\": một SimpleDateFormat dùng chung, như một field trong bean singleton\n    static final SimpleDateFormat FMT = new SimpleDateFormat(\"yyyy-MM-dd\");\n\n    public static void main(String[] args) throws Exception {\n        List<String> inputs = List.of(\"2026-11-20\", \"2026-11-21\", \"2026-11-22\", \"2026-11-23\");\n        Map<String, Integer> outcomes = new ConcurrentHashMap<>();\n        try (ExecutorService ex = Executors.newFixedThreadPool(4)) {\n            for (int i = 0; i < 10_000; i++) {\n                String in = inputs.get(i % 4);\n                ex.submit(() -> {\n                    String result;\n                    try {\n                        String back = FMT.format(FMT.parse(in));\n                        result = back.equals(in) ? \"correct\" : \"WRONG DATE\";\n                    } catch (Exception e) { result = e.getClass().getSimpleName(); }\n                    outcomes.merge(result, 1, Integer::sum);\n                });\n            }\n        }\n        System.out.println(\"10 000 parses on 4 threads: \" + new TreeMap<>(outcomes));\n    }\n}");
const OUT24_SDF = out("$ java Sdf.java\n10 000 parses on 4 threads: {ArrayIndexOutOfBoundsException=157, NumberFormatException=1707, WRONG DATE=6042, correct=2094}");
const OUT24_VISITS = out("# controller field \"visits++\" vs AtomicInteger — 3 rounds of 5000 concurrent POST /visit\nround 1: visits=4778 safeVisits=5000\nround 2: visits=4738 safeVisits=5000\nround 3: visits=4771 safeVisits=5000");
const MA24_VISIT = java("@RestController\npublic class ThreadController {   // (excerpt)\n    // Controller là singleton: MỘT đối tượng dùng chung cho mọi request đồng thời\n    private int visits = 0;                                   // SAI: trạng thái dùng chung, không đồng bộ\n    private final AtomicInteger safeVisits = new AtomicInteger(); // ĐÚNG\n\n    @PostMapping(\"/visit\")\n    String visit() {\n        visits++;\n        safeVisits.incrementAndGet();\n        return \"ok\\n\";\n    }\n\n    @GetMapping(\"/visits\")\n    String visits() {\n        return \"visits=\" + visits + \" safeVisits=\" + safeVisits.get() + \"\\n\";\n    }\n}");

const L24_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Race conditions, locks and atomic types</h2>
<p class="lead">Lesson 2.3 showed that a Spring server runs hundreds of requests on hundreds of threads at once. The moment two of them touch the same variable, the program can produce answers that are impossible in a single-threaded world: counters that lose updates, maps that lose keys, dates that parse into the wrong day, loops that never see a flag change, and two threads that wait for each other forever. This lesson reproduces every one of those failures for real — including inside a Spring controller — and fixes each with the right tool.</p>

<h3>Lost updates: <code>count++</code> is three steps</h3>
${MA24_COUNTER}
${OUT24_COUNTER}
<p>Four million increments, 1,3 million survived. Why? Disassemble a one-line method:</p>
${MA24_INC}
${OUT24_JAVAP}
<p><code>getfield</code> reads, <code>iadd</code> adds, <code>putfield</code> writes back. Two threads can both read 41, both compute 42, both write 42 — one increment is lost. That interleaving is a <strong>race condition</strong>: the result depends on the timing of threads. It is invisible in testing on a laptop with one user and appears under load in production.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">synchronized</span><span class="v">Only one thread at a time may hold the object's monitor; the read-add-write becomes indivisible. Correct, but threads queue up — slowest here (142 ms).</span></div>
  <div class="kv"><span class="k">AtomicInteger</span><span class="v">Uses a CPU <em>compare-and-swap</em> (CAS) instruction: "write 42 only if the value is still 41, else retry". No lock, correct, 65 ms.</span></div>
  <div class="kv"><span class="k">LongAdder</span><span class="v">Keeps one counter per contending thread and sums them when you read. Fastest under heavy contention (15 ms); use it for metrics and statistics. Micrometer counters (Chapter 15) use the same idea.</span></div>
</div>
<p>The "plain" 10 ms is not a speed advantage — it is the speed of a wrong answer.</p>

<h3>Atomicity also covers whole operations: HashMap vs ConcurrentHashMap</h3>
${MA24_MAP}
${OUT24_MAP}
<ul>
  <li><code>HashMap</code> under concurrent writes lost 38 % of the bookings. It can also corrupt its internal structure; it is simply not designed for threads.</li>
  <li><code>ConcurrentHashMap</code> with <code>get</code> then <code>put</code> lost almost as many. Each call is thread-safe, but <strong>two thread-safe calls in a row are not one thread-safe operation</strong> — another thread slips in between. This "check-then-act" pattern is the most common concurrency bug in real code.</li>
  <li><code>merge</code>, <code>compute</code>, <code>computeIfAbsent</code> and <code>putIfAbsent</code> run the whole read-modify-write atomically for one key. 400 000, exactly.</li>
</ul>

<h3>Visibility: a thread may never see your write</h3>
${MA24_VIS}
${OUT24_VIS}
${OUT24_VISV}
<p>Without <code>volatile</code>, the JIT compiler is allowed to read <code>stop</code> once and turn the loop into <code>while (true)</code>: the worker ran forever although <code>main</code> had set the flag. The Java Memory Model only guarantees that a write by one thread is visible to another if there is a <strong>happens-before</strong> relation: a <code>volatile</code> write/read, releasing/acquiring the same lock, <code>Thread.start</code>/<code>join</code>, or the concurrent collections. With <code>volatile</code> the worker stopped. Note that <code>volatile</code> gives visibility, <strong>not</strong> atomicity — <code>volatile int count; count++</code> still loses updates.</p>

<h3>Deadlock: each thread holds what the other needs</h3>
${MA24_DL}
${OUT24_DL}
<p>The JVM detected the cycle itself: <em>booking-an</em> holds lab A and waits for lab B; <em>booking-binh</em> holds B and waits for A. Neither will ever continue, and nothing is logged — the requests just hang. On a server, <code>jcmd &lt;pid&gt; Thread.print</code> (or <code>jstack</code>, or IntelliJ's "Get Thread Dump", or <code>/actuator/threaddump</code> in Chapter 15) is the first thing to run when "the app is stuck but CPU is idle". Read it from the top: <code>Found one Java-level deadlock</code>, then which thread holds and waits for which lock, with the exact source lines.</p>
${MA24_LO}
${OUT24_LO}
<ul>
  <li><strong>Lock ordering</strong> removes the cycle: everyone locks the lower id first, so a circular wait cannot form. Both bookings succeeded.</li>
  <li><strong><code>ReentrantLock.tryLock(timeout)</code></strong> gives up instead of hanging. But look at the output: <em>both</em> threads gave up — each held one lab and timed out on the other. Timeouts turn a deadlock into failures you can retry (with a random back-off) or report as HTTP 409; they do not replace a consistent lock order.</li>
</ul>

<h3>Inside Spring: a singleton bean with a field is shared state</h3>
<p>Spring creates <strong>one</strong> instance of each controller and service (Chapter 3, "singleton scope") and calls it from every request thread at once. A mutable field in that bean is exactly the shared <code>count</code> above:</p>
${MA24_VISIT}
${OUT24_VISITS}
<p>Three rounds of 5 000 concurrent requests to the app from lesson 2.3: the plain field lost 222–262 visits each time; the <code>AtomicInteger</code> counted all 5 000. The rule for Spring beans: <strong>keep them stateless</strong> — only final references to other beans and configuration. Per-request data lives in local variables and method parameters (each thread has its own stack); shared counters use atomics; anything that must survive restarts or multiple instances lives in the database (Chapter 7 uses row locks and optimistic locking for booking conflicts).</p>
<p>A classic version of the same bug is a shared <code>SimpleDateFormat</code>, which stores intermediate parse state in its own fields:</p>
${MA24_SDF}
${OUT24_SDF}
<p>Only 2 094 of 10 000 parses were correct; 6 042 returned a <em>different valid date</em> without any error — the worst kind of bug, because nothing crashes. Use <code>java.time.format.DateTimeFormatter</code>, which is immutable and thread-safe, and Jackson in Spring Boot already does.</p>

<h3>🕵️ Real incident — the Northeast blackout, 14 August 2003</h3>
<div class="callout warn"><p>At FirstEnergy's control room in Ohio, the alarm subsystem of GE Energy's XA/21 energy-management system stalled at about 14:14 because of a <strong>race condition</strong>: two processes wrote to a shared data structure at the same time, and the alarm process entered an infinite loop. It produced no error. For over an hour, operators received no alarms while transmission lines tripped one after another; they did not know their grid was failing. The cascade cut power to about <strong>50 million people</strong> in eight US states and Ontario, some for days. GE found the bug only after weeks of analysis — it had been in the code for years and needed a very specific timing to fire.</p>
<p><strong>What it teaches a backend developer:</strong> (1) a race condition can sit unseen for years and pass every test; (2) protect shared state by design (immutability, atomics, one owner) rather than by hoping timings stay friendly; (3) watch the watcher — a monitoring component that hangs silently is worse than one that crashes, which is why Chapter 15 adds health checks and alerts on "no data".</p></div>

<h3>Compared with Node.js</h3>
<p>Node.js runs your JavaScript on one thread, so <code>count++</code> inside a handler is never torn apart — one of the reasons Node feels "simpler". But races still exist at the <em>await</em> points: <code>const n = await getCount(); await setCount(n + 1);</code> is check-then-act across two I/O calls, and two concurrent requests lose an update exactly like <code>ConcurrentHashMap</code> get+put. In both platforms the final answer for shared business data is the same: an atomic operation in the database (<code>UPDATE … SET n = n + 1</code>), a lock, or a version check.</p>

<h3>Everyday picture</h3>
<p>A race condition is two people withdrawing from a shared account at two ATMs at the same second: both machines read 1 000 000 đ, both pay out, both write back the new balance — one withdrawal vanishes from the books. A deadlock is two cars meeting on a one-lane bridge, each refusing to reverse. Lock ordering is the traffic rule "whoever comes from the north always waits" — no argument can start.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Why is <code>count++</code> not thread-safe, and how do you fix it?"</strong> — It is read, add, write (three bytecodes); interleaving loses updates. Fix with <code>synchronized</code>, <code>AtomicInteger</code>, or <code>LongAdder</code> for high-contention counters.</li>
  <li><strong>"What does <code>volatile</code> guarantee?"</strong> — Visibility and ordering (a happens-before edge between a write and later reads), not atomicity of compound actions.</li>
  <li><strong>"HashMap vs Hashtable vs ConcurrentHashMap?"</strong> — HashMap is not thread-safe; Hashtable locks the whole table on every call (legacy); ConcurrentHashMap allows concurrent reads and fine-grained writes, and offers atomic <code>merge</code>/<code>compute</code>. Compound get-then-put is still racy.</li>
  <li><strong>"What is a deadlock and how do you find and prevent it?"</strong> — Threads waiting in a cycle for locks held by each other. Find it with a thread dump (jstack/jcmd, "Found one Java-level deadlock"); prevent it with a global lock order, fewer nested locks, or <code>tryLock</code> with a timeout.</li>
  <li><strong>"Are Spring beans thread-safe?"</strong> — Spring does nothing to make them thread-safe; singleton beans are shared by all request threads, so they must be stateless or protect their state.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>In <code>MapRace.java</code>, replace the racy get+put with a single atomic call so that the total is always 400 000. Run it three times.</li>
  <li>Count bookings per lab with 4 threads using <code>ConcurrentHashMap&lt;String, LongAdder&gt;</code> and <code>computeIfAbsent(…).increment()</code>. Compare the time with <code>merge</code>.</li>
  <li>Fix <code>Sdf.java</code> with <code>DateTimeFormatter.ISO_LOCAL_DATE</code> and <code>LocalDate.parse</code>.</li>
  <li>Write a <code>BookingCounter</code> class whose method <code>tryBook(lab)</code> must allow at most 3 bookings per lab, called from 8 threads 1 000 times each. Make it pass without using <code>synchronized</code>.</li>
</ol>
<p><strong>Done when:</strong> exercise 1 prints 400000 three times, exercise 3 prints <code>{correct=10000}</code>, and exercise 4 ends with exactly 3 bookings per lab.</p></div>
${giai('Show one solution', `${java(`
// 1 — one atomic read-modify-write per key
chm.merge(k, 1, Integer::sum);                 // or: chm.compute(k, (key, v) -> v == null ? 1 : v + 1);

// 2 — one LongAdder per lab, created once
Map<String, LongAdder> perLab = new ConcurrentHashMap<>();
perLab.computeIfAbsent(lab, k -> new LongAdder()).increment();

// 3 — immutable, thread-safe formatter
String back = LocalDate.parse(in, DateTimeFormatter.ISO_LOCAL_DATE).toString();

// 4 — compare-and-set loop: only succeed if the count is still what we read
class BookingCounter {
    private final ConcurrentHashMap<String, AtomicInteger> counts = new ConcurrentHashMap<>();
    boolean tryBook(String lab) {
        AtomicInteger c = counts.computeIfAbsent(lab, k -> new AtomicInteger());
        while (true) {
            int n = c.get();
            if (n >= 3) return false;
            if (c.compareAndSet(n, n + 1)) return true;   // another thread changed it? loop and re-check
        }
    }
}`)}
<p>Exercise 4 is check-then-act made atomic by CAS. It only works inside one JVM: with two app instances behind a load balancer, each has its own counter. Chapter 7 moves the same rule into PostgreSQL (a unique constraint, <code>SELECT … FOR UPDATE</code>, or a version column).</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition</span><span class="v">A result that depends on the timing of threads accessing shared state.</span></div>
  <div class="kv"><span class="k">Lost update</span><span class="v">Two read-modify-write sequences interleave and one write overwrites the other.</span></div>
  <div class="kv"><span class="k">Check-then-act</span><span class="v">Deciding based on a read, then writing — racy unless the pair is atomic.</span></div>
  <div class="kv"><span class="k">synchronized / monitor</span><span class="v">Java's built-in lock on an object: one holder at a time; also gives visibility.</span></div>
  <div class="kv"><span class="k">CAS (compare-and-swap)</span><span class="v">A CPU instruction that writes only if the current value equals an expected value; the basis of atomics.</span></div>
  <div class="kv"><span class="k">volatile</span><span class="v">Field modifier guaranteeing that writes are visible to other threads (happens-before); not atomic for compound actions.</span></div>
  <div class="kv"><span class="k">Happens-before</span><span class="v">The Java Memory Model relation that guarantees one action's effects are visible to another.</span></div>
  <div class="kv"><span class="k">Deadlock</span><span class="v">A cycle of threads each waiting for a lock held by the next.</span></div>
  <div class="kv"><span class="k">Thread dump</span><span class="v">A snapshot of every thread's stack and locks (jstack, jcmd Thread.print).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>count++</code> loses updates under threads; use atomics, <code>LongAdder</code> or a lock.</li>
  <li>Two thread-safe calls are not one atomic operation; use <code>merge</code>/<code>compute</code>.</li>
  <li><code>volatile</code> = visibility, not atomicity.</li>
  <li>Deadlocks: consistent lock order, <code>tryLock</code> with timeout, read the thread dump.</li>
  <li>Spring singleton beans must be stateless; prefer immutable helpers (<code>DateTimeFormatter</code>).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html', '📄', 'JLS §17 — Threads and Locks', 'The Java Memory Model: happens-before, volatile, final fields.')}
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html', '📄', 'ConcurrentHashMap (Java 21)', 'Which methods are atomic, and why size() is only an estimate under updates.')}

<h3>Sources</h3>
<ul>
  <li>U.S.–Canada Power System Outage Task Force, <em>Final Report on the August 14, 2003 Blackout</em> (April 2004), ch. 5 (alarm and logging failure at FirstEnergy): <a href="https://www.energy.gov/oe/articles/blackout-2003-final-report-august-14-2003-blackout-united-states-and-canada-causes-and" target="_blank" rel="noopener">energy.gov</a></li>
  <li>Kevin Poulsen, "Tracking the blackout bug", SecurityFocus, 7 April 2004 (race condition in GE XA/21).</li>
  <li><code>SimpleDateFormat</code> Javadoc: "Date formats are not synchronized": <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/SimpleDateFormat.html" target="_blank" rel="noopener">docs.oracle.com</a></li>
  <li>Outputs above: Temurin 21.0.12.1 in a 4-CPU container; Spring Boot 4.1.2 app from lesson 2.3 — run on 18/11/2026.</li>
</ul>
</div>
`;

const L24_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Tranh chấp dữ liệu, khoá và kiểu atomic</h2>
<p class="lead">Bài 2.3 cho thấy server Spring chạy hàng trăm request trên hàng trăm luồng cùng lúc. Ngay khi hai luồng đụng cùng một biến, chương trình có thể cho ra những kết quả không thể có trong thế giới một luồng: bộ đếm mất cập nhật, Map mất khoá, ngày tháng parse ra sai ngày, vòng lặp không bao giờ thấy cờ đổi, và hai luồng chờ nhau mãi mãi. Bài này tái hiện thật từng lỗi đó — kể cả ngay trong controller Spring — và sửa mỗi lỗi bằng đúng công cụ.</p>

<h3>Mất cập nhật: <code>count++</code> là ba bước</h3>
${MA24_COUNTER}
${OUT24_COUNTER}
<p>Bốn triệu lần tăng, còn sống 1,3 triệu. Vì sao? Dịch ngược một phương thức một dòng:</p>
${MA24_INC}
${OUT24_JAVAP}
<p><code>getfield</code> đọc, <code>iadd</code> cộng, <code>putfield</code> ghi lại. Hai luồng có thể cùng đọc 41, cùng tính 42, cùng ghi 42 — mất một lần tăng. Kiểu đan xen đó là <strong>race condition</strong> (tranh chấp): kết quả phụ thuộc thời điểm chạy của các luồng. Thử trên laptop với một người dùng thì không thấy, lên production có tải mới lộ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">synchronized</span><span class="v">Mỗi lúc chỉ một luồng giữ monitor của đối tượng; đọc-cộng-ghi thành không thể chia cắt. Đúng, nhưng các luồng xếp hàng — chậm nhất ở đây (142 ms).</span></div>
  <div class="kv"><span class="k">AtomicInteger</span><span class="v">Dùng lệnh CPU <em>compare-and-swap</em> (CAS): "chỉ ghi 42 nếu giá trị vẫn là 41, không thì thử lại". Không khoá, đúng, 65 ms.</span></div>
  <div class="kv"><span class="k">LongAdder</span><span class="v">Giữ mỗi luồng tranh chấp một ô đếm riêng và cộng lại khi đọc. Nhanh nhất khi tranh chấp nặng (15 ms); dùng cho số liệu thống kê, đo lường. Bộ đếm Micrometer (Chương 15) dùng cùng ý tưởng.</span></div>
</div>
<p>10 ms của bản "plain" không phải lợi thế tốc độ — đó là tốc độ của một đáp án sai.</p>

<h3>Tính nguyên tử phải phủ cả thao tác: HashMap vs ConcurrentHashMap</h3>
${MA24_MAP}
${OUT24_MAP}
<ul>
  <li><code>HashMap</code> bị ghi đồng thời mất 38 % lượt đặt. Nó còn có thể hỏng cấu trúc bên trong; đơn giản là nó không được thiết kế cho đa luồng.</li>
  <li><code>ConcurrentHashMap</code> với <code>get</code> rồi <code>put</code> mất gần bằng. Từng lời gọi an toàn luồng, nhưng <strong>hai lời gọi an toàn liên tiếp không phải một thao tác an toàn</strong> — luồng khác chen vào giữa. Mẫu "kiểm rồi làm" (check-then-act) này là bug đồng thời phổ biến nhất trong mã thật.</li>
  <li><code>merge</code>, <code>compute</code>, <code>computeIfAbsent</code> và <code>putIfAbsent</code> chạy trọn đọc-sửa-ghi một cách nguyên tử cho một khoá. Đúng 400 000.</li>
</ul>

<h3>Tính nhìn thấy: một luồng có thể không bao giờ thấy lệnh ghi của bạn</h3>
${MA24_VIS}
${OUT24_VIS}
${OUT24_VISV}
<p>Không có <code>volatile</code>, trình biên dịch JIT được phép đọc <code>stop</code> một lần rồi biến vòng lặp thành <code>while (true)</code>: luồng thợ chạy mãi dù <code>main</code> đã đặt cờ. Mô hình bộ nhớ Java chỉ bảo đảm lệnh ghi của luồng này được luồng kia thấy khi có quan hệ <strong>happens-before</strong>: ghi/đọc <code>volatile</code>, nhả/lấy cùng một khoá, <code>Thread.start</code>/<code>join</code>, hoặc các collection đồng thời. Có <code>volatile</code> thì luồng thợ dừng. Lưu ý <code>volatile</code> cho tính nhìn thấy, <strong>không</strong> cho tính nguyên tử — <code>volatile int count; count++</code> vẫn mất cập nhật.</p>

<h3>Deadlock: luồng nào cũng giữ thứ luồng kia cần</h3>
${MA24_DL}
${OUT24_DL}
<p>Chính JVM phát hiện vòng chờ: <em>booking-an</em> giữ lab A và chờ lab B; <em>booking-binh</em> giữ B và chờ A. Không luồng nào đi tiếp được, và không có dòng log nào — request cứ treo. Trên server, <code>jcmd &lt;pid&gt; Thread.print</code> (hoặc <code>jstack</code>, hoặc "Get Thread Dump" của IntelliJ, hoặc <code>/actuator/threaddump</code> ở Chương 15) là việc đầu tiên phải chạy khi "ứng dụng đứng mà CPU rảnh". Đọc từ trên xuống: <code>Found one Java-level deadlock</code>, rồi luồng nào giữ và chờ khoá nào, kèm đúng dòng mã.</p>
${MA24_LO}
${OUT24_LO}
<ul>
  <li><strong>Thứ tự khoá cố định</strong> phá vòng chờ: ai cũng khoá id nhỏ trước, nên không thể hình thành vòng. Cả hai lượt đặt đều thành công.</li>
  <li><strong><code>ReentrantLock.tryLock(timeout)</code></strong> bỏ cuộc thay vì treo. Nhưng nhìn output: <em>cả hai</em> luồng đều bỏ cuộc — mỗi luồng giữ một lab và hết giờ chờ lab kia. Hết giờ biến deadlock thành thất bại có thể thử lại (kèm thời gian chờ ngẫu nhiên) hoặc báo HTTP 409; nó không thay được thứ tự khoá nhất quán.</li>
</ul>

<h3>Trong Spring: bean singleton có field là trạng thái dùng chung</h3>
<p>Spring tạo <strong>một</strong> đối tượng cho mỗi controller và service (Chương 3, "singleton scope") và gọi nó từ mọi luồng request cùng lúc. Một field sửa được trong bean đó chính là biến <code>count</code> dùng chung ở trên:</p>
${MA24_VISIT}
${OUT24_VISITS}
<p>Ba lượt 5 000 request đồng thời vào ứng dụng của bài 2.3: field thường mất 222–262 lượt mỗi lần; <code>AtomicInteger</code> đếm đủ 5 000. Quy tắc cho bean Spring: <strong>giữ chúng không trạng thái</strong> — chỉ có tham chiếu final tới bean khác và cấu hình. Dữ liệu của từng request nằm trong biến cục bộ và tham số (mỗi luồng có stack riêng); bộ đếm dùng chung thì dùng atomic; thứ gì phải sống qua khởi động lại hoặc qua nhiều bản chạy thì nằm trong cơ sở dữ liệu (Chương 7 dùng khoá hàng và khoá lạc quan cho xung đột lượt đặt).</p>
<p>Một phiên bản kinh điển của cùng bug là <code>SimpleDateFormat</code> dùng chung — nó lưu trạng thái parse dở dang trong chính field của nó:</p>
${MA24_SDF}
${OUT24_SDF}
<p>Chỉ 2 094 trên 10 000 lần parse là đúng; 6 042 lần trả về <em>một ngày hợp lệ khác</em> mà không báo lỗi gì — loại bug tệ nhất, vì chẳng có gì sập. Hãy dùng <code>java.time.format.DateTimeFormatter</code>, bất biến và an toàn luồng; Jackson trong Spring Boot vốn đã dùng nó.</p>

<h3>🕵️ Sự cố thật — mất điện Đông Bắc Mỹ, 14/8/2003</h3>
<div class="callout warn"><p>Ở phòng điều khiển của FirstEnergy (bang Ohio), phân hệ cảnh báo của hệ thống quản lý năng lượng XA/21 do GE Energy làm bị đứng vào khoảng 14:14 vì một <strong>race condition</strong>: hai tiến trình cùng ghi vào một cấu trúc dữ liệu dùng chung, và tiến trình cảnh báo rơi vào vòng lặp vô hạn. Nó không báo lỗi nào. Hơn một giờ liền, nhân viên vận hành không nhận được cảnh báo nào trong khi đường dây truyền tải lần lượt nhảy; họ không biết lưới điện của mình đang sụp. Hiệu ứng dây chuyền cắt điện của khoảng <strong>50 triệu người</strong> ở tám bang Mỹ và Ontario, có nơi mất nhiều ngày. GE chỉ tìm ra bug sau nhiều tuần phân tích — nó nằm trong mã nhiều năm và cần một thời điểm rất đặc biệt mới phát tác.</p>
<p><strong>Điều người làm backend rút ra:</strong> (1) race condition có thể nằm im nhiều năm và qua mọi bài test; (2) bảo vệ trạng thái dùng chung bằng thiết kế (bất biến, atomic, một chủ sở hữu) thay vì mong thời điểm chạy luôn "hiền"; (3) phải canh cả người canh gác — một thành phần giám sát treo im lặng còn tệ hơn một thành phần sập, nên Chương 15 thêm kiểm tra sức khoẻ và cảnh báo khi "không có dữ liệu".</p></div>

<h3>So với Node.js</h3>
<p>Node.js chạy JavaScript của bạn trên một luồng, nên <code>count++</code> trong một handler không bao giờ bị xé nhỏ — một lý do Node có cảm giác "đơn giản hơn". Nhưng tranh chấp vẫn tồn tại ở các điểm <em>await</em>: <code>const n = await getCount(); await setCount(n + 1);</code> là kiểm-rồi-làm qua hai lời gọi I/O, và hai request đồng thời mất một cập nhật y như get+put của <code>ConcurrentHashMap</code>. Ở cả hai nền tảng, đáp án cuối cùng cho dữ liệu nghiệp vụ dùng chung là một: thao tác nguyên tử trong cơ sở dữ liệu (<code>UPDATE … SET n = n + 1</code>), một khoá, hoặc kiểm phiên bản.</p>

<h3>Hình ảnh đời thường</h3>
<p>Race condition là hai người rút tiền từ một tài khoản chung ở hai cây ATM trong cùng một giây: cả hai máy đọc số dư 1 000 000 đ, cả hai chi tiền, cả hai ghi lại số dư mới — một lần rút biến mất khỏi sổ. Deadlock là hai xe gặp nhau trên cây cầu một làn, xe nào cũng không chịu lùi. Thứ tự khoá là luật "xe đi từ phía bắc luôn nhường" — không thể bắt đầu cãi nhau.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Vì sao <code>count++</code> không an toàn luồng, sửa thế nào?"</strong> — Nó là đọc, cộng, ghi (ba bytecode); đan xen làm mất cập nhật. Sửa bằng <code>synchronized</code>, <code>AtomicInteger</code>, hoặc <code>LongAdder</code> cho bộ đếm tranh chấp cao.</li>
  <li><strong>"<code>volatile</code> bảo đảm điều gì?"</strong> — Tính nhìn thấy và thứ tự (một cạnh happens-before giữa lệnh ghi và các lần đọc sau), không bảo đảm nguyên tử cho thao tác ghép.</li>
  <li><strong>"HashMap vs Hashtable vs ConcurrentHashMap?"</strong> — HashMap không an toàn luồng; Hashtable khoá cả bảng mỗi lời gọi (đồ cũ); ConcurrentHashMap cho đọc đồng thời và ghi khoá mịn, có <code>merge</code>/<code>compute</code> nguyên tử. get-rồi-put ghép vẫn tranh chấp.</li>
  <li><strong>"Deadlock là gì, tìm và phòng thế nào?"</strong> — Các luồng chờ thành vòng các khoá mà luồng khác đang giữ. Tìm bằng thread dump (jstack/jcmd, "Found one Java-level deadlock"); phòng bằng thứ tự khoá toàn cục, ít khoá lồng nhau, hoặc <code>tryLock</code> có hết giờ.</li>
  <li><strong>"Bean Spring có an toàn luồng không?"</strong> — Spring không làm gì để chúng an toàn luồng; bean singleton được mọi luồng request dùng chung, nên phải không trạng thái hoặc tự bảo vệ trạng thái.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Trong <code>MapRace.java</code>, thay get+put tranh chấp bằng một lời gọi nguyên tử để tổng luôn là 400 000. Chạy ba lần.</li>
  <li>Đếm lượt đặt theo lab bằng 4 luồng với <code>ConcurrentHashMap&lt;String, LongAdder&gt;</code> và <code>computeIfAbsent(…).increment()</code>. So thời gian với <code>merge</code>.</li>
  <li>Sửa <code>Sdf.java</code> bằng <code>DateTimeFormatter.ISO_LOCAL_DATE</code> và <code>LocalDate.parse</code>.</li>
  <li>Viết lớp <code>BookingCounter</code> có phương thức <code>tryBook(lab)</code> chỉ cho tối đa 3 lượt đặt mỗi lab, được gọi từ 8 luồng, mỗi luồng 1 000 lần. Làm nó đúng mà không dùng <code>synchronized</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bài 1 in 400000 cả ba lần, bài 3 in <code>{correct=10000}</code>, và bài 4 kết thúc với đúng 3 lượt đặt mỗi lab.</p></div>
${giai('Xem một lời giải', `${java(`
// 1 — một lần đọc-sửa-ghi nguyên tử cho mỗi khoá
chm.merge(k, 1, Integer::sum);                 // hoặc: chm.compute(k, (key, v) -> v == null ? 1 : v + 1);

// 2 — mỗi lab một LongAdder, tạo đúng một lần
Map<String, LongAdder> perLab = new ConcurrentHashMap<>();
perLab.computeIfAbsent(lab, k -> new LongAdder()).increment();

// 3 — formatter bất biến, an toàn luồng
String back = LocalDate.parse(in, DateTimeFormatter.ISO_LOCAL_DATE).toString();

// 4 — vòng compare-and-set: chỉ thành công nếu số đếm vẫn đúng như vừa đọc
class BookingCounter {
    private final ConcurrentHashMap<String, AtomicInteger> counts = new ConcurrentHashMap<>();
    boolean tryBook(String lab) {
        AtomicInteger c = counts.computeIfAbsent(lab, k -> new AtomicInteger());
        while (true) {
            int n = c.get();
            if (n >= 3) return false;
            if (c.compareAndSet(n, n + 1)) return true;   // luồng khác vừa đổi? lặp lại và kiểm lại
        }
    }
}`)}
<p>Bài 4 là kiểm-rồi-làm được làm nguyên tử bằng CAS. Nó chỉ đúng trong một JVM: hai bản ứng dụng sau bộ cân bằng tải thì mỗi bản có bộ đếm riêng. Chương 7 chuyển cùng quy tắc đó vào PostgreSQL (ràng buộc unique, <code>SELECT … FOR UPDATE</code>, hoặc cột version).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition (tranh chấp)</span><span class="v">Kết quả phụ thuộc thời điểm các luồng truy cập trạng thái dùng chung.</span></div>
  <div class="kv"><span class="k">Mất cập nhật</span><span class="v">Hai chuỗi đọc-sửa-ghi đan xen và lệnh ghi này đè lệnh ghi kia.</span></div>
  <div class="kv"><span class="k">Kiểm-rồi-làm (check-then-act)</span><span class="v">Quyết định dựa trên một lần đọc rồi mới ghi — tranh chấp trừ khi cặp đó nguyên tử.</span></div>
  <div class="kv"><span class="k">synchronized / monitor</span><span class="v">Khoá dựng sẵn của Java trên một đối tượng: mỗi lúc một người giữ; cũng cho tính nhìn thấy.</span></div>
  <div class="kv"><span class="k">CAS (compare-and-swap)</span><span class="v">Lệnh CPU chỉ ghi khi giá trị hiện tại bằng giá trị mong đợi; nền móng của các lớp atomic.</span></div>
  <div class="kv"><span class="k">volatile</span><span class="v">Từ khoá field bảo đảm lệnh ghi được luồng khác thấy (happens-before); không nguyên tử cho thao tác ghép.</span></div>
  <div class="kv"><span class="k">Happens-before</span><span class="v">Quan hệ của mô hình bộ nhớ Java bảo đảm tác dụng của thao tác này được thao tác kia thấy.</span></div>
  <div class="kv"><span class="k">Deadlock</span><span class="v">Vòng các luồng, luồng nào cũng chờ khoá mà luồng kế tiếp đang giữ.</span></div>
  <div class="kv"><span class="k">Thread dump</span><span class="v">Ảnh chụp stack và khoá của mọi luồng (jstack, jcmd Thread.print).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>count++</code> mất cập nhật khi đa luồng; dùng atomic, <code>LongAdder</code> hoặc khoá.</li>
  <li>Hai lời gọi an toàn luồng không phải một thao tác nguyên tử; dùng <code>merge</code>/<code>compute</code>.</li>
  <li><code>volatile</code> = nhìn thấy, không phải nguyên tử.</li>
  <li>Deadlock: thứ tự khoá nhất quán, <code>tryLock</code> có hết giờ, đọc thread dump.</li>
  <li>Bean singleton của Spring phải không trạng thái; ưu tiên công cụ bất biến (<code>DateTimeFormatter</code>).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html', '📄', 'JLS §17 — Threads and Locks', 'Mô hình bộ nhớ Java: happens-before, volatile, field final.')}
${tl('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html', '📄', 'ConcurrentHashMap (Java 21)', 'Phương thức nào nguyên tử, và vì sao size() chỉ là ước lượng khi đang cập nhật.')}

<h3>Nguồn</h3>
<ul>
  <li>Nhóm công tác Mỹ–Canada về sự cố hệ thống điện, <em>Final Report on the August 14, 2003 Blackout</em> (4/2004), chương 5 (lỗi cảnh báo và ghi log ở FirstEnergy): <a href="https://www.energy.gov/oe/articles/blackout-2003-final-report-august-14-2003-blackout-united-states-and-canada-causes-and" target="_blank" rel="noopener">energy.gov</a></li>
  <li>Kevin Poulsen, "Tracking the blackout bug", SecurityFocus, 7/4/2004 (race condition trong GE XA/21).</li>
  <li>Javadoc của <code>SimpleDateFormat</code>: "Date formats are not synchronized": <a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/SimpleDateFormat.html" target="_blank" rel="noopener">docs.oracle.com</a></li>
  <li>Output phía trên: Temurin 21.0.12.1 trong container 4 CPU; ứng dụng Spring Boot 4.1.2 của bài 2.3 — chạy ngày 18/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 2.5 =====
const MA25_VT = java("import java.nio.file.*;\nimport java.time.Duration;\nimport java.util.concurrent.*;\nimport java.util.stream.IntStream;\n\npublic class Vt {\n    static String status(String key) throws Exception {   // đọc số luồng hệ điều hành / bộ nhớ thường trú của tiến trình\n        return Files.readAllLines(Path.of(\"/proc/self/status\")).stream()\n            .filter(l -> l.startsWith(key)).findFirst().orElse(\"\").replaceAll(\"\\\\s+\", \" \");\n    }\n    static void run(String name, ExecutorService ex, int n) throws Exception {\n        long t0 = System.nanoTime();\n        CountDownLatch allStarted = new CountDownLatch(n);\n        try (ex) {\n            for (int i = 0; i < n; i++) ex.submit(() -> { allStarted.countDown(); Thread.sleep(Duration.ofSeconds(1)); return null; });\n            allStarted.await();\n            System.out.printf(\"%-9s n=%,9d  all sleeping: %s, %s%n\", name, n, status(\"Threads:\"), status(\"VmRSS:\"));\n        }\n        System.out.printf(\"%-9s n=%,9d  finished in %,d ms%n\", name, n, (System.nanoTime() - t0) / 1_000_000);\n    }\n    public static void main(String[] args) throws Exception {\n        Thread v = Thread.ofVirtual().name(\"vt-demo\").start(() -> System.out.println(\"inside: \" + Thread.currentThread()));\n        v.join();\n        System.out.println(\"idle JVM: \" + status(\"Threads:\") + \", \" + status(\"VmRSS:\"));\n        run(\"platform\", Executors.newThreadPerTaskExecutor(Thread.ofPlatform().factory()), 10_000);\n        run(\"virtual\", Executors.newVirtualThreadPerTaskExecutor(), 10_000);\n        run(\"virtual\", Executors.newVirtualThreadPerTaskExecutor(), 100_000);\n        if (args.length > 0) run(\"virtual\", Executors.newVirtualThreadPerTaskExecutor(), Integer.parseInt(args[0]));\n    }\n}");
const OUT25_VT = out("$ java Vt.java        # container: 4 CPUs, 2 GB\ninside: VirtualThread[#22,vt-demo]/runnable@ForkJoinPool-1-worker-1\nidle JVM: Threads: 24, VmRSS: 117004 kB\nplatform  n=   10,000  all sleeping: Threads: 10023, VmRSS: 374528 kB\nplatform  n=   10,000  finished in 1,788 ms\nvirtual   n=   10,000  all sleeping: Threads: 27, VmRSS: 231884 kB\nvirtual   n=   10,000  finished in 1,042 ms\nvirtual   n=  100,000  all sleeping: Threads: 27, VmRSS: 306668 kB\nvirtual   n=  100,000  finished in 1,342 ms");
const MA25_STARVE = java("import java.util.concurrent.*;\nimport java.util.stream.IntStream;\n\npublic class Starve2 {\n    static void callSlowApi(int i) {\n        try { Thread.sleep(200); } catch (InterruptedException e) { throw new RuntimeException(e); }\n    }\n    public static void main(String[] args) {\n        long t0 = System.nanoTime();\n        IntStream.range(0, 16).parallel().forEach(Starve2::callSlowApi);\n        System.out.printf(\"16 slow calls via parallel stream:          %d ms%n\", (System.nanoTime() - t0) / 1_000_000);\n        t0 = System.nanoTime();\n        try (var ex = Executors.newVirtualThreadPerTaskExecutor()) {\n            IntStream.range(0, 16).forEach(i -> ex.submit(() -> callSlowApi(i)));\n        }\n        System.out.printf(\"16 slow calls, one virtual thread per call: %d ms%n\", (System.nanoTime() - t0) / 1_000_000);\n    }\n}");
const OUT25_STARVE = out("$ java Starve2.java\n16 slow calls via parallel stream:          803 ms\n16 slow calls, one virtual thread per call: 225 ms");
const MA25_PIN = java("import java.util.concurrent.*;\nimport java.util.concurrent.locks.ReentrantLock;\n\npublic class Pinning {\n    static void ioCall() { try { Thread.sleep(100); } catch (InterruptedException e) {} }   // chờ I/O 100 ms\n\n    static class SyncCache {                       // mỗi task một đối tượng riêng ⇒ KHÔNG tranh khoá\n        synchronized void refresh() { ioCall(); }\n    }\n    static class LockCache {\n        private final ReentrantLock lock = new ReentrantLock();\n        void refresh() { lock.lock(); try { ioCall(); } finally { lock.unlock(); } }\n    }\n    static long time(Runnable task) {\n        long t0 = System.nanoTime();\n        try (var ex = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < 100; i++) ex.submit(task);\n        }\n        return (System.nanoTime() - t0) / 1_000_000;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"carrier threads (cores) = \" + Runtime.getRuntime().availableProcessors());\n        System.out.printf(\"100 virtual threads, sleep inside synchronized : %,d ms%n\", time(() -> new SyncCache().refresh()));\n        System.out.printf(\"100 virtual threads, sleep inside ReentrantLock: %,d ms%n\", time(() -> new LockCache().refresh()));\n    }\n}");
const OUT25_PIN = out("$ java -Djdk.tracePinnedThreads=short Pinning.java\ncarrier threads (cores) = 4\nVirtualThread[#26]/runnable@ForkJoinPool-1-worker-4 reason:MONITOR\n    Pinning$SyncCache.refresh(Pinning.java:8) <== monitors:1\n100 virtual threads, sleep inside synchronized : 2,510 ms\n100 virtual threads, sleep inside ReentrantLock: 101 ms");
const MA25_DB = java("import java.util.concurrent.*;\n\npublic class DbPool {\n    static final Semaphore connections = new Semaphore(10);       // như HikariCP: tối đa 10 kết nối\n    static void query() throws InterruptedException {\n        connections.acquire();                                     // chờ tới lượt có kết nối\n        try { Thread.sleep(100); } finally { connections.release(); }   // truy vấn 100 ms\n    }\n    public static void main(String[] args) {\n        long t0 = System.nanoTime();\n        try (var ex = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < 1_000; i++) ex.submit(() -> { query(); return null; });\n        }\n        System.out.printf(\"1 000 virtual threads, each a 100 ms query, pool of 10 connections: %,d ms%n\", (System.nanoTime() - t0) / 1_000_000);\n    }\n}");
const OUT25_DB = out("$ java DbPool.java\n1 000 virtual threads, each a 100 ms query, pool of 10 connections: 10,033 ms");
const OUT25_LOAD = out("$ java Load.java /slow?ms=1000 1000\n# spring.threads.virtual.enabled=true, accept-count=2000\n1000 requests in 1662 ms | p50 1400 ms, max 1629 ms | distinct server threads: 1000\n1000 requests in 1306 ms | p50 1162 ms, max 1278 ms | distinct server threads: 1000\n1000 requests in 1350 ms | p50 1078 ms, max 1340 ms | distinct server threads: 1000");
const OUT25_WHO = out("$ curl -s localhost:8080/who        # spring.threads.virtual.enabled=true\nVirtualThread[#3030,tomcat-handler-3000]/runnable@ForkJoinPool-1-worker-3");
const OUT25_LOADP = out("$ java Load.java /slow?ms=1000 1000\n# platform threads: server.tomcat.threads.max=200 (default), accept-count=2000\n1000 requests in 5284 ms | p50 3159 ms, max 5272 ms | distinct server threads: 200\n1000 requests in 5122 ms | p50 2989 ms, max 4986 ms | distinct server threads: 200\n1000 requests in 5206 ms | p50 3061 ms, max 5025 ms | distinct server threads: 200");

const L25_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Virtual threads (Java 21)</h2>
<p class="lead">Lesson 2.3 hit the ceiling of thread-per-request: 200 Tomcat threads, 1 000 requests that each wait 1 s, 5 seconds total. Node.js avoids that ceiling with callbacks and <code>async/await</code>; Java 21 avoids it while letting you keep writing ordinary blocking code. <strong>Virtual threads</strong> (JEP 444) are threads managed by the JVM instead of the operating system, so cheap that you can have one per request — or a hundred thousand. In Spring Boot it is one property. This lesson measures what they win, shows the one trap that matters on Java 21 (pinning), and explains what they do <em>not</em> fix.</p>

<h3>Platform thread vs virtual thread</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Platform thread</span><span class="v">One Java thread = one OS thread. Stack reserved by the OS (~1 MB). Scheduled by the kernel. Thousands are expensive.</span></div>
  <div class="kv"><span class="k">Virtual thread</span><span class="v">A Java object whose stack lives on the heap and grows as needed. The JVM <strong>mounts</strong> it on a small pool of <strong>carrier</strong> threads (a ForkJoinPool, one carrier per CPU core). When it blocks on I/O or <code>sleep</code>, the JVM <strong>unmounts</strong> it and the carrier runs another virtual thread.</span></div>
</div>
<p>The code you write is identical — <code>Thread.sleep</code>, JDBC calls, <code>InputStream.read</code> — but a blocked virtual thread costs a few hundred bytes of heap instead of an OS thread.</p>

<h3>Measured: 10 000 sleeping threads</h3>
${MA25_VT}
${OUT25_VT}
<ul>
  <li><code>VirtualThread[#22,vt-demo]/runnable@ForkJoinPool-1-worker-1</code>: the virtual thread is currently mounted on carrier <code>worker-1</code>.</li>
  <li>10 000 platform threads: the process really had <strong>10 023 OS threads</strong> and 374 MB resident memory, and needed 1,8 s for a 1 s sleep (creating threads takes time).</li>
  <li>10 000 virtual threads: still <strong>27 OS threads</strong>, 232 MB, finished in 1,04 s. 100 000 virtual threads: 27 OS threads, 307 MB, 1,34 s.</li>
  <li>The limit did not disappear — it moved to the heap. Pushing the same program to 1 000 000 virtual threads in this 2 GB container with the default heap (¼ of RAM) ended in <code>OutOfMemoryError</code>: each sleeping virtual thread keeps its stack and its <code>Future</code> on the heap.</li>
</ul>
<p>The promise from lesson 2.1 — 16 slow calls that took 800 ms in a parallel stream:</p>
${MA25_STARVE}
${OUT25_STARVE}

<h3>In Spring Boot: one property</h3>
${yml(`
# application.yml — requires Java 21+
spring:
  threads:
    virtual:
      enabled: true`)}
<p>With it, Tomcat runs every request on a new virtual thread, and Boot also switches <code>@Async</code>, <code>@Scheduled</code> and several client executors to virtual threads. The same app and the same test as lesson 2.3 (1 000 concurrent requests, 1 s of waiting each):</p>
${OUT25_WHO}
${OUT25_LOADP}
${OUT25_LOAD}
<p>From ≈ 5,2 s to ≈ 1,3–1,7 s, and 1 000 distinct threads instead of 200 — no code change. The p50 dropped from ≈ 3 s to ≈ 1,1–1,4 s: nobody waits for a free thread any more.</p>

<h3>The trap on Java 21: pinning</h3>
<p>On Java 21, a virtual thread that blocks <strong>inside a <code>synchronized</code> block or method</strong> cannot unmount — it stays <em>pinned</em> to its carrier, and with only one carrier per core, a few pinned threads stall everything:</p>
${MA25_PIN}
${OUT25_PIN}
<p>100 independent tasks (no lock contention at all) took 2,5 s with <code>synchronized</code>: 4 carriers × 25 rounds × 100 ms. The same work with <code>ReentrantLock</code> took 0,1 s, because a virtual thread waiting inside a <code>java.util.concurrent</code> lock does unmount. <code>-Djdk.tracePinnedThreads=short</code> prints the line that pinned (<code>reason:MONITOR</code>, <code>Pinning.java:8</code>). Java 24 (JEP 491) removed this limitation for <code>synchronized</code>, but Spring Boot 4 projects on Java 21 LTS — most of them in 2026 — still have it: replace <code>synchronized</code> around I/O with <code>ReentrantLock</code>, and keep libraries (JDBC drivers, HTTP clients) up to date, since most have done the same.</p>

<h3>🕵️ Real incident — Netflix, 2024</h3>
<div class="callout warn"><p>Netflix moved services to Java 21 with virtual threads in Spring Boot and in July 2024 published what happened next on its tech blog ("Java 21 Virtual Threads — Dude, Where's My Lock?"). Some instances <strong>stopped serving traffic completely</strong> while the JVM stayed alive; connections piled up in <code>CLOSE_WAIT</code>. A heap dump showed the cause: on 4-vCPU instances, all <strong>4 carrier threads were pinned</strong> by virtual threads blocked inside <code>synchronized</code> code (in a tracing library), while the virtual thread that would release the lock they were waiting for could not get a carrier to run on — a deadlock that no ordinary thread dump showed. Their fixes: avoid <code>synchronized</code> around blocking calls, and the problem was finally removed in the JDK itself by JEP 491 (Java 24).</p>
<p><strong>Lessons:</strong> virtual threads are production-ready, but on Java 21 audit <code>synchronized</code> + I/O (your code and libraries), run with <code>-Djdk.tracePinnedThreads</code> in staging, load-test before switching (Chapter 16), and know that the number of carriers equals the number of CPUs your container sees.</p></div>

<h3>What virtual threads do not fix</h3>
${MA25_DB}
${OUT25_DB}
<ul>
  <li><strong>The database pool is still the bottleneck.</strong> HikariCP gives 10 connections by default. 1 000 virtual threads that each need a 100 ms query take 10 s — exactly as long as with 10 threads. Virtual threads remove the <em>thread</em> limit, not the limit of PostgreSQL. Size the pool from what the database can handle (Chapter 16), and expect requests to wait for connections instead of threads.</li>
  <li><strong>CPU-bound work does not get faster.</strong> There are still only as many carriers as cores. Hashing passwords, resizing images, big computations: no gain.</li>
  <li><strong>Do not pool virtual threads.</strong> They are cheap to create; create one per task. To limit concurrency towards a fragile service, use a <code>Semaphore</code> as above, not a small pool.</li>
  <li><strong>ThreadLocal caches become per-request.</strong> Code that cached expensive objects in a <code>ThreadLocal</code> assumed 200 long-lived threads; with one virtual thread per request the cache is rebuilt every time. (Java 25 adds scoped values as the modern alternative.)</li>
</ul>

<h3>Compared with Node.js</h3>
<p>Node.js handles 1 000 waiting requests on one thread because every wait is a callback: you must write <code>await</code> on every I/O call, and one accidental CPU-heavy or synchronous call blocks <em>all</em> requests. Virtual threads give Java the same scalability for I/O-bound servers while keeping straight-line blocking code, real stack traces, and the ability to use all cores. Interview sentence: "Node uses one event loop and async functions; Java 21 uses many cheap virtual threads and normal blocking code — both make waiting cheap; Java also runs on every core, Node needs cluster/workers for that."</p>

<h3>Everyday picture</h3>
<p>Platform threads are 200 waiters who stand in the kitchen while the dish cooks. Virtual threads are order tickets: the waiter clips the ticket to the rail and goes to serve another table; when the dish is ready, any free waiter picks the ticket up and carries it out. There are still only 4 waiters (the carriers), but no one stands idle. Pinning is a waiter who has handcuffed himself to the kitchen counter (<code>synchronized</code>) while waiting — on Java 21 he cannot leave until the dish is ready.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is a virtual thread and how is it different from a platform thread?"</strong> — A JVM-managed thread whose stack lives on the heap; it is mounted on a carrier platform thread while running and unmounted while blocked, so millions are possible. A platform thread is an OS thread.</li>
  <li><strong>"Do virtual threads make my code faster?"</strong> — They increase throughput for I/O-bound work by removing the thread limit; they do not speed up CPU-bound work, and the next bottleneck (DB pool, downstream service) still applies.</li>
  <li><strong>"What is pinning?"</strong> — On Java 21, a virtual thread that blocks inside <code>synchronized</code> (or a native frame) cannot unmount and blocks its carrier. Use <code>ReentrantLock</code>; Java 24 fixed it for <code>synchronized</code>.</li>
  <li><strong>"How do you enable virtual threads in Spring Boot?"</strong> — <code>spring.threads.virtual.enabled=true</code> on Java 21+; Tomcat, <code>@Async</code> and scheduling then use virtual threads.</li>
  <li><strong>"Should you pool virtual threads?"</strong> — No; create one per task and limit concurrency with a semaphore when needed.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run <code>Pinning.java</code> with <code>-Djdk.virtualThreadScheduler.parallelism=8</code>. Predict the <code>synchronized</code> time first.</li>
  <li>In <code>DbPool.java</code>, change the semaphore to 50 permits. Predict, run, and explain why a real PostgreSQL might be slower than your prediction.</li>
  <li>Rewrite <code>Cf.java</code> from lesson 2.3 so that the three calls run on <code>Executors.newVirtualThreadPerTaskExecutor()</code>, and confirm the total stays ≈ 400 ms.</li>
</ol>
<p><strong>Done when:</strong> exercise 1 shows ≈ 1,3 s for <code>synchronized</code>, exercise 2 shows ≈ 2 s, and exercise 3 prints the same page in ≈ 400 ms.</p></div>
${giai('Show the reasoning', `<p>1 — 8 carriers: 100 pinned tasks of 100 ms run in ⌈100 / 8⌉ = 13 rounds ≈ 1,3 s. The <code>ReentrantLock</code> version is unchanged (≈ 0,1 s).</p>
<p>2 — 1 000 queries ÷ 50 connections = 20 rounds × 100 ms ≈ 2 s. A real database does not run 50 queries as fast as 10: they compete for CPU, disk and locks, so query time grows with concurrency — which is why bigger pools are not automatically better (Chapter 16 measures it).</p>
${java(`
try (ExecutorService io = Executors.newVirtualThreadPerTaskExecutor()) {
    CompletableFuture<String> fLab = CompletableFuture.supplyAsync(() -> lab(1), io);
    // … the rest of Cf.java unchanged
}`)}`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Virtual thread</span><span class="v">A lightweight thread scheduled by the JVM (JEP 444, Java 21), stack on the heap.</span></div>
  <div class="kv"><span class="k">Carrier thread</span><span class="v">A platform thread from the JVM's ForkJoinPool on which virtual threads are mounted; one per core by default.</span></div>
  <div class="kv"><span class="k">Mount / unmount</span><span class="v">Attaching a virtual thread to a carrier to run; detaching it when it blocks.</span></div>
  <div class="kv"><span class="k">Pinning</span><span class="v">A virtual thread that cannot unmount while blocked (inside synchronized on Java 21–23, or native code), holding its carrier.</span></div>
  <div class="kv"><span class="k">spring.threads.virtual.enabled</span><span class="v">Spring Boot property that runs Tomcat requests, @Async and scheduling on virtual threads.</span></div>
  <div class="kv"><span class="k">Semaphore</span><span class="v">A counter of permits used to limit how many threads do something at once.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Virtual threads make blocking cheap: 100 000 sleeping threads on 27 OS threads.</li>
  <li>One property in Spring Boot: 1 000 slow requests from 5,2 s to ≈ 1,3 s, same code.</li>
  <li>Java 21 pinning: no blocking I/O inside <code>synchronized</code> — use <code>ReentrantLock</code> (fixed in Java 24).</li>
  <li>The DB pool, CPU and downstream services remain limits; don't pool virtual threads, limit with a semaphore.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://openjdk.org/jeps/444', '📄', 'JEP 444: Virtual Threads', 'Design, scheduling, pinning and the recommended adoption guidelines.')}
${tl('https://netflixtechblog.com/java-21-virtual-threads-dude-wheres-my-lock-3052540e231d', '📰', 'Netflix — Java 21 Virtual Threads: Dude, Where’s My Lock?', 'The full investigation of the pinning deadlock, with heap-dump analysis.')}

<h3>Sources</h3>
<ul>
  <li>JEP 444 (Java 21) and JEP 491 "Synchronize Virtual Threads without Pinning" (Java 24): <a href="https://openjdk.org/jeps/491" target="_blank" rel="noopener">openjdk.org/jeps/491</a></li>
  <li>Spring Boot reference, "Virtual threads": <a href="https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html" target="_blank" rel="noopener">docs.spring.io/spring-boot</a></li>
  <li>Netflix Technology Blog, 29 July 2024.</li>
  <li>Outputs above: Java demos on Temurin 21.0.12.1, Spring Boot 4.1.2 app on Temurin 21.0.13 (JRE image), containers limited to 4 CPUs — run on 18/11/2026.</li>
</ul>
</div>
`;

const L25_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Virtual thread (Java 21)</h2>
<p class="lead">Bài 2.3 đã chạm trần của mô hình mỗi request một luồng: 200 luồng Tomcat, 1 000 request mỗi cái chờ 1 giây, tổng 5 giây. Node.js né cái trần đó bằng callback và <code>async/await</code>; Java 21 né nó mà vẫn để bạn viết mã chặn bình thường. <strong>Virtual thread</strong> (JEP 444) là luồng do JVM quản lý thay vì hệ điều hành, rẻ tới mức mỗi request một luồng — hay một trăm nghìn luồng — cũng được. Trong Spring Boot, chỉ cần một thuộc tính. Bài này đo xem chúng thắng được gì, chỉ ra cái bẫy duy nhất đáng kể trên Java 21 (pinning), và nói rõ những gì chúng <em>không</em> sửa được.</p>

<h3>Luồng nền tảng vs virtual thread</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Luồng nền tảng</span><span class="v">Một luồng Java = một luồng hệ điều hành. Stack do hệ điều hành giữ sẵn (~1 MB). Nhân hệ điều hành lập lịch. Vài nghìn cái là đắt.</span></div>
  <div class="kv"><span class="k">Virtual thread</span><span class="v">Một đối tượng Java có stack nằm trên heap, lớn dần khi cần. JVM <strong>gắn</strong> (mount) nó lên một pool nhỏ các luồng <strong>mang</strong> (carrier — một ForkJoinPool, mỗi nhân CPU một carrier). Khi nó chặn vì I/O hay <code>sleep</code>, JVM <strong>tháo</strong> (unmount) nó ra và carrier chạy virtual thread khác.</span></div>
</div>
<p>Mã bạn viết y hệt — <code>Thread.sleep</code>, lời gọi JDBC, <code>InputStream.read</code> — nhưng một virtual thread đang chặn chỉ tốn vài trăm byte heap thay vì một luồng hệ điều hành.</p>

<h3>Đo thật: 10 000 luồng đang ngủ</h3>
${MA25_VT}
${OUT25_VT}
<ul>
  <li><code>VirtualThread[#22,vt-demo]/runnable@ForkJoinPool-1-worker-1</code>: virtual thread đang được gắn trên carrier <code>worker-1</code>.</li>
  <li>10 000 luồng nền tảng: tiến trình thật sự có <strong>10 023 luồng hệ điều hành</strong> và 374 MB bộ nhớ thường trú, và mất 1,8 giây cho một giấc ngủ 1 giây (tạo luồng tốn thời gian).</li>
  <li>10 000 virtual thread: vẫn chỉ <strong>27 luồng hệ điều hành</strong>, 232 MB, xong trong 1,04 giây. 100 000 virtual thread: 27 luồng hệ điều hành, 307 MB, 1,34 giây.</li>
  <li>Giới hạn không biến mất — nó dời sang heap. Đẩy cùng chương trình lên 1 000 000 virtual thread trong container 2 GB này với heap mặc định (¼ RAM) thì kết thúc bằng <code>OutOfMemoryError</code>: mỗi virtual thread đang ngủ giữ stack và <code>Future</code> của nó trên heap.</li>
</ul>
<p>Lời hứa từ bài 2.1 — 16 lời gọi chậm mất 800 ms trong parallel stream:</p>
${MA25_STARVE}
${OUT25_STARVE}

<h3>Trong Spring Boot: một thuộc tính</h3>
${yml(`
# application.yml — cần Java 21 trở lên
spring:
  threads:
    virtual:
      enabled: true`)}
<p>Bật nó lên, Tomcat chạy mỗi request trên một virtual thread mới, và Boot cũng chuyển <code>@Async</code>, <code>@Scheduled</code> cùng một số executor của client sang virtual thread. Cùng ứng dụng, cùng phép thử như bài 2.3 (1 000 request đồng thời, mỗi cái chờ 1 giây):</p>
${OUT25_WHO}
${OUT25_LOADP}
${OUT25_LOAD}
<p>Từ ≈ 5,2 giây xuống ≈ 1,3–1,7 giây, và 1 000 luồng khác nhau thay vì 200 — không sửa dòng mã nào. Trung vị giảm từ ≈ 3 giây xuống ≈ 1,1–1,4 giây: không còn ai phải chờ luồng rảnh.</p>

<h3>Cái bẫy trên Java 21: pinning</h3>
<p>Trên Java 21, virtual thread chặn <strong>bên trong khối hay phương thức <code>synchronized</code></strong> thì không tháo ra được — nó bị <em>ghim</em> (pinned) vào carrier, và vì mỗi nhân chỉ có một carrier, vài luồng bị ghim là mọi thứ đứng:</p>
${MA25_PIN}
${OUT25_PIN}
<p>100 việc độc lập (không hề tranh khoá) mất 2,5 giây với <code>synchronized</code>: 4 carrier × 25 đợt × 100 ms. Cùng việc đó với <code>ReentrantLock</code> mất 0,1 giây, vì virtual thread chờ trong khoá của <code>java.util.concurrent</code> thì vẫn tháo ra được. <code>-Djdk.tracePinnedThreads=short</code> in ra dòng gây ghim (<code>reason:MONITOR</code>, <code>Pinning.java:8</code>). Java 24 (JEP 491) đã gỡ hạn chế này cho <code>synchronized</code>, nhưng dự án Spring Boot 4 chạy Java 21 LTS — phần lớn dự án năm 2026 — vẫn còn: thay <code>synchronized</code> bao quanh I/O bằng <code>ReentrantLock</code>, và giữ thư viện (driver JDBC, HTTP client) ở bản mới, vì hầu hết đã làm như vậy.</p>

<h3>🕵️ Sự cố thật — Netflix, 2024</h3>
<div class="callout warn"><p>Netflix chuyển các dịch vụ sang Java 21 với virtual thread trong Spring Boot và tháng 7/2024 công bố chuyện xảy ra sau đó trên blog kỹ thuật ("Java 21 Virtual Threads — Dude, Where's My Lock?"). Một số máy <strong>ngừng phục vụ hoàn toàn</strong> dù JVM vẫn sống; kết nối dồn ứ ở trạng thái <code>CLOSE_WAIT</code>. Heap dump cho thấy nguyên nhân: trên máy 4 vCPU, cả <strong>4 carrier đều bị ghim</strong> bởi các virtual thread chặn bên trong mã <code>synchronized</code> (trong một thư viện tracing), còn virtual thread sẽ nhả khoá mà chúng đang chờ thì không có carrier nào để chạy — một deadlock mà thread dump thông thường không hiện ra. Cách sửa: tránh <code>synchronized</code> quanh lời gọi chặn, và cuối cùng chính JDK gỡ bỏ vấn đề bằng JEP 491 (Java 24).</p>
<p><strong>Bài học:</strong> virtual thread dùng được cho production, nhưng trên Java 21 phải rà <code>synchronized</code> + I/O (mã của bạn và thư viện), chạy <code>-Djdk.tracePinnedThreads</code> ở môi trường staging, đo tải trước khi bật (Chương 16), và nhớ rằng số carrier bằng số CPU mà container của bạn thấy.</p></div>

<h3>Những gì virtual thread không sửa được</h3>
${MA25_DB}
${OUT25_DB}
<ul>
  <li><strong>Pool cơ sở dữ liệu vẫn là nút thắt.</strong> HikariCP mặc định 10 kết nối. 1 000 virtual thread, mỗi cái cần một truy vấn 100 ms, mất 10 giây — y như khi chỉ có 10 luồng. Virtual thread gỡ giới hạn <em>luồng</em>, không gỡ giới hạn của PostgreSQL. Chọn cỡ pool theo sức cơ sở dữ liệu (Chương 16), và chấp nhận request chờ kết nối thay vì chờ luồng.</li>
  <li><strong>Việc nặng CPU không nhanh hơn.</strong> Số carrier vẫn bằng số nhân. Băm mật khẩu, đổi cỡ ảnh, tính toán lớn: không lợi gì.</li>
  <li><strong>Đừng gom virtual thread vào pool.</strong> Tạo chúng rất rẻ; mỗi việc một luồng. Muốn giới hạn số lời gọi đồng thời tới một dịch vụ yếu, dùng <code>Semaphore</code> như trên, đừng dùng pool nhỏ.</li>
  <li><strong>Bộ đệm ThreadLocal thành của từng request.</strong> Mã cất đối tượng đắt trong <code>ThreadLocal</code> vốn giả định có 200 luồng sống lâu; mỗi request một virtual thread thì bộ đệm bị dựng lại mỗi lần. (Java 25 có scoped value làm lựa chọn hiện đại.)</li>
</ul>

<h3>So với Node.js</h3>
<p>Node.js xử lý 1 000 request đang chờ trên một luồng vì mọi lần chờ là một callback: bạn phải viết <code>await</code> ở mọi lời gọi I/O, và chỉ một lời gọi đồng bộ hay nặng CPU lỡ tay là chặn <em>mọi</em> request. Virtual thread cho Java cùng khả năng mở rộng với server nặng I/O mà vẫn giữ mã chặn viết thẳng, stack trace thật, và dùng được mọi nhân. Câu trả lời phỏng vấn: "Node dùng một vòng lặp sự kiện và hàm async; Java 21 dùng nhiều virtual thread rẻ và mã chặn bình thường — cả hai làm việc chờ trở nên rẻ; Java còn chạy trên mọi nhân, Node cần cluster/worker mới làm được."</p>

<h3>Hình ảnh đời thường</h3>
<p>Luồng nền tảng là 200 người phục vụ đứng trong bếp chờ món chín. Virtual thread là phiếu gọi món: người phục vụ kẹp phiếu lên thanh rồi đi phục vụ bàn khác; món xong thì người nào rảnh cầm phiếu mang ra. Vẫn chỉ có 4 người phục vụ (carrier), nhưng không ai đứng không. Pinning là người phục vụ tự còng tay mình vào quầy bếp (<code>synchronized</code>) trong lúc chờ — trên Java 21 anh ta không đi được cho tới khi món chín.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Virtual thread là gì, khác luồng nền tảng thế nào?"</strong> — Luồng do JVM quản lý, stack nằm trên heap; được gắn lên một carrier là luồng nền tảng khi chạy và tháo ra khi chặn, nên có thể có hàng triệu cái. Luồng nền tảng là luồng hệ điều hành.</li>
  <li><strong>"Virtual thread có làm mã nhanh hơn không?"</strong> — Tăng thông lượng cho việc nặng I/O vì gỡ giới hạn số luồng; không tăng tốc việc nặng CPU, và nút thắt kế tiếp (pool DB, dịch vụ phía sau) vẫn còn đó.</li>
  <li><strong>"Pinning là gì?"</strong> — Trên Java 21, virtual thread chặn trong <code>synchronized</code> (hoặc khung native) không tháo ra được và chặn luôn carrier. Dùng <code>ReentrantLock</code>; Java 24 đã sửa cho <code>synchronized</code>.</li>
  <li><strong>"Bật virtual thread trong Spring Boot thế nào?"</strong> — <code>spring.threads.virtual.enabled=true</code> trên Java 21+; khi đó Tomcat, <code>@Async</code> và lập lịch dùng virtual thread.</li>
  <li><strong>"Có nên gom virtual thread vào pool?"</strong> — Không; mỗi việc một luồng, cần giới hạn đồng thời thì dùng semaphore.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>Pinning.java</code> với <code>-Djdk.virtualThreadScheduler.parallelism=8</code>. Đoán thời gian bản <code>synchronized</code> trước.</li>
  <li>Trong <code>DbPool.java</code>, đổi semaphore thành 50 giấy phép. Đoán, chạy, và giải thích vì sao PostgreSQL thật có thể chậm hơn dự đoán.</li>
  <li>Viết lại <code>Cf.java</code> của bài 2.3 cho ba lời gọi chạy trên <code>Executors.newVirtualThreadPerTaskExecutor()</code>, xác nhận tổng vẫn ≈ 400 ms.</li>
</ol>
<p><strong>Đạt khi:</strong> bài 1 cho ≈ 1,3 giây với <code>synchronized</code>, bài 2 cho ≈ 2 giây, và bài 3 in cùng trang trong ≈ 400 ms.</p></div>
${giai('Xem lập luận', `<p>1 — 8 carrier: 100 việc bị ghim, mỗi việc 100 ms, chạy thành ⌈100 / 8⌉ = 13 đợt ≈ 1,3 giây. Bản <code>ReentrantLock</code> không đổi (≈ 0,1 giây).</p>
<p>2 — 1 000 truy vấn ÷ 50 kết nối = 20 đợt × 100 ms ≈ 2 giây. Cơ sở dữ liệu thật không chạy 50 truy vấn nhanh như 10: chúng tranh nhau CPU, đĩa và khoá, nên thời gian mỗi truy vấn tăng theo mức đồng thời — vì vậy pool to hơn không tự động tốt hơn (Chương 16 sẽ đo).</p>
${java(`
try (ExecutorService io = Executors.newVirtualThreadPerTaskExecutor()) {
    CompletableFuture<String> fLab = CompletableFuture.supplyAsync(() -> lab(1), io);
    // … phần còn lại của Cf.java giữ nguyên
}`)}`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Virtual thread</span><span class="v">Luồng nhẹ do JVM lập lịch (JEP 444, Java 21), stack nằm trên heap.</span></div>
  <div class="kv"><span class="k">Carrier thread</span><span class="v">Luồng nền tảng trong ForkJoinPool của JVM, nơi virtual thread được gắn lên; mặc định mỗi nhân một cái.</span></div>
  <div class="kv"><span class="k">Gắn / tháo (mount / unmount)</span><span class="v">Gắn virtual thread lên carrier để chạy; tháo ra khi nó chặn.</span></div>
  <div class="kv"><span class="k">Pinning (bị ghim)</span><span class="v">Virtual thread không tháo được khi chặn (trong synchronized trên Java 21–23, hoặc mã native), chiếm luôn carrier.</span></div>
  <div class="kv"><span class="k">spring.threads.virtual.enabled</span><span class="v">Thuộc tính Spring Boot cho request Tomcat, @Async và lập lịch chạy trên virtual thread.</span></div>
  <div class="kv"><span class="k">Semaphore</span><span class="v">Bộ đếm giấy phép dùng để giới hạn bao nhiêu luồng làm một việc cùng lúc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Virtual thread làm việc chặn trở nên rẻ: 100 000 luồng đang ngủ trên 27 luồng hệ điều hành.</li>
  <li>Một thuộc tính trong Spring Boot: 1 000 request chậm từ 5,2 giây xuống ≈ 1,3 giây, mã giữ nguyên.</li>
  <li>Pinning trên Java 21: không I/O chặn bên trong <code>synchronized</code> — dùng <code>ReentrantLock</code> (Java 24 đã sửa).</li>
  <li>Pool DB, CPU và dịch vụ phía sau vẫn là giới hạn; đừng gom virtual thread vào pool, giới hạn bằng semaphore.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://openjdk.org/jeps/444', '📄', 'JEP 444: Virtual Threads', 'Thiết kế, lập lịch, pinning và hướng dẫn áp dụng.')}
${tl('https://netflixtechblog.com/java-21-virtual-threads-dude-wheres-my-lock-3052540e231d', '📰', 'Netflix — Java 21 Virtual Threads: Dude, Where’s My Lock?', 'Toàn bộ cuộc điều tra deadlock do pinning, có phân tích heap dump.')}

<h3>Nguồn</h3>
<ul>
  <li>JEP 444 (Java 21) và JEP 491 "Synchronize Virtual Threads without Pinning" (Java 24): <a href="https://openjdk.org/jeps/491" target="_blank" rel="noopener">openjdk.org/jeps/491</a></li>
  <li>Tài liệu Spring Boot, mục "Virtual threads": <a href="https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html" target="_blank" rel="noopener">docs.spring.io/spring-boot</a></li>
  <li>Netflix Technology Blog, 29/7/2024.</li>
  <li>Output phía trên: demo Java trên Temurin 21.0.12.1, ứng dụng Spring Boot 4.1.2 trên Temurin 21.0.13 (ảnh JRE), container giới hạn 4 CPU — chạy ngày 18/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 2.6 =====
const MA26_DEEP = java("public class Deep {\n    static int depth = 0;\n    static void down() { depth++; down(); }       // đệ quy không có điểm dừng\n    public static void main(String[] args) {\n        try { down(); }\n        catch (StackOverflowError e) { System.out.println(\"StackOverflowError at depth \" + depth); }\n    }\n}");
const OUT26_DEEP = out("$ java Deep.java\nStackOverflowError at depth 21988\n$ java -Xss256k Deep.java\nStackOverflowError at depth 2242\n$ java -Xss4m Deep.java\nStackOverflowError at depth 100873");
const MA26_LEAK = java("import java.util.*;\n\npublic class Leak {\n    // \"Cache\" không bao giờ xoá: mỗi request thêm một bản báo cáo 100 KB\n    static final Map<Long, byte[]> REPORT_CACHE = new HashMap<>();\n\n    public static void main(String[] args) {\n        long rt = Runtime.getRuntime().maxMemory() / (1024 * 1024);\n        System.out.println(\"max heap = \" + rt + \" MB\");\n        for (long req = 1; ; req++) {\n            REPORT_CACHE.put(req, new byte[100 * 1024]);\n            if (req % 100 == 0) System.out.println(\"requests served: \" + req);\n            if (args.length > 0) try { Thread.sleep(Long.parseLong(args[0])); } catch (InterruptedException e) {}\n        }\n    }\n}");
const OUT26_LEAK = out("$ java -Xmx64m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=dumps/ Leak 10\n# after ~3 s, in another terminal:\n$ jcmd <pid> GC.heap_info | head -3\n garbage-first heap   total 51200K, used 34324K [0x00000000fc000000, 0x0000000100000000)\n  region size 1024K, 3 young (3072K), 1 survivors (1024K)\n$ jcmd <pid> GC.class_histogram | head -6\n num     #instances         #bytes  class name (module)\n-------------------------------------------------------\n   1:          8409       34355088  [B (java.base@21.0.12.1)\n   2:           560         686992  [Ljdk.internal.vm.FillerElement; (java.base@21.0.12.1)\n   3:          7996         191904  java.lang.String (java.base@21.0.12.1)\n# program output:\nmax heap = 64 MB\n...\nrequests served: 600\njava.lang.OutOfMemoryError: Java heap space\nDumping heap to /tmp/d/java_pid32.hprof ...\nHeap dump file created [67551300 bytes in 0.022 secs]\n\nException: java.lang.OutOfMemoryError thrown from the UncaughtExceptionHandler in thread \"main\"\n[exit 1]\n$ ls -lh dumps/\n65M java_pid32.hprof");
const MA26_HICCUP = java("import java.util.*;\n\n/** Giả lập server: giữ ~300 MB dữ liệu sống (cache) và liên tục tạo rác ngắn hạn;\n *  một luồng \"request\" ngủ 1 ms rồi đo nó bị trễ thêm bao lâu (do GC dừng thế giới). */\npublic class Hiccup {\n    static volatile long maxHiccupUs = 0;\n    public static void main(String[] args) throws Exception {\n        Thread probe = new Thread(() -> {\n            while (true) {\n                long t = System.nanoTime();\n                try { Thread.sleep(1); } catch (InterruptedException e) { return; }\n                long late = (System.nanoTime() - t) / 1000 - 1000;\n                if (late > maxHiccupUs) maxHiccupUs = late;\n            }\n        });\n        probe.setDaemon(true); probe.start();\n\n        List<byte[]> live = new ArrayList<>();\n        for (int i = 0; i < 300; i++) live.add(new byte[1024 * 1024]);       // 300 MB sống lâu\n        Random r = new Random(42);\n        long end = System.currentTimeMillis() + 10_000, allocated = 0;\n        while (System.currentTimeMillis() < end) {\n            byte[] tmp = new byte[16 * 1024];                                 // rác ngắn hạn\n            allocated += tmp.length;\n            if (r.nextInt(200) == 0) live.set(r.nextInt(live.size()), new byte[1024 * 1024]);  // thay dần cache\n        }\n        System.out.printf(\"allocated %,d MB in 10 s, worst extra delay seen by a 1 ms request: %.1f ms%n\",\n            allocated >> 20, maxHiccupUs / 1000.0);\n    }\n}");
const OUT26_HICCUP = out("$ java -Xmx1g -XX:+UseSerialGC Hiccup        # run 1\nallocated 107,094 MB in 10 s, worst extra delay seen by a 1 ms request: 92.5 ms\n$ java -Xmx1g -XX:+UseSerialGC Hiccup        # run 2\nallocated 95,844 MB in 10 s, worst extra delay seen by a 1 ms request: 104.4 ms\n$ java -Xmx1g -XX:+UseParallelGC Hiccup        # run 1\nallocated 197,056 MB in 10 s, worst extra delay seen by a 1 ms request: 57.3 ms\n$ java -Xmx1g -XX:+UseParallelGC Hiccup        # run 2\nallocated 198,953 MB in 10 s, worst extra delay seen by a 1 ms request: 43.8 ms\n$ java -Xmx1g -XX:+UseG1GC Hiccup        # run 1\nallocated 254,960 MB in 10 s, worst extra delay seen by a 1 ms request: 8.9 ms\n$ java -Xmx1g -XX:+UseG1GC Hiccup        # run 2\nallocated 215,316 MB in 10 s, worst extra delay seen by a 1 ms request: 6.8 ms\n$ java -Xmx1g -XX:+UseZGC -XX:+ZGenerational Hiccup        # run 1\nallocated 182,204 MB in 10 s, worst extra delay seen by a 1 ms request: 7.7 ms\n$ java -Xmx1g -XX:+UseZGC -XX:+ZGenerational Hiccup        # run 2\nallocated 181,541 MB in 10 s, worst extra delay seen by a 1 ms request: 6.9 ms");
const OUT26_GCLOG = out("# one line of -Xlog:gc from each collector:\n  Serial  : GC(0) Pause Young (Allocation Failure) 8M->8M(30M) 5.304ms\n  Parallel: GC(0) Pause Young (Allocation Failure) 8M->8M(31M) 1.838ms\n  G1      : GC(0) Pause Young (Concurrent Start) (G1 Humongous Allocation) 14M->13M(34M) 0.526ms\n  ZGC     : GC(3) Minor Collection (Allocation Rate)");
const OUT26_CONT = out("$ docker run --memory 512m --cpus 2 eclipse-temurin:21-jre java -XX:+PrintFlagsFinal -XshowSettings:system -version | grep -E \"MaxHeapSize|Memory Limit|CPU Count\"\n  MaxHeapSize = 134217728\n  Effective CPU Count: 2\n  Memory Limit: 512.00M\n$ docker run --memory 2g --cpus 2 eclipse-temurin:21-jre java -XX:+PrintFlagsFinal -XshowSettings:system -version | grep -E \"MaxHeapSize|Memory Limit|CPU Count\"\n  MaxHeapSize = 536870912\n  Effective CPU Count: 2\n  Memory Limit: 2.00G\n$ docker run --memory 512m eclipse-temurin:21-jre java -XX:MaxRAMPercentage=75 -XX:+PrintFlagsFinal -version | grep MaxHeapSize\n  MaxHeapSize = 402653184");
const MA26_FILL = java("import java.util.*;\n\npublic class Fill {\n    public static void main(String[] args) {\n        List<byte[]> keep = new ArrayList<>();\n        for (int mb = 1; mb <= 400; mb++) {\n            keep.add(new byte[1024 * 1024]);\n            Arrays.fill(keep.get(mb - 1), (byte) 1);        // chạm thật vào bộ nhớ\n            if (mb % 100 == 0) System.out.println(\"holding \" + mb + \" MB\");\n        }\n        System.out.println(\"done\");\n    }\n}");
const OUT26_OOMK = out("$ docker run --memory 256m --memory-swap 256m eclipse-temurin:21-jre java -Xmx1g Fill; echo \"exit=$?\"\nholding 100 MB\nholding 200 MB\nexit=137\n$ docker inspect -f \"OOMKilled={{.State.OOMKilled}}\" <container>\nOOMKilled=true\n$ docker run --memory 256m --memory-swap 256m eclipse-temurin:21-jre java -XX:MaxRAMPercentage=75 Fill; echo \"exit=$?\"\nholding 100 MB\nException in thread \"main\" java.lang.OutOfMemoryError: Java heap space\n\tat Fill.main(Fill.java:7)\nexit=1");
const OUT26_JFR = out("$ java -XX:StartFlightRecording=filename=rec.jfr,settings=profile -Xmx1g -cp cls Hiccup\nallocated 243,413 MB in 10 s, worst extra delay seen by a 1 ms request: 9.7 ms\n$ jfr view gc-pauses rec.jfr\nGC Pauses\n---------\nTotal Pause Time: 1.32 s\nNumber of Pauses: 2,977\nMinimum Pause Time: 0.0291 ms\nMedian Pause Time: 0.322 ms\nAverage Pause Time: 0.444 ms\nP90 Pause Time: 0.756 ms\nP95 Pause Time: 1.20 ms\nP99 Pause Time: 3.55 ms\nP99.9% Pause Time: 6.80 ms\nMaximum Pause Time: 6.80 ms\n$ jfr view allocation-by-site rec.jfr | head -8\n                               Allocation by Site\nMethod                                                      Allocation Pressure\n----------------------------------------------------------- -------------------\nHiccup.main(String[])                                                    99.97%\njava.util.Arrays.copyOf(Object[], int, Class)                             0.03%\njava.util.concurrent.ConcurrentHashMap.initTable()                        0.00%");

const L26_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>JVM memory and garbage collection</h2>
<p class="lead">"Explain heap vs stack", "what is a memory leak in Java if there is a garbage collector?", "why did the pod restart with exit code 137?" — these are the JVM questions a backend developer meets in interviews and, worse, at 2 a.m. You do not need to tune GC flags for a living; you need a correct mental model of where objects live, how the collector frees them, what the different collectors trade, how the JVM sizes itself inside a container, and which tools show you what is happening. Every number below is from a real run.</p>

<h3>The memory areas of one JVM</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Heap</span><span class="v">Every object (<code>new</code>), every array, every record, every Spring bean. Shared by all threads. Managed by the garbage collector. Size: <code>-Xmx</code>.</span></div>
  <div class="kv"><span class="k">Thread stacks</span><span class="v">One per platform thread: frames with local variables and references (the objects themselves are on the heap). Size per thread: <code>-Xss</code>. Virtual threads keep their stacks on the heap (lesson 2.5).</span></div>
  <div class="kv"><span class="k">Metaspace</span><span class="v">Class metadata: every class Spring, Hibernate and your code load — including the proxy classes generated at runtime (Chapter 3). Native memory, grows on demand; <code>-XX:MaxMetaspaceSize</code>.</span></div>
  <div class="kv"><span class="k">Code cache, GC structures, direct buffers</span><span class="v">JIT-compiled code, collector bookkeeping, NIO buffers used by Tomcat/Netty. Also outside the heap — which is why a JVM uses more memory than <code>-Xmx</code>.</span></div>
</div>

<h3>Stack: deep recursion overflows it</h3>
${MA26_DEEP}
${OUT26_DEEP}
<p>Same code, three stack sizes, three depths (≈ 2 000 frames with 256 KB, ≈ 22 000 with the default 1 MB, ≈ 100 000 with 4 MB). A <code>StackOverflowError</code> in a Spring app is almost never "the stack is too small"; it is an accidental infinite recursion — a classic is two JPA entities whose <code>toString</code> or JSON serialisation call each other (<code>Lab → bookings → lab → …</code>, Chapter 6).</p>

<h3>Heap: how garbage collection works</h3>
<p>An object is <strong>alive</strong> if it can be reached by following references from a <strong>GC root</strong>: local variables on thread stacks, static fields, JNI references. Everything else is garbage and its memory can be reused. Most collectors are <strong>generational</strong> because of the "weak generational hypothesis": most objects die young (a DTO lives for one request), a few live long (caches, beans). New objects are allocated in the <em>young generation</em>, collected often and cheaply; survivors are promoted to the <em>old generation</em>, collected rarely.</p>
<p>So in Java a <strong>memory leak</strong> is not "forgot to free" — it is "still reachable but never used again". The most common one in a server is an unbounded cache in a static field or a singleton bean:</p>
${MA26_LEAK}
${OUT26_LEAK}
<ul>
  <li><code>GC.heap_info</code>: G1 heap, 34 MB used of the 64 MB maximum and climbing.</li>
  <li><code>GC.class_histogram</code> ranks classes by bytes: <code>[B</code> (byte arrays), 8 409 instances, 34 MB — the leak is visible in one command, without a debugger.</li>
  <li>After 600 "requests" the heap is full of reachable data; the GC cannot free anything and the JVM throws <code>OutOfMemoryError: Java heap space</code>. Note the last line: the program could not even report the error properly — after an OOM the process is in an unknown state. In production, add <code>-XX:+ExitOnOutOfMemoryError</code> so the orchestrator restarts it cleanly.</li>
  <li><code>-XX:+HeapDumpOnOutOfMemoryError</code> wrote a 65 MB <code>.hprof</code> snapshot — open it with Eclipse MAT or IntelliJ's profiler to see <em>who holds</em> the arrays (the "dominator tree" points straight to <code>REPORT_CACHE</code>).</li>
</ul>
<div class="pitfall"><p><strong>Security trap — heap dumps contain secrets.</strong> A heap dump holds every string in memory: database passwords, JWT signing keys, users' tokens and personal data. Lesson 0.9 downloaded one through an exposed <code>/actuator/heapdump</code> endpoint and read the DB password out of it. Store dumps like credentials, never in a public bucket, and never expose that endpoint.</p></div>
<p>The fix for this leak is a bounded cache with eviction — <code>LinkedHashMap</code> with <code>removeEldestEntry</code> (lesson 1.5), Caffeine, or Redis outside the JVM (Chapter 13).</p>

<h3>Collectors compared: throughput vs pause time</h3>
<p>While the collector moves objects, it may have to <strong>stop the world</strong>: pause every application thread. A 100 ms pause is a 100 ms latency spike for every request in flight. The program below keeps 300 MB of live data (like a cache), allocates short-lived garbage as fast as it can, and has a probe thread that sleeps 1 ms in a loop and records how much later than expected it woke up:</p>
${MA26_HICCUP}
${OUT26_HICCUP}
${OUT26_GCLOG}
<div class="kv-grid">
  <div class="kv"><span class="k">Serial</span><span class="v">One GC thread, stops the world. Worst delay ≈ 92–104 ms and the lowest throughput (≈ 100 GB allocated). For tiny containers with 1 CPU.</span></div>
  <div class="kv"><span class="k">Parallel</span><span class="v">Several GC threads, still stop-the-world. Better throughput, worst delay ≈ 44–57 ms. For batch jobs where only total time matters.</span></div>
  <div class="kv"><span class="k">G1 (default)</span><span class="v">Heap split into regions; collects the regions with most garbage first, does marking concurrently, aims for a pause target (200 ms by default, usually far less). Here: highest throughput and worst delay ≈ 7–9 ms. The right default for Spring Boot.</span></div>
  <div class="kv"><span class="k">ZGC (generational, Java 21)</span><span class="v">Does almost all work concurrently; pauses are sub-millisecond regardless of heap size. Here ≈ 7–8 ms worst delay — the same as G1, because on a 1 GB heap with 4 busy CPUs the remaining delay is operating-system scheduling, not GC. ZGC pays off on large heaps (tens of GB) where G1's pauses grow. Java 23 made generational ZGC the only mode.</span></div>
</div>
<p>The honest conclusion from a real measurement: keep G1 unless a latency measurement on <em>your</em> service shows GC pauses are the problem; then try ZGC and measure again. "Switching GC" without measuring is cargo cult.</p>

<h3>Inside a container: -Xmx, RAM percentage and exit code 137</h3>
${OUT26_CONT}
<p>Since Java 10 the JVM reads the container's cgroup limits: with 512 MB it sees "Memory Limit: 512.00M" and picks a maximum heap of <strong>¼ of it — 128 MB</strong>; with 2 GB, 512 MB. That default wastes memory for a container that only runs one JVM, so production images set <code>-XX:MaxRAMPercentage=75</code> (384 MB here), leaving the rest for metaspace, thread stacks, code cache and buffers. What happens when the numbers are wrong:</p>
${MA26_FILL}
${OUT26_OOMK}
<ul>
  <li><strong><code>-Xmx1g</code> in a 256 MB container:</strong> the JVM believes it may use 1 GB. The kernel's OOM killer ends the process with <code>SIGKILL</code> — <strong>exit code 137</strong> (128 + 9), <code>OOMKilled=true</code>. No exception, no stack trace, no heap dump, no log line. In Kubernetes you see only <code>OOMKilled</code> and a restart counter.</li>
  <li><strong><code>MaxRAMPercentage=75</code>:</strong> the heap is capped below the container limit, so the JVM itself detects the problem and throws a normal <code>OutOfMemoryError</code> with a stack trace — which <code>-XX:+HeapDumpOnOutOfMemoryError</code> could capture.</li>
</ul>
<p>Rule: never hard-code <code>-Xmx</code> larger than the container; size with <code>MaxRAMPercentage</code> and leave 25 % for non-heap memory. Chapter 17 builds the Docker image with these flags.</p>

<h3>Tools: jcmd and Java Flight Recorder</h3>
<p><code>jcmd</code> talks to a running JVM: <code>GC.heap_info</code>, <code>GC.class_histogram</code>, <code>Thread.print</code> (lesson 2.4), <code>GC.heap_dump</code>, <code>VM.flags</code>. <strong>JDK Flight Recorder</strong> (JFR) records GC, allocation, locks, I/O and CPU samples with about 1 % overhead — safe to leave on in production — and <code>jfr view</code> (JDK 21) summarises a recording in the terminal:</p>
${OUT26_JFR}
<p>2 977 pauses in 10 s, median 0,32 ms, maximum 6,8 ms — matching the probe's 9,7 ms worst delay. And <code>allocation-by-site</code> names the method responsible for 99,97 % of allocation. On a real service this is how you find the endpoint that creates 2 GB of garbage per minute. Spring Boot Actuator (Chapter 15) exposes the same data as metrics: <code>jvm.gc.pause</code>, <code>jvm.memory.used</code>.</p>

<h3>🕵️ Real incident — Discord, 2020</h3>
<div class="callout warn"><p>Discord's "Read States" service tracks which messages each user has read, with a large in-memory LRU cache. In February 2020 they explained on their blog why they rewrote it: every two minutes latency and CPU spiked. The cause was the garbage collector — the Go runtime forced a collection at least every 2 minutes, and each one had to scan the whole huge cache even though almost nothing in it was garbage. Tuning did not remove the spikes; the team rewrote the service in Rust, which has no GC. (That service was in Go, but the lesson is runtime-independent.)</p>
<p><strong>For a Java backend:</strong> (1) a big long-lived cache inside the heap makes every old-generation collection more expensive — measure GC pauses (JFR, <code>jvm.gc.pause</code>) before blaming the database; (2) move large caches out of the heap (Redis, Chapter 13) or bound them; (3) on big heaps a concurrent collector (ZGC) exists precisely for this case — Java teams usually change the collector, not the language.</p></div>

<h3>Compared with Node.js</h3>
<p>V8 is also a generational GC (Scavenger for the young generation, Mark-Compact for the old) and also has a heap limit: <code>--max-old-space-size</code>, which you used in Node projects. "JavaScript heap out of memory" is Node's <code>OutOfMemoryError</code>; <code>node --heapsnapshot-signal</code> and Chrome DevTools are its heap-dump tools. The differences an interviewer likes: the JVM lets you choose among several collectors with different trade-offs and has JFR built in; Node gives one collector and is single-threaded for JavaScript, so a long GC pause stops the whole event loop.</p>

<h3>Everyday picture</h3>
<p>The heap is a shared office; the GC is the cleaner. A desk (object) is cleared only when nobody's name is on it any more (unreachable). New desks near the door (young generation) are cleared every evening because most visitors leave the same day; the archive room (old generation) is cleaned once a month because files there are kept for long. A memory leak is someone who stamps his name on every desk "just in case": the cleaner may not touch them, and one day there is no free desk. A stop-the-world pause is the cleaner asking everyone to stand up while he mops; ZGC is the cleaner who mops around people while they keep working.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Heap vs stack?"</strong> — The heap holds objects, shared by all threads, managed by GC; each thread's stack holds frames with local primitives and references. StackOverflowError = too deep recursion; OutOfMemoryError: Java heap space = too many reachable objects.</li>
  <li><strong>"How can Java leak memory if it has a garbage collector?"</strong> — Objects that are still reachable but no longer needed: unbounded caches, static collections, listeners never removed, ThreadLocals in pooled threads. Find them with a class histogram or a heap dump's dominator tree.</li>
  <li><strong>"Which GC does Java 21 use by default and how does it differ from ZGC?"</strong> — G1: region-based, generational, short pauses with a target, good throughput. ZGC: almost fully concurrent, sub-millisecond pauses even on huge heaps, slightly more CPU/memory overhead.</li>
  <li><strong>"Your Spring Boot pod restarts with exit code 137. What happened?"</strong> — The container exceeded its memory limit and the kernel OOM killer sent SIGKILL. Check that <code>-Xmx</code>/<code>MaxRAMPercentage</code> leaves room for non-heap memory, and look at memory metrics; a Java-level OOM would instead log an OutOfMemoryError.</li>
  <li><strong>"How would you investigate high latency spikes?"</strong> — Record with JFR (or check <code>jvm.gc.pause</code> metrics), look at GC pause distribution and allocation sites, thread dumps for lock contention; only then tune or switch collectors.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Fix <code>Leak.java</code> by turning <code>REPORT_CACHE</code> into a <code>LinkedHashMap</code> that keeps at most 100 entries. Run with <code>-Xmx64m</code> for 3 000 requests: no OOM.</li>
  <li>Run <code>Hiccup</code> with G1 and <code>-Xmx350m</code>, then <code>-Xmx600m</code>, then <code>-Xmx700m</code>. The program keeps only 300 MB of live data — why do the first two end in <code>OutOfMemoryError</code>?</li>
  <li>Run any program in <code>docker run --memory 1g</code> and print <code>Runtime.getRuntime().maxMemory()</code> with and without <code>-XX:MaxRAMPercentage=75</code>.</li>
</ol>
<p><strong>Done when:</strong> exercise 1 prints "requests served: 3000", you can explain exercise 2 in two sentences, and exercise 3 shows ≈ 256 MB vs ≈ 768 MB.</p></div>
${giai('Show one solution', `${java(`
static final Map<Long, byte[]> REPORT_CACHE = new LinkedHashMap<>(16, 0.75f, true) {   // access order = LRU
    @Override protected boolean removeEldestEntry(Map.Entry<Long, byte[]> eldest) {
        return size() > 100;                                                       // at most 100 × 100 KB = 10 MB
    }
};`)}
<p>2 — Real run: 350m and 600m die with <code>OutOfMemoryError</code> while the cache is being built (<code>Hiccup.java:19</code>); 700m runs (worst delay 6,8 ms). G1 divides the heap into regions of 1 MB at these sizes. An object of at least half a region is <strong>humongous</strong>: it gets its own contiguous regions. A <code>byte[1024 * 1024]</code> is 1 MB plus a 16-byte header, so each one occupies <em>two</em> regions — 300 "MB" of cache needs ≈ 600 MB of heap, plus head-room for the garbage. Lessons: large arrays cost more than their size under G1 (log tag <code>gc+humongous</code>), and a heap barely larger than the live data is the most common self-inflicted GC problem.</p>
<p>3 — Default: ¼ of 1 GB ≈ 256 MB; with <code>MaxRAMPercentage=75</code> ≈ 768 MB.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Heap / stack / metaspace</span><span class="v">Objects (shared, GC-managed) / per-thread frames / class metadata.</span></div>
  <div class="kv"><span class="k">GC root</span><span class="v">A starting point for reachability: thread stacks, static fields, JNI handles.</span></div>
  <div class="kv"><span class="k">Generational GC</span><span class="v">Young objects collected often and cheaply; survivors promoted to an old generation collected rarely.</span></div>
  <div class="kv"><span class="k">Stop-the-world pause</span><span class="v">A phase in which all application threads are paused for the collector.</span></div>
  <div class="kv"><span class="k">G1 / ZGC</span><span class="v">The default region-based collector / the low-latency concurrent collector.</span></div>
  <div class="kv"><span class="k">Memory leak (Java)</span><span class="v">Objects that remain reachable although the program will never use them again.</span></div>
  <div class="kv"><span class="k">Heap dump</span><span class="v">A snapshot of all heap objects (.hprof) for offline analysis; contains secrets.</span></div>
  <div class="kv"><span class="k">MaxRAMPercentage</span><span class="v">Maximum heap as a percentage of the memory the JVM sees (the container limit).</span></div>
  <div class="kv"><span class="k">OOMKilled / exit 137</span><span class="v">The kernel killed the process (SIGKILL) for exceeding its cgroup memory limit.</span></div>
  <div class="kv"><span class="k">JFR</span><span class="v">JDK Flight Recorder: low-overhead built-in event recorder (GC, allocation, locks, CPU).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Objects on the heap, frames on stacks, classes in metaspace; the JVM uses more than <code>-Xmx</code>.</li>
  <li>GC frees what is unreachable; a leak is what stays reachable. Histogram first, heap dump second — and protect dumps.</li>
  <li>G1 is the right default; ZGC for huge heaps and strict latency — decide by measuring.</li>
  <li>In containers use <code>MaxRAMPercentage</code>; exit 137 = OOMKilled by the kernel, not a Java exception.</li>
  <li><code>jcmd</code> and JFR (<code>jfr view</code>) show what the JVM is doing in production.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.oracle.com/en/java/javase/21/gctuning/', '📄', 'HotSpot GC Tuning Guide (Java 21)', 'Generations, G1, ZGC, ergonomics and container sizing.')}
${tl('https://docs.oracle.com/en/java/javase/21/jfapi/', '📄', 'JDK Flight Recorder API guide', 'Recording, custom events and reading .jfr files.')}

<h3>Sources</h3>
<ul>
  <li>Discord Engineering, "Why Discord is switching from Go to Rust", February 2020: <a href="https://discord.com/blog/why-discord-is-switching-from-go-to-rust" target="_blank" rel="noopener">discord.com/blog</a></li>
  <li>JEP 439: Generational ZGC (Java 21); JEP 474: ZGC generational mode by default (Java 23): <a href="https://openjdk.org/jeps/439" target="_blank" rel="noopener">openjdk.org/jeps/439</a></li>
  <li>Outputs above: Temurin 21.0.12.1 JDK in a container limited to 4 CPUs / 2 GB; the <code>docker run … eclipse-temurin:21-jre</code> lines used Temurin 21.0.13 — run on 18/11/2026.</li>
</ul>
</div>
`;

const L26_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Bộ nhớ JVM và thu gom rác</h2>
<p class="lead">"Giải thích heap và stack", "Java có bộ thu gom rác thì rò bộ nhớ kiểu gì?", "vì sao pod khởi động lại với mã thoát 137?" — đó là những câu hỏi JVM mà người làm backend gặp khi phỏng vấn và, tệ hơn, lúc 2 giờ sáng. Bạn không cần sống bằng nghề chỉnh cờ GC; bạn cần một mô hình đúng: đối tượng sống ở đâu, bộ thu gom giải phóng chúng thế nào, các bộ thu gom đánh đổi gì, JVM tự định cỡ ra sao trong container, và công cụ nào cho bạn thấy điều đang xảy ra. Mọi con số dưới đây đều từ lần chạy thật.</p>

<h3>Các vùng bộ nhớ của một JVM</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Heap</span><span class="v">Mọi đối tượng (<code>new</code>), mọi mảng, mọi record, mọi bean Spring. Mọi luồng dùng chung. Bộ thu gom rác quản lý. Kích thước: <code>-Xmx</code>.</span></div>
  <div class="kv"><span class="k">Stack của luồng</span><span class="v">Mỗi luồng nền tảng một stack: các khung chứa biến cục bộ và tham chiếu (bản thân đối tượng nằm trên heap). Cỡ mỗi luồng: <code>-Xss</code>. Virtual thread giữ stack trên heap (bài 2.5).</span></div>
  <div class="kv"><span class="k">Metaspace</span><span class="v">Siêu dữ liệu lớp: mọi lớp mà Spring, Hibernate và mã của bạn nạp — kể cả các lớp proxy sinh lúc chạy (Chương 3). Bộ nhớ native, lớn dần theo nhu cầu; <code>-XX:MaxMetaspaceSize</code>.</span></div>
  <div class="kv"><span class="k">Code cache, cấu trúc GC, buffer trực tiếp</span><span class="v">Mã đã biên dịch JIT, sổ sách của bộ thu gom, buffer NIO mà Tomcat/Netty dùng. Cũng nằm ngoài heap — vì thế JVM dùng nhiều bộ nhớ hơn <code>-Xmx</code>.</span></div>
</div>

<h3>Stack: đệ quy sâu làm tràn</h3>
${MA26_DEEP}
${OUT26_DEEP}
<p>Cùng mã, ba cỡ stack, ba độ sâu (≈ 2 000 khung với 256 KB, ≈ 22 000 với 1 MB mặc định, ≈ 100 000 với 4 MB). <code>StackOverflowError</code> trong ứng dụng Spring hầu như không bao giờ là "stack nhỏ quá"; nó là đệ quy vô hạn ngoài ý muốn — kinh điển là hai entity JPA có <code>toString</code> hay việc chuyển JSON gọi qua lại nhau (<code>Lab → bookings → lab → …</code>, Chương 6).</p>

<h3>Heap: thu gom rác chạy thế nào</h3>
<p>Một đối tượng còn <strong>sống</strong> nếu đi theo tham chiếu từ một <strong>gốc GC</strong> (GC root) tới được nó: biến cục bộ trên stack các luồng, field static, tham chiếu JNI. Mọi thứ khác là rác và bộ nhớ của nó được dùng lại. Hầu hết bộ thu gom là <strong>phân thế hệ</strong> vì "giả thuyết thế hệ yếu": phần lớn đối tượng chết trẻ (một DTO sống trong một request), số ít sống lâu (cache, bean). Đối tượng mới được cấp trong <em>thế hệ trẻ</em>, gom thường xuyên và rẻ; đối tượng sống sót được đưa lên <em>thế hệ già</em>, ít khi gom.</p>
<p>Nên trong Java, <strong>rò bộ nhớ</strong> không phải "quên giải phóng" — mà là "vẫn tới được nhưng không bao giờ dùng lại". Kiểu phổ biến nhất trên server là cache không giới hạn nằm trong field static hoặc bean singleton:</p>
${MA26_LEAK}
${OUT26_LEAK}
<ul>
  <li><code>GC.heap_info</code>: heap G1, đã dùng 34 MB trên tối đa 64 MB và đang tăng.</li>
  <li><code>GC.class_histogram</code> xếp các lớp theo số byte: <code>[B</code> (mảng byte), 8 409 đối tượng, 34 MB — chỗ rò hiện ra sau một lệnh, không cần debugger.</li>
  <li>Sau 600 "request", heap đầy dữ liệu còn tới được; GC không giải phóng được gì và JVM ném <code>OutOfMemoryError: Java heap space</code>. Để ý dòng cuối: chương trình còn không báo lỗi tử tế được — sau OOM tiến trình ở trạng thái không xác định. Trên production, thêm <code>-XX:+ExitOnOutOfMemoryError</code> để hệ thống điều phối khởi động lại nó sạch sẽ.</li>
  <li><code>-XX:+HeapDumpOnOutOfMemoryError</code> đã ghi ảnh chụp <code>.hprof</code> 65 MB — mở bằng Eclipse MAT hay profiler của IntelliJ để xem <em>ai đang giữ</em> các mảng (cây "dominator" chỉ thẳng tới <code>REPORT_CACHE</code>).</li>
</ul>
<div class="pitfall"><p><strong>Bẫy bảo mật — heap dump chứa bí mật.</strong> Heap dump giữ mọi chuỗi trong bộ nhớ: mật khẩu cơ sở dữ liệu, khoá ký JWT, token và dữ liệu cá nhân người dùng. Bài 0.9 đã tải một bản qua endpoint <code>/actuator/heapdump</code> bị mở và đọc được mật khẩu DB từ đó. Cất dump như cất thông tin đăng nhập, không bao giờ để ở bucket công khai, và không bao giờ mở endpoint đó.</p></div>
<p>Cách sửa chỗ rò này là cache có giới hạn và cơ chế loại bỏ — <code>LinkedHashMap</code> với <code>removeEldestEntry</code> (bài 1.5), Caffeine, hoặc Redis bên ngoài JVM (Chương 13).</p>

<h3>So các bộ thu gom: thông lượng vs thời gian dừng</h3>
<p>Trong lúc di chuyển đối tượng, bộ thu gom có thể phải <strong>dừng cả thế giới</strong> (stop the world): dừng mọi luồng ứng dụng. Một lần dừng 100 ms là một gai trễ 100 ms cho mọi request đang chạy. Chương trình dưới đây giữ 300 MB dữ liệu sống (như một cache), tạo rác ngắn hạn nhanh hết mức, và có một luồng thăm dò ngủ 1 ms liên tục rồi ghi lại nó thức dậy trễ hơn dự kiến bao lâu:</p>
${MA26_HICCUP}
${OUT26_HICCUP}
${OUT26_GCLOG}
<div class="kv-grid">
  <div class="kv"><span class="k">Serial</span><span class="v">Một luồng GC, dừng cả thế giới. Trễ tệ nhất ≈ 92–104 ms và thông lượng thấp nhất (≈ 100 GB đã cấp). Cho container rất nhỏ 1 CPU.</span></div>
  <div class="kv"><span class="k">Parallel</span><span class="v">Nhiều luồng GC, vẫn dừng cả thế giới. Thông lượng tốt hơn, trễ tệ nhất ≈ 44–57 ms. Cho việc chạy lô, nơi chỉ tổng thời gian là quan trọng.</span></div>
  <div class="kv"><span class="k">G1 (mặc định)</span><span class="v">Heap chia thành các vùng (region); gom trước các vùng nhiều rác nhất, đánh dấu song song với ứng dụng, nhắm một mục tiêu thời gian dừng (mặc định 200 ms, thường thấp hơn nhiều). Ở đây: thông lượng cao nhất và trễ tệ nhất ≈ 7–9 ms. Mặc định đúng cho Spring Boot.</span></div>
  <div class="kv"><span class="k">ZGC (phân thế hệ, Java 21)</span><span class="v">Làm gần như mọi việc song song với ứng dụng; thời gian dừng dưới một mili giây bất kể heap lớn cỡ nào. Ở đây trễ tệ nhất ≈ 7–8 ms — bằng G1, vì với heap 1 GB và 4 CPU bận rộn, phần trễ còn lại là do hệ điều hành lập lịch, không phải GC. ZGC có lợi trên heap lớn (vài chục GB), nơi thời gian dừng của G1 tăng lên. Java 23 chỉ còn chế độ ZGC phân thế hệ.</span></div>
</div>
<p>Kết luận trung thực từ số đo thật: giữ G1, trừ khi số đo độ trễ trên <em>chính dịch vụ của bạn</em> cho thấy thời gian dừng GC là vấn đề; khi đó thử ZGC và đo lại. "Đổi GC" mà không đo là làm theo phong trào.</p>

<h3>Trong container: -Xmx, tỷ lệ RAM và mã thoát 137</h3>
${OUT26_CONT}
<p>Từ Java 10, JVM đọc giới hạn cgroup của container: với 512 MB nó thấy "Memory Limit: 512.00M" và chọn heap tối đa bằng <strong>¼ — 128 MB</strong>; với 2 GB là 512 MB. Mặc định đó lãng phí với container chỉ chạy một JVM, nên ảnh production đặt <code>-XX:MaxRAMPercentage=75</code> (ở đây 384 MB), chừa phần còn lại cho metaspace, stack luồng, code cache và buffer. Khi các con số đặt sai:</p>
${MA26_FILL}
${OUT26_OOMK}
<ul>
  <li><strong><code>-Xmx1g</code> trong container 256 MB:</strong> JVM tưởng mình được dùng 1 GB. Bộ diệt OOM của nhân hệ điều hành kết liễu tiến trình bằng <code>SIGKILL</code> — <strong>mã thoát 137</strong> (128 + 9), <code>OOMKilled=true</code>. Không exception, không stack trace, không heap dump, không dòng log nào. Trên Kubernetes bạn chỉ thấy <code>OOMKilled</code> và bộ đếm khởi động lại.</li>
  <li><strong><code>MaxRAMPercentage=75</code>:</strong> heap bị chặn dưới giới hạn container, nên chính JVM phát hiện vấn đề và ném <code>OutOfMemoryError</code> bình thường kèm stack trace — thứ mà <code>-XX:+HeapDumpOnOutOfMemoryError</code> có thể chụp lại.</li>
</ul>
<p>Quy tắc: không bao giờ đặt cứng <code>-Xmx</code> lớn hơn container; định cỡ bằng <code>MaxRAMPercentage</code> và chừa 25 % cho bộ nhớ ngoài heap. Chương 17 dựng ảnh Docker với các cờ này.</p>

<h3>Công cụ: jcmd và Java Flight Recorder</h3>
<p><code>jcmd</code> nói chuyện với một JVM đang chạy: <code>GC.heap_info</code>, <code>GC.class_histogram</code>, <code>Thread.print</code> (bài 2.4), <code>GC.heap_dump</code>, <code>VM.flags</code>. <strong>JDK Flight Recorder</strong> (JFR) ghi GC, cấp phát, khoá, I/O và mẫu CPU với chi phí khoảng 1 % — để bật thường trực trên production được — và <code>jfr view</code> (JDK 21) tóm tắt bản ghi ngay trong terminal:</p>
${OUT26_JFR}
<p>2 977 lần dừng trong 10 giây, trung vị 0,32 ms, lớn nhất 6,8 ms — khớp với 9,7 ms trễ tệ nhất mà luồng thăm dò thấy. Và <code>allocation-by-site</code> gọi tên phương thức gây ra 99,97 % lượng cấp phát. Trên dịch vụ thật, đây là cách tìm endpoint tạo 2 GB rác mỗi phút. Spring Boot Actuator (Chương 15) đưa cùng dữ liệu đó ra thành số đo: <code>jvm.gc.pause</code>, <code>jvm.memory.used</code>.</p>

<h3>🕵️ Sự cố thật — Discord, 2020</h3>
<div class="callout warn"><p>Dịch vụ "Read States" của Discord theo dõi mỗi người dùng đã đọc tới tin nhắn nào, dùng một cache LRU rất lớn trong bộ nhớ. Tháng 2/2020 họ giải thích trên blog vì sao viết lại nó: cứ hai phút độ trễ và CPU lại vọt lên. Thủ phạm là bộ thu gom rác — runtime Go ép một lần thu gom ít nhất mỗi 2 phút, và mỗi lần phải quét toàn bộ cache khổng lồ dù trong đó gần như chẳng có gì là rác. Tinh chỉnh không xoá được các gai; nhóm viết lại dịch vụ bằng Rust, ngôn ngữ không có GC. (Dịch vụ đó viết bằng Go, nhưng bài học không phụ thuộc runtime.)</p>
<p><strong>Với backend Java:</strong> (1) cache lớn sống lâu trong heap làm mỗi lần gom thế hệ già đắt hơn — đo thời gian dừng GC (JFR, <code>jvm.gc.pause</code>) trước khi đổ lỗi cho cơ sở dữ liệu; (2) đưa cache lớn ra khỏi heap (Redis, Chương 13) hoặc giới hạn nó; (3) với heap lớn đã có bộ thu gom song song (ZGC) sinh ra đúng cho trường hợp này — nhóm Java thường đổi bộ thu gom chứ không đổi ngôn ngữ.</p></div>

<h3>So với Node.js</h3>
<p>V8 cũng là GC phân thế hệ (Scavenger cho thế hệ trẻ, Mark-Compact cho thế hệ già) và cũng có giới hạn heap: <code>--max-old-space-size</code>, thứ bạn đã dùng trong dự án Node. "JavaScript heap out of memory" là <code>OutOfMemoryError</code> của Node; <code>node --heapsnapshot-signal</code> và Chrome DevTools là công cụ heap dump của nó. Khác biệt mà phỏng vấn viên thích hỏi: JVM cho chọn nhiều bộ thu gom với đánh đổi khác nhau và có sẵn JFR; Node chỉ có một bộ thu gom và JavaScript chạy một luồng, nên một lần dừng GC dài là dừng cả vòng lặp sự kiện.</p>

<h3>Hình ảnh đời thường</h3>
<p>Heap là văn phòng dùng chung; GC là người dọn dẹp. Một bàn (đối tượng) chỉ được dọn khi không còn ai ghi tên trên đó (không tới được). Bàn mới gần cửa (thế hệ trẻ) được dọn mỗi tối vì phần lớn khách về trong ngày; phòng lưu trữ (thế hệ già) dọn mỗi tháng một lần vì hồ sơ ở đó giữ lâu. Rò bộ nhớ là người cứ đóng dấu tên mình lên mọi bàn "phòng khi cần": người dọn không được đụng vào, và tới một ngày không còn bàn trống. Dừng cả thế giới là người dọn bảo mọi người đứng dậy cho anh lau sàn; ZGC là người dọn lau quanh chân mọi người trong lúc họ vẫn làm việc.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Heap khác stack?"</strong> — Heap chứa đối tượng, mọi luồng dùng chung, GC quản lý; stack của mỗi luồng chứa các khung với biến nguyên thuỷ cục bộ và tham chiếu. StackOverflowError = đệ quy quá sâu; OutOfMemoryError: Java heap space = quá nhiều đối tượng còn tới được.</li>
  <li><strong>"Java có GC thì rò bộ nhớ kiểu gì?"</strong> — Đối tượng vẫn tới được nhưng không còn cần: cache không giới hạn, collection static, listener không gỡ, ThreadLocal trong luồng của pool. Tìm bằng class histogram hoặc cây dominator của heap dump.</li>
  <li><strong>"Java 21 mặc định dùng GC nào, khác ZGC ra sao?"</strong> — G1: chia vùng, phân thế hệ, dừng ngắn có mục tiêu, thông lượng tốt. ZGC: gần như hoàn toàn song song, dừng dưới một mili giây kể cả heap rất lớn, tốn CPU/bộ nhớ hơn chút.</li>
  <li><strong>"Pod Spring Boot khởi động lại với mã thoát 137. Chuyện gì đã xảy ra?"</strong> — Container vượt giới hạn bộ nhớ và bộ diệt OOM của nhân gửi SIGKILL. Kiểm <code>-Xmx</code>/<code>MaxRAMPercentage</code> có chừa chỗ cho bộ nhớ ngoài heap không, và xem số đo bộ nhớ; còn OOM ở mức Java thì sẽ có log OutOfMemoryError.</li>
  <li><strong>"Bạn điều tra các gai độ trễ thế nào?"</strong> — Ghi bằng JFR (hoặc xem số đo <code>jvm.gc.pause</code>), xem phân bố thời gian dừng GC và nơi cấp phát, thread dump để tìm tranh khoá; sau đó mới chỉnh hoặc đổi bộ thu gom.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Sửa <code>Leak.java</code> bằng cách biến <code>REPORT_CACHE</code> thành <code>LinkedHashMap</code> giữ tối đa 100 mục. Chạy với <code>-Xmx64m</code> 3 000 request: không OOM.</li>
  <li>Chạy <code>Hiccup</code> với G1 và <code>-Xmx350m</code>, rồi <code>-Xmx600m</code>, rồi <code>-Xmx700m</code>. Chương trình chỉ giữ 300 MB dữ liệu sống — vì sao hai lần đầu kết thúc bằng <code>OutOfMemoryError</code>?</li>
  <li>Chạy một chương trình bất kỳ trong <code>docker run --memory 1g</code> và in <code>Runtime.getRuntime().maxMemory()</code> khi có và không có <code>-XX:MaxRAMPercentage=75</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bài 1 in "requests served: 3000", bạn giải thích được bài 2 trong hai câu, và bài 3 cho ≈ 256 MB so với ≈ 768 MB.</p></div>
${giai('Xem một lời giải', `${java(`
static final Map<Long, byte[]> REPORT_CACHE = new LinkedHashMap<>(16, 0.75f, true) {   // thứ tự truy cập = LRU
    @Override protected boolean removeEldestEntry(Map.Entry<Long, byte[]> eldest) {
        return size() > 100;                                                       // tối đa 100 × 100 KB = 10 MB
    }
};`)}
<p>2 — Chạy thật: 350m và 600m chết vì <code>OutOfMemoryError</code> ngay lúc dựng cache (<code>Hiccup.java:19</code>); 700m chạy được (trễ tệ nhất 6,8 ms). Ở các cỡ này G1 chia heap thành vùng 1 MB. Đối tượng lớn từ nửa vùng trở lên là <strong>humongous</strong>: nó được cấp các vùng liền nhau riêng. Một <code>byte[1024 * 1024]</code> là 1 MB cộng 16 byte đầu đối tượng, nên mỗi mảng chiếm <em>hai</em> vùng — cache 300 "MB" cần ≈ 600 MB heap, cộng thêm khoảng trống cho rác. Bài học: dưới G1 mảng lớn tốn hơn kích thước của nó (thẻ log <code>gc+humongous</code>), và heap chỉ nhỉnh hơn dữ liệu sống là lỗi GC tự gây ra phổ biến nhất.</p>
<p>3 — Mặc định: ¼ của 1 GB ≈ 256 MB; với <code>MaxRAMPercentage=75</code> ≈ 768 MB.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Heap / stack / metaspace</span><span class="v">Đối tượng (dùng chung, GC quản lý) / khung của từng luồng / siêu dữ liệu lớp.</span></div>
  <div class="kv"><span class="k">Gốc GC (GC root)</span><span class="v">Điểm xuất phát để xét tới được: stack các luồng, field static, tham chiếu JNI.</span></div>
  <div class="kv"><span class="k">GC phân thế hệ</span><span class="v">Đối tượng trẻ được gom thường xuyên và rẻ; đối tượng sống sót được đưa lên thế hệ già, ít khi gom.</span></div>
  <div class="kv"><span class="k">Dừng cả thế giới (stop-the-world)</span><span class="v">Giai đoạn mọi luồng ứng dụng bị dừng để bộ thu gom làm việc.</span></div>
  <div class="kv"><span class="k">G1 / ZGC</span><span class="v">Bộ thu gom chia vùng mặc định / bộ thu gom song song độ trễ thấp.</span></div>
  <div class="kv"><span class="k">Rò bộ nhớ (Java)</span><span class="v">Đối tượng vẫn tới được dù chương trình không bao giờ dùng lại.</span></div>
  <div class="kv"><span class="k">Heap dump</span><span class="v">Ảnh chụp mọi đối tượng trên heap (.hprof) để phân tích sau; có chứa bí mật.</span></div>
  <div class="kv"><span class="k">MaxRAMPercentage</span><span class="v">Heap tối đa tính theo phần trăm bộ nhớ JVM thấy (giới hạn của container).</span></div>
  <div class="kv"><span class="k">OOMKilled / mã thoát 137</span><span class="v">Nhân hệ điều hành giết tiến trình (SIGKILL) vì vượt giới hạn bộ nhớ của cgroup.</span></div>
  <div class="kv"><span class="k">JFR</span><span class="v">JDK Flight Recorder: bộ ghi sự kiện có sẵn, chi phí thấp (GC, cấp phát, khoá, CPU).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đối tượng trên heap, khung trên stack, lớp trong metaspace; JVM dùng nhiều hơn <code>-Xmx</code>.</li>
  <li>GC giải phóng thứ không tới được; rò là thứ vẫn tới được. Histogram trước, heap dump sau — và bảo vệ các bản dump.</li>
  <li>G1 là mặc định đúng; ZGC cho heap rất lớn và yêu cầu độ trễ khắt khe — quyết bằng số đo.</li>
  <li>Trong container dùng <code>MaxRAMPercentage</code>; thoát 137 = bị nhân hệ điều hành giết vì OOM, không phải exception Java.</li>
  <li><code>jcmd</code> và JFR (<code>jfr view</code>) cho thấy JVM đang làm gì trên production.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.oracle.com/en/java/javase/21/gctuning/', '📄', 'HotSpot GC Tuning Guide (Java 21)', 'Thế hệ, G1, ZGC, tự định cỡ và định cỡ trong container.')}
${tl('https://docs.oracle.com/en/java/javase/21/jfapi/', '📄', 'Hướng dẫn API JDK Flight Recorder', 'Ghi, sự kiện tự định nghĩa và đọc tệp .jfr.')}

<h3>Nguồn</h3>
<ul>
  <li>Discord Engineering, "Why Discord is switching from Go to Rust", 2/2020: <a href="https://discord.com/blog/why-discord-is-switching-from-go-to-rust" target="_blank" rel="noopener">discord.com/blog</a></li>
  <li>JEP 439: Generational ZGC (Java 21); JEP 474: ZGC mặc định phân thế hệ (Java 23): <a href="https://openjdk.org/jeps/439" target="_blank" rel="noopener">openjdk.org/jeps/439</a></li>
  <li>Output phía trên: Temurin 21.0.12.1 JDK trong container giới hạn 4 CPU / 2 GB; các dòng <code>docker run … eclipse-temurin:21-jre</code> dùng Temurin 21.0.13 — chạy ngày 18/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 2.7 =====
const MA27_STARTER = java("import java.time.*;\nimport java.util.*;\nimport java.util.concurrent.*;\nimport java.util.concurrent.atomic.*;\nimport java.util.stream.*;\n\n/** Lab chương 2 — TỆP KHỞI ĐẦU. Thống kê 200 000 lượt đặt LabFlow.\n *  Làm các TODO 2–6 rồi chạy: java LabStats.java — đạt khi in \"6/6 PASS\". */\npublic class LabStats {\n    enum Status { PENDING, APPROVED, REJECTED, CANCELLED }\n    record Booking(long id, String lab, String student, Status status, int hours, LocalDate date) {}\n\n    static final List<String> LABS = List.of(\"Lab AI\", \"Lab IoT\", \"Lab Mạng\", \"Lab Robot\", \"Lab Game\", \"Lab Cloud\");\n\n    /** Dữ liệu tất định: cùng seed ⇒ cùng 200 000 lượt đặt trên mọi máy. */\n    static List<Booking> generate(int n) {\n        Random r = new Random(2026);\n        Status[] st = Status.values();\n        LocalDate start = LocalDate.of(2026, 11, 1);\n        List<Booking> out = new ArrayList<>(n);\n        for (int i = 1; i <= n; i++) {\n            int s = r.nextInt(10);                       // 60 % APPROVED, 20 % PENDING, 10 % REJECTED, 10 % CANCELLED\n            Status status = s < 6 ? Status.APPROVED : s < 8 ? Status.PENDING : s < 9 ? Status.REJECTED : Status.CANCELLED;\n            out.add(new Booking(i, LABS.get(r.nextInt(LABS.size())), \"sv\" + (1 + r.nextInt(500)), status,\n                1 + r.nextInt(4), start.plusDays(r.nextInt(61))));\n        }\n        return List.copyOf(out);\n    }\n\n    // ===== Phần 1 — Stream =====\n    /** MẪU (đã làm sẵn): tổng giờ APPROVED theo lab, khoá sắp theo tên. */\n    static Map<String, Integer> approvedHoursPerLab(List<Booking> all) {\n        return all.stream().filter(b -> b.status() == Status.APPROVED)\n            .collect(Collectors.groupingBy(Booking::lab, TreeMap::new, Collectors.summingInt(Booking::hours)));\n    }\n    /** 3 sinh viên nhiều giờ APPROVED nhất; hoà thì tên nhỏ hơn đứng trước. Dạng \"sv12=57\". */\n    static List<String> top3Students(List<Booking> all) {\n        throw new UnsupportedOperationException(\"TODO 2\");\n    }\n    /** Tỉ lệ huỷ (CANCELLED / tổng) theo lab, làm tròn 0,1 %. */\n    static Map<String, Double> cancellationRate(List<Booking> all) {\n        throw new UnsupportedOperationException(\"TODO 3\");\n    }\n\n    // ===== Phần 2 — Optional =====\n    /** Ngày có nhiều giờ APPROVED nhất của một lab; lab không có lượt nào ⇒ rỗng. Hoà ⇒ ngày sớm hơn. */\n    static Optional<LocalDate> busiestDay(List<Booking> all, String lab) {\n        throw new UnsupportedOperationException(\"TODO 4\");\n    }\n\n    // ===== Phần 3 — Đồng thời =====\n    /** Bộ đếm theo trạng thái, được 8 luồng gọi cùng lúc. */\n    static class StatusCounter {\n        // TODO 5: đúng khi một luồng gọi, SAI khi 8 luồng gọi cùng lúc. Sửa cho an toàn luồng.\n        private final Map<Status, Integer> counts = new HashMap<>();\n        void record(Booking b) { counts.merge(b.status(), 1, Integer::sum); }\n        Map<Status, Long> snapshot() {\n            Map<Status, Long> m = new EnumMap<>(Status.class);\n            counts.forEach((k, v) -> m.put(k, (long) v));\n            return m;\n        }\n    }\n    static Map<Status, Long> countConcurrently(List<Booking> all, int threads) throws InterruptedException {\n        StatusCounter c = new StatusCounter();\n        int chunk = all.size() / threads;\n        try (ExecutorService ex = Executors.newFixedThreadPool(threads)) {\n            for (int t = 0; t < threads; t++) {\n                List<Booking> part = all.subList(t * chunk, t == threads - 1 ? all.size() : (t + 1) * chunk);\n                ex.submit(() -> part.forEach(c::record));\n            }\n        }\n        return c.snapshot();\n    }\n\n    // ===== Phần 4 — Gọi song song có hết giờ =====\n    /** \"API\" thông tin lab: 300 ms mỗi lần; Lab Cloud treo 5 s. */\n    static String fetchLabInfo(String lab) throws InterruptedException {\n        Thread.sleep(lab.equals(\"Lab Cloud\") ? 5_000 : 300);\n        return lab + \": open\";\n    }\n    /** Lấy thông tin 6 lab song song, mỗi lab tối đa 500 ms; quá hạn ⇒ \"<lab>: unknown\". Giữ thứ tự LABS. */\n    static List<String> fetchAll() {\n        throw new UnsupportedOperationException(\"TODO 6\");\n    }\n\n    // ===== Bộ kiểm =====\n    static int pass = 0, fail = 0;\n    static void check(String name, Object got, Object want) {\n        boolean ok = Objects.equals(String.valueOf(got), String.valueOf(want));\n        if (ok) pass++; else fail++;\n        System.out.println((ok ? \"PASS \" : \"FAIL \") + name + (ok ? \"\" : \"\\n     got  \" + got + \"\\n     want \" + want));\n    }\n    public static void main(String[] args) throws Exception {\n        List<Booking> all = generate(200_000);\n        System.out.println(all.size() + \" bookings, first = \" + all.get(0));\n        run(\"1 approvedHoursPerLab\", () -> approvedHoursPerLab(all),\n            \"{Lab AI=49966, Lab Cloud=49647, Lab Game=49774, Lab IoT=49679, Lab Mạng=49280, Lab Robot=49987}\");\n        run(\"2 top3Students\", () -> top3Students(all), \"[sv467=725, sv355=721, sv321=713]\");\n        run(\"3 cancellationRate\", () -> cancellationRate(all),\n            \"{Lab AI=10.0, Lab Cloud=9.9, Lab Game=9.9, Lab IoT=10.1, Lab Mạng=10.4, Lab Robot=10.0}\");\n        run(\"4 busiestDay\", () -> busiestDay(all, \"Lab AI\") + \" \" + busiestDay(all, \"Lab Bio\"), \"Optional[2026-12-12] Optional.empty\");\n        run(\"5 countConcurrently x5\", () -> {\n            Set<String> seen = new TreeSet<>();\n            for (int i = 0; i < 5; i++) seen.add(countConcurrently(all, 8).toString());\n            return seen;\n        }, \"[{PENDING=39907, APPROVED=119744, REJECTED=20260, CANCELLED=20089}]\");\n        run(\"6 fetchAll under 700 ms\", () -> {\n            long t0 = System.nanoTime();\n            List<String> r = fetchAll();\n            long ms = (System.nanoTime() - t0) / 1_000_000;\n            return r + (ms < 700 ? \" fast\" : \" SLOW \" + ms + \" ms\");\n        }, \"[Lab AI: open, Lab IoT: open, Lab Mạng: open, Lab Robot: open, Lab Game: open, Lab Cloud: unknown] fast\");\n        System.out.println(pass + \"/6 PASS\");\n    }\n    interface Check { Object get() throws Exception; }\n    static void run(String name, Check c, String want) {\n        try { check(name, c.get(), want); }\n        catch (UnsupportedOperationException e) { fail++; System.out.println(\"FAIL \" + name + \" — \" + e.getMessage()); }\n        catch (Exception e) { fail++; System.out.println(\"FAIL \" + name + \" — \" + e); }\n    }\n}");
const OUT27_STARTER = out("$ java LabStats.java        # starter, unchanged\n200000 bookings, first = Booking[id=1, lab=Lab Game, student=sv198, status=CANCELLED, hours=1, date=2026-12-30]\nPASS 1 approvedHoursPerLab\nFAIL 2 top3Students — TODO 2\nFAIL 3 cancellationRate — TODO 3\nFAIL 4 busiestDay — TODO 4\nFAIL 5 countConcurrently x5\n     got  [{PENDING=23448, APPROVED=41763, REJECTED=15524, CANCELLED=15486}, {PENDING=23801, APPROVED=45036, REJECTED=17217, CANCELLED=15824}, {PENDING=28546, APPROVED=61105, REJECTED=15956, CANCELLED=15943}, {PENDING=28637, APPROVED=49643, REJECTED=17649, CANCELLED=17387}, {PENDING=31464, APPROVED=63198, REJECTED=17753, CANCELLED=17412}]\n     want [{PENDING=39907, APPROVED=119744, REJECTED=20260, CANCELLED=20089}]\nFAIL 6 fetchAll under 700 ms — TODO 6\n1/6 PASS");
const OUT27_GIAI = out("$ java LabStats.java        # after all TODOs\n200000 bookings, first = Booking[id=1, lab=Lab Game, student=sv198, status=CANCELLED, hours=1, date=2026-12-30]\nPASS 1 approvedHoursPerLab\nPASS 2 top3Students\nPASS 3 cancellationRate\nPASS 4 busiestDay\nPASS 5 countConcurrently x5\nPASS 6 fetchAll under 700 ms\n6/6 PASS");
const MA27_GIAI = java("import java.time.*;\nimport java.util.*;\nimport java.util.concurrent.*;\nimport java.util.concurrent.atomic.*;\nimport java.util.stream.*;\n\n/** Lab chương 2 — LỜI GIẢI. Thống kê 200 000 lượt đặt LabFlow. */\npublic class LabStats {\n    enum Status { PENDING, APPROVED, REJECTED, CANCELLED }\n    record Booking(long id, String lab, String student, Status status, int hours, LocalDate date) {}\n\n    static final List<String> LABS = List.of(\"Lab AI\", \"Lab IoT\", \"Lab Mạng\", \"Lab Robot\", \"Lab Game\", \"Lab Cloud\");\n\n    /** Dữ liệu tất định: cùng seed ⇒ cùng 200 000 lượt đặt trên mọi máy. */\n    static List<Booking> generate(int n) {\n        Random r = new Random(2026);\n        Status[] st = Status.values();\n        LocalDate start = LocalDate.of(2026, 11, 1);\n        List<Booking> out = new ArrayList<>(n);\n        for (int i = 1; i <= n; i++) {\n            int s = r.nextInt(10);                       // 60 % APPROVED, 20 % PENDING, 10 % REJECTED, 10 % CANCELLED\n            Status status = s < 6 ? Status.APPROVED : s < 8 ? Status.PENDING : s < 9 ? Status.REJECTED : Status.CANCELLED;\n            out.add(new Booking(i, LABS.get(r.nextInt(LABS.size())), \"sv\" + (1 + r.nextInt(500)), status,\n                1 + r.nextInt(4), start.plusDays(r.nextInt(61))));\n        }\n        return List.copyOf(out);\n    }\n\n    // ===== Phần 1 — Stream =====\n    /** Tổng giờ APPROVED theo lab, khoá sắp theo tên. */\n    static Map<String, Integer> approvedHoursPerLab(List<Booking> all) {\n        return all.stream().filter(b -> b.status() == Status.APPROVED)\n            .collect(Collectors.groupingBy(Booking::lab, TreeMap::new, Collectors.summingInt(Booking::hours)));\n    }\n    /** 3 sinh viên nhiều giờ APPROVED nhất; hoà thì tên nhỏ hơn đứng trước. Dạng \"sv12=57\". */\n    static List<String> top3Students(List<Booking> all) {\n        return all.stream().filter(b -> b.status() == Status.APPROVED)\n            .collect(Collectors.groupingBy(Booking::student, Collectors.summingInt(Booking::hours)))\n            .entrySet().stream()\n            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey()))\n            .limit(3).map(e -> e.getKey() + \"=\" + e.getValue()).toList();\n    }\n    /** Tỉ lệ huỷ (CANCELLED / tổng) theo lab, làm tròn 0,1 %. */\n    static Map<String, Double> cancellationRate(List<Booking> all) {\n        return all.stream().collect(Collectors.groupingBy(Booking::lab, TreeMap::new,\n            Collectors.collectingAndThen(Collectors.toList(), l ->\n                Math.round(1000.0 * l.stream().filter(b -> b.status() == Status.CANCELLED).count() / l.size()) / 10.0)));\n    }\n\n    // ===== Phần 2 — Optional =====\n    /** Ngày có nhiều giờ APPROVED nhất của một lab; lab không có lượt nào ⇒ rỗng. Hoà ⇒ ngày sớm hơn. */\n    static Optional<LocalDate> busiestDay(List<Booking> all, String lab) {\n        return all.stream().filter(b -> b.lab().equals(lab) && b.status() == Status.APPROVED)\n            .collect(Collectors.groupingBy(Booking::date, TreeMap::new, Collectors.summingInt(Booking::hours)))\n            .entrySet().stream()\n            .max(Map.Entry.<LocalDate, Integer>comparingByValue().thenComparing(Map.Entry.comparingByKey(Comparator.reverseOrder())))\n            .map(Map.Entry::getKey);\n    }\n\n    // ===== Phần 3 — Đồng thời =====\n    /** Bộ đếm theo trạng thái, được 8 luồng gọi cùng lúc. */\n    static class StatusCounter {\n        private final ConcurrentHashMap<Status, LongAdder> counts = new ConcurrentHashMap<>();\n        void record(Booking b) { counts.computeIfAbsent(b.status(), k -> new LongAdder()).increment();\n    }\n        Map<Status, Long> snapshot() {\n            Map<Status, Long> m = new EnumMap<>(Status.class);\n            counts.forEach((k, v) -> m.put(k, v.sum()));\n            return m;\n        }\n    }\n    static Map<Status, Long> countConcurrently(List<Booking> all, int threads) throws InterruptedException {\n        StatusCounter c = new StatusCounter();\n        int chunk = all.size() / threads;\n        try (ExecutorService ex = Executors.newFixedThreadPool(threads)) {\n            for (int t = 0; t < threads; t++) {\n                List<Booking> part = all.subList(t * chunk, t == threads - 1 ? all.size() : (t + 1) * chunk);\n                ex.submit(() -> part.forEach(c::record));\n            }\n        }\n        return c.snapshot();\n    }\n\n    // ===== Phần 4 — Gọi song song có hết giờ =====\n    /** \"API\" thông tin lab: 300 ms mỗi lần; Lab Cloud treo 5 s. */\n    static String fetchLabInfo(String lab) throws InterruptedException {\n        Thread.sleep(lab.equals(\"Lab Cloud\") ? 5_000 : 300);\n        return lab + \": open\";\n    }\n    /** Lấy thông tin 6 lab song song, mỗi lab tối đa 500 ms; quá hạn ⇒ \"<lab>: unknown\". Giữ thứ tự LABS. */\n    static List<String> fetchAll() {\n        try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) {\n            List<CompletableFuture<String>> fs = LABS.stream()\n                .map(lab -> CompletableFuture.supplyAsync(() -> {\n                        try { return fetchLabInfo(lab); } catch (InterruptedException e) { throw new CompletionException(e); }\n                    }, ex)\n                    .completeOnTimeout(lab + \": unknown\", 500, TimeUnit.MILLISECONDS))\n                .toList();\n            List<String> out = fs.stream().map(CompletableFuture::join).toList();\n            ex.shutdownNow();                             // đừng chờ Lab Cloud ngủ nốt 5 s\n            return out;\n        }\n    }\n    // … checker and main() exactly as in the starter file\n}");

const L27_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.7 — Lab</span>
<h2>Chapter 2 lab: booking statistics, safely in parallel</h2>
<p class="lead">The LabFlow admin dashboard needs numbers: approved hours per lab, the most active students, cancellation rates, the busiest day, live counters fed by eight ingest threads, and lab details fetched from a slow service without making the page wait. You will build all of it in one Java file over 200 000 generated bookings, using everything from this chapter — streams, Optional, concurrent counters, CompletableFuture with virtual threads and a timeout. A built-in checker prints PASS/FAIL for six items; the expected values are fixed, because the data generator is deterministic.</p>

<h3>Setup</h3>
<ul>
  <li>Java 21 only — no Maven, no Spring. Save the file below as <code>LabStats.java</code> and run <code>java LabStats.java</code>.</li>
  <li><code>generate(200_000)</code> uses <code>new Random(2026)</code>: the same seed produces exactly the same bookings on every machine, so everyone's correct answer is the same.</li>
  <li>Item 1 is solved as an example of the style expected. Items 2–6 are yours.</li>
</ul>
${MA27_STARTER}
<p>Running the starter as it is:</p>
${OUT27_STARTER}
<p>Look at item 5 before you touch anything: the starter's <code>StatusCounter</code> uses a <code>HashMap</code> with <code>merge</code>. It is correct with one thread; with eight it produced <strong>five different wrong answers in five runs</strong>, all far below 200 000 — the lost updates of lesson 2.4. Note also that no exception reached <code>main</code>: errors inside executor tasks vanish unless someone calls <code>get()</code> (lesson 2.3).</p>

<h3>The six items</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · approvedHoursPerLab (example)</span><span class="v"><code>filter</code> + <code>groupingBy(…, TreeMap::new, summingInt(…))</code> — lesson 2.1.</span></div>
  <div class="kv"><span class="k">2 · top3Students</span><span class="v">Approved hours per student, highest first; ties broken by name ascending; format <code>"sv12=57"</code>. Hint: stream the grouped map's <code>entrySet()</code> and build a comparator with <code>reversed()</code> and <code>thenComparing</code>.</span></div>
  <div class="kv"><span class="k">3 · cancellationRate</span><span class="v">CANCELLED ÷ all bookings of each lab, as a percentage rounded to one decimal (<code>10.4</code>), keys sorted. Hint: a downstream collector per lab.</span></div>
  <div class="kv"><span class="k">4 · busiestDay</span><span class="v">The date with the most approved hours for one lab, earliest date on ties; <code>Optional.empty()</code> for a lab that does not exist — never <code>null</code>, never an exception (lesson 2.2).</span></div>
  <div class="kv"><span class="k">5 · StatusCounter</span><span class="v">Make <code>record</code> thread-safe so that 8 threads give the same, complete counts in all 5 runs (lesson 2.4). The fastest correct choice under heavy contention is not <code>synchronized</code>.</span></div>
  <div class="kv"><span class="k">6 · fetchAll</span><span class="v">Six labs × 300 ms "API calls", but Lab Cloud hangs for 5 s. Return all six results in <code>LABS</code> order in under 700 ms, with <code>"Lab Cloud: unknown"</code> for the one that did not answer in 500 ms (lessons 2.3 and 2.5).</span></div>
</div>

<h3>Done when</h3>
${OUT27_GIAI}
<p>…and your code contains no <code>Thread.sleep</code> to "wait for the threads", no <code>synchronized</code> around the whole counter, and no <code>get()</code> on an Optional.</p>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Correctness — 6 pts</span><span class="v">One point per PASS line. Item 5 must pass in three separate runs of the program.</span></div>
  <div class="kv"><span class="k">Streams read well — 1 pt</span><span class="v">No pipeline longer than ~6 steps without a named helper; no side effects inside <code>map</code>/<code>filter</code>.</span></div>
  <div class="kv"><span class="k">Null-safety — 1 pt</span><span class="v">Item 4 returns <code>Optional</code> from a stream terminal operation; no <code>null</code> anywhere in your code.</span></div>
  <div class="kv"><span class="k">Concurrency choice — 1 pt</span><span class="v">A one-sentence comment above <code>StatusCounter</code> says why you chose your structure over <code>synchronized</code> and over <code>AtomicInteger</code>.</span></div>
  <div class="kv"><span class="k">Timeouts — 1 pt</span><span class="v">Item 6 cannot block longer than ≈ 500 ms whatever the slow lab does, and does not leave threads running for 5 s after returning.</span></div>
</div>

<h3>Stretch (optional)</h3>
<ul>
  <li>Run the finished lab with <code>-Xmx64m -XX:StartFlightRecording=filename=r.jfr</code> and <code>jfr view gc-pauses r.jfr</code>. Our solution passed with 11 GC pauses, median 1,35 ms, maximum 7,98 ms — and it still passes with <code>-Xmx32m</code>. Find the smallest heap at which yours passes, and explain what uses the memory.</li>
  <li>Replace the 8-thread ingest with a parallel stream and <code>Collectors.groupingByConcurrent</code>. Is it faster? Measure three times.</li>
</ul>

${giai('Show one solution (try for at least 45 minutes first)', `${MA27_GIAI}
<p>Notes: in item 2 the comparator is "value descending, then key ascending" — <code>reversed()</code> must apply only to the value comparator, which is why the type witness <code>Map.Entry.&lt;String, Integer&gt;comparingByValue()</code> is needed. Item 5 uses <code>LongAdder</code> per status, created once by <code>computeIfAbsent</code> — under eight writers hammering four keys it beats both a lock and a single <code>AtomicInteger</code>. Item 6 uses <code>completeOnTimeout</code> (a fallback value instead of an exception) and <code>shutdownNow()</code> to interrupt the hanging call before the executor's <code>close()</code> waits for it.</p>`)}

<h3>🎤 Chapter 2 — what the interviewer will ask</h3>
<ol>
  <li><strong>"Explain lazy evaluation in streams with an example."</strong> — Intermediate operations only describe the pipeline; elements flow one by one when a terminal operation pulls them, so <code>filter(...).findFirst()</code> stops at the first match and a stream without a terminal operation does nothing. Stateful steps like <code>sorted</code> must see everything first.</li>
  <li><strong>"Where should and shouldn't you use Optional?"</strong> — Return types of methods that may find nothing (<code>findById</code>); not fields, parameters or collections. Unwrap with <code>map</code>/<code>orElseGet</code>/<code>orElseThrow</code>, avoid <code>get()</code>.</li>
  <li><strong>"Two users book the last slot at the same time in your Spring app. What can go wrong and how do you prevent it?"</strong> — Check-then-act race across request threads: both see the slot free and both insert. In one JVM an atomic operation helps, but with several instances the database must decide: a unique/exclusion constraint, <code>SELECT … FOR UPDATE</code>, or optimistic locking (Chapter 7).</li>
  <li><strong>"Would you enable virtual threads for this API? What would you check first?"</strong> — Yes if it is I/O-bound on Java 21+: <code>spring.threads.virtual.enabled=true</code>. Check <code>synchronized</code> around blocking calls (pinning on Java 21), the DB pool size (it becomes the limit), ThreadLocal usage, and load-test before and after.</li>
  <li><strong>"The service gets slower over hours and then restarts with exit code 137. How do you investigate?"</strong> — Growing heap or non-heap memory; compare <code>jvm.memory.used</code> over time, take a class histogram or heap dump to find what stays reachable, check <code>-Xmx</code>/<code>MaxRAMPercentage</code> against the container limit, and record with JFR for GC pauses and allocation sites.</li>
</ol>
</div>
`;

const L27_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.7 — Lab</span>
<h2>Lab chương 2: thống kê lượt đặt, chạy song song an toàn</h2>
<p class="lead">Bảng điều khiển quản trị của LabFlow cần số liệu: số giờ đã duyệt theo lab, những sinh viên tích cực nhất, tỉ lệ huỷ, ngày đông nhất, bộ đếm trực tiếp do tám luồng nạp dữ liệu cập nhật, và thông tin lab lấy từ một dịch vụ chậm mà không bắt trang phải chờ. Bạn sẽ dựng tất cả trong một tệp Java trên 200 000 lượt đặt được sinh sẵn, dùng mọi thứ của chương này — stream, Optional, bộ đếm đồng thời, CompletableFuture với virtual thread và hết giờ. Bộ kiểm có sẵn in PASS/FAIL cho sáu mục; giá trị mong đợi cố định vì bộ sinh dữ liệu tất định.</p>

<h3>Chuẩn bị</h3>
<ul>
  <li>Chỉ cần Java 21 — không Maven, không Spring. Lưu tệp dưới đây thành <code>LabStats.java</code> rồi chạy <code>java LabStats.java</code>.</li>
  <li><code>generate(200_000)</code> dùng <code>new Random(2026)</code>: cùng seed sinh ra đúng cùng các lượt đặt trên mọi máy, nên đáp án đúng của mọi người giống nhau.</li>
  <li>Mục 1 đã làm sẵn làm mẫu cho phong cách cần viết. Mục 2–6 là của bạn.</li>
</ul>
${MA27_STARTER}
<p>Chạy nguyên tệp khởi đầu:</p>
${OUT27_STARTER}
<p>Nhìn mục 5 trước khi đụng vào bất cứ gì: <code>StatusCounter</code> của tệp khởi đầu dùng <code>HashMap</code> với <code>merge</code>. Một luồng thì đúng; tám luồng thì ra <strong>năm đáp án sai khác nhau trong năm lần chạy</strong>, đều thấp xa dưới 200 000 — chính là mất cập nhật của bài 2.4. Để ý thêm: không exception nào tới được <code>main</code> — lỗi bên trong việc của executor biến mất nếu không ai gọi <code>get()</code> (bài 2.3).</p>

<h3>Sáu mục</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · approvedHoursPerLab (mẫu)</span><span class="v"><code>filter</code> + <code>groupingBy(…, TreeMap::new, summingInt(…))</code> — bài 2.1.</span></div>
  <div class="kv"><span class="k">2 · top3Students</span><span class="v">Giờ đã duyệt theo sinh viên, cao nhất trước; hoà thì tên tăng dần; định dạng <code>"sv12=57"</code>. Gợi ý: stream <code>entrySet()</code> của Map đã gom và dựng comparator bằng <code>reversed()</code> với <code>thenComparing</code>.</span></div>
  <div class="kv"><span class="k">3 · cancellationRate</span><span class="v">CANCELLED ÷ mọi lượt đặt của từng lab, theo phần trăm làm tròn một chữ số thập phân (<code>10.4</code>), khoá sắp xếp. Gợi ý: một collector hạ nguồn cho mỗi lab.</span></div>
  <div class="kv"><span class="k">4 · busiestDay</span><span class="v">Ngày có nhiều giờ đã duyệt nhất của một lab, hoà thì ngày sớm hơn; <code>Optional.empty()</code> cho lab không tồn tại — không bao giờ <code>null</code>, không bao giờ exception (bài 2.2).</span></div>
  <div class="kv"><span class="k">5 · StatusCounter</span><span class="v">Làm <code>record</code> an toàn luồng để 8 luồng cho cùng một kết quả đầy đủ trong cả 5 lần chạy (bài 2.4). Lựa chọn đúng nhanh nhất khi tranh chấp nặng không phải là <code>synchronized</code>.</span></div>
  <div class="kv"><span class="k">6 · fetchAll</span><span class="v">Sáu lab × "lời gọi API" 300 ms, nhưng Lab Cloud treo 5 giây. Trả cả sáu kết quả theo thứ tự <code>LABS</code> trong dưới 700 ms, với <code>"Lab Cloud: unknown"</code> cho lab không trả lời trong 500 ms (bài 2.3 và 2.5).</span></div>
</div>

<h3>Đạt khi</h3>
${OUT27_GIAI}
<p>…và mã của bạn không có <code>Thread.sleep</code> để "chờ các luồng", không <code>synchronized</code> bao cả bộ đếm, và không <code>get()</code> trên Optional.</p>

<h3>Thang điểm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đúng — 6 điểm</span><span class="v">Mỗi dòng PASS một điểm. Mục 5 phải PASS trong ba lần chạy chương trình riêng biệt.</span></div>
  <div class="kv"><span class="k">Stream dễ đọc — 1 điểm</span><span class="v">Không pipeline nào dài quá ~6 bước mà không có hàm phụ đặt tên; không tác dụng phụ trong <code>map</code>/<code>filter</code>.</span></div>
  <div class="kv"><span class="k">An toàn null — 1 điểm</span><span class="v">Mục 4 trả <code>Optional</code> từ một thao tác kết thúc của stream; không có <code>null</code> nào trong mã của bạn.</span></div>
  <div class="kv"><span class="k">Lựa chọn đồng thời — 1 điểm</span><span class="v">Một câu chú thích phía trên <code>StatusCounter</code> nói vì sao bạn chọn cấu trúc của mình thay vì <code>synchronized</code> và thay vì <code>AtomicInteger</code>.</span></div>
  <div class="kv"><span class="k">Hết giờ — 1 điểm</span><span class="v">Mục 6 không thể chặn lâu hơn ≈ 500 ms dù lab chậm làm gì, và không để lại luồng chạy thêm 5 giây sau khi đã trả kết quả.</span></div>
</div>

<h3>Nâng cao (không bắt buộc)</h3>
<ul>
  <li>Chạy lab đã xong với <code>-Xmx64m -XX:StartFlightRecording=filename=r.jfr</code> và <code>jfr view gc-pauses r.jfr</code>. Lời giải của chúng tôi qua với 11 lần dừng GC, trung vị 1,35 ms, lớn nhất 7,98 ms — và vẫn qua với <code>-Xmx32m</code>. Tìm heap nhỏ nhất mà bài của bạn vẫn qua, và giải thích bộ nhớ dùng vào đâu.</li>
  <li>Thay phần nạp 8 luồng bằng parallel stream và <code>Collectors.groupingByConcurrent</code>. Có nhanh hơn không? Đo ba lần.</li>
</ul>

${giai('Xem một lời giải (hãy tự làm ít nhất 45 phút trước)', `${MA27_GIAI}
<p>Ghi chú: ở mục 2, comparator là "giá trị giảm dần, rồi khoá tăng dần" — <code>reversed()</code> chỉ được áp lên comparator theo giá trị, vì thế cần chỉ rõ kiểu <code>Map.Entry.&lt;String, Integer&gt;comparingByValue()</code>. Mục 5 dùng mỗi trạng thái một <code>LongAdder</code>, tạo đúng một lần bằng <code>computeIfAbsent</code> — với tám luồng ghi dồn dập vào bốn khoá, nó nhanh hơn cả khoá lẫn một <code>AtomicInteger</code>. Mục 6 dùng <code>completeOnTimeout</code> (giá trị dự phòng thay vì exception) và <code>shutdownNow()</code> để ngắt lời gọi đang treo trước khi <code>close()</code> của executor ngồi chờ nó.</p>`)}

<h3>🎤 Chương 2 — phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Giải thích tính lười của stream bằng một ví dụ."</strong> — Thao tác trung gian chỉ mô tả pipeline; phần tử chảy từng cái một khi thao tác kết thúc kéo chúng, nên <code>filter(...).findFirst()</code> dừng ở phần tử khớp đầu tiên và stream không có thao tác kết thúc thì không làm gì. Bước có trạng thái như <code>sorted</code> phải thấy hết trước.</li>
  <li><strong>"Nên và không nên dùng Optional ở đâu?"</strong> — Kiểu trả về của phương thức có thể không tìm thấy (<code>findById</code>); không dùng cho field, tham số hay collection. Mở bằng <code>map</code>/<code>orElseGet</code>/<code>orElseThrow</code>, tránh <code>get()</code>.</li>
  <li><strong>"Hai người cùng đặt khung giờ cuối trong ứng dụng Spring của bạn. Điều gì có thể sai và phòng thế nào?"</strong> — Tranh chấp kiểm-rồi-làm giữa các luồng request: cả hai thấy còn trống và cùng chèn. Trong một JVM, thao tác nguyên tử giúp được, nhưng nhiều bản chạy thì cơ sở dữ liệu phải quyết: ràng buộc unique/exclusion, <code>SELECT … FOR UPDATE</code>, hoặc khoá lạc quan (Chương 7).</li>
  <li><strong>"Bạn có bật virtual thread cho API này không? Kiểm gì trước?"</strong> — Có nếu nó nặng I/O và chạy Java 21+: <code>spring.threads.virtual.enabled=true</code>. Kiểm <code>synchronized</code> quanh lời gọi chặn (pinning trên Java 21), cỡ pool DB (nó thành giới hạn), cách dùng ThreadLocal, và đo tải trước và sau.</li>
  <li><strong>"Dịch vụ chậm dần qua nhiều giờ rồi khởi động lại với mã thoát 137. Bạn điều tra thế nào?"</strong> — Bộ nhớ heap hoặc ngoài heap tăng dần; so <code>jvm.memory.used</code> theo thời gian, lấy class histogram hoặc heap dump để tìm thứ vẫn tới được, đối chiếu <code>-Xmx</code>/<code>MaxRAMPercentage</code> với giới hạn container, và ghi JFR để xem thời gian dừng GC và nơi cấp phát.</li>
</ol>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ2 = [
  Q('labs.stream().filter(l -> { System.out.println(l); return true; }); — with no other call. What is printed?|||labs.stream().filter(l -> { System.out.println(l); return true; }); — không gọi gì thêm. In ra gì?', [
    'Every lab name|||Tên mọi lab',
    'Only the first lab name|||Chỉ tên lab đầu',
    'Nothing — intermediate operations are lazy until a terminal operation runs|||Không gì cả — thao tác trung gian lười cho tới khi có thao tác kết thúc',
    'IllegalStateException|||IllegalStateException',
  ], 2),
  Q('Collectors.toMap(Booking::student, Booking::hours) on data where one student has two bookings…|||Collectors.toMap(Booking::student, Booking::hours) trên dữ liệu có một sinh viên hai lượt đặt…', [
    'keeps the last value|||giữ giá trị cuối',
    'throws IllegalStateException: Duplicate key, unless a merge function is given|||ném IllegalStateException: Duplicate key, trừ khi có hàm gộp',
    'sums the values automatically|||tự cộng các giá trị',
    'returns a Map<String, List<Integer>>|||trả về Map<String, List<Integer>>',
  ], 1),
  Q('Sixteen 200 ms blocking calls run in a parallel stream on a 4-CPU machine. About how long does it take, and why?|||Mười sáu lời gọi chặn 200 ms chạy trong parallel stream trên máy 4 CPU. Mất khoảng bao lâu, vì sao?', [
    '≈ 200 ms — one thread per element|||≈ 200 ms — mỗi phần tử một luồng',
    '≈ 800 ms — the common pool has cores − 1 workers plus the caller, so 4 calls at a time|||≈ 800 ms — common pool có số nhân − 1 luồng thợ cộng luồng gọi, mỗi lúc 4 lời gọi',
    '≈ 3 200 ms — parallel streams run sequentially for I/O|||≈ 3 200 ms — parallel stream chạy tuần tự với I/O',
    'It deadlocks|||Bị deadlock',
  ], 1),
  Q('findById(5).orElse(createDefault()) — booking 5 exists. Is createDefault() called?|||findById(5).orElse(createDefault()) — lượt đặt 5 có tồn tại. createDefault() có được gọi không?', [
    'No, orElse is lazy|||Không, orElse lười',
    'Yes — the argument of orElse is always evaluated; use orElseGet for a lazy default|||Có — đối số của orElse luôn được tính; muốn lười thì dùng orElseGet',
    'Only in debug mode|||Chỉ ở chế độ debug',
    'It throws NoSuchElementException|||Nó ném NoSuchElementException',
  ], 1),
  Q('Spring Framework 7 marks its packages @NullMarked (JSpecify). What does plain javac do with a call to .length() on a @Nullable return value?|||Spring Framework 7 đánh dấu các gói @NullMarked (JSpecify). javac thường làm gì với lời gọi .length() trên giá trị trả về @Nullable?', [
    'Compile error|||Lỗi biên dịch',
    'Inserts a null check automatically|||Tự chèn phép kiểm null',
    'Nothing — the annotations are checked by tools such as NullAway or the IDE, not by javac|||Không gì — chú thích được công cụ như NullAway hay IDE kiểm, không phải javac',
    'Throws at class-loading time|||Ném lỗi lúc nạp lớp',
  ], 2),
  Q('With default settings, 1 000 requests that each wait 1 s hit a Spring Boot MVC app at once. About how long until the last one finishes?|||Cấu hình mặc định, 1 000 request mỗi cái chờ 1 giây cùng đổ vào ứng dụng Spring Boot MVC. Khoảng bao lâu request cuối mới xong?', [
    '≈ 1 s|||≈ 1 giây',
    '≈ 5 s — Tomcat has 200 worker threads, so 5 waves|||≈ 5 giây — Tomcat có 200 luồng thợ, nên 5 đợt',
    '≈ 1 000 s|||≈ 1 000 giây',
    '≈ 10 s — HikariCP limits it to 10 threads|||≈ 10 giây — HikariCP giới hạn 10 luồng',
  ], 1),
  Q('4 threads each do counter++ 1 000 000 times on a shared int. Why is the result usually below 4 000 000?|||4 luồng, mỗi luồng counter++ 1 000 000 lần trên một int dùng chung. Vì sao kết quả thường dưới 4 000 000?', [
    'The int overflows|||int bị tràn',
    'counter++ is read–add–write; interleaved threads overwrite each other’s writes (lost updates)|||counter++ là đọc–cộng–ghi; các luồng đan xen ghi đè lên nhau (mất cập nhật)',
    'The JIT removes some iterations|||JIT bỏ bớt vòng lặp',
    'Threads stop early|||Luồng dừng sớm',
  ], 1),
  Q('A ConcurrentHashMap is updated with Integer old = map.get(k); map.put(k, old == null ? 1 : old + 1); from many threads. Is it correct?|||Một ConcurrentHashMap được cập nhật bằng Integer old = map.get(k); map.put(k, old == null ? 1 : old + 1); từ nhiều luồng. Có đúng không?', [
    'Yes, ConcurrentHashMap is thread-safe|||Đúng, ConcurrentHashMap an toàn luồng',
    'No — two thread-safe calls are not one atomic operation; use merge or compute|||Không — hai lời gọi an toàn không phải một thao tác nguyên tử; dùng merge hoặc compute',
    'Only if the key is a String|||Chỉ khi khoá là String',
    'Yes, if the field is volatile|||Đúng, nếu field là volatile',
  ], 1),
  Q('On Java 21 with virtual threads, what makes a virtual thread unable to release its carrier while it sleeps or waits for I/O?|||Trên Java 21 với virtual thread, điều gì khiến virtual thread không nhả được carrier khi nó ngủ hay chờ I/O?', [
    'Using ReentrantLock|||Dùng ReentrantLock',
    'Blocking inside a synchronized block or method (pinning), fixed for synchronized in Java 24|||Chặn bên trong khối hay phương thức synchronized (pinning), Java 24 đã sửa cho synchronized',
    'Calling Thread.sleep at all|||Gọi Thread.sleep là bị',
    'Using a CompletableFuture|||Dùng CompletableFuture',
  ], 1),
  Q('A Spring Boot container with a 256 MB limit runs java -Xmx1g and is restarted with exit code 137 and no stack trace. What happened?|||Container Spring Boot giới hạn 256 MB chạy java -Xmx1g và bị khởi động lại với mã thoát 137, không stack trace. Chuyện gì đã xảy ra?', [
    'A StackOverflowError|||StackOverflowError',
    'The JVM threw OutOfMemoryError and exited normally|||JVM ném OutOfMemoryError và thoát bình thường',
    'The kernel OOM killer sent SIGKILL because the process exceeded the container limit — size the heap with MaxRAMPercentage|||Bộ diệt OOM của nhân gửi SIGKILL vì tiến trình vượt giới hạn container — định cỡ heap bằng MaxRAMPercentage',
    'G1 was too slow and the JVM gave up|||G1 quá chậm nên JVM bỏ cuộc',
  ], 2),
];

export default {
  title: 'Chapter 2 — ⭐ Modern Java (2): streams, concurrency and the JVM|||Chương 2 — ⭐ Java hiện đại (2): Stream, đồng thời và JVM',
  description: 'Stream và Optional, luồng và pool, race condition, virtual thread, bộ nhớ JVM và GC — chạy thật từng dòng, có tải thật vào Spring Boot 4 (200 luồng Tomcat vs virtual thread), lab thống kê lượt đặt và câu hỏi phỏng vấn.',
  lessons: [
    {
      title: '2.1 — The Stream API|||2.1 — Stream API',
      slug: 'sb-2-1-stream-api',
      type: 'LESSON',
      isFreePreview: false,
      description: 'filter/map/reduce, groupingBy và collector hạ nguồn, toMap trùng khoá, lười và ngắt sớm, dùng một lần, toList không sửa được, parallel stream mất phần tử, đo for/stream/parallel, I/O chặn trong common pool.',
      content: L21_EN + L21_VI,
    },
    {
      title: '2.2 — Optional and null safety|||2.2 — Optional và an toàn null',
      slug: 'sb-2-2-optional',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Optional làm kiểu trả về, orElse vs orElseGet, orElseThrow, chỗ không dùng Optional, NPE biết nói (JEP 358), JSpecify trong Spring 7 + NullAway chạy thật, sự cố Google Cloud 12/6/2025.',
      content: L22_EN + L22_VI,
    },
    {
      title: '2.3 — Threads, ExecutorService and CompletableFuture|||2.3 — Thread, ExecutorService và CompletableFuture',
      slug: 'sb-2-3-thread-executor',
      type: 'LESSON',
      isFreePreview: false,
      description: 'start vs run, giá của 10 000 luồng, pool + Future + hết giờ, quên shutdown, CompletableFuture 900 → 400 ms, 1 000 request vào Spring Boot với 200 luồng Tomcat, phụ thuộc chậm kéo sập ứng dụng.',
      content: L23_EN + L23_VI,
    },
    {
      title: '2.4 — Race conditions, locks and atomic types|||2.4 — Tranh chấp dữ liệu, khoá và kiểu atomic',
      slug: 'sb-2-4-race-condition',
      type: 'LESSON',
      isFreePreview: false,
      description: 'count++ mất cập nhật và javap, synchronized/AtomicInteger/LongAdder, HashMap và check-then-act, volatile, deadlock + thread dump, bean singleton có trạng thái, SimpleDateFormat, mất điện Bắc Mỹ 2003.',
      content: L24_EN + L24_VI,
    },
    {
      title: '2.5 — Virtual threads (Java 21)|||2.5 — Virtual thread (Java 21)',
      slug: 'sb-2-5-virtual-threads',
      type: 'LESSON',
      isFreePreview: false,
      description: '10 000 luồng nền tảng vs 100 000 virtual thread đo thật, spring.threads.virtual.enabled 5,2 → 1,3 giây, pinning trên Java 21, sự cố Netflix 2024, pool DB vẫn là nút thắt, so với Node.js.',
      content: L25_EN + L25_VI,
    },
    {
      title: '2.6 — JVM memory and garbage collection|||2.6 — Bộ nhớ JVM và thu gom rác',
      slug: 'sb-2-6-jvm-gc',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Heap/stack/metaspace, rò bộ nhớ + histogram + heap dump, so Serial/Parallel/G1/ZGC đo thật, -Xmx trong container và exit 137, jcmd và JFR, Discord 2020.',
      content: L26_EN + L26_VI,
    },
    {
      title: '2.7 — Chapter 2 lab + interview questions|||2.7 — Lab chương 2 + câu hỏi phỏng vấn',
      slug: 'sb-2-7-lab-2',
      type: 'LESSON',
      isFreePreview: false,
      description: 'Thống kê 200 000 lượt đặt: Stream, Optional, bộ đếm 8 luồng an toàn, gọi 6 lab song song có hết giờ; tệp khởi đầu + bộ kiểm 6 mục, thang điểm, lời giải ẩn, 5 câu phỏng vấn chương 2.',
      content: L27_EN + L27_VI,
    },
    {
      title: '2.8 — Chapter 2 quiz|||2.8 — Kiểm tra chương 2',
      slug: 'sb-2-8-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về stream lười, toMap, parallel stream, Optional, JSpecify, luồng Tomcat, race condition, ConcurrentHashMap, pinning và exit 137.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from something you saw running in this chapter — a lost update, a load test, a GC log, a container that was killed. If you miss one, the explanation is in the lesson on that topic.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ thứ bạn đã thấy chạy thật trong chương — một lần mất cập nhật, một phép đo tải, một dòng log GC, một container bị giết. Sai câu nào thì lời giải nằm trong bài cùng chủ đề.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ2 },
    },
  ],
};
