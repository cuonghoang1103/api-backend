/**
 * Next.js & React — Chương 16: Form, validation & upload file. KHÉP GIAI ĐOẠN 4.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần kỹ thuật form/upload — không có output console để chạy. Sự cố THẬT
 * cuongthai.com: getMediaUrl ghép CDN base vào blob:/data: preview URL làm hỏng
 * ảnh xem trước; các đợt vá lỗ hổng upload (validate type/size/auth ở server, R2).
 * Lồng vào .note-ct/.pitfall.
 */

export default {
  title: 'Chapter 16 — Forms, validation, and file uploads|||Chương 16 — Form, validation và upload file',
  description: 'Hai cách làm form (Server Action và react-hook-form), validation bằng Zod với MỘT schema dùng cả client lẫn server, và upload file lên storage (R2/S3) — kèm bẫy preview blob:/data: và luật bảo mật upload thật của cuongthai.com.',
  lessons: [
    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: '16.1 — Two ways to build a form|||16.1 — Hai cách dựng một form',
      slug: 'nextjs-16-1-hai-cach-form',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Form Validation in Next.js with React Hook Form & Zod" — Code With Joel (oEmbed verified).
      video: { url: 'https://youtu.be/T5n7dsQxVnE', durationSeconds: 0 },
      description: 'App Router cho hai cách làm form: form gắn thẳng Server Action (Chương 12) và form phía client với react-hook-form. Bài này so sánh và chỉ khi nào dùng cái nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Server Action forms vs client forms — pick by need</h2>
<p class="lead">You have already built one kind of form: a <code>&lt;form action={serverAction}&gt;</code> in Chapter 12, which submits straight to the server with progressive enhancement. This chapter adds the other kind — rich client-side forms with <strong>react-hook-form</strong> — and shows where each fits.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server Action form</span><span class="v">Great for straightforward submits and mutations: works without JS, minimal client code, validation and write on the server. The default for "submit this data."</span></div>
  <div class="kv"><span class="k">react-hook-form (client)</span><span class="v">Great for rich interactivity: instant field-level validation, dynamic/array fields, multi-step wizards, live formatting. When the form itself is a mini-app.</span></div>
</div>

<h3>They are not mutually exclusive</h3>
<p>A common, strong combination: use react-hook-form for the client experience (instant validation, good UX), and still submit to a Server Action for the write — with the <em>same</em> Zod schema validating on both sides (lesson 16.3). Client validation is for fast feedback; server validation is the one that actually protects you (the Chapter 12 rule, again).</p>

<h3>The rule of thumb</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Simple submit / mutation, want it to work without JS → <b>Server Action form</b>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Complex, highly interactive form → <b>react-hook-form</b>, submitting to an action or route handler.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Either way → <b>validate on the server</b>, and prefer one shared schema.</div></div>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react-hook-form.com/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — Get Started</span><span class="lc-sub">register, handleSubmit, and the uncontrolled approach.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Form Server Action vs form client — chọn theo nhu cầu</h2>
<p class="lead">Bạn đã dựng một kiểu form: một <code>&lt;form action={serverAction}&gt;</code> ở Chương 12, submit thẳng tới server với progressive enhancement. Chương này thêm kiểu còn lại — form phía client phong phú với <strong>react-hook-form</strong> — và chỉ chỗ mỗi cái hợp.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Form Server Action</span><span class="v">Tuyệt cho submit và mutation đơn giản: chạy được không cần JS, ít code client, validation và ghi trên server. Mặc định cho "gửi dữ liệu này".</span></div>
  <div class="kv"><span class="k">react-hook-form (client)</span><span class="v">Tuyệt cho tương tác phong phú: validation tức thì theo trường, trường động/mảng, wizard nhiều bước, định dạng trực tiếp. Khi bản thân form là một app nhỏ.</span></div>
</div>

<h3>Chúng không loại trừ nhau</h3>
<p>Một kết hợp phổ biến, mạnh: dùng react-hook-form cho trải nghiệm client (validation tức thì, UX tốt), và vẫn submit tới một Server Action để ghi — với <em>cùng</em> một schema Zod validate cả hai phía (bài 16.3). Validation client để phản hồi nhanh; validation server mới là cái thật sự bảo vệ bạn (lại quy tắc Chương 12).</p>

<h3>Quy tắc ngón tay cái</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Submit / mutation đơn giản, muốn chạy không cần JS → <b>form Server Action</b>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Form phức tạp, tương tác cao → <b>react-hook-form</b>, submit tới một action hoặc route handler.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Kiểu nào cũng → <b>validate trên server</b>, và ưu tiên một schema dùng chung.</div></div>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react-hook-form.com/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — Get Started</span><span class="lc-sub">register, handleSubmit, và cách uncontrolled.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: '16.2 — react-hook-form: fast client forms|||16.2 — react-hook-form: form client nhanh',
      slug: 'nextjs-16-2-react-hook-form',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'react-hook-form dùng input không-kiểm-soát (uncontrolled) qua register(), nên gõ không làm render lại cả form — nhanh hơn hẳn cách value+onChange của Chương 4. handleSubmit, formState.errors, và Controller.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>Less re-rendering, less boilerplate</h2>
<p class="lead">In Chapter 4 you built controlled inputs — every keystroke set state and re-rendered. That is fine for a field or two; for a large form it re-renders the whole thing on every key. react-hook-form takes the <em>uncontrolled</em> approach: inputs keep their own value in the DOM, and the library reads them on submit.</p>

<pre><code>'use client';
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) =&gt; console.log(data);   <span class="tok-comment">// { email, password }</span>

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('email', { required: 'Email is required' })} /&gt;
      {errors.email &amp;&amp; &lt;p&gt;{errors.email.message}&lt;/p&gt;}
      &lt;input type="password" {...register('password')} /&gt;
      &lt;button&gt;Sign up&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">register('name')</span><span class="v">Wires an input to the form. Typing does not re-render the component — the big performance win over controlled inputs.</span></div>
  <div class="kv"><span class="k">handleSubmit</span><span class="v">Collects all values, runs validation, and calls your handler with a clean data object only if valid.</span></div>
  <div class="kv"><span class="k">formState.errors</span><span class="v">Per-field error messages to render inline.</span></div>
  <div class="kv"><span class="k">Controller</span><span class="v">A bridge for controlled components (a custom Select, a date picker) that cannot be plain uncontrolled inputs.</span></div>
