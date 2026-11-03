/**
 * TypeScript · Chương 13 · 13.3 — Schema as the single source of truth. Slug giữ: typescript-13-3-schema-source-of-truth.
 * Code/output từ ./_ma-ts-13-3.mjs (demo13/ts-13-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Mô hình zod.ts tự-chứa.
 */
import G from '../giang/ts-13-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-13-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">one source</span><span class="v">Define the schema once; derive the type from it.</span></div>
  <div class="kv"><span class="k"><code>z.Infer&lt;typeof s&gt;</code></span><span class="v">The type is computed from the schema — always in step.</span></div>
  <div class="kv"><span class="k">a copy drifts</span><span class="v">A hand-written duplicate disagreeing with the schema is TS2741.</span></div>
  <div class="kv"><span class="k">computed, not copied</span><span class="v">Infer, Prisma’s types, mapped types — all cannot drift.</span></div>
  <div class="kv"><span class="k">Chapter 9’s lesson</span><span class="v">The seed incident was a copied union drifting — same hole.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">một nguồn</span><span class="v">Định nghĩa schema một lần; suy kiểu từ nó.</span></div>
  <div class="kv"><span class="k"><code>z.Infer&lt;typeof s&gt;</code></span><span class="v">Kiểu được tính từ schema — luôn khớp nhịp.</span></div>
  <div class="kv"><span class="k">bản sao trôi</span><span class="v">Một bản chép tay bất đồng với schema là TS2741.</span></div>
  <div class="kv"><span class="k">được tính, không chép</span><span class="v">Infer, kiểu Prisma, mapped type — đều không trôi được.</span></div>
  <div class="kv"><span class="k">bài học Chương 9</span><span class="v">Sự cố seed là một union chép trôi — cùng lỗ hổng.</span></div>
