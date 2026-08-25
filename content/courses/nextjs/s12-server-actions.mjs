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

<h3>What happens when you call a Server Action</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>You mark a function &#96;&#39;use server&#39;&#96;</b> — Either at the top of the function or at the top of a file that exports only actions.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React sends a reference, not the code</b> — The client bundle gets an id. The function body stays on the server, so it can query the database and read secrets.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Calling it makes a POST</b> — To the current route, handled by the framework. You never write a fetch, a URL, or a JSON body.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>It can revalidate before returning</b> — &#96;revalidatePath(&#39;/notes&#39;)&#96; in the same function invalidates both the server caches and the client router cache.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — treating a Server Action as private because it is not an API route.</strong> It is a public HTTP endpoint. The id is in the client bundle, so anyone can call the action directly with a crafted request — no button, no form, no UI validation. Nothing in the code looks like a route, which is exactly why this is missed: an action that deletes a note looks like a local function call, and reads like trusted code. Every action needs the same checks a route handler needs: is the caller authenticated, are they allowed to touch this record, and is the input valid. Lesson 12.5 is entirely about this.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions and mutations</span><span class="lc-sub">The full model: declaration, invocation, revalidation and the security notes.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-server" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use server'</span><span class="lc-sub">The directive itself, and what React guarantees about the boundary.</span></span>
</a>

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

<h3>Chuyện gì xảy ra khi bạn gọi một Server Action</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Bạn đánh dấu một hàm &#96;&#39;use server&#39;&#96;</b> — Hoặc ở đầu hàm, hoặc ở đầu một file chỉ export các action.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>React gửi một tham chiếu, không gửi mã</b> — Gói phía client chỉ nhận một id. Thân hàm ở lại máy chủ, nên nó truy vấn được cơ sở dữ liệu và đọc được bí mật.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Gọi nó là tạo ra một POST</b> — Tới chính route hiện tại, do framework xử lý. Bạn chẳng phải viết một phép fetch, một URL, hay một thân JSON nào.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó làm mới được trước khi trả về</b> — &#96;revalidatePath(&#39;/notes&#39;)&#96; ngay trong hàm đó vô hiệu hoá cả lớp đệm phía máy chủ lẫn router cache phía client.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — coi một Server Action là riêng tư chỉ vì nó không phải một route API.</strong> Nó LÀ một endpoint HTTP công khai. Cái id nằm trong gói phía client, nên ai cũng gọi thẳng action đó được bằng một request tự soạn — không cần nút, không cần form, không qua phép kiểm nào của giao diện. Chẳng có gì trong mã trông giống một route, và đó chính là lý do người ta bỏ sót: một action xoá ghi chú nhìn như một lời gọi hàm cục bộ, và đọc lên như mã đáng tin. Mọi action đều cần đúng những phép kiểm mà một route handler cần: người gọi đã xác thực chưa, họ có được phép đụng vào bản ghi này không, và đầu vào có hợp lệ không. Bài 12.5 nói trọn vẹn về chuyện này.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Action và phép ghi</span><span class="lc-sub">Toàn bộ mô hình: khai báo, lời gọi, làm mới và các ghi chú an toàn.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/rsc/use-server" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">react.dev — 'use server'</span><span class="lc-sub">Bản thân chỉ thị đó, và React bảo đảm gì về cái ranh giới.</span></span>
</a>

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

