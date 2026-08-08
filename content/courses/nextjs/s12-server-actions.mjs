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
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1 · Stage 3 finale</span>
<h2>A function that runs on the server, called like a normal function</h2>
<p class="lead">Chapters 8–11 were about reading data and routing. This chapter is about <em>writing</em> — creating, updating, deleting. The classic way is: build an API endpoint, then <code>fetch</code> it from the client with the right method, headers and body. Server Actions collapse all of that into a single server function you call directly.</p>

<h3>The 'use server' directive</h3>
<pre><code><span class="tok-comment">// A Server Action — note the directive INSIDE the function</span>
async function createPost(formData) {
  'use server';
  const title = formData.get('title');
  await db.post.create({ data: { title } });
}</code></pre>
<p><code>'use server'</code> marks the function as a Server Action. It is the mirror of <code>'use client'</code>: that one pushed a component to the browser; this one guarantees a function runs on the server. You can put the directive at the top of a whole file to make every exported function an action, or inside a single function (often inside a Server Component).</p>

<h3>Two ways to call it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">From a form</span><span class="v">Pass it to a form's <code>action</code> prop: <code>&lt;form action={createPost}&gt;</code>. On submit, the form's data is sent to the action automatically — the next lesson.</span></div>
  <div class="kv"><span class="k">From client code</span><span class="v">Import the action into a Client Component and call it like any async function (e.g. in an <code>onClick</code>). Under the hood Next.js issues a POST for you.</span></div>
</div>

<h3>Why this matters</h3>
<p>No route file, no method/URL to keep in sync, no manual <code>fetch</code> with headers and JSON. The action is co-located with the UI that uses it, and it is type-checked end to end — the argument you pass is the argument the server receives. It is the App Router's answer to "how do I change data" the way Server Components answered "how do I read data."</p>

