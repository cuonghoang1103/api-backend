/**
 * TypeScript · Chương 13 · Lab 13 — Schema là nguồn sự thật. BÀI MỚI 04/11/2026, slug typescript-13-6-lab-schema-nguon-su-that (TRƯỚC quiz 13.5).
 * Máy chấm = scripts/cham-lab-13.mjs (tsc + Node thật): A2·B1·C1·D2·E 8×0,5; đạt 7. Số đo: any stub 5 · cast (yeu) 7 · as thừa (vua) 9 · tham khảo 10.
 * Code/output từ ./_ma-ts-lab-13.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/lab13/giai/schema.ts.
 */
import G from '../giang/ts-lab-13.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-13.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>What the type enforces</th></tr></thead>
<tbody>
<tr><td>S1</td><td>a body missing <code>seats</code></td><td>TS2741</td><td>the inferred type is complete</td></tr>
<tr><td>S2</td><td>a body carrying <code>purpose</code></td><td>TS2353</td><td>only the schema’s fields</td></tr>
<tr><td>S3</td><td><code>seats</code> as a string</td><td>TS2322</td><td><code>seats</code> is a <code>number</code></td></tr>
<tr><td>S4</td><td><code>lab</code> as a number</td><td>TS2322</td><td><code>lab</code> is a <code>string</code></td></tr>
<tr><td>S5</td><td><code>result.data</code> unnarrowed</td><td>TS2339</td><td>narrow on <code>success</code> first</td></tr>
<tr><td>S6</td><td><code>result.error</code> unnarrowed</td><td>TS2339</td><td><code>error</code> is only on failure</td></tr>
<tr><td>S7</td><td>a success with no <code>data</code></td><td>TS2322</td><td>success carries data</td></tr>
<tr><td>S8</td><td>an <code>error</code> that is a number</td><td>TS2322</td><td>the error is a string</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Kiểu ép gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td>một body thiếu <code>seats</code></td><td>TS2741</td><td>kiểu suy ra đầy đủ</td></tr>
<tr><td>S2</td><td>một body mang <code>purpose</code></td><td>TS2353</td><td>chỉ các trường của schema</td></tr>
<tr><td>S3</td><td><code>seats</code> là một string</td><td>TS2322</td><td><code>seats</code> là một <code>number</code></td></tr>
<tr><td>S4</td><td><code>lab</code> là một number</td><td>TS2322</td><td><code>lab</code> là một <code>string</code></td></tr>
<tr><td>S5</td><td><code>result.data</code> chưa thu hẹp</td><td>TS2339</td><td>thu hẹp theo <code>success</code> trước</td></tr>
<tr><td>S6</td><td><code>result.error</code> chưa thu hẹp</td><td>TS2339</td><td><code>error</code> chỉ ở nhánh thất bại</td></tr>
<tr><td>S7</td><td>một success không <code>data</code></td><td>TS2322</td><td>success mang data</td></tr>
<tr><td>S8</td><td>một <code>error</code> là một number</td><td>TS2322</td><td>error là một string</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict)</td></tr>
<tr><td>B — correct uses</td><td>1</td><td><code>kiem/phai-dung.ts</code>: a <code>BookingInput</code> and a narrowed result</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: a valid body is parsed, an invalid body is rejected</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict)</td></tr>
<tr><td>B — cách dùng đúng</td><td>1</td><td><code>kiem/phai-dung.ts</code>: một <code>BookingInput</code> và một result đã thu hẹp</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: một body hợp lệ được parse, một body không hợp lệ bị từ chối</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 13 — A schema as the single source of truth|||Lab 13 — Schema là nguồn sự thật duy nhất',
  slug: 'typescript-13-6-lab-schema-nguon-su-that',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 13 — viết createBooking(raw: unknown) cho LabFlow: một schema Zod validate body đến, kiểu suy ra của nó là BookingInput duy nhất, và hàm trả một kết quả có kiểu ({ success: true; data } | { success: false; error }). Máy chấm chạy tsc + Node thật: A biên dịch · B cách dùng đúng · C no any/as/! · D valid parse + invalid rejected · E 8 cách dùng sai. Bản any stub (tin đầu vào) được 5; cast thay vì validate 7; một as thừa 9; schema + z.Infer + safeParse 10. Dùng mô hình Zod tự-chứa (không cài zod).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lab 13</span>
