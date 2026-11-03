/**
 * TypeScript · Chương 6 · Lab 6 — Repository generic + groupBy. BÀI MỚI 03/11/2026, slug typescript-6-6-lab-repository-generic (đứng TRƯỚC quiz 6.5).
 * Máy chấm = scripts/cham-lab-6.mjs trong LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A2·B1·C1·D2·E 8×0,5; đạt 7.
 * Số đo thật: khởi đầu (any khắp nơi) 4.5/10 · "generic không ràng buộc, cast, get trả T|undefined" 6.5/10 · "generic + ràng buộc, pluck key:string lỏng" 7/10 · tham khảo 10/10.
 * Mọi code/output lấy từ ./_ma-ts-lab-6.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/src/rules/repo.ts.
 */
import G from '../giang/ts-lab-6.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-6.mjs';

const NPM_CI = OUT['l1-npm-ci'].split('\n').filter((l) => !/^npm (notice|warn)/.test(l)).join('\n');
const GD = CODE.grader.split('\n');
const eIdx = GD.findIndex((l) => l.includes('const e = tsc'));
const GRADER_E = GD.slice(eIdx, eIdx + 11).join('\n');
const ST = CODE.starter.split('\n');
const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>What a loose (any) model lets happen</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>repo.add({…no id})</code></td><td>TS2741</td><td>an item with no id is stored under <code>undefined</code></td></tr>
<tr><td>S2</td><td><code>new Repo&lt;{ name }&gt;()</code></td><td>TS2741</td><td>a repository for a type that has no id at all</td></tr>
<tr><td>S3</td><td><code>pluck(users, 'ghost')</code></td><td>TS2345</td><td>a misspelled field reads <code>undefined</code> out of every row</td></tr>
<tr><td>S4</td><td><code>repo.get(1).value</code></td><td>TS2339</td><td>reading a value off a “not found” Result — a crash</td></tr>
<tr><td>S5</td><td><code>mapResult(ok(10), (s: string) =&gt; …)</code></td><td>TS2345</td><td>a string transform over a number — wrong at runtime</td></tr>
<tr><td>S6</td><td><code>unwrapOr(ok('open'), 0)</code></td><td>TS2345</td><td>a fallback of the wrong type — type confusion downstream</td></tr>
<tr><td>S7</td><td><code>groupBy(…).get('STUDENT').length</code></td><td>TS2532</td><td>a missing group crashes the page</td></tr>
<tr><td>S8</td><td><code>pluck(users, 'id').map(id =&gt; id.toUpperCase())</code></td><td>TS2339</td><td>a string method on numbers — a crash</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Mô hình lỏng (any) để lọt điều gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>repo.add({…không id})</code></td><td>TS2741</td><td>một item không id được lưu dưới khoá <code>undefined</code></td></tr>
<tr><td>S2</td><td><code>new Repo&lt;{ name }&gt;()</code></td><td>TS2741</td><td>một repository cho một kiểu chẳng có id</td></tr>
<tr><td>S3</td><td><code>pluck(users, 'ghost')</code></td><td>TS2345</td><td>một trường gõ sai đọc ra <code>undefined</code> ở mọi hàng</td></tr>
<tr><td>S4</td><td><code>repo.get(1).value</code></td><td>TS2339</td><td>đọc value khỏi một Result “không tìm thấy” — sập</td></tr>
<tr><td>S5</td><td><code>mapResult(ok(10), (s: string) =&gt; …)</code></td><td>TS2345</td><td>một phép biến đổi chuỗi trên một số — sai lúc chạy</td></tr>
<tr><td>S6</td><td><code>unwrapOr(ok('open'), 0)</code></td><td>TS2345</td><td>một giá trị lùi sai kiểu — lẫn kiểu về sau</td></tr>
<tr><td>S7</td><td><code>groupBy(…).get('STUDENT').length</code></td><td>TS2532</td><td>một nhóm thiếu làm sập trang</td></tr>
<tr><td>S8</td><td><code>pluck(users, 'id').map(id =&gt; id.toUpperCase())</code></td><td>TS2339</td><td>một method chuỗi trên số — sập</td></tr>
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — your file compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict, nodenext)</td></tr>
<tr><td>B — correct uses compile</td><td>1</td><td><code>kiem/phai-dung.ts</code>: <code>Repo&lt;User&gt;</code> and <code>Repo&lt;BookingRecord&gt;</code>, <code>get</code> returns a <code>Result</code>, <code>pluck</code>/<code>groupBy</code> keep the types</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: add/get/remove, Result helpers, pluck, groupBy</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — tệp của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict, nodenext)</td></tr>
<tr><td>B — cách dùng đúng biên dịch được</td><td>1</td><td><code>kiem/phai-dung.ts</code>: <code>Repo&lt;User&gt;</code> và <code>Repo&lt;BookingRecord&gt;</code>, <code>get</code> trả một <code>Result</code>, <code>pluck</code>/<code>groupBy</code> giữ kiểu</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: add/get/remove, helper Result, pluck, groupBy</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 6 — A generic repository|||Lab 6 — Repository generic',
  slug: 'typescript-6-6-lab-repository-generic',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 6 có thang 10 điểm và máy chấm chạy tsc + Node thật: repo.ts của LabFlow — Result<T, E = string> + ok/err/mapResult/unwrapOr, Repo<T extends { id: number }> (add/get/remove/all/size trả Result), pluck<T, K extends keyof T>, groupBy<T, K>. Bản khởi đầu dùng any khắp nơi: biên dịch 0 lỗi mà chỉ 4.5/10 — correct uses cần Repo<User>/Repo<BookingRecord> (any không generic ⇒ TS2558), 8 cách dùng sai lọt hết. Có output thật của lần thử "generic không ràng buộc + cast + get trả T|undefined" (6.5/10), "generic + ràng buộc nhưng pluck key:string" (7/10) và lời giải 10/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab 6</span>
