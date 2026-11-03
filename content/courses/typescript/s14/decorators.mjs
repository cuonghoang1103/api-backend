/**
 * TypeScript · Chương 14 · 14.4 — Decorators. Slug giữ: typescript-14-4-decorators.
 * Code/output từ ./_ma-ts-14-4.mjs (demo14/ts-14-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 * Decorator chuẩn TC39 (không experimentalDecorators). Chạy cần bước build (emit) — Node type-stripping KHÔNG chạy decorator.
 */
import G from '../giang/ts-14-4.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-14-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">a decorator</span><span class="v">A function that wraps a class member to add behaviour.</span></div>
  <div class="kv"><span class="k">TC39 standard</span><span class="v">No <code>experimentalDecorators</code> — native in TypeScript.</span></div>
  <div class="kv"><span class="k">a typed context</span><span class="v"><code>ClassMethodDecoratorContext</code>, …</span></div>
  <div class="kv"><span class="k">wrong target</span><span class="v">A method decorator on a field is TS1240.</span></div>
  <div class="kv"><span class="k">needs a build</span><span class="v">Compile to JS, then run — not type-stripping.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">một decorator</span><span class="v">Một hàm bọc một thành viên class để thêm hành vi.</span></div>
  <div class="kv"><span class="k">chuẩn TC39</span><span class="v">Không <code>experimentalDecorators</code> — native trong TypeScript.</span></div>
  <div class="kv"><span class="k">một context có kiểu</span><span class="v"><code>ClassMethodDecoratorContext</code>, …</span></div>
  <div class="kv"><span class="k">sai đích</span><span class="v">Một method decorator trên một field là TS1240.</span></div>
  <div class="kv"><span class="k">cần build</span><span class="v">Biên dịch sang JS, rồi chạy — không phải type-stripping.</span></div>