<h3>A form that works without JavaScript</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Pass the action to the form</b> — &#96;&lt;form action={createNote}&gt;&#96;. No &#96;onSubmit&#96;, no &#96;preventDefault&#96;, no fetch.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The action receives FormData</b> — &#96;formData.get(&#39;title&#39;)&#96;. Every field with a &#96;name&#96; is included — the same rule as a plain HTML form.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It works before hydration</b> — If the JavaScript has not loaded yet, the browser does a normal form POST and the action still runs. This is progressive enhancement, for free.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Everything is a string</b> — &#96;FormData&#96; values are text. A number, a boolean or a date needs converting and validating — chapter 16 does this with Zod.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — an input with no &#96;name&#96;, silently missing from the submission.</strong> &#96;&lt;input value={title} onChange={…} /&gt;&#96; is a perfectly good controlled input and contributes nothing to &#96;FormData&#96;: only named fields are collected. So the action receives &#96;null&#96; for the title, and your validation reports &quot;title is required&quot; for a form that visibly contains one — which sends people looking at the validation code. The same applies to a checkbox, where an unchecked box is absent entirely rather than &#96;false&#96;. When a form action gets nothing, check the &#96;name&#96; attributes before anything else; it is the fastest thing to rule out.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — form</span><span class="lc-sub">The action prop, FormData, and the pending states it enables.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">How fields are collected, including the checkbox and multi-select cases.</span></span>
</a>

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

<h3>Một form chạy được cả khi không có JavaScript</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Truyền action vào thẻ form</b> — &#96;&lt;form action={createNote}&gt;&#96;. Không &#96;onSubmit&#96;, không &#96;preventDefault&#96;, không fetch.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Action nhận vào FormData</b> — &#96;formData.get(&#39;title&#39;)&#96;. Mọi trường có &#96;name&#96; đều được gom — cùng luật với một form HTML thuần.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó chạy được trước khi hydrate</b> — Nếu JavaScript chưa tải xong, trình duyệt gửi một POST form bình thường và action vẫn chạy. Đây là cải tiến tiệm tiến, miễn phí.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Mọi thứ đều là chuỗi</b> — Giá trị trong &#96;FormData&#96; là chữ. Một con số, một boolean hay một ngày đều cần chuyển đổi và kiểm — chương 16 làm việc này bằng Zod.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một ô nhập thiếu &#96;name&#96;, vắng mặt lặng lẽ khỏi phép gửi.</strong> &#96;&lt;input value={title} onChange={…} /&gt;&#96; là một ô nhập có kiểm soát hoàn toàn ổn và nó đóng góp con số không vào &#96;FormData&#96;: chỉ những trường có tên mới được gom. Nên action nhận &#96;null&#96; cho tiêu đề, và phần kiểm dữ liệu của bạn báo &quot;thiếu title&quot; cho một form rành rành có tiêu đề — khiến người ta đi soi đoạn mã kiểm dữ liệu. Chuyện tương tự với một ô tích, nơi một ô chưa tích thì VẮNG HẲN chứ không phải là &#96;false&#96;. Khi một form action chẳng nhận được gì, hãy kiểm các thuộc tính &#96;name&#96; trước tiên; đó là thứ loại trừ nhanh nhất.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">react.dev — form</span><span class="lc-sub">Prop action, FormData, và các trạng thái đang-gửi mà nó mở ra.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData</span><span class="lc-sub">Các trường được gom thế nào, gồm cả trường hợp ô tích và chọn nhiều.</span></span>
</a>

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

<h3>Making the screen match the database after a write</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Write, then revalidate, then return</b> — &#96;await db.note.create(...)&#96;, &#96;revalidatePath(&#39;/notes&#39;)&#96;, and the list re-renders with the new row.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>revalidatePath for a URL</b> — Clears the cached render of that path. Use the route pattern for dynamic segments: &#96;revalidatePath(&#39;/notes/[id]&#39;, &#39;page&#39;)&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>revalidateTag for a set of fetches</b> — Tag them at fetch time (&#96;next: { tags: [&#39;notes&#39;] }&#96;) and clear them all by name — better when the same data appears on several routes.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>redirect() after a create</b> — Called at the end of the action. It throws, so nothing after it runs.</div></div>
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

