/**
 * TypeScript · Chương 12 · Lab 12 — Component & hook có kiểu. BÀI MỚI 04/11/2026, slug typescript-12-6-lab-form-co-kieu (TRƯỚC quiz 12.5).
 * Máy chấm = scripts/cham-lab-12.mjs (tsc + Node thật): A2·B1·C1·D2·E 8×0,5; đạt 7. Số đo: any stub 3 · hook any 7,5 · seats optional 9,5 · tham khảo 10.
 * Code/output từ ./_ma-ts-lab-12.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/lab12/giai/form.ts.
 */
import G from '../giang/ts-lab-12.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-12.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>What the type enforces</th></tr></thead>
<tbody>
<tr><td>S1</td><td>a <code>CreateBooking</code> missing <code>seats</code></td><td>TS2741</td><td>the create body is complete</td></tr>
<tr><td>S2</td><td>a <code>CreateBooking</code> carrying <code>id</code></td><td>TS2353</td><td>no server-owned field in the body</td></tr>
<tr><td>S3</td><td><code>seats</code> as a string</td><td>TS2322</td><td><code>seats</code> is a <code>number</code></td></tr>
<tr><td>S4</td><td>a change handler called with a bare <code>value</code></td><td>TS2353</td><td>the event has a <code>target</code></td></tr>
<tr><td>S5</td><td><code>BookingFormProps</code> with no <code>onSubmit</code></td><td>TS2741</td><td>the props are complete</td></tr>
<tr><td>S6</td><td>an <code>onSubmit</code> taking a <code>number</code></td><td>TS2322</td><td><code>onSubmit</code> takes a <code>CreateBooking</code></td></tr>
<tr><td>S7</td><td><code>seats</code> read as a string</td><td>TS2322</td><td><code>seats</code> stays a <code>number</code></td></tr>
<tr><td>S8</td><td>a field <code>CreateBooking</code> does not have</td><td>TS2339</td><td>the model is closed</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Kiểu ép gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td>một <code>CreateBooking</code> thiếu <code>seats</code></td><td>TS2741</td><td>body tạo đầy đủ</td></tr>
<tr><td>S2</td><td>một <code>CreateBooking</code> mang <code>id</code></td><td>TS2353</td><td>không trường server trong body</td></tr>
<tr><td>S3</td><td><code>seats</code> là một string</td><td>TS2322</td><td><code>seats</code> là một <code>number</code></td></tr>
<tr><td>S4</td><td>một handler thay đổi gọi với một <code>value</code> trần</td><td>TS2353</td><td>sự kiện có một <code>target</code></td></tr>
<tr><td>S5</td><td><code>BookingFormProps</code> không <code>onSubmit</code></td><td>TS2741</td><td>props đầy đủ</td></tr>
<tr><td>S6</td><td>một <code>onSubmit</code> nhận một <code>number</code></td><td>TS2322</td><td><code>onSubmit</code> nhận một <code>CreateBooking</code></td></tr>
<tr><td>S7</td><td><code>seats</code> đọc như một string</td><td>TS2322</td><td><code>seats</code> vẫn là một <code>number</code></td></tr>
<tr><td>S8</td><td>một trường <code>CreateBooking</code> không có</td><td>TS2339</td><td>model là đóng</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict)</td></tr>
<tr><td>B — correct uses</td><td>1</td><td><code>kiem/phai-dung.ts</code>: a <code>CreateBooking</code>, props, a submitted booking</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: the hook collects values and <code>submit()</code>’s seats is a number</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict)</td></tr>
<tr><td>B — cách dùng đúng</td><td>1</td><td><code>kiem/phai-dung.ts</code>: một <code>CreateBooking</code>, props, một booking đã submit</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: hook thu các giá trị và seats của <code>submit()</code> là một number</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 12 — A typed component & hook|||Lab 12 — Component & hook có kiểu',
  slug: 'typescript-12-6-lab-form-co-kieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 12 — viết một BookingForm có kiểu cho LabFlow: một hook useBookingForm giữ state form (mã lab, số ghế) với handler thay đổi có kiểu và submit() dựng một CreateBooking, cùng một component BookingFormView kiểu FC<BookingFormProps>. Máy chấm chạy tsc + Node thật (chạy hook): A biên dịch · B cách dùng đúng · C no any/as/! · D hook thu đúng + seats là number · E 8 cách dùng sai. Bản stub any được 3; hook để any 7,5; seats optional 9,5; bản có kiểu đầy đủ 10. Dùng mô hình React tự-chứa (react.ts), không @types/react, không JSX.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lab 12</span>