</div>`;

export default {
  title: '14.4 — Decorators|||14.4 — Decorator',
  slug: 'typescript-14-4-decorators',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một decorator là một hàm bọc một thành viên class (method/field/class) để thêm hành vi mà không đổi thân nó. TypeScript dùng decorator chuẩn TC39 (không cờ experimentalDecorators). Mỗi loại có một context có kiểu (ClassMethodDecoratorContext…), nên áp một decorator vào sai đích là một lỗi biên dịch (method decorator trên field ⇒ TS1240). Decorator cần một bước build (emit) để chạy — Node type-stripping KHÔNG chạy decorator. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Decorators</h2>
<p class="lead">A decorator is a function that wraps a class member — a method, a field, the class itself — to add behaviour without changing its body. TypeScript uses the TC39 standard decorators (no <code>experimentalDecorators</code> flag), and each kind has a typed context, so a decorator applied to the wrong target is a compile error.</p>

<h3>A method decorator wraps the method</h3>
<p>A method decorator takes the original function and a <code>ClassMethodDecoratorContext</code>, and returns a replacement. A <code>@logged</code> decorator wraps <code>book()</code> to print the method name:</p>
${ma('ts', CODE.decRun)}
${ra(OUT['11-run'])}
<p>Decorators need a build step (not Node’s type-stripping): compile to JavaScript, then run. The output shows the wrapper logged <code>book</code> and the original ran. The command above is that two-step build-and-run.</p>

<h3>The wrong target is a compile error</h3>
<p>Put a method decorator on a field:</p>
${ma('ts', CODE.wrongtarget)}
${ra(OUT['12-wrongtarget'])}
<p><strong>TS1240</strong> (with a signature mismatch) — the field decorator context is a different type than the method one, so the function does not fit. The type system keeps a decorator where it belongs: a logging wrapper for methods cannot silently land on a field where it would be meaningless.</p>

<h3>The context types the target</h3>
<p>Each decorator kind has its own context type — <code>ClassMethodDecoratorContext</code>, <code>ClassFieldDecoratorContext</code>, <code>ClassDecoratorContext</code> — carrying the member’s <code>name</code>, <code>kind</code>, and helpers like <code>addInitializer</code>. The signature is what makes a decorator type-safe: it only fits where its context fits.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>@logged</code> method decorator is put on a field:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Move it onto a method and it compiles (exit 0):</p>
${ma('ts', CODE.prSol)}

<h3>📌 Summary</h3>
<ul>
<li>A decorator is a typed function that wraps a class member; TypeScript uses TC39 standard decorators.</li>
<li>Each kind has a context type (<code>ClassMethodDecoratorContext</code>…), so a wrong target is TS1240.</li>
<li>Decorators run through a build step — compile to JS, then run; Node’s type-stripping does not run them.</li>
<li>This closes the object-oriented half of TypeScript: classes, access, abstract, <code>#private</code>, decorators.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript 5.0 — Decorators', 'The TC39 standard decorators TypeScript implements. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators')}
${nguon('📘', 'TC39 — Decorators proposal', 'The standard behind method, field and class decorators. Read 4 Nov 2026.', 'https://github.com/tc39/proposal-decorators')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Decorator</h2>
<p class="lead">Một decorator là một hàm bọc một thành viên class — một method, một field, chính class — để thêm hành vi mà không đổi thân nó. TypeScript dùng decorator chuẩn TC39 (không cờ <code>experimentalDecorators</code>), và mỗi loại có một context có kiểu, nên một decorator áp sai đích là một lỗi biên dịch.</p>

<h3>Một method decorator bọc method</h3>
<p>Một method decorator nhận hàm gốc và một <code>ClassMethodDecoratorContext</code>, và trả một bản thay. Một decorator <code>@logged</code> bọc <code>book()</code> để in tên method:</p>
${ma('ts', CODE.decRun)}
${ra(OUT['11-run'])}
<p>Decorator cần một bước build (không phải type-stripping của Node): biên dịch sang JavaScript, rồi chạy. Output cho thấy wrapper ghi log <code>book</code> và bản gốc chạy. Lệnh phía trên chính là bước build-và-chạy hai pha đó.</p>

<h3>Sai đích là một lỗi biên dịch</h3>
<p>Đặt một method decorator lên một field:</p>
${ma('ts', CODE.wrongtarget)}
${ra(OUT['12-wrongtarget'])}
<p><strong>TS1240</strong> (kèm một lệch chữ ký) — context decorator field là một kiểu khác với của method, nên hàm không vừa. Hệ kiểu giữ một decorator ở đúng chỗ: một wrapper ghi log cho method không âm thầm rơi vào một field nơi nó vô nghĩa.</p>

<h3>Context gõ kiểu cho đích</h3>
<p>Mỗi loại decorator có kiểu context riêng — <code>ClassMethodDecoratorContext</code>, <code>ClassFieldDecoratorContext</code>, <code>ClassDecoratorContext</code> — mang <code>name</code>, <code>kind</code> của thành viên, và helper như <code>addInitializer</code>. Chữ ký là thứ làm một decorator an toàn kiểu: nó chỉ vừa ở nơi context của nó vừa.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một method decorator <code>@logged</code> đặt lên một field:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Chuyển nó lên một method và nó biên dịch (exit 0):</p>
${ma('ts', CODE.prSol)}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một decorator là một hàm có kiểu bọc một thành viên class; TypeScript dùng decorator chuẩn TC39.</li>
<li>Mỗi loại có một kiểu context (<code>ClassMethodDecoratorContext</code>…), nên một sai đích là TS1240.</li>
<li>Decorator chạy qua một bước build — biên dịch sang JS, rồi chạy; type-stripping của Node không chạy chúng.</li>
<li>Điều này khép lại nửa hướng-đối-tượng của TypeScript: class, truy cập, abstract, <code>#private</code>, decorator.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript 5.0 — Decorators', 'Decorator chuẩn TC39 mà TypeScript cài. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators')}
${nguon('📘', 'TC39 — Decorators proposal', 'Chuẩn đằng sau method, field và class decorator. Đọc ngày 4/11/2026.', 'https://github.com/tc39/proposal-decorators')}
</div>
`,
};