<h3>Làm cho màn hình khớp với cơ sở dữ liệu sau một lần ghi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ghi, rồi làm mới, rồi trả về</b> — &#96;await db.note.create(...)&#96;, &#96;revalidatePath(&#39;/notes&#39;)&#96;, và danh sách vẽ lại với dòng mới.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>revalidatePath cho một URL</b> — Xoá bản đã vẽ trong đệm của đường dẫn đó. Với đoạn động thì dùng mẫu route: &#96;revalidatePath(&#39;/notes/[id]&#39;, &#39;page&#39;)&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>revalidateTag cho một nhóm phép fetch</b> — Gắn thẻ lúc fetch (&#96;next: { tags: [&#39;notes&#39;] }&#96;) rồi xoá tất cả theo tên — tốt hơn khi cùng một dữ liệu xuất hiện trên nhiều route.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>redirect() sau khi tạo</b> — Gọi ở cuối action. Nó ném lỗi, nên không gì sau nó chạy.</div></div>
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

<h3>Showing progress and errors from an action</h3>
<div class="lz-map">
  <div class="lz-stage">Two hooks, two different questions</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useActionState</div><div class="lz-nsub">Wraps the action and gives you back its return value plus a pending flag. This is where validation errors come back to the form.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useFormStatus</div><div class="lz-nsub">Read from a child of the form — usually the submit button. It knows whether the enclosing form is submitting.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">It must be a child</div><div class="lz-nsub">&#96;useFormStatus&#96; reads context from the form above it. Called in the same component that renders &#96;&lt;form&gt;&#96;, it always returns false.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Return errors, do not throw them</div><div class="lz-nsub">An action that throws produces an error boundary. Returning &#96;{ error: &#39;Title is required&#39; }&#96; lets the form display it in place.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — &#96;useFormStatus&#96; called in the component that renders the form, always reporting &#96;pending: false&#96;.</strong> The hook reads a context provided by the &#96;&lt;form&gt;&#96; element, so it only sees a submission from <em>inside</em> that form. In the parent — the component that writes &#96;&lt;form action={…}&gt;&#96; — there is no such context, so &#96;pending&#96; never becomes true, the button never disables, and a double-click sends the action twice. The fix is structural, not logical: extract the submit button into its own small Client Component and call the hook there. The docs say this explicitly, and it is the single most common report about the hook.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — useFormStatus</span><span class="lc-sub">The parent-child rule, spelled out, with the recommended button component.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react.dev — useActionState</span><span class="lc-sub">State, pending and the action signature it expects.</span></span>
</a>

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

<h3>Hiện tiến trình và lỗi từ một action</h3>
<div class="lz-map">
  <div class="lz-stage">Hai hook, hai câu hỏi khác nhau</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">useActionState</div><div class="lz-nsub">Bọc lấy action rồi trả về giá trị nó trả về cộng một cờ đang-chạy. Đây là chỗ lỗi kiểm dữ liệu quay về với form.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">useFormStatus</div><div class="lz-nsub">Đọc từ một đứa con của form — thường là cái nút gửi. Nó biết cái form bao quanh có đang gửi hay không.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nó phải là một đứa CON</div><div class="lz-nsub">&#96;useFormStatus&#96; đọc context từ cái form ở trên nó. Gọi trong chính component vẽ ra &#96;&lt;form&gt;&#96; thì nó luôn trả về false.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Hãy TRẢ VỀ lỗi, đừng ném lỗi</div><div class="lz-nsub">Một action ném lỗi sẽ kích hoạt ranh giới lỗi. Trả về &#96;{ error: &#39;Thiếu tiêu đề&#39; }&#96; cho phép form hiện nó ra ngay tại chỗ.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gọi &#96;useFormStatus&#96; ngay trong component vẽ ra form, và nó luôn báo &#96;pending: false&#96;.</strong> Hook này đọc một context do chính phần tử &#96;&lt;form&gt;&#96; cung cấp, nên nó chỉ thấy được một lần gửi từ <em>bên trong</em> cái form đó. Ở phần tử cha — component viết ra &#96;&lt;form action={…}&gt;&#96; — chẳng có context nào như thế, nên &#96;pending&#96; không bao giờ thành true, cái nút không bao giờ bị khoá, và một cú bấm đúp gửi action hai lần. Cách chữa là về cấu trúc chứ không phải về logic: hãy rút cái nút gửi ra thành một Client Component nhỏ riêng rồi gọi hook ở đó. Tài liệu nói thẳng điều này, và nó là báo cáo phổ biến nhất về cái hook này.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react-dom/hooks/useFormStatus" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — useFormStatus</span><span class="lc-sub">Luật cha-con, nói rõ ra, kèm component nút gửi được khuyến nghị.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useActionState" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react.dev — useActionState</span><span class="lc-sub">State, cờ đang-chạy và chữ ký action mà nó mong đợi.</span></span>
