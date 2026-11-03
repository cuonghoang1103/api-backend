/**
 * TypeScript · Chương 13 · 13.2 — parse vs safeParse. Slug giữ: typescript-13-2-parse-safeparse.
 * Code/output từ ./_ma-ts-13-2.mjs (demo13/ts-13-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Mô hình zod.ts tự-chứa.
 */
import G from '../giang/ts-13-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-13-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>parse</code></span><span class="v">Returns <code>T</code> or throws — for the exceptional.</span></div>
  <div class="kv"><span class="k"><code>safeParse</code></span><span class="v"><code>{ success: true; data } | { success: false; error }</code> — for the expected.</span></div>
  <div class="kv"><span class="k">narrow on <code>success</code></span><span class="v"><code>data</code> on true, <code>error</code> on false.</span></div>
  <div class="kv"><span class="k">no unchecked data</span><span class="v">Reading <code>data</code> without narrowing is TS2339.</span></div>
  <div class="kv"><span class="k">Chapter 5 again</span><span class="v">A discriminated union, now tagging a validation outcome.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>parse</code></span><span class="v">Trả <code>T</code> hoặc ném — cho ngoại lệ.</span></div>
  <div class="kv"><span class="k"><code>safeParse</code></span><span class="v"><code>{ success: true; data } | { success: false; error }</code> — cho dự kiến.</span></div>
  <div class="kv"><span class="k">thu hẹp theo <code>success</code></span><span class="v"><code>data</code> khi true, <code>error</code> khi false.</span></div>
  <div class="kv"><span class="k">không data chưa kiểm</span><span class="v">Đọc <code>data</code> mà không thu hẹp là TS2339.</span></div>
  <div class="kv"><span class="k">Chương 5 lần nữa</span><span class="v">Một discriminated union, giờ gắn nhãn một kết cục validate.</span></div>
