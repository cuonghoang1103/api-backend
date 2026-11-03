/**
 * TypeScript · Chương 13 · 13.1 — The boundary problem & Zod. Slug giữ: typescript-13-1-boundary-zod.
 * BÀI MỞ CHƯƠNG 13 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-13-1.mjs (demo13/ts-13-1, Node 22.23.3 + tsc 7.0.2).
 * Mô hình Zod tự-chứa (zod.ts) — cùng dáng zod cho (z.object/string/number, parse/safeParse, Infer); KHÔNG cài zod, đo với @types/node.
 */
import G from '../giang/ts-13-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-13-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">the boundary</span><span class="v">External data is unknown at run time; <code>as T</code> is a promise, not a check.</span></div>
  <div class="kv"><span class="k">validate + infer</span><span class="v">A schema is a value (<code>z.object</code>) and a type (<code>z.Infer</code>) at once.</span></div>
  <div class="kv"><span class="k">exact shape</span><span class="v">The inferred type has only the schema’s fields — a typo is TS2339.</span></div>
  <div class="kv"><span class="k">run-time guard</span><span class="v">Invalid data makes <code>parse</code> throw — the check <code>as</code> skipped.</span></div>
  <div class="kv"><span class="k">the real thing</span><span class="v"><code>zod</code> adds email/min/optional/refine — same validate-and-infer shape.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">cái biên</span><span class="v">Dữ liệu ngoài là unknown lúc chạy; <code>as T</code> là một lời hứa, không phải phép kiểm.</span></div>
  <div class="kv"><span class="k">validate + suy kiểu</span><span class="v">Một schema vừa là giá trị (<code>z.object</code>) vừa là kiểu (<code>z.Infer</code>).</span></div>
  <div class="kv"><span class="k">dáng đúng</span><span class="v">Kiểu suy ra chỉ có các trường của schema — một lỗi gõ là TS2339.</span></div>
  <div class="kv"><span class="k">chốt chặn lúc chạy</span><span class="v">Dữ liệu không hợp lệ làm <code>parse</code> ném — phép kiểm <code>as</code> đã bỏ qua.</span></div>
  <div class="kv"><span class="k">cái thật</span><span class="v"><code>zod</code> thêm email/min/optional/refine — cùng dáng validate-và-suy-kiểu.</span></div>
