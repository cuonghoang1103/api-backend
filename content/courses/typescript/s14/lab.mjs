/**
 * TypeScript · Chương 14 · Lab 14 — Service trên một repo abstract. BÀI MỚI 04/11/2026, slug typescript-14-6-lab-service-repo (TRƯỚC quiz 14.5).
 * Máy chấm = scripts/cham-lab-14.mjs (tsc + Node thật): A2·B1·C1·D2·E 8×0,5; đạt 7. Số đo: any stub 5.5 · Booking any 7.5 · private (không #) 9.5 · tham khảo 10.
 * Code/output từ ./_ma-ts-lab-14.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/lab14/giai/service.ts.
 */
import G from '../giang/ts-lab-14.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-14.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>What the type enforces</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>new BookingRepo()</code></td><td>TS2511</td><td>the base is abstract</td></tr>
<tr><td>S2</td><td>a subclass with no methods</td><td>TS2654</td><td>find and save must be implemented</td></tr>
<tr><td>S3</td><td>a <code>Booking</code> missing <code>lab</code></td><td>TS2741</td><td>the model is complete</td></tr>
<tr><td>S4</td><td>a <code>Booking</code> with an extra field</td><td>TS2353</td><td>only the model’s fields</td></tr>
<tr><td>S5</td><td><code>id</code> as a string</td><td>TS2322</td><td><code>id</code> is a <code>number</code></td></tr>
<tr><td>S6</td><td><code>book</code> with a string id</td><td>TS2345</td><td>the method is typed</td></tr>
<tr><td>S7</td><td>reading <code>#repo</code> from outside</td><td>TS18013</td><td>the repo is truly private</td></tr>
<tr><td>S8</td><td>a <code>MemoryRepo</code> as a <code>BookingService</code></td><td>TS2739</td><td>the classes are distinct</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Kiểu ép gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>new BookingRepo()</code></td><td>TS2511</td><td>lớp nền là abstract</td></tr>
<tr><td>S2</td><td>một lớp con không method</td><td>TS2654</td><td>find và save phải được cài</td></tr>
<tr><td>S3</td><td>một <code>Booking</code> thiếu <code>lab</code></td><td>TS2741</td><td>model đầy đủ</td></tr>
<tr><td>S4</td><td>một <code>Booking</code> có field thừa</td><td>TS2353</td><td>chỉ các trường của model</td></tr>
<tr><td>S5</td><td><code>id</code> là một string</td><td>TS2322</td><td><code>id</code> là một <code>number</code></td></tr>
<tr><td>S6</td><td><code>book</code> với id string</td><td>TS2345</td><td>method có kiểu</td></tr>
<tr><td>S7</td><td>đọc <code>#repo</code> từ ngoài</td><td>TS18013</td><td>repo thật sự private</td></tr>
<tr><td>S8</td><td>một <code>MemoryRepo</code> làm một <code>BookingService</code></td><td>TS2739</td><td>hai class khác nhau</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict)</td></tr>
<tr><td>B — correct uses</td><td>1</td><td><code>kiem/phai-dung.ts</code>: a <code>Booking</code>, a service, a booking made and found</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: the service books through the repo and finds it back</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict)</td></tr>
<tr><td>B — cách dùng đúng</td><td>1</td><td><code>kiem/phai-dung.ts</code>: một <code>Booking</code>, một service, một booking tạo và tìm</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: service book qua repo và tìm lại</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 14 — A service over an abstract repo|||Lab 14 — Service trên một repo abstract',
  slug: 'typescript-14-6-lab-service-repo',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 14 — viết một BookingService có kiểu cho LabFlow dựa trên một BookingRepo abstract: service giấu repo bằng #private, book qua nó, tìm lại; repo abstract nên memory/database đều vừa. Máy chấm chạy tsc + Node thật: A biên dịch · B cách dùng đúng · C no any/as/! · D service book + find · E 8 cách dùng sai. Bản any stub được 5.5; Booking để any 7.5; private (không #) 9.5; bản thiết kế (Booking typed + abstract + #private) 10. Class native, không gói ngoài.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lab 14</span>
