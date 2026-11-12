/**
 * Prisma ORM — Chương 8: Hệ kiểu.
 * Kiểu nên import · GetPayload và validator · enum chép tay làm vỡ prod · client extension · lược đồ lớn · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import G08_1 from './giang/pr-08-1.mjs';
import G08_2 from './giang/pr-08-2.mjs';
import G08_3 from './giang/pr-08-3.mjs';
import G08_4 from './giang/pr-08-4.mjs';
import G08_5 from './giang/pr-08-5.mjs';
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 8 — The generated type system|||Chương 8 — Hệ kiểu được sinh ra',
  description: 'Dùng cho hết phần hệ kiểu mà bạn đã trả tiền: những kiểu nên import thay vì viết tay, GetPayload và validator để đặt tên cho hình dạng một truy vấn, sự cố production 08/08/2026 mổ từng dòng cùng cả lớp lỗi mà nó đại diện, bốn loại client extension, và cách giữ trình soạn thảo không ì với lược đồ trăm model.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — The types you should be importing|||8.1 — Những kiểu bạn nên import',
      slug: 'pr-8-1-kieu-nen-import',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sáu nhóm kiểu bộ sinh đẻ ra và dùng chúng ở đâu: model, enum, các kiểu Args cho hàm nhận bộ lọc, Prisma.Decimal và JsonValue, các lớp lỗi để bắt cho đúng, và luật vàng — đừng viết tay thứ bộ sinh đã viết.',
      content: `
${G08_1}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>The types you should be importing</h2>
<p class="lead">You already paid for the type system: <code>prisma generate</code> wrote a quarter of a megabyte of TypeScript describing your schema exactly. Most codebases use about a tenth of it and hand-write the rest, which is how a schema and its types drift apart. This lesson is the inventory — six kinds of generated type and what each one replaces.</p>

<h3>1 · Model types</h3>
<pre><code class="language-javascript">import type { User, Post, Comment } from '@prisma/client';

<span class="tok-comment">// Exactly the scalar columns. No relations, because a bare findMany</span>
<span class="tok-comment">// returns no relations.</span>
function visible(u: User) {
  return &#96;\${u.fullName ?? u.email} (\${u.id})&#96;;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">What it is</span><span class="v">One interface per model, scalars only, generated from the schema. Add a column and every function taking a <code>User</code> sees it immediately.</span></div>
  <div class="kv"><span class="k">What it replaces</span><span class="v">The hand-written <code>interface User { id: number; email: string }</code> that lives in <code>types/</code> in every codebase, and that nobody updates when a column becomes nullable.</span></div>
  <div class="kv"><span class="k">Its limit</span><span class="v">It does <strong>not</strong> describe a query with <code>include</code> or <code>select</code>. Using <code>User</code> as the parameter type for a function that needs <code>user.posts</code> is a lie the compiler will believe — Lesson 8.2 has the fix.</span></div>
</div>

<h3>2 · Enums</h3>
<pre><code class="language-javascript">import { ContentType, OrderStatus } from '@prisma/client';

<span class="tok-comment">// A value at runtime AND a type — both come from the schema</span>
const defaultValue: ContentType = ContentType.ARTICLE;

function nhan(t: OrderStatus): string {
  switch (t) {
    case 'MOI':        return 'Moi tao';
    case 'DANG_XU_LY': return 'Dang xu ly';
    case 'DA_GIAO':    return 'Da giao';
    case 'DA_HUY':     return 'Da huy';
  }
}</code></pre>
<div class="callout ok">
<p><strong>That <code>switch</code> is exhaustive, and the compiler enforces it.</strong> Add a fifth value to the enum in <code>schema.prisma</code>, regenerate, and TypeScript reports that <code>nhan</code> no longer returns a <code>string</code> on every path. Every place that branches on the enum turns red at once, which is exactly the behaviour you want and exactly what a hand-copied union cannot give you. Lesson 8.3 is about the day this was learned in production.</p>
</div>

<h3>3 · Args types — for functions that take query options</h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

<span class="tok-comment">// A repository function that accepts a caller-supplied filter, safely</span>
async function findPost(
  where: Prisma.PostWhereInput,
  orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: 'desc' },
  take = 20,
) {
  return prisma.post.findMany({ where, orderBy, take });
}

<span class="tok-comment">// The caller gets full autocomplete and full checking</span>
await findPost({ published: true, author: { role: 'ADMIN' } });
await findPost({ publisshed: true });   <span class="tok-comment">// ✗ compile error, typo caught</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Roughly twenty per model</span><span class="v"><code>WhereInput</code>, <code>WhereUniqueInput</code>, <code>CreateInput</code>, <code>UpdateInput</code>, <code>OrderByWithRelationInput</code>, <code>Select</code>, <code>Include</code>, <code>FindManyArgs</code> and more. Lesson 1.2 counted thirty-one for a four-field model.</span></div>
  <div class="kv"><span class="k">The alternative is <code>any</code></span><span class="v">A repository taking <code>filter: any</code> throws away every guarantee the schema gave you, at exactly the boundary where callers are most likely to make a mistake.</span></div>
  <div class="kv"><span class="k">They compose</span><span class="v"><code>Prisma.PostWhereInput['author']</code>, <code>Prisma.UserCreateInput &amp; { xacNhan: string }</code>. Ordinary TypeScript applies — these are just types.</span></div>
  <div class="kv"><span class="k">Import <code>Prisma</code>, not the types individually</span><span class="v">The namespace holds all of them. <code>import { Prisma } from '@prisma/client'</code> once, then <code>Prisma.Anything</code>.</span></div>
</div>

<h3>4 · Value types — Decimal, JsonValue, and friends</h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

<span class="tok-comment">// Decimal: an object with methods, not a number (Lesson 2.1)</span>
function dinhDang(price: Prisma.Decimal): string {
  return price.toFixed(2);
}

<span class="tok-comment">// The Json family — four distinct types for four distinct situations</span>
let a: Prisma.JsonValue;        <span class="tok-comment">// what you read out of a Json column</span>
let b: Prisma.InputJsonValue;   <span class="tok-comment">// what you may write into one</span>
let c: Prisma.JsonObject;       <span class="tok-comment">// specifically an object</span>
const d = Prisma.DbNull;        <span class="tok-comment">// SQL NULL, not the JSON value null</span>
const e = Prisma.JsonNull;      <span class="tok-comment">// the JSON value null, not SQL NULL</span></code></pre>
<pre><code class="language-sql"><span class="tok-comment">// The distinction, made visible</span>
await prisma.user.update({ where: { id: 1 }, data: { settings: Prisma.DbNull } });
await prisma.user.update({ where: { id: 2 }, data: { settings: Prisma.JsonNull } });

const r = await prisma.$queryRaw&#96;SELECT id, cai_dat, cai_dat IS NULL AS la_sql_null, jsonb_typeof(cai_dat) AS kieu_json
                                   FROM users WHERE id IN (1, 2) ORDER BY id&#96;;
console.log(r);
console.log('Prisma doc ra:', await prisma.user.findMany({ where: { id: { in: [1, 2] } }, select: { id: true, settings: true }, orderBy: { id: 'asc' } }));</code></pre>
<div class="out">[
  { id: 1, cai_dat: null, la_sql_null: true, kieu_json: null },
  { id: 2, cai_dat: null, la_sql_null: false, kieu_json: 'null' }
]
Prisma doc ra: [ { id: 1, settings: null }, { id: 2, settings: null } ]</div>
<p>Measured (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3): row 1 is SQL <code>NULL</code> (<code>IS NULL</code> true, no JSON type); row 2 holds the JSON value <code>null</code> (<code>IS NULL</code> false, <code>jsonb_typeof</code> says <code>'null'</code>). Read back, both arrive as <code>null</code> — from the driver and from Prisma — so the difference is only visible to SQL. Filter on it with <code>{ settings: { equals: Prisma.DbNull } }</code> or <code>Prisma.JsonNull</code>, not by inspecting the value you read:</p>
<div class="out">$ npx tsx json-loc.mts
equals DbNull → [ { id: 1 } ] · equals JsonNull → [ { id: 2 } ]</div>

<h3>5 · Error classes — for catching precisely</h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

try {
  await prisma.user.create({ data: { email } });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    <span class="tok-comment">// e.code and e.meta are typed and populated</span>
    if (e.code === 'P2002') return res.status(409).json({ truong: e.meta?.target });
    if (e.code === 'P2003') return res.status(400).json({ error: 'Tham chieu khong ton tai' });
    if (e.code === 'P2025') return res.status(404).end();
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    <span class="tok-comment">// bad arguments — this is a bug in your code, not the user's input</span>
    return res.status(500).json({ error: 'Truy van sai cau truc' });
  }
  throw e;
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientKnownRequestError</code></span><span class="lz-lnote">The database said no, for a reason with a code. <code>P2002</code> unique, <code>P2003</code> foreign key, <code>P2025</code> not found. Has <code>code</code> and <code>meta</code>. This is the one you catch.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientValidationError</code></span><span class="lz-lnote">Your query arguments were malformed — a field that does not exist, <code>select</code> and <code>include</code> together. Almost always a bug in your code, so a 500 rather than a 400.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientInitializationError</code></span><span class="lz-lnote">Could not start: bad <code>DATABASE_URL</code>, database unreachable, engine missing for the platform. Fatal at boot, and the class Lesson 1.3's musl/glibc outage produced.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientRustPanicError</code></span><span class="lz-lnote">The engine crashed. Rare, and unrecoverable — the client must be restarted. Log it loudly and let the process die.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — <code>e.code === 'P2002'</code> without the <code>instanceof</code> check.</strong> On a plain <code>unknown</code>, TypeScript will not let you read <code>.code</code>, so people write <code>(e as any).code</code> — and then a completely unrelated error with a <code>code</code> property (a Node <code>ENOENT</code>, an Axios error) matches the branch and returns a 409 to a confused user. The <code>instanceof</code> is what makes the narrowing real.</p>
</div>

<h3>6 · The client type itself</h3>
<pre><code class="language-javascript">import type { PrismaClient } from '@prisma/client';

<span class="tok-comment">// Dependency injection, and testability, for free</span>
export class PostService {
  constructor(private db: PrismaClient) {}

  async getByAuthor(authorId: number) {
    return this.db.post.findMany({ where: { authorId: authorId }, take: 20 });
  }
}

<span class="tok-comment">// The type that accepts either the client or a transaction client</span>
export type DbClient = Omit&lt;PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'&gt;;

async function writeAuditLog(db: DbClient, action: string) {
  return db.auditLog.create({ data: { action } });
}</code></pre>
<div class="callout">
<p><strong>That <code>DbClient</code> alias is worth putting in a shared file on day one.</strong> Every helper that might be called inside a transaction needs it, and writing the <code>Omit</code> at each call site is how people end up typing the parameter as <code>any</code> instead — which reintroduces exactly the bug from Lesson 7.1, where a helper silently used the outer client and escaped the transaction.</p><p>Measured (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3): <code>DbClient</code> — and <code>Prisma.TransactionClient</code> — accept both the plain client and <code>tx</code>. A client returned by <code>$extends</code> does not fit <code>Prisma.TransactionClient</code>; if your app exports an extended client (Lesson 8.4), derive the helper type from that client instead. (<code>$use</code> is no longer on the client in 6.19.3, so there is nothing to omit for it.)</p>
<div class="out">$ npx tsc --noEmit --strict dbclient.ts
dbclient.ts(11,18): error TS2345: Argument of type 'DynamicClientExtensionThis&lt;TypeMap&lt;InternalArgs &amp; { result: {}; model: {}; query: {}; client: {}; }, {}&gt;, TypeMapCb&lt;PrismaClientOptions&gt;, { re
  The types of 'user.findUnique' are incompatible between these types.
    Type '&lt;A extends UserFindUniqueArgs&lt;InternalArgs &amp; { result: {}; model: {}; query: {}; client: {}; }&gt;&gt;(args: Exact&lt;A, UserFindUniqueArgs&lt;InternalArgs &amp; { result: {}; model: {}; query: {}; client:</div>
</div>

<h3>The golden rule</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Never hand-write</span><span class="lz-t">A type the generator produces</span><span class="lz-d">A model interface, an enum union, a filter shape. If you can point at the schema field it corresponds to, import it instead.</span></div>
  <div class="lz-step"><span class="lz-k">Derive, do not duplicate</span><span class="lz-t"><code>Pick</code>, <code>Omit</code>, <code>GetPayload</code></span><span class="lz-d">A DTO that is "a User without the password" is <code>Omit&lt;User, 'password'&gt;</code>, which breaks correctly when the field is renamed. A hand-written interface does not.</span></div>
  <div class="lz-step"><span class="lz-k">Hand-write the boundary</span><span class="lz-t">Request and response shapes</span><span class="lz-d">An API contract is a genuinely separate thing from a database row and <em>should</em> be written by hand — usually as a Zod schema. Chapter 10 covers where the two meet.</span></div>
  <div class="lz-step"><span class="lz-k">The test</span><span class="lz-t">Rename a column and rebuild</span><span class="lz-d">Everything that should break, breaks. If something that reads that column still compiles, it is using a hand-written type, and that is the drift you are looking for.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">Type safety — generated types</span><span class="lc-sub">prisma.io/docs · The full inventory of what the generator exports and where each is used</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">Error reference</span><span class="lc-sub">prisma.io/docs · Every code, its meaning, and the <code>meta</code> each one carries</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#advanced-example-update-a-nested-json-key-value" target="_blank" rel="noopener"><span class="lc-ico">🗂️</span><span class="lc-body"><span class="lc-title">DbNull, JsonNull and null</span><span class="lc-sub">prisma.io/docs · The three-way distinction, which is the most-asked Prisma question there is</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript</span><span class="lc-sub">Pick, Omit, conditional types and narrowing — the language features every pattern here rests on</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Find and replace nine hand-written types with generated ones, then rename a column and watch what breaks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-10-4-types-from-packages" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">The general rule behind generated types — TS 10.4: Getting types from packages</span><span class="lc-sub">Same: a tool ships declarations and you import the types it produced. Different: this is the rule every typed dependency follows — a package’s <code>types</code> field, an <code>@types</code> package, or a declaration you write — so Prisma’s generated client is one instance of a pattern you now recognise everywhere.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Những kiểu bạn nên import</h2>
<p class="lead">Bạn đã trả tiền cho hệ kiểu rồi: <code>prisma generate</code> vừa viết ra một phần tư megabyte TypeScript mô tả lược đồ của bạn chính xác tuyệt đối. Phần lớn kho mã dùng chừng một phần mười trong đó rồi viết tay phần còn lại, và đó là cách một lược đồ trôi dạt khỏi hệ kiểu của nó. Bài này là bản kiểm kê — sáu nhóm kiểu được sinh ra và mỗi nhóm thay thế thứ gì.</p>

<h3>1 · Kiểu model</h3>
<pre><code class="language-javascript">import type { User, Post, Comment } from '@prisma/client';

<span class="tok-comment">// Đúng bằng các cột vô hướng. Không có quan hệ, vì một findMany trần</span>
<span class="tok-comment">// không trả về quan hệ nào.</span>
function visible(u: User) {
  return &#96;\${u.fullName ?? u.email} (\${u.id})&#96;;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó là gì</span><span class="v">Mỗi model một interface, chỉ trường vô hướng, sinh ra từ lược đồ. Thêm một cột thì mọi hàm nhận <code>User</code> đều thấy nó ngay lập tức.</span></div>
  <div class="kv"><span class="k">Nó thay thế cái gì</span><span class="v">Cái <code>interface User { id: number; email: string }</code> viết tay sống trong thư mục <code>types/</code> ở mọi kho mã, và không ai cập nhật khi một cột trở thành cho phép null.</span></div>
  <div class="kv"><span class="k">Giới hạn của nó</span><span class="v">Nó <strong>không</strong> mô tả một câu truy vấn có <code>include</code> hay <code>select</code>. Dùng <code>User</code> làm kiểu tham số cho một hàm cần <code>user.posts</code> là một lời nói dối mà trình biên dịch sẽ tin — Bài 8.2 có cách vá.</span></div>
</div>

<h3>2 · Enum</h3>
<pre><code class="language-javascript">import { ContentType, OrderStatus } from '@prisma/client';

<span class="tok-comment">// Vừa là một giá trị lúc chạy VỪA là một kiểu — cả hai đến từ lược đồ</span>
const defaultValue: ContentType = ContentType.ARTICLE;

function nhan(t: OrderStatus): string {
  switch (t) {
    case 'MOI':        return 'Moi tao';
    case 'DANG_XU_LY': return 'Dang xu ly';
    case 'DA_GIAO':    return 'Da giao';
    case 'DA_HUY':     return 'Da huy';
  }
}</code></pre>
<div class="callout ok">
<p><strong>Cái <code>switch</code> đó là vét cạn, và trình biên dịch thi hành điều đó.</strong> Thêm giá trị thứ năm vào enum trong <code>schema.prisma</code>, sinh lại, và TypeScript báo rằng <code>nhan</code> không còn trả về <code>string</code> trên mọi nhánh nữa. Mọi chỗ rẽ nhánh theo enum ấy đỏ lên cùng một lúc, đúng hành vi bạn muốn và đúng thứ một union chép tay không cho bạn được. Bài 8.3 nói về cái ngày bài học này được học ngay trên production.</p>
</div>

<h3>3 · Kiểu Args — cho những hàm nhận tuỳ chọn truy vấn</h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

<span class="tok-comment">// Một hàm kho dữ liệu nhận bộ lọc do bên gọi đưa vào, một cách an toàn</span>
async function findPost(
  where: Prisma.PostWhereInput,
  orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: 'desc' },
  take = 20,
) {
  return prisma.post.findMany({ where, orderBy, take });
}

<span class="tok-comment">// Bên gọi có đầy đủ gợi ý gõ và đầy đủ kiểm tra</span>
await findPost({ published: true, author: { role: 'ADMIN' } });
await findPost({ publisshed: true });   <span class="tok-comment">// ✗ lỗi biên dịch, bắt được lỗi gõ</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoảng hai mươi kiểu cho mỗi model</span><span class="v"><code>WhereInput</code>, <code>WhereUniqueInput</code>, <code>CreateInput</code>, <code>UpdateInput</code>, <code>OrderByWithRelationInput</code>, <code>Select</code>, <code>Include</code>, <code>FindManyArgs</code> và nhiều nữa. Bài 1.2 đếm được ba mươi mốt cái cho một model bốn trường.</span></div>
  <div class="kv"><span class="k">Lựa chọn thay thế là <code>any</code></span><span class="v">Một hàm kho dữ liệu nhận <code>filter: any</code> vứt bỏ mọi bảo đảm mà lược đồ vừa cho bạn, đúng ngay tại cái ranh giới mà bên gọi dễ làm sai nhất.</span></div>
  <div class="kv"><span class="k">Chúng ghép được với nhau</span><span class="v"><code>Prisma.PostWhereInput['author']</code>, <code>Prisma.UserCreateInput &amp; { xacNhan: string }</code>. TypeScript bình thường áp dụng được — chúng chỉ là kiểu.</span></div>
  <div class="kv"><span class="k">Import <code>Prisma</code>, đừng import từng kiểu</span><span class="v">Không gian tên ấy chứa tất cả. <code>import { Prisma } from '@prisma/client'</code> một lần, rồi <code>Prisma.BatCuGi</code>.</span></div>
</div>

<h3>4 · Kiểu giá trị — Decimal, JsonValue và họ hàng</h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

<span class="tok-comment">// Decimal: một đối tượng có phương thức, không phải một số (Bài 2.1)</span>
function dinhDang(price: Prisma.Decimal): string {
  return price.toFixed(2);
}

<span class="tok-comment">// Họ Json — bốn kiểu riêng cho bốn tình huống riêng</span>
let a: Prisma.JsonValue;        <span class="tok-comment">// thứ bạn đọc ra từ một cột Json</span>
let b: Prisma.InputJsonValue;   <span class="tok-comment">// thứ bạn được phép ghi vào đó</span>
let c: Prisma.JsonObject;       <span class="tok-comment">// cụ thể là một đối tượng</span>
const d = Prisma.DbNull;        <span class="tok-comment">// NULL của SQL, không phải giá trị JSON null</span>
const e = Prisma.JsonNull;      <span class="tok-comment">// giá trị JSON null, không phải NULL của SQL</span></code></pre>
<pre><code class="language-sql"><span class="tok-comment">// Phân biệt ấy, nhìn tận mắt</span>
await prisma.user.update({ where: { id: 1 }, data: { settings: Prisma.DbNull } });
await prisma.user.update({ where: { id: 2 }, data: { settings: Prisma.JsonNull } });

const r = await prisma.$queryRaw&#96;SELECT id, cai_dat, cai_dat IS NULL AS la_sql_null, jsonb_typeof(cai_dat) AS kieu_json
                                   FROM users WHERE id IN (1, 2) ORDER BY id&#96;;
console.log(r);
console.log('Prisma doc ra:', await prisma.user.findMany({ where: { id: { in: [1, 2] } }, select: { id: true, settings: true }, orderBy: { id: 'asc' } }));</code></pre>
<div class="out">[
  { id: 1, cai_dat: null, la_sql_null: true, kieu_json: null },
  { id: 2, cai_dat: null, la_sql_null: false, kieu_json: 'null' }
]
Prisma doc ra: [ { id: 1, settings: null }, { id: 2, settings: null } ]</div>
<p>Đo thật (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3): hàng 1 là <code>NULL</code> của SQL (<code>IS NULL</code> đúng, không có kiểu JSON); hàng 2 giữ giá trị JSON <code>null</code> (<code>IS NULL</code> sai, <code>jsonb_typeof</code> trả <code>'null'</code>). Đọc ra thì cả hai đều về <code>null</code> — từ trình điều khiển lẫn từ Prisma — nên khác biệt chỉ SQL mới thấy. Lọc theo nó bằng <code>{ settings: { equals: Prisma.DbNull } }</code> hoặc <code>Prisma.JsonNull</code>, đừng soi giá trị đã đọc ra:</p>
<div class="out">$ npx tsx json-loc.mts
equals DbNull → [ { id: 1 } ] · equals JsonNull → [ { id: 2 } ]</div>

<h3>5 · Lớp lỗi — để bắt cho đúng chỗ</h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

try {
  await prisma.user.create({ data: { email } });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    <span class="tok-comment">// e.code và e.meta đều có kiểu và có dữ liệu</span>
    if (e.code === 'P2002') return res.status(409).json({ truong: e.meta?.target });
    if (e.code === 'P2003') return res.status(400).json({ error: 'Tham chieu khong ton tai' });
    if (e.code === 'P2025') return res.status(404).end();
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    <span class="tok-comment">// tham số sai — đây là con bọ trong mã của bạn, không phải dữ liệu người dùng</span>
    return res.status(500).json({ error: 'Truy van sai cau truc' });
  }
  throw e;
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientKnownRequestError</code></span><span class="lz-lnote">Cơ sở dữ liệu đã nói không, vì một lý do có mã. <code>P2002</code> unique, <code>P2003</code> khoá ngoại, <code>P2025</code> không tìm thấy. Có <code>code</code> và <code>meta</code>. Đây là lớp bạn cần bắt.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientValidationError</code></span><span class="lz-lnote">Tham số truy vấn của bạn viết sai — một trường không tồn tại, <code>select</code> và <code>include</code> đi cùng nhau. Hầu như luôn là con bọ trong mã của bạn, nên trả 500 chứ không phải 400.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientInitializationError</code></span><span class="lz-lnote">Không khởi động được: <code>DATABASE_URL</code> sai, cơ sở dữ liệu không với tới, thiếu engine cho nền tảng. Chết ngay lúc khởi động, và là lớp mà sự cố musl/glibc ở Bài 1.3 sinh ra.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>PrismaClientRustPanicError</code></span><span class="lz-lnote">Engine sập. Hiếm, và không cứu vãn được — client phải khởi động lại. Hãy ghi log thật to rồi để tiến trình chết.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>e.code === 'P2002'</code> mà không có phép kiểm <code>instanceof</code>.</strong> Trên một <code>unknown</code> trần thì TypeScript không cho bạn đọc <code>.code</code>, nên người ta viết <code>(e as any).code</code> — và rồi một lỗi hoàn toàn không liên quan mà có thuộc tính <code>code</code> (một <code>ENOENT</code> của Node, một lỗi Axios) khớp trúng nhánh đó và trả về 409 cho một người dùng ngơ ngác. Chính phép <code>instanceof</code> mới làm cho việc thu hẹp kiểu trở nên có thật.</p>
</div>

<h3>6 · Chính kiểu của client</h3>
<pre><code class="language-javascript">import type { PrismaClient } from '@prisma/client';

<span class="tok-comment">// Tiêm phụ thuộc, và khả năng kiểm thử, miễn phí</span>
export class PostService {
  constructor(private db: PrismaClient) {}

  async getByAuthor(authorId: number) {
    return this.db.post.findMany({ where: { authorId: authorId }, take: 20 });
  }
}

<span class="tok-comment">// Kiểu nhận được cả client thường lẫn client của giao dịch</span>
export type DbClient = Omit&lt;PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'&gt;;

async function writeAuditLog(db: DbClient, action: string) {
  return db.auditLog.create({ data: { action } });
}</code></pre>
<div class="callout">
<p><strong>Cái bí danh <code>DbClient</code> đó đáng đặt vào một tệp dùng chung ngay ngày đầu.</strong> Mọi hàm phụ có khả năng được gọi bên trong một giao dịch đều cần nó, và viết cái <code>Omit</code> ở từng chỗ gọi là cách người ta rốt cuộc gán kiểu tham số thành <code>any</code> — và như thế là đưa trở lại đúng con bọ ở Bài 7.1, nơi một hàm phụ âm thầm dùng client bên ngoài và thoát khỏi giao dịch.</p><p>Đo thật (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3): <code>DbClient</code> — và <code>Prisma.TransactionClient</code> — nhận cả client thường lẫn <code>tx</code>. Client trả về từ <code>$extends</code> thì không vừa <code>Prisma.TransactionClient</code>; nếu ứng dụng xuất một client đã mở rộng (Bài 8.4), hãy suy kiểu hàm phụ từ chính client đó. (Ở 6.19.3 client không còn <code>$use</code>, nên chẳng có gì để bỏ cho nó.)</p>
<div class="out">$ npx tsc --noEmit --strict dbclient.ts
dbclient.ts(11,18): error TS2345: Argument of type 'DynamicClientExtensionThis&lt;TypeMap&lt;InternalArgs &amp; { result: {}; model: {}; query: {}; client: {}; }, {}&gt;, TypeMapCb&lt;PrismaClientOptions&gt;, { re
  The types of 'user.findUnique' are incompatible between these types.
    Type '&lt;A extends UserFindUniqueArgs&lt;InternalArgs &amp; { result: {}; model: {}; query: {}; client: {}; }&gt;&gt;(args: Exact&lt;A, UserFindUniqueArgs&lt;InternalArgs &amp; { result: {}; model: {}; query: {}; client:</div>
</div>

<h3>Luật vàng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đừng bao giờ viết tay</span><span class="lz-t">Một kiểu mà bộ sinh đã đẻ ra</span><span class="lz-d">Một interface model, một union enum, một hình dạng bộ lọc. Nếu bạn chỉ ra được trường lược đồ tương ứng thì hãy import nó.</span></div>
  <div class="lz-step"><span class="lz-k">Suy ra, đừng nhân bản</span><span class="lz-t"><code>Pick</code>, <code>Omit</code>, <code>GetPayload</code></span><span class="lz-d">Một DTO là "một User không có mật khẩu" thì chính là <code>Omit&lt;User, 'password'&gt;</code>, thứ vỡ đúng lúc trường ấy được đổi tên. Một interface viết tay thì không.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy viết tay phần ranh giới</span><span class="lz-t">Hình dạng yêu cầu và phản hồi</span><span class="lz-d">Một hợp đồng API là thứ thật sự tách biệt khỏi một hàng cơ sở dữ liệu và <em>nên</em> được viết tay — thường là dưới dạng một lược đồ Zod. Chương 10 nói về chỗ hai thứ ấy gặp nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Phép thử</span><span class="lz-t">Đổi tên một cột rồi build lại</span><span class="lz-d">Mọi thứ đáng lẽ phải vỡ thì vỡ. Nếu có thứ gì đọc cột đó mà vẫn biên dịch được thì nó đang dùng một kiểu viết tay, và đó chính là chỗ trôi dạt bạn đang tìm.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">Type safety — kiểu được sinh ra</span><span class="lc-sub">prisma.io/docs · Bản kiểm kê đầy đủ những gì bộ sinh xuất ra và mỗi cái dùng ở đâu</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">Error reference</span><span class="lc-sub">prisma.io/docs · Mọi mã lỗi, ý nghĩa, và phần <code>meta</code> mỗi cái mang theo</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#advanced-example-update-a-nested-json-key-value" target="_blank" rel="noopener"><span class="lc-ico">🗂️</span><span class="lc-body"><span class="lc-title">DbNull, JsonNull và null</span><span class="lc-sub">prisma.io/docs · Phân biệt ba đường, và là câu hỏi được hỏi nhiều nhất về Prisma</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub">Pick, Omit, kiểu điều kiện và thu hẹp kiểu — những tính năng ngôn ngữ mà mọi mẫu ở đây dựa lên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Tìm và thay chín kiểu viết tay bằng kiểu được sinh, rồi đổi tên một cột và xem thứ gì vỡ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-10-4-types-from-packages" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Luật chung đằng sau kiểu được sinh — TS 10.4: Lấy kiểu từ package</span><span class="lc-sub">Giống: một công cụ giao khai báo và bạn import kiểu nó tạo ra. Khác: đây là luật mọi dependency có kiểu đi theo — trường <code>types</code> của một package, một package <code>@types</code>, hay một khai báo bạn viết — nên client Prisma sinh ra chỉ là một ví dụ của một mẫu giờ bạn nhận ra ở mọi nơi.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Naming the shape a query returns|||8.2 — Đặt tên cho hình dạng một truy vấn trả về',
      slug: 'pr-8-2-getpayload',
      type: 'LESSON',
      description: 'Vấn đề mà kiểu model không giải được, ba cách đặt tên cho một phép chọn — satisfies, Prisma.validator, GetPayload — và cách dùng chúng để một lần bỏ trường khỏi select làm đỏ đúng những hàm dùng trường đó.',
      content: `
${G08_2}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Naming the shape a query returns</h2>
<p class="lead">The moment a query has an <code>include</code> or a <code>select</code>, its result is no longer a <code>User</code> — it is something narrower or wider, and there is no generated name for it. Every codebase hits this in week two, and most solve it by hand-writing an interface that immediately starts drifting. There is a correct answer, it is two lines, and it is the most useful thing in this chapter.</p>

<h3>The problem</h3>
<pre><code class="language-javascript">const post = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    author: { select: { username: true, avatarUrl: true } },
    _count: { select: { comments: true } },
  },
});

<span class="tok-comment">// Now try to pass one of those to a render function.</span>
function the(b: Post) { … }        <span class="tok-comment">// ✗ Post has body, views, authorId… none of which we selected</span>
function the(b: any) { … }         <span class="tok-comment">// ✗ works, and throws away everything</span>
interface Card { … }             <span class="tok-comment">// ✗ works, and drifts the moment the select changes</span></code></pre>
<div class="out">$ npx tsc --noEmit --strict van-de.ts
van-de.ts(7,5): error TS2345: Argument of type '{ id: number; title: string; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }' is not assignable to parameter of type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; }'.
  Type '{ id: number; title: string; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }' is missing the following properties from type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; }': body, published, publishedAt, views, and 3 more.
[exit 2]</div>

<h3>Answer 1 — <code>satisfies</code> plus <code>GetPayload</code></h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

<span class="tok-comment">// 1. The selection, as a value, checked against the model</span>
const pickCard = {
  id: true,
  title: true,
  author: { select: { username: true, avatarUrl: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.PostSelect;

<span class="tok-comment">// 2. The type, derived from that value</span>
type Card = Prisma.PostGetPayload&lt;{ select: typeof pickCard }&gt;;

<span class="tok-comment">// 3. Both used together — the query and the type cannot disagree</span>
async function getCard(): Promise&lt;Card[]&gt; {
  return prisma.post.findMany({ select: pickCard, take: 20 });
}

function the(b: Card) {
  return &#96;\${b.title} — \${b.author.username} (\${b._count.comments})&#96;;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>satisfies</code>, not <code>:</code></span><span class="lz-t">This matters</span><span class="lz-d"><code>const x: Prisma.PostSelect = {…}</code> widens the value to the whole <code>PostSelect</code> type, and then the type <em>lies</em>: <code>GetPayload</code> sees "any field may be selected" and promises every column plus every relation, while the query still fetches only what you wrote. <code>satisfies</code> checks it against <code>PostSelect</code> while keeping the literal shape — which is exactly what <code>GetPayload</code> needs. Measured below.</span></div>
  <div class="lz-step"><span class="lz-k"><code>GetPayload</code> does the work</span><span class="lz-t">One generic per model</span><span class="lz-d"><code>PostGetPayload</code>, <code>UserGetPayload</code>, one for each. It takes the same argument object the query takes and computes the exact return type — the same machinery Prisma uses internally, exposed for you.</span></div>
  <div class="lz-step"><span class="lz-k">The selection is now shared</span><span class="lz-t">Import it anywhere</span><span class="lz-d">Three endpoints returning the same card shape use one <code>pickCard</code>, so they cannot diverge. Change it once and all three change.</span></div>
  <div class="lz-step"><span class="lz-k">Removing a field breaks the users</span><span class="lz-t">Which is the point</span><span class="lz-d">Delete <code>title</code> from the selection and <code>the()</code> turns red immediately, naming the exact line. A hand-written interface would have compiled and returned <code>undefined</code> at runtime.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a colon instead of <code>satisfies</code>, and the type promises fields the query never fetched.</strong> The query below selects <code>id</code> and <code>title</code>; a deliberate error makes tsc print the type it derived (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3):</p>
<pre><code class="language-typescript">const pickRong: Prisma.PostSelect = { id: true, title: true };
type CardRong = Prisma.PostGetPayload&lt;{ select: typeof pickRong }&gt;;
const x: CardRong = null!;
const y: number = x;   <span class="tok-comment">// deliberate: print the type</span></code></pre>
<div class="out">$ npx tsc --noEmit --strict rong.ts
rong.ts(5,7): error TS2322: Type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; author: { id: number; ... 8 more ...; settings: JsonValue; }; comments: { ...; }[]; _count: { ...; }; }' is not assignable to type 'number'.
[exit 2]</div>
<p>Every column, <code>author</code>, <code>comments</code> and <code>_count</code> — none of which the query returns. <code>b.author.username</code> compiles and throws at runtime. With <code>satisfies</code>, the same lines give exactly <code>{ id: number; title: string }</code>, and removing <code>title</code> fails at the line that reads it:</p>
<div class="out">$ npx tsc --noEmit --strict bo-title.ts
bo-title.ts(13,37): error TS2339: Property 'title' does not exist on type '{ id: number; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }'.
[exit 2]</div>
</div>
<pre><code class="language-typescript"><span class="tok-comment">// It works for include too</span>
type PostWithAuthor = Prisma.PostGetPayload&lt;{ include: { author: true } }&gt;;
<span class="tok-comment">// = Post &amp; { author: User }</span>

<span class="tok-comment">// And for nested everything</span>
type FullPost = Prisma.PostGetPayload&lt;{
  include: {
    author: { select: { username: true } };
    comments: { include: { author: true } };
  };
}&gt;;</code></pre>

<h3>Answer 2 — <code>Prisma.validator</code></h3>
<pre><code class="language-javascript"><span class="tok-comment">// The older API, still supported, and clearer in some codebases</span>
const pickCard = Prisma.validator&lt;Prisma.PostDefaultArgs&gt;()({
  select: {
    id: true,
    title: true,
    author: { select: { username: true } },
  },
});

type Card = Prisma.PostGetPayload&lt;typeof pickCard&gt;;

await prisma.post.findMany({ ...pickCard, take: 20 });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">It validates at definition time</span><span class="v">A typo in a field name is an error where the selection is written, not where it is used. With <code>satisfies</code> you get the same thing, so this is mostly a style choice now.</span></div>
  <div class="kv"><span class="k">It wraps the whole args object</span><span class="v">Not just the <code>select</code> — you can include <code>where</code>, <code>orderBy</code> and <code>take</code> in the same reusable constant, then spread it into the query.</span></div>
  <div class="kv"><span class="k">The curious double call</span><span class="v"><code>validator&lt;T&gt;()(value)</code> — the empty first call exists so TypeScript can infer the value's literal type after the explicit type argument. It looks wrong and it is deliberate.</span></div>
  <div class="kv"><span class="k">Prefer <code>satisfies</code> in new code</span><span class="v">It is a language feature rather than a library idiom, it reads better, and it does not need the double-call trick. Keep <code>validator</code> when you want <code>where</code> bundled with the selection.</span></div>
</div>

<h3>Answer 3 — derive from the function</h3>
<pre><code class="language-javascript"><span class="tok-comment">// No named selection at all — take the type from the function's own return</span>
async function getCard() {
  return prisma.post.findMany({
    select: { id: true, title: true, author: { select: { username: true } } },
    take: 20,
  });
}

type Card = Awaited&lt;ReturnType&lt;typeof getCard&gt;&gt;[number];

function the(b: Card) {
  return &#96;\${b.title} — \${b.author.username}&#96;;
}</code></pre>
<div class="callout ok">
<p><strong>This is the lightest option and often the right one.</strong> No exported constant, no <code>GetPayload</code>, and the type follows the query by construction because it <em>is</em> the query's return type. The trade-off: the selection cannot be reused by a second query, and <code>Awaited&lt;ReturnType&lt;typeof f&gt;&gt;[number]</code> is a mouthful. Use it for a one-off; use the named selection when two endpoints share a shape.</p>
</div>

<h3>Applying it: an API response type</h3>
<pre><code class="language-javascript"><span class="tok-comment">// The selection lives with the route that uses it</span>
export const selectPublicProfile = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  bio: true,
  _count: { select: { posts: true, followers: true } },
} satisfies Prisma.UserSelect;

export type HoSoCongKhai = Prisma.UserGetPayload&lt;{ select: typeof selectPublicProfile }&gt;;

<span class="tok-comment">// The route</span>
app.get('/api/v1/users/:username', async (req, res) =&gt; {
  const u = await prisma.user.findUnique({
    where:  { username: req.params.username },
    select: selectPublicProfile,
  });
  if (!u) return res.status(404).end();
  res.json(u satisfies HoSoCongKhai);
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Security by construction</span><span class="v">The selection cannot leak <code>password</code>, because the field is not in it. Compare with returning a whole <code>User</code> and remembering to delete the field — which works until someone adds a second secret column.</span></div>
  <div class="kv"><span class="k">The frontend can import the type</span><span class="v">In a monorepo, <code>import type { HoSoCongKhai }</code> gives the client the exact response shape, checked against the actual query. No OpenAPI generation, no drift.</span></div>
  <div class="kv"><span class="k">One place to change</span><span class="v">Adding <code>coverPhotoUrl</code> to the public profile is one line in the selection. The query, the response type and the frontend all follow.</span></div>
</div>

<h3>When you genuinely should hand-write a type</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The request body</span><span class="lz-lnote">What a client is allowed to send is a separate contract from what a row looks like, and it needs runtime validation anyway. Write a Zod schema and derive the TypeScript type from that — the two systems meet at the boundary, not inside it.</span></div>
  <div class="lz-layer"><span class="lz-lname">A response that reshapes the data</span><span class="lz-lnote">If the endpoint computes fields, renames them, or merges two queries, the response is a new thing. Write it, and map explicitly — the mapping function is where a missing field becomes a compile error.</span></div>
  <div class="lz-layer"><span class="lz-lname">A domain type that is not a row</span><span class="lz-lnote">A shopping cart assembled from three tables, a permission set computed from roles. These are application concepts; deriving them from a query shape couples them to storage for no benefit.</span></div>
  <div class="lz-layer"><span class="lz-lname">Everything else</span><span class="lz-lnote">Derive it. The rule from Lesson 8.1 holds: if you can point at the schema field it corresponds to, the generator already wrote the type.</span></div>
</div>

<div class="note-ct">
<p><strong>Why this matters more than it looks.</strong> The next lesson takes apart a production incident whose entire cause was a type written by hand that should have been imported. The interface was correct when it was written, correct for months afterwards, and wrong the day someone renamed an enum value — with no error anywhere, because a hand-written type is only ever checked against itself. Everything in this lesson exists to make that class of bug impossible.</p>
</div>

<h3>Learning sources for this lesson</h3>
<div class="pitfall">
<p><strong>Trap — a hand-written interface for a query result, which drifts on the next schema change.</strong> &#96;interface UserWithPosts { id: string; posts: Post[] }&#96; describes what the query returns <em>today</em>. Add a column, change a &#96;select&#96;, or make a relation optional, and the interface still compiles — it is a second declaration that happens to agree, and nothing checks it against the query it claims to describe. The failure lands at runtime, on a field the type promised. Derive the shape instead: a &#96;GetPayload&#96; type, or &#96;Awaited&lt;ReturnType&lt;typeof getUser&gt;&gt;&#96; when the query lives in a function. One declaration, and a schema change becomes a compile error where the query is.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Partial structures of model types</span><span class="lc-sub">prisma.io/docs · <code>GetPayload</code> and <code>validator</code> in the official form, with more examples</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety/prisma-validator" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title"><code>Prisma.validator</code></span><span class="lc-sub">prisma.io/docs · The double-call idiom explained, and when it beats <code>satisfies</code></span></span></a>
<a class="link-card" href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript — the <code>satisfies</code> operator</span><span class="lc-sub">typescriptlang.org · Why it preserves the literal type where an annotation widens it</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript</span><span class="lc-sub"><code>ReturnType</code>, <code>Awaited</code>, indexed access and conditional types — the machinery behind all three answers</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Replace four hand-written response interfaces with derived types, then remove a field and count what breaks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-4-3-extends-intersection" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Composing the shape yourself — TypeScript 4.3: extends &amp; intersection</span><span class="lc-sub">Same: “the model plus something” should be derived, not hand-copied, or it drifts. Different: there you compose it by hand — BookingView = BookingRecord &amp; { labName; userName } built with spread — and measure why interface … extends reports a conflicting property at the declaration (TS2430) while &amp; silently turns it into never.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Đặt tên cho hình dạng một truy vấn trả về</h2>
<p class="lead">Ngay khi một câu truy vấn có <code>include</code> hay <code>select</code>, kết quả của nó không còn là một <code>User</code> nữa — nó là một thứ hẹp hơn hoặc rộng hơn, và không có cái tên nào được sinh sẵn cho nó. Mọi kho mã đều đụng chuyện này vào tuần thứ hai, và phần lớn giải bằng cách viết tay một interface rồi interface ấy bắt đầu trôi dạt ngay lập tức. Có một câu trả lời đúng, nó dài hai dòng, và nó là thứ hữu ích nhất trong cả chương này.</p>

<h3>Vấn đề</h3>
<pre><code class="language-javascript">const post = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    author: { select: { username: true, avatarUrl: true } },
    _count: { select: { comments: true } },
  },
});

<span class="tok-comment">// Giờ thử truyền một trong số đó vào một hàm vẽ giao diện.</span>
function the(b: Post) { … }        <span class="tok-comment">// ✗ Post có body, views, authorId… mà ta không chọn cái nào</span>
function the(b: any) { … }         <span class="tok-comment">// ✗ chạy được, và vứt bỏ mọi thứ</span>
interface Card { … }             <span class="tok-comment">// ✗ chạy được, và trôi dạt ngay khi select đổi</span></code></pre>
<div class="out">$ npx tsc --noEmit --strict van-de.ts
van-de.ts(7,5): error TS2345: Argument of type '{ id: number; title: string; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }' is not assignable to parameter of type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; }'.
  Type '{ id: number; title: string; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }' is missing the following properties from type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; }': body, published, publishedAt, views, and 3 more.
[exit 2]</div>

<h3>Cách 1 — <code>satisfies</code> cộng <code>GetPayload</code></h3>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

<span class="tok-comment">// 1. Phép chọn, dưới dạng một giá trị, được kiểm với model</span>
const pickCard = {
  id: true,
  title: true,
  author: { select: { username: true, avatarUrl: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.PostSelect;

<span class="tok-comment">// 2. Cái kiểu, suy ra từ giá trị đó</span>
type Card = Prisma.PostGetPayload&lt;{ select: typeof pickCard }&gt;;

<span class="tok-comment">// 3. Dùng cả hai cùng nhau — truy vấn và kiểu không thể bất đồng</span>
async function getCard(): Promise&lt;Card[]&gt; {
  return prisma.post.findMany({ select: pickCard, take: 20 });
}

function the(b: Card) {
  return &#96;\${b.title} — \${b.author.username} (\${b._count.comments})&#96;;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>satisfies</code>, không phải <code>:</code></span><span class="lz-t">Chỗ này quan trọng</span><span class="lz-d"><code>const x: Prisma.PostSelect = {…}</code> nới rộng giá trị thành cả kiểu <code>PostSelect</code>, và khi đó kiểu <em>nói dối</em>: <code>GetPayload</code> thấy "trường nào cũng có thể được chọn" nên hứa mọi cột cộng mọi quan hệ, trong khi truy vấn vẫn chỉ lấy đúng những gì bạn viết. <code>satisfies</code> kiểm nó với <code>PostSelect</code> mà vẫn giữ nguyên hình dạng chữ — đúng thứ <code>GetPayload</code> cần. Đo ở dưới.</span></div>
  <div class="lz-step"><span class="lz-k"><code>GetPayload</code> làm phần việc</span><span class="lz-t">Mỗi model một generic</span><span class="lz-d"><code>PostGetPayload</code>, <code>UserGetPayload</code>, mỗi model một cái. Nó nhận đúng cái đối tượng tham số mà câu truy vấn nhận rồi tính ra kiểu trả về chính xác — đúng bộ máy Prisma dùng bên trong, phơi ra cho bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Phép chọn giờ dùng chung được</span><span class="lz-t">Import ở đâu cũng được</span><span class="lz-d">Ba endpoint cùng trả về một hình thẻ thì dùng chung một <code>pickCard</code>, nên chúng không thể tách nhau ra. Đổi một lần là cả ba đổi.</span></div>
  <div class="lz-step"><span class="lz-k">Bỏ một trường thì làm vỡ chỗ dùng</span><span class="lz-t">Và đó chính là điểm mấu chốt</span><span class="lz-d">Xoá <code>title</code> khỏi phép chọn thì <code>the()</code> đỏ lên ngay lập tức, nêu đúng dòng. Một interface viết tay thì đã biên dịch trót lọt và trả về <code>undefined</code> lúc chạy.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — dấu hai chấm thay cho <code>satisfies</code>, và kiểu hứa những trường truy vấn chưa từng lấy.</strong> Truy vấn dưới đây chọn <code>id</code> và <code>title</code>; một lỗi cố ý khiến tsc in ra kiểu nó suy được (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3):</p>
<pre><code class="language-typescript">const pickRong: Prisma.PostSelect = { id: true, title: true };
type CardRong = Prisma.PostGetPayload&lt;{ select: typeof pickRong }&gt;;
const x: CardRong = null!;
const y: number = x;   <span class="tok-comment">// cố ý: in kiểu ra</span></code></pre>
<div class="out">$ npx tsc --noEmit --strict rong.ts
rong.ts(5,7): error TS2322: Type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; author: { id: number; ... 8 more ...; settings: JsonValue; }; comments: { ...; }[]; _count: { ...; }; }' is not assignable to type 'number'.
[exit 2]</div>
<p>Mọi cột, <code>author</code>, <code>comments</code> và <code>_count</code> — không cái nào truy vấn trả về. <code>b.author.username</code> biên dịch được và ném lỗi lúc chạy. Với <code>satisfies</code>, cùng những dòng ấy cho đúng <code>{ id: number; title: string }</code>, và bỏ <code>title</code> thì hỏng đúng dòng đọc nó:</p>
<div class="out">$ npx tsc --noEmit --strict bo-title.ts
bo-title.ts(13,37): error TS2339: Property 'title' does not exist on type '{ id: number; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }'.
[exit 2]</div>
</div>
<pre><code class="language-typescript"><span class="tok-comment">// Nó cũng chạy với include</span>
type PostWithAuthor = Prisma.PostGetPayload&lt;{ include: { author: true } }&gt;;
<span class="tok-comment">// = Post &amp; { author: User }</span>

<span class="tok-comment">// Và với mọi thứ lồng nhau</span>
type FullPost = Prisma.PostGetPayload&lt;{
  include: {
    author: { select: { username: true } };
    comments: { include: { author: true } };
  };
}&gt;;</code></pre>

<h3>Cách 2 — <code>Prisma.validator</code></h3>
<pre><code class="language-javascript"><span class="tok-comment">// API cũ hơn, vẫn được hỗ trợ, và rõ ràng hơn trong một số kho mã</span>
const pickCard = Prisma.validator&lt;Prisma.PostDefaultArgs&gt;()({
  select: {
    id: true,
    title: true,
    author: { select: { username: true } },
  },
});

type Card = Prisma.PostGetPayload&lt;typeof pickCard&gt;;

await prisma.post.findMany({ ...pickCard, take: 20 });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó kiểm ngay lúc định nghĩa</span><span class="v">Một lỗi gõ trong tên trường là một lỗi ngay chỗ phép chọn được viết, không phải chỗ nó được dùng. Với <code>satisfies</code> bạn cũng có điều đó, nên giờ đây phần lớn là chuyện phong cách.</span></div>
  <div class="kv"><span class="k">Nó bọc cả đối tượng tham số</span><span class="v">Không chỉ phần <code>select</code> — bạn nhét được cả <code>where</code>, <code>orderBy</code> và <code>take</code> vào cùng một hằng số dùng lại được, rồi trải nó vào câu truy vấn.</span></div>
  <div class="kv"><span class="k">Cái lời gọi kép kỳ lạ</span><span class="v"><code>validator&lt;T&gt;()(giá trị)</code> — lời gọi rỗng đầu tiên tồn tại để TypeScript suy ra được kiểu chữ của giá trị sau khi đã có tham số kiểu tường minh. Nó trông như sai và nó là cố ý.</span></div>
  <div class="kv"><span class="k">Ưu tiên <code>satisfies</code> trong mã mới</span><span class="v">Nó là một tính năng ngôn ngữ chứ không phải một thành ngữ thư viện, nó đọc dễ hơn, và nó không cần cái mẹo gọi kép. Hãy giữ <code>validator</code> khi bạn muốn gói <code>where</code> chung với phép chọn.</span></div>
</div>

<h3>Cách 3 — suy ra từ chính cái hàm</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Không cần phép chọn có tên nào cả — lấy kiểu từ chính giá trị hàm trả về</span>
async function getCard() {
  return prisma.post.findMany({
    select: { id: true, title: true, author: { select: { username: true } } },
    take: 20,
  });
}

type Card = Awaited&lt;ReturnType&lt;typeof getCard&gt;&gt;[number];

function the(b: Card) {
  return &#96;\${b.title} — \${b.author.username}&#96;;
}</code></pre>
<div class="callout ok">
<p><strong>Đây là lựa chọn nhẹ nhất và thường là đúng nhất.</strong> Không hằng số xuất ra, không <code>GetPayload</code>, và cái kiểu đi theo câu truy vấn ngay từ cấu trúc vì nó <em>chính là</em> kiểu trả về của câu truy vấn. Đánh đổi: phép chọn ấy không dùng lại được cho một câu truy vấn thứ hai, và <code>Awaited&lt;ReturnType&lt;typeof f&gt;&gt;[number]</code> thì khá nhọc miệng. Hãy dùng nó cho những chỗ dùng một lần; dùng phép chọn có tên khi hai endpoint dùng chung một hình dạng.</p>
</div>

<h3>Áp dụng: một kiểu phản hồi API</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Phép chọn sống cùng cái route dùng nó</span>
export const selectPublicProfile = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  bio: true,
  _count: { select: { posts: true, followers: true } },
} satisfies Prisma.UserSelect;

export type HoSoCongKhai = Prisma.UserGetPayload&lt;{ select: typeof selectPublicProfile }&gt;;

<span class="tok-comment">// Cái route</span>
app.get('/api/v1/users/:username', async (req, res) =&gt; {
  const u = await prisma.user.findUnique({
    where:  { username: req.params.username },
    select: selectPublicProfile,
  });
  if (!u) return res.status(404).end();
  res.json(u satisfies HoSoCongKhai);
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">An toàn ngay từ cấu trúc</span><span class="v">Phép chọn không thể làm rò rỉ <code>password</code>, vì cái trường đó không nằm trong nó. So với việc trả về nguyên một <code>User</code> rồi nhớ xoá trường đi — cách ấy chạy được cho tới khi có người thêm một cột bí mật thứ hai.</span></div>
  <div class="kv"><span class="k">Frontend import được cái kiểu</span><span class="v">Trong một monorepo, <code>import type { HoSoCongKhai }</code> cho phía client đúng hình dạng phản hồi, được kiểm với chính câu truy vấn thật. Không cần sinh OpenAPI, không trôi dạt.</span></div>
  <div class="kv"><span class="k">Một chỗ để đổi</span><span class="v">Thêm <code>coverPhotoUrl</code> vào hồ sơ công khai là một dòng trong phép chọn. Câu truy vấn, kiểu phản hồi và frontend đều đi theo.</span></div>
</div>

<h3>Khi nào bạn thật sự NÊN viết tay một kiểu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Thân của yêu cầu</span><span class="lz-lnote">Thứ một client được phép gửi lên là một hợp đồng tách biệt khỏi việc một hàng dữ liệu trông thế nào, và dù sao nó cũng cần kiểm lúc chạy. Hãy viết một lược đồ Zod rồi suy kiểu TypeScript ra từ đó — hai hệ thống gặp nhau ở ranh giới, không phải bên trong.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một phản hồi nắn lại dữ liệu</span><span class="lz-lnote">Nếu endpoint tính thêm trường, đổi tên trường, hay trộn hai câu truy vấn thì phản hồi là một thứ mới. Hãy viết nó ra, và ánh xạ tường minh — cái hàm ánh xạ đó là nơi một trường bị thiếu trở thành một lỗi biên dịch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một kiểu nghiệp vụ không phải một hàng dữ liệu</span><span class="lz-lnote">Một giỏ hàng ghép từ ba bảng, một tập quyền tính ra từ vai trò. Đó là những khái niệm của ứng dụng; suy chúng từ hình dạng một truy vấn là buộc chúng vào cách lưu trữ mà chẳng đổi lại được gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mọi thứ còn lại</span><span class="lz-lnote">Hãy suy ra. Luật ở Bài 8.1 vẫn đúng: nếu bạn chỉ ra được trường lược đồ tương ứng thì bộ sinh đã viết cái kiểu ấy rồi.</span></div>
</div>

<div class="note-ct">
<p><strong>Vì sao chuyện này quan trọng hơn vẻ ngoài của nó.</strong> Bài kế tiếp mổ xẻ một sự cố production mà toàn bộ nguyên nhân là một kiểu viết tay đáng lẽ phải được import. Cái interface ấy đúng lúc nó được viết ra, đúng suốt nhiều tháng sau đó, và sai đúng vào ngày có người đổi tên một giá trị enum — mà không có lỗi nào ở đâu cả, vì một kiểu viết tay chỉ bao giờ được kiểm với chính nó. Mọi thứ trong bài này tồn tại để biến lớp lỗi đó thành bất khả.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<div class="pitfall">
<p><strong>Bẫy — một interface viết tay cho kết quả truy vấn, và nó trôi dạt ở lần đổi lược đồ kế tiếp.</strong> &#96;interface UserWithPosts { id: string; posts: Post[] }&#96; mô tả thứ mà truy vấn trả về <em>hôm nay</em>. Thêm một cột, đổi một &#96;select&#96;, hay cho một quan hệ thành tuỳ chọn, thì cái interface vẫn biên dịch — nó là một khai báo thứ hai tình cờ khớp nhau, và chẳng gì đối chiếu nó với cái truy vấn mà nó tự nhận là đang mô tả. Cú hỏng rơi xuống lúc chạy, ở đúng một field mà kiểu đã hứa. Hãy dẫn xuất cái dáng đó: một kiểu &#96;GetPayload&#96;, hoặc &#96;Awaited&lt;ReturnType&lt;typeof getUser&gt;&gt;&#96; khi truy vấn nằm trong một hàm. Một khai báo, và một lần đổi lược đồ trở thành lỗi biên dịch ngay tại chỗ có truy vấn.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Partial structures of model types</span><span class="lc-sub">prisma.io/docs · <code>GetPayload</code> và <code>validator</code> ở dạng chính thức, kèm nhiều ví dụ hơn</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety/prisma-validator" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title"><code>Prisma.validator</code></span><span class="lc-sub">prisma.io/docs · Giải thích thành ngữ gọi kép, và khi nào nó thắng <code>satisfies</code></span></span></a>
<a class="link-card" href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript — toán tử <code>satisfies</code></span><span class="lc-sub">typescriptlang.org · Vì sao nó giữ nguyên kiểu chữ trong khi một chú thích kiểu thì nới rộng</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub"><code>ReturnType</code>, <code>Awaited</code>, truy cập theo chỉ số và kiểu điều kiện — bộ máy đứng sau cả ba cách</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Thay bốn interface phản hồi viết tay bằng kiểu suy ra, rồi bỏ một trường và đếm xem có bao nhiêu chỗ vỡ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-4-3-extends-intersection" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Tự ghép dáng — TypeScript 4.3: extends &amp; intersection</span><span class="lc-sub">Giống: “model cộng thêm gì đó” nên được suy ra, không chép tay, kẻo lệch dần. Khác: ở đó bạn tự ghép — BookingView = BookingRecord &amp; { labName; userName } dựng bằng spread — và đo vì sao interface … extends báo thuộc tính xung đột ngay ở khai báo (TS2430) còn &amp; âm thầm biến nó thành never.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — The type that broke production|||8.3 — Cái kiểu làm vỡ production',
      slug: 'pr-8-3-su-co-enum',
      type: 'LESSON',
      description: 'Sự cố 08/08/2026 mổ từng bước: thay đổi, năm phép kiểm đều qua, thứ vỡ, lý do thật khiến nó vô hình, hai cách vá đã đưa vào danh sách kiểm của kho, và cả lớp lỗi mà nó đại diện — mã không ai kiểm kiểu.',
      content: `
${G08_3}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>The type that broke production</h2>
<p class="lead">On 8 August 2026 a one-word rename in the CuongThai schema passed every check in the pre-push checklist and broke the production seed. The change was correct, the review was correct, the tooling was correct — and none of it looked at the file that mattered. This lesson takes the incident apart step by step, because the class of bug it represents is the most common one in a typed codebase.</p>

<h3>The change</h3>
<pre><code class="language-typescript"><span class="tok-comment">// prisma/schema.prisma — the frontend had always called it CODE_REVIEW,</span>
<span class="tok-comment">// so the enum was brought into line.</span>
enum ContentType {
  VLOG
  ARTICLE
- CODE
+ CODE_REVIEW
  TUTORIAL
}</code></pre>
<div class="callout">
<p><strong>Nothing about that change is wrong.</strong> An enum value whose name disagrees with the rest of the system is a real problem worth fixing, and renaming it in the schema is the correct fix. The incident is not about the change; it is about what the checks did and did not see.</p>
</div>

<h3>What passed</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>npx prisma format</code> · <code>npx prisma validate</code></span><span class="lz-lnote">The schema is valid. An enum may have any values it likes.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>npx prisma generate</code></span><span class="lz-lnote">The client regenerated with <code>CODE_REVIEW</code> in the <code>ContentType</code> union. Correct.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>npx tsc --noEmit</code></span><span class="lz-lnote">Green. Every file under <code>src/</code> that used the enum imported it from <code>@prisma/client</code>, so they all updated together. This is exactly the behaviour Lesson 8.1 promised, and it worked.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>(cd frontend &amp;&amp; npm run build)</code></span><span class="lz-lnote">Green. The frontend already used the new name — that was the point of the change.</span></div>
  <div class="lz-layer"><span class="lz-lname">The migration</span><span class="lz-lnote">Applied cleanly. PostgreSQL renamed the enum value and every existing row followed.</span></div>
</div>
<p>Replayed in the lab (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3) — every check green, and <code>migrate diff</code> reports an empty migration:</p>
<div class="out">$ docker exec -i prisma-pg psql -U student -d c83 -c "ALTER TYPE \\"ContentType\\" RENAME VALUE 'CODE' TO 'CODE_REVIEW'"
ALTER TYPE
$ npx prisma validate --schema schema.prisma
The schema at schema.prisma is valid 🚀
$ npx prisma generate --schema schema.prisma | grep Generated
✔ Generated Prisma Client (v6.19.3) to ./gen in 69ms
$ npx tsc -p tsconfig.json &amp;&amp; echo 'tsc --noEmit: no errors'
tsc --noEmit: no errors
$ npx prisma migrate diff --from-schema-datasource schema.prisma --to-schema-datamodel schema.prisma --script
-- This is an empty migration.</div>

<h3>What broke</h3>
<p>Rebuilt in the lab (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3) with the same rename and the same hand-written union, the seed fails exactly as production did:</p>
<div class="out">$ npx tsx prisma/seed.ts
PrismaClientValidationError: 
Invalid &#96;prisma.content.create()&#96; invocation in
prisma/seed.ts:9:47
  6   { title: 'Review code nguon Prisma', type: 'CODE' },
  7   { title: 'Vlog ngay dau', type: 'VLOG' },
  8 ];
→ 9 for (const d of payload) await prisma.content.create({
      data: {
        title: "Review code nguon Prisma",
        type: "CODE"
              ~~~~~~
      }
    })
Invalid value for argument &#96;type&#96;. Expected ContentType.
  clientVersion: '6.19.3'
}
[exit 1]</div>
<p>Note what it is: a <code>PrismaClientValidationError</code>, with no error code and no <code>meta</code>. The client checked the argument against the generated enum and refused before any SQL was sent. Catching <code>PrismaClientKnownRequestError</code> or looking for a <code>P2xxx</code> code would not have caught it.</p>
<pre><code class="language-typescript"><span class="tok-comment">// prisma/seed.ts — the cause, and it had been there for months</span>
type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';
<span class="tok-comment">//                                       ^^^^^^ still the old name</span>

const payload: { title: string; type: ContentType }[] = [
  { title: 'Review code nguon Prisma', type: 'CODE' },
  { title: 'Vlog ngay dau', type: 'VLOG' },
];

for (const d of payload) {
  await prisma.content.create({ data: d });    <span class="tok-comment">// refused by the client: 'CODE' is no longer a ContentType</span>
}</code></pre>

<h3>The reason it was invisible</h3>
<pre><code class="language-bash"><span class="tok-comment"># what does tsc actually read?</span></code></pre>
<div class="out">$ npx tsc -p tsconfig.json --listFiles | grep -v node_modules | grep -v /gen/
src/index.ts
$ find p8/83 -name '*.ts' -not -path '*/gen/*' | sort
prisma/seed.ts
src/index.ts</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The reason</span><span class="lz-t">Nothing type-checked the file</span><span class="lz-d"><code>tsconfig.json</code> has <code>rootDir: "./src"</code>, so <code>prisma/**</code> could not be in <code>include</code> — it sat in <code>exclude</code>. <code>tsc --noEmit</code> never opened <code>seed.ts</code>, and tsc does not warn about files it does not read.</span></div>
  <div class="lz-step"><span class="lz-k">Not the reason</span><span class="lz-t">"The union agreed with itself"</span><span class="lz-d">It is tempting to blame the hand-copied union for shielding the data. Measured, it did not: the moment tsc read <code>seed.ts</code>, the old union met the real input type of <code>prisma.content.create()</code> and failed with TS2322 (next section). The copy made the error land on the wrong line; the unchecked file is what let it ship.</span></div>
  <div class="lz-step"><span class="lz-k">And it only ran on deploy</span><span class="lz-t">So the failure was in production</span><span class="lz-d">The seed is not part of the test suite and not part of local development once the database exists. Its first execution after the change was against production.</span></div>
</div>
<p>The real repository, read-only, on 12 November 2026:</p>
<div class="out">$ npx tsc -p tsconfig.json --listFilesOnly | grep -v node_modules | grep -c '^prisma/'
0
# .ts files in git that this tsconfig never reads (excluding frontend, packages, course content):
prisma/    19   (seed.ts and 18 other seed / data files)
scripts/   41
$ npx tsc -p tsconfig.seed.json --listFilesOnly | grep -v node_modules | grep -c '^prisma/'
19</div>

<h3>The two fixes</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Fix 1 — import the generated type. One line.</span>
- type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';
+ import type { ContentType } from '@prisma/client';</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// Fix 2 — a tsconfig that actually covers prisma/</span>
<span class="tok-comment">// tsconfig.seed.json</span>
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["prisma/**/*.ts", "src/**/*.ts"]
}</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// package.json</span>
"scripts": {
  "typecheck:seed": "tsc -p tsconfig.seed.json"
}</code></pre>
<p>Run against the lab — first with the hand-written union still in place, then with fix 1 applied:</p>
<div class="out">$ npx tsc -p tsconfig.seed.json; echo "[tsconfig.seed.json, seed.ts van con union chep tay: exit $?]"
prisma/seed.ts(9,56): error TS2322: Type '{ title: string; type: ContentType; }' is not assignable to type '(Without&lt;ContentCreateInput, ContentUncheckedCreateInput&gt; &amp; ContentUncheckedCreateInput) | (Without&lt;...&gt; &amp; ContentCreateInput)'.
  Type '{ title: string; type: ContentType; }' is not assignable to type 'Without&lt;ContentUncheckedCreateInput, ContentCreateInput&gt; &amp; ContentCreateInput'.
    Type '{ title: string; type: ContentType; }' is not assignable to type 'ContentCreateInput'.
      Types of property 'type' are incompatible.
        Type 'ContentType' is not assignable to type 'import("gen/index").$Enums.ContentType'.
          Type '"CODE"' is not assignable to type 'ContentType'.