<h2>A schema as the single source of truth</h2>
<p class="lead">60–90 minutes. The chapter meets at the boundary. You write <code>createBooking(raw: unknown)</code> for LabFlow: a Zod schema validates the incoming body, its inferred type is the only <code>BookingInput</code>, and the function returns a typed result — a success with <code>data</code> or a failure with an <code>error</code>. A teammate stubbed it with <code>any</code> and trusts the input; it scores <strong>5</strong>. You take it to 10.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>13.1</strong> — a schema that validates and infers.</li>
<li><strong>13.2</strong> — <code>safeParse</code> and a narrowed result.</li>
<li><strong>13.3</strong> — the type derived from the schema, never hand-written.</li>
<li>Honesty: a cast is not a check — invalid data must actually be rejected.</li>
</ul>

<h3>The model</h3>
<p>The Zod surface is the same self-contained model as the lessons — given to you, not graded:</p>
${ma('ts', CODE.zodModel)}

<h3>The any stub scores 5</h3>
<p>The teammate typed <code>BookingInput</code> as <code>any</code> and returns the raw input untouched:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>5/10.</strong> It compiles, but it validates nothing — the invalid-body test fails because bad data is trusted, the <code>any</code> costs honesty, and the wrong uses on the inferred type slip. A boundary that is not a boundary.</p>