</div>`;

export default {
  title: '13.2 — parse vs safeParse|||13.2 — parse so với safeParse',
  slug: 'typescript-13-2-parse-safeparse',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một schema có thể thất bại. parse(unknown): T ném khi dữ liệu không hợp lệ (tốt cho ngoại lệ). safeParse trả một discriminated union { success: true; data } | { success: false; error } (tốt cho dự kiến — form người dùng): thu hẹp theo success, đọc data mà không kiểm là TS2339. Ném cho thứ không nên xảy ra, trả cho luồng bình thường. Đo thật tsc 7.0.2 + Node 22.23.3 (mô hình zod.ts).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>parse vs safeParse</h2>
<p class="lead">A schema can fail, and there are two ways to handle that. <code>parse</code> throws on invalid data — good when a failure is exceptional. <code>safeParse</code> returns a result you must read — good when a failure is expected, like a form the user got wrong. The result is a discriminated union, so the compiler forces you to handle both outcomes.</p>

<h3>safeParse returns a discriminated result</h3>
<p><code>safeParse</code> returns <code>{ success: true; data }</code> or <code>{ success: false; error }</code>; narrow on <code>success</code>:</p>
${ma('ts', CODE.safeparse)}
${ra(OUT['11-safeparse'])}
<p>On the true branch you reach <code>data</code> (the typed value), on the false branch <code>error</code> (the issues). It is the Chapter 5 discriminated union again, tagging a validation outcome.</p>

<h3>You cannot read data without checking</h3>
<p>Read <code>result.data</code> without checking <code>result.success</code>:</p>
${ma('ts', CODE.wrongbranch)}
${ra(OUT['12-wrongbranch'])}
<p><strong>TS2339</strong> — <code>data</code> does not exist on the failure branch. A form handler cannot reach the parsed value without having handled the invalid case first, so there is no path where bad data is silently used.</p>

<h3>When to throw, when to return</h3>
<p>Use <code>parse</code> when invalid data should never happen and you want it to blow up loudly — config at startup, data you control. Use <code>safeParse</code> when invalid data is part of normal flow and you will show a message — user input, a third-party API. Both validate the same way; they differ only in how a failure is delivered.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A function reads <code>result.data.seats</code> without narrowing:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Return <code>result.success ? result.data.seats : 0</code> and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>parse(unknown): T</code> throws on invalid data; use it when a failure is exceptional.</li>
<li><code>safeParse</code> returns <code>{ success: true; data } | { success: false; error }</code> — a discriminated union.</li>
<li>Narrow on <code>success</code> before reading <code>data</code>; unchecked is TS2339.</li>
<li>Throw for the exceptional, return for the expected — the type makes the choice visible.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'Zod — .parse and .safeParse', 'Throwing vs returning a result. Read 4 Nov 2026.', 'https://zod.dev/?id=safeparse')}
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'The tag-and-narrow pattern safeParse uses. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${lienKet({ khoa: 'typescript', bai: 'typescript-5-3-discriminated-union', title: 'The pattern underneath — TypeScript 5.3: Discriminated unions', sub: 'Same: one tag (<code>success</code>) decides which fields exist, and the compiler narrows on it. Different: there you build the union by hand for a Booking state; here Zod’s <code>safeParse</code> hands you one for free, so a validation result cannot be read on the wrong branch.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>parse so với safeParse</h2>
<p class="lead">Một schema có thể thất bại, và có hai cách xử lý. <code>parse</code> ném khi dữ liệu không hợp lệ — tốt khi một thất bại là ngoại lệ. <code>safeParse</code> trả một kết quả bạn phải đọc — tốt khi một thất bại là chuyện dự kiến, như một form người dùng điền sai. Kết quả là một discriminated union, nên trình biên dịch buộc bạn xử lý cả hai kết cục.</p>

<h3>safeParse trả một kết quả discriminated</h3>
<p><code>safeParse</code> trả <code>{ success: true; data }</code> hoặc <code>{ success: false; error }</code>; thu hẹp theo <code>success</code>:</p>
${ma('ts', CODE.safeparse)}
${ra(OUT['11-safeparse'])}
<p>Ở nhánh true bạn với tới <code>data</code> (giá trị có kiểu), ở nhánh false <code>error</code> (các issue). Lại là discriminated union của Chương 5, gắn nhãn một kết cục validate.</p>

<h3>Bạn không đọc được data mà không kiểm</h3>
<p>Đọc <code>result.data</code> mà không kiểm <code>result.success</code>:</p>
${ma('ts', CODE.wrongbranch)}
${ra(OUT['12-wrongbranch'])}
<p><strong>TS2339</strong> — <code>data</code> không tồn tại ở nhánh thất bại. Một handler form không với tới giá trị đã parse mà chưa xử lý trường hợp không hợp lệ, nên không có đường nào dữ liệu xấu bị dùng âm thầm.</p>

<h3>Khi nào ném, khi nào trả</h3>
<p>Dùng <code>parse</code> khi dữ liệu không hợp lệ không bao giờ nên xảy ra và bạn muốn nó nổ to tiếng — config lúc khởi động, dữ liệu bạn kiểm soát. Dùng <code>safeParse</code> khi dữ liệu không hợp lệ là một phần của luồng bình thường và bạn sẽ hiện một thông báo — đầu vào người dùng, một API bên thứ ba. Cả hai validate như nhau; chúng chỉ khác ở cách một thất bại được trao.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một hàm đọc <code>result.data.seats</code> mà không thu hẹp:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Trả <code>result.success ? result.data.seats : 0</code> và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>parse(unknown): T</code> ném khi dữ liệu không hợp lệ; dùng khi một thất bại là ngoại lệ.</li>
<li><code>safeParse</code> trả <code>{ success: true; data } | { success: false; error }</code> — một discriminated union.</li>
<li>Thu hẹp theo <code>success</code> trước khi đọc <code>data</code>; chưa kiểm là TS2339.</li>
<li>Ném cho ngoại lệ, trả cho dự kiến — kiểu làm lựa chọn hiện rõ.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'Zod — .parse và .safeParse', 'Ném so với trả một kết quả. Đọc ngày 4/11/2026.', 'https://zod.dev/?id=safeparse')}
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'Mẫu nhãn-và-thu-hẹp mà safeParse dùng. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${lienKet({ khoa: 'typescript', bai: 'typescript-5-3-discriminated-union', title: 'Mẫu bên dưới — TypeScript 5.3: Discriminated union', sub: 'Giống: một nhãn (<code>success</code>) quyết định trường nào tồn tại, và trình biên dịch thu hẹp theo nó. Khác: ở đó bạn dựng union bằng tay cho một trạng thái Booking; ở đây <code>safeParse</code> của Zod trao cho bạn một cái miễn phí, nên một kết quả validate không đọc được ở nhánh sai.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