[tsconfig.seed.json, seed.ts van con union chep tay: exit 2]
$ # after fix 1: npx tsc -p tsconfig.seed.json; echo "[sau sua 1 — import kieu sinh ra: exit $?]"
prisma/seed.ts(6,40): error TS2322: Type '"CODE"' is not assignable to type 'ContentType'.
[sau sua 1 — import kieu sinh ra: exit 2]</div>
<p>Fix 2 alone already caught the bug, at the <code>create</code> call. Fix 1 moves the error onto the data line itself — <code>'CODE'</code> is not a <code>ContentType</code> — which is where you want to read it. Do both.</p>
<div class="note-ct">
<p><strong>Both fixes are now in the repository's pre-push checklist, and the checklist says why in capital letters.</strong> Whenever <code>prisma/schema.prisma</code> changes, the required commands are <code>npx tsc --noEmit</code> <em>and</em> <code>npm run typecheck:seed</code> <em>and</em> <code>npx prisma db seed</code> — the last one because a runtime failure in a script nothing type-checks is only found by running it. The checklist notes, in its own words, that <code>tsc --noEmit</code> does not touch <code>prisma/**</code>, and that this was learned by breaking production.</p>
</div>

<h3>The class of bug, generalised</h3>
<pre><code class="language-bash"><span class="tok-comment"># The question to ask of any codebase: what is NOT type-checked?</span>
<span class="tok-comment"># --listFilesOnly lists what tsc would read, without checking anything (about 5 s on CuongThai)</span>
comm -13 \\
  &lt;(npx tsc -p tsconfig.json --listFilesOnly | grep -v node_modules | sed "s|^$PWD/||" | sort) \\
  &lt;(git ls-files '*.ts' | grep -v '\\.d\\.ts$' | sort)</code></pre>