</a>

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

<h3>The four checks every Server Action needs</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Who is calling?</b> — Read the session on the server, inside the action. Never trust a user id passed in as an argument — the caller chooses those.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>May they touch this record?</b> — Scope the query to the caller: &#96;where: { id, userId: session.user.id }&#96;. Look it up scoped rather than looking it up and then checking.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Is the input valid?</b> — Parse the &#96;FormData&#96; with a schema. Everything arriving is attacker-controlled text, including hidden fields and select values.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Should it be rate-limited?</b> — An action is a public endpoint. Anything that sends mail, costs money, or can be enumerated needs a limit.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — an action that takes the user id as a parameter.</strong> &#96;async function deleteNote(noteId, userId)&#96; looks harmless because the only caller is your own form, which passes the logged-in user&#39;s id. But the action is a public endpoint and the caller controls every argument: a crafted request can pass any pair of ids it likes, and the action will happily delete someone else&#39;s note while looking perfectly correct in code review. Read the identity from the session inside the action, never from an argument. The same applies to a price, a role, or a status passed from the client — if the server needs to trust it, the server has to derive it.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#security" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Action security</span><span class="lc-sub">Authentication, authorisation, and the closure-capture caveat.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">OWASP — Authorization Cheat Sheet</span><span class="lc-sub">The general rule this lesson is a special case of: check on every request, at the resource.</span></span>
</a>

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

<h3>Bốn phép kiểm mà mọi Server Action đều cần</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ai đang gọi?</b> — Hãy đọc phiên đăng nhập ở phía máy chủ, ngay trong action. Đừng bao giờ tin một id người dùng truyền vào làm đối số — người gọi tự chọn những thứ đó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Họ có được đụng vào bản ghi này không?</b> — Hãy giới hạn truy vấn theo người gọi: &#96;where: { id, userId: session.user.id }&#96;. Tra trong phạm vi, chứ đừng tra ra rồi mới đi kiểm.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Đầu vào có hợp lệ không?</b> — Hãy phân tích &#96;FormData&#96; bằng một schema. Mọi thứ đi tới đều là chữ do kẻ tấn công điều khiển, kể cả trường ẩn và giá trị của select.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Có cần giới hạn tần suất không?</b> — Một action là một endpoint công khai. Bất cứ thứ gì gửi thư, tốn tiền, hay có thể bị dò tuần tự đều cần một giới hạn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một action nhận id người dùng làm tham số.</strong> &#96;async function deleteNote(noteId, userId)&#96; nhìn vô hại vì chỗ gọi duy nhất là form của chính bạn, vốn truyền id của người đang đăng nhập. Nhưng action là một endpoint công khai và người gọi điều khiển mọi đối số: một request tự soạn truyền được bất kỳ cặp id nào nó thích, và action sẽ vui vẻ xoá ghi chú của người khác trong khi trông hoàn toàn đúng đắn lúc review mã. Hãy đọc danh tính từ phiên đăng nhập ngay trong action, đừng bao giờ đọc từ một đối số. Chuyện tương tự với một mức giá, một vai trò, hay một trạng thái truyền từ client — nếu máy chủ cần tin nó thì máy chủ phải tự suy ra nó.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#security" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — An toàn cho Server Action</span><span class="lc-sub">Xác thực, phân quyền, và lưu ý về việc closure bắt giá trị.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">OWASP — Authorization Cheat Sheet</span><span class="lc-sub">Luật tổng quát mà bài này là một ca riêng: kiểm ở mọi request, ngay tại tài nguyên.</span></span>
</a>

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
