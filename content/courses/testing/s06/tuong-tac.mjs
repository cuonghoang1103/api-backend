/**
 * Testing · Chương 6 · 6.2 — Sự kiện người dùng, form và giao diện bất đồng bộ. Slug giữ từ khung: tst-6-2-tuong-tac.
 * Chạy thật: user-event 14.6.8 (gõ ô date/time trong jsdom được), findBy, promise hoãn cho trạng thái bận;
 * đo: findBy không await ⇒ test SAI vẫn xanh, có await ⇒ đỏ sau 1 giây.
 */
import G from '../giang/tst-06-2.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests /.test(l)).join('\n');
const QUEN = OUT['62-quen-await'].split('\n').filter((l) => /^\$ |✓|×|Unable to find|Tests /.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const F = CODE.form.split('\n');
const LOGIC = F.slice(F.findIndex((l) => l.startsWith('export function validate')), F.findIndex((l) => l.startsWith('function Field')) - 1)
  .concat(['', '// inside BookingForm:'], F.slice(F.findIndex((l) => l.includes('async function handleSubmit')), F.findIndex((l, i) => i > 40 && l === '  return (') - 1)).join('\n');

const SO_EN = `<table>
<thead><tr><th></th><th><code>fireEvent.change(input, …)</code></th><th><code>await user.type(input, '20')</code></th></tr></thead>
<tbody>
<tr><td>Events</td><td>one <code>change</code> event</td><td>click and focus, then keydown, keypress, input, keyup for each character</td></tr>
<tr><td>Focus</td><td>stays where it was</td><td>moves to the element, as with a real click</td></tr>
<tr><td>Enter</td><td>you dispatch submit yourself</td><td><code>'{Enter}'</code> submits the form like a keyboard does</td></tr>
<tr><td>Sync?</td><td>synchronous</td><td>asynchronous — always <code>await</code></td></tr>
</tbody></table>`;
const SO_VI = `<table>
<thead><tr><th></th><th><code>fireEvent.change(input, …)</code></th><th><code>await user.type(input, '20')</code></th></tr></thead>
<tbody>
<tr><td>Sự kiện</td><td>một sự kiện <code>change</code></td><td>click và focus, rồi keydown, keypress, input, keyup cho từng ký tự</td></tr>
<tr><td>Focus</td><td>giữ nguyên chỗ cũ</td><td>chuyển vào phần tử, như cú click thật</td></tr>
<tr><td>Enter</td><td>bạn tự phát sự kiện submit</td><td><code>'{Enter}'</code> gửi form như bàn phím thật</td></tr>
<tr><td>Đồng bộ?</td><td>đồng bộ</td><td>bất đồng bộ — luôn <code>await</code></td></tr>
</tbody></table>`;

export default {
  title: '6.2 — User events, forms and async UI|||6.2 — Sự kiện người dùng, form và giao diện bất đồng bộ',
  slug: 'tst-6-2-tuong-tac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gõ và bấm bằng user-event (kể cả ô date/time và phím Enter), kiểm cả dữ liệu đã gửi (toHaveBeenCalledWith) lẫn chữ người dùng thấy (findByRole status); lỗi gắn với trường qua aria-describedby/aria-invalid; findBy = waitFor + getBy, đo thật bẫy quên await (test sai vẫn xanh); promise hoãn để test trạng thái “Booking…” và bấm hai lần.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>User events, forms and async UI</h2>
<p class="lead">Lesson 6.1 only looked at the form. Now a user fills it in, presses Book and waits. The component checks what it can in the browser, calls <code>onSubmit</code>, and shows what came back — and each of those steps is a place where a real bug can hide.</p>

<h3>The logic behind the form</h3>
${ma('javascript', LOGIC)}
<p>The form receives <code>onSubmit</code> as a prop: an async function that returns <code>{ status, data }</code>. In the app it is <code>client.createBooking</code> (lesson 6.3); in this lesson a <code>vi.fn()</code> stands in. The form does not know HTTP exists — the same dependency-as-parameter idea as Chapters 2 and 3.</p>

<h3>user-event, not fireEvent</h3>
${SO_EN}
<p>Use <code>userEvent.setup()</code> once per test, before <code>render</code>, then await every call. Typing into the <code>date</code> and <code>time</code> inputs works in jsdom: user-event types <code>2026-11-16</code> and <code>08:00</code> into them and the form reads exactly those values (measured below).</p>

<h3>Type, click, then check both sides</h3>
${ma('javascript', CODE.tuongTac)}
${ra(gon(OUT['62-tuong-tac']))}
<ul>
<li><strong>What was sent</strong>: <code>toHaveBeenCalledWith</code> with the whole object — seats is the number 20, not the string the user typed.</li>
<li><strong>What the user saw</strong>: the success message appears only after the mock’s promise resolves, so it is found with <code>await screen.findByRole('status')</code>.</li>
<li><strong>Errors the user can find</strong>: <code>toHaveAccessibleDescription</code> proves the message is linked to its field — what a screen reader reads after the label — and <code>toBeInvalid</code> reads <code>aria-invalid</code>. And the API was never called.</li>
<li><strong>Enter</strong>: <code>'31{Enter}'</code> types 31 and presses Enter; the form submits as it would from a keyboard, and the 31-seat booking comes back PENDING.</li>
</ul>

<h3>findBy and waitFor</h3>
<p><code>findBy…</code> is <code>waitFor</code> + <code>getBy…</code>: it retries the query every 50 ms for up to 1 second and resolves with the element. Use <code>waitFor(() =&gt; expect(…))</code> only for checks that are not a query, for example <code>expect(onSubmit).toHaveBeenCalled()</code> after a delay. The classic mistake is forgetting <code>await</code>:</p>
${ma('javascript', CODE.quenAwait)}
${ra(QUEN)}
<p>Nothing was submitted, so no message can appear — yet the first test is green: without <code>await</code>, <code>findByRole</code> returns a Promise, and a Promise is truthy. <code>requireAssertions</code> does not help, because an assertion did run. Awaited, the same query fails honestly after one second. Rule: every <code>findBy</code> is preceded by <code>await</code>.</p>

<h3>Hold the promise: the busy state</h3>
${ma('javascript', CODE.support)}
<p>A mock that resolves immediately skips the in-between state. <code>deferred()</code> returns a promise and the function that resolves it, so the test decides when the server “answers”. In the practice below this is how we see “Booking…” and prove a second click sends nothing — the double-booking bug of Lab 6.</p>

${lienKet({ khoa: 'react', bai: 'rx-9-2-async', title: 'Also in the React course — 9.2: testing async components', sub: 'findBy and waitFor from the React side; here they are applied to a real form with busy and error states.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>While the request is pending, the button reads “Booking…”, is disabled, and a second click sends nothing; after the answer it reads “Book” again.</li>
<li>A 400 from the server with <code>{ path: 'date', message: 'Invalid ISO date' }</code> is shown as the description of the Date field.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th62)}
${ra(gon(OUT['62-th']))}
<p>Clicking a disabled button with user-event does nothing, exactly like a real click — so <code>toHaveBeenCalledTimes(1)</code> holds. Remove <code>disabled={busy}</code> and it becomes 2: Lab 6, mutant #3.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user-event</span><span class="v">A library that simulates full user interactions (clicks, typing, keyboard) instead of single DOM events.</span></div>
  <div class="kv"><span class="k">accessible description</span><span class="v">Extra text read after an element’s name, set with <code>aria-describedby</code>.</span></div>
  <div class="kv"><span class="k">waitFor</span><span class="v">Retries a callback until it stops throwing or the timeout (1 s) passes.</span></div>
  <div class="kv"><span class="k">deferred promise</span><span class="v">A promise together with its resolve function, so the test controls when it settles.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 One booking, as the test sees it</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Type</div><div class="lz-d">user.type into each field</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Validate</div><div class="lz-d">the browser checks lab code and seats</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Submit</div><div class="lz-d">onSubmit receives the exact object</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Busy</div><div class="lz-d">“Booking…”, button disabled</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Result</div><div class="lz-d">status on success, alert on error</div></div>
</div>
<div class="pitfall"><strong>findBy without await.</strong> <code>expect(screen.findByRole('status')).toBeTruthy()</code> passed in 28 ms even though no message could appear: a Promise is always truthy. Every <code>findBy</code> needs <code>await</code>.</div>
<h3>📌 Summary</h3>
<ul>
<li><code>userEvent.setup()</code>, then <code>await</code> every interaction.</li>
<li>Check what was sent and what the user sees.</li>
<li>Errors belong to their field: accessible description and invalid state.</li>
<li>Always <code>await</code> a <code>findBy</code> — a Promise is truthy.</li>
<li>Hold a promise to test busy states and double clicks.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Sự kiện người dùng, form và giao diện bất đồng bộ</h2>
<p class="lead">Bài 6.1 chỉ nhìn form. Giờ người dùng điền vào, bấm Book và chờ. Component kiểm những gì nó kiểm được trên trình duyệt, gọi <code>onSubmit</code>, rồi hiện thứ nhận về — và mỗi bước là một chỗ bug thật có thể ẩn nấp.</p>

<h3>Logic phía sau form</h3>
${ma('javascript', LOGIC)}
<p>Form nhận <code>onSubmit</code> qua prop: một hàm async trả về <code>{ status, data }</code>. Trong app đó là <code>client.createBooking</code> (bài 6.3); trong bài này dùng tạm một <code>vi.fn()</code>. Form không hề biết có HTTP — cùng ý tưởng truyền phụ thuộc qua tham số như Chương 2 và 3.</p>

<h3>user-event, không phải fireEvent</h3>
${SO_VI}
<p>Gọi <code>userEvent.setup()</code> một lần mỗi test, trước <code>render</code>, rồi await mọi lệnh. Gõ vào ô <code>date</code> và <code>time</code> chạy được trong jsdom: user-event gõ <code>2026-11-16</code> và <code>08:00</code> vào đó và form đọc ra đúng các giá trị ấy (đo ở dưới).</p>

<h3>Gõ, bấm, rồi kiểm cả hai phía</h3>
${ma('javascript', CODE.tuongTac)}
${ra(gon(OUT['62-tuong-tac']))}
<ul>
<li><strong>Thứ đã gửi</strong>: <code>toHaveBeenCalledWith</code> với cả object — seats là số 20, không phải chuỗi người dùng gõ.</li>
<li><strong>Thứ người dùng thấy</strong>: thông báo thành công chỉ xuất hiện sau khi promise của mock hoàn tất, nên phải tìm bằng <code>await screen.findByRole('status')</code>.</li>
<li><strong>Lỗi người dùng tìm thấy</strong>: <code>toHaveAccessibleDescription</code> chứng minh thông báo nối với trường của nó — thứ trình đọc màn hình đọc sau label — và <code>toBeInvalid</code> đọc <code>aria-invalid</code>. Và API không hề bị gọi.</li>
<li><strong>Enter</strong>: <code>'31{Enter}'</code> gõ 31 rồi nhấn Enter; form gửi đi như từ bàn phím, và lượt đặt 31 chỗ trở về với PENDING.</li>
</ul>

<h3>findBy và waitFor</h3>
<p><code>findBy…</code> là <code>waitFor</code> + <code>getBy…</code>: nó thử lại truy vấn mỗi 50 ms trong tối đa 1 giây và trả về phần tử. Chỉ dùng <code>waitFor(() =&gt; expect(…))</code> cho những kiểm tra không phải truy vấn, ví dụ <code>expect(onSubmit).toHaveBeenCalled()</code> sau một khoảng trễ. Lỗi kinh điển là quên <code>await</code>:</p>
${ma('javascript', CODE.quenAwait)}
${ra(QUEN)}
<p>Không có gì được gửi, nên không thông báo nào có thể xuất hiện — vậy mà test đầu xanh: thiếu <code>await</code>, <code>findByRole</code> trả về một Promise, và Promise luôn là giá trị truthy. <code>requireAssertions</code> không cứu được, vì đã có một khẳng định chạy. Có await, cùng truy vấn đó đỏ một cách trung thực sau một giây. Luật: mọi <code>findBy</code> đều đứng sau <code>await</code>.</p>

<h3>Giữ promise lại: trạng thái bận</h3>
${ma('javascript', CODE.support)}
<p>Mock trả lời ngay sẽ bỏ qua trạng thái ở giữa. <code>deferred()</code> trả về một promise kèm hàm hoàn tất nó, nên test quyết định khi nào máy chủ “trả lời”. Trong phần thực hành, đây là cách ta thấy “Booking…” và chứng minh lần bấm thứ hai không gửi gì — con bug đặt trùng của Lab 6.</p>

${lienKet({ khoa: 'react', bai: 'rx-9-2-async', title: 'Gặp lại ở khoá React — 9.2: test component bất đồng bộ', sub: 'findBy và waitFor nhìn từ phía React; ở đây áp vào một form thật có trạng thái bận và trạng thái lỗi.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Khi request còn đang chờ, nút ghi “Booking…”, bị khoá, và bấm lần hai không gửi gì; có câu trả lời thì nút trở lại “Book”.</li>
<li>Một lỗi 400 từ máy chủ với <code>{ path: 'date', message: 'Invalid ISO date' }</code> hiện thành mô tả của ô Date.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th62)}
${ra(gon(OUT['62-th']))}
<p>Bấm vào nút bị khoá bằng user-event không làm gì, đúng như cú click thật — nên <code>toHaveBeenCalledTimes(1)</code> đứng vững. Bỏ <code>disabled={busy}</code> thì nó thành 2: đột biến 3 của Lab 6.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user-event</span><span class="v">Thư viện mô phỏng trọn tương tác người dùng (click, gõ, bàn phím) thay vì từng sự kiện DOM đơn lẻ.</span></div>
  <div class="kv"><span class="k">accessible description (mô tả truy cập được)</span><span class="v">Đoạn chữ thêm được đọc sau tên phần tử, đặt bằng <code>aria-describedby</code>.</span></div>
  <div class="kv"><span class="k">waitFor</span><span class="v">Thử lại một callback tới khi nó hết ném lỗi hoặc quá thời gian chờ (1 giây).</span></div>
  <div class="kv"><span class="k">deferred promise (promise hoãn)</span><span class="v">Một promise đi kèm hàm hoàn tất nó, để test điều khiển lúc nó kết thúc.</span></div>
</div>

<h3>🗺 Một lượt đặt, nhìn từ phía test</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Gõ</div><div class="lz-d">user.type vào từng ô</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Kiểm</div><div class="lz-d">trình duyệt kiểm mã phòng và số chỗ</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gửi</div><div class="lz-d">onSubmit nhận đúng object</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Bận</div><div class="lz-d">“Booking…”, nút bị khoá</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Kết quả</div><div class="lz-d">status khi thành công, alert khi lỗi</div></div>
</div>
<div class="pitfall"><strong>findBy thiếu await.</strong> <code>expect(screen.findByRole('status')).toBeTruthy()</code> qua trong 28 ms dù không thông báo nào có thể xuất hiện: Promise luôn truthy. Mọi <code>findBy</code> đều cần <code>await</code>.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li><code>userEvent.setup()</code>, rồi <code>await</code> mọi tương tác.</li>
<li>Kiểm thứ đã gửi và thứ người dùng thấy.</li>
<li>Lỗi thuộc về trường của nó: mô tả truy cập được và trạng thái không hợp lệ.</li>
<li>Luôn <code>await</code> một <code>findBy</code> — Promise luôn truthy.</li>
<li>Giữ promise lại để test trạng thái bận và bấm hai lần.</li>
</ul>
</div>
`,
};