<h2>A typed component &amp; hook</h2>
<p class="lead">60–90 minutes. Everything in this chapter meets in one form. You write a typed <code>BookingForm</code> for LabFlow: a <code>useBookingForm</code> hook that holds the form state (a lab code, a seat count) with typed change handlers and a <code>submit()</code> that builds a <code>CreateBooking</code>, and a <code>BookingFormView</code> component typed <code>FC&lt;BookingFormProps&gt;</code>. A teammate stubbed the types with <code>any</code>; it scores <strong>3</strong>. You take it to 10.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>12.1</strong> — a component typed <code>FC&lt;Props&gt;</code> with a typed props interface.</li>
<li><strong>12.2</strong> — a hook whose state and handlers are typed.</li>
<li><strong>12.3</strong> — change handlers reading <code>e.target.value</code> and parsing seats with <code>Number()</code>.</li>
<li><strong>12.4</strong> — a model (<code>CreateBooking</code>) that the component and hook share.</li>
</ul>

<h3>The model</h3>
<p>The React surface is the same self-contained model as the lessons — given to you, not graded:</p>
${ma('ts', CODE.reactModel)}

<h3>The any stub scores 3</h3>
<p>The teammate typed everything as <code>any</code> and forgot to parse the seat input to a number:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>3/10.</strong> It compiles and the correct uses still pass, but it checks nothing — every wrong use slips — and the behaviour test fails because <code>seats</code> stays a string. A form that runs but holds no contract.</p>

