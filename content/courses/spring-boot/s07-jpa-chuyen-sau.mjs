/**
 * spring-boot/s07-jpa-chuyen-sau.mjs — Chương 7: JPA chuyên sâu — hiệu năng và đồng thời (soạn 20/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / Spring Data JPA 4.1.2 / Hibernate ORM 7.4.13.Final / HikariCP 7.0.2 trên Temurin 21.0.12.1,
 * PostgreSQL 16.15 (container sb-c7-pg); Prisma 7.10.1 + @prisma/adapter-pg trên Node 22 để so sánh. Máy đo đang tải nặng (load ~45) ⇒ số ms chỉ để so tương đối.
 * Mã demo: scratchpad/sb/lab/c7/jpa (profile e71…e75, schema7.sql), lab/c7/lab7/{starter,giai,schema.sql,chay.sh,cham.sh}; Node: ~/.rtq-sb/c6/node (p71.ts, p75.ts); output: ~/.rtq-sb/c7/o.
 * Hằng MA.. / OUT.. sinh bằng tam/s07/build.sh + gen-ma.mjs.
 */
import { java, js, sql, bash, props, out, tl, giai } from './_chung.mjs';

// ===== Bài 7.1 =====
const MA71_BK = java("@Entity @Table(name = \"bookings\")\npublic class Booking {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;\n    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = \"lab_id\") private Lab lab;\n    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = \"student_id\") private Student student;\n    @Column(name = \"start_at\") private LocalDateTime startAt;\n    @Column(name = \"end_at\") private LocalDateTime endAt;\n    private String status;\n    // … constructor, getter\n}");
const MA71_REPO = java("public interface BookingRepo extends JpaRepository<Booking, Long> {\n    /** A. N+1: lab và student đều LAZY. */\n    List<Booking> findTop100ByStatusOrderByIdAsc(String status);\n\n    /** B. JOIN FETCH: một câu, kéo luôn lab + student. */\n    @Query(\"select b from Booking b join fetch b.lab join fetch b.student where b.status = :st order by b.id limit 100\")\n    List<Booking> joinFetch(String st);\n\n    /** C. @EntityGraph: cùng ý, khai bằng annotation. */\n    @EntityGraph(attributePaths = {\"lab\", \"student\"})\n    @Query(\"select b from Booking b where b.status = :st order by b.id limit 100\")\n    List<Booking> voiGraph(String st);\n\n    /** D. DTO projection: chỉ 3 cột, không entity nào vào persistence context. */\n    @Query(\"\"\"\n           select new com.cuongthai.c7.mo.BookingRow(b.id, l.code, s.studentCode)\n           from Booking b join b.lab l join b.student s where b.status = :st order by b.id limit 100\"\"\")\n    List<BookingRow> dto(String st);\n}");
const MA71_DO = java("public static void luot(String ten, Statistics st, TransactionTemplate tx, Supplier<String> viec) {\n    buoc(ten);\n    st.clear(); DemSql.xoa();\n    long t0 = System.nanoTime();\n    String kq = tx.execute(s -> viec.get());\n    long ms = (System.nanoTime() - t0) / 1_000_000;\n    DemSql.in();\n    System.out.println(\"  kết quả: \" + kq);\n    System.out.printf(\"  Statistics: %d câu SQL · %d entity nạp · %d ms%n\", st.getPrepareStatementCount(), st.getEntityLoadCount(), ms);\n}");
const MA71_A = java("if (chi.contains(\"A\")) luot(\"A. findTop100… rồi chạm b.getLab() + b.getStudent() từng dòng\", st, tx, () ->\n        tom(bookings.findTop100ByStatusOrderByIdAsc(\"APPROVED\").stream()\n                .map(b -> b.getLab().getCode() + \"/\" + b.getStudent().getStudentCode()).toList()));");
const OUT71_ABCD = out("=== A. findTop100… rồi chạm b.getLab() + b.getStudent() từng dòng\n     1× select b1_0.id,b1_0.end_at,b1_0.lab_id,b1_0.start_at,b1_0.status,b1_0.student_id from bookings b1_0 where b1_0.status=? order by b1_0.id fetch first ? rows only\n    15× select l1_0.id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 where l1_0.id=?\n   100× select s1_0.id,s1_0.email,s1_0.student_code from students s1_0 where s1_0.id=?\n  kết quả: 100 dòng, đầu tiên [LAB-02/SE180002, LAB-03/SE180003, LAB-04/SE180004]\n  Statistics: 116 câu SQL · 215 entity nạp · 223 ms\n\n=== B. JPQL join fetch\n     1× select b1_0.id,b1_0.end_at,l1_0.id,l1_0.capacity,l1_0.code,l1_0.name,b1_0.start_at,b1_0.status,s1_0.id,s1_0.email,s1_0.student_code from bookings b1_0 join labs l1_0 on l1_0.id=b1_0.lab_id j…\n  kết quả: 100 dòng, đầu tiên [LAB-02/SE180002, LAB-03/SE180003, LAB-04/SE180004]\n  Statistics: 1 câu SQL · 215 entity nạp · 37 ms\n\n=== C. @EntityGraph(attributePaths = {\"lab\", \"student\"})\n     1× select b1_0.id,b1_0.end_at,l1_0.id,l1_0.capacity,l1_0.code,l1_0.name,b1_0.start_at,b1_0.status,s1_0.id,s1_0.email,s1_0.student_code from bookings b1_0 left join labs l1_0 on l1_0.id=b1_0.lab…\n  kết quả: 100 dòng, đầu tiên [LAB-02/SE180002, LAB-03/SE180003, LAB-04/SE180004]\n  Statistics: 1 câu SQL · 215 entity nạp · 33 ms\n\n=== D. DTO projection (record BookingRow)\n     1× select b1_0.id,l1_0.code,s1_0.student_code from bookings b1_0 join labs l1_0 on l1_0.id=b1_0.lab_id join students s1_0 on s1_0.id=b1_0.student_id where b1_0.status=? order by b1_0.id fetch f…\n  kết quả: 100 dòng, đầu tiên [LAB-02/SE180002, LAB-03/SE180003, LAB-04/SE180004]\n  Statistics: 1 câu SQL · 0 entity nạp · 10 ms");
const OUT71_BATCH = out("=== A. findTop100… rồi chạm b.getLab() + b.getStudent() từng dòng\n     1× select b1_0.id,b1_0.end_at,b1_0.lab_id,b1_0.start_at,b1_0.status,b1_0.student_id from bookings b1_0 where b1_0.status=? order by b1_0.id fetch first ? rows only\n     1× select l1_0.id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 where l1_0.id = any (?)\n     7× select s1_0.id,s1_0.email,s1_0.student_code from students s1_0 where s1_0.id = any (?)\n  kết quả: 100 dòng, đầu tiên [LAB-02/SE180002, LAB-03/SE180003, LAB-04/SE180004]\n  Statistics: 9 câu SQL · 215 entity nạp · 176 ms");
const MA71_LREPO = java("/** F. JOIN FETCH một collection + phân trang: bản Hibernate cũ phân trang TRONG BỘ NHỚ — xem SQL bản 7.4 sinh ra. */\n@Query(\"select l from Lab l join fetch l.bookings order by l.id\")\nList<Lab> fetchTrang(Pageable p);\n\n/** G. Sửa F bằng hai bước: phân trang trên id, rồi fetch theo id. */\n@Query(\"select l.id from Lab l order by l.id\")\nList<Long> idTrang(Pageable p);\n\n@Query(\"select distinct l from Lab l join fetch l.bookings where l.id in :ids order by l.id\")\nList<Lab> fetchTheoId(List<Long> ids);");
const OUT71_F = out("=== F. join fetch l.bookings + phân trang (trang 0, 5 phòng)\n     1× select l1_0.id,b1_0.lab_id,b1_0.id,b1_0.end_at,b1_0.start_at,b1_0.status,b1_0.student_id,l1_0.capacity,l1_0.code,l1_0.name from (select l1_0.id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 where exists(select 1 from bookings b1_0 where l1_0.id=b1_0.lab_id) order by l1_0.id offset ? rows fetch first ? rows only) l1_0(id,capacity,code,name) join bookings b1_0 on l1_0.id=b1_0.lab_id order by l1_0.id\n  kết quả: 5 phòng, tổng 500 lượt đặt\n  Statistics: 1 câu SQL · 505 entity nạp · 75 ms");
const OUT71_G = out("=== G. Sửa F: phân trang trên id, rồi fetch theo id\n     1× select l1_0.id from labs l1_0 order by l1_0.id fetch first ? rows only\n     1× select distinct l1_0.id,b1_0.lab_id,b1_0.id,b1_0.end_at,b1_0.start_at,b1_0.status,b1_0.student_id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 join bookings b1_0 on l1_0.id=b1_0.lab_id w…\n  kết quả: 5 phòng [1, 2, 3, 4, 5], tổng 500 lượt đặt\n  Statistics: 2 câu SQL · 505 entity nạp · 41 ms");
const MA71_H = java("luot(\"H. join fetch HAI túi (bookings + rules) trong một câu\", st, tx, () -> {\n    try {\n        return em.createQuery(\"select l from Lab l join fetch l.bookings join fetch l.rules\", Lab.class).getResultList().size() + \" phòng\";\n    } catch (RuntimeException e) {\n        Throwable r = e; while (r.getCause() != null) r = r.getCause();\n        return \"LỖI \" + e.getClass().getSimpleName() + \" ← \" + r.getClass().getSimpleName() + \": \" + r.getMessage();\n    }\n});\nluot(\"H2. Sửa: hai câu trong cùng giao dịch, mỗi câu fetch một túi\", st, tx, () -> {\n    List<Lab> ds = em.createQuery(\"select distinct l from Lab l join fetch l.bookings where l.id <= 5\", Lab.class).getResultList();\n    em.createQuery(\"select distinct l from Lab l join fetch l.rules where l in :ds\", Lab.class).setParameter(\"ds\", ds).getResultList();\n    return ds.size() + \" phòng, \" + ds.get(0).getBookings().size() + \" lượt + \" + ds.get(0).getRules() + \" ở phòng đầu\";\n});");
const OUT71_H = out("=== H. join fetch HAI túi (bookings + rules) trong một câu\n  kết quả: LỖI IllegalArgumentException ← MultipleBagFetchException: cannot simultaneously fetch multiple bags: [com.cuongthai.c7.mo.Lab.bookings, com.cuongthai.c7.mo.Lab.rules]\n  Statistics: 0 câu SQL · 0 entity nạp · 5 ms\n\n=== H2. Sửa: hai câu trong cùng giao dịch, mỗi câu fetch một túi\n     1× select distinct l1_0.id,b1_0.lab_id,b1_0.id,b1_0.end_at,b1_0.start_at,b1_0.status,b1_0.student_id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 join bookings b1_0 on l1_0.id=b1_0.lab_id w…\n     1× select distinct l1_0.id,l1_0.capacity,l1_0.code,l1_0.name,r1_0.lab_id,r1_0.rule from labs l1_0 join lab_rules r1_0 on l1_0.id=r1_0.lab_id where l1_0.id in (?,?,?,?,?)\n  kết quả: 5 phòng, 100 lượt + [Tắt máy khi về, Không mang đồ ăn] ở phòng đầu\n  Statistics: 2 câu SQL · 505 entity nạp · 26 ms");
const MA71_PRISMA = js("const ds = () => prisma.booking.findMany({ where: { status: \"APPROVED\" }, orderBy: { id: \"asc\" }, take: 100 });\nawait luot(\"P1. vòng for + await findUnique từng dòng\", async () => {\n  const out: string[] = [];\n  for (const b of await ds()) {\n    const lab = await prisma.lab.findUnique({ where: { id: b.labId } });\n    const sv = await prisma.student.findUnique({ where: { id: b.studentId } });\n    out.push(`${lab!.code}/${sv!.studentCode}`);\n  }\n  return out;\n});\nawait luot(\"P2. Promise.all(findUnique…) — cùng một nhịp\", async () => {\n  const bs = await ds();\n  return Promise.all(bs.map(async (b) => {\n    const [lab, sv] = await Promise.all([prisma.lab.findUnique({ where: { id: b.labId } }), prisma.student.findUnique({ where: { id: b.studentId } })]);\n    return `${lab!.code}/${sv!.studentCode}`;\n  }));\n});\nawait luot(\"P3. include: { lab: true, student: true }\", async () =>\n  (await prisma.booking.findMany({ where: { status: \"APPROVED\" }, orderBy: { id: \"asc\" }, take: 100, include: { lab: true, student: true } }))\n    .map((b) => `${b.lab.code}/${b.student.studentCode}`));");
const OUT71_PRISMA = out("=== P1. vòng for + await findUnique từng dòng\n     1× SELECT \"public\".\"bookings\".\"id\", \"public\".\"bookings\".\"lab_id\", \"public\".\"bookings\".\"student_id\", \"public\".\"bookings\".\"start_at\", \"public\".\"bookings\".\"end_at\", \"public\".\"bookings\".\"status\" FR…\n   100× SELECT \"public\".\"labs\".\"id\", \"public\".\"labs\".\"code\", \"public\".\"labs\".\"name\", \"public\".\"labs\".\"capacity\" FROM \"public\".\"labs\" WHERE (\"public\".\"labs\".\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n   100× SELECT \"public\".\"students\".\"id\", \"public\".\"students\".\"student_code\", \"public\".\"students\".\"email\" FROM \"public\".\"students\" WHERE (\"public\".\"students\".\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n  kết quả: 100 dòng, đầu tiên [\"LAB-02/SE180002\",\"LAB-03/SE180003\",\"LAB-04/SE180004\"] · 201 câu · 230 ms\n\n=== P2. Promise.all(findUnique…) — cùng một nhịp\n     1× SELECT \"public\".\"bookings\".\"id\", \"public\".\"bookings\".\"lab_id\", \"public\".\"bookings\".\"student_id\", \"public\".\"bookings\".\"start_at\", \"public\".\"bookings\".\"end_at\", \"public\".\"bookings\".\"status\" FR…\n     1× SELECT \"public\".\"labs\".\"id\", \"public\".\"labs\".\"code\", \"public\".\"labs\".\"name\", \"public\".\"labs\".\"capacity\" FROM \"public\".\"labs\" WHERE \"public\".\"labs\".\"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11…\n     1× SELECT \"public\".\"students\".\"id\", \"public\".\"students\".\"student_code\", \"public\".\"students\".\"email\" FROM \"public\".\"students\" WHERE \"public\".\"students\".\"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$1…\n  kết quả: 100 dòng, đầu tiên [\"LAB-02/SE180002\",\"LAB-03/SE180003\",\"LAB-04/SE180004\"] · 3 câu · 46 ms\n\n=== P3. include: { lab: true, student: true }\n     1× SELECT \"public\".\"bookings\".\"id\", \"public\".\"bookings\".\"lab_id\", \"public\".\"bookings\".\"student_id\", \"public\".\"bookings\".\"start_at\", \"public\".\"bookings\".\"end_at\", \"public\".\"bookings\".\"status\" FR…\n     1× SELECT \"public\".\"students\".\"id\", \"public\".\"students\".\"student_code\", \"public\".\"students\".\"email\" FROM \"public\".\"students\" WHERE \"public\".\"students\".\"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$1…\n     1× SELECT \"public\".\"labs\".\"id\", \"public\".\"labs\".\"code\", \"public\".\"labs\".\"name\", \"public\".\"labs\".\"capacity\" FROM \"public\".\"labs\" WHERE \"public\".\"labs\".\"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11…\n  kết quả: 100 dòng, đầu tiên [\"LAB-02/SE180002\",\"LAB-03/SE180003\",\"LAB-04/SE180004\"] · 3 câu · 13 ms");
const OUT71_TH = out("=== Thực hành 7.1 — ngây thơ\n     1× select b1_0.id,b1_0.end_at,b1_0.lab_id,b1_0.start_at,b1_0.status,b1_0.student_id from bookings b1_0 left join labs l1_0 on l1_0.id=b1_0.lab_id where l1_0.code=? and b1_0.status=? order by b1…\n    10× select s1_0.id,s1_0.email,s1_0.student_code from students s1_0 where s1_0.id=?\n     1× select l1_0.id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 where l1_0.id=?\n  kết quả: 50 dòng, đầu 1985 SE180185 Phòng thực hành 5, cuối 1005 SE180005 Phòng thực hành 5\n  Statistics: 12 câu SQL · 61 entity nạp · 194 ms\n\n=== Thực hành 7.1 — lời giải\n     1× select b1_0.id,s1_0.student_code,l1_0.name,b1_0.start_at from bookings b1_0 join labs l1_0 on l1_0.id=b1_0.lab_id join students s1_0 on s1_0.id=b1_0.student_id where l1_0.code=? and b1_0.sta…\n  kết quả: 50 dòng, đầu 1985 SE180185 Phòng thực hành 5, cuối 1005 SE180005 Phòng thực hành 5\n  Statistics: 1 câu SQL · 0 entity nạp · 29 ms");

const L71_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The N+1 problem: detect and fix</h2>
<p class="lead">One screen — "100 approved bookings: lab code / student code" — and one innocent repository call. Hibernate sent <strong>116</strong> SQL statements for it. The same screen can be served with <strong>one</strong>. This lesson measures every fix on a real PostgreSQL database (20 labs, 200 students, 2 000 bookings): <code>JOIN FETCH</code>, <code>@EntityGraph</code>, batch fetching, DTO projections, paging a fetched collection, and the exception you get when you fetch two lists at once.</p>

<h3>In everyday life first</h3>
<p>A librarian is asked for 100 borrowing slips together with each borrower's name. The slow way: fetch the box of slips, then walk to the member archive once per slip to look up a name — 1 trip for the slips plus N trips for the names. A smarter librarian notices the same borrower twice and remembers the name (that is Hibernate's first-level cache, which is why we will count 116, not 201). The best librarian asks the archive for all needed names in one list — or keeps a copy of the name on each slip (a join). The N+1 problem is exactly the walking.</p>

<h3>The mapping and the data</h3>
${MA71_BK}
<p>Both relationships are <code>LAZY</code> (Chapter 6.3 showed why <code>@ManyToOne</code> must be made lazy explicitly). The schema <code>schema7.sql</code> creates 20 labs, 200 students and 2 000 bookings; three bookings in four are <code>APPROVED</code>. Each query below runs inside one transaction and is measured with Hibernate's own <code>Statistics</code> plus a <code>StatementInspector</code> that records every SQL string Hibernate prepares (identical statements are grouped as <code>N×</code>):</p>
${MA71_DO}

<h3>Five ways to load the same screen</h3>
${MA71_REPO}
${MA71_A}
<p>B, C and D call <code>joinFetch</code>, <code>voiGraph</code> and <code>dto</code> and build the same strings. The run:</p>
${OUT71_ABCD}
<ul>
  <li><strong>A — N+1.</strong> One <code>SELECT</code> for the bookings, then one per <em>distinct</em> lab (15) and one per <em>distinct</em> student (100): 116 statements, 223 ms. The first-level cache saved 85 round trips because the same lab appears many times — so N is the number of distinct parents, not the number of rows. That is why N+1 hides in a test database with three labs and explodes in production.</li>
  <li><strong>B — <code>join fetch</code></strong> in JPQL: one statement with two inner joins; 37 ms. Same 215 entities in the persistence context.</li>
  <li><strong>C — <code>@EntityGraph(attributePaths = …)</code></strong> on the repository method: the same single statement, written as <code>left join</code> (an entity graph keeps bookings whose lab is null). Use it when you want to keep the query text and only change what is fetched.</li>
  <li><strong>D — DTO projection</strong> (<code>select new …BookingRow(b.id, l.code, s.studentCode)</code>): one statement, three columns, <strong>0 entities</strong> loaded, 10 ms. For a read-only list this is the cheapest option — no snapshots, no dirty checking at commit.</li>
</ul>
<p>The milliseconds come from a busy machine with the database in the same network namespace (round trip well under a millisecond). Across a real network each extra statement costs at least one round trip: at 1 ms per round trip, A's 115 extra statements add more than 115 ms per page view before PostgreSQL does any work.</p>

<h3>Batch fetching: when you cannot change the query</h3>
<p>Sometimes the N+1 comes from code you do not control (a library, a long service method). Hibernate can at least load the proxies in groups: set <code>spring.jpa.properties.hibernate.default_batch_fetch_size=16</code> (or <code>@BatchSize(size = 16)</code> on the entity) and rerun A unchanged:</p>
${OUT71_BATCH}
<p>9 statements instead of 116: one for the bookings, one for all 15 labs (<code>where id = any (?)</code> with an array), and 7 for 100 students in groups of 16. It is a good global default, but it is a mitigation, not a design: the page still issues a number of statements that grows with the data.</p>

<h3>Paging a fetched collection</h3>
<p>Now the other direction: "5 labs per page, each with its bookings". The tempting query is <code>join fetch l.bookings</code> plus a <code>Pageable</code>:</p>
${MA71_LREPO}
${OUT71_F}
<p>Most tutorials (and older Hibernate versions) warn that this pages <em>in memory</em>: SQL cannot apply <code>LIMIT 5</code> to labs when each lab occupies 100 joined rows, so Hibernate fetched everything and logged <code>HHH90003004</code>. Hibernate ORM 7.4.13 did something better — read the SQL: it moved the paging into a <strong>subquery</strong> on <code>labs</code> (<code>offset ? rows fetch first ? rows only</code>) and joined the bookings to those 5 labs only. One statement, 5 labs, 500 bookings. Measure on your version before you rewrite anything. The portable fix still works everywhere — page the ids, then fetch by id (G):</p>
${OUT71_G}

<h3>Two lists in one fetch: MultipleBagFetchException</h3>
<p><code>Lab</code> has two <code>List</code> collections: <code>bookings</code> and an <code>@ElementCollection</code> of house rules. Fetching both in one query:</p>
${MA71_H}
${OUT71_H}
<p>Hibernate refuses at query creation: two "bags" (unordered lists that allow duplicates) joined in one SQL would produce a Cartesian product — 100 bookings × 2 rules = 200 rows per lab — and Hibernate could not tell which duplicates are real. Do not "fix" it by changing <code>List</code> to <code>Set</code> blindly (the Cartesian product is still there, only hidden). Fetch one collection per query inside the same transaction, as H2 does: 2 statements, and the persistence context stitches the results onto the same <code>Lab</code> objects.</p>

<h3>How to find N+1 before your users do</h3>
<ul>
  <li>In development: <code>logging.level.org.hibernate.SQL=debug</code> and read the log for repeated statements; or turn on <code>hibernate.generate_statistics</code> and look at the "JDBC statements" line per session.</li>
  <li>In tests: assert on <code>Statistics.getPrepareStatementCount()</code> (Chapter 11) — a page that suddenly needs 116 statements fails the build.</li>
  <li>In production: the database sees thousands of identical fast queries; <code>pg_stat_statements</code> shows them with huge <code>calls</code> (Chapter 16).</li>
</ul>

<h3>🕵️ Hacker corner — N+1 turns a page size into a weapon</h3>
<p>Combine N+1 with an endpoint that accepts any <code>size</code>: every extra distinct parent on the page is one more round trip to the database, so a single request with <code>size=100000</code> becomes tens of thousands of statements and holds a pooled connection the whole time. A few such requests in parallel exhaust the pool for everyone (lesson 6.5 measured that 10 slow transactions are enough for a 10-connection pool). OWASP lists this as <strong>API4:2023 Unrestricted Resource Consumption</strong>. Defence: cap page sizes on the server (Lab 6 used <code>Math.min(size, 50)</code>), fetch with a fixed number of statements (B/C/D), and set a statement timeout for API roles.</p>

<h3>Compared with Node.js (Prisma)</h3>
<p>The same screen in Prisma 7.10.1 against the same tables:</p>
${MA71_PRISMA}
${OUT71_PRISMA}
<p>Prisma has no first-level cache, so the naive loop is a pure 1 + 2N: <strong>201</strong> queries (Hibernate needed 116 thanks to its cache). But Prisma batches <code>findUnique</code> calls made in the same tick (its built-in dataloader): with <code>Promise.all</code> the same code became 3 queries with <code>IN (…)</code>. <code>include</code> does the same deliberately — 3 queries, not a join. Interview phrasing: "Hibernate solves N+1 with joins or batch fetching; Prisma loads relations with one extra query per relation."</p>

<h3>In real life and at work</h3>
<ul>
  <li>Code review rule: any loop that touches <code>entity.getX()</code> on a lazy relation is a suspect; any endpoint that returns a list must say how many statements it costs.</li>
  <li>Choose per screen: list pages ⇒ DTO projection; "edit this aggregate" ⇒ fetch join or entity graph; unknown callers ⇒ <code>default_batch_fetch_size</code> as a safety net.</li>
  <li>A slow page with low database CPU and thousands of tiny queries in <code>pg_stat_statements</code> is almost always N+1.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is the N+1 problem?"</strong> — One query for a list, then one more per item to load a lazy relation. Here 1 + 15 + 100 = 116 statements for 100 rows; N is the number of distinct parents because of the first-level cache.</li>
  <li><strong>"How do you fix it?"</strong> — <code>JOIN FETCH</code> or <code>@EntityGraph</code> (one statement with joins), a DTO projection (one statement, no entities), or batch fetching as a mitigation (9 statements here).</li>
  <li><strong>"Can you paginate with JOIN FETCH on a collection?"</strong> — Classic answer: no, Hibernate pages in memory (HHH90003004). Measured on Hibernate 7.4: it rewrites to a subquery. The portable way: page ids, then fetch by ids.</li>
  <li><strong>"What is MultipleBagFetchException?"</strong> — Fetching two <code>List</code> collections in one query would create a Cartesian product; fetch them in separate queries.</li>
  <li><strong>"How do you detect N+1?"</strong> — SQL logging, Hibernate Statistics in tests, <code>pg_stat_statements</code> in production.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>New screen: "the 50 newest PENDING bookings of lab <code>LAB-05</code>, with student code and lab name".</li>
  <li>Write it first the naive way (derived query + touching the relations) and print the statement count with <code>Statistics</code>.</li>
  <li>Then make it cost a constant number of statements, whatever the data.</li>