</div>

<div class="callout ok">
<p><strong>Why it feels faster:</strong> because keystrokes do not flow through React state, a 20-field form does not re-render on every character. You get validation, error handling, and submit orchestration while typing stays cheap. For non-trivial forms this is the default choice.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react-hook-form.com/docs/useform" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — useForm</span><span class="lc-sub">register, handleSubmit, formState, and Controller.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Render lại ít hơn, ít rườm rà hơn</h2>
<p class="lead">Ở Chương 4 bạn dựng input có-kiểm-soát — mỗi phím set state và render lại. Ổn với một hai trường; với một form lớn nó render lại cả form ở mỗi phím. react-hook-form dùng cách <em>uncontrolled</em>: input tự giữ giá trị trong DOM, và thư viện đọc chúng lúc submit.</p>

<pre><code>'use client';
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) =&gt; console.log(data);   <span class="tok-comment">// { email, password }</span>

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('email', { required: 'Email là bắt buộc' })} /&gt;
      {errors.email &amp;&amp; &lt;p&gt;{errors.email.message}&lt;/p&gt;}
      &lt;input type="password" {...register('password')} /&gt;
      &lt;button&gt;Đăng ký&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">register('name')</span><span class="v">Nối một input vào form. Gõ không render lại component — lợi hiệu năng lớn so với input có-kiểm-soát.</span></div>
  <div class="kv"><span class="k">handleSubmit</span><span class="v">Gom mọi giá trị, chạy validation, và gọi handler của bạn với một object dữ liệu sạch chỉ khi hợp lệ.</span></div>
  <div class="kv"><span class="k">formState.errors</span><span class="v">Thông báo lỗi theo từng trường để render tại chỗ.</span></div>
  <div class="kv"><span class="k">Controller</span><span class="v">Một cầu nối cho component có-kiểm-soát (một Select tự chế, một date picker) không thể là input uncontrolled thường.</span></div>
</div>