</div>`;

export default {
  title: '13.1 — The boundary problem & Zod|||13.1 — Vấn đề tại biên & Zod',
  slug: 'typescript-13-1-boundary-zod',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 13: validate runtime. Kiểu bị xoá lúc chạy nên dữ liệu từ ngoài chưa được kiểm — as T là một lời hứa, không phải phép kiểm. Zod đóng lỗ hổng: một schema validate dữ liệu VÀ suy ra kiểu (z.object/string/number, .parse, z.Infer). Kiểu suy ra chỉ có các trường của schema ⇒ đọc trường không khai là TS2339; parse ném khi dữ liệu không hợp lệ (phép kiểm as bỏ qua). Dùng mô hình Zod tự-chứa (không cài zod), đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>The boundary problem &amp; Zod</h2>
<p class="lead">Types are erased at run time, so data coming from outside — a request body, a file, an API — is not checked by anything the compiler left behind. <code>as T</code> is a promise, not a check. Zod closes the gap: a schema validates the data <em>and</em> infers the type, so one definition is both the run-time guard and the compile-time shape. We use a small typed model of Zod, measured with tsc and Node.</p>

<h3>After Chapter 13 you can…</h3>
<ul>
<li>Validate external data with a Zod schema and infer its type (this lesson).</li>
<li>Choose <code>parse</code> (throws) or <code>safeParse</code> (a result you narrow) (13.2).</li>
<li>Make the schema the single source of truth — derive the type, never copy it (13.3).</li>
<li>Use Prisma’s generated types at the database boundary (13.4), then write a validating handler (Lab 13).</li>
</ul>

<h3>The model: a tiny Zod</h3>
<p>This is the shape <code>zod</code> gives you, written small so it runs here:</p>
${ma('ts', CODE.zodModel)}

<h3>A schema validates and infers</h3>
<p>Build a schema, read its inferred type, and parse <code>unknown</code> data at the boundary:</p>
${ma('ts', CODE.parse)}
${ra(OUT['11-parse'])}
<p>The value you hold after <code>parse</code> is checked both ways: the run-time data matched the schema, and its static type <em>is</em> the schema.</p>

<h3>The inferred type has exactly the schema</h3>
<p>Read a field the schema never declared — <code>booking.purpose</code>:</p>
${ma('ts', CODE.wrongfield)}
${ra(OUT['12-wrongfield'])}
<p><strong>TS2339</strong>. The inferred type is not a loose <code>any</code>; it is precisely what the schema allows, so a typo is caught just as it would be for a hand-written type.</p>

<h3>Invalid data is rejected at run time</h3>
<p>Static types cannot stop bad data that only exists at run time. Parse a body whose <code>seats</code> is a string:</p>
${ma('ts', CODE.badinput)}
${ra(OUT['13-badinput'])}
<p>The schema throws — the validation the <code>as</code> cast would have skipped. The boundary is where a type and a run-time check must agree, and a schema makes them the same object.</p>

<h3>Zod, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A schema has <code>code</code>, but the code reads <code>lab.name</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Read <code>lab.code</code> instead and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Types are erased at run time — external data is <code>unknown</code>, and <code>as T</code> does not check it.</li>
<li>A Zod schema validates <em>and</em> infers: one value (<code>z.object</code>) is also one type (<code>z.Infer</code>).</li>
<li>The inferred type has exactly the schema’s fields — a typo is TS2339.</li>
<li>Invalid run-time data is rejected by <code>parse</code>, closing the gap <code>as</code> left open.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'Zod — Basic usage', 'Schemas, parse and type inference. Read 4 Nov 2026.', 'https://zod.dev/')}
${nguon('📘', 'TypeScript Handbook — Type assertions', 'Why `as T` is a promise, not a check. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions')}
${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'The same boundary, over HTTP — API Design 2.2: Validating input', sub: 'Same: data from outside is untrusted and must be validated before use. Different: there validation is an API concern with 400 responses and error bodies; here a Zod schema is both the run-time check and the TypeScript type, so reading an undeclared field is TS2339 and bad data throws — one definition for both.', cta: 'OPEN API DESIGN LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Vấn đề tại biên &amp; Zod</h2>
<p class="lead">Kiểu bị xoá lúc chạy, nên dữ liệu từ ngoài — một body request, một tệp, một API — không được thứ gì mà trình biên dịch để lại kiểm. <code>as T</code> là một lời hứa, không phải một phép kiểm. Zod đóng lỗ hổng: một schema validate dữ liệu <em>và</em> suy ra kiểu, nên một định nghĩa vừa là chốt chặn lúc chạy vừa là dáng lúc biên dịch. Ta dùng một mô hình kiểu nhỏ của Zod, đo bằng tsc và Node.</p>

<h3>Sau Chương 13 bạn có thể…</h3>
<ul>
<li>Validate dữ liệu ngoài bằng một schema Zod và suy kiểu của nó (bài này).</li>
<li>Chọn <code>parse</code> (ném) hay <code>safeParse</code> (một kết quả bạn thu hẹp) (13.2).</li>
<li>Làm schema thành nguồn sự thật duy nhất — suy kiểu, đừng chép nó (13.3).</li>
<li>Dùng kiểu sinh của Prisma ở biên CSDL (13.4), rồi viết một handler có validate (Lab 13).</li>
</ul>

<h3>Mô hình: một Zod nhỏ</h3>
<p>Đây là dáng <code>zod</code> cho bạn, viết nhỏ để nó chạy ở đây:</p>
${ma('ts', CODE.zodModel)}

<h3>Một schema validate và suy kiểu</h3>
<p>Dựng một schema, đọc kiểu suy ra của nó, và parse dữ liệu <code>unknown</code> ở biên:</p>
${ma('ts', CODE.parse)}
${ra(OUT['11-parse'])}
<p>Giá trị bạn giữ sau <code>parse</code> được kiểm cả hai phía: dữ liệu lúc chạy đã khớp schema, và kiểu tĩnh của nó <em>chính là</em> schema.</p>

<h3>Kiểu suy ra có đúng schema</h3>
<p>Đọc một trường schema không khai — <code>booking.purpose</code>:</p>
${ma('ts', CODE.wrongfield)}
${ra(OUT['12-wrongfield'])}
<p><strong>TS2339</strong>. Kiểu suy ra không phải một <code>any</code> lỏng; nó chính xác là thứ schema cho phép, nên một lỗi gõ bị bắt y như với một kiểu viết tay.</p>

<h3>Dữ liệu không hợp lệ bị từ chối lúc chạy</h3>
<p>Kiểu tĩnh không chặn được dữ liệu xấu chỉ tồn tại lúc chạy. Parse một body có <code>seats</code> là một string:</p>
${ma('ts', CODE.badinput)}
${ra(OUT['13-badinput'])}
<p>Schema ném — phép validate mà <code>as</code> sẽ bỏ qua. Biên là nơi một kiểu và một phép kiểm lúc chạy phải nhất trí, và một schema làm chúng thành cùng một đối tượng.</p>

<h3>Zod, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một schema có <code>code</code>, nhưng code đọc <code>lab.name</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Đọc <code>lab.code</code> thay vào đó và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểu bị xoá lúc chạy — dữ liệu ngoài là <code>unknown</code>, và <code>as T</code> không kiểm nó.</li>
<li>Một schema Zod validate <em>và</em> suy kiểu: một giá trị (<code>z.object</code>) cũng là một kiểu (<code>z.Infer</code>).</li>
<li>Kiểu suy ra có đúng các trường của schema — một lỗi gõ là TS2339.</li>
<li>Dữ liệu xấu lúc chạy bị <code>parse</code> từ chối, đóng lỗ hổng <code>as</code> để ngỏ.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'Zod — Basic usage', 'Schema, parse và suy kiểu. Đọc ngày 4/11/2026.', 'https://zod.dev/')}
${nguon('📘', 'TypeScript Handbook — Type assertions', 'Vì sao `as T` là một lời hứa, không phải phép kiểm. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions')}
${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'Cùng cái biên, qua HTTP — API Design 2.2: Validate đầu vào', sub: 'Giống: dữ liệu từ ngoài không đáng tin và phải được validate trước khi dùng. Khác: ở đó validate là mối lo của API với response 400 và body lỗi; ở đây một schema Zod vừa là phép kiểm lúc chạy vừa là kiểu TypeScript, nên đọc một trường không khai là TS2339 và dữ liệu xấu ném — một định nghĩa cho cả hai.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
