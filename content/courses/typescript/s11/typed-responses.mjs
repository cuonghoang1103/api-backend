/**
 * TypeScript · Chương 11 · 11.2 — Typed responses. Slug giữ: typescript-11-2-typed-responses.
 * Code/output từ ./_ma-ts-11-2.mjs (demo11/ts-11-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-11-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-11-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Res&lt;T&gt;</code></span><span class="v">The response type flows through <code>status()</code> into <code>json()</code>.</span></div>
  <div class="kv"><span class="k">wrong type</span><span class="v"><code>seats</code> as a string is TS2322 — the response will not send it.</span></div>
  <div class="kv"><span class="k">missing field</span><span class="v">A <code>Lab</code> without <code>seats</code> is TS2741 — completeness enforced.</span></div>
  <div class="kv"><span class="k">the contract</span><span class="v">The handler cannot send a shape the route did not declare.</span></div>
  <div class="kv"><span class="k">no drift</span><span class="v">The response and the client that reads it stay in step.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Res&lt;T&gt;</code></span><span class="v">Kiểu response chảy qua <code>status()</code> vào <code>json()</code>.</span></div>
  <div class="kv"><span class="k">sai kiểu</span><span class="v"><code>seats</code> là string là TS2322 — response không gửi nó.</span></div>
  <div class="kv"><span class="k">thiếu trường</span><span class="v">Một <code>Lab</code> không <code>seats</code> là TS2741 — ép đầy đủ.</span></div>
  <div class="kv"><span class="k">hợp đồng</span><span class="v">Handler không gửi được một dáng route không khai.</span></div>
  <div class="kv"><span class="k">không trôi</span><span class="v">Response và client đọc nó bám nhau.</span></div>
</div>`;

export default {
  title: '11.2 — Typed responses|||11.2 — Response có kiểu',
  slug: 'typescript-11-2-typed-responses',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một handler đọc một request có kiểu; nó cũng nên gửi một response có kiểu. Khi kiểu response là một phần của handler, res.json kiểm thứ bạn gửi khớp dáng route hứa — gửi seats là string ⇒ TS2322, bỏ sót một trường ⇒ TS2741. Response thôi là "object nào bạn tình cờ dựng"; nó là một giá trị trình biên dịch kiểm với hợp đồng, nên response và client đọc nó không lệch nhau. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Typed responses</h2>
<p class="lead">A handler reads a typed request; it should also send a typed response. When the response type is part of the handler, <code>res.json</code> checks that what you send matches the shape the route promises — so a missing field or a wrong type is caught before the response ever leaves the server.</p>

<h3>res.json checks the shape</h3>
<p>Give the handler a response type of <code>Booking</code> and <code>res.json</code> takes a <code>Booking</code> — nothing else:</p>
${ma('ts', CODE.responseSend)}
${ra(OUT['11-response'])}
<p>The response is no longer “whatever object you happen to build”; it is a value the compiler verifies against the contract.</p>

<h3>A wrong field is refused</h3>
<p>Send <code>seats</code> as a string:</p>
${ma('ts', CODE.wrongbodySend)}
${ra(OUT['12-wrongbody'])}
<p><strong>TS2322</strong> — the typed response will not let a wrong type through. This is the server-side mirror of a typed API client: the handler cannot send a shape the route did not declare, so the response and its documentation can never drift apart.</p>

<h3>A missing field is refused too</h3>
<p>Leave out a required field — a <code>Lab</code> without its <code>seats</code> — and it is <strong>TS2741</strong> (see Practice). Together with the wrong-type check, the typed response guarantees completeness and correctness: every field the route promises is present, and each has the right type.</p>

<h3>The response, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A handler sends a <code>Lab</code> without its <code>seats</code> field:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Add the field and it compiles and runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>Res&lt;T&gt;</code> carries the body type through <code>status()</code> into <code>json()</code>.</li>
<li>A wrong-type field is TS2322; a missing required field is TS2741 — correctness and completeness.</li>
<li>The handler cannot send a shape the route did not declare — the response is a checked contract.</li>
<li>The response and the client that reads it stay in step, the same as every typed boundary in this course.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'Express — res.json', 'Sending a JSON response. Read 4 Nov 2026.', 'https://expressjs.com/en/api.html#res.json')}
${nguon('📘', 'TypeScript Handbook — Generics', 'The generic Response&lt;T&gt; that carries the body type. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Response có kiểu</h2>
<p class="lead">Một handler đọc một request có kiểu; nó cũng nên gửi một response có kiểu. Khi kiểu response là một phần của handler, <code>res.json</code> kiểm thứ bạn gửi khớp dáng route hứa — nên một trường thiếu hay một kiểu sai bị bắt trước khi response rời máy chủ.</p>

<h3>res.json kiểm dáng</h3>
<p>Cho handler một kiểu response là <code>Booking</code> và <code>res.json</code> nhận một <code>Booking</code> — không gì khác:</p>
${ma('ts', CODE.responseSend)}
${ra(OUT['11-response'])}
<p>Response thôi là “object nào bạn tình cờ dựng”; nó là một giá trị trình biên dịch kiểm với hợp đồng.</p>

<h3>Một trường sai bị từ chối</h3>
<p>Gửi <code>seats</code> là một string:</p>
${ma('ts', CODE.wrongbodySend)}
${ra(OUT['12-wrongbody'])}
<p><strong>TS2322</strong> — response có kiểu không cho một kiểu sai lọt. Đây là ảnh gương phía máy chủ của một API client có kiểu: handler không gửi được một dáng route không khai, nên response và tài liệu của nó không bao giờ lệch nhau.</p>

<h3>Một trường thiếu cũng bị từ chối</h3>
<p>Bỏ sót một trường bắt buộc — một <code>Lab</code> không có <code>seats</code> — và nó là <strong>TS2741</strong> (xem Luyện tập). Cùng với phép kiểm sai-kiểu, response có kiểu bảo đảm đầy đủ và đúng đắn: mọi trường route hứa đều có, và mỗi cái đúng kiểu.</p>

<h3>Response, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một handler gửi một <code>Lab</code> không có trường <code>seats</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Thêm trường và nó biên dịch và chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Res&lt;T&gt;</code> mang kiểu body qua <code>status()</code> vào <code>json()</code>.</li>
<li>Một trường sai-kiểu là TS2322; một trường bắt buộc thiếu là TS2741 — đúng đắn và đầy đủ.</li>
<li>Handler không gửi được một dáng route không khai — response là một hợp đồng được kiểm.</li>
<li>Response và client đọc nó bám nhau, như mọi biên giới có kiểu trong khoá.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'Express — res.json', 'Gửi một response JSON. Đọc ngày 4/11/2026.', 'https://expressjs.com/en/api.html#res.json')}
${nguon('📘', 'TypeScript Handbook — Generics', 'Response&lt;T&gt; generic mang kiểu body. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
</div>
`,
};