<div class="callout ok">
<p><strong>Vì sao cảm giác nhanh hơn:</strong> vì phím gõ không chảy qua React state, một form 20 trường không render lại ở mỗi ký tự. Bạn được validation, xử lý lỗi, và điều phối submit trong khi gõ vẫn rẻ. Cho form không tầm thường, đây là lựa chọn mặc định.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react-hook-form.com/docs/useform" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — useForm</span><span class="lc-sub">register, handleSubmit, formState, và Controller.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: '16.3 — Validation with Zod: one schema, both sides|||16.3 — Validation với Zod: một schema, cả hai phía',
      slug: 'nextjs-16-3-zod',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Zod định nghĩa hình dạng dữ liệu MỘT lần, rồi validate cả ở client (qua zodResolver) lẫn ở server (schema.safeParse trong action). Một nguồn sự thật, suy ra được cả kiểu TypeScript.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Describe the data once, validate it everywhere</h2>
<p class="lead">Validation logic duplicated in the client and the server drifts apart the day someone edits one and not the other. Zod fixes this: you define the shape and rules once as a schema, use it to validate on the client for instant feedback, and use the <em>same</em> schema on the server as the real guard.</p>

<pre><code>import { z } from 'zod';

export const signupSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  age:      z.number().int().positive().optional(),
});

export type Signup = z.infer&lt;typeof signupSchema&gt;;   <span class="tok-comment">// TS type, for free</span></code></pre>

<h3>Client side: wire Zod into react-hook-form</h3>
<pre><code>import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } =
  useForm({ resolver: zodResolver(signupSchema) });</code></pre>
<p>Now the form validates against the schema automatically, and <code>errors</code> carries the messages you wrote in the schema — no separate <code>required</code> rules on each field.</p>

<h3>Server side: the real check</h3>
<pre><code>async function signup(formData) {
  'use server';
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { errors: parsed.error.flatten() };   <span class="tok-comment">// reject bad input</span>
  await createUser(parsed.data);                                     <span class="tok-comment">// parsed.data is typed &amp; clean</span>
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">One source of truth</span><span class="v">Change a rule once; both sides update. No drift between client and server validation.</span></div>
  <div class="kv"><span class="k">Types for free</span><span class="v"><code>z.infer</code> derives the TypeScript type from the schema — no hand-written duplicate that can fall out of sync.</span></div>
  <div class="kv"><span class="k">Server is authoritative</span><span class="v">Client validation is UX; <code>safeParse</code> on the server is what actually rejects bad or malicious input.</span></div>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://zod.dev" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">zod.dev</span><span class="lc-sub">Schemas, parse vs safeParse, and z.infer for types.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Mô tả dữ liệu một lần, validate ở mọi nơi</h2>
<p class="lead">Logic validation lặp ở client và server sẽ trôi lệch vào ngày ai đó sửa một bên mà quên bên kia. Zod chữa điều này: bạn định nghĩa hình dạng và luật một lần thành một schema, dùng nó validate ở client cho phản hồi tức thì, và dùng <em>cùng</em> schema đó ở server làm lá chắn thật.</p>

<pre><code>import { z } from 'zod';

export const signupSchema = z.object({
  email:    z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Ít nhất 8 ký tự'),
  age:      z.number().int().positive().optional(),
});

export type Signup = z.infer&lt;typeof signupSchema&gt;;   <span class="tok-comment">// kiểu TS, miễn phí</span></code></pre>

<h3>Phía client: nối Zod vào react-hook-form</h3>
<pre><code>import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } =
  useForm({ resolver: zodResolver(signupSchema) });</code></pre>
<p>Giờ form tự validate theo schema, và <code>errors</code> mang các thông báo bạn viết trong schema — không cần luật <code>required</code> riêng trên từng trường.</p>

