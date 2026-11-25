/**
 * 8.2 — Lỗi thời gian: múi giờ, giờ mùa hè, tháng bắt đầu từ 0, lệch đồng hồ (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Node 22.22 (TZ khác nhau), JDK 25 (java.time, SimpleDateFormat), jsonwebtoken 9, node:test MockTimers, container node:22-alpine/alpine,
 * chronyc — scratchpad/dbg/lab/ch8 (tools/js/gio.mjs, jwt.mjs, dat-cho*.mjs, java/thu/Gio.java, tools/c82.sh; o-82-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { GIO_JS, JWT_JS, DATCHO_JS, DATCHO_TEST, J_GIO as MA_J_GIO } from './_ma-8.mjs';
import { PARSE, THANG, DST, HOMNAY, JWT, TEST, J_GIO, CONTAINER } from './_ra-8.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_LUU = ma(`// Quy tắc lưu trữ: một THỜI ĐIỂM (instant) lưu UTC, kèm múi giờ của người dùng nếu cần hiển thị lại
// PostgreSQL:  bat_dau timestamptz            (lưu UTC, đọc ra theo TimeZone của phiên)
// Prisma:      batDau DateTime @db.Timestamptz(3)   — mặc định của Prisma là timestamp KHÔNG múi (bài 7.2)
// Java:        Instant / OffsetDateTime trong entity, ZonedDateTime khi tính theo lịch của người dùng
// JSON:        "2026-12-01T01:00:00Z" hoặc "2026-12-01T08:00:00+07:00" — LUÔN có Z hoặc ±hh:mm

// Một NGÀY lịch (sinh nhật, ngày nghỉ, "ngày 01/12") không phải thời điểm: lưu kiểu date, KHÔNG đổi múi
// PostgreSQL: ngay date     Java: LocalDate     JS: chuỗi 'YYYY-MM-DD' (đừng new Date() nó)

// "Hôm nay" luôn phải trả lời: hôm nay THEO AI?
const homNayVN = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());   // '2026-12-01'
// Java: LocalDate.now(clock.withZone(ZoneId.of("Asia/Ho_Chi_Minh")))`);

const MA_CLOCK_JAVA = ma(`// Spring: tiêm Clock thay vì gọi LocalDate.now() / Instant.now() trực tiếp
@Configuration
class GioConfig {
  @Bean Clock clock() { return Clock.system(ZoneId.of("Asia/Ho_Chi_Minh")); }
}

@Service
class DatChoService {
  private final Clock clock;
  DatChoService(Clock clock) { this.clock = clock; }
  boolean conHan(DatCho d) { return d.getHetHan().isAfter(Instant.now(clock)); }
}

// Test: đồng hồ đứng yên tại đúng thời điểm khó (00:30 sáng, ngày đổi giờ, 29/02, 31/12)
var clock = Clock.fixed(Instant.parse("2026-11-30T17:30:00Z"), ZoneId.of("Asia/Ho_Chi_Minh"));
assertEquals(LocalDate.of(2026, 12, 1), LocalDate.now(clock));`, 'java');

const MA_DO_THOI_GIAN = ma(`// Đo KHOẢNG thời gian: dùng đồng hồ đơn điệu (monotonic) — không bao giờ chạy lùi
const t0 = performance.now();          // Node/trình duyệt     — Java: System.nanoTime()
await viec();
const ms = performance.now() - t0;     // ĐỪNG dùng Date.now() để đo: NTP chỉnh giờ, giây nhuận ⇒ có thể ra số ÂM`);

const BANG_TZ_EN = `<table>
<thead><tr><th>Where the time zone comes from</th><th>How to see it</th><th>Typical value</th></tr></thead>
<tbody>
<tr><td>Your laptop</td><td><code>date</code>, <code>node -p "Intl.DateTimeFormat().resolvedOptions().timeZone"</code></td><td>Asia/Saigon (= Asia/Ho_Chi_Minh)</td></tr>
<tr><td>A Docker container</td><td><code>docker exec … date</code></td><td><strong>UTC</strong> unless <code>TZ</code> is set</td></tr>
<tr><td>JVM</td><td><code>ZoneId.systemDefault()</code>, flag <code>-Duser.timezone=</code></td><td>from <code>TZ</code> / OS</td></tr>
<tr><td>PostgreSQL session</td><td><code>SHOW TimeZone;</code></td><td>server default, or set by the driver</td></tr>
<tr><td>The user's browser</td><td>DevTools → <em>Sensors</em> → Location → Timezone ID (to override)</td><td>wherever the user is</td></tr>
</tbody></table>`;

const BANG_TZ_VI = `<table>
<thead><tr><th>Múi giờ lấy từ đâu</th><th>Xem bằng cách nào</th><th>Giá trị hay gặp</th></tr></thead>
<tbody>
<tr><td>Máy của bạn</td><td><code>date</code>, <code>node -p "Intl.DateTimeFormat().resolvedOptions().timeZone"</code></td><td>Asia/Saigon (= Asia/Ho_Chi_Minh)</td></tr>
<tr><td>Container Docker</td><td><code>docker exec … date</code></td><td><strong>UTC</strong> nếu không đặt <code>TZ</code></td></tr>
<tr><td>JVM</td><td><code>ZoneId.systemDefault()</code>, cờ <code>-Duser.timezone=</code></td><td>theo <code>TZ</code> / hệ điều hành</td></tr>
<tr><td>Phiên PostgreSQL</td><td><code>SHOW TimeZone;</code></td><td>mặc định của server, hoặc do driver đặt</td></tr>
<tr><td>Trình duyệt của người dùng</td><td>DevTools → <em>Sensors</em> → Location → Timezone ID (để giả lập)</td><td>người dùng ở đâu thì là đó</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'MDN — Date', 'Chuỗi chỉ ngày được hiểu là UTC, chuỗi ngày-giờ không múi được hiểu là giờ địa phương; tháng đếm từ 0.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date'),
  nguon('🟩', 'Node.js — Test runner: MockTimers', 'mock.timers.enable({ apis: ["Date", "setTimeout"], now }) và tick().', 'https://nodejs.org/api/test.html'),
  nguon('🧭', 'Chrome DevTools — Sensors', 'Giả lập Timezone ID và locale cho trang đang mở để tái hiện lỗi của khách ở múi khác.', 'https://developer.chrome.com/docs/devtools/sensors'),
  nguon('🧯', 'Microsoft Azure — Summary of the service disruption on Feb 29th, 2012', 'Chứng chỉ "hết hạn sau một năm" được tính thành 29/02/2013 — ngày không tồn tại ⇒ cụm máy chủ lỗi dây chuyền.', 'https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/'),
  nguon('🧯', 'Cloudflare — How and why the leap second affected Cloudflare DNS (2017)', 'Giây nhuận làm hiệu hai lần đọc đồng hồ ra số âm ⇒ panic trong RRDNS; sửa bằng đồng hồ đơn điệu.', 'https://blog.cloudflare.com/how-and-why-the-leap-second-affected-cloudflare-dns/'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-6-3-du-lieu', title: 'Bài 6.3 — Lỗi dữ liệu gửi nhận: múi giờ trong JSON', sub: 'LocalDateTime gặp "+07:00", TZ dev vs UTC — phía API.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-7-2-ket-qua-sai', title: 'Bài 7.2 — timestamp vs timestamptz', sub: 'Prisma DateTime mặc định không múi ⇒ 114 thay vì 100 lượt.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '8.2 — Time bugs: time zones, DST, month index 0, clock skew|||8.2 — Lỗi thời gian: múi giờ, giờ mùa hè, tháng bắt đầu từ 0, lệch đồng hồ',
  slug: 'dbg-8-2-thoi-gian',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chạy cùng một đoạn mã dưới bốn TZ: new Date("2026-12-01") ở New York là ngày 30/11; ô ngày 01/12 qua toISOString().slice(0,10) thành "2026-11-30" ở cả Việt Nam lẫn Tokyo; server UTC nói "hôm nay" là 30/11 lúc 00:30 sáng 01/12 giờ VN. Tháng 0, setMonth tràn 31/01 ⇒ 03/03 (Java kẹp về 28/02), YYYY ⇒ 28/12/2026 in thành 2027. DST New York: ngày 08/03 dài 23 giờ, 02:30 không tồn tại, +24 h ≠ +1 ngày. Container alpine bỏ qua TZ (thiếu tzdata) nhưng Node vẫn đúng. Lệch đồng hồ: JWT "jwt not active"/"jwt expired" và clockTolerance. Đồng hồ giả: node:test MockTimers đỏ→xanh, Clock trong Spring. Azure 29/02/2012, Cloudflare giây nhuận 2017.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>"It is off by one day — but only for some customers"</h2>
<p class="lead">Time bugs are nondeterministic in a sneaky way: the code is deterministic, but its result depends on <em>where</em> and <em>when</em> it runs — the time zone of the server, of the container, of the user's browser, the date (end of month, end of year, a daylight-saving day) and the clock of another machine. The reproduction trick is therefore simple: <strong>run the same code under several time zones and at a fixed, nasty instant</strong>. Every output below comes from one script run with different <code>TZ</code> values.</p>

<h3>An everyday picture: calling home from Tokyo</h3>
<p>Your friend studying in Tokyo texts "see you tomorrow at 8" at 23:30 Tokyo time. For you in Hà Nội it is 21:30 — does "tomorrow" mean the same day for both of you? Only if you both agree <em>whose</em> calendar you are talking about. Software has the same problem, except it never asks: it silently uses the calendar of whatever machine it happens to run on.</p>

<h3>1. Parsing: one string, two meanings</h3>
<details><summary>tools/js/gio.mjs — every demo of this lesson</summary>${ma(GIO_JS)}</details>
${ra(PARSE)}
<p>Two rules of JavaScript that cause most "off by one day" tickets: a <strong>date-only</strong> string (<code>'2026-12-01'</code>) is parsed as <strong>UTC</strong> midnight, while a date-time string without offset (<code>'2026-12-01T00:00'</code>) is parsed as <strong>local</strong> time. So in New York <code>new Date('2026-12-01').getDate()</code> is 30. And the very common <code>toISOString().slice(0, 10)</code> — "give me the date part" — returns the <em>UTC</em> date: a user in Việt Nam or Tokyo who picks 1 December in a date input sends <code>2026-11-30</code> to the API. Users west of UTC are fine, which is why the bug "only happens to some customers".</p>

<h3>2. "Today" depends on who is asking</h3>
${ra(HOMNAY)}
<p>At 00:30 on 1 December in Việt Nam the instant is 17:30 on 30 November UTC. A server running in UTC (every Docker container by default) computes "today" as 30 November — the daily report runs on the wrong day, "bookings for today" is empty for the first seven hours. The fix is never "set the server to Asia/Ho_Chi_Minh and hope"; it is to say explicitly whose calendar you mean:</p>
${MA_LUU}

<h3>3. Months from 0, overflowing dates, YYYY</h3>
${ra(THANG)}
<p>JavaScript months are 0–11, days are 1–31, and out-of-range values silently roll over: "add one month" to 31 January gives <strong>3 March</strong>. <code>getDay()</code> is the weekday, <code>getDate()</code> the day of month — a classic typo. Java's old API counts months from 0 too; <code>java.time</code> is safer and <em>clamps</em> instead of overflowing:</p>
<details><summary>java/thu/Gio.java</summary>${ma(MA_J_GIO, 'java')}</details>
${ra(J_GIO)}
<p>Line 4 is a bug that ships every December: pattern letter <code>YYYY</code> is the <em>week-based year</em>, not the calendar year (<code>yyyy</code>). For 2026 the US week containing 1 January 2027 starts on Sunday 27 December, so from 27 to 31 December 2026 every date prints as 2027 — invoices, file names, "valid until" fields. It passes every test written in any other month. In code review, search for <code>YYYY</code> and <code>DD</code> (day of year) in date patterns.</p>

<h3>4. Daylight saving time: days of 23 and 25 hours</h3>
<p>Việt Nam has no DST, but your clients and servers may: the United States, Europe and Australia shift clocks twice a year. Outsourcing projects for US or EU customers hit this every March and November.</p>
${ra(DST)}
<p>On 8 March 2026 in New York, 02:00 jumps to 03:00: the day has 23 hours, "02:30" does not exist (JavaScript and Java both move it to 03:30), and "plus 24 hours" is not "plus one day" (13:00 vs 12:00). On 1 November, 01:00–02:00 happens twice: a log line at "01:30" is ambiguous unless it carries the offset (<code>-04:00</code> or <code>-05:00</code>). Rules: add <em>calendar</em> units (<code>plusDays</code>, <code>setDate</code>) for "same time tomorrow", add <em>durations</em> for "in 24 hours", and always log instants in UTC or with the offset.</p>
${BANG_TZ_EN}

<h3>5. Containers: the zone you did not choose</h3>
${ra(CONTAINER)}
<p>Three facts from one run. (1) A container shares the host kernel, so it shares the <strong>clock</strong>: the same instant, shown in UTC. You cannot "set the date" inside a normal container; to test a future date, inject a clock (section 7). (2) <code>TZ=Asia/Ho_Chi_Minh</code> had <strong>no effect</strong> on <code>date</code> in plain <code>alpine</code> — the image has no <code>tzdata</code> — while Node in <code>node:22-alpine</code> honoured it because Node ships its own time zone data (ICU). Java ships its own too. So "the container ignores TZ" can be true for one process and false for another in the same image. (3) <code>chronyc tracking</code> shows how far this machine is from NTP time (here 2 ms) — the first thing to check when two machines disagree.</p>

<h3>6. Clock skew between machines</h3>
<p>Tokens carry times: <code>iat</code> (issued at), <code>nbf</code> (not before), <code>exp</code> (expires). If the machine that issues tokens and the machine that checks them disagree about "now", valid tokens are rejected. The demo signs tokens with the issuer's clock shifted and verifies them with the real clock (no system clock is touched):</p>
<details><summary>tools/js/jwt.mjs</summary>${ma(JWT_JS)}</details>
${ra(JWT)}
<p>An auth server 90 seconds fast issues tokens that are "not active yet" for 90 seconds — users log in and immediately get 401, then it works a minute later ("sometimes"). Six minutes slow, a 5-minute token is already expired on arrival. A small <code>clockTolerance</code> (Spring Security: <code>JwtTimestampValidator</code> clock skew, 60 s by default) absorbs normal drift; the real fix is NTP on every machine. When you see 401s that come and go, compare <code>date -u</code> on both machines before reading any code.</p>
${MA_DO_THOI_GIAN}

<h3>7. Fake clocks: make time a parameter</h3>
<p>If your code calls <code>new Date()</code> or <code>LocalDate.now()</code> directly, you cannot test 00:30 on 1 December, the DST day or 31 December — and your CI result depends on when it runs. Inject the clock. In Node's built-in test runner:</p>
<details><summary>tools/js/dat-cho.mjs — code under test</summary>${ma(DATCHO_JS)}</details>
${ma(DATCHO_TEST)}
${ra(TEST)}
<p>The buggy <code>homNayLoi</code> fails with a clear diff (<code>'2026-11-30'</code> vs <code>'2026-12-01'</code>) at a frozen instant; the fixed version passes under <code>TZ=UTC</code>, and the 15-minute hold is tested in milliseconds with <code>tick()</code>. (MockTimers is still marked experimental in Node 22 and prints a warning; Jest and Vitest have <code>useFakeTimers</code> with the same idea.) In Spring, inject <code>java.time.Clock</code>:</p>
${MA_CLOCK_JAVA}

<h3>Real incidents</h3>
<p><strong>Microsoft Azure, 29 February 2012.</strong> A component created certificates "valid for one year" by adding 1 to the year: on 29 February 2012 that produced 29 February 2013, a date that does not exist. Certificate creation failed, agents restarted, hosts were marked faulty, and the failure cascaded across clusters for many hours (Azure's own summary). <strong>Cloudflare, 1 January 2017.</strong> During a leap second the wall clock went backwards; code computed a duration as the difference of two wall-clock readings, got a negative number, and passed it to a random-number function that panics on negatives — some DNS lookups failed. Their fix: use the monotonic clock for durations. Both bugs were invisible on any other day of the year.</p>

<h3>On the job</h3>
<p>Japanese, Korean and US clients are common in Vietnamese outsourcing. A typical ticket: <em>"顧客から：12月1日の予約が11月30日に表示される"</em> — "the customer's 1 December booking shows on 30 November". Your first three questions: in which zone is the user, in which zone does the server/container run, and what exactly is stored (instant or date, with or without zone)? Reproduce with <code>TZ=Asia/Tokyo</code> on the API process and the DevTools <em>Sensors</em> timezone override in the browser. In the fix note, list the tested instants (00:30 local, 23:30 local, a DST day for US users, 29/02, 27–31/12).</p>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>tools/c82.sh</code>. Add <code>TZ=Australia/Sydney</code> and <code>TZ=America/Los_Angeles</code> to the parse demo and predict each line before running.</li>
<li>Open a page with <code>&lt;input type="date"&gt;</code> in Chrome, set DevTools → Sensors → Timezone ID to <code>Asia/Tokyo</code>, pick 1 December, and log <code>new Date(value + 'T00:00').toISOString()</code>.</li>
<li>Find every <code>toISOString().slice(0, 10)</code>, <code>YYYY</code> and <code>LocalDate.now()</code> without a clock in your own project.</li>
<li>Write a node:test (or JUnit with <code>Clock.fixed</code>) for "bookings for today" at 00:30 and 23:30 Việt Nam time with the process in <code>TZ=UTC</code>.</li>
<li>Sign a JWT on one container and verify on another after shifting the issuer's <code>iat</code> by 120 s; make the 401 message say "clock skew" in your error handler.</li>
</ol>
<p><strong>Done when:</strong> your time-dependent code takes a clock, and its tests pass with <code>TZ=UTC</code>, <code>TZ=Asia/Tokyo</code> and <code>TZ=America/New_York</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Instant</span><span class="v">A point on the global timeline (store in UTC / timestamptz).</span></div>
  <div class="kv"><span class="k">Local date</span><span class="v">A calendar day with no zone (a birthday, "1 December").</span></div>
  <div class="kv"><span class="k">Offset vs zone</span><span class="v">+07:00 is an offset; Asia/Ho_Chi_Minh is a zone with rules and history.</span></div>
  <div class="kv"><span class="k">DST gap / overlap</span><span class="v">Local times that do not exist / happen twice on clock-change days.</span></div>
  <div class="kv"><span class="k">Week-based year (YYYY)</span><span class="v">The year of the week a date belongs to — differs at year boundaries.</span></div>
  <div class="kv"><span class="k">Clock skew</span><span class="v">Two machines disagree about the current time.</span></div>
  <div class="kv"><span class="k">Monotonic clock</span><span class="v">Never goes backwards; use it to measure durations.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Reproduce time bugs by running under several <code>TZ</code> values at a fixed, nasty instant.</li>
<li>Date-only strings are UTC in JS; <code>toISOString().slice(0,10)</code> is the UTC date, not the user's.</li>
<li>Store instants in UTC with an offset; store calendar dates as dates; always say "today in which zone".</li>
<li>Months from 0, overflow, <code>YYYY</code>, DST gaps: test the boundaries explicitly.</li>
<li>Containers run in UTC; <code>TZ</code> works only if the process has zone data.</li>
<li>Intermittent 401s: compare clocks (NTP) before reading code.</li>
<li>Inject a clock; never call "now" directly in logic you need to test.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>"Lệch một ngày — nhưng chỉ với một số khách"</h2>
<p class="lead">Lỗi thời gian là kiểu bất định rất khó chịu: mã thì tất định, nhưng kết quả phụ thuộc vào việc nó chạy <em>ở đâu</em> và <em>lúc nào</em> — múi giờ của server, của container, của trình duyệt người dùng, ngày tháng (cuối tháng, cuối năm, ngày đổi giờ mùa hè) và đồng hồ của một máy khác. Vì vậy mẹo tái hiện rất đơn giản: <strong>chạy cùng một đoạn mã dưới nhiều múi giờ và tại một thời điểm cố định, hiểm hóc</strong>. Mọi output dưới đây đến từ một script chạy với các giá trị <code>TZ</code> khác nhau.</p>

<h3>Liên tưởng đời thường: gọi về nhà từ Tokyo</h3>
<p>Bạn của bạn du học ở Tokyo nhắn "mai 8 giờ gặp nhé" lúc 23:30 giờ Tokyo. Với bạn ở Hà Nội lúc đó là 21:30 — "mai" có phải cùng một ngày với cả hai người không? Chỉ khi hai người thống nhất đang nói theo lịch <em>của ai</em>. Phần mềm gặp đúng vấn đề đó, chỉ khác là nó không bao giờ hỏi: nó lặng lẽ dùng lịch của chiếc máy mà nó tình cờ đang chạy trên đó.</p>

<h3>1. Phân tích chuỗi: một chuỗi, hai nghĩa</h3>
<details><summary>tools/js/gio.mjs — mọi demo của bài này</summary>${ma(GIO_JS)}</details>
${ra(PARSE)}
<p>Hai luật của JavaScript gây ra phần lớn ticket "lệch một ngày": chuỗi <strong>chỉ có ngày</strong> (<code>'2026-12-01'</code>) được hiểu là nửa đêm <strong>UTC</strong>, còn chuỗi ngày-giờ không có độ lệch (<code>'2026-12-01T00:00'</code>) được hiểu là giờ <strong>địa phương</strong>. Nên ở New York <code>new Date('2026-12-01').getDate()</code> là 30. Và cách rất phổ biến <code>toISOString().slice(0, 10)</code> — "lấy phần ngày" — trả về ngày <em>theo UTC</em>: người dùng ở Việt Nam hay Tokyo chọn ngày 1 tháng 12 trong ô ngày sẽ gửi <code>2026-11-30</code> lên API. Người dùng ở phía tây UTC thì không sao, nên lỗi "chỉ xảy ra với một số khách".</p>

<h3>2. "Hôm nay" tuỳ người hỏi</h3>
${ra(HOMNAY)}
<p>Lúc 00:30 ngày 1 tháng 12 ở Việt Nam, thời điểm đó là 17:30 ngày 30 tháng 11 theo UTC. Server chạy UTC (mọi container Docker mặc định như vậy) tính "hôm nay" là 30 tháng 11 — báo cáo ngày chạy nhầm ngày, "lịch đặt hôm nay" trống suốt bảy tiếng đầu. Cách sửa không bao giờ là "đặt server sang Asia/Ho_Chi_Minh rồi cầu may"; mà là nói rõ bạn đang nói theo lịch của ai:</p>
${MA_LUU}

<h3>3. Tháng từ 0, ngày tràn, YYYY</h3>
${ra(THANG)}
<p>Tháng trong JavaScript là 0–11, ngày là 1–31, và giá trị ngoài khoảng bị lặng lẽ cuộn sang: "cộng một tháng" vào 31 tháng 1 cho ra <strong>3 tháng 3</strong>. <code>getDay()</code> là thứ trong tuần, <code>getDate()</code> mới là ngày trong tháng — một lỗi gõ nhầm kinh điển. API cũ của Java cũng đếm tháng từ 0; <code>java.time</code> an toàn hơn và <em>kẹp</em> về cuối tháng thay vì tràn:</p>
<details><summary>java/thu/Gio.java</summary>${ma(MA_J_GIO, 'java')}</details>
${ra(J_GIO)}
<p>Dòng 4 là lỗi tháng Mười Hai nào cũng có người mắc: ký tự mẫu <code>YYYY</code> là <em>năm theo tuần</em>, không phải năm lịch (<code>yyyy</code>). Với năm 2026, tuần (kiểu Mỹ) chứa ngày 1/1/2027 bắt đầu từ Chủ nhật 27/12, nên từ 27 tới 31/12/2026 mọi ngày đều in ra năm 2027 — hoá đơn, tên tệp, trường "có hiệu lực tới". Nó qua mọi bài test viết vào bất kỳ tháng nào khác. Khi review mã, hãy tìm <code>YYYY</code> và <code>DD</code> (ngày trong năm) trong các mẫu định dạng ngày.</p>

<h3>4. Giờ mùa hè: những ngày dài 23 và 25 tiếng</h3>
<p>Việt Nam không có giờ mùa hè (DST), nhưng khách hàng và server của bạn có thể có: Mỹ, châu Âu, Úc chỉnh đồng hồ hai lần một năm. Dự án outsourcing cho khách Mỹ hay châu Âu gặp chuyện này mỗi tháng Ba và tháng Mười Một.</p>
${ra(DST)}
<p>Ngày 8 tháng 3 năm 2026 ở New York, 02:00 nhảy thẳng lên 03:00: ngày đó dài 23 giờ, "02:30" không tồn tại (cả JavaScript và Java đều dời nó thành 03:30), và "cộng 24 giờ" không bằng "cộng một ngày" (13:00 so với 12:00). Ngày 1 tháng 11, khoảng 01:00–02:00 diễn ra hai lần: một dòng log lúc "01:30" là mơ hồ nếu không kèm độ lệch (<code>-04:00</code> hay <code>-05:00</code>). Luật: cộng theo đơn vị <em>lịch</em> (<code>plusDays</code>, <code>setDate</code>) cho "giờ này ngày mai", cộng <em>khoảng thời gian</em> cho "sau 24 giờ nữa", và luôn ghi log thời điểm theo UTC hoặc kèm độ lệch.</p>
${BANG_TZ_VI}

<h3>5. Container: múi giờ bạn không hề chọn</h3>
${ra(CONTAINER)}
<p>Ba sự thật từ một lần chạy. (1) Container dùng chung nhân với máy chủ nên dùng chung <strong>đồng hồ</strong>: cùng một thời điểm, chỉ hiện theo UTC. Bạn không thể "chỉnh ngày" bên trong một container bình thường; muốn thử một ngày trong tương lai thì tiêm đồng hồ (mục 7). (2) <code>TZ=Asia/Ho_Chi_Minh</code> <strong>không có tác dụng</strong> với lệnh <code>date</code> trong <code>alpine</code> trơn — ảnh không có <code>tzdata</code> — trong khi Node trong <code>node:22-alpine</code> vẫn nhận, vì Node tự mang dữ liệu múi giờ (ICU). Java cũng tự mang. Nên câu "container bỏ qua TZ" có thể đúng với tiến trình này và sai với tiến trình kia trong cùng một ảnh. (3) <code>chronyc tracking</code> cho biết máy này lệch bao xa so với giờ NTP (ở đây 2 ms) — việc đầu tiên cần kiểm khi hai máy không thống nhất giờ.</p>

<h3>6. Lệch đồng hồ giữa các máy</h3>
<p>Token mang theo thời gian: <code>iat</code> (cấp lúc), <code>nbf</code> (không dùng trước), <code>exp</code> (hết hạn). Nếu máy cấp token và máy kiểm token không thống nhất "bây giờ" là mấy giờ, token hợp lệ sẽ bị từ chối. Demo ký token bằng đồng hồ của máy cấp bị lệch và kiểm bằng đồng hồ thật (không đụng tới đồng hồ hệ thống nào):</p>
<details><summary>tools/js/jwt.mjs</summary>${ma(JWT_JS)}</details>
${ra(JWT)}
<p>Một auth server chạy nhanh 90 giây cấp ra token "chưa có hiệu lực" trong 90 giây — người dùng đăng nhập xong nhận ngay 401, một phút sau lại được ("thỉnh thoảng"). Chậm sáu phút thì token hạn 5 phút vừa tới nơi đã hết hạn. Một <code>clockTolerance</code> nhỏ (Spring Security: clock skew của <code>JwtTimestampValidator</code>, mặc định 60 s) hấp thụ độ trôi bình thường; cách sửa thật là NTP trên mọi máy. Khi thấy lỗi 401 lúc có lúc không, hãy so <code>date -u</code> trên hai máy trước khi đọc dòng mã nào.</p>
${MA_DO_THOI_GIAN}

<h3>7. Đồng hồ giả: biến thời gian thành tham số</h3>
<p>Nếu mã của bạn gọi thẳng <code>new Date()</code> hay <code>LocalDate.now()</code>, bạn không test được 00:30 ngày 1/12, ngày đổi giờ hay 31/12 — và kết quả CI phụ thuộc vào lúc nó chạy. Hãy tiêm đồng hồ vào. Với trình chạy test có sẵn của Node:</p>
<details><summary>tools/js/dat-cho.mjs — mã được test</summary>${ma(DATCHO_JS)}</details>
${ma(DATCHO_TEST)}
${ra(TEST)}
<p>Bản lỗi <code>homNayLoi</code> trượt với một diff rõ ràng (<code>'2026-11-30'</code> so với <code>'2026-12-01'</code>) tại một thời điểm bị đóng băng; bản sửa qua dưới <code>TZ=UTC</code>, và việc giữ chỗ 15 phút được test trong vài mili giây bằng <code>tick()</code>. (MockTimers vẫn ghi là thử nghiệm ở Node 22 và in một cảnh báo; Jest và Vitest có <code>useFakeTimers</code> cùng ý tưởng.) Trong Spring, tiêm <code>java.time.Clock</code>:</p>
${MA_CLOCK_JAVA}

<h3>Sự cố thật</h3>
<p><strong>Microsoft Azure, 29/02/2012.</strong> Một thành phần tạo chứng chỉ "có hạn một năm" bằng cách cộng 1 vào năm: ngày 29/02/2012 nó tạo ra 29/02/2013, một ngày không tồn tại. Tạo chứng chỉ thất bại, agent khởi động lại, máy chủ bị đánh dấu hỏng, và lỗi lan dây chuyền qua các cụm trong nhiều giờ (theo bản tóm tắt của chính Azure). <strong>Cloudflare, 01/01/2017.</strong> Trong một giây nhuận, đồng hồ thường chạy lùi; mã tính một khoảng thời gian bằng hiệu hai lần đọc đồng hồ thường, ra số âm, rồi đưa vào một hàm sinh số ngẫu nhiên vốn panic khi gặp số âm — một phần truy vấn DNS thất bại. Cách họ sửa: dùng đồng hồ đơn điệu để đo khoảng thời gian. Cả hai lỗi đều vô hình vào mọi ngày khác trong năm.</p>

<h3>Tình huống đi làm</h3>
<p>Khách Nhật, Hàn, Mỹ rất phổ biến trong outsourcing ở Việt Nam. Một ticket điển hình: <em>"顧客から：12月1日の予約が11月30日に表示される"</em> — "lịch đặt ngày 1/12 của khách hiện thành ngày 30/11". Ba câu hỏi đầu tiên của bạn: người dùng ở múi nào, server/container chạy múi nào, và chính xác thứ gì được lưu (thời điểm hay ngày, có múi hay không)? Tái hiện bằng <code>TZ=Asia/Tokyo</code> cho tiến trình API và chế độ giả lập múi giờ trong DevTools <em>Sensors</em> cho trình duyệt. Trong ghi chú bản sửa, liệt kê các thời điểm đã test (00:30 giờ địa phương, 23:30 giờ địa phương, một ngày DST cho người dùng Mỹ, 29/02, 27–31/12).</p>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>tools/c82.sh</code>. Thêm <code>TZ=Australia/Sydney</code> và <code>TZ=America/Los_Angeles</code> vào demo parse và đoán trước từng dòng rồi mới chạy.</li>
<li>Mở một trang có <code>&lt;input type="date"&gt;</code> trong Chrome, đặt DevTools → Sensors → Timezone ID thành <code>Asia/Tokyo</code>, chọn ngày 1/12, và log <code>new Date(value + 'T00:00').toISOString()</code>.</li>
<li>Tìm mọi chỗ <code>toISOString().slice(0, 10)</code>, <code>YYYY</code> và <code>LocalDate.now()</code> không có Clock trong dự án của chính bạn.</li>
<li>Viết một node:test (hoặc JUnit với <code>Clock.fixed</code>) cho "lịch đặt hôm nay" lúc 00:30 và 23:30 giờ Việt Nam khi tiến trình chạy <code>TZ=UTC</code>.</li>
<li>Ký một JWT ở một container và kiểm ở container khác sau khi dời <code>iat</code> của bên cấp 120 s; làm cho thông báo 401 trong bộ xử lý lỗi ghi rõ "lệch đồng hồ".</li>
</ol>
<p><strong>Đạt khi:</strong> mã phụ thuộc thời gian của bạn nhận một đồng hồ, và test của nó qua với <code>TZ=UTC</code>, <code>TZ=Asia/Tokyo</code> và <code>TZ=America/New_York</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Thời điểm (instant)</span><span class="v">Một điểm trên dòng thời gian toàn cầu (lưu UTC / timestamptz).</span></div>
  <div class="kv"><span class="k">Ngày lịch (local date)</span><span class="v">Một ngày trên lịch, không có múi (sinh nhật, "ngày 1/12").</span></div>
  <div class="kv"><span class="k">Độ lệch vs múi giờ</span><span class="v">+07:00 là độ lệch; Asia/Ho_Chi_Minh là múi giờ có luật và lịch sử.</span></div>
  <div class="kv"><span class="k">Khoảng hở / chồng DST</span><span class="v">Giờ địa phương không tồn tại / xảy ra hai lần vào ngày đổi giờ.</span></div>
  <div class="kv"><span class="k">Năm theo tuần (YYYY)</span><span class="v">Năm của tuần chứa ngày đó — khác năm lịch ở ranh giới năm.</span></div>
  <div class="kv"><span class="k">Lệch đồng hồ (clock skew)</span><span class="v">Hai máy không thống nhất giờ hiện tại.</span></div>
  <div class="kv"><span class="k">Đồng hồ đơn điệu</span><span class="v">Không bao giờ chạy lùi; dùng để đo khoảng thời gian.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tái hiện lỗi thời gian bằng cách chạy dưới nhiều giá trị <code>TZ</code> tại một thời điểm cố định, hiểm hóc.</li>
<li>Chuỗi chỉ có ngày là UTC trong JS; <code>toISOString().slice(0,10)</code> là ngày UTC, không phải ngày của người dùng.</li>
<li>Lưu thời điểm theo UTC kèm độ lệch; lưu ngày lịch dưới dạng ngày; luôn nói "hôm nay theo múi nào".</li>
<li>Tháng từ 0, ngày tràn, <code>YYYY</code>, khoảng hở DST: test ranh giới một cách tường minh.</li>
<li>Container chạy UTC; <code>TZ</code> chỉ có tác dụng khi tiến trình có dữ liệu múi giờ.</li>
<li>401 lúc có lúc không: so đồng hồ (NTP) trước khi đọc mã.</li>
<li>Tiêm đồng hồ; đừng bao giờ gọi thẳng "now" trong logic bạn cần test.</li>
</ul>
${NGUON}
</div>
`,
};