<div class="callout warn">
<p><strong>Read that list.</strong> On CuongThai it named the 19 seed and data files under <code>prisma/</code> and 41 scripts — seeds, backfills, one-off imports: the files that touch production data most directly and are reviewed least carefully. Give each group a tsconfig with <code>noEmit</code> and <code>rootDir: "."</code>, an npm script, and a line in the checklist that says why.</p>
</div>

<h3>The four other places this hides</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Enum values as string literals in SQL</span><span class="v"><code>$queryRaw&#96;… WHERE type = 'CODE'&#96;</code> is a string. No type checks it, and Chapter 10 covers making raw queries type-checked with <code>typedSql</code>.</span></div>
  <div class="kv"><span class="k">Enum values in the frontend</span><span class="v">A separate package with its own copy of the union. In a monorepo, import the type from a shared package that re-exports Prisma's. In a split repository, generate it — do not type it twice.</span></div>
  <div class="kv"><span class="k">Enum values in JSON columns</span><span class="v">A <code>Json</code> field holding <code>{ "type": "CODE" }</code> is unchecked by definition, and a rename does not migrate it. If an enum value can end up inside JSON, the rename needs a data migration too.</span></div>
  <div class="kv"><span class="k">Enum values in external contracts</span><span class="v">A webhook payload, a partner API, a stored config. Renaming an enum that appears in an external contract is a breaking change to that contract, and the schema will not tell you.</span></div>
