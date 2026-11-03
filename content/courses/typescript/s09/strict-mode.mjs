/**
 * TypeScript · Chương 9 · 9.2 — strict mode. Slug giữ: typescript-9-2-strict-mode.
 * Code/output từ ./_ma-ts-09-2.mjs (demo9/ts-09-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-09-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-09-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>strict</code></span><span class="v">One flag; an umbrella over the checks below. The default even with no config.</span></div>
  <div class="kv"><span class="k"><code>noImplicitAny</code></span><span class="v">A value with no type is an error (TS7006), not a silent <code>any</code>.</span></div>
  <div class="kv"><span class="k"><code>strictNullChecks</code></span><span class="v"><code>null</code>/<code>undefined</code> are their own types — a possibly-undefined read is TS18048.</span></div>
  <div class="kv"><span class="k">+ six more</span><span class="v">strictFunctionTypes, strictPropertyInitialization, useUnknownInCatchVariables…</span></div>
  <div class="kv"><span class="k">the honest move</span><span class="v">strict on, then fix what it finds — not strict off to pass the build.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>strict</code></span><span class="v">Một cờ; một chiếc ô trên các phép kiểm dưới đây. Mặc định kể cả không có config.</span></div>
  <div class="kv"><span class="k"><code>noImplicitAny</code></span><span class="v">Một giá trị không kiểu là một lỗi (TS7006), không phải một <code>any</code> âm thầm.</span></div>
  <div class="kv"><span class="k"><code>strictNullChecks</code></span><span class="v"><code>null</code>/<code>undefined</code> là kiểu riêng — một lần đọc có-thể-undefined là TS18048.</span></div>
  <div class="kv"><span class="k">+ sáu cái nữa</span><span class="v">strictFunctionTypes, strictPropertyInitialization, useUnknownInCatchVariables…</span></div>
  <div class="kv"><span class="k">nước đi trung thực</span><span class="v">bật strict, rồi sửa những gì nó tìm — không tắt strict để build qua.</span></div>
</div>`;

export default {
  title: '9.2 — strict mode|||9.2 — Chế độ strict',
  slug: 'typescript-9-2-strict-mode',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Cờ strict bật các phép kiểm làm TypeScript đáng dùng — một chiếc ô trên tám cờ. Hai cái rõ nhất: noImplicitAny (một tham số không kiểu là TS7006, không phải any âm thầm) và strictNullChecks (một giá trị có thể undefined ⇒ TS18048). Cùng một tệp: dưới strict:false biên dịch 0 lỗi (cả hai bug ẩn), bật strict báo cả hai. Tắt strict không sửa gì — nó chỉ ngừng hỏi. strict là mặc định kể cả khi chạy tsc không config. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>strict mode</h2>
<p class="lead">One flag, <code>strict</code>, turns on the checks that make TypeScript worth using. It is an umbrella over several flags; the two you feel most are <code>noImplicitAny</code> (no untyped value slips in) and <code>strictNullChecks</code> (<code>null</code> and <code>undefined</code> are their own types). With <code>strict</code> off, most of this course’s bugs compile silently.</p>

<h3>noImplicitAny: no silent any</h3>
<p><code>parse</code> takes <code>raw</code> with no type:</p>
${ma('ts', CODE.implicitanyParse)}
${ra(OUT['11-implicitany'])}
<p><strong>TS7006</strong>: a parameter that would otherwise be <code>any</code>, which turns off every check inside the function. <code>noImplicitAny</code> forces you to say what <code>raw</code> is, so the compiler can check the <code>.trim()</code> you call on it. A silent <code>any</code> is a hole in the type system; this flag closes it.</p>

<h3>strictNullChecks: null is its own type</h3>
<p><code>find</code> may return <code>undefined</code>, so reading <code>.name</code> is refused:</p>
${ma('ts', CODE.nullchecksFind)}
${ra(OUT['12-nullchecks'])}
<p><strong>TS18048</strong>: <code>u</code> is possibly <code>undefined</code>. Without <code>strictNullChecks</code>, <code>null</code> and <code>undefined</code> are assignable to everything and this crash ships. With it, <code>undefined</code> is a type you must handle — a guard, a default, or <code>?.</code> — before you touch the value. This single flag prevents the most common run-time error there is.</p>

<h3>The same file, loose vs strict</h3>
<p><code>greet</code> has an implicit <code>any</code> and an unguarded possibly-undefined value. Under <code>strict: false</code> it compiles with 0 errors:</p>
${ma('ts', CODE.umbrellaCode)}
${ra(OUT['13-umbrella-loose'])}
<p>Flip <code>strict</code> on and the same file reports both bugs:</p>
${ra(OUT['14-umbrella-strict'])}
<p>The code did not change; the question <code>tsc</code> was asked did. <code>strict</code> is the question “is this actually safe?”.</p>

<h3>What the strict umbrella turns on</h3>
<p><code>strict</code> is shorthand for a set: <code>noImplicitAny</code>, <code>strictNullChecks</code>, <code>strictFunctionTypes</code>, <code>strictBindCallApply</code>, <code>strictPropertyInitialization</code>, <code>noImplicitThis</code>, <code>useUnknownInCatchVariables</code> and <code>alwaysStrict</code>. You can toggle one off by name, but the course — like most real projects — leaves the whole umbrella on. It is the default even when you run <code>tsc</code> with no config at all.</p>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>label</code> function with an implicit-any parameter and an unguarded lookup fails under strict:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Type the parameter and guard the value, and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>strict</code> is one flag that turns on eight — the checks that catch most type bugs.</li>
<li><code>noImplicitAny</code>: an untyped value is TS7006, not a silent <code>any</code>.</li>
<li><code>strictNullChecks</code>: a possibly-undefined read is TS18048 — handle it before you touch it.</li>
<li>Turning <code>strict</code> off to pass a build fixes nothing; the honest move is strict on, then fix what it finds.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TSConfig Reference — strict', 'The strict flag and the family it turns on. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#strict')}
${nguon('📘', 'TypeScript Handbook — strictNullChecks', 'Why null and undefined are their own types. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#strictNullChecks')}
${lienKet({ khoa: 'testing', bai: 'tst-1-1-cau-truc', title: 'Caught before it runs — Testing 1.1: the shape of a test', sub: 'Same: you want a bug caught before it reaches a user. Different: a test catches a bug when it runs a specific case; <code>strict</code> is the switch that lets the compiler refuse a whole class of bugs — an untyped value (TS7006), a possibly-undefined read (TS18048) — before the code runs at all. The two are complementary: the compiler for shape, tests for behaviour.', cta: 'OPEN TESTING LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Chế độ strict</h2>
<p class="lead">Một cờ, <code>strict</code>, bật các phép kiểm làm TypeScript đáng dùng. Nó là một chiếc ô trên vài cờ; hai cái bạn cảm nhận rõ nhất là <code>noImplicitAny</code> (không giá trị nào lọt vào mà không có kiểu) và <code>strictNullChecks</code> (<code>null</code> và <code>undefined</code> là kiểu riêng). Tắt <code>strict</code>, phần lớn bug của khoá này biên dịch âm thầm.</p>

<h3>noImplicitAny: không any âm thầm</h3>
<p><code>parse</code> nhận <code>raw</code> không có kiểu:</p>
${ma('ts', CODE.implicitanyParse)}
${ra(OUT['11-implicitany'])}
<p><strong>TS7006</strong>: một tham số lẽ ra là <code>any</code>, thứ tắt mọi phép kiểm trong hàm. <code>noImplicitAny</code> buộc bạn nói <code>raw</code> là gì, để trình biên dịch kiểm được <code>.trim()</code> bạn gọi trên nó. Một <code>any</code> âm thầm là một lỗ trong hệ kiểu; cờ này bịt nó.</p>

<h3>strictNullChecks: null là một kiểu riêng</h3>
<p><code>find</code> có thể trả <code>undefined</code>, nên đọc <code>.name</code> bị từ chối:</p>
${ma('ts', CODE.nullchecksFind)}
${ra(OUT['12-nullchecks'])}
<p><strong>TS18048</strong>: <code>u</code> có thể <code>undefined</code>. Không có <code>strictNullChecks</code>, <code>null</code> và <code>undefined</code> gán được vào mọi thứ và cú sập này lên sản phẩm. Có nó, <code>undefined</code> là một kiểu bạn phải xử lý — một guard, một mặc định, hay <code>?.</code> — trước khi chạm giá trị. Một cờ này ngăn lỗi lúc chạy hay gặp nhất.</p>

<h3>Cùng một tệp, lỏng so với strict</h3>
<p><code>greet</code> có một implicit <code>any</code> và một giá trị có-thể-undefined không chặn. Dưới <code>strict: false</code> nó biên dịch 0 lỗi:</p>
${ma('ts', CODE.umbrellaCode)}
${ra(OUT['13-umbrella-loose'])}
<p>Bật <code>strict</code> và cùng tệp đó báo cả hai bug:</p>
${ra(OUT['14-umbrella-strict'])}
<p>Code không đổi; câu hỏi đặt cho <code>tsc</code> đổi. <code>strict</code> là câu hỏi “cái này thật sự an toàn chưa?”.</p>

<h3>Chiếc ô strict bật những gì</h3>
<p><code>strict</code> là cách gọi tắt một tập: <code>noImplicitAny</code>, <code>strictNullChecks</code>, <code>strictFunctionTypes</code>, <code>strictBindCallApply</code>, <code>strictPropertyInitialization</code>, <code>noImplicitThis</code>, <code>useUnknownInCatchVariables</code> và <code>alwaysStrict</code>. Bạn tắt được một cái theo tên, nhưng khoá — như hầu hết dự án thật — để cả chiếc ô bật. Nó là mặc định kể cả khi bạn chạy <code>tsc</code> không có config nào.</p>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một hàm <code>label</code> với tham số implicit-any và một lần tra không chặn trượt dưới strict:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Gán kiểu cho tham số và chặn giá trị, và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>strict</code> là một cờ bật tám cờ — các phép kiểm bắt phần lớn bug kiểu.</li>
<li><code>noImplicitAny</code>: một giá trị không kiểu là TS7006, không phải một <code>any</code> âm thầm.</li>
<li><code>strictNullChecks</code>: một lần đọc có-thể-undefined là TS18048 — xử lý trước khi chạm.</li>
<li>Tắt <code>strict</code> để build qua không sửa gì; nước đi trung thực là bật strict, rồi sửa những gì nó tìm.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TSConfig Reference — strict', 'Cờ strict và họ hàng nó bật. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#strict')}
${nguon('📘', 'TypeScript Handbook — strictNullChecks', 'Vì sao null và undefined là kiểu riêng. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#strictNullChecks')}
${lienKet({ khoa: 'testing', bai: 'tst-1-1-cau-truc', title: 'Bắt trước khi chạy — Testing 1.1: dáng của một test', sub: 'Giống: bạn muốn một bug bị bắt trước khi tới người dùng. Khác: một test bắt một bug khi nó chạy một trường hợp cụ thể; <code>strict</code> là công tắc cho trình biên dịch từ chối cả một lớp bug — một giá trị không kiểu (TS7006), một lần đọc có-thể-undefined (TS18048) — trước khi code chạy. Hai cái bù nhau: trình biên dịch lo dáng, test lo hành vi.', cta: 'MỞ BÀI TESTING →' })}
</div>
`,
};
