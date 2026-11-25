/**
 * spring-boot/s13-redis-cache.mjs — Chương 13: Cache với Redis (soạn 24/11/2026, agent sb).
 * Mọi output là chạy thật trên máy nhà: LabFlow (Spring Boot 4.1.2, Spring Data Redis 4.1.2, Lettuce 7.5.2) + Redis 7 (alpine) + PostgreSQL 16,
 * hai instance cùng Redis, bảng su_dung 2 triệu dòng cho truy vấn "đắt".
 * Mã: scratchpad/sb/lab/c13/{labflow (bản c13: CacheCauHinh, GioiHan, module demo13 profile c13), labflow-v2 (LabInfo thêm building), t (lệnh đo), lab13 (lời giải + bộ chấm)}.
 * Output: ~/.rtq-sb/ch13/o (bản hiển thị ở o/web, lọc bằng lab/c13/web-out.sh). Hằng MA.. / OUT.. sinh bằng tam/s13/build.sh + gen-ma.mjs.
 */
import { java, bash, sql, xml, yml, props, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 13.1 =====
const MA131_POM = xml("<!-- cache: Redis (Chương 17.4; đi sâu ở Chương 13) -->\n<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-cache</artifactId></dependency>\n<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-redis</artifactId></dependency>");
const MA131_TK = java("/** Một truy vấn đắt (quét 2 triệu dòng) — đo trước/sau khi cache. */\n@Service\n@Profile(\"c13\")\npublic class ThongKeService {\n    private static final Logger log = LoggerFactory.getLogger(ThongKeService.class);\n    private final AtomicInteger dem = new AtomicInteger();   // số lần truy vấn THẬT chạy xuống CSDL\n    // đọc qua PHƯƠNG THỨC: bean này là proxy CGLIB, đọc field của proxy ra null (đã dính, xem 13.1)\n    public int soLan() { return dem.get(); }\n    public void datLai() { dem.set(0); }\n    private final JdbcTemplate db;\n    ThongKeService(JdbcTemplate db) { this.db = db; }\n\n    ThongKe tinh(String code) {\n        int lan = dem.incrementAndGet();\n        log.info(\"TÍNH thống kê {} — truy vấn thật lần {}\", code, lan);\n        return db.queryForObject(\"select count(*), coalesce(sum(phut),0), coalesce(avg(phut),0) from su_dung where lab_code = ?\",\n                (r, i) -> new ThongKe(code, r.getLong(1), r.getLong(2), Math.round(r.getDouble(3) * 10) / 10.0, Instant.now()), code);\n    }\n\n    @Cacheable(cacheNames = \"thongKe\", key = \"#code\")\n    public ThongKe theoPhong(String code) { return tinh(code); }\n\n    /** BẪY: gọi theoPhong qua \"this\" ⇒ không đi qua proxy ⇒ không có cache. */\n    public List<ThongKe> baoCao(List<String> codes) { return codes.stream().map(this::theoPhong).toList(); }\n\n    /** sync = true: nhiều luồng cùng hỏi một khoá đang trống ⇒ một luồng tính, các luồng khác CHỜ kết quả. */\n    @Cacheable(cacheNames = \"thongKeSync\", key = \"#code\", sync = true)\n    public ThongKe theoPhongSync(String code) { return tinh(code); }\n\n    @CacheEvict(cacheNames = \"thongKe\", key = \"#code\")\n    public void quen(String code) { }\n\n    @CachePut(cacheNames = \"thongKe\", key = \"#code\")\n    public ThongKe tinhLai(String code) { return tinh(code); }\n}");
const MA131_BC = java("/** Cách sửa bẫy tự gọi: gọi sang một bean KHÁC ⇒ đi qua proxy ⇒ có cache. */\n@Service\n@Profile(\"c13\")\nclass BaoCaoService {\n    private final ThongKeService thongKe;\n    BaoCaoService(ThongKeService t) { thongKe = t; }\n\n    List<ThongKe> baoCao(List<String> codes) { return codes.stream().map(thongKe::theoPhong).toList(); }\n}");
const MA131_TRUNG = java("/** BẪY: dùng lại tên cache \"lab\" của module catalog cho một kiểu giá trị khác, cùng khoá #code. */\n@Service\n@Profile(\"c13\")\nclass TrungTenCache {\n    private final JdbcTemplate db;\n    TrungTenCache(JdbcTemplate db) { this.db = db; }\n\n    @Cacheable(cacheNames = \"lab\", key = \"#code\")\n    public Integer soCho(String code) { return db.queryForObject(\"select capacity from labs where code = ?\", Integer.class, code); }\n}");
const MA131_LICH = java("/** Dữ liệu RIÊNG của từng người dùng trong cache: sai một chữ ở khoá là lộ lịch của người khác. */\n@Service\n@Profile(\"c13\")\nclass LichService {\n    private final JdbcTemplate db;\n    LichService(JdbcTemplate db) { this.db = db; }\n\n    private List<String> doc(long uid, int size) {\n        return db.queryForList(\"\"\"\n                select b.id || ' ' || b.start_at || ' ' || b.purpose from bookings b\n                where b.owner_id = ? order by b.start_at limit ?\"\"\", String.class, uid, size);\n    }\n\n    /** SAI: người dùng lấy từ SecurityContext BÊN TRONG phương thức, khoá cache chỉ có size. */\n    @Cacheable(cacheNames = \"lichSai\", key = \"#size\")\n    public List<String> sai(int size) {\n        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();\n        return doc(((Number) jwt.getClaim(\"uid\")).longValue(), size);\n    }\n\n    /** ĐÚNG: người dùng là THAM SỐ ⇒ nằm trong khoá (SimpleKey [uid, size]). */\n    @Cacheable(cacheNames = \"lichDung\")\n    public List<String> dung(long uid, int size) { return doc(uid, size); }\n}");
const MA131_CAT = java("@Service\n@Transactional(readOnly = true)\nclass LabCatalogImpl implements LabCatalog {\n    private final LabRepository labs;\n    LabCatalogImpl(LabRepository labs) { this.labs = labs; }\n\n    // Spring bóc Optional: thứ nằm trong Redis là LabInfo. Mã không tồn tại thì KHÔNG cache (chống làm đầy cache bằng mã rác)\n    @Cacheable(cacheNames = \"lab\", key = \"#code\", unless = \"#result == null\")\n    public Optional<LabInfo> timTheoMa(String code) { return labs.findByCode(code).map(Lab::info); }\n\n    public Map<Long, LabInfo> theoIds(Collection<Long> ids) {\n        return labs.findAllById(ids).stream().map(Lab::info).collect(Collectors.toMap(LabInfo::id, x -> x));\n    }\n}");
const MA131_HAM = bash("# ham.sh — hàm nhỏ cho các tệp lệnh Chương 13 (nguồn bởi t/chay.sh). Bí mật chỉ qua biến môi trường.\nR=~/vbg-dp/scratchpad/sb/lab/c13/run.sh\nJ='Content-Type: application/json'\ndk() { curl -s -o /dev/null -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"fullName\\\":\\\"$2\\\",\\\"password\\\":\\\"$MAT_KHAU_SV\\\"}\" $API/api/v1/auth/register; }\ntok() { curl -s -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"password\\\":\\\"${2:-$MAT_KHAU_SV}\\\"}\" $API/api/v1/auth/login | jq -r .accessToken; }\n# lan <số lần> <url>: gọi tuần tự, in thời gian từng lần (ms)\nlan() { local n=$1 u=$2 s=\"\"; for i in $(seq $n); do s=\"$s $(curl -s -o /dev/null -w '%{time_total}' \"$u\" | awk '{printf \"%.1f\", $1*1000}')\"; done; echo \"thời gian (ms):$s\"; }\n# dong <số request> <url> [phương thức] [header…]: gọi CÙNG LÚC, đếm mã trạng thái + tổng thời gian\ndong() { local n=$1 u=$2 m=${3:-GET}; shift $(( $# < 3 ? $# : 3 )); local t0=$(date +%s%N)\n  seq $n | xargs -P $n -I{} curl -s --max-time 60 -o /dev/null -w '%{http_code}\\n' -X $m \"$@\" \"$u\" | sort | uniq -c | awk '{printf \"%s×%s  \", $1, $2}'\n  echo \"· tổng $(( ($(date +%s%N) - t0) / 1000000 )) ms\"; }\ndem() { curl -s $API/api/v1/demo13/dem | jq -c .; }\nxoadem() { curl -s -X POST $API/api/v1/demo13/dem/xoa; }");
const OUT131A = out("## A. KHÔNG cache (spring.cache.type=none): mỗi request là một lần quét 2 triệu dòng\n$ lan 5 $API/api/v1/demo13/thong-ke/IOT-01\nthời gian (ms): 244.1 74.6 68.4 76.7 76.8\n\n$ dem\n{\"truyVanThongKe\":5,\"cauSqlHibernate\":1}\n\n## B. cache trong bộ nhớ JVM (spring.cache.type=simple) — CÙNG mã, chỉ đổi một dòng cấu hình\n$ lan 5 $API/api/v1/demo13/thong-ke/IOT-01\nthời gian (ms): 219.4 12.0 11.5 6.3 6.8\n\n$ dem\n{\"truyVanThongKe\":1,\"cauSqlHibernate\":1}\n\n$ redis-cli dbsize\n1\n\n## C. cache trong Redis (mặc định của LabFlow) — vẫn CÙNG mã\n$ lan 5 $API/api/v1/demo13/thong-ke/IOT-01\nthời gian (ms): 595.3 27.8 8.0 12.2 7.2\n\n$ dem\n{\"truyVanThongKe\":1,\"cauSqlHibernate\":1}\n\n$ redis-cli keys '*'\nlabflow::thongKe::IOT-01\n\n$ redis-cli ttl labflow::thongKe::IOT-01\n30\n\n## log: chỉ MỘT dòng \"TÍNH\" cho 5 request\n$ docker logs labflow | grep -o 'TÍNH.*'\nTÍNH thống kê IOT-01 — truy vấn thật lần 1");
const OUT131_NPE = out("$ curl -s $API/api/v1/demo13/dem      # bản đầu: controller đọc thẳng field thongKe.dem\n{\"status\":500,\"code\":\"INTERNAL\", …}\n$ docker logs labflow | grep NullPointer\njava.lang.NullPointerException: Cannot invoke \"java.util.concurrent.atomic.AtomicInteger.get()\" because \"this.thongKe.dem\" is null");
const OUT131B_TUGOI = out("## 1 BẪY TỰ GỌI: baoCao() gọi this.theoPhong() ⇒ không qua proxy ⇒ gọi hai lần vẫn tính lại cả ba phòng\n$ xoadem\n\n$ curl -s \"$API/api/v1/demo13/bao-cao-tu-goi?codes=IOT-01,NET-02,AI-03\" | jq -c '[.[].code]'; dem\n[\"IOT-01\",\"NET-02\",\"AI-03\"]\n{\"truyVanThat\":3}\n\n$ curl -s \"$API/api/v1/demo13/bao-cao-tu-goi?codes=IOT-01,NET-02,AI-03\" | jq -c '[.[].code]'; dem\n[\"IOT-01\",\"NET-02\",\"AI-03\"]\n{\"truyVanThat\":6}\n\n$ redis-cli keys 'labflow::thongKe::*'\n\n## 2 SỬA: gọi qua một bean KHÁC (BaoCaoService) ⇒ lần hai không tính gì\n$ xoadem\n\n$ curl -s \"$API/api/v1/demo13/bao-cao?codes=IOT-01,NET-02,AI-03\" | jq -c '[.[].code]'; dem\n[\"IOT-01\",\"NET-02\",\"AI-03\"]\n{\"truyVanThat\":3}\n\n$ curl -s \"$API/api/v1/demo13/bao-cao?codes=IOT-01,NET-02,AI-03\" | jq -c '[.[].code]'; dem\n[\"IOT-01\",\"NET-02\",\"AI-03\"]\n{\"truyVanThat\":3}\n\n$ redis-cli keys 'labflow::thongKe::*'\nlabflow::thongKe::NET-02\nlabflow::thongKe::IOT-01\nlabflow::thongKe::AI-03");
const OUT131B_EVICT = out("## 3 @CacheEvict xoá một khoá, @CachePut luôn chạy rồi GHI ĐÈ khoá\n$ curl -s $API/api/v1/demo13/thong-ke/HW-04 | jq -r .tinhLuc\n2026-11-24T12:24:06.166194100Z\n\n$ curl -s $API/api/v1/demo13/thong-ke/HW-04 | jq -r .tinhLuc\n2026-11-24T12:24:06.166194100Z\n\n$ curl -s -X DELETE -o /dev/null -w '%{http_code}\\n' $API/api/v1/demo13/thong-ke/HW-04\n200\n\n$ curl -s $API/api/v1/demo13/thong-ke/HW-04 | jq -r .tinhLuc\n2026-11-24T12:24:06.297361277Z\n\n$ curl -s -X PUT $API/api/v1/demo13/thong-ke/HW-04 | jq -r .tinhLuc\n2026-11-24T12:24:06.378751783Z\n\n$ curl -s $API/api/v1/demo13/thong-ke/HW-04 | jq -r .tinhLuc\n2026-11-24T12:24:06.378751783Z\n\n$ dem\n{\"truyVanThat\":6}");
const OUT131B_TRUNG = out("## 4 HAI phương thức dùng chung tên cache \"lab\" và cùng khoá #code, khác kiểu giá trị\n$ curl -s $API/api/v1/demo13/so-cho/NET-02; echo\n{\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\",\"instance\":\"/api/v1/demo13/so-cho/NET-02\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.vn/errors/internal\",\"code\":\"INTERNAL\"}\n\n$ redis-cli get labflow::lab::NET-02\n{\"@class\":\"vn.labflow.catalog.LabInfo\",\"id\":2,\"code\":\"NET-02\",\"name\":\"Lab Mạng\",\"capacity\":30,\"status\":\"ACTIVE\",\"requiresApproval\":false}\n\n$ curl -s $API/api/v1/labs/NET-02 | jq -c '{status,code,detail}'\n{\"status\":\"ACTIVE\",\"code\":\"NET-02\",\"detail\":null}\n\n$ docker logs labflow | grep -m1 -o 'java.lang.ClassCastException.*'\njava.lang.ClassCastException: class vn.labflow.catalog.LabInfo cannot be cast to class java.lang.Integer (vn.labflow.catalog.LabInfo is in unnamed module of loader 'app'; java.lang.Integer is in module java.base of loader 'bootstrap')");
const OUT131C_TRUNG = out("## 4b chiều ngược lại: khoá HW-04 còn trống, so-cho ghi Integer vào cache \"lab\" trước\n$ redis-cli exists labflow::lab::HW-04\n0\n\n$ curl -s $API/api/v1/demo13/so-cho/HW-04; echo\n20\n\n$ redis-cli get labflow::lab::HW-04\n20\n\n$ curl -s $API/api/v1/labs/HW-04 | jq -c '{status,code,detail}'\n{\"status\":500,\"code\":\"INTERNAL\",\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\"}\n\n$ docker logs labflow | grep -o 'java.lang.ClassCastException.*' | tail -1\njava.lang.ClassCastException: class java.lang.Integer cannot be cast to class vn.labflow.catalog.LabInfo (java.lang.Integer is in module java.base of loader 'bootstrap'; vn.labflow.catalog.LabInfo is in unnamed module of loader 'app')");
const OUT131B_LICH = out("## 5 dữ liệu RIÊNG từng người, khoá thiếu người dùng: An hỏi trước, Bình hỏi sau\n$ curl -s -H \"Authorization: Bearer $AN\" \"$API/api/v1/demo13u/lich-sai?size=3\" | jq -c .\n[\"1 2026-11-26 09:00:00 Do an IoT nhom 3\"]\n\n$ curl -s -H \"Authorization: Bearer $BINH\" \"$API/api/v1/demo13u/lich-sai?size=3\" | jq -c .\n[\"1 2026-11-26 09:00:00 Do an IoT nhom 3\"]\n\n$ redis-cli keys 'labflow::lich*'\nlabflow::lichSai::3\n\n## 6 SỬA: người dùng là tham số ⇒ nằm trong khoá\n$ curl -s -H \"Authorization: Bearer $AN\" \"$API/api/v1/demo13u/lich-dung?size=3\" | jq -c .\n[\"1 2026-11-26 09:00:00 Do an IoT nhom 3\"]\n\n$ curl -s -H \"Authorization: Bearer $BINH\" \"$API/api/v1/demo13u/lich-dung?size=3\" | jq -c .\n[\"2 2026-11-27 13:00:00 Phong van thuc tap\"]\n\n$ redis-cli keys 'labflow::lichDung*'\nlabflow::lichDung::SimpleKey [3, 3]\nlabflow::lichDung::SimpleKey [2, 3]");
const OUT131C_RAC = out("## 7 mã KHÔNG tồn tại: 300 mã ngẫu nhiên vào endpoint thống kê (không có \"unless\") — mỗi mã một lần quét CSDL + một khoá rác\n$ xoadem\n\n$ redis-cli dbsize\n11\n\n$ for i in $(seq 300); do curl -s -o /dev/null $API/api/v1/demo13/thong-ke/X$RANDOM$i; done; dem\n{\"truyVanThat\":300}\n\n$ redis-cli dbsize\n307\n\n$ redis-cli info memory | grep -m1 used_memory_human\nused_memory_human:1.45M\r\n\n## 8 cùng việc đó với GET /api/v1/labs/{code} — có unless = \"#result == null\"\n$ for i in $(seq 300); do curl -s -o /dev/null $API/api/v1/labs/X$RANDOM$i; done; curl -s $API/api/v1/labs/KHONG-01 | jq -c '{status,code}'\n{\"status\":404,\"code\":\"NOT_FOUND\"}\n\n$ redis-cli dbsize\n307\n\n$ redis-cli keys 'labflow::lab::*'\nlabflow::lab::IOT-01\nlabflow::lab::NET-02");

const L131_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1 · Caching with Redis</span>
<h2>Spring Cache abstraction</h2>
<p class="lead">A statistics query in LabFlow scans two million rows of room usage every time someone opens the dashboard. Spring can remember the answer with one annotation — and that one annotation hides a proxy, a key, a cache name and a storage engine, each of which can quietly go wrong. In this lesson we measure the same method with no cache, an in-memory cache and Redis, then walk into five traps that really happened while writing it: a call that never reaches the cache, a field that reads <code>null</code> through a proxy, two methods fighting over one cache name, a cache filled with garbage keys, and a cache that shows one student another student's bookings.</p>

<h3>Everyday picture first</h3>
<p>The librarian at the FPT library gets asked "how many times was Lab IoT used this year?" twenty times a day. The first time, she goes to the archive and counts — ten minutes. Then she writes the answer on a sticky note on her desk. The next nineteen people get the answer in two seconds. The sticky note is a cache. Everything that can go wrong with caches is already in this picture: the note can be out of date, she can write the answer on the wrong note, she can keep one note for "this year" when two different people meant two different years, and if she puts a note for every silly question anyone asks, her desk fills up with junk.</p>

<h3>1. What @Cacheable actually does</h3>
<p>Spring does not change your method. When a bean has <code>@Cacheable</code> on a public method, Spring wraps the bean in a <strong>proxy</strong> (Chapter 3). Every call from <em>another bean</em> goes through the proxy, which:</p>
<ol>
  <li>computes a <strong>key</strong> from the arguments (by default: no argument ⇒ <code>SimpleKey.EMPTY</code>, one argument ⇒ the argument itself, several ⇒ <code>SimpleKey [a, b]</code>; or the SpEL you write in <code>key</code>);</li>
  <li>asks the cache named in <code>cacheNames</code> for that key;</li>
  <li>on a <strong>hit</strong>, returns the stored value and <em>does not call your method at all</em>;</li>
  <li>on a <strong>miss</strong>, calls your method, stores the result (unless <code>unless</code> says otherwise), then returns it.</li>
</ol>
<p>This is the <strong>cache-aside</strong> pattern, written for you. Where the values live is decided by a <code>CacheManager</code>: <code>ConcurrentMapCacheManager</code> (a map inside this JVM), <code>RedisCacheManager</code>, Caffeine… Your code only knows the abstraction, so changing storage is one line of configuration. Two dependencies bring it all:</p>
${MA131_POM}

<h3>2. Measure first: none, memory, Redis</h3>
<p>The expensive method, used for every experiment in this chapter (profile <code>c13</code> only; the table <code>su_dung</code> has two million rows and no index, on purpose):</p>
${MA131_TK}
<p>Small helpers so every command below fits on one line — <code>lan</code> calls an URL n times in a row and prints each time, <code>dong</code> fires n requests at the same moment:</p>
${MA131_HAM}
<p>The same code, started three times with a different <code>spring.cache.type</code>:</p>
${OUT131A}
<p>What the numbers say (the machine was busy rendering video at the time, so read the shape, not the decimals):</p>
<ul>
  <li><strong>No cache</strong>: five real queries, 70–80 ms each after the first. The first request of a fresh JVM is always slow (class loading, JIT, connection warm-up) — never benchmark one request.</li>
  <li><strong>In-memory</strong>: one real query, then 6–12 ms — mostly HTTP and JSON, not the cache.</li>
  <li><strong>Redis</strong>: one real query, then 7–28 ms: one network round trip plus JSON decoding. Slightly slower than a map in the JVM, but shared by every instance and surviving restarts (lesson 13.2).</li>
  <li>The log has exactly one "TÍNH" line for five requests: on a hit, your method body does not run. Anything you put in it — logging, auditing, a permission check — is skipped too.</li>
</ul>

<h3>3. Trap one: calling yourself</h3>
<p>Look again at <code>baoCao()</code> in <code>ThongKeService</code>: it calls <code>this.theoPhong(code)</code>. "this" is the real object, not the proxy, so the annotation is never consulted:</p>
${OUT131B_TUGOI}
<p>Three real queries the first time, three more the second time, and <em>no key at all</em> in Redis. The fix is to call through another bean, which receives the proxy:</p>
${MA131_BC}
<p>Other fixes exist (inject the bean into itself with <code>@Lazy</code>, or switch to AspectJ weaving with <code>@EnableCaching(mode = ASPECTJ)</code>), but a second bean is the clearest. This is the same rule as <code>@Transactional</code> in Chapter 7: <strong>annotations that work through proxies only apply to calls that come from outside the bean.</strong></p>
<p>The proxy bit us a second time while writing this lesson. The first version of the demo controller read the counter as a field, <code>thongKe.dem.get()</code>. <code>ThongKeService</code> has no interface, so Spring creates a CGLIB <em>subclass</em> proxy; the proxy object is a separate instance whose own fields were never initialised:</p>
${OUT131_NPE}
<p>Through a method (<code>thongKe.soLan()</code>) the call is forwarded to the real object and works. Rule: never read fields of another bean directly — use methods.</p>

<h3>4. @CacheEvict, @CachePut, condition and unless</h3>
<ul>
  <li><code>@CacheEvict(cacheNames = "thongKe", key = "#code")</code> removes one key; <code>allEntries = true</code> empties the whole cache (in Redis: a key scan and delete — expensive on a big cache).</li>
  <li><code>@CachePut</code> <em>always</em> runs the method and overwrites the key with the result. Use it when you have the new value in hand; do not put it on the same method as <code>@Cacheable</code>.</li>
  <li><code>condition</code> is checked <em>before</em> the call (arguments only); <code>unless</code> is checked <em>after</em> and can use <code>#result</code>.</li>
</ul>
${OUT131B_EVICT}
<p>Read the timestamps: the second GET returns the same <code>tinhLuc</code> (cached); after DELETE the next GET computes again; PUT computes and stores, and the following GET returns exactly the PUT result. The counter rose from 3 to 6 — three real queries for six calls.</p>

<h3>5. Trap two: two methods, one cache name</h3>
<p>Someone adds a small helper that returns the capacity of a room and, to "reuse the existing cache", names it <code>"lab"</code> with the same key:</p>
${MA131_TRUNG}
${OUT131B_TRUNG}
${OUT131C_TRUNG}
<p>Both directions fail. If <code>LabInfo</code> was cached first, the helper gets a <code>LabInfo</code> where it expects an <code>Integer</code>. If the helper ran first, the public endpoint <code>GET /api/v1/labs/HW-04</code> — used by every student — returns 500 for the next ten minutes. Nothing failed at compile time: the cache stores <code>Object</code>. Rule: <strong>one cache name, one value type</strong>; name caches after what they hold (<code>lab</code>, <code>labCapacity</code>), and in a modular monolith treat a cache name as owned by one module.</p>

<h3>6. Trap three: caching "not found"</h3>
<p>A method that returns an empty result for a code that does not exist will happily cache that empty result. If the codes come from the URL, anyone can create keys:</p>
${OUT131C_RAC}
<p>300 random codes on the statistics endpoint: 300 full-table scans and roughly 300 new keys (Redis went from 11 to 307 keys; a few old ones expired in between). The same 300 requests against <code>GET /api/v1/labs/{code}</code> created nothing, because the catalog method says so:</p>
${MA131_CAT}
<p>With an <code>Optional</code> return type Spring caches the <em>content</em>, so <code>#result</code> is the <code>LabInfo</code> or <code>null</code>. Negative caching (remembering "not found" for a short time) is sometimes useful against repeated misses, but then give it a short TTL and validate the input first — 300 here could be 3 million from a script, and the Redis of Chapter 17 has <code>maxmemory 64mb</code> with <code>allkeys-lru</code>, which means junk keys evict your useful ones.</p>

<h3>🕵️ Hacker corner — Steam, Christmas Day 2015</h3>
<p>On 25 December 2015, during a denial-of-service attack that multiplied traffic about 2,000%, Valve changed a caching configuration to keep the Steam Store up. For about 90 minutes, pages that contain personal data were served from cache to the wrong people: around 34,000 users saw other users' account pages, libraries and purchase details. Valve took the store offline to fix it. The core mistake — a cached response for personal data without the user in the key — fits in one line of Spring:</p>
${MA131_LICH}
${OUT131B_LICH}
<p>An asked first; Bình then received An's booking ("Do an IoT nhom 3") because the key was only <code>3</code>. With the user id as a parameter the keys become <code>SimpleKey [3, 3]</code> and <code>SimpleKey [2, 3]</code> and each person gets their own list. Prevention: (1) do not cache per-user data unless you measured a need; (2) if you do, the user id is a <em>method parameter</em> and part of the key — never read the <code>SecurityContext</code> inside a cached method; (3) a test that logs in as two users and compares the answers (Chapter 11's IDOR tests catch exactly this).</p>

<h3>Compared with Node.js</h3>
<p>Express has no annotation; you write cache-aside by hand: <code>const hit = await redis.get(key); if (hit) return JSON.parse(hit); const v = await db.query(…); await redis.set(key, JSON.stringify(v), { EX: 600 });</code>. There is no proxy, so the self-call trap does not exist — but forgetting the user in the key is identical. NestJS's <code>CacheInterceptor</code> is closer to Spring: by default it caches <code>GET</code> responses keyed by the request URL, so putting it on <code>/bookings/mine</code> reproduces the Steam bug unless you override <code>trackBy</code>. Interview tip: "Spring's version is declarative and proxy-based; Node's is explicit code. Both need the same key discipline."</p>