<h3>Your task</h3>
<p>Edit <code>lab12/src/form.ts</code> until <code>npm run lab12</code> prints <strong>Score: 10/10</strong>: define <code>CreateBooking</code> (lab, seats) and <code>BookingFormProps</code> (<code>onSubmit</code> taking a <code>CreateBooking</code>), type the hook’s return so <code>lab</code> is a string and <code>seats</code> a number, parse the seat input with <code>Number()</code>, and type the component <code>FC&lt;BookingFormProps&gt;</code>. No <code>any</code>, <code>as</code> or <code>!</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>any</code> stub; a correct model must refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — the hook left <code>any</code></strong> (<code>lab12/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — the form is only as strong as the weakest type in it.</strong> 7.5/10. You typed <code>CreateBooking</code> and <code>BookingFormProps</code> honestly but left the hook’s return as <code>any</code>, so the form-side wrong uses (a bad change-event argument, reading seats as a string, a field that does not exist) slip, and the <code>any</code> costs the honesty point.</p>
</div>
<p><strong>Attempt B — optional seats</strong> (<code>lab12/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — everything is typed and there is no <code>any</code>, but <code>CreateBooking</code>’s <code>seats</code> is optional, so a create body with no seats is accepted (S1 slips). A booking needs a seat count: make the field required and the last half-point comes back.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>The reference: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>The hook cannot store the wrong type, <code>submit()</code> cannot build a wrong booking, and the component cannot take wrong props — every layer of the chapter, in one form.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab12</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, <code>as</code> or <code>!</code>; <code>CreateBooking</code> and the hook’s return are typed exactly.</li>
<li>You can say which type refuses each of S1–S8.</li>
<li>Commit: <code>feat(web): typed BookingForm component + hook (lab 12: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">typed component</span><span class="v"><code>FC&lt;Props&gt;</code> — props checked at every call site.</span></div>
  <div class="kv"><span class="k">typed hook</span><span class="v">Its state and handlers carry real types, not <code>any</code>.</span></div>
  <div class="kv"><span class="k">create DTO</span><span class="v"><code>CreateBooking</code> — the form’s output, minus server fields.</span></div>
  <div class="kv"><span class="k">match the endpoint</span><span class="v">The model must require exactly what a booking needs.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Run</div><div class="lz-d">hook collects values, seats is a number (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An <code>any</code> stub compiles and runs but holds no contract — it scores 3.</li>
<li>Leaving the hook <code>any</code> scores 7.5 — the weaker type lets the form-side wrong uses through.</li>
<li>An optional field where a booking requires it scores 9.5 — the model must match the endpoint.</li>
<li>The reference: exact <code>CreateBooking</code>, a typed hook and component, and seats parsed to a number.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'React TypeScript Cheatsheets — Function Components', 'The component and props types this lab models. Read 4 Nov 2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/')}
${nguon('📘', 'React — useState', 'The hook state the form holds. Read 4 Nov 2026.', 'https://react.dev/reference/react/useState')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Lab 12</span>
<h2>Component &amp; hook có kiểu</h2>
<p class="lead">60–90 phút. Mọi thứ trong chương này gặp nhau ở một form. Bạn viết một <code>BookingForm</code> có kiểu cho LabFlow: một hook <code>useBookingForm</code> giữ state của form (một mã lab, một số ghế) với các handler thay đổi có kiểu và một <code>submit()</code> dựng một <code>CreateBooking</code>, và một component <code>BookingFormView</code> kiểu <code>FC&lt;BookingFormProps&gt;</code>. Một đồng đội stub các kiểu bằng <code>any</code>; nó được <strong>3</strong>. Bạn đưa nó lên 10.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>12.1</strong> — một component kiểu <code>FC&lt;Props&gt;</code> với một interface props có kiểu.</li>
<li><strong>12.2</strong> — một hook có state và handler được gõ kiểu.</li>
<li><strong>12.3</strong> — handler thay đổi đọc <code>e.target.value</code> và phân tích seats bằng <code>Number()</code>.</li>
<li><strong>12.4</strong> — một model (<code>CreateBooking</code>) mà component và hook cùng dùng.</li>
</ul>

<h3>Mô hình</h3>
<p>Bề mặt React là cùng mô hình tự-chứa như các bài — cho sẵn, không chấm:</p>
${ma('ts', CODE.reactModel)}

<h3>Bản stub any được 3</h3>
<p>Đồng đội gõ mọi thứ là <code>any</code> và quên phân tích ô seats thành một number:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>3/10.</strong> Nó biên dịch và các cách dùng đúng vẫn qua, nhưng nó không kiểm gì — mọi cách dùng sai đều lọt — và test hành vi trượt vì <code>seats</code> vẫn là một string. Một form chạy nhưng không giữ hợp đồng.</p>

<h3>Việc của bạn</h3>
<p>Sửa <code>lab12/src/form.ts</code> tới khi <code>npm run lab12</code> in <strong>Score: 10/10</strong>: định nghĩa <code>CreateBooking</code> (lab, seats) và <code>BookingFormProps</code> (<code>onSubmit</code> nhận một <code>CreateBooking</code>), gõ kiểu giá trị trả về của hook để <code>lab</code> là một string và <code>seats</code> một number, phân tích ô seats bằng <code>Number()</code>, và gõ kiểu component <code>FC&lt;BookingFormProps&gt;</code>. Không <code>any</code>, <code>as</code> hay <code>!</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái biên dịch được với bản stub <code>any</code>; một model đúng phải từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — để hook là <code>any</code></strong> (<code>lab12/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — form chỉ mạnh bằng cái kiểu yếu nhất trong nó.</strong> 7.5/10. Bạn gõ <code>CreateBooking</code> và <code>BookingFormProps</code> trung thực nhưng để giá trị trả về của hook là <code>any</code>, nên các cách dùng sai phía form (một đối số change-event sai, đọc seats như string, một trường không tồn tại) lọt, và <code>any</code> tốn điểm trung thực.</p>
</div>
<p><strong>Thử B — seats optional</strong> (<code>lab12/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — mọi thứ có kiểu và không có <code>any</code>, nhưng <code>seats</code> của <code>CreateBooking</code> optional, nên một body tạo không seats được nhận (S1 lọt). Một booking cần một số ghế: làm trường bắt buộc và nửa điểm cuối trở lại.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Lời giải tham khảo: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Hook không lưu được sai kiểu, <code>submit()</code> không dựng được một booking sai, và component không nhận được props sai — mọi tầng của chương, trong một form.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab12</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, <code>as</code> hay <code>!</code>; <code>CreateBooking</code> và giá trị trả về của hook gõ đúng.</li>
<li>Bạn nói được kiểu nào từ chối từng S1–S8.</li>
<li>Commit: <code>feat(web): typed BookingForm component + hook (lab 12: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">component có kiểu</span><span class="v"><code>FC&lt;Props&gt;</code> — props được kiểm tại mọi chỗ gọi.</span></div>
  <div class="kv"><span class="k">hook có kiểu</span><span class="v">State và handler của nó mang kiểu thật, không <code>any</code>.</span></div>
  <div class="kv"><span class="k">DTO tạo</span><span class="v"><code>CreateBooking</code> — đầu ra của form, trừ các trường server.</span></div>
  <div class="kv"><span class="k">khớp endpoint</span><span class="v">Model phải đòi đúng thứ một booking cần.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chạy</div><div class="lz-d">hook thu các giá trị, seats là một number (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái đúng mã (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bản stub <code>any</code> biên dịch và chạy nhưng không giữ hợp đồng — nó được 3.</li>
<li>Để hook là <code>any</code> được 7.5 — kiểu yếu hơn cho các cách dùng sai phía form lọt.</li>
<li>Một trường optional ở chỗ một booking đòi nó được 9.5 — model phải khớp endpoint.</li>
<li>Lời giải: <code>CreateBooking</code> đúng, một hook và component có kiểu, và seats phân tích thành một number.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'React TypeScript Cheatsheets — Function Components', 'Kiểu component và props lab này mô hình hoá. Đọc ngày 4/11/2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/')}
${nguon('📘', 'React — useState', 'State hook mà form giữ. Đọc ngày 4/11/2026.', 'https://react.dev/reference/react/useState')}
</div>
`,
};