<h3>Phía server: phép kiểm thật</h3>
<pre><code>async function signup(formData) {
  'use server';
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { errors: parsed.error.flatten() };   <span class="tok-comment">// từ chối input xấu</span>
  await createUser(parsed.data);                                     <span class="tok-comment">// parsed.data đã có kiểu &amp; sạch</span>
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Một nguồn sự thật</span><span class="v">Đổi một luật một lần; cả hai phía cập nhật. Không trôi lệch giữa validation client và server.</span></div>
  <div class="kv"><span class="k">Kiểu miễn phí</span><span class="v"><code>z.infer</code> suy ra kiểu TypeScript từ schema — không có bản chép tay có thể lệch nhịp.</span></div>
  <div class="kv"><span class="k">Server có thẩm quyền</span><span class="v">Validation client là UX; <code>safeParse</code> trên server mới thật sự từ chối input xấu hoặc độc hại.</span></div>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://zod.dev" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">zod.dev</span><span class="lc-sub">Schema, parse vs safeParse, và z.infer cho kiểu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: '16.4 — File uploads: from the browser to storage|||16.4 — Upload file: từ trình duyệt tới storage',
      slug: 'nextjs-16-4-upload-file',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'File không lưu trong DB mà đưa lên object storage (R2/S3). Hai mẫu: upload qua endpoint của bạn, hoặc presigned URL để trình duyệt tải thẳng. Và bạn lưu cái KHOÁ, không phải cả file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>Files go to object storage, not your database</h2>
<p class="lead">A form can carry a file — an avatar, a document, a video. You do not store the bytes in your database; you upload them to <strong>object storage</strong> (Cloudflare R2, AWS S3, etc.) and save only a reference — the object <em>key</em> or URL — in the database.</p>

<h3>Two upload patterns</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Through your server</span><span class="v">Browser sends the file to your Route Handler / Server Action; your server streams it to storage. Simple, and you can validate before storing. The file passes through your server.</span></div>
  <div class="kv"><span class="k">Presigned URL (direct)</span><span class="v">Your server issues a short-lived signed URL; the browser uploads <em>directly</em> to storage. Better for large files — the bytes skip your server. You still record the resulting key.</span></div>
</div>

<pre><code><span class="tok-comment">// A form that carries a file uses multipart; FormData handles it</span>
&lt;form action={uploadAvatar}&gt;
  &lt;input type="file" name="avatar" accept="image/*" /&gt;
  &lt;button&gt;Upload&lt;/button&gt;
&lt;/form&gt;

<span class="tok-comment">// server: read the File out of FormData, then push to storage</span>
async function uploadAvatar(formData) {
  'use server';
  const file = formData.get('avatar');            <span class="tok-comment">// a File object</span>
  const key = &#96;avatars/\${user.id}/\${file.name}&#96;;
  await storage.put(key, file);                    <span class="tok-comment">// upload to R2/S3</span>
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>

<div class="note-ct">
<p><strong>How cuongthai.com stores media:</strong> uploads go to Cloudflare R2 and the database keeps the R2 <em>key</em>, not the file. A helper turns a stored key into a full CDN URL for display (the site serves media from a CDN host, required by its CSP). Storing keys, not URLs, means the CDN domain can change without rewriting every row.</p>
</div>

<div class="pitfall">
<p><strong>The blob:/data: preview trap — a real cuongthai.com bug.</strong> When you show an <em>optimistic preview</em> of a just-picked file, the browser gives you a local <code>blob:</code> or <code>data:</code> URL — already renderable as-is. A helper that blindly prepends the CDN base to <em>every</em> image value turned those into <code>https://cdn.../blob:...</code> and broke the preview (a 400). The fix: object/data URLs are already complete — return them untouched; only prepend the CDN base to bare storage keys. When building a media-URL helper, branch on whether the value is already a full/blob/data URL before adding any prefix.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">📤</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData &amp; file uploads</span><span class="lc-sub">Reading File objects, multipart forms, and object URLs.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>File lên object storage, không phải database của bạn</h2>
<p class="lead">Một form có thể mang một file — avatar, tài liệu, video. Bạn không lưu bytes trong database; bạn upload chúng lên <strong>object storage</strong> (Cloudflare R2, AWS S3, v.v.) và chỉ lưu một tham chiếu — <em>khoá</em> object hoặc URL — trong database.</p>

<h3>Hai mẫu upload</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Qua server của bạn</span><span class="v">Trình duyệt gửi file tới Route Handler / Server Action của bạn; server stream nó lên storage. Đơn giản, và bạn validate được trước khi lưu. File đi qua server.</span></div>
  <div class="kv"><span class="k">Presigned URL (trực tiếp)</span><span class="v">Server cấp một URL đã ký, sống ngắn; trình duyệt upload <em>thẳng</em> lên storage. Tốt cho file lớn — bytes bỏ qua server. Bạn vẫn ghi lại khoá kết quả.</span></div>
</div>

<pre><code><span class="tok-comment">// Một form mang file dùng multipart; FormData lo việc đó</span>
&lt;form action={uploadAvatar}&gt;
  &lt;input type="file" name="avatar" accept="image/*" /&gt;
  &lt;button&gt;Upload&lt;/button&gt;
&lt;/form&gt;

<span class="tok-comment">// server: đọc File ra khỏi FormData, rồi đẩy lên storage</span>
async function uploadAvatar(formData) {
  'use server';
  const file = formData.get('avatar');            <span class="tok-comment">// một object File</span>
  const key = &#96;avatars/\${user.id}/\${file.name}&#96;;
  await storage.put(key, file);                    <span class="tok-comment">// upload lên R2/S3</span>
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>

<div class="note-ct">
<p><strong>cuongthai.com lưu media thế nào:</strong> upload lên Cloudflare R2 và database giữ <em>khoá</em> R2, không phải file. Một helper biến một khoá đã lưu thành URL CDN đầy đủ để hiển thị (site phục vụ media từ một host CDN, do CSP yêu cầu). Lưu khoá, không phải URL, nghĩa là domain CDN có thể đổi mà không phải viết lại mọi dòng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy preview blob:/data: — một bug thật của cuongthai.com.</strong> Khi bạn hiện một <em>preview lạc quan</em> của file vừa chọn, trình duyệt cho bạn một URL cục bộ <code>blob:</code> hoặc <code>data:</code> — đã render được nguyên trạng. Một helper vô tư ghép CDN base vào <em>mọi</em> giá trị ảnh đã biến chúng thành <code>https://cdn.../blob:...</code> và làm hỏng preview (một lỗi 400). Cách sửa: URL object/data đã hoàn chỉnh — trả nguyên trạng; chỉ ghép CDN base vào các khoá storage trần. Khi dựng một helper media-URL, hãy rẽ nhánh xem giá trị đã là URL đầy đủ/blob/data chưa trước khi thêm bất kỳ tiền tố nào.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">📤</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData &amp; upload file</span><span class="lc-sub">Đọc object File, form multipart, và object URL.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.5 ─────────────────────────── */
    {
      title: '16.5 — Upload UX and the security you must not skip|||16.5 — UX upload và phần bảo mật không được bỏ',
      slug: 'nextjs-16-5-upload-bao-mat',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Preview tức thì, thanh tiến trình, chặn gửi hai lần — và điều bắt buộc: server phải kiểm loại, kích thước, và quyền của MỌI upload. Nối các đợt vá lỗ hổng upload thật của cuongthai.com.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.5</span>
<h2>Good upload UX, and the checks that keep it safe</h2>
<p class="lead">A polished upload shows the file before it finishes, indicates progress, and prevents double-submits. But behind the nice UX sits a public write path — and an upload endpoint is one of the most abused surfaces in any app if the server does not check what it receives.</p>

<h3>The UX layer</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Optimistic preview</span><span class="v">Show the picked file immediately via its <code>blob:</code>/<code>data:</code> URL (mind the trap from 16.4 — do not CDN-prefix those).</span></div>
  <div class="kv"><span class="k">Progress &amp; disabled state</span><span class="v">Show upload progress; disable the button while in flight (the <code>useFormStatus</code>/pending pattern from Chapter 12).</span></div>
  <div class="kv"><span class="k">Client hints</span><span class="v"><code>accept="image/*"</code> and a client size check improve UX — but they are hints, not enforcement.</span></div>
</div>

<div class="pitfall">
<p><strong>Client-side file checks are not security — the server must validate every upload.</strong> <code>accept</code> and a JavaScript size check are trivially bypassed by calling the endpoint directly. The server must independently: confirm the user is authenticated and allowed to upload; check the file's <em>real</em> type (not just the extension or the client-sent MIME); enforce a maximum size; and constrain where it is stored. cuongthai.com's security reviews repeatedly found the same class of issue on upload and socket endpoints — trusting the client instead of re-validating on the server — and each had to be patched. An upload action is exactly the Chapter 12 rule applied to files: authenticate, authorise, validate, on the server, every time.</p>
</div>

<h3>A safe server upload, in shape</h3>
<pre><code>async function uploadAvatar(formData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');           <span class="tok-comment">// authz</span>

  const file = formData.get('avatar');
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Bad type');   <span class="tok-comment">// type</span>
  if (file.size &gt; MAX_BYTES)         throw new Error('Too large');  <span class="tok-comment">// size</span>

  const key = &#96;avatars/\${user.id}/\${crypto.randomUUID()}&#96;;   <span class="tok-comment">// server-chosen path</span>
  await storage.put(key, file);
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>
<p>Note the server chooses the storage key — never trust a client-supplied path, or a user could write outside their own folder. Type and size are enforced here, not in the form.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — File Upload Cheat Sheet</span><span class="lc-sub">Server-side validation, type/size limits, and safe storage.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.5</span>
<h2>UX upload tốt, và các phép kiểm giữ nó an toàn</h2>
<p class="lead">Một upload bóng bẩy hiện file trước khi xong, báo tiến trình, và chặn gửi hai lần. Nhưng sau UX đẹp là một đường ghi công khai — và một endpoint upload là một trong những bề mặt bị lạm dụng nhất của mọi app nếu server không kiểm cái nó nhận.</p>

<h3>Lớp UX</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Preview lạc quan</span><span class="v">Hiện file đã chọn ngay qua URL <code>blob:</code>/<code>data:</code> của nó (nhớ bẫy ở 16.4 — đừng ghép CDN vào chúng).</span></div>
  <div class="kv"><span class="k">Tiến trình &amp; trạng thái disabled</span><span class="v">Hiện tiến trình upload; vô hiệu hoá nút khi đang gửi (mẫu <code>useFormStatus</code>/pending ở Chương 12).</span></div>
  <div class="kv"><span class="k">Gợi ý client</span><span class="v"><code>accept="image/*"</code> và một phép kiểm kích thước ở client cải thiện UX — nhưng chúng là gợi ý, không phải thực thi.</span></div>
</div>

<div class="pitfall">
<p><strong>Kiểm file phía client không phải bảo mật — server phải validate mọi upload.</strong> <code>accept</code> và một phép kiểm kích thước bằng JavaScript bị lách dễ dàng bằng cách gọi thẳng endpoint. Server phải tự mình: xác nhận người dùng đã xác thực và được phép upload; kiểm loại <em>thật</em> của file (không chỉ đuôi hay MIME client gửi); ép một kích thước tối đa; và ràng buộc nơi lưu. Các đợt rà soát bảo mật của cuongthai.com lặp đi lặp lại đúng loại vấn đề này trên endpoint upload và socket — tin client thay vì kiểm lại trên server — và mỗi cái phải vá. Một action upload chính xác là quy tắc Chương 12 áp cho file: xác thực, phân quyền, validate, trên server, mọi lúc.</p>
</div>

<h3>Một upload server an toàn, dạng khung</h3>
<pre><code>async function uploadAvatar(formData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Chưa xác thực');               <span class="tok-comment">// authz</span>

  const file = formData.get('avatar');
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Sai loại');   <span class="tok-comment">// type</span>
  if (file.size &gt; MAX_BYTES)         throw new Error('Quá lớn');    <span class="tok-comment">// size</span>

  const key = &#96;avatars/\${user.id}/\${crypto.randomUUID()}&#96;;   <span class="tok-comment">// đường do server chọn</span>
  await storage.put(key, file);
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>
<p>Để ý server chọn khoá storage — đừng bao giờ tin một đường do client cấp, kẻo một người dùng ghi được ra ngoài thư mục của họ. Loại và kích thước được ép ở đây, không phải trong form.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — File Upload Cheat Sheet</span><span class="lc-sub">Validate phía server, giới hạn loại/kích thước, và lưu trữ an toàn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.6 QUIZ ─────────────────────────── */
    {
      title: '16.6 — Chapter 16 quiz|||16.6 — Kiểm tra chương 16',
      slug: 'nextjs-16-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về form/upload: hai cách làm form, react-hook-form uncontrolled, Zod một-schema-hai-phía + z.infer, upload lên object storage + lưu khoá, bẫy preview blob:/data:, và bảo mật upload phía server. Khép Giai đoạn 4.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 16: the two form approaches, react-hook-form's uncontrolled model, Zod validation on both sides, uploading to object storage, the blob:/data: preview trap, and server-side upload security. End of Stage 4.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 16: hai cách làm form, mô hình uncontrolled của react-hook-form, validation Zod hai phía, upload lên object storage, bẫy preview blob:/data:, và bảo mật upload phía server. Khép Giai đoạn 4.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'When is a Server Action form preferable to a client react-hook-form?|||Khi nào form Server Action hơn một client react-hook-form?',
            options: [
              'never|||không bao giờ',
              'for straightforward submits/mutations that should work even without JS|||cho submit/mutation đơn giản nên chạy được cả khi không có JS',
              'only for file uploads|||chỉ cho upload file',
              'only in development|||chỉ ở dev',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is react-hook-form fast on large forms?|||Vì sao react-hook-form nhanh trên form lớn?',
            options: [
              'it caches the form|||nó cache form',
              'inputs are uncontrolled (register) so typing does not re-render the component|||input là uncontrolled (register) nên gõ không render lại component',
              'it disables validation|||nó tắt validation',
              'it runs on the server|||nó chạy trên server',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the main benefit of validating with a single Zod schema?|||Lợi ích chính của việc validate bằng một schema Zod duy nhất là gì?',
            options: [
              'it makes forms prettier|||làm form đẹp hơn',
              'one source of truth for client + server validation, plus a TS type via z.infer|||một nguồn sự thật cho validation client + server, cộng một kiểu TS qua z.infer',
              'it removes the need for a server|||bỏ nhu cầu server',
              'it only validates numbers|||chỉ validate số',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which validation is the one that actually protects the app?|||Validation nào mới thật sự bảo vệ app?',
            options: [
              'the client-side one (instant feedback)|||cái phía client (phản hồi tức thì)',
              'the server-side one (e.g. safeParse in the action)|||cái phía server (ví dụ safeParse trong action)',
              'both are equally protective|||cả hai bảo vệ như nhau',
              'neither|||không cái nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where do uploaded files go, and what does the database store?|||File upload đi đâu, và database lưu gì?',
            options: [
              'the file bytes are stored in the database|||bytes của file lưu trong database',
              'files go to object storage (R2/S3); the DB stores the key/URL reference|||file lên object storage (R2/S3); DB lưu tham chiếu khoá/URL',
              'files are kept in localStorage|||file giữ trong localStorage',
              'files are not stored anywhere|||file không lưu ở đâu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is a presigned-URL upload good for?|||Upload bằng presigned URL hợp cho gì?',
            options: [
              'small text fields|||các trường text nhỏ',
              'large files — the browser uploads directly to storage, skipping your server|||file lớn — trình duyệt upload thẳng lên storage, bỏ qua server',
              'validation|||validation',
              'styling|||styling',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A media-URL helper turned previews into https://cdn.../blob:... and broke them. The fix?|||Một helper media-URL biến preview thành https://cdn.../blob:... và làm hỏng. Cách sửa?',
            options: [
              'prepend the CDN base to everything|||ghép CDN base vào mọi thứ',
              'blob:/data: URLs are already renderable — return them untouched; only prefix bare storage keys|||URL blob:/data: đã render được — trả nguyên trạng; chỉ thêm tiền tố cho khoá storage trần',
              'stop showing previews|||thôi hiện preview',
              'store files in the database|||lưu file trong database',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Are accept="image/*" and a JS size check sufficient upload security?|||accept="image/*" và một phép kiểm kích thước bằng JS có đủ bảo mật upload không?',
            options: [
              'yes, they block bad files|||có, chúng chặn file xấu',
              'no — they are UX hints, trivially bypassed; the server must validate type, size, and auth|||không — chúng là gợi ý UX, dễ lách; server phải validate loại, kích thước, và auth',
              'yes, if the file is small|||có, nếu file nhỏ',
              'only in production|||chỉ ở production',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should the SERVER choose the storage key, not the client?|||Vì sao SERVER nên chọn khoá storage, không phải client?',
            options: [
              'the client cannot make strings|||client không tạo được chuỗi',
              'a client-supplied path could let a user write outside their own folder|||một đường do client cấp có thể để người dùng ghi ra ngoài thư mục của họ',
              'it is faster|||nó nhanh hơn',
              'there is no reason|||không có lý do',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The recurring class of bug in cuongthai.com upload/socket reviews was…|||Loại bug lặp lại trong rà soát upload/socket của cuongthai.com là…',
            options: [
              'slow uploads|||upload chậm',
              'trusting the client instead of re-validating auth/type/size on the server|||tin client thay vì kiểm lại auth/loại/kích thước trên server',
              'files too small|||file quá nhỏ',
              'too much validation|||validate quá nhiều',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