</div>

<h3>The rename you should have written instead</h3>
<pre><code class="language-sql"><span class="tok-comment">// Expand-contract, exactly as in Lesson 6.5, applied to an enum</span>

<span class="tok-comment">// Migration 1: add the new value — alone in its file.</span>
ALTER TYPE "ContentType" ADD VALUE 'CODE_REVIEW';

<span class="tok-comment">// Deploy 1: code accepts both, writes the new one</span>
<span class="tok-comment">// Migration 2 — a SEPARATE file: UPDATE contents SET type='CODE_REVIEW' WHERE type='CODE';</span>
<span class="tok-comment">// Deploy 2: code no longer mentions the old value</span>

<span class="tok-comment">// Migration 3, days later: remove the old value</span>
<span class="tok-comment">// (the seven-statement type swap from Lesson 2.5)</span></code></pre>
<div class="pitfall">
<p><strong>Trap — <code>ADD VALUE</code> and the <code>UPDATE</code> in the same migration file.</strong> A migration file runs in one transaction, and PostgreSQL does not let a new enum value be used until it is committed. Measured (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3) — first both in one transaction, then split in two:</p>
<div class="out">$ psql -U student -d c83 &lt; them-gia-tri.sql
BEGIN
ALTER TYPE
ERROR:  unsafe use of new value "CODE_REVIEW2" of enum type "ContentType"
LINE 1: UPDATE contents SET type = 'CODE_REVIEW2' WHERE type = 'CODE...
                                   ^
HINT:  New enum values must be committed before they can be used.
ROLLBACK
$ psql -U student -d c83 &lt; them-gia-tri-2.sql
BEGIN
ALTER TYPE
COMMIT
BEGIN
UPDATE 2
COMMIT
     type     | count 
--------------+-------
 VLOG         |     1
 CODE_REVIEW2 |     2
(2 rows)</div>
<p>The second <code>BEGIN … COMMIT</code> is what two migration files give you. Put the data move in its own migration (or in deploy-time code), never in the file that adds the value.</p>
</div>
<div class="callout ok">
<p><strong>The deeper lesson is not "import your types" — it is that a rename is never a one-step change.</strong> Importing the type would have turned this into a compile error, which is a much better outcome. But the expand–contract version would have survived even the hand-copied union, because <code>'CODE'</code> would still have been a valid value while the old code was running. Type safety catches the mistake; sequencing makes the mistake harmless. Do both.</p>
</div>

<h3>Learning sources for this lesson</h3>
<div class="pitfall">
<p><strong>Trap — a file that type-checks against itself, because the compiler never looks at it.</strong> The outage in this lesson had two halves and the second is the one worth carrying away: &#96;tsconfig.json&#96; had &#96;rootDir: "./src"&#96;, so &#96;prisma/**&#96; could not be in &#96;include&#96; and sat in &#96;exclude&#96; instead — meaning &#96;npx tsc --noEmit&#96; never read &#96;seed.ts&#96; at all. A green checklist therefore proved nothing about that file. Any directory outside the compiler&#39;s &#96;include&#96; is unchecked code that looks checked, and the only way to find out is to ask: &#96;npx tsc --noEmit --listFiles | grep seed&#96;. If it is not in the list, no amount of running &#96;tsc&#96; will ever catch a bug in it.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding" target="_blank" rel="noopener"><span class="lc-ico">🌱</span><span class="lc-body"><span class="lc-title">Seeding your database</span><span class="lc-sub">prisma.io/docs · How the seed is wired up, when it runs, and why it is easy to forget</span></span></a>
<a class="link-card" href="https://www.typescriptlang.org/tsconfig#include" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">tsconfig — include, exclude, rootDir</span><span class="lc-sub">typescriptlang.org · Why <code>rootDir</code> constrains what <code>include</code> may contain, which is the root cause here</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">Enums, and altering them</span><span class="lc-sub">prisma.io/docs · Adding a value versus removing one, and what each costs</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript, project configuration</span><span class="lc-sub">Project references and multiple tsconfigs — the tidy way to type-check scripts as well as src</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Find every file in a repository that tsc does not read, then reproduce this incident and fix it twice</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-2-4-literal-as-const" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Same discipline in plain TypeScript — TS 2.4: Literal types &amp; as const</span><span class="lc-sub">Same: a hand-copied list of allowed values drifts, only a derived one is safe. Different: no Prisma needed — write the list once with as const, derive the union with (typeof LABS)[number], and check query strings at runtime with a guard.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-9-1-tsc-and-tsconfig" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Why the enum break reached production — TS 9.1: What tsc does &amp; tsconfig basics</span><span class="lc-sub">Same: a renamed enum value that a hand-copied list did not follow, so it broke at run time. Different: in the TypeScript course the same incident is also an <code>include</code> gap — the seed file was outside the project, so tsc never checked it, and a clean build proved nothing. The fix: import the real type <em>and</em> a second typecheck config in CI.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Cái kiểu làm vỡ production</h2>
<p class="lead">Ngày 08/08/2026, một lần đổi tên một chữ trong lược đồ CuongThai đã qua mọi phép kiểm trong danh sách trước-khi-đẩy và làm vỡ phần seed trên production. Thay đổi thì đúng, review thì đúng, công cụ thì đúng — và không thứ nào trong số đó nhìn vào cái tệp quan trọng. Bài này mổ xẻ sự cố từng bước, vì lớp lỗi mà nó đại diện là lớp phổ biến nhất trong một kho mã có kiểu.</p>

<h3>Thay đổi</h3>
<pre><code class="language-typescript"><span class="tok-comment">// prisma/schema.prisma — frontend vốn luôn gọi nó là CODE_REVIEW,</span>
<span class="tok-comment">// nên cái enum được chỉnh cho khớp.</span>
enum ContentType {
  VLOG
  ARTICLE
- CODE
+ CODE_REVIEW
  TUTORIAL
}</code></pre>
<div class="callout">
<p><strong>Không có gì sai trong thay đổi ấy.</strong> Một giá trị enum mang cái tên bất đồng với phần còn lại của hệ thống là một vấn đề thật đáng sửa, và đổi tên nó trong lược đồ là cách sửa đúng. Sự cố này không nói về thay đổi; nó nói về việc các phép kiểm đã nhìn thấy gì và không nhìn thấy gì.</p>
</div>

<h3>Những gì đã qua</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>npx prisma format</code> · <code>npx prisma validate</code></span><span class="lz-lnote">Lược đồ hợp lệ. Một enum được phép mang giá trị nào tuỳ nó.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>npx prisma generate</code></span><span class="lz-lnote">Client sinh lại với <code>CODE_REVIEW</code> trong union <code>ContentType</code>. Đúng.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>npx tsc --noEmit</code></span><span class="lz-lnote">Xanh. Mọi tệp dưới <code>src/</code> dùng enum ấy đều import nó từ <code>@prisma/client</code>, nên tất cả cập nhật cùng nhau. Đây đúng là hành vi Bài 8.1 hứa hẹn, và nó đã hoạt động.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>(cd frontend &amp;&amp; npm run build)</code></span><span class="lz-lnote">Xanh. Frontend vốn đã dùng tên mới — đó chính là điểm của thay đổi này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Migration</span><span class="lz-lnote">Áp dụng sạch sẽ. PostgreSQL đổi tên giá trị enum và mọi hàng đang có đều đi theo.</span></div>
</div>
<p>Chạy lại trong lab (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3) — mọi phép kiểm đều xanh, và <code>migrate diff</code> báo một migration rỗng:</p>
<div class="out">$ docker exec -i prisma-pg psql -U student -d c83 -c "ALTER TYPE \\"ContentType\\" RENAME VALUE 'CODE' TO 'CODE_REVIEW'"
ALTER TYPE
$ npx prisma validate --schema schema.prisma
The schema at schema.prisma is valid 🚀
$ npx prisma generate --schema schema.prisma | grep Generated
✔ Generated Prisma Client (v6.19.3) to ./gen in 69ms
$ npx tsc -p tsconfig.json &amp;&amp; echo 'tsc --noEmit: no errors'
tsc --noEmit: no errors
$ npx prisma migrate diff --from-schema-datasource schema.prisma --to-schema-datamodel schema.prisma --script
-- This is an empty migration.</div>

<h3>Cái đã vỡ</h3>
<p>Dựng lại trong lab (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3) với đúng lần đổi tên ấy và đúng union viết tay ấy, seed hỏng y như trên production:</p>
<div class="out">$ npx tsx prisma/seed.ts
PrismaClientValidationError: 
Invalid &#96;prisma.content.create()&#96; invocation in
prisma/seed.ts:9:47
  6   { title: 'Review code nguon Prisma', type: 'CODE' },
  7   { title: 'Vlog ngay dau', type: 'VLOG' },
  8 ];
→ 9 for (const d of payload) await prisma.content.create({
      data: {
        title: "Review code nguon Prisma",
        type: "CODE"
              ~~~~~~
      }
    })
Invalid value for argument &#96;type&#96;. Expected ContentType.
  clientVersion: '6.19.3'
}
[exit 1]</div>
<p>Hãy để ý nó là gì: một <code>PrismaClientValidationError</code>, không có mã lỗi và không có <code>meta</code>. Client đối chiếu tham số với enum sinh ra và từ chối trước khi gửi câu SQL nào. Bắt <code>PrismaClientKnownRequestError</code> hay tìm một mã <code>P2xxx</code> đều không bắt được nó.</p>
<pre><code class="language-typescript"><span class="tok-comment">// prisma/seed.ts — thủ phạm, và nó đã nằm đó nhiều tháng</span>
type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';
<span class="tok-comment">//                                       ^^^^^^ vẫn là tên cũ</span>

const payload: { title: string; type: ContentType }[] = [
  { title: 'Review code nguon Prisma', type: 'CODE' },
  { title: 'Vlog ngay dau', type: 'VLOG' },
];

for (const d of payload) {
  await prisma.content.create({ data: d });    <span class="tok-comment">// client từ chối: 'CODE' không còn là một ContentType</span>
}</code></pre>

