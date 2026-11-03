/**
 * TypeScript · Chương 11 · Lab 11 — Handler có kiểu với envelope lỗi. BÀI MỚI 04/11/2026, slug typescript-11-6-lab-handler-co-kieu (TRƯỚC quiz 11.5).
 * Máy chấm = scripts/cham-lab-11.mjs (tsc + Node thật): A2·B1·C1·D2·E 8×0,5; đạt 7. Số đo: any stub 4.5 · Booking any 8 · purpose optional 9.5 · tham khảo 10.
 * Code/output từ ./_ma-ts-lab-11.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/lab11/giai/handler.ts.
 */
import G from '../giang/ts-lab-11.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-11.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>What the type enforces</th></tr></thead>
<tbody>
<tr><td>S1</td><td>a <code>CreateBooking</code> missing <code>purpose</code></td><td>TS2741</td><td>the create body is complete</td></tr>
<tr><td>S2</td><td>a <code>CreateBooking</code> carrying <code>id</code></td><td>TS2353</td><td>no server-owned field in the body</td></tr>
<tr><td>S3</td><td><code>seats</code> as a string</td><td>TS2322</td><td><code>seats</code> is a <code>number</code></td></tr>
<tr><td>S4</td><td>a <code>Booking</code> with status <code>'DONE'</code></td><td>TS2322</td><td>status is a closed literal</td></tr>
<tr><td>S5</td><td>a <code>Booking</code> missing <code>purpose</code></td><td>TS2741</td><td>the Booking is complete</td></tr>
<tr><td>S6</td><td><code>r.data</code> on the error branch</td><td>TS2339</td><td>narrow on <code>ok</code> first</td></tr>
<tr><td>S7</td><td>an <code>ok</code> envelope with no <code>data</code></td><td>TS2322</td><td>success carries data</td></tr>
<tr><td>S8</td><td>an <code>error</code> that is a string</td><td>TS2322</td><td>the error is an object</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Kiểu ép gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td>một <code>CreateBooking</code> thiếu <code>purpose</code></td><td>TS2741</td><td>body tạo đầy đủ</td></tr>
<tr><td>S2</td><td>một <code>CreateBooking</code> mang <code>id</code></td><td>TS2353</td><td>không trường server trong body</td></tr>
<tr><td>S3</td><td><code>seats</code> là một string</td><td>TS2322</td><td><code>seats</code> là một <code>number</code></td></tr>
<tr><td>S4</td><td>một <code>Booking</code> status <code>'DONE'</code></td><td>TS2322</td><td>status là literal đóng</td></tr>
<tr><td>S5</td><td>một <code>Booking</code> thiếu <code>purpose</code></td><td>TS2741</td><td>Booking đầy đủ</td></tr>
<tr><td>S6</td><td><code>r.data</code> ở nhánh error</td><td>TS2339</td><td>thu hẹp theo <code>ok</code> trước</td></tr>
<tr><td>S7</td><td>một envelope <code>ok</code> không <code>data</code></td><td>TS2322</td><td>thành công mang data</td></tr>
<tr><td>S8</td><td>một <code>error</code> là một string</td><td>TS2322</td><td>error là một object</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict)</td></tr>
<tr><td>B — correct uses</td><td>1</td><td><code>kiem/phai-dung.ts</code>: a <code>CreateBooking</code> and a <code>Booking</code></td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: a valid body → 201 ok, seats ≤ 0 → 400 error</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict)</td></tr>
<tr><td>B — cách dùng đúng</td><td>1</td><td><code>kiem/phai-dung.ts</code>: một <code>CreateBooking</code> và một <code>Booking</code></td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: body hợp lệ → 201 ok, seats ≤ 0 → 400 error</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 11 — A typed handler with an error envelope|||Lab 11 — Handler có kiểu với envelope lỗi',
  slug: 'typescript-11-6-lab-handler-co-kieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 11 — viết handler POST /bookings cho LabFlow: đọc một body CreateBooking, kiểm seats, trả về một ApiResult<Booking> (201 ok hoặc 400 error có kiểu). Máy chấm chạy tsc + Node thật (handler chạy với request/response giả): A biên dịch · B cách dùng đúng · C no any/as/! · D 201/400 đúng · E 8 cách dùng sai. Bản stub any được 4.5; handler có kiểu (CreateBooking, Booking, Handler<…,ApiResult<Booking>>) được 10. Có output thật của "Booking any" 8/10 và "purpose optional" 9.5/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab 11</span>