<div class="callout warn">
<p><strong>It is not magic — it is a network call.</strong> Calling a Server Action still crosses to the server behind the scenes. So its argument must be serializable (Chapter 9's rule), it is asynchronous, and — critically — it is a real, reachable endpoint that you must secure. Lesson 12.5 is entirely about that.</p>
</div>

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
<pre><code><span class="tok-comment">// Một Server Action — để ý chỉ thị BÊN TRONG hàm</span>
async function createPost(formData) {
  'use server';
  const title = formData.get('title');
  await db.post.create({ data: { title } });
}</code></pre>
<p><code>'use server'</code> đánh dấu hàm là một Server Action. Nó là tấm gương của <code>'use client'</code>: cái kia đẩy một component ra trình duyệt; cái này bảo đảm một hàm chạy trên server. Bạn có thể đặt chỉ thị ở đầu cả một file để mọi hàm export thành action, hoặc bên trong một hàm đơn lẻ (thường trong một Server Component).</p>

<h3>Hai cách gọi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Từ một form</span><span class="v">Truyền nó cho prop <code>action</code> của form: <code>&lt;form action={createPost}&gt;</code>. Khi submit, dữ liệu form tự được gửi tới action — bài sau.</span></div>
  <div class="kv"><span class="k">Từ code client</span><span class="v">Import action vào một Client Component và gọi nó như hàm async bất kỳ (ví dụ trong một <code>onClick</code>). Bên dưới Next.js tự phát một POST giúp bạn.</span></div>
</div>

<h3>Vì sao điều này quan trọng</h3>
<p>Không file route, không method/URL phải giữ đồng bộ, không <code>fetch</code> thủ công với header và JSON. Action nằm cùng chỗ với UI dùng nó, và được kiểm kiểu từ đầu tới cuối — tham số bạn truyền là tham số server nhận. Đó là câu trả lời của App Router cho "làm sao đổi dữ liệu", đúng như Server Component trả lời "làm sao đọc dữ liệu".</p>

<div class="callout warn">
<p><strong>Nó không phải phép màu — nó là một cú gọi mạng.</strong> Gọi một Server Action vẫn vượt sang server ở hậu trường. Nên tham số của nó phải serialize được (luật Chương 9), nó bất đồng bộ, và — quan trọng nhất — nó là một endpoint thật, tới được, mà bạn phải bảo vệ. Bài 12.5 dành trọn cho điều đó.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Wire a form straight to the server</h2>
<p class="lead">The cleanest way to use a Server Action is through a form. Pass the action to the form's <code>action</code> prop; on submit, the browser packages the fields into a <code>FormData</code> and the action receives it on the server. No <code>onSubmit</code>, no state, no fetch.</p>

<pre><code><span class="tok-comment">// app/posts/new/page.tsx — a Server Component</span>
export default function NewPost() {
  async function createPost(formData) {
    'use server';
    const title = formData.get('title');       <span class="tok-comment">// read by input name</span>
    const body  = formData.get('body');
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

<h3>Progressive enhancement: it works before JS loads</h3>
<p>Because the action is attached to a real <code>&lt;form&gt;</code>, the browser can submit it the native way even if JavaScript has not loaded or is disabled. When JS is present, Next.js enhances the submit into a smooth client transition; when it is not, the plain HTML form still posts and works. You get resilience for free — something a hand-written <code>onClick</code>+<code>fetch</code> never gives you.</p>

<div class="callout ok">
<p><strong>Passing extra arguments:</strong> to give an action data that is not a form field — say the id of the item being edited — use <code>bind</code>: <code>action={updatePost.bind(null, post.id)}</code>. The bound value arrives as the first argument, with <code>formData</code> after it. This keeps ids out of hidden inputs where users could tamper with them.</p>
</div>

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

<pre><code><span class="tok-comment">// app/posts/new/page.tsx — một Server Component</span>
export default function NewPost() {
  async function createPost(formData) {
    'use server';
    const title = formData.get('title');       <span class="tok-comment">// đọc theo name của input</span>
    const body  = formData.get('body');
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

<h3>Progressive enhancement: chạy cả trước khi JS tải</h3>
<p>Vì action gắn vào một <code>&lt;form&gt;</code> thật, trình duyệt có thể submit nó theo cách gốc kể cả khi JavaScript chưa tải hoặc bị tắt. Khi có JS, Next.js nâng cú submit thành một chuyển cảnh client mượt; khi không, form HTML thuần vẫn post và chạy. Bạn được sự bền bỉ miễn phí — thứ mà một <code>onClick</code>+<code>fetch</code> viết tay không bao giờ cho.</p>

<div class="callout ok">
<p><strong>Truyền tham số thêm:</strong> để đưa cho action dữ liệu không phải trường form — ví dụ id của mục đang sửa — dùng <code>bind</code>: <code>action={updatePost.bind(null, post.id)}</code>. Giá trị bind tới làm tham số đầu tiên, còn <code>formData</code> sau nó. Cách này giữ id ra khỏi các hidden input nơi người dùng có thể sửa lén.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>A write is only half done until the cache knows</h2>
<p class="lead">You create a post in a Server Action, redirect to the list — and the new post is missing. Nothing failed: the list was cached (Chapter 10), and your write did not tell the cache to let go. The mutation and the revalidation are two halves of one cycle.</p>

<pre><code>import { revalidatePath, revalidateTag } from 'next/cache';

async function createPost(formData) {
  'use server';
  await db.post.create({ data: { title: formData.get('title') } });

  revalidatePath('/posts');     <span class="tok-comment">// the list route is now stale → refetch</span>
  <span class="tok-comment">// or, if the fetch was tagged:</span>
  revalidateTag('posts');       <span class="tok-comment">// every fetch tagged 'posts' is stale</span>
}</code></pre>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">The action writes to the database.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">It calls <code>revalidatePath</code>/<code>revalidateTag</code> to mark the affected data stale.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Next re-fetches on the next render, and the UI shows the new state — no manual client update.</div></div>
</div>

<div class="kv-grid">
  <div class="kv"><span class="k">revalidatePath('/posts')</span><span class="v">Invalidate a specific route's cached data. Simple and direct when you know the URL affected.</span></div>
  <div class="kv"><span class="k">revalidateTag('posts')</span><span class="v">Invalidate every fetch you tagged <code>'posts'</code>, wherever it lives. Better when the same data feeds several pages.</span></div>
</div>

<div class="callout ok">
<p><strong>Contrast with a classic SPA:</strong> there you would manually update local state after the write, or refetch and setState, and keep client and server in sync by hand. Here the source of truth is the server cache; you invalidate it and let the framework re-render. Fewer places for the two to drift apart.</p>
</div>

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

<pre><code>import { revalidatePath, revalidateTag } from 'next/cache';

async function createPost(formData) {
  'use server';
  await db.post.create({ data: { title: formData.get('title') } });

  revalidatePath('/posts');     <span class="tok-comment">// route danh sách giờ đã cũ → fetch lại</span>
  <span class="tok-comment">// hoặc, nếu fetch đã gắn thẻ:</span>
  revalidateTag('posts');       <span class="tok-comment">// mọi fetch gắn thẻ 'posts' đã cũ</span>
}</code></pre>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Action ghi vào database.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Nó gọi <code>revalidatePath</code>/<code>revalidateTag</code> để đánh dấu dữ liệu bị ảnh hưởng là cũ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Next fetch lại ở lần render kế, và UI hiện trạng thái mới — không cần cập nhật client thủ công.</div></div>
</div>

<div class="kv-grid">
  <div class="kv"><span class="k">revalidatePath('/posts')</span><span class="v">Vô hiệu hoá dữ liệu cache của một route cụ thể. Đơn giản và trực tiếp khi bạn biết URL bị ảnh hưởng.</span></div>
  <div class="kv"><span class="k">revalidateTag('posts')</span><span class="v">Vô hiệu hoá mọi fetch bạn gắn thẻ <code>'posts'</code>, ở bất cứ đâu. Tốt hơn khi cùng dữ liệu nuôi nhiều trang.</span></div>
</div>

<div class="callout ok">
<p><strong>Đối chiếu với SPA kinh điển:</strong> ở đó bạn sẽ cập nhật state cục bộ thủ công sau khi ghi, hoặc fetch lại rồi setState, và giữ client với server đồng bộ bằng tay. Ở đây nguồn sự thật là cache server; bạn vô hiệu hoá nó và để framework render lại. Ít chỗ để hai bên trôi lệch nhau.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Show progress and validation errors, cleanly</h2>
<p class="lead">A real form needs to disable its button while submitting and show "email is required" when the server rejects. React gives two hooks for exactly this. Both are Client Component hooks, so the interactive form lives in a <code>'use client'</code> component while the action stays on the server.</p>

<div class="callout warn">
<p><strong>Naming changed in React 19</strong> (which Next.js 15 uses): the hook once called <code>useFormState</code> is now <code>useActionState</code>, and it is imported from <code>'react'</code> (not <code>'react-dom'</code>). <code>useFormStatus</code> keeps its name and stays in <code>'react-dom'</code>. If a tutorial shows <code>useFormState</code>, it is the old name for <code>useActionState</code>.</p>
</div>

<h3>useActionState — carry the action's result and a pending flag</h3>
<pre><code>'use client';
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

<h3>useFormStatus — for a child button</h3>
<pre><code>'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();          <span class="tok-comment">// reads the ENCLOSING form</span>
  return &lt;button disabled={pending}&gt;{pending ? 'Saving…' : 'Save'}&lt;/button&gt;;
}</code></pre>
<p>Use this when a reusable submit button, nested inside the form, needs to know the form is submitting without the parent passing a prop down. It reads the status of the form it sits within.</p>

<div class="callout ok">
<p><strong>Optimistic UI:</strong> for instant feedback (a like count bumping before the server confirms), React's <code>useOptimistic</code> pairs naturally with actions — show the expected result immediately, reconcile when the action resolves. Reach for it once the basics above feel comfortable.</p>
</div>

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
<p><strong>Tên đã đổi ở React 19</strong> (bản Next.js 15 dùng): hook từng gọi là <code>useFormState</code> nay là <code>useActionState</code>, và import từ <code>'react'</code> (không phải <code>'react-dom'</code>). <code>useFormStatus</code> giữ tên và ở lại <code>'react-dom'</code>. Nếu một hướng dẫn hiện <code>useFormState</code>, đó là tên cũ của <code>useActionState</code>.</p>
</div>

<h3>useActionState — mang kết quả action và một cờ pending</h3>
<pre><code>'use client';
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

<h3>useFormStatus — cho một nút con</h3>
<pre><code>'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();          <span class="tok-comment">// đọc form BAO QUANH</span>
  return &lt;button disabled={pending}&gt;{pending ? 'Đang lưu…' : 'Lưu'}&lt;/button&gt;;
}</code></pre>
<p>Dùng khi một nút submit tái sử dụng, lồng trong form, cần biết form đang gửi mà không cần cha truyền prop xuống. Nó đọc trạng thái của chính form nó nằm trong.</p>

<div class="callout ok">
<p><strong>UI lạc quan (optimistic):</strong> để phản hồi tức thì (số like nhảy trước khi server xác nhận), <code>useOptimistic</code> của React ghép tự nhiên với action — hiện kết quả kỳ vọng ngay, đối chiếu lại khi action xong. Hãy dùng khi những điều cơ bản ở trên đã thấy quen.</p>
</div>

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

<pre><code>async function deletePost(postId) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');            <span class="tok-comment">// authn</span>

  const post = await db.post.findUnique({ where: { id: postId } });
  if (post.authorId !== user.id) throw new Error('Forbidden'); <span class="tok-comment">// authz</span>

  await db.post.delete({ where: { id: postId } });
}</code></pre>

<div class="note-ct">
<p><strong>This is a lesson cuongthai.com has paid for.</strong> The project's security reviews repeatedly turned up the same class of bug on write paths — endpoints (uploads, sockets) that trusted the client instead of re-checking authorisation and validating input on the server, and had to be patched. A Server Action is exactly such a write path. The rule that came out of it: validate and authorise on the server, on every mutation, every time — the pretty form in front of it changes nothing about who can reach the endpoint behind it.</p>
</div>

<div class="callout warn">
<p><strong>Also:</strong> only export functions that are meant to be actions from a <code>'use server'</code> file — every export there becomes a callable endpoint. Do not put helper functions you did not mean to expose in the same module.</p>
</div>

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

<pre><code>async function deletePost(postId) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Chưa xác thực');                 <span class="tok-comment">// authn</span>

  const post = await db.post.findUnique({ where: { id: postId } });
  if (post.authorId !== user.id) throw new Error('Cấm');       <span class="tok-comment">// authz</span>

  await db.post.delete({ where: { id: postId } });
}</code></pre>

<div class="note-ct">
<p><strong>Đây là bài học cuongthai.com đã trả giá.</strong> Các đợt rà soát bảo mật của dự án lặp đi lặp lại đúng một loại lỗi trên các đường ghi — endpoint (upload, socket) tin client thay vì kiểm lại phân quyền và validate input trên server, và phải vá lại. Một Server Action chính xác là một đường ghi như vậy. Quy tắc rút ra: validate và phân quyền trên server, ở mọi mutation, mọi lúc — cái form đẹp trước nó không thay đổi gì về việc ai tới được endpoint phía sau nó.</p>
</div>

<div class="callout warn">
<p><strong>Còn nữa:</strong> chỉ export những hàm định làm action từ một file <code>'use server'</code> — mọi export ở đó thành một endpoint gọi được. Đừng để những hàm phụ bạn không định phơi bày trong cùng module.</p>
</div>

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
