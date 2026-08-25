/**
 * Prisma ORM — Chương 2: Ngôn ngữ lược đồ.
 * Model và kiểu vô hướng · thuộc tính trường · thuộc tính khối · native type · enum/Json/Bytes/Unsupported · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 2 — The schema language|||Chương 2 — Ngôn ngữ lược đồ',
  description: 'Toàn bộ Prisma Schema Language: chín kiểu vô hướng và hai bổ nghĩa, mọi thuộc tính @ ở mức trường, mọi thuộc tính @@ ở mức khối, bảng native type của PostgreSQL đầy đủ kèm bẫy tiền và bẫy múi giờ, và bốn kiểu khó chịu — enum, Json, Bytes, Unsupported.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Models, fields and the nine scalar types|||2.1 — Model, trường và chín kiểu vô hướng',
      slug: 'pr-2-1-model-va-kieu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cấu trúc một model, chín kiểu vô hướng của Prisma với đúng kiểu SQL mà mỗi cái sinh ra, hai bổ nghĩa ? và [], vì sao Float là sai cho tiền, và ba luật đặt tên bộ kiểm sẽ bắt bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Models, fields and the nine scalar types</h2>
<p class="lead">Prisma Schema Language has a tiny surface: blocks, fields, types, and attributes that start with <code>@</code>. That is the whole language. This chapter covers all of it, and this lesson covers the part you use in every single model — the type of each column, and what that type becomes in both PostgreSQL and TypeScript.</p>

<h3>The anatomy of a model</h3>
<pre><code>model Post {
  <span class="tok-comment">// name    type      modifier   attributes</span>
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(200)
  body        String?
  tags        String[]
  price       Decimal?  @db.Decimal(12, 2)
  publishedAt DateTime? @map("published_at") @db.Timestamptz(3)

  authorId    Int       @map("author_id")
  author      User      @relation(fields: [authorId], references: [id])

  @@index([authorId, publishedAt])
  @@map("posts")
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Name</span><span class="lz-t">Your identifier in code</span><span class="lz-d">Must start with a letter, then letters, digits and underscores. Conventionally camelCase for fields, PascalCase for models — and the checker will not force you, but <code>prisma format</code> assumes it.</span></div>
  <div class="lz-step"><span class="lz-k">Type</span><span class="lz-t">A scalar, an enum, or another model</span><span class="lz-d">Another model makes it a relation field, which is Chapter 3. Everything else is a column.</span></div>
  <div class="lz-step"><span class="lz-k">Modifier</span><span class="lz-t"><code>?</code> optional or <code>[]</code> list</span><span class="lz-d">Exactly one, never both — <code>String?[]</code> is a syntax error. A list of nullable strings is not expressible, and that is a database limitation, not a Prisma one.</span></div>
  <div class="lz-step"><span class="lz-k">Attributes</span><span class="lz-t"><code>@…</code> on fields, <code>@@…</code> on the model</span><span class="lz-d">Order among them does not matter. Lessons 2.2 and 2.3 cover every one.</span></div>
</div>

<h3>The nine scalar types</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>String</code> → <code>TEXT</code></span><span class="v">TypeScript <code>string</code>. Unlimited length by default in PostgreSQL, and <code>TEXT</code> there is exactly as fast as <code>VARCHAR</code> — the length limit is a constraint, not an optimisation. Use <code>@db.VarChar(n)</code> when you want the database to enforce a maximum.</span></div>
  <div class="kv"><span class="k"><code>Int</code> → <code>INTEGER</code></span><span class="v">TypeScript <code>number</code>. Signed 32-bit: −2,147,483,648 to 2,147,483,647. Fine for row counts; <strong>not</strong> fine for a table that will exceed two billion rows, or for a Unix timestamp in milliseconds.</span></div>
  <div class="kv"><span class="k"><code>BigInt</code> → <code>BIGINT</code></span><span class="v">TypeScript <code>bigint</code> — the primitive, not <code>number</code>. That distinction bites: <code>JSON.stringify</code> throws on a <code>bigint</code>, so an API returning one needs an explicit conversion. Chapter 8 shows the serialisation fix.</span></div>
  <div class="kv"><span class="k"><code>Float</code> → <code>DOUBLE PRECISION</code></span><span class="v">TypeScript <code>number</code>. IEEE-754 binary floating point. Correct for measurements, coordinates, scores. <strong>Wrong for money</strong>, for the reason demonstrated below.</span></div>
  <div class="kv"><span class="k"><code>Decimal</code> → <code>DECIMAL(65,30)</code></span><span class="v">TypeScript <code>Prisma.Decimal</code> (a Decimal.js instance, not a number). Exact base-10 arithmetic. The right type for money, and the one that surprises people because <code>price + 1</code> does not do what they expect.</span></div>
  <div class="kv"><span class="k"><code>Boolean</code> → <code>BOOLEAN</code></span><span class="v">TypeScript <code>boolean</code>. Nothing surprising, except that a nullable boolean has three states and almost always means you wanted an enum.</span></div>
  <div class="kv"><span class="k"><code>DateTime</code> → <code>TIMESTAMP(3)</code></span><span class="v">TypeScript <code>Date</code>. Note the default: <em>without</em> a time zone, millisecond precision. Lesson 2.4 explains why <code>@db.Timestamptz</code> is usually what you actually want.</span></div>
  <div class="kv"><span class="k"><code>Json</code> → <code>JSONB</code></span><span class="v">TypeScript <code>Prisma.JsonValue</code> — a recursive union, effectively untyped. Queryable with PostgreSQL's JSON operators, and Lesson 2.5 shows how to give it a real type.</span></div>
  <div class="kv"><span class="k"><code>Bytes</code> → <code>BYTEA</code></span><span class="v">TypeScript <code>Uint8Array</code> (a <code>Buffer</code> before Prisma 6). For hashes, small binaries, encrypted blobs. Not for uploads — those belong in object storage with a URL in the row.</span></div>
</div>
<pre><code><span class="tok-comment">// One model touching all nine, so you can read the generated types</span>
model SampleType {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  quantity    Int
  views       BigInt   @default(0)
  score       Float
  price       Decimal  @db.Decimal(12, 2)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  settings    Json     @default("{}")
  signature   Bytes?
  tags        String[]
}</code></pre>
<pre><code>npx prisma migrate dev --name kieu_mau
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d \\"SampleType\\""</code></pre>
<div class="out">                                    Table "public.KieuMau"
  Column   |            Type             | Nullable |                Default
-----------+-----------------------------+----------+---------------------------------------
 id        | integer                     | not null | nextval('"KieuMau_id_seq"'::regclass)
 ten       | text                        | not null |
 moTa      | text                        |          |
 soLuong   | integer                     | not null |
 luotXem   | bigint                      | not null | 0
 diem      | double precision            | not null |
 giaTien   | numeric(12,2)               | not null |
 hienThi   | boolean                     | not null | true
 taoLuc    | timestamp(3) without time zone | not null | CURRENT_TIMESTAMP
 caiDat    | jsonb                       | not null | '{}'
 chuKy     | bytea                       |          |
 theTag    | text[]                      | not null |</div>

<h3>The money trap, measured</h3>
<pre><code><span class="tok-comment">// Float: binary floating point cannot represent 0.1 exactly</span>
await prisma.sampleType.create({ data: { name: 'A', quantity: 1, score: 0.1, price: '0.1' } });

const rows = await prisma.sampleType.findMany();
let totalFloat = 0;
for (let i = 0; i &lt; 10; i++) totalFloat += rows[0].score;

console.log('Float  x10 :', totalFloat, totalFloat === 1);
console.log('Decimal x10:', rows[0].price.times(10).toString());</code></pre>
<div class="out">Float  x10 : 0.9999999999999999 false
Decimal x10: 1.00</div>
<div class="callout warn">
<p><strong>Ten cents, added ten times, is not one dollar in <code>Float</code>.</strong> On one row it is a rounding curiosity. Across a hundred thousand invoice lines it is a reconciliation report that does not balance, and no amount of rounding at display time fixes it because the error is already in the stored data. Money is <code>Decimal</code> with an explicit <code>@db.Decimal(precision, scale)</code>. The alternative some teams prefer — <code>Int</code> holding cents — is also correct, and simpler to serialise; what is never correct is <code>Float</code>.</p>
</div>
<pre><code><span class="tok-comment">// Decimal in practice: it is an object, not a number</span>
const price = rows[0].price;
console.log(typeof price, price instanceof Prisma.Decimal);
console.log(price + 1);                     <span class="tok-comment">// string concatenation — a real bug</span>
console.log(price.plus(1).toFixed(2));      <span class="tok-comment">// correct</span>
console.log(price.toNumber());              <span class="tok-comment">// only when you accept the precision loss</span></code></pre>
<div class="out">object true
0.11
1.10
0.1</div>
<div class="pitfall">
<p><strong>Trap — <code>Decimal</code> in a JSON response.</strong> <code>JSON.stringify</code> renders a <code>Prisma.Decimal</code> as <code>{"s":1,"e":-1,"d":[1000000]}</code> — its internal representation, which is meaningless to a client. Convert explicitly at the API boundary (<code>.toFixed(2)</code> for display, <code>.toString()</code> to keep precision) and never let a raw <code>Decimal</code> reach <code>res.json()</code>. The same applies to <code>BigInt</code>, which throws outright rather than serialising wrongly.</p>
</div>

<h3>The two modifiers</h3>
<pre><code>model Example {
  required String   <span class="tok-comment">// NOT NULL  → string</span>
  optional String?  <span class="tok-comment">// NULL      → string | null</span>
  list     String[] <span class="tok-comment">// TEXT[]    → string[]  (PostgreSQL only)</span>
  <span class="tok-comment">// danhSachTuyChon String?[]  ← syntax error, not supported</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>?</code> — optional</span><span class="v">Nullable in the database <em>and</em> optional in <code>create</code>. Those are two different things bundled into one modifier, and it matters: a required field with a <code>@default</code> is also optional in <code>create</code>, but not nullable in the database.</span></div>
  <div class="kv"><span class="k"><code>[]</code> — list</span><span class="v">A native array column. PostgreSQL and CockroachDB only — MySQL and SQLite have no array type, so there the answer is a relation or a <code>Json</code> column. An empty list is stored as <code>{}</code>, never <code>NULL</code>, so a list field is never optional.</span></div>
  <div class="kv"><span class="k">Arrays are filterable</span><span class="v"><code>where: { tags: { has: 'nodejs' } }</code>, <code>hasEvery</code>, <code>hasSome</code>, <code>isEmpty</code>. Efficient <em>only</em> with a GIN index, which you must ask for: <code>@@index([tags], type: Gin)</code>.</span></div>
</div>

<h3>Three naming rules the validator enforces</h3>
<pre><code><span class="tok-comment">// All three of these fail — try them, the messages are excellent</span>
model 2Post { id Int @id }              <span class="tok-comment">// starts with a digit</span>
model user  { id Int @id }              <span class="tok-comment">// clashes with model User once mapped</span>
model Post  { id Int @id  id2 Int @id } <span class="tok-comment">// two @id in one model</span></code></pre>
<pre><code>npx prisma validate</code></pre>
<div class="out">Error: Prisma schema validation - (get-dmmf wasm)
Error code: P1012
error: Error validating model "2Post": The model name must start with a letter.
  --&gt;  prisma/schema.prisma:24
   |
23 |
24 | model 2Post { id Int @id }
   |

error: Error validating model "Post": At most one field must be marked as the id field with the &#96;@id&#96; attribute.
  --&gt;  prisma/schema.prisma:26</div>
<div class="callout ok">
<p><strong>Run <code>prisma format</code> constantly.</strong> It aligns columns, sorts attributes into canonical order, adds missing back-relations where it can infer them, and — most usefully — <em>validates</em>. It is faster than <code>generate</code> and catches the same class of error, so bind it to save in your editor. The official Prisma VS Code extension does this plus autocomplete for every attribute in this chapter.</p>
</div>

<h3>Comments, and the one that is not a comment</h3>
<pre><code>model User {
  <span class="tok-comment">// This is a normal comment. It does not appear anywhere else.</span>
  id    Int    @id @default(autoincrement())

  /// This is a DOC comment — triple slash. It survives into the generated
  /// client as JSDoc, and into the DMMF that other generators read.
  email String @unique
}</code></pre>
<p>Triple-slash comments reach your editor's tooltip on <code>user.email</code> and are readable by any generator via the DMMF. For a shared schema they are the cheapest documentation there is — the field's meaning travels with the field instead of living in a wiki nobody opens.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#model-field-scalar-types" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Scalar types — schema reference</span><span class="lc-sub">prisma.io/docs · The full mapping table per provider, including what each type becomes in MySQL and SQLite</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Special fields and types</span><span class="lc-sub">prisma.io/docs · Working with Decimal, BigInt, Bytes and Json from the client side</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/datatype-numeric.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — numeric types</span><span class="lc-sub">postgresql.org · The primary source on NUMERIC versus DOUBLE PRECISION, and why the money answer is not a matter of taste</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, data types chapter</span><span class="lc-sub">The same types from the database side, with the storage sizes and the operators each one supports</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Pick the right scalar type for twelve real columns, then justify each against the SQL it generates</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Model, trường và chín kiểu vô hướng</h2>
<p class="lead">Prisma Schema Language có bề mặt rất nhỏ: khối, trường, kiểu, và các thuộc tính bắt đầu bằng <code>@</code>. Đó là toàn bộ ngôn ngữ. Chương này nói hết, và bài này nói phần bạn dùng trong mọi model — kiểu của từng cột, và kiểu đó biến thành gì ở cả PostgreSQL lẫn TypeScript.</p>

<h3>Giải phẫu một model</h3>
<pre><code>model Post {
  <span class="tok-comment">// tên     kiểu      bổ nghĩa   thuộc tính</span>
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(200)
  body        String?
  tags        String[]
  price       Decimal?  @db.Decimal(12, 2)
  publishedAt DateTime? @map("published_at") @db.Timestamptz(3)

  authorId    Int       @map("author_id")
  author      User      @relation(fields: [authorId], references: [id])

  @@index([authorId, publishedAt])
  @@map("posts")
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tên</span><span class="lz-t">Định danh của bạn trong mã</span><span class="lz-d">Phải bắt đầu bằng chữ cái, sau đó là chữ, số và gạch dưới. Theo quy ước là camelCase cho trường, PascalCase cho model — bộ kiểm không ép bạn, nhưng <code>prisma format</code> giả định thế.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểu</span><span class="lz-t">Một kiểu vô hướng, một enum, hoặc một model khác</span><span class="lz-d">Một model khác biến nó thành trường quan hệ, và đó là Chương 3. Mọi thứ còn lại là một cột.</span></div>
  <div class="lz-step"><span class="lz-k">Bổ nghĩa</span><span class="lz-t"><code>?</code> tuỳ chọn hoặc <code>[]</code> danh sách</span><span class="lz-d">Đúng một cái, không bao giờ cả hai — <code>String?[]</code> là lỗi cú pháp. Một danh sách các chuỗi cho phép null là thứ không diễn đạt được, và đó là giới hạn của cơ sở dữ liệu chứ không phải của Prisma.</span></div>
  <div class="lz-step"><span class="lz-k">Thuộc tính</span><span class="lz-t"><code>@…</code> trên trường, <code>@@…</code> trên model</span><span class="lz-d">Thứ tự giữa chúng không quan trọng. Bài 2.2 và 2.3 nói hết từng cái.</span></div>
</div>

<h3>Chín kiểu vô hướng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>String</code> → <code>TEXT</code></span><span class="v">TypeScript <code>string</code>. Mặc định không giới hạn độ dài ở PostgreSQL, và ở đó <code>TEXT</code> nhanh đúng bằng <code>VARCHAR</code> — giới hạn độ dài là một ràng buộc, không phải một phép tối ưu. Dùng <code>@db.VarChar(n)</code> khi bạn muốn cơ sở dữ liệu thi hành một mức tối đa.</span></div>
  <div class="kv"><span class="k"><code>Int</code> → <code>INTEGER</code></span><span class="v">TypeScript <code>number</code>. Có dấu, 32 bit: −2.147.483.648 tới 2.147.483.647. Ổn cho số đếm hàng; <strong>không</strong> ổn cho bảng sẽ vượt hai tỉ hàng, hay cho một mốc thời gian Unix tính bằng mili giây.</span></div>
  <div class="kv"><span class="k"><code>BigInt</code> → <code>BIGINT</code></span><span class="v">TypeScript <code>bigint</code> — kiểu nguyên thuỷ, không phải <code>number</code>. Khác biệt đó cắn thật: <code>JSON.stringify</code> ném lỗi với một <code>bigint</code>, nên một API trả về nó cần một phép đổi tường minh. Chương 8 chỉ cách vá chuyện tuần tự hoá.</span></div>
  <div class="kv"><span class="k"><code>Float</code> → <code>DOUBLE PRECISION</code></span><span class="v">TypeScript <code>number</code>. Số thực dấu phẩy động nhị phân IEEE-754. Đúng cho phép đo, toạ độ, điểm số. <strong>Sai cho tiền</strong>, vì lý do được chứng minh ngay dưới.</span></div>
  <div class="kv"><span class="k"><code>Decimal</code> → <code>DECIMAL(65,30)</code></span><span class="v">TypeScript <code>Prisma.Decimal</code> (một thực thể Decimal.js, không phải number). Số học cơ số mười chính xác. Kiểu đúng cho tiền, và cũng là kiểu làm người ta bất ngờ vì <code>price + 1</code> không làm thứ họ tưởng.</span></div>
  <div class="kv"><span class="k"><code>Boolean</code> → <code>BOOLEAN</code></span><span class="v">TypeScript <code>boolean</code>. Không có gì bất ngờ, trừ chuyện một boolean cho phép null có ba trạng thái và gần như luôn nghĩa là bạn vốn muốn một enum.</span></div>
  <div class="kv"><span class="k"><code>DateTime</code> → <code>TIMESTAMP(3)</code></span><span class="v">TypeScript <code>Date</code>. Để ý mặc định: <em>không</em> kèm múi giờ, độ chính xác mili giây. Bài 2.4 giải thích vì sao <code>@db.Timestamptz</code> mới thường là thứ bạn thật sự muốn.</span></div>
  <div class="kv"><span class="k"><code>Json</code> → <code>JSONB</code></span><span class="v">TypeScript <code>Prisma.JsonValue</code> — một union đệ quy, tức là gần như không có kiểu. Truy vấn được bằng các toán tử JSON của PostgreSQL, và Bài 2.5 chỉ cách cho nó một kiểu thật.</span></div>
  <div class="kv"><span class="k"><code>Bytes</code> → <code>BYTEA</code></span><span class="v">TypeScript <code>Uint8Array</code> (là <code>Buffer</code> ở trước Prisma 6). Dùng cho hash, nhị phân nhỏ, khối đã mã hoá. Không dùng cho tệp tải lên — thứ đó thuộc về kho đối tượng, còn hàng dữ liệu chỉ giữ một URL.</span></div>
</div>
<pre><code><span class="tok-comment">// Một model chạm đủ chín kiểu, để bạn đọc được các kiểu sinh ra</span>
model SampleType {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  quantity    Int
  views       BigInt   @default(0)
  score       Float
  price       Decimal  @db.Decimal(12, 2)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  settings    Json     @default("{}")
  signature   Bytes?
  tags        String[]
}</code></pre>
<pre><code>npx prisma migrate dev --name kieu_mau
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d \\"SampleType\\""</code></pre>
<div class="out">                                    Table "public.KieuMau"
  Column   |            Type             | Nullable |                Default
-----------+-----------------------------+----------+---------------------------------------
 id        | integer                     | not null | nextval('"KieuMau_id_seq"'::regclass)
 ten       | text                        | not null |
 moTa      | text                        |          |
 soLuong   | integer                     | not null |
 luotXem   | bigint                      | not null | 0
 diem      | double precision            | not null |
 giaTien   | numeric(12,2)               | not null |
 hienThi   | boolean                     | not null | true
 taoLuc    | timestamp(3) without time zone | not null | CURRENT_TIMESTAMP
 caiDat    | jsonb                       | not null | '{}'
 chuKy     | bytea                       |          |
 theTag    | text[]                      | not null |</div>

<h3>Bẫy tiền, đo bằng số</h3>
<pre><code><span class="tok-comment">// Float: dấu phẩy động nhị phân không biểu diễn nổi 0,1 cho chính xác</span>
await prisma.sampleType.create({ data: { name: 'A', quantity: 1, score: 0.1, price: '0.1' } });

const rows = await prisma.sampleType.findMany();
let totalFloat = 0;
for (let i = 0; i &lt; 10; i++) totalFloat += rows[0].score;

console.log('Float  x10 :', totalFloat, totalFloat === 1);
console.log('Decimal x10:', rows[0].price.times(10).toString());</code></pre>
<div class="out">Float  x10 : 0.9999999999999999 false
Decimal x10: 1.00</div>
<div class="callout warn">
<p><strong>Mười xu cộng mười lần không ra một đồng trong <code>Float</code>.</strong> Trên một hàng thì đó là chuyện làm tròn buồn cười. Trên trăm nghìn dòng hoá đơn thì đó là một báo cáo đối soát không khớp, và mọi phép làm tròn lúc hiển thị đều không cứu được vì sai số đã nằm sẵn trong dữ liệu đã lưu. Tiền là <code>Decimal</code> kèm <code>@db.Decimal(độ chính xác, số lẻ)</code> tường minh. Cách khác mà một số đội thích — dùng <code>Int</code> giữ số xu — cũng đúng, và dễ tuần tự hoá hơn; thứ không bao giờ đúng là <code>Float</code>.</p>
</div>
<pre><code><span class="tok-comment">// Decimal trong thực tế: nó là đối tượng, không phải số</span>
const price = rows[0].price;
console.log(typeof price, price instanceof Prisma.Decimal);
console.log(price + 1);                     <span class="tok-comment">// nối chuỗi — một con bọ thật</span>
console.log(price.plus(1).toFixed(2));      <span class="tok-comment">// đúng</span>
console.log(price.toNumber());              <span class="tok-comment">// chỉ khi bạn chấp nhận mất độ chính xác</span></code></pre>
<div class="out">object true
0.11
1.10
0.1</div>
<div class="pitfall">
<p><strong>Bẫy — <code>Decimal</code> nằm trong một phản hồi JSON.</strong> <code>JSON.stringify</code> in một <code>Prisma.Decimal</code> thành <code>{"s":1,"e":-1,"d":[1000000]}</code> — biểu diễn nội bộ của nó, hoàn toàn vô nghĩa với phía client. Hãy đổi tường minh ngay ở ranh giới API (<code>.toFixed(2)</code> để hiển thị, <code>.toString()</code> để giữ độ chính xác) và đừng bao giờ để một <code>Decimal</code> trần đi tới <code>res.json()</code>. Điều tương tự đúng với <code>BigInt</code>, thứ ném lỗi hẳn thay vì tuần tự hoá sai.</p>
</div>

<h3>Hai bổ nghĩa</h3>
<pre><code>model Example {
  required String   <span class="tok-comment">// NOT NULL  → string</span>
  optional String?  <span class="tok-comment">// NULL      → string | null</span>
  list     String[] <span class="tok-comment">// TEXT[]    → string[]  (chỉ PostgreSQL)</span>
  <span class="tok-comment">// danhSachTuyChon String?[]  ← lỗi cú pháp, không hỗ trợ</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>?</code> — tuỳ chọn</span><span class="v">Cho phép null dưới cơ sở dữ liệu <em>và</em> không bắt buộc trong <code>create</code>. Đó là hai chuyện khác nhau gói vào một bổ nghĩa, và nó có ý nghĩa: một trường bắt buộc mà có <code>@default</code> thì cũng không bắt buộc trong <code>create</code>, nhưng vẫn không cho phép null dưới cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>[]</code> — danh sách</span><span class="v">Một cột mảng thật. Chỉ PostgreSQL và CockroachDB — MySQL và SQLite không có kiểu mảng, nên ở đó câu trả lời là một quan hệ hoặc một cột <code>Json</code>. Danh sách rỗng lưu thành <code>{}</code>, không bao giờ là <code>NULL</code>, nên một trường danh sách không bao giờ là tuỳ chọn.</span></div>
  <div class="kv"><span class="k">Mảng lọc được</span><span class="v"><code>where: { tags: { has: 'nodejs' } }</code>, <code>hasEvery</code>, <code>hasSome</code>, <code>isEmpty</code>. Chỉ hiệu quả <em>khi</em> có chỉ mục GIN, mà bạn phải tự xin: <code>@@index([tags], type: Gin)</code>.</span></div>
</div>

<h3>Ba luật đặt tên bộ kiểm sẽ thi hành</h3>
<pre><code><span class="tok-comment">// Cả ba đều hỏng — thử đi, thông báo lỗi rất tốt</span>
model 2Post { id Int @id }              <span class="tok-comment">// bắt đầu bằng chữ số</span>
model user  { id Int @id }              <span class="tok-comment">// đụng model User sau khi ánh xạ</span>
model Post  { id Int @id  id2 Int @id } <span class="tok-comment">// hai @id trong một model</span></code></pre>
<pre><code>npx prisma validate</code></pre>
<div class="out">Error: Prisma schema validation - (get-dmmf wasm)
Error code: P1012
error: Error validating model "2Post": The model name must start with a letter.
  --&gt;  prisma/schema.prisma:24
   |
23 |
24 | model 2Post { id Int @id }
   |

error: Error validating model "Post": At most one field must be marked as the id field with the &#96;@id&#96; attribute.
  --&gt;  prisma/schema.prisma:26</div>
<div class="callout ok">
<p><strong>Chạy <code>prisma format</code> liên tục.</strong> Nó canh cột, sắp thuộc tính theo thứ tự chuẩn, thêm những quan hệ ngược còn thiếu khi suy ra được, và — hữu ích nhất — <em>kiểm tra tính hợp lệ</em>. Nó nhanh hơn <code>generate</code> và bắt cùng một lớp lỗi, nên hãy gắn nó vào phím lưu trong trình soạn thảo. Tiện ích Prisma chính thức cho VS Code làm việc đó cộng thêm gợi ý gõ cho mọi thuộc tính trong chương này.</p>
</div>

<h3>Chú thích, và cái chú thích không phải chú thích</h3>
<pre><code>model User {
  <span class="tok-comment">// Đây là chú thích thường. Nó không xuất hiện ở đâu khác.</span>
  id    Int    @id @default(autoincrement())

  /// Đây là chú thích TÀI LIỆU — ba gạch chéo. Nó sống tiếp vào client
  /// sinh ra dưới dạng JSDoc, và vào DMMF mà các generator khác đọc được.
  email String @unique
}</code></pre>
<p>Chú thích ba gạch chéo đi tới tận tooltip của trình soạn thảo khi bạn rê lên <code>user.email</code>, và mọi generator đọc được qua DMMF. Với một lược đồ dùng chung thì đó là thứ tài liệu rẻ nhất có thể có — nghĩa của trường đi theo chính cái trường, thay vì sống trong một wiki không ai mở.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#model-field-scalar-types" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Kiểu vô hướng — tra cứu lược đồ</span><span class="lc-sub">prisma.io/docs · Bảng ánh xạ đầy đủ theo từng provider, kể cả mỗi kiểu thành gì ở MySQL và SQLite</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Special fields and types</span><span class="lc-sub">prisma.io/docs · Làm việc với Decimal, BigInt, Bytes và Json từ phía client</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/datatype-numeric.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — kiểu số</span><span class="lc-sub">postgresql.org · Nguồn gốc về NUMERIC so với DOUBLE PRECISION, và vì sao câu trả lời cho tiền không phải chuyện sở thích</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương kiểu dữ liệu</span><span class="lc-sub">Cũng những kiểu đó nhìn từ phía cơ sở dữ liệu, kèm kích thước lưu trữ và các toán tử mỗi kiểu hỗ trợ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Chọn kiểu vô hướng đúng cho mười hai cột thật, rồi biện minh từng lựa chọn dựa trên SQL nó sinh ra</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Field attributes: every `@`|||2.2 — Thuộc tính trường: đủ mọi `@`',
      slug: 'pr-2-2-thuoc-tinh-truong',
      type: 'LESSON',
      description: 'Tám thuộc tính mức trường mổ đủ: @id với khoá tự tăng so với uuid/cuid, sáu hàm của @default kể cả dbgenerated, @unique và cái tên ràng buộc nó đẻ ra, @updatedAt và chỗ nó không cập nhật, @map, @ignore, và @db mở đường sang native type.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Field attributes: every <code>@</code></h2>
<p class="lead">There are eight attributes you can put on a field, and each one changes the SQL that gets generated. Two of them (<code>@default</code> and <code>@db</code>) are small languages of their own. This lesson goes through all eight with the DDL each produces, because "what column did that actually create" is a question you will ask constantly.</p>

<h3><code>@id</code> — the primary key</h3>
<pre><code>model A { id Int    @id @default(autoincrement()) }   <span class="tok-comment">// SERIAL</span>
model B { id String @id @default(uuid())          }   <span class="tok-comment">// TEXT, generated in the client</span>
model C { id String @id @default(cuid())          }   <span class="tok-comment">// TEXT, sortable-ish</span>
model D { id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>autoincrement()</code></span><span class="v">A PostgreSQL sequence. Compact (4 bytes), naturally ordered, index-friendly, and it leaks information — an <code>/orders/1043</code> URL tells a competitor how many orders you have. Use it and expose something else publicly if that matters.</span></div>
  <div class="kv"><span class="k"><code>uuid()</code></span><span class="v">Generated <em>in the client</em>, before the insert — which means you know the id before the row exists, useful for building object graphs. Random v4, so inserts land all over the B-tree and the index fragments. 16 bytes as <code>@db.Uuid</code>, 36 as plain <code>TEXT</code>: always add the native type.</span></div>
  <div class="kv"><span class="k"><code>cuid()</code> / <code>cuid(2)</code></span><span class="v">Prefixed with a timestamp component, so it sorts roughly by creation time and inserts stay near the right edge of the index. A good middle ground when you want opaque ids without the fragmentation.</span></div>
  <div class="kv"><span class="k"><code>dbgenerated(…)</code></span><span class="v">Raw SQL as the default. The database generates it, so the id does not exist until after the insert. <code>gen_random_uuid()</code> is built into PostgreSQL 13+ and needs no extension.</span></div>
  <div class="kv"><span class="k">No <code>@id</code> at all</span><span class="v">Legal only for a model marked <code>@@ignore</code>, or a view. Prisma Client cannot address a row it cannot uniquely identify, so <code>update</code> and <code>delete</code> simply do not exist on such a model.</span></div>
</div>
<div class="callout">
<p><strong>Which one?</strong> Default to <code>autoincrement()</code> for internal tables — smaller, faster, easier to read in logs. Reach for <code>cuid()</code> or <code>uuid()</code> when ids appear in URLs, when clients generate rows offline, or when you will merge data from several databases. Never switch later: changing a primary key type on a live table is a migration with downtime.</p>
</div>

<h3><code>@default</code> — the six generators, and the literal</h3>
<pre><code>model Example {
  id        Int      @id @default(autoincrement())
  status    String   @default("NHAP")              <span class="tok-comment">// literal</span>
  attempts  Int      @default(0)
  visible   Boolean  @default(true)
  tags      String[] @default([])                  <span class="tok-comment">// empty array literal</span>
  createdAt DateTime @default(now())               <span class="tok-comment">// CURRENT_TIMESTAMP</span>
  code      String   @default(nanoid(12))          <span class="tok-comment">// client-side, Prisma 5.16+</span>
  fromDb    String   @default(dbgenerated("substr(md5(random()::text), 1, 8)"))
}</code></pre>
<pre><code>docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d \\"Example\\"" | head -14</code></pre>
<div class="out">                                   Table "public.Vidu"
  Column   |            Type             | Nullable |              Default
-----------+-----------------------------+----------+-------------------------------------
 id        | integer                     | not null | nextval('"Vidu_id_seq"'::regclass)
 trangThai | text                        | not null | 'NHAP'::text
 soLan     | integer                     | not null | 0
 hienThi   | boolean                     | not null | true
 theTag    | text[]                      | not null | ARRAY[]::text[]
 taoLuc    | timestamp(3) without time zone | not null | CURRENT_TIMESTAMP
 ma        | text                        | not null |
 tuDb      | text                        | not null | substr(md5((random())::text), 1, 8)</div>
<div class="pitfall">
<p><strong>Trap — look at the <code>code</code> column: it has no database default.</strong> <code>uuid()</code>, <code>cuid()</code> and <code>nanoid()</code> are generated <strong>by Prisma Client in JavaScript</strong>, not by PostgreSQL. So a row inserted by anything that is not Prisma — a raw <code>INSERT</code> in psql, a data-import script, another service — gets no value, and the <code>NOT NULL</code> constraint rejects it. If other systems write to that table, use <code>dbgenerated("gen_random_uuid()")</code> so the default lives where every writer can see it. This difference is invisible in the Prisma schema and obvious in <code>\\d</code>.</p>
</div>

<h3><code>@unique</code> — and the constraint name it creates</h3>
<pre><code>model User {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  username    String  @unique(map: "uk_user_username")   <span class="tok-comment">// named explicitly</span>
  phoneNumber String? @unique
}</code></pre>
<div class="out">Indexes:
    "User_pkey" PRIMARY KEY, btree (id)
    "User_email_key" UNIQUE CONSTRAINT, btree (email)
    "User_soDienThoai_key" UNIQUE CONSTRAINT, btree ("soDienThoai")
    "uk_user_username" UNIQUE CONSTRAINT, btree (username)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">It creates an index for free</span><span class="v">A unique constraint is backed by a B-tree index, so <code>where: { email }</code> is already fast. Adding <code>@@index([email])</code> as well is duplicated work and wasted disk.</span></div>
  <div class="kv"><span class="k">It unlocks <code>findUnique</code></span><span class="v">Only unique fields may appear in a <code>findUnique</code> <code>where</code>. This is a compile-time guarantee that the query returns at most one row.</span></div>
  <div class="kv"><span class="k">Nullable uniques allow many NULLs</span><span class="v">SQL treats <code>NULL</code> as "unknown", so two rows can both have <code>phoneNumber = NULL</code> without violating the constraint. Usually what you want; occasionally a surprise when you expected "at most one row without a phone number".</span></div>
  <div class="kv"><span class="k"><code>map:</code> renames the constraint, not the field</span><span class="v">Matters when adopting an existing database whose constraints have house names, and when a generated name would exceed PostgreSQL's 63-character identifier limit.</span></div>
</div>

<h3><code>@updatedAt</code> — and the writes it misses</h3>
<pre><code>model Post {
  id        Int      @id @default(autoincrement())
  title     String
  createdAt DateTime @default(now())  @map("created_at")
  updatedAt DateTime @updatedAt       @map("updated_at")
}</code></pre>
<pre><code>await prisma.post.update({ where: { id: 1 }, data: { title: 'Doi name' } });</code></pre>
<div class="out">prisma:query UPDATE "public"."posts" SET "title" = $1, "updated_at" = $2 WHERE ("public"."posts"."id" = $3 AND 1=1) RETURNING ...</div>
<div class="callout warn">
<p><strong>The timestamp comes from your application, not the database.</strong> Prisma puts <code>updated_at = $2</code> in the statement with a JavaScript <code>new Date()</code> as the parameter. Three consequences: a raw <code>UPDATE</code> from psql does <em>not</em> touch it; an application server with a wrong clock writes a wrong timestamp; and two servers in different time zones are fine only because <code>Date</code> is UTC internally. If you need a guarantee independent of who is writing, use a PostgreSQL trigger instead — and then remove <code>@updatedAt</code> so the two do not fight.</p>
</div>

<h3><code>@map</code> — two naming conventions at once</h3>
<pre><code>model User {
  id           Int       @id @default(autoincrement())
  fullName     String?   @map("full_name")
  avatarUrl    String?   @map("avatar_url")
  lastActiveAt DateTime? @map("last_active_at")

  @@map("users")
}</code></pre>
<p>Your code reads <code>user.fullName</code>; the database has <code>full_name</code>. This is not cosmetic — it lets a JavaScript codebase follow JavaScript conventions while the database follows SQL conventions, which is exactly what a DBA reviewing your migrations expects to see. The CuongThai schema does this on every model, which is why <code>@map</code> appears roughly four hundred times in it.</p>
<pre><code><span class="tok-comment"># Count them yourself in this repository</span>
grep -c '@map(' prisma/schema.prisma
grep -c '@@map(' prisma/schema.prisma</code></pre>
<div class="out">412
112</div>

<h3><code>@ignore</code>, and the rest</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">@ignore</span><span class="lz-t">Hide a field from the client</span><span class="lz-d">The column stays in the database; Prisma Client pretends it does not exist. For columns another system owns, or a type Prisma cannot represent. It must be nullable or have a default, otherwise inserts would fail.</span></div>
  <div class="lz-step"><span class="lz-k">@db.&lt;Type&gt;</span><span class="lz-t">Pin the exact SQL type</span><span class="lz-d"><code>@db.VarChar(50)</code>, <code>@db.Uuid</code>, <code>@db.Timestamptz(3)</code>, <code>@db.Decimal(12,2)</code>. Provider-specific, and the whole of Lesson 2.4.</span></div>
  <div class="lz-step"><span class="lz-k">@relation(…)</span><span class="lz-t">Define one side of a relation</span><span class="lz-d">Technically a field attribute, but it belongs with relations. Chapter 3 covers all of its arguments.</span></div>
  <div class="lz-step"><span class="lz-k">@unique / @id with <code>map:</code></span><span class="lz-t">Name the constraint</span><span class="lz-d">Both accept <code>map:</code>. Reach for it when introspecting an existing database or when the auto-generated name is too long.</span></div>
</div>

<h3>All eight on one model, and the DDL they produce</h3>
<pre><code>model Account {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String   @unique(map: "uk_taikhoan_email") @db.VarChar(180)
  password  String   @db.VarChar(255)
  bietDanh  String?  @map("biet_danh") @db.VarChar(50)
  balance   Decimal  @default(0) @db.Decimal(14, 2) @map("so_du")
  createdAt DateTime @default(now()) @map("tao_luc") @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @map("sua_luc") @db.Timestamptz(3)
  oldColumn String?  @map("cot_cu") @ignore

  @@map("tai_khoan")
}</code></pre>
<div class="out">-- CreateTable
CREATE TABLE "tai_khoan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(180) NOT NULL,
    "matKhau" VARCHAR(255) NOT NULL,
    "biet_danh" VARCHAR(50),
    "so_du" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tao_luc" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sua_luc" TIMESTAMPTZ(3) NOT NULL,
    "cot_cu" VARCHAR(191),

    CONSTRAINT "tai_khoan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_taikhoan_email" ON "tai_khoan"("email");</div>
<p>Two things to notice. <code>sua_luc</code> has <strong>no default</strong> — <code>@updatedAt</code> is entirely a client behaviour, exactly as the warning above said. And <code>password</code> kept its camelCase column name because it has no <code>@map</code>: mixing conventions inside one table is the most common review comment on a first Prisma schema.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#attributes" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Attributes — schema reference</span><span class="lc-sub">prisma.io/docs · Every attribute with its arguments and per-provider availability</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-an-id-field" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Defining an ID field</span><span class="lc-sub">prisma.io/docs · Single and composite ids, and the trade-offs between the generators</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/functions-uuid.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — UUID functions</span><span class="lc-sub">postgresql.org · <code>gen_random_uuid()</code> in core since 13, and what it costs compared with a sequence</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-attributes" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">Defining attributes</span><span class="lc-sub">prisma.io/docs · Where each attribute is legal, and the ones that are model-level only</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Write the model that produces a given CREATE TABLE statement exactly — attribute for attribute</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Thuộc tính trường: đủ mọi <code>@</code></h2>
<p class="lead">Có tám thuộc tính bạn đặt được lên một trường, và mỗi cái đổi phần SQL được sinh ra. Hai trong số đó (<code>@default</code> và <code>@db</code>) tự thân đã là những ngôn ngữ nhỏ. Bài này đi hết cả tám kèm đoạn DDL mỗi cái đẻ ra, vì "cái đó thật ra tạo ra cột gì" là câu hỏi bạn sẽ hỏi liên tục.</p>

<h3><code>@id</code> — khoá chính</h3>
<pre><code>model A { id Int    @id @default(autoincrement()) }   <span class="tok-comment">// SERIAL</span>
model B { id String @id @default(uuid())          }   <span class="tok-comment">// TEXT, sinh ở phía client</span>
model C { id String @id @default(cuid())          }   <span class="tok-comment">// TEXT, sắp xếp được tương đối</span>
model D { id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>autoincrement()</code></span><span class="v">Một sequence của PostgreSQL. Gọn (4 byte), có thứ tự tự nhiên, thân thiện với chỉ mục, và nó rò rỉ thông tin — một URL <code>/orders/1043</code> nói cho đối thủ biết bạn có bao nhiêu đơn hàng. Cứ dùng nó, và phơi ra ngoài một thứ khác nếu điều đó quan trọng.</span></div>
  <div class="kv"><span class="k"><code>uuid()</code></span><span class="v">Sinh <em>ở phía client</em>, trước khi chèn — nghĩa là bạn biết id trước khi hàng tồn tại, rất tiện khi dựng đồ thị đối tượng. Là v4 ngẫu nhiên, nên các lần chèn rơi rải rác khắp cây B-tree và chỉ mục bị phân mảnh. 16 byte khi dùng <code>@db.Uuid</code>, 36 byte khi để <code>TEXT</code> trần: luôn thêm native type.</span></div>
  <div class="kv"><span class="k"><code>cuid()</code> / <code>cuid(2)</code></span><span class="v">Có tiền tố mang thành phần thời gian, nên nó sắp xếp gần đúng theo thứ tự tạo và các lần chèn nằm sát rìa phải của chỉ mục. Một điểm cân bằng tốt khi bạn muốn id kín đáo mà không chịu phân mảnh.</span></div>
  <div class="kv"><span class="k"><code>dbgenerated(…)</code></span><span class="v">SQL thô làm giá trị mặc định. Cơ sở dữ liệu sinh ra nó, nên id không tồn tại cho tới sau khi chèn. <code>gen_random_uuid()</code> có sẵn trong PostgreSQL 13+ và không cần extension nào.</span></div>
  <div class="kv"><span class="k">Không có <code>@id</code> nào cả</span><span class="v">Chỉ hợp lệ với model đánh dấu <code>@@ignore</code>, hoặc với một view. Prisma Client không định vị được một hàng mà nó không nhận dạng duy nhất được, nên <code>update</code> và <code>delete</code> đơn giản là không tồn tại trên model đó.</span></div>
</div>
<div class="callout">
<p><strong>Chọn cái nào?</strong> Mặc định dùng <code>autoincrement()</code> cho bảng nội bộ — nhỏ hơn, nhanh hơn, dễ đọc trong log. Với tay tới <code>cuid()</code> hoặc <code>uuid()</code> khi id xuất hiện trong URL, khi client tạo hàng lúc ngoại tuyến, hoặc khi bạn sẽ trộn dữ liệu từ nhiều cơ sở dữ liệu. Đừng đổi về sau: đổi kiểu khoá chính trên một bảng đang sống là một migration có thời gian chết.</p>
</div>

<h3><code>@default</code> — sáu hàm sinh, và giá trị hằng</h3>
<pre><code>model Example {
  id        Int      @id @default(autoincrement())
  status    String   @default("NHAP")              <span class="tok-comment">// giá trị hằng</span>
  attempts  Int      @default(0)
  visible   Boolean  @default(true)
  tags      String[] @default([])                  <span class="tok-comment">// mảng rỗng</span>
  createdAt DateTime @default(now())               <span class="tok-comment">// CURRENT_TIMESTAMP</span>
  code      String   @default(nanoid(12))          <span class="tok-comment">// phía client, Prisma 5.16+</span>
  fromDb    String   @default(dbgenerated("substr(md5(random()::text), 1, 8)"))
}</code></pre>
<pre><code>docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d \\"Example\\"" | head -14</code></pre>
<div class="out">                                   Table "public.Vidu"
  Column   |            Type             | Nullable |              Default
-----------+-----------------------------+----------+-------------------------------------
 id        | integer                     | not null | nextval('"Vidu_id_seq"'::regclass)
 trangThai | text                        | not null | 'NHAP'::text
 soLan     | integer                     | not null | 0
 hienThi   | boolean                     | not null | true
 theTag    | text[]                      | not null | ARRAY[]::text[]
 taoLuc    | timestamp(3) without time zone | not null | CURRENT_TIMESTAMP
 ma        | text                        | not null |
 tuDb      | text                        | not null | substr(md5((random())::text), 1, 8)</div>
<div class="pitfall">
<p><strong>Bẫy — nhìn cột <code>code</code>: nó KHÔNG có giá trị mặc định dưới cơ sở dữ liệu.</strong> <code>uuid()</code>, <code>cuid()</code> và <code>nanoid()</code> được sinh <strong>bởi Prisma Client bằng JavaScript</strong>, không phải bởi PostgreSQL. Nên một hàng do bất cứ thứ gì không phải Prisma chèn vào — một câu <code>INSERT</code> thô trong psql, một script nhập dữ liệu, một dịch vụ khác — sẽ không có giá trị, và ràng buộc <code>NOT NULL</code> từ chối nó. Nếu có hệ thống khác ghi vào bảng đó, hãy dùng <code>dbgenerated("gen_random_uuid()")</code> để giá trị mặc định sống ở nơi mọi bên ghi đều nhìn thấy. Khác biệt này vô hình trong lược đồ Prisma và hiện rành rành trong <code>\\d</code>.</p>
</div>

<h3><code>@unique</code> — và cái tên ràng buộc nó đẻ ra</h3>
<pre><code>model User {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  username    String  @unique(map: "uk_user_username")   <span class="tok-comment">// đặt tên tường minh</span>
  phoneNumber String? @unique
}</code></pre>
<div class="out">Indexes:
    "User_pkey" PRIMARY KEY, btree (id)
    "User_email_key" UNIQUE CONSTRAINT, btree (email)
    "User_soDienThoai_key" UNIQUE CONSTRAINT, btree ("soDienThoai")
    "uk_user_username" UNIQUE CONSTRAINT, btree (username)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó tạo chỉ mục miễn phí</span><span class="v">Một ràng buộc unique được đỡ bởi một chỉ mục B-tree, nên <code>where: { email }</code> vốn đã nhanh. Thêm cả <code>@@index([email])</code> là làm trùng việc và phí đĩa.</span></div>
  <div class="kv"><span class="k">Nó mở khoá <code>findUnique</code></span><span class="v">Chỉ trường unique mới được xuất hiện trong <code>where</code> của <code>findUnique</code>. Đây là một bảo đảm lúc biên dịch rằng câu truy vấn trả về nhiều nhất một hàng.</span></div>
  <div class="kv"><span class="k">Unique cho phép null thì cho nhiều NULL</span><span class="v">SQL coi <code>NULL</code> là "không rõ", nên hai hàng cùng có <code>phoneNumber = NULL</code> mà không vi phạm ràng buộc. Thường là thứ bạn muốn; thỉnh thoảng là bất ngờ khi bạn tưởng "nhiều nhất một hàng không có số điện thoại".</span></div>
  <div class="kv"><span class="k"><code>map:</code> đổi tên ràng buộc, không đổi tên trường</span><span class="v">Quan trọng khi tiếp quản một cơ sở dữ liệu có sẵn với ràng buộc đặt tên theo lối nhà, và khi một cái tên tự sinh sẽ vượt giới hạn 63 ký tự cho định danh của PostgreSQL.</span></div>
</div>

<h3><code>@updatedAt</code> — và những lần ghi nó bỏ sót</h3>
<pre><code>model Post {
  id        Int      @id @default(autoincrement())
  title     String
  createdAt DateTime @default(now())  @map("created_at")
  updatedAt DateTime @updatedAt       @map("updated_at")
}</code></pre>
<pre><code>await prisma.post.update({ where: { id: 1 }, data: { title: 'Doi name' } });</code></pre>
<div class="out">prisma:query UPDATE "public"."posts" SET "title" = $1, "updated_at" = $2 WHERE ("public"."posts"."id" = $3 AND 1=1) RETURNING ...</div>
<div class="callout warn">
<p><strong>Cái mốc thời gian đó đến từ ứng dụng của bạn, không phải từ cơ sở dữ liệu.</strong> Prisma đặt <code>updated_at = $2</code> vào câu lệnh với một <code>new Date()</code> của JavaScript làm tham số. Ba hệ quả: một câu <code>UPDATE</code> thô từ psql <em>không</em> đụng tới nó; một máy chủ ứng dụng chạy sai giờ sẽ ghi sai mốc thời gian; và hai máy chủ ở hai múi giờ chỉ không sao vì <code>Date</code> vốn là UTC bên trong. Nếu bạn cần một bảo đảm không phụ thuộc ai đang ghi, hãy dùng trigger của PostgreSQL — rồi bỏ <code>@updatedAt</code> đi để hai bên khỏi đánh nhau.</p>
</div>

<h3><code>@map</code> — hai quy ước đặt tên cùng lúc</h3>
<pre><code>model User {
  id           Int       @id @default(autoincrement())
  fullName     String?   @map("full_name")
  avatarUrl    String?   @map("avatar_url")
  lastActiveAt DateTime? @map("last_active_at")

  @@map("users")
}</code></pre>
<p>Mã của bạn đọc <code>user.fullName</code>; cơ sở dữ liệu có <code>full_name</code>. Chuyện này không phải làm đẹp — nó cho phép một kho mã JavaScript theo quy ước JavaScript trong khi cơ sở dữ liệu theo quy ước SQL, tức đúng thứ mà một DBA duyệt migration của bạn mong thấy. Lược đồ CuongThai làm vậy ở mọi model, và vì thế <code>@map</code> xuất hiện khoảng bốn trăm lần trong đó.</p>
<pre><code><span class="tok-comment"># Tự đếm trong chính kho này</span>
grep -c '@map(' prisma/schema.prisma
grep -c '@@map(' prisma/schema.prisma</code></pre>
<div class="out">412
112</div>

<h3><code>@ignore</code>, và phần còn lại</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">@ignore</span><span class="lz-t">Giấu một trường khỏi client</span><span class="lz-d">Cột vẫn nằm dưới cơ sở dữ liệu; Prisma Client giả vờ nó không tồn tại. Dùng cho cột do hệ thống khác sở hữu, hoặc kiểu mà Prisma không biểu diễn được. Nó bắt buộc phải cho phép null hoặc có giá trị mặc định, không thì các lần chèn sẽ hỏng.</span></div>
  <div class="lz-step"><span class="lz-k">@db.&lt;Kiểu&gt;</span><span class="lz-t">Ghim đúng kiểu SQL</span><span class="lz-d"><code>@db.VarChar(50)</code>, <code>@db.Uuid</code>, <code>@db.Timestamptz(3)</code>, <code>@db.Decimal(12,2)</code>. Gắn với từng provider, và là toàn bộ Bài 2.4.</span></div>
  <div class="lz-step"><span class="lz-k">@relation(…)</span><span class="lz-t">Định nghĩa một phía của quan hệ</span><span class="lz-d">Về mặt kỹ thuật là thuộc tính trường, nhưng nó thuộc về phần quan hệ. Chương 3 nói hết mọi tham số của nó.</span></div>
  <div class="lz-step"><span class="lz-k">@unique / @id kèm <code>map:</code></span><span class="lz-t">Đặt tên ràng buộc</span><span class="lz-d">Cả hai đều nhận <code>map:</code>. Với tay tới nó khi nội soi một cơ sở dữ liệu có sẵn hoặc khi tên tự sinh quá dài.</span></div>
</div>

<h3>Đủ tám thứ trên một model, và phần DDL chúng sinh ra</h3>
<pre><code>model Account {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String   @unique(map: "uk_taikhoan_email") @db.VarChar(180)
  password  String   @db.VarChar(255)
  bietDanh  String?  @map("biet_danh") @db.VarChar(50)
  balance   Decimal  @default(0) @db.Decimal(14, 2) @map("so_du")
  createdAt DateTime @default(now()) @map("tao_luc") @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @map("sua_luc") @db.Timestamptz(3)
  oldColumn String?  @map("cot_cu") @ignore

  @@map("tai_khoan")
}</code></pre>
<div class="out">-- CreateTable
CREATE TABLE "tai_khoan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(180) NOT NULL,
    "matKhau" VARCHAR(255) NOT NULL,
    "biet_danh" VARCHAR(50),
    "so_du" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tao_luc" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sua_luc" TIMESTAMPTZ(3) NOT NULL,
    "cot_cu" VARCHAR(191),

    CONSTRAINT "tai_khoan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_taikhoan_email" ON "tai_khoan"("email");</div>
<p>Hai điều đáng để ý. <code>sua_luc</code> <strong>không có giá trị mặc định</strong> — <code>@updatedAt</code> hoàn toàn là hành vi phía client, đúng như lời cảnh báo ở trên. Và <code>password</code> giữ nguyên tên cột camelCase vì nó không có <code>@map</code>: trộn lẫn hai quy ước trong cùng một bảng là lời nhận xét review phổ biến nhất trên một lược đồ Prisma đầu tay.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#attributes" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Attributes — tra cứu lược đồ</span><span class="lc-sub">prisma.io/docs · Mọi thuộc tính kèm tham số và mức hỗ trợ theo từng provider</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-an-id-field" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Định nghĩa trường ID</span><span class="lc-sub">prisma.io/docs · Khoá đơn và khoá phức hợp, cùng đánh đổi giữa các hàm sinh</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/functions-uuid.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — hàm UUID</span><span class="lc-sub">postgresql.org · <code>gen_random_uuid()</code> đã vào lõi từ bản 13, và nó tốn gì so với một sequence</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-attributes" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">Defining attributes</span><span class="lc-sub">prisma.io/docs · Mỗi thuộc tính hợp lệ ở đâu, và những cái chỉ đặt được ở mức model</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết model sinh ra đúng một câu CREATE TABLE cho trước — chính xác từng thuộc tính</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Block attributes: every `@@`|||2.3 — Thuộc tính khối: đủ mọi `@@`',
      slug: 'pr-2-3-thuoc-tinh-khoi',
      type: 'LESSON',
      description: '@@id khoá phức hợp, @@unique và cái bẫy tên đã từng làm vỡ truy vấn thật trong kho này, @@index với type Gin/Gist/Brin và thứ tự cột quyết định mọi thứ, @@map, @@ignore, @@schema, @@fulltext — kèm chỉ mục sinh ra nhìn tận mắt trong psql.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Block attributes: every <code>@@</code></h2>
<p class="lead">Field attributes describe one column. Block attributes describe the model, and they are where your indexes live — which makes this the lesson with the most direct effect on whether your application is fast. One of them also contains a naming trap that has broken real queries in the CuongThai codebase, and it is worth meeting deliberately rather than at 2am.</p>

<h3><code>@@id</code> — a composite primary key</h3>
<pre><code>model Membership {
  userId     Int      @map("nguoi_dung_id")
  groupId    Int      @map("nhom_id")
  role       String   @default("THANH_VIEN")
  thamGiaLuc DateTime @default(now()) @map("tham_gia_luc")

  @@id([userId, groupId])
  @@map("tham_gia")
}</code></pre>
<div class="out">CREATE TABLE "tham_gia" (
    "nguoi_dung_id" INTEGER NOT NULL,
    "nhom_id" INTEGER NOT NULL,
    "vaiTro" TEXT NOT NULL DEFAULT 'THANH_VIEN',
    "tham_gia_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tham_gia_pkey" PRIMARY KEY ("nguoi_dung_id","nhom_id")
);</div>
<p>The generated client now addresses a row by both columns at once, under a compound name Prisma invents from the field names:</p>
<pre><code>await prisma.membership.findUnique({
  where: { nguoiDungId_nhomId: { userId: 1, groupId: 7 } },
});</code></pre>
<div class="callout">
<p><strong>Composite key or surrogate id?</strong> A composite <code>@@id</code> is honest — it says "this row IS the pair" and the database enforces it. It costs you a longer <code>where</code>, and it becomes painful the moment a third table needs to reference this row, because the foreign key is now two columns. The common compromise: an <code>Int @id</code> surrogate plus <code>@@unique([userId, groupId])</code>, which gives both the short reference and the guarantee. Chapter 3 revisits this when explicit many-to-many tables arrive.</p>
</div>

<h3><code>@@unique</code> — and the trap</h3>
<pre><code>model NoteSubjectShare {
  id          Int @id @default(autoincrement())
  subjectId   Int @map("subject_id")
  recipientId Int @map("recipient_id")

  <span class="tok-comment">// Default naming: Prisma builds the key from the field names</span>
  @@unique([subjectId, recipientId])
}</code></pre>
<pre><code><span class="tok-comment">// The compound key is named after the FIELDS</span>
await prisma.noteSubjectShare.findUnique({
  where: { subjectId_recipientId: { subjectId: 3, recipientId: 9 } },
});</code></pre>
<p>Now give the constraint a name — something you do constantly when the auto-generated name is too long or the database has house conventions:</p>
<pre><code>model NoteSubjectShare {
  id          Int @id @default(autoincrement())
  subjectId   Int @map("subject_id")
  recipientId Int @map("recipient_id")

  @@unique([subjectId, recipientId], name: "uk_note_subject_share")
}</code></pre>
<pre><code><span class="tok-comment">// WRONG — this no longer compiles, and the error is not obvious</span>
where: { subjectId_recipientId: { subjectId: 3, recipientId: 9 } }

<span class="tok-comment">// CORRECT — the custom name replaced the generated one</span>
where: { uk_note_subject_share: { subjectId: 3, recipientId: 9 } }</code></pre>
<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> This exact mistake is recorded in the repository's known-error log for 2026-06-29: queries against <code>NoteSubjectShare</code> used the default compound key name while the schema declared a custom one, and the fix was to use the custom constraint name everywhere. It is a small thing that reads as a mystery, because the field names are right there in the object and TypeScript's error just says the property does not exist on the input type.</p>
<p>The rule, stated once so it sticks: <strong><code>name:</code> changes the key you query by. <code>map:</code> changes the constraint name in the database.</strong> They are different arguments doing different jobs, and <code>@@unique([a, b], map: "uk_x")</code> keeps <code>a_b</code> as the query key while renaming the constraint — which is usually what you actually wanted.</p>
</div>

<h3><code>@@index</code> — the one that decides your latency</h3>
<pre><code>model Post {
  id          Int       @id @default(autoincrement())
  title       String
  published   Boolean   @default(false)
  authorId    Int       @map("author_id")
  publishedAt DateTime? @map("published_at")
  tags        String[]
  search      String?

  @@index([authorId])                                  <span class="tok-comment">// FK — Prisma does NOT add this for you</span>
  @@index([published, publishedAt(sort: Desc)])        <span class="tok-comment">// composite, with direction</span>
  @@index([tags], type: Gin)                           <span class="tok-comment">// array containment</span>
  @@index([search], type: Gin, map: "idx_post_search") <span class="tok-comment">// trigram/full-text</span>
  @@map("posts")
}</code></pre>
<div class="out">Indexes:
    "posts_pkey" PRIMARY KEY, btree (id)
    "posts_author_id_idx" btree (author_id)
    "posts_published_published_at_idx" btree (published, published_at DESC)
    "posts_tags_idx" gin (tags)
    "idx_post_search" gin (search)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Foreign keys are NOT indexed automatically</span><span class="v">PostgreSQL indexes the primary key and every unique constraint. It does <strong>not</strong> index the referencing side of a foreign key, and neither does Prisma. Every <code>@relation</code> scalar you will filter or join on needs its own <code>@@index</code>. This single omission is the most common cause of a Prisma app that gets slow at 100,000 rows.</span></div>
  <div class="kv"><span class="k">Column order is not cosmetic</span><span class="v"><code>@@index([published, publishedAt])</code> serves <code>WHERE published = true ORDER BY published_at</code> and also plain <code>WHERE published = true</code>. It does <em>nothing</em> for <code>WHERE published_at &gt; …</code> alone. Put the equality columns first, the range or sort column last.</span></div>
  <div class="kv"><span class="k"><code>type:</code> chooses the index kind</span><span class="v"><code>BTree</code> (default), <code>Gin</code> (arrays, JSONB, trigram, full-text), <code>Gist</code>, <code>SpGist</code>, <code>Brin</code> (huge append-only tables, tiny index), <code>Hash</code>. Getting this wrong means an index that exists, takes disk, and is never used.</span></div>
  <div class="kv"><span class="k"><code>sort:</code> and <code>ops:</code></span><span class="v"><code>sort: Desc</code> matters when your <code>ORDER BY</code> is descending and you want the index to serve it without a sort step. <code>ops:</code> selects the operator class — <code>ops: raw("gin_trgm_ops")</code> is how you get a trigram index for <code>contains</code> searches.</span></div>
  <div class="kv"><span class="k">What you cannot express</span><span class="v">Partial indexes (<code>WHERE deleted_at IS NULL</code>) and expression indexes (<code>lower(email)</code>) have no schema syntax. Write them in a hand-edited migration; Prisma will leave them alone, but <code>db pull</code> will not see them either. Chapter 10 covers keeping them alive.</span></div>
</div>
<pre><code><span class="tok-comment">-- The two Prisma cannot declare, added by hand in a migration</span>
CREATE INDEX "idx_posts_active" ON "posts"("author_id") WHERE "deleted_at" IS NULL;
CREATE INDEX "idx_users_email_lower" ON "users"(lower("email"));

<span class="tok-comment">-- And the trigram index that makes &#96;contains&#96; fast</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "idx_posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);</code></pre>
<div class="pitfall">
<p><strong>Trap — an index you added but never proved.</strong> Adding <code>@@index</code> does not mean the planner will use it. It will ignore a low-selectivity index (a boolean on a two-value column), it will ignore a composite index queried in the wrong order, and it will ignore a B-tree index for a leading-wildcard <code>LIKE</code>. The only proof is <code>EXPLAIN ANALYZE</code> before and after, on a table with realistic row counts — an index on a 50-row development table is never used, because a sequential scan is cheaper. Chapter 9 makes this a routine.</p>
</div>

<h3><code>@@map</code>, <code>@@ignore</code>, <code>@@schema</code>, <code>@@fulltext</code></h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">@@map("ten_bang")</span><span class="lz-t">Rename the table</span><span class="lz-d">Model <code>User</code> → table <code>users</code>. The counterpart of <code>@map</code> on fields, and the reason a Prisma schema can sit on a database with entirely different naming conventions.</span></div>
  <div class="lz-step"><span class="lz-k">@@ignore</span><span class="lz-t">Hide the whole model</span><span class="lz-d">The table stays; Prisma Client has no delegate for it. Introspection adds this automatically to tables it cannot represent — typically one with no primary key.</span></div>
  <div class="lz-step"><span class="lz-k">@@schema("analytics")</span><span class="lz-t">Put the table in another namespace</span><span class="lz-d">Requires <code>schemas</code> in the datasource. Lets one database hold <code>auth</code>, <code>billing</code> and <code>public</code> as separate PostgreSQL schemas with one Prisma client over all of them.</span></div>
  <div class="lz-step"><span class="lz-k">@@fulltext([title, body])</span><span class="lz-t">MySQL and MongoDB only</span><span class="lz-d">Not available on PostgreSQL — there, full-text search is a <code>tsvector</code> column plus a GIN index, written by hand and queried with <code>$queryRaw</code>. Chapter 10 shows the pattern.</span></div>
</div>

<h3>A realistic model, using most of them</h3>
<pre><code>model Order {
  id          BigInt    @id @default(autoincrement())
  orderCode   String    @unique(map: "uk_don_hang_ma") @db.VarChar(24)
  customerId  Int       @map("khach_hang_id")
  status      String    @default("MOI") @db.VarChar(20)
  totalAmount Decimal   @db.Decimal(14, 2) @map("tong_tien")
  createdAt   DateTime  @default(now()) @map("tao_luc") @db.Timestamptz(3)
  huyLuc      DateTime? @map("huy_luc") @db.Timestamptz(3)

  <span class="tok-comment">// One customer cannot have two orders with the same external reference</span>
  @@unique([customerId, orderCode], map: "uk_don_hang_khach_ma")
  <span class="tok-comment">// The dashboard query: this customer, newest first</span>
  @@index([customerId, createdAt(sort: Desc)])
  <span class="tok-comment">// The ops query: everything still open</span>
  @@index([status, createdAt])
  @@map("don_hang")
}</code></pre>
<div class="callout ok">
<p><strong>Every index in that model exists because a specific query exists.</strong> That is the discipline worth building: do not add indexes because a column "seems searchable". Write the query, look at its <code>EXPLAIN</code>, add the index the plan asks for, and re-measure. Each index costs write throughput and disk, and an unused one costs both for nothing — a table with fourteen indexes and four queries is a real thing you will meet, and it is slower than the same table with four.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes" target="_blank" rel="noopener"><span class="lc-ico">📇</span><span class="lc-body"><span class="lc-title">Indexes — full guide</span><span class="lc-sub">prisma.io/docs · Every argument of <code>@@index</code>, the index types per provider, and what is not expressible</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#unique-1" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title"><code>@@unique</code> reference — <code>name</code> versus <code>map</code></span><span class="lc-sub">prisma.io/docs · The exact page that resolves the trap in this lesson</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/indexes-types.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — index types</span><span class="lc-sub">postgresql.org · When B-tree, GIN, GiST, BRIN and Hash each apply, from the source</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, index chapter</span><span class="lc-sub">Composite index column order and selectivity, measured — the theory behind the rules above</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Given six queries, declare the smallest set of indexes that serves all of them</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Thuộc tính khối: đủ mọi <code>@@</code></h2>
<p class="lead">Thuộc tính trường mô tả một cột. Thuộc tính khối mô tả cả model, và đây là nơi chỉ mục của bạn sinh sống — nên đây cũng là bài có ảnh hưởng trực tiếp nhất tới chuyện ứng dụng của bạn nhanh hay chậm. Một trong số chúng còn chứa một cái bẫy đặt tên đã từng làm vỡ truy vấn thật trong kho mã CuongThai, và gặp nó có chủ đích thì tốt hơn gặp nó lúc hai giờ sáng.</p>

<h3><code>@@id</code> — khoá chính phức hợp</h3>
<pre><code>model Membership {
  userId     Int      @map("nguoi_dung_id")
  groupId    Int      @map("nhom_id")
  role       String   @default("THANH_VIEN")
  thamGiaLuc DateTime @default(now()) @map("tham_gia_luc")

  @@id([userId, groupId])
  @@map("tham_gia")
}</code></pre>
<div class="out">CREATE TABLE "tham_gia" (
    "nguoi_dung_id" INTEGER NOT NULL,
    "nhom_id" INTEGER NOT NULL,
    "vaiTro" TEXT NOT NULL DEFAULT 'THANH_VIEN',
    "tham_gia_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tham_gia_pkey" PRIMARY KEY ("nguoi_dung_id","nhom_id")
);</div>
<p>Client sinh ra giờ định vị một hàng bằng cả hai cột cùng lúc, dưới một cái tên ghép mà Prisma tự đặt từ tên các trường:</p>
<pre><code>await prisma.membership.findUnique({
  where: { nguoiDungId_nhomId: { userId: 1, groupId: 7 } },
});</code></pre>
<div class="callout">
<p><strong>Khoá phức hợp hay id thay thế?</strong> Một <code>@@id</code> phức hợp thì trung thực — nó nói "hàng này CHÍNH LÀ cặp đó" và cơ sở dữ liệu thi hành điều ấy. Cái giá là một mệnh đề <code>where</code> dài hơn, và nó trở nên khó chịu ngay khi có bảng thứ ba cần tham chiếu tới hàng này, vì khoá ngoại giờ là hai cột. Cách dung hoà phổ biến: một <code>Int @id</code> thay thế cộng <code>@@unique([userId, groupId])</code>, cho bạn cả tham chiếu ngắn lẫn bảo đảm. Chương 3 quay lại chuyện này khi bảng nhiều-nhiều tường minh xuất hiện.</p>
</div>

<h3><code>@@unique</code> — và cái bẫy</h3>
<pre><code>model NoteSubjectShare {
  id          Int @id @default(autoincrement())
  subjectId   Int @map("subject_id")
  recipientId Int @map("recipient_id")

  <span class="tok-comment">// Đặt tên mặc định: Prisma ghép khoá từ tên các trường</span>
  @@unique([subjectId, recipientId])
}</code></pre>
<pre><code><span class="tok-comment">// Khoá ghép được đặt tên theo các TRƯỜNG</span>
await prisma.noteSubjectShare.findUnique({
  where: { subjectId_recipientId: { subjectId: 3, recipientId: 9 } },
});</code></pre>
<p>Giờ đặt cho ràng buộc một cái tên — việc bạn làm liên tục khi tên tự sinh quá dài hoặc khi cơ sở dữ liệu có quy ước riêng của nhà:</p>
<pre><code>model NoteSubjectShare {
  id          Int @id @default(autoincrement())
  subjectId   Int @map("subject_id")
  recipientId Int @map("recipient_id")

  @@unique([subjectId, recipientId], name: "uk_note_subject_share")
}</code></pre>
<pre><code><span class="tok-comment">// SAI — đoạn này không còn biên dịch được, và lỗi thì không hiển nhiên</span>
where: { subjectId_recipientId: { subjectId: 3, recipientId: 9 } }

<span class="tok-comment">// ĐÚNG — tên tuỳ chỉnh đã thay chỗ cái tên tự sinh</span>
where: { uk_note_subject_share: { subjectId: 3, recipientId: 9 } }</code></pre>
<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Đúng lỗi này được ghi trong nhật ký lỗi đã biết của kho, mục ngày 29/06/2026: các truy vấn vào <code>NoteSubjectShare</code> dùng tên khoá ghép mặc định trong khi lược đồ khai một tên tuỳ chỉnh, và cách vá là dùng tên ràng buộc tuỳ chỉnh ở mọi nơi. Chuyện nhỏ nhưng đọc lên như một điều bí ẩn, vì tên các trường sờ sờ ngay trong đối tượng còn lỗi của TypeScript chỉ nói rằng thuộc tính ấy không tồn tại trên kiểu đầu vào.</p>
<p>Luật, nói một lần cho nhớ: <strong><code>name:</code> đổi cái khoá bạn dùng để truy vấn. <code>map:</code> đổi tên ràng buộc dưới cơ sở dữ liệu.</strong> Chúng là hai tham số khác nhau làm hai việc khác nhau, và <code>@@unique([a, b], map: "uk_x")</code> giữ nguyên <code>a_b</code> làm khoá truy vấn trong khi đổi tên ràng buộc — vốn thường là thứ bạn thật sự muốn.</p>
</div>

<h3><code>@@index</code> — thứ quyết định độ trễ của bạn</h3>
<pre><code>model Post {
  id          Int       @id @default(autoincrement())
  title       String
  published   Boolean   @default(false)
  authorId    Int       @map("author_id")
  publishedAt DateTime? @map("published_at")
  tags        String[]
  search      String?

  @@index([authorId])                                  <span class="tok-comment">// khoá ngoại — Prisma KHÔNG tự thêm hộ bạn</span>
  @@index([published, publishedAt(sort: Desc)])        <span class="tok-comment">// phức hợp, có chiều</span>
  @@index([tags], type: Gin)                           <span class="tok-comment">// kiểm phần tử trong mảng</span>
  @@index([search], type: Gin, map: "idx_post_search") <span class="tok-comment">// trigram/toàn văn</span>
  @@map("posts")
}</code></pre>
<div class="out">Indexes:
    "posts_pkey" PRIMARY KEY, btree (id)
    "posts_author_id_idx" btree (author_id)
    "posts_published_published_at_idx" btree (published, published_at DESC)
    "posts_tags_idx" gin (tags)
    "idx_post_search" gin (search)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá ngoại KHÔNG được tự đánh chỉ mục</span><span class="v">PostgreSQL đánh chỉ mục cho khoá chính và mọi ràng buộc unique. Nó <strong>không</strong> đánh chỉ mục cho phía tham chiếu của một khoá ngoại, và Prisma cũng không. Mọi trường vô hướng của <code>@relation</code> mà bạn sẽ lọc hoặc join đều cần <code>@@index</code> riêng. Chỉ thiếu sót này thôi là nguyên nhân phổ biến nhất khiến một ứng dụng Prisma chậm đi ở mốc 100.000 hàng.</span></div>
  <div class="kv"><span class="k">Thứ tự cột không phải chuyện hình thức</span><span class="v"><code>@@index([published, publishedAt])</code> phục vụ <code>WHERE published = true ORDER BY published_at</code> và cả <code>WHERE published = true</code> trần. Nó <em>không làm gì</em> cho riêng <code>WHERE published_at &gt; …</code>. Hãy đặt các cột so bằng lên trước, cột khoảng hoặc cột sắp xếp xuống cuối.</span></div>
  <div class="kv"><span class="k"><code>type:</code> chọn loại chỉ mục</span><span class="v"><code>BTree</code> (mặc định), <code>Gin</code> (mảng, JSONB, trigram, toàn văn), <code>Gist</code>, <code>SpGist</code>, <code>Brin</code> (bảng khổng lồ chỉ ghi thêm, chỉ mục tí hon), <code>Hash</code>. Chọn sai nghĩa là có một chỉ mục tồn tại, tốn đĩa, và không bao giờ được dùng.</span></div>
  <div class="kv"><span class="k"><code>sort:</code> và <code>ops:</code></span><span class="v"><code>sort: Desc</code> có ý nghĩa khi <code>ORDER BY</code> của bạn giảm dần và bạn muốn chỉ mục phục vụ luôn phần đó mà không cần bước sắp xếp. <code>ops:</code> chọn lớp toán tử — <code>ops: raw("gin_trgm_ops")</code> là cách bạn có chỉ mục trigram cho các phép tìm bằng <code>contains</code>.</span></div>
  <div class="kv"><span class="k">Thứ bạn không diễn đạt được</span><span class="v">Partial index (<code>WHERE deleted_at IS NULL</code>) và chỉ mục theo biểu thức (<code>lower(email)</code>) không có cú pháp trong lược đồ. Hãy viết chúng trong một migration sửa tay; Prisma sẽ để yên, nhưng <code>db pull</code> cũng sẽ không thấy chúng. Chương 10 nói cách giữ chúng sống.</span></div>
</div>
<pre><code><span class="tok-comment">-- Hai thứ Prisma không khai được, thêm bằng tay trong một migration</span>
CREATE INDEX "idx_posts_active" ON "posts"("author_id") WHERE "deleted_at" IS NULL;
CREATE INDEX "idx_users_email_lower" ON "users"(lower("email"));

<span class="tok-comment">-- Và cái chỉ mục trigram khiến &#96;contains&#96; nhanh lên</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "idx_posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);</code></pre>
<div class="pitfall">
<p><strong>Bẫy — một chỉ mục bạn thêm vào nhưng chưa bao giờ chứng minh.</strong> Thêm <code>@@index</code> không có nghĩa bộ lập kế hoạch sẽ dùng nó. Nó sẽ bỏ qua chỉ mục ít chọn lọc (một boolean trên cột chỉ có hai giá trị), bỏ qua chỉ mục phức hợp bị truy vấn sai thứ tự, và bỏ qua chỉ mục B-tree khi <code>LIKE</code> có ký tự đại diện ở đầu. Bằng chứng duy nhất là <code>EXPLAIN ANALYZE</code> trước và sau, trên một bảng có số hàng thực tế — chỉ mục trên một bảng phát triển 50 hàng không bao giờ được dùng, vì quét tuần tự còn rẻ hơn. Chương 9 biến việc này thành thói quen.</p>
</div>

<h3><code>@@map</code>, <code>@@ignore</code>, <code>@@schema</code>, <code>@@fulltext</code></h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">@@map("ten_bang")</span><span class="lz-t">Đổi tên bảng</span><span class="lz-d">Model <code>User</code> → bảng <code>users</code>. Bản đối ứng của <code>@map</code> trên trường, và là lý do một lược đồ Prisma ngồi được lên một cơ sở dữ liệu có quy ước đặt tên hoàn toàn khác.</span></div>
  <div class="lz-step"><span class="lz-k">@@ignore</span><span class="lz-t">Giấu cả model</span><span class="lz-d">Bảng vẫn còn; Prisma Client không có delegate cho nó. Nội soi tự thêm cái này cho những bảng nó không biểu diễn được — điển hình là bảng không có khoá chính.</span></div>
  <div class="lz-step"><span class="lz-k">@@schema("analytics")</span><span class="lz-t">Đặt bảng vào không gian tên khác</span><span class="lz-d">Cần khai <code>schemas</code> trong datasource. Cho phép một cơ sở dữ liệu giữ <code>auth</code>, <code>billing</code> và <code>public</code> như những schema PostgreSQL riêng với một Prisma client bao trùm cả ba.</span></div>
  <div class="lz-step"><span class="lz-k">@@fulltext([title, body])</span><span class="lz-t">Chỉ MySQL và MongoDB</span><span class="lz-d">Không có ở PostgreSQL — ở đó, tìm kiếm toàn văn là một cột <code>tsvector</code> cộng một chỉ mục GIN, viết bằng tay và truy vấn bằng <code>$queryRaw</code>. Chương 10 chỉ mẫu đó.</span></div>
</div>

<h3>Một model thực tế, dùng gần hết</h3>
<pre><code>model Order {
  id          BigInt    @id @default(autoincrement())
  orderCode   String    @unique(map: "uk_don_hang_ma") @db.VarChar(24)
  customerId  Int       @map("khach_hang_id")
  status      String    @default("MOI") @db.VarChar(20)
  totalAmount Decimal   @db.Decimal(14, 2) @map("tong_tien")
  createdAt   DateTime  @default(now()) @map("tao_luc") @db.Timestamptz(3)
  huyLuc      DateTime? @map("huy_luc") @db.Timestamptz(3)

  <span class="tok-comment">// Một khách không thể có hai đơn cùng mã tham chiếu bên ngoài</span>
  @@unique([customerId, orderCode], map: "uk_don_hang_khach_ma")
  <span class="tok-comment">// Truy vấn của bảng điều khiển: khách này, mới nhất trước</span>
  @@index([customerId, createdAt(sort: Desc)])
  <span class="tok-comment">// Truy vấn của vận hành: mọi đơn còn đang mở</span>
  @@index([status, createdAt])
  @@map("don_hang")
}</code></pre>
<div class="callout ok">
<p><strong>Mọi chỉ mục trong model đó tồn tại vì có một câu truy vấn cụ thể tồn tại.</strong> Đó là kỷ luật đáng gây dựng: đừng thêm chỉ mục vì một cột "trông có vẻ tìm kiếm được". Hãy viết câu truy vấn, nhìn <code>EXPLAIN</code> của nó, thêm đúng chỉ mục mà kế hoạch đòi, rồi đo lại. Mỗi chỉ mục tốn thông lượng ghi và tốn đĩa, còn một chỉ mục không ai dùng thì tốn cả hai mà chẳng đổi lại gì — một bảng mười bốn chỉ mục phục vụ bốn câu truy vấn là thứ có thật bạn sẽ gặp, và nó chậm hơn chính bảng đó với bốn chỉ mục.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes" target="_blank" rel="noopener"><span class="lc-ico">📇</span><span class="lc-body"><span class="lc-title">Indexes — hướng dẫn đầy đủ</span><span class="lc-sub">prisma.io/docs · Mọi tham số của <code>@@index</code>, các loại chỉ mục theo provider, và những gì không diễn đạt được</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#unique-1" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Tra cứu <code>@@unique</code> — <code>name</code> so với <code>map</code></span><span class="lc-sub">prisma.io/docs · Đúng trang gỡ được cái bẫy trong bài này</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/indexes-types.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — các loại chỉ mục</span><span class="lc-sub">postgresql.org · B-tree, GIN, GiST, BRIN và Hash mỗi loại hợp lúc nào, lấy từ nguồn gốc</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương chỉ mục</span><span class="lc-sub">Thứ tự cột trong chỉ mục phức hợp và độ chọn lọc, đo bằng số — phần lý thuyết đứng sau các luật ở trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Cho sáu câu truy vấn, hãy khai bộ chỉ mục nhỏ nhất phục vụ được cả sáu</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Native types, and the two that bite|||2.4 — Native type, và hai cái cắn đau',
      slug: 'pr-2-4-native-type',
      type: 'LESSON',
      description: 'Bảng @db.* đầy đủ cho PostgreSQL, vì sao VarChar(n) là ràng buộc chứ không phải tối ưu, bẫy Timestamp so với Timestamptz dựng lại bằng hai truy vấn thật, @db.Uuid tiết kiệm 20 byte mỗi hàng, và chuyện gì xảy ra khi bạn thu hẹp một cột đã có dữ liệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Native types, and the two that bite</h2>
<p class="lead">Prisma's nine scalar types map to sensible SQL defaults. The <code>@db.</code> attributes let you override those defaults with the exact type you want, and two of them — the timestamp one and the UUID one — are the difference between a schema that behaves and a schema that produces a support ticket six months later. This lesson has the full table and then spends its length on those two.</p>

<h3>The PostgreSQL table, in full</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>String</code></span><span class="v"><code>@db.Text</code> (default) · <code>@db.VarChar(n)</code> · <code>@db.Char(n)</code> · <code>@db.Uuid</code> · <code>@db.Xml</code> · <code>@db.Inet</code> · <code>@db.Citext</code> · <code>@db.Bit(n)</code> · <code>@db.VarBit(n)</code> · <code>@db.Money</code></span></div>
  <div class="kv"><span class="k"><code>Int</code></span><span class="v"><code>@db.Integer</code> (default) · <code>@db.SmallInt</code> (2 bytes, ±32,767) · <code>@db.Oid</code></span></div>
  <div class="kv"><span class="k"><code>BigInt</code></span><span class="v"><code>@db.BigInt</code> (default, 8 bytes)</span></div>
  <div class="kv"><span class="k"><code>Float</code></span><span class="v"><code>@db.DoublePrecision</code> (default, 8 bytes) · <code>@db.Real</code> (4 bytes, ~6 significant digits)</span></div>
  <div class="kv"><span class="k"><code>Decimal</code></span><span class="v"><code>@db.Decimal(p, s)</code> — precision and scale. Without it you get <code>DECIMAL(65,30)</code>, which is correct but stores thirty decimal places you will never use.</span></div>
  <div class="kv"><span class="k"><code>DateTime</code></span><span class="v"><code>@db.Timestamp(n)</code> (default, <strong>no time zone</strong>) · <code>@db.Timestamptz(n)</code> · <code>@db.Date</code> · <code>@db.Time(n)</code> · <code>@db.Timetz(n)</code></span></div>
  <div class="kv"><span class="k"><code>Boolean</code></span><span class="v"><code>@db.Boolean</code> (default, 1 byte)</span></div>
  <div class="kv"><span class="k"><code>Json</code></span><span class="v"><code>@db.JsonB</code> (default, binary, indexable) · <code>@db.Json</code> (raw text, preserves key order and whitespace, cannot be indexed usefully)</span></div>
  <div class="kv"><span class="k"><code>Bytes</code></span><span class="v"><code>@db.ByteA</code> (default)</span></div>
</div>

<h3>Choosing a DateTime type, in one pass</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Is it a moment?</span><span class="lz-t">Yes → <code>@db.Timestamptz(3)</code></span><span class="lz-d">Created-at, published-at, logged-in-at, an event start. The instant is the same everywhere; only its rendering differs. This is most of your columns.</span></div>
  <div class="lz-step"><span class="lz-k">Is it a calendar date?</span><span class="lz-t">Yes → <code>@db.Date</code></span><span class="lz-d">Birthday, invoice date, public holiday. It has no time and no zone, and forcing it into a timestamp creates an off-by-one-day bug the first time a user is west of you.</span></div>
  <div class="lz-step"><span class="lz-k">Is it a clock reading?</span><span class="lz-t">Yes → <code>@db.Time(3)</code></span><span class="lz-d">"Opens at 09:00", a recurring alarm. A time of day with no date attached at all.</span></div>
  <div class="lz-step"><span class="lz-k">None of the above?</span><span class="lz-t">Then plain <code>DateTime</code> is a bug</span><span class="lz-d">If you cannot say which of the three it is, you do not yet know what the column means — and <code>TIMESTAMP</code> without a zone is the answer that hides that from you.</span></div>
</div>

<h3>Trap 1: <code>Timestamp</code> versus <code>Timestamptz</code></h3>
<p>Prisma's default for <code>DateTime</code> is <code>TIMESTAMP(3)</code> — <em>without</em> a time zone. Here is what that actually means, with two rows written by the same code:</p>
<pre><code>model SuKien {
  id     Int      @id @default(autoincrement())
  name   String
  noTz   DateTime <span class="tok-comment">// TIMESTAMP(3)   — Prisma default</span>
  withTz DateTime @db.Timestamptz(3)     <span class="tok-comment">// TIMESTAMPTZ(3) — what you usually want</span>
}</code></pre>
<pre><code>const t = new Date('2026-08-23T10:00:00+07:00');   <span class="tok-comment">// 03:00 UTC</span>
await prisma.event.create({ data: { name: 'Hop', noTz: t, withTz: t } });</code></pre>
<pre><code><span class="tok-comment">-- Read it back from psql, in two different session time zones</span>
SET TIME ZONE 'UTC';         SELECT "noTz", "withTz" FROM "SuKien";
SET TIME ZONE 'Asia/Bangkok'; SELECT "noTz", "withTz" FROM "SuKien";</code></pre>
<div class="out">-- UTC session
        khongTz         |          coTz
------------------------+------------------------
 2026-08-23 03:00:00    | 2026-08-23 03:00:00+00

-- Asia/Bangkok session (UTC+7)
        khongTz         |          coTz
------------------------+------------------------
 2026-08-23 03:00:00    | 2026-08-23 10:00:00+07</div>
<div class="callout warn">
<p><strong>Read the two columns again.</strong> <code>withTz</code> shows the correct local moment in each session — 03:00 UTC and 10:00 in Bangkok are the same instant, and PostgreSQL knows it. <code>noTz</code> shows <code>03:00</code> in both, because it stores a wall-clock reading with <em>no idea</em> what zone it belongs to. Prisma always converts to UTC before writing, so through Prisma alone both columns round-trip correctly. The damage appears the moment anything else touches the data: a psql query, a BI tool, a report, a Python job, an <code>AT TIME ZONE</code> conversion in a raw SQL migration. Then <code>noTz</code> is a number with no meaning attached.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Use <code>@db.Timestamptz(3)</code></span><span class="v">For everything that is a moment in time: created-at, updated-at, published-at, logged-in-at, an event start. This is the overwhelming majority of DateTime columns and should be your default.</span></div>
  <div class="kv"><span class="k">Use <code>@db.Date</code></span><span class="v">For a calendar date with no time: a birthday, an invoice date, a public holiday. Someone born on 1 January is born on 1 January in every time zone, and storing that as a timestamp creates an off-by-one-day bug the first time a user is west of you.</span></div>
  <div class="kv"><span class="k">Use plain <code>Timestamp</code> deliberately, or not at all</span><span class="v">There is one legitimate use — a local wall-clock time that genuinely has no zone, like "the shop opens at 09:00" in whatever zone the shop is in. Everything else is an accident waiting for a second country.</span></div>
</div>
<pre><code><span class="tok-comment">// A schema that has thought about time</span>
model Article {
  id           Int       @id @default(autoincrement())
  createdAt    DateTime  @default(now()) @map("tao_luc") @db.Timestamptz(3)
  updatedAt    DateTime  @updatedAt @map("sua_luc") @db.Timestamptz(3)
  registeredAt DateTime? @map("dang_luc") @db.Timestamptz(3)
  releaseDate  DateTime? @map("ngay_phat_hanh") @db.Date
}</code></pre>

<h3>Trap 2: a UUID stored as text</h3>
<pre><code>model A { id String @id @default(uuid())            }   <span class="tok-comment">// TEXT   — 36 bytes + overhead</span>
model B { id String @id @default(uuid()) @db.Uuid   }   <span class="tok-comment">// UUID   — 16 bytes, fixed</span></code></pre>
<pre><code><span class="tok-comment">-- Same 200,000 rows, both ways</span>
SELECT pg_size_pretty(pg_total_relation_size('"A"')) AS text_uuid,
       pg_size_pretty(pg_total_relation_size('"B"')) AS native_uuid;</code></pre>
<div class="out">  text_uuid | native_uuid
------------+-------------
  24 MB     | 16 MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Size</span><span class="v">16 bytes versus 36, plus the index copy of every one. On a table with three UUID foreign keys, that is roughly 60 wasted bytes per row before indexes — a third of the table for nothing.</span></div>
  <div class="kv"><span class="k">Correctness</span><span class="v"><code>UUID</code> is a real type: PostgreSQL rejects <code>'khong-phai-uuid'</code>, normalises case, and compares by value. <code>TEXT</code> accepts anything and compares byte by byte, so <code>'AB…'</code> and <code>'ab…'</code> are different rows.</span></div>
  <div class="kv"><span class="k">Interoperability</span><span class="v">A <code>TEXT</code> id cannot be passed to a PostgreSQL function expecting <code>uuid</code> without a cast, which turns every raw query and every join with another system's table into a small friction.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — <code>@db.VarChar(n)</code> is a constraint, not an optimisation.</strong> In PostgreSQL, <code>VARCHAR(50)</code> and <code>TEXT</code> have identical storage and identical performance; the length is checked and nothing else. So do not add it hoping for speed. <em>Do</em> add it when the limit is a real business rule you want the database to enforce — a country code that must be two characters, a status that must fit in twenty. And when you do, remember the length is now a constraint you must migrate to change, which is the next section.</p>
</div>

<h3>What happens when you narrow a column that has data</h3>
<pre><code><span class="tok-comment">// You decide 20 characters is enough for a title. It was TEXT.</span>
model Post {
  title String @db.VarChar(20)
}</code></pre>
<pre><code>npx prisma migrate dev --name thu_hep_title</code></pre>
<div class="out">⚠️  Warnings for the current datasource:

  • You are about to alter the column &#96;title&#96; on the &#96;posts&#96; table, which contains 2 non-null values. The data in that column will be cast from &#96;Text&#96; to &#96;VarChar(20)&#96;. This cast may fail. Please make sure the data in the column can be cast.

? Are you sure you want to create and apply this migration? › (y/N)</div>
<pre><code>ERROR: value too long for type character varying(20)
Database error code: 22001</code></pre>
<div class="callout ok">
<p><strong>This is Prisma behaving well.</strong> It warns, and if you proceed the database refuses rather than truncating — you lose no data, the migration fails, and <code>_prisma_migrations</code> records the failure. Widening (<code>VarChar(20)</code> → <code>VarChar(200)</code> → <code>Text</code>) is always safe and instant. Narrowing needs a plan: check the maximum length first (<code>SELECT max(length(title)) FROM posts</code>), decide what to do with the rows that do not fit, and write those steps into the migration by hand before applying it. Chapter 6 covers the whole family of these expand-then-contract migrations.</p>
</div>

<h3>The one that is provider-specific in an unhelpful way</h3>
<pre><code><span class="tok-comment">// This validates on PostgreSQL and fails immediately on MySQL</span>
model X {
  ip   String   @db.Inet
  name String   @db.Citext        <span class="tok-comment">// needs CREATE EXTENSION citext</span>
  tags String[] <span class="tok-comment">// arrays: PostgreSQL and CockroachDB only</span>
}</code></pre>
<div class="out">error: Native type Inet is not supported for mysql connector.
  --&gt;  prisma/schema.prisma:31
   |
30 | model X {
31 |   ip     String @db.Inet</div>
<p>This is the concrete form of the portability warning from Lesson 0.1. Native types, array fields, index types and JSON operators are all provider-bound, and a schema that uses them well is a schema committed to its database. That is a fine trade — just make it knowingly, and stop describing the project as "database-agnostic" once you have.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/database-features#native-database-types" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Native database types</span><span class="lc-sub">prisma.io/docs · The complete <code>@db.</code> table for all six providers, side by side</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/datatype-datetime.html" target="_blank" rel="noopener"><span class="lc-ico">🕐</span><span class="lc-body"><span class="lc-title">PostgreSQL — date/time types</span><span class="lc-sub">postgresql.org · The definitive account of what <code>timestamptz</code> stores, which is not a time zone</span></span></a>
<a class="link-card" href="https://wiki.postgresql.org/wiki/Don%27t_Do_This" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">PostgreSQL wiki — Don't Do This</span><span class="lc-sub">wiki.postgresql.org · Includes "don't use timestamp (without time zone)" and "don't use char(n)", straight from the community</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, data types chapter</span><span class="lc-sub">The same choices argued from the database side, with storage sizes measured</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Fix a schema with eight wrong native types, and explain what each one would have cost in production</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Native type, và hai cái cắn đau</h2>
<p class="lead">Chín kiểu vô hướng của Prisma ánh xạ sang những kiểu SQL mặc định hợp lý. Các thuộc tính <code>@db.</code> cho phép bạn ghi đè những mặc định đó bằng đúng kiểu mình muốn, và hai trong số chúng — cái về mốc thời gian và cái về UUID — là khác biệt giữa một lược đồ cư xử tử tế và một lược đồ đẻ ra phiếu hỗ trợ sáu tháng sau. Bài này có bảng đầy đủ rồi dành phần còn lại cho đúng hai cái đó.</p>

<h3>Bảng cho PostgreSQL, đầy đủ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>String</code></span><span class="v"><code>@db.Text</code> (mặc định) · <code>@db.VarChar(n)</code> · <code>@db.Char(n)</code> · <code>@db.Uuid</code> · <code>@db.Xml</code> · <code>@db.Inet</code> · <code>@db.Citext</code> · <code>@db.Bit(n)</code> · <code>@db.VarBit(n)</code> · <code>@db.Money</code></span></div>
  <div class="kv"><span class="k"><code>Int</code></span><span class="v"><code>@db.Integer</code> (mặc định) · <code>@db.SmallInt</code> (2 byte, ±32.767) · <code>@db.Oid</code></span></div>
  <div class="kv"><span class="k"><code>BigInt</code></span><span class="v"><code>@db.BigInt</code> (mặc định, 8 byte)</span></div>
  <div class="kv"><span class="k"><code>Float</code></span><span class="v"><code>@db.DoublePrecision</code> (mặc định, 8 byte) · <code>@db.Real</code> (4 byte, khoảng 6 chữ số có nghĩa)</span></div>
  <div class="kv"><span class="k"><code>Decimal</code></span><span class="v"><code>@db.Decimal(p, s)</code> — độ chính xác và số chữ số lẻ. Không có nó thì bạn nhận <code>DECIMAL(65,30)</code>, đúng nhưng lưu ba mươi chữ số lẻ mà bạn không bao giờ dùng.</span></div>
  <div class="kv"><span class="k"><code>DateTime</code></span><span class="v"><code>@db.Timestamp(n)</code> (mặc định, <strong>không có múi giờ</strong>) · <code>@db.Timestamptz(n)</code> · <code>@db.Date</code> · <code>@db.Time(n)</code> · <code>@db.Timetz(n)</code></span></div>
  <div class="kv"><span class="k"><code>Boolean</code></span><span class="v"><code>@db.Boolean</code> (mặc định, 1 byte)</span></div>
  <div class="kv"><span class="k"><code>Json</code></span><span class="v"><code>@db.JsonB</code> (mặc định, nhị phân, đánh chỉ mục được) · <code>@db.Json</code> (văn bản thô, giữ nguyên thứ tự khoá và khoảng trắng, không đánh chỉ mục hữu ích được)</span></div>
  <div class="kv"><span class="k"><code>Bytes</code></span><span class="v"><code>@db.ByteA</code> (mặc định)</span></div>
</div>

<h3>Chọn kiểu DateTime, trong một lượt</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nó có phải một khoảnh khắc?</span><span class="lz-t">Phải → <code>@db.Timestamptz(3)</code></span><span class="lz-d">Tạo lúc, đăng lúc, đăng nhập lúc, giờ bắt đầu sự kiện. Khoảnh khắc ấy giống nhau ở mọi nơi; chỉ cách hiển thị là khác. Đây là phần lớn các cột của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Nó có phải một ngày trên lịch?</span><span class="lz-t">Phải → <code>@db.Date</code></span><span class="lz-d">Ngày sinh, ngày hoá đơn, ngày lễ. Nó không có giờ và không có múi giờ, ép nó thành mốc thời gian là tạo ra con bọ lệch một ngày ngay lần đầu có người dùng ở phía tây bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Nó có phải một giờ đồng hồ?</span><span class="lz-t">Phải → <code>@db.Time(3)</code></span><span class="lz-d">"Mở cửa lúc 09:00", một báo thức lặp lại. Một giờ trong ngày hoàn toàn không gắn với ngày nào.</span></div>
  <div class="lz-step"><span class="lz-k">Không cái nào ở trên?</span><span class="lz-t">Thì <code>DateTime</code> trần là một con bọ</span><span class="lz-d">Nếu bạn chưa nói được nó thuộc loại nào trong ba loại thì bạn chưa biết cột đó nghĩa là gì — và <code>TIMESTAMP</code> không múi giờ là câu trả lời giấu điều đó khỏi bạn.</span></div>
</div>

<h3>Bẫy 1: <code>Timestamp</code> so với <code>Timestamptz</code></h3>
<p>Mặc định của Prisma cho <code>DateTime</code> là <code>TIMESTAMP(3)</code> — <em>không</em> kèm múi giờ. Đây là ý nghĩa thật của nó, với hai cột do cùng một đoạn mã ghi vào:</p>
<pre><code>model SuKien {
  id     Int      @id @default(autoincrement())
  name   String
  noTz   DateTime <span class="tok-comment">// TIMESTAMP(3)   — mặc định của Prisma</span>
  withTz DateTime @db.Timestamptz(3)     <span class="tok-comment">// TIMESTAMPTZ(3) — thứ bạn thường muốn</span>
}</code></pre>
<pre><code>const t = new Date('2026-08-23T10:00:00+07:00');   <span class="tok-comment">// tức 03:00 UTC</span>
await prisma.event.create({ data: { name: 'Hop', noTz: t, withTz: t } });</code></pre>
<pre><code><span class="tok-comment">-- Đọc lại từ psql, ở hai múi giờ phiên khác nhau</span>
SET TIME ZONE 'UTC';         SELECT "noTz", "withTz" FROM "SuKien";
SET TIME ZONE 'Asia/Bangkok'; SELECT "noTz", "withTz" FROM "SuKien";</code></pre>
<div class="out">-- phiên UTC
        khongTz         |          coTz
------------------------+------------------------
 2026-08-23 03:00:00    | 2026-08-23 03:00:00+00

-- phiên Asia/Bangkok (UTC+7)
        khongTz         |          coTz
------------------------+------------------------
 2026-08-23 03:00:00    | 2026-08-23 10:00:00+07</div>
<div class="callout warn">
<p><strong>Đọc lại hai cột đó.</strong> <code>withTz</code> hiện đúng thời khắc địa phương ở mỗi phiên — 03:00 UTC và 10:00 ở Bangkok là cùng một khoảnh khắc, và PostgreSQL biết điều đó. <code>noTz</code> hiện <code>03:00</code> ở cả hai, vì nó lưu một con số đồng hồ treo tường mà <em>không biết</em> nó thuộc múi giờ nào. Prisma luôn đổi sang UTC trước khi ghi, nên nếu chỉ đi qua Prisma thì cả hai cột đều đi về đúng chỗ. Thiệt hại xuất hiện ngay khi có thứ khác chạm vào dữ liệu: một câu truy vấn psql, một công cụ BI, một báo cáo, một job Python, một phép <code>AT TIME ZONE</code> trong migration SQL thô. Lúc đó <code>noTz</code> là một con số không gắn với nghĩa nào.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng <code>@db.Timestamptz(3)</code></span><span class="v">Cho mọi thứ là một khoảnh khắc trong thời gian: tạo lúc, sửa lúc, đăng lúc, đăng nhập lúc, giờ bắt đầu sự kiện. Đây là phần áp đảo trong các cột DateTime và nên là mặc định của bạn.</span></div>
  <div class="kv"><span class="k">Dùng <code>@db.Date</code></span><span class="v">Cho một ngày trên lịch không kèm giờ: ngày sinh, ngày hoá đơn, ngày lễ. Người sinh ngày 1 tháng Giêng thì sinh ngày 1 tháng Giêng ở mọi múi giờ, và lưu nó thành mốc thời gian tạo ra một con bọ lệch một ngày ngay lần đầu có người dùng ở phía tây bạn.</span></div>
  <div class="kv"><span class="k">Dùng <code>Timestamp</code> trần một cách có chủ ý, hoặc đừng dùng</span><span class="v">Có đúng một chỗ chính đáng — một giờ đồng hồ treo tường thật sự không thuộc múi giờ nào, kiểu "cửa hàng mở lúc 09:00" theo múi giờ nơi cửa hàng đứng. Mọi chỗ khác là một tai nạn đang chờ đất nước thứ hai.</span></div>
</div>
<pre><code><span class="tok-comment">// Một lược đồ đã nghĩ về thời gian</span>
model Article {
  id           Int       @id @default(autoincrement())
  createdAt    DateTime  @default(now()) @map("tao_luc") @db.Timestamptz(3)
  updatedAt    DateTime  @updatedAt @map("sua_luc") @db.Timestamptz(3)
  registeredAt DateTime? @map("dang_luc") @db.Timestamptz(3)
  releaseDate  DateTime? @map("ngay_phat_hanh") @db.Date
}</code></pre>

<h3>Bẫy 2: một UUID lưu dưới dạng văn bản</h3>
<pre><code>model A { id String @id @default(uuid())            }   <span class="tok-comment">// TEXT   — 36 byte cộng phần dư</span>
model B { id String @id @default(uuid()) @db.Uuid   }   <span class="tok-comment">// UUID   — 16 byte, cố định</span></code></pre>
<pre><code><span class="tok-comment">-- Cùng 200.000 hàng, hai cách</span>
SELECT pg_size_pretty(pg_total_relation_size('"A"')) AS text_uuid,
       pg_size_pretty(pg_total_relation_size('"B"')) AS native_uuid;</code></pre>
<div class="out">  text_uuid | native_uuid
------------+-------------
  24 MB     | 16 MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Kích thước</span><span class="v">16 byte so với 36, cộng thêm bản sao của từng cái trong chỉ mục. Trên một bảng có ba khoá ngoại UUID thì đó là khoảng 60 byte lãng phí mỗi hàng trước khi tính chỉ mục — một phần ba cái bảng cho không.</span></div>
  <div class="kv"><span class="k">Tính đúng</span><span class="v"><code>UUID</code> là một kiểu thật: PostgreSQL từ chối <code>'khong-phai-uuid'</code>, chuẩn hoá chữ hoa chữ thường, và so sánh theo giá trị. <code>TEXT</code> nhận mọi thứ và so từng byte, nên <code>'AB…'</code> và <code>'ab…'</code> là hai hàng khác nhau.</span></div>
  <div class="kv"><span class="k">Khả năng ghép nối</span><span class="v">Một id kiểu <code>TEXT</code> không truyền được vào hàm PostgreSQL đang chờ <code>uuid</code> mà không ép kiểu, khiến mọi truy vấn thô và mọi phép join với bảng của hệ thống khác đều vướng một chút ma sát.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>@db.VarChar(n)</code> là một ràng buộc, không phải một phép tối ưu.</strong> Trong PostgreSQL, <code>VARCHAR(50)</code> và <code>TEXT</code> lưu trữ y hệt nhau và chạy nhanh y hệt nhau; độ dài chỉ được kiểm, không có gì khác. Nên đừng thêm nó với hy vọng nhanh hơn. <em>Hãy</em> thêm nó khi giới hạn ấy là một luật nghiệp vụ thật mà bạn muốn cơ sở dữ liệu thi hành — một mã quốc gia buộc phải hai ký tự, một trạng thái buộc phải lọt trong hai mươi. Và khi đã thêm, nhớ rằng độ dài giờ là một ràng buộc muốn đổi thì phải migrate — chính là phần ngay dưới.</p>
</div>

<h3>Chuyện gì xảy ra khi bạn thu hẹp một cột đã có dữ liệu</h3>
<pre><code><span class="tok-comment">// Bạn quyết định 20 ký tự là đủ cho tiêu đề. Trước đó nó là TEXT.</span>
model Post {
  title String @db.VarChar(20)
}</code></pre>
<pre><code>npx prisma migrate dev --name thu_hep_title</code></pre>
<div class="out">⚠️  Warnings for the current datasource:

  • You are about to alter the column &#96;title&#96; on the &#96;posts&#96; table, which contains 2 non-null values. The data in that column will be cast from &#96;Text&#96; to &#96;VarChar(20)&#96;. This cast may fail. Please make sure the data in the column can be cast.

? Are you sure you want to create and apply this migration? › (y/N)</div>
<pre><code>ERROR: value too long for type character varying(20)
Database error code: 22001</code></pre>
<div class="callout ok">
<p><strong>Đây là Prisma cư xử tử tế.</strong> Nó cảnh báo, và nếu bạn cứ tiến thì cơ sở dữ liệu từ chối chứ không cắt bớt — bạn không mất dữ liệu nào, migration hỏng, và <code>_prisma_migrations</code> ghi lại thất bại đó. Nới rộng (<code>VarChar(20)</code> → <code>VarChar(200)</code> → <code>Text</code>) luôn an toàn và tức thì. Thu hẹp thì cần một kế hoạch: kiểm độ dài lớn nhất trước (<code>SELECT max(length(title)) FROM posts</code>), quyết xem làm gì với những hàng không vừa, rồi viết các bước ấy vào migration bằng tay trước khi áp dụng. Chương 6 nói về cả họ migration "nới rồi thu" này.</p>
</div>

<h3>Cái gắn với provider theo kiểu chẳng dễ chịu</h3>
<pre><code><span class="tok-comment">// Đoạn này hợp lệ trên PostgreSQL và hỏng ngay lập tức trên MySQL</span>
model X {
  ip   String   @db.Inet
  name String   @db.Citext        <span class="tok-comment">// cần CREATE EXTENSION citext</span>
  tags String[] <span class="tok-comment">// mảng: chỉ PostgreSQL và CockroachDB</span>
}</code></pre>
<div class="out">error: Native type Inet is not supported for mysql connector.
  --&gt;  prisma/schema.prisma:31
   |
30 | model X {
31 |   ip     String @db.Inet</div>
<p>Đây là dạng cụ thể của lời cảnh báo về tính di động ở Bài 0.1. Native type, trường mảng, loại chỉ mục và toán tử JSON đều gắn với provider, và một lược đồ dùng chúng cho tốt là một lược đồ đã cam kết với cơ sở dữ liệu của nó. Đó là một đánh đổi hoàn toàn ổn — chỉ cần làm nó một cách có ý thức, và thôi mô tả dự án là "không phụ thuộc cơ sở dữ liệu" kể từ lúc đó.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/database-features#native-database-types" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Native database types</span><span class="lc-sub">prisma.io/docs · Bảng <code>@db.</code> đầy đủ cho cả sáu provider, đặt cạnh nhau</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/datatype-datetime.html" target="_blank" rel="noopener"><span class="lc-ico">🕐</span><span class="lc-body"><span class="lc-title">PostgreSQL — kiểu ngày giờ</span><span class="lc-sub">postgresql.org · Bản trình bày dứt khoát về việc <code>timestamptz</code> lưu cái gì, mà cái đó không phải một múi giờ</span></span></a>
<a class="link-card" href="https://wiki.postgresql.org/wiki/Don%27t_Do_This" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">PostgreSQL wiki — Don't Do This</span><span class="lc-sub">wiki.postgresql.org · Có cả "đừng dùng timestamp (không múi giờ)" và "đừng dùng char(n)", nói thẳng từ cộng đồng</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương kiểu dữ liệu</span><span class="lc-sub">Cũng những lựa chọn đó lập luận từ phía cơ sở dữ liệu, kèm kích thước lưu trữ đo thật</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Sửa một lược đồ có tám native type sai, và giải thích mỗi cái đáng lẽ đã tốn gì trên production</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Enums, Json, Bytes and Unsupported|||2.5 — Enum, Json, Bytes và Unsupported',
      slug: 'pr-2-5-kieu-kho-chiu',
      type: 'LESSON',
      description: 'Bốn kiểu không cư xử như phần còn lại: enum và cái giá thật của việc đổi tên một giá trị đã deploy, Json với cách cho nó kiểu bằng generic, Bytes, và Unsupported cho những cột Prisma không hiểu — kèm sự cố production 08/08/2026 mổ từng dòng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Enums, Json, Bytes and Unsupported</h2>
<p class="lead">Four types behave differently from the rest, and each has a specific way of hurting you. An enum is the cheapest constraint in the schema and the most expensive one to change. A <code>Json</code> column has no type at all until you give it one. <code>Bytes</code> tempts people into storing files in rows. And <code>Unsupported</code> is the escape hatch for columns Prisma cannot model, which quietly makes a whole model unwritable.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Constrained but rigid</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">enum</span><span class="lz-nsub">A real PostgreSQL type, 4 bytes, enforced against every writer. Adding a value is one statement; renaming one is seven and an exclusive lock.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Flexible but untyped</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Json</span><span class="lz-nsub">Anything fits, nothing is checked, and the TypeScript type is a recursive union that has no properties until you attach one yourself.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bytes</span><span class="lz-nsub">Raw binary. Correct for a 32-byte hash; a trap for a 5 MB file, which then rides along in every SELECT and every backup.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Outside the model entirely</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Unsupported</span><span class="lz-nsub">The column exists and migrations create it; the client cannot see it. Required plus Unsupported means the model can no longer be created through Prisma at all.</span></div></div>
  </div>
</div>

<h3>Enums — cheap constraint, expensive rename</h3>
<pre><code>enum OrderStatus {
  MOI
  DANG_XU_LY
  DA_GIAO
  DA_HUY
}

model Order {
  id     Int         @id @default(autoincrement())
  status OrderStatus @default(MOI) @map("trang_thai")
}</code></pre>
<div class="out">-- CreateEnum
CREATE TYPE "TrangThaiDon" AS ENUM ('MOI', 'DANG_XU_LY', 'DA_GIAO', 'DA_HUY');

-- CreateTable
CREATE TABLE "DonHang" (
    "id" SERIAL NOT NULL,
    "trang_thai" "TrangThaiDon" NOT NULL DEFAULT 'MOI',
    CONSTRAINT "DonHang_pkey" PRIMARY KEY ("id")
);</div>
<div class="kv-grid">
  <div class="kv"><span class="k">In PostgreSQL: a real type</span><span class="v">A native <code>ENUM</code>, 4 bytes, enforced by the database. An invalid value is rejected regardless of which client wrote it — a genuine constraint, not a convention.</span></div>
  <div class="kv"><span class="k">In MySQL: an inline enum</span><span class="v">Also native, but declared on the column rather than as a shared type.</span></div>
  <div class="kv"><span class="k">In SQLite: nothing</span><span class="v">No enum type exists. Prisma generates the TypeScript union and stores <code>TEXT</code>. The compile-time check remains; the database-level guarantee does not.</span></div>
  <div class="kv"><span class="k">In TypeScript</span><span class="v">A const object plus a union type, importable: <code>import { OrderStatus } from '@prisma/client'</code>. That import is the single most important line in this lesson — see below.</span></div>
</div>
<pre><code><span class="tok-comment">// Adding a value is easy and safe</span>
enum OrderStatus {
  MOI
  DANG_XU_LY
  DANG_GIAO      <span class="tok-comment">// ← new</span>
  DA_GIAO
  DA_HUY
}</code></pre>
<div class="out">-- AlterEnum
ALTER TYPE "TrangThaiDon" ADD VALUE 'DANG_GIAO';</div>
<pre><code><span class="tok-comment">// Renaming one is not</span>
enum OrderStatus {
  MOI
  DANG_XU_LY
  HOAN_TAT       <span class="tok-comment">// ← was DA_GIAO</span>
  DA_HUY
}</code></pre>
<div class="out">⚠️  Warnings:
  • The values [DA_GIAO] on the enum &#96;TrangThaiDon&#96; will be removed. If these variants are still used in the database, this will fail.

-- AlterEnum
BEGIN;
CREATE TYPE "TrangThaiDon_new" AS ENUM ('MOI', 'DANG_XU_LY', 'HOAN_TAT', 'DA_HUY');
ALTER TABLE "DonHang" ALTER COLUMN "trang_thai" DROP DEFAULT;
ALTER TABLE "DonHang" ALTER COLUMN "trang_thai" TYPE "TrangThaiDon_new" USING ("trang_thai"::text::"TrangThaiDon_new");
ALTER TYPE "TrangThaiDon" RENAME TO "TrangThaiDon_old";
ALTER TYPE "TrangThaiDon_new" RENAME TO "TrangThaiDon";
DROP TYPE "TrangThaiDon_old";
COMMIT;</div>
<p>Seven statements, an exclusive lock on the table, and a cast that <strong>fails on any existing row still holding <code>DA_GIAO</code></strong>. The correct sequence is add-migrate-backfill-remove across two deploys: add <code>HOAN_TAT</code>, ship it, update every row and every code path, then remove <code>DA_GIAO</code> in a second migration. Chapter 6 generalises this into the expand–contract pattern.</p>

<div class="note-ct">
<p><strong>From the CuongThai codebase — the enum rename that passed every check and broke production.</strong> On 2026-08-08 the value <code>ContentType.CODE</code> was renamed to <code>CODE_REVIEW</code>, matching what the frontend had always called it. <code>npx tsc --noEmit</code> passed. <code>prisma generate</code> passed. The frontend build passed. The migration applied. And <code>prisma db seed</code> broke on production.</p>
<p>The cause is one line in <code>prisma/seed.ts</code>:</p>
<pre><code><span class="tok-comment">// The bug — a hand-copied union that type-checks against itself</span>
type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';

<span class="tok-comment">// The fix — import the generated one, so a rename is a compile error</span>
import type { ContentType } from '@prisma/client';</code></pre>
<p>Two things made it invisible. First, the hand-written union was <em>internally consistent</em> — the seed file agreed with itself perfectly, so nothing could flag the disagreement with the schema. Second, <code>tsconfig.json</code> has <code>rootDir: "./src"</code>, so <code>prisma/**</code> sits in <code>exclude</code> and <code>tsc --noEmit</code> never looked at the file at all.</p>
<p>The repository's fix has two parts, both now in its pre-push checklist: a separate <code>tsconfig.seed.json</code> with <code>npm run typecheck:seed</code>, and <code>npx prisma db seed</code> run for real whenever an enum or model changes — because a runtime failure in a script nothing type-checks is only found by running it. <strong>The rule: never hand-copy a type the generator already produces.</strong> Chapter 8 returns to this with the full set of generated types you should be importing instead.</p>
</div>

<h3><code>Json</code> — the column with no type</h3>
<pre><code>model User {
  id       Int   @id @default(autoincrement())
  settings Json  @default("{}") @map("cai_dat")
  meta     Json? @db.Json          <span class="tok-comment">// text JSON: preserves key order, cannot be indexed well</span>
}</code></pre>
<pre><code><span class="tok-comment">// Reading it: Prisma.JsonValue is a recursive union — effectively unknown</span>
const u = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });
u.settings.theme;          <span class="tok-comment">// ✗ does not compile — JsonValue has no properties</span>
(u.settings as any).theme; <span class="tok-comment">// compiles, and throws away all safety</span></code></pre>
<pre><code><span class="tok-comment">// Give it a real type — prisma-json-types-generator, the clean way</span>
generator json {
  provider = "prisma-json-types-generator"
}

model User {
  <span class="tok-comment">/// [CaiDatNguoiDung]</span>
  settings Json @default("{}") @map("cai_dat")
}

<span class="tok-comment">// types/prisma-json.d.ts</span>
declare global {
  namespace PrismaJson {
    type UserSettings = { theme: 'sang' | 'toi'; ngonNgu: 'vi' | 'en'; notification: boolean };
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Querying inside it</span><span class="v"><code>where: { settings: { path: ['theme'], equals: 'toi' } }</code>. Works, and scans the whole table unless you add a GIN index — which Prisma cannot declare on a JSON path, so it is a hand-written migration.</span></div>
  <div class="kv"><span class="k">Three kinds of null</span><span class="v">The genuinely confusing part. <code>Prisma.DbNull</code> means the column is SQL <code>NULL</code>. <code>Prisma.JsonNull</code> means the column holds the JSON value <code>null</code>. Plain <code>null</code> in a filter means "ignore this condition". They are three different things and mixing them up produces filters that silently match everything.</span></div>
  <div class="kv"><span class="k">When to use it at all</span><span class="v">Data whose shape you genuinely do not control: a webhook payload, a third-party response, an audit snapshot, per-user settings that differ by user. Not for data you filter, join, or aggregate on — that is a column, and pretending otherwise buys flexibility you will pay for with an unindexable query.</span></div>
</div>

<h3><code>Bytes</code>, briefly</h3>
<pre><code>model FileRow {
  id   Int    @id @default(autoincrement())
  hash Bytes  @db.ByteA        <span class="tok-comment">// a SHA-256: 32 bytes. Correct use.</span>
  body Bytes? <span class="tok-comment">// a whole file. Almost always wrong.</span>
}</code></pre>
<pre><code>const hash = crypto.createHash('sha256').update('xin chao').digest();
await prisma.file.create({ data: { hash } });

const row = await prisma.file.findFirstOrThrow();
console.log(row.hash.constructor.name, Buffer.from(row.hash).toString('hex').slice(0, 16));</code></pre>
<div class="out">Uint8Array 4e9518575422c9087396887ce20477ab</div>
<div class="pitfall">
<p><strong>Trap — files in the database.</strong> A 5 MB image in a <code>BYTEA</code> column means every <code>SELECT *</code> on that table pulls 5 MB over the wire, every backup carries it, and PostgreSQL's TOAST machinery works around your data instead of with it. Store files in object storage (R2, S3) and keep a URL or key in the row. The CuongThai backend does exactly this with Cloudflare R2, and the CuongThai Object Storage course covers the pattern. Reserve <code>Bytes</code> for small fixed-size binaries: hashes, keys, encrypted tokens, a TOTP secret.</p>
</div>

<h3><code>Unsupported</code> — and the model it makes read-only</h3>
<pre><code>model Diadiem {
  id     Int         @id @default(autoincrement())
  name   String
  toado  Unsupported ("geography(Point, 4326)")?
  vector Unsupported ("vector(1536)")?           <span class="tok-comment">// pgvector, as used by CuongThai</span>

  @@index([vector], map: "idx_diadiem_vector")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">What it does</span><span class="v">Tells Prisma the column exists and what its SQL type is, so migrations create it correctly and <code>db pull</code> stops complaining. The column is fully usable by PostgreSQL and by raw SQL.</span></div>
  <div class="kv"><span class="k">What it does not do</span><span class="v">The field is absent from the generated client. You cannot read it, filter on it, or write it through Prisma Client — only through <code>$queryRaw</code> and <code>$executeRaw</code>.</span></div>
  <div class="kv"><span class="k">The consequence people miss</span><span class="v">If an <code>Unsupported</code> field is <strong>required</strong> (no <code>?</code>), <code>prisma.diadiem.create()</code> cannot supply it, so the whole model becomes uncreatable through the client. Make it optional, give it a database default, or accept that inserts go through raw SQL.</span></div>
</div>
<pre><code><span class="tok-comment">// Working with it: raw SQL on the way in, raw SQL on the way out</span>
await prisma.$executeRaw&#96;
  INSERT INTO "Diadiem" (name, toado)
  VALUES (\${name}, ST_SetSRID(ST_MakePoint(\${lng}, \${lat}), 4326))&#96;;

const attach = await prisma.$queryRaw&lt;{ id: number; name: string; m: number }[]&gt;&#96;
  SELECT id, name, ST_Distance(toado, ST_SetSRID(ST_MakePoint(\${lng}, \${lat}), 4326)) AS m
  FROM "Diadiem" ORDER BY m LIMIT 10&#96;;</code></pre>
<div class="callout ok">
<p><strong>This is the honest boundary of the tool, and it is fine.</strong> Prisma models the relational core well and hands you raw SQL for everything else — PostGIS geometry, pgvector embeddings, <code>tsvector</code> full-text, range types, custom composite types. The CuongThai database uses pgvector for embeddings and pg_trgm for fuzzy post search, both through exactly this pattern. Chapter 10 makes raw SQL a proper skill rather than a last resort.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">Defining enums</span><span class="lc-sub">prisma.io/docs · Per-provider support and what the generated TypeScript looks like</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields" target="_blank" rel="noopener"><span class="lc-ico">🗂️</span><span class="lc-body"><span class="lc-title">Working with Json fields</span><span class="lc-sub">prisma.io/docs · Filtering by path, and the DbNull/JsonNull/null distinction spelled out properly</span></span></a>
<a class="link-card" href="https://github.com/arthurfiorette/prisma-json-types-generator" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">prisma-json-types-generator</span><span class="lc-sub">github.com · The generator that turns a doc comment into a real type for a Json column</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/unsupported-database-features" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Unsupported database features</span><span class="lc-sub">prisma.io/docs · <code>Unsupported</code>, and how to keep hand-written database objects across migrations</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Rename an enum value safely across two migrations, with the backfill in between</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Enum, Json, Bytes và Unsupported</h2>
<p class="lead">Bốn kiểu cư xử khác phần còn lại, và mỗi cái có một cách riêng để làm bạn đau. Enum là ràng buộc rẻ nhất trong lược đồ và cũng là ràng buộc đắt nhất khi đổi. Một cột <code>Json</code> hoàn toàn không có kiểu cho tới khi bạn cho nó một cái. <code>Bytes</code> dụ người ta lưu tệp vào hàng dữ liệu. Còn <code>Unsupported</code> là cửa thoát hiểm cho những cột Prisma không mô hình hoá nổi, và nó âm thầm khiến cả một model không ghi được.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Ràng buộc chặt nhưng cứng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">enum</span><span class="lz-nsub">Một kiểu PostgreSQL thật, 4 byte, thi hành với mọi bên ghi. Thêm một giá trị là một câu lệnh; đổi tên một giá trị là bảy câu lệnh cộng một khoá độc quyền.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Linh hoạt nhưng không kiểu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Json</span><span class="lz-nsub">Cái gì cũng nhét vừa, không gì được kiểm, và kiểu TypeScript là một union đệ quy không có thuộc tính nào cho tới khi bạn tự gắn vào.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bytes</span><span class="lz-nsub">Nhị phân thô. Đúng cho một hash 32 byte; là bẫy cho một tệp 5 MB, thứ rồi sẽ đi ké trong mọi câu SELECT và mọi bản sao lưu.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nằm hẳn ngoài model</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Unsupported</span><span class="lz-nsub">Cột tồn tại và migration tạo ra nó; client không nhìn thấy. Bắt buộc cộng Unsupported nghĩa là model đó không còn tạo được qua Prisma nữa.</span></div></div>
  </div>
</div>

<h3>Enum — ràng buộc rẻ, đổi tên thì đắt</h3>
<pre><code>enum OrderStatus {
  MOI
  DANG_XU_LY
  DA_GIAO
  DA_HUY
}

model Order {
  id     Int         @id @default(autoincrement())
  status OrderStatus @default(MOI) @map("trang_thai")
}</code></pre>
<div class="out">-- CreateEnum
CREATE TYPE "TrangThaiDon" AS ENUM ('MOI', 'DANG_XU_LY', 'DA_GIAO', 'DA_HUY');

-- CreateTable
CREATE TABLE "DonHang" (
    "id" SERIAL NOT NULL,
    "trang_thai" "TrangThaiDon" NOT NULL DEFAULT 'MOI',
    CONSTRAINT "DonHang_pkey" PRIMARY KEY ("id")
);</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ở PostgreSQL: một kiểu thật</span><span class="v">Một <code>ENUM</code> gốc, 4 byte, do cơ sở dữ liệu thi hành. Một giá trị sai bị từ chối bất kể client nào ghi vào — một ràng buộc thật, không phải một quy ước.</span></div>
  <div class="kv"><span class="k">Ở MySQL: enum gắn thẳng vào cột</span><span class="v">Cũng là kiểu gốc, nhưng khai trên cột chứ không phải là một kiểu dùng chung.</span></div>
  <div class="kv"><span class="k">Ở SQLite: không có gì</span><span class="v">Không tồn tại kiểu enum. Prisma sinh ra union TypeScript và lưu <code>TEXT</code>. Phép kiểm lúc biên dịch vẫn còn; bảo đảm ở mức cơ sở dữ liệu thì không.</span></div>
  <div class="kv"><span class="k">Ở TypeScript</span><span class="v">Một đối tượng const cộng một kiểu union, import được: <code>import { OrderStatus } from '@prisma/client'</code>. Dòng import ấy là dòng quan trọng nhất trong cả bài này — xem phần dưới.</span></div>
</div>
<pre><code><span class="tok-comment">// Thêm một giá trị thì dễ và an toàn</span>
enum OrderStatus {
  MOI
  DANG_XU_LY
  DANG_GIAO      <span class="tok-comment">// ← mới</span>
  DA_GIAO
  DA_HUY
}</code></pre>
<div class="out">-- AlterEnum
ALTER TYPE "TrangThaiDon" ADD VALUE 'DANG_GIAO';</div>
<pre><code><span class="tok-comment">// Đổi tên một giá trị thì không</span>
enum OrderStatus {
  MOI
  DANG_XU_LY
  HOAN_TAT       <span class="tok-comment">// ← vốn là DA_GIAO</span>
  DA_HUY
}</code></pre>
<div class="out">⚠️  Warnings:
  • The values [DA_GIAO] on the enum &#96;TrangThaiDon&#96; will be removed. If these variants are still used in the database, this will fail.

-- AlterEnum
BEGIN;
CREATE TYPE "TrangThaiDon_new" AS ENUM ('MOI', 'DANG_XU_LY', 'HOAN_TAT', 'DA_HUY');
ALTER TABLE "DonHang" ALTER COLUMN "trang_thai" DROP DEFAULT;
ALTER TABLE "DonHang" ALTER COLUMN "trang_thai" TYPE "TrangThaiDon_new" USING ("trang_thai"::text::"TrangThaiDon_new");
ALTER TYPE "TrangThaiDon" RENAME TO "TrangThaiDon_old";
ALTER TYPE "TrangThaiDon_new" RENAME TO "TrangThaiDon";
DROP TYPE "TrangThaiDon_old";
COMMIT;</div>
<p>Bảy câu lệnh, một khoá độc quyền trên bảng, và một phép ép kiểu <strong>hỏng với bất kỳ hàng nào còn đang giữ <code>DA_GIAO</code></strong>. Chuỗi thao tác đúng là thêm–migrate–đổ dữ liệu–bỏ, trải qua hai lần deploy: thêm <code>HOAN_TAT</code>, đưa lên chạy, cập nhật mọi hàng và mọi nhánh mã, rồi bỏ <code>DA_GIAO</code> trong một migration thứ hai. Chương 6 tổng quát hoá chuyện này thành mẫu nới–thu.</p>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai — cú đổi tên enum qua được mọi phép kiểm và làm vỡ production.</strong> Ngày 08/08/2026 giá trị <code>ContentType.CODE</code> được đổi tên thành <code>CODE_REVIEW</code>, khớp với thứ frontend vốn luôn gọi. <code>npx tsc --noEmit</code> qua. <code>prisma generate</code> qua. Bản build frontend qua. Migration áp dụng xong. Và <code>prisma db seed</code> vỡ trên production.</p>
<p>Nguyên nhân nằm ở một dòng trong <code>prisma/seed.ts</code>:</p>
<pre><code><span class="tok-comment">// Con bọ — một union chép tay, tự kiểm với chính nó</span>
type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';

<span class="tok-comment">// Cách vá — import cái được sinh ra, để một lần đổi tên thành lỗi biên dịch</span>
import type { ContentType } from '@prisma/client';</code></pre>
<p>Hai điều khiến nó vô hình. Thứ nhất, cái union chép tay <em>nhất quán với chính nó</em> — tệp seed đồng ý với bản thân nó hoàn hảo, nên không có gì đánh dấu được chỗ nó bất đồng với lược đồ. Thứ hai, <code>tsconfig.json</code> có <code>rootDir: "./src"</code>, nên <code>prisma/**</code> nằm trong <code>exclude</code> và <code>tsc --noEmit</code> chưa bao giờ nhìn vào tệp đó.</p>
<p>Cách vá của kho có hai phần, cả hai nay nằm trong danh sách kiểm trước khi đẩy: một <code>tsconfig.seed.json</code> riêng cùng <code>npm run typecheck:seed</code>, và chạy thật <code>npx prisma db seed</code> mỗi khi một enum hay một model đổi — vì một thất bại lúc chạy trong một script không ai kiểm kiểu thì chỉ tìm ra bằng cách chạy nó. <strong>Luật: đừng bao giờ chép tay một kiểu mà bộ sinh mã vốn đã đẻ ra.</strong> Chương 8 quay lại chuyện này với đủ bộ kiểu được sinh mà lẽ ra bạn nên import.</p>
</div>

<h3><code>Json</code> — cột không có kiểu</h3>
<pre><code>model User {
  id       Int   @id @default(autoincrement())
  settings Json  @default("{}") @map("cai_dat")
  meta     Json? @db.Json          <span class="tok-comment">// JSON văn bản: giữ thứ tự khoá, khó đánh chỉ mục cho tốt</span>
}</code></pre>
<pre><code><span class="tok-comment">// Đọc nó: Prisma.JsonValue là union đệ quy — thực chất là unknown</span>
const u = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });
u.settings.theme;          <span class="tok-comment">// ✗ không biên dịch được — JsonValue không có thuộc tính nào</span>
(u.settings as any).theme; <span class="tok-comment">// biên dịch được, và vứt hết an toàn kiểu đi</span></code></pre>
<pre><code><span class="tok-comment">// Cho nó một kiểu thật — prisma-json-types-generator, cách sạch sẽ</span>
generator json {
  provider = "prisma-json-types-generator"
}

model User {
  <span class="tok-comment">/// [CaiDatNguoiDung]</span>
  settings Json @default("{}") @map("cai_dat")
}

<span class="tok-comment">// types/prisma-json.d.ts</span>
declare global {
  namespace PrismaJson {
    type UserSettings = { theme: 'sang' | 'toi'; ngonNgu: 'vi' | 'en'; notification: boolean };
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Truy vấn bên trong nó</span><span class="v"><code>where: { settings: { path: ['theme'], equals: 'toi' } }</code>. Chạy được, và quét cả bảng trừ khi bạn thêm chỉ mục GIN — thứ mà Prisma không khai được theo một đường dẫn JSON, nên nó là một migration viết tay.</span></div>
  <div class="kv"><span class="k">Ba loại null</span><span class="v">Phần rối thật sự. <code>Prisma.DbNull</code> nghĩa là cột đang là <code>NULL</code> của SQL. <code>Prisma.JsonNull</code> nghĩa là cột đang giữ giá trị JSON <code>null</code>. Còn <code>null</code> trần trong một bộ lọc nghĩa là "bỏ qua điều kiện này". Ba thứ khác nhau, và lẫn lộn chúng đẻ ra những bộ lọc âm thầm khớp với tất cả.</span></div>
  <div class="kv"><span class="k">Khi nào mới nên dùng</span><span class="v">Dữ liệu mà bạn thật sự không kiểm soát hình dạng: một payload webhook, một phản hồi của bên thứ ba, một bản chụp để kiểm toán, các cài đặt riêng khác nhau theo từng người dùng. Không dùng cho dữ liệu bạn lọc, join hay tổng hợp — thứ đó là một cột, và giả vờ ngược lại là mua một sự linh hoạt mà bạn sẽ trả bằng một câu truy vấn không đánh chỉ mục được.</span></div>
</div>

<h3><code>Bytes</code>, nói ngắn</h3>
<pre><code>model FileRow {
  id   Int    @id @default(autoincrement())
  hash Bytes  @db.ByteA        <span class="tok-comment">// một SHA-256: 32 byte. Dùng đúng.</span>
  body Bytes? <span class="tok-comment">// nguyên một tệp. Gần như luôn sai.</span>
}</code></pre>
<pre><code>const hash = crypto.createHash('sha256').update('xin chao').digest();
await prisma.file.create({ data: { hash } });

const row = await prisma.file.findFirstOrThrow();
console.log(row.hash.constructor.name, Buffer.from(row.hash).toString('hex').slice(0, 16));</code></pre>
<div class="out">Uint8Array 4e9518575422c9087396887ce20477ab</div>
<div class="pitfall">
<p><strong>Bẫy — nhét tệp vào cơ sở dữ liệu.</strong> Một ảnh 5 MB nằm trong cột <code>BYTEA</code> nghĩa là mọi câu <code>SELECT *</code> trên bảng đó kéo 5 MB qua đường truyền, mọi bản sao lưu đều mang nó theo, và bộ máy TOAST của PostgreSQL phải lách quanh dữ liệu của bạn thay vì làm việc cùng nó. Hãy lưu tệp trong kho đối tượng (R2, S3) và giữ một URL hoặc một khoá trong hàng. Backend CuongThai làm đúng thế với Cloudflare R2, và khoá Object Storage của CuongThai nói về mẫu này. Hãy dành <code>Bytes</code> cho các khối nhị phân nhỏ cỡ cố định: hash, khoá, token đã mã hoá, một bí mật TOTP.</p>
</div>

<h3><code>Unsupported</code> — và cái model nó biến thành chỉ đọc</h3>
<pre><code>model Diadiem {
  id     Int         @id @default(autoincrement())
  name   String
  toado  Unsupported ("geography(Point, 4326)")?
  vector Unsupported ("vector(1536)")?           <span class="tok-comment">// pgvector, đúng thứ CuongThai dùng</span>

  @@index([vector], map: "idx_diadiem_vector")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó làm được gì</span><span class="v">Báo cho Prisma biết cột đó tồn tại và kiểu SQL của nó là gì, để migration tạo đúng và <code>db pull</code> thôi phàn nàn. Cột đó dùng được đầy đủ bởi PostgreSQL và bởi SQL thô.</span></div>
  <div class="kv"><span class="k">Nó không làm được gì</span><span class="v">Trường ấy vắng mặt khỏi client sinh ra. Bạn không đọc, không lọc, không ghi nó qua Prisma Client được — chỉ qua <code>$queryRaw</code> và <code>$executeRaw</code>.</span></div>
  <div class="kv"><span class="k">Hệ quả người ta hay bỏ sót</span><span class="v">Nếu một trường <code>Unsupported</code> là <strong>bắt buộc</strong> (không có <code>?</code>) thì <code>prisma.diadiem.create()</code> không cung cấp được nó, nên cả model thành thứ không tạo được qua client. Hãy để nó tuỳ chọn, cho nó một giá trị mặc định dưới cơ sở dữ liệu, hoặc chấp nhận rằng các lần chèn phải đi bằng SQL thô.</span></div>
</div>
<pre><code><span class="tok-comment">// Làm việc với nó: SQL thô lúc vào, SQL thô lúc ra</span>
await prisma.$executeRaw&#96;
  INSERT INTO "Diadiem" (name, toado)
  VALUES (\${name}, ST_SetSRID(ST_MakePoint(\${lng}, \${lat}), 4326))&#96;;

const attach = await prisma.$queryRaw&lt;{ id: number; name: string; m: number }[]&gt;&#96;
  SELECT id, name, ST_Distance(toado, ST_SetSRID(ST_MakePoint(\${lng}, \${lat}), 4326)) AS m
  FROM "Diadiem" ORDER BY m LIMIT 10&#96;;</code></pre>
<div class="callout ok">
<p><strong>Đây là ranh giới trung thực của công cụ, và như thế là ổn.</strong> Prisma mô hình hoá phần lõi quan hệ rất tốt rồi trao SQL thô cho mọi thứ còn lại — hình học PostGIS, embedding pgvector, tìm kiếm toàn văn bằng <code>tsvector</code>, kiểu khoảng, kiểu phức hợp tự định nghĩa. Cơ sở dữ liệu của CuongThai dùng pgvector cho embedding và pg_trgm cho tìm bài viết gần đúng, cả hai qua đúng mẫu này. Chương 10 biến SQL thô thành một kỹ năng đàng hoàng chứ không phải một lối cùng đường.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">Defining enums</span><span class="lc-sub">prisma.io/docs · Mức hỗ trợ theo provider và phần TypeScript sinh ra trông thế nào</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields" target="_blank" rel="noopener"><span class="lc-ico">🗂️</span><span class="lc-body"><span class="lc-title">Working with Json fields</span><span class="lc-sub">prisma.io/docs · Lọc theo đường dẫn, và phân biệt DbNull/JsonNull/null nói cho tử tế</span></span></a>
<a class="link-card" href="https://github.com/arthurfiorette/prisma-json-types-generator" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">prisma-json-types-generator</span><span class="lc-sub">github.com · Bộ sinh biến một chú thích tài liệu thành kiểu thật cho một cột Json</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/unsupported-database-features" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Unsupported database features</span><span class="lc-sub">prisma.io/docs · <code>Unsupported</code>, và cách giữ các đối tượng cơ sở dữ liệu viết tay qua các lần migration</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Đổi tên một giá trị enum an toàn qua hai migration, với bước đổ dữ liệu ở giữa</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Trắc nghiệm Chương 2',
      slug: 'pr-2-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: kiểu đúng cho tiền, uuid() sinh ở đâu, @updatedAt bỏ sót lần ghi nào, name so với map trong @@unique, khoá ngoại và chỉ mục, Timestamp so với Timestamptz, đổi tên giá trị enum, và Unsupported bắt buộc.',
      content: `
<div class="ml-en">
<p>Eight questions on the schema language. Six of them correspond to a bug that has actually shipped — in this repository or in one very like it.</p>
</div>
<div class="ml-vi">
<p>Tám câu về ngôn ngữ lược đồ. Sáu trong số đó ứng với một con bọ đã thật sự lên chạy — trong chính kho này hoặc trong một kho rất giống nó.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which type is correct for a money column, and why?|||Kiểu nào đúng cho một cột tiền, và vì sao?',
            options: [
              'Decimal with @db.Decimal(p, s) — exact base-10 arithmetic, so 0.1 added ten times is exactly 1.00|||Decimal kèm @db.Decimal(p, s) — số học cơ số mười chính xác, nên 0,1 cộng mười lần đúng bằng 1,00',
              'Float — it is the fastest numeric type and rounding at display time fixes any error|||Float — kiểu số nhanh nhất, và làm tròn lúc hiển thị là vá được mọi sai số',
              'String — storing the formatted amount avoids all arithmetic problems|||String — lưu số tiền đã định dạng thì tránh được mọi bài toán số học',
              'BigInt — it has the widest range, which is what money needs|||BigInt — nó có dải giá trị rộng nhất, và tiền cần đúng thứ đó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Where is `@default(uuid())` evaluated?|||`@default(uuid())` được tính ở đâu?',
            options: [
              'In Prisma Client, in JavaScript — so a row inserted by anything else gets no value and NOT NULL rejects it|||Trong Prisma Client, bằng JavaScript — nên một hàng do thứ khác chèn vào sẽ không có giá trị và NOT NULL từ chối nó',
              'In PostgreSQL, as a column DEFAULT, so every writer gets one|||Trong PostgreSQL, dưới dạng DEFAULT của cột, nên mọi bên ghi đều có',
              'In the query engine, after the SQL is built but before it is sent|||Trong query engine, sau khi dựng SQL nhưng trước khi gửi đi',
              'At migration time — the values are precomputed into a sequence|||Lúc migration — các giá trị được tính sẵn vào một sequence',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which write does `@updatedAt` NOT update?|||`@updatedAt` KHÔNG cập nhật lần ghi nào?',
            options: [
              'A raw UPDATE run from psql or another service — the timestamp is set by Prisma Client, not by a database default|||Một câu UPDATE thô chạy từ psql hoặc từ một dịch vụ khác — mốc thời gian do Prisma Client đặt, không phải do mặc định của cơ sở dữ liệu',
              'A prisma.model.update() call, which only touches the fields in `data`|||Một lời gọi prisma.model.update(), vốn chỉ đụng tới các trường trong `data`',
              'A prisma.model.updateMany() call, because it returns only a count|||Một lời gọi prisma.model.updateMany(), vì nó chỉ trả về số đếm',
              'None — @updatedAt creates a trigger, so every writer is covered|||Không lần nào — @updatedAt tạo ra một trigger, nên mọi bên ghi đều được che',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between `@@unique([a, b], name: "x")` and `@@unique([a, b], map: "x")`?|||Khác nhau giữa `@@unique([a, b], name: "x")` và `@@unique([a, b], map: "x")` là gì?',
            options: [
              '`name` changes the key you query by (where: { x: … }); `map` only renames the constraint in the database and leaves the query key as a_b|||`name` đổi khoá bạn dùng để truy vấn (where: { x: … }); `map` chỉ đổi tên ràng buộc dưới cơ sở dữ liệu và giữ nguyên khoá truy vấn là a_b',
              'They are aliases — both rename the database constraint and neither affects queries|||Hai cái là tên gọi khác của nhau — cả hai đều đổi tên ràng buộc và không cái nào ảnh hưởng tới truy vấn',
              '`name` renames the constraint; `map` changes the query key|||`name` đổi tên ràng buộc; `map` đổi khoá truy vấn',
              '`map` is for @@index only and is rejected on @@unique|||`map` chỉ dùng cho @@index và bị từ chối trên @@unique',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which columns does PostgreSQL index automatically when Prisma creates a table?|||PostgreSQL tự đánh chỉ mục cho những cột nào khi Prisma tạo bảng?',
            options: [
              'The primary key and every unique constraint — foreign keys are NOT indexed, so each relation scalar needs its own @@index|||Khoá chính và mọi ràng buộc unique — khoá ngoại thì KHÔNG, nên mỗi trường vô hướng của quan hệ đều cần @@index riêng',
              'The primary key, every unique constraint, and every foreign key|||Khoá chính, mọi ràng buộc unique, và mọi khoá ngoại',
              'Every column, because Prisma optimises for read performance by default|||Mọi cột, vì Prisma mặc định tối ưu cho hiệu năng đọc',
              'Only the primary key — even unique constraints need an explicit @@index|||Chỉ khoá chính — ngay cả ràng buộc unique cũng cần @@index tường minh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does the default `DateTime` mapping (TIMESTAMP, no time zone) cause trouble?|||Vì sao ánh xạ mặc định của `DateTime` (TIMESTAMP, không múi giờ) gây rắc rối?',
            options: [
              'It stores a wall-clock reading with no zone attached, so anything reading it outside Prisma — psql, a BI tool, a report — interprets it wrongly|||Nó lưu một con số đồng hồ treo tường không gắn múi giờ nào, nên bất cứ thứ gì đọc nó ngoài Prisma — psql, công cụ BI, một báo cáo — đều diễn giải sai',
              'It loses millisecond precision, so timestamps within the same second collide|||Nó mất độ chính xác mili giây, nên các mốc trong cùng một giây đụng nhau',
              'It cannot be indexed, so ORDER BY created_at is always a sequential scan|||Nó không đánh chỉ mục được, nên ORDER BY created_at luôn là quét tuần tự',
              'It is rejected by PostgreSQL 16 and must be migrated to Timestamptz|||PostgreSQL 16 từ chối nó và bắt buộc phải chuyển sang Timestamptz',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to rename an enum value that production rows still use. What is the safe sequence?|||Bạn muốn đổi tên một giá trị enum mà các hàng trên production vẫn đang dùng. Chuỗi thao tác an toàn là gì?',
            options: [
              'Add the new value and ship; backfill every row and every code path; remove the old value in a second migration|||Thêm giá trị mới rồi đưa lên chạy; đổi hết mọi hàng và mọi nhánh mã; bỏ giá trị cũ ở một migration thứ hai',
              'Rename it in the schema and run migrate deploy — Prisma casts the existing rows automatically|||Đổi tên trong lược đồ rồi chạy migrate deploy — Prisma tự ép kiểu các hàng đang có',
              'Run `db push` with the new name, which rewrites the enum in place without touching data|||Chạy `db push` với tên mới, nó viết lại enum tại chỗ mà không đụng dữ liệu',
              'Delete the enum and recreate it — PostgreSQL preserves column values across a DROP TYPE|||Xoá enum rồi tạo lại — PostgreSQL giữ nguyên giá trị cột qua một lần DROP TYPE',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What happens if an `Unsupported("vector(1536)")` field is declared required?|||Chuyện gì xảy ra nếu một trường `Unsupported("vector(1536)")` được khai là bắt buộc?',
            options: [
              'Prisma Client cannot supply it, so create() on that model becomes impossible — inserts must go through raw SQL|||Prisma Client không cung cấp được nó, nên create() trên model đó thành bất khả — các lần chèn phải đi bằng SQL thô',
              'Prisma generates a Buffer field for it and it behaves like Bytes|||Prisma sinh ra một trường Buffer cho nó và nó hành xử như Bytes',
              'The schema fails validation — Unsupported fields may not be required|||Lược đồ không qua kiểm — trường Unsupported không được phép bắt buộc',
              'Nothing — Prisma fills it with a zero vector on insert|||Không sao — Prisma điền vào một vector toàn số không khi chèn',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