<h2>A typed handler with an error envelope</h2>
<p class="lead">60–90 minutes. Everything in this chapter meets in one handler. You write the <code>POST /bookings</code> handler for LabFlow: it reads a <code>CreateBooking</code> body, validates the seats, and responds with an <code>ApiResult&lt;Booking&gt;</code> — a 201 with the created booking, or a 400 with a typed error. A teammate stubbed the types with <code>any</code>; it scores <strong>4.5</strong>. You take it to 10.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>11.1</strong> — the typed <code>Handler</code> with a typed body.</li>
<li><strong>11.2</strong> — the typed response (<code>res.json</code> checks the shape).</li>
<li><strong>11.3</strong> — the <code>ApiResult</code> envelope and a typed error.</li>
<li><strong>11.4</strong> — a model (<code>CreateBooking</code>, <code>Booking</code>) that matches the endpoint.</li>
</ul>

<h3>The any stub scores 4.5</h3>
<p>The teammate typed <code>CreateBooking</code> and <code>Booking</code> as <code>any</code> and skipped validation:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>4.5/10.</strong> It compiles and the valid case runs, but it checks nothing — a wrong field, a bad status all slip — and it fails the invalid-seats test because it never validates. A handler that runs but does not hold a contract.</p>

<h3>Your task</h3>
<p>Edit <code>lab11/src/handler.ts</code> until <code>npm run lab11</code> prints <strong>Score: 10/10</strong>: define <code>CreateBooking</code> (lab, seats, purpose) and <code>Booking</code> (plus id and a <code>status</code> of <code>'PENDING'</code>), type the handler <code>Handler&lt;{}, {}, CreateBooking, ApiResult&lt;Booking&gt;&gt;</code>, and validate — <code>seats ≤ 0</code> sends a 400 <code>INVALID_SEATS</code>; otherwise a 201. No <code>any</code>, <code>as</code> or <code>!</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>any</code> stub; a correct model must refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — <code>Booking</code> left <code>any</code></strong> (<code>lab11/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — the response is only as strong as the weakest of its models.</strong> 8/10. You typed <code>CreateBooking</code> honestly but left <code>Booking</code> as <code>any</code>, so the <code>Booking</code> checks (a bad status, a missing field) slip, and the <code>any</code> costs the honesty point.</p>
</div>
<p><strong>Attempt B — an optional field</strong> (<code>lab11/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — both models are typed, but <code>CreateBooking</code>’s <code>purpose</code> is optional, so a body with no purpose is accepted (S1 slips). The type must match the endpoint: the route requires a purpose, so the body type must too.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>The reference: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>The handler destructures a typed body, cannot send a wrong shape, and cannot skip the error case — every layer of the chapter, in one function.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab11</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, <code>as</code> or <code>!</code>; <code>CreateBooking</code> and <code>Booking</code> are typed exactly.</li>
<li>You can say which type refuses each of S1–S8.</li>
<li>Commit: <code>feat(api): typed POST /bookings handler (lab 11: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">typed handler</span><span class="v"><code>Handler&lt;P, Q, B, T&gt;</code> — request and response both checked.</span></div>
  <div class="kv"><span class="k">create DTO</span><span class="v"><code>CreateBooking</code> — the body minus the server fields.</span></div>
  <div class="kv"><span class="k">envelope</span><span class="v"><code>ApiResult&lt;Booking&gt;</code> — ok with data, or a typed error.</span></div>
  <div class="kv"><span class="k">match the endpoint</span><span class="v">The model must require exactly what the route requires.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Run</div><div class="lz-d">valid → 201 ok, seats ≤ 0 → 400 (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An <code>any</code> stub compiles and runs the happy path but holds no contract — it scores 4.5.</li>
<li>Leaving <code>Booking</code> as <code>any</code> scores 8 — the weaker model lets two wrong uses through.</li>
<li>An optional field where the route requires it scores 9.5 — the model must match the endpoint.</li>
<li>The reference: exact <code>CreateBooking</code> and <code>Booking</code>, a typed handler, and a validated envelope.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'DefinitelyTyped — @types/express (RequestHandler)', 'The real handler type this lab models. Read 4 Nov 2026.', 'https://www.npmjs.com/package/@types/express')}
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'The envelope the handler returns. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab 11</span>
<h2>Handler có kiểu với envelope lỗi</h2>
<p class="lead">60–90 phút. Mọi thứ trong chương này gặp nhau ở một handler. Bạn viết handler <code>POST /bookings</code> cho LabFlow: nó đọc một body <code>CreateBooking</code>, kiểm seats, và trả về một <code>ApiResult&lt;Booking&gt;</code> — một 201 với booking đã tạo, hay một 400 với một lỗi có kiểu. Một đồng đội stub các kiểu bằng <code>any</code>; nó được <strong>4.5</strong>. Bạn đưa nó lên 10.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>11.1</strong> — <code>Handler</code> có kiểu với một body có kiểu.</li>
<li><strong>11.2</strong> — response có kiểu (<code>res.json</code> kiểm dáng).</li>
<li><strong>11.3</strong> — envelope <code>ApiResult</code> và một lỗi có kiểu.</li>
<li><strong>11.4</strong> — một model (<code>CreateBooking</code>, <code>Booking</code>) khớp endpoint.</li>
</ul>

<h3>Bản stub any được 4.5</h3>
<p>Đồng đội gõ <code>CreateBooking</code> và <code>Booking</code> là <code>any</code> và bỏ kiểm:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>4.5/10.</strong> Nó biên dịch và trường hợp hợp lệ chạy, nhưng nó không kiểm gì — một trường sai, một status sai đều lọt — và nó trượt test seats-không-hợp-lệ vì nó không bao giờ kiểm. Một handler chạy nhưng không giữ hợp đồng.</p>

<h3>Việc của bạn</h3>
<p>Sửa <code>lab11/src/handler.ts</code> tới khi <code>npm run lab11</code> in <strong>Score: 10/10</strong>: định nghĩa <code>CreateBooking</code> (lab, seats, purpose) và <code>Booking</code> (thêm id và một <code>status</code> là <code>'PENDING'</code>), gõ handler <code>Handler&lt;{}, {}, CreateBooking, ApiResult&lt;Booking&gt;&gt;</code>, và kiểm — <code>seats ≤ 0</code> gửi một 400 <code>INVALID_SEATS</code>; không thì một 201. Không <code>any</code>, <code>as</code> hay <code>!</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái biên dịch được với bản stub <code>any</code>; một model đúng phải từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — để <code>Booking</code> là <code>any</code></strong> (<code>lab11/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — response chỉ mạnh bằng cái yếu nhất trong các model của nó.</strong> 8/10. Bạn gõ <code>CreateBooking</code> trung thực nhưng để <code>Booking</code> là <code>any</code>, nên các phép kiểm <code>Booking</code> (một status sai, một trường thiếu) lọt, và <code>any</code> tốn điểm trung thực.</p>
</div>
<p><strong>Thử B — một trường optional</strong> (<code>lab11/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — cả hai model có kiểu, nhưng <code>purpose</code> của <code>CreateBooking</code> optional, nên một body không purpose được nhận (S1 lọt). Kiểu phải khớp endpoint: route đòi một purpose, nên kiểu body cũng phải.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Lời giải tham khảo: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Handler destructure một body có kiểu, không gửi được một dáng sai, và không bỏ được trường hợp lỗi — mọi tầng của chương, trong một hàm.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab11</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, <code>as</code> hay <code>!</code>; <code>CreateBooking</code> và <code>Booking</code> gõ đúng.</li>
<li>Bạn nói được kiểu nào từ chối từng S1–S8.</li>
<li>Commit: <code>feat(api): typed POST /bookings handler (lab 11: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">handler có kiểu</span><span class="v"><code>Handler&lt;P, Q, B, T&gt;</code> — request và response đều được kiểm.</span></div>
  <div class="kv"><span class="k">DTO tạo</span><span class="v"><code>CreateBooking</code> — body trừ các trường server.</span></div>
  <div class="kv"><span class="k">envelope</span><span class="v"><code>ApiResult&lt;Booking&gt;</code> — ok với data, hay một lỗi có kiểu.</span></div>
  <div class="kv"><span class="k">khớp endpoint</span><span class="v">Model phải đòi đúng thứ route đòi.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chạy</div><div class="lz-d">hợp lệ → 201 ok, seats ≤ 0 → 400 (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái đúng mã (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bản stub <code>any</code> biên dịch và chạy đường vui nhưng không giữ hợp đồng — nó được 4.5.</li>
<li>Để <code>Booking</code> là <code>any</code> được 8 — model yếu hơn cho hai cách dùng sai lọt.</li>
<li>Một trường optional ở chỗ route đòi nó được 9.5 — model phải khớp endpoint.</li>
<li>Lời giải: <code>CreateBooking</code> và <code>Booking</code> đúng, một handler có kiểu, và một envelope đã kiểm.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'DefinitelyTyped — @types/express (RequestHandler)', 'Kiểu handler thật lab này mô hình hoá. Đọc ngày 4/11/2026.', 'https://www.npmjs.com/package/@types/express')}
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'Envelope mà handler trả về. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
</div>
`,
};