<h3>Lý do nó vô hình</h3>
<pre><code class="language-bash"><span class="tok-comment"># tsc thật sự đọc những gì?</span></code></pre>
<div class="out">$ npx tsc -p tsconfig.json --listFiles | grep -v node_modules | grep -v /gen/
src/index.ts
$ find p8/83 -name '*.ts' -not -path '*/gen/*' | sort
prisma/seed.ts
src/index.ts</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lý do</span><span class="lz-t">Không gì kiểm kiểu tệp ấy</span><span class="lz-d"><code>tsconfig.json</code> có <code>rootDir: "./src"</code>, nên <code>prisma/**</code> không thể nằm trong <code>include</code> — nó bị đặt vào <code>exclude</code>. <code>tsc --noEmit</code> chưa từng mở <code>seed.ts</code>, và tsc không cảnh báo về những tệp nó không đọc.</span></div>
  <div class="lz-step"><span class="lz-k">Không phải lý do</span><span class="lz-t">"Union tự khớp với chính nó"</span><span class="lz-d">Rất dễ đổ cho union chép tay là đã che chắn dữ liệu. Đo thật thì không phải: ngay khi tsc đọc <code>seed.ts</code>, union cũ gặp kiểu đầu vào thật của <code>prisma.content.create()</code> và báo TS2322 (mục sau). Bản chép tay chỉ làm lỗi rơi sai dòng; chính tệp không được kiểm mới để nó lọt ra.</span></div>
  <div class="lz-step"><span class="lz-k">Và nó chỉ chạy lúc triển khai</span><span class="lz-t">Nên chỗ hỏng là production</span><span class="lz-d">Seed không nằm trong bộ test và không nằm trong việc phát triển hằng ngày khi cơ sở dữ liệu đã có. Lần chạy đầu tiên của nó sau thay đổi là trên production.</span></div>
</div>
<p>Repo thật, chỉ đọc, ngày 12/11/2026:</p>
<div class="out">$ npx tsc -p tsconfig.json --listFilesOnly | grep -v node_modules | grep -c '^prisma/'
0
# tệp .ts trong git mà tsconfig này không bao giờ đọc (trừ frontend, packages, nội dung khoá học):
prisma/    19   (seed.ts và 18 tệp seed / dữ liệu khác)
scripts/   41
$ npx tsc -p tsconfig.seed.json --listFilesOnly | grep -v node_modules | grep -c '^prisma/'
19</div>

<h3>Hai cách vá</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Sửa 1 — import kiểu sinh ra. Một dòng.</span>
- type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';
+ import type { ContentType } from '@prisma/client';</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// Sửa 2 — một tsconfig thật sự phủ cả prisma/</span>
<span class="tok-comment">// tsconfig.seed.json</span>
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["prisma/**/*.ts", "src/**/*.ts"]
}</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// package.json</span>
"scripts": {
  "typecheck:seed": "tsc -p tsconfig.seed.json"
}</code></pre>
<p>Chạy trên lab — trước với union viết tay vẫn còn nguyên, rồi sau khi áp sửa 1:</p>
<div class="out">$ npx tsc -p tsconfig.seed.json; echo "[tsconfig.seed.json, seed.ts van con union chep tay: exit $?]"
prisma/seed.ts(9,56): error TS2322: Type '{ title: string; type: ContentType; }' is not assignable to type '(Without&lt;ContentCreateInput, ContentUncheckedCreateInput&gt; &amp; ContentUncheckedCreateInput) | (Without&lt;...&gt; &amp; ContentCreateInput)'.
  Type '{ title: string; type: ContentType; }' is not assignable to type 'Without&lt;ContentUncheckedCreateInput, ContentCreateInput&gt; &amp; ContentCreateInput'.
    Type '{ title: string; type: ContentType; }' is not assignable to type 'ContentCreateInput'.
      Types of property 'type' are incompatible.
        Type 'ContentType' is not assignable to type 'import("gen/index").$Enums.ContentType'.
          Type '"CODE"' is not assignable to type 'ContentType'.
[tsconfig.seed.json, seed.ts van con union chep tay: exit 2]
$ # sau sửa 1: npx tsc -p tsconfig.seed.json; echo "[sau sua 1 — import kieu sinh ra: exit $?]"
prisma/seed.ts(6,40): error TS2322: Type '"CODE"' is not assignable to type 'ContentType'.
[sau sua 1 — import kieu sinh ra: exit 2]</div>
<p>Chỉ riêng sửa 2 đã bắt được lỗi, ở lời gọi <code>create</code>. Sửa 1 dời lỗi về đúng dòng dữ liệu — <code>'CODE'</code> không phải một <code>ContentType</code> — là chỗ bạn muốn đọc nó. Hãy làm cả hai.</p>
<div class="note-ct">
<p><strong>Cả hai cách vá nay đều nằm trong danh sách kiểm trước-khi-đẩy của kho, và danh sách ấy nói rõ lý do bằng chữ in hoa.</strong> Mỗi khi <code>prisma/schema.prisma</code> đổi thì các câu lệnh bắt buộc là <code>npx tsc --noEmit</code> <em>và</em> <code>npm run typecheck:seed</code> <em>và</em> <code>npx prisma db seed</code> — cái cuối vì một thất bại lúc chạy trong một script không ai kiểm kiểu thì chỉ tìm ra bằng cách chạy nó. Danh sách ấy ghi rõ, bằng chính lời của nó, rằng <code>tsc --noEmit</code> không đụng tới <code>prisma/**</code>, và rằng điều đó được học bằng cách làm vỡ production.</p>
</div>

<h3>Lớp lỗi ấy, tổng quát hoá</h3>
<pre><code class="language-bash"><span class="tok-comment"># Câu nên hỏi mọi kho mã: cái gì KHÔNG được kiểm kiểu?</span>
<span class="tok-comment"># --listFilesOnly liệt kê những gì tsc sẽ đọc, không kiểm gì cả (khoảng 5 giây trên CuongThai)</span>
comm -13 \\
  &lt;(npx tsc -p tsconfig.json --listFilesOnly | grep -v node_modules | sed "s|^$PWD/||" | sort) \\
  &lt;(git ls-files '*.ts' | grep -v '\\.d\\.ts$' | sort)</code></pre>
<div class="callout warn">
<p><strong>Đọc danh sách ấy.</strong> Trên CuongThai nó gọi tên 19 tệp seed và dữ liệu dưới <code>prisma/</code> cùng 41 script — seed, backfill, import một lần: những tệp chạm dữ liệu production trực tiếp nhất và được soát kỹ ít nhất. Cho mỗi nhóm một tsconfig với <code>noEmit</code> và <code>rootDir: "."</code>, một lệnh npm, và một dòng trong checklist nói rõ vì sao.</p>
</div>

<h3>Bốn chỗ khác mà chuyện này ẩn nấp</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Giá trị enum viết thành chuỗi trong SQL</span><span class="v"><code>$queryRaw&#96;… WHERE type = 'CODE'&#96;</code> là một chuỗi. Không kiểu nào kiểm nó, và Chương 10 nói cách làm truy vấn thô được kiểm kiểu bằng <code>typedSql</code>.</span></div>
  <div class="kv"><span class="k">Giá trị enum trong frontend</span><span class="v">Một gói riêng với bản sao union của riêng nó. Trong monorepo, hãy import kiểu từ một gói dùng chung xuất lại kiểu của Prisma. Ở hai kho tách rời, hãy sinh nó ra — đừng gõ nó hai lần.</span></div>
  <div class="kv"><span class="k">Giá trị enum trong cột JSON</span><span class="v">Một trường <code>Json</code> giữ <code>{ "type": "CODE" }</code> thì theo định nghĩa là không được kiểm, và một lần đổi tên không migrate nó. Nếu một giá trị enum có thể rơi vào bên trong JSON thì lần đổi tên ấy cần thêm một lần di chuyển dữ liệu.</span></div>
  <div class="kv"><span class="k">Giá trị enum trong hợp đồng bên ngoài</span><span class="v">Một payload webhook, một API đối tác, một cấu hình đã lưu. Đổi tên một enum có mặt trong một hợp đồng bên ngoài là một thay đổi phá vỡ hợp đồng đó, và lược đồ sẽ không nói cho bạn.</span></div>
</div>

<h3>Lần đổi tên lẽ ra bạn nên viết</h3>
<pre><code class="language-sql"><span class="tok-comment">// Nới–thu, đúng như ở Bài 6.5, áp lên một enum</span>

<span class="tok-comment">// Migration 1: thêm giá trị mới — một mình trong tệp của nó.</span>
ALTER TYPE "ContentType" ADD VALUE 'CODE_REVIEW';

<span class="tok-comment">// Deploy 1: mã chấp nhận cả hai, ghi giá trị mới</span>
<span class="tok-comment">// Migration 2 — một tệp RIÊNG: UPDATE contents SET type='CODE_REVIEW' WHERE type='CODE';</span>
<span class="tok-comment">// Deploy 2: mã không còn nhắc tới giá trị cũ</span>

<span class="tok-comment">// Migration 3, vài ngày sau: bỏ giá trị cũ</span>
<span class="tok-comment">// (phép tráo kiểu bảy câu lệnh ở Bài 2.5)</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>ADD VALUE</code> và <code>UPDATE</code> trong cùng một tệp migration.</strong> Một tệp migration chạy trong một giao dịch, và PostgreSQL không cho dùng giá trị enum mới cho tới khi nó được commit. Đo thật (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3) — trước là cả hai trong một giao dịch, rồi tách làm hai:</p>
<div class="out">$ psql -U student -d c83 &lt; them-gia-tri.sql
BEGIN
ALTER TYPE
ERROR:  unsafe use of new value "CODE_REVIEW2" of enum type "ContentType"
LINE 1: UPDATE contents SET type = 'CODE_REVIEW2' WHERE type = 'CODE...
                                   ^
HINT:  New enum values must be committed before they can be used.
ROLLBACK
$ psql -U student -d c83 &lt; them-gia-tri-2.sql
BEGIN
ALTER TYPE
COMMIT
BEGIN
UPDATE 2
COMMIT
     type     | count 
--------------+-------
 VLOG         |     1
 CODE_REVIEW2 |     2
(2 rows)</div>
<p><code>BEGIN … COMMIT</code> thứ hai chính là thứ hai tệp migration cho bạn. Đặt việc chuyển dữ liệu vào migration riêng của nó (hoặc vào mã chạy lúc triển khai), không bao giờ vào tệp thêm giá trị.</p>
</div>
<div class="callout ok">
<p><strong>Bài học sâu hơn không phải là "hãy import kiểu của bạn" — mà là một lần đổi tên không bao giờ là thay đổi một bước.</strong> Import cái kiểu thì đã biến chuyện này thành một lỗi biên dịch, và đó là kết cục tốt hơn nhiều. Nhưng bản nới–thu thì đã sống sót ngay cả với cái union chép tay, vì <code>'CODE'</code> vẫn còn là một giá trị hợp lệ trong lúc mã cũ đang chạy. An toàn kiểu bắt được sai lầm; sắp thứ tự làm cho sai lầm trở nên vô hại. Hãy làm cả hai.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<div class="pitfall">
<p><strong>Bẫy — một file tự kiểm kiểu với chính nó, vì trình biên dịch chưa từng nhìn tới nó.</strong> Sự cố trong bài này có hai nửa, và nửa thứ hai mới là thứ đáng mang đi: &#96;tsconfig.json&#96; có &#96;rootDir: "./src"&#96;, nên &#96;prisma/**&#96; không nằm trong &#96;include&#96; được và bị đẩy vào &#96;exclude&#96; — tức là &#96;npx tsc --noEmit&#96; chưa từng đọc &#96;seed.ts&#96; lấy một lần. Một bảng kiểm xanh vì thế chẳng chứng minh gì về file đó cả. Bất cứ thư mục nào nằm ngoài &#96;include&#96; của trình biên dịch đều là mã KHÔNG được kiểm mà trông như đã được kiểm, và cách duy nhất để biết là hỏi thẳng: &#96;npx tsc --noEmit --listFiles | grep seed&#96;. Nếu nó không có trong danh sách thì chạy &#96;tsc&#96; bao nhiêu lần cũng chẳng bắt được lỗi trong đó.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding" target="_blank" rel="noopener"><span class="lc-ico">🌱</span><span class="lc-body"><span class="lc-title">Seeding your database</span><span class="lc-sub">prisma.io/docs · Seed được nối vào đâu, chạy lúc nào, và vì sao nó dễ bị quên</span></span></a>
<a class="link-card" href="https://www.typescriptlang.org/tsconfig#include" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">tsconfig — include, exclude, rootDir</span><span class="lc-sub">typescriptlang.org · Vì sao <code>rootDir</code> ràng buộc <code>include</code> được chứa gì, tức nguyên nhân gốc ở đây</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">Enum, và cách sửa chúng</span><span class="lc-sub">prisma.io/docs · Thêm một giá trị so với bỏ một giá trị, và mỗi việc tốn gì</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript, phần cấu hình dự án</span><span class="lc-sub">Project reference và nhiều tsconfig — cách gọn gàng để kiểm kiểu cả script chứ không chỉ src</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Tìm mọi tệp trong một kho mà tsc không đọc, rồi dựng lại sự cố này và vá nó hai lần</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-2-4-literal-as-const" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cùng kỷ luật bằng TypeScript thuần — TS 2.4: Kiểu literal &amp; as const</span><span class="lc-sub">Giống: danh sách giá trị hợp lệ chép tay sẽ lệch, chỉ danh sách suy ra mới an toàn. Khác: không cần Prisma — viết danh sách một lần với as const, suy union bằng (typeof LABS)[number], và kiểm query string lúc chạy bằng guard.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-9-1-tsc-and-tsconfig" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Vì sao cú vỡ enum lên tới production — TS 9.1: tsc làm gì &amp; tsconfig căn bản</span><span class="lc-sub">Giống: một giá trị enum đổi tên mà một danh sách chép tay không theo kịp, nên nó vỡ lúc chạy. Khác: ở khoá TypeScript cùng sự cố đó còn là một lỗ hổng <code>include</code> — tệp seed nằm ngoài dự án, nên tsc không hề kiểm, và một build sạch chẳng chứng minh gì. Cách sửa: import kiểu thật <em>và</em> một config typecheck thứ hai trong CI.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Client extensions: four kinds|||8.4 — Client extension: bốn loại',
      slug: 'pr-8-4-extension',
      type: 'LESSON',
      description: 'result để thêm trường tính toán, model để thêm phương thức, query để chặn mọi truy vấn, client để thêm phương thức mức trên — mỗi loại kèm một ví dụ thật, cách chúng ghép chồng, và ba điều extension không làm được.',
      content: `
${G08_4}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Client extensions: four kinds</h2>
<p class="lead">Extensions let you add to the generated client without forking it, and — crucially — the additions are typed. Four components cover four different needs: computing a field, adding a method to a model, intercepting every query, and adding a top-level method. Lesson 4.5 already used one for soft delete; this lesson covers all four properly.</p>

<h3>The shape</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  name: 'name-cua-ban',
  result: { /* computed fields */ },
  model:  { /* methods on prisma.user, prisma.post, … */ },
  query:  { /* intercept queries */ },
  client: { /* methods on prisma itself */ },
});</code></pre>
<div class="callout">
<p><strong><code>$extends</code> returns a <em>new</em> client — it does not mutate the original.</strong> That is why the pattern is <code>const prisma = base.$extends(…)</code> and why you can keep the un-extended client around for the cases that need to bypass the extension, exactly as Lesson 4.5's soft delete does with its admin path. The returned client is also a different TypeScript type, which is how the added members are typed.</p>
</div>

<h3>1 · <code>result</code> — computed fields</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  result: {
    user: {
      tenHienThi: {
        needs: { fullName: true, username: true },      <span class="tok-comment">// declares the dependency</span>
        compute(u) {
          return u.fullName ?? u.username;
        },
      },
      urlHoSo: {
        needs: { username: true },
        compute(u) {
          return &#96;https://cuongthai.com/u/\${u.username}&#96;;
        },
      },
    },
    post: {
      doDai: {
        needs: { body: true },
        compute(p) {
          return p.body?.length ?? 0;
        },
      },
    },
  },
});

<span class="tok-comment">// ask only for id and the computed field — then read the SQL</span>
const u = await prisma.user.findUniqueOrThrow({ where: { id: 3 }, select: { id: true, tenHienThi: true } });
console.log(u);
<span class="tok-comment">// and through an include on another model</span>
const bai = await prisma.post.findFirstOrThrow({ where: { id: 1 }, include: { author: true } });
console.log('trong include: author.tenHienThi =', JSON.stringify(bai.author.tenHienThi));</code></pre>
<div class="out">$ npx tsx ext.mts
== result: select chi xin id va tenHienThi
prisma:query SELECT "id", "full_name", "username" FROM "users" WHERE ("id" = $1 AND 1=1) LIMIT $2 OFFSET $3
{ id: 3, tenHienThi: 'user3' }
trong include: author.tenHienThi = "Nguoi dung 2"</div>
<p>Measured (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3): the select asked for <code>id</code> and <code>tenHienThi</code>, and the SQL still fetched <code>full_name</code> and <code>username</code> — that is <code>needs</code> at work. The computed field was present inside the <code>include</code> too.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>needs</code> is the contract</span><span class="lz-t">And it is enforced</span><span class="lz-d">Prisma adds the needed columns to the <code>SELECT</code> automatically, even when your <code>select</code> did not ask for them. Without <code>needs</code>, the computed field would be <code>undefined</code> whenever the source column was not fetched.</span></div>
  <div class="lz-step"><span class="lz-k">Computed in JavaScript</span><span class="lz-t">Not in SQL</span><span class="lz-d">It runs after the rows come back, so you cannot filter or sort by a computed field. <code>where: { tenHienThi: … }</code> does not compile — that would need a generated column in the database.</span></div>
  <div class="lz-step"><span class="lz-k">Fully typed</span><span class="lz-t">Everywhere the model appears</span><span class="lz-d"><code>u.tenHienThi</code> is a <code>string</code> in your editor, on every query, including inside an <code>include</code>. This is the part a helper function cannot give you.</span></div>
  <div class="lz-step"><span class="lz-k">Right for presentation, wrong for logic</span><span class="lz-t">A display name, a URL, a formatted price</span><span class="lz-d">Something the database should enforce — a status derived from three columns that other systems also read — belongs in a generated column or a view, not here.</span></div>
</div>

<h3>2 · <code>model</code> — methods on a delegate</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
      },
      async register(email: string, password: string) {
        return prisma.user.create({
          data: { email, password: await hash(password) },
        });
      },
    },
    post: {
      async publishPost(id: number) {
        return prisma.post.updateMany({
          where: { id, published: false },
          data:  { published: true, publishedAt: new Date() },
        });
      },
    },
    $allModels: {
      <span class="tok-comment">// available on EVERY model</span>
      async exists&lt;T&gt;(this: T, where: Prisma.Args&lt;T, 'findFirst'&gt;['where']): Promise&lt;boolean&gt; {
        const ctx = Prisma.getExtensionContext(this);
        const r = await (ctx as any).findFirst({ where, select: { id: true } });
        return r !== null;
      },
    },
  },
});

await prisma.user.findByEmail('an@example.com');
await prisma.post.publishPost(42);
await prisma.comment.exists({ postId: 1 });      <span class="tok-comment">// from $allModels</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">It is a repository layer without the layer</span><span class="v">The methods live next to the model they belong to, discoverable by autocomplete on <code>prisma.user.</code>, and typed. Compare with a <code>UserRepository</code> class that has to be imported and wired up separately.</span></div>
  <div class="kv"><span class="k"><code>$allModels</code> for genuinely generic helpers</span><span class="v"><code>exists</code>, <code>demTheo</code>, <code>xoaMem</code> — anything that works the same way on every model. <code>Prisma.getExtensionContext(this)</code> is how the method finds out which model it was called on.</span></div>
  <div class="kv"><span class="k">The self-reference caveat</span><span class="v">Inside the method, <code>prisma</code> refers to the client being defined. Some codebases prefer <code>Prisma.getExtensionContext(this)</code> throughout to avoid the circularity, especially when extensions are stacked.</span></div>
  <div class="kv"><span class="k">Do not put business logic here</span><span class="v">"Publish a post" is a data operation and fits. "Publish a post, notify subscribers, invalidate the cache" is application logic and belongs in a service — the extension is a data layer, not a place for everything.</span></div>
</div>