<h2>A generic repository</h2>
<p class="lead">60–90 minutes. LabFlow needs one repository that works for every entity — users, bookings, labs — while keeping each one’s type, plus a <code>Result</code> for operations that can fail and a <code>groupBy</code>. A teammate reached for <code>any</code> to “make it work for every type”; it compiles with <strong>zero errors</strong> and the grader gives it <strong>4.5 out of 10</strong>. You rewrite it with generics — a constrained <code>Repo&lt;T&gt;</code>, a generic <code>Result</code>, <code>pluck</code> with <code>keyof</code>, <code>groupBy</code> — until the grader says 10/10. This is the file the API (Chapter 11) and the services (Chapter 14) will build on.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>6.1</strong> — type parameters that keep the type (not <code>any</code>).</li>
<li><strong>6.2</strong> — the constraint <code>T extends { id: number }</code>, and <code>pluck</code> with <code>keyof</code> / indexed access.</li>
<li><strong>6.3</strong> — a generic <code>Result&lt;T, E = string&gt;</code> and a generic class <code>Repo&lt;T&gt;</code>.</li>
<li><strong>6.4</strong> — inference (<code>groupBy</code> with no type arguments) and avoiding the needless/return-only generic.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use <code>labflow-ts</code> at the end of Chapter 6 and install the pinned versions:
${ra(NPM_CI)}</li>
<li>The lab’s tsconfig only extends the course one:
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point — the teammate’s <code>any</code> version:
${ma('typescript', CODE.starter)}</li>
</ol>
<p>You edit only <code>lab6/src/repo.ts</code>. The course’s <code>model.ts</code>, <code>booking.ts</code>, <code>schedule.ts</code> and <code>time.ts</code> are given.</p>

<h3>Zero errors — and why that proves nothing</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict mode, no errors — because <code>any</code> turns checking off (1.4). Every method “works for every type” by verifying none: <code>get</code> returns <code>any</code>, <code>pluck</code> takes a <code>string</code> key, the class is not even generic. A model built on <code>any</code> refuses nothing.</p>

