/**
 * TypeScript · Chương 11 · 11.3 — The API result envelope. Slug giữ: typescript-11-3-api-envelope-errors.
 * Code/output từ ./_ma-ts-11-3.mjs (demo11/ts-11-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-11-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-11-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>ApiResult&lt;T&gt;</code></span><span class="v"><code>{ ok: true; data: T }</code> or <code>{ ok: false; error }</code> — a discriminated union.</span></div>
  <div class="kv"><span class="k">narrow on <code>ok</code></span><span class="v">The tag reaches <code>data</code> on success, <code>error</code> on failure.</span></div>
  <div class="kv"><span class="k">no unchecked data</span><span class="v">Reading <code>data</code> without checking <code>ok</code> is TS2339.</span></div>
  <div class="kv"><span class="k">typed errors</span><span class="v">The error has a <code>code</code> and <code>message</code> — not a string.</span></div>
  <div class="kv"><span class="k">Chapter 5, at scale</span><span class="v">The discriminated union is now the backbone of the API.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>ApiResult&lt;T&gt;</code></span><span class="v"><code>{ ok: true; data: T }</code> hoặc <code>{ ok: false; error }</code> — một discriminated union.</span></div>
  <div class="kv"><span class="k">thu hẹp theo <code>ok</code></span><span class="v">Nhãn với tới <code>data</code> khi thành công, <code>error</code> khi thất bại.</span></div>
  <div class="kv"><span class="k">không data chưa kiểm</span><span class="v">Đọc <code>data</code> mà không kiểm <code>ok</code> là TS2339.</span></div>
  <div class="kv"><span class="k">lỗi có kiểu</span><span class="v">Lỗi có <code>code</code> và <code>message</code> — không phải một string.</span></div>
  <div class="kv"><span class="k">Chương 5, ở quy mô</span><span class="v">Discriminated union giờ là xương sống của API.</span></div>
</div>`;

export default {
  title: '11.3 — The API result envelope|||11.3 — Envelope kết quả API',
  slug: 'typescript-11-3-api-envelope-errors',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một endpoint thật không phải lúc nào cũng thành công. Cách gõ kiểu điều đó gọn nhất là một envelope: ApiResult<T> = { ok: true; data: T } | { ok: false; error: {...} } — discriminated union của Chương 5 áp cho cả một API. Nhãn ok thu hẹp union: đọc r.data mà không kiểm r.ok ⇒ TS2339 (data không có ở nhánh error). Lỗi cũng có kiểu (code + message), nên client switch theo code an toàn. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>The API result envelope</h2>
<p class="lead">A real endpoint does not always succeed. The cleanest way to type that is a result envelope — every response is either a success with <code>data</code> or a failure with an <code>error</code>. It is the discriminated union of Chapter 5, applied to a whole API: one shape the client reads, with a tag that says which case it is.</p>

<h3>ApiResult: ok with data, or an error</h3>
<p>The envelope is a union with a discriminant <code>ok</code>:</p>
${ma('ts', CODE.apiEnv)}
${ma('ts', CODE.envelopeHandler)}
${ra(OUT['11-envelope'])}
<p>The discriminant <code>ok</code> narrows the union: on the <code>ok</code> branch you reach <code>data</code>, on the else branch you reach <code>error</code>. The envelope makes “this might fail” part of the type, not a convention.</p>

<h3>You cannot read data without checking</h3>
<p>Read <code>r.data</code> without checking <code>r.ok</code>:</p>
${ma('ts', CODE.wrongbranchHandler)}
${ra(OUT['12-wrongbranch'])}
<p><strong>TS2339</strong> — <code>data</code> does not exist on the error branch. The compiler forces the narrowing: you must handle the failure before you can touch the success. An endpoint that returns an envelope cannot have its errors silently ignored by a client.</p>

<h3>The error is typed too</h3>
<p>The error branch has its own shape — a <code>code</code> and a <code>message</code> — so the client reads <code>r.error.code</code> with the same safety as <code>r.data</code>. Typed errors are as valuable as typed data: a client can switch on the <code>code</code>, show the <code>message</code>, and the compiler checks that every error carries both.</p>

<h3>The envelope, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A function reads <code>r.data.code</code> without narrowing on <code>ok</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Return <code>r.ok ? r.data.code : r.error.message</code> and it compiles:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>ApiResult&lt;T&gt;</code> is <code>{ ok: true; data: T }</code> or <code>{ ok: false; error }</code> — a discriminated union.</li>
<li>The discriminant <code>ok</code> narrows the union; reading <code>data</code> without it is TS2339.</li>
<li>The error branch is typed too (a <code>code</code> and a <code>message</code>) — no stringly-typed errors.</li>
<li>It is the Chapter 5 discriminated union, now the backbone of a typed API.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'The tag-and-narrow pattern the envelope uses. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'RFC 9457 — Problem Details', 'A standard shape for typed error responses. Read 4 Nov 2026.', 'https://www.rfc-editor.org/rfc/rfc9457.html')}
${lienKet({ khoa: 'api-design', bai: 'api-2-3-envelope', title: 'The same envelope, over the wire — API Design 2.3: The response envelope', sub: 'Same: every response is a success with data or a failure with an error, one shape the client reads. Different: there the envelope is a JSON convention with an HTTP status; here <code>ApiResult&lt;T&gt;</code> is a discriminated union the compiler narrows, so a client cannot read <code>data</code> without first handling the error.', cta: 'OPEN API DESIGN LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Envelope kết quả API</h2>
<p class="lead">Một endpoint thật không phải lúc nào cũng thành công. Cách gõ kiểu điều đó gọn nhất là một envelope kết quả — mọi response hoặc là một thành công có <code>data</code> hoặc là một thất bại có <code>error</code>. Đó là discriminated union của Chương 5, áp cho cả một API: một dáng client đọc, với một nhãn nói đó là trường hợp nào.</p>

<h3>ApiResult: ok với data, hoặc một error</h3>
<p>Envelope là một union với một nhãn <code>ok</code>:</p>
${ma('ts', CODE.apiEnv)}
${ma('ts', CODE.envelopeHandler)}
${ra(OUT['11-envelope'])}
<p>Nhãn <code>ok</code> thu hẹp union: ở nhánh <code>ok</code> bạn với tới <code>data</code>, ở nhánh else bạn với tới <code>error</code>. Envelope làm “cái này có thể thất bại” thành một phần của kiểu, không phải một quy ước.</p>

<h3>Bạn không đọc được data mà không kiểm</h3>
<p>Đọc <code>r.data</code> mà không kiểm <code>r.ok</code>:</p>
${ma('ts', CODE.wrongbranchHandler)}
${ra(OUT['12-wrongbranch'])}
<p><strong>TS2339</strong> — <code>data</code> không tồn tại ở nhánh error. Trình biên dịch ép phép thu hẹp: bạn phải xử lý thất bại trước khi chạm thành công. Một endpoint trả một envelope không thể bị client âm thầm bỏ qua lỗi.</p>

<h3>Lỗi cũng có kiểu</h3>
<p>Nhánh error có dáng riêng — một <code>code</code> và một <code>message</code> — nên client đọc <code>r.error.code</code> với cùng an toàn như <code>r.data</code>. Lỗi có kiểu đáng giá như data có kiểu: một client switch theo <code>code</code>, hiện <code>message</code>, và trình biên dịch kiểm mọi lỗi mang cả hai.</p>

<h3>Envelope, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một hàm đọc <code>r.data.code</code> mà không thu hẹp theo <code>ok</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Trả <code>r.ok ? r.data.code : r.error.message</code> và nó biên dịch:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>ApiResult&lt;T&gt;</code> là <code>{ ok: true; data: T }</code> hoặc <code>{ ok: false; error }</code> — một discriminated union.</li>
<li>Nhãn <code>ok</code> thu hẹp union; đọc <code>data</code> mà không có nó là TS2339.</li>
<li>Nhánh error cũng có kiểu (một <code>code</code> và một <code>message</code>) — không lỗi kiểu-chuỗi.</li>
<li>Nó là discriminated union của Chương 5, giờ là xương sống của một API có kiểu.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'Mẫu nhãn-và-thu-hẹp mà envelope dùng. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'RFC 9457 — Problem Details', 'Một dáng chuẩn cho response lỗi có kiểu. Đọc ngày 4/11/2026.', 'https://www.rfc-editor.org/rfc/rfc9457.html')}
${lienKet({ khoa: 'api-design', bai: 'api-2-3-envelope', title: 'Cùng envelope đó, qua mạng — API Design 2.3: Envelope phản hồi', sub: 'Giống: mọi response là một thành công có data hoặc một thất bại có error, một dáng client đọc. Khác: ở đó envelope là một quy ước JSON với một HTTP status; ở đây <code>ApiResult&lt;T&gt;</code> là một discriminated union trình biên dịch thu hẹp, nên một client không đọc được <code>data</code> mà chưa xử lý lỗi.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