<h3>At work</h3>
<p>In LabFlow, cache what is read often, changes rarely and is the same for everyone: the lab catalog, building lists, expensive reports with a short TTL. Do <strong>not</strong> cache free/busy slots (a stale "free" leads to a 409 at best), permissions, or anything the booking rules decide on — those read from the database, which has the exclusion constraint. Before adding a cache, have a number: p95 of the endpoint and how many queries it runs (Chapter 16). After adding it, have another number: hit ratio (lesson 13.3).</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does @Cacheable work?"</strong> — A proxy around the bean computes a key from the arguments, returns the cached value on a hit without calling the method, otherwise calls it and stores the result. The storage is a pluggable CacheManager.</li>
  <li><strong>"My @Cacheable does nothing. Why?"</strong> — Self-invocation (called via <code>this</code>), a non-public method, a bean not managed by Spring, or <code>@EnableCaching</code> missing. Same causes as <code>@Transactional</code>.</li>
  <li><strong>"What is the default key?"</strong> — <code>SimpleKey.EMPTY</code>, the single argument, or <code>SimpleKey</code> of all arguments. So a parameter that does not influence the result still splits the cache, and one that does but is read from somewhere else (like the current user) is missing.</li>
  <li><strong>"Difference between @CachePut and @CacheEvict?"</strong> — Put always runs and writes the new value; Evict removes the key so the next read reloads. Evict is simpler and safer when you do not have the exact value that a read would produce.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a method <code>@Cacheable("thongKe") ThongKe theoPhongVaNam(String code, int nam)</code>. Call it with <code>("IOT-01", 2025)</code> then <code>("IOT-01", 2026)</code>. What are the two Redis keys?</li>
  <li>Put <code>@Cacheable(cacheNames = "thongKe", key = "#code", condition = "#code.length() == 6")</code> on <code>theoPhong</code> and call it with <code>X1</code> twice. How many real queries, how many keys?</li>
  <li>Why would <code>@Cacheable</code> on a <code>private</code> method of the controller not work, even when the controller calls it?</li>