<h3>The grader</h3>
<p><code>npm run lab6</code> runs <code>scripts/cham-lab-6.mjs</code> — A compile, B correct uses, C honesty, D behaviour, E the eight wrong uses:</p>
${ma('javascript', GRADER_E)}
<p>Run it on the starter:</p>
${ra(OUT['l3-starter'])}
<p><strong>4.5 out of 10.</strong> B fails: <code>new Repo&lt;User&gt;()</code> and <code>new Repo&lt;BookingRecord&gt;()</code> are TS2558 (“Expected 0 type arguments”) because the <code>any</code> class is not generic. C fails (<code>any</code> everywhere). E is 1/8 — <code>any</code> accepts almost every wrong use. Only the behaviour (D) passes, because the implementation happens to be correct.</p>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab6/src/repo.ts</code> until <code>npm run lab6</code> prints <strong>Score: 10/10</strong>: a generic <code>Result&lt;T, E = string&gt;</code>; <code>ok</code>/<code>err</code>/<code>mapResult</code>/<code>unwrapOr</code>; <code>class Repo&lt;T extends { id: number }&gt;</code> whose <code>add</code>/<code>get</code>/<code>remove</code> return a <code>Result</code>; <code>pluck&lt;T, K extends keyof T&gt;</code>; <code>groupBy&lt;T, K&gt;</code>. No <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>any</code> starter; your generics must make tsc refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — generic, but no constraint, a cast, and <code>get</code> returns <code>T | undefined</code></strong> (<code>lab6/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — without the constraint you need a cast, and a different return type breaks the callers.</strong> 6.5/10. <code>class Repo&lt;T&gt;</code> with no <code>extends { id: number }</code> cannot read <code>item.id</code>, so this version casts it — and <code>get</code> returns <code>T | undefined</code> instead of a <code>Result</code>. B and D fail because <code>kiem/phai-dung.ts</code> and the tests expect a <code>Result</code> from <code>get</code>. The constraint is not optional here: it is what lets the repository use the id honestly.</p>
</div>
<p><strong>Attempt B — generic and constrained, but <code>pluck</code>’s key is a loose <code>string</code></strong> (<code>lab6/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>7/10 — a bare pass. The <code>Repo</code> and <code>Result</code> are right, so S1, S2, S4, S5, S6, S7 are refused. But <code>pluck&lt;T&gt;(items, key: string): unknown[]</code> drops two things: a typo (S3) is accepted, and the result is <code>unknown[]</code>, so B fails (<code>const emails: string[] = pluck(...)</code>) and S8 reports the wrong code. Use <code>K extends keyof T</code> and return <code>T[K][]</code> (6.2) and both come back.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li><code>type Result&lt;T, E = string&gt; = { ok: true; value: T } | { ok: false; error: E }</code>; <code>ok&lt;T&gt;(value): Result&lt;T, never&gt;</code>, <code>err&lt;E&gt;(error): Result&lt;never, E&gt;</code>.</li>
<li><code>class Repo&lt;T extends { id: number }&gt;</code> with a <code>Map&lt;number, T&gt;</code>; <code>add</code>/<code>get</code>/<code>remove</code> return <code>Result&lt;…&gt;</code>; <code>all(): T[]</code>; <code>get size()</code>.</li>
<li><code>pluck&lt;T, K extends keyof T&gt;(items: readonly T[], key: K): T[K][]</code>.</li>
<li><code>groupBy&lt;T, K&gt;(items: readonly T[], keyFn: (item: T) =&gt; K): Map&lt;K, T[]&gt;</code>.</li>
<li>No casts: the constraint gives you <code>item.id</code>; the Result union gives you narrowing.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Ten out of ten. Three things to notice:</p>
<ul>
<li><strong>The constraint replaces every cast.</strong> <code>T extends { id: number }</code> lets <code>add</code> read <code>item.id</code> with no <code>as</code> — the honest version is shorter than the loose one.</li>
<li><strong>One repository, every type kept.</strong> <code>new Repo&lt;User&gt;()</code> and <code>new Repo&lt;BookingRecord&gt;()</code> are two fully-typed repositories from one class; <code>get(1)</code> returns the right <code>Result</code>.</li>
<li><strong><code>keyof</code> and inference do the rest.</strong> <code>pluck</code> keeps the exact property type; <code>groupBy</code> needs no type arguments at the call.</li>
</ul>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab6</code> prints <strong>Score: 10/10</strong>.</li>
<li><code>npx tsc -p lab6</code> is clean — tests and correct uses included.</li>
<li>No <code>any</code>, no <code>as</code>, no <code>!</code>; the <code>Repo</code> is <code>Repo&lt;T extends { id: number }&gt;</code>.</li>
<li>You can say which line refuses each of S1–S8.</li>
<li>Commit: <code>feat(repo): generic Result and repository (lab 6: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">repository</span><span class="v">A typed store for one kind of entity: <code>Repo&lt;User&gt;</code>, <code>Repo&lt;BookingRecord&gt;</code>.</span></div>
  <div class="kv"><span class="k">generic Result</span><span class="v"><code>Result&lt;T, E = string&gt;</code> — the Chapter 5 union, now over any value and error.</span></div>
  <div class="kv"><span class="k">constraint</span><span class="v"><code>T extends { id: number }</code> — what lets the repo use the id without a cast.</span></div>
  <div class="kv"><span class="k">keyof / indexed access</span><span class="v"><code>pluck&lt;T, K extends keyof T&gt;: T[K][]</code> — keep the property type.</span></div>
  <div class="kv"><span class="k">any vs generic</span><span class="v"><code>any</code> scores 4.5 (refuses nothing); generics score 10.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Run</div><div class="lz-d">node --test, behaviour (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An <code>any</code> model compiles with zero errors and scores 4.5: it refuses almost nothing, and is not even generic (TS2558 at <code>new Repo&lt;User&gt;()</code>).</li>
<li>A generic without the constraint needs a cast and a <code>T | undefined</code> return — 6.5, failing B and D.</li>
<li>A constrained generic with a loose <code>pluck</code> key barely passes (7) — and still lets a typo through and loses the value type.</li>
<li>The reference: a generic <code>Result</code>, <code>Repo&lt;T extends { id: number }&gt;</code>, <code>pluck</code> with <code>keyof</code>, <code>groupBy</code> — no casts, every type kept.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Generics', 'Everything this lab uses: type parameters, constraints, generic classes. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
${nguon('📘', 'TypeScript Handbook — keyof & Indexed Access Types', 'keyof and T[K], used by pluck. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab 6</span>
<h2>Repository generic</h2>
<p class="lead">60–90 phút. LabFlow cần một repository chạy cho mọi thực thể — user, lượt đặt, lab — mà vẫn giữ kiểu của từng cái, cùng một <code>Result</code> cho thao tác có thể hỏng và một <code>groupBy</code>. Một đồng đội với tay tới <code>any</code> để “chạy cho mọi kiểu”; nó biên dịch với <strong>không lỗi nào</strong> và máy chấm cho <strong>4.5 trên 10</strong>. Bạn viết lại bằng generics — một <code>Repo&lt;T&gt;</code> có ràng buộc, một <code>Result</code> generic, <code>pluck</code> với <code>keyof</code>, <code>groupBy</code> — tới khi máy chấm báo 10/10. Đây là tệp mà API (Chương 11) và các service (Chương 14) sẽ dựng trên.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>6.1</strong> — tham số kiểu giữ lại kiểu (không <code>any</code>).</li>
<li><strong>6.2</strong> — ràng buộc <code>T extends { id: number }</code>, và <code>pluck</code> với <code>keyof</code> / truy cập theo chỉ mục.</li>
<li><strong>6.3</strong> — một <code>Result&lt;T, E = string&gt;</code> generic và một class generic <code>Repo&lt;T&gt;</code>.</li>
<li><strong>6.4</strong> — suy kiểu (<code>groupBy</code> không đối số kiểu) và tránh generic thừa/chỉ-trả-về.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng <code>labflow-ts</code> ở cuối Chương 6 và cài đúng các bản đã ghim:
${ra(NPM_CI)}</li>
<li>tsconfig của lab chỉ kế thừa tsconfig của khoá:
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát — bản <code>any</code> của đồng đội:
${ma('typescript', CODE.starter)}</li>
</ol>
<p>Bạn chỉ sửa <code>lab6/src/repo.ts</code>. Các tệp <code>model.ts</code>, <code>booking.ts</code>, <code>schedule.ts</code>, <code>time.ts</code> của khoá là cho sẵn.</p>

<h3>Không lỗi nào — và vì sao điều đó chẳng chứng minh gì</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict, không lỗi — vì <code>any</code> tắt kiểm (1.4). Mọi method “chạy cho mọi kiểu” bằng cách không kiểm cái nào: <code>get</code> trả <code>any</code>, <code>pluck</code> nhận khoá <code>string</code>, class còn chẳng generic. Một mô hình dựng trên <code>any</code> chẳng từ chối gì.</p>

<h3>Máy chấm</h3>
<p><code>npm run lab6</code> chạy <code>scripts/cham-lab-6.mjs</code> — A biên dịch, B cách dùng đúng, C trung thực, D hành vi, E tám cách dùng sai:</p>
${ma('javascript', GRADER_E)}
<p>Chạy trên bản khởi đầu:</p>
${ra(OUT['l3-starter'])}
<p><strong>4.5 trên 10.</strong> B trượt: <code>new Repo&lt;User&gt;()</code> và <code>new Repo&lt;BookingRecord&gt;()</code> là TS2558 (“Expected 0 type arguments”) vì class <code>any</code> không generic. C trượt (<code>any</code> khắp nơi). E là 1/8 — <code>any</code> nhận gần như mọi cách dùng sai. Chỉ hành vi (D) qua, vì phần cài đặt tình cờ đúng.</p>

<h3>Nhiệm vụ</h3>
<p><strong>Chỉ</strong> sửa <code>lab6/src/repo.ts</code> tới khi <code>npm run lab6</code> in <strong>Score: 10/10</strong>: một <code>Result&lt;T, E = string&gt;</code> generic; <code>ok</code>/<code>err</code>/<code>mapResult</code>/<code>unwrapOr</code>; <code>class Repo&lt;T extends { id: number }&gt;</code> mà <code>add</code>/<code>get</code>/<code>remove</code> trả một <code>Result</code>; <code>pluck&lt;T, K extends keyof T&gt;</code>; <code>groupBy&lt;T, K&gt;</code>. Không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái đều biên dịch với bản khởi đầu <code>any</code>; generic của bạn phải làm tsc từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu tiên thường trông thế nào</h3>
<p><strong>Lần thử A — generic, nhưng không ràng buộc, một cast, và <code>get</code> trả <code>T | undefined</code></strong> (<code>lab6/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — không có ràng buộc thì cần một cast, và một kiểu trả về khác làm vỡ người gọi.</strong> 6.5/10. <code>class Repo&lt;T&gt;</code> không <code>extends { id: number }</code> thì không đọc được <code>item.id</code>, nên bản này cast nó — và <code>get</code> trả <code>T | undefined</code> thay vì một <code>Result</code>. B và D trượt vì <code>kiem/phai-dung.ts</code> và test mong một <code>Result</code> từ <code>get</code>. Ràng buộc không phải tuỳ chọn ở đây: nó là thứ cho repository dùng id một cách trung thực.</p>
</div>
<p><strong>Lần thử B — generic và có ràng buộc, nhưng khoá của <code>pluck</code> là <code>string</code> lỏng</strong> (<code>lab6/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>7/10 — đạt sát nút. <code>Repo</code> và <code>Result</code> đúng, nên S1, S2, S4, S5, S6, S7 bị từ chối. Nhưng <code>pluck&lt;T&gt;(items, key: string): unknown[]</code> đánh rơi hai thứ: một lỗi gõ (S3) được nhận, và kết quả là <code>unknown[]</code>, nên B trượt (<code>const emails: string[] = pluck(...)</code>) và S8 báo sai mã. Dùng <code>K extends keyof T</code> và trả <code>T[K][]</code> (6.2) thì cả hai trở lại.</p>

<h3>Thang chấm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li><code>type Result&lt;T, E = string&gt; = { ok: true; value: T } | { ok: false; error: E }</code>; <code>ok&lt;T&gt;(value): Result&lt;T, never&gt;</code>, <code>err&lt;E&gt;(error): Result&lt;never, E&gt;</code>.</li>
<li><code>class Repo&lt;T extends { id: number }&gt;</code> với một <code>Map&lt;number, T&gt;</code>; <code>add</code>/<code>get</code>/<code>remove</code> trả <code>Result&lt;…&gt;</code>; <code>all(): T[]</code>; <code>get size()</code>.</li>
<li><code>pluck&lt;T, K extends keyof T&gt;(items: readonly T[], key: K): T[K][]</code>.</li>
<li><code>groupBy&lt;T, K&gt;(items: readonly T[], keyFn: (item: T) =&gt; K): Map&lt;K, T[]&gt;</code>.</li>
<li>Không cast: ràng buộc cho bạn <code>item.id</code>; union Result cho bạn narrowing.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Mười trên mười. Ba điều đáng để ý:</p>
<ul>
<li><strong>Ràng buộc thay cho mọi cast.</strong> <code>T extends { id: number }</code> cho <code>add</code> đọc <code>item.id</code> mà không <code>as</code> — bản trung thực ngắn hơn bản lỏng.</li>
<li><strong>Một repository, mọi kiểu đều giữ.</strong> <code>new Repo&lt;User&gt;()</code> và <code>new Repo&lt;BookingRecord&gt;()</code> là hai repository đầy đủ kiểu từ một class; <code>get(1)</code> trả đúng <code>Result</code>.</li>
<li><strong><code>keyof</code> và suy kiểu lo phần còn lại.</strong> <code>pluck</code> giữ đúng kiểu thuộc tính; <code>groupBy</code> không cần đối số kiểu ở lời gọi.</li>
</ul>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab6</code> in <strong>Score: 10/10</strong>.</li>
<li><code>npx tsc -p lab6</code> sạch — kể cả test và cách dùng đúng.</li>
<li>Không <code>any</code>, không <code>as</code>, không <code>!</code>; <code>Repo</code> là <code>Repo&lt;T extends { id: number }&gt;</code>.</li>
<li>Bạn nói được dòng nào từ chối từng cái S1–S8.</li>
<li>Commit: <code>feat(repo): generic Result and repository (lab 6: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">repository</span><span class="v">Một kho có kiểu cho một loại thực thể: <code>Repo&lt;User&gt;</code>, <code>Repo&lt;BookingRecord&gt;</code>.</span></div>
  <div class="kv"><span class="k">Result generic</span><span class="v"><code>Result&lt;T, E = string&gt;</code> — union của Chương 5, giờ trên mọi giá trị và lỗi.</span></div>
  <div class="kv"><span class="k">constraint (ràng buộc)</span><span class="v"><code>T extends { id: number }</code> — thứ cho repo dùng id mà không cast.</span></div>
  <div class="kv"><span class="k">keyof / indexed access</span><span class="v"><code>pluck&lt;T, K extends keyof T&gt;: T[K][]</code> — giữ kiểu thuộc tính.</span></div>
  <div class="kv"><span class="k">any so với generic</span><span class="v"><code>any</code> được 4.5 (chẳng từ chối gì); generic được 10.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chạy</div><div class="lz-d">node --test, hành vi (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái một mã (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một mô hình <code>any</code> biên dịch 0 lỗi mà được 4.5: nó gần như chẳng từ chối gì, và còn không generic (TS2558 ở <code>new Repo&lt;User&gt;()</code>).</li>
<li>Một generic không ràng buộc cần một cast và một kiểu trả về <code>T | undefined</code> — 6.5, trượt B và D.</li>
<li>Một generic có ràng buộc nhưng khoá <code>pluck</code> lỏng thì đạt sát nút (7) — và vẫn để một lỗi gõ lọt và mất kiểu giá trị.</li>
<li>Lời giải: một <code>Result</code> generic, <code>Repo&lt;T extends { id: number }&gt;</code>, <code>pluck</code> với <code>keyof</code>, <code>groupBy</code> — không cast, mọi kiểu đều giữ.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Generics', 'Mọi thứ lab này dùng: tham số kiểu, ràng buộc, class generic. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
${nguon('📘', 'TypeScript Handbook — keyof & Indexed Access Types', 'keyof và T[K], dùng bởi pluck. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html')}
</div>
`,
};
