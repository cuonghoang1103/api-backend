/**
 * TypeScript · Chương 11 · 11.1 — Typing Express handlers. Slug giữ: typescript-11-1-express-handlers.
 * BÀI MỞ CHƯƠNG 11 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-11-1.mjs (demo11/ts-11-1, Node 22.23.3 + tsc 7.0.2).
 * Mô hình HTTP tự-chứa (http.ts) — cùng dáng @types/express cho, để mọi ví dụ chạy với @types/node.
 */
import G from '../giang/ts-11-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-11-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Handler&lt;P, Q, B, T&gt;</code></span><span class="v">A function of a typed request and response — params, query, body, response type.</span></div>
  <div class="kv"><span class="k">typed params</span><span class="v"><code>req.params.id</code> is a string; a param the route did not declare is TS2339.</span></div>
  <div class="kv"><span class="k">a contract</span><span class="v">The handler can only touch what the route actually provides.</span></div>
  <div class="kv"><span class="k">a typo → a compile error</span><span class="v">Not a run-time <code>undefined</code>.</span></div>
  <div class="kv"><span class="k">the real thing</span><span class="v"><code>@types/express</code> is this, with more overloads.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Handler&lt;P, Q, B, T&gt;</code></span><span class="v">Một hàm của một request và response có kiểu — params, query, body, kiểu response.</span></div>
  <div class="kv"><span class="k">params có kiểu</span><span class="v"><code>req.params.id</code> là một string; một param route không khai là TS2339.</span></div>
  <div class="kv"><span class="k">một hợp đồng</span><span class="v">Handler chỉ chạm được thứ route thật sự cung cấp.</span></div>
  <div class="kv"><span class="k">một lỗi gõ → một lỗi biên dịch</span><span class="v">Không phải một <code>undefined</code> lúc chạy.</span></div>
  <div class="kv"><span class="k">cái thật</span><span class="v"><code>@types/express</code> là cái này, với nhiều overload hơn.</span></div>