</ol></div>
${giai('Show the answers', `<p>1. <code>labflow::thongKe::SimpleKey [IOT-01, 2025]</code> and <code>labflow::thongKe::SimpleKey [IOT-01, 2026]</code> — two parameters ⇒ a <code>SimpleKey</code> of both, printed with its <code>toString()</code>.</p><p>2. Two real queries and no key: <code>condition</code> is false before the call, so the cache is neither read nor written. Compare <code>unless</code>, which still reads the cache.</p><p>3. The proxy can only intercept public calls that come from outside; a private method is called directly on the object inside the controller (self-invocation), and CGLIB cannot override private methods anyway.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Cache-aside</strong> — read the cache, on a miss read the source and store the result; the application manages the cache.</li>
  <li><strong>Hit / miss</strong> — the key was / was not in the cache.</li>
  <li><strong>CacheManager</strong> — the Spring object that creates and finds caches by name (simple map, Redis, Caffeine…).</li>
  <li><strong>SimpleKey</strong> — the default key when a method has zero or several arguments.</li>
  <li><strong>Self-invocation</strong> — a call through <code>this</code>, which bypasses the proxy and its annotations.</li>
  <li><strong>Negative caching</strong> — remembering "not found"; useful only with a short TTL and validated input.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Measured: 70–80 ms per uncached call, one real query for five calls with a cache; on a hit the method body does not run.</li>
  <li>Caching works through a proxy: self-calls skip it, and fields read through a CGLIB proxy are <code>null</code>.</li>
  <li>One cache name holds one value type; sharing a name caused a <code>ClassCastException</code> on a public endpoint.</li>
  <li>Do not cache "not found" for input from the URL: 300 requests, 300 junk keys and 300 full scans. Use <code>unless = "#result == null"</code>.</li>
  <li>Per-user data needs the user in the key, as a parameter — otherwise you rebuild the Steam incident.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/integration/cache.html', '📘', 'Spring Framework — Cache Abstraction', 'keys, SpEL, condition/unless, sync, proxy vs AspectJ')}
${tl('https://docs.spring.io/spring-boot/reference/io/caching.html', '🍃', 'Spring Boot — Caching', 'which providers Boot detects, spring.cache.* properties')}

<h3>Sources</h3>
<ul>
  <li>Steam store caching incident, 25/12/2015 — Valve statement of 29–30/12/2015 as reported by <a href="https://www.pcgamer.com/valve-apologizes-for-steams-troubled-christmas/" target="_blank" rel="noopener">PC Gamer</a> and <a href="https://www.securityweek.com/details-34000-steam-users-exposed-during-ddos-attack/" target="_blank" rel="noopener">SecurityWeek</a>.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Spring Data Redis 4.1.2) + Redis 7 + PostgreSQL 16 on the course machine, 24/11/2026.</li>
</ul>
</div>
`;

const L131_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1 · Cache với Redis</span>
<h2>Lớp trừu tượng Spring Cache</h2>
<p class="lead">Một truy vấn thống kê của LabFlow quét hai triệu dòng lịch sử sử dụng phòng mỗi lần có người mở trang tổng quan. Spring nhớ được câu trả lời chỉ bằng một chú thích — và chú thích đó giấu bên dưới một proxy, một khoá, một tên cache và một nơi lưu, chỗ nào cũng có thể sai mà không báo. Bài này đo cùng một phương thức khi không cache, cache trong bộ nhớ và cache trong Redis, rồi đi qua năm cái bẫy đã thật sự dính khi soạn bài: một lời gọi không bao giờ tới cache, một field đọc qua proxy ra <code>null</code>, hai phương thức tranh nhau một tên cache, một cache đầy khoá rác, và một cache cho sinh viên này xem lịch của sinh viên khác.</p>

<h3>Đời thường trước đã</h3>
<p>Cô thủ thư ở thư viện FPT bị hỏi "năm nay Lab IoT được dùng bao nhiêu lần?" hai mươi lần một ngày. Lần đầu cô xuống kho đếm sổ — mười phút. Rồi cô ghi đáp án lên tờ giấy nhớ dán ở bàn. Mười chín người sau có câu trả lời trong hai giây. Tờ giấy nhớ chính là cache. Mọi thứ có thể hỏng với cache đã nằm sẵn trong hình ảnh này: giấy nhớ có thể cũ, cô có thể ghi nhầm vào tờ khác, cô có thể dùng một tờ "năm nay" cho hai người hỏi hai năm khác nhau, và nếu câu hỏi vớ vẩn nào cũng được dán một tờ thì bàn sẽ ngập rác.</p>

<h3>1. @Cacheable thật ra làm gì</h3>
<p>Spring không sửa phương thức của bạn. Khi một bean có <code>@Cacheable</code> trên phương thức public, Spring bọc bean đó trong một <strong>proxy</strong> (Chương 3). Mọi lời gọi từ <em>bean khác</em> đi qua proxy, và proxy sẽ:</p>
<ol>
  <li>tính <strong>khoá</strong> từ tham số (mặc định: không tham số ⇒ <code>SimpleKey.EMPTY</code>, một tham số ⇒ chính tham số đó, nhiều tham số ⇒ <code>SimpleKey [a, b]</code>; hoặc biểu thức SpEL bạn viết ở <code>key</code>);</li>
  <li>hỏi cache có tên trong <code>cacheNames</code> xem có khoá đó không;</li>
  <li>nếu <strong>trúng</strong> (hit): trả giá trị đã lưu và <em>không gọi phương thức của bạn</em>;</li>
  <li>nếu <strong>trượt</strong> (miss): gọi phương thức, lưu kết quả (trừ khi <code>unless</code> nói không), rồi trả về.</li>
</ol>
<p>Đó là mẫu <strong>cache-aside</strong>, được viết sẵn cho bạn. Giá trị nằm ở đâu do một <code>CacheManager</code> quyết định: <code>ConcurrentMapCacheManager</code> (một map trong JVM này), <code>RedisCacheManager</code>, Caffeine… Mã của bạn chỉ biết lớp trừu tượng, nên đổi nơi lưu chỉ là một dòng cấu hình. Hai dependency mang tất cả vào dự án:</p>
${MA131_POM}

<h3>2. Đo trước đã: không cache, bộ nhớ, Redis</h3>
<p>Phương thức "đắt" dùng cho mọi thí nghiệm của chương (chỉ có ở profile <code>c13</code>; bảng <code>su_dung</code> có hai triệu dòng và cố ý không có chỉ mục):</p>
${MA131_TK}
<p>Vài hàm nhỏ để mỗi lệnh bên dưới gọn một dòng — <code>lan</code> gọi một URL n lần liên tiếp và in thời gian từng lần, <code>dong</code> bắn n request cùng một lúc:</p>
${MA131_HAM}
<p>Cùng một mã, khởi động ba lần với <code>spring.cache.type</code> khác nhau:</p>
${OUT131A}
<p>Các con số nói gì (lúc đo máy đang bận dựng video, nên hãy đọc hình dạng, đừng đọc số lẻ):</p>
<ul>
  <li><strong>Không cache</strong>: năm truy vấn thật, mỗi lần 70–80 ms sau lần đầu. Request đầu tiên của một JVM mới luôn chậm (nạp lớp, JIT, làm nóng kết nối) — đừng bao giờ đo một request.</li>
  <li><strong>Bộ nhớ</strong>: một truy vấn thật, sau đó 6–12 ms — phần lớn là HTTP và JSON, không phải cache.</li>
  <li><strong>Redis</strong>: một truy vấn thật, sau đó 7–28 ms: một vòng mạng cộng giải mã JSON. Chậm hơn map trong JVM một chút, nhưng mọi instance dùng chung và không mất khi khởi động lại (bài 13.2).</li>
  <li>Log chỉ có đúng một dòng "TÍNH" cho năm request: khi trúng cache, thân phương thức không chạy. Thứ gì bạn đặt trong đó — log, ghi vết, kiểm quyền — cũng bị bỏ qua.</li>
</ul>

<h3>3. Bẫy một: tự gọi chính mình</h3>
<p>Nhìn lại <code>baoCao()</code> trong <code>ThongKeService</code>: nó gọi <code>this.theoPhong(code)</code>. "this" là đối tượng thật, không phải proxy, nên chú thích không bao giờ được hỏi tới:</p>
${OUT131B_TUGOI}
<p>Lần đầu ba truy vấn thật, lần hai thêm ba nữa, và Redis <em>không có khoá nào</em>. Cách sửa là gọi qua một bean khác — bean đó nhận được proxy:</p>
${MA131_BC}
<p>Còn cách khác (tự tiêm chính bean vào nó với <code>@Lazy</code>, hoặc chuyển sang AspectJ với <code>@EnableCaching(mode = ASPECTJ)</code>), nhưng tách bean là rõ ràng nhất. Đây cùng là luật của <code>@Transactional</code> ở Chương 7: <strong>chú thích chạy qua proxy chỉ có tác dụng với lời gọi từ bên ngoài bean.</strong></p>
<p>Proxy còn cắn thêm một lần nữa khi soạn bài. Bản đầu của controller demo đọc bộ đếm như một field: <code>thongKe.dem.get()</code>. <code>ThongKeService</code> không có interface nên Spring tạo proxy CGLIB là một <em>lớp con</em>; đối tượng proxy là một instance riêng, field của nó chưa bao giờ được gán:</p>
${OUT131_NPE}
<p>Gọi qua phương thức (<code>thongKe.soLan()</code>) thì lời gọi được chuyển tới đối tượng thật và chạy đúng. Luật: đừng đọc thẳng field của bean khác — dùng phương thức.</p>

<h3>4. @CacheEvict, @CachePut, condition và unless</h3>
<ul>
  <li><code>@CacheEvict(cacheNames = "thongKe", key = "#code")</code> xoá một khoá; <code>allEntries = true</code> xoá cả cache (với Redis là quét khoá rồi xoá — đắt khi cache lớn).</li>
  <li><code>@CachePut</code> <em>luôn</em> chạy phương thức rồi ghi đè khoá bằng kết quả. Dùng khi bạn đang cầm giá trị mới; đừng đặt chung với <code>@Cacheable</code> trên một phương thức.</li>
  <li><code>condition</code> được xét <em>trước</em> lời gọi (chỉ dùng được tham số); <code>unless</code> xét <em>sau</em> và dùng được <code>#result</code>.</li>
</ul>
${OUT131B_EVICT}
<p>Đọc các mốc giờ: GET lần hai trả cùng <code>tinhLuc</code> (từ cache); sau DELETE, GET kế tiếp tính lại; PUT tính rồi lưu, và GET sau đó trả đúng kết quả của PUT. Bộ đếm tăng từ 3 lên 6 — ba truy vấn thật cho sáu lời gọi.</p>

<h3>5. Bẫy hai: hai phương thức, một tên cache</h3>
<p>Có người thêm một hàm nhỏ trả sức chứa của phòng và, để "dùng lại cache có sẵn", đặt tên <code>"lab"</code> với cùng khoá:</p>
${MA131_TRUNG}
${OUT131B_TRUNG}
${OUT131C_TRUNG}
<p>Cả hai chiều đều hỏng. Nếu <code>LabInfo</code> được cache trước, hàm nhỏ nhận một <code>LabInfo</code> ở chỗ nó chờ <code>Integer</code>. Nếu hàm nhỏ chạy trước, endpoint công khai <code>GET /api/v1/labs/HW-04</code> — sinh viên nào cũng gọi — trả 500 trong mười phút tiếp theo. Không có gì báo lỗi lúc biên dịch: cache lưu <code>Object</code>. Luật: <strong>một tên cache, một kiểu giá trị</strong>; đặt tên theo thứ nó chứa (<code>lab</code>, <code>labCapacity</code>), và trong modular monolith coi mỗi tên cache thuộc về một module.</p>

<h3>6. Bẫy ba: cache cả "không tìm thấy"</h3>
<p>Phương thức trả kết quả rỗng cho mã không tồn tại sẽ vui vẻ cache luôn kết quả rỗng đó. Nếu mã lấy từ URL thì ai cũng tạo được khoá:</p>
${OUT131C_RAC}
<p>300 mã ngẫu nhiên vào endpoint thống kê: 300 lần quét cả bảng và khoảng 300 khoá mới (Redis từ 11 lên 307 khoá; vài khoá cũ hết hạn trong lúc đó). Cũng 300 request đó vào <code>GET /api/v1/labs/{code}</code> không tạo khoá nào, vì phương thức của catalog đã dặn:</p>
${MA131_CAT}
<p>Với kiểu trả về <code>Optional</code>, Spring cache <em>phần bên trong</em>, nên <code>#result</code> là <code>LabInfo</code> hoặc <code>null</code>. Cache "không tìm thấy" (negative caching) đôi khi có ích để chặn các lần trượt lặp lại, nhưng khi đó phải có TTL ngắn và kiểm tra đầu vào trước — 300 ở đây có thể là 3 triệu từ một script, và Redis của Chương 17 đặt <code>maxmemory 64mb</code> với <code>allkeys-lru</code>, nghĩa là khoá rác sẽ đẩy khoá có ích ra ngoài.</p>

<h3>🕵️ Góc hacker — Steam, ngày Giáng sinh 2015</h3>
<p>Ngày 25/12/2015, giữa một đợt tấn công từ chối dịch vụ làm lưu lượng tăng khoảng 2.000%, Valve đổi một cấu hình cache để giữ Steam Store sống. Trong khoảng 90 phút, các trang chứa dữ liệu cá nhân được trả từ cache cho nhầm người: khoảng 34.000 người dùng thấy trang tài khoản, thư viện game và chi tiết mua hàng của người khác. Valve phải tắt cửa hàng để sửa. Lỗi cốt lõi — cache phản hồi chứa dữ liệu cá nhân mà khoá không có người dùng — viết bằng Spring chỉ mất một dòng:</p>
${MA131_LICH}
${OUT131B_LICH}
<p>An hỏi trước; Bình hỏi sau nhận được lượt đặt của An ("Do an IoT nhom 3") vì khoá chỉ là <code>3</code>. Khi id người dùng là tham số, khoá thành <code>SimpleKey [3, 3]</code> và <code>SimpleKey [2, 3]</code>, mỗi người nhận đúng danh sách của mình. Cách phòng: (1) đừng cache dữ liệu riêng từng người nếu chưa đo thấy cần; (2) nếu cache thì id người dùng là <em>tham số phương thức</em> và nằm trong khoá — không bao giờ đọc <code>SecurityContext</code> bên trong phương thức được cache; (3) một test đăng nhập hai người rồi so câu trả lời (test IDOR ở Chương 11 bắt đúng lỗi này).</p>

<h3>So với Node.js</h3>
<p>Express không có chú thích; bạn tự viết cache-aside: <code>const hit = await redis.get(key); if (hit) return JSON.parse(hit); const v = await db.query(…); await redis.set(key, JSON.stringify(v), { EX: 600 });</code>. Không có proxy nên không có bẫy tự gọi — nhưng quên người dùng trong khoá thì y hệt. <code>CacheInterceptor</code> của NestJS gần với Spring hơn: mặc định nó cache phản hồi <code>GET</code> theo URL, nên gắn nó lên <code>/bookings/mine</code> là dựng lại sự cố Steam, trừ khi ghi đè <code>trackBy</code>. Mẹo phỏng vấn: "Spring khai báo và chạy qua proxy; Node viết tường minh bằng mã. Cả hai cần cùng một kỷ luật về khoá."</p>

<h3>Khi đi làm</h3>
<p>Trong LabFlow, hãy cache thứ được đọc nhiều, ít đổi và giống nhau cho mọi người: danh mục phòng lab, danh sách toà nhà, báo cáo đắt với TTL ngắn. <strong>Đừng</strong> cache khung giờ trống/bận (một chữ "trống" cũ, tốt lắm thì thành 409), quyền, hay bất cứ thứ gì luật đặt lịch dựa vào để quyết định — những thứ đó đọc từ CSDL, nơi có exclusion constraint. Trước khi thêm cache phải có một con số: p95 của endpoint và số truy vấn nó chạy (Chương 16). Sau khi thêm phải có con số khác: tỉ lệ trúng (bài 13.3).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@Cacheable hoạt động thế nào?"</strong> — Một proxy bọc bean tính khoá từ tham số; trúng thì trả giá trị đã lưu mà không gọi phương thức, trượt thì gọi rồi lưu kết quả. Nơi lưu là một CacheManager thay được.</li>
  <li><strong>"@Cacheable của tôi không có tác dụng, vì sao?"</strong> — Tự gọi (qua <code>this</code>), phương thức không public, bean không do Spring quản lý, hoặc thiếu <code>@EnableCaching</code>. Cùng nguyên nhân với <code>@Transactional</code>.</li>
  <li><strong>"Khoá mặc định là gì?"</strong> — <code>SimpleKey.EMPTY</code>, chính tham số duy nhất, hoặc <code>SimpleKey</code> của mọi tham số. Vì vậy tham số không ảnh hưởng kết quả vẫn chẻ cache ra, còn thứ có ảnh hưởng mà đọc từ chỗ khác (như người dùng hiện tại) thì vắng mặt.</li>
  <li><strong>"@CachePut khác @CacheEvict thế nào?"</strong> — Put luôn chạy và ghi giá trị mới; Evict xoá khoá để lần đọc sau nạp lại. Evict đơn giản và an toàn hơn khi bạn không chắc có đúng giá trị mà một lần đọc sẽ tạo ra.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm phương thức <code>@Cacheable("thongKe") ThongKe theoPhongVaNam(String code, int nam)</code>. Gọi với <code>("IOT-01", 2025)</code> rồi <code>("IOT-01", 2026)</code>. Hai khoá trong Redis là gì?</li>
  <li>Đặt <code>@Cacheable(cacheNames = "thongKe", key = "#code", condition = "#code.length() == 6")</code> lên <code>theoPhong</code> rồi gọi hai lần với <code>X1</code>. Bao nhiêu truy vấn thật, bao nhiêu khoá?</li>
  <li>Vì sao <code>@Cacheable</code> trên một phương thức <code>private</code> của controller không chạy, dù chính controller gọi nó?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. <code>labflow::thongKe::SimpleKey [IOT-01, 2025]</code> và <code>labflow::thongKe::SimpleKey [IOT-01, 2026]</code> — hai tham số ⇒ một <code>SimpleKey</code> gồm cả hai, in ra bằng <code>toString()</code> của nó.</p><p>2. Hai truy vấn thật và không có khoá: <code>condition</code> sai ngay trước lời gọi nên cache không được đọc cũng không được ghi. So với <code>unless</code>: vẫn đọc cache.</p><p>3. Proxy chỉ chặn được lời gọi public đi từ bên ngoài; phương thức private được gọi thẳng trên đối tượng bên trong controller (tự gọi), và CGLIB cũng không ghi đè được phương thức private.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Cache-aside</strong> — đọc cache, trượt thì đọc nguồn rồi lưu kết quả; ứng dụng tự quản cache.</li>
  <li><strong>Hit / miss (trúng / trượt)</strong> — khoá có / không có trong cache.</li>
  <li><strong>CacheManager</strong> — đối tượng Spring tạo và tìm cache theo tên (map đơn giản, Redis, Caffeine…).</li>
  <li><strong>SimpleKey</strong> — khoá mặc định khi phương thức có không hoặc nhiều tham số.</li>
  <li><strong>Tự gọi (self-invocation)</strong> — lời gọi qua <code>this</code>, đi vòng qua proxy và mọi chú thích của nó.</li>
  <li><strong>Negative caching</strong> — nhớ cả "không tìm thấy"; chỉ có ích khi TTL ngắn và đầu vào đã kiểm tra.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đã đo: 70–80 ms mỗi lần khi không cache, một truy vấn thật cho năm lời gọi khi có cache; trúng cache thì thân phương thức không chạy.</li>
  <li>Cache chạy qua proxy: tự gọi thì bỏ qua nó, và field đọc qua proxy CGLIB ra <code>null</code>.</li>
  <li>Một tên cache chứa một kiểu giá trị; dùng chung tên đã gây <code>ClassCastException</code> ở một endpoint công khai.</li>
  <li>Đừng cache "không tìm thấy" với đầu vào từ URL: 300 request, 300 khoá rác và 300 lần quét cả bảng. Dùng <code>unless = "#result == null"</code>.</li>
  <li>Dữ liệu riêng từng người cần người dùng trong khoá, dưới dạng tham số — nếu không là dựng lại sự cố Steam.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/integration/cache.html', '📘', 'Spring Framework — Cache Abstraction', 'khoá, SpEL, condition/unless, sync, proxy hay AspectJ')}
${tl('https://docs.spring.io/spring-boot/reference/io/caching.html', '🍃', 'Spring Boot — Caching', 'Boot nhận ra nhà cung cấp nào, các thuộc tính spring.cache.*')}

<h3>Nguồn</h3>
<ul>
  <li>Sự cố cache của Steam Store, 25/12/2015 — thông báo của Valve ngày 29–30/12/2015 theo <a href="https://www.pcgamer.com/valve-apologizes-for-steams-troubled-christmas/" target="_blank" rel="noopener">PC Gamer</a> và <a href="https://www.securityweek.com/details-34000-steam-users-exposed-during-ddos-attack/" target="_blank" rel="noopener">SecurityWeek</a>.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Spring Data Redis 4.1.2) + Redis 7 + PostgreSQL 16 trên máy của khoá học, 24/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 13.2 =====
const MA132_PROPS = props("# src/main/resources/application.properties (phần Redis + cache)\n# Redis: tên host theo môi trường (compose: redis); TTL cho cache, tiền tố khoá theo ứng dụng\nspring.data.redis.host=${LABFLOW_REDIS_HOST:localhost}\nspring.data.redis.port=6379\n# mặc định client chờ một lệnh tới 60 s (đo ở 17.4) ⇒ cache chết là API treo; cache phải hỏng nhanh\nspring.data.redis.timeout=500ms\nspring.data.redis.connect-timeout=1s\n# cache: cấu hình trong shared/CacheCauHinh (JSON, tiền tố labflow::, xoá sau commit); TTL mặc định ở đây\nlabflow.cache.ttl=10m\nlabflow.cache.lech=1m");
const MA132_CFG = java("/**\n * Cache của LabFlow (Chương 13). Cache là phần TĂNG TỐC, không phải nguồn sự thật:\n *  - giá trị trong Redis là JSON đọc được, chỉ nhận kiểu của vn.labflow (không phải byte tuần tự hoá của JDK);\n *  - mỗi cache một TTL, cộng thêm một chút ngẫu nhiên để các khoá không hết hạn cùng lúc;\n *  - xoá cache SAU KHI transaction commit (transactionAware);\n *  - Redis chết thì đọc thẳng CSDL, ghi một dòng WARN.\n * Các công tắc labflow.cache.* chỉ để bài học bật/tắt từng ý và đo; giá trị mặc định là cấu hình đúng.\n */\n@Configuration\n@EnableCaching\n@EnableConfigurationProperties(CacheCauHinh.TuyChon.class)\nclass CacheCauHinh implements CachingConfigurer {\n    private static final Logger log = LoggerFactory.getLogger(CacheCauHinh.class);\n\n    @ConfigurationProperties(\"labflow.cache\")\n    record TuyChon(String kieu, Boolean sauCommit, Boolean nuotLoi, Boolean khoaGhi, Duration ttl, Duration lech, Map<String, Duration> ttlRieng) {\n        TuyChon {\n            khoaGhi = khoaGhi != null && khoaGhi;\n            kieu = kieu == null ? \"json\" : kieu;\n            sauCommit = sauCommit == null || sauCommit;\n            nuotLoi = nuotLoi == null || nuotLoi;\n            ttl = ttl == null ? Duration.ofMinutes(10) : ttl;\n            lech = lech == null ? Duration.ZERO : lech;\n            ttlRieng = ttlRieng == null ? Map.of() : ttlRieng;\n        }\n    }\n\n    private final TuyChon tc;\n    CacheCauHinh(TuyChon tc) { this.tc = tc; }\n\n    /** Cấu hình mặc định cho MỌI cache trong Redis. */\n    @Bean\n    RedisCacheConfiguration redisCacheConfiguration() {\n        RedisCacheConfiguration c = RedisCacheConfiguration.defaultCacheConfig()\n                .prefixCacheNameWith(\"labflow::\")                       // khoá: labflow::<tên cache>::<khoá>\n                .entryTtl(coLech(tc.ttl()));\n        if (tc.kieu().equals(\"json\")) c = c.serializeValuesWith(SerializationPair.fromSerializer(json()));\n        return c;                                                        // \"jdk\": giữ bộ tuần tự hoá mặc định để so sánh\n    }\n\n    /** JSON có ghi kiểu (\"@class\") để đọc lại đúng record — nhưng CHỈ chấp nhận kiểu của LabFlow và vài kiểu java.util. */\n    static GenericJacksonJsonRedisSerializer json() {\n        var hopLe = BasicPolymorphicTypeValidator.builder()\n                .allowIfSubType(\"vn.labflow.\").allowIfSubType(\"java.util.\").build();\n        return GenericJacksonJsonRedisSerializer.builder().enableDefaultTyping(hopLe).enableSpringCacheNullValueSupport().build();\n    }\n\n    /** TTL riêng từng cache + xoá sau commit (+ khoá ghi dùng chung giữa các instance nếu bật). */\n    @Bean\n    RedisCacheManagerBuilderCustomizer tuyBienCache(RedisConnectionFactory cf) {\n        return b -> {\n            // sync = true chỉ thật sự \"một người tính\" khi writer có khoá (khoá theo TÊN cache, nằm trong Redis) — đo ở 13.3\n            if (tc.khoaGhi()) b.cacheWriter(RedisCacheWriter.lockingRedisCacheWriter(cf));\n            tc.ttlRieng().forEach((ten, ttl) -> b.withCacheConfiguration(ten, redisCacheConfiguration().entryTtl(coLech(ttl))));\n            if (tc.sauCommit()) b.transactionAware();\n        };\n    }\n\n    /** TTL = gốc + ngẫu nhiên [0, lech): khoá ghi cùng lúc sẽ không hết hạn cùng lúc. */\n    private RedisCacheWriter.TtlFunction coLech(Duration goc) {\n        if (tc.lech().isZero()) return (k, v) -> goc;\n        long lechMs = tc.lech().toMillis();\n        return (k, v) -> goc.plusMillis(ThreadLocalRandom.current().nextLong(lechMs));\n    }\n\n    @Override\n    public CacheErrorHandler errorHandler() {\n        if (!tc.nuotLoi()) return null;                                  // null ⇒ mặc định của Spring: ném lỗi ra ngoài\n        return new CacheErrorHandler() {\n            public void handleCacheGetError(RuntimeException e, Cache c, Object k) { log.warn(\"cache {} lỗi khi đọc {}: {}\", c.getName(), k, e.getClass().getSimpleName()); }\n            public void handleCachePutError(RuntimeException e, Cache c, Object k, Object v) { log.warn(\"cache {} lỗi khi ghi {}: {}\", c.getName(), k, e.getClass().getSimpleName()); }\n            public void handleCacheEvictError(RuntimeException e, Cache c, Object k) { log.warn(\"cache {} lỗi khi xoá {}\", c.getName(), k); }\n            public void handleCacheClearError(RuntimeException e, Cache c) { log.warn(\"cache {} lỗi khi dọn\", c.getName()); }\n        };\n    }\n}");
const MA132_C13 = props("# src/main/resources/application-c13.properties (profile đo của chương)\n# Chương 13: dữ liệu đo (2 triệu dòng su_dung), tên cache cho số đo, endpoint metrics/caches\nspring.flyway.locations=classpath:db/migration/identity,classpath:db/migration/catalog,classpath:db/migration/booking,classpath:db/migration/notification,classpath:db/dev,classpath:db/c13\nspring.cache.cache-names=lab,thongKe,thongKeSync,lichSai,lichDung\nspring.cache.redis.enable-statistics=true\nmanagement.endpoints.web.exposure.include=health,info,metrics,caches\nlabflow.cache.ttl-rieng.thongKe=30s\nlabflow.cache.ttl-rieng.thongKeSync=30s\nlabflow.cache.lech=0s");
const MA132_KIEU = java("/** 13.2: JSON KHÔNG ghi kiểu thì đọc lại ra Map; ghi kiểu thì phải giới hạn kiểu được nhận. */\npublic class KhongKieu {\n    public static void main(String[] a) {\n        LabInfo lab = new LabInfo(1, \"IOT-01\", \"Lab IoT\", 24, \"ACTIVE\", false);\n\n        var khongKieu = new GenericJacksonJsonRedisSerializer(tools.jackson.databind.json.JsonMapper.builder().build());\n        byte[] b = khongKieu.serialize(lab);\n        System.out.println(\"1) không ghi kiểu   : \" + new String(b));\n        Object doc = khongKieu.deserialize(b);\n        System.out.println(\"   đọc lại ra       : \" + doc.getClass().getName() + \" \" + doc);\n        try { LabInfo x = (LabInfo) doc; System.out.println(x); }\n        catch (ClassCastException e) { System.out.println(\"   ép về LabInfo    : \" + e.getClass().getSimpleName()); }\n\n        var coKieu = GenericJacksonJsonRedisSerializer.builder().enableDefaultTyping(\n                BasicPolymorphicTypeValidator.builder().allowIfSubType(\"vn.labflow.\").allowIfSubType(\"java.util.\").build()).build();\n        byte[] c = coKieu.serialize(lab);\n        System.out.println(\"2) ghi kiểu (@class): \" + new String(c));\n        System.out.println(\"   đọc lại ra       : \" + coKieu.deserialize(c));\n\n        // kẻ ghi được vào Redis đặt một kiểu KHÁC vào khoá cache\n        byte[] la = \"{\\\"@class\\\":\\\"java.awt.Point\\\",\\\"x\\\":6,\\\"y\\\":9}\".getBytes();\n        try { System.out.println(\"3) allow-list nhận : \" + coKieu.deserialize(la)); }\n        catch (Exception e) { System.out.println(\"3) allow-list chặn : \" + e.getClass().getSimpleName() + \": \" + e.getMessage().lines().findFirst().orElse(\"\")); }\n        var khongGioiHan = GenericJacksonJsonRedisSerializer.builder().enableUnsafeDefaultTyping().build();\n        try { Object o = khongGioiHan.deserialize(la); System.out.println(\"4) không giới hạn  : tạo ra \" + o.getClass().getName() + \" = \" + o); }\n        catch (Exception e) { System.out.println(\"4) không giới hạn  : \" + e.getClass().getSimpleName() + \": \" + e.getMessage().lines().findFirst().orElse(\"\")); }\n    }\n}");
const MA132_GH = java("/**\n * Giới hạn tần suất \"cửa sổ cố định\" trong Redis, dùng chung cho mọi instance.\n * INCR + PEXPIRE chạy trong MỘT script Lua ⇒ nguyên tử: 50 request cùng lúc vẫn chỉ 5 cái lọt.\n */\n@Component\npublic class GioiHan {\n    private static final Logger log = LoggerFactory.getLogger(GioiHan.class);\n    private static final RedisScript<List> DEM = RedisScript.of(\"\"\"\n            local n = redis.call('INCR', KEYS[1])\n            if n == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end\n            return {n, redis.call('PTTL', KEYS[1])}\"\"\", List.class);\n\n    public static class QuaNhieu extends LoiNghiepVu {\n        private final long giayCho;\n        QuaNhieu(long giayCho) { super(HttpStatus.TOO_MANY_REQUESTS, \"RATE_LIMITED\", \"bạn thao tác quá nhanh, thử lại sau \" + giayCho + \" giây\"); this.giayCho = giayCho; }\n        public long giayCho() { return giayCho; }\n    }\n\n    private final StringRedisTemplate redis;\n    GioiHan(StringRedisTemplate redis) { this.redis = redis; }\n\n    /** Ném QuaNhieu (429) nếu \"ai\" đã làm \"viec\" quá toiDa lần trong cửa sổ hiện tại. */\n    public void kiem(String viec, String ai, int toiDa, Duration cua) {\n        List<?> kq;\n        try {\n            kq = redis.execute(DEM, List.of(\"labflow::gh::\" + viec + \"::\" + ai), String.valueOf(cua.toMillis()));\n        } catch (DataAccessException e) {          // Redis chết: CHO QUA (fail-open) — đặt lịch quan trọng hơn chống spam\n            log.warn(\"giới hạn tần suất {} tạm tắt: {}\", viec, e.getClass().getSimpleName());\n            return;\n        }\n        long n = ((Number) kq.get(0)).longValue(), conMs = ((Number) kq.get(1)).longValue();\n        if (n > toiDa) throw new QuaNhieu(Math.max(1, (conMs + 999) / 1000));\n    }\n}");
const MA132_NGAYTHO = java("@PostMapping(\"/api/v1/demo13/gh/ngay-tho/{ai}\") ResponseEntity<String> nGayTho(@PathVariable String ai) {\n    String k = \"labflow::gh-ngay-tho::\" + ai;\n    String v = redis.opsForValue().get(k);\n    int n = v == null ? 0 : Integer.parseInt(v);\n    if (n >= 5) return ResponseEntity.status(429).body(\"429\");\n    redis.opsForValue().set(k, String.valueOf(n + 1), Duration.ofMinutes(1));\n    return ResponseEntity.ok(\"200\");\n}");
const MA132_IP = java("@PostMapping(\"/api/v1/demo13/gh/ip\") String theoIp(HttpServletRequest r) {\n    String xff = r.getHeader(\"X-Forwarded-For\");\n    String ip = xff != null ? xff.split(\",\")[0].trim() : r.getRemoteAddr();   // SAI: tin header do client gửi\n    gioiHan.kiem(\"dang-nhap-ip\", ip, 5, Duration.ofMinutes(15)); return \"200 (\" + ip + \")\";\n}");
const MA132_DAT = java("private final BookingService service;\nprivate final GioiHan gioiHan;\nprivate final int datToiDa; private final Duration datCua;\nBookingController(BookingService s, GioiHan g, @Value(\"${labflow.gioi-han.dat.toi-da:5}\") int toiDa, @Value(\"${labflow.gioi-han.dat.cua:PT1M}\") Duration cua) {\n    service = s; gioiHan = g; datToiDa = toiDa; datCua = cua;\n}\n\n/** Idempotency-Key bắt buộc: mạng chậm, người dùng bấm hai lần ⇒ lần hai trả lại đúng lượt của lần một (200), không tạo lượt mới. */\n@PostMapping\nResponseEntity<BookingView> dat(@AuthenticationPrincipal Jwt jwt, @RequestHeader(\"Idempotency-Key\") @Size(min = 8, max = 64, message = \"dài 8–64 ký tự\") String key,\n                                @Valid @RequestBody DatRequest r) {\n    gioiHan.kiem(\"dat\", String.valueOf(NguoiDung.tu(jwt).id()), datToiDa, datCua);   // Chương 13: tối đa 5 lần đặt mỗi phút mỗi người\n    var kq = service.dat(NguoiDung.tu(jwt), new BookingService.YeuCauDat(r.labCode(), r.startAt(), r.endAt(), r.purpose()), key);\n    if (kq.lapLai()) return ResponseEntity.ok().header(\"Idempotent-Replayed\", \"true\").body(kq.view());\n    return ResponseEntity.created(URI.create(\"/api/v1/bookings/\" + kq.view().id())).body(kq.view());\n}");
const MA132_429 = java("/** 429 kèm Retry-After: client biết chờ bao lâu (Chương 13). */\n@ExceptionHandler(GioiHan.QuaNhieu.class)\nResponseEntity<ProblemDetail> quaNhieu(GioiHan.QuaNhieu e) {\n    return ResponseEntity.status(e.status()).header(HttpHeaders.RETRY_AFTER, String.valueOf(e.giayCho())).body(pd(e.status(), e.code(), e.getMessage()));\n}");
const OUT132A = out("## 1 bộ tuần tự hoá JDK (mặc định của Spring Data Redis): byte nhị phân, có tên lớp, không đọc được bằng mắt\n$ curl -s $API/api/v1/labs/IOT-01; echo\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}\n\n$ redis-cli --no-raw get labflow::lab::IOT-01\n\"\\xac\\xed\\x00\\x05sr\\x00\\x1avn.labflow.catalog.LabInfo\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x02\\x00\\x06I\\x00\\bcapacityJ\\x00\\x02idZ\\x00\\x10requiresApprovalL\\x00\\x04codet\\x00\\x12Ljava/lang/String;L\\x00\\x04nameq\\x00~\\x00\\x01L\\x00\\x06statusq\\x00~\\x00\\x01xp\\x00\\x00\\x00\\x18\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x01\\x00t\\x00\\x06IOT-01t\\x00\\aLab IoTt\\x00\\x06ACTIVE\"\n\n$ redis-cli strlen labflow::lab::IOT-01\n177\n\n## 2 JSON có @class (cấu hình của LabFlow): đọc được, ngắn hơn\n$ curl -s -o /dev/null $API/api/v1/labs/IOT-01\n\n$ redis-cli get labflow::lab::IOT-01\n{\"@class\":\"vn.labflow.catalog.LabInfo\",\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}\n\n$ redis-cli strlen labflow::lab::IOT-01\n136\n\n## 3 TTL: mặc định 10 phút cho \"lab\", 30 giây cho \"thongKe\" (labflow.cache.ttl-rieng)\n$ curl -s -o /dev/null $API/api/v1/demo13/thong-ke/AI-03\n\n$ redis-cli ttl labflow::lab::IOT-01\n600\n\n$ redis-cli ttl labflow::thongKe::AI-03\n30");
const OUT132_KIEU = out("$ java -cp \"target/classes:target/dep/*\" KhongKieu.java\n1) không ghi kiểu   : {\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}\n   đọc lại ra       : java.util.LinkedHashMap {id=1, code=IOT-01, name=Lab IoT, capacity=24, status=ACTIVE, requiresApproval=false}\n   ép về LabInfo    : ClassCastException\n2) ghi kiểu (@class): {\"@class\":\"vn.labflow.catalog.LabInfo\",\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}\n   đọc lại ra       : LabInfo[id=1, code=IOT-01, name=Lab IoT, capacity=24, status=ACTIVE, requiresApproval=false]\n3) allow-list chặn : SerializationException: Could not read JSON: Could not resolve type id 'java.awt.Point' as a subtype of `java.awt.Point`: Configured `PolymorphicTypeValidator` (of type `tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator`) denied resolution\n4) không giới hạn  : tạo ra java.awt.Point = java.awt.Point[x=6,y=9]");
const OUT132_JSON = out("## 4 triển khai cuốn chiếu: v1 (LabInfo 6 trường) và v2 (thêm building) cùng chạy, CÙNG Redis — cache JSON\n$ curl -s localhost:8080/api/v1/labs/IOT-01; echo \"   ← v1 đọc CSDL, ghi cache\"\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}   ← v1 đọc CSDL, ghi cache\n\n$ curl -s localhost:8081/api/v1/labs/IOT-01; echo \"   ← v2 đọc bản cache của v1\"\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"building\":null,\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}   ← v2 đọc bản cache của v1\n\n$ psql -c \"select code, building from labs where code = 'IOT-01'\"\n  code  | building \n--------+----------\n IOT-01 | Alpha\n(1 row)\n\n$ curl -s localhost:8081/api/v1/labs/NET-02; echo \"   ← v2 ghi cache trước\"\n{\"id\":2,\"code\":\"NET-02\",\"name\":\"Lab Mạng\",\"building\":\"Alpha\",\"capacity\":30,\"status\":\"ACTIVE\",\"requiresApproval\":false}   ← v2 ghi cache trước\n\n$ curl -s localhost:8080/api/v1/labs/NET-02 | jq -c '{status,code}'; echo \"   ← v1 đọc bản của v2\"\n{\"status\":\"ACTIVE\",\"code\":\"NET-02\"}\n   ← v1 đọc bản của v2\n\n$ docker logs labflow | grep -o 'WARN.*cache lab.*' | tail -2\n\n$ docker logs labflow | grep -m1 -o 'UnrecognizedPropertyException.*\\|SerializationException.*' | cut -c1-220");
const OUT132_JDK = out("## 5 cùng thí nghiệm với bộ tuần tự hoá JDK\n$ curl -s localhost:8080/api/v1/labs/IOT-01; echo \"   ← v1 ghi\"\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}   ← v1 ghi\n\n$ curl -s localhost:8081/api/v1/labs/IOT-01; echo \"   ← v2 đọc\"\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"building\":null,\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}   ← v2 đọc\n\n$ curl -s localhost:8081/api/v1/labs/NET-02; echo \"   ← v2 ghi\"\n{\"id\":2,\"code\":\"NET-02\",\"name\":\"Lab Mạng\",\"building\":\"Alpha\",\"capacity\":30,\"status\":\"ACTIVE\",\"requiresApproval\":false}   ← v2 ghi\n\n$ curl -s localhost:8080/api/v1/labs/NET-02; echo \"   ← v1 đọc\"\n{\"id\":2,\"code\":\"NET-02\",\"name\":\"Lab Mạng\",\"capacity\":30,\"status\":\"ACTIVE\",\"requiresApproval\":false}   ← v1 đọc\n\n$ docker logs labflow-b | grep -o 'WARN.*cache lab.*' | tail -2\n\n$ docker logs labflow | grep -o 'WARN.*cache lab.*' | tail -2");
const OUT132_HAI = out("## 6 hai instance (A :8080, B :8081) dùng CHUNG Redis: A tính, B dùng lại\n$ curl -s localhost:8080/api/v1/demo13/thong-ke/AI-03 | jq -c '{code,tinhLuc}'\n{\"code\":\"AI-03\",\"tinhLuc\":\"2026-11-24T12:28:08.223733068Z\"}\n\n$ curl -s localhost:8081/api/v1/demo13/thong-ke/AI-03 | jq -c '{code,tinhLuc}'\n{\"code\":\"AI-03\",\"tinhLuc\":\"2026-11-24T12:28:08.223733068Z\"}\n\n$ echo \"A: $(curl -s localhost:8080/api/v1/demo13/dem) · B: $(curl -s localhost:8081/api/v1/demo13/dem)\"\nA: {\"truyVanThat\":1} · B: {\"truyVanThat\":0}\n\n## 7 cùng hai instance nhưng cache TRONG JVM (simple): quản lý đổi trạng thái qua A, B vẫn trả bản cũ\n$ curl -s localhost:8080/api/v1/labs/HW-04 | jq -c '{code,status}'\n{\"code\":\"HW-04\",\"status\":\"ACTIVE\"}\n\n$ curl -s localhost:8081/api/v1/labs/HW-04 | jq -c '{code,status}'\n{\"code\":\"HW-04\",\"status\":\"ACTIVE\"}\n\n$ curl -s -X PATCH -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"status\":\"MAINTENANCE\"}' localhost:8080/api/v1/labs/HW-04/status | jq -c '{code,status}'\n{\"code\":\"HW-04\",\"status\":\"MAINTENANCE\"}\n\n$ curl -s localhost:8080/api/v1/labs/HW-04 | jq -c '{code,status}'; echo \"   ← A\"\n{\"code\":\"HW-04\",\"status\":\"MAINTENANCE\"}\n   ← A\n\n$ curl -s localhost:8081/api/v1/labs/HW-04 | jq -c '{code,status}'; echo \"   ← B: bản cũ trong bộ nhớ của B\"\n{\"code\":\"HW-04\",\"status\":\"ACTIVE\"}\n   ← B: bản cũ trong bộ nhớ của B\n\n## 8 cùng việc đó với Redis: một chỗ xoá, mọi instance thấy\n$ curl -s localhost:8081/api/v1/labs/HW-04 | jq -c '{code,status}'\n{\"code\":\"HW-04\",\"status\":\"ACTIVE\"}\n\n$ curl -s -X PATCH -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"status\":\"MAINTENANCE\"}' localhost:8080/api/v1/labs/HW-04/status | jq -c '{code,status}'\n{\"code\":\"HW-04\",\"status\":\"MAINTENANCE\"}\n\n$ curl -s localhost:8081/api/v1/labs/HW-04 | jq -c '{code,status}'; echo \"   ← B\"\n{\"code\":\"HW-04\",\"status\":\"MAINTENANCE\"}\n   ← B");
const OUT132_CHET = out("## 9 Redis đứng hình (docker pause): có CacheErrorHandler + timeout 500 ms\n$ docker pause redis\nredis\n\n$ curl -s -w '   (HTTP %{http_code}, %{time_total} s)\\n' $API/api/v1/labs/IOT-01\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false}   (HTTP 200, 0.627153 s)\n\n$ docker logs labflow | grep -o 'WARN.*cache lab.*' | tail -2\nWARN 1 --- [labflow] [nio-8080-exec-4] vn.labflow.shared.CacheCauHinh           : cache lab lỗi khi đọc IOT-01: RedisConnectionFailureException\n\n$ docker unpause redis\nredis\n\n## 10 tắt CacheErrorHandler (labflow.cache.nuot-loi=false): lỗi cache thành lỗi của API\n$ docker pause redis\nredis\n\n$ curl -s -w '   (HTTP %{http_code}, %{time_total} s)\\n' $API/api/v1/labs/IOT-01\n{\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\",\"instance\":\"/api/v1/labs/IOT-01\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.vn/errors/internal\",\"code\":\"INTERNAL\"}   (HTTP 500, 0.987264 s)\n\n$ docker logs labflow | grep -m1 -o 'org.springframework.dao.QueryTimeoutException.*\\|RedisCommandTimeoutException.*' | cut -c1-160\nRedisCommandTimeoutException: Connection initialization timed out after 500 millisecond(s)\n\n$ docker unpause redis\nredis");
const OUT132_DUA = out("## 11 giới hạn 5 lần/phút, 50 request CÙNG LÚC — bản ngây thơ: GET đếm, so sánh, rồi SET\n$ dong 50 $API/api/v1/demo13/gh/ngay-tho/an POST\n50×200  · tổng 867 ms\n\n$ redis-cli get labflow::gh-ngay-tho::an\n1\n\n## 12 bản nguyên tử: INCR + PEXPIRE trong một script Lua\n$ dong 50 $API/api/v1/demo13/gh/nguyen-tu/an POST\n5×200  45×429  · tổng 257 ms\n\n$ redis-cli get labflow::gh::demo::an\n50\n\n$ redis-cli pttl labflow::gh::demo::an\n59645");
const OUT132_DAT = out("## 13 gắn vào POST /api/v1/bookings: 5 lần đặt hợp lệ, ngày 31/11 hỏng ngay lúc đọc body (chưa vào phương thức ⇒ không bị đếm), lần kế tiếp là lần thứ 6\n$ for d in 26 27 28 29 30 31; do curl -s -o /dev/null -w \"ngày $d: %{http_code}\\n\" -H \"Authorization: Bearer $AN\" -H \"$J\" -H \"Idempotency-Key: an-gh-dat-00$d\" -d \"{\\\"labCode\\\":\\\"IOT-01\\\",\\\"startAt\\\":\\\"2026-11-${d}T14:00:00\\\",\\\"endAt\\\":\\\"2026-11-${d}T15:00:00\\\",\\\"purpose\\\":\\\"thu gioi han\\\"}\" $API/api/v1/bookings; done\nngày 26: 201\nngày 27: 201\nngày 28: 201\nngày 29: 201\nngày 30: 201\nngày 31: 400\n\n$ curl -s -D - -H \"Authorization: Bearer $AN\" -H \"$J\" -H \"Idempotency-Key: an-gh-dat-0007\" -d '{\"labCode\":\"AI-03\",\"startAt\":\"2026-11-28T08:00:00\",\"endAt\":\"2026-11-28T09:00:00\",\"purpose\":\"thu gioi han 7\"}' $API/api/v1/bookings | grep -iE '^HTTP|^retry-after|^content-type|^\\{'\nHTTP/1.1 429 \r\nRetry-After: 60\r\nContent-Type: application/problem+json\r\n{\"detail\":\"bạn thao tác quá nhanh, thử lại sau 60 giây\",\"instance\":\"/api/v1/bookings\",\"status\":429,\"title\":\"Too Many Requests\",\"type\":\"https://labflow.vn/errors/rate-limited\",\"code\":\"RATE_LIMITED\"}\n\n## 14 Redis đứng hình: giới hạn tự tắt (fail-open), đặt lịch vẫn chạy\n$ docker pause redis\nredis\n\n$ curl -s -o /dev/null -w \"HTTP %{http_code}, %{time_total} s\\n\" -H \"Authorization: Bearer $AN\" -H \"$J\" -H \"Idempotency-Key: an-redis-dung-$RANDOM\" -d '{\"labCode\":\"NET-02\",\"startAt\":\"2026-11-28T08:00:00\",\"endAt\":\"2026-11-28T09:00:00\",\"purpose\":\"Redis dung\"}' $API/api/v1/bookings\nHTTP 201, 1.032765 s\n\n$ docker logs labflow | grep -o 'WARN.*giới hạn.*' | tail -1\nWARN 1 --- [labflow] [nio-8080-exec-5] vn.labflow.shared.GioiHan                : giới hạn tần suất dat tạm tắt: QueryTimeoutException\n\n$ docker unpause redis\nredis");
const OUT132_IP = out("## 15 khoá theo IP lấy từ header X-Forwarded-For — kẻ tấn công tự đặt header\n$ for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code} ' -X POST $API/api/v1/demo13/gh/ip; done; echo \"← không header\"\n200 200 200 200 200 429 ← không header\n\n$ for i in $(seq 20); do curl -s -o /dev/null -w '%{http_code} ' -X POST -H \"X-Forwarded-For: 10.0.$i.7\" $API/api/v1/demo13/gh/ip; done; echo \"← mỗi lần một IP giả\"\n200 200 200 200 200 200 200 200 200 200 200 200 200 200 200 200 200 200 200 200 ← mỗi lần một IP giả");
const OUT132_RANH = out("## 16 cửa sổ cố định 10 giây: dồn ở ranh giới hai cửa sổ ⇒ 9 lần lọt trong chưa tới 1 giây\n$ curl -s -o /dev/null -w '%{http_code} ' -X POST \"$API/api/v1/demo13/gh/nguyen-tu/binh?giay=10\"; date +%T.%3N\n200 19:30:55.906\n\n$ sleep 9.5; date +%T.%3N; for i in 1 2 3 4; do curl -s -o /dev/null -w '%{http_code} ' -X POST \"$API/api/v1/demo13/gh/nguyen-tu/binh?giay=10\"; done; redis-cli pttl labflow::gh::demo::binh\n19:31:05.408\n200 200 200 200 366\n\n$ sleep 0.6; for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code} ' -X POST \"$API/api/v1/demo13/gh/nguyen-tu/binh?giay=10\"; done; date +%T.%3N\n200 200 200 200 200 429 19:31:06.242");

const L132_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2 · Caching with Redis</span>
<h2>Redis as the cache: TTL and serialization</h2>
<p class="lead">A cache inside one JVM dies with every restart and disagrees with the other instances behind the load balancer. Redis fixes both, and adds four new questions: what bytes go into Redis, how long they live, what happens when two versions of the code read each other's bytes during a deploy, and what the API does when Redis stops answering. This lesson answers each with a measurement on LabFlow, then uses the same Redis for a second job every backend needs: limiting how often one user can book — and shows the classic bug that lets 50 requests through a limit of 5.</p>

<h3>Everyday picture first</h3>
<p>In the previous lesson the librarian kept sticky notes on her own desk. Now the library has three desks open at the same time. If each librarian keeps her own notes, a correction told to desk A never reaches desk B. So the library puts one shared whiteboard in the middle of the room: every desk reads and writes there. The whiteboard is Redis. New problems appear immediately: how long may a note stay before it is wiped, in what handwriting is it written so every librarian can read it, and what do the librarians do when someone stands in front of the whiteboard and blocks it?</p>

<h3>1. How Spring Boot connects the pieces</h3>
<p>With <code>spring-boot-starter-data-redis</code> on the classpath, Boot creates a Lettuce connection to <code>spring.data.redis.host:port</code> and, because <code>@EnableCaching</code> is present, a <code>RedisCacheManager</code>. Two settings matter more than all others: the <strong>command timeout</strong> (Lettuce waits 60 s by default — measured in Chapter 17) and the TTL.</p>
${MA132_PROPS}
<p>LabFlow then takes control of the cache configuration in one class. Each comment in it is the conclusion of a measurement below:</p>
${MA132_CFG}
<p>Once you declare your own <code>RedisCacheConfiguration</code> bean, Boot stops applying <code>spring.cache.redis.time-to-live</code> and <code>key-prefix</code> — that is why the TTL moved to <code>labflow.cache.ttl</code>. The switches <code>kieu</code>, <code>sau-commit</code>, <code>nuot-loi</code>, <code>khoa-ghi</code> and <code>lech</code> exist only so this chapter can turn each idea off and measure it; their defaults are the configuration we recommend.</p>
${MA132_C13}

<h3>2. What the bytes look like: JDK vs JSON</h3>
<p>Without a value serializer, Spring Data Redis uses Java serialization:</p>
${OUT132A}
<ul>
  <li><strong>JDK</strong>: 177 bytes of binary that start with <code>\\xac\\xed\\x00\\x05</code> (the Java serialization magic number) and contain the full class name. Unreadable for a human, unreadable for a Node.js service, and — the security problem — Redis content becomes input to <code>ObjectInputStream</code>, the mechanism behind a decade of Java deserialization exploits. Anyone who can write to Redis can hand your JVM arbitrary serialized objects.</li>
  <li><strong>JSON</strong>: 136 bytes, readable with <code>redis-cli</code>, with an <code>@class</code> property so Spring can rebuild the right record.</li>
  <li><strong>TTL</strong>: 600 s for <code>lab</code> (the default) and 30 s for <code>thongKe</code> (a per-cache override). Redis deletes expired keys itself; you never write cleanup code.</li>
</ul>
<p>Why <code>@class</code>, and why the allow-list? A small program shows both:</p>
${MA132_KIEU}
${OUT132_KIEU}
<ol>
  <li>JSON without type information comes back as a <code>LinkedHashMap</code> — the cache would "work" and then throw <code>ClassCastException</code> in your code.</li>
  <li>With type information the record comes back correctly.</li>
  <li>With the allow-list, a value whose <code>@class</code> is outside <code>vn.labflow.*</code> / <code>java.util.*</code> is refused: <em>"PolymorphicTypeValidator … denied resolution"</em>.</li>
  <li>With <code>enableUnsafeDefaultTyping()</code>, Jackson creates whatever class the JSON names — here a harmless <code>java.awt.Point</code>, but this is exactly the door that Jackson "gadget" CVEs walk through. Never use the unsafe variant.</li>
</ol>
<p>An even stricter option is one typed serializer per cache (<code>new JacksonJsonRedisSerializer&lt;&gt;(LabInfo.class)</code>): no <code>@class</code> at all, only one possible type.</p>

<h3>3. Rolling deploys: two versions, one Redis</h3>
<p>In production you rarely stop everything. During a rolling deploy, v1 and v2 of the code run side by side for minutes and share the cache. We simulated it: v2 adds a field <code>building</code> to <code>LabInfo</code>.</p>
${OUT132_JSON}
${OUT132_JDK}
<p>No exception anywhere — and that is the danger. v2 reads v1's entry and returns <code>"building": null</code> while the database says <code>Alpha</code>, for up to ten minutes. v1 reads v2's entry and silently drops the field. Java serialization behaves the same here only because <code>LabInfo</code> is a <em>record</em>: records ignore <code>serialVersionUID</code> and are rebuilt through the canonical constructor, missing fields get default values. A regular class without an explicit <code>serialVersionUID</code> would throw <code>InvalidClassException</code> on every read instead.</p>
<p>What teams do: when the <em>shape</em> of a cached value changes, change the cache name or prefix (<code>lab</code> → <code>lab-v2</code>, or <code>labflow::v2::</code>) so the two versions never read each other's entries; old keys expire by TTL. Cheap, boring, effective.</p>

<h3>4. Many instances: shared cache vs local cache</h3>
${OUT132_HAI}
<ul>
  <li>Section 6: instance A computed the statistics, B returned the same <code>tinhLuc</code> with zero real queries. One computation for the whole cluster.</li>
  <li>Section 7: with <code>spring.cache.type=simple</code> (a map in each JVM), the manager set HW-04 to MAINTENANCE through A. A answered MAINTENANCE, B kept answering ACTIVE: B's map never heard about the eviction. Students hitting B could still book a room under maintenance.</li>
  <li>Section 8: the same steps with Redis — one eviction, every instance sees it.</li>
</ul>
<p>Local caches (Caffeine) are faster than Redis and fine for data that never changes or where seconds of staleness are harmless; for anything an administrator can change, use a shared cache or a very short TTL. Two-level caches (local + Redis with invalidation messages) exist, but they are a tool for later, not for SWP391.</p>

<h3>5. When Redis stops answering</h3>
${OUT132_CHET}
<p>With the <code>CacheErrorHandler</code> and a 500 ms timeout, a frozen Redis costs one timeout and a WARN line; the API answers from the database (0.63 s). Without the handler, the same timeout becomes a 500 for the user. A cache is an optimisation: it must never be the reason an endpoint fails.</p>

<h3>6. Redis for something else: rate limiting</h3>
<p>LabFlow should refuse a sixth booking from the same user within a minute (scripts, double-clickers, bots). Every instance must count together, so the counter lives in Redis. The obvious version reads, compares, then writes:</p>
${MA132_NGAYTHO}
${OUT132_DUA}
<p>50 requests at the same moment: <strong>all 50 passed</strong>, and the counter ended at 1. Every request read 0 before any of them wrote. This is a race between "check" and "act" — the same shape as the double booking in Chapter 18, just in Redis. The fix is to make Redis do the check and the increment in one step. <code>INCR</code> is atomic; setting the expiry must happen in the same step too, otherwise a crash between the two leaves a counter that never expires. A Lua script runs atomically on the Redis server:</p>
${MA132_GH}
<p>Same 50 requests: exactly 5×200 and 45×429. The counter says 50 because rejected requests are counted too — which is what you want against a script. Wired into LabFlow:</p>
${MA132_DAT}
${MA132_429}
${OUT132_DAT}
<p>Notes from the run: the request for 31 November was rejected with 400 while reading the body, before the method ran, so it was not counted — a limiter in a filter would count it. The 429 is <code>application/problem+json</code> with the stable code <code>RATE_LIMITED</code> and a <code>Retry-After</code> header, so the React page can say "try again in 60 seconds" without parsing text.</p>
<p><strong>Fail-open or fail-closed?</strong> With Redis frozen, LabFlow lets the booking through (201 after about one second of timeouts) and logs a WARN. For booking, availability matters more than a perfect limit. For login attempts (the lab of this chapter) many teams choose the opposite. Write the decision down.</p>
<p>Two weaknesses you should know by name. First, the key: if you count per IP and take the IP from a header the client controls, the limit disappears:</p>
${MA132_IP}
${OUT132_IP}
<p>Second, a <strong>fixed window</strong> allows a burst at its boundary:</p>
${OUT132_RANH}
<p>One request opened a 10-second window; 9.5 s later four more passed (the window had 366 ms left), and 0.6 s later a new window let five more through: nine accepted requests in under a second for a limit of "5 per 10 seconds". Sliding windows (a sorted set of timestamps) or token buckets (Bucket4j has a Redis backend) smooth this out; for "5 bookings per minute" the fixed window is usually good enough — know the trade-off.</p>

<h3>🕵️ Hacker corner — HeadCrab, 2021–2023</h3>
<p>Redis open-source ships without authentication, and its own documentation says it is designed to be reached only by trusted clients. Aqua Nautilus reported in 2023 that the HeadCrab malware had taken over at least 1,200 Redis servers exposed to the internet since September 2021: the attacker connects, makes the victim a replica of a Redis server under their control, and the "replication" loads a malicious module that runs code and mines cryptocurrency. Prevention, in LabFlow terms: Redis listens only on a private network (the compose file in Chapter 17 has no <code>ports</code> for Redis; in this chapter it is bound to <code>127.0.0.1</code>), <code>requirepass</code> or ACL users when it leaves one host, never <code>protected-mode no</code> on a public interface, and the application treats Redis content as untrusted input — which is why JSON with an allow-list beats Java serialization.</p>
<p>And for the rate limit: in 2019 researcher Laxman Muthiyah showed that Instagram's password-reset code check could be brute-forced because the limit was per IP; with enough IP addresses (cheap in the cloud) a million codes were within reach. The lab of this chapter limits login attempts per <em>account</em> for that reason.</p>

<h3>Compared with Node.js</h3>
<p>Node uses the same Redis and the same commands: <code>node-redis</code> or <code>ioredis</code>, and for rate limits <code>rate-limiter-flexible</code> or <code>express-rate-limit</code> with a Redis store — which also use atomic Lua scripts. <code>express-rate-limit</code> counts per IP by default and has a <code>trust proxy</code> setting; get it wrong and you reproduce section 15. Values are JSON by default in Node, so the JDK-serialization trap does not exist there, but the rolling-deploy shape problem does.</p>

<h3>At work</h3>
<p>Checklist for a Redis cache in a team project: one prefix per application (<code>labflow::</code>) because Redis is often shared; a TTL on every key; JSON values; timeouts in milliseconds, not seconds; an error handler; <code>maxmemory</code> with an eviction policy; no public port; and a short note in the README saying which caches exist, their TTL and who evicts them. For SWP391, that table is worth more than any clever cache code.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Why Redis rather than an in-memory cache?"</strong> — Shared by all instances (one eviction is seen everywhere, measured above), survives application restarts, bounded memory with eviction. The cost is a network round trip and one more thing to operate.</li>
  <li><strong>"JDK or JSON serialization for Redis?"</strong> — JSON: readable, smaller here, readable by other languages, and safe if you restrict polymorphic types. Java serialization turns Redis into an attack surface and breaks on class changes.</li>
  <li><strong>"How do you implement rate limiting across instances?"</strong> — A counter in Redis with an atomic increment and expiry (a Lua script or <code>INCR</code> + <code>EXPIRE</code> in a transaction), keyed by user or account, returning 429 with <code>Retry-After</code>. Mention fixed vs sliding window and fail-open vs fail-closed.</li>
  <li><strong>"What happens to your API if Redis goes down?"</strong> — Short timeouts plus a <code>CacheErrorHandler</code>: reads fall back to the database. Without them, measured in Chapter 17: requests hang for 60 s.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Give the <code>lab</code> cache a time-to-idle instead of a fixed TTL. Which method of <code>RedisCacheConfiguration</code> do you call, and what Redis command does each read then send in addition to <code>GET</code>?</li>
  <li>The rate limit uses a fixed window of one minute. Without writing code, describe how a sorted set (<code>ZADD</code>, <code>ZREMRANGEBYSCORE</code>, <code>ZCARD</code>) gives a sliding window, and why it still needs one Lua script.</li>
  <li>A teammate proposes counting login attempts per IP "because that is what the tutorial does". Give two reasons from this lesson why the lab counts per email instead, and one risk of counting per email.</li>
</ol></div>
${giai('Show the answers', `<p>1. <code>enableTimeToIdle()</code> together with <code>entryTtl(…)</code>. Reads then use <code>GETEX</code> with the expiry, so every hit pushes the expiry forward (Redis 6.2+). Frequently read keys never expire on their own — make sure something evicts them on change.</p><p>2. Each request adds its timestamp to a sorted set per user, removes members older than now − 60 s, and counts the rest; if the count is above the limit it is rejected. The three commands must run as one step, otherwise two concurrent requests can both count 5 and both be accepted — the same race as section 11.</p><p>3. The client controls headers such as <code>X-Forwarded-For</code> (section 15), and attackers rotate real IPs cheaply (the Instagram case). Risk: anyone can lock a victim's account for 15 minutes by sending five wrong passwords — mitigate with a short window, a CAPTCHA after the limit, or counting per email + IP pair for the lock while alerting per email.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>RedisCacheManager</strong> — the Spring CacheManager that stores each cache entry as a Redis key <code>prefix + cache name + :: + key</code>.</li>
  <li><strong>TTL / time-to-idle</strong> — fixed lifetime of a key / lifetime renewed on every read.</li>
  <li><strong>Serializer</strong> — turns Java objects into bytes for Redis and back (JDK, JSON, String).</li>
  <li><strong>Polymorphic type validator</strong> — the allow-list of classes Jackson may create from <code>@class</code>.</li>
  <li><strong>Rolling deploy</strong> — replacing instances one by one, so two code versions run together.</li>
  <li><strong>Fixed / sliding window, token bucket</strong> — three ways of counting requests for a rate limit.</li>
  <li><strong>Fail-open / fail-closed</strong> — when the limiter cannot decide, let the request through / reject it.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>JSON values with a type allow-list: 136 bytes instead of 177, readable, and a class outside the list is refused; unsafe typing creates whatever the JSON names.</li>
  <li>During a rolling deploy, v2 returned <code>building: null</code> from v1's cache entry with no error. Change the cache name when the shape changes.</li>
  <li>A local cache let instance B serve a stale status after A evicted; Redis did not.</li>
  <li>Redis frozen: 0.63 s and a WARN with the error handler, 500 without it.</li>
  <li>Rate limiting: GET-then-SET let 50 of 50 through; one Lua script let exactly 5 through. Count per user/account, return 429 + <code>Retry-After</code>, know the window boundary burst.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html', '📘', 'Spring Data Redis — Redis Cache', 'RedisCacheManager, TTL functions, cache writers and locking')}
${tl('https://redis.io/docs/latest/operate/oss_and_stack/management/security/', '🔒', 'Redis security', 'protected mode, ACL, never expose Redis to the internet')}

<h3>Sources</h3>
<ul>
  <li>HeadCrab — Aqua Nautilus, <a href="https://www.aquasec.com/blog/headcrab-attacks-servers-worldwide-with-novel-state-of-art-redis-malware/" target="_blank" rel="noopener">"HeadCrab: Novel State-of-the-Art Redis Malware"</a>, 02/2023.</li>
  <li>Instagram password-reset rate limit, Laxman Muthiyah, 07/2019 (Facebook bug bounty).</li>
  <li>All outputs: LabFlow c13 (Spring Data Redis 4.1.2, Lettuce 7.5.2) + Redis 7, two instances, 24/11/2026.</li>
</ul>
</div>
`;

const L132_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2 · Cache với Redis</span>
<h2>Redis làm cache: TTL và tuần tự hoá</h2>
<p class="lead">Cache nằm trong một JVM chết theo mỗi lần khởi động lại và nói khác các instance còn lại sau bộ cân bằng tải. Redis sửa cả hai, và đặt thêm bốn câu hỏi: byte nào được ghi vào Redis, chúng sống bao lâu, chuyện gì xảy ra khi hai phiên bản mã đọc byte của nhau trong lúc triển khai, và API làm gì khi Redis ngừng trả lời. Bài này trả lời từng câu bằng số đo trên LabFlow, rồi dùng chính Redis đó cho việc thứ hai mà backend nào cũng cần: giới hạn số lần một người được đặt lịch — kèm lỗi kinh điển cho 50 request lọt qua giới hạn 5.</p>

<h3>Đời thường trước đã</h3>
<p>Ở bài trước, cô thủ thư dán giấy nhớ trên bàn của riêng mình. Giờ thư viện mở ba quầy cùng lúc. Nếu mỗi cô giữ giấy nhớ riêng thì một chỗ sửa báo cho quầy A sẽ không bao giờ tới quầy B. Thế là thư viện treo một tấm bảng trắng chung giữa phòng: quầy nào cũng đọc và ghi lên đó. Tấm bảng là Redis. Vấn đề mới xuất hiện ngay: một dòng được ở trên bảng bao lâu thì bị xoá, viết bằng nét chữ nào để cô nào cũng đọc được, và các cô làm gì khi có người đứng chắn trước bảng?</p>

<h3>1. Spring Boot nối các mảnh thế nào</h3>
<p>Có <code>spring-boot-starter-data-redis</code> trong classpath, Boot tạo kết nối Lettuce tới <code>spring.data.redis.host:port</code> và, vì có <code>@EnableCaching</code>, tạo một <code>RedisCacheManager</code>. Hai thiết lập quan trọng hơn tất cả: <strong>timeout của lệnh</strong> (Lettuce mặc định chờ 60 s — đã đo ở Chương 17) và TTL.</p>
${MA132_PROPS}
<p>Sau đó LabFlow tự nắm cấu hình cache trong một lớp. Mỗi chú thích trong lớp là kết luận của một phép đo bên dưới:</p>
${MA132_CFG}
<p>Khi bạn khai báo bean <code>RedisCacheConfiguration</code> của riêng mình, Boot thôi áp dụng <code>spring.cache.redis.time-to-live</code> và <code>key-prefix</code> — vì thế TTL chuyển sang <code>labflow.cache.ttl</code>. Các công tắc <code>kieu</code>, <code>sau-commit</code>, <code>nuot-loi</code>, <code>khoa-ghi</code> và <code>lech</code> chỉ để chương này tắt từng ý rồi đo; giá trị mặc định của chúng là cấu hình nên dùng.</p>
${MA132_C13}

<h3>2. Byte trông thế nào: JDK hay JSON</h3>
<p>Không đặt bộ tuần tự hoá giá trị thì Spring Data Redis dùng tuần tự hoá của Java:</p>
${OUT132A}
<ul>
  <li><strong>JDK</strong>: 177 byte nhị phân, mở đầu bằng <code>\\xac\\xed\\x00\\x05</code> (số "ma thuật" của tuần tự hoá Java) và chứa nguyên tên lớp. Người không đọc được, service Node.js không đọc được, và — vấn đề bảo mật — nội dung Redis trở thành đầu vào của <code>ObjectInputStream</code>, cơ chế đứng sau cả chục năm lỗ hổng giải tuần tự hoá của Java. Ai ghi được vào Redis là đưa được đối tượng tuỳ ý vào JVM của bạn.</li>
  <li><strong>JSON</strong>: 136 byte, đọc được bằng <code>redis-cli</code>, có thuộc tính <code>@class</code> để Spring dựng lại đúng record.</li>
  <li><strong>TTL</strong>: 600 s cho <code>lab</code> (mặc định) và 30 s cho <code>thongKe</code> (ghi đè riêng từng cache). Redis tự xoá khoá hết hạn; bạn không phải viết mã dọn dẹp.</li>
</ul>
<p>Vì sao cần <code>@class</code>, và vì sao cần danh sách cho phép? Một chương trình nhỏ cho thấy cả hai:</p>
${MA132_KIEU}
${OUT132_KIEU}
<ol>
  <li>JSON không ghi kiểu đọc lại ra <code>LinkedHashMap</code> — cache "chạy được" rồi ném <code>ClassCastException</code> trong mã của bạn.</li>
  <li>Có ghi kiểu thì record được dựng lại đúng.</li>
  <li>Có danh sách cho phép, giá trị có <code>@class</code> ngoài <code>vn.labflow.*</code> / <code>java.util.*</code> bị từ chối: <em>"PolymorphicTypeValidator … denied resolution"</em>.</li>
  <li>Với <code>enableUnsafeDefaultTyping()</code>, Jackson tạo bất cứ lớp nào JSON ghi tên — ở đây là <code>java.awt.Point</code> vô hại, nhưng đó chính là cánh cửa mà các CVE "gadget" của Jackson đi qua. Đừng bao giờ dùng bản không an toàn.</li>
</ol>
<p>Chặt hơn nữa là mỗi cache một bộ tuần tự hoá có kiểu cố định (<code>new JacksonJsonRedisSerializer&lt;&gt;(LabInfo.class)</code>): không có <code>@class</code>, chỉ một kiểu khả dĩ.</p>

<h3>3. Triển khai cuốn chiếu: hai phiên bản, một Redis</h3>
<p>Ở production hiếm khi tắt hết rồi bật lại. Trong lúc triển khai cuốn chiếu (rolling deploy), mã v1 và v2 chạy song song vài phút và dùng chung cache. Ta giả lập: v2 thêm trường <code>building</code> vào <code>LabInfo</code>.</p>
${OUT132_JSON}
${OUT132_JDK}
<p>Không có exception nào — và đó mới là chỗ nguy hiểm. v2 đọc bản của v1 và trả <code>"building": null</code> trong khi CSDL ghi <code>Alpha</code>, suốt tới mười phút. v1 đọc bản của v2 và lặng lẽ bỏ trường thừa. Tuần tự hoá Java ở đây cũng êm chỉ vì <code>LabInfo</code> là <em>record</em>: record bỏ qua <code>serialVersionUID</code> và được dựng qua constructor chính, trường thiếu nhận giá trị mặc định. Một lớp thường không khai <code>serialVersionUID</code> sẽ ném <code>InvalidClassException</code> ở mọi lần đọc.</p>
<p>Các nhóm làm thế này: khi <em>hình dạng</em> giá trị cache đổi thì đổi tên cache hoặc tiền tố (<code>lab</code> → <code>lab-v2</code>, hoặc <code>labflow::v2::</code>) để hai phiên bản không bao giờ đọc bản của nhau; khoá cũ tự hết hạn theo TTL. Rẻ, nhàm chán, hiệu quả.</p>

<h3>4. Nhiều instance: cache chung hay cache riêng</h3>
${OUT132_HAI}
<ul>
  <li>Mục 6: instance A tính thống kê, B trả cùng <code>tinhLuc</code> với không truy vấn thật nào. Một lần tính cho cả cụm.</li>
  <li>Mục 7: với <code>spring.cache.type=simple</code> (mỗi JVM một map), quản lý đổi HW-04 sang MAINTENANCE qua A. A trả MAINTENANCE, B vẫn trả ACTIVE: map của B không hề biết có lần xoá. Sinh viên rơi vào B vẫn đặt được phòng đang bảo trì.</li>
  <li>Mục 8: cùng các bước với Redis — xoá một chỗ, mọi instance đều thấy.</li>
</ul>
<p>Cache cục bộ (Caffeine) nhanh hơn Redis và ổn với dữ liệu không bao giờ đổi hoặc cũ vài giây cũng không sao; với thứ quản trị viên sửa được thì dùng cache chung hoặc TTL rất ngắn. Cache hai tầng (cục bộ + Redis, kèm tin nhắn báo xoá) có tồn tại, nhưng là công cụ để sau này, không phải cho SWP391.</p>

<h3>5. Khi Redis ngừng trả lời</h3>
${OUT132_CHET}
<p>Có <code>CacheErrorHandler</code> và timeout 500 ms, Redis đứng hình chỉ tốn một lần timeout và một dòng WARN; API trả lời từ CSDL (0,63 s). Không có handler, cùng lần timeout đó thành lỗi 500 cho người dùng. Cache là phần tối ưu: không bao giờ được là lý do một endpoint hỏng.</p>

<h3>6. Redis cho việc khác: giới hạn tần suất</h3>
<p>LabFlow nên từ chối lượt đặt thứ sáu của cùng một người trong một phút (script, người bấm đúp, bot). Mọi instance phải đếm chung, nên bộ đếm nằm trong Redis. Bản hiển nhiên là đọc, so sánh, rồi ghi:</p>
${MA132_NGAYTHO}
${OUT132_DUA}
<p>50 request cùng lúc: <strong>lọt cả 50</strong>, và bộ đếm dừng ở 1. Request nào cũng đọc được 0 trước khi bất kỳ request nào kịp ghi. Đây là cuộc đua giữa "kiểm tra" và "hành động" — cùng hình dạng với đặt trùng ở Chương 18, chỉ là trong Redis. Cách sửa là để Redis kiểm tra và tăng trong một bước. <code>INCR</code> là nguyên tử; đặt hạn sống cũng phải nằm trong cùng bước, nếu không thì chết giữa hai lệnh sẽ để lại bộ đếm không bao giờ hết hạn. Một script Lua chạy nguyên tử trên server Redis:</p>
${MA132_GH}
<p>Cũng 50 request đó: đúng 5×200 và 45×429. Bộ đếm ghi 50 vì request bị từ chối cũng được đếm — đúng điều bạn muốn khi đối phó với script. Gắn vào LabFlow:</p>
${MA132_DAT}
${MA132_429}
${OUT132_DAT}
<p>Ghi chú từ lần chạy: request cho ngày 31/11 bị từ chối 400 ngay lúc đọc body, trước khi phương thức chạy, nên không bị đếm — giới hạn đặt trong filter thì sẽ đếm. Phản hồi 429 là <code>application/problem+json</code> với mã ổn định <code>RATE_LIMITED</code> và header <code>Retry-After</code>, nên trang React nói được "thử lại sau 60 giây" mà không phải đọc câu chữ.</p>
<p><strong>Cho qua hay chặn lại khi không quyết được?</strong> Khi Redis đứng hình, LabFlow cho lượt đặt đi qua (201 sau khoảng một giây timeout) và ghi WARN (fail-open). Với đặt lịch, sẵn sàng phục vụ quan trọng hơn một giới hạn hoàn hảo. Với số lần thử đăng nhập (lab của chương này) nhiều nhóm chọn ngược lại (fail-closed). Hãy ghi quyết định đó ra giấy.</p>
<p>Hai điểm yếu cần biết tên. Thứ nhất là khoá: nếu đếm theo IP mà IP lấy từ header do client gửi, giới hạn biến mất:</p>
${MA132_IP}
${OUT132_IP}
<p>Thứ hai, <strong>cửa sổ cố định</strong> cho phép dồn request ở ranh giới:</p>
${OUT132_RANH}
<p>Một request mở cửa sổ 10 giây; 9,5 s sau bốn request nữa lọt (cửa sổ còn 366 ms), và 0,6 s sau cửa sổ mới cho thêm năm: chín request được nhận trong chưa tới một giây với giới hạn "5 lần mỗi 10 giây". Cửa sổ trượt (sorted set các mốc thời gian) hoặc token bucket (Bucket4j có bản dùng Redis) làm mượt chỗ này; với "5 lượt đặt mỗi phút" thì cửa sổ cố định thường là đủ — miễn là bạn biết mình đánh đổi gì.</p>

<h3>🕵️ Góc hacker — HeadCrab, 2021–2023</h3>
<p>Redis bản mã nguồn mở mặc định không có xác thực, và chính tài liệu của Redis nói nó được thiết kế để chỉ client tin cậy truy cập. Năm 2023, nhóm Aqua Nautilus công bố mã độc HeadCrab đã chiếm ít nhất 1.200 server Redis mở ra internet kể từ tháng 9/2021: kẻ tấn công kết nối vào, biến máy nạn nhân thành bản sao (replica) của một server Redis do chúng điều khiển, và "đồng bộ" đó nạp một module độc hại chạy mã và đào tiền số. Cách phòng, nói theo LabFlow: Redis chỉ nghe trên mạng riêng (tệp compose ở Chương 17 không có <code>ports</code> cho Redis; ở chương này nó chỉ bind <code>127.0.0.1</code>), có <code>requirepass</code> hoặc người dùng ACL khi rời khỏi một máy, không bao giờ <code>protected-mode no</code> trên giao diện công khai, và ứng dụng coi nội dung Redis là đầu vào không tin cậy — lý do JSON có danh sách cho phép hơn hẳn tuần tự hoá Java.</p>
<p>Còn với giới hạn tần suất: năm 2019, nhà nghiên cứu Laxman Muthiyah chỉ ra mã khôi phục mật khẩu của Instagram dò được, vì giới hạn tính theo IP; có đủ địa chỉ IP (rẻ trên cloud) thì một triệu mã nằm trong tầm tay. Lab của chương này giới hạn số lần đăng nhập theo <em>tài khoản</em> vì lý do đó.</p>

<h3>So với Node.js</h3>
<p>Node dùng cùng Redis và cùng lệnh: <code>node-redis</code> hoặc <code>ioredis</code>, còn giới hạn tần suất thì <code>rate-limiter-flexible</code> hoặc <code>express-rate-limit</code> với kho Redis — chúng cũng dùng script Lua nguyên tử. <code>express-rate-limit</code> mặc định đếm theo IP và có thiết lập <code>trust proxy</code>; đặt sai là dựng lại mục 15. Giá trị trong Node mặc định là JSON nên không có bẫy tuần tự hoá JDK, nhưng chuyện đổi hình dạng khi triển khai cuốn chiếu thì vẫn y nguyên.</p>

<h3>Khi đi làm</h3>
<p>Danh sách kiểm cho cache Redis trong dự án nhóm: mỗi ứng dụng một tiền tố (<code>labflow::</code>) vì Redis hay bị dùng chung; khoá nào cũng có TTL; giá trị là JSON; timeout tính bằng mili giây chứ không phải giây; có error handler; có <code>maxmemory</code> kèm chính sách loại bỏ; không mở cổng công khai; và một ghi chú ngắn trong README liệt kê cache nào tồn tại, TTL bao nhiêu, ai xoá chúng. Với SWP391, bảng đó đáng giá hơn mọi đoạn mã cache khéo léo.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Vì sao dùng Redis thay vì cache trong bộ nhớ?"</strong> — Mọi instance dùng chung (xoá một chỗ, mọi nơi thấy — đã đo ở trên), không mất khi ứng dụng khởi động lại, bộ nhớ có giới hạn và chính sách loại bỏ. Cái giá là một vòng mạng và thêm một thứ phải vận hành.</li>
  <li><strong>"Tuần tự hoá JDK hay JSON cho Redis?"</strong> — JSON: đọc được, ở đây nhỏ hơn, ngôn ngữ khác đọc được, và an toàn nếu giới hạn kiểu đa hình. Tuần tự hoá Java biến Redis thành bề mặt tấn công và vỡ khi lớp đổi.</li>
  <li><strong>"Làm giới hạn tần suất cho nhiều instance thế nào?"</strong> — Bộ đếm trong Redis với tăng và đặt hạn sống nguyên tử (script Lua, hoặc <code>INCR</code> + <code>EXPIRE</code> trong một transaction), khoá theo người dùng hoặc tài khoản, trả 429 kèm <code>Retry-After</code>. Nhắc tới cửa sổ cố định/trượt và fail-open/fail-closed.</li>
  <li><strong>"Redis chết thì API của bạn ra sao?"</strong> — Timeout ngắn cộng <code>CacheErrorHandler</code>: lần đọc quay về CSDL. Không có chúng, như đã đo ở Chương 17: request treo 60 s.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Cho cache <code>lab</code> dùng thời gian rảnh (time-to-idle) thay cho TTL cố định. Gọi phương thức nào của <code>RedisCacheConfiguration</code>, và khi đó mỗi lần đọc gửi lệnh Redis nào thay cho <code>GET</code>?</li>
  <li>Giới hạn tần suất đang dùng cửa sổ cố định một phút. Không cần viết mã, hãy tả cách một sorted set (<code>ZADD</code>, <code>ZREMRANGEBYSCORE</code>, <code>ZCARD</code>) cho ra cửa sổ trượt, và vì sao vẫn cần một script Lua.</li>
  <li>Một bạn trong nhóm đề xuất đếm số lần đăng nhập theo IP "vì tutorial làm vậy". Nêu hai lý do từ bài này để lab đếm theo email, và một rủi ro của việc đếm theo email.</li>
</ol></div>
${giai('Xem đáp án', `<p>1. <code>enableTimeToIdle()</code> cùng với <code>entryTtl(…)</code>. Khi đó lần đọc dùng <code>GETEX</code> kèm hạn sống, nên mỗi lần trúng lại đẩy hạn ra sau (Redis 6.2+). Khoá được đọc thường xuyên sẽ không tự hết hạn — phải chắc chắn có chỗ xoá chúng khi dữ liệu đổi.</p><p>2. Mỗi request thêm mốc thời gian của nó vào một sorted set của người dùng, xoá các phần tử cũ hơn hiện tại − 60 s, rồi đếm phần còn lại; vượt giới hạn thì từ chối. Ba lệnh phải chạy như một bước, nếu không hai request đồng thời có thể cùng đếm được 5 và cùng được nhận — đúng cuộc đua ở mục 11.</p><p>3. Client điều khiển được header như <code>X-Forwarded-For</code> (mục 15), và kẻ tấn công đổi IP thật rất rẻ (vụ Instagram). Rủi ro: ai cũng khoá được tài khoản của nạn nhân 15 phút bằng năm lần gửi sai mật khẩu — giảm nhẹ bằng cửa sổ ngắn, CAPTCHA sau khi chạm giới hạn, hoặc khoá theo cặp email + IP còn cảnh báo theo email.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>RedisCacheManager</strong> — CacheManager của Spring lưu mỗi mục cache thành một khoá Redis <code>tiền tố + tên cache + :: + khoá</code>.</li>
  <li><strong>TTL / time-to-idle</strong> — thời gian sống cố định của khoá / thời gian sống được gia hạn mỗi lần đọc.</li>
  <li><strong>Serializer (bộ tuần tự hoá)</strong> — đổi đối tượng Java thành byte cho Redis và ngược lại (JDK, JSON, String).</li>
  <li><strong>Polymorphic type validator</strong> — danh sách lớp mà Jackson được phép tạo từ <code>@class</code>.</li>
  <li><strong>Rolling deploy (triển khai cuốn chiếu)</strong> — thay từng instance một, nên hai phiên bản mã chạy cùng lúc.</li>
  <li><strong>Cửa sổ cố định / trượt, token bucket</strong> — ba cách đếm request cho giới hạn tần suất.</li>
  <li><strong>Fail-open / fail-closed</strong> — khi bộ giới hạn không quyết được thì cho request qua / từ chối.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Giá trị JSON có danh sách kiểu cho phép: 136 byte thay vì 177, đọc được, lớp ngoài danh sách bị từ chối; chế độ không an toàn tạo bất cứ thứ gì JSON ghi tên.</li>
  <li>Khi triển khai cuốn chiếu, v2 trả <code>building: null</code> từ bản cache của v1 mà không báo lỗi. Đổi tên cache khi hình dạng đổi.</li>
  <li>Cache cục bộ để instance B trả trạng thái cũ sau khi A đã xoá; Redis thì không.</li>
  <li>Redis đứng hình: 0,63 s và một dòng WARN khi có error handler, 500 khi không có.</li>
  <li>Giới hạn tần suất: GET-rồi-SET để lọt 50/50; một script Lua để lọt đúng 5. Đếm theo người dùng/tài khoản, trả 429 + <code>Retry-After</code>, biết chuyện dồn request ở ranh giới cửa sổ.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html', '📘', 'Spring Data Redis — Redis Cache', 'RedisCacheManager, hàm TTL, cache writer và khoá')}
${tl('https://redis.io/docs/latest/operate/oss_and_stack/management/security/', '🔒', 'Bảo mật Redis', 'protected mode, ACL, không bao giờ mở Redis ra internet')}

<h3>Nguồn</h3>
<ul>
  <li>HeadCrab — Aqua Nautilus, <a href="https://www.aquasec.com/blog/headcrab-attacks-servers-worldwide-with-novel-state-of-art-redis-malware/" target="_blank" rel="noopener">"HeadCrab: Novel State-of-the-Art Redis Malware"</a>, 02/2023.</li>
  <li>Giới hạn khôi phục mật khẩu Instagram, Laxman Muthiyah, 07/2019 (chương trình bug bounty của Facebook).</li>
  <li>Mọi output: LabFlow c13 (Spring Data Redis 4.1.2, Lettuce 7.5.2) + Redis 7, hai instance, 24/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 13.3 =====
const MA133_PATCH = java("@PatchMapping(\"/{code}/status\")\n@PreAuthorize(\"hasRole('MANAGER')\")\n@Transactional\n@CacheEvict(cacheNames = \"lab\", key = \"#code\")   // đổi trạng thái ⇒ bỏ bản cache cũ\nLabInfo doiTrangThai(@PathVariable String code, @Valid @RequestBody DoiTrangThai r) {\n    Lab l = labs.findByCode(code).orElseThrow(() -> LoiNghiepVu.khongThay(\"phòng \" + code));\n    l.doiTrangThai(r.status());\n    return l.info();\n}");
const MA133_DOI = java("/**\n * Kiểu viết rất hay gặp: service @Transactional gọi sang một bean KHÁC có @CacheEvict, rồi còn việc khác trước khi commit.\n * chamMs nới rộng khoảng \"đã xoá cache\" → \"commit\" để nhìn thấy (giả lập ghi nhật ký, gửi sự kiện… trước commit).\n */\n@Service\n@Profile(\"c13\")\nclass DoiCham {\n    private static final Logger log = LoggerFactory.getLogger(DoiCham.class);\n    private final JdbcTemplate db; private final XoaCacheLab xoaCache;\n    DoiCham(JdbcTemplate db, XoaCacheLab x) { this.db = db; xoaCache = x; }\n\n    @Transactional\n    public void doi(String code, String status, long chamMs) {\n        db.update(\"update labs set status = ? where code = ?\", status, code);\n        log.info(\"đã UPDATE {} = {} (chưa commit)\", code, status);\n        xoaCache.xoa(code);                                   // @CacheEvict chạy NGAY lúc này — vẫn trong transaction\n        log.info(\"đã gọi xoá cache {}\", code);\n        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {\n            public void beforeCommit(boolean readOnly) {\n                log.info(\"trước commit: chờ {} ms\", chamMs);\n                try { Thread.sleep(chamMs); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }\n            }\n            public void afterCommit() { log.info(\"ĐÃ COMMIT {} = {}\", code, status); }\n        });\n    }\n}");
const MA133_XOA = java("/** Bean nhỏ chỉ để xoá khoá cache \"lab\" (hay gặp: CacheHelper, CacheService…). */\n@Component\n@Profile(\"c13\")\nclass XoaCacheLab {\n    @CacheEvict(cacheNames = \"lab\", key = \"#code\")\n    public void xoa(String code) { }\n}");
const MA133_DOC = java("/** Một lần đọc CHẬM vào cache \"lab\": đọc CSDL xong, mất chamMs (GC, CPU bận, mạng chậm…) rồi mới ghi vào cache. */\n@Service\n@Profile(\"c13\")\nclass DocCham {\n    private static final Logger log = LoggerFactory.getLogger(DocCham.class);\n    private final JdbcTemplate db;\n    DocCham(JdbcTemplate db) { this.db = db; }\n\n    @Cacheable(cacheNames = \"lab\", key = \"#code\")\n    public LabInfo doc(String code, long chamMs) throws InterruptedException {\n        LabInfo l = db.queryForObject(\"select id, code, name, capacity, status from labs where code = ?\",\n                (r, i) -> new LabInfo(r.getLong(1), r.getString(2), r.getString(3), r.getInt(4), r.getString(5), r.getInt(4) > 30), code);\n        log.info(\"đọc CSDL {} = {}, chậm {} ms rồi mới ghi cache\", code, l.status(), chamMs);\n        Thread.sleep(chamMs);\n        return l;\n    }\n}");
const MA133_HAILAN = java("/** Xoá hai lần: xoá ngay sau commit, rồi xoá LẠI sau \"tre\" ms để dọn bản cũ do một lần đọc chậm ghi vào. */\n@PostMapping(\"/api/v1/demo13/doi-xoa-hai-lan/{code}\") void doiXoaHaiLan(@PathVariable String code, @RequestParam String status, @RequestParam(defaultValue = \"3000\") long tre) {\n    doiCham.doi(code, status, 0);\n    CompletableFuture.runAsync(() -> { xoaCache.xoa(code); log.info(\"xoá lần hai {}\", code); }, CompletableFuture.delayedExecutor(tre, TimeUnit.MILLISECONDS));\n}");
const MA133_SYNC = java("/** sync = true: nhiều luồng cùng hỏi một khoá đang trống ⇒ một luồng tính, các luồng khác CHỜ kết quả. */\n@Cacheable(cacheNames = \"thongKeSync\", key = \"#code\", sync = true)\npublic ThongKe theoPhongSync(String code) { return tinh(code); }");
const OUT133_BYPASS = out("## 1 ghi THẲNG vào CSDL (script bảo trì, công cụ quản trị, service khác) — cache không hề biết\n$ curl -s $API/api/v1/labs/IOT-01 | jq -c '{code,status}'\n{\"code\":\"IOT-01\",\"status\":\"ACTIVE\"}\n\n$ psql -c \"update labs set status = 'MAINTENANCE' where code = 'IOT-01'\"\nUPDATE 1\n\n$ curl -s $API/api/v1/labs/IOT-01 | jq -c '{code,status}'; redis-cli ttl labflow::lab::IOT-01\n{\"code\":\"IOT-01\",\"status\":\"ACTIVE\"}\n600\n\n$ curl -s -H \"Authorization: Bearer $AN\" -H \"$J\" -H \"Idempotency-Key: an-bao-tri-$RANDOM\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T09:00:00\",\"endAt\":\"2026-11-26T10:00:00\",\"purpose\":\"phong dang bao tri\"}' $API/api/v1/bookings | jq -c '{id,status}'\n{\"id\":7,\"status\":\"CONFIRMED\"}\n\n## 2 đổi qua API (có @CacheEvict) ⇒ khoá bị xoá ⇒ lần đọc sau thấy đúng\n$ curl -s -X PATCH -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"status\":\"MAINTENANCE\"}' $API/api/v1/labs/IOT-01/status | jq -c '{code,status}'\n{\"code\":\"IOT-01\",\"status\":\"MAINTENANCE\"}\n\n$ redis-cli exists labflow::lab::IOT-01\n0\n\n$ curl -s -H \"Authorization: Bearer $AN\" -H \"$J\" -H \"Idempotency-Key: an-bao-tri-$RANDOM\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T11:00:00\",\"endAt\":\"2026-11-26T12:00:00\",\"purpose\":\"phong dang bao tri\"}' $API/api/v1/bookings | jq -c '{status,code,detail}'\n{\"status\":422,\"code\":\"LAB_UNAVAILABLE\",\"detail\":\"phòng IOT-01 đang MAINTENANCE\"}");
const OUT133_CUNG = out("## @Transactional và @CacheEvict trên CÙNG một phương thức (bản DoiCham đầu tiên, labflow.cache.sau-commit=false) — log thật 24/11 12:31\n12:31:55.350 DoiCham: đã UPDATE NET-02 = MAINTENANCE (chưa commit)\n12:31:55.351 DoiCham: trước commit: chờ 1500 ms\n12:31:55.864 CacheInterceptor: Cache entry for key 'NET-02' found in cache(s) [lab]\n12:31:56.857 DoiCham: ĐÃ COMMIT NET-02 = MAINTENANCE\n12:31:56.860 CacheInterceptor: Invalidating cache key [NET-02]\n12:31:57.888 CacheInterceptor: No cache entry for key 'NET-02' in cache(s) [lab]");
const OUT133_TRUOC = out("## 3 service @Transactional gọi bean KHÁC có @CacheEvict — KHÔNG bật transactionAware (labflow.cache.sau-commit=false)\n$ curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'\n{\"code\":\"NET-02\",\"status\":\"ACTIVE\"}\n\n$ (curl -s -X POST \"$API/api/v1/demo13/doi-cham/NET-02?status=MAINTENANCE&ms=1500\" &); sleep 0.5; curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'; echo \"   ← đọc lúc 0,5 s\"\n{\"code\":\"NET-02\",\"status\":\"ACTIVE\"}\n   ← đọc lúc 0,5 s\n\n$ sleep 2; curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'; echo \"   ← đọc lúc 2,5 s (đã commit)\"\n{\"code\":\"NET-02\",\"status\":\"ACTIVE\"}\n   ← đọc lúc 2,5 s (đã commit)\n\n$ psql -c \"select code, status from labs where code = 'NET-02'\"\n  code  |   status    \n--------+-------------\n NET-02 | MAINTENANCE\n(1 row)\n\n$ redis-cli ttl labflow::lab::NET-02\n598\n\n$ docker logs labflow | grep -E \"Invalidating cache key|DoiCham|No cache entry|found in cache\" | grep \"NET-02\" | sed -E 's/^[0-9-]+T([0-9:.]+)Z.*\\] [a-z0-9.]*\\.([A-Za-z0-9]+) +: /\\1 \\2: /; s/ for operation Builder.*//'\n12:33:54.252 CacheInterceptor: No cache entry for key 'NET-02' in cache(s) [lab]\n12:33:54.395 DoiCham: đã UPDATE NET-02 = MAINTENANCE (chưa commit)\n12:33:54.396 CacheInterceptor: Invalidating cache key [NET-02]\n12:33:54.402 DoiCham: đã gọi xoá cache NET-02\n12:33:54.894 CacheInterceptor: No cache entry for key 'NET-02' in cache(s) [lab]\n12:33:55.910 DoiCham: ĐÃ COMMIT NET-02 = MAINTENANCE\n12:33:56.957 CacheInterceptor: Cache entry for key 'NET-02' found in cache(s) [lab]");
const OUT133_SAU = out("## 4 cùng mã, bật RedisCacheManager.transactionAware() (cấu hình của LabFlow): xoá được HOÃN tới sau commit\n$ curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'\n{\"code\":\"NET-02\",\"status\":\"ACTIVE\"}\n\n$ (curl -s -X POST \"$API/api/v1/demo13/doi-cham/NET-02?status=MAINTENANCE&ms=1500\" &); sleep 0.5; curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'; echo \"   ← đọc lúc 0,5 s\"\n{\"code\":\"NET-02\",\"status\":\"ACTIVE\"}\n   ← đọc lúc 0,5 s\n\n$ sleep 2; curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'; echo \"   ← đọc lúc 2,5 s (đã commit)\"\n{\"code\":\"NET-02\",\"status\":\"MAINTENANCE\"}\n   ← đọc lúc 2,5 s (đã commit)\n\n$ docker logs labflow | grep -E \"Invalidating cache key|DoiCham|No cache entry|found in cache\" | grep \"NET-02\" | sed -E 's/^[0-9-]+T([0-9:.]+)Z.*\\] [a-z0-9.]*\\.([A-Za-z0-9]+) +: /\\1 \\2: /; s/ for operation Builder.*//'\n12:34:09.287 CacheInterceptor: No cache entry for key 'NET-02' in cache(s) [lab]\n12:34:09.450 DoiCham: đã UPDATE NET-02 = MAINTENANCE (chưa commit)\n12:34:09.453 CacheInterceptor: Invalidating cache key [NET-02]\n12:34:09.454 DoiCham: đã gọi xoá cache NET-02\n12:34:09.968 CacheInterceptor: Cache entry for key 'NET-02' found in cache(s) [lab]\n12:34:10.972 DoiCham: ĐÃ COMMIT NET-02 = MAINTENANCE\n12:34:11.996 CacheInterceptor: No cache entry for key 'NET-02' in cache(s) [lab]");
const OUT133_DOCCHAM = out("## 5 vẫn transactionAware, nhưng một lần ĐỌC chậm: đọc CSDL trước khi đổi, ghi cache sau khi đã xoá\n$ (curl -s \"$API/api/v1/demo13/doc-cham/NET-02?ms=1500\" > /dev/null &); sleep 0.3; curl -s -X PATCH -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"status\":\"MAINTENANCE\"}' $API/api/v1/labs/NET-02/status | jq -c '{code,status}'; echo \"   ← quản lý đổi lúc 0,3 s\"\n{\"code\":\"NET-02\",\"status\":\"MAINTENANCE\"}\n   ← quản lý đổi lúc 0,3 s\n\n$ sleep 2; curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'; echo \"   ← đọc lúc 2,3 s\"\n{\"code\":\"NET-02\",\"status\":\"ACTIVE\"}\n   ← đọc lúc 2,3 s\n\n$ redis-cli ttl labflow::lab::NET-02\n599\n\n$ docker logs labflow | grep -E \"DocCham|Invalidating cache key\" | grep \"NET-02\" | tail -2 | sed -E 's/^[0-9-]+T([0-9:.]+)Z.*\\] [a-z0-9.]*\\.([A-Za-z0-9]+) +: /\\1 \\2: /; s/ for operation Builder.*//'\n12:34:12.502 DocCham: đọc CSDL NET-02 = ACTIVE, chậm 1500 ms rồi mới ghi cache\n12:34:12.877 CacheInterceptor: Invalidating cache key [NET-02]");
const OUT133_HAILAN = out("## 6 xoá HAI lần (lần hai sau 3 s): bản cũ do lần đọc chậm ghi vào bị dọn\n$ (curl -s \"$API/api/v1/demo13/doc-cham/NET-02?ms=1500\" > /dev/null &); sleep 0.3; curl -s -X POST \"$API/api/v1/demo13/doi-xoa-hai-lan/NET-02?status=MAINTENANCE&tre=3000\"; echo \"   ← đổi lúc 0,3 s\"\n   ← đổi lúc 0,3 s\n\n$ sleep 2; curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'; echo \"   ← đọc lúc 2,3 s: còn bản cũ\"\n{\"code\":\"NET-02\",\"status\":\"ACTIVE\"}\n   ← đọc lúc 2,3 s: còn bản cũ\n\n$ sleep 1.5; curl -s $API/api/v1/labs/NET-02 | jq -c '{code,status}'; echo \"   ← đọc lúc 3,8 s: sau lần xoá thứ hai\"\n{\"code\":\"NET-02\",\"status\":\"MAINTENANCE\"}\n   ← đọc lúc 3,8 s: sau lần xoá thứ hai");
const OUT133_STAMP = out("## 7 bùng tải (stampede): khoá vừa hết hạn, 50 request CÙNG LÚC\n$ xoadem\n\n$ dong 50 $API/api/v1/demo13/thong-ke/AI-03\n50×200  · tổng 4284 ms\n\n$ dem\n{\"truyVanThat\":50}\n\n## 8 sync = true: trong MỘT instance chỉ một luồng tính, 49 luồng chờ\n$ dong 50 $API/api/v1/demo13/thong-ke-sync/AI-03\n50×200  · tổng 3838 ms\n\n$ dem\n{\"truyVanThat\":100}\n\n$ docker logs labflow | grep -c 'TÍNH thống kê AI-03'\n100");
const OUT133_KHOA = out("## 9 sync = true, writer mặc định (KHÔNG khoá), hai instance, 50 request xen kẽ A/B cùng lúc\n$ hai 50 /api/v1/demo13/thong-ke-sync/AI-03\n50×200  · tổng 4238 ms\n\n$ dem2\nA: {\"truyVanThat\":25} · B: {\"truyVanThat\":25}\n\n## 8b sync = true + RedisCacheWriter.lockingRedisCacheWriter (labflow.cache.khoa-ghi=true), hai instance\n$ hai 50 /api/v1/demo13/thong-ke-sync/AI-03\n50×200  · tổng 1384 ms\n\n$ dem2\nA: {\"truyVanThat\":0} · B: {\"truyVanThat\":1}\n\n## 9c Redis thấy gì: một khoá khoá cho CẢ cache thongKeSync (không phải cho từng mã phòng)\n$ (timeout 2 redis-cli monitor > /tmp/mon.txt &); sleep 0.3; curl -s -o /dev/null $API/api/v1/demo13/thong-ke-sync/NET-02; sleep 2; grep -oE '\"(SET|DEL|GET|EXISTS)\" \"[^\"]*\"( \"[^\"]*\")?' /tmp/mon.txt | cut -c1-90 | uniq -c; rm -f /tmp/mon.txt\n      1 \"EXISTS\" \"thongKeSync~lock\"\n      1 \"GET\" \"labflow::thongKeSync::NET-02\"\n      1 \"EXISTS\" \"thongKeSync~lock\"\n      1 \"SET\" \"thongKeSync~lock\" \"\"\n      1 \"GET\" \"labflow::thongKeSync::NET-02\"\n      1 \"SET\" \"labflow::thongKeSync::NET-02\" \"{\\\"\n      1 \"DEL\" \"thongKeSync~lock\"");
const OUT133_LECH = out("## 10 TTL có độ lệch ngẫu nhiên (labflow.cache.lech=60s): 4 khoá ghi cùng giây không hết hạn cùng giây\n$ for c in IOT-01 NET-02 AI-03 HW-04; do curl -s -o /dev/null $API/api/v1/labs/$c; done\n\n$ for c in IOT-01 NET-02 AI-03 HW-04; do echo \"$c $(redis-cli ttl labflow::lab::$c)\"; done\nIOT-01 647\nNET-02 657\nAI-03 629\nHW-04 611");
const OUT133_SODO = out("## 11 số đo của cache (spring.cache.redis.enable-statistics + Actuator): 1 miss, 9 hit\n$ for i in $(seq 10); do curl -s -o /dev/null $API/api/v1/labs/AI-03; done\n\n$ for r in hit miss; do echo \"$r: $(curl -s \"$API/actuator/metrics/cache.gets?tag=name:lab&tag=result:$r\" | jq '.measurements[0].value')\"; done\nhit: 9.0\nmiss: 1.0\n\n$ curl -s \"$API/actuator/metrics/cache.puts?tag=name:lab\" | jq -c '{name,value: .measurements[0].value}'\n{\"name\":\"cache.puts\",\"value\":1.0}\n\n$ redis-cli info stats | grep -E 'keyspace_(hits|misses)'\nkeyspace_hits:488\r\nkeyspace_misses:1056");

const L133_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3 · Caching with Redis</span>
<h2>Invalidation, stampede and consistency</h2>
<p class="lead">"There are only two hard things in computer science: cache invalidation and naming things." This lesson shows why the first one is hard, with timestamps instead of jokes. We let a student book a room that is under maintenance, watch an eviction happen 1.5 seconds before the data it protects is committed, catch a slow reader putting old data back after a correct eviction, and fire 50 requests at an expired key — then fix each case and measure the fix. The chapter ends with the question every senior asks: should this be cached at all?</p>

<h3>Everyday picture first</h3>
<p>The whiteboard in the library says "Lab IoT: open". At 9:00 the technician closes the lab for repairs and tells the head librarian, who erases the line. But at 8:59 a librarian had walked to the archive to check the lab's status; she comes back at 9:01 with "open" — the old answer, read before the change — and writes it on the freshly erased whiteboard. Everyone now reads "open" until the line expires. Nobody did anything wrong in isolation; the order of events did it. That is the whole of this lesson.</p>

<h3>1. Cache-aside and its one rule</h3>
<p>Spring's <code>@Cacheable</code> + <code>@CacheEvict</code> implement <strong>cache-aside</strong>: reads fill the cache, writes go to the database and then <em>delete</em> the key. The alternatives you will hear about: <strong>read-through</strong> (the cache loads from the database itself), <strong>write-through</strong> (every write goes to cache and database together), <strong>write-behind</strong> (write to cache, flush to the database later — fast and dangerous). The one rule of cache-aside: <strong>every path that changes the data must evict the key.</strong> Here is a path that does not:</p>
${OUT133_BYPASS}
<p>A maintenance script (or a teammate in pgAdmin, or another service) changed the status directly in PostgreSQL. The API kept saying ACTIVE for the remaining 600 seconds, and the booking rule — which reads the lab through the cached <code>LabCatalog</code> — <strong>accepted a booking on a lab under maintenance</strong> (booking 7, CONFIRMED). Through the API, the eviction works and the same booking is refused with <code>LAB_UNAVAILABLE</code>:</p>
${MA133_PATCH}
<p>Lessons: (1) data that a business rule depends on should be read from the database at decision time, or cached with a TTL short enough that you can accept the error; (2) if other writers exist, the TTL is your only safety net — choose it on purpose; (3) admin scripts go through the API, or end with a <code>DEL</code> of the keys they touch.</p>

<h3>2. Evicting before the commit</h3>
<p>LabFlow's own endpoint is safe. We measured that when <code>@Transactional</code> and <code>@CacheEvict</code> sit on the <em>same</em> method, the eviction happens after the commit (log of the first experiment, 1.5 s of extra work before commit):</p>
${OUT133_CUNG}
<p>But code rarely stays that simple. A very common shape: a <code>@Transactional</code> service calls a small helper bean whose method has <code>@CacheEvict</code>, then does more work (audit log, events) before committing:</p>
${MA133_DOI}
${MA133_XOA}
${OUT133_TRUOC}
<p>Read the timeline. 54.396: the key is deleted — the transaction is still open. 54.894: a reader misses, reads the database, sees the <em>committed</em> value ACTIVE (PostgreSQL never shows uncommitted rows to others), and caches it. 55.910: the commit. From then on the database says MAINTENANCE and the cache says ACTIVE for 598 more seconds. The fix is one line in LabFlow's configuration: <code>RedisCacheManagerBuilder.transactionAware()</code>, which wraps every cache so that put and evict calls made inside a transaction are executed <em>after commit</em>:</p>
${OUT133_SAU}
<p>The interceptor still logs "Invalidating" at 09.453, but the real <code>DEL</code> is postponed: the reader at 0.5 s gets ACTIVE from the cache (correct — nothing is committed yet), and the first read after the commit gets MAINTENANCE.</p>

<h3>3. The race that transactionAware cannot fix</h3>
<p>Now the librarian from the everyday picture: a reader that is slow <em>between</em> reading the database and writing the cache — a GC pause, a busy CPU, a slow network to Redis. We make it 1.5 s on purpose:</p>
${MA133_DOC}
${OUT133_DOCCHAM}
<p>The reader read ACTIVE at 12.502; the manager's change committed and evicted at 12.877 (nothing to evict yet); at about 14.0 the reader wrote ACTIVE into the cache. Result: stale for 599 seconds, with every component behaving "correctly". This is the race described in Facebook's Memcache paper (NSDI 2013), which they solved with <strong>leases</strong>. Practical fixes, cheapest first:</p>
<ul>
  <li>a TTL you can live with (the bound on how long any of these races can last);</li>
  <li><strong>delayed double delete</strong>: delete after commit, then delete again a few seconds later, longer than a slow read — a pattern you will meet in many backend teams;</li>
  <li>versioned values (store a version number; never overwrite a newer version) or leases, when correctness really matters.</li>
</ul>
${MA133_HAILAN}
${OUT133_HAILAN}
<p>At 2.3 s the stale ACTIVE is still there; after the second delete at 3.3 s the next read is MAINTENANCE. The window shrank from ten minutes to three seconds.</p>

<h3>4. Stampede: everyone misses at once</h3>
<p>When a popular key expires, every request that arrives before it is refilled misses — and all of them run the expensive query. Fifty requests at the same moment on an empty key:</p>
${OUT133_STAMP}
<p>Without <code>sync</code>: 50 real queries (4.3 s in total, the database doing the same scan fifty times in parallel). With <code>sync = true</code> the counter went from 50 to 100: <strong>still 50 queries</strong>. That surprised us, so we read the bytecode of Spring Data Redis 4.1.2: <code>RedisCache.get(key, valueLoader)</code> simply delegates to the cache writer, and the default writer only locks if it is a <em>locking</em> writer. With <code>RedisCacheManager</code> as Boot configures it, <code>sync = true</code> gives no protection.</p>
${MA133_SYNC}
<p>LabFlow therefore has the switch <code>labflow.cache.khoa-ghi</code>, which installs <code>RedisCacheWriter.lockingRedisCacheWriter(…)</code>. Two instances, 50 requests interleaved between them:</p>
${OUT133_KHOA}
<p>Default writer: 25 queries on A and 25 on B. Locking writer: <strong>one query for the whole cluster</strong>, 1.4 s instead of 4.2 s. Redis MONITOR shows why it works across instances and what it costs: the lock is a Redis key <code>thongKeSync~lock</code> — one lock for the <em>whole cache</em>, not per key, and without our <code>labflow::</code> prefix. While AI-03 is being computed, a write for NET-02 in the same cache also waits. Use it for a few expensive, rarely written caches, not for everything.</p>
<p>Other stampede defences: refresh popular keys before they expire (a scheduled job, Chapter 14), and <strong>jitter</strong> — when many keys are written at the same time (after a deploy, after a flush), give them slightly different TTLs so they do not all expire in the same second:</p>
${OUT133_LECH}

<h3>5. Measure the cache, not just the endpoint</h3>
<p>A cache you cannot measure is a rumour. With <code>spring.cache.redis.enable-statistics=true</code> and the cache names declared, Actuator exposes Micrometer counters per cache:</p>
${OUT133_SODO}
<p>Ten requests: 1 miss, 9 hits, 1 put. Redis's own <code>keyspace_hits/misses</code> counts every command from every client, including the rate limiter — use the per-cache metrics. In Chapter 15 these counters go to Prometheus; a hit ratio that stays low means the cache costs a round trip and saves nothing.</p>

<h3>6. When not to cache</h3>
<ul>
  <li>Data a decision depends on (free slots, status checked by booking rules, permissions) — read it where the decision is made, inside the transaction.</li>
  <li>Data that changes as often as it is read — the hit ratio will be low and invalidation bugs frequent.</li>
  <li>Personal data, unless measured and keyed by user (lesson 13.1).</li>
  <li>Anything already fast. A primary-key lookup in PostgreSQL on the same network is often under a millisecond; a Redis round trip is not free.</li>
  <li>Before fixing a slow query with a cache, look at the query (Chapter 7: N+1, missing index). The 2-million-row scan in this chapter takes 70 ms; with an index on <code>lab_code</code> the right fix might be the index.</li>
</ul>

<h3>🕵️ Real incident — Facebook, 23 September 2010</h3>
<p>Facebook was down for about two and a half hours, its worst outage in four years. A system that checked configuration values in the cache and replaced invalid ones with the value from the database met a configuration value that was invalid <em>in the database itself</em>. Every client saw an invalid value, deleted the cache key and queried the database; the database, overloaded, returned errors; the clients treated the errors as invalid values and deleted the key again — a feedback loop of invalidation and stampede. Engineers had to stop all traffic to the database cluster to break it. Prevention, in our vocabulary: never let errors trigger evictions; protect the source with a lock or a single loader (section 4); keep serving the last good value when the source fails; and roll out configuration changes gradually.</p>

<h3>Compared with Node.js</h3>
<p>The races are identical — they live in the order of events, not in the language. Node has no transaction-aware cache wrapper: you delete the key after <code>await tx.commit()</code> yourself (Prisma: after <code>$transaction</code> resolves). Node's single thread does not prevent stampedes: 50 concurrent requests are 50 pending promises that all miss; the usual fix is to keep a <code>Map</code> of in-flight promises per key in one process, and a Redis lock across processes — exactly the two levels measured above.</p>

<h3>At work</h3>
<p>A good cache in a team project comes with a one-paragraph contract: what is cached, the key, the TTL and why that TTL, every code path that evicts, what happens when Redis is down, and the hit ratio after one week. Put it next to the code (<code>CacheCauHinh</code>) and review every new <code>@Cacheable</code> against it. In LabFlow: <code>lab</code> (10 min, evicted on status change, after commit), nothing else on the booking path.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Update the database first or delete the cache first?"</strong> — Update, commit, then delete. Deleting first lets a reader refill the old value before the commit (section 2). Even then a slow reader can put old data back (section 3): bound it with TTL, double delete or versions.</li>
  <li><strong>"What is a cache stampede and how do you prevent it?"</strong> — Many requests miss the same key at once and all hit the database. Single-flight per key (sync / a lock), early refresh, TTL jitter. Mention that with Spring Data Redis, <code>sync = true</code> needs a locking cache writer to have any effect — measured.</li>
  <li><strong>"Why is @CacheEvict inside a transaction dangerous?"</strong> — It can run before the commit; another request refills the cache with the old committed value. Use a transaction-aware cache manager or evict after commit.</li>
  <li><strong>"When would you not use a cache?"</strong> — When the data drives a decision, changes as often as it is read, is personal, or the source is already fast. Fix the query first.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>In section 1, how long at most could the wrong status be served, and what single property change makes that "at most 30 seconds" for the <code>lab</code> cache only?</li>
  <li>Replace double delete with <code>@CachePut</code> on the status change (write the new <code>LabInfo</code> into the cache). Does that fix the slow-reader race of section 3? Explain with the same timeline.</li>
  <li>The statistics cache is read 1,000 times per minute and recomputed in 70 ms. Its TTL is 30 s and it has no lock. Roughly how many duplicate computations happen at each expiry if requests are spread evenly?</li>
</ol></div>
${giai('Show the answers', `<p>1. Up to the TTL left on the key — 600 s after it was written (plus the jitter of up to 60 s in the default configuration). <code>labflow.cache.ttl-rieng.lab=30s</code>.</p><p>2. No. The slow reader still writes its old value <em>after</em> your put, overwriting the new one with the old one. Put narrows nothing here; only something that happens after the slow write (a second delete, TTL) or a version check prevents it.</p><p>3. About 1,000 / 60 ≈ 17 requests per second, so ≈ 17 × 0.07 ≈ 1 request arrives during the 70 ms recomputation: one duplicate per expiry, harmless. Stampede matters for hot keys and slow loaders — measure before adding locks.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Invalidation / eviction</strong> — removing a cache entry so the next read reloads it.</li>
  <li><strong>Read-through, write-through, write-behind</strong> — other ways a cache and a database can cooperate.</li>
  <li><strong>Transaction-aware cache</strong> — puts and evicts inside a transaction are executed after commit.</li>
  <li><strong>Delayed double delete</strong> — delete after commit and again after a delay longer than a slow read.</li>
  <li><strong>Lease / versioned value</strong> — mechanisms that stop an old value from overwriting a newer one.</li>
  <li><strong>Stampede (thundering herd, dogpile)</strong> — many simultaneous misses on one key.</li>
  <li><strong>Jitter</strong> — random spread added to TTLs so keys do not expire together.</li>
  <li><strong>Hit ratio</strong> — hits ÷ (hits + misses), the number that proves a cache is worth it.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>A write that bypasses the API left the cache wrong for 600 s and let a booking through on a lab under maintenance.</li>
  <li>An eviction inside an open transaction let a reader refill the old value; <code>transactionAware()</code> postponed the delete until after commit and fixed it.</li>
  <li>A slow reader can still put old data back after a correct eviction; TTL bounds it, a delayed second delete cut it to 3 s.</li>
  <li>50 simultaneous misses ran 50 queries; <code>sync = true</code> alone changed nothing with Spring Data Redis 4.1.2; a locking cache writer brought it to 1 query across two instances, at the cost of one lock per cache.</li>
  <li>Measure hit ratio per cache; do not cache decisions, personal data or things that are already fast.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/nishtala', '📄', 'Scaling Memcache at Facebook (NSDI 2013)', 'leases against stale sets and thundering herds')}
${tl('https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html', '📘', 'Spring Data Redis — Redis Cache', 'locking cache writer, transaction-aware caches')}

<h3>Sources</h3>
<ul>
  <li>Facebook outage of 23/09/2010 — Robert Johnson, <a href="https://engineering.fb.com/2010/09/23/uncategorized/more-details-on-today-s-outage/" target="_blank" rel="noopener">"More Details on Today's Outage"</a>, Facebook Engineering.</li>
  <li>Spring Data Redis 4.1.2: <code>RedisCache.get(Object, Callable)</code> and <code>DefaultRedisCacheWriter.get(…, Supplier, …)</code> read with <code>javap -c</code> on the course machine.</li>
  <li>All outputs: LabFlow c13 + Redis 7 + PostgreSQL 16, two instances, 24/11/2026.</li>
</ul>
</div>
`;

const L133_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3 · Cache với Redis</span>
<h2>Vô hiệu hoá cache, bùng tải và nhất quán</h2>
<p class="lead">"Trong khoa học máy tính chỉ có hai việc khó: vô hiệu hoá cache và đặt tên." Bài này cho thấy vì sao việc thứ nhất khó, bằng mốc thời gian thay vì câu đùa. Ta để một sinh viên đặt được phòng đang bảo trì, nhìn một lần xoá cache xảy ra 1,5 giây trước khi dữ liệu nó bảo vệ được commit, bắt quả tang một lần đọc chậm ghi dữ liệu cũ trở lại sau một lần xoá đúng, và bắn 50 request vào một khoá vừa hết hạn — rồi sửa từng ca và đo lại. Cuối bài là câu hỏi người có kinh nghiệm nào cũng hỏi: thứ này có nên cache không?</p>

<h3>Đời thường trước đã</h3>
<p>Tấm bảng trắng ở thư viện ghi "Lab IoT: mở". 9:00 kỹ thuật viên đóng phòng để sửa và báo cô thủ thư trưởng, cô xoá dòng đó. Nhưng lúc 8:59 một cô khác đã xuống kho kiểm tra trạng thái phòng; 9:01 cô quay lên với chữ "mở" — câu trả lời cũ, đọc trước khi đổi — và ghi lên tấm bảng vừa được xoá. Từ đó ai cũng đọc thấy "mở" cho tới khi dòng đó hết hạn. Tách riêng ra thì không ai làm sai; chính thứ tự sự việc gây ra lỗi. Đó là toàn bộ bài này.</p>

<h3>1. Cache-aside và luật duy nhất của nó</h3>
<p><code>@Cacheable</code> + <code>@CacheEvict</code> của Spring là <strong>cache-aside</strong>: lần đọc nạp cache, lần ghi đi vào CSDL rồi <em>xoá</em> khoá. Các kiểu khác bạn sẽ nghe: <strong>read-through</strong> (cache tự nạp từ CSDL), <strong>write-through</strong> (mỗi lần ghi đi vào cache và CSDL cùng lúc), <strong>write-behind</strong> (ghi vào cache, đẩy xuống CSDL sau — nhanh và nguy hiểm). Luật duy nhất của cache-aside: <strong>mọi đường làm đổi dữ liệu đều phải xoá khoá.</strong> Đây là một đường không làm thế:</p>
${OUT133_BYPASS}
<p>Một script bảo trì (hoặc một bạn trong nhóm mở pgAdmin, hoặc một service khác) sửa trạng thái thẳng trong PostgreSQL. API vẫn nói ACTIVE suốt 600 giây còn lại, và luật đặt lịch — đọc thông tin phòng qua <code>LabCatalog</code> có cache — <strong>nhận một lượt đặt trên phòng đang bảo trì</strong> (lượt 7, CONFIRMED). Đi qua API thì lần xoá chạy đúng và cùng lượt đặt đó bị từ chối với <code>LAB_UNAVAILABLE</code>:</p>
${MA133_PATCH}
<p>Bài học: (1) dữ liệu mà luật nghiệp vụ dựa vào nên đọc từ CSDL đúng lúc quyết định, hoặc cache với TTL đủ ngắn để chấp nhận được sai số; (2) nếu còn nơi khác ghi vào, TTL là lưới an toàn duy nhất — hãy chọn nó có chủ ý; (3) script quản trị đi qua API, hoặc kết thúc bằng lệnh <code>DEL</code> các khoá nó động tới.</p>

<h3>2. Xoá cache trước khi commit</h3>
<p>Endpoint của chính LabFlow thì an toàn. Ta đã đo: khi <code>@Transactional</code> và <code>@CacheEvict</code> nằm trên <em>cùng</em> một phương thức, lần xoá xảy ra sau commit (log của thí nghiệm đầu tiên, thêm 1,5 s việc khác trước commit):</p>
${OUT133_CUNG}
<p>Nhưng mã hiếm khi giữ được đơn giản như vậy. Một hình dạng rất hay gặp: service <code>@Transactional</code> gọi sang một bean nhỏ có phương thức gắn <code>@CacheEvict</code>, rồi còn làm thêm việc (ghi nhật ký, phát sự kiện) trước khi commit:</p>
${MA133_DOI}
${MA133_XOA}
${OUT133_TRUOC}
<p>Đọc dòng thời gian. 54.396: khoá bị xoá — transaction vẫn đang mở. 54.894: một lần đọc trượt cache, đọc CSDL, thấy giá trị <em>đã commit</em> là ACTIVE (PostgreSQL không bao giờ cho người khác thấy dòng chưa commit), rồi cache nó. 55.910: commit. Từ đó CSDL nói MAINTENANCE còn cache nói ACTIVE thêm 598 giây. Cách sửa là một dòng trong cấu hình LabFlow: <code>RedisCacheManagerBuilder.transactionAware()</code>, bọc mọi cache để các lệnh ghi và xoá gọi bên trong transaction được thực hiện <em>sau commit</em>:</p>
${OUT133_SAU}
<p>Interceptor vẫn ghi "Invalidating" lúc 09.453, nhưng lệnh <code>DEL</code> thật bị hoãn: lần đọc lúc 0,5 s lấy ACTIVE từ cache (đúng — chưa có gì commit), và lần đọc đầu tiên sau commit nhận MAINTENANCE.</p>

<h3>3. Cuộc đua mà transactionAware không sửa được</h3>
<p>Giờ tới cô thủ thư trong hình ảnh đời thường: một lần đọc bị chậm <em>giữa</em> lúc đọc CSDL và lúc ghi cache — một lần dừng GC, CPU bận, mạng tới Redis chậm. Ta cố ý cho nó chậm 1,5 s:</p>
${MA133_DOC}
${OUT133_DOCCHAM}
<p>Lần đọc lấy ACTIVE lúc 12.502; thay đổi của quản lý commit và xoá cache lúc 12.877 (lúc đó chưa có gì để xoá); khoảng 14.0 lần đọc chậm ghi ACTIVE vào cache. Kết quả: dữ liệu cũ trong 599 giây, trong khi mọi thành phần đều chạy "đúng". Đây là cuộc đua được tả trong bài báo Memcache của Facebook (NSDI 2013), họ giải bằng <strong>lease</strong>. Cách sửa thực tế, rẻ nhất trước:</p>
<ul>
  <li>một TTL bạn chấp nhận được (giới hạn trên cho mọi cuộc đua kiểu này);</li>
  <li><strong>xoá hai lần có trễ</strong> (delayed double delete): xoá sau commit, rồi xoá lần nữa sau vài giây, lâu hơn một lần đọc chậm — mẫu bạn sẽ gặp ở nhiều đội backend;</li>
  <li>giá trị có phiên bản (lưu số phiên bản; không bao giờ ghi đè bản mới hơn) hoặc lease, khi sự đúng đắn thật sự quan trọng.</li>
</ul>
${MA133_HAILAN}
${OUT133_HAILAN}
<p>Lúc 2,3 s chữ ACTIVE cũ vẫn còn; sau lần xoá thứ hai lúc 3,3 s, lần đọc kế tiếp là MAINTENANCE. Khoảng sai co từ mười phút xuống ba giây.</p>

<h3>4. Bùng tải: tất cả cùng trượt một lúc</h3>
<p>Khi một khoá được đọc nhiều hết hạn, mọi request tới trước khi nó được nạp lại đều trượt — và tất cả cùng chạy truy vấn đắt. Năm mươi request cùng lúc vào một khoá trống:</p>
${OUT133_STAMP}
<p>Không có <code>sync</code>: 50 truy vấn thật (tổng 4,3 s, CSDL làm cùng một lần quét năm mươi lần song song). Với <code>sync = true</code> bộ đếm đi từ 50 lên 100: <strong>vẫn 50 truy vấn</strong>. Điều đó làm ta bất ngờ, nên ta đọc bytecode của Spring Data Redis 4.1.2: <code>RedisCache.get(key, valueLoader)</code> chỉ chuyển tiếp cho cache writer, và writer mặc định chỉ khoá khi nó là writer <em>có khoá</em>. Với <code>RedisCacheManager</code> như Boot cấu hình sẵn, <code>sync = true</code> không bảo vệ gì cả.</p>
${MA133_SYNC}
<p>Vì vậy LabFlow có công tắc <code>labflow.cache.khoa-ghi</code>, cài <code>RedisCacheWriter.lockingRedisCacheWriter(…)</code>. Hai instance, 50 request xen kẽ giữa hai bên:</p>
${OUT133_KHOA}
<p>Writer mặc định: 25 truy vấn ở A và 25 ở B. Writer có khoá: <strong>một truy vấn cho cả cụm</strong>, 1,4 s thay vì 4,2 s. Redis MONITOR cho thấy vì sao nó chạy được giữa các instance và cái giá phải trả: khoá là một khoá Redis <code>thongKeSync~lock</code> — một khoá cho <em>cả cache</em>, không phải cho từng khoá, và không có tiền tố <code>labflow::</code> của ta. Trong lúc đang tính AI-03, một lần ghi NET-02 trong cùng cache cũng phải chờ. Hãy dùng nó cho vài cache đắt, ít ghi, đừng dùng cho mọi thứ.</p>
<p>Cách chống bùng tải khác: làm mới khoá nóng trước khi nó hết hạn (một tác vụ hẹn giờ, Chương 14), và <strong>độ lệch ngẫu nhiên</strong> (jitter) — khi nhiều khoá được ghi cùng lúc (sau khi triển khai, sau khi xoá sạch cache), cho chúng TTL hơi khác nhau để không cùng hết hạn trong một giây:</p>
${OUT133_LECH}

<h3>5. Đo cache, không chỉ đo endpoint</h3>
<p>Cache không đo được chỉ là lời đồn. Với <code>spring.cache.redis.enable-statistics=true</code> và khai báo tên cache, Actuator đưa ra bộ đếm Micrometer cho từng cache:</p>
${OUT133_SODO}
<p>Mười request: 1 trượt, 9 trúng, 1 lần ghi. <code>keyspace_hits/misses</code> của chính Redis đếm mọi lệnh từ mọi client, kể cả bộ giới hạn tần suất — hãy dùng số đo theo từng cache. Ở Chương 15 các bộ đếm này đi vào Prometheus; tỉ lệ trúng cứ thấp mãi nghĩa là cache tốn một vòng mạng mà không tiết kiệm được gì.</p>

<h3>6. Khi nào không nên cache</h3>
<ul>
  <li>Dữ liệu mà một quyết định dựa vào (khung giờ trống, trạng thái được luật đặt lịch kiểm, quyền) — đọc nó ngay chỗ quyết định, bên trong transaction.</li>
  <li>Dữ liệu đổi thường xuyên như được đọc — tỉ lệ trúng sẽ thấp và lỗi vô hiệu hoá sẽ nhiều.</li>
  <li>Dữ liệu cá nhân, trừ khi đã đo và khoá theo người dùng (bài 13.1).</li>
  <li>Thứ vốn đã nhanh. Tra khoá chính trong PostgreSQL cùng mạng thường dưới một mili giây; một vòng tới Redis không miễn phí.</li>
  <li>Trước khi chữa truy vấn chậm bằng cache, hãy nhìn truy vấn (Chương 7: N+1, thiếu chỉ mục). Lần quét 2 triệu dòng của chương này mất 70 ms; có chỉ mục trên <code>lab_code</code> thì cách sửa đúng có khi là chỉ mục.</li>
</ul>

<h3>🕵️ Sự cố thật — Facebook, 23/09/2010</h3>
<p>Facebook sập khoảng hai tiếng rưỡi, lần sập tệ nhất trong bốn năm. Một hệ thống kiểm tra giá trị cấu hình trong cache và thay giá trị không hợp lệ bằng giá trị từ CSDL đã gặp một giá trị cấu hình không hợp lệ <em>ngay trong CSDL</em>. Mọi client thấy giá trị không hợp lệ, xoá khoá cache và truy vấn CSDL; CSDL quá tải trả lỗi; client coi lỗi là giá trị không hợp lệ và lại xoá khoá — một vòng lặp phản hồi của vô hiệu hoá và bùng tải. Kỹ sư phải chặn toàn bộ lưu lượng vào cụm CSDL mới phá được vòng lặp. Cách phòng, nói bằng từ vựng của bài: không bao giờ để lỗi kích hoạt lệnh xoá cache; bảo vệ nguồn bằng khoá hoặc một người nạp duy nhất (mục 4); khi nguồn lỗi thì tiếp tục phục vụ giá trị tốt cuối cùng; và đưa thay đổi cấu hình ra dần dần.</p>

<h3>So với Node.js</h3>
<p>Các cuộc đua y hệt — chúng nằm ở thứ tự sự việc, không nằm ở ngôn ngữ. Node không có lớp bọc cache biết transaction: bạn tự xoá khoá sau <code>await tx.commit()</code> (Prisma: sau khi <code>$transaction</code> xong). Một luồng của Node không chặn được bùng tải: 50 request đồng thời là 50 promise đang chờ, cùng trượt; cách sửa quen thuộc là giữ một <code>Map</code> các promise đang chạy theo khoá trong một tiến trình, và khoá Redis giữa các tiến trình — đúng hai tầng đã đo ở trên.</p>

<h3>Khi đi làm</h3>
<p>Một cache tốt trong dự án nhóm đi kèm một "hợp đồng" một đoạn: cache cái gì, khoá là gì, TTL bao nhiêu và vì sao, mọi đường mã có xoá khoá, Redis chết thì sao, và tỉ lệ trúng sau một tuần. Đặt nó cạnh mã (<code>CacheCauHinh</code>) và soát mọi <code>@Cacheable</code> mới theo nó. Trong LabFlow: <code>lab</code> (10 phút, xoá khi đổi trạng thái, sau commit), ngoài ra không có gì trên đường đặt lịch.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Cập nhật CSDL trước hay xoá cache trước?"</strong> — Cập nhật, commit, rồi xoá. Xoá trước thì một lần đọc nạp lại giá trị cũ trước commit (mục 2). Kể cả vậy, một lần đọc chậm vẫn ghi lại dữ liệu cũ được (mục 3): chặn bằng TTL, xoá hai lần hoặc phiên bản.</li>
  <li><strong>"Cache stampede là gì và chống thế nào?"</strong> — Nhiều request cùng trượt một khoá một lúc và cùng đánh vào CSDL. Mỗi khoá một người nạp (sync / khoá), làm mới sớm, TTL có độ lệch. Nhắc rằng với Spring Data Redis, <code>sync = true</code> cần cache writer có khoá mới có tác dụng — đã đo.</li>
  <li><strong>"Vì sao @CacheEvict bên trong transaction nguy hiểm?"</strong> — Nó có thể chạy trước commit; request khác nạp lại cache bằng giá trị cũ đã commit. Dùng cache manager biết transaction hoặc xoá sau commit.</li>
  <li><strong>"Khi nào bạn không dùng cache?"</strong> — Khi dữ liệu dùng để quyết định, đổi thường như được đọc, là dữ liệu cá nhân, hoặc nguồn vốn đã nhanh. Sửa truy vấn trước.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Ở mục 1, trạng thái sai có thể bị trả ra lâu nhất bao lâu, và đổi một thuộc tính nào để con số đó thành "nhiều nhất 30 giây" chỉ riêng cho cache <code>lab</code>?</li>
  <li>Thay xoá hai lần bằng <code>@CachePut</code> lúc đổi trạng thái (ghi <code>LabInfo</code> mới vào cache). Cách đó có sửa được cuộc đua đọc chậm ở mục 3 không? Giải thích bằng cùng dòng thời gian.</li>
  <li>Cache thống kê được đọc 1.000 lần mỗi phút và tính lại mất 70 ms. TTL 30 s, không có khoá. Nếu request đến đều, mỗi lần hết hạn có khoảng bao nhiêu lần tính trùng?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Bằng TTL còn lại của khoá — 600 s kể từ lúc ghi (cộng độ lệch tới 60 s ở cấu hình mặc định). <code>labflow.cache.ttl-rieng.lab=30s</code>.</p><p>2. Không. Lần đọc chậm vẫn ghi giá trị cũ của nó <em>sau</em> lần put của bạn, đè giá trị mới bằng giá trị cũ. Put không thu hẹp gì ở đây; chỉ thứ xảy ra sau lần ghi chậm (lần xoá thứ hai, TTL) hoặc kiểm tra phiên bản mới chặn được.</p><p>3. Khoảng 1.000 / 60 ≈ 17 request mỗi giây, nên ≈ 17 × 0,07 ≈ 1 request tới trong 70 ms đang tính lại: mỗi lần hết hạn trùng một lần, vô hại. Bùng tải chỉ đáng lo với khoá nóng và người nạp chậm — đo trước khi thêm khoá.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Invalidation / eviction (vô hiệu hoá / xoá)</strong> — bỏ một mục cache để lần đọc sau nạp lại.</li>
  <li><strong>Read-through, write-through, write-behind</strong> — các cách khác để cache và CSDL phối hợp.</li>
  <li><strong>Cache biết transaction</strong> — lệnh ghi và xoá trong transaction được thực hiện sau commit.</li>
  <li><strong>Xoá hai lần có trễ (delayed double delete)</strong> — xoá sau commit và xoá lại sau một khoảng dài hơn một lần đọc chậm.</li>
  <li><strong>Lease / giá trị có phiên bản</strong> — cơ chế không cho giá trị cũ đè lên giá trị mới hơn.</li>
  <li><strong>Stampede (thundering herd, dogpile)</strong> — nhiều lần trượt cùng lúc trên một khoá.</li>
  <li><strong>Jitter (độ lệch)</strong> — khoảng ngẫu nhiên cộng vào TTL để các khoá không cùng hết hạn.</li>
  <li><strong>Tỉ lệ trúng (hit ratio)</strong> — trúng ÷ (trúng + trượt), con số chứng minh cache đáng giá.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một lần ghi đi vòng qua API để cache sai suốt 600 s và cho qua một lượt đặt ở phòng đang bảo trì.</li>
  <li>Xoá cache trong transaction đang mở để một lần đọc nạp lại giá trị cũ; <code>transactionAware()</code> hoãn lệnh xoá tới sau commit và sửa được.</li>
  <li>Một lần đọc chậm vẫn ghi lại dữ liệu cũ sau một lần xoá đúng; TTL chặn trên, lần xoá thứ hai có trễ thu khoảng sai về 3 s.</li>
  <li>50 lần trượt đồng thời chạy 50 truy vấn; riêng <code>sync = true</code> không đổi gì với Spring Data Redis 4.1.2; writer có khoá đưa về 1 truy vấn cho hai instance, đổi lại một khoá cho mỗi cache.</li>
  <li>Đo tỉ lệ trúng theo từng cache; đừng cache quyết định, dữ liệu cá nhân hay thứ vốn đã nhanh.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/nishtala', '📄', 'Scaling Memcache at Facebook (NSDI 2013)', 'lease chống ghi dữ liệu cũ và bùng tải')}
${tl('https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html', '📘', 'Spring Data Redis — Redis Cache', 'cache writer có khoá, cache biết transaction')}

<h3>Nguồn</h3>
<ul>
  <li>Sự cố Facebook 23/09/2010 — Robert Johnson, <a href="https://engineering.fb.com/2010/09/23/uncategorized/more-details-on-today-s-outage/" target="_blank" rel="noopener">"More Details on Today's Outage"</a>, Facebook Engineering.</li>
  <li>Spring Data Redis 4.1.2: <code>RedisCache.get(Object, Callable)</code> và <code>DefaultRedisCacheWriter.get(…, Supplier, …)</code> đọc bằng <code>javap -c</code> trên máy của khoá học.</li>
  <li>Mọi output: LabFlow c13 + Redis 7 + PostgreSQL 16, hai instance, 24/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 13.4 =====
const MA134_CHAM = bash("#!/bin/bash\n# cham.sh <thư mục dự án> — chấm Lab 13 \"Cache + giới hạn tần suất bằng Redis\". 10 mục ĐẠT/TRƯỢT, gọi API THẬT.\n# Chép dự án sang thư mục tạm, biên dịch, chạy profile dev trên CSDL sạch + Redis sạch trong netns sb-c13-cham-net (127.0.0.1:41835 ⇒ 8080).\n# Redis ở localhost:6379 trong netns. Mật khẩu sinh lúc chấm, không ghi ra màn hình.\nset -u\nSRC=$(realpath \"$1\"); W=~/.rtq-sb/ch13/cham/$(basename \"$SRC\")-$$; MVN=~/vbg-dp/scratchpad/sb/mvn.sh\nAPI=http://127.0.0.1:41835; J='Content-Type: application/json'\nMKDB=$(openssl rand -hex 8); JWT=$(openssl rand -hex 32); MKQL=ql-$(openssl rand -hex 8); MKSV=sv-$(openssl rand -hex 8)\ndiem=0; muc() { if [ \"$2\" = 1 ]; then diem=$((diem+1)); echo \"Mục $1: ĐẠT   — $3\"; else echo \"Mục $1: TRƯỢT — $3\"; fi; }\ndon() { docker unpause sb-c13-cham-redis >/dev/null 2>&1; docker rm -f sb-c13-cham-app sb-c13-cham-pg sb-c13-cham-redis sb-c13-cham-net >/dev/null 2>&1; rm -rf \"$W\"; }\ntrap don EXIT\nrm -rf \"$W\"; mkdir -p \"$W\"; cp -r \"$SRC\"/pom.xml \"$SRC\"/src \"$W\"/\nbash $MVN \"$W\" -B -q -DskipTests compile dependency:copy-dependencies -DoutputDirectory=target/dep -DincludeScope=runtime > \"$W/build.log\" 2>&1 \\\n  || { echo \"BIÊN DỊCH HỎNG:\"; grep -E 'ERROR.*\\.java' \"$W/build.log\" | head -5; echo \"Điểm: 0/10\"; exit 1; }\ndocker rm -f sb-c13-cham-app sb-c13-cham-pg sb-c13-cham-redis sb-c13-cham-net >/dev/null 2>&1\ndocker run -d --name sb-c13-cham-net --memory 64m -p 127.0.0.1:41835:8080 --entrypoint sleep postgres:16 infinity >/dev/null\ndocker run -d --name sb-c13-cham-pg --network container:sb-c13-cham-net --memory 2g --memory-swap 2g --cpus 2 \\\n  -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=\"$MKDB\" -e POSTGRES_DB=labflow postgres:16 >/dev/null\ndocker run -d --name sb-c13-cham-redis --network container:sb-c13-cham-net --memory 256m --memory-swap 256m --cpus 1 \\\n  redis:7-alpine redis-server --save \"\" --bind 127.0.0.1 >/dev/null\nfor i in $(seq 60); do docker exec sb-c13-cham-pg pg_isready -h 127.0.0.1 -U labflow -q 2>/dev/null && break; sleep 1; done; sleep 2\ndocker run -d --name sb-c13-cham-app --network container:sb-c13-cham-net --memory 2g --memory-swap 2g --cpus 2 --user $(id -u):$(id -g) -e HOME=/tmp -e TZ=UTC \\\n  -e LABFLOW_DB_PASSWORD=\"$MKDB\" -e LABFLOW_JWT_SECRET=\"$JWT\" -e LABFLOW_MANAGER_PASSWORD=\"$MKQL\" -e LABFLOW_NOW=2026-11-25T08:00 -e SPRING_PROFILES_ACTIVE=dev \\\n  -v \"$W\":/w -w /w --entrypoint \"\" maven:3.9-eclipse-temurin-21 java -cp \"target/classes:target/dep/*\" vn.labflow.LabflowApplication >/dev/null\nfor i in $(seq 90); do docker logs sb-c13-cham-app 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in|APPLICATION FAILED|Application run failed' && break; sleep 1; done\ndocker logs sb-c13-cham-app 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in' || { echo \"ỨNG DỤNG KHÔNG LÊN:\"; docker logs sb-c13-cham-app 2>&1 | grep -vE '^\\s+at ' | tail -8; echo \"Điểm: 0/10\"; exit 1; }\nrc() { docker exec sb-c13-cham-redis redis-cli \"$@\" 2>/dev/null; }\nps() { docker exec sb-c13-cham-pg psql -qtA -U labflow -d labflow -c \"$1\" 2>/dev/null; }\ndk() { curl -s -o /dev/null -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"fullName\\\":\\\"Sinh Vien\\\",\\\"password\\\":\\\"$MKSV\\\"}\" $API/api/v1/auth/register; }\ntok() { curl -s -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"password\\\":\\\"$2\\\"}\" $API/api/v1/auth/login | jq -r '.accessToken // empty'; }\ndat() { curl -s -o /dev/null -w '%{http_code}' -H \"Authorization: Bearer $1\" -H \"$J\" -H \"Idempotency-Key: $2\" -d \"{\\\"labCode\\\":\\\"$3\\\",\\\"startAt\\\":\\\"$4\\\",\\\"endAt\\\":\\\"$5\\\",\\\"purpose\\\":\\\"cham lab 13\\\"}\" $API/api/v1/bookings; }\n\n# ---- Mục 1: GET /api/v1/labs/IOT-01 tạo khoá labflow::lab::IOT-01 trong Redis\ncurl -s -o /dev/null $API/api/v1/labs/IOT-01; curl -s -o /dev/null $API/api/v1/labs/IOT-01\nk=$(rc exists labflow::lab::IOT-01); [ \"$k\" = 1 ] && ok=1 || ok=0; muc 1 $ok \"khoá labflow::lab::IOT-01 trong Redis: ${k:-0} (các khoá: $(rc keys '*' | head -3 | tr '\\n' ' '))\"\n\n# ---- Mục 2: giá trị là JSON đọc được, không phải byte tuần tự hoá của JDK\nv=$(rc get labflow::lab::IOT-01); [[ \"$v\" == \\{* && \"$v\" == *IOT-01* ]] && ok=1 || ok=0; muc 2 $ok \"giá trị: $(echo \"$v\" | head -c 70 | tr -c '[:print:]' '?')\"\n\n# ---- Mục 3: TTL từ 1 tới 15 phút\nt=$(rc ttl labflow::lab::IOT-01); [ \"${t:--2}\" -ge 60 ] 2>/dev/null && [ \"$t\" -le 900 ] && ok=1 || ok=0; muc 3 $ok \"TTL = ${t:-?} s (cần 60–900)\"\n\n# ---- Mục 4: đọc THẬT từ cache: sửa tên trong CSDL bằng tay, API vẫn trả tên cũ\nps \"update labs set name = 'DOI-TRONG-CSDL' where code = 'IOT-01'\" >/dev/null\nn=$(curl -s $API/api/v1/labs/IOT-01 | jq -r .name); [ \"$n\" != DOI-TRONG-CSDL ] && [ -n \"$n\" ] && [ \"$n\" != null ] && ok=1 || ok=0; muc 4 $ok \"sau khi sửa CSDL, API trả name = \\\"$n\\\"\"\nps \"update labs set name = 'Lab IoT' where code = 'IOT-01'\" >/dev/null\n\n# ---- Mục 5: mã không tồn tại ⇒ 404 và KHÔNG có khoá rác\ns=$(curl -s -o /dev/null -w '%{http_code}' $API/api/v1/labs/KHONG-99); k=$(rc exists labflow::lab::KHONG-99)\n[ \"$s\" = 404 ] && [ \"$k\" = 0 ] && ok=1 || ok=0; muc 5 $ok \"GET KHONG-99: HTTP $s, khoá rác: ${k:-?}\"\n\n# ---- Mục 6: quản lý đổi trạng thái qua API ⇒ lần đọc sau thấy trạng thái mới\nQL=$(tok manager@fpt.edu.vn \"$MKQL\"); curl -s -o /dev/null $API/api/v1/labs/HW-04\ncurl -s -o /dev/null -X PATCH -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"status\":\"MAINTENANCE\"}' $API/api/v1/labs/HW-04/status\nst=$(curl -s $API/api/v1/labs/HW-04 | jq -r .status); [ \"$st\" = MAINTENANCE ] && ok=1 || ok=0; muc 6 $ok \"sau PATCH MAINTENANCE, GET HW-04 trả status = $st\"\n\n# ---- Mục 7: lượt đặt thứ 6 trong một phút ⇒ 429 problem+json RATE_LIMITED + Retry-After\ndk an.cham@fpt.edu.vn; AN=$(tok an.cham@fpt.edu.vn \"$MKSV\"); kq=\"\"\nfor d in 26 27 28 29 30; do kq=\"$kq$(dat \"$AN\" an-cham-dat-$d IOT-01 2026-11-${d}T14:00:00 2026-11-${d}T15:00:00) \"; done\nh=$(curl -s -D - -H \"Authorization: Bearer $AN\" -H \"$J\" -H 'Idempotency-Key: an-cham-dat-99' -d '{\"labCode\":\"NET-02\",\"startAt\":\"2026-11-26T08:00:00\",\"endAt\":\"2026-11-26T09:00:00\",\"purpose\":\"lan 6\"}' $API/api/v1/bookings | tr -d '\\r')\ns6=$(echo \"$h\" | head -1 | cut -d' ' -f2); ra=$(echo \"$h\" | grep -i '^retry-after:' | cut -d' ' -f2); ct=$(echo \"$h\" | grep -i '^content-type:' | cut -d' ' -f2); cd=$(echo \"$h\" | tail -1 | jq -r '.code // empty' 2>/dev/null)\n[ \"$s6\" = 429 ] && [ \"${ra:-0}\" -ge 1 ] 2>/dev/null && [ \"$ra\" -le 60 ] && [[ \"$ct\" == application/problem+json* ]] && [ \"$cd\" = RATE_LIMITED ] && ok=1 || ok=0\nmuc 7 $ok \"5 lần đầu: ${kq}· lần 6: HTTP ${s6:-?}, Retry-After ${ra:--}, ${ct:--}, code ${cd:--}\"\n\n# ---- Mục 8: 30 request đặt CÙNG LÚC của một người mới ⇒ tối đa 5 cái không bị 429\ndk binh.cham@fpt.edu.vn; BI=$(tok binh.cham@fpt.edu.vn \"$MKSV\")\nqua=$(seq 30 | xargs -P 30 -I{} curl -s --max-time 30 -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer $BI\" -H \"$J\" -H 'Idempotency-Key: binh-cham-k{}-xx' \\\n  -d '{\"labCode\":\"AI-03\",\"startAt\":\"2026-12-01T08:00:00\",\"endAt\":\"2026-12-01T09:00:00\",\"purpose\":\"dong thoi\"}' $API/api/v1/bookings | grep -vc 429)\n[ \"$qua\" -le 5 ] && ok=1 || ok=0; muc 8 $ok \"30 request đồng thời: $qua cái không bị 429 (tối đa 5)\"\n\n# ---- Mục 9: đăng nhập: 5 lần thử mỗi email / 15 phút, kể cả khi đổi X-Forwarded-For; email khác không bị ảnh hưởng\ndk cuong.cham@fpt.edu.vn; s9=\"\"\nfor i in 1 2 3 4 5 6; do s9=\"$s9$(curl -s -o /dev/null -w '%{http_code}' -H \"$J\" -H \"X-Forwarded-For: 10.9.$i.1\" -d '{\"email\":\"cuong.cham@fpt.edu.vn\",\"password\":\"sai-mat-khau-1\"}' $API/api/v1/auth/login) \"; done\nkhac=$(curl -s -o /dev/null -w '%{http_code}' -H \"$J\" -d '{\"email\":\"an.cham@fpt.edu.vn\",\"password\":\"sai-mat-khau-1\"}' $API/api/v1/auth/login)\n[[ \"$s9\" == \"401 401 401 401 401 429 \" ]] && [ \"$khac\" = 401 ] && ok=1 || ok=0; muc 9 $ok \"cùng email, 6 IP giả: ${s9}· email khác: $khac\"\n\n# ---- Mục 10: Redis đứng hình ⇒ đọc phòng và đặt lịch vẫn chạy, mỗi request dưới 3 s\ndocker pause sb-c13-cham-redis >/dev/null\nr1=$(curl -s --max-time 10 -o /dev/null -w '%{http_code} %{time_total}' $API/api/v1/labs/NET-02)\ndk dung.cham@fpt.edu.vn; DU=$(tok dung.cham@fpt.edu.vn \"$MKSV\")\nr2=$(curl -s --max-time 10 -o /dev/null -w '%{http_code} %{time_total}' -H \"Authorization: Bearer $DU\" -H \"$J\" -H 'Idempotency-Key: dung-cham-redis-1' -d '{\"labCode\":\"NET-02\",\"startAt\":\"2026-11-27T08:00:00\",\"endAt\":\"2026-11-27T09:00:00\",\"purpose\":\"redis dung\"}' $API/api/v1/bookings)\ndocker unpause sb-c13-cham-redis >/dev/null\nread c1 t1 <<< \"$r1\"; read c2 t2 <<< \"$r2\"\n[ \"$c1\" = 200 ] && [ \"$c2\" = 201 ] && awk \"BEGIN{exit !($t1 < 3 && $t2 < 3)}\" && ok=1 || ok=0\nmuc 10 $ok \"Redis dừng: GET NET-02 HTTP $c1 (${t1} s), POST đặt HTTP $c2 (${t2} s)\"\necho \"Điểm: $diem/10\"");
const MA134_AUTH = java("/** Sai email hay sai mật khẩu đều cùng một câu (không cho dò email). */\n@PostMapping(\"/login\")\nToken dangNhap(@Valid @RequestBody DangNhap r) {\n    // Lab 13: tối đa 5 lần thử mỗi EMAIL mỗi 15 phút — khoá theo tài khoản bị dò, không theo IP (IP đổi được, header giả được)\n    gioiHan.kiem(\"dang-nhap\", r.email().trim().toLowerCase(), 5, Duration.ofMinutes(15));\n    Account a = accounts.findByEmail(r.email().trim().toLowerCase())\n        .filter(x -> pe.matches(r.password(), x.getPasswordHash()))\n        .orElseThrow(() -> new LoiNghiepVu(HttpStatus.UNAUTHORIZED, \"BAD_CREDENTIALS\", \"sai email hoặc mật khẩu\"));\n    Instant now = clock.instant();\n    JwtClaimsSet c = JwtClaimsSet.builder().issuer(\"labflow\").subject(a.getEmail()).issuedAt(now).expiresAt(now.plus(ttl))\n        .claim(\"uid\", a.getId()).claim(\"roles\", List.of(a.getRole())).build();\n    String at = enc.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), c)).getTokenValue();\n    return new Token(at, \"Bearer\", ttl.toSeconds());\n}");
const MA134_PROPS = props("# application.properties — phần thêm\n# Redis: tên host theo môi trường (compose: redis); TTL cho cache, tiền tố khoá theo ứng dụng\nspring.data.redis.host=${LABFLOW_REDIS_HOST:localhost}\nspring.data.redis.port=6379\n# mặc định client chờ một lệnh tới 60 s (đo ở 17.4) ⇒ cache chết là API treo; cache phải hỏng nhanh\nspring.data.redis.timeout=500ms\nspring.data.redis.connect-timeout=1s\n# cache: cấu hình trong shared/CacheCauHinh (JSON, tiền tố labflow::, xoá sau commit); TTL mặc định ở đây\nlabflow.cache.ttl=10m\nlabflow.cache.lech=1m");
const MA134_BAY = java("public void kiem(String viec, String ai, int toiDa, Duration cua) {\n    String k = \"labflow::gh::\" + viec + \"::\" + ai;\n    try {\n        String v = redis.opsForValue().get(k);\n        int n = v == null ? 0 : Integer.parseInt(v);\n        if (n >= toiDa) throw new QuaNhieu(cua.toSeconds());\n        redis.opsForValue().set(k, String.valueOf(n + 1), cua);\n    } catch (DataAccessException e) { /* Redis chết: cho qua */ }\n}");
const OUT134_STARTER = out("$ bash lam.sh starter && bash cham.sh ~/lab13/starter\nMục 1: TRƯỢT — khoá labflow::lab::IOT-01 trong Redis: 0 (các khoá:  )\nMục 2: TRƯỢT — giá trị: ?\nMục 3: TRƯỢT — TTL = -2 s (cần 60–900)\nMục 4: TRƯỢT — sau khi sửa CSDL, API trả name = \"null\"\nMục 5: ĐẠT   — GET KHONG-99: HTTP 404, khoá rác: 0\nMục 6: TRƯỢT — sau PATCH MAINTENANCE, GET HW-04 trả status = 404\nMục 7: TRƯỢT — 5 lần đầu: 201 201 201 201 201 · lần 6: HTTP 201, Retry-After -, application/json, code -\nMục 8: TRƯỢT — 30 request đồng thời: 30 cái không bị 429 (tối đa 5)\nMục 9: TRƯỢT — cùng email, 6 IP giả: 401 401 401 401 401 401 · email khác: 401\nMục 10: TRƯỢT — Redis dừng: GET NET-02 HTTP 404 (0.010193 s), POST đặt HTTP 201 (0.031703 s)\nĐiểm: 1/10\nthời gian chấm 0:31.46");
const OUT134_GIAI = out("$ bash cham.sh ~/lab13/giai\nMục 1: ĐẠT   — khoá labflow::lab::IOT-01 trong Redis: 1 (các khoá: labflow::lab::IOT-01 )\nMục 2: ĐẠT   — giá trị: {\"@class\":\"vn.labflow.catalog.LabInfo\",\"id\":1,\"code\":\"IOT-01\",\"name\":\"\nMục 3: ĐẠT   — TTL = 652 s (cần 60–900)\nMục 4: ĐẠT   — sau khi sửa CSDL, API trả name = \"Lab IoT\"\nMục 5: ĐẠT   — GET KHONG-99: HTTP 404, khoá rác: 0\nMục 6: ĐẠT   — sau PATCH MAINTENANCE, GET HW-04 trả status = MAINTENANCE\nMục 7: ĐẠT   — 5 lần đầu: 201 201 201 201 201 · lần 6: HTTP 429, Retry-After 60, application/problem+json, code RATE_LIMITED\nMục 8: ĐẠT   — 30 request đồng thời: 5 cái không bị 429 (tối đa 5)\nMục 9: ĐẠT   — cùng email, 6 IP giả: 401 401 401 401 401 429 · email khác: 401\nMục 10: ĐẠT   — Redis dừng: GET NET-02 HTTP 200 (0.520362 s), POST đặt HTTP 201 (1.065947 s)\nĐiểm: 10/10\nthời gian chấm 0:35.74");
const OUT134_BAY = out("$ bash cham.sh ~/lab13/bay      # lời giải, nhưng GioiHan đọc–so sánh–ghi (GET rồi SET)\nMục 1: ĐẠT   — khoá labflow::lab::IOT-01 trong Redis: 1 (các khoá: labflow::lab::IOT-01 )\nMục 2: ĐẠT   — giá trị: {\"@class\":\"vn.labflow.catalog.LabInfo\",\"id\":1,\"code\":\"IOT-01\",\"name\":\"\nMục 3: ĐẠT   — TTL = 615 s (cần 60–900)\nMục 4: ĐẠT   — sau khi sửa CSDL, API trả name = \"Lab IoT\"\nMục 5: ĐẠT   — GET KHONG-99: HTTP 404, khoá rác: 0\nMục 6: ĐẠT   — sau PATCH MAINTENANCE, GET HW-04 trả status = MAINTENANCE\nMục 7: ĐẠT   — 5 lần đầu: 201 201 201 201 201 · lần 6: HTTP 429, Retry-After 60, application/problem+json, code RATE_LIMITED\nMục 8: TRƯỢT — 30 request đồng thời: 8 cái không bị 429 (tối đa 5)\nMục 9: ĐẠT   — cùng email, 6 IP giả: 401 401 401 401 401 429 · email khác: 401\nMục 10: ĐẠT   — Redis dừng: GET NET-02 HTTP 200 (0.517536 s), POST đặt HTTP 201 (1.029849 s)\nĐiểm: 9/10\nthời gian chấm 0:37.59");

const L134_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4 · Lab</span>
<h2>Chapter 13 lab + interview questions</h2>
<p class="lead">Your SWP391 team demo is next week. The lab catalog page is called by every student every few seconds, a classmate wrote a script that books the same lab fifty times to "test" the API, and someone has been trying passwords on the manager account all evening. Your task: put Redis in front of the catalog without ever serving wrong data, limit bookings and login attempts across every instance, and keep the API working when Redis is down. A grading script checks ten things against the running API and the real Redis, the way a reviewer and an attacker would.</p>

<h3>The starting point</h3>
<p>The starter is the Chapter 18 LabFlow project, unchanged: no cache, no Redis dependency, no rate limit. Everything in this chapter is missing.</p>

<h3>The contract (what the grader assumes)</h3>
<ul>
  <li>The project builds with <code>mvn compile</code>; main class <code>vn.labflow.LabflowApplication</code>; database through <code>LABFLOW_DB_*</code>; profile <code>dev</code> (sample labs); manager account from <code>LABFLOW_MANAGER_PASSWORD</code>; clock fixed by <code>LABFLOW_NOW</code> — as in Chapter 18.</li>
  <li>Redis is reachable at <code>localhost:6379</code>, without password (inside the grader's private network).</li>
  <li>Cache keys for labs are named <code>labflow::lab::&lt;code&gt;</code> and rate-limit errors use the code <code>RATE_LIMITED</code>.</li>
  <li>You may change anything else.</li>
</ul>

<h3>The grader</h3>
<p>It copies your project, compiles it, starts it on a clean PostgreSQL and a clean Redis in its own network namespace, sends real HTTP requests, reads Redis with <code>redis-cli</code>, edits one row directly in PostgreSQL (to prove that reads really come from the cache) and finally freezes Redis with <code>docker pause</code>. Passwords are generated per run.</p>
${MA134_CHAM}
<p>The starter, graded for real (about 30 seconds):</p>
${OUT134_STARTER}

<h3>Part A — tasks (graded)</h3>
<ol>
  <li><strong>Cache the catalog</strong> (items 1–5): <code>GET /api/v1/labs/{code}</code> reads through a Redis cache named <code>lab</code>, key prefix <code>labflow::</code>, JSON values, TTL between 1 and 15 minutes; an unknown code must not create a key — lessons 13.1 and 13.2.</li>
  <li><strong>Evict correctly</strong> (item 6): a status change through <code>PATCH /api/v1/labs/{code}/status</code> is visible on the next read; the eviction runs after commit — lesson 13.3.</li>
  <li><strong>Limit bookings</strong> (items 7–8): at most 5 <code>POST /api/v1/bookings</code> per user per minute across all instances; the sixth gets 429 <code>application/problem+json</code>, <code>code: RATE_LIMITED</code> and a <code>Retry-After</code> header between 1 and 60; 30 simultaneous requests from one user must not let more than 5 through — lesson 13.2.</li>
  <li><strong>Limit login attempts</strong> (item 9): at most 5 attempts per <em>email</em> per 15 minutes, whatever <code>X-Forwarded-For</code> says; another email is not affected. This one is new — design it from 13.2.</li>
  <li><strong>Survive Redis</strong> (item 10): with Redis frozen, reading a lab and creating a booking both succeed in under 3 seconds each.</li>
</ol>

<h3>Part B — write it down (not graded, checked in review)</h3>
<ul>
  <li>A short "cache contract" in the README: each cache, its key, TTL and why, who evicts it, and what happens when Redis is down.</li>
  <li>Your decision for login attempts when Redis is down — fail-open or fail-closed — and one sentence why.</li>
</ul>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Part</th><th>Points</th><th>What earns them</th></tr></thead>
  <tbody>
    <tr><td>Grader</td><td>10</td><td>One point per item that passes</td></tr>
    <tr><td>Cache contract</td><td>2</td><td>Every cache listed with key, TTL and eviction path; matches the code</td></tr>
    <tr><td>Fail decision</td><td>1</td><td>A choice with a reason tied to the feature</td></tr>
    <tr><td>Code review</td><td>2</td><td>No per-user data cached without the user in the key; no <code>@Cacheable</code> on self-called methods; no unsafe default typing</td></tr>
  </tbody>
</table>

<h3>Hints</h3>
<ul>
  <li>Item 4 fails if your "cache" writes the key but the endpoint still reads the database — the grader changes the name in PostgreSQL behind your back.</li>
  <li>Item 8 is the race of lesson 13.2. A GET-then-SET counter passes item 7 (sequential) and fails item 8. That is what the "trap" version below does.</li>
  <li>Item 9: the counter for login must be keyed by the normalised email (trim + lower case), and it must be checked <em>before</em> the password is verified — otherwise wrong passwords are free.</li>
</ul>

<h3>Self-check: the official solution and a trap</h3>
<p>The official solution, graded by the same script (the code is hidden below):</p>
${OUT134_GIAI}
<p>The same solution with a limiter that reads, compares and then writes:</p>
${MA134_BAY}
${OUT134_BAY}
<p>Everything passes except item 8: eight requests out of thirty got through a limit of five. In production that is a script booking every slot in the week before anyone else can click.</p>
${giai('Show the solution (try first!)', `<p>Files changed on top of the starter (all shown in lessons 13.1–13.3 unless noted):</p><ul><li><code>pom.xml</code>: <code>spring-boot-starter-cache</code>, <code>spring-boot-starter-data-redis</code>.</li><li><code>application.properties</code>: Redis host/port, <code>timeout=500ms</code>, <code>connect-timeout=1s</code>, <code>labflow.cache.ttl=10m</code>, <code>labflow.cache.lech=1m</code>.</li><li><code>shared/CacheCauHinh</code>: JSON with a type allow-list, prefix <code>labflow::</code>, TTL with jitter, <code>transactionAware()</code>, <code>CacheErrorHandler</code> (13.2).</li><li><code>catalog/internal/LabCatalogImpl</code>: <code>@Cacheable(cacheNames = "lab", key = "#code", unless = "#result == null")</code>; <code>LabController.doiTrangThai</code>: <code>@CacheEvict(cacheNames = "lab", key = "#code")</code>.</li><li><code>shared/GioiHan</code> (Lua INCR + PEXPIRE, fail-open) + a 429 handler with <code>Retry-After</code> in <code>XuLyLoi</code>; <code>BookingController.dat</code> calls <code>gioiHan.kiem("dat", userId, 5, 1 minute)</code>.</li><li>New for the lab — <code>AuthController</code>:</li></ul>` + MA134_AUTH + MA134_PROPS)}

<h3>🎤 What the interviewer will ask (chapter 13)</h3>
<ol>
  <li><strong>"Walk me through what happens when a @Cacheable method is called."</strong> — Proxy, key from arguments, lookup in the named cache, hit returns without calling, miss calls and stores (unless). Mention self-invocation and that the method body does not run on a hit.</li>
  <li><strong>"How do you keep the cache consistent with the database?"</strong> — Cache-aside: update, commit, then evict; transaction-aware cache manager; every writer evicts; TTL as the bound; double delete or versions for the slow-reader race. Say which data you refuse to cache.</li>
  <li><strong>"What is a cache stampede? Did you ever see one?"</strong> — Describe the measurement: 50 concurrent misses, 50 queries; <code>sync</code> alone useless with Spring Data Redis; a locking writer gave 1 query across instances, at the price of a per-cache lock.</li>
  <li><strong>"Design rate limiting for a login endpoint behind a load balancer."</strong> — Redis counter keyed by account (not only IP), atomic increment + expiry, check before verifying the password, 429 + Retry-After, decide fail-open/closed, beware of <code>X-Forwarded-For</code> spoofing, consider sliding window or token bucket.</li>
  <li><strong>"How would you secure Redis?"</strong> — Private network only, no public port, ACL/password, protected mode on, TLS when crossing hosts, JSON values with restricted types (no Java serialization). Cite an incident (HeadCrab).</li>
</ol>

<h3>📌 Summary</h3>
<ul>
  <li>Graded for real: starter 1/10, solution 10/10, solution with a GET-then-SET limiter 9/10 (8 of 30 got through).</li>
  <li>The grader proves the cache is used by changing the database behind it, and proves resilience by freezing Redis.</li>
  <li>Login attempts are limited per account, checked before the password, independent of headers the client controls.</li>
</ul>
</div>
`;

const L134_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4 · Lab</span>
<h2>Lab chương 13 + câu hỏi phỏng vấn</h2>
<p class="lead">Tuần sau nhóm SWP391 của bạn demo. Trang danh mục phòng lab được mọi sinh viên gọi vài giây một lần, một bạn cùng lớp viết script đặt cùng một phòng năm mươi lần để "thử" API, và có người đã thử mật khẩu tài khoản quản lý suốt buổi tối. Nhiệm vụ: đặt Redis trước danh mục mà không bao giờ trả dữ liệu sai, giới hạn số lần đặt và số lần đăng nhập trên mọi instance, và giữ API chạy được khi Redis chết. Một script chấm kiểm mười điều trên API đang chạy và trên Redis thật, theo cách người review và kẻ tấn công cùng làm.</p>

<h3>Điểm xuất phát</h3>
<p>Bản khởi đầu là dự án LabFlow của Chương 18, giữ nguyên: chưa có cache, chưa có dependency Redis, chưa có giới hạn tần suất. Mọi thứ của chương này đều còn thiếu.</p>

<h3>Hợp đồng (điều bộ chấm giả định)</h3>
<ul>
  <li>Dự án build bằng <code>mvn compile</code>; lớp chính <code>vn.labflow.LabflowApplication</code>; CSDL cấu hình qua <code>LABFLOW_DB_*</code>; profile <code>dev</code> (phòng mẫu); tài khoản quản lý từ <code>LABFLOW_MANAGER_PASSWORD</code>; đồng hồ cố định bằng <code>LABFLOW_NOW</code> — như Chương 18.</li>
  <li>Redis ở <code>localhost:6379</code>, không mật khẩu (bên trong mạng riêng của bộ chấm).</li>
  <li>Khoá cache của phòng có tên <code>labflow::lab::&lt;mã&gt;</code> và lỗi giới hạn tần suất dùng mã <code>RATE_LIMITED</code>.</li>
  <li>Mọi thứ khác bạn được đổi.</li>
</ul>

<h3>Bộ chấm</h3>
<p>Nó chép dự án của bạn, biên dịch, khởi động trên một PostgreSQL sạch và một Redis sạch trong network namespace riêng, gửi request HTTP thật, đọc Redis bằng <code>redis-cli</code>, sửa thẳng một dòng trong PostgreSQL (để chứng minh lần đọc thật sự lấy từ cache) và cuối cùng cho Redis đứng hình bằng <code>docker pause</code>. Mật khẩu sinh mới mỗi lần chấm.</p>
${MA134_CHAM}
<p>Bản khởi đầu, chấm thật (khoảng 30 giây):</p>
${OUT134_STARTER}

<h3>Phần A — nhiệm vụ (có chấm)</h3>
<ol>
  <li><strong>Cache danh mục</strong> (mục 1–5): <code>GET /api/v1/labs/{code}</code> đọc qua cache Redis tên <code>lab</code>, tiền tố khoá <code>labflow::</code>, giá trị JSON, TTL từ 1 tới 15 phút; mã không tồn tại không được tạo khoá — bài 13.1 và 13.2.</li>
  <li><strong>Xoá đúng lúc</strong> (mục 6): đổi trạng thái qua <code>PATCH /api/v1/labs/{code}/status</code> thì lần đọc sau thấy ngay; lệnh xoá chạy sau commit — bài 13.3.</li>
  <li><strong>Giới hạn đặt lịch</strong> (mục 7–8): tối đa 5 lần <code>POST /api/v1/bookings</code> mỗi người mỗi phút trên mọi instance; lần thứ sáu nhận 429 <code>application/problem+json</code>, <code>code: RATE_LIMITED</code> và header <code>Retry-After</code> từ 1 tới 60; 30 request đồng thời của một người không được lọt quá 5 — bài 13.2.</li>
  <li><strong>Giới hạn đăng nhập</strong> (mục 9): tối đa 5 lần thử mỗi <em>email</em> mỗi 15 phút, mặc kệ <code>X-Forwarded-For</code> ghi gì; email khác không bị ảnh hưởng. Phần này mới — tự thiết kế từ bài 13.2.</li>
  <li><strong>Sống sót khi Redis chết</strong> (mục 10): Redis đứng hình mà đọc phòng và tạo lượt đặt đều thành công, mỗi request dưới 3 giây.</li>
</ol>

<h3>Phần B — viết ra giấy (không chấm tự động, xem khi review)</h3>
<ul>
  <li>Một "hợp đồng cache" ngắn trong README: từng cache, khoá, TTL và lý do, ai xoá nó, Redis chết thì sao.</li>
  <li>Quyết định của bạn cho đăng nhập khi Redis chết — cho qua hay chặn — kèm một câu lý do.</li>
</ul>

<h3>Thang điểm</h3>
<table>
  <thead><tr><th>Phần</th><th>Điểm</th><th>Được điểm khi</th></tr></thead>
  <tbody>
    <tr><td>Bộ chấm</td><td>10</td><td>Mỗi mục đạt một điểm</td></tr>
    <tr><td>Hợp đồng cache</td><td>2</td><td>Đủ mọi cache với khoá, TTL và đường xoá; khớp với mã</td></tr>
    <tr><td>Quyết định khi lỗi</td><td>1</td><td>Có lựa chọn và lý do gắn với tính năng</td></tr>
    <tr><td>Review mã</td><td>2</td><td>Không cache dữ liệu riêng mà thiếu người dùng trong khoá; không <code>@Cacheable</code> trên phương thức tự gọi; không bật typing không an toàn</td></tr>
  </tbody>
</table>

<h3>Gợi ý</h3>
<ul>
  <li>Mục 4 trượt nếu "cache" của bạn có ghi khoá nhưng endpoint vẫn đọc CSDL — bộ chấm đổi tên phòng trong PostgreSQL sau lưng bạn.</li>
  <li>Mục 8 là cuộc đua của bài 13.2. Bộ đếm GET-rồi-SET qua mục 7 (tuần tự) và trượt mục 8. Đúng điều bản "bẫy" bên dưới làm.</li>
  <li>Mục 9: bộ đếm đăng nhập phải khoá theo email đã chuẩn hoá (bỏ khoảng trắng + chữ thường), và phải kiểm <em>trước</em> khi so mật khẩu — nếu không, thử sai mật khẩu là miễn phí.</li>
</ul>

<h3>Tự kiểm: lời giải chính thức và một cái bẫy</h3>
<p>Lời giải chính thức, chấm bằng cùng script (mã ẩn ở dưới):</p>
${OUT134_GIAI}
<p>Cùng lời giải nhưng bộ giới hạn đọc, so sánh rồi mới ghi:</p>
${MA134_BAY}
${OUT134_BAY}
<p>Qua hết trừ mục 8: tám trên ba mươi request lọt qua giới hạn năm. Ở production, đó là một script đặt hết khung giờ trong tuần trước khi ai kịp bấm.</p>
${giai('Xem lời giải (hãy tự làm trước!)', `<p>Các tệp đổi so với bản khởi đầu (đều đã có trong bài 13.1–13.3, trừ chỗ ghi chú):</p><ul><li><code>pom.xml</code>: <code>spring-boot-starter-cache</code>, <code>spring-boot-starter-data-redis</code>.</li><li><code>application.properties</code>: host/port Redis, <code>timeout=500ms</code>, <code>connect-timeout=1s</code>, <code>labflow.cache.ttl=10m</code>, <code>labflow.cache.lech=1m</code>.</li><li><code>shared/CacheCauHinh</code>: JSON có danh sách kiểu cho phép, tiền tố <code>labflow::</code>, TTL có độ lệch, <code>transactionAware()</code>, <code>CacheErrorHandler</code> (13.2).</li><li><code>catalog/internal/LabCatalogImpl</code>: <code>@Cacheable(cacheNames = "lab", key = "#code", unless = "#result == null")</code>; <code>LabController.doiTrangThai</code>: <code>@CacheEvict(cacheNames = "lab", key = "#code")</code>.</li><li><code>shared/GioiHan</code> (Lua INCR + PEXPIRE, fail-open) + handler 429 có <code>Retry-After</code> trong <code>XuLyLoi</code>; <code>BookingController.dat</code> gọi <code>gioiHan.kiem("dat", userId, 5, 1 phút)</code>.</li><li>Mới cho lab — <code>AuthController</code>:</li></ul>` + MA134_AUTH + MA134_PROPS)}

<h3>🎤 Phỏng vấn viên sẽ hỏi (chương 13)</h3>
<ol>
  <li><strong>"Kể lại chuyện gì xảy ra khi gọi một phương thức @Cacheable."</strong> — Proxy, khoá từ tham số, tra trong cache có tên, trúng thì trả mà không gọi, trượt thì gọi rồi lưu (trừ khi unless). Nhắc chuyện tự gọi và chuyện thân phương thức không chạy khi trúng.</li>
  <li><strong>"Giữ cache nhất quán với CSDL thế nào?"</strong> — Cache-aside: cập nhật, commit, rồi xoá; cache manager biết transaction; mọi nơi ghi đều xoá; TTL là giới hạn trên; xoá hai lần hoặc phiên bản cho cuộc đua đọc chậm. Nói rõ dữ liệu nào bạn từ chối cache.</li>
  <li><strong>"Cache stampede là gì? Bạn từng gặp chưa?"</strong> — Kể phép đo: 50 lần trượt đồng thời, 50 truy vấn; riêng <code>sync</code> vô dụng với Spring Data Redis; writer có khoá cho 1 truy vấn trên các instance, đổi lại một khoá cho mỗi cache.</li>
  <li><strong>"Thiết kế giới hạn tần suất cho endpoint đăng nhập sau bộ cân bằng tải."</strong> — Bộ đếm Redis khoá theo tài khoản (không chỉ IP), tăng + đặt hạn nguyên tử, kiểm trước khi so mật khẩu, 429 + Retry-After, quyết định fail-open/closed, cẩn thận <code>X-Forwarded-For</code> giả mạo, cân nhắc cửa sổ trượt hoặc token bucket.</li>
  <li><strong>"Bảo vệ Redis thế nào?"</strong> — Chỉ mạng riêng, không cổng công khai, ACL/mật khẩu, bật protected mode, TLS khi đi qua nhiều máy, giá trị JSON giới hạn kiểu (không tuần tự hoá Java). Dẫn một sự cố (HeadCrab).</li>
</ol>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chấm thật: bản khởi đầu 1/10, lời giải 10/10, lời giải với bộ giới hạn GET-rồi-SET 9/10 (lọt 8 trên 30).</li>
  <li>Bộ chấm chứng minh cache được dùng bằng cách sửa CSDL sau lưng nó, và chứng minh khả năng chịu lỗi bằng cách cho Redis đứng hình.</li>
  <li>Số lần đăng nhập giới hạn theo tài khoản, kiểm trước mật khẩu, không phụ thuộc header do client điều khiển.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ13 = [
  Q('ThongKeService.baoCao() calls this.theoPhong(code), which has @Cacheable. Called twice with three codes, how many real queries run?|||ThongKeService.baoCao() gọi this.theoPhong(code) có @Cacheable. Gọi hai lần với ba mã, có bao nhiêu truy vấn thật?', [
    '3: the second call hits the cache|||3: lần hai trúng cache',
    '6: a call through this bypasses the proxy, nothing is cached|||6: gọi qua this đi vòng qua proxy, không có gì được cache',
    '1: Spring merges the three keys|||1: Spring gộp ba khoá',
    '0: @Cacheable methods are computed at startup|||0: phương thức @Cacheable được tính sẵn lúc khởi động',
  ], 1),
  Q('A cached method reads the current user from SecurityContext inside its body and uses key = "#size". What happened in the measurement?|||Một phương thức được cache đọc người dùng hiện tại từ SecurityContext bên trong thân, khoá là "#size". Phép đo cho thấy gì?', [
    'Spring adds the user to the key automatically|||Spring tự thêm người dùng vào khoá',
    'The second user got 403|||Người thứ hai nhận 403',
    'The second user received the first user\'s bookings|||Người thứ hai nhận lượt đặt của người thứ nhất',
    'The cache refused to store per-user data|||Cache từ chối lưu dữ liệu riêng từng người',
  ], 2),
  Q('300 random codes hit GET /api/v1/labs/{code}, whose method has unless = "#result == null". How many lab keys are created?|||300 mã ngẫu nhiên gọi GET /api/v1/labs/{code}, phương thức có unless = "#result == null". Có bao nhiêu khoá lab được tạo?', [
    '0|||0', '300|||300', '1, a shared "not found" key|||1, một khoá "không tìm thấy" dùng chung', '300, each with a 1-second TTL|||300, mỗi khoá TTL 1 giây',
  ], 0),
  Q('Without a value serializer, what does Spring Data Redis store for a LabInfo?|||Không đặt bộ tuần tự hoá giá trị, Spring Data Redis lưu gì cho một LabInfo?', [
    'JSON without type information|||JSON không có thông tin kiểu',
    'Java serialization bytes starting with \\xac\\xed, including the class name|||Byte tuần tự hoá Java bắt đầu bằng \\xac\\xed, có tên lớp',
    'The result of toString()|||Kết quả của toString()',
    'Nothing: a serializer is mandatory|||Không gì cả: bắt buộc phải có serializer',
  ], 1),
  Q('During a rolling deploy, v2 adds the field building to LabInfo and reads an entry written by v1 (JSON). What did the API return?|||Khi triển khai cuốn chiếu, v2 thêm trường building vào LabInfo và đọc bản do v1 ghi (JSON). API trả về gì?', [
    '500 with an UnrecognizedPropertyException|||500 kèm UnrecognizedPropertyException',
    'The correct building read from the database|||Đúng building đọc từ CSDL',
    'building: null, with no error|||building: null, không có lỗi nào',
    'A WARN and a cache miss|||Một dòng WARN và trượt cache',
  ], 2),
  Q('Two instances use spring.cache.type=simple. The manager changes a lab status through instance A. What does instance B return?|||Hai instance dùng spring.cache.type=simple. Quản lý đổi trạng thái phòng qua instance A. Instance B trả gì?', [
    'The new status: Spring broadcasts evictions|||Trạng thái mới: Spring phát lệnh xoá cho mọi nơi',
    'The old status, from its own memory|||Trạng thái cũ, từ bộ nhớ của chính nó',
    '404|||404', 'An error: simple caches cannot be shared|||Lỗi: cache simple không dùng chung được',
  ], 1),
  Q('50 simultaneous requests hit a rate limiter that does GET, compares with 5, then SET. How many passed in the measurement?|||50 request đồng thời vào bộ giới hạn làm GET, so với 5, rồi SET. Phép đo cho thấy bao nhiêu cái lọt?', [
    '5|||5', '6|||6', '50|||50', '0, Redis rejects concurrent GETs|||0, Redis từ chối GET đồng thời',
  ], 2),
  Q('A @Transactional service calls another bean\'s @CacheEvict method, then works 1.5 s before commit. Without transactionAware(), what can a reader cache in that window?|||Một service @Transactional gọi phương thức @CacheEvict của bean khác, rồi làm thêm 1,5 s trước commit. Không có transactionAware(), một lần đọc có thể cache gì trong khoảng đó?', [
    'The new uncommitted value|||Giá trị mới chưa commit',
    'The old committed value, which then stays until the TTL|||Giá trị cũ đã commit, rồi nằm đó tới hết TTL',
    'Nothing: the key is locked until commit|||Không gì: khoá bị khoá tới khi commit',
    'An error value|||Một giá trị lỗi',
  ], 1),
  Q('With Spring Data Redis 4.1.2 and Boot\'s default RedisCacheManager, what did sync = true change for 50 simultaneous misses?|||Với Spring Data Redis 4.1.2 và RedisCacheManager mặc định của Boot, sync = true thay đổi gì cho 50 lần trượt đồng thời?', [
    'Nothing: still 50 queries — a locking cache writer is needed|||Không gì: vẫn 50 truy vấn — cần cache writer có khoá',
    'One query per instance|||Một truy vấn mỗi instance',
    'One query for the whole cluster|||Một truy vấn cho cả cụm',
    'All requests failed with a timeout|||Mọi request lỗi timeout',
  ], 0),
  Q('Which key should the LabFlow login limiter use?|||Bộ giới hạn đăng nhập của LabFlow nên khoá theo gì?', [
    'The X-Forwarded-For header|||Header X-Forwarded-For',
    'The normalised email of the account being tried|||Email đã chuẩn hoá của tài khoản đang bị thử',
    'The JWT of the caller|||JWT của người gọi',
    'A global counter for all logins|||Một bộ đếm chung cho mọi lần đăng nhập',
  ], 1),
];
const L = (n, slug, en, vi, description, content) => ({
  title: `13.${n} — ${en}|||13.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 13 — Caching with Redis|||Chương 13 — Cache với Redis',
  description: 'Cache và giới hạn tần suất cho LabFlow bằng Redis, đo thật trên hai instance: @Cacheable và các bẫy proxy, khoá, tên cache, khoá rác, lộ dữ liệu người khác; JSON có danh sách kiểu, TTL, triển khai cuốn chiếu; xoá sau commit, đọc chậm ghi lại dữ liệu cũ, bùng tải và khoá ghi; giới hạn nguyên tử bằng Lua; lab có bộ chấm 10 mục.',
  lessons: [
    L(1, 'sb-13-1-cache-abstraction', 'Spring Cache abstraction', 'Lớp trừu tượng Spring Cache',
      'Cùng một truy vấn quét 2 triệu dòng đo khi không cache, cache trong JVM và cache Redis (năm lời gọi, một truy vấn thật); bẫy tự gọi qua this và field đọc qua proxy CGLIB ra null; @CacheEvict/@CachePut/condition/unless; hai phương thức chung tên cache ⇒ ClassCastException ở endpoint công khai; 300 mã rác ⇒ 300 khoá; khoá thiếu người dùng ⇒ lộ lịch người khác như sự cố Steam 2015.',
      L131_EN + L131_VI),
    L(2, 'sb-13-2-redis-cache', 'Redis as the cache: TTL and serialization', 'Redis làm cache: TTL và tuần tự hoá',
      'RedisCacheManager của LabFlow: JSON có @class và danh sách kiểu cho phép (177 ⇒ 136 byte, chặn lớp lạ), TTL riêng từng cache; triển khai cuốn chiếu v1/v2 trả building null không báo lỗi; cache cục bộ trả trạng thái cũ ở instance thứ hai; Redis đứng hình 0,63 s nhờ CacheErrorHandler; giới hạn tần suất: GET-rồi-SET lọt 50/50, Lua lọt đúng 5, 429 + Retry-After, X-Forwarded-For giả, dồn ở ranh giới cửa sổ; HeadCrab.',
      L132_EN + L132_VI),
    L(3, 'sb-13-3-cache-invalidation', 'Invalidation, stampede and consistency', 'Vô hiệu hoá cache, bùng tải và nhất quán',
      'Dòng thời gian thật: ghi thẳng CSDL để đặt được phòng đang bảo trì; xoá cache trong transaction đang mở ⇒ cũ 598 s, transactionAware() sửa; đọc chậm ghi lại bản cũ, xoá hai lần thu về 3 s; 50 lần trượt đồng thời ⇒ 50 truy vấn, sync=true không đổi gì với Spring Data Redis 4.1.2, writer có khoá ⇒ 1 truy vấn cho hai instance; độ lệch TTL, tỉ lệ trúng qua Actuator; khi nào không cache; Facebook 2010.',
      L133_EN + L133_VI),
    L(4, 'sb-13-4-lab-13', 'Chapter 13 lab + interview questions', 'Lab chương 13 + câu hỏi phỏng vấn',
      'Lab có bộ chấm 10 mục chạy trên API và Redis thật: cache danh mục phòng (khoá, JSON, TTL, đọc thật từ cache, không khoá rác, xoá khi đổi trạng thái), giới hạn đặt lịch 5/phút nguyên tử, giới hạn đăng nhập theo email, sống sót khi Redis đứng hình. Bản khởi đầu 1/10, lời giải 10/10 (ẩn), bẫy GET-rồi-SET 9/10. Năm câu phỏng vấn của chương.',
      L134_EN + L134_VI),
    {
      title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra chương 13',
      slug: 'sb-13-5-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về những gì đã chạy thật trong chương: tự gọi qua this, khoá thiếu người dùng, unless chặn khoá rác, byte JDK, triển khai cuốn chiếu, cache cục bộ trên hai instance, GET-rồi-SET lọt 50/50, xoá trước commit, sync=true với Spring Data Redis, khoá của bộ giới hạn đăng nhập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something that ran in this chapter — a cache the method never reached, a student who saw another student's bookings, a field that came back null during a deploy, fifty requests through a limit of five, and a sync flag that did nothing until the writer had a lock.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là thứ đã chạy trong chương — một cache mà phương thức không bao giờ chạm tới, một sinh viên thấy lịch của sinh viên khác, một trường thành null khi triển khai, năm mươi request lọt giới hạn năm, và một cờ sync không làm gì cho tới khi writer có khoá.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ13 },
    },
  ],
};
