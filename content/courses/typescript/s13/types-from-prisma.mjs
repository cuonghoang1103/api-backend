/**
 * TypeScript · Chương 13 · 13.4 — Types from Prisma. Slug giữ: typescript-13-4-types-from-prisma.
 * Code/output từ ./_ma-ts-13-4.mjs (demo13/ts-13-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Mô hình prisma.ts tự-chứa (kiểu sinh).
 */
import G from '../giang/ts-13-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-13-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">generated types</span><span class="v"><code>prisma generate</code> writes a type per model from your schema.</span></div>
  <div class="kv"><span class="k"><code>CreateInput</code></span><span class="v">The model minus server fields — passing <code>id</code> is TS2353.</span></div>
  <div class="kv"><span class="k">honest queries</span><span class="v"><code>findUnique</code> is <code>T | null</code> — reading unchecked is TS18047.</span></div>
  <div class="kv"><span class="k">derived, like Zod</span><span class="v">Change the schema, regenerate, and the types follow.</span></div>
  <div class="kv"><span class="k">no <code>as</code></span><span class="v">The database boundary gets a real type, not a cast.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">kiểu sinh</span><span class="v"><code>prisma generate</code> viết một kiểu cho mỗi model từ schema.</span></div>
  <div class="kv"><span class="k"><code>CreateInput</code></span><span class="v">Model trừ trường server — truyền <code>id</code> là TS2353.</span></div>
  <div class="kv"><span class="k">truy vấn trung thực</span><span class="v"><code>findUnique</code> là <code>T | null</code> — đọc chưa kiểm là TS18047.</span></div>
  <div class="kv"><span class="k">suy ra, như Zod</span><span class="v">Đổi schema, sinh lại, và kiểu đi theo.</span></div>
  <div class="kv"><span class="k">không <code>as</code></span><span class="v">Biên CSDL nhận một kiểu thật, không phải một phép ép.</span></div>