<h2>A service over an abstract repo</h2>
<p class="lead">60–90 minutes. The chapter meets in one design. You write a typed <code>BookingService</code> for LabFlow backed by an abstract <code>BookingRepo</code>: the service hides its repo with <code>#private</code>, books through it, and finds back — the repo abstract so a memory or a database implementation both fit. A teammate stubbed it all with <code>any</code>; it scores <strong>5.5</strong>. You take it to 10.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>14.1</strong> — a class with typed fields and a constructor.</li>
<li><strong>14.2</strong> — an <code>abstract</code> base a concrete repo fills in.</li>
<li><strong>14.3</strong> — <code>#private</code> state the outside cannot reach.</li>
<li>Design: a service that depends on an abstraction, not a concrete repo.</li>
</ul>

<h3>The concrete repo (given)</h3>
<p>A <code>MemoryRepo extends BookingRepo</code> is provided for the test — you do not edit it:</p>
${ma('ts', CODE.memory)}

<h3>The any stub scores 5.5</h3>
<p>The teammate typed <code>Booking</code> as <code>any</code>, left <code>BookingRepo</code> non-abstract, and exposed the repo as a public field:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>5.5/10.</strong> It compiles and the service runs, but it enforces nothing — the Booking wrong uses slip, the abstract rule is gone, and the repo is reachable from outside. A service with no boundaries.</p>