</ol>
<p><strong>Done when:</strong> your version prints 1 statement whatever the data, the naive one prints more (and grows with the number of distinct students), and both return the same 50 lines.</p></div>
${giai('Show one solution', `${java(`public record PendingRow(Long id, String studentCode, String labName, LocalDateTime startAt) { }

@Query("""
       select new com.cuongthai.c7.mo.PendingRow(b.id, s.studentCode, l.name, b.startAt)
       from Booking b join b.lab l join b.student s
       where l.code = :code and b.status = 'PENDING'
       order by b.startAt desc, b.id desc limit 50""")
List<PendingRow> pendingOfLab(String code);`)}
${OUT71_TH}
<p>The naive version needed 12 statements (1 + 10 distinct students + 1 lab); this one needs 1. One statement, no entity in the persistence context. The lab name is the same for all 50 rows; a join costs nothing here because PostgreSQL reads that lab row once. A <code>join fetch</code> version also gives 1 statement — choose it only if you need to modify the entities.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">N+1</span><span class="v">One query for a list plus one per item for a lazy relation.</span></div>
  <div class="kv"><span class="k">JOIN FETCH</span><span class="v">JPQL join that also initialises the relation in the same statement.</span></div>
  <div class="kv"><span class="k">@EntityGraph</span><span class="v">Annotation that tells Spring Data which relations to fetch for a repository method.</span></div>
  <div class="kv"><span class="k">Batch fetching</span><span class="v">Loading uninitialised proxies in groups (<code>id = any(?)</code>), set by <code>default_batch_fetch_size</code> or <code>@BatchSize</code>.</span></div>
  <div class="kv"><span class="k">DTO projection</span><span class="v">Query that returns only the needed columns into a record, not entities.</span></div>
  <div class="kv"><span class="k">Bag</span><span class="v">Hibernate's name for an unordered <code>List</code> collection that allows duplicates.</span></div>
  <div class="kv"><span class="k">MultipleBagFetchException</span><span class="v">Refusal to fetch two bags in one query (Cartesian product).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Naive list + lazy relations: 116 statements for 100 rows (1 + 15 distinct labs + 100 distinct students).</li>
  <li><code>join fetch</code> and <code>@EntityGraph</code>: 1 statement; DTO projection: 1 statement and 0 entities.</li>
  <li><code>default_batch_fetch_size=16</code>: 9 statements without changing the code — a safety net.</li>
  <li>Hibernate 7.4 pages a collection fetch with a subquery; "page ids, then fetch" works on every version.</li>
  <li>Two <code>List</code> fetches in one query ⇒ <code>MultipleBagFetchException</code>; use one query per collection.</li>
  <li>Prisma: naive loop 201 queries, <code>include</code>/<code>Promise.all</code> 3 queries.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#fetching', '📘', 'Hibernate ORM 7 User Guide — Fetching', 'Fetch strategies, batch fetching, entity graphs.')}
${tl('https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.entity-graph', '🍃', 'Spring Data JPA — Configuring fetch and load graphs', '@EntityGraph on repository methods.')}
${tl('https://vladmihalcea.com/n-plus-1-query-problem/', '📙', 'Vlad Mihalcea — N+1 query problem with JPA and Hibernate', 'How to detect it automatically in tests.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/', '🛡️', 'OWASP API4:2023 — Unrestricted Resource Consumption', 'Why page sizes and query cost are security issues.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: C7App profile <code>e71</code> on Spring Boot 4.1.2, Spring Data JPA 4.1.2, Hibernate ORM 7.4.13.Final, PostgreSQL 16.15, schema7.sql (20/11/2026); Prisma 7.10.1 + @prisma/adapter-pg on Node 22, script p71.ts.</li>
  <li>Hibernate ORM documentation (fetching, <code>HHH90003004</code>, <code>MultipleBagFetchException</code>).</li>
</ul>
</div>
`;

const L71_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Vấn đề N+1: phát hiện và sửa</h2>
<p class="lead">Một màn hình — "100 lượt đặt đã duyệt: mã phòng / mã sinh viên" — và một lời gọi repository trông vô hại. Hibernate gửi <strong>116</strong> câu SQL cho nó. Cùng màn hình đó phục vụ được bằng <strong>một</strong> câu. Bài này đo từng cách sửa trên PostgreSQL thật (20 phòng, 200 sinh viên, 2 000 lượt đặt): <code>JOIN FETCH</code>, <code>@EntityGraph</code>, batch fetching, DTO projection, phân trang khi fetch một collection, và exception bạn nhận khi fetch hai danh sách cùng lúc.</p>

<h3>Đời thường trước đã</h3>
<p>Thủ thư được nhờ lấy 100 phiếu mượn kèm tên người mượn. Cách chậm: lấy hộp phiếu, rồi với mỗi phiếu lại đi xuống kho hồ sơ tra một cái tên — 1 chuyến lấy phiếu cộng N chuyến tra tên. Thủ thư khôn hơn nhận ra cùng một người mượn xuất hiện hai lần và nhớ luôn tên (đó là cache cấp 1 của Hibernate, vì thế lát nữa ta đếm được 116 chứ không phải 201). Thủ thư giỏi nhất đưa kho hồ sơ một danh sách tất cả tên cần tra trong một lần — hoặc ghi sẵn tên lên từng phiếu (một phép join). Vấn đề N+1 chính là những chuyến đi bộ đó.</p>

<h3>Ánh xạ và dữ liệu</h3>
${MA71_BK}
<p>Cả hai quan hệ đều <code>LAZY</code> (bài 6.3 đã cho thấy vì sao phải tự đặt LAZY cho <code>@ManyToOne</code>). Tệp <code>schema7.sql</code> tạo 20 phòng, 200 sinh viên và 2 000 lượt đặt; cứ bốn lượt thì ba lượt <code>APPROVED</code>. Mỗi truy vấn dưới đây chạy trong một giao dịch và được đo bằng chính <code>Statistics</code> của Hibernate, cộng một <code>StatementInspector</code> ghi lại mọi chuỗi SQL Hibernate chuẩn bị gửi (câu giống nhau được gom thành <code>N×</code>):</p>
${MA71_DO}

<h3>Năm cách nạp cùng một màn hình</h3>
${MA71_REPO}
${MA71_A}
<p>B, C và D gọi <code>joinFetch</code>, <code>voiGraph</code> và <code>dto</code> rồi dựng cùng các chuỗi đó. Kết quả chạy:</p>
${OUT71_ABCD}
<ul>
  <li><strong>A — N+1.</strong> Một <code>SELECT</code> lấy lượt đặt, rồi mỗi phòng <em>khác nhau</em> một câu (15) và mỗi sinh viên <em>khác nhau</em> một câu (100): 116 câu, 223 ms. Cache cấp 1 đã tiết kiệm 85 chuyến vì cùng một phòng xuất hiện nhiều lần — nên N là số phía cha khác nhau, không phải số dòng. Vì thế N+1 trốn kỹ trong CSDL thử có ba phòng rồi bùng nổ ở production.</li>
  <li><strong>B — <code>join fetch</code></strong> trong JPQL: một câu với hai phép inner join; 37 ms. Vẫn 215 entity trong persistence context.</li>
  <li><strong>C — <code>@EntityGraph(attributePaths = …)</code></strong> trên phương thức repository: cùng một câu duy nhất, viết bằng <code>left join</code> (entity graph giữ cả lượt đặt có lab null). Dùng khi muốn giữ nguyên câu truy vấn, chỉ đổi thứ được fetch.</li>
  <li><strong>D — DTO projection</strong> (<code>select new …BookingRow(b.id, l.code, s.studentCode)</code>): một câu, ba cột, <strong>0 entity</strong> được nạp, 10 ms. Với danh sách chỉ đọc đây là cách rẻ nhất — không ảnh chụp, không dirty checking lúc commit.</li>
</ul>
<p>Số mili giây đo trên một máy đang bận, CSDL nằm cùng network namespace (một chuyến đi về chưa tới một mili giây). Qua mạng thật, mỗi câu thừa tốn ít nhất một chuyến đi về: ở mức 1 ms mỗi chuyến, 115 câu thừa của A cộng thêm hơn 115 ms cho mỗi lần xem trang, trước cả khi PostgreSQL làm việc gì.</p>

<h3>Batch fetching: khi không sửa được câu truy vấn</h3>
<p>Có lúc N+1 đến từ mã bạn không kiểm soát (một thư viện, một phương thức service dài). Ít nhất Hibernate có thể nạp các proxy theo nhóm: đặt <code>spring.jpa.properties.hibernate.default_batch_fetch_size=16</code> (hoặc <code>@BatchSize(size = 16)</code> trên entity) rồi chạy lại A, không sửa gì:</p>
${OUT71_BATCH}
<p>9 câu thay vì 116: một câu lấy lượt đặt, một câu lấy cả 15 phòng (<code>where id = any (?)</code> với một mảng), và 7 câu lấy 100 sinh viên theo nhóm 16. Đây là giá trị mặc định toàn cục tốt, nhưng nó là biện pháp giảm nhẹ, không phải thiết kế: số câu của trang vẫn tăng theo dữ liệu.</p>

<h3>Phân trang khi fetch một collection</h3>
<p>Giờ đi chiều ngược lại: "mỗi trang 5 phòng, mỗi phòng kèm các lượt đặt". Câu dễ nghĩ tới là <code>join fetch l.bookings</code> cộng một <code>Pageable</code>:</p>
${MA71_LREPO}
${OUT71_F}
<p>Phần lớn hướng dẫn (và các bản Hibernate cũ) cảnh báo cách này phân trang <em>trong bộ nhớ</em>: SQL không áp <code>LIMIT 5</code> lên phòng được khi mỗi phòng chiếm 100 dòng join, nên Hibernate lấy hết rồi ghi log <code>HHH90003004</code>. Hibernate ORM 7.4.13 làm tốt hơn — đọc câu SQL: nó đẩy phân trang vào một <strong>truy vấn con</strong> trên <code>labs</code> (<code>offset ? rows fetch first ? rows only</code>) và chỉ join lượt đặt của đúng 5 phòng đó. Một câu, 5 phòng, 500 lượt đặt. Hãy đo trên phiên bản của bạn trước khi viết lại bất cứ thứ gì. Cách sửa dùng được ở mọi phiên bản vẫn đúng — phân trang trên id, rồi fetch theo id (G):</p>
${OUT71_G}

<h3>Hai danh sách trong một lần fetch: MultipleBagFetchException</h3>
<p><code>Lab</code> có hai collection kiểu <code>List</code>: <code>bookings</code> và một <code>@ElementCollection</code> nội quy phòng. Fetch cả hai trong một câu:</p>
${MA71_H}
${OUT71_H}
<p>Hibernate từ chối ngay lúc tạo truy vấn: hai "bag" (danh sách không thứ tự, cho trùng) join trong một câu SQL sẽ sinh tích Descartes — 100 lượt đặt × 2 nội quy = 200 dòng mỗi phòng — và Hibernate không biết bản trùng nào là thật. Đừng "sửa" bằng cách đổi bừa <code>List</code> thành <code>Set</code> (tích Descartes vẫn còn, chỉ bị che đi). Fetch mỗi collection một câu trong cùng giao dịch, như H2: 2 câu, persistence context tự ghép kết quả vào đúng các đối tượng <code>Lab</code>.</p>

<h3>Tìm N+1 trước khi người dùng tìm ra</h3>
<ul>
  <li>Lúc phát triển: <code>logging.level.org.hibernate.SQL=debug</code> rồi đọc log tìm câu lặp lại; hoặc bật <code>hibernate.generate_statistics</code> và xem dòng "JDBC statements" của mỗi phiên.</li>
  <li>Trong test: kiểm <code>Statistics.getPrepareStatementCount()</code> (Chương 11) — một trang bỗng cần 116 câu sẽ làm đỏ bản build.</li>
  <li>Ở production: CSDL thấy hàng nghìn câu nhỏ giống hệt nhau; <code>pg_stat_statements</code> cho thấy chúng với cột <code>calls</code> khổng lồ (Chương 16).</li>
</ul>

<h3>🕵️ Góc hacker — N+1 biến cỡ trang thành vũ khí</h3>
<p>Ghép N+1 với một endpoint nhận <code>size</code> bao nhiêu cũng được: mỗi phía cha khác nhau trên trang là thêm một chuyến tới CSDL, nên một request <code>size=100000</code> thành hàng chục nghìn câu lệnh và giữ một kết nối của pool suốt thời gian đó. Vài request như vậy chạy song song là cạn pool cho tất cả mọi người (bài 6.5 đã đo: 10 giao dịch chậm là đủ với pool 10 kết nối). OWASP xếp loại này là <strong>API4:2023 Unrestricted Resource Consumption</strong>. Cách phòng: chặn cỡ trang ở server (Lab 6 dùng <code>Math.min(size, 50)</code>), fetch với số câu cố định (B/C/D), và đặt statement timeout cho vai trò CSDL của API.</p>

<h3>So với Node.js (Prisma)</h3>
<p>Cùng màn hình bằng Prisma 7.10.1 trên cùng các bảng:</p>
${MA71_PRISMA}
${OUT71_PRISMA}
<p>Prisma không có cache cấp 1, nên vòng lặp ngây thơ là 1 + 2N đúng nghĩa: <strong>201</strong> truy vấn (Hibernate cần 116 nhờ cache). Nhưng Prisma gom các lời gọi <code>findUnique</code> phát ra trong cùng một nhịp (dataloader có sẵn): với <code>Promise.all</code>, cùng đoạn mã thành 3 truy vấn có <code>IN (…)</code>. <code>include</code> làm đúng như vậy một cách chủ động — 3 truy vấn, không phải một phép join. Câu trả lời phỏng vấn: "Hibernate xử lý N+1 bằng join hoặc batch fetching; Prisma nạp quan hệ bằng một truy vấn thêm cho mỗi quan hệ."</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Luật review mã: vòng lặp nào chạm <code>entity.getX()</code> trên quan hệ lazy đều đáng nghi; endpoint nào trả danh sách đều phải nói được nó tốn bao nhiêu câu.</li>
  <li>Chọn theo từng màn hình: trang danh sách ⇒ DTO projection; "sửa cả khối dữ liệu này" ⇒ fetch join hoặc entity graph; không biết ai sẽ gọi ⇒ <code>default_batch_fetch_size</code> làm lưới an toàn.</li>
  <li>Trang chậm mà CPU CSDL thấp, <code>pg_stat_statements</code> đầy hàng nghìn truy vấn nhỏ — gần như chắc chắn là N+1.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Vấn đề N+1 là gì?"</strong> — Một câu lấy danh sách, rồi mỗi phần tử thêm một câu để nạp quan hệ lazy. Ở đây 1 + 15 + 100 = 116 câu cho 100 dòng; N là số phía cha khác nhau nhờ cache cấp 1.</li>
  <li><strong>"Sửa thế nào?"</strong> — <code>JOIN FETCH</code> hoặc <code>@EntityGraph</code> (một câu có join), DTO projection (một câu, không entity), hoặc batch fetching để giảm nhẹ (ở đây 9 câu).</li>
  <li><strong>"Phân trang được với JOIN FETCH trên collection không?"</strong> — Câu trả lời kinh điển: không, Hibernate phân trang trong bộ nhớ (HHH90003004). Đo trên Hibernate 7.4: nó viết lại thành truy vấn con. Cách dùng được mọi nơi: phân trang trên id, rồi fetch theo id.</li>
  <li><strong>"MultipleBagFetchException là gì?"</strong> — Fetch hai collection <code>List</code> trong một câu sẽ sinh tích Descartes; hãy fetch bằng các câu riêng.</li>
  <li><strong>"Phát hiện N+1 bằng cách nào?"</strong> — Log SQL, Hibernate Statistics trong test, <code>pg_stat_statements</code> ở production.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Màn hình mới: "50 lượt đặt PENDING mới nhất của phòng <code>LAB-05</code>, kèm mã sinh viên và tên phòng".</li>
  <li>Viết trước theo cách ngây thơ (truy vấn suy từ tên + chạm quan hệ) và in số câu bằng <code>Statistics</code>.</li>
  <li>Rồi làm cho nó tốn một số câu cố định, dữ liệu thế nào cũng vậy.</li>
</ol>
<p><strong>Đạt khi:</strong> bản của bạn in 1 câu dù dữ liệu thế nào, bản ngây thơ in nhiều hơn (và tăng theo số sinh viên khác nhau), và cả hai trả cùng 50 dòng.</p></div>
${giai('Xem một lời giải', `${java(`public record PendingRow(Long id, String studentCode, String labName, LocalDateTime startAt) { }

@Query("""
       select new com.cuongthai.c7.mo.PendingRow(b.id, s.studentCode, l.name, b.startAt)
       from Booking b join b.lab l join b.student s
       where l.code = :code and b.status = 'PENDING'
       order by b.startAt desc, b.id desc limit 50""")
List<PendingRow> pendingOfLab(String code);`)}
${OUT71_TH}
<p>Bản ngây thơ cần 12 câu (1 + 10 sinh viên khác nhau + 1 phòng); bản này cần 1. Một câu, không entity nào trong persistence context. Tên phòng giống nhau cho cả 50 dòng; phép join ở đây gần như không tốn gì vì PostgreSQL đọc dòng phòng đó một lần. Bản <code>join fetch</code> cũng cho 1 câu — chỉ chọn nó khi cần sửa entity.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">N+1</span><span class="v">Một câu lấy danh sách cộng mỗi phần tử một câu cho quan hệ lazy.</span></div>
  <div class="kv"><span class="k">JOIN FETCH</span><span class="v">Phép join trong JPQL đồng thời khởi tạo luôn quan hệ trong cùng câu.</span></div>
  <div class="kv"><span class="k">@EntityGraph</span><span class="v">Annotation báo cho Spring Data biết cần fetch quan hệ nào cho một phương thức repository.</span></div>
  <div class="kv"><span class="k">Batch fetching</span><span class="v">Nạp các proxy chưa khởi tạo theo nhóm (<code>id = any(?)</code>), đặt bằng <code>default_batch_fetch_size</code> hoặc <code>@BatchSize</code>.</span></div>
  <div class="kv"><span class="k">DTO projection</span><span class="v">Truy vấn chỉ trả các cột cần vào một record, không phải entity.</span></div>
  <div class="kv"><span class="k">Bag</span><span class="v">Tên Hibernate gọi collection <code>List</code> không thứ tự, cho phép trùng.</span></div>
  <div class="kv"><span class="k">MultipleBagFetchException</span><span class="v">Lỗi từ chối fetch hai bag trong một câu (tích Descartes).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Danh sách ngây thơ + quan hệ lazy: 116 câu cho 100 dòng (1 + 15 phòng khác nhau + 100 sinh viên khác nhau).</li>
  <li><code>join fetch</code> và <code>@EntityGraph</code>: 1 câu; DTO projection: 1 câu và 0 entity.</li>
  <li><code>default_batch_fetch_size=16</code>: 9 câu mà không sửa mã — một lưới an toàn.</li>
  <li>Hibernate 7.4 phân trang fetch collection bằng truy vấn con; "phân trang id, rồi fetch" chạy ở mọi phiên bản.</li>
  <li>Fetch hai <code>List</code> trong một câu ⇒ <code>MultipleBagFetchException</code>; mỗi collection một câu.</li>
  <li>Prisma: vòng lặp ngây thơ 201 truy vấn, <code>include</code>/<code>Promise.all</code> 3 truy vấn.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#fetching', '📘', 'Hibernate ORM 7 User Guide — Fetching', 'Chiến lược fetch, batch fetching, entity graph.')}
${tl('https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.entity-graph', '🍃', 'Spring Data JPA — Configuring fetch and load graphs', '@EntityGraph trên phương thức repository.')}
${tl('https://vladmihalcea.com/n-plus-1-query-problem/', '📙', 'Vlad Mihalcea — N+1 query problem with JPA and Hibernate', 'Cách tự động phát hiện trong test.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/', '🛡️', 'OWASP API4:2023 — Unrestricted Resource Consumption', 'Vì sao cỡ trang và chi phí truy vấn là chuyện bảo mật.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: C7App profile <code>e71</code> chạy Spring Boot 4.1.2, Spring Data JPA 4.1.2, Hibernate ORM 7.4.13.Final, PostgreSQL 16.15, schema7.sql (20/11/2026); Prisma 7.10.1 + @prisma/adapter-pg trên Node 22, script p71.ts.</li>
  <li>Tài liệu Hibernate ORM (fetching, <code>HHH90003004</code>, <code>MultipleBagFetchException</code>).</li>
</ul>
</div>
`;

// ===== Bài 7.2 =====
const MA72_EAGER = java("/** Cùng bảng bookings, nhưng @ManyToOne để MẶC ĐỊNH (EAGER) — chỉ để so sánh. */\n@Entity @Table(name = \"bookings\") @Immutable\npublic class BookingEager {\n    @Id private Long id;\n    @ManyToOne @JoinColumn(name = \"lab_id\") private Lab lab;\n    @ManyToOne @JoinColumn(name = \"student_id\") private Student student;\n    private String status;\n    // … getter\n}");
const MA72_CLI = java("luot(\"I. EAGER + truy vấn suy từ tên: findTop20…, KHÔNG chạm quan hệ nào\", st, tx, () ->\n        eager.findTop20ByStatusOrderByIdAsc(\"APPROVED\").size() + \" lượt đặt\");\nluot(\"I2. EAGER + em.find(BookingEager.class, 5)\", st, tx, () ->\n        \"phòng \" + em.find(BookingEager.class, 5L).getLab().getCode());\n\nbuoc(\"J. LAZY: nạp trong giao dịch, dùng SAU khi giao dịch đóng\");\nBooking b = tx.execute(s -> bookings.findById(5L).orElseThrow());\nSystem.out.println(\"  lớp của b.getLab(): \" + b.getLab().getClass().getSimpleName());\nSystem.out.println(\"  Hibernate.isInitialized(b.getLab()) = \" + Hibernate.isInitialized(b.getLab()));\nSystem.out.println(\"  b.getLab().getId() = \" + b.getLab().getId() + \"   (id có sẵn trong proxy, không cần CSDL)\");\ntry { System.out.println(b.getLab().getName()); }\ncatch (RuntimeException e) { System.out.println(\"  b.getLab().getName() ⇒ \" + e.getClass().getName() + \": \" + e.getMessage()); }\n\nluot(\"K. Sửa J: lấy đúng thứ cần ngay trong giao dịch (DTO)\", st, tx, () -> bookings.row(5L).toString());");
const OUT72_CLI = out("=== I. EAGER + truy vấn suy từ tên: findTop20…, KHÔNG chạm quan hệ nào\n     1× select be1_0.id,be1_0.lab_id,be1_0.status,be1_0.student_id from bookings be1_0 where be1_0.status=? order by be1_0.id fetch first ? rows only\n    15× select l1_0.id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 where l1_0.id=?\n    20× select s1_0.id,s1_0.email,s1_0.student_code from students s1_0 where s1_0.id=?\n  kết quả: 20 lượt đặt\n  Statistics: 36 câu SQL · 55 entity nạp · 157 ms\n\n=== I2. EAGER + em.find(BookingEager.class, 5)\n     1× select be1_0.id,l1_0.id,l1_0.capacity,l1_0.code,l1_0.name,be1_0.status,s1_0.id,s1_0.email,s1_0.student_code from bookings be1_0 left join labs l1_0 on l1_0.id=be1_0.lab_id left join students…\n  kết quả: phòng LAB-05\n  Statistics: 1 câu SQL · 3 entity nạp · 4 ms\n\n=== J. LAZY: nạp trong giao dịch, dùng SAU khi giao dịch đóng\n  lớp của b.getLab(): Lab$HibernateProxy\n  Hibernate.isInitialized(b.getLab()) = false\n  b.getLab().getId() = 5   (id có sẵn trong proxy, không cần CSDL)\n  b.getLab().getName() ⇒ org.hibernate.LazyInitializationException: Could not initialize proxy [com.cuongthai.c7.mo.Lab#5] - no session\n\n=== K. Sửa J: lấy đúng thứ cần ngay trong giao dịch (DTO)\n     1× select b1_0.id,l1_0.code,s1_0.student_code from bookings b1_0 join labs l1_0 on l1_0.id=b1_0.lab_id join students s1_0 on s1_0.id=b1_0.student_id where b1_0.id=?\n  kết quả: BookingRow[id=5, labCode=LAB-05, studentCode=SE180005]\n  Statistics: 1 câu SQL · 0 entity nạp · 12 ms");
const MA72_WEB = java("/** Bài 7.2 — open-in-view: controller chạm quan hệ LAZY sau khi service đã trả về. */\n@RestController @Profile(\"e72\")\nclass E72Controller {\n    private final E72Service svc;\n    E72Controller(E72Service svc) { this.svc = svc; }\n\n    @GetMapping(\"/e72/bookings/{id}/lab\")\n    String lab(@PathVariable Long id) {\n        Booking b = svc.tim(id);                              // giao dịch của service đã đóng ở đây\n        return \"lượt \" + b.getId() + \" ở \" + b.getLab().getName();   // chạm quan hệ LAZY trong controller\n    }\n\n    @GetMapping(\"/e72/cham/{id}\")\n    String cham(@PathVariable Long id) throws InterruptedException {\n        BookingRow r = svc.dong(id);                          // đọc CSDL xong, giao dịch đã commit\n        Thread.sleep(1000);                                   // \"gọi API bên ngoài\" mất 1 giây\n        return r.labCode();\n    }\n}\n\n@Service @Profile(\"e72\")\nclass E72Service {\n    private final BookingRepo bookings;\n    E72Service(BookingRepo b) { bookings = b; }\n    @Transactional(readOnly = true) public Booking tim(Long id) { return bookings.findById(id).orElseThrow(); }\n    @Transactional(readOnly = true) public BookingRow dong(Long id) { return bookings.row(id); }\n}");
const OUT72_BAT = out("--- log lúc khởi động (WARN)\nWARN  guration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning\n\n$ curl -s -w \" → %{http_code}\\n\" localhost:41890/e72/bookings/5/lab\nlượt 5 ở Phòng thực hành 5 → 200\n--- log của request đó\nDEBUG SQL                          : select b1_0.id,b1_0.end_at,b1_0.lab_id,b1_0.start_at,b1_0.status,b1_0.student_id from bookings b1_0 where b1_0.id=?\nDEBUG SQL                          : select l1_0.id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 where l1_0.id=?\n\n$ seq 20 | xargs -P 20 -I{} curl -s -o /dev/null -w \"%{http_code}\\n\" localhost:41890/e72/cham/{} | sort | uniq -c\n     10 200\n     10 500\ntổng thời gian: 2.18 s\n  HikariPool-1 - Connection is not available, request timed out after 2000ms (total=5, active=5, idle=0, waiting=7)");
const OUT72_TAT = out("--- log lúc khởi động (WARN)\n\n$ curl -s -w \" → %{http_code}\\n\" localhost:41890/e72/bookings/5/lab\n{\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/e72/bookings/5/lab\"} → 500\n--- log của request đó\nDEBUG SQL                          : select b1_0.id,b1_0.end_at,b1_0.lab_id,b1_0.start_at,b1_0.status,b1_0.student_id from bookings b1_0 where b1_0.id=?\nERROR [dispatcherServlet]          : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: org.hibernate.LazyInitializationException: Could not initialize proxy [com.cuongthai.c7.mo.Lab#5] - no se\norg.hibernate.LazyInitializationException: Could not initialize proxy [com.cuongthai.c7.mo.Lab#5] - no session\n\tat org.hibernate.proxy.AbstractLazyInitializer.initialize(AbstractLazyInitializer.java:178)\n\tat org.hibernate.proxy.AbstractLazyInitializer.getImplementation(AbstractLazyInitializer.java:348)\n\tat org.hibernate.proxy.pojo.BasicLazyInitializer.invoke(BasicLazyInitializer.java:88)\n\n$ seq 20 | xargs -P 20 -I{} curl -s -o /dev/null -w \"%{http_code}\\n\" localhost:41890/e72/cham/{} | sort | uniq -c\n     20 200\ntổng thời gian: 1.10 s");

const L72_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Lazy vs eager, LazyInitializationException and open-in-view</h2>
<p class="lead">"Just make it EAGER" and "just turn on open-in-view" are the two most common answers to <code>LazyInitializationException</code> on Stack Overflow. Both make the exception disappear, and both move the cost somewhere you do not see it. Measured here: an EAGER mapping that sent 36 statements for a query that touched no relation, and open-in-view turning 20 ordinary requests into 10 server errors on a 5-connection pool.</p>

<h3>In everyday life first</h3>
<p>You borrow a reference book from the library reading room; you may read it only while you are inside. A <strong>lazy</strong> relation is a slip that says "the full chapter is in the reading room": cheap to carry, but useless once the room is closed — that is <code>LazyInitializationException</code>. <strong>Eager</strong> means photocopying every referenced chapter whenever you borrow anything, even if you never read them. <strong>Open-in-view</strong> means keeping the reading room open — and keeping your seat reserved — until you have finished writing your whole report at home.</p>

<h3>1. EAGER does not mean JOIN</h3>
${MA72_EAGER}
${MA72_CLI}
${OUT72_CLI}
<ul>
  <li><strong>I.</strong> A derived query on an entity whose relations are EAGER (the JPA default for <code>@ManyToOne</code>), and the code did not touch any relation. Hibernate still sent <strong>36</strong> statements: the JPQL query cannot "see" the annotation as a join, so after the main <code>SELECT</code> it loaded every distinct lab (15) and student (20) immediately. EAGER is N+1 that you can no longer switch off per query.</li>
  <li><strong>I2.</strong> <code>em.find</code> by id is the one case where EAGER becomes a single <code>left join</code> — which is why EAGER looks fine in a quick test.</li>
  <li><strong>J.</strong> With <code>LAZY</code>, <code>b.getLab()</code> is a <code>Lab$HibernateProxy</code>, not initialised. <code>getId()</code> works without the database (the proxy knows its id), but <code>getName()</code> after the transaction has closed throws <code>LazyInitializationException: Could not initialize proxy [com.cuongthai.c7.mo.Lab#5] - no session</code>.</li>
  <li><strong>K.</strong> The fix is not to load more but to decide what you need while the transaction is open: here one DTO query.</li>
</ul>
<p>Rule of thumb used by most teams: make every <code>@ManyToOne</code> and <code>@OneToOne</code> <code>LAZY</code>, and fetch per use case (7.1: fetch join, entity graph, DTO).</p>

<h3>2. open-in-view: the default that hides the exception</h3>
<p>The same lazy access, now in a web controller — the service returns an entity and the controller reads <code>b.getLab().getName()</code>; a second endpoint reads a DTO and then spends one second calling an external API:</p>
${MA72_WEB}
<p>Run 1 — the Spring Boot default (no <code>spring.jpa.open-in-view</code> set), pool of 5 connections, 2-second wait limit:</p>
${OUT72_BAT}
<p>Spring Boot warns at startup: open-in-view is enabled by default. With it, an <code>OpenEntityManagerInViewInterceptor</code> opens the EntityManager when the request arrives and closes it only after the response is written. So the lazy lab was loaded by a <em>second</em> <code>SELECT</code> issued from the controller, outside any transaction — it works, silently. The price is in the second test: the EntityManager kept its JDBC connection for the whole request, including the one-second sleep after the service had already committed. Five connections, one second each, a two-second limit: 10 requests succeeded, 10 got HTTP 500 with <code>Connection is not available, request timed out after 2000ms (total=5, active=5, idle=0, waiting=7)</code>.</p>
<p>Run 2 — <code>spring.jpa.open-in-view=false</code>:</p>
${OUT72_TAT}
<p>Now the controller's lazy access fails loudly with <code>LazyInitializationException</code> — which is what you want: a bug you see in development, fixed with a DTO. And the slow endpoint is healthy: <strong>20 × 200 in 1.10 s</strong>, because each request returned its connection as soon as the service's transaction committed. Same code, same pool; the only difference is one property.</p>
<div class="callout warn"><p>Do not "solve" the exception with <code>hibernate.enable_lazy_load_no_trans=true</code>: it lets every lazy access open its own temporary session and connection, outside any transaction — N+1 with an extra connection per item. Fetch what you need inside the service.</p></div>

<h3>🕵️ Hacker corner — slow requests are enough</h3>
<p>The attack in run 1 needed no exploit: 20 requests to a legitimate endpoint that is merely slow (it waits for another API) took down every other endpoint that needs the database, because open-in-view tied a database connection to each waiting request. This is the database-pool version of <strong>Slowloris</strong> — the 2009 tool by Robert "RSnake" Hansen that kept web servers' connections busy with deliberately slow requests and was used against Iranian government sites during the protests that year. Defence: <code>open-in-view=false</code>; no network calls inside transactions (6.5); timeouts on outgoing calls; rate limits (Chapter 10) and pool metrics with alerts on <code>hikaricp_connections_pending</code> (Chapter 15).</p>

<h3>Compared with Node.js (Prisma)</h3>
<p>Prisma has no lazy loading and no proxies. A relation exists in the result only if you asked for it with <code>include</code> or <code>select</code> (7.1, P3), and the generated TypeScript type of a query without <code>include</code> has no <code>lab</code> property — the mistake that is a runtime <code>LazyInitializationException</code> in JPA is a compile-time error in Prisma. There is also no equivalent of open-in-view: a Prisma query takes a pooled connection only while it runs.</p>

<h3>In real life and at work</h3>
<ul>
  <li>New Spring Boot project: set <code>spring.jpa.open-in-view=false</code> on day one; turning it off later breaks every controller that relied on it.</li>
  <li>When a <code>LazyInitializationException</code> appears, the question is "which use case needs this data?" — then add a fetch join/entity graph/DTO for that use case, never EAGER globally.</li>
  <li>Jackson serialising entities with lazy relations is the same bug in another form; Chapter 4's rule (return DTOs) avoids both.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"LAZY or EAGER by default?"</strong> — JPA defaults: <code>@ManyToOne</code>/<code>@OneToOne</code> EAGER, collections LAZY. Make everything LAZY and fetch per use case; EAGER caused 36 statements for a query that did not use the relations.</li>
  <li><strong>"What causes LazyInitializationException?"</strong> — Initialising a proxy after its persistence context has closed. Fix by fetching inside the transaction (join fetch, entity graph, DTO).</li>
  <li><strong>"What is open-in-view and why disable it?"</strong> — Keeps the EntityManager open for the whole web request so lazy loading works in controllers/views; it hides N+1 and holds a connection for the whole request — 10 of 20 requests failed here.</li>
  <li><strong>"Why does getId() on a proxy not hit the database?"</strong> — The proxy is created from the foreign key, so it already knows the identifier.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run the e72 demo with <code>open-in-view=false</code> and fix <code>GET /e72/bookings/{id}/lab</code> so that it returns <code>lượt 5 ở Phòng thực hành 5</code> again.</li>
  <li>The controller must not touch any entity, and the request must cost exactly one SQL statement.</li>
</ol>
<p><strong>Done when:</strong> HTTP 200 with the same text, one <code>select</code> in the log for that request, and the pool test still gives 20 × 200.</p></div>
${giai('Show one solution', `${java(`public record LabOfBooking(Long id, String labName) { }

// BookingRepo
@Query("select new com.cuongthai.c7.e72.LabOfBooking(b.id, l.name) from Booking b join b.lab l where b.id = :id")
LabOfBooking labOf(Long id);

// E72Service
@Transactional(readOnly = true)
public LabOfBooking labOf(Long id) { return bookings.labOf(id); }

// E72Controller
@GetMapping("/e72/bookings/{id}/lab")
String lab(@PathVariable Long id) {
    LabOfBooking v = svc.labOf(id);
    return "lượt " + v.id() + " ở " + v.labName();
}`)}
<p>One statement with a join; nothing lazy leaves the service, so the controller cannot trigger a query even by accident.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">FetchType.LAZY</span><span class="v">Load the relation on first access through a proxy.</span></div>
  <div class="kv"><span class="k">FetchType.EAGER</span><span class="v">Load the relation immediately — by join for <code>find</code>, by extra selects for queries.</span></div>
  <div class="kv"><span class="k">Proxy</span><span class="v">Generated subclass (<code>Lab$HibernateProxy</code>) standing in for an entity not loaded yet.</span></div>
  <div class="kv"><span class="k">LazyInitializationException</span><span class="v">Proxy accessed after its session closed ("no session").</span></div>
  <div class="kv"><span class="k">Open Session/EntityManager in View</span><span class="v">EntityManager kept open for the whole web request (<code>spring.jpa.open-in-view</code>, default true).</span></div>
  <div class="kv"><span class="k">Pool starvation</span><span class="v">All pooled connections busy; new requests wait and time out.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>EAGER on <code>@ManyToOne</code>: 36 statements for 20 rows without touching the relations; a single join only for <code>em.find</code>.</li>
  <li>LAZY proxy outside the transaction: <code>getId()</code> fine, <code>getName()</code> ⇒ LazyInitializationException.</li>
  <li>open-in-view on (default, with a warning): the exception disappears; 20 slow requests on a 5-connection pool ⇒ 10 × 200, 10 × 500.</li>
  <li>open-in-view off: the bug is visible, and the same load gives 20 × 200 in 1.10 s.</li>
  <li>Fetch what each use case needs inside the service; return DTOs.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/data/sql.html#data.sql.jpa-and-spring-data.open-entity-manager-in-view', '🍃', 'Spring Boot — Open EntityManager in View', 'The property and the startup warning.')}
${tl('https://vladmihalcea.com/the-open-session-in-view-anti-pattern/', '📙', 'Vlad Mihalcea — The Open Session in View anti-pattern', 'Why it holds connections and hides N+1.')}
${tl('https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#fetching', '📘', 'Hibernate ORM 7 User Guide — Fetching', 'LAZY/EAGER, proxies and fetch plans.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: C7App profiles <code>e72cli</code> and <code>e72</code> on Spring Boot 4.1.2, Hibernate ORM 7.4.13.Final, HikariCP 7.0.2 (pool 5, connection-timeout 2000 ms, virtual threads), PostgreSQL 16.15 (20/11/2026); load generated with <code>xargs -P 20 curl</code>.</li>
  <li>Slowloris: tool published by Robert Hansen (RSnake) in June 2009; its use against Iranian government websites during the June 2009 election protests was widely reported at the time.</li>
</ul>
</div>
`;

const L72_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Lazy vs eager, LazyInitializationException và open-in-view</h2>
<p class="lead">"Cứ đặt EAGER" và "cứ bật open-in-view" là hai câu trả lời phổ biến nhất cho <code>LazyInitializationException</code> trên Stack Overflow. Cả hai đều làm exception biến mất, và cả hai đều đẩy chi phí sang chỗ bạn không nhìn thấy. Đo ở đây: một ánh xạ EAGER gửi 36 câu cho một truy vấn không chạm quan hệ nào, và open-in-view biến 20 request bình thường thành 10 lỗi server trên pool 5 kết nối.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn mượn một cuốn sách tham khảo ở phòng đọc của thư viện; chỉ được đọc khi còn ngồi trong phòng. Quan hệ <strong>lazy</strong> là tờ phiếu ghi "chương đầy đủ nằm trong phòng đọc": mang theo nhẹ, nhưng vô dụng khi phòng đã đóng cửa — đó là <code>LazyInitializationException</code>. <strong>Eager</strong> là cứ mượn bất cứ thứ gì thì photo luôn mọi chương được nhắc tới, kể cả khi không bao giờ đọc. <strong>Open-in-view</strong> là giữ phòng đọc mở — và giữ luôn chỗ ngồi của bạn — cho tới khi bạn viết xong cả bài báo cáo ở nhà.</p>

<h3>1. EAGER không có nghĩa là JOIN</h3>
${MA72_EAGER}
${MA72_CLI}
${OUT72_CLI}
<ul>
  <li><strong>I.</strong> Một truy vấn suy từ tên trên entity có quan hệ EAGER (mặc định của JPA cho <code>@ManyToOne</code>), và mã không chạm quan hệ nào. Hibernate vẫn gửi <strong>36</strong> câu: câu JPQL không "thấy" annotation như một phép join, nên sau <code>SELECT</code> chính nó nạp ngay mọi phòng khác nhau (15) và mọi sinh viên khác nhau (20). EAGER là N+1 mà bạn không còn tắt được theo từng truy vấn.</li>
  <li><strong>I2.</strong> <code>em.find</code> theo id là trường hợp duy nhất EAGER thành một <code>left join</code> — vì thế EAGER trông ổn trong một phép thử nhanh.</li>
  <li><strong>J.</strong> Với <code>LAZY</code>, <code>b.getLab()</code> là một <code>Lab$HibernateProxy</code>, chưa khởi tạo. <code>getId()</code> chạy được mà không cần CSDL (proxy biết id của nó), nhưng <code>getName()</code> sau khi giao dịch đã đóng ném <code>LazyInitializationException: Could not initialize proxy [com.cuongthai.c7.mo.Lab#5] - no session</code>.</li>
  <li><strong>K.</strong> Cách sửa không phải là nạp nhiều hơn mà là quyết định mình cần gì khi giao dịch còn mở: ở đây một truy vấn DTO.</li>
</ul>
<p>Quy tắc phần lớn các nhóm dùng: đặt mọi <code>@ManyToOne</code> và <code>@OneToOne</code> là <code>LAZY</code>, rồi fetch theo từng tình huống dùng (7.1: fetch join, entity graph, DTO).</p>

<h3>2. open-in-view: mặc định che giấu exception</h3>
<p>Cùng một lần truy cập lazy, giờ trong controller web — service trả về entity và controller đọc <code>b.getLab().getName()</code>; endpoint thứ hai đọc một DTO rồi mất một giây gọi API bên ngoài:</p>
${MA72_WEB}
<p>Lượt 1 — mặc định của Spring Boot (không đặt <code>spring.jpa.open-in-view</code>), pool 5 kết nối, chờ tối đa 2 giây:</p>
${OUT72_BAT}
<p>Spring Boot cảnh báo ngay lúc khởi động: open-in-view đang bật mặc định. Khi bật, một <code>OpenEntityManagerInViewInterceptor</code> mở EntityManager lúc request tới và chỉ đóng sau khi phản hồi đã ghi xong. Vì thế phòng lab lazy được nạp bằng một <code>SELECT</code> <em>thứ hai</em> phát ra từ controller, ngoài mọi giao dịch — chạy được, lặng lẽ. Cái giá nằm ở phép thử thứ hai: EntityManager giữ kết nối JDBC suốt cả request, kể cả một giây ngủ sau khi giao dịch của service đã commit. Năm kết nối, mỗi cái một giây, giới hạn chờ hai giây: 10 request thành công, 10 nhận HTTP 500 với <code>Connection is not available, request timed out after 2000ms (total=5, active=5, idle=0, waiting=7)</code>.</p>
<p>Lượt 2 — <code>spring.jpa.open-in-view=false</code>:</p>
${OUT72_TAT}
<p>Giờ lần truy cập lazy ở controller hỏng ồn ào bằng <code>LazyInitializationException</code> — đúng thứ ta muốn: một lỗi thấy ngay lúc phát triển, sửa bằng DTO. Còn endpoint chậm thì khoẻ: <strong>20 × 200 trong 1,10 s</strong>, vì mỗi request trả kết nối ngay khi giao dịch của service commit. Cùng mã, cùng pool; khác nhau đúng một thuộc tính.</p>
<div class="callout warn"><p>Đừng "giải quyết" exception bằng <code>hibernate.enable_lazy_load_no_trans=true</code>: nó cho mỗi lần truy cập lazy tự mở một phiên và một kết nối tạm, ngoài mọi giao dịch — N+1 kèm thêm một kết nối cho mỗi phần tử. Hãy fetch thứ cần ngay trong service.</p></div>

<h3>🕵️ Góc hacker — chỉ cần request chậm là đủ</h3>
<p>Cuộc tấn công ở lượt 1 không cần khai thác lỗ hổng nào: 20 request tới một endpoint hợp lệ chỉ đơn giản là chậm (nó chờ một API khác) đã quật ngã mọi endpoint khác cần CSDL, vì open-in-view buộc một kết nối CSDL vào mỗi request đang chờ. Đây là phiên bản pool CSDL của <strong>Slowloris</strong> — công cụ năm 2009 của Robert "RSnake" Hansen giữ bận các kết nối của web server bằng những request cố tình chậm, từng được dùng nhắm vào các trang của chính phủ Iran trong đợt biểu tình năm đó. Cách phòng: <code>open-in-view=false</code>; không gọi mạng trong giao dịch (6.5); đặt timeout cho lời gọi ra ngoài; giới hạn tần suất (Chương 10) và theo dõi số đo pool với cảnh báo trên <code>hikaricp_connections_pending</code> (Chương 15).</p>

<h3>So với Node.js (Prisma)</h3>
<p>Prisma không có lazy loading, không có proxy. Một quan hệ chỉ có trong kết quả nếu bạn xin nó bằng <code>include</code> hoặc <code>select</code> (7.1, P3), và kiểu TypeScript sinh ra cho truy vấn không có <code>include</code> không hề có thuộc tính <code>lab</code> — lỗi mà ở JPA là <code>LazyInitializationException</code> lúc chạy thì ở Prisma là lỗi biên dịch. Cũng không có thứ tương đương open-in-view: truy vấn Prisma chỉ cầm một kết nối của pool trong lúc nó chạy.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Dự án Spring Boot mới: đặt <code>spring.jpa.open-in-view=false</code> từ ngày đầu; để sau mới tắt là làm hỏng mọi controller đang dựa vào nó.</li>
  <li>Khi <code>LazyInitializationException</code> xuất hiện, câu hỏi là "tình huống dùng nào cần dữ liệu này?" — rồi thêm fetch join/entity graph/DTO cho đúng tình huống đó, không bao giờ đặt EAGER toàn cục.</li>
  <li>Jackson tuần tự hoá entity có quan hệ lazy là cùng một lỗi dưới hình dạng khác; luật của Chương 4 (trả DTO) tránh được cả hai.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Mặc định nên LAZY hay EAGER?"</strong> — Mặc định của JPA: <code>@ManyToOne</code>/<code>@OneToOne</code> là EAGER, collection là LAZY. Đặt hết thành LAZY rồi fetch theo tình huống; EAGER đã gây 36 câu cho một truy vấn không dùng quan hệ.</li>
  <li><strong>"Nguyên nhân LazyInitializationException?"</strong> — Khởi tạo một proxy sau khi persistence context của nó đã đóng. Sửa bằng cách fetch trong giao dịch (join fetch, entity graph, DTO).</li>
  <li><strong>"Open-in-view là gì, vì sao nên tắt?"</strong> — Giữ EntityManager mở suốt request web để lazy loading chạy được trong controller/view; nó che N+1 và giữ một kết nối suốt request — ở đây 10/20 request hỏng.</li>
  <li><strong>"Vì sao getId() trên proxy không chạm CSDL?"</strong> — Proxy được tạo từ khoá ngoại, nên đã biết sẵn id.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy demo e72 với <code>open-in-view=false</code> rồi sửa <code>GET /e72/bookings/{id}/lab</code> để nó trả lại <code>lượt 5 ở Phòng thực hành 5</code>.</li>
  <li>Controller không được chạm entity nào, và request phải tốn đúng một câu SQL.</li>
</ol>
<p><strong>Đạt khi:</strong> HTTP 200 với đúng chuỗi đó, log chỉ có một <code>select</code> cho request ấy, và phép thử pool vẫn cho 20 × 200.</p></div>
${giai('Xem một lời giải', `${java(`public record LabOfBooking(Long id, String labName) { }

// BookingRepo
@Query("select new com.cuongthai.c7.e72.LabOfBooking(b.id, l.name) from Booking b join b.lab l where b.id = :id")
LabOfBooking labOf(Long id);

// E72Service
@Transactional(readOnly = true)
public LabOfBooking labOf(Long id) { return bookings.labOf(id); }

// E72Controller
@GetMapping("/e72/bookings/{id}/lab")
String lab(@PathVariable Long id) {
    LabOfBooking v = svc.labOf(id);
    return "lượt " + v.id() + " ở " + v.labName();
}`)}
<p>Một câu có join; không có gì lazy rời khỏi service, nên controller không thể vô tình gây thêm truy vấn.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">FetchType.LAZY</span><span class="v">Nạp quan hệ ở lần truy cập đầu tiên, thông qua một proxy.</span></div>
  <div class="kv"><span class="k">FetchType.EAGER</span><span class="v">Nạp quan hệ ngay — bằng join khi <code>find</code>, bằng các câu select thêm khi truy vấn.</span></div>
  <div class="kv"><span class="k">Proxy</span><span class="v">Lớp con sinh tự động (<code>Lab$HibernateProxy</code>) đứng thay một entity chưa nạp.</span></div>
  <div class="kv"><span class="k">LazyInitializationException</span><span class="v">Truy cập proxy sau khi phiên của nó đã đóng ("no session").</span></div>
  <div class="kv"><span class="k">Open Session/EntityManager in View</span><span class="v">EntityManager mở suốt cả request web (<code>spring.jpa.open-in-view</code>, mặc định true).</span></div>
  <div class="kv"><span class="k">Cạn pool</span><span class="v">Mọi kết nối của pool đều bận; request mới phải chờ rồi hết giờ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>EAGER trên <code>@ManyToOne</code>: 36 câu cho 20 dòng dù không chạm quan hệ; chỉ <code>em.find</code> mới thành một phép join.</li>
  <li>Proxy LAZY ngoài giao dịch: <code>getId()</code> vẫn được, <code>getName()</code> ⇒ LazyInitializationException.</li>
  <li>open-in-view bật (mặc định, kèm cảnh báo): exception biến mất; 20 request chậm trên pool 5 kết nối ⇒ 10 × 200, 10 × 500.</li>
  <li>open-in-view tắt: lỗi lộ ra, và cùng tải đó cho 20 × 200 trong 1,10 s.</li>
  <li>Fetch đúng thứ mỗi tình huống cần ngay trong service; trả DTO.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/data/sql.html#data.sql.jpa-and-spring-data.open-entity-manager-in-view', '🍃', 'Spring Boot — Open EntityManager in View', 'Thuộc tính và cảnh báo lúc khởi động.')}
${tl('https://vladmihalcea.com/the-open-session-in-view-anti-pattern/', '📙', 'Vlad Mihalcea — The Open Session in View anti-pattern', 'Vì sao nó giữ kết nối và che N+1.')}
${tl('https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#fetching', '📘', 'Hibernate ORM 7 User Guide — Fetching', 'LAZY/EAGER, proxy và kế hoạch fetch.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: C7App profile <code>e72cli</code> và <code>e72</code> chạy Spring Boot 4.1.2, Hibernate ORM 7.4.13.Final, HikariCP 7.0.2 (pool 5, connection-timeout 2000 ms, virtual thread), PostgreSQL 16.15 (20/11/2026); tải tạo bằng <code>xargs -P 20 curl</code>.</li>
  <li>Slowloris: công cụ Robert Hansen (RSnake) công bố tháng 6/2009; việc nó bị dùng nhắm vào các trang chính phủ Iran trong đợt biểu tình sau bầu cử tháng 6/2009 được báo chí đưa tin rộng rãi khi đó.</li>
</ul>
</div>
`;

// ===== Bài 7.3 =====
const MA73_AUDIT = java("@Service @Profile(\"e73\")\npublic class AuditService {\n    private final AuditRepo audit;\n    AuditService(AuditRepo a) { audit = a; }\n\n    /** Giao dịch RIÊNG: commit dù giao dịch bên ngoài rollback. */\n    @Transactional(propagation = Propagation.REQUIRES_NEW)\n    public void ghiRieng(String msg) { audit.save(new AuditLog(msg)); }\n\n    /** Mặc định REQUIRED: nhập vào giao dịch đang có. */\n    @Transactional\n    public void ghiChung(String msg) { audit.save(new AuditLog(msg)); }\n\n    /** Bắt buộc phải được gọi trong một giao dịch có sẵn. */\n    @Transactional(propagation = Propagation.MANDATORY)\n    public void ghiBatBuoc(String msg) { audit.save(new AuditLog(msg)); }\n}");
const MA73_KIEM = java("/** REQUIRED (mặc định): ném lỗi ⇒ đánh dấu CẢ giao dịch chung là rollback-only. */\n@Transactional\npublic void kiemPhong(String code) { throw new IllegalStateException(\"phòng \" + code + \" đang bảo trì\"); }\n\n/** NESTED: chạy trong một SAVEPOINT của giao dịch ngoài. */\n@Transactional(propagation = Propagation.NESTED)\npublic void themLuotPhu(LocalDateTime t) {\n    bookings.save(new Booking(labs.getReferenceById(2L), students.getReferenceById(2L), t, t.plusHours(1), \"E73-PHU\"));\n    bookings.flush();\n    throw new IllegalStateException(\"lượt phụ trùng giờ\");\n}");
const MA73_DAT = java("/** 1–2. Đặt chỗ, ghi nhật ký, rồi hỏng. */\n@Transactional\npublic void datRoiHong(boolean nhatKyRieng) {\n    luu(\"E73-DAT\");\n    if (nhatKyRieng) audit.ghiRieng(\"sv1 thử đặt LAB-01\"); else audit.ghiChung(\"sv1 thử đặt LAB-01\");\n    throw new IllegalStateException(\"hết chỗ\");\n}\n\n/** 3. Bắt lỗi của một phương thức REQUIRED bên trong rồi \"đi tiếp\". */\n@Transactional\npublic void batLoiRoiDiTiep() {\n    luu(\"E73-BAT\");\n    try { kiem.kiemPhong(\"LAB-01\"); }\n    catch (RuntimeException e) { System.out.println(\"  đã bắt: \" + e.getMessage() + \" — đi tiếp, chuẩn bị commit\"); }\n}\n\n/** 4. Lượt chính + lượt phụ NESTED: lượt phụ hỏng thì chỉ lùi về savepoint. */\n@Transactional\npublic void chinhVaPhu() {\n    luu(\"E73-CHINH\");\n    try { kiem.themLuotPhu(T.plusHours(2)); }\n    catch (RuntimeException e) { System.out.println(\"  đã bắt \" + e.getClass().getSimpleName() + \": \" + e.getMessage()); }\n}\n\n/** 6. Giữ một kết nối, rồi xin thêm một giao dịch MỚI (REQUIRES_NEW cần kết nối thứ hai). */\n@Transactional\npublic void giuRoiXinThem(String ai) throws InterruptedException {\n    bookings.count();                         // giao dịch ngoài đã cầm 1 kết nối\n    Thread.sleep(300);\n    audit.ghiRieng(ai + \" ghi nhật ký\");      // cần kết nối thứ 2 từ pool\n}");
const OUT73 = out("=== 1. REQUIRED + nhật ký REQUIRES_NEW, rồi lỗi\n  IllegalStateException: hết chỗ\n  CSDL: bookings E73-* = (không có) · audit_log = sv1 thử đặt LAB-01\n\n=== 2. REQUIRED + nhật ký REQUIRED, rồi lỗi\n  IllegalStateException: hết chỗ\n  CSDL: bookings E73-* = (không có) · audit_log = (không có)\n\n=== 3. bắt lỗi của phương thức REQUIRED bên trong\n  đã bắt: phòng LAB-01 đang bảo trì — đi tiếp, chuẩn bị commit\n  UnexpectedRollbackException: Transaction silently rolled back because it has been marked as rollback-only\n  CSDL: bookings E73-* = (không có) · audit_log = (không có)\n\n=== 4. NESTED: lượt phụ hỏng\n  đã bắt: Transaction manager does not allow nested transactions by default - specify 'nestedTransactionAllowed' property with value 'true' — lượt chính vẫn còn\n  CSDL: bookings E73-* = E73-CHINH · audit_log = (không có)\n\n=== 5. MANDATORY gọi khi không có giao dịch\n  IllegalTransactionStateException: No existing transaction found for transaction marked with propagation 'mandatory'\n  CSDL: bookings E73-* = (không có) · audit_log = (không có)");
const OUT73_PG = out("00:21:05.261 [126] LOG:  statement: BEGIN\n00:21:05.261 [126] LOG:  execute <unnamed>: insert into bookings (end_at,lab_id,start_at,status,student_id) values ($1,$2,$3,$4,$5)\n00:21:05.285 [127] LOG:  statement: BEGIN\n00:21:05.286 [127] LOG:  execute <unnamed>: insert into audit_log (msg) values ($1)\n00:21:05.289 [127] LOG:  execute S_1: COMMIT\n00:21:05.319 [126] LOG:  execute S_1: ROLLBACK\n00:21:05.355 [126] LOG:  statement: BEGIN\n00:21:05.356 [126] LOG:  execute <unnamed>: insert into bookings (end_at,lab_id,start_at,status,student_id) values ($1,$2,$3,$4,$5)\n00:21:05.361 [126] LOG:  execute <unnamed>: insert into audit_log (msg) values ($1)\n00:21:05.363 [126] LOG:  execute S_1: ROLLBACK\n00:21:05.371 [126] LOG:  statement: BEGIN\n00:21:05.372 [126] LOG:  execute <unnamed>: insert into bookings (end_at,lab_id,start_at,status,student_id) values ($1,$2,$3,$4,$5)\n00:21:05.374 [126] LOG:  execute S_1: ROLLBACK\n00:21:05.385 [126] LOG:  statement: BEGIN\n00:21:05.385 [126] LOG:  execute <unnamed>: insert into bookings (end_at,lab_id,start_at,status,student_id) values ($1,$2,$3,$4,$5)\n00:21:05.386 [126] LOG:  execute S_2: COMMIT\n00:21:05.488 [126] LOG:  statement: BEGIN\n00:21:05.488 [127] LOG:  statement: BEGIN\n00:21:07.796 [127] LOG:  execute S_2: ROLLBACK\n00:21:07.797 [126] LOG:  execute S_1: ROLLBACK");
const OUT73_NESTED = out("=== 4. NESTED: lượt phụ hỏng\n  đã bắt NestedTransactionNotSupportedException: JpaDialect does not support savepoints - check your JPA provider's capabilities\n  CSDL: bookings E73-* = E73-CHINH · audit_log = (không có)\n\n=== 7. NESTED với JdbcTransactionManager + JdbcClient\n  đã bắt IllegalStateException: lượt phụ trùng giờ\n  CSDL: bookings E73-* = E73-CHINH · audit_log = (không có)");
const MA73_JDBC = java("/** 7. NESTED với DataSourceTransactionManager (JDBC thuần) — chỗ NESTED thật sự chạy: SAVEPOINT. */\nvoid nestedJdbc() {\n    var tm = new org.springframework.jdbc.support.JdbcTransactionManager(ds);\n    var ngoai = new org.springframework.transaction.support.TransactionTemplate(tm);\n    var trong = new org.springframework.transaction.support.TransactionTemplate(tm);\n    trong.setPropagationBehavior(org.springframework.transaction.TransactionDefinition.PROPAGATION_NESTED);\n    String chen = \"insert into bookings (lab_id, student_id, start_at, end_at, status) values (1, 1, timestamp '2031-01-10 08:00', timestamp '2031-01-10 09:00', ?)\";\n    ngoai.executeWithoutResult(s -> {\n        db.sql(chen).param(\"E73-CHINH\").update();\n        try { trong.executeWithoutResult(t -> { db.sql(chen).param(\"E73-PHU\").update(); throw new IllegalStateException(\"lượt phụ trùng giờ\"); }); }\n        catch (RuntimeException e) { System.out.println(\"  đã bắt \" + e.getClass().getSimpleName() + \": \" + e.getMessage()); }\n    });\n}");
const OUT73_NESTPG = out("… BEGIN\n00:24:30.032 [116] LOG:  execute <unnamed>: insert into bookings (lab_id, student_id, start_at, end_at, status) values (1, 1, timestamp '2031-01-10 08:00', timestamp '2031-01-10 09:00', $1)\n00:24:30.034 [116] LOG:  execute <unnamed>: SAVEPOINT \"SAVEPOINT_1\"\n00:24:30.034 [116] LOG:  execute <unnamed>: insert into bookings (lab_id, student_id, start_at, end_at, status) values (1, 1, timestamp '2031-01-10 08:00', timestamp '2031-01-10 09:00', $1)\n00:24:30.035 [116] LOG:  execute <unnamed>: ROLLBACK TO SAVEPOINT \"SAVEPOINT_1\"\n00:24:30.038 [116] LOG:  execute <unnamed>: RELEASE SAVEPOINT \"SAVEPOINT_1\"\n00:24:30.039 [116] LOG:  execute S_1: COMMIT");
const OUT73_POOL = out("=== 6. pool 2 kết nối, 2 luồng cùng giuRoiXinThem (REQUIRES_NEW bên trong)\n  (log) HikariPool-1 - Connection is not available, request timed out after 2000ms (total=2, active=2, idle=0, waiting=0)\n  luồng-1: CannotCreateTransactionException sau 2343 ms — Could not open JPA EntityManager for transaction\n  luồng-2: CannotCreateTransactionException sau 2344 ms — Could not open JPA EntityManager for transaction\n  CSDL: bookings E73-* = (không có) · audit_log = (không có)");
const OUT73_TH = out("=== 3. bắt lỗi của phương thức REQUIRED bên trong\n  đã bắt: phòng LAB-01 đang bảo trì — đi tiếp, chuẩn bị commit\n  CSDL: bookings E73-* = E73-BAT · audit_log = (không có)");

const L73_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Transaction propagation</h2>
<p class="lead">When a <code>@Transactional</code> method calls another <code>@Transactional</code> method, are they one transaction or two? That is <strong>propagation</strong>. Get it wrong and an audit log disappears with the failure it was meant to record, a caught exception still rolls everything back with <code>UnexpectedRollbackException</code>, or two requests deadlock on a two-connection pool. All of it below, with the statements PostgreSQL actually received.</p>

<h3>In everyday life first</h3>
<p>A bank teller fills a transfer slip (the outer transaction). While doing it, she writes in the security logbook "customer asked to transfer 5 million" — that logbook is not part of the slip; if the transfer is cancelled, the line in the logbook must stay. That is <code>REQUIRES_NEW</code>: a separate notebook. If instead she wrote the note <em>on the slip</em> (<code>REQUIRED</code>), tearing up the slip tears up the note. And if her colleague stamps "INVALID" on the shared slip, she cannot pretend nothing happened and post it anyway — that is <code>UnexpectedRollbackException</code>.</p>

<h3>The propagation types you will meet</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">REQUIRED (default)</span><span class="v">Join the current transaction, or start one if there is none.</span></div>
  <div class="kv"><span class="k">REQUIRES_NEW</span><span class="v">Suspend the current transaction and run in a brand-new one — on a <em>second connection</em>.</span></div>
  <div class="kv"><span class="k">NESTED</span><span class="v">A savepoint inside the current transaction; roll back to it without losing the outer work. Needs JDBC savepoint support from the transaction manager.</span></div>
  <div class="kv"><span class="k">MANDATORY</span><span class="v">There must already be a transaction, otherwise throw.</span></div>
  <div class="kv"><span class="k">SUPPORTS / NOT_SUPPORTED / NEVER</span><span class="v">Run in one if present / suspend it / throw if present. Rare in application code.</span></div>
</div>

<h3>The services under test</h3>
${MA73_AUDIT}
${MA73_KIEM}
${MA73_DAT}

<h3>Cases 1–5</h3>
${OUT73}
<p>And what PostgreSQL saw for cases 1–4 and the start of case 6 (the number in brackets is the server process, i.e. the connection):</p>
${OUT73_PG}
<ul>
  <li><strong>1 — REQUIRES_NEW survives the rollback.</strong> Connection <code>[126]</code> began the booking; the audit call suspended it and ran on connection <code>[127]</code>: <code>BEGIN</code>, insert, <code>COMMIT</code>. Then the booking failed and <code>[126]</code> rolled back. The table keeps the audit line, not the booking — exactly what an audit trail needs.</li>
  <li><strong>2 — REQUIRED dies with the caller.</strong> Same code with the default propagation: both inserts on <code>[126]</code>, one <code>ROLLBACK</code>, nothing left.</li>
  <li><strong>3 — UnexpectedRollbackException.</strong> The inner <code>kiemPhong</code> (REQUIRED) threw; the outer method caught the exception and carried on. But the inner proxy had already marked the <em>shared</em> transaction rollback-only, so at the outer commit Spring rolled back and threw <code>Transaction silently rolled back because it has been marked as rollback-only</code>. Catching an exception does not un-mark the transaction.</li>
  <li><strong>4 — NESTED with JPA does not work out of the box.</strong> <code>JpaTransactionManager</code> refused: <em>nested transactions are not allowed by default</em>. The outer booking was still committed because we caught that exception.</li>
  <li><strong>5 — MANDATORY</strong> without a transaction: <code>IllegalTransactionStateException</code>. Useful for repository-like helpers that must never run on their own.</li>
</ul>

<h3>NESTED: what really happens</h3>
<p>Enable it (<code>setNestedTransactionAllowed(true)</code>) and the JPA manager still refuses, this time because Hibernate's dialect does not expose JDBC savepoints to Spring. With a plain JDBC transaction manager it works:</p>
${OUT73_NESTED}
${MA73_JDBC}
${OUT73_NESTPG}
<p>On one connection: <code>SAVEPOINT "SAVEPOINT_1"</code> before the inner block, <code>ROLLBACK TO SAVEPOINT</code> when it failed, then <code>COMMIT</code> of the outer work. In JPA code, get the same effect by making the risky part a separate check that does not throw inside the transaction, or by using <code>REQUIRES_NEW</code> when the inner work must be independent.</p>

<h3>6. REQUIRES_NEW needs a second connection</h3>
${OUT73_POOL}
<p>Pool of 2 connections, two requests at once. Each outer transaction took one connection, then asked the pool for another for <code>REQUIRES_NEW</code> — while holding the first. Nobody can proceed; after the 2-second <code>connection-timeout</code> both failed (<code>CannotCreateTransactionException</code> after ~2.34 s) and both rolled back. With a 10-connection pool the same deadlock needs 10 concurrent requests — a normal afternoon. Rule: a method that uses <code>REQUIRES_NEW</code> needs up to two connections per request; size the pool for it, keep the inner transaction tiny, or move the audit write after the commit (an event, Chapter 14).</p>

<h3>🕵️ Hacker corner — the evidence that rolls back</h3>
<p>Write a "failed login" counter or a "suspicious transfer" record in the <em>same</em> transaction as the operation that then fails (case 2), and every failed attempt erases its own trace: the attacker can try forever and the logs stay clean. OWASP calls this class <strong>A09:2021 Security Logging and Monitoring Failures</strong>. <strong>Real incident — Equifax, 2017:</strong> attackers stayed in the network for about 76 days (13 May – 29 July 2017) and took data on roughly 147 million people; one reason they went unseen was that a device meant to inspect the encrypted traffic had an expired certificate and was not inspecting anything. Monitoring that silently does nothing is the same failure as an audit row that silently rolls back. Defence: security events in <code>REQUIRES_NEW</code> (case 1) or written after rollback by an event listener, alerts on them, and a test that asserts the row exists after a failure.</p>

<h3>Compared with Node.js (Prisma)</h3>
<p>Prisma has no propagation settings. Inside <code>prisma.$transaction(async (tx) =&gt; …)</code> you pass <code>tx</code> to everything that must join; anything that uses the global <code>prisma</code> client instead runs in its own connection and commits independently — that is REQUIRES_NEW by accident, and the same two-connection deadlock exists. There is no NESTED/savepoint API in the interactive transaction (you would send <code>SAVEPOINT</code> as raw SQL). Spring makes the choice declarative; Prisma makes it explicit in every call.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Audit and security logs: <code>REQUIRES_NEW</code> in a small separate bean (the proxy rule from 6.5 applies — calling it via <code>this</code> silently gives REQUIRED).</li>
  <li><code>UnexpectedRollbackException</code> in production logs means somebody caught an exception from a transactional call and kept going. Fix the design: validate before, or make the inner call non-transactional, or use <code>noRollbackFor</code> deliberately.</li>
  <li>Pool sizing: count the worst case of connections one request can hold at once (Chapter 16).</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"REQUIRED vs REQUIRES_NEW?"</strong> — REQUIRED joins the caller's transaction; REQUIRES_NEW suspends it and commits independently on a second connection (log: two process ids).</li>
  <li><strong>"What is UnexpectedRollbackException?"</strong> — An inner REQUIRED method threw, the shared transaction was marked rollback-only, the outer code caught and tried to commit; Spring rolls back and tells you.</li>
  <li><strong>"REQUIRES_NEW vs NESTED?"</strong> — NESTED is a savepoint in the same transaction and connection: the outer rollback also undoes it. With JPA's transaction manager NESTED is not supported by default; with JDBC it is.</li>
  <li><strong>"Any risk with REQUIRES_NEW?"</strong> — Two connections per request: on a small pool, concurrent requests deadlock until the pool timeout (both failed after ~2.3 s here).</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Take case 3: a maintenance check fails, the caller catches it and wants to keep the booking — today it gets <code>UnexpectedRollbackException</code>.</li>
  <li>Change only <code>KiemService.kiemPhong</code> so that the booking is committed and no exception reaches the caller except the one it catches.</li>
</ol>
<p><strong>Done when:</strong> case 3 prints <code>đã bắt: phòng LAB-01 đang bảo trì</code>, no <code>UnexpectedRollbackException</code>, and the database shows <code>bookings E73-* = E73-BAT</code>.</p></div>
${giai('Show one solution', `${java(`/** Một phép kiểm không cần giao dịch riêng; lỗi của nó không được đánh dấu giao dịch chung. */
@Transactional(noRollbackFor = IllegalStateException.class)
public void kiemPhong(String code) { throw new IllegalStateException("phòng " + code + " đang bảo trì"); }`)}
${OUT73_TH}
<p>Removing <code>@Transactional</code> from the check works too (a method that reads nothing needs no transaction). Changing it to <code>REQUIRES_NEW</code> also works but costs a second connection — case 6.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Propagation</span><span class="v">How a transactional method relates to a transaction already in progress.</span></div>
  <div class="kv"><span class="k">Rollback-only</span><span class="v">Mark on a transaction meaning it can only end in rollback.</span></div>
  <div class="kv"><span class="k">UnexpectedRollbackException</span><span class="v">Thrown when code tries to commit a transaction marked rollback-only.</span></div>
  <div class="kv"><span class="k">Savepoint</span><span class="v">A named point inside a transaction to roll back to (<code>SAVEPOINT</code>/<code>ROLLBACK TO SAVEPOINT</code>).</span></div>
  <div class="kv"><span class="k">Transaction suspension</span><span class="v">REQUIRES_NEW parks the current transaction (and its connection) until the new one ends.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>REQUIRES_NEW: the audit row committed on connection 127 while the booking on 126 rolled back.</li>
  <li>REQUIRED: one transaction, one rollback, nothing left.</li>
  <li>Catching an inner REQUIRED exception ⇒ UnexpectedRollbackException at commit.</li>
  <li>NESTED + JpaTransactionManager: not allowed by default, then "JpaDialect does not support savepoints"; with a JDBC manager: SAVEPOINT / ROLLBACK TO SAVEPOINT.</li>
  <li>REQUIRES_NEW on a 2-connection pool, 2 concurrent requests ⇒ both failed after ~2.3 s.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html', '📘', 'Spring Framework — Transaction propagation', 'REQUIRED, REQUIRES_NEW, NESTED and rollback-only.')}
${tl('https://www.postgresql.org/docs/16/sql-savepoint.html', '🐘', 'PostgreSQL 16 — SAVEPOINT', 'What NESTED becomes on the wire.')}
${tl('https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/', '🛡️', 'OWASP A09:2021 — Security Logging and Monitoring Failures', 'Why failed attempts must be recorded.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: C7App profile <code>e73</code> on Spring Boot 4.1.2, Spring Framework 7.0.10, Hibernate ORM 7.4.13.Final, HikariCP 7.0.2 (pool 2, connection-timeout 2000 ms), PostgreSQL 16.15 with <code>log_statement=all</code> (20/11/2026).</li>
  <li>U.S. Government Accountability Office, GAO-18-559, "Data Protection: Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach" (August 2018).</li>
</ul>
</div>
`;

const L73_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Lan truyền giao dịch (propagation)</h2>
<p class="lead">Khi một phương thức <code>@Transactional</code> gọi một phương thức <code>@Transactional</code> khác, đó là một giao dịch hay hai? Đó là <strong>propagation</strong>. Chọn sai thì nhật ký kiểm toán biến mất cùng đúng thất bại nó cần ghi lại, một exception đã bắt vẫn làm rollback tất cả kèm <code>UnexpectedRollbackException</code>, hoặc hai request khoá chết nhau trên pool hai kết nối. Tất cả ở dưới, kèm đúng những câu PostgreSQL nhận được.</p>

<h3>Đời thường trước đã</h3>
<p>Giao dịch viên ngân hàng điền một phiếu chuyển khoản (giao dịch ngoài). Trong lúc đó chị ghi vào sổ an ninh "khách yêu cầu chuyển 5 triệu" — cuốn sổ đó không thuộc tờ phiếu; nếu lệnh chuyển bị huỷ, dòng trong sổ vẫn phải còn. Đó là <code>REQUIRES_NEW</code>: một cuốn sổ riêng. Nếu chị ghi chú <em>ngay trên tờ phiếu</em> (<code>REQUIRED</code>), xé phiếu là xé luôn ghi chú. Và nếu đồng nghiệp đã đóng dấu "KHÔNG HỢP LỆ" lên tờ phiếu chung, chị không thể coi như không có gì rồi vẫn vào sổ — đó là <code>UnexpectedRollbackException</code>.</p>

<h3>Các kiểu propagation bạn sẽ gặp</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">REQUIRED (mặc định)</span><span class="v">Nhập vào giao dịch đang có, chưa có thì mở mới.</span></div>
  <div class="kv"><span class="k">REQUIRES_NEW</span><span class="v">Tạm treo giao dịch hiện tại và chạy trong một giao dịch hoàn toàn mới — trên <em>kết nối thứ hai</em>.</span></div>
  <div class="kv"><span class="k">NESTED</span><span class="v">Một savepoint bên trong giao dịch hiện tại; lùi về đó mà không mất phần việc bên ngoài. Cần trình quản lý giao dịch hỗ trợ savepoint JDBC.</span></div>
  <div class="kv"><span class="k">MANDATORY</span><span class="v">Bắt buộc đã có giao dịch, không có thì ném lỗi.</span></div>
  <div class="kv"><span class="k">SUPPORTS / NOT_SUPPORTED / NEVER</span><span class="v">Có thì chạy trong đó / tạm treo nó / có thì ném lỗi. Hiếm gặp trong mã ứng dụng.</span></div>
</div>

<h3>Các service được thử</h3>
${MA73_AUDIT}
${MA73_KIEM}
${MA73_DAT}

<h3>Trường hợp 1–5</h3>
${OUT73}
<p>Và những gì PostgreSQL thấy ở trường hợp 1–4 cùng phần đầu trường hợp 6 (số trong ngoặc vuông là tiến trình server, tức là kết nối):</p>
${OUT73_PG}
<ul>
  <li><strong>1 — REQUIRES_NEW sống sót qua rollback.</strong> Kết nối <code>[126]</code> bắt đầu lượt đặt; lời gọi ghi nhật ký tạm treo nó và chạy trên kết nối <code>[127]</code>: <code>BEGIN</code>, insert, <code>COMMIT</code>. Sau đó lượt đặt hỏng và <code>[126]</code> rollback. Bảng giữ dòng nhật ký, không giữ lượt đặt — đúng thứ một dấu vết kiểm toán cần.</li>
  <li><strong>2 — REQUIRED chết cùng nơi gọi.</strong> Cùng mã với propagation mặc định: cả hai insert trên <code>[126]</code>, một <code>ROLLBACK</code>, không còn gì.</li>
  <li><strong>3 — UnexpectedRollbackException.</strong> <code>kiemPhong</code> bên trong (REQUIRED) ném lỗi; phương thức ngoài bắt lỗi rồi đi tiếp. Nhưng proxy bên trong đã đánh dấu giao dịch <em>chung</em> là rollback-only, nên lúc commit ngoài Spring rollback và ném <code>Transaction silently rolled back because it has been marked as rollback-only</code>. Bắt exception không gỡ được dấu đó.</li>
  <li><strong>4 — NESTED với JPA không chạy sẵn.</strong> <code>JpaTransactionManager</code> từ chối: <em>mặc định không cho phép giao dịch lồng nhau</em>. Lượt đặt ngoài vẫn được commit vì ta đã bắt exception đó.</li>
  <li><strong>5 — MANDATORY</strong> khi không có giao dịch: <code>IllegalTransactionStateException</code>. Hữu ích cho các hàm phụ kiểu repository không bao giờ được chạy một mình.</li>
</ul>

<h3>NESTED: chuyện gì thật sự xảy ra</h3>
<p>Bật nó lên (<code>setNestedTransactionAllowed(true)</code>) thì trình quản lý JPA vẫn từ chối, lần này vì dialect của Hibernate không đưa savepoint JDBC cho Spring dùng. Với trình quản lý giao dịch JDBC thuần thì chạy được:</p>
${OUT73_NESTED}
${MA73_JDBC}
${OUT73_NESTPG}
<p>Trên một kết nối: <code>SAVEPOINT "SAVEPOINT_1"</code> trước khối bên trong, <code>ROLLBACK TO SAVEPOINT</code> khi nó hỏng, rồi <code>COMMIT</code> phần việc bên ngoài. Trong mã JPA, muốn có hiệu ứng tương tự thì tách phần rủi ro thành một phép kiểm không ném lỗi bên trong giao dịch, hoặc dùng <code>REQUIRES_NEW</code> khi phần việc bên trong phải độc lập.</p>

<h3>6. REQUIRES_NEW cần kết nối thứ hai</h3>
${OUT73_POOL}
<p>Pool 2 kết nối, hai request cùng lúc. Mỗi giao dịch ngoài lấy một kết nối, rồi xin pool thêm một cái cho <code>REQUIRES_NEW</code> — trong khi vẫn giữ cái đầu. Không ai đi tiếp được; sau <code>connection-timeout</code> 2 giây cả hai hỏng (<code>CannotCreateTransactionException</code> sau ~2,34 s) và cả hai rollback. Với pool 10 kết nối, cùng kiểu khoá chết đó chỉ cần 10 request đồng thời — một buổi chiều bình thường. Quy tắc: phương thức dùng <code>REQUIRES_NEW</code> cần tới hai kết nối mỗi request; định cỡ pool cho nó, giữ giao dịch bên trong thật nhỏ, hoặc chuyển việc ghi nhật ký ra sau commit (một sự kiện, Chương 14).</p>

<h3>🕵️ Góc hacker — bằng chứng bị rollback</h3>
<p>Ghi bộ đếm "đăng nhập thất bại" hay bản ghi "chuyển tiền đáng ngờ" trong <em>cùng</em> giao dịch với thao tác rồi thất bại (trường hợp 2), và mỗi lần thử hỏng tự xoá dấu vết của chính nó: kẻ tấn công thử mãi mà log vẫn sạch. OWASP xếp loại này là <strong>A09:2021 Security Logging and Monitoring Failures</strong>. <strong>Sự cố thật — Equifax, 2017:</strong> kẻ tấn công ở trong mạng khoảng 76 ngày (13/5 – 29/7/2017) và lấy dữ liệu của khoảng 147 triệu người; một lý do chúng không bị phát hiện là thiết bị dùng để soi lưu lượng mã hoá có chứng chỉ đã hết hạn nên không soi gì cả. Giám sát lặng lẽ không làm gì cũng là thất bại giống hệt dòng kiểm toán lặng lẽ bị rollback. Cách phòng: sự kiện bảo mật ghi bằng <code>REQUIRES_NEW</code> (trường hợp 1) hoặc ghi sau rollback bằng event listener, cảnh báo dựa trên chúng, và một test khẳng định dòng đó tồn tại sau một lần thất bại.</p>

<h3>So với Node.js (Prisma)</h3>
<p>Prisma không có thiết lập propagation. Bên trong <code>prisma.$transaction(async (tx) =&gt; …)</code> bạn truyền <code>tx</code> cho mọi thứ phải nhập vào; thứ gì dùng client <code>prisma</code> toàn cục thay vì <code>tx</code> sẽ chạy trên kết nối riêng và commit độc lập — đó là REQUIRES_NEW do vô tình, và kiểu khoá chết hai kết nối ở trên vẫn xảy ra. Giao dịch tương tác cũng không có API NESTED/savepoint (phải gửi <code>SAVEPOINT</code> bằng SQL thô). Spring biến lựa chọn thành khai báo; Prisma bắt bạn viết rõ trong từng lời gọi.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Nhật ký kiểm toán và bảo mật: <code>REQUIRES_NEW</code> trong một bean nhỏ riêng (luật proxy của 6.5 vẫn áp dụng — gọi qua <code>this</code> là lặng lẽ thành REQUIRED).</li>
  <li><code>UnexpectedRollbackException</code> trong log production nghĩa là ai đó đã bắt exception từ một lời gọi có giao dịch rồi đi tiếp. Sửa thiết kế: kiểm trước, hoặc bỏ giao dịch ở lời gọi bên trong, hoặc dùng <code>noRollbackFor</code> có chủ đích.</li>
  <li>Định cỡ pool: đếm trường hợp xấu nhất số kết nối một request giữ cùng lúc (Chương 16).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"REQUIRED khác REQUIRES_NEW thế nào?"</strong> — REQUIRED nhập vào giao dịch của nơi gọi; REQUIRES_NEW tạm treo nó và commit độc lập trên kết nối thứ hai (log: hai mã tiến trình).</li>
  <li><strong>"UnexpectedRollbackException là gì?"</strong> — Một phương thức REQUIRED bên trong ném lỗi, giao dịch chung bị đánh dấu rollback-only, mã ngoài bắt lỗi rồi cố commit; Spring rollback và báo cho bạn.</li>
  <li><strong>"REQUIRES_NEW khác NESTED thế nào?"</strong> — NESTED là savepoint trong cùng giao dịch, cùng kết nối: rollback ngoài cũng xoá nó. Với trình quản lý giao dịch JPA, NESTED mặc định không được hỗ trợ; với JDBC thì được.</li>
  <li><strong>"REQUIRES_NEW có rủi ro gì?"</strong> — Hai kết nối mỗi request: pool nhỏ thì request đồng thời khoá chết nhau tới khi pool hết giờ (ở đây cả hai hỏng sau ~2,3 s).</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Lấy trường hợp 3: phép kiểm bảo trì thất bại, nơi gọi bắt lỗi và muốn giữ lượt đặt — hiện nó nhận <code>UnexpectedRollbackException</code>.</li>
  <li>Chỉ sửa <code>KiemService.kiemPhong</code> sao cho lượt đặt được commit và không exception nào tới nơi gọi ngoài cái nó tự bắt.</li>
</ol>
<p><strong>Đạt khi:</strong> trường hợp 3 in <code>đã bắt: phòng LAB-01 đang bảo trì</code>, không có <code>UnexpectedRollbackException</code>, và CSDL cho thấy <code>bookings E73-* = E73-BAT</code>.</p></div>
${giai('Xem một lời giải', `${java(`/** Một phép kiểm không cần giao dịch riêng; lỗi của nó không được đánh dấu giao dịch chung. */
@Transactional(noRollbackFor = IllegalStateException.class)
public void kiemPhong(String code) { throw new IllegalStateException("phòng " + code + " đang bảo trì"); }`)}
${OUT73_TH}
<p>Bỏ hẳn <code>@Transactional</code> khỏi phép kiểm cũng được (một phương thức không đọc gì thì không cần giao dịch). Đổi sang <code>REQUIRES_NEW</code> cũng chạy nhưng tốn thêm một kết nối — trường hợp 6.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Propagation</span><span class="v">Cách một phương thức có giao dịch liên hệ với giao dịch đang diễn ra.</span></div>
  <div class="kv"><span class="k">Rollback-only</span><span class="v">Dấu trên một giao dịch cho biết nó chỉ có thể kết thúc bằng rollback.</span></div>
  <div class="kv"><span class="k">UnexpectedRollbackException</span><span class="v">Ném ra khi mã cố commit một giao dịch đã bị đánh dấu rollback-only.</span></div>
  <div class="kv"><span class="k">Savepoint</span><span class="v">Một mốc có tên trong giao dịch để lùi về (<code>SAVEPOINT</code>/<code>ROLLBACK TO SAVEPOINT</code>).</span></div>
  <div class="kv"><span class="k">Tạm treo giao dịch</span><span class="v">REQUIRES_NEW cất giao dịch hiện tại (cùng kết nối của nó) cho tới khi giao dịch mới kết thúc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>REQUIRES_NEW: dòng nhật ký commit trên kết nối 127 trong khi lượt đặt trên 126 rollback.</li>
  <li>REQUIRED: một giao dịch, một rollback, không còn gì.</li>
  <li>Bắt exception của phương thức REQUIRED bên trong ⇒ UnexpectedRollbackException lúc commit.</li>
  <li>NESTED + JpaTransactionManager: mặc định không cho phép, rồi "JpaDialect does not support savepoints"; với trình quản lý JDBC: SAVEPOINT / ROLLBACK TO SAVEPOINT.</li>
  <li>REQUIRES_NEW trên pool 2 kết nối, 2 request đồng thời ⇒ cả hai hỏng sau ~2,3 s.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html', '📘', 'Spring Framework — Transaction propagation', 'REQUIRED, REQUIRES_NEW, NESTED và rollback-only.')}
${tl('https://www.postgresql.org/docs/16/sql-savepoint.html', '🐘', 'PostgreSQL 16 — SAVEPOINT', 'NESTED thành gì khi xuống tới CSDL.')}
${tl('https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/', '🛡️', 'OWASP A09:2021 — Security Logging and Monitoring Failures', 'Vì sao lần thử thất bại phải được ghi lại.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: C7App profile <code>e73</code> chạy Spring Boot 4.1.2, Spring Framework 7.0.10, Hibernate ORM 7.4.13.Final, HikariCP 7.0.2 (pool 2, connection-timeout 2000 ms), PostgreSQL 16.15 với <code>log_statement=all</code> (20/11/2026).</li>
  <li>U.S. Government Accountability Office, GAO-18-559, "Data Protection: Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach" (08/2018).</li>
</ul>
</div>
`;

// ===== Bài 7.4 =====
const MA74_HAI = java("static Connection mo(javax.sql.DataSource ds, int muc) throws SQLException {\n    Connection c = ds.getConnection();\n    c.setAutoCommit(false);\n    c.setTransactionIsolation(muc);\n    return c;\n}");
const MA74_WS = java("for (int muc : new int[] { TRANSACTION_REPEATABLE_READ, TRANSACTION_SERIALIZABLE }) {\n    buoc(\"5. Write skew: hai người cùng đặt LAB-02 lúc 2031-01-10 08:00 — cả hai ở \" + TEN[muc]);\n    String kiem = \"select count(*) from bookings where lab_id = 2 and status <> 'CANCELLED' and start_at < '2031-01-10 10:00' and end_at > '2031-01-10 08:00'\";\n    try (Connection a = mo(ds, muc); Connection b = mo(ds, muc)) {\n        in(\"A\", \"kiểm trùng = \" + so(a, kiem)); in(\"B\", \"kiểm trùng = \" + so(b, kiem));\n        chay(a, \"insert into bookings (lab_id, student_id, start_at, end_at, status) values (2, 1, '2031-01-10 08:00', '2031-01-10 10:00', 'E74-WS')\"); in(\"A\", \"insert\");\n        try { chay(b, \"insert into bookings (lab_id, student_id, start_at, end_at, status) values (2, 2, '2031-01-10 08:00', '2031-01-10 10:00', 'E74-WS')\"); in(\"B\", \"insert\"); }\n        catch (SQLException e) { in(\"B\", \"insert ⇒ \" + loi(e)); }\n        try { a.commit(); in(\"A\", \"COMMIT\"); } catch (SQLException e) { in(\"A\", \"COMMIT ⇒ \" + loi(e)); }\n        try { b.commit(); in(\"B\", \"COMMIT\"); } catch (SQLException e) { in(\"B\", \"COMMIT ⇒ \" + loi(e)); b.rollback(); }\n    }\n    System.out.println(\"  CSDL: số lượt trùng khung giờ đó = \" + db.sql(\"select count(*) from bookings where status = 'E74-WS'\").query(Integer.class).single());\n    db.sql(\"delete from bookings where status = 'E74-WS'\").update();\n}");
const OUT74 = out("=== 0. Mặc định của PostgreSQL: read committed\n\n=== 1. Dirty read? B đặt READ UNCOMMITTED\n  A │ update points = 0 (CHƯA commit)\n  B │ đọc points = 500   (B đang ở mức: read uncommitted)\n  A │ rollback\n\n=== 2. Non-repeatable read — B ở READ COMMITTED\n  B │ lần 1 đọc points = 500\n  A │ update points = 400, COMMIT\n  B │ lần 2 đọc points = 400\n\n=== 2. Non-repeatable read — B ở REPEATABLE READ\n  B │ lần 1 đọc points = 500\n  A │ update points = 400, COMMIT\n  B │ lần 2 đọc points = 500\n\n=== 3. Phantom read — B ở READ COMMITTED\n  B │ lần 1 đếm lượt LAB-01 ngày 01/03 = 9\n  A │ insert một lượt 06:00, COMMIT\n  B │ lần 2 đếm = 10\n\n=== 3. Phantom read — B ở REPEATABLE READ\n  B │ lần 1 đếm lượt LAB-01 ngày 01/03 = 9\n  A │ insert một lượt 06:00, COMMIT\n  B │ lần 2 đếm = 9\n\n=== 4. Lost update (đọc rồi ghi giá trị tính trong Java) — B ở READ COMMITTED\n  B │ đọc points = 500, định ghi 400\n  A │ points = points - 100, COMMIT\n  B │ update points = 400, COMMIT\n  CSDL sau cùng: points = 400 (đúng phải là 300 nếu cả hai trừ)\n\n=== 4. Lost update (đọc rồi ghi giá trị tính trong Java) — B ở REPEATABLE READ\n  B │ đọc points = 500, định ghi 400\n  A │ points = points - 100, COMMIT\n  B │ LỖI SQLState 40001: ERROR: could not serialize access due to concurrent update\n  CSDL sau cùng: points = 400 (đúng phải là 300 nếu cả hai trừ)\n\n=== 5. Write skew: hai người cùng đặt LAB-02 lúc 2031-01-10 08:00 — cả hai ở REPEATABLE READ\n  A │ kiểm trùng = 0\n  B │ kiểm trùng = 0\n  A │ insert\n  B │ insert\n  A │ COMMIT\n  B │ COMMIT\n  CSDL: số lượt trùng khung giờ đó = 2\n\n=== 5. Write skew: hai người cùng đặt LAB-02 lúc 2031-01-10 08:00 — cả hai ở SERIALIZABLE\n  A │ kiểm trùng = 0\n  B │ kiểm trùng = 0\n  A │ insert\n  B │ insert\n  A │ COMMIT\n  B │ COMMIT ⇒ LỖI SQLState 40001: ERROR: could not serialize access due to read/write dependencies among transactions\n  CSDL: số lượt trùng khung giờ đó = 1");
const MA74_SVC = java("/** Y hệt truDiem của bài 6.5 (đọc, kiểm, chờ 50 ms, ghi) — chỉ khác mức cô lập. */\n@Transactional(isolation = Isolation.SERIALIZABLE)\npublic boolean tru() {\n    Wallet w = wallets.findById(1L).orElseThrow();\n    if (w.getPoints() < 100) return false;\n    try { Thread.sleep(50); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }\n    w.setPoints(w.getPoints() - 100);\n    LocalDateTime t = LocalDateTime.of(2031, 2, 1, 8, 0);\n    bookings.save(new Booking(labs.getReferenceById(3L), students.getReferenceById(3L), t, t.plusHours(1), \"E74-VI\"));\n    return true;\n}");
const MA74_RETRY = java("/** Thử lại phải nằm NGOÀI giao dịch: giao dịch đã hỏng thì chỉ còn cách mở giao dịch mới. */\nString truCoThuLai() {\n    for (int lan = 1; ; lan++) {\n        try { return vi.tru() ? \"đặt được\" : \"không đủ điểm\"; }\n        catch (org.springframework.dao.ConcurrencyFailureException e) {\n            if (lan == 10) return \"bỏ cuộc: \" + e.getClass().getSimpleName();\n            dem.incrementAndGet();\n            try { Thread.sleep(10L * lan); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }\n        }\n    }\n}");
const OUT74_DUA = out("=== 6. Cuộc đua ví điểm (bài 6.5) với @Transactional(isolation = SERIALIZABLE), 10 luồng — KHÔNG thử lại\n  vòng 1: {CannotAcquireLockException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · lần thử lại = 0 · 187 ms\n  vòng 2: {CannotAcquireLockException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · lần thử lại = 0 · 102 ms\n  vòng 3: {CannotAcquireLockException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · lần thử lại = 0 · 100 ms\n\n=== 7. Như 6, có vòng thử lại bên NGOÀI giao dịch (tối đa 10 lần, khi ConcurrencyFailureException)\n  vòng 1: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · lần thử lại = 35 · 646 ms\n  vòng 2: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · lần thử lại = 35 · 470 ms\n  vòng 3: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · lần thử lại = 35 · 466 ms");
const MA74_PRISMA = js("await dua(\"P4. $transaction({ isolationLevel: Serializable }) như P1\", () =>\n  prisma.$transaction(async (tx) => {\n    const w = await tx.wallet.findUniqueOrThrow({ where: { id: 1n } });\n    if (w.points < 100) return \"không đủ điểm\";\n    await ngu(50);\n    await tx.wallet.update({ where: { id: 1n }, data: { points: w.points - 100 } });\n    return \"đặt được\";\n  }, { isolationLevel: \"Serializable\" }));");
const OUT74_PRISMA = out("=== P4. $transaction({ isolationLevel: Serializable }) như P1\n  {\"P2034\":9,\"đặt được\":1} · ví = 400");
const OUT74_TH = out("=== 6. Cuộc đua ví điểm (bài 6.5) với @Transactional(isolation = REPEATABLE_READ), 10 luồng — KHÔNG thử lại\n  vòng 1: {CannotAcquireLockException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · lần thử lại = 0 · 195 ms\n  vòng 2: {CannotAcquireLockException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · lần thử lại = 0 · 73 ms\n  vòng 3: {CannotAcquireLockException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · lần thử lại = 0 · 76 ms\n\n=== 7. Như 6, có vòng thử lại bên NGOÀI giao dịch (tối đa 10 lần, khi ConcurrencyFailureException)\n  vòng 1: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · lần thử lại = 35 · 488 ms\n  vòng 2: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · lần thử lại = 35 · 478 ms\n  vòng 3: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · lần thử lại = 35 · 484 ms");

const L74_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Isolation levels in PostgreSQL</h2>
<p class="lead">Lesson 6.5 ended with ten transactions that each did the right thing and together lost nine updates. The "I" of ACID — isolation — decides what one transaction may see of another. This lesson reproduces every textbook anomaly on a real PostgreSQL 16 with two JDBC sessions stepped one statement at a time, then replays the wallet race at <code>SERIALIZABLE</code>: without retries it books once, with retries it books exactly five times.</p>

<h3>In everyday life first</h3>
<p>Two teachers fill the same paper attendance sheet. <strong>READ COMMITTED</strong>: every time you look at the sheet you see what others have finished writing so far — the number of absences may change between two glances. <strong>REPEATABLE READ</strong>: you take a photo of the sheet when you start and read only your photo — stable, but you may decide something based on an outdated photo. <strong>SERIALIZABLE</strong>: the school office checks afterwards that the result is the same as if the teachers had taken turns; if not, one of them must redo the work.</p>

<h3>Two sessions, one thread, a fixed order</h3>
${MA74_HAI}
<p>Session A and session B are two connections; the demo executes their statements alternately on one thread, so the interleaving is exactly the one printed — no luck involved.</p>
${OUT74}

<h3>What each case shows</h3>
<ul>
  <li><strong>0.</strong> PostgreSQL's default is <code>read committed</code> — and Spring does not change it unless you ask.</li>
  <li><strong>1 — no dirty reads, ever.</strong> B asked for <code>READ UNCOMMITTED</code> (PostgreSQL accepted the name: <code>show transaction_isolation</code> says <code>read uncommitted</code>) and still read 500 while A's uncommitted 0 was pending. PostgreSQL treats READ UNCOMMITTED as READ COMMITTED.</li>
  <li><strong>2 — non-repeatable read.</strong> At READ COMMITTED, B read 500, A committed 400, B's second read said 400: every statement takes a fresh snapshot. At REPEATABLE READ the second read still said 500: one snapshot for the whole transaction.</li>
  <li><strong>3 — phantom read.</strong> Counting LAB-01's bookings on 1 March: 9, then 10 at READ COMMITTED after A inserted one; still 9 at REPEATABLE READ. PostgreSQL's REPEATABLE READ is stricter than the SQL standard requires — it prevents phantoms too.</li>
  <li><strong>4 — lost update.</strong> B read 500 and planned to write 400 computed in Java; A subtracted 100 and committed. At READ COMMITTED B's <code>UPDATE … = 400</code> succeeded: the final 400 should have been 300 — one subtraction vanished silently. At REPEATABLE READ PostgreSQL refused: <code>SQLState 40001: could not serialize access due to concurrent update</code>.</li>
  <li><strong>5 — write skew.</strong> The double-booking shape: both sessions check "no overlapping booking" (0), both insert into different rows. No row is updated twice, so REPEATABLE READ sees no conflict and <strong>2</strong> bookings for the same slot were committed. At SERIALIZABLE PostgreSQL's SSI noticed the read/write dependency and failed B's commit: <code>could not serialize access due to read/write dependencies among transactions</code> — 1 booking.</li>
</ul>
<div class="kv-grid">
  <div class="kv"><span class="k">READ COMMITTED</span><span class="v">Snapshot per statement. Allows non-repeatable reads, phantoms, lost updates, write skew.</span></div>
  <div class="kv"><span class="k">REPEATABLE READ</span><span class="v">Snapshot per transaction. Blocks phantoms (in PostgreSQL) and lost updates on the same row (error 40001). Allows write skew.</span></div>
  <div class="kv"><span class="k">SERIALIZABLE</span><span class="v">SSI: as if transactions ran one by one; any dangerous pattern ⇒ error 40001, you must retry.</span></div>
</div>

<h3>The wallet race at SERIALIZABLE — and why you need a retry</h3>
${MA74_SVC}
${MA74_RETRY}
${OUT74_DUA}
<ul>
  <li><strong>6 — no retry.</strong> One withdrawal succeeded; the other nine failed with <code>CannotAcquireLockException</code> (Spring's translation of SQLState 40001). Correct — the wallet is 400 and there is one booking — but nine users received an error although the wallet still had 400 points.</li>
  <li><strong>7 — retry outside the transaction.</strong> A failed serializable transaction is dead; the only remedy is to run the whole unit again from the start, so the loop lives in the caller and catches <code>ConcurrencyFailureException</code> (the parent of the 40001 translations). Result, three rounds: exactly 5 bookings, wallet 0, 35 retries, 0.47–0.65 s.</li>
  <li>Two hidden costs seen in PostgreSQL's log: the driver sent <code>SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE</code> 167 times and reset it to <code>READ COMMITTED</code> 183 times — two extra round trips per transaction because the pool restores the default when a connection is returned. And every retry repeats all the work.</li>
</ul>
<p>So isolation is a tool for <em>detecting</em> conflicts; lesson 7.5 shows the tools for <em>avoiding</em> them (conditional updates and locks), which are usually cheaper for a single hot row.</p>

<h3>🕵️ Hacker corner — weak isolation is an attack surface</h3>
<p>Attackers do not need your source code to find write skew or lost updates: they send the same request many times in parallel and see whether a balance, a voucher or a stock count goes wrong. In 2017 Todd Warszawski and Peter Bailis (Stanford) published <strong>ACIDRain</strong> (SIGMOD 2017): by analysing the SQL logs of 12 popular open-source e-commerce applications they found 22 vulnerabilities of exactly this kind — spending a gift card more than its value, applying one voucher to many orders, buying items beyond stock — most of them because the applications ran at the database's default isolation level. Defence: identify every "check then write" invariant, protect it with a constraint, a conditional update, a lock (7.5) or SERIALIZABLE + retry, and test it with parallel requests (Lab 7).</p>

<h3>Compared with Node.js (Prisma)</h3>
<p>Prisma passes the isolation level per interactive transaction. The same race:</p>
${MA74_PRISMA}
${OUT74_PRISMA}
<p>Same outcome as case 6: one success, nine failures — Prisma surfaces SQLState 40001 as error code <code>P2034</code> ("write conflict or a deadlock, please retry"). Prisma has no retry helper either; you write the loop yourself, outside the transaction, exactly like case 7.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Most Spring applications run at READ COMMITTED all their life. Know which invariants that leaves unprotected, and protect each one explicitly.</li>
  <li>If you choose SERIALIZABLE, also choose a retry policy (attempts, backoff), keep transactions short, and make the retried unit idempotent — no emails sent from inside it.</li>
  <li>A sudden flood of "could not serialize access" in logs after a release usually means a new query reads a lot (a sequential scan makes SSI track the whole table); an index on the filtered column narrows it.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Name the isolation levels and the anomalies."</strong> — READ UNCOMMITTED/COMMITTED, REPEATABLE READ, SERIALIZABLE; dirty read, non-repeatable read, phantom, plus lost update and write skew. Then add the PostgreSQL facts measured here: no dirty reads at any level, and RR also stops phantoms.</li>
  <li><strong>"What is PostgreSQL's default, and Spring's?"</strong> — READ COMMITTED; Spring's <code>Isolation.DEFAULT</code> means "use the database's".</li>
  <li><strong>"What is write skew?"</strong> — Two transactions read the same condition and each writes a different row; no row conflict, invariant broken. Only SERIALIZABLE (or a lock/constraint) catches it — two bookings at RR, one at SERIALIZABLE here.</li>
  <li><strong>"How do you handle serialization failures?"</strong> — Retry the whole transaction from outside (CannotAcquireLockException / ConcurrencyFailureException in Spring, P2034 in Prisma), with a bounded number of attempts.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Predict first, then measure: run case 6 with <code>Isolation.REPEATABLE_READ</code> instead of SERIALIZABLE, without and with the retry loop.</li>
  <li>Explain the result using case 4 and case 5: which anomaly is the wallet race, and which level is the minimum that detects it?</li>
</ol>
<p><strong>Done when:</strong> your prediction matches the measured counts, and you can say in one sentence why the wallet needs only REPEATABLE READ while the booking slot needs SERIALIZABLE.</p></div>
${giai('Show the measurement', `${OUT74_TH}
<p>Same as SERIALIZABLE: one success and nine 40001 errors without retry, 5 bookings and wallet 0 with retry. The wallet race is a lost update on <em>one row</em> (case 4), which PostgreSQL's REPEATABLE READ already detects. The slot race is write skew over <em>different rows</em> (case 5), which only SERIALIZABLE detects — or a lock on something both transactions share (7.5).</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Isolation level</span><span class="v">How much one transaction can see of concurrent ones.</span></div>
  <div class="kv"><span class="k">Snapshot (MVCC)</span><span class="v">The consistent view of committed data a statement or transaction reads from.</span></div>
  <div class="kv"><span class="k">Non-repeatable read</span><span class="v">The same row read twice returns different values.</span></div>
  <div class="kv"><span class="k">Phantom read</span><span class="v">The same query returns a different set of rows.</span></div>
  <div class="kv"><span class="k">Write skew</span><span class="v">Two transactions check the same condition and write different rows, breaking it together.</span></div>
  <div class="kv"><span class="k">SSI</span><span class="v">Serializable Snapshot Isolation — PostgreSQL's SERIALIZABLE implementation.</span></div>
  <div class="kv"><span class="k">40001</span><span class="v">SQLState "serialization failure": retry the transaction.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>PostgreSQL: default READ COMMITTED; READ UNCOMMITTED behaves as READ COMMITTED (B read 500, not 0).</li>
  <li>RR gave stable reads (500, 500) and no phantoms (9, 9); RC did not (500→400, 9→10).</li>
  <li>Lost update: RC silently kept 400 instead of 300; RR raised 40001.</li>
  <li>Write skew: RR committed 2 bookings for one slot; SERIALIZABLE failed one commit ⇒ 1.</li>
  <li>Wallet race at SERIALIZABLE: 1 success + 9 errors without retry; with retry 5 bookings, wallet 0, 35 retries.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.postgresql.org/docs/16/transaction-iso.html', '🐘', 'PostgreSQL 16 — Transaction Isolation', 'The table of anomalies per level, and SSI.')}
${tl('https://www.postgresql.org/docs/16/mvcc-serialization-failure-handling.html', '🐘', 'PostgreSQL 16 — Serialization Failure Handling', 'Which SQLStates to retry.')}
${tl('https://dl.acm.org/doi/10.1145/3035918.3064037', '📄', 'Warszawski & Bailis — ACIDRain (SIGMOD 2017)', 'Concurrency attacks on database-backed web applications.')}
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html', '📘', 'Spring Framework — @Transactional settings', 'isolation, timeout, readOnly.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: C7App profile <code>e74</code> (JDBC sessions + Spring Data JPA) on Spring Boot 4.1.2, Hibernate ORM 7.4.13.Final, PostgreSQL 16.15 with <code>log_statement=all</code> (20/11/2026); Prisma 7.10.1 on Node 22, script p75.ts.</li>
  <li>T. Warszawski, P. Bailis, "ACIDRain: Concurrency-Related Attacks on Database-Backed Web Applications", SIGMOD 2017.</li>
</ul>
</div>
`;

const L74_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Mức cô lập trong PostgreSQL</h2>
<p class="lead">Bài 6.5 kết thúc bằng mười giao dịch, giao dịch nào cũng làm đúng, gộp lại thì mất chín lần cập nhật. Chữ "I" của ACID — isolation, tính cô lập — quyết định một giao dịch được thấy gì của giao dịch khác. Bài này tái hiện mọi hiện tượng trong sách trên PostgreSQL 16 thật bằng hai phiên JDBC đi từng câu một, rồi chạy lại cuộc đua ví điểm ở <code>SERIALIZABLE</code>: không thử lại thì đặt được một lần, có thử lại thì đúng năm lần.</p>

<h3>Đời thường trước đã</h3>
<p>Hai thầy cô cùng điền một tờ điểm danh giấy. <strong>READ COMMITTED</strong>: mỗi lần nhìn tờ giấy bạn thấy những gì người khác đã viết xong tới lúc đó — số vắng có thể đổi giữa hai lần liếc. <strong>REPEATABLE READ</strong>: lúc bắt đầu bạn chụp một tấm ảnh tờ giấy rồi chỉ đọc ảnh — ổn định, nhưng có thể bạn quyết định dựa trên một tấm ảnh đã cũ. <strong>SERIALIZABLE</strong>: văn phòng khoa kiểm tra sau đó xem kết quả có giống như hai thầy cô lần lượt điền hay không; nếu không, một người phải làm lại.</p>

<h3>Hai phiên, một luồng, thứ tự cố định</h3>
${MA74_HAI}
<p>Phiên A và phiên B là hai kết nối; demo chạy xen kẽ từng câu của chúng trên một luồng, nên thứ tự xen kẽ đúng y như được in ra — không có may rủi.</p>
${OUT74}

<h3>Mỗi trường hợp cho thấy gì</h3>
<ul>
  <li><strong>0.</strong> Mặc định của PostgreSQL là <code>read committed</code> — và Spring không đổi nó trừ khi bạn yêu cầu.</li>
  <li><strong>1 — không bao giờ có dirty read.</strong> B xin <code>READ UNCOMMITTED</code> (PostgreSQL nhận cái tên: <code>show transaction_isolation</code> báo <code>read uncommitted</code>) mà vẫn đọc 500 trong khi số 0 chưa commit của A đang treo. PostgreSQL coi READ UNCOMMITTED như READ COMMITTED.</li>
  <li><strong>2 — non-repeatable read.</strong> Ở READ COMMITTED, B đọc 500, A commit 400, lần đọc thứ hai của B ra 400: mỗi câu lấy một snapshot mới. Ở REPEATABLE READ, lần đọc thứ hai vẫn ra 500: một snapshot cho cả giao dịch.</li>
  <li><strong>3 — phantom read.</strong> Đếm lượt đặt của LAB-01 ngày 1/3: 9, rồi 10 ở READ COMMITTED sau khi A chèn một lượt; vẫn 9 ở REPEATABLE READ. REPEATABLE READ của PostgreSQL chặt hơn mức chuẩn SQL đòi hỏi — chặn luôn phantom.</li>
  <li><strong>4 — lost update.</strong> B đọc 500 và định ghi 400 tính trong Java; A trừ 100 rồi commit. Ở READ COMMITTED, câu <code>UPDATE … = 400</code> của B thành công: con số 400 cuối cùng lẽ ra phải là 300 — một lần trừ biến mất lặng lẽ. Ở REPEATABLE READ PostgreSQL từ chối: <code>SQLState 40001: could not serialize access due to concurrent update</code>.</li>
  <li><strong>5 — write skew.</strong> Đúng hình dạng đặt trùng lịch: cả hai phiên kiểm "không có lượt chồng giờ" (0), cả hai chèn vào các dòng khác nhau. Không dòng nào bị cập nhật hai lần, nên REPEATABLE READ không thấy xung đột và <strong>2</strong> lượt đặt cho cùng khung giờ được commit. Ở SERIALIZABLE, SSI của PostgreSQL nhận ra quan hệ đọc/ghi phụ thuộc và làm hỏng commit của B: <code>could not serialize access due to read/write dependencies among transactions</code> — còn 1 lượt.</li>
</ul>
<div class="kv-grid">
  <div class="kv"><span class="k">READ COMMITTED</span><span class="v">Snapshot theo từng câu. Để lọt non-repeatable read, phantom, lost update, write skew.</span></div>
  <div class="kv"><span class="k">REPEATABLE READ</span><span class="v">Snapshot theo giao dịch. Chặn phantom (ở PostgreSQL) và lost update trên cùng dòng (lỗi 40001). Để lọt write skew.</span></div>
  <div class="kv"><span class="k">SERIALIZABLE</span><span class="v">SSI: như thể các giao dịch chạy lần lượt; mẫu nào nguy hiểm ⇒ lỗi 40001, bạn phải thử lại.</span></div>
</div>

<h3>Cuộc đua ví điểm ở SERIALIZABLE — và vì sao cần thử lại</h3>
${MA74_SVC}
${MA74_RETRY}
${OUT74_DUA}
<ul>
  <li><strong>6 — không thử lại.</strong> Một lần trừ thành công; chín lần còn lại hỏng với <code>CannotAcquireLockException</code> (cách Spring dịch SQLState 40001). Đúng — ví còn 400 và có một lượt đặt — nhưng chín người dùng nhận lỗi trong khi ví vẫn còn 400 điểm.</li>
  <li><strong>7 — thử lại bên ngoài giao dịch.</strong> Giao dịch serializable đã hỏng là chết; cách duy nhất là chạy lại cả đơn vị công việc từ đầu, nên vòng lặp nằm ở nơi gọi và bắt <code>ConcurrencyFailureException</code> (lớp cha của các bản dịch lỗi 40001). Kết quả ba vòng: đúng 5 lượt đặt, ví 0, 35 lần thử lại, 0,47–0,65 s.</li>
  <li>Hai chi phí ẩn thấy trong log PostgreSQL: driver gửi <code>SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE</code> 167 lần và đặt lại <code>READ COMMITTED</code> 183 lần — thêm hai chuyến đi về mỗi giao dịch vì pool khôi phục mặc định khi kết nối được trả về. Và mỗi lần thử lại lặp lại toàn bộ công việc.</li>
</ul>
<p>Vậy mức cô lập là công cụ để <em>phát hiện</em> xung đột; bài 7.5 cho thấy các công cụ để <em>tránh</em> xung đột (câu cập nhật có điều kiện và khoá), thường rẻ hơn khi chỉ có một dòng nóng.</p>

<h3>🕵️ Góc hacker — cô lập yếu là bề mặt tấn công</h3>
<p>Kẻ tấn công không cần mã nguồn của bạn để tìm write skew hay lost update: chúng gửi cùng một request thật nhiều lần song song rồi xem số dư, voucher hay tồn kho có sai không. Năm 2017 Todd Warszawski và Peter Bailis (Stanford) công bố <strong>ACIDRain</strong> (SIGMOD 2017): phân tích log SQL của 12 ứng dụng thương mại điện tử mã nguồn mở phổ biến, họ tìm ra 22 lỗ hổng đúng loại này — tiêu thẻ quà tặng quá giá trị, áp một voucher cho nhiều đơn, mua vượt tồn kho — phần lớn vì ứng dụng chạy ở mức cô lập mặc định của CSDL. Cách phòng: liệt kê mọi bất biến kiểu "kiểm rồi ghi", bảo vệ từng cái bằng ràng buộc, câu cập nhật có điều kiện, khoá (7.5) hoặc SERIALIZABLE + thử lại, và kiểm bằng request song song (Lab 7).</p>

<h3>So với Node.js (Prisma)</h3>
<p>Prisma truyền mức cô lập cho từng giao dịch tương tác. Cùng cuộc đua:</p>
${MA74_PRISMA}
${OUT74_PRISMA}
<p>Kết quả giống trường hợp 6: một thành công, chín thất bại — Prisma báo SQLState 40001 bằng mã lỗi <code>P2034</code> ("write conflict or a deadlock, please retry"). Prisma cũng không có sẵn hàm thử lại; bạn tự viết vòng lặp, bên ngoài giao dịch, đúng như trường hợp 7.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Phần lớn ứng dụng Spring chạy READ COMMITTED cả đời. Hãy biết bất biến nào vì thế không được bảo vệ, rồi bảo vệ từng cái một cách tường minh.</li>
  <li>Nếu chọn SERIALIZABLE, hãy chọn luôn chính sách thử lại (số lần, giãn cách), giữ giao dịch ngắn, và làm đơn vị được thử lại có tính idempotent — không gửi email từ bên trong nó.</li>
  <li>Log bỗng ngập "could not serialize access" sau một bản phát hành thường nghĩa là có truy vấn mới đọc quá nhiều (quét tuần tự khiến SSI theo dõi cả bảng); một index trên cột lọc sẽ thu hẹp nó.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Kể tên các mức cô lập và hiện tượng."</strong> — READ UNCOMMITTED/COMMITTED, REPEATABLE READ, SERIALIZABLE; dirty read, non-repeatable read, phantom, cộng lost update và write skew. Rồi thêm các sự thật PostgreSQL đã đo ở đây: không có dirty read ở mức nào, và RR chặn luôn phantom.</li>
  <li><strong>"Mặc định của PostgreSQL là gì, của Spring là gì?"</strong> — READ COMMITTED; <code>Isolation.DEFAULT</code> của Spring nghĩa là "dùng mặc định của CSDL".</li>
  <li><strong>"Write skew là gì?"</strong> — Hai giao dịch đọc cùng một điều kiện và mỗi bên ghi một dòng khác nhau; không xung đột dòng, bất biến vẫn vỡ. Chỉ SERIALIZABLE (hoặc khoá/ràng buộc) bắt được — ở đây RR cho hai lượt đặt, SERIALIZABLE còn một.</li>
  <li><strong>"Xử lý lỗi serialization thế nào?"</strong> — Thử lại cả giao dịch từ bên ngoài (CannotAcquireLockException / ConcurrencyFailureException trong Spring, P2034 trong Prisma), có giới hạn số lần.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Đoán trước, rồi đo: chạy trường hợp 6 với <code>Isolation.REPEATABLE_READ</code> thay cho SERIALIZABLE, không thử lại và có thử lại.</li>
  <li>Giải thích kết quả bằng trường hợp 4 và 5: cuộc đua ví điểm là hiện tượng nào, và mức thấp nhất phát hiện được nó là mức nào?</li>
</ol>
<p><strong>Đạt khi:</strong> dự đoán của bạn khớp số đếm đo được, và bạn nói được trong một câu vì sao ví điểm chỉ cần REPEATABLE READ còn khung giờ đặt phòng cần SERIALIZABLE.</p></div>
${giai('Xem số đo', `${OUT74_TH}
<p>Giống hệt SERIALIZABLE: không thử lại thì một thành công và chín lỗi 40001, có thử lại thì 5 lượt đặt và ví 0. Cuộc đua ví điểm là lost update trên <em>một dòng</em> (trường hợp 4), REPEATABLE READ của PostgreSQL đã phát hiện được. Cuộc đua khung giờ là write skew trên <em>các dòng khác nhau</em> (trường hợp 5), chỉ SERIALIZABLE phát hiện được — hoặc một khoá trên thứ cả hai giao dịch cùng chạm vào (7.5).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mức cô lập</span><span class="v">Một giao dịch được thấy bao nhiêu của các giao dịch chạy đồng thời.</span></div>
  <div class="kv"><span class="k">Snapshot (MVCC)</span><span class="v">Góc nhìn nhất quán về dữ liệu đã commit mà một câu hay một giao dịch đọc từ đó.</span></div>
  <div class="kv"><span class="k">Non-repeatable read</span><span class="v">Đọc cùng một dòng hai lần ra hai giá trị khác nhau.</span></div>
  <div class="kv"><span class="k">Phantom read</span><span class="v">Cùng một truy vấn trả về tập dòng khác nhau.</span></div>
  <div class="kv"><span class="k">Write skew</span><span class="v">Hai giao dịch kiểm cùng một điều kiện rồi ghi các dòng khác nhau, cùng nhau làm vỡ điều kiện.</span></div>
  <div class="kv"><span class="k">SSI</span><span class="v">Serializable Snapshot Isolation — cách PostgreSQL hiện thực SERIALIZABLE.</span></div>
  <div class="kv"><span class="k">40001</span><span class="v">SQLState "serialization failure": hãy thử lại giao dịch.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>PostgreSQL: mặc định READ COMMITTED; READ UNCOMMITTED chạy như READ COMMITTED (B đọc 500, không phải 0).</li>
  <li>RR cho đọc ổn định (500, 500) và không phantom (9, 9); RC thì không (500→400, 9→10).</li>
  <li>Lost update: RC lặng lẽ giữ 400 thay vì 300; RR báo 40001.</li>
  <li>Write skew: RR commit 2 lượt đặt cho một khung giờ; SERIALIZABLE làm hỏng một commit ⇒ 1.</li>
  <li>Cuộc đua ví điểm ở SERIALIZABLE: 1 thành công + 9 lỗi khi không thử lại; có thử lại thì 5 lượt, ví 0, 35 lần thử lại.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.postgresql.org/docs/16/transaction-iso.html', '🐘', 'PostgreSQL 16 — Transaction Isolation', 'Bảng hiện tượng theo từng mức, và SSI.')}
${tl('https://www.postgresql.org/docs/16/mvcc-serialization-failure-handling.html', '🐘', 'PostgreSQL 16 — Serialization Failure Handling', 'Những SQLState nào nên thử lại.')}
${tl('https://dl.acm.org/doi/10.1145/3035918.3064037', '📄', 'Warszawski & Bailis — ACIDRain (SIGMOD 2017)', 'Tấn công đồng thời vào ứng dụng web dựa trên CSDL.')}
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html', '📘', 'Spring Framework — @Transactional settings', 'isolation, timeout, readOnly.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: C7App profile <code>e74</code> (phiên JDBC + Spring Data JPA) chạy Spring Boot 4.1.2, Hibernate ORM 7.4.13.Final, PostgreSQL 16.15 với <code>log_statement=all</code> (20/11/2026); Prisma 7.10.1 trên Node 22, script p75.ts.</li>
  <li>T. Warszawski, P. Bailis, "ACIDRain: Concurrency-Related Attacks on Database-Backed Web Applications", SIGMOD 2017.</li>
</ul>
</div>
`;

// ===== Bài 7.5 =====
const MA75_REPO = java("public interface WalletRepo extends JpaRepository<Wallet, Long> {\n    /** Cách 1 — câu cập nhật có điều kiện, nguyên tử: CSDL tự kiểm \"đủ 100 điểm\". */\n    @Modifying\n    @Query(\"update Wallet w set w.points = w.points - 100 where w.id = :id and w.points >= 100\")\n    int truNeuDu(Long id);\n\n    /** Cách 2 — khoá bi quan: SELECT … FOR NO KEY UPDATE, người sau chờ người trước commit. */\n    @Lock(LockModeType.PESSIMISTIC_WRITE)\n    @Query(\"select w from Wallet w where w.id = :id\")\n    Wallet khoa(Long id);\n\n    /** Như trên nhưng không chờ: lock.timeout = 0 ⇒ NOWAIT. */\n    @Lock(LockModeType.PESSIMISTIC_WRITE)\n    @QueryHints(@QueryHint(name = \"jakarta.persistence.lock.timeout\", value = \"0\"))\n    @Query(\"select w from Wallet w where w.id = :id\")\n    Wallet khoaKhongCho(Long id);\n}");
const MA75_V = java("/** Cùng bảng wallets, có @Version ⇒ khoá lạc quan. */\n@Entity @Table(name = \"wallets\")\npublic class WalletV {\n    @Id private Long id;\n    private int points;\n    @Version private int version;\n    // … getter/setter\n}");
const MA75_VI = java("/** 1. Câu UPDATE có điều kiện: kiểm và trừ trong MỘT câu, CSDL khoá dòng trong lúc làm. */\n@Transactional\npublic boolean nguyenTu() {\n    if (wallets.truNeuDu(1L) == 0) return false;   // 0 dòng bị ảnh hưởng ⇒ không đủ điểm\n    cho50();\n    ghiLuot();\n    return true;\n}\n\n/** 2. Khoá bi quan: SELECT … FOR NO KEY UPDATE, luồng sau CHỜ ở câu này. */\n@Transactional\npublic boolean biQuan() {\n    Wallet w = wallets.khoa(1L);\n    if (w.getPoints() < 100) return false;\n    cho50();\n    w.setPoints(w.getPoints() - 100);\n    ghiLuot();\n    return true;\n}\n\n/** 3. Khoá lạc quan: @Version, không ai chờ ai; người ghi sau bị từ chối lúc flush. */\n@Transactional\npublic boolean lacQuan() {\n    WalletV w = walletsV.findById(1L).orElseThrow();\n    if (w.getPoints() < 100) return false;\n    cho50();\n    w.setPoints(w.getPoints() - 100);\n    ghiLuot();\n    return true;\n}");
const OUT75_DUA = out("=== 0. Không khoá (bài 6.5)\n  vòng 1: {đặt được=10} · ví = 400 · lượt đặt = 10 · 1037 ms\n  vòng 2: {đặt được=10} · ví = 400 · lượt đặt = 10 · 276 ms\n  vòng 3: {đặt được=10} · ví = 400 · lượt đặt = 10 · 530 ms\n\n=== 1. UPDATE … where points >= 100 (nguyên tử)\n  vòng 1: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · 1169 ms\n  vòng 2: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · 396 ms\n  vòng 3: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · 354 ms\n\n=== 2. Khoá bi quan @Lock(PESSIMISTIC_WRITE)\n  vòng 1: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · 400 ms\n  vòng 2: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · 532 ms\n  vòng 3: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · 755 ms\n\n=== 3. Khoá lạc quan @Version, không thử lại\n  vòng 1: {ObjectOptimisticLockingFailureException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · 83 ms\n  vòng 2: {ObjectOptimisticLockingFailureException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · 79 ms\n  vòng 3: {ObjectOptimisticLockingFailureException=9, đặt được=1} · ví = 400 · lượt đặt = 1 · 355 ms\n\n=== 4. Khoá lạc quan @Version + thử lại tối đa 10 lần\n  vòng 1: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · thử lại 35 lần · 609 ms\n  vòng 2: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · thử lại 35 lần · 564 ms\n  vòng 3: {không đủ điểm=5, đặt được=5} · ví = 0 · lượt đặt = 5 · thử lại 35 lần · 488 ms");
const OUT75_SQL = out("     30 DEBUG SQL: select l1_0.id,l1_0.capacity,l1_0.code,l1_0.name from labs l1_0 where l1_0.id=? for no key update of l1_0\n     39 DEBUG SQL: select w1_0.id,w1_0.points from wallets w1_0 where w1_0.id=? for no key update of w1_0\n      1 DEBUG SQL: select w1_0.id,w1_0.points from wallets w1_0 where w1_0.id=? for no key update of w1_0 nowait");
const MA75_CHUYEN = java("@Transactional\npublic void chuyen(long tu, long den, int n, boolean theoThuTuId) throws InterruptedException {\n    long dau = theoThuTuId ? Math.min(tu, den) : tu, sau = theoThuTuId ? Math.max(tu, den) : den;\n    Wallet x = wallets.khoa(dau);\n    Thread.sleep(200);                       // để luồng kia kịp khoá ví còn lại\n    Wallet y = wallets.khoa(sau);\n    Wallet a = x.getId() == tu ? x : y, b = x.getId() == tu ? y : x;\n    a.setPoints(a.getPoints() - n);\n    b.setPoints(b.getPoints() + n);\n}");
const OUT75_DL = out("=== 5. Deadlock: luồng 1 chuyển ví 1 → 2, luồng 2 chuyển ví 2 → 1, mỗi luồng khoá ví NGUỒN trước\n  luồng 1 CannotAcquireLockException sau 1220 ms ← PSQLException SQLState 40P01: ERROR: deadlock detected\n  luồng 2 OK sau 1257 ms\n  ví 1 = 530 · ví 2 = 470\n\n=== 5b. Sửa: mọi luồng khoá ví có id NHỎ trước\n  luồng 1 OK sau 547 ms\n  luồng 2 OK sau 334 ms\n  ví 1 = 480 · ví 2 = 520");
const OUT75_DLD = out("Detail: Process 129 waits for ShareLock on transaction 1060; blocked by process 128.\nProcess 128 waits for ShareLock on transaction 1059; blocked by process 129.");
const OUT75_NW = out("=== 6. NOWAIT: một luồng giữ khoá ví 1 trong 1,5 s; luồng khác hỏi khoá với lock.timeout = 0\n  CannotAcquireLockException sau 7 ms ← PSQLException SQLState 55P03: ERROR: could not obtain lock on row in relation \"wallets\"\n\n=== 7. SKIP LOCKED: hai \"worker\" cùng lấy 3 lượt PENDING để xử lý\n  worker nhận [1, 5, 9]\n  worker nhận [13, 17, 21]");
const OUT75_LAB6 = out("$ bash ban10.sh 41880      # vòng 1: 10 sinh viên, IOT-01, 2030-02-01 08:00–10:00, cùng lúc\n     10 201\n  số dòng trong CSDL: 10\n$ bash ban10.sh 41880      # vòng 2: 10 sinh viên, IOT-01, 2030-02-01 08:00–10:00, cùng lúc\n      5 201\n      5 409\n  số dòng trong CSDL: 5\n$ bash ban10.sh 41880      # vòng 3: 10 sinh viên, IOT-01, 2030-02-01 08:00–10:00, cùng lúc\n      5 201\n      5 409\n  số dòng trong CSDL: 5");
const MA75_DAT = java("/** Y như Lab 6: kiểm trùng rồi chèn. */\n@Transactional\npublic void kiemRoiChen(long sv) {\n    if (bookings.trung(5L, BD, KT) > 0) throw new TrungGio();\n    ViService.cho50();\n    bookings.save(new Booking(labs.getReferenceById(5L), students.getReferenceById(sv), BD, KT, \"E75-DAT\"));\n    bookings.flush();\n}\n\n/** Sửa 1: khoá dòng của PHÒNG trước khi kiểm — các lượt đặt cùng phòng xếp hàng, phòng khác không bị ảnh hưởng. */\n@Transactional\npublic void khoaPhongRoiChen(long sv) {\n    Lab lab = labs.khoa(5L);\n    if (bookings.trung(lab.getId(), BD, KT) > 0) throw new TrungGio();\n    ViService.cho50();\n    bookings.save(new Booking(lab, students.getReferenceById(sv), BD, KT, \"E75-DAT\"));\n    bookings.flush();\n}");
const OUT75_89 = out("=== 8. Lab 6 — 10 sinh viên cùng đặt LAB-05 2031-04-01 08:00–10:00: kiểm trùng rồi chèn (như lời giải Lab 6)\n  vòng 1: {201=10} · số dòng trong CSDL = 10\n  vòng 2: {201=10} · số dòng trong CSDL = 10\n  vòng 3: {201=10} · số dòng trong CSDL = 10\n\n=== 9. Sửa 1: khoá dòng của phòng (labs.khoa) trước khi kiểm\n  vòng 1: {201=1, 409=9} · số dòng trong CSDL = 1 · 121 ms\n  vòng 2: {201=1, 409=9} · số dòng trong CSDL = 1 · 104 ms\n  vòng 3: {201=1, 409=9} · số dòng trong CSDL = 1 · 88 ms");
const MA75_EX = java("db.sql(\"create extension if not exists btree_gist\").update();\ndb.sql(\"\"\"\n       alter table bookings add constraint bookings_khong_chong_gio\n       exclude using gist (lab_id with =, tsrange(start_at, end_at) with &&) where (status <> 'CANCELLED')\"\"\").update();");
const OUT75_10 = out("=== 10. Sửa 2: ràng buộc EXCLUDE của PostgreSQL — giữ nguyên mã kiểm-rồi-chèn\n  đã thêm ràng buộc bookings_khong_chong_gio\n  vòng 1: {201=1, DataIntegrityViolationException=9} · số dòng trong CSDL = 1\n  vòng 2: {201=1, CannotAcquireLockException=9} · số dòng trong CSDL = 1\n  vòng 3: {201=1, DataIntegrityViolationException=9} · số dòng trong CSDL = 1\n  lỗi gốc: PSQLException SQLState 23P01: ERROR: conflicting key value violates exclusion constraint \"bookings_khong_chong_gio\"");
const OUT75_EXDL = out("Where: while checking exclusion constraint on tuple (26,21) in relation \"bookings\"");
const OUT75_LAB7 = out("$ bash ban10.sh 41890 41891      # vòng 1: lời giải Lab 7, hai bản ứng dụng\n      1 201\n      9 409\n  số dòng trong CSDL: 1\n$ bash ban10.sh 41890 41891      # vòng 2: lời giải Lab 7, hai bản ứng dụng\n      1 201\n      9 409\n  số dòng trong CSDL: 1\n$ bash ban10.sh 41890 41891      # vòng 3: lời giải Lab 7, hai bản ứng dụng\n      1 201\n      9 409\n  số dòng trong CSDL: 1");
const MA75_PRISMA = js("await dua(\"P2. updateMany có điều kiện (nguyên tử): where points >= 100, decrement 100\", async () => {\n  const r = await prisma.wallet.updateMany({ where: { id: 1n, points: { gte: 100 } }, data: { points: { decrement: 100 } } });\n  return r.count === 1 ? \"đặt được\" : \"không đủ điểm\";\n});\nawait dua(\"P3. khoá lạc quan tự làm: updateMany where version = v đã đọc\", async () => {\n  const w = await prisma.wallet.findUniqueOrThrow({ where: { id: 1n } });\n  if (w.points < 100) return \"không đủ điểm\";\n  await ngu(50);\n  const r = await prisma.wallet.updateMany({ where: { id: 1n, version: w.version }, data: { points: w.points - 100, version: { increment: 1 } } });\n  return r.count === 1 ? \"đặt được\" : \"xung đột (count = 0)\";\n});");
const OUT75_PRISMA = out("=== P1. $transaction: đọc – kiểm – chờ 50 ms – ghi (mặc định READ COMMITTED)\n  {\"đặt được\":10} · ví = 400\n\n=== P2. updateMany có điều kiện (nguyên tử): where points >= 100, decrement 100\n  {\"không đủ điểm\":5,\"đặt được\":5} · ví = 0\n\n=== P3. khoá lạc quan tự làm: updateMany where version = v đã đọc\n  {\"đặt được\":1,\"xung đột (count = 0)\":9} · ví = 400");
const OUT75_TH = out("=== Thực hành 7.5 — 10 luồng 1→2 và 10 luồng 2→1, mỗi lệnh 10 điểm, theoThuTuId = false\n  {CannotAcquireLockException=19, thành công=1} · ví 1 = 510 · ví 2 = 490 · tổng = 1000 · 5519 ms\n\n=== Thực hành 7.5 — 10 luồng 1→2 và 10 luồng 2→1, mỗi lệnh 10 điểm, theoThuTuId = true\n  {thành công=20} · ví 1 = 500 · ví 2 = 500 · tổng = 1000 · 4251 ms");

const L75_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Optimistic and pessimistic locking</h2>
<p class="lead">Two races are still open. Lesson 6.5: ten concurrent withdrawals from a 500-point wallet booked ten times. Lab 6's stretch: ten students booking the same slot at the same moment. Here we close both, measuring four ways to protect the wallet (conditional update, <code>SELECT … FOR UPDATE</code>, <code>@Version</code>, <code>@Version</code> + retry), the deadlock that locks can cause and its one-line fix, <code>NOWAIT</code> and <code>SKIP LOCKED</code>, and two ways to make double booking impossible — the second one enforced by PostgreSQL itself.</p>

<h3>In everyday life first</h3>
<p>A shared meeting room. <strong>Pessimistic</strong>: take the key from the reception desk before you even look at the room; whoever comes next waits at the desk. <strong>Optimistic</strong>: everybody walks to the room freely, but the booking sheet on the door has a version number — if the number changed since you read it, someone got there first and you must start again. <strong>Conditional update</strong>: you do not look and then write; you say to the receptionist "give me the room <em>if it is free</em>", and she answers yes or no in one step.</p>

<h3>Four ways to subtract 100 points</h3>
${MA75_REPO}
${MA75_V}
${MA75_VI}
<p><code>khongKhoa()</code> is lesson 6.5's <code>truDiem</code> (read, check, wait 50 ms, write). Each method runs ten times in parallel, three rounds, wallet reset to 500 before each round:</p>
${OUT75_DUA}
<p>The SQL Hibernate generated for the two locks:</p>
${OUT75_SQL}
<ul>
  <li><strong>0 — no lock:</strong> 10 bookings, wallet 400, every round. The bug of 6.5, unchanged.</li>
  <li><strong>1 — conditional update</strong> <code>where points &gt;= 100</code>: 5 bookings, wallet 0. The check and the write are one statement; PostgreSQL locks the row while it runs, and the 6th caller's update simply affects 0 rows. Cheapest and simplest whenever the rule fits in one <code>UPDATE</code>.</li>
  <li><strong>2 — pessimistic lock</strong> <code>@Lock(PESSIMISTIC_WRITE)</code>: 5 and 0. Hibernate 7 on PostgreSQL emits <code>for no key update</code> — a row lock that still lets other transactions insert bookings referencing this row. Callers queue on the <code>SELECT</code>; total time grows with the queue (0.40–0.76 s for 10 × 50 ms of work).</li>
  <li><strong>3 — <code>@Version</code>, no retry:</strong> 1 booking, 9 × <code>ObjectOptimisticLockingFailureException</code>. Correct (wallet 400 = one withdrawal), but nine users got an error with plenty of points left. The update was <code>… where id = ? and version = ?</code>; 0 rows ⇒ exception.</li>
  <li><strong>4 — <code>@Version</code> + retry</strong> (up to 10 attempts, outside the transaction): 5 and 0, at the cost of 35 retries per round. Optimistic locking shines when conflicts are rare (two admins editing the same booking); on a hot row like this wallet, the pessimistic lock or the conditional update is better.</li>
</ul>

<h3>Deadlock, and the one-line fix</h3>
${MA75_CHUYEN}
${OUT75_DL}
<p>Thread 1 locked wallet 1 then wanted wallet 2; thread 2 locked wallet 2 then wanted wallet 1. PostgreSQL waits <code>deadlock_timeout</code> (1 s by default), detects the cycle and kills one of them:</p>
${OUT75_DLD}
<p>Thread 1 received <code>CannotAcquireLockException</code> (SQLState <code>40P01 deadlock detected</code>) after 1.2 s; thread 2 completed. In 5b every thread locks the <strong>smaller id first</strong>: no cycle is possible, both transfers succeeded (480 + 520 = 1000). Rule: when one transaction locks several rows, always lock them in a fixed global order.</p>

<h3>Not waiting: NOWAIT and SKIP LOCKED</h3>
${OUT75_NW}
<ul>
  <li><strong>NOWAIT</strong> (<code>jakarta.persistence.lock.timeout = 0</code>, SQL <code>… nowait</code>): while another transaction held the wallet, the request failed in 7 ms with <code>55P03 could not obtain lock on row</code> instead of queueing — good for "someone else is editing this, try later" screens.</li>
  <li><strong>SKIP LOCKED</strong>: two workers asked for "3 PENDING bookings to process" at the same time and got disjoint sets ([1, 5, 9] and [13, 17, 21]) — the standard way to build a job queue on PostgreSQL without double processing (Chapter 14 uses it).</li>
</ul>

<h3>Closing Lab 6's stretch: ten students, one slot</h3>
<p>First, the reference solution of Lab 6 over HTTP, 10 parallel requests for IOT-01 08:00–10:00 (<code>ban10.sh</code>), three rounds:</p>
${OUT75_LAB6}
<p>10, then 5, then 5 bookings for one slot. The overlap check (<code>SELECT</code>) and the <code>INSERT</code> are two statements; at READ COMMITTED every request checks before anyone has committed — write skew from 7.4. The same race in-process, then two fixes:</p>
${MA75_DAT}
${OUT75_89}
<p><strong>Fix 1 — lock something all competitors share.</strong> The bookings do not exist yet, so there is no row to lock among them — but the <em>lab</em> row exists. <code>labs.khoa(5)</code> (<code>SELECT … FOR NO KEY UPDATE</code>) makes every booking attempt for LAB-05 queue; bookings for other labs are not affected. Result: 1 × 201, 9 × 409, one row, every round.</p>
<p><strong>Fix 2 — let PostgreSQL enforce the rule.</strong> An exclusion constraint says "no two non-cancelled bookings of the same lab may have overlapping time ranges":</p>
${MA75_EX}
${OUT75_10}
<ul>
  <li>The Java code is the naive check-then-insert of round 8, unchanged — and every round ended with exactly one row. The database is now the last line of defence even for code paths you forgot (a batch import, a second service).</li>
  <li>The losers saw <code>DataIntegrityViolationException</code> caused by <code>23P01 conflicting key value violates exclusion constraint "bookings_khong_chong_gio"</code> — except round 2, where all nine got <code>CannotAcquireLockException</code>: concurrent inserts that conflict on an exclusion constraint wait for each other and PostgreSQL may report a deadlock instead (the line below). Map <em>both</em> to 409.</li>
</ul>
${OUT75_EXDL}
<p>Lab 7's reference solution uses fix 1 (no schema change allowed in the lab); the same 10-student burst against <strong>two</strong> running instances of it:</p>
${OUT75_LAB7}

<h3>Choosing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Conditional UPDATE</span><span class="v">The rule fits in one statement (counters, balances, stock). Cheapest; check the affected-row count.</span></div>
  <div class="kv"><span class="k">Pessimistic lock</span><span class="v">Read-check-write over several statements on a hot row, or a shared "parent" row to serialise on (the lab). Lock in a fixed order.</span></div>
  <div class="kv"><span class="k">Optimistic @Version</span><span class="v">Conflicts are rare and the user can retry (edit forms, approvals) — return 409 with the current version.</span></div>
  <div class="kv"><span class="k">Constraint (UNIQUE, EXCLUDE, CHECK)</span><span class="v">An invariant that must hold whatever code writes the data. Combine with one of the above for a friendly error.</span></div>
</div>

<h3>🕵️ Hacker corner — racing the balance</h3>
<p>Race-condition bugs pay out real money. <strong>Real incident — Starbucks gift cards, May 2015:</strong> Egor Homakov found that sending two balance transfers between his own Starbucks cards at the same instant credited the money twice — the classic check-then-write we just measured — so he ended up with more balance than he had paid for, and reported it. Bug bounty programmes classify such findings as "race condition" vulnerabilities, and tools like Burp Suite's "send group in parallel" (2023, single-packet attack) make them easy to trigger. Defence: one of the four techniques above for every balance, quota, voucher or seat, plus a test that fires parallel requests (Lab 7 fires 20).</p>

<h3>Compared with Node.js (Prisma)</h3>
${MA75_PRISMA}
${OUT75_PRISMA}
<p>Same numbers as Java: P1 (no protection) 10 bookings and wallet 400, P2 5 and 0, P3 one success and nine conflicts. Prisma has no <code>@Version</code> and no lock API: the conditional update is <code>updateMany</code> with a <code>where</code> and an atomic <code>decrement</code>; optimistic locking is a hand-written <code>version</code> column checked in <code>updateMany</code> (count 0 ⇒ conflict); a pessimistic lock needs raw SQL (<code>SELECT … FOR UPDATE</code> via <code>$queryRaw</code> inside <code>$transaction</code>). Exclusion constraints are created in a migration with raw SQL in both stacks.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Every "only N of X" rule (seats, stock, quotas, one booking per slot) needs an answer to "what stops two requests at the same time?" written in the design document.</li>
  <li>APIs that edit resources: return the version (or an <code>ETag</code>), accept it back (<code>If-Match</code>), answer 409/412 when it is stale.</li>
  <li>Production deadlocks appear in the PostgreSQL log as <code>deadlock detected</code> with both statements — fix the lock order, not the timeout.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Optimistic vs pessimistic locking?"</strong> — Optimistic: no lock, a version check at write time, the loser gets an exception (here 1 success + 9 errors, or 35 retries); pessimistic: <code>SELECT … FOR UPDATE</code>, others wait (5 and 0, queueing). Optimistic for rare conflicts, pessimistic for hot rows.</li>
  <li><strong>"How does @Version work?"</strong> — Hibernate adds <code>and version = ?</code> to the UPDATE and increments it; 0 rows ⇒ <code>ObjectOptimisticLockingFailureException</code> ⇒ 409 in a REST API.</li>
  <li><strong>"How do you prevent double booking?"</strong> — Serialise on a shared row (lock the lab), or an exclusion constraint on <code>(lab_id, tsrange)</code>, or SERIALIZABLE + retry; and test with parallel requests.</li>
  <li><strong>"How do you avoid deadlocks?"</strong> — Lock rows in a consistent order (smaller id first), keep transactions short, use lock timeouts; deadlocks show as 40P01.</li>
  <li><strong>"What is SKIP LOCKED for?"</strong> — Work queues: several workers take different rows without waiting for each other.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Using <code>ChuyenService</code>, start 20 threads at once: 10 transfer 10 points from wallet 1 to wallet 2, 10 transfer 10 points from wallet 2 to wallet 1.</li>
  <li>Run it with <code>theoThuTuId = false</code>, then make it safe.</li>
</ol>
<p><strong>Done when:</strong> the safe version has 20 successful transfers, no deadlock, and the two wallets still sum to 1 000 (and each is 500).</p></div>
${giai('Show the measurement', `${OUT75_TH}
<p>Locking in id order removes every cycle, so no transaction is ever chosen as a deadlock victim. The unsafe run shows how often a real workload hits the cycle — every failure there is a transfer a user would have to retry.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Optimistic locking</span><span class="v">Detect conflicting writes with a version column; no lock held while reading.</span></div>
  <div class="kv"><span class="k">Pessimistic locking</span><span class="v">Lock rows when reading (<code>FOR UPDATE</code>/<code>FOR NO KEY UPDATE</code>) so others wait.</span></div>
  <div class="kv"><span class="k">@Version</span><span class="v">JPA version attribute checked and incremented on every update.</span></div>
  <div class="kv"><span class="k">Deadlock</span><span class="v">Transactions waiting for each other in a cycle; PostgreSQL aborts one (40P01).</span></div>
  <div class="kv"><span class="k">NOWAIT / SKIP LOCKED</span><span class="v">Fail immediately on a locked row / ignore locked rows.</span></div>
  <div class="kv"><span class="k">Exclusion constraint</span><span class="v">PostgreSQL constraint forbidding rows whose values "conflict" under given operators (here <code>=</code> and <code>&amp;&amp;</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Wallet race: no lock 10/400; conditional update 5/0; pessimistic 5/0; @Version 1 + 9 errors; @Version + retry 5/0 (35 retries).</li>
  <li>Opposite lock order ⇒ deadlock 40P01 after ~1.2 s; lock smaller id first ⇒ both transfers succeed.</li>
  <li>NOWAIT failed in 7 ms (55P03); SKIP LOCKED gave two workers disjoint rows.</li>
  <li>Lab 6 over HTTP: 10, 5, 5 bookings for one slot. Lock the lab row ⇒ 1. Exclusion constraint ⇒ 1, even with naive code; losers see 23P01 or 40P01.</li>
  <li>Lab 7's solution, two instances, 10 parallel requests: 1 × 201 + 9 × 409, three rounds.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.postgresql.org/docs/16/explicit-locking.html', '🐘', 'PostgreSQL 16 — Explicit Locking', 'Row lock modes (FOR UPDATE, FOR NO KEY UPDATE), deadlocks.')}
${tl('https://www.postgresql.org/docs/16/ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION', '🐘', 'PostgreSQL 16 — Exclusion constraints', 'EXCLUDE USING gist with btree_gist.')}
${tl('https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#locking', '📘', 'Hibernate ORM 7 User Guide — Locking', '@Version, LockModeType, lock timeouts.')}
${tl('https://portswigger.net/web-security/race-conditions', '🛡️', 'PortSwigger Web Security Academy — Race conditions', 'How attackers trigger them with parallel requests.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: C7App profile <code>e75</code> on Spring Boot 4.1.2, Spring Data JPA 4.1.2, Hibernate ORM 7.4.13.Final, HikariCP 7.0.2, PostgreSQL 16.15 (btree_gist), 20/11/2026; Lab 6 and Lab 7 solutions over HTTP with <code>ban10.sh</code>; Prisma 7.10.1 on Node 22, script p75.ts.</li>
  <li>Egor Homakov, "Hacking Starbucks for unlimited coffee" (blog post, May 2015).</li>
  <li>James Kettle (PortSwigger Research), "Smashing the state machine: the true potential of web race conditions" (2023).</li>
</ul>
</div>
`;

const L75_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Khoá lạc quan và bi quan</h2>
<p class="lead">Còn hai cuộc đua đang mở. Bài 6.5: mười lần trừ điểm đồng thời trên ví 500 điểm đặt được mười lượt. Phần nâng cao của Lab 6: mười sinh viên cùng đặt một khung giờ đúng cùng một lúc. Ở đây ta đóng cả hai, đo bốn cách bảo vệ ví (câu cập nhật có điều kiện, <code>SELECT … FOR UPDATE</code>, <code>@Version</code>, <code>@Version</code> + thử lại), deadlock mà khoá có thể gây ra và cách sửa một dòng, <code>NOWAIT</code> và <code>SKIP LOCKED</code>, và hai cách khiến đặt trùng lịch trở thành không thể — cách thứ hai do chính PostgreSQL thi hành.</p>

<h3>Đời thường trước đã</h3>
<p>Một phòng họp dùng chung. <strong>Bi quan</strong>: lấy chìa khoá ở quầy lễ tân trước cả khi nhìn vào phòng; người tới sau đứng chờ ở quầy. <strong>Lạc quan</strong>: ai cũng tự do đi tới phòng, nhưng tờ lịch trên cửa có số phiên bản — nếu số đó đã đổi kể từ lúc bạn đọc, có người tới trước rồi và bạn phải bắt đầu lại. <strong>Câu cập nhật có điều kiện</strong>: bạn không nhìn rồi mới ghi; bạn nói với lễ tân "cho tôi phòng <em>nếu nó còn trống</em>", và chị trả lời có hoặc không trong một bước.</p>

<h3>Bốn cách trừ 100 điểm</h3>
${MA75_REPO}
${MA75_V}
${MA75_VI}
<p><code>khongKhoa()</code> chính là <code>truDiem</code> của bài 6.5 (đọc, kiểm, chờ 50 ms, ghi). Mỗi phương thức chạy mười lần song song, ba vòng, ví đặt lại 500 trước mỗi vòng:</p>
${OUT75_DUA}
<p>Câu SQL Hibernate sinh cho hai kiểu khoá:</p>
${OUT75_SQL}
<ul>
  <li><strong>0 — không khoá:</strong> 10 lượt đặt, ví 400, vòng nào cũng vậy. Lỗi của 6.5, y nguyên.</li>
  <li><strong>1 — câu cập nhật có điều kiện</strong> <code>where points &gt;= 100</code>: 5 lượt, ví 0. Kiểm và ghi là một câu; PostgreSQL khoá dòng trong lúc chạy, và câu update của người thứ 6 đơn giản là ảnh hưởng 0 dòng. Rẻ và đơn giản nhất mỗi khi quy tắc vừa trong một câu <code>UPDATE</code>.</li>
  <li><strong>2 — khoá bi quan</strong> <code>@Lock(PESSIMISTIC_WRITE)</code>: 5 và 0. Hibernate 7 trên PostgreSQL sinh <code>for no key update</code> — khoá dòng mà vẫn cho giao dịch khác chèn lượt đặt tham chiếu tới dòng này. Người gọi xếp hàng ở câu <code>SELECT</code>; tổng thời gian tăng theo hàng chờ (0,40–0,76 s cho 10 × 50 ms việc).</li>
  <li><strong>3 — <code>@Version</code>, không thử lại:</strong> 1 lượt, 9 × <code>ObjectOptimisticLockingFailureException</code>. Đúng (ví 400 = một lần trừ), nhưng chín người nhận lỗi dù ví còn dư điểm. Câu update là <code>… where id = ? and version = ?</code>; 0 dòng ⇒ exception.</li>
  <li><strong>4 — <code>@Version</code> + thử lại</strong> (tối đa 10 lần, bên ngoài giao dịch): 5 và 0, đổi lại 35 lần thử lại mỗi vòng. Khoá lạc quan toả sáng khi xung đột hiếm (hai quản trị viên cùng sửa một lượt đặt); với dòng nóng như cái ví này, khoá bi quan hoặc câu cập nhật có điều kiện tốt hơn.</li>
</ul>

<h3>Deadlock, và cách sửa một dòng</h3>
${MA75_CHUYEN}
${OUT75_DL}
<p>Luồng 1 khoá ví 1 rồi muốn ví 2; luồng 2 khoá ví 2 rồi muốn ví 1. PostgreSQL chờ <code>deadlock_timeout</code> (mặc định 1 s), phát hiện vòng tròn và giết một bên:</p>
${OUT75_DLD}
<p>Luồng 1 nhận <code>CannotAcquireLockException</code> (SQLState <code>40P01 deadlock detected</code>) sau 1,2 s; luồng 2 làm xong. Ở 5b, mọi luồng khoá <strong>id nhỏ trước</strong>: không thể có vòng tròn, cả hai lệnh chuyển thành công (480 + 520 = 1000). Quy tắc: khi một giao dịch khoá nhiều dòng, luôn khoá theo một thứ tự toàn cục cố định.</p>

<h3>Không chờ: NOWAIT và SKIP LOCKED</h3>
${OUT75_NW}
<ul>
  <li><strong>NOWAIT</strong> (<code>jakarta.persistence.lock.timeout = 0</code>, SQL <code>… nowait</code>): trong lúc giao dịch khác giữ ví, request hỏng sau 7 ms với <code>55P03 could not obtain lock on row</code> thay vì xếp hàng — hợp cho màn hình "người khác đang sửa, thử lại sau".</li>
  <li><strong>SKIP LOCKED</strong>: hai worker cùng lúc xin "3 lượt PENDING để xử lý" và nhận hai tập không giao nhau ([1, 5, 9] và [13, 17, 21]) — cách chuẩn để dựng hàng đợi việc trên PostgreSQL mà không xử lý trùng (Chương 14 dùng nó).</li>
</ul>

<h3>Đóng phần nâng cao của Lab 6: mười sinh viên, một khung giờ</h3>
<p>Trước hết, lời giải mẫu của Lab 6 qua HTTP, 10 request song song cho IOT-01 08:00–10:00 (<code>ban10.sh</code>), ba vòng:</p>
${OUT75_LAB6}
<p>10, rồi 5, rồi 5 lượt đặt cho một khung giờ. Câu kiểm trùng (<code>SELECT</code>) và câu <code>INSERT</code> là hai câu; ở READ COMMITTED mọi request đều kiểm trước khi có ai commit — chính là write skew của 7.4. Cùng cuộc đua chạy trong một tiến trình, rồi hai cách sửa:</p>
${MA75_DAT}
${OUT75_89}
<p><strong>Sửa 1 — khoá thứ mà mọi người tranh nhau cùng chạm.</strong> Các lượt đặt chưa tồn tại, nên chẳng có dòng nào trong số đó để khoá — nhưng dòng của <em>phòng</em> thì có. <code>labs.khoa(5)</code> (<code>SELECT … FOR NO KEY UPDATE</code>) bắt mọi lần đặt LAB-05 xếp hàng; lượt đặt phòng khác không bị ảnh hưởng. Kết quả: 1 × 201, 9 × 409, một dòng, vòng nào cũng vậy.</p>
<p><strong>Sửa 2 — để PostgreSQL thi hành quy tắc.</strong> Một ràng buộc loại trừ nói "không được có hai lượt đặt chưa huỷ của cùng một phòng có khoảng thời gian chồng nhau":</p>
${MA75_EX}
${OUT75_10}
<ul>
  <li>Mã Java vẫn là kiểm-rồi-chèn ngây thơ của vòng 8, không đổi — và vòng nào cũng kết thúc với đúng một dòng. CSDL giờ là tuyến phòng thủ cuối cùng, kể cả với những đường ghi bạn quên (một đợt nhập dữ liệu, một service thứ hai).</li>
  <li>Bên thua thấy <code>DataIntegrityViolationException</code> do <code>23P01 conflicting key value violates exclusion constraint "bookings_khong_chong_gio"</code> — trừ vòng 2, cả chín nhận <code>CannotAcquireLockException</code>: các câu chèn đồng thời xung đột trên một ràng buộc loại trừ phải chờ nhau, và PostgreSQL có thể báo deadlock thay vào đó (dòng bên dưới). Hãy ánh xạ <em>cả hai</em> thành 409.</li>
</ul>
${OUT75_EXDL}
<p>Lời giải mẫu của Lab 7 dùng cách sửa 1 (lab không cho đổi schema); cùng loạt bắn 10 sinh viên vào <strong>hai</strong> bản đang chạy của nó:</p>
${OUT75_LAB7}

<h3>Chọn cách nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">UPDATE có điều kiện</span><span class="v">Quy tắc vừa trong một câu (bộ đếm, số dư, tồn kho). Rẻ nhất; kiểm số dòng bị ảnh hưởng.</span></div>
  <div class="kv"><span class="k">Khoá bi quan</span><span class="v">Đọc-kiểm-ghi qua nhiều câu trên một dòng nóng, hoặc một dòng "cha" chung để xếp hàng (phòng lab). Khoá theo thứ tự cố định.</span></div>
  <div class="kv"><span class="k">Khoá lạc quan @Version</span><span class="v">Xung đột hiếm và người dùng có thể thử lại (form sửa, duyệt) — trả 409 kèm version hiện tại.</span></div>
  <div class="kv"><span class="k">Ràng buộc (UNIQUE, EXCLUDE, CHECK)</span><span class="v">Bất biến phải đúng bất kể mã nào ghi dữ liệu. Kết hợp với một trong các cách trên để có thông báo lỗi dễ hiểu.</span></div>
</div>

<h3>🕵️ Góc hacker — chạy đua với số dư</h3>
<p>Lỗi race condition trả bằng tiền thật. <strong>Sự cố thật — thẻ quà tặng Starbucks, tháng 5/2015:</strong> Egor Homakov phát hiện rằng gửi hai lệnh chuyển số dư giữa chính các thẻ Starbucks của anh vào cùng một khoảnh khắc thì tiền được cộng hai lần — đúng kiểu kiểm-rồi-ghi ta vừa đo — nên anh có nhiều số dư hơn số tiền đã trả, rồi báo lỗi cho hãng. Các chương trình bug bounty xếp những phát hiện kiểu này vào nhóm lỗ hổng "race condition", và công cụ như tính năng "gửi nhóm song song" của Burp Suite (2023, single-packet attack) khiến việc kích hoạt chúng rất dễ. Cách phòng: một trong bốn kỹ thuật trên cho mọi số dư, hạn mức, voucher hay chỗ ngồi, cộng một test bắn request song song (Lab 7 bắn 20).</p>

<h3>So với Node.js (Prisma)</h3>
${MA75_PRISMA}
${OUT75_PRISMA}
<p>Cùng những con số như Java: P1 (không bảo vệ) 10 lượt và ví 400, P2 5 và 0, P3 một thành công và chín xung đột. Prisma không có <code>@Version</code> và không có API khoá: câu cập nhật có điều kiện là <code>updateMany</code> với <code>where</code> và phép <code>decrement</code> nguyên tử; khoá lạc quan là cột <code>version</code> tự viết, kiểm trong <code>updateMany</code> (count 0 ⇒ xung đột); khoá bi quan cần SQL thô (<code>SELECT … FOR UPDATE</code> qua <code>$queryRaw</code> trong <code>$transaction</code>). Ràng buộc loại trừ được tạo trong migration bằng SQL thô ở cả hai bên.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Mọi quy tắc "chỉ N trong X" (chỗ ngồi, tồn kho, hạn mức, mỗi khung giờ một lượt) phải có câu trả lời cho "điều gì chặn hai request cùng lúc?" ghi rõ trong tài liệu thiết kế.</li>
  <li>API sửa tài nguyên: trả version (hoặc <code>ETag</code>), nhận lại nó (<code>If-Match</code>), trả 409/412 khi nó đã cũ.</li>
  <li>Deadlock ở production hiện trong log PostgreSQL là <code>deadlock detected</code> kèm cả hai câu lệnh — sửa thứ tự khoá, đừng sửa timeout.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Khoá lạc quan khác khoá bi quan thế nào?"</strong> — Lạc quan: không khoá, kiểm version lúc ghi, bên thua nhận exception (ở đây 1 thành công + 9 lỗi, hoặc 35 lần thử lại); bi quan: <code>SELECT … FOR UPDATE</code>, người khác chờ (5 và 0, xếp hàng). Lạc quan khi xung đột hiếm, bi quan cho dòng nóng.</li>
  <li><strong>"@Version hoạt động thế nào?"</strong> — Hibernate thêm <code>and version = ?</code> vào câu UPDATE và tăng nó; 0 dòng ⇒ <code>ObjectOptimisticLockingFailureException</code> ⇒ 409 trong REST API.</li>
  <li><strong>"Chống đặt trùng lịch thế nào?"</strong> — Xếp hàng trên một dòng chung (khoá phòng), hoặc ràng buộc loại trừ trên <code>(lab_id, tsrange)</code>, hoặc SERIALIZABLE + thử lại; và kiểm bằng request song song.</li>
  <li><strong>"Tránh deadlock thế nào?"</strong> — Khoá các dòng theo thứ tự nhất quán (id nhỏ trước), giữ giao dịch ngắn, dùng lock timeout; deadlock hiện ra là 40P01.</li>
  <li><strong>"SKIP LOCKED để làm gì?"</strong> — Hàng đợi việc: nhiều worker lấy các dòng khác nhau mà không phải chờ nhau.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Dùng <code>ChuyenService</code>, khởi động 20 luồng cùng lúc: 10 luồng chuyển 10 điểm từ ví 1 sang ví 2, 10 luồng chuyển 10 điểm từ ví 2 sang ví 1.</li>
  <li>Chạy với <code>theoThuTuId = false</code>, rồi làm cho nó an toàn.</li>
</ol>
<p><strong>Đạt khi:</strong> bản an toàn có 20 lệnh chuyển thành công, không deadlock, và hai ví vẫn cộng lại 1 000 (mỗi ví 500).</p></div>
${giai('Xem số đo', `${OUT75_TH}
<p>Khoá theo thứ tự id xoá mọi vòng tròn, nên không giao dịch nào bị chọn làm nạn nhân deadlock. Lượt chạy không an toàn cho thấy tải thật chạm vào vòng tròn thường tới mức nào — mỗi lần hỏng ở đó là một lệnh chuyển người dùng phải làm lại.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá lạc quan</span><span class="v">Phát hiện ghi xung đột bằng cột version; không giữ khoá trong lúc đọc.</span></div>
  <div class="kv"><span class="k">Khoá bi quan</span><span class="v">Khoá dòng ngay khi đọc (<code>FOR UPDATE</code>/<code>FOR NO KEY UPDATE</code>) để người khác phải chờ.</span></div>
  <div class="kv"><span class="k">@Version</span><span class="v">Thuộc tính version của JPA, được kiểm và tăng ở mỗi lần update.</span></div>
  <div class="kv"><span class="k">Deadlock</span><span class="v">Các giao dịch chờ nhau thành vòng tròn; PostgreSQL huỷ một bên (40P01).</span></div>
  <div class="kv"><span class="k">NOWAIT / SKIP LOCKED</span><span class="v">Hỏng ngay khi gặp dòng đang khoá / bỏ qua các dòng đang khoá.</span></div>
  <div class="kv"><span class="k">Ràng buộc loại trừ</span><span class="v">Ràng buộc PostgreSQL cấm các dòng "xung đột" theo các toán tử cho trước (ở đây <code>=</code> và <code>&amp;&amp;</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cuộc đua ví điểm: không khoá 10/400; UPDATE có điều kiện 5/0; bi quan 5/0; @Version 1 + 9 lỗi; @Version + thử lại 5/0 (35 lần thử lại).</li>
  <li>Khoá ngược thứ tự ⇒ deadlock 40P01 sau ~1,2 s; khoá id nhỏ trước ⇒ cả hai lệnh chuyển thành công.</li>
  <li>NOWAIT hỏng sau 7 ms (55P03); SKIP LOCKED cho hai worker các dòng không giao nhau.</li>
  <li>Lab 6 qua HTTP: 10, 5, 5 lượt cho một khung giờ. Khoá dòng phòng ⇒ 1. Ràng buộc loại trừ ⇒ 1, dù mã ngây thơ; bên thua thấy 23P01 hoặc 40P01.</li>
  <li>Lời giải Lab 7, hai bản ứng dụng, 10 request song song: 1 × 201 + 9 × 409, ba vòng.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.postgresql.org/docs/16/explicit-locking.html', '🐘', 'PostgreSQL 16 — Explicit Locking', 'Các kiểu khoá dòng (FOR UPDATE, FOR NO KEY UPDATE), deadlock.')}
${tl('https://www.postgresql.org/docs/16/ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION', '🐘', 'PostgreSQL 16 — Exclusion constraints', 'EXCLUDE USING gist với btree_gist.')}
${tl('https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#locking', '📘', 'Hibernate ORM 7 User Guide — Locking', '@Version, LockModeType, lock timeout.')}
${tl('https://portswigger.net/web-security/race-conditions', '🛡️', 'PortSwigger Web Security Academy — Race conditions', 'Kẻ tấn công kích hoạt chúng bằng request song song thế nào.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: C7App profile <code>e75</code> chạy Spring Boot 4.1.2, Spring Data JPA 4.1.2, Hibernate ORM 7.4.13.Final, HikariCP 7.0.2, PostgreSQL 16.15 (btree_gist), 20/11/2026; lời giải Lab 6 và Lab 7 qua HTTP bằng <code>ban10.sh</code>; Prisma 7.10.1 trên Node 22, script p75.ts.</li>
  <li>Egor Homakov, "Hacking Starbucks for unlimited coffee" (bài blog, 05/2015).</li>
  <li>James Kettle (PortSwigger Research), "Smashing the state machine: the true potential of web race conditions" (2023).</li>
</ul>
</div>
`;

// ===== Bài 7.6 =====
const MA76_SCHEMA = sql("create table bookings (\n  id bigint generated by default as identity primary key,\n  lab_id bigint not null references labs,\n  student_id bigint not null references students,\n  start_at timestamp not null,\n  end_at timestamp not null,\n  status varchar(20) not null default 'PENDING',\n  version int not null default 0\n);");
const MA76_CHAM = bash("# 3) như 2 nhưng chia đều HAI bản ứng dụng ⇒ khoá trong bộ nhớ JVM không đủ\nfor i in $(seq 1 20); do h=$H1; [ $((i % 2)) = 0 ] && h=$H2; goi b-$i $h POST /bookings \"$(B AI-03 SE1802$(printf %02d $i) 2030-02-03T08:00:00 2030-02-03T10:00:00)\" & done; wait\nn=$(q \"select count(*) from bookings where lab_id = 3 and start_at = '2030-02-03 08:00'\")\n[[ $(co b 201) == 1 && $(co b 409) == 19 && $n == 1 ]] && ok \"3 20 request chia HAI bản ⇒ 1×201 19×409, 1 dòng\" || ko \"3 20 request chia HAI bản ⇒ 1×201 19×409, 1 dòng\" \"nhận $(dem b)· $n dòng\"");
const OUT76_STARTER = out("PASS 1 tuần tự: 201 / 404 / 409\nFAIL 2 20 request song song, 1 bản ⇒ 1×201 19×409, 1 dòng — nhận 3×201 17×409 · 3 dòng\nPASS 3 20 request chia HAI bản ⇒ 1×201 19×409, 1 dòng\nFAIL 4 ba phòng cùng giờ ⇒ 3×201, mỗi phòng 1 dòng — nhận 5×201 1×409 · phòng/dòng = 3/5\nFAIL 5 hạn mức 2 lượt/ngày dưới tải ⇒ 2×201 3×409 — nhận 5×201 · 5 dòng\nFAIL 6 huỷ ⇒ khung giờ mở lại, 10 song song ⇒ 1×201 — huỷ 200, nhận 10×409 · 2 dòng còn hiệu lực\nFAIL 7 duyệt có version: 200, bản cũ 409, hai người cùng lúc 200+409 — nhận 404 404 [] 404 | 2×404 \nFAIL 8 48 phản hồi 409 đều là ProblemDetail, không lộ chi tiết nội bộ — 48/48 sai — mẫu: Content-Type: application/json\n{\"timestamp\":\"2026-11-20T00:32:30.434Z\",\"status\":409,\"error\":\"Conflict\",\"path\":\"/bookings\"}\nĐIỂM: 2/8");
const OUT76_GIAI = out("--- lời giải, lượt 1\nPASS 1 tuần tự: 201 / 404 / 409\nPASS 2 20 request song song, 1 bản ⇒ 1×201 19×409, 1 dòng\nPASS 3 20 request chia HAI bản ⇒ 1×201 19×409, 1 dòng\nPASS 4 ba phòng cùng giờ ⇒ 3×201, mỗi phòng 1 dòng\nPASS 5 hạn mức 2 lượt/ngày dưới tải ⇒ 2×201 3×409\nPASS 6 huỷ ⇒ khung giờ mở lại, 10 song song ⇒ 1×201\nPASS 7 duyệt có version: 200, bản cũ 409, hai người cùng lúc 200+409\nPASS 8 56 phản hồi 409 đều là ProblemDetail, không lộ chi tiết nội bộ\nĐIỂM: 8/8");
const OUT76_BAY = out("--- bẫy dongbo\nPASS 1 tuần tự: 201 / 404 / 409\nFAIL 2 20 request song song, 1 bản ⇒ 1×201 19×409, 1 dòng — nhận 7×201 13×409 · 7 dòng\nFAIL 3 20 request chia HAI bản ⇒ 1×201 19×409, 1 dòng — nhận 5×201 15×409 · 5 dòng\nFAIL 4 ba phòng cùng giờ ⇒ 3×201, mỗi phòng 1 dòng — nhận 6×201 · phòng/dòng = 3/6\nFAIL 5 hạn mức 2 lượt/ngày dưới tải ⇒ 2×201 3×409 — nhận 5×201 · 5 dòng\nFAIL 6 huỷ ⇒ khung giờ mở lại, 10 song song ⇒ 1×201 — huỷ 200, nhận 10×409 · 6 dòng còn hiệu lực\nPASS 7 duyệt có version: 200, bản cũ 409, hai người cùng lúc 200+409\nPASS 8 41 phản hồi 409 đều là ProblemDetail, không lộ chi tiết nội bộ\nĐIỂM: 3/8\n--- bẫy serial\nPASS 1 tuần tự: 201 / 404 / 409\nPASS 2 20 request song song, 1 bản ⇒ 1×201 19×409, 1 dòng\nPASS 3 20 request chia HAI bản ⇒ 1×201 19×409, 1 dòng\nFAIL 4 ba phòng cùng giờ ⇒ 3×201, mỗi phòng 1 dòng — nhận 1×201 5×409 · phòng/dòng = 1/1\nFAIL 5 hạn mức 2 lượt/ngày dưới tải ⇒ 2×201 3×409 — nhận 1×201 4×409 · 1 dòng\nPASS 6 huỷ ⇒ khung giờ mở lại, 10 song song ⇒ 1×201\nPASS 7 duyệt có version: 200, bản cũ 409, hai người cùng lúc 200+409\nPASS 8 59 phản hồi 409 đều là ProblemDetail, không lộ chi tiết nội bộ\nĐIỂM: 6/8");
const OUT76_409 = out("$ curl -si -X POST localhost:41891/bookings -H \"Content-Type: application/json\" -d '{\"labCode\":\"IOT-01\",\"studentCode\":\"SE180126\",\"startAt\":\"2030-01-15T09:00:00\",\"endAt\":\"2030-01-15T09:30:00\"}'\nHTTP/1.1 409 \nContent-Type: application/problem+json\n\n{\"detail\":\"trùng giờ với lượt đặt 1\",\"instance\":\"/bookings\",\"status\":409,\"title\":\"Conflict\"}");
const MA76_DAT = java("/** Thứ tự khoá CỐ ĐỊNH: phòng rồi sinh viên (không bao giờ ngược lại) ⇒ không deadlock. */\n@Transactional\npublic BookingView dat(BookingRequest r) {\n    Lab lab = labs.khoaTheoMa(r.labCode()).orElseThrow(() -> LoiNghiepVu.khongThay(\"lab \" + r.labCode()));\n    Student st = students.khoaTheoMa(r.studentCode()).orElseThrow(() -> LoiNghiepVu.khongThay(\"sinh viên \" + r.studentCode()));\n    bookings.trung(lab, r.startAt(), r.endAt(), Limit.of(1)).stream().findFirst().ifPresent(id -> { throw LoiNghiepVu.trung(id); });\n    LocalDate ngay = r.startAt().toLocalDate();\n    if (bookings.trongNgay(st, ngay.atStartOfDay(), ngay.plusDays(1).atStartOfDay()) >= 2) throw LoiNghiepVu.hanMuc(r.studentCode());\n    Booking b = bookings.save(new Booking(lab, st, r.startAt(), r.endAt()));\n    bookings.flush();\n    return bookings.view(b.getId());\n}");
const MA76_DUYET = java("/** Duyệt có kiểm version: bản cũ ⇒ 409; hai người duyệt cùng lúc ⇒ @Version chặn người thứ hai lúc flush. */\n@Transactional\npublic BookingView duyet(Long id, int version) {\n    Booking b = bookings.findById(id).orElseThrow(() -> LoiNghiepVu.khongThay(\"lượt đặt \" + id));\n    if (b.getVersion() != version) throw LoiNghiepVu.cu(version, b.getVersion());\n    b.approve();\n    bookings.flush();\n    return bookings.view(id);\n}");
const MA76_KHOA = java("/** SELECT … FOR NO KEY UPDATE trên dòng của phòng: mọi lượt đặt CÙNG phòng xếp hàng tại đây, ở mọi bản ứng dụng. */\n@Lock(LockModeType.PESSIMISTIC_WRITE)\n@Query(\"select l from Lab l where l.code = :code\")\nOptional<Lab> khoaTheoMa(String code);");
const MA76_NGAY = java("@Query(\"\"\"\n       select count(b) from Booking b where b.student = :st and b.status <> 'CANCELLED'\n       and b.startAt >= :from and b.startAt < :to\"\"\")\nlong trongNgay(@Param(\"st\") Student st, @Param(\"from\") LocalDateTime from, @Param(\"to\") LocalDateTime to);");
const MA76_LOI = java("/** Xung đột đồng thời ⇒ 409 dạng ProblemDetail; KHÔNG lộ tên ràng buộc, câu SQL hay tên lớp exception. */\n@RestControllerAdvice\nclass XuLyLoi {\n    @ExceptionHandler(ConcurrencyFailureException.class)   // gồm ObjectOptimisticLockingFailureException, CannotAcquireLockException\n    ProblemDetail xungDot(ConcurrencyFailureException e) {\n        ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, \"lượt đặt vừa bị người khác thay đổi, hãy tải lại rồi thử lại\");\n        p.setTitle(\"Xung đột\");\n        return p;\n    }\n}");

const L76_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.6</span>
<h2>Chapter 7 lab + interview questions</h2>
<p class="lead">Make LabFlow's booking API correct <strong>under concurrent load, on two running instances</strong>. You start from the reference solution of Lab 6 — which passes every sequential test and still booked one slot ten times in lesson 7.5. The grader fires up to 20 requests at the same instant, half of them at a second copy of your application, and checks the rows in PostgreSQL. The starter scores 2/8; the reference solution 8/8 three runs in a row; two tempting shortcuts score 3/8 and 6/8.</p>

<h3>The contract (new parts in bold)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Everything from Lab 6</span><span class="v">Same endpoints, same 201/404/409 behaviour, same schema plus one column.</span></div>
  <div class="kv"><span class="k">POST /bookings under load</span><span class="v"><strong>Any number of simultaneous requests for an overlapping slot of the same lab ⇒ exactly one 201, all others 409</strong> — also when they arrive at different instances.</span></div>
  <div class="kv"><span class="k">Different labs</span><span class="v"><strong>Requests for different labs must not block or reject each other.</strong></span></div>
  <div class="kv"><span class="k">Daily quota</span><span class="v"><strong>A student holds at most 2 non-cancelled bookings per calendar day</strong> (by <code>startAt</code>); the third ⇒ 409 — also when the requests are simultaneous.</span></div>
  <div class="kv"><span class="k">GET /bookings/{id}</span><span class="v"><strong>New.</strong> <code>{id, labCode, studentCode, startAt, endAt, status, version}</code>.</span></div>
  <div class="kv"><span class="k">PATCH /bookings/{id}/approve</span><span class="v"><strong>New.</strong> Body <code>{"version": n}</code>; n is the current version ⇒ 200, status <code>APPROVED</code>, version n+1; stale n ⇒ 409; two approvals with the same n at once ⇒ one 200, one 409.</span></div>
  <div class="kv"><span class="k">Errors</span><span class="v"><strong>Every 409 is <code>application/problem+json</code> and reveals no SQL, constraint name or exception class.</strong></span></div>
  <div class="kv"><span class="k">Rules of the game</span><span class="v">The schema is fixed (<code>ddl-auto=validate</code>, no migration of your own); you may change only Java code and <code>application.properties</code>.</span></div>
</div>

<h3>Setup</h3>
${MA76_SCHEMA}
${bash(`bash lab/c7/run.sh net                                   # PostgreSQL sb-c7-pg, cổng 41890 + 41891
bash lab/c7/lab7/chay.sh $PWD/lab/c7/lab7/starter        # nạp schema, build, chạy HAI bản Lab7App
bash lab/c7/lab7/cham.sh                                 # 8 mục`)}
${OUT76_STARTER}
<p>Without the course scripts: run PostgreSQL 16, load <code>schema.sql</code>, start your application twice (<code>--server.port=8080</code> and <code>--server.port=8081</code>, same database) and point <code>H1</code>/<code>H2</code> at the top of <code>cham.sh</code> to them. One check, to show how the grader works — 20 requests at once, split across the two instances, then a look at the table:</p>
${MA76_CHAM}

<h3>The eight checks, and which lesson each one comes from</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · sequential</span><span class="v">201 / 404 / 409, as in Lab 6.</span></div>
  <div class="kv"><span class="k">2 · 20 at once, one instance</span><span class="v">Exactly 1 × 201, 19 × 409, one row (7.4 write skew, 7.5 fix 1).</span></div>
  <div class="kv"><span class="k">3 · 20 at once, two instances</span><span class="v">Same — an in-memory Java lock cannot see the other JVM (7.5).</span></div>
  <div class="kv"><span class="k">4 · three labs, same time</span><span class="v">3 × 201, one row per lab: your lock must be per lab, not global.</span></div>
  <div class="kv"><span class="k">5 · quota under load</span><span class="v">One student, 5 simultaneous requests on 5 different lab/time pairs of one day ⇒ 2 × 201, 3 × 409.</span></div>
  <div class="kv"><span class="k">6 · cancel then race</span><span class="v">Cancel the winner of check 2; 10 simultaneous requests for the freed slot ⇒ exactly one new booking.</span></div>
  <div class="kv"><span class="k">7 · optimistic approval</span><span class="v">Correct version ⇒ 200 and version + 1; stale ⇒ 409; two parallel approvals ⇒ 200 + 409 (7.5 <code>@Version</code>).</span></div>
  <div class="kv"><span class="k">8 · error format</span><span class="v">All 409s from checks 1–7 are ProblemDetail with no internals (Chapter 5, hacker corner of 7.5).</span></div>
</div>
<p>A race test can pass by luck. In an earlier run of the same starter, check 3 failed with <strong>8 rows</strong>; in the run above it happened to pass. Always run the grader three times.</p>

<h3>Done when</h3>
<div class="callout ok"><p><code>cham.sh</code> prints <strong>8/8 three times in a row</strong> (rerun <code>chay.sh</code> before each), and you can explain in one sentence per check what stops two requests at the same time.</p></div>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">8 points</span><span class="v">One per grader check, only if it passes three runs in a row.</span></div>
  <div class="kv"><span class="k">1 point</span><span class="v">Lock order is fixed and written down (comment or README): which rows, in which order, and why it cannot deadlock.</span></div>
  <div class="kv"><span class="k">1 point</span><span class="v">Transactions live in the service; no entity in request/response bodies; no network call or <code>Thread.sleep</code> inside a transaction.</span></div>
</div>

<h3>Traps we hit while testing the lab</h3>
${OUT76_BAY}
<ul>
  <li><strong><code>synchronized</code> on <code>dat()</code> — 3/8, and it fails even on one instance.</strong> The method is <code>@Transactional</code>, so the proxy opens the transaction <em>before</em> entering the synchronized method and commits <em>after</em> leaving it. The next thread enters as soon as the monitor is free, while the previous insert is not committed yet — at READ COMMITTED it cannot see it: 7 rows for one slot. On two instances it is worse by construction. A JVM lock is never a database lock.</li>
  <li><strong><code>Isolation.SERIALIZABLE</code> on <code>dat()</code>, no row locks — 6/8.</strong> Correct for checks 2, 3, 6 (losers get 40001, mapped to 409 by the handler), but wrong for 4 and 5: three different labs at the same time ⇒ only one 201. The overlap query scans the small <code>bookings</code> table sequentially, and PostgreSQL's SSI then tracks the whole table, so unrelated bookings conflict too; without retries every such false conflict becomes a 409. SERIALIZABLE needs a retry loop — and an index — to be fair.</li>
</ul>

${giai('Show the reference solution', `<p><strong>1. Lock the lab, then the student — always in that order</strong> (no cycle ⇒ no deadlock), check overlap and quota, insert:</p>
${MA76_DAT}
${MA76_KHOA}
${MA76_NGAY}
<p><code>StudentRepository.khoaTheoMa</code> is the same <code>@Lock(PESSIMISTIC_WRITE)</code> query on <code>Student</code>. Locking the student row makes the quota check sequential per student; locking the lab row makes the overlap check sequential per lab. Other labs and other students run in parallel.</p>
<p><strong>2. Optimistic approval</strong>: <code>@Version private int version;</code> on <code>Booking</code>, <code>version</code> added to <code>BookingView</code>, and:</p>
${MA76_DUYET}
<p><strong>3. Errors</strong>: <code>spring.mvc.problemdetails.enabled=true</code> turns every <code>ResponseStatusException</code> into a ProblemDetail, and one handler covers the concurrency exceptions (the second of two simultaneous approvals fails at flush):</p>
${MA76_LOI}
${OUT76_409}
<p>Result, three runs:</p>
${OUT76_GIAI}
<p>(Runs 2 and 3 were identical.) An exclusion constraint (lesson 7.5, fix 2) would be the belt-and-braces version; it needs a migration, which is Chapter 8.</p>`)}

<h3>Stretch (optional)</h3>
<ul>
  <li>Replace the row locks with <code>SERIALIZABLE</code> + a retry loop of at most 5 attempts outside the transaction, and add an index on <code>bookings(lab_id, start_at)</code>. Does check 4 pass now? Measure how many retries the grader causes.</li>
  <li>Fire 200 requests instead of 20 (change the loops in <code>cham.sh</code>) and compare the time of the lock-based solution with the SERIALIZABLE one.</li>
  <li>Add <code>ETag</code>/<code>If-Match</code> to <code>GET</code>/<code>PATCH</code> instead of a <code>version</code> field in the body; answer 412 on mismatch.</li>
</ul>

<h3>🎤 Chapter 7 — what the interviewer will ask</h3>
<ol>
  <li><strong>"Your page is slow, the database CPU is low. What do you check first?"</strong> — N+1: SQL log or Hibernate Statistics; 116 statements for 100 rows in 7.1, fixed with a fetch join, an entity graph or a DTO projection.</li>
  <li><strong>"Why disable open-in-view?"</strong> — It keeps a connection per request for the whole request and hides lazy loading; 20 slow requests broke a 5-connection pool (10 × 500) in 7.2.</li>
  <li><strong>"When do you use REQUIRES_NEW, and what can go wrong?"</strong> — Audit/security logs that must survive a rollback; it needs a second connection, so concurrent requests can deadlock a small pool.</li>
  <li><strong>"Which isolation level prevents double booking?"</strong> — In PostgreSQL only SERIALIZABLE detects that write skew (RR let 2 bookings through); in practice a lock on a shared row or an exclusion constraint is simpler, with a test that fires parallel requests.</li>
  <li><strong>"Optimistic or pessimistic?"</strong> — Optimistic (<code>@Version</code>, 409) when conflicts are rare and users can retry; pessimistic (<code>FOR UPDATE</code>) or a conditional update for hot rows; always a fixed lock order.</li>
  <li><strong>"Why is <code>synchronized</code> not enough?"</strong> — It is per JVM, and with <code>@Transactional</code> the lock is released before the commit — 7 rows on a single instance in this lab.</li>
</ol>

<h3>Sources</h3>
<ul>
  <li>Outputs above: Lab7App (starter, reference solution, two traps) on Spring Boot 4.1.2, Hibernate ORM 7.4.13.Final, PostgreSQL 16.15, two instances on ports 8080/8081; grader <code>lab/c7/lab7/cham.sh</code> (20/11/2026).</li>
</ul>
</div>
`;

const L76_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.6</span>
<h2>Lab chương 7 + câu hỏi phỏng vấn</h2>
<p class="lead">Làm cho API đặt phòng của LabFlow đúng <strong>dưới tải đồng thời, trên hai bản ứng dụng đang chạy</strong>. Bạn bắt đầu từ lời giải mẫu của Lab 6 — qua mọi phép thử tuần tự mà vẫn đặt một khung giờ mười lần ở bài 7.5. Bộ chấm bắn tới 20 request đúng cùng một lúc, một nửa vào bản thứ hai của ứng dụng, rồi kiểm các dòng trong PostgreSQL. Bản khởi đầu được 2/8; lời giải mẫu 8/8 ba lượt liền; hai lối tắt hấp dẫn được 3/8 và 6/8.</p>

<h3>Hợp đồng (phần mới in đậm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi thứ của Lab 6</span><span class="v">Cùng các endpoint, cùng hành vi 201/404/409, cùng schema thêm một cột.</span></div>
  <div class="kv"><span class="k">POST /bookings dưới tải</span><span class="v"><strong>Bao nhiêu request đồng thời cho một khung giờ chồng nhau của cùng một phòng ⇒ đúng một 201, còn lại 409</strong> — kể cả khi chúng tới các bản ứng dụng khác nhau.</span></div>
  <div class="kv"><span class="k">Phòng khác nhau</span><span class="v"><strong>Request cho các phòng khác nhau không được chặn hay từ chối lẫn nhau.</strong></span></div>
  <div class="kv"><span class="k">Hạn mức theo ngày</span><span class="v"><strong>Mỗi sinh viên giữ tối đa 2 lượt chưa huỷ trong một ngày lịch</strong> (theo <code>startAt</code>); lượt thứ ba ⇒ 409 — kể cả khi các request đến cùng lúc.</span></div>
  <div class="kv"><span class="k">GET /bookings/{id}</span><span class="v"><strong>Mới.</strong> <code>{id, labCode, studentCode, startAt, endAt, status, version}</code>.</span></div>
  <div class="kv"><span class="k">PATCH /bookings/{id}/approve</span><span class="v"><strong>Mới.</strong> Thân <code>{"version": n}</code>; n là version hiện tại ⇒ 200, trạng thái <code>APPROVED</code>, version n+1; n cũ ⇒ 409; hai lần duyệt cùng n cùng lúc ⇒ một 200, một 409.</span></div>
  <div class="kv"><span class="k">Lỗi</span><span class="v"><strong>Mọi 409 là <code>application/problem+json</code> và không lộ SQL, tên ràng buộc hay tên lớp exception.</strong></span></div>
  <div class="kv"><span class="k">Luật chơi</span><span class="v">Schema cố định (<code>ddl-auto=validate</code>, không tự viết migration); bạn chỉ được sửa mã Java và <code>application.properties</code>.</span></div>
</div>

<h3>Chuẩn bị</h3>
${MA76_SCHEMA}
${bash(`bash lab/c7/run.sh net                                   # PostgreSQL sb-c7-pg, cổng 41890 + 41891
bash lab/c7/lab7/chay.sh $PWD/lab/c7/lab7/starter        # nạp schema, build, chạy HAI bản Lab7App
bash lab/c7/lab7/cham.sh                                 # 8 mục`)}
${OUT76_STARTER}
<p>Không dùng script của khoá: chạy PostgreSQL 16, nạp <code>schema.sql</code>, khởi động ứng dụng hai lần (<code>--server.port=8080</code> và <code>--server.port=8081</code>, cùng CSDL) rồi trỏ <code>H1</code>/<code>H2</code> ở đầu <code>cham.sh</code> vào đó. Một mục, để thấy bộ chấm làm việc thế nào — 20 request cùng lúc, chia cho hai bản, rồi nhìn vào bảng:</p>
${MA76_CHAM}

<h3>Tám mục chấm, và mỗi mục đến từ bài nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · tuần tự</span><span class="v">201 / 404 / 409, như Lab 6.</span></div>
  <div class="kv"><span class="k">2 · 20 cùng lúc, một bản</span><span class="v">Đúng 1 × 201, 19 × 409, một dòng (7.4 write skew, 7.5 cách sửa 1).</span></div>
  <div class="kv"><span class="k">3 · 20 cùng lúc, hai bản</span><span class="v">Như trên — khoá Java trong bộ nhớ không nhìn thấy JVM kia (7.5).</span></div>
  <div class="kv"><span class="k">4 · ba phòng, cùng giờ</span><span class="v">3 × 201, mỗi phòng một dòng: khoá của bạn phải theo từng phòng, không phải khoá toàn cục.</span></div>
  <div class="kv"><span class="k">5 · hạn mức dưới tải</span><span class="v">Một sinh viên, 5 request đồng thời cho 5 cặp phòng/giờ khác nhau trong một ngày ⇒ 2 × 201, 3 × 409.</span></div>
  <div class="kv"><span class="k">6 · huỷ rồi đua</span><span class="v">Huỷ lượt thắng của mục 2; 10 request đồng thời cho khung giờ vừa trống ⇒ đúng một lượt mới.</span></div>
  <div class="kv"><span class="k">7 · duyệt lạc quan</span><span class="v">Đúng version ⇒ 200 và version + 1; version cũ ⇒ 409; hai lần duyệt song song ⇒ 200 + 409 (<code>@Version</code> của 7.5).</span></div>
  <div class="kv"><span class="k">8 · dạng lỗi</span><span class="v">Mọi 409 từ mục 1–7 là ProblemDetail, không lộ chi tiết nội bộ (Chương 5, góc hacker 7.5).</span></div>
</div>
<p>Một phép thử cuộc đua có thể qua nhờ may. Ở một lượt chạy trước của cùng bản khởi đầu, mục 3 hỏng với <strong>8 dòng</strong>; ở lượt in phía trên nó tình cờ qua. Luôn chạy bộ chấm ba lần.</p>

<h3>Đạt khi</h3>
<div class="callout ok"><p><code>cham.sh</code> in <strong>8/8 ba lượt liền</strong> (chạy lại <code>chay.sh</code> trước mỗi lượt), và với mỗi mục bạn giải thích được trong một câu điều gì chặn hai request đến cùng lúc.</p></div>

<h3>Thang điểm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">8 điểm</span><span class="v">Mỗi mục của bộ chấm một điểm, chỉ khi qua ba lượt liền.</span></div>
  <div class="kv"><span class="k">1 điểm</span><span class="v">Thứ tự khoá cố định và được ghi ra (chú thích hoặc README): khoá dòng nào, theo thứ tự nào, vì sao không thể deadlock.</span></div>
  <div class="kv"><span class="k">1 điểm</span><span class="v">Giao dịch nằm ở service; không entity nào trong thân request/response; không gọi mạng hay <code>Thread.sleep</code> trong giao dịch.</span></div>
</div>

<h3>Bẫy ta gặp khi thử lab</h3>
${OUT76_BAY}
<ul>
  <li><strong><code>synchronized</code> trên <code>dat()</code> — 3/8, và hỏng ngay cả với một bản.</strong> Phương thức có <code>@Transactional</code>, nên proxy mở giao dịch <em>trước</em> khi vào phương thức synchronized và commit <em>sau</em> khi rời nó. Luồng kế tiếp vào ngay khi monitor rảnh, lúc câu insert trước chưa commit — ở READ COMMITTED nó không thấy được: 7 dòng cho một khung giờ. Với hai bản thì đương nhiên tệ hơn. Khoá của JVM không bao giờ là khoá của CSDL.</li>
  <li><strong><code>Isolation.SERIALIZABLE</code> trên <code>dat()</code>, không khoá dòng — 6/8.</strong> Đúng ở mục 2, 3, 6 (bên thua nhận 40001, được handler ánh xạ thành 409), nhưng sai ở 4 và 5: ba phòng khác nhau cùng giờ ⇒ chỉ một 201. Câu kiểm trùng quét tuần tự bảng <code>bookings</code> nhỏ, nên SSI của PostgreSQL theo dõi cả bảng, và các lượt đặt chẳng liên quan cũng xung đột; không thử lại thì mỗi xung đột giả thành một 409. SERIALIZABLE cần vòng thử lại — và một index — mới công bằng.</li>
</ul>

${giai('Xem lời giải mẫu', `<p><strong>1. Khoá phòng, rồi khoá sinh viên — luôn theo thứ tự đó</strong> (không có vòng tròn ⇒ không deadlock), kiểm trùng và hạn mức, rồi chèn:</p>
${MA76_DAT}
${MA76_KHOA}
${MA76_NGAY}
<p><code>StudentRepository.khoaTheoMa</code> là cùng câu <code>@Lock(PESSIMISTIC_WRITE)</code> trên <code>Student</code>. Khoá dòng sinh viên khiến phép kiểm hạn mức chạy tuần tự theo từng sinh viên; khoá dòng phòng khiến phép kiểm trùng chạy tuần tự theo từng phòng. Phòng khác và sinh viên khác vẫn chạy song song.</p>
<p><strong>2. Duyệt lạc quan</strong>: <code>@Version private int version;</code> trên <code>Booking</code>, thêm <code>version</code> vào <code>BookingView</code>, và:</p>
${MA76_DUYET}
<p><strong>3. Lỗi</strong>: <code>spring.mvc.problemdetails.enabled=true</code> biến mọi <code>ResponseStatusException</code> thành ProblemDetail, và một handler lo các exception đồng thời (lần duyệt thứ hai trong hai lần cùng lúc hỏng lúc flush):</p>
${MA76_LOI}
${OUT76_409}
<p>Kết quả, ba lượt:</p>
${OUT76_GIAI}
<p>(Lượt 2 và 3 giống hệt.) Ràng buộc loại trừ (bài 7.5, cách sửa 2) là phiên bản "thắt lưng thêm dây đeo quần"; nó cần một migration, tức là Chương 8.</p>`)}

<h3>Nâng cao (không bắt buộc)</h3>
<ul>
  <li>Thay khoá dòng bằng <code>SERIALIZABLE</code> + vòng thử lại tối đa 5 lần bên ngoài giao dịch, và thêm index trên <code>bookings(lab_id, start_at)</code>. Giờ mục 4 có qua không? Đo xem bộ chấm gây ra bao nhiêu lần thử lại.</li>
  <li>Bắn 200 request thay vì 20 (sửa các vòng lặp trong <code>cham.sh</code>) rồi so thời gian của lời giải dùng khoá với lời giải SERIALIZABLE.</li>
  <li>Thêm <code>ETag</code>/<code>If-Match</code> cho <code>GET</code>/<code>PATCH</code> thay cho trường <code>version</code> trong thân; lệch thì trả 412.</li>
</ul>

<h3>🎤 Chương 7 — phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Trang chậm mà CPU CSDL thấp. Bạn kiểm gì trước?"</strong> — N+1: log SQL hoặc Hibernate Statistics; 116 câu cho 100 dòng ở 7.1, sửa bằng fetch join, entity graph hoặc DTO projection.</li>
  <li><strong>"Vì sao tắt open-in-view?"</strong> — Nó giữ một kết nối cho mỗi request suốt cả request và che lazy loading; 20 request chậm đã làm hỏng pool 5 kết nối (10 × 500) ở 7.2.</li>
  <li><strong>"Khi nào dùng REQUIRES_NEW, và có thể hỏng gì?"</strong> — Nhật ký kiểm toán/bảo mật phải sống qua rollback; nó cần kết nối thứ hai, nên request đồng thời có thể khoá chết một pool nhỏ.</li>
  <li><strong>"Mức cô lập nào chặn được đặt trùng lịch?"</strong> — Ở PostgreSQL chỉ SERIALIZABLE phát hiện được write skew đó (RR để lọt 2 lượt); thực tế khoá một dòng chung hoặc ràng buộc loại trừ đơn giản hơn, kèm test bắn request song song.</li>
  <li><strong>"Lạc quan hay bi quan?"</strong> — Lạc quan (<code>@Version</code>, 409) khi xung đột hiếm và người dùng thử lại được; bi quan (<code>FOR UPDATE</code>) hoặc cập nhật có điều kiện cho dòng nóng; luôn khoá theo thứ tự cố định.</li>
  <li><strong>"Vì sao <code>synchronized</code> không đủ?"</strong> — Nó chỉ trong một JVM, và với <code>@Transactional</code> khoá được nhả trước khi commit — 7 dòng ngay trên một bản trong lab này.</li>
</ol>

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: Lab7App (bản khởi đầu, lời giải mẫu, hai bẫy) chạy Spring Boot 4.1.2, Hibernate ORM 7.4.13.Final, PostgreSQL 16.15, hai bản ở cổng 8080/8081; bộ chấm <code>lab/c7/lab7/cham.sh</code> (20/11/2026).</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ7 = [
  Q('100 bookings, lab and student LAZY, the code touches both on every row; the 100 rows use 15 different labs and 100 different students. How many statements did Hibernate send?|||100 lượt đặt, lab và student đều LAZY, mã chạm cả hai ở mỗi dòng; 100 dòng dùng 15 phòng khác nhau và 100 sinh viên khác nhau. Hibernate gửi bao nhiêu câu?', [
    '201 — one per relation per row|||201 — mỗi quan hệ mỗi dòng một câu',
    '116 — the first-level cache returns a lab already loaded|||116 — cache cấp 1 trả lại phòng đã nạp',
    '3 — Hibernate batches lazy loads by default|||3 — Hibernate mặc định gom các lần nạp lazy',
    '1 — LAZY relations are joined automatically|||1 — quan hệ LAZY tự được join',
  ], 1),
  Q('Which way of loading a read-only list put 0 entities into the persistence context?|||Cách nạp danh sách chỉ đọc nào đưa 0 entity vào persistence context?', [
    'JOIN FETCH|||JOIN FETCH',
    '@EntityGraph|||@EntityGraph',
    'default_batch_fetch_size = 16|||default_batch_fetch_size = 16',
    'A DTO projection with select new …|||DTO projection với select new …',
  ], 3),
  Q('A derived query on an entity whose @ManyToOne relations keep the JPA default fetch type, and the code never touches them. What happens?|||Một truy vấn suy từ tên trên entity có các @ManyToOne giữ fetch type mặc định của JPA, và mã không bao giờ chạm chúng. Chuyện gì xảy ra?', [
    'One SELECT with left joins|||Một SELECT có left join',
    'Nothing extra: they are loaded only when touched|||Không gì thêm: chỉ nạp khi bị chạm',
    'Extra SELECTs for every distinct parent, immediately|||Thêm SELECT cho mỗi phía cha khác nhau, ngay lập tức',
    'LazyInitializationException|||LazyInitializationException',
  ], 2),
  Q('With Spring Boot\'s default open-in-view, 20 requests that each spend 1 s after the service returns hit a 5-connection pool with a 2 s timeout. What did we measure?|||Với open-in-view mặc định của Spring Boot, 20 request mỗi cái mất 1 s sau khi service trả về, chạy trên pool 5 kết nối, chờ tối đa 2 s. Ta đo được gì?', [
    '20 × 200 in about 1 s|||20 × 200 trong khoảng 1 s',
    '10 × 200 and 10 × 500 — connections were held for the whole request|||10 × 200 và 10 × 500 — kết nối bị giữ suốt cả request',
    '20 × 500 at once|||20 × 500 ngay lập tức',
    '5 × 200, then the server stopped|||5 × 200, rồi server dừng',
  ], 1),
  Q('The booking method (REQUIRED) calls an audit method with REQUIRES_NEW, then throws a RuntimeException. What remains in the database?|||Phương thức đặt chỗ (REQUIRED) gọi phương thức ghi nhật ký REQUIRES_NEW, rồi ném RuntimeException. Còn gì trong CSDL?', [
    'Both rows|||Cả hai dòng',
    'Nothing|||Không còn gì',
    'Only the booking|||Chỉ lượt đặt',
    'Only the audit row — it was committed on a second connection|||Chỉ dòng nhật ký — nó đã commit trên kết nối thứ hai',
  ], 3),
  Q('An outer @Transactional method catches an exception thrown by an inner REQUIRED @Transactional method and returns normally. Result?|||Phương thức @Transactional ngoài bắt exception do một phương thức @Transactional REQUIRED bên trong ném ra rồi trả về bình thường. Kết quả?', [
    'Commit of everything done so far|||Commit mọi thứ đã làm',
    'UnexpectedRollbackException: the shared transaction was marked rollback-only|||UnexpectedRollbackException: giao dịch chung đã bị đánh dấu rollback-only',
    'Only the inner work is rolled back, via a savepoint|||Chỉ phần bên trong bị rollback, qua savepoint',
    'The inner exception is rethrown at commit|||Exception bên trong bị ném lại lúc commit',
  ], 1),
  Q('Session B runs at READ UNCOMMITTED on PostgreSQL while A has updated 500 → 0 without committing. What does B read?|||Phiên B chạy READ UNCOMMITTED trên PostgreSQL trong khi A đã cập nhật 500 → 0 mà chưa commit. B đọc được gì?', [
    '0 — that is what READ UNCOMMITTED allows|||0 — READ UNCOMMITTED cho phép như vậy',
    'An error 40001|||Lỗi 40001',
    '500 — PostgreSQL treats READ UNCOMMITTED as READ COMMITTED|||500 — PostgreSQL coi READ UNCOMMITTED là READ COMMITTED',
    'B waits until A commits or rolls back|||B chờ tới khi A commit hoặc rollback',
  ], 2),
  Q('Two transactions both check "no overlapping booking", both see 0 and both insert a booking for the same slot. Which is the lowest PostgreSQL level that rejected one of them?|||Hai giao dịch cùng kiểm "không có lượt chồng giờ", cùng thấy 0 và cùng chèn một lượt cho cùng khung giờ. Mức thấp nhất của PostgreSQL đã từ chối một bên là mức nào?', [
    'READ COMMITTED|||READ COMMITTED',
    'REPEATABLE READ|||REPEATABLE READ',
    'SERIALIZABLE|||SERIALIZABLE',
    'None — isolation cannot see rows that do not exist yet|||Không mức nào — cô lập không thấy được dòng chưa tồn tại',
  ], 2),
  Q('Ten threads withdraw 100 points from a 500-point wallet mapped with @Version, without any retry. What did we measure?|||Mười luồng trừ 100 điểm từ ví 500 điểm có @Version, không thử lại. Ta đo được gì?', [
    '5 successes, wallet 0|||5 thành công, ví 0',
    '10 successes, wallet 400|||10 thành công, ví 400',
    '1 success and 9 ObjectOptimisticLockingFailureException, wallet 400|||1 thành công và 9 ObjectOptimisticLockingFailureException, ví 400',
    'A deadlock (40P01)|||Một deadlock (40P01)',
  ], 2),
  Q('Why did a synchronized @Transactional booking method still create 7 bookings for one slot on a single instance?|||Vì sao phương thức đặt chỗ @Transactional có synchronized vẫn tạo 7 lượt cho một khung giờ ngay trên một bản ứng dụng?', [
    'synchronized does not work on Spring beans|||synchronized không chạy trên bean Spring',
    'The proxy commits after the monitor is released, so the next thread checks before the previous insert is visible|||Proxy commit sau khi monitor đã nhả, nên luồng sau kiểm trước khi câu insert trước được nhìn thấy',
    'Virtual threads ignore synchronized|||Virtual thread bỏ qua synchronized',
    'HikariCP gives each thread its own database|||HikariCP cấp cho mỗi luồng một CSDL riêng',
  ], 1),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `7.${n} — ${en}|||7.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 7 — JPA in depth: performance and concurrency|||Chương 7 — JPA chuyên sâu: hiệu năng và đồng thời',
  description: 'N+1 đếm bằng Hibernate Statistics (116 câu ⇒ 1), EAGER không phải JOIN, open-in-view làm cạn pool, propagation REQUIRED/REQUIRES_NEW/NESTED trong log PostgreSQL, mọi hiện tượng cô lập tái hiện thật, khoá lạc quan/bi quan, deadlock, ràng buộc EXCLUDE — đóng cuộc đua ví điểm 6.5 và cuộc đua đặt phòng của Lab 6; Lab 7 chấm dưới tải trên hai bản ứng dụng.',
  lessons: [
    L(1, 'sb-7-1-n-cong-1', 'The N+1 problem: detect and fix', 'Vấn đề N+1: phát hiện và sửa',
      'Đếm câu SQL thật bằng Hibernate Statistics: 100 dòng ⇒ 116 câu (cache cấp 1 làm N = số phía cha khác nhau), join fetch / @EntityGraph ⇒ 1, DTO ⇒ 1 câu 0 entity, batch fetch 16 ⇒ 9, phân trang khi fetch collection (Hibernate 7.4 dùng truy vấn con), MultipleBagFetchException, cỡ trang không chặn = vũ khí (OWASP API4), Prisma 201 vs 3 truy vấn.',
      L71_EN + L71_VI),
    L(2, 'sb-7-2-lazy-eager', 'Lazy vs eager, LazyInitializationException and open-in-view', 'Lazy vs eager, LazyInitializationException và open-in-view',
      'EAGER trên @ManyToOne gửi 36 câu dù không chạm quan hệ, proxy LAZY ngoài giao dịch (getId được, getName nổ), open-in-view mặc định che exception và giữ kết nối suốt request: 20 request chậm trên pool 5 ⇒ 10 × 500; tắt ⇒ 20 × 200 trong 1,10 s; Slowloris 2009; Prisma không lazy.',
      L72_EN + L72_VI),
    L(3, 'sb-7-3-propagation', 'Transaction propagation', 'Lan truyền giao dịch (propagation)',
      'REQUIRES_NEW giữ nhật ký trên kết nối thứ hai khi giao dịch chính rollback, REQUIRED chết cùng nơi gọi, UnexpectedRollbackException khi bắt lỗi bên trong, NESTED không chạy với JpaTransactionManager nhưng chạy với JDBC (SAVEPOINT), MANDATORY, REQUIRES_NEW khoá chết pool 2 kết nối; Equifax 2017 (A09).',
      L73_EN + L73_VI),
    L(4, 'sb-7-4-isolation', 'Isolation levels in PostgreSQL', 'Mức cô lập trong PostgreSQL',
      'Hai phiên JDBC xen kẽ từng câu: không có dirty read, non-repeatable read và phantom ở RC nhưng không ở RR, lost update (RR báo 40001), write skew đặt trùng lịch (RR cho 2, SERIALIZABLE còn 1); cuộc đua ví ở SERIALIZABLE: không thử lại 1 thành công, có thử lại 5/0 với 35 lần thử; ACIDRain 2017; Prisma P2034.',
      L74_EN + L74_VI),
    L(5, 'sb-7-5-khoa-lac-quan', 'Optimistic and pessimistic locking', 'Khoá lạc quan và bi quan',
      'Đóng cuộc đua ví 6.5: không khoá 10/400, UPDATE có điều kiện 5/0, FOR NO KEY UPDATE 5/0, @Version 1 + 9 lỗi, @Version + thử lại 5/0; deadlock 40P01 và khoá theo thứ tự id; NOWAIT, SKIP LOCKED; Lab 6 qua HTTP đặt trùng 10/5/5 lượt ⇒ khoá dòng phòng hoặc ràng buộc EXCLUDE ⇒ 1; Starbucks 2015.',
      L75_EN + L75_VI),
    L(6, 'sb-7-6-lab-7', 'Chapter 7 lab + interview questions', 'Lab chương 7 + câu hỏi phỏng vấn',
      'Chống đặt trùng lịch dưới tải trên HAI bản ứng dụng: bộ chấm 8 mục bắn tới 20 request cùng lúc (khởi đầu 2/8, lời giải 8/8 ×3), hạn mức 2 lượt/ngày, duyệt có version, 409 dạng ProblemDetail; hai bẫy: synchronized 3/8 (khoá nhả trước commit), SERIALIZABLE 6/8 (xung đột giả); thang 10 điểm, câu phỏng vấn chương 7.',
      L76_EN + L76_VI),
    {
      title: '7.7 — Chapter 7 quiz|||7.7 — Kiểm tra chương 7',
      slug: 'sb-7-7-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về số câu SQL của N+1, DTO projection, EAGER, open-in-view, REQUIRES_NEW, UnexpectedRollbackException, READ UNCOMMITTED ở PostgreSQL, write skew, @Version không thử lại và synchronized với @Transactional.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is a number or a log line you saw in this chapter — 116 statements, 10 × 500, a ROLLBACK on connection 126, a second booking at REPEATABLE READ. If you miss one, rerun that lesson's demo and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là một con số hay một dòng log bạn đã thấy trong chương — 116 câu, 10 × 500, một ROLLBACK trên kết nối 126, lượt đặt thứ hai ở REPEATABLE READ. Sai câu nào thì chạy lại demo của bài đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ7 },
    },
  ],
};