<h3>3 · <code>query</code> — intercepting</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  query: {
    <span class="tok-comment">// every operation on every model: log the slow ones</span>
    async $allOperations({ model, operation, args, query }) {
      const t0 = performance.now();
      const result = await query(args);
      const ms = performance.now() - t0;
      if (ms &gt; 200) console.warn(&#96;CHAM \${ms.toFixed(0)}ms \${model}.\${operation}&#96;);
      return result;
    },

    <span class="tok-comment">// one model, one operation: normalise before writing</span>
    user: {
      create({ args, query }) {
        args.data.email = args.data.email.trim().toLowerCase();
        return query(args);
      },
      update({ args, query }) {
        if (typeof args.data.email === 'string') {
          args.data.email = args.data.email.trim().toLowerCase();
        }
        return query(args);
      },
    },
  },
});</code></pre>
<div class="out">CHAM 412ms post.findMany
CHAM 233ms user.aggregate</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The four levels of specificity</span><span class="lz-lnote"><code>$allOperations</code> (everything) · <code>$allModels: { findMany }</code> (one operation, all models) · <code>user: { $allOperations }</code> (one model, everything) · <code>user: { create }</code> (exactly one). Choose the narrowest that does the job.</span></div>
  <div class="lz-layer"><span class="lz-lname">You must call <code>query(args)</code></span><span class="lz-lnote">It is the rest of the pipeline. Forget it and the operation silently never runs — the promise resolves with <code>undefined</code> and nothing errors.</span></div>
  <div class="lz-layer"><span class="lz-lname">The old middleware is gone</span><span class="lz-lnote">In Prisma 6.19.3 the client has no <code>$use</code> at all — <code>typeof prisma.$use</code> is <code>'undefined'</code> (measured), so code copied from an old tutorial throws a TypeError at startup. Extensions are the replacement: typed, scoped per model, composable.</span></div>
  <div class="lz-layer"><span class="lz-lname">Raw SQL is seen, never rewritten</span><span class="lz-lnote">A top-level <code>$allOperations</code> does receive <code>$queryRaw</code> and <code>$executeRaw</code> (it counted three calls below), but model-level hooks like <code>$allModels</code> never do, and no extension can change the SQL inside. Any invariant enforced here — soft-delete filtering, tenant scoping — must be repeated in every raw query by hand.</span></div>
</div>
<div class="out">$ npx tsx ext.mts
== query: quen goi query(args) → undefined
prisma:query SELECT COUNT(*) AS "_count$_all" FROM (SELECT "id" FROM "users" WHERE 1=1 OFFSET $1) AS "sub"
prisma:query SELECT 1
prisma:query SELECT 1
== query: $allOperations dem duoc 3 lan cho: user.count + $queryRaw + $executeRaw
prisma:query SELECT COUNT(*) AS "_count$_all" FROM (SELECT "id" FROM "users" WHERE 1=1 OFFSET $1) AS "sub"</div>
<pre><code class="language-javascript"><span class="tok-comment">// Multi-tenant scoping: the highest-value use of the query component</span>
function tenantClient(tenantId: number) {
  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          const doc = ['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'];
          const write = ['create', 'createMany'];

          if (doc.includes(operation)) {
            args.where = { ...(args as any).where, tenantId };
          } else if (write.includes(operation)) {
            (args as any).data = { ...(args as any).data, tenantId };
          }
          return query(args);
        },
      },
    },
  });
}

const db = tenantClient(req.user.tenantId);
await db.post.findMany();                               <span class="tok-comment">// scoped</span>
await db.user.findMany({ include: { posts: true } });    <span class="tok-comment">// the include is NOT</span>
await db.$queryRaw&#96;SELECT count(*)::int AS n FROM posts&#96;; <span class="tok-comment">// neither is raw SQL</span></code></pre>
<p>Run against the lab (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3), two tenants and 30 posts:</p>
<div class="out">$ npx tsx tenant.mts
findMany posts: tenant cua cac bai = [ 1 ]
findMany users + include posts: 5 user tenant 1, nhung 15 bai cua tenant 2 lot vao qua include
$queryRaw dem posts: 30 (ca hai tenant)</div>
<div class="pitfall">
<p><strong>Trap — a tenant filter in an extension is a safety net, not a security boundary.</strong> Measured above: the top-level query was scoped, while one <code>include</code> handed tenant 1 fifteen posts of tenant 2, and a raw count saw all thirty. Copied as a security control, this is a data leak between customers. It covers the queries that go through the extended client and nothing else: not <code>$queryRaw</code>, not nested reads inside an <code>include</code> on a different model, not a helper that captured the base client. For real isolation, use PostgreSQL row-level security, or a schema per tenant, or a database per tenant — and keep the extension as the layer that catches the ordinary mistakes.</p>
</div>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-2-phan-quyen" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Who may see which rows — API Design 6.2: Authorization</span><span class="lc-sub">Same: a request must only reach its own tenant&#39;s rows. Different: there the check lives in the API layer and is tested per endpoint — the measured leak above is why it cannot be left to a client extension.</span></span>
  <span class="lc-cta">OPEN API DESIGN LESSON →</span>
</a>

<h3>4 · <code>client</code> — top-level methods</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  client: {
    async healthy(): Promise&lt;boolean&gt; {
      try {
        await (Prisma.getExtensionContext(this) as any).$queryRaw&#96;SELECT 1&#96;;
        return true;
      } catch {
        return false;
      }
    },
    async connectionStats() {
      return (Prisma.getExtensionContext(this) as any).$queryRaw&#96;
        SELECT count(*)::int AS total,
               count(*) FILTER (WHERE state = 'active')::int AS dang_chay
        FROM pg_stat_activity WHERE datname = current_database()&#96;;
    },
  },
});

app.get('/health', async (_, res) =&gt; {
  res.status(await prisma.healthy() ? 200 : 503).end();
});</code></pre>

<h3>Stacking, and the order that matters</h3>
<pre><code class="language-javascript">export const prisma = new PrismaClient()
  .$extends(xoaMem)        <span class="tok-comment">// 1 — filters deleted rows</span>
  .$extends(writeAuditLog)     <span class="tok-comment">// 2 — logs writes</span>
  .$extends(truongTinh)    <span class="tok-comment">// 3 — computed fields</span>
  .$extends(phuongThuc);   <span class="tok-comment">// 4 — model methods</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The first extension added is the outermost</span><span class="v">Measured with two logging query extensions, A added before B: A sees the arguments first and the result last; B, added later, sits closer to the database. When two extensions both modify <code>args.where</code>, the order decides what the database receives — so print it for your own stack.<div class="out">$ npx tsx ext.mts
== chong A roi B: A (them truoc) vao → B (them sau) vao → B (them sau) ra → A (them truoc) ra</div></span></div>
  <div class="kv"><span class="k">The type accumulates</span><span class="v">Each <code>$extends</code> returns a wider type, so the final client has every added member typed. Export that one client and import it everywhere.</span></div>
  <div class="kv"><span class="k">Three things extensions cannot do</span><span class="v">They cannot add a field to the database, cannot make a computed field filterable, and cannot rewrite raw SQL. Each of those is a schema or SQL job.</span></div>
  <div class="kv"><span class="k">And a cost worth knowing</span><span class="v">Deeply stacked extensions make the client's inferred type large, which is one of the inputs to editor slowness on a big schema — the subject of the next lesson.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Client extensions — overview</span><span class="lc-sub">prisma.io/docs · All four components with the type signatures, and how stacking composes</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/result" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">The <code>result</code> component</span><span class="lc-sub">prisma.io/docs · <code>needs</code>, computed fields, and why they cannot be filtered on</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/query" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">The <code>query</code> component</span><span class="lc-sub">prisma.io/docs · The four levels of specificity and the migration path from <code>$use</code></span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/ddl-rowsecurity.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — row-level security</span><span class="lc-sub">postgresql.org · Real tenant isolation, enforced by the database rather than the client</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Build all four components, stack them, then find the three queries the interception misses</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Client extension: bốn loại</h2>
<p class="lead">Extension cho phép bạn thêm vào client sinh ra mà không cần rẽ nhánh nó, và — quan trọng — những thứ thêm vào đều có kiểu. Bốn thành phần phủ bốn nhu cầu khác nhau: tính một trường, thêm một phương thức cho một model, chặn mọi truy vấn, và thêm một phương thức ở mức trên. Bài 4.5 đã dùng một loại cho xoá mềm; bài này nói đủ cả bốn.</p>

<h3>Hình dạng</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  name: 'name-cua-ban',
  result: { /* trường tính toán */ },
  model:  { /* phương thức trên prisma.user, prisma.post, … */ },
  query:  { /* chặn truy vấn */ },
  client: { /* phương thức trên chính prisma */ },
});</code></pre>
<div class="callout">
<p><strong><code>$extends</code> trả về một client <em>mới</em> — nó không sửa cái gốc.</strong> Vì thế mẫu chuẩn là <code>const prisma = base.$extends(…)</code> và vì thế bạn giữ được client chưa mở rộng cho những trường hợp cần đi vòng qua extension, đúng như phần xoá mềm ở Bài 4.5 làm với đường quản trị của nó. Client trả về cũng là một kiểu TypeScript khác, và đó là cách các thành viên được thêm vào có kiểu.</p>
</div>

<h3>1 · <code>result</code> — trường tính toán</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  result: {
    user: {
      tenHienThi: {
        needs: { fullName: true, username: true },      <span class="tok-comment">// khai báo phụ thuộc</span>
        compute(u) {
          return u.fullName ?? u.username;
        },
      },
      urlHoSo: {
        needs: { username: true },
        compute(u) {
          return &#96;https://cuongthai.com/u/\${u.username}&#96;;
        },
      },
    },
    post: {
      doDai: {
        needs: { body: true },
        compute(p) {
          return p.body?.length ?? 0;
        },
      },
    },
  },
});

<span class="tok-comment">// chỉ xin id và trường tính toán — rồi đọc câu SQL</span>
const u = await prisma.user.findUniqueOrThrow({ where: { id: 3 }, select: { id: true, tenHienThi: true } });
console.log(u);
<span class="tok-comment">// và qua một include trên model khác</span>
const bai = await prisma.post.findFirstOrThrow({ where: { id: 1 }, include: { author: true } });
console.log('trong include: author.tenHienThi =', JSON.stringify(bai.author.tenHienThi));</code></pre>
<div class="out">$ npx tsx ext.mts
== result: select chi xin id va tenHienThi
prisma:query SELECT "id", "full_name", "username" FROM "users" WHERE ("id" = $1 AND 1=1) LIMIT $2 OFFSET $3
{ id: 3, tenHienThi: 'user3' }
trong include: author.tenHienThi = "Nguoi dung 2"</div>
<p>Đo thật (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3): select chỉ xin <code>id</code> và <code>tenHienThi</code>, vậy mà câu SQL vẫn lấy <code>full_name</code> và <code>username</code> — đó là <code>needs</code> đang làm việc. Trường tính toán có mặt cả bên trong <code>include</code>.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>needs</code> là bản giao kèo</span><span class="lz-t">Và nó được thi hành</span><span class="lz-d">Prisma tự thêm các cột cần thiết vào câu <code>SELECT</code>, ngay cả khi <code>select</code> của bạn không xin chúng. Không có <code>needs</code> thì trường tính toán sẽ là <code>undefined</code> mỗi khi cột nguồn không được lấy về.</span></div>
  <div class="lz-step"><span class="lz-k">Tính bằng JavaScript</span><span class="lz-t">Không phải trong SQL</span><span class="lz-d">Nó chạy sau khi các hàng quay về, nên bạn không lọc hay sắp xếp theo một trường tính toán được. <code>where: { tenHienThi: … }</code> không biên dịch được — muốn thế thì cần một cột sinh ra dưới cơ sở dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">Có kiểu đầy đủ</span><span class="lz-t">Ở mọi nơi model xuất hiện</span><span class="lz-d"><code>u.tenHienThi</code> là một <code>string</code> trong trình soạn thảo của bạn, ở mọi câu truy vấn, kể cả bên trong một <code>include</code>. Đây là phần một hàm phụ không cho bạn được.</span></div>
  <div class="lz-step"><span class="lz-k">Đúng cho trình bày, sai cho logic</span><span class="lz-t">Một tên hiển thị, một URL, một mức giá đã định dạng</span><span class="lz-d">Thứ mà cơ sở dữ liệu nên thi hành — một trạng thái suy ra từ ba cột mà các hệ thống khác cũng đọc — thuộc về một cột sinh ra hoặc một view, không thuộc về đây.</span></div>
</div>

<h3>2 · <code>model</code> — phương thức trên một delegate</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
      },
      async register(email: string, password: string) {
        return prisma.user.create({
          data: { email, password: await hash(password) },
        });
      },
    },
    post: {
      async publishPost(id: number) {
        return prisma.post.updateMany({
          where: { id, published: false },
          data:  { published: true, publishedAt: new Date() },
        });
      },
    },
    $allModels: {
      <span class="tok-comment">// có mặt trên MỌI model</span>
      async exists&lt;T&gt;(this: T, where: Prisma.Args&lt;T, 'findFirst'&gt;['where']): Promise&lt;boolean&gt; {
        const ctx = Prisma.getExtensionContext(this);
        const r = await (ctx as any).findFirst({ where, select: { id: true } });
        return r !== null;
      },
    },
  },
});

await prisma.user.findByEmail('an@example.com');
await prisma.post.publishPost(42);
await prisma.comment.exists({ postId: 1 });      <span class="tok-comment">// đến từ $allModels</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó là một tầng kho dữ liệu mà không cần cả cái tầng</span><span class="v">Các phương thức sống ngay cạnh model mà chúng thuộc về, gợi ý gõ tìm ra được khi gõ <code>prisma.user.</code>, và có kiểu. So với một lớp <code>UserRepository</code> phải import và nối dây riêng.</span></div>
  <div class="kv"><span class="k"><code>$allModels</code> cho những hàm phụ thật sự tổng quát</span><span class="v"><code>exists</code>, <code>demTheo</code>, <code>xoaMem</code> — bất cứ thứ gì chạy y hệt nhau trên mọi model. <code>Prisma.getExtensionContext(this)</code> là cách phương thức biết nó được gọi trên model nào.</span></div>
  <div class="kv"><span class="k">Lưu ý về tự tham chiếu</span><span class="v">Bên trong phương thức, <code>prisma</code> trỏ tới chính client đang được định nghĩa. Một số kho mã thích dùng <code>Prisma.getExtensionContext(this)</code> xuyên suốt để tránh vòng lặp ấy, nhất là khi các extension chồng lên nhau.</span></div>
  <div class="kv"><span class="k">Đừng nhét logic nghiệp vụ vào đây</span><span class="v">"Đăng một bài viết" là một thao tác dữ liệu và hợp. "Đăng một bài viết, báo cho người theo dõi, xoá cache" là logic ứng dụng và thuộc về một service — extension là tầng dữ liệu, không phải chỗ để mọi thứ.</span></div>
</div>

<h3>3 · <code>query</code> — chặn lại</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  query: {
    <span class="tok-comment">// mọi thao tác trên mọi model: ghi log những cái chậm</span>
    async $allOperations({ model, operation, args, query }) {
      const t0 = performance.now();
      const result = await query(args);
      const ms = performance.now() - t0;
      if (ms &gt; 200) console.warn(&#96;CHAM \${ms.toFixed(0)}ms \${model}.\${operation}&#96;);
      return result;
    },

    <span class="tok-comment">// một model, một thao tác: chuẩn hoá trước khi ghi</span>
    user: {
      create({ args, query }) {
        args.data.email = args.data.email.trim().toLowerCase();
        return query(args);
      },
      update({ args, query }) {
        if (typeof args.data.email === 'string') {
          args.data.email = args.data.email.trim().toLowerCase();
        }
        return query(args);
      },
    },
  },
});</code></pre>
<div class="out">CHAM 412ms post.findMany
CHAM 233ms user.aggregate</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bốn mức cụ thể</span><span class="lz-lnote"><code>$allOperations</code> (mọi thứ) · <code>$allModels: { findMany }</code> (một thao tác, mọi model) · <code>user: { $allOperations }</code> (một model, mọi thao tác) · <code>user: { create }</code> (đúng một). Hãy chọn mức hẹp nhất làm được việc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bạn buộc phải gọi <code>query(args)</code></span><span class="lz-lnote">Nó là phần còn lại của đường ống. Quên nó thì thao tác âm thầm không bao giờ chạy — promise trả về <code>undefined</code> và không có lỗi nào cả.</span></div>
  <div class="lz-layer"><span class="lz-lname">Middleware cũ đã bị gỡ</span><span class="lz-lnote">Ở Prisma 6.19.3 client không còn <code>$use</code> nữa — <code>typeof prisma.$use</code> là <code>'undefined'</code> (đo thật), nên mã chép từ hướng dẫn cũ ném TypeError ngay lúc khởi động. Extension là thứ thay thế: có kiểu, phạm vi theo từng model, ghép chồng được.</span></div>
  <div class="lz-layer"><span class="lz-lname">SQL thô được thấy, không bao giờ bị viết lại</span><span class="lz-lnote">Một <code>$allOperations</code> mức trên có nhận <code>$queryRaw</code> và <code>$executeRaw</code> (nó đếm được ba lời gọi ở dưới), nhưng hook mức model như <code>$allModels</code> thì không, và không extension nào sửa được câu SQL bên trong. Mọi bất biến được thi hành ở đây — lọc xoá mềm, phạm vi theo khách thuê — đều phải lặp lại bằng tay trong từng câu truy vấn thô.</span></div>
</div>
<div class="out">$ npx tsx ext.mts
== query: quen goi query(args) → undefined
prisma:query SELECT COUNT(*) AS "_count$_all" FROM (SELECT "id" FROM "users" WHERE 1=1 OFFSET $1) AS "sub"
prisma:query SELECT 1
prisma:query SELECT 1
== query: $allOperations dem duoc 3 lan cho: user.count + $queryRaw + $executeRaw
prisma:query SELECT COUNT(*) AS "_count$_all" FROM (SELECT "id" FROM "users" WHERE 1=1 OFFSET $1) AS "sub"</div>
<pre><code class="language-javascript"><span class="tok-comment">// Phạm vi theo khách thuê: cách dùng giá trị nhất của thành phần query</span>
function tenantClient(tenantId: number) {
  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          const doc = ['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'];
          const write = ['create', 'createMany'];

          if (doc.includes(operation)) {
            args.where = { ...(args as any).where, tenantId };
          } else if (write.includes(operation)) {
            (args as any).data = { ...(args as any).data, tenantId };
          }
          return query(args);
        },
      },
    },
  });
}

const db = tenantClient(req.user.tenantId);
await db.post.findMany();                               <span class="tok-comment">// có giới hạn</span>
await db.user.findMany({ include: { posts: true } });    <span class="tok-comment">// include thì KHÔNG</span>
await db.$queryRaw&#96;SELECT count(*)::int AS n FROM posts&#96;; <span class="tok-comment">// SQL thô cũng không</span></code></pre>
<p>Chạy trên lab (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3), hai khách thuê và 30 bài viết:</p>
<div class="out">$ npx tsx tenant.mts
findMany posts: tenant cua cac bai = [ 1 ]
findMany users + include posts: 5 user tenant 1, nhung 15 bai cua tenant 2 lot vao qua include
$queryRaw dem posts: 30 (ca hai tenant)</div>
<div class="pitfall">
<p><strong>Bẫy — một bộ lọc theo khách thuê đặt trong extension là một lưới an toàn, không phải một ranh giới bảo mật.</strong> Đo ở trên: truy vấn mức trên đã được giới hạn, nhưng một <code>include</code> trao cho khách thuê 1 mười lăm bài của khách thuê 2, và một câu đếm thô thấy cả ba mươi. Chép nó làm biện pháp bảo mật thì đó là rò dữ liệu giữa các khách hàng. Nó bao những truy vấn đi qua client đã mở rộng và không bao gì khác: không bao <code>$queryRaw</code>, không bao các lần đọc lồng bên trong một <code>include</code> trên model khác, không bao một hàm phụ đã cầm sẵn client gốc. Muốn cô lập thật thì hãy dùng row-level security của PostgreSQL, hoặc mỗi khách một schema, hoặc mỗi khách một cơ sở dữ liệu — và giữ extension làm tầng bắt những sai sót thông thường.</p>
</div>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-2-phan-quyen" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Ai được thấy hàng nào — API Design 6.2: Phân quyền</span><span class="lc-sub">Giống: một yêu cầu chỉ được chạm hàng của đúng khách thuê. Khác: ở đó phép kiểm nằm ở tầng API và được test theo từng endpoint — chỗ rò đo được ở trên là lý do không thể giao việc này cho extension.</span></span>
  <span class="lc-cta">MỞ BÀI API DESIGN →</span>
</a>