<h3>Your task</h3>
<p>Edit <code>lab14/src/service.ts</code> until <code>npm run lab14</code> prints <strong>Score: 10/10</strong>: type <code>Booking</code> (id, lab), make <code>BookingRepo</code> abstract with <code>find</code> and <code>save</code>, and write <code>BookingService</code> with a <code>#repo</code> set in the constructor. Its <code>book</code> saves a typed booking and returns it; <code>find</code> returns <code>Booking | undefined</code>. No <code>any</code>, <code>as</code> or <code>!</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>any</code> stub; a designed service must refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — <code>Booking</code> left <code>any</code></strong> (<code>lab14/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — the model is only as strong as its weakest type.</strong> 7.5/10. You made <code>BookingRepo</code> abstract and the repo <code>#private</code>, but left <code>Booking</code> as <code>any</code>, so the three <code>Booking</code> checks slip and the <code>any</code> costs honesty.</p>
</div>
<p><strong>Attempt B — TS-private, not <code>#private</code></strong> (<code>lab14/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — everything is typed and there is no <code>any</code>, but the repo is a <code>private</code> field, not <code>#private</code>. Reading it from outside is still refused — but with TS2339, not the TS18013 the wrong-use expected, so that one slips. For true run-time encapsulation the field must be <code>#private</code>.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>The reference: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>The service cannot store a wrong booking, the repo cannot be reached from outside, and the abstract base cannot be built directly — every class feature of the chapter, in one design.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab14</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, <code>as</code> or <code>!</code>; <code>BookingRepo</code> is abstract, the repo is <code>#private</code>, <code>Booking</code> is typed.</li>
<li>You can say which type refuses each of S1–S8.</li>
<li>Commit: <code>feat(api): BookingService over an abstract repo (lab 14: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">abstract base</span><span class="v"><code>BookingRepo</code> — the contract a repo fills in.</span></div>
  <div class="kv"><span class="k">dependency</span><span class="v">The service holds a <code>BookingRepo</code>, not a <code>MemoryRepo</code>.</span></div>
  <div class="kv"><span class="k"><code>#private</code></span><span class="v">The repo the outside cannot reach.</span></div>
  <div class="kv"><span class="k">encapsulation</span><span class="v">The compiler and the language both enforce it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An <code>any</code> stub compiles and runs but enforces nothing — it scores 5.5.</li>
<li>Leaving <code>Booking</code> as <code>any</code> scores 7.5 — the model’s three Booking checks slip.</li>
<li>A <code>private</code> repo instead of <code>#private</code> scores 9.5 — reading it is TS2339, not the TS18013 expected.</li>
<li>The reference: a typed <code>Booking</code>, an abstract <code>BookingRepo</code>, and a <code>#private</code> repo.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Classes', 'Abstract members, #private and constructors. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html')}
${nguon('📘', 'MDN — Private class features', 'The #private field the lab’s service uses. Read 4 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Lab 14</span>
<h2>Service trên một repo abstract</h2>
<p class="lead">60–90 phút. Chương gặp nhau ở một thiết kế. Bạn viết một <code>BookingService</code> có kiểu cho LabFlow dựa trên một <code>BookingRepo</code> abstract: service giấu repo bằng <code>#private</code>, book qua nó, và tìm lại — repo abstract nên một bản memory hay database đều vừa. Một đồng đội stub hết bằng <code>any</code>; nó được <strong>5.5</strong>. Bạn đưa nó lên 10.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>14.1</strong> — một class với field có kiểu và một constructor.</li>
<li><strong>14.2</strong> — một lớp nền <code>abstract</code> mà một repo cụ thể điền.</li>
<li><strong>14.3</strong> — trạng thái <code>#private</code> mà bên ngoài không với tới.</li>
<li>Thiết kế: một service phụ thuộc một trừu tượng, không phụ thuộc một repo cụ thể.</li>
</ul>

<h3>Repo cụ thể (cho sẵn)</h3>
<p>Một <code>MemoryRepo extends BookingRepo</code> được cho sẵn cho test — bạn không sửa nó:</p>
${ma('ts', CODE.memory)}

<h3>Bản any stub được 5.5</h3>
<p>Đồng đội gõ <code>Booking</code> là <code>any</code>, để <code>BookingRepo</code> non-abstract, và phơi repo như một field công khai:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>5.5/10.</strong> Nó biên dịch và service chạy, nhưng nó không ép gì — các cách dùng Booking sai lọt, luật abstract mất, và repo với tới được từ ngoài. Một service không ranh giới.</p>

<h3>Việc của bạn</h3>
<p>Sửa <code>lab14/src/service.ts</code> tới khi <code>npm run lab14</code> in <strong>Score: 10/10</strong>: gõ kiểu <code>Booking</code> (id, lab), làm <code>BookingRepo</code> abstract với <code>find</code> và <code>save</code>, và viết <code>BookingService</code> với một <code>#repo</code> đặt trong constructor. <code>book</code> của nó lưu một booking có kiểu và trả nó; <code>find</code> trả <code>Booking | undefined</code>. Không <code>any</code>, <code>as</code> hay <code>!</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái biên dịch được với bản stub <code>any</code>; một service thiết kế phải từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — để <code>Booking</code> là <code>any</code></strong> (<code>lab14/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — model chỉ mạnh bằng kiểu yếu nhất của nó.</strong> 7.5/10. Bạn làm <code>BookingRepo</code> abstract và repo <code>#private</code>, nhưng để <code>Booking</code> là <code>any</code>, nên ba phép kiểm <code>Booking</code> lọt và <code>any</code> tốn điểm trung thực.</p>
</div>
<p><strong>Thử B — private của TS, không phải <code>#private</code></strong> (<code>lab14/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — mọi thứ có kiểu và không có <code>any</code>, nhưng repo là một field <code>private</code>, không phải <code>#private</code>. Đọc nó từ ngoài vẫn bị từ chối — nhưng với TS2339, không phải TS18013 mà cách dùng sai mong, nên cái đó lọt. Cho đóng gói thật lúc chạy, field phải là <code>#private</code>.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Lời giải tham khảo: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Service không lưu được một booking sai, repo không với tới được từ ngoài, và lớp nền abstract không dựng trực tiếp được — mọi tính năng class của chương, trong một thiết kế.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab14</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, <code>as</code> hay <code>!</code>; <code>BookingRepo</code> là abstract, repo là <code>#private</code>, <code>Booking</code> có kiểu.</li>
<li>Bạn nói được kiểu nào từ chối từng S1–S8.</li>
<li>Commit: <code>feat(api): BookingService over an abstract repo (lab 14: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">lớp nền abstract</span><span class="v"><code>BookingRepo</code> — hợp đồng một repo điền.</span></div>
  <div class="kv"><span class="k">phụ thuộc</span><span class="v">Service giữ một <code>BookingRepo</code>, không phải một <code>MemoryRepo</code>.</span></div>
  <div class="kv"><span class="k"><code>#private</code></span><span class="v">Repo mà bên ngoài không với tới.</span></div>
  <div class="kv"><span class="k">đóng gói</span><span class="v">Cả trình biên dịch và ngôn ngữ đều ép.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bản stub <code>any</code> biên dịch và chạy nhưng không ép gì — nó được 5.5.</li>
<li>Để <code>Booking</code> là <code>any</code> được 7.5 — ba phép kiểm Booking của model lọt.</li>
<li>Một repo <code>private</code> thay vì <code>#private</code> được 9.5 — đọc nó là TS2339, không phải TS18013 mong đợi.</li>
<li>Lời giải: một <code>Booking</code> có kiểu, một <code>BookingRepo</code> abstract, và một repo <code>#private</code>.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Classes', 'Thành viên abstract, #private và constructor. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html')}
${nguon('📘', 'MDN — Private class features', 'Trường #private mà service của lab dùng. Đọc ngày 4/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties')}
</div>
`,
};
