/**
 * Next.js & React — Chương 12: Server Actions. KHÉP GIAI ĐOẠN 3 (mốc PT2).
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * ⚠ Tên hook đã đổi ở React 19 (Next 15 dùng React 19): useFormState → useActionState
 * (từ 'react'); useFormStatus vẫn ở 'react-dom'. Bài dạy tên HIỆN HÀNH và nói rõ
 * đổi tên. Thuần khái niệm — không có output console để chạy. Bảo mật Server Action
 * (endpoint công khai, phải validate+authorize) nối với các đợt vá bảo mật thật của
 * cuongthai.com (upload/socket) → .note-ct/.pitfall.
 */

import G12_1 from './giang/nxj-12-1.mjs';
import G12_2 from './giang/nxj-12-2.mjs';
import G12_3 from './giang/nxj-12-3.mjs';
import G12_4 from './giang/nxj-12-4.mjs';
import G12_5 from './giang/nxj-12-5.mjs';
export default {
  title: 'Chapter 12 — Server Actions: mutate without an API route|||Chương 12 — Server Actions: mutate không cần API route',
  description: "Một hàm 'use server' chạy trên server và gọi được thẳng từ form/React — không phải dựng API route. Đọc FormData, validate, revalidate cache sau khi ghi, trạng thái pending/lỗi với useActionState & useFormStatus, và bảo mật: action là endpoint công khai.",
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — What a Server Action is|||12.1 — Server Action là gì',
      slug: 'nextjs-12-1-server-action-la-gi',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js 14 - Server Actions TUTORIAL | Type Safety, Error Handling, Pending States" — developedbyed (oEmbed verified).
      video: { url: 'https://youtu.be/UKupfEuUc1M', durationSeconds: 0 },
      description: 'Cho tới giờ, để ghi dữ liệu bạn phải dựng một API route rồi fetch tới nó. Server Action bỏ bước đó: viết một hàm server và gọi nó thẳng từ React như một hàm thường.',
      content: `
${G12_1}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1 · Stage 3 finale</span>
<h2>A function that runs on the server, called like a normal function</h2>
<p class="lead">Chapters 8–11 were about reading data and routing. This chapter is about <em>writing</em> — creating, updating, deleting. The classic way is: build an API endpoint, then <code>fetch</code> it from the client with the right method, headers and body. Server Actions collapse all of that into a single server function you call directly.</p>

<h3>The 'use server' directive</h3>
<pre><code class="language-typescript"><span class="tok-comment">// A Server Action — note the directive INSIDE the function</span>
async function createPost(formData: FormData) {   <span class="tok-comment">// db: your Prisma client (e.g. lib/db.ts)</span>
  'use server';
  const title = formData.get('title');            <span class="tok-comment">// FormDataEntryValue | null — not a string yet</span>
  if (typeof title !== 'string' || !title.trim()) return;
  await db.post.create({ data: { title } });
}</code></pre>
<p><code>'use server'</code> marks the function as a Server Action. It is the mirror of <code>'use client'</code>: that one pushed a component to the browser; this one guarantees a function runs on the server. You can put the directive at the top of a whole file to make every exported function an action, or inside a single function (often inside a Server Component).</p>
<div class="callout warn"><p><strong>Copied as written into a <code>.tsx</code> file</strong>, the untyped version of this function fails <code>tsc</code> twice — <code>TS7006 Parameter 'formData' implicitly has an 'any' type</code> and <code>TS2304 Cannot find name 'db'</code> — and once those are fixed a third error appears: <code>TS2322 Type 'FormDataEntryValue | null' is not assignable to type 'string'</code>. A form field can be missing or a file, so check it before writing (measured below). And the directive has one illegal place: inline inside a <code>'use client'</code> file, where <code>next build</code> stops with <em>"It is not allowed to define inline "use server" annotated Server Actions in Client Components"</em> — put such actions in their own <code>'use server'</code> file and import them.</p></div>

<h3>Two ways to call it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">From a form</span><span class="v">Pass it to a form's <code>action</code> prop: <code>&lt;form action={createPost}&gt;</code>. On submit, the form's data is sent to the action automatically — the next lesson.</span></div>
  <div class="kv"><span class="k">From client code</span><span class="v">Import the action into a Client Component and call it like any async function (e.g. in an <code>onClick</code>). Under the hood Next.js issues a POST for you — to the <b>current URL</b>, with the action id in a <code>Next-Action</code> header (measured). Calls from client code are queued: the next one is sent only when the previous one has answered.</span></div>
</div>

<h3>Why this matters</h3>
<p>No route file, no method/URL to keep in sync, no manual <code>fetch</code> with headers and JSON. The action is co-located with the UI that uses it, and it is type-checked end to end — the argument you pass is the argument the server receives. It is the App Router's answer to "how do I change data" the way Server Components answered "how do I read data."</p>

<div class="callout warn">
<p><strong>It is not magic — it is a network call.</strong> Calling a Server Action still crosses to the server behind the scenes. So its argument must be serializable (Chapter 9's rule, in the other direction — measured: a <code>Date</code> arrives as a <code>Date</code>; a function arrives as an opaque reference and the action fails with 500), it is asynchronous, and — critically — it is a real, reachable endpoint that you must secure. Lesson 12.5 is entirely about that.</p>
</div>

<h3>What happens when you call a Server Action</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>You mark a function <code>&#39;use server&#39;</code></b> — Either at the top of the function or at the top of a file that exports only actions.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React sends a reference, not the code</b> — The browser gets an id: in the JS bundle for an action that client code imports, in the page HTML (a hidden <code>$ACTION_ID_…</code> input) for an action defined inside a Server Component's form; an exported action nobody uses gets no id at all. The function body stays on the server (measured: 0 files under <code>.next/static</code>), so it can query the database and read secrets.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Calling it makes a POST</b> — To the current route, with a <code>Next-Action</code> header, answered as an RSC stream (<code>text/x-component</code>), handled by the framework. You never write a fetch, a URL, or a JSON body.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>It can revalidate before returning</b> — <code>revalidatePath(&#39;/notes&#39;)</code> in the same function invalidates both the server caches and the client router cache.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — treating a Server Action as private because it is not an API route.</strong> It is a public HTTP endpoint. The id is in the page HTML or the client bundle, so anyone can call the action directly with a crafted request (measured: one <code>curl</code> with the <code>Next-Action</code> header ran the action and wrote a row) — no button, no form, no UI validation. Nothing in the code looks like a route, which is exactly why this is missed: an action that deletes a note looks like a local function call, and reads like trusted code. Every action needs the same checks a route handler needs: is the caller authenticated, are they allowed to touch this record, and is the input valid. Lesson 12.5 is entirely about this.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions and mutations</span><span class="lc-sub">The full model: declaration, invocation, revalidation and the security notes.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-server" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use server'</span><span class="lc-sub">The directive itself, and what React guarantees about the boundary.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write a function with <code>'use server'</code> and call it from a Client Component; confirm the body runs on the server.</li>
<li>Log something inside the action and verify it appears in the server console, not the browser.</li>
<li>Explain how an action replaces a hand-written API route + fetch for a mutation.</li>
</ol>
<p><strong>Done when:</strong> you can define a Server Action and explain how it removes a manual API round-trip.</p></div>

<h3>🔬 Measured: what reaches the browser, the real request, the queue (Next.js 16.4.6 + Chromium)</h3>
<p>A page <code>/ghi-chu</code> with an inline action (the lesson's, typed), plus a <code>'use server'</code> file of four exports imported by a client button component:</p>
<div class="out">$ npx tsc --noEmit   # the lesson's code, as written
ghi-chu/page.tsx(2,27): error TS7006: Parameter 'formData' implicitly has an 'any' type.
ghi-chu/page.tsx(5,9): error TS2304: Cannot find name 'db'.
$ npx tsc --noEmit   # fix 1: FormData + db
ghi-chu/page.tsx(7,34): error TS2322: Type 'FormDataEntryValue | null' is not assignable to type 'string'.
  Type 'null' is not assignable to type 'string'.</div>
<pre><code class="language-typescript">'use server';
import { db } from '@/lib/db';

const gio = () =&gt; new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');

export async function themTuNut(title: string) {
  console.log(&#96;[action] themTuNut \${gio()} · title = \${title}&#96;);
  const n = await db.note.create({ data: { title } });
  return n.id;
}

export async function cham(lan: number) {
  console.log(&#96;[action] cham #\${lan} BẮT ĐẦU \${gio()}&#96;);
  await new Promise((r) =&gt; setTimeout(r, 1000));
  console.log(&#96;[action] cham #\${lan} XONG    \${gio()}&#96;);
  return lan;
}

export async function nhanGi(x: unknown) {
  console.log('[action] nhanGi nhận:', Object.prototype.toString.call(x), x instanceof Date ? x.toISOString() : String(x));
  return 'ok';
}

export async function khongAiGoi() {
  console.log('[action] không component nào import hàm này');
}</code></pre>
<p><b>What reaches the browser.</b> The action ids from <code>.next/server/server-reference-manifest.json</code>, then a string from inside <code>createPost</code> and each id searched in the build output:</p>
<div class="out">40796bdc2b83… · $$RSC_SERVER_ACTION_0 · app/ghi-chu/page
408b561d9fd3… · themTuNut · app/ghi-chu/page
40cad8597f63… · cham · app/ghi-chu/page
40cb02493177… · nhanGi · app/ghi-chu/page
thân action trong .next/static (gửi xuống trình duyệt): 0
thân action trong .next/server: 2
$$RSC_SERVER_ACTION_0 · id trong .next/static: 0 tệp
themTuNut · id trong .next/static: 1 tệp
cham · id trong .next/static: 1 tệp
nhanGi · id trong .next/static: 1 tệp
name="$ACTION_ID_40796b…"</div>
<p>Four exports, three ids (plus the inline <code>createPost</code>): <code>khongAiGoi</code>, which no component imports, has none. The body is in 0 files the browser downloads.</p>
<p><b>The real request</b> (Chromium, network tab): submit the form, click a button calling <code>themTuNut</code>, click "slow" three times 60 ms apart, send a <code>Date</code> and a function:</p>
<div class="out">form submit   POST /ghi-chu · next-action 40796bdc2b83… · multipart/form-data (_1_title=Bài từ form) → 200 text/x-component
themTuNut()   POST /ghi-chu · next-action 408b561d9fd3… · text/plain;charset=UTF-8 ["từ nút bấm"] → 200 text/x-component
cham(1)      POST sent at 558 ms · answered at 1565 ms
cham(2)      POST sent at 1566 ms · answered at 2574 ms
cham(3)      POST sent at 2574 ms · answered at 3580 ms
nhanGi(Date)  body ["$D2026-11-14T05:00:00.000Z"] → 200
nhanGi(fn)    body ["$T"] → 500</div>
<div class="out">[action] themTuNut 05:19:12.128 · title = curl gọi thẳng, không bấm nút
[action] createPost ở MÁY CHỦ: Bài từ form chuoi-chi-o-may-chu-12-1
[action] themTuNut 05:19:16.242 · title = từ nút bấm
[action] cham #1 BẮT ĐẦU 05:19:19.052
[action] cham #1 XONG    05:19:20.055
[action] cham #2 BẮT ĐẦU 05:19:20.061
[action] cham #2 XONG    05:19:21.063
[action] cham #3 BẮT ĐẦU 05:19:21.068
[action] cham #3 XONG    05:19:22.070
[action] nhanGi nhận: [object Date] 2026-11-14T05:00:00.000Z</div>
<p>Both calls are a POST to the page itself. The three slow calls never overlapped: each left the browser when the previous answered. The function argument failed on the server: <em>Error: Cannot access toString on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client.</em></p>
<p><b>A public endpoint.</b> No browser, no button — just the id:</p>
<div class="out">$ ID=&lt;id của themTuNut&gt;; curl -X POST localhost:3000/ghi-chu -H "Next-Action: $ID" -H 'content-type: text/plain' -d '["curl gọi thẳng, không bấm nút"]'
HTTP 200 · text/x-component
:"$@1","q":"","i":false,"b":"A15lGcm2KxiP7YuS2YxJF"}
1:1010</div>
<p><b>Ids are build artifacts</b> — same after a rebuild that keeps <code>.next</code>, new after deleting it, with identical code. Never hard-code one:</p>
<div class="out">build 1: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177
build 2: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177
id GIỐNG nhau
trước: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177
sau:   40497f3e5569 40c0233e0650 40f4c1c18ed8 40f570838177
id KHÁC nhau</div>
<p><b>Inline <code>'use server'</code> inside a <code>'use client'</code> file:</b></p>
<div class="out">./src/app/ghi-chu/Sai.tsx:5:5
Error: It is not allowed to define inline "use server" annotated Server Actions in Client Components.
To use Server Actions in a Client Component, you can either export them from a separate file with "use server" at the top, or pass them down through props from a Server Component.</div>
<div class="note-ct"><p><strong>cuongthai.com has zero Server Actions</strong> (measured: 0 files with <code>'use server'</code> in <code>frontend/src</code>). Every write goes to a separate Express API (<code>/api/v1</code>) shared by the web, the desktop app and the CLI, so a Next.js-only function would serve one client of three; cache refresh goes through one Route Handler, <code>/api/revalidate</code>. Server Actions fit when the database belongs to the Next.js app and the form is yours.</p></div>
<div class="out">tệp có 'use server' trong frontend/src: 0
app/api/revalidate/route.ts:19:import { revalidatePath, revalidateTag } from 'next/cache';
app/api/revalidate/route.ts:75:      revalidatePath(path);
app/api/revalidate/route.ts:82:      revalidateTag(tag);</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
node -e "console.log(Object.keys(require('./.next/server/server-reference-manifest.json').node))" <span class="tok-comment">  # the action ids</span>
grep -rl '&lt;a string inside your action&gt;' .next/static | wc -l <span class="tok-comment">  # expect 0</span>
curl -X POST localhost:3000/&lt;your page&gt; -H "Next-Action: $ID" -H 'content-type: text/plain;charset=UTF-8' -d '["x"]'</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-1-tai-nguyen-phuong-thuc" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.1 — Resources, methods and REST</span><span class="lc-sub">POST and HTTP methods from the ground up — what an action really sends</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-3-dau-vao-doc-hai" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 9.3 — Hostile input</span><span class="lc-sub">Every action argument is chosen by the caller — check it like any endpoint</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-4-props-serialize" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.4 — Across the boundary: props must serialize</span><span class="lc-sub">The same encoding, server → browser</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server Action</span><span class="v">A server function called from the client via <code>'use server'</code>.</span></div>
  <div class="kv"><span class="k">'use server'</span><span class="v">Marks a function (or file) as a server action.</span></div>
  <div class="kv"><span class="k">Mutation</span><span class="v">A write (create/update/delete) triggered from the UI.</span></div>
  <div class="kv"><span class="k">No API route</span><span class="v">Actions replace hand-written fetch + endpoint for writes.</span></div>
  <div class="kv"><span class="k">RPC feel</span><span class="v">Call a server function as if it were local.</span></div>
  <div class="kv"><span class="k">Runs on server</span><span class="v">The body executes on the server with full access.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A Server Action is a server function you call from the client, marked with <code>'use server'</code>.</li><li>It runs on the server with full access to the database and secrets.</li><li>Actions replace a hand-written API route + fetch for mutations.</li><li>They feel like calling a local function but execute server-side.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions and Mutations</span><span class="lc-sub">The full model: 'use server', forms, calling from the client, and revalidation.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-functions" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Functions</span><span class="lc-sub">The React-level primitive behind Server Actions.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1 · Khép Giai đoạn 3</span>
<h2>Một hàm chạy trên server, gọi như một hàm thường</h2>
<p class="lead">Chương 8–11 nói về đọc dữ liệu và định tuyến. Chương này nói về <em>ghi</em> — tạo, cập nhật, xoá. Cách kinh điển là: dựng một endpoint API, rồi <code>fetch</code> tới nó từ client với đúng method, header và body. Server Action gộp tất cả thành một hàm server bạn gọi thẳng.</p>

<h3>Chỉ thị 'use server'</h3>
<pre><code class="language-typescript"><span class="tok-comment">// Một Server Action — để ý chỉ thị BÊN TRONG hàm</span>
async function createPost(formData: FormData) {   <span class="tok-comment">// db: client Prisma của bạn (vd lib/db.ts)</span>
  'use server';
  const title = formData.get('title');            <span class="tok-comment">// FormDataEntryValue | null — chưa chắc là chuỗi</span>
  if (typeof title !== 'string' || !title.trim()) return;
  await db.post.create({ data: { title } });
}</code></pre>
<p><code>'use server'</code> đánh dấu hàm là một Server Action. Nó là tấm gương của <code>'use client'</code>: cái kia đẩy một component ra trình duyệt; cái này bảo đảm một hàm chạy trên server. Bạn có thể đặt chỉ thị ở đầu cả một file để mọi hàm export thành action, hoặc bên trong một hàm đơn lẻ (thường trong một Server Component).</p>
<div class="callout warn"><p><strong>Chép nguyên vào tệp <code>.tsx</code></strong>, bản không kiểu của hàm này trượt <code>tsc</code> hai lần — <code>TS7006 Parameter 'formData' implicitly has an 'any' type</code> và <code>TS2304 Cannot find name 'db'</code> — sửa xong thì lộ lỗi thứ ba: <code>TS2322 Type 'FormDataEntryValue | null' is not assignable to type 'string'</code>. Một trường form có thể thiếu hoặc là một tệp, nên phải kiểm trước khi ghi (đo ở dưới). Và chỉ thị có đúng một chỗ cấm: viết ngay trong tệp <code>'use client'</code>, <code>next build</code> dừng với <em>"It is not allowed to define inline "use server" annotated Server Actions in Client Components"</em> — đặt những action đó vào tệp <code>'use server'</code> riêng rồi import.</p></div>

<h3>Hai cách gọi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Từ một form</span><span class="v">Truyền nó cho prop <code>action</code> của form: <code>&lt;form action={createPost}&gt;</code>. Khi submit, dữ liệu form tự được gửi tới action — bài sau.</span></div>
  <div class="kv"><span class="k">Từ code client</span><span class="v">Import action vào một Client Component và gọi nó như hàm async bất kỳ (ví dụ trong một <code>onClick</code>). Bên dưới Next.js tự phát một POST giúp bạn — tới <b>chính URL hiện tại</b>, kèm id của action trong header <code>Next-Action</code> (đo thật). Lời gọi từ mã client được xếp hàng: lời gọi sau chỉ gửi khi lời gọi trước đã trả về.</span></div>
</div>

<h3>Vì sao điều này quan trọng</h3>
<p>Không file route, không method/URL phải giữ đồng bộ, không <code>fetch</code> thủ công với header và JSON. Action nằm cùng chỗ với UI dùng nó, và được kiểm kiểu từ đầu tới cuối — tham số bạn truyền là tham số server nhận. Đó là câu trả lời của App Router cho "làm sao đổi dữ liệu", đúng như Server Component trả lời "làm sao đọc dữ liệu".</p>

<div class="callout warn">
<p><strong>Nó không phải phép màu — nó là một cú gọi mạng.</strong> Gọi một Server Action vẫn vượt sang server ở hậu trường. Nên tham số của nó phải serialize được (luật Chương 9, theo chiều ngược lại — đo: một <code>Date</code> tới nơi vẫn là <code>Date</code>; một hàm chỉ tới dưới dạng tham chiếu mờ và action lỗi 500), nó bất đồng bộ, và — quan trọng nhất — nó là một endpoint thật, tới được, mà bạn phải bảo vệ. Bài 12.5 dành trọn cho điều đó.</p>
</div>

<h3>Chuyện gì xảy ra khi bạn gọi một Server Action</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Bạn đánh dấu một hàm <code>&#39;use server&#39;</code></b> — Hoặc ở đầu hàm, hoặc ở đầu một file chỉ export các action.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React gửi một tham chiếu, không gửi mã</b> — Trình duyệt chỉ nhận một id: nằm trong gói JS với action được mã client import, nằm trong HTML của trang (một ô ẩn <code>$ACTION_ID_…</code>) với action viết trong form của Server Component; action xuất ra mà không ai dùng thì không có id nào. Thân hàm ở lại máy chủ (đo: 0 tệp trong <code>.next/static</code>), nên nó truy vấn được cơ sở dữ liệu và đọc được bí mật.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Gọi nó là tạo ra một POST</b> — Tới chính route hiện tại, kèm header <code>Next-Action</code>, trả về dạng luồng RSC (<code>text/x-component</code>), do framework xử lý. Bạn chẳng phải viết một phép fetch, một URL, hay một thân JSON nào.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó làm mới được trước khi trả về</b> — <code>revalidatePath(&#39;/notes&#39;)</code> ngay trong hàm đó vô hiệu hoá cả lớp đệm phía máy chủ lẫn router cache phía client.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — coi một Server Action là riêng tư chỉ vì nó không phải một route API.</strong> Nó LÀ một endpoint HTTP công khai. Cái id nằm trong HTML của trang hoặc gói phía client, nên ai cũng gọi thẳng action đó được bằng một request tự soạn (đo: một lệnh <code>curl</code> kèm header <code>Next-Action</code> đã chạy action và ghi một hàng) — không cần nút, không cần form, không qua phép kiểm nào của giao diện. Chẳng có gì trong mã trông giống một route, và đó chính là lý do người ta bỏ sót: một action xoá ghi chú nhìn như một lời gọi hàm cục bộ, và đọc lên như mã đáng tin. Mọi action đều cần đúng những phép kiểm mà một route handler cần: người gọi đã xác thực chưa, họ có được phép đụng vào bản ghi này không, và đầu vào có hợp lệ không. Bài 12.5 nói trọn vẹn về chuyện này.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Action và phép ghi</span><span class="lc-sub">Toàn bộ mô hình: khai báo, lời gọi, làm mới và các ghi chú an toàn.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-server" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use server'</span><span class="lc-sub">Bản thân chỉ thị đó, và React bảo đảm gì về cái ranh giới.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một hàm có <code>'use server'</code> và gọi nó từ một Client Component; xác nhận thân hàm chạy trên server.</li>
<li>Log một thứ trong action và xác minh nó hiện ở console server, không phải trình duyệt.</li>
<li>Giải thích cách một action thay cho một API route tự-viết + fetch cho một mutation.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn định nghĩa được một Server Action và giải thích cách nó bỏ một vòng API thủ công.</p></div>

<h3>🔬 Đo thật: trình duyệt nhận gì, request thật, hàng đợi (Next.js 16.4.6 + Chromium)</h3>
<p>Một trang <code>/ghi-chu</code> có action viết ngay trong nó (của bài, đã thêm kiểu), cộng một tệp <code>'use server'</code> xuất bốn hàm, được một component nút phía client import:</p>
<div class="out">$ npx tsc --noEmit   # mã của bài, chép nguyên
ghi-chu/page.tsx(2,27): error TS7006: Parameter 'formData' implicitly has an 'any' type.
ghi-chu/page.tsx(5,9): error TS2304: Cannot find name 'db'.
$ npx tsc --noEmit   # sửa 1: FormData + db
ghi-chu/page.tsx(7,34): error TS2322: Type 'FormDataEntryValue | null' is not assignable to type 'string'.
  Type 'null' is not assignable to type 'string'.</div>
<pre><code class="language-typescript">'use server';
import { db } from '@/lib/db';

const gio = () =&gt; new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');

export async function themTuNut(title: string) {
  console.log(&#96;[action] themTuNut \${gio()} · title = \${title}&#96;);
  const n = await db.note.create({ data: { title } });
  return n.id;
}

export async function cham(lan: number) {
  console.log(&#96;[action] cham #\${lan} BẮT ĐẦU \${gio()}&#96;);
  await new Promise((r) =&gt; setTimeout(r, 1000));
  console.log(&#96;[action] cham #\${lan} XONG    \${gio()}&#96;);
  return lan;
}

export async function nhanGi(x: unknown) {
  console.log('[action] nhanGi nhận:', Object.prototype.toString.call(x), x instanceof Date ? x.toISOString() : String(x));
  return 'ok';
}

export async function khongAiGoi() {
  console.log('[action] không component nào import hàm này');
}</code></pre>
<p><b>Trình duyệt nhận được gì.</b> Các id action trong <code>.next/server/server-reference-manifest.json</code>, rồi tìm một chuỗi trong thân <code>createPost</code> và từng id trong thư mục build:</p>
<div class="out">40796bdc2b83… · $$RSC_SERVER_ACTION_0 · app/ghi-chu/page
408b561d9fd3… · themTuNut · app/ghi-chu/page
40cad8597f63… · cham · app/ghi-chu/page
40cb02493177… · nhanGi · app/ghi-chu/page
thân action trong .next/static (gửi xuống trình duyệt): 0
thân action trong .next/server: 2
$$RSC_SERVER_ACTION_0 · id trong .next/static: 0 tệp
themTuNut · id trong .next/static: 1 tệp
cham · id trong .next/static: 1 tệp
nhanGi · id trong .next/static: 1 tệp
name="$ACTION_ID_40796b…"</div>
<p>Bốn hàm được xuất, ba id (cộng <code>createPost</code> viết trong trang): <code>khongAiGoi</code>, không component nào import, không có id. Thân hàm nằm trong 0 tệp mà trình duyệt tải về.</p>
<p><b>Request thật</b> (Chromium, tab mạng): gửi form, bấm nút gọi <code>themTuNut</code>, bấm "chậm" ba lần cách nhau 60 ms, gửi một <code>Date</code> và một hàm:</p>
<div class="out">form submit   POST /ghi-chu · next-action 40796bdc2b83… · multipart/form-data (_1_title=Bài từ form) → 200 text/x-component
themTuNut()   POST /ghi-chu · next-action 408b561d9fd3… · text/plain;charset=UTF-8 ["từ nút bấm"] → 200 text/x-component
cham(1)      POST sent at 558 ms · answered at 1565 ms
cham(2)      POST sent at 1566 ms · answered at 2574 ms
cham(3)      POST sent at 2574 ms · answered at 3580 ms
nhanGi(Date)  body ["$D2026-11-14T05:00:00.000Z"] → 200
nhanGi(fn)    body ["$T"] → 500</div>
<div class="out">[action] themTuNut 05:19:12.128 · title = curl gọi thẳng, không bấm nút
[action] createPost ở MÁY CHỦ: Bài từ form chuoi-chi-o-may-chu-12-1
[action] themTuNut 05:19:16.242 · title = từ nút bấm
[action] cham #1 BẮT ĐẦU 05:19:19.052
[action] cham #1 XONG    05:19:20.055
[action] cham #2 BẮT ĐẦU 05:19:20.061
[action] cham #2 XONG    05:19:21.063
[action] cham #3 BẮT ĐẦU 05:19:21.068
[action] cham #3 XONG    05:19:22.070
[action] nhanGi nhận: [object Date] 2026-11-14T05:00:00.000Z</div>
<p>Cả hai lời gọi đều là POST tới chính trang. Ba lời gọi chậm không chồng nhau: lời sau rời trình duyệt khi lời trước trả về. Tham số là hàm thì lỗi ở máy chủ: <em>Error: Cannot access toString on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client.</em></p>
<p><b>Một endpoint công khai.</b> Không trình duyệt, không nút — chỉ cần id:</p>
<div class="out">$ ID=&lt;id của themTuNut&gt;; curl -X POST localhost:3000/ghi-chu -H "Next-Action: $ID" -H 'content-type: text/plain' -d '["curl gọi thẳng, không bấm nút"]'
HTTP 200 · text/x-component
:"$@1","q":"","i":false,"b":"A15lGcm2KxiP7YuS2YxJF"}
1:1010</div>
<p><b>Id là sản phẩm của build</b> — giữ nguyên khi build lại mà còn <code>.next</code>, đổi hết khi xoá nó, dù mã y nguyên. Đừng bao giờ ghi cứng:</p>
<div class="out">build 1: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177
build 2: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177
id GIỐNG nhau
trước: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177
sau:   40497f3e5569 40c0233e0650 40f4c1c18ed8 40f570838177
id KHÁC nhau</div>
<p><b><code>'use server'</code> viết ngay trong tệp <code>'use client'</code>:</b></p>
<div class="out">./src/app/ghi-chu/Sai.tsx:5:5
Error: It is not allowed to define inline "use server" annotated Server Actions in Client Components.
To use Server Actions in a Client Component, you can either export them from a separate file with "use server" at the top, or pass them down through props from a Server Component.</div>
<div class="note-ct"><p><strong>cuongthai.com không có Server Action nào</strong> (đo: 0 tệp chứa <code>'use server'</code> trong <code>frontend/src</code>). Mọi lần ghi đi tới một API Express riêng (<code>/api/v1</code>) dùng chung cho web, ứng dụng máy tính và CLI, nên một hàm chỉ của Next.js chỉ phục vụ một trong ba bên; làm mới cache đi qua đúng một Route Handler, <code>/api/revalidate</code>. Server Action hợp khi cơ sở dữ liệu thuộc về chính ứng dụng Next.js và form là của bạn.</p></div>
<div class="out">tệp có 'use server' trong frontend/src: 0
app/api/revalidate/route.ts:19:import { revalidatePath, revalidateTag } from 'next/cache';
app/api/revalidate/route.ts:75:      revalidatePath(path);
app/api/revalidate/route.ts:82:      revalidateTag(tag);</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
node -e "console.log(Object.keys(require('./.next/server/server-reference-manifest.json').node))" <span class="tok-comment">  # các id action</span>
grep -rl '&lt;một chuỗi trong action của bạn&gt;' .next/static | wc -l <span class="tok-comment">  # mong đợi 0</span>
curl -X POST localhost:3000/&lt;trang của bạn&gt; -H "Next-Action: $ID" -H 'content-type: text/plain;charset=UTF-8' -d '["x"]'</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-1-tai-nguyen-phuong-thuc" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.1 — Tài nguyên, phương thức, và REST</span><span class="lc-sub">POST và phương thức HTTP từ gốc — thứ action thật sự gửi đi</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-3-dau-vao-doc-hai" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 9.3 — Đầu vào độc hại</span><span class="lc-sub">Mọi tham số của action do người gọi chọn — kiểm như mọi endpoint</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-4-props-serialize" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.4 — Qua ranh giới: props phải serialize được</span><span class="lc-sub">Luật đóng gói theo chiều máy chủ → trình duyệt</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server Action</span><span class="v">Một hàm server gọi từ client qua <code>'use server'</code>.</span></div>
  <div class="kv"><span class="k">'use server'</span><span class="v">Đánh dấu một hàm (hoặc file) là server action.</span></div>
  <div class="kv"><span class="k">Mutation</span><span class="v">Một thao tác ghi (tạo/sửa/xoá) kích từ UI.</span></div>
  <div class="kv"><span class="k">Không API route</span><span class="v">Action thay cho fetch + endpoint tự viết cho thao tác ghi.</span></div>
  <div class="kv"><span class="k">Cảm giác RPC</span><span class="v">Gọi một hàm server như thể nó là cục bộ.</span></div>
  <div class="kv"><span class="k">Chạy trên server</span><span class="v">Thân hàm chạy trên server với toàn quyền truy cập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một Server Action là một hàm server bạn gọi từ client, đánh dấu bằng <code>'use server'</code>.</li><li>Nó chạy trên server với toàn quyền truy cập database và secret.</li><li>Action thay cho một API route + fetch tự viết cho mutation.</li><li>Chúng giống như gọi một hàm cục bộ nhưng thực thi phía server.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions and Mutations</span><span class="lc-sub">Mô hình đầy đủ: 'use server', form, gọi từ client, và revalidate.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/server-functions" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Server Functions</span><span class="lc-sub">Nguyên thuỷ ở tầng React đứng sau Server Actions.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Forms that submit to a Server Action|||12.2 — Form gửi tới một Server Action',
      slug: 'nextjs-12-2-form-action',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Truyền action cho <form action={fn}>: dữ liệu form thành FormData gửi thẳng tới server. Đọc bằng formData.get, và điểm hay: form chạy được cả khi JS chưa tải (progressive enhancement).',
      content: `
${G12_2}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Wire a form straight to the server</h2>
<p class="lead">The cleanest way to use a Server Action is through a form. Pass the action to the form's <code>action</code> prop; on submit, the browser packages the fields into a <code>FormData</code> and the action receives it on the server. No <code>onSubmit</code>, no state, no fetch.</p>

<pre><code class="language-typescript"><span class="tok-comment">// app/posts/new/page.tsx — a Server Component</span>
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default function NewPost() {
  async function createPost(formData: FormData) {
    'use server';
    const title = formData.get('title');       <span class="tok-comment">// read by input name</span>
    const body  = formData.get('body');
    if (typeof title !== 'string' || typeof body !== 'string') return;   <span class="tok-comment">// both may be null or a File</span>
    await db.post.create({ data: { title, body } });
    redirect('/posts');                        <span class="tok-comment">// go to the list after</span>
  }

  return (
    &lt;form action={createPost}&gt;
      &lt;input name="title" /&gt;
      &lt;textarea name="body" /&gt;
      &lt;button type="submit"&gt;Publish&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>You read each field by its input <code>name</code> via <code>formData.get('name')</code>. After a successful write, <code>redirect()</code> (from <code>next/navigation</code>) sends the user onward. This whole page is a Server Component — the form needs no <code>'use client'</code>.</p>
<div class="callout warn"><p><strong>Copied as first written</strong> (an untyped <code>formData</code>, no imports) the page fails <code>tsc</code> three times: <code>TS7006</code> for <code>formData</code> and <code>TS2304 Cannot find name</code> for both <code>db</code> and <code>redirect</code> (measured). The version above types the parameter, imports <code>redirect</code> from <code>next/navigation</code>, and checks both fields are strings before writing — <code>formData.get()</code> returns <code>FormDataEntryValue | null</code> (Lesson 12.1).</p></div>

<h3>Progressive enhancement: it works before JS loads</h3>
<p>Because the action is attached to a real <code>&lt;form&gt;</code>, the browser can submit it the native way even if JavaScript has not loaded or is disabled. When JS is present, Next.js enhances the submit into a smooth client transition; when it is not, the plain HTML form still posts and works. You get resilience for free — something a hand-written <code>onClick</code>+<code>fetch</code> never gives you. (Measured in Chromium: with JS the submit is one <code>fetch</code> POST answered with an RSC stream, the URL becomes <code>/posts</code> and the page is never reloaded; with JS disabled it is a document POST answered <b>303 See Other</b>, followed by a full GET of <code>/posts</code>. Both rows were saved.)</p>

<div class="callout ok">
<p><strong>Passing extra arguments:</strong> to give an action data that is not a form field — say the id of the item being edited — use <code>bind</code>: <code>action={updatePost.bind(null, post.id)}</code>. The bound value arrives as the first argument, with <code>formData</code> after it. <b>It does not hide the id</b>, though (measured): the page HTML carries it in a plain hidden input — <code>$ACTION_n:1 = "[12]"</code> — and resending the form of note 12 with <code>[13]</code> made the action update note 13. A closure (an inline action that uses a variable from the page) is encrypted instead: changing one character gave a 500 (<em>Cipher job failed</em>), but the untouched blob can still be replayed. Either way the id is a hint, not proof — check inside the action that this user may change this record (Lesson 12.5).</p>
</div>

<h3>A form that works without JavaScript</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Pass the action to the form</b> — <code>&lt;form action={createNote}&gt;</code>. No <code>onSubmit</code>, no <code>preventDefault</code>, no fetch.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The action receives FormData</b> — <code>formData.get(&#39;title&#39;)</code>. Every field with a <code>name</code> is included — the same rule as a plain HTML form.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It works before hydration</b> — If the JavaScript has not loaded yet, the browser does a normal form POST and the action still runs. This is progressive enhancement, for free.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Everything is a string</b> — <code>FormData</code> values are text. A number, a boolean or a date needs converting and validating — chapter 16 does this with Zod.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — an input with no <code>name</code>, silently missing from the submission.</strong> <code>&lt;input value={title} onChange={…} /&gt;</code> is a perfectly good controlled input and contributes nothing to <code>FormData</code>: only named fields are collected. So the action receives <code>null</code> for the title, and your validation reports &quot;title is required&quot; for a form that visibly contains one — which sends people looking at the validation code. The same applies to a checkbox, where an unchecked box is absent entirely rather than <code>false</code>. When a form action gets nothing, check the <code>name</code> attributes before anything else; it is the fastest thing to rule out.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — form</span><span class="lc-sub">The action prop, FormData, and the pending states it enables.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">How fields are collected, including the checkbox and multi-select cases.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Wire a <code>&lt;form action={serverAction}&gt;</code> that reads fields from <code>FormData</code> and writes to the database.</li>
<li>Disable JavaScript and confirm the form still submits (progressive enhancement).</li>
<li>Read one field with <code>formData.get('name')</code> and validate it on the server.</li>
</ol>
<p><strong>Done when:</strong> you can submit a form directly to a Server Action and read FormData on the server.</p></div>

<h3>🔬 Measured: the HTML, FormData, JS on vs off, and a bound id (Next.js 16.4.6 + Chromium)</h3>
<p>The lesson's page copied as written, then fixed (typed, imports, checks):</p>
<div class="out">$ npx tsc --noEmit
posts/new/page.tsx(3,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.
posts/new/page.tsx(7,11): error TS2304: Cannot find name 'db'.
posts/new/page.tsx(8,5): error TS2304: Cannot find name 'redirect'.
$ npm run build
├ ƒ /posts
├ ƒ /posts/[id]/sua
├ ○ /posts/new
└ ○ /truong</div>
<p><b>Before any JavaScript</b> — the server's HTML for the static form page:</p>
<div class="out">&lt;form action="" encType="multipart/form-data" method="POST"&gt;
&lt;input type="hidden" name="$ACTION_ID_4010ec…"/&gt;
&lt;input placeholder="tiêu đề" name="title"/&gt;
&lt;textarea name="body" placeholder="nội dung"&gt;</div>
<p><b>What FormData holds</b> — a form with a text input, an input with no <code>name</code>, a number, an unticked checkbox and a select; the action logs every entry:</p>
<div class="out">[truong] title = "Bài A" string
[truong] tuoi = "5" string
[truong] muc = "2" string
[truong] get(dongY) = null · get(ghiChu) = null</div>
<p><b>The same form with JS on and off</b> (Chromium network tab), and the no-JS submit replayed with curl:</p>
<div class="out">JS on   fetch POST /posts/new → 200 text/x-component · then URL /posts, window.__giu still 42, navigation entries 1
JS off  document GET /posts/new → 200
JS off  document POST /posts/new → 303
JS off  document GET /posts → 200</div>
<div class="out">$ ID=&lt;id trong ô ẩn $ACTION_ID_&gt;; curl -i -X POST localhost:3000/posts/new -F "\\$ACTION_ID_$ID=" -F title='Bài từ curl' -F body=x      # đúng thứ trình duyệt TẮT JS gửi
HTTP/1.1 303 See Other
Location: /posts
#1015 Bài từ curl
#1014 Bài TẮT JS
#1013 Bài có JS</div>
<p><b>Is a bound id hidden?</b> The edit page of note 12, its hidden inputs, the bound id changed to 13, and the closure blob replayed and altered:</p>
<div class="out">$ curl -s localhost:3000/posts/12/sua | grep -oE '&lt;input type="hidden"[^&gt;]*&gt;'      # form .bind và form closure, HTML máy chủ
&lt;form id="bind"&gt;
&lt;input type="hidden" name="$ACTION_REF_2"/&gt;
&lt;input type="hidden" name="$ACTION_2:0" value="{"id":"60d158…","bound":"$@1"}"/&gt;
&lt;input type="hidden" name="$ACTION_2:1" value="[12]"/&gt;
&lt;form id="closure"&gt;
&lt;input type="hidden" name="$ACTION_REF_3"/&gt;
&lt;input type="hidden" name="$ACTION_3:0" value="{"id":"60ee61…","bound":"$@1"}"/&gt;
&lt;input type="hidden" name="$ACTION_3:1" value="["$@2"]"/&gt;
&lt;input type="hidden" name="$ACTION_3:2" value=""XmNABhrmgMS0U4PR…""/&gt;
$ node -e 'note 12, note 13 trước'
#12 Ghi chú số 12 · #13 Ghi chú số 13
$ curl -X POST localhost:3000/posts/12/sua   # gửi lại ĐÚNG form .bind của note 12, chỉ đổi ô ẩn "[12]" thành "[13]"
HTTP 200
$ node -e 'note 12, note 13 sau'
#12 Ghi chú số 12 · #13 bị sửa trộm qua bind
$ curl -X POST localhost:3000/posts/12/sua   # form closure: gửi lại nguyên khối mã hoá, rồi sửa 1 ký tự của nó
HTTP 200   ← khối nguyên
HTTP 500   ← khối bị sửa 1 ký tự</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/posts/new | grep -oE '&lt;(form|input)[^&gt;]*&gt;'    <span class="tok-comment">  # the POST form + $ACTION_ID_</span>
ID=&lt;the id after $ACTION_ID_&gt;
curl -i -X POST localhost:3000/posts/new -F "\\$ACTION_ID_$ID=" -F title=x -F body=y <span class="tok-comment">  # 303</span>
curl -s localhost:3000/posts/12/sua | grep -oE '&lt;input type="hidden"[^&gt;]*&gt;' <span class="tok-comment">  # the bound [12]</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-4-3-form-thật" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 4.3 — A real form: many fields, one submit</span><span class="lc-sub">The old way: onSubmit + state — compare with a form action</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-3-validate-schema" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.3 — Validation with a schema</span><span class="lc-sub">Check every FormData field on the server</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">form action</span><span class="v">Pass a Server Action to a form's <code>action</code> prop.</span></div>
  <div class="kv"><span class="k">FormData</span><span class="v">The form fields the action receives on the server.</span></div>
  <div class="kv"><span class="k">Progressive enhancement</span><span class="v">The form works even without client JavaScript.</span></div>
  <div class="kv"><span class="k">formData.get</span><span class="v">Read a single field value by name.</span></div>
  <div class="kv"><span class="k">No onSubmit needed</span><span class="v">The action runs on submit without a client handler.</span></div>
  <div class="kv"><span class="k">Server validation</span><span class="v">Validate inside the action, never trust the client.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Pass a Server Action to <code>&lt;form action={...}&gt;</code> and the action runs on submit with the form's <code>FormData</code>.</li><li>This works even without client JavaScript — progressive enhancement by default.</li><li>Read fields with <code>formData.get(name)</code> and validate on the server.</li><li>No client <code>onSubmit</code> or fetch is needed for the basic case.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions with forms</span><span class="lc-sub">The action prop, FormData, bind for extra args, and redirect.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Nối một form thẳng tới server</h2>
<p class="lead">Cách gọn nhất để dùng một Server Action là qua một form. Truyền action cho prop <code>action</code> của form; khi submit, trình duyệt gói các trường thành một <code>FormData</code> và action nhận nó trên server. Không <code>onSubmit</code>, không state, không fetch.</p>

<pre><code class="language-typescript"><span class="tok-comment">// app/posts/new/page.tsx — một Server Component</span>
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default function NewPost() {
  async function createPost(formData: FormData) {
    'use server';
    const title = formData.get('title');       <span class="tok-comment">// đọc theo name của input</span>
    const body  = formData.get('body');
    if (typeof title !== 'string' || typeof body !== 'string') return;   <span class="tok-comment">// cả hai có thể là null hoặc File</span>
    await db.post.create({ data: { title, body } });
    redirect('/posts');                        <span class="tok-comment">// sang danh sách sau đó</span>
  }

  return (
    &lt;form action={createPost}&gt;
      &lt;input name="title" /&gt;
      &lt;textarea name="body" /&gt;
      &lt;button type="submit"&gt;Đăng&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Bạn đọc từng trường theo <code>name</code> của input qua <code>formData.get('name')</code>. Sau khi ghi thành công, <code>redirect()</code> (từ <code>next/navigation</code>) đưa người dùng đi tiếp. Cả trang này là một Server Component — form không cần <code>'use client'</code>.</p>
<div class="callout warn"><p><strong>Chép đúng bản đầu</strong> (<code>formData</code> không kiểu, không import) thì trang trượt <code>tsc</code> ba lần: <code>TS7006</code> cho <code>formData</code> và <code>TS2304 Cannot find name</code> cho cả <code>db</code> lẫn <code>redirect</code> (đo thật). Bản ở trên khai kiểu tham số, import <code>redirect</code> từ <code>next/navigation</code>, và kiểm cả hai trường là chuỗi trước khi ghi — <code>formData.get()</code> trả về <code>FormDataEntryValue | null</code> (Bài 12.1).</p></div>

<h3>Progressive enhancement: chạy cả trước khi JS tải</h3>
<p>Vì action gắn vào một <code>&lt;form&gt;</code> thật, trình duyệt có thể submit nó theo cách gốc kể cả khi JavaScript chưa tải hoặc bị tắt. Khi có JS, Next.js nâng cú submit thành một chuyển cảnh client mượt; khi không, form HTML thuần vẫn post và chạy. Bạn được sự bền bỉ miễn phí — thứ mà một <code>onClick</code>+<code>fetch</code> viết tay không bao giờ cho. (Đo trong Chromium: có JS thì cú gửi là một <code>fetch</code> POST nhận về luồng RSC, URL thành <code>/posts</code> và trang không hề tải lại; tắt JS thì là một POST tài liệu nhận <b>303 See Other</b>, rồi trình duyệt GET <code>/posts</code> như một trang mới. Cả hai bài đều được lưu.)</p>

<div class="callout ok">
<p><strong>Truyền tham số thêm:</strong> để đưa cho action dữ liệu không phải trường form — ví dụ id của mục đang sửa — dùng <code>bind</code>: <code>action={updatePost.bind(null, post.id)}</code>. Giá trị bind tới làm tham số đầu tiên, còn <code>formData</code> sau nó. <b>Nhưng nó không giấu id</b> (đo thật): HTML của trang chở id trong một ô ẩn chữ thường — <code>$ACTION_n:1 = "[12]"</code> — và gửi lại form của ghi chú 12 với <code>[13]</code> đã khiến action sửa ghi chú 13. Closure (một action viết ngay trong trang, dùng biến của trang) thì được mã hoá: sửa một ký tự là lỗi 500 (<em>Cipher job failed</em>), nhưng khối nguyên vẫn gửi lại được. Dù cách nào, id chỉ là gợi ý chứ không phải bằng chứng — hãy kiểm trong action rằng người dùng này được sửa bản ghi này (Bài 12.5).</p>
</div>

<h3>Một form chạy được cả khi không có JavaScript</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Truyền action vào thẻ form</b> — <code>&lt;form action={createNote}&gt;</code>. Không <code>onSubmit</code>, không <code>preventDefault</code>, không fetch.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Action nhận vào FormData</b> — <code>formData.get(&#39;title&#39;)</code>. Mọi trường có <code>name</code> đều được gom — cùng luật với một form HTML thuần.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó chạy được trước khi hydrate</b> — Nếu JavaScript chưa tải xong, trình duyệt gửi một POST form bình thường và action vẫn chạy. Đây là cải tiến tiệm tiến, miễn phí.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Mọi thứ đều là chuỗi</b> — Giá trị trong <code>FormData</code> là chữ. Một con số, một boolean hay một ngày đều cần chuyển đổi và kiểm — chương 16 làm việc này bằng Zod.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một ô nhập thiếu <code>name</code>, vắng mặt lặng lẽ khỏi phép gửi.</strong> <code>&lt;input value={title} onChange={…} /&gt;</code> là một ô nhập có kiểm soát hoàn toàn ổn và nó đóng góp con số không vào <code>FormData</code>: chỉ những trường có tên mới được gom. Nên action nhận <code>null</code> cho tiêu đề, và phần kiểm dữ liệu của bạn báo &quot;thiếu title&quot; cho một form rành rành có tiêu đề — khiến người ta đi soi đoạn mã kiểm dữ liệu. Chuyện tương tự với một ô tích, nơi một ô chưa tích thì VẮNG HẲN chứ không phải là <code>false</code>. Khi một form action chẳng nhận được gì, hãy kiểm các thuộc tính <code>name</code> trước tiên; đó là thứ loại trừ nhanh nhất.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — form</span><span class="lc-sub">Prop action, FormData, và các trạng thái đang-gửi mà nó mở ra.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">Các trường được gom thế nào, gồm cả trường hợp ô tích và chọn nhiều.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Nối một <code>&lt;form action={serverAction}&gt;</code> đọc các trường từ <code>FormData</code> và ghi vào database.</li>
<li>Tắt JavaScript và xác nhận form vẫn submit (progressive enhancement).</li>
<li>Đọc một trường bằng <code>formData.get('name')</code> và validate nó trên server.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn submit được một form thẳng tới Server Action và đọc FormData trên server.</p></div>

<h3>🔬 Đo thật: HTML, FormData, bật và tắt JS, và id truyền bằng bind (Next.js 16.4.6 + Chromium)</h3>
<p>Trang của bài chép nguyên, rồi sửa (kiểu, import, kiểm):</p>
<div class="out">$ npx tsc --noEmit
posts/new/page.tsx(3,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.
posts/new/page.tsx(7,11): error TS2304: Cannot find name 'db'.
posts/new/page.tsx(8,5): error TS2304: Cannot find name 'redirect'.
$ npm run build
├ ƒ /posts
├ ƒ /posts/[id]/sua
├ ○ /posts/new
└ ○ /truong</div>
<p><b>Trước khi có JavaScript</b> — HTML máy chủ của trang form tĩnh:</p>
<div class="out">&lt;form action="" encType="multipart/form-data" method="POST"&gt;
&lt;input type="hidden" name="$ACTION_ID_4010ec…"/&gt;
&lt;input placeholder="tiêu đề" name="title"/&gt;
&lt;textarea name="body" placeholder="nội dung"&gt;</div>
<p><b>FormData chứa gì</b> — một form có ô chữ, một ô không có <code>name</code>, ô số, ô đánh dấu không tích và ô chọn; action in từng dòng:</p>
<div class="out">[truong] title = "Bài A" string
[truong] tuoi = "5" string
[truong] muc = "2" string
[truong] get(dongY) = null · get(ghiChu) = null</div>
<p><b>Cùng form khi bật và tắt JS</b> (tab mạng Chromium), và cú gửi không JS dựng lại bằng curl:</p>
<div class="out">JS on   fetch POST /posts/new → 200 text/x-component · then URL /posts, window.__giu still 42, navigation entries 1
JS off  document GET /posts/new → 200
JS off  document POST /posts/new → 303
JS off  document GET /posts → 200</div>
<div class="out">$ ID=&lt;id trong ô ẩn $ACTION_ID_&gt;; curl -i -X POST localhost:3000/posts/new -F "\\$ACTION_ID_$ID=" -F title='Bài từ curl' -F body=x      # đúng thứ trình duyệt TẮT JS gửi
HTTP/1.1 303 See Other
Location: /posts
#1015 Bài từ curl
#1014 Bài TẮT JS
#1013 Bài có JS</div>
<p><b>Id truyền bằng bind có bị giấu không?</b> Trang sửa ghi chú 12, các ô ẩn của nó, id bind đổi thành 13, và khối closure gửi lại nguyên rồi bị sửa:</p>
<div class="out">$ curl -s localhost:3000/posts/12/sua | grep -oE '&lt;input type="hidden"[^&gt;]*&gt;'      # form .bind và form closure, HTML máy chủ
&lt;form id="bind"&gt;
&lt;input type="hidden" name="$ACTION_REF_2"/&gt;
&lt;input type="hidden" name="$ACTION_2:0" value="{"id":"60d158…","bound":"$@1"}"/&gt;
&lt;input type="hidden" name="$ACTION_2:1" value="[12]"/&gt;
&lt;form id="closure"&gt;
&lt;input type="hidden" name="$ACTION_REF_3"/&gt;
&lt;input type="hidden" name="$ACTION_3:0" value="{"id":"60ee61…","bound":"$@1"}"/&gt;
&lt;input type="hidden" name="$ACTION_3:1" value="["$@2"]"/&gt;
&lt;input type="hidden" name="$ACTION_3:2" value=""XmNABhrmgMS0U4PR…""/&gt;
$ node -e 'note 12, note 13 trước'
#12 Ghi chú số 12 · #13 Ghi chú số 13
$ curl -X POST localhost:3000/posts/12/sua   # gửi lại ĐÚNG form .bind của note 12, chỉ đổi ô ẩn "[12]" thành "[13]"
HTTP 200
$ node -e 'note 12, note 13 sau'
#12 Ghi chú số 12 · #13 bị sửa trộm qua bind
$ curl -X POST localhost:3000/posts/12/sua   # form closure: gửi lại nguyên khối mã hoá, rồi sửa 1 ký tự của nó
HTTP 200   ← khối nguyên
HTTP 500   ← khối bị sửa 1 ký tự</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
curl -s localhost:3000/posts/new | grep -oE '&lt;(form|input)[^&gt;]*&gt;'    <span class="tok-comment">  # form POST + $ACTION_ID_</span>
ID=&lt;id sau $ACTION_ID_&gt;
curl -i -X POST localhost:3000/posts/new -F "\\$ACTION_ID_$ID=" -F title=x -F body=y <span class="tok-comment">  # 303</span>
curl -s localhost:3000/posts/12/sua | grep -oE '&lt;input type="hidden"[^&gt;]*&gt;' <span class="tok-comment">  # id bind [12]</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-4-3-form-thật" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 4.3 — Form thật: nhiều trường, một lần gửi</span><span class="lc-sub">Cách cũ: onSubmit + state — để so với form action</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-3-validate-schema" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.3 — Kiểm tra dữ liệu bằng lược đồ</span><span class="lc-sub">Kiểm từng trường FormData ở máy chủ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">form action</span><span class="v">Truyền một Server Action vào prop <code>action</code> của form.</span></div>
  <div class="kv"><span class="k">FormData</span><span class="v">Các trường form mà action nhận trên server.</span></div>
  <div class="kv"><span class="k">Progressive enhancement</span><span class="v">Form chạy được kể cả khi không có JS client.</span></div>
  <div class="kv"><span class="k">formData.get</span><span class="v">Đọc giá trị một trường theo tên.</span></div>
  <div class="kv"><span class="k">Không cần onSubmit</span><span class="v">Action chạy khi submit mà không cần handler client.</span></div>
  <div class="kv"><span class="k">Validate trên server</span><span class="v">Validate trong action, không bao giờ tin client.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Truyền một Server Action vào <code>&lt;form action={...}&gt;</code> và action chạy khi submit với <code>FormData</code> của form.</li><li>Cách này chạy được kể cả không có JS client — progressive enhancement mặc định.</li><li>Đọc các trường bằng <code>formData.get(tên)</code> và validate trên server.</li><li>Không cần <code>onSubmit</code> client hay fetch cho trường hợp cơ bản.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions với form</span><span class="lc-sub">Prop action, FormData, bind cho tham số thêm, và redirect.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — After the write: revalidate the cache|||12.3 — Sau khi ghi: revalidate cache',
      slug: 'nextjs-12-3-revalidate-sau-ghi',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Ghi xong dữ liệu nhưng trang vẫn hiện cũ, vì cache của Chương 10 còn đó. Sau mỗi mutation, gọi revalidatePath/revalidateTag để Next làm mới đúng phần bị ảnh hưởng. Đây là nửa còn lại của vòng ghi.',
      content: `
${G12_3}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>A write is only half done until the cache knows</h2>
<p class="lead">You create a post in a Server Action, redirect to the list — and the new post is missing. Nothing failed: the list was cached (Chapter 10), and your write did not tell the cache to let go. The mutation and the revalidation are two halves of one cycle.</p>

<pre><code class="language-typescript">import { revalidatePath, revalidateTag, updateTag } from 'next/cache';

async function createPost(formData: FormData) {
  'use server';
  const title = formData.get('title');
  if (typeof title !== 'string') return;
  await db.post.create({ data: { title } });

  revalidatePath('/posts');     <span class="tok-comment">// the list route is now stale → refetch</span>
  <span class="tok-comment">// or, if the fetch was tagged:</span>
  revalidateTag('posts', 'max'); <span class="tok-comment">// every fetch tagged 'posts' is stale (Next.js 16: 2 arguments)</span>
  <span class="tok-comment">// or, to show the user their own write right away:</span>
  updateTag('posts');            <span class="tok-comment">// Server Actions only</span>
}</code></pre>
<div class="callout warn"><p><strong>Next.js 16:</strong> the one-argument <code>revalidateTag('posts')</code> is a type error — <code>TS2554 Expected 2 arguments, but got 1</code> (measured). The second argument is a cache profile; <code>'max'</code> means stale-while-revalidate, so the <b>next</b> visitor may still get the old data once. Inside an action, <code>updateTag(tag)</code> refetches before answering (measured below).</p></div>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">The action writes to the database.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">It calls <code>revalidatePath</code>/<code>revalidateTag</code> to mark the affected data stale.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Next re-fetches on the next render, and the UI shows the new state — no manual client update. (With <code>revalidateTag(tag, 'max')</code> that next render may still be the old copy — measured: 3 courses right after the redirect, 4 on the following reload; <code>updateTag</code> showed the new list at once.)</div></div>
</div>

<div class="kv-grid">
  <div class="kv"><span class="k">revalidatePath('/posts')</span><span class="v">Invalidate a specific route's cached data. Simple and direct when you know the URL affected.</span></div>
  <div class="kv"><span class="k">revalidateTag('posts', 'max')</span><span class="v">Invalidate every fetch you tagged <code>'posts'</code>, wherever it lives. Better when the same data feeds several pages.</span></div>
</div>

<div class="callout ok">
<p><strong>Contrast with a classic SPA:</strong> there you would manually update local state after the write, or refetch and setState, and keep client and server in sync by hand. Here the source of truth is the server cache; you invalidate it and let the framework re-render. Fewer places for the two to drift apart.</p>
</div>

<h3>Making the screen match the database after a write</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Write, then revalidate, then return</b> — <code>await db.note.create(...)</code>, <code>revalidatePath(&#39;/notes&#39;)</code>, and the list re-renders with the new row.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>revalidatePath for a URL</b> — Clears the cached render of that path. Use the route pattern for dynamic segments: <code>revalidatePath(&#39;/notes/[id]&#39;, &#39;page&#39;)</code>.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>revalidateTag for a set of fetches</b> — Tag them at fetch time (<code>next: { tags: [&#39;notes&#39;] }</code>) and clear them all by name — better when the same data appears on several routes.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>redirect() after a create</b> — Called at the end of the action. It throws, so nothing after it runs — and a surrounding <code>try/catch</code> catches it (measured: <code>NEXT_REDIRECT</code> caught, no navigation). Keep it after the <code>try/catch</code>.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a write that succeeds while the list keeps showing the old data.</strong> The row is in the database, the action returned without error, and the page still shows the previous state — because nothing invalidated the cache for that route. It reads as a database problem and it is a cache one, which is why people go looking in the wrong place. The rule is simple: any action that changes data must revalidate what displays it. When the same records appear on three routes, tag the fetches and revalidate the tag instead of listing every path — a path you forget is a screen that stays stale, and nothing will tell you.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/revalidateTag" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — revalidateTag</span><span class="lc-sub">Tagging fetches and clearing them by name, with the multi-route case.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/redirect" target="_blank" rel="noopener">
  <span class="lc-ico">↪️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — redirect()</span><span class="lc-sub">Where it may be called, why it throws, and how it interacts with try/catch.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>After an action writes, call <code>revalidatePath('/list')</code> and confirm the list updates immediately.</li>
<li>Remove the revalidate call and watch the UI show stale data until a hard reload.</li>
<li>Use <code>redirect()</code> from an action after a successful create.</li>
</ol>
<p><strong>Done when:</strong> you can revalidate the cache after a mutation so the UI reflects the write.</p></div>

<h3>🔬 Measured: no revalidate, revalidatePath, max vs updateTag, redirect in try (Next.js 16.4.6)</h3>
<p>The lesson's code copied into a <code>.ts</code> file:</p>
<div class="out">$ npx tsc --noEmit
bai12-3/actions.ts(5,27): error TS7006: Parameter 'formData' implicitly has an 'any' type.
bai12-3/actions.ts(7,9): error TS2304: Cannot find name 'db'.
bai12-3/actions.ts(11,3): error TS2554: Expected 2 arguments, but got 1.</div>
<p>Two static pages that list notes and add one through an action — <code>/ds/khong</code> only redirects, <code>/ds/path</code> calls <code>revalidatePath</code> first:</p>
<pre><code class="language-typescript">import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function Trang() {
  const notes = await db.note.findMany({ orderBy: { id: 'desc' }, take: 3 });
  async function them(formData: FormData) {
    'use server';
    const title = formData.get('title');
    if (typeof title !== 'string' || !title.trim()) return;
    await db.note.create({ data: { title } });
    revalidatePath('/ds/path'); <span class="tok-comment">  // trang danh sách đã cũ ⇒ dựng lại</span>
    redirect('/ds/path');
  }
  return (
    &lt;main className="p-4 text-xl"&gt;
      &lt;p id="gio"&gt;dựng lúc {new Date().toTimeString().slice(0, 8)}&lt;/p&gt;
      &lt;form action={them} className="flex gap-2"&gt;&lt;input name="title" className="border px-2" /&gt;&lt;button className="border px-3"&gt;Thêm&lt;/button&gt;&lt;/form&gt;
      &lt;ul id="ds"&gt;{notes.map((n) =&gt; &lt;li key={n.id}&gt;#{n.id} {n.title}&lt;/li&gt;)}&lt;/ul&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ npm run build
├ ○ /ds/bat
├ ○ /ds/khong
├ ○ /ds/path
├ ○ /khoa
└ ○ /khoa2
$ curl /ds/khong · /ds/path — trước khi ghi (giờ dựng + 3 dòng đầu)
/ds/khong · dựng lúc 05:47:28 · #13 Ghi chú số 13
/ds/path · dựng lúc 05:47:28 · #13 Ghi chú số 13
# Chromium: add on /ds/khong → dựng lúc 05:47:28 · #13 Ghi chú số 13
# Chromium: add on /ds/path  → dựng lúc 05:47:38 · #1020 Ghi chú CÓ revalidatePath
$ node -e 'đếm ghi chú trong CSDL' ; curl /ds/khong · /ds/path (tải lại sau khi ghi)
CSDL · ghi chú mới nhất: #1021 redirect trong try
$ for p in khong path; do echo "/ds/$p · $(curl -s localhost:19392/ds/$p | grep -oE 'dựng lúc[^&lt;]*(&lt;!-- --&gt;[^&lt;]*)*' | head -1 | sed 's/&lt;!-- --&gt;//g') · $(curl -s localhost:19392/ds/$p | grep -oE '&lt;li&gt;[^&lt;]*(&lt;!-- --&gt;[^&lt;]*)*&lt;/li&gt;' | head -1 | sed 's/&lt;!-- --&gt;//g; s/&lt;[^&gt;]*&gt;//g')"; done
/ds/khong · dựng lúc 05:47:28 · #13 Ghi chú số 13
/ds/path · dựng lúc 05:47:38 · #1020 Ghi chú CÓ revalidatePath</div>
<p>Without revalidation the database had the row while the page — and every reload — kept the build-time copy. With <code>revalidatePath</code> the redirect landed on a freshly rendered page.</p>
<p><b>Tags in Next.js 16.</b> Two pages fetch the course list with different tags; each action adds a course, then <code>revalidateTag(tag, 'max')</code> or <code>updateTag(tag)</code>, then redirects:</p>
<div class="out"># Chromium: add on /khoa  (revalidateTag 'max') → 3 khoá: Next.js, Node.js, React
# Chromium: add on /khoa2 (updateTag)          → 5 khoá: Next.js, Node.js, React, Docker, Redis
$ curl /khoa · /khoa2 (tải lại sau khi ghi) — hai lần cách 1 giây
lần 1 /khoa · 4 khoá: Next.js, Node.js, React, Docker
lần 1 /khoa2 · 5 khoá: Next.js, Node.js, React, Docker, Redis
lần 2 /khoa · 4 khoá: Next.js, Node.js, React, Docker
lần 2 /khoa2 · 5 khoá: Next.js, Node.js, React, Docker, Redis</div>
<p><b><code>redirect()</code> inside <code>try</code></b>:</p>
<div class="out"># Chromium: submit /ds/bat → URL /ds/bat (no navigation)
$ grep -aE '^\\[bat\\]' ~/.rtq-nxj/nen-c12s.log | tail -2
[bat] catch bắt được: NEXT_REDIRECT</div>
<div class="note-ct"><p><strong>cuongthai.com</strong> refreshes cached pages through one Route Handler, <code>/api/revalidate</code>, guarded by a secret header. Its guard reads <code>if (envSecret &amp;&amp; secret !== envSecret)</code> — with the variable empty the check is skipped. A guard whose secret is missing should refuse, not wave everyone through: like an action, the route is public.</p></div>
<div class="out">12: *     headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': SECRET },
16: *   POST with secret header from server environment.
21:const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? '';
44:    // ── Auth: require secret token (prevents abuse) ─────────────────────────
45:    const secret = request.headers.get('x-revalidate-secret') ?? '';
46:    const envSecret = process.env.REVALIDATE_SECRET ?? '';
48:    if (envSecret &amp;&amp; secret !== envSecret) {
50:        { success: false, message: 'Invalid revalidation secret' },</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000    <span class="tok-comment">  # the list page must be ○</span>
<span class="tok-comment"># 1) add a row through the action without revalidate, reload: still old?</span>
<span class="tok-comment"># 2) add revalidatePath('/your/list') before redirect(), rebuild, repeat</span>
<span class="tok-comment"># 3) tagged fetch: compare revalidateTag(tag, 'max') with updateTag(tag)</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-3-revalidate" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.3 — Revalidate: time-based and on-demand</span><span class="lc-sub">Stale-while-revalidate, measured</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-5-staleness-thuc-te" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.5 — When the cache bites</span><span class="lc-sub">Stale data in production and how to find it</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">revalidatePath</span><span class="v">Invalidate a route's cache after a write so it refetches.</span></div>
  <div class="kv"><span class="k">revalidateTag</span><span class="v">Invalidate fetches tagged with a label.</span></div>
  <div class="kv"><span class="k">redirect()</span><span class="v">Navigate after a successful action.</span></div>
  <div class="kv"><span class="k">Cache coherence</span><span class="v">Keeping the UI in sync with the data after a mutation.</span></div>
  <div class="kv"><span class="k">Stale after write</span><span class="v">Without revalidation the UI shows old data.</span></div>
  <div class="kv"><span class="k">Action + revalidate</span><span class="v">The standard mutate-then-revalidate pattern.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>After a Server Action writes, call <code>revalidatePath</code> or <code>revalidateTag</code> so the cached UI updates.</li><li>Without revalidation the UI keeps showing stale data until a hard reload.</li><li>Use <code>redirect()</code> to navigate after a successful mutation.</li><li>Mutate, then revalidate — this is the standard action pattern.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#revalidating-data" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Revalidating after mutations</span><span class="lc-sub">revalidatePath and revalidateTag inside Server Actions.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Một cú ghi chỉ xong một nửa cho tới khi cache biết</h2>
<p class="lead">Bạn tạo một bài trong một Server Action, redirect sang danh sách — và bài mới không thấy đâu. Không có gì hỏng: danh sách đã được cache (Chương 10), và cú ghi của bạn không bảo cache buông ra. Mutation và revalidate là hai nửa của một vòng.</p>

<pre><code class="language-typescript">import { revalidatePath, revalidateTag, updateTag } from 'next/cache';

async function createPost(formData: FormData) {
  'use server';
  const title = formData.get('title');
  if (typeof title !== 'string') return;
  await db.post.create({ data: { title } });

  revalidatePath('/posts');     <span class="tok-comment">// route danh sách giờ đã cũ → fetch lại</span>
  <span class="tok-comment">// hoặc, nếu fetch đã gắn thẻ:</span>
  revalidateTag('posts', 'max'); <span class="tok-comment">// mọi fetch gắn thẻ 'posts' đã cũ (Next.js 16: 2 đối số)</span>
  <span class="tok-comment">// hoặc, để người dùng thấy ngay việc mình vừa ghi:</span>
  updateTag('posts');            <span class="tok-comment">// chỉ trong Server Action</span>
}</code></pre>
<div class="callout warn"><p><strong>Next.js 16:</strong> <code>revalidateTag('posts')</code> một đối số là lỗi kiểu — <code>TS2554 Expected 2 arguments, but got 1</code> (đo thật). Đối số thứ hai là hồ sơ cache; <code>'max'</code> nghĩa là stale-while-revalidate, nên người xem <b>kế tiếp</b> có thể vẫn nhận dữ liệu cũ một lần. Trong action, <code>updateTag(tag)</code> lấy lại dữ liệu trước khi trả lời (đo ở dưới).</p></div>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Action ghi vào database.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Nó gọi <code>revalidatePath</code>/<code>revalidateTag</code> để đánh dấu dữ liệu bị ảnh hưởng là cũ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Next fetch lại ở lần render kế, và UI hiện trạng thái mới — không cần cập nhật client thủ công. (Với <code>revalidateTag(tag, 'max')</code> lần render kế đó có thể vẫn là bản cũ — đo: ngay sau redirect 3 khoá, lần tải sau mới 4; <code>updateTag</code> hiện danh sách mới ngay.)</div></div>
</div>

<div class="kv-grid">
  <div class="kv"><span class="k">revalidatePath('/posts')</span><span class="v">Vô hiệu hoá dữ liệu cache của một route cụ thể. Đơn giản và trực tiếp khi bạn biết URL bị ảnh hưởng.</span></div>
  <div class="kv"><span class="k">revalidateTag('posts', 'max')</span><span class="v">Vô hiệu hoá mọi fetch bạn gắn thẻ <code>'posts'</code>, ở bất cứ đâu. Tốt hơn khi cùng dữ liệu nuôi nhiều trang.</span></div>
</div>

<div class="callout ok">
<p><strong>Đối chiếu với SPA kinh điển:</strong> ở đó bạn sẽ cập nhật state cục bộ thủ công sau khi ghi, hoặc fetch lại rồi setState, và giữ client với server đồng bộ bằng tay. Ở đây nguồn sự thật là cache server; bạn vô hiệu hoá nó và để framework render lại. Ít chỗ để hai bên trôi lệch nhau.</p>
</div>

<h3>Làm cho màn hình khớp với cơ sở dữ liệu sau một lần ghi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ghi, rồi làm mới, rồi trả về</b> — <code>await db.note.create(...)</code>, <code>revalidatePath(&#39;/notes&#39;)</code>, và danh sách vẽ lại với dòng mới.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>revalidatePath cho một URL</b> — Xoá bản đã vẽ trong đệm của đường dẫn đó. Với đoạn động thì dùng mẫu route: <code>revalidatePath(&#39;/notes/[id]&#39;, &#39;page&#39;)</code>.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>revalidateTag cho một nhóm phép fetch</b> — Gắn thẻ lúc fetch (<code>next: { tags: [&#39;notes&#39;] }</code>) rồi xoá tất cả theo tên — tốt hơn khi cùng một dữ liệu xuất hiện trên nhiều route.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>redirect() sau khi tạo</b> — Gọi ở cuối action. Nó ném lỗi, nên không gì sau nó chạy — và một <code>try/catch</code> bao quanh sẽ bắt mất nó (đo: catch bắt <code>NEXT_REDIRECT</code>, trang không chuyển). Đặt nó sau <code>try/catch</code>.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một phép ghi thành công mà danh sách vẫn cứ hiện dữ liệu cũ.</strong> Dòng dữ liệu đã nằm trong cơ sở dữ liệu, action trả về không lỗi, mà trang vẫn hiện trạng thái trước đó — vì chẳng có gì vô hiệu hoá bộ nhớ đệm của route ấy. Nó đọc lên như một vấn đề cơ sở dữ liệu trong khi là vấn đề nhớ đệm, và đó là lý do người ta đi tìm sai chỗ. Luật thì đơn giản: mọi action làm đổi dữ liệu đều phải làm mới thứ hiển thị dữ liệu đó. Khi cùng những bản ghi ấy xuất hiện trên ba route, hãy gắn thẻ cho các phép fetch rồi làm mới theo thẻ thay vì liệt kê từng đường dẫn — một đường dẫn bạn quên là một màn hình ở lại cũ, và chẳng gì báo cho bạn.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/revalidateTag" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — revalidateTag</span><span class="lc-sub">Gắn thẻ cho phép fetch rồi xoá theo tên, kèm trường hợp nhiều route.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/redirect" target="_blank" rel="noopener">
  <span class="lc-ico">↪️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — redirect()</span><span class="lc-sub">Được phép gọi ở đâu, vì sao nó ném lỗi, và nó tương tác với try/catch ra sao.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Sau khi một action ghi, gọi <code>revalidatePath('/list')</code> và xác nhận danh sách cập nhật ngay.</li>
<li>Bỏ lời gọi revalidate và xem UI hiện dữ liệu cũ tới khi hard reload.</li>
<li>Dùng <code>redirect()</code> từ một action sau khi tạo thành công.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn revalidate được cache sau một mutation để UI phản ánh thao tác ghi.</p></div>

<h3>🔬 Đo thật: không revalidate, revalidatePath, max và updateTag, redirect trong try (Next.js 16.4.6)</h3>
<p>Mã của bài chép vào một tệp <code>.ts</code>:</p>
<div class="out">$ npx tsc --noEmit
bai12-3/actions.ts(5,27): error TS7006: Parameter 'formData' implicitly has an 'any' type.
bai12-3/actions.ts(7,9): error TS2304: Cannot find name 'db'.
bai12-3/actions.ts(11,3): error TS2554: Expected 2 arguments, but got 1.</div>
<p>Hai trang tĩnh liệt kê ghi chú và thêm một ghi chú qua action — <code>/ds/khong</code> chỉ redirect, <code>/ds/path</code> gọi <code>revalidatePath</code> trước:</p>
<pre><code class="language-typescript">import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function Trang() {
  const notes = await db.note.findMany({ orderBy: { id: 'desc' }, take: 3 });
  async function them(formData: FormData) {
    'use server';
    const title = formData.get('title');
    if (typeof title !== 'string' || !title.trim()) return;
    await db.note.create({ data: { title } });
    revalidatePath('/ds/path'); <span class="tok-comment">  // trang danh sách đã cũ ⇒ dựng lại</span>
    redirect('/ds/path');
  }
  return (
    &lt;main className="p-4 text-xl"&gt;
      &lt;p id="gio"&gt;dựng lúc {new Date().toTimeString().slice(0, 8)}&lt;/p&gt;
      &lt;form action={them} className="flex gap-2"&gt;&lt;input name="title" className="border px-2" /&gt;&lt;button className="border px-3"&gt;Thêm&lt;/button&gt;&lt;/form&gt;
      &lt;ul id="ds"&gt;{notes.map((n) =&gt; &lt;li key={n.id}&gt;#{n.id} {n.title}&lt;/li&gt;)}&lt;/ul&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ npm run build
├ ○ /ds/bat
├ ○ /ds/khong
├ ○ /ds/path
├ ○ /khoa
└ ○ /khoa2
$ curl /ds/khong · /ds/path — trước khi ghi (giờ dựng + 3 dòng đầu)
/ds/khong · dựng lúc 05:47:28 · #13 Ghi chú số 13
/ds/path · dựng lúc 05:47:28 · #13 Ghi chú số 13
# Chromium: add on /ds/khong → dựng lúc 05:47:28 · #13 Ghi chú số 13
# Chromium: add on /ds/path  → dựng lúc 05:47:38 · #1020 Ghi chú CÓ revalidatePath
$ node -e 'đếm ghi chú trong CSDL' ; curl /ds/khong · /ds/path (tải lại sau khi ghi)
CSDL · ghi chú mới nhất: #1021 redirect trong try
$ for p in khong path; do echo "/ds/$p · $(curl -s localhost:19392/ds/$p | grep -oE 'dựng lúc[^&lt;]*(&lt;!-- --&gt;[^&lt;]*)*' | head -1 | sed 's/&lt;!-- --&gt;//g') · $(curl -s localhost:19392/ds/$p | grep -oE '&lt;li&gt;[^&lt;]*(&lt;!-- --&gt;[^&lt;]*)*&lt;/li&gt;' | head -1 | sed 's/&lt;!-- --&gt;//g; s/&lt;[^&gt;]*&gt;//g')"; done
/ds/khong · dựng lúc 05:47:28 · #13 Ghi chú số 13
/ds/path · dựng lúc 05:47:38 · #1020 Ghi chú CÓ revalidatePath</div>
<p>Không revalidate thì CSDL có hàng mới mà trang — và mọi lần tải lại — vẫn giữ bản dựng lúc build. Có <code>revalidatePath</code> thì redirect về một trang vừa dựng lại.</p>
<p><b>Tag trong Next.js 16.</b> Hai trang fetch danh sách khoá với hai tag khác nhau; mỗi action thêm một khoá, rồi <code>revalidateTag(tag, 'max')</code> hoặc <code>updateTag(tag)</code>, rồi redirect:</p>
<div class="out"># Chromium: add on /khoa  (revalidateTag 'max') → 3 khoá: Next.js, Node.js, React
# Chromium: add on /khoa2 (updateTag)          → 5 khoá: Next.js, Node.js, React, Docker, Redis
$ curl /khoa · /khoa2 (tải lại sau khi ghi) — hai lần cách 1 giây
lần 1 /khoa · 4 khoá: Next.js, Node.js, React, Docker
lần 1 /khoa2 · 5 khoá: Next.js, Node.js, React, Docker, Redis
lần 2 /khoa · 4 khoá: Next.js, Node.js, React, Docker
lần 2 /khoa2 · 5 khoá: Next.js, Node.js, React, Docker, Redis</div>
<p><b><code>redirect()</code> nằm trong <code>try</code></b>:</p>
<div class="out"># Chromium: submit /ds/bat → URL /ds/bat (no navigation)
$ grep -aE '^\\[bat\\]' ~/.rtq-nxj/nen-c12s.log | tail -2
[bat] catch bắt được: NEXT_REDIRECT</div>
<div class="note-ct"><p><strong>cuongthai.com</strong> làm mới trang đã cache qua đúng một Route Handler, <code>/api/revalidate</code>, có kiểm khoá bí mật trong header. Phép kiểm viết <code>if (envSecret &amp;&amp; secret !== envSecret)</code> — biến rỗng là bỏ qua kiểm. Chốt thiếu khoá thì phải từ chối, chứ không mở cửa cho tất cả: cũng như action, route này công khai.</p></div>
<div class="out">12: *     headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': SECRET },
16: *   POST with secret header from server environment.
21:const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? '';
44:    // ── Auth: require secret token (prevents abuse) ─────────────────────────
45:    const secret = request.headers.get('x-revalidate-secret') ?? '';
46:    const envSecret = process.env.REVALIDATE_SECRET ?? '';
48:    if (envSecret &amp;&amp; secret !== envSecret) {
50:        { success: false, message: 'Invalid revalidation secret' },</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000    <span class="tok-comment">  # trang danh sách phải là ○</span>
<span class="tok-comment"># 1) thêm một hàng qua action không revalidate, tải lại: vẫn cũ?</span>
<span class="tok-comment"># 2) thêm revalidatePath('/danh/sach') trước redirect(), build lại, làm lại</span>
<span class="tok-comment"># 3) fetch có tag: so revalidateTag(tag, 'max') với updateTag(tag)</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-3-revalidate" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.3 — Revalidate: theo thời gian và theo yêu cầu</span><span class="lc-sub">Stale-while-revalidate đo bằng giờ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-10-5-staleness-thuc-te" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 10.5 — Khi cache cắn: dữ liệu cũ trong thực tế</span><span class="lc-sub">Dữ liệu cũ ở production và cách dò</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">revalidatePath</span><span class="v">Vô hiệu cache của một route sau một lần ghi để nó fetch lại.</span></div>
  <div class="kv"><span class="k">revalidateTag</span><span class="v">Vô hiệu các fetch gắn một nhãn.</span></div>
  <div class="kv"><span class="k">redirect()</span><span class="v">Điều hướng sau một action thành công.</span></div>
  <div class="kv"><span class="k">Nhất quán cache</span><span class="v">Giữ UI đồng bộ với dữ liệu sau một mutation.</span></div>
  <div class="kv"><span class="k">Cũ sau khi ghi</span><span class="v">Không revalidate thì UI hiện dữ liệu cũ.</span></div>
  <div class="kv"><span class="k">Action + revalidate</span><span class="v">Mẫu chuẩn mutate-rồi-revalidate.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Sau khi một Server Action ghi, gọi <code>revalidatePath</code> hoặc <code>revalidateTag</code> để UI cache cập nhật.</li><li>Không revalidate thì UI cứ hiện dữ liệu cũ tới khi hard reload.</li><li>Dùng <code>redirect()</code> để điều hướng sau một mutation thành công.</li><li>Ghi, rồi revalidate — đây là mẫu action chuẩn.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#revalidating-data" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Revalidate sau mutation</span><span class="lc-sub">revalidatePath và revalidateTag bên trong Server Actions.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Pending & errors: useActionState and useFormStatus|||12.4 — Pending & lỗi: useActionState và useFormStatus',
      slug: 'nextjs-12-4-useactionstate-useformstatus',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Người dùng cần thấy nút "đang gửi…" và thông báo lỗi validation. useActionState nhận kết quả action trả về (lỗi/thành công) và cờ pending; useFormStatus cho một nút con biết form đang gửi.',
      content: `
${G12_4}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Show progress and validation errors, cleanly</h2>
<p class="lead">A real form needs to disable its button while submitting and show "email is required" when the server rejects. React gives two hooks for exactly this. Both are Client Component hooks, so the interactive form lives in a <code>'use client'</code> component while the action stays on the server.</p>

<div class="callout warn">
<p><strong>Naming changed in React 19</strong> (which Next.js 15 uses): the hook once called <code>useFormState</code> is now <code>useActionState</code>, and it is imported from <code>'react'</code> (not <code>'react-dom'</code>). <code>useFormStatus</code> keeps its name and stays in <code>'react-dom'</code>. If a tutorial shows <code>useFormState</code>, it is the old name for <code>useActionState</code>. (Measured on React 19.3: the old import still type-checks and runs, but <code>next dev</code> logs an error in the console — <em>"ReactDOM.useFormState has been renamed to React.useActionState"</em>.)</p>
</div>

<h3>useActionState — carry the action's result and a pending flag</h3>
<pre><code class="language-typescript">'use client';
import { useActionState } from 'react';

function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, { error: null });
  return (
    &lt;form action={formAction}&gt;
      &lt;input name="email" /&gt;
      {state.error &amp;&amp; &lt;p className="err"&gt;{state.error}&lt;/p&gt;}
      &lt;button disabled={pending}&gt;{pending ? 'Sending…' : 'Sign up'}&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>The action receives the previous state as its first argument and returns the next state — so it can <code>return { error: 'Email is required' }</code> instead of throwing, and the form re-renders with that message. The third value, <code>pending</code>, is true while the action runs.</p>
<div class="callout warn"><p><strong>React 19 resets the form after the action</strong> — success or not (measured: type <code>abc</code>, submit, and the error appears next to an <b>empty</b> email input). The returned state survives; the fields do not. To keep what the user typed, return it in the state and use it as <code>defaultValue</code>: <code>return { error: 'Email is required', email }</code> and <code>&lt;input name="email" defaultValue={state.email} /&gt;</code> (measured: the input kept <code>abc</code>).</p></div>

<h3>useFormStatus — for a child button</h3>
<pre><code class="language-typescript">'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();          <span class="tok-comment">// reads the ENCLOSING form</span>
  return &lt;button disabled={pending}&gt;{pending ? 'Saving…' : 'Save'}&lt;/button&gt;;
}</code></pre>
<p>Use this when a reusable submit button, nested inside the form, needs to know the form is submitting without the parent passing a prop down. It reads the status of the form it sits within.</p>

<div class="callout ok">
<p><strong>Optimistic UI:</strong> for instant feedback (a like count bumping before the server confirms), React's <code>useOptimistic</code> pairs naturally with actions — show the expected result immediately, reconcile when the action resolves. Reach for it once the basics above feel comfortable.</p>
</div>

<h3>Showing progress and errors from an action</h3>
<div class="lz-map">
  <div class="lz-stage">Two hooks, two different questions</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useActionState</div><div class="lz-nsub">Wraps the action and gives you back its return value plus a pending flag. This is where validation errors come back to the form.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useFormStatus</div><div class="lz-nsub">Read from a child of the form — usually the submit button. It knows whether the enclosing form is submitting.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">It must be a child</div><div class="lz-nsub"><code>useFormStatus</code> reads context from the form above it. Called in the same component that renders <code>&lt;form&gt;</code>, it always returns false.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Return errors, do not throw them</div><div class="lz-nsub">An action that throws produces an error boundary. Returning <code>{ error: &#39;Title is required&#39; }</code> lets the form display it in place.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>useFormStatus</code> called in the component that renders the form, always reporting <code>pending: false</code>.</strong> The hook reads a context provided by the <code>&lt;form&gt;</code> element, so it only sees a submission from <em>inside</em> that form. In the parent — the component that writes <code>&lt;form action={…}&gt;</code> — there is no such context, so <code>pending</code> never becomes true, the button never disables, and a double-click sends the action twice. The fix is structural, not logical: extract the submit button into its own small Client Component and call the hook there. The docs say this explicitly, and it is the single most common report about the hook.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — useFormStatus</span><span class="lc-sub">The parent-child rule, spelled out, with the recommended button component.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react.dev — useActionState</span><span class="lc-sub">State, pending and the action signature it expects.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Wrap an action with <code>useActionState</code> to show a returned error message — then check what is left in the inputs afterwards (React 19 resets them).</li>
<li>Add a submit button that shows a spinner via <code>useFormStatus().pending</code>.</li>
<li>Confirm the pending state comes from the nearest parent <code>&lt;form&gt;</code>.</li>
</ol>
<p><strong>Done when:</strong> you can show pending and error states for a Server Action form.</p></div>

<h3>🔬 Measured: the old name, pending, the reset, parent vs child, a thrown error (React 19.3 + Chromium)</h3>
<div class="out">$ npx tsc --noEmit   # the lesson's SignupForm, as written
tsc: 0 lỗi — state suy ra từ kiểu đối số prev của signup
$ npx tsc --noEmit   # import { useFormState } from 'react-dom'
tsc: 0 lỗi (tên cũ vẫn có trong kiểu, đánh dấu deprecated)
# next dev · Chromium console
ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState. Cu</div>
<p>The action used (it waits 1.2 s to make <code>pending</code> visible):</p>
<pre><code class="language-typescript">'use server';
export async function signup(prev: { error: string | null }, formData: FormData) {
  const email = formData.get('email');
  console.log('[signup] email =', JSON.stringify(email), '· prev =', JSON.stringify(prev));
  await new Promise((r) =&gt; setTimeout(r, 1200)); <span class="tok-comment">  // giả lập máy chủ chậm 1,2 s</span>
  if (typeof email !== 'string' || !email.includes('@')) return { error: 'Email is required' };
  return { error: null };
}</code></pre>
<div class="out">/dang-ky   300 ms after the click: button "Sending…" · disabled = true
/dang-ky   after the action: "Email is required" · email input = ""
/dang-ky2  after the action: "Email is required" · email input = "abc"   (value returned + defaultValue)
/nut  parent useFormStatus, 120 ms in: "Save (cha)" · disabled = false
/nut  child  useFormStatus, 120 ms in: "Saving…" · disabled = true</div>
<div class="out">[signup] email = "abc" · prev = {"error":null}
[luu] lần 1 · useFormStatus ở cha
[luu] lần 2 · useFormStatus ở cha
[luu] lần 3 · useFormStatus ở con
⨯ Error: Title is required (thông điệp thật từ action)</div>
<p>The parent version let a second click through (two runs); the child button was disabled (one run). The thrown error reached <code>error.tsx</code> as <em>"Minified React error #441"</em> in production — the real message only in the server log.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) an action that awaits 1-2 s; watch the button while pending</span>
<span class="tok-comment"># 2) return { error }, type a bad value, submit: is the input still filled?</span>
<span class="tok-comment"># 3) useFormStatus in the parent, double-click, count the runs in the server log</span>
npm run build &amp;&amp; npx next start -p 3000</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-4-3-form-thật" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 4.3 — A real form: many fields, one submit</span><span class="lc-sub">Disabling and double-submit by hand — compare with pending</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-2-cac-file-quy-uoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.2 — The convention files: error.tsx</span><span class="lc-sub">Where an error thrown by an action lands</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useActionState</span><span class="v">Hook that gives an action's return value as state, plus <code>pending</code>.</span></div>
  <div class="kv"><span class="k">useFormStatus</span><span class="v">Hook reading the pending state of the enclosing form.</span></div>
  <div class="kv"><span class="k">pending</span><span class="v">True while the action is in flight — show a spinner/disable.</span></div>
  <div class="kv"><span class="k">Returned error</span><span class="v">An action can return a value (e.g. an error) to render.</span></div>
  <div class="kv"><span class="k">Form reset</span><span class="v">React 19 clears the fields after an action; return values to keep them.</span></div>
  <div class="kv"><span class="k">Client hooks</span><span class="v">Both are Client-side hooks used around a form.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>useActionState</code> tracks a Server Action's return value (like an error); the form itself is reset after each action, so return the values you want to keep.</li><li><code>useFormStatus</code> reads the <code>pending</code> state of the enclosing form to show a spinner or disable the button.</li><li>Both are Client hooks used around a form submitting to an action.</li><li>Together they give a form good pending and error UX without manual state.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — useActionState</span><span class="lc-sub">Return values as state, the pending flag, and validation errors without throwing.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener">
  <span class="lc-ico">🔘</span>
  <span class="lc-body"><span class="lc-title">react.dev — useFormStatus</span><span class="lc-sub">A nested button reading its enclosing form's pending state.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Hiện tiến trình và lỗi validation, gọn gàng</h2>
<p class="lead">Một form thật cần vô hiệu hoá nút khi đang gửi và hiện "email là bắt buộc" khi server từ chối. React cho hai hook đúng cho việc này. Cả hai là hook Client Component, nên form tương tác nằm trong một component <code>'use client'</code> còn action ở lại trên server.</p>

<div class="callout warn">
<p><strong>Tên đã đổi ở React 19</strong> (bản Next.js 15 dùng): hook từng gọi là <code>useFormState</code> nay là <code>useActionState</code>, và import từ <code>'react'</code> (không phải <code>'react-dom'</code>). <code>useFormStatus</code> giữ tên và ở lại <code>'react-dom'</code>. Nếu một hướng dẫn hiện <code>useFormState</code>, đó là tên cũ của <code>useActionState</code>. (Đo trên React 19.3: import cũ vẫn qua kiểm kiểu và vẫn chạy, nhưng <code>next dev</code> in lỗi ra console — <em>"ReactDOM.useFormState has been renamed to React.useActionState"</em>.)</p>
</div>

<h3>useActionState — mang kết quả action và một cờ pending</h3>
<pre><code class="language-typescript">'use client';
import { useActionState } from 'react';

function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, { error: null });
  return (
    &lt;form action={formAction}&gt;
      &lt;input name="email" /&gt;
      {state.error &amp;&amp; &lt;p className="err"&gt;{state.error}&lt;/p&gt;}
      &lt;button disabled={pending}&gt;{pending ? 'Đang gửi…' : 'Đăng ký'}&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Action nhận state trước làm tham số đầu và trả về state kế — nên nó có thể <code>return { error: 'Email là bắt buộc' }</code> thay vì ném lỗi, và form render lại với thông báo đó. Giá trị thứ ba, <code>pending</code>, là true trong lúc action chạy.</p>
<div class="callout warn"><p><strong>React 19 đặt lại form sau action</strong> — thành công hay không (đo: gõ <code>abc</code>, gửi, và lỗi hiện cạnh một ô email <b>trống</b>). State trả về thì còn; các trường thì không. Muốn giữ thứ người dùng đã gõ, trả nó trong state và dùng làm <code>defaultValue</code>: <code>return { error: 'Email là bắt buộc', email }</code> và <code>&lt;input name="email" defaultValue={state.email} /&gt;</code> (đo: ô vẫn còn <code>abc</code>).</p></div>

<h3>useFormStatus — cho một nút con</h3>
<pre><code class="language-typescript">'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();          <span class="tok-comment">// đọc form BAO QUANH</span>
  return &lt;button disabled={pending}&gt;{pending ? 'Đang lưu…' : 'Lưu'}&lt;/button&gt;;
}</code></pre>
<p>Dùng khi một nút submit tái sử dụng, lồng trong form, cần biết form đang gửi mà không cần cha truyền prop xuống. Nó đọc trạng thái của chính form nó nằm trong.</p>

<div class="callout ok">
<p><strong>UI lạc quan (optimistic):</strong> để phản hồi tức thì (số like nhảy trước khi server xác nhận), <code>useOptimistic</code> của React ghép tự nhiên với action — hiện kết quả kỳ vọng ngay, đối chiếu lại khi action xong. Hãy dùng khi những điều cơ bản ở trên đã thấy quen.</p>
</div>

<h3>Hiện tiến trình và lỗi từ một action</h3>
<div class="lz-map">
  <div class="lz-stage">Hai hook, hai câu hỏi khác nhau</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useActionState</div><div class="lz-nsub">Bọc lấy action rồi trả về giá trị nó trả về cộng một cờ đang-chạy. Đây là chỗ lỗi kiểm dữ liệu quay về với form.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useFormStatus</div><div class="lz-nsub">Đọc từ một đứa con của form — thường là cái nút gửi. Nó biết cái form bao quanh có đang gửi hay không.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nó phải là một đứa CON</div><div class="lz-nsub"><code>useFormStatus</code> đọc context từ cái form ở trên nó. Gọi trong chính component vẽ ra <code>&lt;form&gt;</code> thì nó luôn trả về false.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Hãy TRẢ VỀ lỗi, đừng ném lỗi</div><div class="lz-nsub">Một action ném lỗi sẽ kích hoạt ranh giới lỗi. Trả về <code>{ error: &#39;Thiếu tiêu đề&#39; }</code> cho phép form hiện nó ra ngay tại chỗ.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gọi <code>useFormStatus</code> ngay trong component vẽ ra form, và nó luôn báo <code>pending: false</code>.</strong> Hook này đọc một context do chính phần tử <code>&lt;form&gt;</code> cung cấp, nên nó chỉ thấy được một lần gửi từ <em>bên trong</em> cái form đó. Ở phần tử cha — component viết ra <code>&lt;form action={…}&gt;</code> — chẳng có context nào như thế, nên <code>pending</code> không bao giờ thành true, cái nút không bao giờ bị khoá, và một cú bấm đúp gửi action hai lần. Cách chữa là về cấu trúc chứ không phải về logic: hãy rút cái nút gửi ra thành một Client Component nhỏ riêng rồi gọi hook ở đó. Tài liệu nói thẳng điều này, và nó là báo cáo phổ biến nhất về cái hook này.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — useFormStatus</span><span class="lc-sub">Luật cha-con, nói rõ ra, kèm component nút gửi được khuyến nghị.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react.dev — useActionState</span><span class="lc-sub">State, cờ đang-chạy và chữ ký action mà nó mong đợi.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Bọc một action bằng <code>useActionState</code> để hiện một thông báo lỗi trả về — rồi xem các ô nhập còn gì sau đó (React 19 đặt lại chúng).</li>
<li>Thêm một nút submit hiện spinner qua <code>useFormStatus().pending</code>.</li>
<li>Xác nhận trạng thái pending đến từ <code>&lt;form&gt;</code> cha gần nhất.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn hiện được trạng thái pending và lỗi cho một form Server Action.</p></div>

<h3>🔬 Đo thật: tên cũ, pending, form bị đặt lại, cha và con, lỗi bị ném (React 19.3 + Chromium)</h3>
<div class="out">$ npx tsc --noEmit   # SignupForm của bài, chép nguyên
tsc: 0 lỗi — state suy ra từ kiểu đối số prev của signup
$ npx tsc --noEmit   # import { useFormState } from 'react-dom'
tsc: 0 lỗi (tên cũ vẫn có trong kiểu, đánh dấu deprecated)
# next dev · Chromium console
ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState. Cu</div>
<p>Action dùng để đo (chờ 1,2 s cho thấy rõ <code>pending</code>):</p>
<pre><code class="language-typescript">'use server';
export async function signup(prev: { error: string | null }, formData: FormData) {
  const email = formData.get('email');
  console.log('[signup] email =', JSON.stringify(email), '· prev =', JSON.stringify(prev));
  await new Promise((r) =&gt; setTimeout(r, 1200)); <span class="tok-comment">  // giả lập máy chủ chậm 1,2 s</span>
  if (typeof email !== 'string' || !email.includes('@')) return { error: 'Email is required' };
  return { error: null };
}</code></pre>
<div class="out">/dang-ky   300 ms after the click: button "Sending…" · disabled = true
/dang-ky   after the action: "Email is required" · email input = ""
/dang-ky2  after the action: "Email is required" · email input = "abc"   (value returned + defaultValue)
/nut  parent useFormStatus, 120 ms in: "Save (cha)" · disabled = false
/nut  child  useFormStatus, 120 ms in: "Saving…" · disabled = true</div>
<div class="out">[signup] email = "abc" · prev = {"error":null}
[luu] lần 1 · useFormStatus ở cha
[luu] lần 2 · useFormStatus ở cha
[luu] lần 3 · useFormStatus ở con
⨯ Error: Title is required (thông điệp thật từ action)</div>
<p>Bản đặt ở cha để lọt cú bấm thứ hai (hai lần chạy); nút con bị khoá (một lần). Lỗi bị ném tới <code>error.tsx</code> dưới dạng <em>"Minified React error #441"</em> ở production — câu thật chỉ có trong log máy chủ.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) action chờ 1–2 s; nhìn nút trong lúc pending</span>
<span class="tok-comment"># 2) trả { error }, gõ giá trị sai, gửi: ô còn chữ không?</span>
<span class="tok-comment"># 3) useFormStatus ở cha, bấm đúp, đếm số lần chạy trong log máy chủ</span>
npm run build &amp;&amp; npx next start -p 3000</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-4-3-form-thật" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 4.3 — Form thật: nhiều trường, một lần gửi</span><span class="lc-sub">Tự khoá nút, chống bấm đúp bằng state — để so với pending</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-8-2-cac-file-quy-uoc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 8.2 — Các file quy ước: error.tsx</span><span class="lc-sub">Nơi lỗi ném ra từ action rơi vào</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">useActionState</span><span class="v">Hook trả giá trị action trả về dưới dạng state, kèm <code>pending</code>.</span></div>
  <div class="kv"><span class="k">useFormStatus</span><span class="v">Hook đọc trạng thái pending của form bao quanh.</span></div>
  <div class="kv"><span class="k">pending</span><span class="v">True khi action đang bay — hiện spinner/disable.</span></div>
  <div class="kv"><span class="k">Lỗi trả về</span><span class="v">Một action có thể trả về một giá trị (vd lỗi) để render.</span></div>
  <div class="kv"><span class="k">Form bị đặt lại</span><span class="v">React 19 xoá các trường sau action; trả giá trị về để giữ chúng.</span></div>
  <div class="kv"><span class="k">Hook client</span><span class="v">Cả hai là hook phía client dùng quanh một form.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>useActionState</code> theo dõi giá trị trả về của một Server Action (như lỗi); bản thân form bị đặt lại sau mỗi action, nên hãy trả về giá trị muốn giữ.</li><li><code>useFormStatus</code> đọc trạng thái <code>pending</code> của form bao quanh để hiện spinner hoặc disable nút.</li><li>Cả hai là hook client dùng quanh một form submit tới một action.</li><li>Cùng nhau chúng cho form một UX pending và lỗi tốt mà không cần state thủ công.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">react.dev — useActionState</span><span class="lc-sub">Giá trị trả về làm state, cờ pending, và lỗi validation không cần ném.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener">
  <span class="lc-ico">🔘</span>
  <span class="lc-body"><span class="lc-title">react.dev — useFormStatus</span><span class="lc-sub">Một nút lồng đọc trạng thái pending của form bao quanh.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — Security: an action is a public endpoint|||12.5 — Bảo mật: một action là endpoint công khai',
      slug: 'nextjs-12-5-bao-mat-action',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Điều nguy hiểm nhất về Server Action: nó gọn tới mức dễ quên nó là một POST công khai. Ai cũng gọi được với dữ liệu bất kỳ. Mỗi action phải TỰ validate input và TỰ kiểm quyền — không tin client.',
      content: `
${G12_5}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>The convenience hides a real endpoint — treat it like one</h2>
<p class="lead">A Server Action looks like a local function call, and that is the danger: it is so seamless you forget it compiles down to a public POST endpoint. Anyone can invoke it with any payload, not just your form with your validation. Every action must defend itself.</p>

<div class="pitfall">
<p><strong>The wrong mental model:</strong> "the form only lets them enter valid data, and the button is hidden unless they're an admin, so the action is safe." None of that constrains the endpoint. An attacker calls the action directly — skipping your form, your client validation, and your hidden button — with whatever arguments they like. Client-side checks are for UX; they are not security.</p>
</div>

<h3>Two things every mutating action must do</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Authenticate & authorise.</b> Re-check the session inside the action, and confirm this user may do this operation on this resource. Never rely on the UI having hidden the button.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Validate & sanitise input.</b> Parse the arguments/FormData against a schema (e.g. Zod). Do not trust types, sizes, or shapes coming from the client.</div></div>
</div>

<pre><code class="language-typescript">async function deletePost(postId: number) {
  'use server';
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };                 <span class="tok-comment">// authn</span>
  if (!Number.isInteger(postId) || postId &lt;= 0) return { error: 'Invalid id' };

  <span class="tok-comment">// the caller may not exist, the row may not exist, the row may be someone else's</span>
  const { count } = await db.post.deleteMany({ where: { id: postId, authorId: user.id } }); <span class="tok-comment">// authz</span>
  if (count === 0) return { error: 'Forbidden' };
}</code></pre>

<div class="note-ct">
<p><strong>This is a lesson cuongthai.com has paid for.</strong> The project's security reviews repeatedly turned up the same class of bug on write paths — endpoints (uploads, sockets) that trusted the client instead of re-checking authorisation and validating input on the server, and had to be patched. A Server Action is exactly such a write path. The rule that came out of it: validate and authorise on the server, on every mutation, every time — the pretty form in front of it changes nothing about who can reach the endpoint behind it.</p>
</div>

<div class="callout warn">
<p><strong>Also:</strong> only export functions that are meant to be actions from a <code>'use server'</code> file — every export there becomes a callable endpoint. Do not put helper functions you did not mean to expose in the same module. (Measured on Next.js 16: an export that no client code imports gets no id and cannot be called — but every one that is imported can, with any arguments.)</p>
<div class="callout warn"><p><strong>The first version of this code had a hole tsc can see:</strong> <code>findUnique</code> returns <code>null</code> for an id that does not exist, and <code>post.authorId</code> then throws — <code>TS18047 'post' is possibly 'null'</code> in a <code>.ts</code> file, and at runtime (measured) a 500 with <em>"Cannot read properties of null (reading 'authorId')"</em>. The version above scopes the delete to the owner, so a foreign or missing id simply matches 0 rows, and returns <code>{ error }</code> instead of throwing (Lesson 12.4).</p></div>
</div>

<h3>The four checks every Server Action needs</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Who is calling?</b> — Read the session on the server, inside the action. Never trust a user id passed in as an argument — the caller chooses those.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>May they touch this record?</b> — Scope the query to the caller: <code>where: { id, userId: session.user.id }</code>. Look it up scoped rather than looking it up and then checking.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Is the input valid?</b> — Parse the <code>FormData</code> with a schema. Everything arriving is attacker-controlled text, including hidden fields and select values.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Should it be rate-limited?</b> — An action is a public endpoint. Anything that sends mail, costs money, or can be enumerated needs a limit.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — an action that takes the user id as a parameter.</strong> <code>async function deleteNote(noteId, userId)</code> looks harmless because the only caller is your own form, which passes the logged-in user&#39;s id. But the action is a public endpoint and the caller controls every argument: a crafted request can pass any pair of ids it likes, and the action will happily delete someone else&#39;s note while looking perfectly correct in code review. Read the identity from the session inside the action, never from an argument. The same applies to a price, a role, or a status passed from the client — if the server needs to trust it, the server has to derive it.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#security" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Action security</span><span class="lc-sub">Authentication, authorisation, and the closure-capture caveat.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">OWASP — Authorization Cheat Sheet</span><span class="lc-sub">The general rule this lesson is a special case of: check on every request, at the resource.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Treat an action as a public endpoint: add an auth check and re-validate the input inside the action, not just in the UI.</li>
<li>Try calling a mutating action without the right session and confirm it is rejected server-side.</li>
<li>List three checks every action needs: authentication, authorization, input validation.</li>
</ol>
<p><strong>Done when:</strong> you can secure a Server Action as the public endpoint it really is.</p></div>

<h3>🔬 Measured: three delete actions attacked with curl, and what Next.js blocks (16.4.6)</h3>
<p>The lesson's <code>deletePost</code> in a <code>.ts</code> file — after the usual type and import fixes one error remains:</p>
<div class="out">$ npx tsc --noEmit      # sửa 1: kiểu + import
bai12-5/actions.ts(10,7): error TS18047: 'post' is possibly 'null'.</div>
<p>Three versions in one <code>'use server'</code> file — A: the lesson's logic; B: takes <code>userId</code> as an argument; C: session inside, delete scoped to the owner, input checked. The page shows delete buttons only on the user's own notes. <code>goi</code> is a small script that sends the action's POST with <code>curl</code> (cookie <code>uid=…</code> is the lab's simplified session):</p>
<pre><code class="language-typescript">'use server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/phien';

<span class="tok-comment">// A) logic của bài, chạy như JS thường (post! = "tin tôi đi, không null")</span>
export async function deletePost(postId: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const post = await db.note.findUnique({ where: { id: postId } });
  if (post!.authorId !== user.id) throw new Error('Forbidden');
  await db.note.delete({ where: { id: postId } });
  console.log(&#96;[A deletePost] user \${user.id} xoá #\${postId}&#96;);
}

<span class="tok-comment">// B) BẪY: nhận userId từ người gọi</span>
export async function deleteNote(noteId: number, userId: number) {
  const note = await db.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== userId) return { error: 'Forbidden' };
  await db.note.delete({ where: { id: noteId } });
  console.log(&#96;[B deleteNote] userId (do người gọi gửi) = \${userId} · xoá #\${noteId}&#96;);
  return { ok: true };
}

<span class="tok-comment">// C) ĐÚNG: ai gọi = đọc từ phiên; kiểm đầu vào; truy vấn đã khoanh theo chủ</span>
export async function xoaGhiChu(noteId: unknown) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Chưa đăng nhập' };
  if (typeof noteId !== 'number' || !Number.isInteger(noteId) || noteId &lt;= 0) return { error: 'noteId không hợp lệ' };
  const { count } = await db.note.deleteMany({ where: { id: noteId, authorId: user.id } });
  console.log(&#96;[C xoaGhiChu] user \${user.id} · noteId \${noteId} · đã xoá \${count}&#96;);
  return count === 1 ? { ok: true } : { error: 'Không tìm thấy' };
}</code></pre>
<div class="out">$ goi deletePost "" '[13]'          # A, KHÔNG cookie
HTTP 500 · 1:E{"digest":"2182075609"}
$ goi deletePost 2 '[99999]'       # A, user 2, id không tồn tại
HTTP 500 · 1:E{"digest":"3918568795"}
$ goi deleteNote 2 '[12,1]'        # B: user 2 xoá #12 của user 1, tự khai userId = 1
HTTP 200 · 1:{"ok":true}
$ goi xoaGhiChu 2 '[14]'           # C: user 2 xoá #14 của user 1
HTTP 200 · 1:{"error":"Không tìm thấy"}
$ goi xoaGhiChu 2 '["14 OR 1=1"]'  # C: đầu vào rác
HTTP 200 · 1:{"error":"noteId không hợp lệ"}
$ goi xoaGhiChu 1 '[15]'           # C: user 1 xoá ghi chú của chính mình
HTTP 200 · 1:{"ok":true}
$ grep '\\[A\\|\\[B\\|\\[C\\|TypeError\\|Not auth' (log next start)
Error: Not authenticated
TypeError: Cannot read properties of null (reading 'authorId')
[B deleteNote] userId (do người gọi gửi) = 1 · xoá #12
[C xoaGhiChu] user 2 · noteId 14 · đã xoá 0
[C xoaGhiChu] user 1 · noteId 15 · đã xoá 1
CSDL còn: #13 (user 2) · #14 (user 1)</div>
<p>B deleted note #12 of user 1 for user 2, because user 2 claimed to be user 1. C refused the foreign note (0 rows), rejected the garbage id and deleted the owner's own note.</p>
<p><b>What Next.js blocks on its own</b> — a foreign <code>Origin</code>, a body over 1 MB, an id that is not in this build:</p>
<div class="out">$ goi xoaGhiChu 1 '[14]' 'Origin: http://evil.example'     # Origin lạ (trang khác gửi hộ)
HTTP 500 · 1:E{"digest":"403536267"}
$ goi xoaGhiChu 1 '[99]' 'Origin: http://localhost:19392'  # Origin khớp Host
HTTP 200 · 1:{"error":"Không tìm thấy"}
$ grep -aiE 'origin|csrf|x-forwarded-host' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -2
&#96;x-forwarded-host&#96; header with value &#96;localhost:19392&#96; does not match &#96;origin&#96; header with value &#96;evil.example&#96; from a forwarded Server Actions reques
$ node -e 'mảng 2 MB' | goi xoaGhiChu 1 -      # thân 2 MB
HTTP 500 · 1:E{"digest":"2003265017"}
$ grep -aiE 'Body exceeded|bodySizeLimit' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -2
⨯ Error: Body exceeded 1 MB limit.
To configure the body size limit for Server Actions, see: https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit
$ curl -X POST localhost:3000/xoa -H "Next-Action: 40$(id bịa 40 ký tự)"      # id không có trong sổ
HTTP 409
$ grep -aiE 'Failed to find Server Action|not found' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -1
Error: Failed to find Server Action "40aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa". This request might be from an older or newer deployment.</div>
<p>None of these checks knows who the user is or what they own — curl without an <code>Origin</code> header went straight through to A, B and C.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
ID=$(node -e "const m=require('./.next/server/server-reference-manifest.json'); console.log(Object.keys(m.node)[0])")
curl -X POST localhost:3000/&lt;page&gt; -H "Next-Action: $ID" -H 'content-type: text/plain;charset=UTF-8' -b 'uid=2' -d '[12, 1]' <span class="tok-comment">  # your action, any arguments</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-3-requireauth-phan-quyen" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.3 — requireAuth and authorization</span><span class="lc-sub">Who may do what to which record — the Express side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.4 — Cookies, CSRF and revocation</span><span class="lc-sub">What the Next.js Origin check blocks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-3-dau-vao-doc-hai" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 9.3 — Hostile input</span><span class="lc-sub">Every action argument is chosen by the caller</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Public endpoint</span><span class="v">An action is callable like any endpoint — treat it as untrusted input.</span></div>
  <div class="kv"><span class="k">Authentication</span><span class="v">Verify who the caller is inside the action.</span></div>
  <div class="kv"><span class="k">Authorization</span><span class="v">Verify they are allowed to do this action.</span></div>
  <div class="kv"><span class="k">Input validation</span><span class="v">Re-validate on the server (e.g. with Zod), never trust the UI.</span></div>
  <div class="kv"><span class="k">Client checks are not security</span><span class="v">UI guards can be bypassed; the server must enforce.</span></div>
  <div class="kv"><span class="k">Least privilege</span><span class="v">Only do what the authenticated user is permitted to.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A Server Action is a public endpoint: anyone can invoke it, so treat its input as untrusted.</li><li>Every mutating action needs authentication, authorization and server-side input validation.</li><li>UI guards are not security — the checks must live inside the action on the server.</li><li>Apply least privilege: do only what the authenticated user is allowed to.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions security</span><span class="lc-sub">Authentication, authorisation, and validating input for actions.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Sự tiện lợi che giấu một endpoint thật — hãy đối xử với nó như thế</h2>
<p class="lead">Một Server Action trông như một lời gọi hàm cục bộ, và đó là cái nguy: nó liền mạch tới mức bạn quên nó biên dịch xuống thành một endpoint POST công khai. Ai cũng gọi được với payload bất kỳ, không chỉ form của bạn với validation của bạn. Mỗi action phải tự bảo vệ.</p>

<div class="pitfall">
<p><strong>Mô hình tư duy sai:</strong> "form chỉ cho họ nhập dữ liệu hợp lệ, và nút bị ẩn trừ khi là admin, nên action an toàn." Không cái nào trong đó ràng buộc endpoint. Kẻ tấn công gọi action thẳng — bỏ qua form của bạn, validation client của bạn, và cái nút ẩn của bạn — với tham số tuỳ ý. Kiểm tra phía client là để trải nghiệm; nó không phải bảo mật.</p>
</div>

<h3>Hai việc mọi action ghi dữ liệu phải làm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Xác thực &amp; phân quyền.</b> Kiểm lại phiên bên trong action, và xác nhận người này được phép làm thao tác này lên tài nguyên này. Đừng bao giờ dựa vào việc UI đã ẩn nút.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Validate &amp; làm sạch input.</b> Phân tích tham số/FormData theo một schema (ví dụ Zod). Đừng tin kiểu, kích thước, hay hình dạng đến từ client.</div></div>
</div>

<pre><code class="language-typescript">async function deletePost(postId: number) {
  'use server';
  const user = await getCurrentUser();
  if (!user) return { error: 'Chưa xác thực' };                 <span class="tok-comment">// authn</span>
  if (!Number.isInteger(postId) || postId &lt;= 0) return { error: 'Invalid id' };

  <span class="tok-comment">// có thể không có người gọi, không có hàng, hoặc hàng của người khác</span>
  const { count } = await db.post.deleteMany({ where: { id: postId, authorId: user.id } }); <span class="tok-comment">// authz</span>
  if (count === 0) return { error: 'Cấm' };
}</code></pre>

<div class="note-ct">
<p><strong>Đây là bài học cuongthai.com đã trả giá.</strong> Các đợt rà soát bảo mật của dự án lặp đi lặp lại đúng một loại lỗi trên các đường ghi — endpoint (upload, socket) tin client thay vì kiểm lại phân quyền và validate input trên server, và phải vá lại. Một Server Action chính xác là một đường ghi như vậy. Quy tắc rút ra: validate và phân quyền trên server, ở mọi mutation, mọi lúc — cái form đẹp trước nó không thay đổi gì về việc ai tới được endpoint phía sau nó.</p>
</div>

<div class="callout warn">
<p><strong>Còn nữa:</strong> chỉ export những hàm định làm action từ một file <code>'use server'</code> — mọi export ở đó thành một endpoint gọi được. Đừng để những hàm phụ bạn không định phơi bày trong cùng module. (Đo trên Next.js 16: export không được mã client nào import thì không có id và không gọi được — nhưng mọi export được import thì gọi được, với đối số bất kỳ.)</p>
<div class="callout warn"><p><strong>Bản đầu của đoạn mã này có một lỗ mà tsc nhìn thấy:</strong> <code>findUnique</code> trả <code>null</code> khi id không tồn tại, rồi <code>post.authorId</code> ném lỗi — <code>TS18047 'post' is possibly 'null'</code> trong tệp <code>.ts</code>, còn lúc chạy (đo thật) là lỗi 500 <em>"Cannot read properties of null (reading 'authorId')"</em>. Bản ở trên khoanh lệnh xoá theo chủ, nên id lạ hay id của người khác chỉ khớp 0 hàng, và trả <code>{ error }</code> thay vì ném (Bài 12.4).</p></div>
</div>

<h3>Bốn phép kiểm mà mọi Server Action đều cần</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ai đang gọi?</b> — Hãy đọc phiên đăng nhập ở phía máy chủ, ngay trong action. Đừng bao giờ tin một id người dùng truyền vào làm đối số — người gọi tự chọn những thứ đó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Họ có được đụng vào bản ghi này không?</b> — Hãy giới hạn truy vấn theo người gọi: <code>where: { id, userId: session.user.id }</code>. Tra trong phạm vi, chứ đừng tra ra rồi mới đi kiểm.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Đầu vào có hợp lệ không?</b> — Hãy phân tích <code>FormData</code> bằng một schema. Mọi thứ đi tới đều là chữ do kẻ tấn công điều khiển, kể cả trường ẩn và giá trị của select.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Có cần giới hạn tần suất không?</b> — Một action là một endpoint công khai. Bất cứ thứ gì gửi thư, tốn tiền, hay có thể bị dò tuần tự đều cần một giới hạn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một action nhận id người dùng làm tham số.</strong> <code>async function deleteNote(noteId, userId)</code> nhìn vô hại vì chỗ gọi duy nhất là form của chính bạn, vốn truyền id của người đang đăng nhập. Nhưng action là một endpoint công khai và người gọi điều khiển mọi đối số: một request tự soạn truyền được bất kỳ cặp id nào nó thích, và action sẽ vui vẻ xoá ghi chú của người khác trong khi trông hoàn toàn đúng đắn lúc review mã. Hãy đọc danh tính từ phiên đăng nhập ngay trong action, đừng bao giờ đọc từ một đối số. Chuyện tương tự với một mức giá, một vai trò, hay một trạng thái truyền từ client — nếu máy chủ cần tin nó thì máy chủ phải tự suy ra nó.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#security" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — An toàn cho Server Action</span><span class="lc-sub">Xác thực, phân quyền, và lưu ý về việc closure bắt giá trị.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">OWASP — Authorization Cheat Sheet</span><span class="lc-sub">Luật tổng quát mà bài này là một ca riêng: kiểm ở mọi request, ngay tại tài nguyên.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Coi một action như một endpoint công khai: thêm kiểm tra auth và validate lại input BÊN TRONG action, không chỉ ở UI.</li>
<li>Thử gọi một action ghi mà không có session đúng và xác nhận nó bị từ chối phía server.</li>
<li>Liệt kê ba kiểm tra mọi action cần: xác thực, phân quyền, validate input.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn bảo mật được một Server Action đúng như một endpoint công khai mà nó thật sự là.</p></div>

<h3>🔬 Đo thật: ba action xoá bị tấn công bằng curl, và những gì Next.js chặn (16.4.6)</h3>
<p><code>deletePost</code> của bài trong tệp <code>.ts</code> — sửa kiểu và import xong vẫn còn một lỗi:</p>
<div class="out">$ npx tsc --noEmit      # sửa 1: kiểu + import
bai12-5/actions.ts(10,7): error TS18047: 'post' is possibly 'null'.</div>
<p>Ba phiên bản trong một tệp <code>'use server'</code> — A: logic của bài; B: nhận <code>userId</code> làm đối số; C: đọc phiên trong action, xoá khoanh theo chủ, kiểm đầu vào. Trang chỉ hiện nút xoá ở ghi chú của chính người dùng. <code>goi</code> là một script nhỏ gửi POST của action bằng <code>curl</code> (cookie <code>uid=…</code> là phiên giản lược của phòng thí nghiệm):</p>
<pre><code class="language-typescript">'use server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/phien';

<span class="tok-comment">// A) logic của bài, chạy như JS thường (post! = "tin tôi đi, không null")</span>
export async function deletePost(postId: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const post = await db.note.findUnique({ where: { id: postId } });
  if (post!.authorId !== user.id) throw new Error('Forbidden');
  await db.note.delete({ where: { id: postId } });
  console.log(&#96;[A deletePost] user \${user.id} xoá #\${postId}&#96;);
}

<span class="tok-comment">// B) BẪY: nhận userId từ người gọi</span>
export async function deleteNote(noteId: number, userId: number) {
  const note = await db.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== userId) return { error: 'Forbidden' };
  await db.note.delete({ where: { id: noteId } });
  console.log(&#96;[B deleteNote] userId (do người gọi gửi) = \${userId} · xoá #\${noteId}&#96;);
  return { ok: true };
}

<span class="tok-comment">// C) ĐÚNG: ai gọi = đọc từ phiên; kiểm đầu vào; truy vấn đã khoanh theo chủ</span>
export async function xoaGhiChu(noteId: unknown) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Chưa đăng nhập' };
  if (typeof noteId !== 'number' || !Number.isInteger(noteId) || noteId &lt;= 0) return { error: 'noteId không hợp lệ' };
  const { count } = await db.note.deleteMany({ where: { id: noteId, authorId: user.id } });
  console.log(&#96;[C xoaGhiChu] user \${user.id} · noteId \${noteId} · đã xoá \${count}&#96;);
  return count === 1 ? { ok: true } : { error: 'Không tìm thấy' };
}</code></pre>
<div class="out">$ goi deletePost "" '[13]'          # A, KHÔNG cookie
HTTP 500 · 1:E{"digest":"2182075609"}
$ goi deletePost 2 '[99999]'       # A, user 2, id không tồn tại
HTTP 500 · 1:E{"digest":"3918568795"}
$ goi deleteNote 2 '[12,1]'        # B: user 2 xoá #12 của user 1, tự khai userId = 1
HTTP 200 · 1:{"ok":true}
$ goi xoaGhiChu 2 '[14]'           # C: user 2 xoá #14 của user 1
HTTP 200 · 1:{"error":"Không tìm thấy"}
$ goi xoaGhiChu 2 '["14 OR 1=1"]'  # C: đầu vào rác
HTTP 200 · 1:{"error":"noteId không hợp lệ"}
$ goi xoaGhiChu 1 '[15]'           # C: user 1 xoá ghi chú của chính mình
HTTP 200 · 1:{"ok":true}
$ grep '\\[A\\|\\[B\\|\\[C\\|TypeError\\|Not auth' (log next start)
Error: Not authenticated
TypeError: Cannot read properties of null (reading 'authorId')
[B deleteNote] userId (do người gọi gửi) = 1 · xoá #12
[C xoaGhiChu] user 2 · noteId 14 · đã xoá 0
[C xoaGhiChu] user 1 · noteId 15 · đã xoá 1
CSDL còn: #13 (user 2) · #14 (user 1)</div>
<p>B đã xoá ghi chú #12 của user 1 cho user 2, chỉ vì user 2 tự khai là user 1. C từ chối ghi chú của người khác (0 hàng), chặn id rác và xoá đúng ghi chú của chủ.</p>
<p><b>Next.js tự chặn những gì</b> — <code>Origin</code> lạ, thân quá 1 MB, id không có trong bản build:</p>
<div class="out">$ goi xoaGhiChu 1 '[14]' 'Origin: http://evil.example'     # Origin lạ (trang khác gửi hộ)
HTTP 500 · 1:E{"digest":"403536267"}
$ goi xoaGhiChu 1 '[99]' 'Origin: http://localhost:19392'  # Origin khớp Host
HTTP 200 · 1:{"error":"Không tìm thấy"}
$ grep -aiE 'origin|csrf|x-forwarded-host' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -2
&#96;x-forwarded-host&#96; header with value &#96;localhost:19392&#96; does not match &#96;origin&#96; header with value &#96;evil.example&#96; from a forwarded Server Actions reques
$ node -e 'mảng 2 MB' | goi xoaGhiChu 1 -      # thân 2 MB
HTTP 500 · 1:E{"digest":"2003265017"}
$ grep -aiE 'Body exceeded|bodySizeLimit' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -2
⨯ Error: Body exceeded 1 MB limit.
To configure the body size limit for Server Actions, see: https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit
$ curl -X POST localhost:3000/xoa -H "Next-Action: 40$(id bịa 40 ký tự)"      # id không có trong sổ
HTTP 409
$ grep -aiE 'Failed to find Server Action|not found' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -1
Error: Failed to find Server Action "40aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa". This request might be from an older or newer deployment.</div>
<p>Không phép kiểm nào trong số đó biết người dùng là ai hay sở hữu gì — curl không gửi <code>Origin</code> thì đi thẳng vào A, B và C.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3000
ID=$(node -e "const m=require('./.next/server/server-reference-manifest.json'); console.log(Object.keys(m.node)[0])")
curl -X POST localhost:3000/&lt;trang&gt; -H "Next-Action: $ID" -H 'content-type: text/plain;charset=UTF-8' -b 'uid=2' -d '[12, 1]' <span class="tok-comment">  # action của bạn, đối số bất kỳ</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-3-requireauth-phan-quyen" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.3 — requireAuth và phân quyền</span><span class="lc-sub">Ai được làm gì với bản ghi nào — phía Express</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.4 — Cookie, CSRF và thu hồi</span><span class="lc-sub">Thứ mà phép kiểm Origin của Next.js chặn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-3-dau-vao-doc-hai" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 9.3 — Đầu vào độc hại</span><span class="lc-sub">Mọi đối số của action do người gọi chọn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Endpoint công khai</span><span class="v">Một action gọi được như endpoint bất kỳ — coi là input không tin được.</span></div>
  <div class="kv"><span class="k">Xác thực</span><span class="v">Xác minh người gọi là ai bên trong action.</span></div>
  <div class="kv"><span class="k">Phân quyền</span><span class="v">Xác minh họ được phép làm action này.</span></div>
  <div class="kv"><span class="k">Validate input</span><span class="v">Validate lại trên server (vd bằng Zod), không bao giờ tin UI.</span></div>
  <div class="kv"><span class="k">Kiểm ở client không phải bảo mật</span><span class="v">Guard UI bỏ qua được; server phải thực thi.</span></div>
  <div class="kv"><span class="k">Đặc quyền tối thiểu</span><span class="v">Chỉ làm đúng cái người dùng đã xác thực được phép.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một Server Action là một endpoint công khai: ai cũng gọi được, nên coi input của nó là không tin được.</li><li>Mọi action ghi đều cần xác thực, phân quyền và validate input phía server.</li><li>Guard UI không phải bảo mật — các kiểm tra phải nằm trong action trên server.</li><li>Áp đặc quyền tối thiểu: chỉ làm đúng cái người dùng đã xác thực được phép.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Bảo mật Server Actions</span><span class="lc-sub">Xác thực, phân quyền, và validate input cho action.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.6 QUIZ ─────────────────────────── */
    {
      title: '12.6 — Chapter 12 quiz|||12.6 — Kiểm tra chương 12',
      slug: 'nextjs-12-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: "Mười câu về Server Actions: 'use server', form action + FormData, progressive enhancement, revalidate sau ghi, useActionState/useFormStatus (đổi tên React 19), và bảo mật endpoint công khai. Đây là mốc PT2.",
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 12: 'use server', form actions and FormData, progressive enhancement, revalidating after a write, useActionState/useFormStatus, and treating an action as a public endpoint. This is the PT2 milestone (end of Stage 3).</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 12: 'use server', form action và FormData, progressive enhancement, revalidate sau ghi, useActionState/useFormStatus, và coi action là endpoint công khai. Đây là mốc PT2 (khép Giai đoạn 3).</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does a Server Action let you avoid compared to the classic approach?|||Server Action giúp bạn tránh gì so với cách kinh điển?',
            options: [
              'writing any server code|||viết bất kỳ code server nào',
              'building a separate API route and fetching it manually|||dựng một API route riêng và fetch nó thủ công',
              'using a database|||dùng database',
              'rendering components|||render component',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: "The 'use server' directive marks a function as…|||Chỉ thị 'use server' đánh dấu một hàm là…",
            options: [
              'a Client Component|||một Client Component',
              'a Server Action that runs on the server and can be called from React|||một Server Action chạy trên server và gọi được từ React',
              'a route handler|||một route handler',
              'a cached fetch|||một fetch đã cache',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In <form action={createPost}>, how does the action receive the fields?|||Trong <form action={createPost}>, action nhận các trường thế nào?',
            options: [
              'as React state|||dưới dạng React state',
              'as a FormData object, read via formData.get("name")|||dưới dạng một object FormData, đọc qua formData.get("name")',
              'as URL query params|||dưới dạng query param của URL',
              'it does not receive them|||nó không nhận',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is a form wired to a Server Action resilient before JS loads?|||Vì sao một form nối tới Server Action bền bỉ trước khi JS tải?',
            options: [
              'Next disables JS|||Next tắt JS',
              'it is a real <form> that can submit natively; JS only enhances it (progressive enhancement)|||nó là một <form> thật submit được theo cách gốc; JS chỉ nâng nó (progressive enhancement)',
              'actions run in the browser|||action chạy trong trình duyệt',
              'it caches the form|||nó cache form',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You create a record in an action but the list still shows the old data. Fix?|||Bạn tạo một bản ghi trong action nhưng danh sách vẫn hiện dữ liệu cũ. Chữa?',
            options: [
              'reload the browser manually|||tải lại trình duyệt thủ công',
              'call revalidatePath/revalidateTag after the write|||gọi revalidatePath/revalidateTag sau khi ghi',
              'add useEffect|||thêm useEffect',
              'nothing can be done|||không làm gì được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In React 19 / Next 15, the hook for an action\'s result + pending flag is…|||Ở React 19 / Next 15, hook cho kết quả action + cờ pending là…',
            options: [
              "useFormState from 'react-dom'|||useFormState từ 'react-dom'",
              "useActionState from 'react' (formerly useFormState)|||useActionState từ 'react' (trước là useFormState)",
              'useState|||useState',
              'useEffect|||useEffect',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A nested submit button needs to know its form is submitting. Use…|||Một nút submit lồng cần biết form của nó đang gửi. Dùng…',
            options: [
              "useFormStatus from 'react-dom'|||useFormStatus từ 'react-dom'",
              'a prop passed from the parent every time|||một prop truyền từ cha mỗi lần',
              'useRef|||useRef',
              'a global variable|||một biến toàn cục',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How should an action report a validation error like "email required"?|||Một action nên báo lỗi validation như "email bắt buộc" thế nào?',
            options: [
              'console.log it|||console.log nó',
              'return it as state (e.g. { error }) so useActionState re-renders the form|||trả nó làm state (ví dụ { error }) để useActionState render lại form',
              'ignore it|||bỏ qua',
              'redirect away|||redirect đi chỗ khác',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which statement about Server Action security is TRUE?|||Phát biểu nào về bảo mật Server Action là ĐÚNG?',
            options: [
              'the form validation and hidden button make the action safe|||validation form và nút ẩn làm action an toàn',
              'it is a public endpoint; you must authenticate, authorise, and validate input inside the action|||nó là endpoint công khai; bạn phải xác thực, phân quyền, và validate input bên trong action',
              'only logged-in users can call it automatically|||chỉ người đã đăng nhập tự động gọi được',
              'client checks are sufficient|||kiểm tra phía client là đủ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An attacker calls your deletePost action directly, skipping the UI. What protects the data?|||Kẻ tấn công gọi thẳng action deletePost của bạn, bỏ qua UI. Điều gì bảo vệ dữ liệu?',
            options: [
              'the hidden delete button|||nút xoá bị ẩn',
              'server-side auth + ownership checks inside the action|||kiểm xác thực + quyền sở hữu phía server bên trong action',
              'client-side validation|||validation phía client',
              'nothing is needed|||không cần gì',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