<h3>4 · <code>client</code> — phương thức mức trên</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient().$extends({
  client: {
    async healthy(): Promise&lt;boolean&gt; {
      try {
        await (Prisma.getExtensionContext(this) as any).$queryRaw&#96;SELECT 1&#96;;
        return true;
      } catch {
        return false;
      }
    },
    async connectionStats() {
      return (Prisma.getExtensionContext(this) as any).$queryRaw&#96;
        SELECT count(*)::int AS total,
               count(*) FILTER (WHERE state = 'active')::int AS dang_chay
        FROM pg_stat_activity WHERE datname = current_database()&#96;;
    },
  },
});

app.get('/health', async (_, res) =&gt; {
  res.status(await prisma.healthy() ? 200 : 503).end();
});</code></pre>

<h3>Ghép chồng, và cái thứ tự có ý nghĩa</h3>
<pre><code class="language-javascript">export const prisma = new PrismaClient()
  .$extends(xoaMem)        <span class="tok-comment">// 1 — lọc bỏ hàng đã xoá</span>
  .$extends(writeAuditLog)     <span class="tok-comment">// 2 — ghi log các lần ghi</span>
  .$extends(truongTinh)    <span class="tok-comment">// 3 — trường tính toán</span>
  .$extends(phuongThuc);   <span class="tok-comment">// 4 — phương thức của model</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Extension thêm trước là lớp ngoài cùng</span><span class="v">Đo bằng hai extension query ghi nhật ký, A thêm trước B: A thấy tham số đầu tiên và thấy kết quả sau cùng; B, thêm sau, nằm gần cơ sở dữ liệu hơn. Khi hai extension cùng sửa <code>args.where</code> thì thứ tự quyết định cơ sở dữ liệu nhận được gì — nên hãy in nó ra cho chồng của chính bạn.<div class="out">$ npx tsx ext.mts
== chong A roi B: A (them truoc) vao → B (them sau) vao → B (them sau) ra → A (them truoc) ra</div></span></div>
  <div class="kv"><span class="k">Kiểu tích luỹ lại</span><span class="v">Mỗi lần <code>$extends</code> trả về một kiểu rộng hơn, nên client cuối cùng có mọi thành viên thêm vào đều có kiểu. Hãy xuất đúng cái client đó và import nó ở khắp nơi.</span></div>
  <div class="kv"><span class="k">Ba thứ extension không làm được</span><span class="v">Nó không thêm được một trường vào cơ sở dữ liệu, không làm cho một trường tính toán lọc được, và không viết lại được SQL thô. Mỗi thứ đó là việc của lược đồ hoặc của SQL.</span></div>
  <div class="kv"><span class="k">Và một cái giá đáng biết</span><span class="v">Extension chồng sâu làm kiểu suy ra của client trở nên đồ sộ, và đó là một trong các đầu vào của chuyện trình soạn thảo ì với lược đồ lớn — chủ đề của bài kế tiếp.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Client extensions — tổng quan</span><span class="lc-sub">prisma.io/docs · Cả bốn thành phần kèm chữ ký kiểu, và cách ghép chồng phối hợp với nhau</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/result" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">Thành phần <code>result</code></span><span class="lc-sub">prisma.io/docs · <code>needs</code>, trường tính toán, và vì sao không lọc theo chúng được</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/query" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Thành phần <code>query</code></span><span class="lc-sub">prisma.io/docs · Bốn mức cụ thể và lối chuyển từ <code>$use</code></span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/ddl-rowsecurity.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — row-level security</span><span class="lc-sub">postgresql.org · Cô lập khách thuê thật sự, do cơ sở dữ liệu thi hành thay vì client</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng cả bốn thành phần, ghép chồng chúng, rồi tìm ba câu truy vấn mà phép chặn bỏ sót</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Big schemas and a slow editor|||8.5 — Lược đồ lớn và trình soạn thảo ì',
      slug: 'pr-8-5-luoc-do-lon',
      type: 'LESSON',
      description: 'Lược đồ lớn tốn gì khi TypeScript kiểm kiểu (đo trên 612 model thật và lược đồ 20–300 model), đọc tsc --extendedDiagnostics, skipLibCheck và incremental đo thật, generateTrace chỉ trên dòng lệnh.',
      content: `
${G08_5}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Big schemas and a slow editor</h2>
<p class="lead">Past roughly fifty models, hovering a Prisma query can take a second and autocomplete starts to lag. This is real, it is a known consequence of how the types are computed, and most of the advice about it on the internet is folklore. This lesson measures the problem first, then applies the fixes that actually move the number.</p>

<h3>Why it happens</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The types are computed, not written</span><span class="lz-lnote"><code>PostGetPayload&lt;{ include: { author: { select: { … } } } }&gt;</code> is a conditional type evaluated on demand. TypeScript does that work every time you hover, and it does not cache it across edits the way it caches a plain interface.</span></div>
  <div class="lz-layer"><span class="lz-lname">Relations multiply</span><span class="lz-lnote">Every relation adds nested input types on both models, and those reference each other. A densely connected schema produces types whose evaluation branches far more than the model count suggests — Lesson 1.2 measured 31 types for a four-field model.</span></div>
  <div class="lz-layer"><span class="lz-lname">The file is genuinely large</span><span class="lz-lnote">A hundred models is a megabyte or more of <code>index.d.ts</code>. Parsing it is a one-off cost; keeping its symbols in memory is not.</span></div>
  <div class="lz-layer"><span class="lz-lname">Extensions widen it further</span><span class="lz-lnote">Each <code>$extends</code> wraps the client type in another layer of inference, as Lesson 8.4 noted. Four stacked extensions on a large schema is where people first notice the lag.</span></div>
</div>

<h3>Measure it</h3>
<pre><code class="language-bash"><span class="tok-comment"># The first number: how long a clean check takes, and where it goes</span>
npx tsc --noEmit --extendedDiagnostics</code></pre>
<div class="out">Files:                         3454
Lines of Library:             50140
Lines of Definitions:       1732150
Lines of TypeScript:         368792
Types:                      1703073
Instantiations:             6861338
Memory used:               4933922K
Parse time:                   3.13s
Bind time:                    2.43s
Check time:                  37.82s
Total time:                  44.69s</div>
<p>That is the real CuongThai backend (12 Nov 2026, Apple M1 Max laptop, TypeScript 5.9.3, Prisma 6.19.3): 612 models, 57 enums, a 17,699-line schema and a 70 MB generated <code>index.d.ts</code>. Read it like this:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Instantiations</code></span><span class="v">How many times a generic type had to be evaluated. It is deterministic — the same code gives the same count on any machine — so it is the number to compare before and after a change. Seconds are not: the same check varied by several seconds between runs here while other work was running.</span></div>
  <div class="kv"><span class="k"><code>Check time</code></span><span class="v">Type checking proper — about 38 of the 45 seconds above. When it dominates <code>Parse</code> and <code>Bind</code>, the cost is type complexity, not file size.</span></div>
  <div class="kv"><span class="k"><code>Lines of Definitions</code></span><span class="v">1.7 million lines of <code>.d.ts</code>, most of them the generated client, against 369k lines of the project&#39;s own TypeScript.</span></div>
  <div class="kv"><span class="k">Re-measure after every change</span><span class="v">This is the whole discipline. The sections below show which advice moved the number and which did not.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># The second number: which files and which types are expensive</span>
npx tsc --noEmit --extendedDiagnostics --generateTrace ./trace
ls trace/</code></pre>
<div class="out">trace.json
types.json</div>
<div class="callout ok">
<p><strong><code>--generateTrace</code> is a command-line flag, and it ends the guessing.</strong> Load <code>trace.json</code> in <code>ui.perfetto.dev</code>: the wide bars are the expensive checks, named by file and line. On a Prisma codebase they are usually a specific query — a deeply nested <code>include</code>, or a generic helper over <code>Prisma.Args</code>. Run it when you have a slow spot to find; it is not a tsconfig setting (see below).</p>
</div>

<h3>What schema size costs — measured</h3>
<p>Three generated schemas of 20, 100 and 300 models (every model with two relations out and two back), the same small file of queries against each, three runs per cell, 12 Nov 2026, Apple M1 Max laptop, TypeScript 5.9.3, Prisma 6.19.3:</p>
<div class="out">models  index.d.ts  skipLibCheck  Instantiations  Check   Total (median of 3)
20         1.3 MB   true                   9,653   0.07s    0.31s
20         1.3 MB   false                132,027    fals    1.08s
100        6.3 MB   true                   9,653   0.08s    0.64s
100        6.3 MB   false                569,387    fals    2.94s
300       19.1 MB   true                   9,653   0.09s    1.40s
300       19.1 MB   false              1,662,787    fals    7.35s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">With <code>skipLibCheck: true</code></span><span class="v">Instantiations did not move — 9,653 at 20 models and at 300. The checker only evaluates the types your code touches. A bigger schema costs reading a bigger file (total time rose about fourfold), not checking.</span></div>
  <div class="kv"><span class="k">With <code>skipLibCheck: false</code></span><span class="v">tsc re-verifies the entire generated client: 1.66 million instantiations at 300 models, check time more than sixty times longer — all of it spent on a file nobody edits.</span></div>
</div>

<h3>The mitigations, ranked by measured effect</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · <code>skipLibCheck: true</code></span><span class="lz-t">Largest effect measured</span><span class="lz-d">Skips type-checking declaration files, never your code. In the lab above it is the difference between 9,653 and 1.66 million instantiations. Prisma&#39;s <code>index.d.ts</code> is machine-written; re-verifying it on every build buys nothing.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Turn on <code>incremental</code></span><span class="lz-t">Large effect on repeat runs</span><span class="lz-d">On the CuongThai backend the second run with nothing changed took 6.2 s instead of 41.6 s, with zero instantiations and half the memory (output below). Nothing for a cold run, a CI job without the cached <code>.tsbuildinfo</code>, or the editor&#39;s first load.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Name deep query types</span><span class="lz-t">Fewer instantiations; measure the time yourself</span><span class="lz-d">A four-level <code>include</code> used by eight functions: written inline eight times versus named once with <code>satisfies</code> + <code>GetPayload</code> (Lesson 8.2) — a quarter fewer instantiations, and no change the clock could see (output below). Do it for correctness; promise speed only after measuring your own code.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Annotate exported function returns</span><span class="lz-t">Not measured in this course</span><span class="lz-d">An explicit <code>: Promise&lt;FullPost | null&gt;</code> gives the checker a stopping point for consumers. Plausible for incremental checks; verify with the numbers above before relying on it.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Split the schema by domain</span><span class="lz-t">Architectural, not a tuning knob</span><span class="lz-d">Two clients over two schemas means separate migration histories and no cross-client relations. Only for a schema that is genuinely two systems — and the measurement above says schema size alone is mostly a reading cost.</span></div>
</div>
<pre><code class="language-javascript"><span class="tok-comment">// After: computed once, named, and reusable</span>
const kemDayDu = {
  author:   { include: { profile: true } },
  comments: { include: { author: true, replies: { include: { author: true } } } },
  tags:     { include: { tag: true } },
} satisfies Prisma.PostInclude;

export type FullPost = Prisma.PostGetPayload&lt;{ include: typeof kemDayDu }&gt;;

export async function getPost(id: number): Promise&lt;FullPost | null&gt; {
  return prisma.post.findUnique({ where: { id }, include: kemDayDu });
}</code></pre>
<div class="out">-- the lab&#39;s version: a four-level include used by 8 functions, 300 models
written inline ×8   Instantiations  9,653   Check 0.09s   Total 1.40s
named once          Instantiations  7,268   Check 0.08s   Total 1.35s   ← −25% instantiations</div>
<pre><code class="language-bash"><span class="tok-comment"># incremental, measured on the CuongThai backend (tsbuildinfo kept outside the repo)</span></code></pre>
<div class="out">$ npx tsc --noEmit -p tsconfig.json --incremental --tsBuildInfoFile &lt;outside the repo&gt; --extendedDiagnostics   # run 1 (cold)
Instantiations:             6861338
Memory used:               4976690K
Check time:                  35.04s
Total time:                  41.60s
$ # run 2, nothing changed
Instantiations:                   0
Memory used:               2379628K
Total time:                   6.22s</div>

<h3>The tsconfig that helps</h3>
<pre><code class="language-typescript">{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/.cache/tsbuildinfo",
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "dist", "frontend"]
}</code></pre>
<div class="pitfall">
<p><strong>Trap — <code>"generateTrace": false</code> in tsconfig stops the build.</strong> <code>generateTrace</code> takes a directory, so a boolean is rejected and tsc exits with code 2 — every check, every build. Measured:</p>
<div class="out">tsconfig.trace.json(1,169): error TS5024: Compiler option 'generateTrace' requires a value of type string.
[exit 2]</div>
<p>Pass <code>--generateTrace ./trace</code> on the command line when you are hunting a slow spot, and leave it out of tsconfig.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>skipLibCheck</code> is not cheating</span><span class="v">It skips declaration files, not your code — and it is the setting that moved the number most in the measurement above.</span></div>
  <div class="kv"><span class="k"><code>incremental</code> needs a stable cache location</span><span class="v">Point <code>tsBuildInfoFile</code> somewhere gitignored but persistent. In CI, cache that file between runs, or the second-run saving never happens.</span></div>
  <div class="kv"><span class="k">Restart the TypeScript server after regenerating</span><span class="v">The editor holds the old <code>index.d.ts</code> in memory. After a <code>prisma generate</code> that changed the schema, "TypeScript: Restart TS Server" is what makes the new types appear.</span></div>
</div>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-9-1-tsc-and-tsconfig" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">tsconfig from first principles — TS 9.1: What tsc does &amp; tsconfig basics</span><span class="lc-sub">Same: skipLibCheck, incremental and which options are command-line only. Different: there for any project; here measured on a generated Prisma client.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>

<h3>What does not help</h3>
<div class="callout warn">
<p><strong>Three pieces of common advice that measure as noise.</strong> <em>Importing types individually</em> rather than the <code>Prisma</code> namespace — TypeScript loads the whole declaration file either way. <em>Using <code>import type</code> everywhere</em> — it helps bundling and emit, not checking. <em>Turning off <code>strict</code></em> — it makes checking marginally faster and every other thing in this course worse; the whole point of Prisma is the types.</p>
<p>Measured, the order is: <code>skipLibCheck</code> first, <code>incremental</code> with a cached <code>.tsbuildinfo</code> second, and then <code>--generateTrace</code> to find the specific query that is slow — instead of rewriting the data layer on a hunch.</p>
</div>

<div class="note-ct">
<p><strong>Scale, for reference.</strong> The CuongThai schema is 17,699 lines with 612 models and 57 enums, and its generated <code>index.d.ts</code> is 70 MB — measured on 12 November 2026. It grew one model at a time, and nobody notices the day it crosses a threshold. Running <code>tsc --extendedDiagnostics</code> once a quarter and writing <code>Instantiations</code> down is enough: when it doubles, you know which quarter&#39;s work to look at.</p>
</div>

<h3>Learning sources for this lesson</h3>
<div class="pitfall">
<p><strong>Trap — deleting types to speed up the editor, and losing the checking that was the point.</strong> When the language server slows to a crawl on a large schema, the tempting fix is to loosen: type a query result as &#96;any&#96;, drop a &#96;select&#96; so the payload type is simpler, replace a derived type with a hand-written one. Each is instant relief and each removes a real check, so the schema is now large <em>and</em> unverified — the worst of both. The measured mitigations in this lesson (&#96;skipLibCheck&#96;, &#96;incremental&#96;, naming deep query types) keep the checking and cost only configuration. Measure with &#96;tsc --diagnostics&#96; before and after, and treat any fix that changes a type to &#96;any&#96; as a regression, not a solution.</p>
</div>
<a class="link-card" href="https://github.com/microsoft/TypeScript/wiki/Performance" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">TypeScript — Performance wiki</span><span class="lc-sub">github.com · The official guide, including <code>--generateTrace</code> and how to read the output</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/working-with-many-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">📐</span><span class="lc-body"><span class="lc-title">Prisma — large schema guidance</span><span class="lc-sub">prisma.io/docs · The maintainers' own notes on schema size and editor performance</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/overview/location#multi-file-prisma-schema" target="_blank" rel="noopener"><span class="lc-ico">📂</span><span class="lc-body"><span class="lc-title">Multi-file schemas</span><span class="lc-sub">prisma.io/docs · Splitting <code>schema.prisma</code> into a folder — organisation, though not a type-performance fix</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript, compiler chapter</span><span class="lc-sub">How inference and conditional types are evaluated — why naming a type stops the recomputation</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Profile a slow codebase with --generateTrace, fix the three widest bars, and measure the difference</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Lược đồ lớn và trình soạn thảo ì</h2>
<p class="lead">Qua khoảng năm mươi model, rê chuột lên một câu truy vấn Prisma có thể mất một giây và gợi ý gõ bắt đầu lag. Chuyện này có thật, nó là hệ quả đã biết của cách các kiểu được tính ra, và phần lớn lời khuyên về nó trên mạng là truyền miệng. Bài này đo bài toán trước, rồi áp những cách vá thật sự làm con số dịch chuyển.</p>

<h3>Vì sao nó xảy ra</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Các kiểu được tính ra, không phải được viết ra</span><span class="lz-lnote"><code>PostGetPayload&lt;{ include: { author: { select: { … } } } }&gt;</code> là một kiểu điều kiện được tính theo yêu cầu. TypeScript làm phần việc đó mỗi lần bạn rê chuột, và nó không lưu đệm qua các lần sửa như cách nó lưu đệm một interface thuần.</span></div>
  <div class="lz-layer"><span class="lz-lname">Quan hệ nhân lên</span><span class="lz-lnote">Mỗi quan hệ thêm các kiểu input lồng nhau trên cả hai model, và chúng tham chiếu lẫn nhau. Một lược đồ nối chằng chịt đẻ ra những kiểu mà việc tính chúng rẽ nhánh nhiều hơn hẳn con số model gợi ra — Bài 1.2 đo được 31 kiểu cho một model bốn trường.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái tệp thật sự lớn</span><span class="lz-lnote">Một trăm model là một megabyte trở lên của <code>index.d.ts</code>. Phân tích nó là chi phí một lần; giữ các ký hiệu của nó trong bộ nhớ thì không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Extension còn nới rộng thêm</span><span class="lz-lnote">Mỗi lần <code>$extends</code> bọc kiểu client trong một tầng suy diễn nữa, như Bài 8.4 đã lưu ý. Bốn extension chồng lên một lược đồ lớn là chỗ người ta lần đầu nhận ra độ trễ.</span></div>
</div>

<h3>Hãy đo nó</h3>
<pre><code class="language-bash"><span class="tok-comment"># Con số đầu tiên: một lần kiểm sạch mất bao lâu, và thời gian đi đâu</span>
npx tsc --noEmit --extendedDiagnostics</code></pre>
<div class="out">Files:                         3454
Lines of Library:             50140
Lines of Definitions:       1732150
Lines of TypeScript:         368792
Types:                      1703073
Instantiations:             6861338
Memory used:               4933922K
Parse time:                   3.13s
Bind time:                    2.43s
Check time:                  37.82s
Total time:                  44.69s</div>
<p>Đó là backend CuongThai thật (12/11/2026, laptop Apple M1 Max, TypeScript 5.9.3, Prisma 6.19.3): 612 model, 57 enum, lược đồ 17.699 dòng và tệp <code>index.d.ts</code> sinh ra nặng 70 MB. Đọc nó thế này:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Instantiations</code></span><span class="v">Số lần một kiểu generic phải được tính. Nó tất định — cùng một mã thì ra cùng một số trên mọi máy — nên đây là con số để so trước và sau một thay đổi. Giây thì không: cùng một lần kiểm ở đây lệch nhau vài giây giữa các lần chạy khi máy đang làm việc khác.</span></div>
  <div class="kv"><span class="k"><code>Check time</code></span><span class="v">Phần kiểm kiểu thật sự — khoảng 38 trên 45 giây ở trên. Khi nó lấn át <code>Parse</code> và <code>Bind</code>, cái giá nằm ở độ phức tạp của kiểu, không phải kích thước tệp.</span></div>
  <div class="kv"><span class="k"><code>Lines of Definitions</code></span><span class="v">1,7 triệu dòng <code>.d.ts</code>, phần lớn là client sinh ra, so với 369 nghìn dòng TypeScript của chính dự án.</span></div>
  <div class="kv"><span class="k">Đo lại sau mỗi thay đổi</span><span class="v">Đây là toàn bộ kỷ luật. Các mục dưới cho thấy lời khuyên nào làm con số đổi và lời khuyên nào không.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Con số thứ hai: tệp nào và kiểu nào tốn kém</span>
npx tsc --noEmit --extendedDiagnostics --generateTrace ./trace
ls trace/</code></pre>
<div class="out">trace.json
types.json</div>
<div class="callout ok">
<p><strong><code>--generateTrace</code> là cờ dòng lệnh, và nó chấm dứt việc đoán mò.</strong> Mở <code>trace.json</code> trong <code>ui.perfetto.dev</code>: những thanh rộng là các lần kiểm tốn kém, kèm tên tệp và dòng. Trên một kho mã Prisma chúng thường là một truy vấn cụ thể — một <code>include</code> lồng sâu, hoặc một hàm phụ generic nhận <code>Prisma.Args</code>. Chạy nó khi cần tìm chỗ chậm; nó không phải một thiết lập của tsconfig (xem bên dưới).</p>
</div>

<h3>Kích thước lược đồ tốn gì — đo thật</h3>
<p>Ba lược đồ sinh ra với 20, 100 và 300 model (mỗi model hai quan hệ đi và hai quan hệ về), cùng một tệp truy vấn nhỏ dùng chúng, mỗi ô chạy ba lần, 12/11/2026, laptop Apple M1 Max, TypeScript 5.9.3, Prisma 6.19.3:</p>
<div class="out">model   index.d.ts  skipLibCheck  Instantiations  Check   Total (trung vị 3 lần)
20         1.3 MB   true                   9,653   0.07s    0.31s
20         1.3 MB   false                132,027    fals    1.08s
100        6.3 MB   true                   9,653   0.08s    0.64s
100        6.3 MB   false                569,387    fals    2.94s
300       19.1 MB   true                   9,653   0.09s    1.40s
300       19.1 MB   false              1,662,787    fals    7.35s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Với <code>skipLibCheck: true</code></span><span class="v">Instantiations không nhúc nhích — 9.653 ở 20 model và ở 300 model. Bộ kiểm chỉ tính những kiểu mã của bạn chạm tới. Lược đồ to tốn công đọc một tệp to hơn (tổng thời gian tăng khoảng bốn lần), không tốn công kiểm.</span></div>
  <div class="kv"><span class="k">Với <code>skipLibCheck: false</code></span><span class="v">tsc kiểm lại toàn bộ client sinh ra: 1,66 triệu instantiation ở 300 model, phần kiểm chậm hơn sáu mươi lần — toàn bộ công đó dồn vào một tệp không ai sửa.</span></div>
</div>

<h3>Các cách giảm nhẹ, xếp theo hiệu quả đo được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · <code>skipLibCheck: true</code></span><span class="lz-t">Hiệu quả lớn nhất đo được</span><span class="lz-d">Bỏ qua kiểm kiểu tệp khai báo, không bao giờ bỏ qua mã của bạn. Trong lab ở trên, đó là khác biệt giữa 9.653 và 1,66 triệu instantiation. <code>index.d.ts</code> của Prisma do máy viết; kiểm lại nó mỗi lần dựng không được gì.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Bật <code>incremental</code></span><span class="lz-t">Hiệu quả lớn với lần chạy lặp lại</span><span class="lz-d">Trên backend CuongThai, lần chạy thứ hai khi không đổi gì mất 6,2 giây thay vì 41,6 giây, không còn instantiation nào, và nửa bộ nhớ (output bên dưới). Không được gì cho lần chạy lạnh, cho CI không cache <code>.tsbuildinfo</code>, hay lần đầu mở trình soạn thảo.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Đặt tên kiểu truy vấn sâu</span><span class="lz-t">Ít instantiation hơn; thời gian thì tự đo</span><span class="lz-d">Một <code>include</code> lồng bốn tầng dùng ở tám hàm: viết tại chỗ tám lần so với đặt tên một lần bằng <code>satisfies</code> + <code>GetPayload</code> (bài 8.2) — giảm một phần tư instantiation, và đồng hồ không thấy khác (output bên dưới). Làm nó vì tính đúng đắn; chỉ hứa nhanh hơn sau khi đo trên mã của chính bạn.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Ghi kiểu trả về cho hàm export</span><span class="lz-t">Khoá học này chưa đo</span><span class="lz-d">Một <code>: Promise&lt;FullPost | null&gt;</code> rõ ràng cho bộ kiểm một điểm dừng với bên dùng. Hợp lý với lần kiểm tăng dần; hãy kiểm bằng các con số ở trên trước khi dựa vào nó.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Tách lược đồ theo miền</span><span class="lz-t">Thay đổi kiến trúc, không phải núm vặn</span><span class="lz-d">Hai client trên hai lược đồ nghĩa là hai lịch sử migration riêng và không có quan hệ chéo giữa client. Chỉ dành cho lược đồ thật sự là hai hệ thống — và số đo ở trên cho thấy riêng kích thước lược đồ chủ yếu là chi phí đọc.</span></div>
</div>
<pre><code class="language-javascript"><span class="tok-comment">// Sau: tính một lần, có tên, và dùng lại được</span>
const kemDayDu = {
  author:   { include: { profile: true } },
  comments: { include: { author: true, replies: { include: { author: true } } } },
  tags:     { include: { tag: true } },
} satisfies Prisma.PostInclude;

export type FullPost = Prisma.PostGetPayload&lt;{ include: typeof kemDayDu }&gt;;

export async function getPost(id: number): Promise&lt;FullPost | null&gt; {
  return prisma.post.findUnique({ where: { id }, include: kemDayDu });
}</code></pre>
<div class="out">-- bản của lab: một include bốn tầng dùng ở 8 hàm, 300 model
viết tại chỗ ×8      Instantiations  9,653   Check 0.09s   Total 1.40s
đặt tên một lần     Instantiations  7,268   Check 0.08s   Total 1.35s   ← −25% instantiations</div>
<pre><code class="language-bash"><span class="tok-comment"># incremental, đo trên backend CuongThai (tsbuildinfo để ngoài repo)</span></code></pre>
<div class="out">$ npx tsc --noEmit -p tsconfig.json --incremental --tsBuildInfoFile &lt;ngoài repo&gt; --extendedDiagnostics   # lần 1 (lạnh)
Instantiations:             6861338
Memory used:               4976690K
Check time:                  35.04s
Total time:                  41.60s
$ # lần 2, không đổi tệp nào
Instantiations:                   0
Memory used:               2379628K
Total time:                   6.22s</div>

<h3>Cái tsconfig có giúp</h3>
<pre><code class="language-typescript">{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/.cache/tsbuildinfo",
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "dist", "frontend"]
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>"generateTrace": false</code> trong tsconfig làm dừng cả lần dựng.</strong> <code>generateTrace</code> nhận một thư mục, nên giá trị boolean bị từ chối và tsc thoát với mã 2 — mọi lần kiểm, mọi lần dựng. Đo thật:</p>
<div class="out">tsconfig.trace.json(1,169): error TS5024: Compiler option 'generateTrace' requires a value of type string.
[exit 2]</div>
<p>Truyền <code>--generateTrace ./trace</code> trên dòng lệnh khi đang săn chỗ chậm, và để nó ra khỏi tsconfig.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>skipLibCheck</code> không phải gian lận</span><span class="v">Nó bỏ qua tệp khai báo, không bỏ qua mã của bạn — và đó là thiết lập làm con số đổi nhiều nhất trong phép đo ở trên.</span></div>
  <div class="kv"><span class="k"><code>incremental</code> cần một chỗ cache ổn định</span><span class="v">Trỏ <code>tsBuildInfoFile</code> tới một chỗ bị gitignore nhưng tồn tại lâu dài. Trong CI, hãy cache tệp đó giữa các lần chạy, không thì phần tiết kiệm của lần chạy thứ hai không bao giờ xảy ra.</span></div>
  <div class="kv"><span class="k">Khởi động lại TypeScript server sau khi sinh lại</span><span class="v">Trình soạn thảo giữ <code>index.d.ts</code> cũ trong bộ nhớ. Sau một lần <code>prisma generate</code> có đổi lược đồ, "TypeScript: Restart TS Server" mới làm kiểu mới hiện ra.</span></div>
</div>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-9-1-tsc-and-tsconfig" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">tsconfig từ gốc — TS 9.1: tsc làm gì &amp; cơ bản về tsconfig</span><span class="lc-sub">Giống: skipLibCheck, incremental và tuỳ chọn nào chỉ dùng trên dòng lệnh. Khác: ở đó cho mọi dự án; ở đây đo trên client Prisma sinh ra.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>

<h3>Những gì không giúp</h3>
<div class="callout warn">
<p><strong>Ba lời khuyên phổ biến mà đo ra chỉ là nhiễu.</strong> <em>Import từng kiểu riêng</em> thay vì cả không gian tên <code>Prisma</code> — TypeScript nạp cả tệp khai báo đằng nào cũng vậy. <em>Dùng <code>import type</code> ở khắp nơi</em> — nó giúp phần đóng gói và phát mã, không giúp phần kiểm kiểu. <em>Tắt <code>strict</code></em> — nó làm việc kiểm nhanh hơn một chút và làm mọi thứ khác trong khoá học này tệ đi; toàn bộ điểm của Prisma chính là hệ kiểu.</p>
<p>Theo số đo, thứ tự là: <code>skipLibCheck</code> trước, <code>incremental</code> với <code>.tsbuildinfo</code> được cache thứ hai, rồi <code>--generateTrace</code> để tìm đúng truy vấn chậm — thay vì viết lại tầng dữ liệu theo linh cảm.</p>
</div>

<div class="note-ct">
<p><strong>Quy mô, để tham chiếu.</strong> Lược đồ CuongThai dài 17.699 dòng với 612 model và 57 enum, và tệp <code>index.d.ts</code> sinh ra nặng 70 MB — đo ngày 12/11/2026. Nó lớn dần lên từng model một, và không ai để ý cái ngày nó vượt ngưỡng. Chạy <code>tsc --extendedDiagnostics</code> mỗi quý một lần rồi ghi <code>Instantiations</code> lại là đủ: khi nó tăng gấp đôi thì bạn biết phải nhìn lại phần việc của quý nào.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<div class="pitfall">
<p><strong>Bẫy — xoá bớt kiểu cho trình soạn thảo chạy nhanh, và mất luôn phần kiểm vốn là mục đích.</strong> Khi máy chủ ngôn ngữ ì ạch trên một lược đồ lớn, cách chữa hấp dẫn là nới lỏng: gán kết quả truy vấn là &#96;any&#96;, bỏ một &#96;select&#96; cho kiểu payload đơn giản đi, thay một kiểu dẫn xuất bằng một kiểu viết tay. Cái nào cũng nhẹ nhõm tức thì và cái nào cũng gỡ đi một phép kiểm thật, nên giờ lược đồ vừa lớn <em>vừa</em> không được xác minh — tệ cả đôi đường. Những cách giảm nhẹ đã đo trong bài này (&#96;skipLibCheck&#96;, &#96;incremental&#96;, đặt tên kiểu truy vấn sâu) giữ nguyên phần kiểm và chỉ tốn cấu hình. Hãy đo bằng &#96;tsc --diagnostics&#96; trước và sau, và coi mọi cách chữa biến một kiểu thành &#96;any&#96; là một bước lùi chứ không phải một lời giải.</p>
</div>
<a class="link-card" href="https://github.com/microsoft/TypeScript/wiki/Performance" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">TypeScript — wiki về hiệu năng</span><span class="lc-sub">github.com · Hướng dẫn chính thức, kể cả <code>--generateTrace</code> và cách đọc kết quả</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/working-with-many-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">📐</span><span class="lc-body"><span class="lc-title">Prisma — hướng dẫn cho lược đồ lớn</span><span class="lc-sub">prisma.io/docs · Ghi chú của chính đội ngũ về kích thước lược đồ và hiệu năng trình soạn thảo</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/overview/location#multi-file-prisma-schema" target="_blank" rel="noopener"><span class="lc-ico">📂</span><span class="lc-body"><span class="lc-title">Lược đồ nhiều tệp</span><span class="lc-sub">prisma.io/docs · Chẻ <code>schema.prisma</code> thành thư mục — chuyện tổ chức, chứ không phải cách vá hiệu năng kiểu</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript, chương trình biên dịch</span><span class="lc-sub">Suy diễn và kiểu điều kiện được tính ra sao — vì sao đặt tên cho một kiểu chấm dứt việc tính lại</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Đo một kho mã chậm bằng --generateTrace, vá ba thanh rộng nhất, và đo lại khác biệt</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Trắc nghiệm Chương 8',
      slug: 'pr-8-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: kiểu model không mô tả được gì, satisfies so với chú thích kiểu, lý do sự cố enum vô hình, needs trong result extension, query extension bỏ sót gì, instanceof khi bắt lỗi, DbNull so với JsonNull, và cách giảm Instantiations.',
      content: `
