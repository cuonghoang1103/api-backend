/**
 * TypeScript · Chương 16 · 16.1 — Make illegal states unrepresentable. Slug giữ: typescript-16-1-illegal-states.
 * BÀI MỞ CHƯƠNG 16 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-16-1.mjs (demo16/ts-16-1, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-16-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-16-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">type-driven design</span><span class="v">Shape types so a wrong value cannot exist.</span></div>
  <div class="kv"><span class="k">branded type</span><span class="v">A validated string — a plain one is TS2345.</span></div>
  <div class="kv"><span class="k">one door in</span><span class="v">Only the validator produces a <code>LabCode</code>.</span></div>
  <div class="kv"><span class="k">discriminated union</span><span class="v">One state at a time — a wrong field is TS2339.</span></div>
  <div class="kv"><span class="k">no check needed</span><span class="v">If it cannot be built, you never guard against it.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">tư duy type-driven</span><span class="v">Nắn kiểu để một giá trị sai không tồn tại.</span></div>
  <div class="kv"><span class="k">branded type</span><span class="v">Một string đã validate — một cái thường là TS2345.</span></div>
  <div class="kv"><span class="k">một cửa vào</span><span class="v">Chỉ validator sinh ra một <code>LabCode</code>.</span></div>
  <div class="kv"><span class="k">discriminated union</span><span class="v">Một trạng thái mỗi lần — một trường sai là TS2339.</span></div>
  <div class="kv"><span class="k">không cần kiểm</span><span class="v">Nếu không dựng được, bạn không bao giờ phải gác.</span></div>
</div>`;

export default {
  title: '16.1 — Make illegal states unrepresentable|||16.1 — Làm trạng thái sai không biểu diễn được',
  slug: 'typescript-16-1-illegal-states',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 16: tư duy type-driven. Lỗi tốt nhất là lỗi hệ kiểu không cho viết. Branded type (string & { __brand }) là một string đã validate — truyền một string thường là TS2345, vì validator là cánh cửa duy nhất vào. Discriminated union mã hoá "một trạng thái mỗi lần" — đọc một trường của nhánh khác là TS2339. Nếu trạng thái sai không dựng được, bạn không bao giờ phải kiểm nó. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Make illegal states unrepresentable</h2>
<p class="lead">The best bug is one the type system will not let you write. Type-driven design shapes your types so a wrong value cannot exist in the first place — a lab code that was never validated, a slot that is both free and booked. If the illegal state cannot be constructed, you never have to check for it.</p>

<h3>After Chapter 16 you can…</h3>
<ul>
<li>Make illegal states unrepresentable with branded types and unions (this lesson).</li>
<li>Use <code>any</code>, <code>unknown</code> and <code>never</code> where each belongs (16.2).</li>
<li>Organize types — <code>type</code> vs <code>interface</code>, where they live (16.3).</li>
<li>See the whole type-driven picture (16.4), then assemble the Final Project (16.6).</li>
</ul>

<h3>A branded type: not just any string</h3>
<p>A <code>LabCode</code> is a string the compiler tracks apart; only the validator produces one:</p>
${ma('ts', CODE.brand)}
${ra(OUT['11-brand'])}
<p>The validator is the single door in — a function taking a <code>LabCode</code> can only be given one that passed it.</p>

<h3>A plain string is refused</h3>
<p>Pass a raw string where a <code>LabCode</code> is expected:</p>
${ma('ts', CODE.wrongbrand)}
${ra(OUT['12-wrongbrand'])}
<p><strong>TS2345</strong> — a plain string is not a branded one, because it never went through the validator. The brand turns “remember to validate this” into a rule the compiler enforces at every call.</p>

<h3>A discriminated union: one state at a time</h3>
<p>A slot is free <em>or</em> booked-by-someone — never both. Read <code>by</code> without narrowing:</p>
${ma('ts', CODE.illegalstate)}
${ra(OUT['13-illegalstate'])}
<p><strong>TS2339</strong> — the free case has no <code>by</code>. There is no way to build a slot that is free and also has a <code>by</code>; the illegal state is unrepresentable.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A function is called with a plain string where a <code>LabCode</code> is expected:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Pass it through the validator and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Type-driven design shapes types so a wrong value cannot exist — then you never check for it.</li>
<li>A branded type is a validated string — a plain one is TS2345, because only the validator produces it.</li>
<li>A discriminated union encodes “one state at a time” — a wrong field is TS2339.</li>
<li>Every chapter built toward this: unions, generics, DTOs, Zod at the boundary.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Narrowing & discriminated unions', 'The union pattern behind legal-only states. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'Making Impossible States Impossible', 'The type-driven design idea, applied. Read 4 Nov 2026.', 'https://www.typescriptlang.org/play')}
${lienKet({ khoa: 'typescript', bai: 'typescript-5-4-exhaustiveness', title: 'The union, enforced — TypeScript 5.4: Exhaustiveness', sub: 'Same: a discriminated union so only legal states exist. Different: there you make a switch prove it handled every case with <code>never</code>; here the same union makes an illegal combination — a free slot with a booker — unrepresentable, and a branded type does the same for a validated string.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Làm trạng thái sai không biểu diễn được</h2>
<p class="lead">Lỗi tốt nhất là lỗi hệ kiểu không cho bạn viết. Tư duy type-driven nắn các kiểu để một giá trị sai ngay từ đầu không tồn tại được — một mã lab chưa từng được validate, một slot vừa trống vừa đã đặt. Nếu trạng thái sai không dựng được, bạn không bao giờ phải kiểm nó.</p>

<h3>Sau Chương 16 bạn có thể…</h3>
<ul>
<li>Làm trạng thái sai không biểu diễn được bằng branded type và union (bài này).</li>
<li>Dùng <code>any</code>, <code>unknown</code> và <code>never</code> đúng chỗ mỗi cái (16.2).</li>
<li>Tổ chức kiểu — <code>type</code> so với <code>interface</code>, chúng sống ở đâu (16.3).</li>
<li>Thấy bức tranh type-driven toàn cảnh (16.4), rồi lắp Dự án cuối khoá (16.6).</li>
</ul>

<h3>Một branded type: không chỉ là string bất kỳ</h3>
<p>Một <code>LabCode</code> là một string trình biên dịch theo dõi riêng; chỉ validator sinh ra một cái:</p>
${ma('ts', CODE.brand)}
${ra(OUT['11-brand'])}
<p>Validator là cánh cửa duy nhất vào — một hàm nhận một <code>LabCode</code> chỉ được đưa một cái đã qua nó.</p>

<h3>Một string thường bị từ chối</h3>
<p>Truyền một string thô nơi chờ một <code>LabCode</code>:</p>
${ma('ts', CODE.wrongbrand)}
${ra(OUT['12-wrongbrand'])}
<p><strong>TS2345</strong> — một string thường không phải một cái có nhãn, vì nó chưa từng qua validator. Nhãn biến “nhớ validate cái này” thành một luật trình biên dịch ép ở mọi lời gọi.</p>

<h3>Một discriminated union: một trạng thái mỗi lần</h3>
<p>Một slot trống <em>hoặc</em> đã-đặt-bởi-ai — không bao giờ cả hai. Đọc <code>by</code> mà không thu hẹp:</p>
${ma('ts', CODE.illegalstate)}
${ra(OUT['13-illegalstate'])}
<p><strong>TS2339</strong> — trường hợp trống không có <code>by</code>. Không có cách nào dựng một slot vừa trống vừa có <code>by</code>; trạng thái sai không biểu diễn được.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một hàm được gọi với một string thường nơi chờ một <code>LabCode</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Truyền nó qua validator và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tư duy type-driven nắn kiểu để một giá trị sai không tồn tại — rồi bạn không bao giờ kiểm nó.</li>
<li>Một branded type là một string đã validate — một cái thường là TS2345, vì chỉ validator sinh ra nó.</li>
<li>Một discriminated union mã hoá “một trạng thái mỗi lần” — một trường sai là TS2339.</li>
<li>Mọi chương đã hướng tới điều này: union, generic, DTO, Zod ở biên.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Narrowing & discriminated unions', 'Mẫu union đằng sau chỉ-trạng-thái-hợp-lệ. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'Making Impossible States Impossible', 'Ý tưởng type-driven design, áp dụng. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/play')}
${lienKet({ khoa: 'typescript', bai: 'typescript-5-4-exhaustiveness', title: 'Union, được ép — TypeScript 5.4: Vét cạn', sub: 'Giống: một discriminated union để chỉ trạng thái hợp lệ tồn tại. Khác: ở đó bạn làm một switch chứng minh nó xử lý mọi case bằng <code>never</code>; ở đây cùng union làm một tổ hợp sai — một slot trống có người đặt — không biểu diễn được, và một branded type làm điều tương tự cho một string đã validate.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