</div>`;

export default {
  title: '13.4 — Types from Prisma|||13.4 — Kiểu từ Prisma',
  slug: 'typescript-13-4-types-from-prisma',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Zod sở hữu dáng dữ liệu vào; Prisma sở hữu dáng dữ liệu trong CSDL. prisma generate sinh một client có kiểu: một kiểu cho mỗi model (Booking), một BookingCreateInput (model trừ trường server như id/createdAt — truyền id là TS2353), và truy vấn trả đúng chúng (findUnique là Booking | null, đọc chưa kiểm là TS18047). Như z.Infer của Zod, kiểu được suy từ schema — đổi schema Prisma, sinh lại, kiểu theo. Dùng mô hình prisma.ts tự-chứa (không cài Prisma), đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Types from Prisma</h2>
<p class="lead">Zod owns the shape of data coming in; Prisma owns the shape of data in the database. <code>prisma generate</code> writes a typed client from your schema: a type for each model, a separate type for what you may create, and queries that return exactly those. The database boundary gets the same guarantee as the request boundary — no <code>as</code>, no guessing.</p>

<h3>The model: a tiny generated client</h3>
<p>This is the shape <code>prisma generate</code> writes for a <code>Booking</code> model:</p>
${ma('ts', CODE.prismaModel)}

<h3>The create input is the model minus server fields</h3>
<p>A repository takes <code>BookingCreateInput</code> and returns <code>Booking</code>:</p>
${ma('ts', CODE.create)}
<p>Both ends are checked against the generated types — this compiles clean (exit 0). <code>BookingCreateInput</code> is what the client proposes; <code>Booking</code> is what the row becomes.</p>

<h3>You cannot create a server-owned field</h3>
<p>Pass <code>id</code> into <code>create</code>:</p>
${ma('ts', CODE.wrongcreate)}
${ra(OUT['12-wrongcreate'])}
<p><strong>TS2353</strong> — <code>BookingCreateInput</code> has no <code>id</code>, because the database assigns it. The boundary between “what you send” and “what the row becomes” is a type, not a convention.</p>

<h3>A query that may miss returns T | null</h3>
<p><code>findUnique</code> may not find a row:</p>
${ma('ts', CODE.nullrow)}
${ra(OUT['13-nullrow'])}
<p><strong>TS18047</strong> — the generated type is honest about a miss. The same <code>T | null</code> discipline as a Chapter 11 service return, now coming from the database layer for free.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A function reads <code>row.seats</code> when <code>findUnique</code> is <code>Booking | null</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Narrow with <code>row === null ? 0 : row.seats</code> and it compiles (exit 0):</p>
${ma('ts', CODE.prSol)}

<h3>📌 Summary</h3>
<ul>
<li>Prisma generates a type per model and a <code>CreateInput</code> without server fields — passing <code>id</code> is TS2353.</li>
<li>Queries are typed to reality: <code>findUnique</code> is <code>T | null</code>, so reading unchecked is TS18047.</li>
<li>Like Zod’s <code>Infer</code>, the types are derived — change the schema, regenerate, they follow.</li>
<li>The database boundary gets a real type, closing the <code>as</code> gap on the server side too.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'Prisma — Generated types', 'The model, CreateInput and query result types. Read 4 Nov 2026.', 'https://www.prisma.io/docs/orm/prisma-client/type-safety')}
${nguon('📘', 'Prisma — findUnique', 'Why a lookup returns T | null. Read 4 Nov 2026.', 'https://www.prisma.io/docs/orm/reference/prisma-client-reference#findunique')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-2-1-model-va-kieu', title: 'Where these types come from — Prisma ORM 2.1: A model and its type', sub: 'Same: a Prisma model generates a TypeScript type you use without writing it. Different: there you define the model in the schema and see the generated type and its CreateInput; here those types are used at the boundary — passing a server-owned <code>id</code> is TS2353 and a <code>findUnique</code> that may miss is <code>T | null</code> (TS18047).', cta: 'OPEN PRISMA LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Kiểu từ Prisma</h2>
<p class="lead">Zod sở hữu dáng dữ liệu đi vào; Prisma sở hữu dáng dữ liệu trong CSDL. <code>prisma generate</code> viết một client có kiểu từ schema của bạn: một kiểu cho mỗi model, một kiểu riêng cho thứ bạn được tạo, và các truy vấn trả về đúng chúng. Biên CSDL nhận cùng bảo đảm như biên request — không <code>as</code>, không đoán.</p>

<h3>Mô hình: một client sinh nhỏ</h3>
<p>Đây là dáng <code>prisma generate</code> viết cho một model <code>Booking</code>:</p>
${ma('ts', CODE.prismaModel)}

<h3>Create input là model trừ trường server</h3>
<p>Một repository nhận <code>BookingCreateInput</code> và trả <code>Booking</code>:</p>
${ma('ts', CODE.create)}
<p>Cả hai đầu được kiểm với kiểu sinh — cái này biên dịch sạch (exit 0). <code>BookingCreateInput</code> là thứ client đề xuất; <code>Booking</code> là thứ hàng trở thành.</p>

<h3>Bạn không tạo được một trường của server</h3>
<p>Truyền <code>id</code> vào <code>create</code>:</p>
${ma('ts', CODE.wrongcreate)}
${ra(OUT['12-wrongcreate'])}
<p><strong>TS2353</strong> — <code>BookingCreateInput</code> không có <code>id</code>, vì CSDL gán nó. Ranh giới giữa “thứ bạn gửi” và “thứ hàng trở thành” là một kiểu, không phải một quy ước.</p>

<h3>Một truy vấn có thể trượt trả T | null</h3>
<p><code>findUnique</code> có thể không tìm thấy một hàng:</p>
${ma('ts', CODE.nullrow)}
${ra(OUT['13-nullrow'])}
<p><strong>TS18047</strong> — kiểu sinh trung thực về một cú trượt. Cùng kỷ luật <code>T | null</code> như một service trả về ở Chương 11, giờ đến từ tầng CSDL miễn phí.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một hàm đọc <code>row.seats</code> khi <code>findUnique</code> là <code>Booking | null</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Thu hẹp bằng <code>row === null ? 0 : row.seats</code> và nó biên dịch (exit 0):</p>
${ma('ts', CODE.prSol)}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Prisma sinh một kiểu cho mỗi model và một <code>CreateInput</code> không có trường server — truyền <code>id</code> là TS2353.</li>
<li>Truy vấn gõ kiểu theo thực tế: <code>findUnique</code> là <code>T | null</code>, nên đọc chưa kiểm là TS18047.</li>
<li>Như <code>Infer</code> của Zod, kiểu được suy ra — đổi schema, sinh lại, chúng theo.</li>
<li>Biên CSDL nhận một kiểu thật, đóng lỗ hổng <code>as</code> ở phía máy chủ nữa.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'Prisma — Generated types', 'Kiểu model, CreateInput và kết quả truy vấn. Đọc ngày 4/11/2026.', 'https://www.prisma.io/docs/orm/prisma-client/type-safety')}
${nguon('📘', 'Prisma — findUnique', 'Vì sao một lookup trả T | null. Đọc ngày 4/11/2026.', 'https://www.prisma.io/docs/orm/reference/prisma-client-reference#findunique')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-2-1-model-va-kieu', title: 'Các kiểu này đến từ đâu — Prisma ORM 2.1: Model và kiểu của nó', sub: 'Giống: một model Prisma sinh một kiểu TypeScript bạn dùng mà không viết. Khác: ở đó bạn định nghĩa model trong schema và thấy kiểu sinh cùng CreateInput của nó; ở đây các kiểu đó được dùng ở biên — truyền một <code>id</code> của server là TS2353 và một <code>findUnique</code> có thể trượt là <code>T | null</code> (TS18047).', cta: 'MỞ BÀI PRISMA →' })}
</div>
`,
};