</div>`;

export default {
  title: '11.1 — Typing Express handlers|||11.1 — Gõ kiểu handler Express',
  slug: 'typescript-11-1-express-handlers',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 11: gõ kiểu một backend Node/Express. Một handler là một hàm của request và response. Dùng mô hình kiểu nhỏ tự-chứa của bề mặt Express (Handler<P,Q,B,T> — cùng dáng @types/express cho) để mọi ví dụ chạy với tsc + Node. Params có kiểu ⇒ req.params.id là string, đọc một param route không khai ⇒ TS2339. Request có kiểu là một hợp đồng: handler chỉ chạm thứ route cung cấp. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Typing Express handlers</h2>
<p class="lead">Chapter 10 moved types across packages; now they meet a real backend. An Express handler is a function of a request and a response, and typing it is where most backend type safety comes from. We use a small typed model of the Express surface — the same shape the real <code>@types/express</code> gives you — so every example runs with Node and tsc.</p>

<h3>After Chapter 11 you can…</h3>
<ul>
<li>Type a handler’s params, query and body (this lesson).</li>
<li>Type the response so <code>res.json</code> cannot send the wrong shape (11.2).</li>
<li>Build an API result envelope that forces you to handle errors (11.3).</li>
<li>Type the config and service layers (11.4), and write a typed POST handler (Lab 11).</li>
</ul>

<h3>The model: a typed request and response</h3>
<p>This is the shape <code>@types/express</code> gives you, written small so it runs here:</p>
${ma('ts', CODE.httpModel)}

<h3>A handler with typed params</h3>
<p>Give the <code>Handler</code> a <code>Params</code> of <code>{ id: string }</code> and <code>req.params.id</code> is a typed string:</p>
${ma('ts', CODE.handlerGet)}
${ra(OUT['11-handler'])}
<p>The handler is just a function; the generics are what carry the route’s shape into the body.</p>

<h3>The typed request refuses a wrong param</h3>
<p>Read a param that was not declared — <code>req.params.labId</code> when the route only has <code>id</code>:</p>
${ma('ts', CODE.wrongparamGet)}
${ra(OUT['12-wrongparam'])}
<p><strong>TS2339</strong>. The typed request is a contract: the handler can only touch the params the route actually provides. A typo in a param name stops being a run-time <code>undefined</code> and becomes a compile error.</p>

<h3>A handler, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A handler reads <code>req.params.code</code> when the route declares only <code>id</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Read <code>req.params.id</code> instead and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>A handler is a function of a typed request and response — <code>Handler&lt;Params, Query, Body, Response&gt;</code>.</li>
<li>Typed params make <code>req.params.id</code> a string; reading an undeclared param is TS2339.</li>
<li>The typed request is a contract — the handler can only touch what the route provides.</li>
<li>We use a self-contained model of the Express surface; the real <code>@types/express</code> is the same shape.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'Express — Routing & req.params', 'What a handler receives from a route. Read 4 Nov 2026.', 'https://expressjs.com/en/guide/routing.html')}
${nguon('📘', 'DefinitelyTyped — @types/express', 'The real request/response types this lesson models. Read 4 Nov 2026.', 'https://www.npmjs.com/package/@types/express')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-5-2-dinh-tuyen', title: 'The handlers these types describe — Node.js 5.2: Routing in Express', sub: 'Same: a route maps a method and path to a handler of (req, res). Different: there you build the real Express routes and read params and query at run time; here <code>Handler&lt;P, Q, B, T&gt;</code> types those exact values, so <code>req.params.id</code> is a checked string and an undeclared param is a compile error.', cta: 'OPEN NODE.JS LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Gõ kiểu handler Express</h2>
<p class="lead">Chương 10 đưa kiểu qua các package; giờ chúng gặp một backend thật. Một handler Express là một hàm của một request và một response, và gõ kiểu nó là nơi phần lớn an toàn kiểu của backend đến từ. Ta dùng một mô hình kiểu nhỏ của bề mặt Express — đúng dáng mà <code>@types/express</code> thật cho bạn — để mọi ví dụ chạy được với Node và tsc.</p>

<h3>Sau Chương 11 bạn có thể…</h3>
<ul>
<li>Gõ kiểu params, query, body của một handler (bài này).</li>
<li>Gõ kiểu response để <code>res.json</code> không gửi sai dáng (11.2).</li>
<li>Dựng một envelope kết quả API buộc bạn xử lý lỗi (11.3).</li>
<li>Gõ kiểu tầng config và service (11.4), và viết một handler POST có kiểu (Lab 11).</li>
</ul>

<h3>Mô hình: một request và response có kiểu</h3>
<p>Đây là dáng <code>@types/express</code> cho bạn, viết nhỏ để nó chạy ở đây:</p>
${ma('ts', CODE.httpModel)}

<h3>Một handler với params có kiểu</h3>
<p>Cho <code>Handler</code> một <code>Params</code> là <code>{ id: string }</code> và <code>req.params.id</code> là một string có kiểu:</p>
${ma('ts', CODE.handlerGet)}
${ra(OUT['11-handler'])}
<p>Handler chỉ là một hàm; generic là thứ mang dáng của route vào thân.</p>

<h3>Request có kiểu từ chối một param sai</h3>
<p>Đọc một param không được khai — <code>req.params.labId</code> khi route chỉ có <code>id</code>:</p>
${ma('ts', CODE.wrongparamGet)}
${ra(OUT['12-wrongparam'])}
<p><strong>TS2339</strong>. Request có kiểu là một hợp đồng: handler chỉ chạm được các param mà route thật sự cung cấp. Một lỗi gõ tên param thôi là một <code>undefined</code> lúc chạy mà thành một lỗi biên dịch.</p>

<h3>Một handler, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một handler đọc <code>req.params.code</code> khi route chỉ khai <code>id</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Đọc <code>req.params.id</code> thay vào đó và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một handler là một hàm của một request và response có kiểu — <code>Handler&lt;Params, Query, Body, Response&gt;</code>.</li>
<li>Params có kiểu làm <code>req.params.id</code> một string; đọc một param không khai là TS2339.</li>
<li>Request có kiểu là một hợp đồng — handler chỉ chạm được thứ route cung cấp.</li>
<li>Ta dùng một mô hình tự-chứa của bề mặt Express; <code>@types/express</code> thật cùng dáng.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'Express — Routing & req.params', 'Một handler nhận gì từ một route. Đọc ngày 4/11/2026.', 'https://expressjs.com/en/guide/routing.html')}
${nguon('📘', 'DefinitelyTyped — @types/express', 'Các kiểu request/response thật bài này mô hình hoá. Đọc ngày 4/11/2026.', 'https://www.npmjs.com/package/@types/express')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-5-2-dinh-tuyen', title: 'Các handler mà các kiểu này tả — Node.js 5.2: Định tuyến trong Express', sub: 'Giống: một route ánh xạ một method và path tới một handler của (req, res). Khác: ở đó bạn dựng các route Express thật và đọc params, query lúc chạy; ở đây <code>Handler&lt;P, Q, B, T&gt;</code> gõ kiểu đúng các giá trị đó, nên <code>req.params.id</code> là một string được kiểm và một param không khai là một lỗi biên dịch.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
