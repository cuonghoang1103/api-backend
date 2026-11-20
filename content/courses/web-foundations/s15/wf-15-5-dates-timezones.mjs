/**
 * Bài 15.5 — Ngày, giờ và múi giờ: dd/MM/yyyy không lệch một ngày (soạn 20/11/2026).
 * Mã + output: ../_ma.mjs — _demo/_t15/ngay/(tất cả).js chạy bằng _demo/_t15/chay.mjs trong Chromium với timezoneId cố định
 * (Asia/Ho_Chi_Minh và America/New_York) và đồng hồ cố định page.clock = 05/12/2026 10:00 giờ VN.
 * Không trùng: 4.4 (sắp xếp chuỗi tiếng Việt bằng localeCompare), 11.1 (Intl.NumberFormat VND trong ví dụ closure),
 * React 13.4 (Intl.DateTimeFormat/PluralRules/RelativeTimeFormat cho i18n giao diện). Chưa có deck wf-15-5.
 */
import { ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

export default {
  title: '15.5 — Dates, times and time zones: dd/MM/yyyy without the off-by-one-day bug|||15.5 — Ngày, giờ và múi giờ: dd/MM/yyyy không bị lệch một ngày',
  slug: 'wf-15-5-dates-timezones',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Date là MỘT con số (mili giây từ 1970 UTC); tháng đếm từ 0 và ngày tràn (31/02 → 03/03); chuỗi "2026-11-20" đọc theo UTC còn "2026-11-20T00:00" đọc theo giờ máy — chạy thật ở Hà Nội và New York; tự đọc dd/MM/yyyy và từ chối ngày không có; hiển thị bằng Intl với timeZone, bẫy toISOString().slice(0,10) cho input type=date; cộng "một ngày" ≠ cộng 24 giờ khi đổi giờ mùa hè; so sánh và sắp xếp Date; Temporal; góc hacker: đừng tin đồng hồ của trình duyệt. Mọi ví dụ chạy thật trong Chromium.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.5</span>
<h2>Dates, times and time zones: the bug that only appears for some users</h2>
<p class="lead">Date bugs are special: the code passes every test on your laptop in Hà Nội and shows yesterday's date to a teammate in another country, or to a server running in UTC. After this lesson you can explain what a <code>Date</code> really stores, avoid the 0-based month and "rolled-over day" traps, parse a Vietnamese <code>dd/MM/yyyy</code> date safely, send and store dates in a format that cannot be misread, display them in the right time zone, do calendar arithmetic that survives daylight-saving changes, and say why a deadline must be checked on the server. FER202 practical exams ask for <code>dd/MM/yyyy</code> display; real projects add the time-zone part the first week you deploy.</p>

<h3>An everyday picture: a flight ticket</h3>
<p>A flight leaves Tân Sơn Nhất at 23:30 and lands in Tokyo at 07:00. Both times are printed in <em>local</em> time of each airport, yet the plane took off at one single instant. The airline's system stores that instant once — in UTC — and every screen converts it for its own location. JavaScript dates work exactly like that: <strong>one instant inside, many ways to print it outside</strong>. Almost every date bug is a confusion between the instant and one of its printed forms.</p>

<h3>Step 1 — a Date is one number</h3>
<p>All examples in this lesson ran in Chromium with the computer's time zone set explicitly. Here is the same script on a computer in Vietnam, then on one in New York:</p>
${ma('javascript', CODE['_t15/ngay/1-mot-con-so.js'])}
${ra(OUT['_t15/out/15-5-1-mot-con-so-vn'])}
${ra(OUT['_t15/out/15-5-1-mot-con-so-ny'])}
<p>The number from <code>getTime()</code> (milliseconds since 1 January 1970, 00:00 UTC) is identical on both machines, and so is <code>toISOString()</code>, which always prints UTC (the <code>Z</code> at the end means "zero offset"). Only <code>toString()</code> differs: it prints the instant in the <em>computer's</em> zone — Friday 08:30 in Hà Nội, still Thursday 20:30 in New York. There is no such thing as "a Date in Vietnam time"; there is an instant, and a zone you choose when you print it.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Inside</span><span class="lz-t">1795138200000</span><span class="lz-d">One instant. Same on every machine. Store and compare this.</span></div>
<div class="lz-layer"><span class="lz-k">Over the wire</span><span class="lz-t">2026-11-20T01:30:00.000Z</span><span class="lz-d">ISO 8601 in UTC (or with an explicit offset). What APIs send and databases store.</span></div>
<div class="lz-layer"><span class="lz-k">On screen</span><span class="lz-t">08:30 20/11/2026 · 11/19/2026, 8:30 PM</span><span class="lz-d">The same instant, printed for a zone and a language. Decided at the last moment.</span></div>
</div>

<h3>Step 2 — months count from 0, and days roll over</h3>
${ma('javascript', CODE['_t15/ngay/2-thang-tu-0.js'])}
${ra(OUT['_t15/out/15-5-2-thang-tu-0-vn'])}
<p>In <code>new Date(year, month, day)</code> the month runs from 0 (January) to 11 (December), while the day runs from 1. So <code>new Date(2026, 11, 20)</code> is <strong>December</strong>. <code>getDay()</code> is the day of the <em>week</em> (5 = Friday); the day of the month is <code>getDate()</code>. And JavaScript never refuses an impossible date: 31 February quietly becomes 3 March. That is why <code>isRealDate</code> builds the date and then checks that nothing rolled over.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>getMonth() + 1</code> forgotten, or added twice.</strong> Every date you print by hand needs <code>+ 1</code> on the month, and every date you build from user input needs <code>- 1</code>. Put both conversions in one small helper each, never inline — this is the most common date bug in student projects.</p></div>

<h3>Step 3 — the same-looking string, two different instants</h3>
${ma('javascript', CODE['_t15/ngay/3-doc-chuoi.js'])}
<p>In Vietnam:</p>
${ra(OUT['_t15/out/15-5-3-doc-chuoi-vn'])}
<p>In New York:</p>
${ra(OUT['_t15/out/15-5-3-doc-chuoi-ny'])}
<p>This is the famous off-by-one-day bug. <code>'2026-11-20'</code> (date only) is read as <strong>midnight UTC</strong>, while <code>'2026-11-20T00:00'</code> (date and time, no zone) is read as <strong>midnight local</strong> — the specification says so. In Vietnam the first one still shows 20 November (07:00), so the bug hides. In New York it is 19 November, 19:00: a birthday or a deadline shown one day early. <code>'20/11/2026'</code> is not a format JavaScript knows at all (Invalid Date), and some browsers would read <code>'11/20/2026'</code> month-first — never let the browser guess. Our <code>parseVN</code> uses a regex (lesson 11.5), builds a <em>local</em> date, and returns <code>null</code> for 31/02.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — storing a birthday as an instant.</strong> A date of birth, a public holiday or an exam day is a <em>calendar date</em>, not a moment in time: it should be "20/11/2026" for everyone on Earth. Send it as the plain string <code>"2026-11-20"</code> and keep it as a string (or a <code>DATE</code> column in SQL, lesson 8.1) — do not turn it into a <code>Date</code> at midnight in some zone and back, or someone will get the 19th.</p></div>

<h3>Step 4 — displaying: decide the zone on purpose</h3>
${ma('javascript', CODE['_t15/ngay/4-hien-thi.js'])}
<p>On a computer in Vietnam, then in New York:</p>
${ra(OUT['_t15/out/15-5-4-hien-thi-vn'])}
${ra(OUT['_t15/out/15-5-4-hien-thi-ny'])}
<p>The lines that pass a <code>timeZone</code> to <code>Intl</code> print the same thing on both machines. The hand-made <code>dd/MM/yyyy</code> uses <code>getDate()</code>, which follows the computer's zone — correct for "the user's own clock", wrong if you meant "Vietnam time" and the user is abroad. And the last two lines show the trap behind many broken date pickers: <code>&lt;input type="date"&gt;</code> wants <code>yyyy-MM-dd</code> in local time, but <code>toISOString().slice(0, 10)</code> gives the <em>UTC</em> date — at 06:00 in Hà Nội, that is still yesterday.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Show in the user's own zone</span><span class="v"><code>new Intl.DateTimeFormat('vi-VN', options).format(d)</code> without <code>timeZone</code> — chat timestamps, "last seen".</span></div>
  <div class="kv"><span class="k">Show in a fixed zone</span><span class="v">Add <code>timeZone: 'Asia/Ho_Chi_Minh'</code> — exam schedules, shop opening hours, anything tied to a place.</span></div>
  <div class="kv"><span class="k">Send to the API</span><span class="v"><code>d.toISOString()</code> for instants; the plain <code>"yyyy-MM-dd"</code> string for calendar dates.</span></div>
  <div class="kv"><span class="k">Fill an input type=date</span><span class="v">Build <code>yyyy-MM-dd</code> from <code>getFullYear()</code>, <code>getMonth() + 1</code>, <code>getDate()</code> — not from <code>toISOString()</code>.</span></div>
</div>

<h3>Step 5 — arithmetic and comparison</h3>
${ma('javascript', CODE['_t15/ngay/5-cong-tru-so-sanh.js'])}
<p>In Vietnam, then in New York:</p>
${ra(OUT['_t15/out/15-5-5-cong-tru-so-sanh-vn'])}
${ra(OUT['_t15/out/15-5-5-cong-tru-so-sanh-ny'])}
<p>Vietnam has no daylight-saving time, so "+ 86,400,000 ms" and "next day" agree — and the bug hides again. In New York, clocks went back one hour on Sunday 1 November 2026, so that day had 25 hours: adding 24 hours lands at 11:00, while <code>setDate(getDate() + 1)</code> does calendar arithmetic and lands at 12:00. Use <code>setDate</code>/<code>setMonth</code> for "same time tomorrow / next month"; use milliseconds for durations ("the token expires in 15 minutes"). The rest: two <code>Date</code> objects are two objects, so <code>===</code> is false even for the same instant — compare <code>getTime()</code>, or use <code>&lt;</code>/<code>&gt;</code> and subtraction, which convert dates to their numbers. Counting whole days is safest at UTC midnight of both calendar dates.</p>

<h3>Step 6 — Temporal: the new API</h3>
<p><code>Date</code> was copied from Java in 1995 and has carried these traps since. Its replacement, <strong>Temporal</strong>, separates the ideas this lesson kept untangling — a calendar date, a wall-clock time, an exact instant, a date-time in a named zone:</p>
${ma('javascript', CODE['_t15/ngay/7-temporal.js'])}
${ra(OUT['_t15/out/15-5-7-temporal-vn'])}
<p>Months count from 1; adding a month to 31 January clamps to 28 February instead of rolling into March; and "+1 day" versus "+24 hours" across the New York clock change is explicit. The Chromium used for this lesson (version 149) has Temporal built in. Browser support is still uneven, so check Can I use before relying on it without a polyfill — and expect to keep reading <code>Date</code> code for years.</p>

<h3>🕵️ Hacker's corner — the browser's clock belongs to the user</h3>
<p>Anything that runs in the browser can be changed by the person using it: they can change the computer's clock, or simply redefine <code>Date.now</code> in the console. This script checks a coupon that expired at the end of 30 November (the page's clock was fixed at 5 December, 10:00 Vietnam time):</p>
${ma('javascript', CODE['_t15/ngay/6-dong-ho-nguoi-dung.js'])}
${ra(OUT['_t15/out/15-5-6-dong-ho-nguoi-dung-vn'])}
<p>One line typed into DevTools and the expired coupon is valid again. The same goes for "you can submit until 23:59", "this discount ends in 10 minutes" timers, trial periods and exam time limits. <strong>How to defend:</strong> the browser may <em>display</em> a countdown, but the <strong>server</strong> decides, using its own clock, at the moment the request arrives (lesson 7.1: never trust what the client says about itself). Store deadlines as instants in UTC on the server, compare there, and return a clear error when time is up.</p>

<div class="callout ok">
<p><strong>🧪 Lab (30 minutes) — a date toolkit for a booking form</strong></p>
<p>Write a module <code>dates.js</code> with four functions, then test each in the console with the cases below. To try another zone without travelling: DevTools → More tools → <strong>Sensors</strong> → Location → choose a city (e.g. New York); the page's time zone changes after a reload.</p>
<ol>
  <li><code>parseVN('dd/MM/yyyy')</code> ⇒ a local <code>Date</code> or <code>null</code>. Cases: <code>'20/11/2026'</code>, <code>'31/02/2026'</code> (null), <code>'29/02/2028'</code> (valid), <code>'2026-11-20'</code> (null).</li>
  <li><code>formatVN(date, timeZone)</code> ⇒ <code>dd/MM/yyyy</code> using <code>Intl.DateTimeFormat</code>. Case: the instant <code>2026-11-19T17:30:00Z</code> with <code>'Asia/Ho_Chi_Minh'</code> ⇒ <code>20/11/2026</code>.</li>
  <li><code>toInputValue(date)</code> ⇒ <code>yyyy-MM-dd</code> in local time, for <code>&lt;input type="date"&gt;</code>. Case: <code>new Date(2026, 10, 20, 6, 0)</code> ⇒ <code>2026-11-20</code> in every zone.</li>
  <li><code>addDays(date, n)</code> ⇒ a new <code>Date</code> (do not mutate the argument) at the same wall-clock time, n calendar days later.</li>
</ol>
<p><strong>Done when:</strong> every case prints the expected value in your normal zone <em>and</em> after switching the Sensors location to New York; <code>addDays(new Date(2026, 9, 31, 12), 1)</code> prints 12:00 on 1 November in both; and no function calls <code>toISOString().slice</code> or adds <code>86400000</code>.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">instant / timestamp</span><span class="v">thời điểm — một khoảnh khắc duy nhất, như nhau ở mọi nơi.</span></div>
  <div class="kv"><span class="k">UTC</span><span class="v">giờ phối hợp quốc tế — mốc chung, độ lệch 0.</span></div>
  <div class="kv"><span class="k">time zone / offset</span><span class="v">múi giờ (vd Asia/Ho_Chi_Minh) / độ lệch so với UTC (vd +07:00).</span></div>
  <div class="kv"><span class="k">ISO 8601</span><span class="v">chuẩn ghi ngày giờ <code>yyyy-MM-ddTHH:mm:ssZ</code>, không thể đọc nhầm thứ tự ngày/tháng.</span></div>
  <div class="kv"><span class="k">calendar date</span><span class="v">ngày lịch — "20/11/2026" như nhau với mọi người (ngày sinh, ngày lễ).</span></div>
  <div class="kv"><span class="k">daylight saving time (DST)</span><span class="v">giờ mùa hè — một số nước chỉnh đồng hồ ±1 giờ; Việt Nam không dùng.</span></div>
  <div class="kv"><span class="k">rollover</span><span class="v">tràn ngày — ngày không tồn tại bị đẩy sang tháng sau (31/02 → 03/03).</span></div>
  <div class="kv"><span class="k">Temporal</span><span class="v">API ngày giờ mới của JavaScript, thay cho Date.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A <code>Date</code> is one instant (ms since 1970 UTC); time zones only matter when you print or parse.</li>
  <li>Months 0–11, days 1–31; impossible dates roll over silently — validate by checking nothing rolled.</li>
  <li><code>'yyyy-MM-dd'</code> parses as UTC, <code>'yyyy-MM-ddTHH:mm'</code> as local; parse <code>dd/MM/yyyy</code> yourself.</li>
  <li>Send instants as ISO strings in UTC; keep calendar dates as <code>"yyyy-MM-dd"</code> strings.</li>
  <li>Display with <code>Intl.DateTimeFormat</code> and an explicit <code>timeZone</code> when the date belongs to a place; never fill <code>input type=date</code> from <code>toISOString()</code>.</li>
  <li>"Tomorrow" is <code>setDate(+1)</code>, not +24 hours; compare with <code>getTime()</code>, not <code>===</code>.</li>
  <li>Deadlines and expiry are checked on the server: the browser's clock is the user's.</li>
</ul>
${nguon('📗', 'MDN — Date', 'Constructor, parsing rules (date-only = UTC, date-time = local), getters and setters', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date')}
${nguon('📗', 'MDN — Intl.DateTimeFormat', 'Formatting with locale and timeZone options', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat')}
${nguon('📘', 'MDN — Temporal', 'The new date-time API and its types (PlainDate, ZonedDateTime, Instant…)', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal')}
${nguon('📊', 'Can I use — Temporal', 'Current browser support before you ship it without a polyfill', 'https://caniuse.com/temporal')}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-pe10-3-cau-3', title: 'FER202 PE — Exam 10, Question 3', sub: 'Order history with dd/MM/yyyy dates and computed totals, as the exam asks', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-7-1-auth-basics', title: 'Lesson 7.1 — authentication vs authorization', sub: 'Step 5: never trust what the client says about itself', cta: 'Open lesson' })}
${lienKet({ khoa: 'react', bai: 'rx-13-4-bao-mat-i18n', title: 'React 13.4 — safe HTML and basic i18n with Intl', sub: 'Intl formats, plurals and relative time inside components', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-5-regex', title: 'Lesson 11.5 — regular expressions', sub: 'The pattern used by parseVN, and why validation should stop at "good enough"', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.5</span>
<h2>Ngày, giờ và múi giờ: con bug chỉ hiện ra với một số người dùng</h2>
<p class="lead">Bug ngày giờ rất đặc biệt: code qua mọi bài test trên laptop của bạn ở Hà Nội, rồi hiện ngày hôm qua cho một đồng đội ở nước khác, hoặc cho một máy chủ chạy giờ UTC. Học xong bài này bạn giải thích được một <code>Date</code> thật ra lưu gì, tránh được bẫy tháng đếm từ 0 và bẫy "ngày bị tràn", đọc an toàn một ngày tiếng Việt dạng <code>dd/MM/yyyy</code>, gửi và lưu ngày theo định dạng không thể đọc nhầm, hiển thị đúng múi giờ, làm phép cộng trừ theo lịch mà không vỡ khi đổi giờ mùa hè, và nói được vì sao hạn chót phải được kiểm ở máy chủ. Đề thi thực hành FER202 yêu cầu hiển thị <code>dd/MM/yyyy</code>; dự án thật thêm phần múi giờ ngay tuần đầu bạn deploy.</p>

<h3>Liên tưởng đời thường: một tấm vé máy bay</h3>
<p>Một chuyến bay cất cánh ở Tân Sơn Nhất lúc 23:30 và hạ cánh ở Tokyo lúc 07:00. Cả hai giờ đều in theo giờ <em>địa phương</em> của từng sân bay, vậy mà máy bay cất cánh vào đúng một khoảnh khắc duy nhất. Hệ thống của hãng lưu khoảnh khắc đó một lần — theo UTC — và màn hình nào cũng đổi nó ra theo nơi mình đứng. Ngày giờ trong JavaScript chạy y hệt: <strong>bên trong là một thời điểm, bên ngoài có nhiều cách in ra</strong>. Gần như mọi bug ngày giờ là nhầm lẫn giữa thời điểm và một trong những cách in của nó.</p>

<h3>Bước 1 — Date là một con số</h3>
<p>Mọi ví dụ trong bài chạy trong Chromium với múi giờ của máy được đặt rõ ràng. Đây là cùng một script trên một máy ở Việt Nam, rồi trên một máy ở New York:</p>
${ma('javascript', CODE['_t15/ngay/1-mot-con-so.js'])}
${ra(OUT['_t15/out/15-5-1-mot-con-so-vn'])}
${ra(OUT['_t15/out/15-5-1-mot-con-so-ny'])}
<p>Con số từ <code>getTime()</code> (mili giây kể từ 00:00 UTC ngày 1/1/1970) giống hệt trên cả hai máy, và <code>toISOString()</code> cũng vậy — nó luôn in theo UTC (chữ <code>Z</code> ở cuối nghĩa là "độ lệch 0"). Chỉ <code>toString()</code> khác: nó in thời điểm theo múi giờ của <em>máy tính</em> — thứ Sáu 08:30 ở Hà Nội, vẫn là thứ Năm 20:30 ở New York. Không có thứ gọi là "một Date theo giờ Việt Nam"; chỉ có một thời điểm, và một múi giờ bạn chọn lúc in ra.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Bên trong</span><span class="lz-t">1795138200000</span><span class="lz-d">Một thời điểm. Như nhau trên mọi máy. Lưu và so sánh cái này.</span></div>
<div class="lz-layer"><span class="lz-k">Trên đường truyền</span><span class="lz-t">2026-11-20T01:30:00.000Z</span><span class="lz-d">ISO 8601 theo UTC (hoặc kèm độ lệch rõ ràng). Thứ API gửi và cơ sở dữ liệu lưu.</span></div>
<div class="lz-layer"><span class="lz-k">Trên màn hình</span><span class="lz-t">08:30 20/11/2026 · 11/19/2026, 8:30 PM</span><span class="lz-d">Cùng thời điểm đó, in cho một múi giờ và một ngôn ngữ. Quyết định vào phút chót.</span></div>
</div>

<h3>Bước 2 — tháng đếm từ 0, và ngày bị tràn</h3>
${ma('javascript', CODE['_t15/ngay/2-thang-tu-0.js'])}
${ra(OUT['_t15/out/15-5-2-thang-tu-0-vn'])}
<p>Trong <code>new Date(năm, tháng, ngày)</code> tháng chạy từ 0 (tháng Một) tới 11 (tháng Mười Hai), còn ngày chạy từ 1. Nên <code>new Date(2026, 11, 20)</code> là <strong>tháng 12</strong>. <code>getDay()</code> là thứ trong <em>tuần</em> (5 = thứ Sáu); ngày trong tháng là <code>getDate()</code>. Và JavaScript không bao giờ từ chối một ngày không tồn tại: 31 tháng 2 lặng lẽ thành 3 tháng 3. Vì vậy <code>isRealDate</code> dựng ngày rồi kiểm tra là không có gì bị tràn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quên <code>getMonth() + 1</code>, hoặc cộng hai lần.</strong> Mọi ngày bạn tự in ra đều cần <code>+ 1</code> cho tháng, và mọi ngày bạn dựng từ dữ liệu người nhập đều cần <code>- 1</code>. Mỗi phép đổi đặt vào một hàm nhỏ riêng, đừng viết rải rác — đây là bug ngày giờ phổ biến nhất trong đồ án sinh viên.</p></div>

<h3>Bước 3 — chuỗi trông giống nhau, hai thời điểm khác nhau</h3>
${ma('javascript', CODE['_t15/ngay/3-doc-chuoi.js'])}
<p>Ở Việt Nam:</p>
${ra(OUT['_t15/out/15-5-3-doc-chuoi-vn'])}
<p>Ở New York:</p>
${ra(OUT['_t15/out/15-5-3-doc-chuoi-ny'])}
<p>Đây là con bug lệch một ngày nổi tiếng. <code>'2026-11-20'</code> (chỉ có ngày) được đọc là <strong>nửa đêm UTC</strong>, còn <code>'2026-11-20T00:00'</code> (có ngày và giờ, không có múi giờ) được đọc là <strong>nửa đêm giờ máy</strong> — đặc tả quy định như vậy. Ở Việt Nam chuỗi thứ nhất vẫn hiện 20 tháng 11 (07:00), nên bug ẩn mình. Ở New York nó là 19 tháng 11, 19:00: một ngày sinh nhật hay một hạn chót bị hiện sớm một ngày. <code>'20/11/2026'</code> hoàn toàn không phải định dạng JavaScript biết (Invalid Date), và có trình duyệt sẽ đọc <code>'11/20/2026'</code> theo kiểu tháng trước — đừng bao giờ để trình duyệt đoán. Hàm <code>parseVN</code> dùng regex (bài 11.5), dựng một ngày theo giờ <em>máy</em>, và trả <code>null</code> cho 31/02.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lưu ngày sinh như một thời điểm.</strong> Ngày sinh, ngày lễ hay ngày thi là <em>ngày lịch</em>, không phải một khoảnh khắc: nó phải là "20/11/2026" với mọi người trên Trái Đất. Gửi nó dạng chuỗi trơn <code>"2026-11-20"</code> và giữ nguyên dạng chuỗi (hoặc cột <code>DATE</code> trong SQL, bài 8.1) — đừng đổi nó thành một <code>Date</code> lúc nửa đêm ở múi giờ nào đó rồi đổi ngược lại, không thì sẽ có người nhận ngày 19.</p></div>

<h3>Bước 4 — hiển thị: chọn múi giờ một cách có chủ đích</h3>
${ma('javascript', CODE['_t15/ngay/4-hien-thi.js'])}
<p>Trên máy ở Việt Nam, rồi ở New York:</p>
${ra(OUT['_t15/out/15-5-4-hien-thi-vn'])}
${ra(OUT['_t15/out/15-5-4-hien-thi-ny'])}
<p>Các dòng truyền <code>timeZone</code> cho <code>Intl</code> in ra như nhau trên cả hai máy. Bản <code>dd/MM/yyyy</code> tự viết dùng <code>getDate()</code>, thứ đi theo múi giờ của máy — đúng nếu ý bạn là "đồng hồ của chính người dùng", sai nếu ý bạn là "giờ Việt Nam" mà người dùng đang ở nước ngoài. Còn hai dòng cuối cho thấy cái bẫy đứng sau rất nhiều ô chọn ngày bị hỏng: <code>&lt;input type="date"&gt;</code> cần <code>yyyy-MM-dd</code> theo giờ máy, nhưng <code>toISOString().slice(0, 10)</code> cho ngày theo <em>UTC</em> — lúc 06:00 ở Hà Nội thì UTC vẫn là hôm qua.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Hiện theo múi giờ của người dùng</span><span class="v"><code>new Intl.DateTimeFormat('vi-VN', options).format(d)</code> không có <code>timeZone</code> — giờ tin nhắn, "truy cập lần cuối".</span></div>
  <div class="kv"><span class="k">Hiện theo một múi giờ cố định</span><span class="v">Thêm <code>timeZone: 'Asia/Ho_Chi_Minh'</code> — lịch thi, giờ mở cửa cửa hàng, thứ gì gắn với một địa điểm.</span></div>
  <div class="kv"><span class="k">Gửi lên API</span><span class="v"><code>d.toISOString()</code> cho thời điểm; chuỗi trơn <code>"yyyy-MM-dd"</code> cho ngày lịch.</span></div>
  <div class="kv"><span class="k">Điền vào input type=date</span><span class="v">Dựng <code>yyyy-MM-dd</code> từ <code>getFullYear()</code>, <code>getMonth() + 1</code>, <code>getDate()</code> — không lấy từ <code>toISOString()</code>.</span></div>
</div>

<h3>Bước 5 — cộng trừ và so sánh</h3>
${ma('javascript', CODE['_t15/ngay/5-cong-tru-so-sanh.js'])}
<p>Ở Việt Nam, rồi ở New York:</p>
${ra(OUT['_t15/out/15-5-5-cong-tru-so-sanh-vn'])}
${ra(OUT['_t15/out/15-5-5-cong-tru-so-sanh-ny'])}
<p>Việt Nam không dùng giờ mùa hè, nên "+ 86.400.000 ms" và "ngày hôm sau" khớp nhau — và bug lại ẩn mình. Ở New York, đồng hồ lùi một giờ vào Chủ nhật 1/11/2026, nên ngày đó dài 25 giờ: cộng 24 giờ rơi vào 11:00, còn <code>setDate(getDate() + 1)</code> cộng theo lịch và rơi vào 12:00. Dùng <code>setDate</code>/<code>setMonth</code> cho "giờ này ngày mai / tháng sau"; dùng mili giây cho khoảng thời gian ("token hết hạn sau 15 phút"). Phần còn lại: hai đối tượng <code>Date</code> là hai object, nên <code>===</code> là false kể cả cùng một thời điểm — so <code>getTime()</code>, hoặc dùng <code>&lt;</code>/<code>&gt;</code> và phép trừ, những phép này đổi ngày ra con số của nó. Đếm số ngày trọn vẹn thì an toàn nhất là ở nửa đêm UTC của cả hai ngày lịch.</p>

<h3>Bước 6 — Temporal: API mới</h3>
<p><code>Date</code> được chép từ Java năm 1995 và mang theo những cái bẫy này từ đó. Người thay thế nó, <strong>Temporal</strong>, tách riêng những ý mà bài này cứ phải gỡ rối — một ngày lịch, một giờ trên đồng hồ treo tường, một thời điểm chính xác, một ngày-giờ ở một múi giờ có tên:</p>
${ma('javascript', CODE['_t15/ngay/7-temporal.js'])}
${ra(OUT['_t15/out/15-5-7-temporal-vn'])}
<p>Tháng đếm từ 1; cộng một tháng vào 31 tháng 1 thì dừng ở 28 tháng 2 thay vì tràn sang tháng 3; còn "+1 ngày" với "+24 giờ" qua lần đổi giờ ở New York được ghi rõ ràng. Bản Chromium dùng cho bài này (phiên bản 149) có sẵn Temporal. Mức hỗ trợ giữa các trình duyệt vẫn chưa đều, nên kiểm Can I use trước khi dùng mà không có polyfill — và hãy chuẩn bị còn đọc code <code>Date</code> trong nhiều năm nữa.</p>

<h3>🕵️ Góc hacker — đồng hồ của trình duyệt thuộc về người dùng</h3>
<p>Mọi thứ chạy trong trình duyệt đều đổi được bởi chính người đang dùng: họ có thể chỉnh đồng hồ máy tính, hoặc đơn giản định nghĩa lại <code>Date.now</code> trong console. Script này kiểm một mã giảm giá đã hết hạn vào cuối ngày 30/11 (đồng hồ của trang được cố định ở 10:00 ngày 5/12 giờ Việt Nam):</p>
${ma('javascript', CODE['_t15/ngay/6-dong-ho-nguoi-dung.js'])}
${ra(OUT['_t15/out/15-5-6-dong-ho-nguoi-dung-vn'])}
<p>Một dòng gõ vào DevTools là mã giảm giá hết hạn lại dùng được. Điều tương tự áp dụng cho "được nộp tới 23:59", đồng hồ đếm ngược "giảm giá còn 10 phút", thời gian dùng thử và giới hạn thời gian làm bài thi. <strong>Cách phòng:</strong> trình duyệt có thể <em>hiển thị</em> đồng hồ đếm ngược, nhưng <strong>máy chủ</strong> mới là người quyết định, bằng đồng hồ của chính nó, vào lúc request tới nơi (bài 7.1: đừng bao giờ tin những gì client tự khai về mình). Lưu hạn chót dạng thời điểm UTC ở máy chủ, so sánh ở đó, và trả một lỗi rõ ràng khi đã hết giờ.</p>

<div class="callout ok">
<p><strong>🧪 Lab (30 phút) — bộ công cụ ngày tháng cho một form đặt lịch</strong></p>
<p>Viết module <code>dates.js</code> gồm bốn hàm, rồi thử từng hàm trong console với các trường hợp dưới đây. Muốn thử múi giờ khác mà không phải đi đâu: DevTools → More tools → <strong>Sensors</strong> → Location → chọn một thành phố (vd New York); múi giờ của trang đổi theo sau khi tải lại.</p>
<ol>
  <li><code>parseVN('dd/MM/yyyy')</code> ⇒ một <code>Date</code> theo giờ máy hoặc <code>null</code>. Trường hợp: <code>'20/11/2026'</code>, <code>'31/02/2026'</code> (null), <code>'29/02/2028'</code> (hợp lệ), <code>'2026-11-20'</code> (null).</li>
  <li><code>formatVN(date, timeZone)</code> ⇒ <code>dd/MM/yyyy</code> bằng <code>Intl.DateTimeFormat</code>. Trường hợp: thời điểm <code>2026-11-19T17:30:00Z</code> với <code>'Asia/Ho_Chi_Minh'</code> ⇒ <code>20/11/2026</code>.</li>
  <li><code>toInputValue(date)</code> ⇒ <code>yyyy-MM-dd</code> theo giờ máy, cho <code>&lt;input type="date"&gt;</code>. Trường hợp: <code>new Date(2026, 10, 20, 6, 0)</code> ⇒ <code>2026-11-20</code> ở mọi múi giờ.</li>
  <li><code>addDays(date, n)</code> ⇒ một <code>Date</code> mới (không sửa tham số truyền vào) cùng giờ trên đồng hồ, sau n ngày lịch.</li>
</ol>
<p><strong>Xong khi:</strong> mọi trường hợp in đúng giá trị mong đợi ở múi giờ thường của bạn <em>và</em> sau khi chuyển vị trí trong Sensors sang New York; <code>addDays(new Date(2026, 9, 31, 12), 1)</code> in ra 12:00 ngày 1/11 ở cả hai nơi; và không hàm nào gọi <code>toISOString().slice</code> hay cộng <code>86400000</code>.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">instant / timestamp</span><span class="v">thời điểm — một khoảnh khắc duy nhất, như nhau ở mọi nơi.</span></div>
  <div class="kv"><span class="k">UTC</span><span class="v">giờ phối hợp quốc tế — mốc chung, độ lệch 0.</span></div>
  <div class="kv"><span class="k">time zone / offset</span><span class="v">múi giờ (vd Asia/Ho_Chi_Minh) / độ lệch so với UTC (vd +07:00).</span></div>
  <div class="kv"><span class="k">ISO 8601</span><span class="v">chuẩn ghi ngày giờ <code>yyyy-MM-ddTHH:mm:ssZ</code>, không thể đọc nhầm thứ tự ngày/tháng.</span></div>
  <div class="kv"><span class="k">calendar date</span><span class="v">ngày lịch — "20/11/2026" như nhau với mọi người (ngày sinh, ngày lễ).</span></div>
  <div class="kv"><span class="k">daylight saving time (DST)</span><span class="v">giờ mùa hè — một số nước chỉnh đồng hồ ±1 giờ; Việt Nam không dùng.</span></div>
  <div class="kv"><span class="k">rollover</span><span class="v">tràn ngày — ngày không tồn tại bị đẩy sang tháng sau (31/02 → 03/03).</span></div>
  <div class="kv"><span class="k">Temporal</span><span class="v">API ngày giờ mới của JavaScript, thay cho Date.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>Date</code> là một thời điểm (ms kể từ 1970 UTC); múi giờ chỉ có ý nghĩa lúc in ra hoặc đọc vào.</li>
  <li>Tháng 0–11, ngày 1–31; ngày không tồn tại bị tràn trong im lặng — kiểm bằng cách xem có gì bị tràn không.</li>
  <li><code>'yyyy-MM-dd'</code> đọc theo UTC, <code>'yyyy-MM-ddTHH:mm'</code> đọc theo giờ máy; tự đọc <code>dd/MM/yyyy</code>.</li>
  <li>Gửi thời điểm dạng chuỗi ISO theo UTC; giữ ngày lịch dạng chuỗi <code>"yyyy-MM-dd"</code>.</li>
  <li>Hiển thị bằng <code>Intl.DateTimeFormat</code> kèm <code>timeZone</code> rõ ràng khi ngày gắn với một nơi; đừng điền <code>input type=date</code> từ <code>toISOString()</code>.</li>
  <li>"Ngày mai" là <code>setDate(+1)</code>, không phải +24 giờ; so bằng <code>getTime()</code>, không bằng <code>===</code>.</li>
  <li>Hạn chót và hết hạn được kiểm ở máy chủ: đồng hồ của trình duyệt là của người dùng.</li>
</ul>
${nguon('📗', 'MDN — Date', 'Constructor, luật đọc chuỗi (chỉ ngày = UTC, ngày-giờ = giờ máy), getter và setter', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date')}
${nguon('📗', 'MDN — Intl.DateTimeFormat', 'Định dạng theo ngôn ngữ và tuỳ chọn timeZone', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat')}
${nguon('📘', 'MDN — Temporal', 'API ngày giờ mới và các kiểu của nó (PlainDate, ZonedDateTime, Instant…)', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal')}
${nguon('📊', 'Can I use — Temporal', 'Mức hỗ trợ hiện tại của trình duyệt trước khi dùng mà không có polyfill', 'https://caniuse.com/temporal')}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-pe10-3-cau-3', title: 'FER202 PE — Đề 10, Câu 3', sub: 'Lịch sử đơn hàng với ngày dd/MM/yyyy và tổng tính toán, đúng như đề yêu cầu', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-7-1-auth-basics', title: 'Bài 7.1 — xác thực và phân quyền', sub: 'Bước 5: đừng bao giờ tin những gì client tự khai về mình', cta: 'Mở bài' })}
${lienKet({ khoa: 'react', bai: 'rx-13-4-bao-mat-i18n', title: 'React 13.4 — HTML an toàn và i18n cơ bản với Intl', sub: 'Định dạng Intl, số nhiều và thời gian tương đối trong component', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-5-regex', title: 'Bài 11.5 — biểu thức chính quy', sub: 'Mẫu mà parseVN dùng, và vì sao kiểm hợp lệ nên dừng ở mức "đủ tốt"', cta: 'Mở bài' })}
</div>
`,
};