</div>`;

export default {
  title: '13.3 — Schema as the single source of truth|||13.3 — Schema là nguồn sự thật duy nhất',
  slug: 'typescript-13-3-schema-source-of-truth',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một khi schema vừa validate vừa suy kiểu, đừng viết kiểu bằng tay nữa — suy nó từ schema (z.Infer<typeof schema>). Một bản chép tay là nguồn sự thật thứ hai, và hai nguồn thì trôi: schema thêm một trường, bản chép không theo, bug lọt qua khe. Một kiểu được TÍNH TỪ nguồn không thể trôi (TS2741 ở mối nối khi bất đồng); một kiểu CHÉP thì sẽ — cùng bài học với sự cố seed Chương 9. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Schema as the single source of truth</h2>
<p class="lead">Once a schema both validates and infers, you have a choice: write the type by hand as well, or derive it from the schema. Derive it. A hand-written copy is a second source of truth, and two sources drift — the schema gains a field, the type does not, and a bug slips through the gap. One definition, both jobs.</p>

<h3>Derive the type, do not copy it</h3>
<p>Define the schema, then compute the type from it with <code>z.Infer</code>:</p>
${ma('ts', CODE.infer)}
${ra(OUT['11-infer'])}
<p>The type is computed from the schema at compile time, so it is always exactly in step. Add a field to the schema and every function typed <code>BookingInput</code> updates for free.</p>

<h3>A hand-written copy drifts</h3>
<p>Write the type by hand with a <code>purpose</code> the schema never added, and assign the parsed value to it:</p>
${ma('ts', CODE.drift)}
${ra(OUT['12-drift'])}
<p><strong>TS2741</strong> — the parsed value (from the schema) has no <code>purpose</code>. The error is the drift made visible: the two definitions disagree, and the compiler catches it at the seam instead of a user hitting it later.</p>

<h3>Computed types cannot drift</h3>
<p>This is Chapter 9’s seed incident at the boundary: a hand-copied union drifting from the generated one. A type that is <em>computed from</em> a source of truth cannot drift; a type that <em>copies</em> one will. Zod’s <code>Infer</code>, Prisma’s generated types (13.4), and Chapter 7’s mapped types are all the computed kind — reach for them wherever a tool already owns the shape.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A hand-written type claims a <code>name</code> the schema never had:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Replace it with <code>z.Infer&lt;typeof UserInput&gt;</code> and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Define the schema once; derive the type with <code>z.Infer&lt;typeof schema&gt;</code> — one source of truth.</li>
<li>A hand-written duplicate that drifts from the schema is TS2741 at the seam.</li>
<li>A computed type cannot drift; a copied one will — prefer derived types everywhere a tool owns the shape.</li>
<li>It is Chapter 9’s seed drift, closed at the boundary.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'Zod — Type inference (z.infer)', 'Deriving the static type from a schema. Read 4 Nov 2026.', 'https://zod.dev/?id=type-inference')}
${nguon('📘', 'TypeScript Handbook — typeof type operator', 'How z.infer reads the schema value as a type. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/typeof-types.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-9-1-tsc-and-tsconfig', title: 'The same drift, in a seed — TypeScript 9.1: tsc & tsconfig', sub: 'Same: a type that copies a source of truth drifts from it and breaks at run time. Different: there a hand-copied enum union drifted from the generated one and broke the seed on production; here <code>z.Infer</code> computes the type from the schema, so a drifted hand-written copy is a compile error, not a run-time surprise.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Schema là nguồn sự thật duy nhất</h2>
<p class="lead">Một khi một schema vừa validate vừa suy kiểu, bạn có một lựa chọn: viết kiểu bằng tay nữa, hay suy nó từ schema. Hãy suy nó. Một bản chép tay là một nguồn sự thật thứ hai, và hai nguồn thì trôi — schema thêm một trường, kiểu thì không, và một bug lọt qua khe hở. Một định nghĩa, cả hai việc.</p>

<h3>Suy kiểu, đừng chép nó</h3>
<p>Định nghĩa schema, rồi tính kiểu từ nó bằng <code>z.Infer</code>:</p>
${ma('ts', CODE.infer)}
${ra(OUT['11-infer'])}
<p>Kiểu được tính từ schema lúc biên dịch, nên nó luôn khớp nhịp. Thêm một trường vào schema và mọi hàm kiểu <code>BookingInput</code> cập nhật miễn phí.</p>

<h3>Một bản chép tay trôi dạt</h3>
<p>Viết kiểu bằng tay với một <code>purpose</code> schema không bao giờ thêm, và gán giá trị đã parse cho nó:</p>
${ma('ts', CODE.drift)}
${ra(OUT['12-drift'])}
<p><strong>TS2741</strong> — giá trị đã parse (từ schema) không có <code>purpose</code>. Lỗi là sự trôi dạt được làm hiện ra: hai định nghĩa bất đồng, và trình biên dịch bắt nó ngay mối nối thay vì một người dùng gặp nó về sau.</p>

<h3>Kiểu được tính không thể trôi</h3>
<p>Đây là sự cố seed của Chương 9 ở biên: một union chép tay trôi khỏi bản sinh. Một kiểu được <em>tính từ</em> một nguồn sự thật không thể trôi; một kiểu <em>chép</em> một nguồn thì sẽ. <code>Infer</code> của Zod, kiểu sinh của Prisma (13.4), và mapped type của Chương 7 đều thuộc loại được-tính — hãy dùng chúng ở mọi nơi một công cụ đã sở hữu dáng.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một kiểu viết tay đòi một <code>name</code> mà schema không bao giờ có:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Thay nó bằng <code>z.Infer&lt;typeof UserInput&gt;</code> và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Định nghĩa schema một lần; suy kiểu bằng <code>z.Infer&lt;typeof schema&gt;</code> — một nguồn sự thật.</li>
<li>Một bản chép tay trôi khỏi schema là TS2741 ở mối nối.</li>
<li>Một kiểu được tính không thể trôi; một kiểu chép thì sẽ — ưu tiên kiểu suy ra ở mọi nơi một công cụ sở hữu dáng.</li>
<li>Nó là sự trôi seed của Chương 9, đóng lại ở biên.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'Zod — Type inference (z.infer)', 'Suy kiểu tĩnh từ một schema. Đọc ngày 4/11/2026.', 'https://zod.dev/?id=type-inference')}
${nguon('📘', 'TypeScript Handbook — typeof type operator', 'Cách z.infer đọc giá trị schema thành một kiểu. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/typeof-types.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-9-1-tsc-and-tsconfig', title: 'Cùng sự trôi, trong một seed — TypeScript 9.1: tsc & tsconfig', sub: 'Giống: một kiểu chép một nguồn sự thật trôi khỏi nó và vỡ lúc chạy. Khác: ở đó một union enum chép tay trôi khỏi bản sinh và vỡ seed trên production; ở đây <code>z.Infer</code> tính kiểu từ schema, nên một bản chép tay trôi là một lỗi biên dịch, không phải một bất ngờ lúc chạy.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
