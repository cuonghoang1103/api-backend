/**
 * TypeScript · Chương 8 · 8.2 — Pick & Omit. Slug giữ: typescript-8-2-pick-omit.
 * Code/output từ ./_ma-ts-08-2.mjs (demo8/ts-08-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-08-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-08-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Pick&lt;T, K&gt;</code></span><span class="v">Keep only the keys in <code>K</code> — the positive form.</span></div>
  <div class="kv"><span class="k"><code>Omit&lt;T, K&gt;</code></span><span class="v">Keep everything except <code>K</code> — the negative form.</span></div>
  <div class="kv"><span class="k">create DTO</span><span class="v"><code>Omit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code> — minus server fields.</span></div>
  <div class="kv"><span class="k">public view</span><span class="v"><code>Omit&lt;User, 'passwordHash'&gt;</code> — a leak becomes TS2339.</span></div>
  <div class="kv"><span class="k">real keys only</span><span class="v">A misspelt key is TS2344; <code>Omit</code> = <code>Pick</code> over <code>Exclude</code> of the keys.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Pick&lt;T, K&gt;</code></span><span class="v">Giữ đúng các khoá trong <code>K</code> — dạng dương.</span></div>
  <div class="kv"><span class="k"><code>Omit&lt;T, K&gt;</code></span><span class="v">Giữ mọi thứ trừ <code>K</code> — dạng âm.</span></div>
  <div class="kv"><span class="k">DTO tạo</span><span class="v"><code>Omit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code> — trừ trường server.</span></div>
  <div class="kv"><span class="k">bản công khai</span><span class="v"><code>Omit&lt;User, 'passwordHash'&gt;</code> — lộ bí mật thành TS2339.</span></div>
  <div class="kv"><span class="k">chỉ khoá thật</span><span class="v">Khoá gõ sai là TS2344; <code>Omit</code> = <code>Pick</code> trên <code>Exclude</code> của khoá.</span></div>
</div>`;

export default {
  title: '8.2 — Pick & Omit|||8.2 — Pick & Omit',
  slug: 'typescript-8-2-pick-omit',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Pick và Omit nắn một kiểu thành kiểu khác — trái tim của một tầng DTO có kiểu. Omit<Booking,"id"|"status"|"createdAt"> là một body tạo bỏ trường server (gửi kèm id ⇒ TS2353); Pick<User,"id"|"name"> là một bản công khai; Omit<User,"passwordHash"> làm đọc passwordHash thành TS2339 — chặn lộ bí mật ngay lúc biên dịch. Cả hai chỉ nhận khoá thật (gõ sai ⇒ TS2344); DTO suy từ model nên không trôi. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Pick &amp; Omit</h2>
<p class="lead">An API almost never sends or accepts a whole model. A create body leaves out the fields the server owns; a public view hides the password hash. <code>Pick</code> and <code>Omit</code> shape one type into another — <code>Pick</code> keeps only the keys you name, <code>Omit</code> keeps everything except them — so you build a DTO layer that <em>tracks</em> the model instead of a hand-written copy that drifts.</p>

<h3>Omit: a type minus some keys</h3>
<p>A create DTO is the resource minus the fields the server sets. <code>CreateBooking</code> is <code>Omit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code>:</p>
${ma('ts', CODE.omitCreate)}
${ra(OUT['11-omit'])}
<p><code>createBooking</code> takes exactly what a client should send and returns the full <code>Booking</code>. Add a field to <code>Booking</code> and <code>CreateBooking</code> gains it automatically — it can never drift from the model.</p>

<h3>Omit refuses the fields it removed</h3>
<p>Because <code>Omit</code> removed <code>id</code>, a client literal that carries <code>id</code> is rejected:</p>
${ma('ts', CODE.omitbadCreate)}
${ra(OUT['12-omit-bad'])}
<p><strong>TS2353</strong>: the server owns that field, and the type enforces it. A create DTO is not documentation — it is a boundary tsc checks, so a client cannot set a field it must not.</p>

<h3>Pick: a type with only some keys</h3>
<p>A public view is a type with only the safe keys. <code>PublicUser</code> is <code>Pick&lt;User, 'id' | 'name'&gt;</code>:</p>
${ma('ts', CODE.pickPublic)}
${ra(OUT['13-pick'])}
<p><code>toPublic</code> returns exactly those two fields; the email, the password hash and the role are not in the type at all. <code>Pick</code> is the <em>positive</em> form (you list what stays); <code>Omit</code> is the <em>negative</em> (you list what goes).</p>

<h3>Omit stops a leak at compile time</h3>
<p>Make the public view <code>Omit&lt;User, 'passwordHash'&gt;</code> and the field is gone from the type — reading it is an error:</p>
${ma('ts', CODE.leakPublic)}
${ra(OUT['14-leak'])}
<p><strong>TS2339</strong>: a leak of a secret stops being a code-review question and becomes a compile error — the strongest place to catch it.</p>

<h3>Pick and Omit only accept real keys</h3>
<p>Both check their key list against <code>keyof</code> the source, so a misspelt key is caught up front:</p>
${ma('ts', CODE.pickkeyK)}
${ra(OUT['15-pickkey'])}
<p><strong>TS2344</strong>, with a suggestion. Renaming a field in the model turns every stale DTO red at once. Under the hood <code>Pick</code> is a mapped type and <code>Omit</code> is <code>Pick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code> — the conditional <code>Exclude</code> of 8.4, which is why Lab 8 can rebuild it in one line.</p>

<h3>Pick, Omit — and how they fit</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A hand-written <code>CreateNote</code> still carries <code>createdAt</code> and forces the caller to send server-owned fields:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<p>Derive it with <code>Omit&lt;Note, 'id' | 'createdAt'&gt;</code> and it accepts exactly the client fields:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['17-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>Omit&lt;T, K&gt;</code> keeps everything except <code>K</code> — a create DTO minus server fields; sending <code>id</code> is TS2353.</li>
<li><code>Pick&lt;T, K&gt;</code> keeps only <code>K</code> — a public view; the fields you leave out are not in the type.</li>
<li><code>Omit&lt;User, 'passwordHash'&gt;</code> turns a leak into TS2339 — the compiler, not a reviewer.</li>
<li>Both accept only real keys (a typo is TS2344), and both derive from the model so they cannot drift.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Pick & Omit', 'Pick<T, Keys> and Omit<T, Keys> in the utility-types reference. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys')}
${nguon('📘', 'TypeScript Handbook — keyof Type Operator', 'The key union that Pick and Omit check their arguments against. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-4-2-select-include', title: 'Shaping a result, in the type system — Prisma ORM 4.2: select, include & omit', sub: 'Same: you expose a subset of a model — a few columns, never the password hash — and nothing extra comes along. Different: there <code>select</code>/<code>include</code>/<code>omit</code> shape the query result at run time and Prisma derives its type; here <code>Pick</code> and <code>Omit</code> shape the type itself, so a create body minus server fields or a public view minus a secret is a compile-time boundary.', cta: 'OPEN PRISMA ORM LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Pick &amp; Omit</h2>
<p class="lead">Một API gần như không bao giờ gửi hay nhận cả một model. Một body tạo bỏ những trường server sở hữu; một bản công khai giấu password hash. <code>Pick</code> và <code>Omit</code> nắn một kiểu thành kiểu khác — <code>Pick</code> giữ đúng các khoá bạn nêu, <code>Omit</code> giữ mọi thứ trừ chúng — nên bạn dựng một tầng DTO <em>bám theo</em> model thay vì một bản sao viết tay bị trôi.</p>

<h3>Omit: một kiểu trừ đi vài khoá</h3>
<p>Một DTO tạo là tài nguyên trừ những trường server đặt. <code>CreateBooking</code> là <code>Omit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code>:</p>
${ma('ts', CODE.omitCreate)}
${ra(OUT['11-omit'])}
<p><code>createBooking</code> nhận đúng thứ client nên gửi và trả về <code>Booking</code> đầy đủ. Thêm một trường vào <code>Booking</code> thì <code>CreateBooking</code> tự có — nó không bao giờ trôi khỏi model.</p>

<h3>Omit từ chối những trường nó đã bỏ</h3>
<p>Vì <code>Omit</code> đã bỏ <code>id</code>, một literal của client mang <code>id</code> bị từ chối:</p>
${ma('ts', CODE.omitbadCreate)}
${ra(OUT['12-omit-bad'])}
<p><strong>TS2353</strong>: server sở hữu trường đó, và kiểu ép điều đó. Một DTO tạo không phải tài liệu — nó là một ranh giới tsc kiểm, nên client không đặt được một trường nó không được đặt.</p>

<h3>Pick: một kiểu chỉ với vài khoá</h3>
<p>Một bản công khai là một kiểu chỉ với các khoá an toàn. <code>PublicUser</code> là <code>Pick&lt;User, 'id' | 'name'&gt;</code>:</p>
${ma('ts', CODE.pickPublic)}
${ra(OUT['13-pick'])}
<p><code>toPublic</code> trả đúng hai trường đó; email, password hash và role không có trong kiểu. <code>Pick</code> là dạng <em>dương</em> (bạn liệt kê cái ở lại); <code>Omit</code> là dạng <em>âm</em> (bạn liệt kê cái đi).</p>

<h3>Omit chặn lộ bí mật ngay lúc biên dịch</h3>
<p>Làm bản công khai là <code>Omit&lt;User, 'passwordHash'&gt;</code> và trường biến mất khỏi kiểu — đọc nó là một lỗi:</p>
${ma('ts', CODE.leakPublic)}
${ra(OUT['14-leak'])}
<p><strong>TS2339</strong>: một vụ lộ bí mật thôi là chuyện soát code mà thành một lỗi biên dịch — chỗ mạnh nhất để bắt.</p>

<h3>Pick và Omit chỉ nhận khoá thật</h3>
<p>Cả hai kiểm danh sách khoá với <code>keyof</code> của nguồn, nên một khoá gõ sai bị bắt ngay:</p>
${ma('ts', CODE.pickkeyK)}
${ra(OUT['15-pickkey'])}
<p><strong>TS2344</strong>, kèm gợi ý. Đổi tên một trường trong model làm mọi DTO cũ đỏ cùng lúc. Bên dưới <code>Pick</code> là một mapped type và <code>Omit</code> là <code>Pick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code> — <code>Exclude</code> conditional của 8.4, vì thế Lab 8 dựng lại nó được trong một dòng.</p>

<h3>Pick, Omit — và chúng hợp vào đâu</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>CreateNote</code> viết tay còn mang <code>createdAt</code> và bắt người gọi gửi trường server sở hữu:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<p>Suy nó bằng <code>Omit&lt;Note, 'id' | 'createdAt'&gt;</code> và nó nhận đúng các trường của client:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['17-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Omit&lt;T, K&gt;</code> giữ mọi thứ trừ <code>K</code> — một DTO tạo trừ trường server; gửi <code>id</code> là TS2353.</li>
<li><code>Pick&lt;T, K&gt;</code> giữ đúng <code>K</code> — một bản công khai; các trường bạn bỏ không có trong kiểu.</li>
<li><code>Omit&lt;User, 'passwordHash'&gt;</code> biến một vụ lộ thành TS2339 — trình biên dịch, không phải người soát.</li>
<li>Cả hai chỉ nhận khoá thật (gõ sai là TS2344), và cả hai suy từ model nên không trôi.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Pick & Omit', 'Pick<T, Keys> và Omit<T, Keys> trong tham khảo utility types. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys')}
${nguon('📘', 'TypeScript Handbook — keyof Type Operator', 'Union khoá mà Pick và Omit kiểm tham số với nó. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-4-2-select-include', title: 'Nắn hình một kết quả, trong hệ kiểu — Prisma ORM 4.2: select, include & omit', sub: 'Giống: bạn phơi ra một tập con của một model — vài cột, không bao giờ password hash — và không thừa thứ gì. Khác: ở đó <code>select</code>/<code>include</code>/<code>omit</code> nắn kết quả truy vấn lúc chạy và Prisma suy kiểu của nó; ở đây <code>Pick</code> và <code>Omit</code> nắn chính cái kiểu, nên một body tạo trừ trường server hay một bản công khai trừ một bí mật là một ranh giới lúc biên dịch.', cta: 'MỞ BÀI PRISMA ORM →' })}
</div>
`,
};