<h3>Your task</h3>
<p>Edit <code>lab13/src/schema.ts</code> until <code>npm run lab13</code> prints <strong>Score: 10/10</strong>: build <code>BookingInput = z.object({ lab: z.string(), seats: z.number() })</code>, derive <code>type BookingInput = z.Infer&lt;typeof BookingInput&gt;</code>, and validate with <code>safeParse</code> — a valid body returns <code>{ success: true, data }</code>, an invalid one <code>{ success: false, error }</code>. No hand-written copy of the type, no <code>as</code>, no <code>any</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>any</code> stub; a correct schema and typed result must refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — cast instead of validate</strong> (<code>lab13/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — a schema you do not <code>parse</code> is just a type.</strong> 7/10. The inferred type is real (the wrong uses are refused), but <code>createBooking</code> casts the raw input instead of parsing it — so the invalid-body test fails and the <code>as</code> costs honesty. A cast checks nothing at run time.</p>
</div>
<p><strong>Attempt B — one redundant cast</strong> (<code>lab13/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10 — validation is correct and the behaviour tests pass, but one needless <code>as string</code> on the error message trips the honesty check. The rule is strict on purpose: <code>as</code> is where run-time guarantees quietly leak out.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>The reference: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>One schema is the run-time guard and the compile-time shape, and nothing reaches <code>data</code> without first being validated.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab13</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, <code>as</code> or <code>!</code>; <code>BookingInput</code> is <code>z.Infer</code>, not a hand-written copy.</li>
<li>Invalid data is rejected — a cast would not pass the behaviour test.</li>
<li>Commit: <code>feat(api): validate POST /bookings with a Zod schema (lab 13: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">schema</span><span class="v"><code>z.object(...)</code> — a value that validates and a type.</span></div>
  <div class="kv"><span class="k">inferred type</span><span class="v"><code>z.Infer&lt;typeof s&gt;</code> — derived, never copied.</span></div>
  <div class="kv"><span class="k">safeParse</span><span class="v">A discriminated result you narrow on <code>success</code>.</span></div>
  <div class="kv"><span class="k">a cast is not a check</span><span class="v"><code>as</code> skips run-time validation.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An <code>any</code> stub that trusts the input compiles but validates nothing — it scores 5.</li>
<li>Casting instead of parsing scores 7 — the invalid-body test fails and the <code>as</code> costs honesty.</li>
<li>One redundant <code>as</code> scores 9 — the honesty rule does not let even a harmless cast pass.</li>
<li>The reference: a schema, a derived type, and <code>safeParse</code> narrowed on <code>success</code>.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'Zod — Basic usage & inference', 'The schema, safeParse and z.infer this lab uses. Read 4 Nov 2026.', 'https://zod.dev/')}
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'The result the function returns. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Lab 13</span>
<h2>Schema là nguồn sự thật duy nhất</h2>
<p class="lead">60–90 phút. Chương gặp nhau ở biên. Bạn viết <code>createBooking(raw: unknown)</code> cho LabFlow: một schema Zod validate body đến, kiểu suy ra của nó là <code>BookingInput</code> duy nhất, và hàm trả một kết quả có kiểu — một success với <code>data</code> hay một failure với một <code>error</code>. Một đồng đội stub bằng <code>any</code> và tin đầu vào; nó được <strong>5</strong>. Bạn đưa nó lên 10.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>13.1</strong> — một schema vừa validate vừa suy kiểu.</li>
<li><strong>13.2</strong> — <code>safeParse</code> và một result đã thu hẹp.</li>
<li><strong>13.3</strong> — kiểu suy từ schema, không bao giờ viết tay.</li>
<li>Trung thực: một phép ép không phải một phép kiểm — dữ liệu không hợp lệ phải thật sự bị từ chối.</li>
</ul>

<h3>Mô hình</h3>
<p>Bề mặt Zod là cùng mô hình tự-chứa như các bài — cho sẵn, không chấm:</p>
${ma('ts', CODE.zodModel)}

<h3>Bản any stub được 5</h3>
<p>Đồng đội gõ <code>BookingInput</code> là <code>any</code> và trả đầu vào thô nguyên vẹn:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>5/10.</strong> Nó biên dịch, nhưng nó không validate gì — test body-không-hợp-lệ trượt vì dữ liệu xấu được tin, <code>any</code> tốn điểm trung thực, và các cách dùng sai trên kiểu suy ra lọt. Một biên mà không phải biên.</p>

<h3>Việc của bạn</h3>
<p>Sửa <code>lab13/src/schema.ts</code> tới khi <code>npm run lab13</code> in <strong>Score: 10/10</strong>: dựng <code>BookingInput = z.object({ lab: z.string(), seats: z.number() })</code>, suy <code>type BookingInput = z.Infer&lt;typeof BookingInput&gt;</code>, và validate bằng <code>safeParse</code> — một body hợp lệ trả <code>{ success: true, data }</code>, một body không hợp lệ <code>{ success: false, error }</code>. Không bản chép tay của kiểu, không <code>as</code>, không <code>any</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái biên dịch được với bản stub <code>any</code>; một schema và kết quả có kiểu đúng phải từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — ép thay vì validate</strong> (<code>lab13/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một schema bạn không <code>parse</code> chỉ là một kiểu.</strong> 7/10. Kiểu suy ra là thật (các cách dùng sai bị từ chối), nhưng <code>createBooking</code> ép đầu vào thô thay vì parse nó — nên test body-không-hợp-lệ trượt và <code>as</code> tốn điểm trung thực. Một phép ép không kiểm gì lúc chạy.</p>
</div>
<p><strong>Thử B — một phép ép thừa</strong> (<code>lab13/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10 — validate đúng và test hành vi qua, nhưng một <code>as string</code> thừa trên thông báo lỗi làm vấp phép kiểm trung thực. Luật nghiêm có chủ đích: <code>as</code> là nơi bảo đảm lúc chạy âm thầm rò ra.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Lời giải tham khảo: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Một schema vừa là chốt chặn lúc chạy vừa là dáng lúc biên dịch, và không gì với tới <code>data</code> mà chưa được validate.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab13</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, <code>as</code> hay <code>!</code>; <code>BookingInput</code> là <code>z.Infer</code>, không phải bản chép tay.</li>
<li>Dữ liệu không hợp lệ bị từ chối — một phép ép sẽ không qua test hành vi.</li>
<li>Commit: <code>feat(api): validate POST /bookings with a Zod schema (lab 13: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">schema</span><span class="v"><code>z.object(...)</code> — một giá trị validate và một kiểu.</span></div>
  <div class="kv"><span class="k">kiểu suy ra</span><span class="v"><code>z.Infer&lt;typeof s&gt;</code> — suy ra, không chép.</span></div>
  <div class="kv"><span class="k">safeParse</span><span class="v">Một kết quả discriminated bạn thu hẹp theo <code>success</code>.</span></div>
  <div class="kv"><span class="k">ép không phải kiểm</span><span class="v"><code>as</code> bỏ qua validate lúc chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bản stub <code>any</code> tin đầu vào biên dịch nhưng không validate gì — nó được 5.</li>
<li>Ép thay vì parse được 7 — test body-không-hợp-lệ trượt và <code>as</code> tốn điểm trung thực.</li>
<li>Một <code>as</code> thừa được 9 — luật trung thực không cho cả một phép ép vô hại lọt.</li>
<li>Lời giải: một schema, một kiểu suy ra, và <code>safeParse</code> thu hẹp theo <code>success</code>.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'Zod — Basic usage & inference', 'Schema, safeParse và z.infer lab này dùng. Đọc ngày 4/11/2026.', 'https://zod.dev/')}
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'Kết quả mà hàm trả về. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
</div>
`,
};