<div class="ml-en">
<p>Eight questions on the generated type system. The two about the production incident are the ones worth getting right — they describe a bug that is present in most codebases right now.</p>
</div>
<div class="ml-vi">
<p>Tám câu về hệ kiểu được sinh ra. Hai câu về sự cố production là hai câu đáng làm đúng — chúng mô tả một con bọ đang có mặt trong phần lớn kho mã ngay lúc này.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does the generated `User` type NOT describe?|||Kiểu `User` được sinh ra KHÔNG mô tả cái gì?',
            options: [
              'The result of a query with include or select — those are narrower or wider shapes with no generated name, which is what GetPayload is for|||Kết quả của một truy vấn có include hay select — đó là những hình dạng hẹp hơn hoặc rộng hơn, không có tên sẵn, và GetPayload sinh ra là để giải chuyện đó',
              'Nullable columns, which must be declared by hand|||Các cột cho phép null, phải khai bằng tay',
              'Enum-typed fields, which come from a separate import|||Các trường kiểu enum, vốn đến từ một lệnh import riêng',
              'Nothing — User describes every possible query result on that model|||Không thiếu gì — User mô tả mọi kết quả truy vấn có thể có trên model đó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why `satisfies Prisma.PostSelect` rather than `: Prisma.PostSelect`?|||Vì sao dùng `satisfies Prisma.PostSelect` chứ không phải `: Prisma.PostSelect`?',
            options: [
              'The annotation widens the value to the whole PostSelect type, so typeof it is useless; satisfies checks it while keeping the literal shape GetPayload needs|||Chú thích kiểu nới rộng giá trị thành cả kiểu PostSelect, nên typeof nó thành vô dụng; satisfies kiểm nó mà vẫn giữ hình dạng chữ mà GetPayload cần',
              'The annotation is not valid TypeScript for object literals|||Chú thích kiểu không hợp lệ trong TypeScript với đối tượng dạng chữ',
              'satisfies runs the check at runtime, which is stricter|||satisfies kiểm lúc chạy, và như vậy chặt hơn',
              'They are equivalent; satisfies is only newer syntax|||Hai cái tương đương; satisfies chỉ là cú pháp mới hơn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why did the CODE → CODE_REVIEW rename pass every check and still break the seed?|||Vì sao lần đổi tên CODE → CODE_REVIEW qua mọi phép kiểm mà vẫn làm vỡ phần seed?',
            options: [
              'tsconfig excluded prisma/**, so tsc never opened seed.ts — whose hand-copied union still said CODE; the client refused it only when the seed ran|||tsconfig loại prisma/**, nên tsc chưa bao giờ mở seed.ts — nơi union chép tay vẫn ghi CODE; client chỉ từ chối nó khi seed chạy',
              'The migration renamed the enum but not the existing rows, so old values remained|||Migration đổi tên enum nhưng không đổi các hàng đang có, nên giá trị cũ vẫn còn',
              'prisma generate was not run, so the client still had the old value|||prisma generate chưa được chạy, nên client vẫn giữ giá trị cũ',
              'The seed runs before migrations, so it saw the old schema|||Seed chạy trước migration, nên nó thấy lược đồ cũ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `needs` do in a `result` extension?|||`needs` làm gì trong một extension `result`?',
            options: [
              'Declares which columns the computed field reads, so Prisma adds them to the SELECT even when your select did not ask for them|||Khai báo trường tính toán đọc những cột nào, để Prisma thêm chúng vào SELECT ngay cả khi select của bạn không xin',
              'Declares which other extensions must be applied first|||Khai báo những extension nào phải được áp dụng trước',
              'Makes the computed field filterable in a where clause|||Làm cho trường tính toán lọc được trong mệnh đề where',
              'Nothing at runtime — it is documentation for other developers|||Không làm gì lúc chạy — nó là tài liệu cho lập trình viên khác',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A `query` extension adds a tenant filter to every operation. What does it miss?|||Một extension `query` thêm bộ lọc theo khách thuê vào mọi thao tác. Nó bỏ sót cái gì?',
            options: [
              'Rows read through an include on another model, and raw SQL — measured, an include leaked another tenant’s posts; it is a safety net, real isolation needs row-level security|||Các hàng đọc qua include trên model khác, và SQL thô — đo thật, một include làm lọt bài của khách thuê khác; nó là lưới an toàn, cô lập thật cần row-level security',
              'Nothing — the query component intercepts every path to the database|||Không sót gì — thành phần query chặn mọi đường tới cơ sở dữ liệu',
              'Only findMany; the other read operations are not interceptable|||Chỉ findMany; các thao tác đọc khác không chặn được',
              'Writes; the query component can only modify read arguments|||Các lần ghi; thành phần query chỉ sửa được tham số của lần đọc',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why must you write `e instanceof Prisma.PrismaClientKnownRequestError` before reading `e.code`?|||Vì sao phải viết `e instanceof Prisma.PrismaClientKnownRequestError` trước khi đọc `e.code`?',
            options: [
              'Without it people cast to any, and an unrelated error that happens to have a code property matches the branch — the instanceof is what makes the narrowing real|||Không có nó thì người ta ép kiểu sang any, và một lỗi không liên quan tình cờ có thuộc tính code sẽ khớp trúng nhánh — chính instanceof mới làm phép thu hẹp kiểu trở nên có thật',
              'Prisma errors are frozen objects and code is otherwise unreadable|||Lỗi của Prisma là đối tượng đóng băng nên nếu không thì không đọc được code',
              'It is only needed in strict mode|||Nó chỉ cần ở chế độ strict',
              'It is not needed — e.code is always safe to read on a caught error|||Không cần — e.code luôn an toàn để đọc trên một lỗi đã bắt được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between `Prisma.DbNull` and `Prisma.JsonNull`?|||Khác nhau giữa `Prisma.DbNull` và `Prisma.JsonNull` là gì?',
            options: [
              'DbNull sets the column to SQL NULL; JsonNull stores the JSON value null in it — the column is not null in the second case|||DbNull đặt cột thành NULL của SQL; JsonNull lưu giá trị JSON null vào đó — ở trường hợp thứ hai thì cột không phải null',
              'DbNull is for reads and JsonNull is for writes|||DbNull dùng khi đọc còn JsonNull dùng khi ghi',
              'They are the same value with two names, kept for backwards compatibility|||Chúng là cùng một giá trị với hai tên, giữ lại cho tương thích ngược',
              'DbNull works on PostgreSQL and JsonNull on MySQL|||DbNull chạy trên PostgreSQL còn JsonNull chạy trên MySQL',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In this chapter’s measurements on large schemas, which setting moved the instantiation count most?|||Trong các phép đo của chương này trên lược đồ lớn, thiết lập nào làm số instantiation đổi nhiều nhất?',
            options: [
              'skipLibCheck: true — tsc stops re-checking the generated client’s declarations (9,653 vs 1.66 million at 300 models)|||skipLibCheck: true — tsc thôi kiểm lại phần khai báo của client sinh ra (9.653 so với 1,66 triệu ở 300 model)',
              'Import types individually instead of the Prisma namespace|||Import từng kiểu riêng thay vì cả không gian tên Prisma',
              'Turn off strict mode in tsconfig|||Tắt chế độ strict trong tsconfig',
              'Use import type everywhere instead of plain import|||Dùng import type ở khắp nơi thay vì import thường',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
