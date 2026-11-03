/**
 * TypeScript · Chương 5 · 5.3 — Discriminated union (union có nhãn) + type predicate. Slug giữ: typescript-5-3-discriminated-union.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-05-3.mjs (demo5/ts-05-3, Node 22.23.3 + tsc 7.0.2).
 * Dựng BookingState trên BookingRecord của Ch4 — chính là lời giải Lab 5 (src/rules/state.ts).
 */
import G from '../giang/ts-05-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-05-3.mjs';

const BANG_EN = `<table>
<thead><tr><th>Ingredient</th><th>Rule</th><th>In BookingState</th></tr></thead>
<tbody>
<tr><td>the discriminant</td><td>one field on every member, a different literal each</td><td><code>step: 'draft' | 'invalid' | 'pending' | …</code></td></tr>
<tr><td>per-member data</td><td>each member carries only the fields that step has</td><td><code>invalid</code> has <code>code</code>; <code>cancelled</code> has <code>reason</code></td></tr>
<tr><td>narrowing</td><td>test the discriminant (<code>===</code> / <code>switch</code>)</td><td><code>case 'pending': state.record</code> is there</td></tr>
<tr><td>type predicate</td><td><code>x is T</code> return — a named narrowing function</td><td><code>isActive(s): s is ActiveState</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Thành phần</th><th>Luật</th><th>Trong BookingState</th></tr></thead>
<tbody>
<tr><td>discriminant (nhãn)</td><td>một trường trên mọi thành viên, mỗi cái một literal khác</td><td><code>step: 'draft' | 'invalid' | 'pending' | …</code></td></tr>
<tr><td>dữ liệu theo thành viên</td><td>mỗi thành viên chỉ mang trường mà bước đó có</td><td><code>invalid</code> có <code>code</code>; <code>cancelled</code> có <code>reason</code></td></tr>
<tr><td>thu hẹp</td><td>thử nhãn (<code>===</code> / <code>switch</code>)</td><td><code>case 'pending': state.record</code> có mặt</td></tr>
<tr><td>type predicate</td><td>kiểu trả về <code>x is T</code> — hàm thu hẹp có tên</td><td><code>isActive(s): s is ActiveState</code></td></tr>
</tbody>
</table>`;

export default {
  title: '5.3 — Discriminated unions & type predicates|||5.3 — Discriminated union (union có nhãn) & type predicate',
  slug: 'typescript-5-3-discriminated-union',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Union có nhãn: một trường chung (step) với literal khác nhau mỗi thành viên, mỗi thành viên chỉ mang dữ liệu bước đó có — dựng BookingState trên BookingRecord của Ch4 (draft/invalid/pending/confirmed/cancelled). Một switch trên state.step thu hẹp cả object (record ở đây, reason chỉ ở cancelled); chạm trường của thành viên khác mà chưa narrow là TS2339. Type predicate (state is ActiveState) đặt tên cho một phép thu hẹp — và một predicate NÓI DỐI biên dịch sạch nhưng sập lúc chạy (TypeError). filter với helper boolean KHÔNG thu hẹp mảng (TS2322); arrow đơn giản thì tsc tự suy ra predicate (5.5+). Đây là lời giải Lab 5. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Discriminated unions &amp; type predicates</h2>
<p class="lead">A booking is not a flag. It is <em>drafting</em>, then either <em>invalid</em> (with a reason) or <em>pending</em> / <em>confirmed</em> (with a stored record), and maybe <em>cancelled</em> (with a record and a reason). A <strong>discriminated union</strong> (union có nhãn) models exactly that: one shared field whose literal says which case you are in, and per-case data that only exists where it makes sense. This lesson builds LabFlow’s <code>BookingState</code> on the <code>BookingRecord</code> of Chapter 4 — the file you will complete in Lab 5 — and adds <strong>type predicates</strong>, named narrowing you can reuse.</p>

<h3>The pattern: one shared tag, per-member data</h3>
${ma('typescript', CODE.labelState)}
${ra(OUT['11-label'])}
<p>Every member has a <code>step</code> field with a <em>different</em> literal — <code>'draft'</code>, <code>'invalid'</code>, <code>'pending'</code>, and so on. That field is the <strong>discriminant</strong>. A <code>switch (state.step)</code> narrows the whole object per case: in <code>case 'invalid'</code> the object has <code>code</code>; in <code>case 'pending'</code> it has <code>record</code>; in <code>case 'cancelled'</code> it has both <code>record</code> and <code>reason</code>. You write no casts and no <code>?.</code> — the tag does the work. The per-member data is the point: a <code>draft</code> cannot carry a <code>record</code>, because there is no booking yet.</p>

<h3>Why the tag matters: no tag, no narrowing</h3>
<p>Touch a field that lives on only some members, without testing the tag first:</p>
${ma('typescript', CODE.nonarrowBad)}
${ra(OUT['12-nonarrow'])}
<p><strong>TS2339</strong>, and the message names the member that has no <code>record</code>: <code>{ step: "draft" }</code>. The union is honest — <code>record</code> is not on every member, so you may not read it until you have narrowed to a member that has it. That is the whole safety of the pattern: the shape of a <code>draft</code> cannot be used as if it were a <code>pending</code>.</p>

<h3>Type predicates: naming a narrowing</h3>
<p>You will ask “is this booking still live?” in many places. A plain <code>boolean</code> function would answer — but it would not <em>narrow</em>. A <strong>type predicate</strong> (vị từ kiểu) does, by returning <code>argument is Type</code>:</p>
${ma('typescript', CODE.predicateActive)}
${ra(OUT['13-predicate'])}
<p><code>isActive(state): state is ActiveState</code> tells tsc: a <code>true</code> result means the argument is an <code>ActiveState</code>. So inside <code>if (isActive(s))</code>, <code>s</code> is narrowed to <code>ActiveState</code> and <code>s.record.id</code> is available — exactly as if you had tested <code>s.step</code> inline, but with a reusable name.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a type predicate is a promise tsc never checks.</strong> The <code>is</code> return says what a <code>true</code> result <em>means</em>; tsc trusts it and does not verify the body. Get the condition wrong and it compiles, then crashes at runtime:</p>
${ma('typescript', CODE.lie)}
${ra(OUT['14-lie-tsc'])}
${ra(OUT['15-lie-run'])}
<p>tsc reports <strong>0 errors</strong> — it believes the <code>is</code> return. At runtime <code>isCancelled</code> returns <code>true</code> for a <em>pending</em> booking (the condition is wrong), so <code>s.reason</code> is <code>undefined</code> and <code>.toUpperCase()</code> throws. A predicate is as trustworthy as its body: keep it a single, obvious check, and test it. This is the same bargain as <code>as</code> in 1.2 — you are telling tsc something it takes on faith.</p>
</div>

<h3>Predicates and <code>Array.filter</code></h3>
${ma('typescript', CODE.filterLive)}
${ra(OUT['16-filter'])}
<p>Because <code>isActive</code> is a predicate, <code>states.filter(isActive)</code> is typed <code>ActiveState[]</code> — tsc narrows the whole array, so <code>.map(s =&gt; s.record.id)</code> needs no guard. Contrast a named helper that returns a plain <code>boolean</code>:</p>
${ma('typescript', CODE.filterNamed)}
${ra(OUT['17-filter-named'])}
<p>A named <code>boolean</code> function does <strong>not</strong> narrow: <code>filter(liveFlag)</code> is still <code>BookingState[]</code>, so assigning it to <code>Active[]</code> is TS2322. The same condition written inline — <code>filter(s =&gt; s.step === 'confirmed')</code> — <em>does</em> narrow, because since TypeScript 5.5 tsc <strong>infers a type predicate</strong> for a simple arrow guard. Rule of thumb: an inline guard narrows automatically; a reusable named one must declare <code>s is T</code>.</p>

<h3>Anatomy of a discriminated union</h3>
${BANG_EN}
<p><strong>Coming from Java (PRO192):</strong> this is TypeScript’s version of a sealed hierarchy — a sealed interface with a record per case, matched by a <code>switch</code> pattern. The difference is that the union is <em>structural</em> (4.1): the compiler narrows by the literal value of a field, with no shared base class and nothing to instantiate.</p>

<h3>💼 Interview corner</h3>
<p><strong>“What is a discriminated union?”</strong> A union of object types that share one literal-typed field (the discriminant); testing that field narrows to a single member, with its own fields. <strong>“What is a type predicate?”</strong> A function returning <code>x is T</code> that narrows its argument at the call site; tsc trusts the <code>is</code> and does not check the body — so a wrong one compiles and misbehaves. <strong>“Why prefer a discriminated union over optional fields?”</strong> Optional fields let impossible combinations exist (a draft with a record); the union makes each case carry exactly its data, and tsc enforces it.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-3/practice/start/record.ts</code> — return the booking record when a state has one. It does not compile:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['18-pr-start'])}
<ol>
<li>Which members have no <code>record</code>? Narrow with <code>'record' in state</code> so the function returns the record where there is one and <code>null</code> otherwise.</li>
<li>tsc must be clean.</li>
</ol>
<p><strong>Solution</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Done when:</strong> tsc is clean (no output). Code Lab adds: the full <code>BookingState</code> union and <code>describe</code>, a type predicate <code>isActive</code>, a lying predicate that must stay out, and the <code>filter</code> narrowing. You now have every piece of Lab 5’s <code>src/rules/state.ts</code> — except the exhaustiveness guard, which is 5.4.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">discriminated union</span><span class="v">A union of objects sharing one literal field (the discriminant / tag).</span></div>
  <div class="kv"><span class="k">discriminant</span><span class="v">The shared field whose literal picks the member: <code>step</code>, <code>ok</code>, <code>kind</code>.</span></div>
  <div class="kv"><span class="k">type predicate</span><span class="v">A function returning <code>x is T</code> — reusable narrowing; tsc trusts the <code>is</code>.</span></div>
  <div class="kv"><span class="k">inferred predicate</span><span class="v">Since TS 5.5, a simple arrow guard in <code>filter</code> narrows the array automatically.</span></div>
  <div class="kv"><span class="k">illegal state</span><span class="v">A combination the types forbid — a <code>draft</code> with a <code>record</code>: TS2339 / TS2353.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A discriminated union shares one literal field; a <code>switch</code> on it narrows the whole object per case, with per-member data.</li>
<li>Reading a member-only field without narrowing is TS2339 — the <code>draft</code> has no <code>record</code>.</li>
<li>A type predicate (<code>s is ActiveState</code>) names a narrowing; tsc trusts the <code>is</code> and never checks the body — a lying one compiles and crashes at runtime.</li>
<li><code>filter</code> with a predicate narrows the array; a named <code>boolean</code> helper does not (TS2322); an inline arrow guard is inferred as a predicate (TS 5.5+).</li>
<li>This is LabFlow’s <code>BookingState</code> — the data of Lab 5.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'The discriminant pattern and exhaustiveness. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'TypeScript Handbook — Using type predicates', 'Functions returning x is T and how they narrow. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates')}
${nguon('📘', 'TypeScript 5.5 — Inferred type predicates', 'Simple arrow guards in filter/find are inferred as predicates. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#inferred-type-predicates')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Discriminated union (union có nhãn) &amp; type predicate</h2>
<p class="lead">Một lượt đặt không phải một cờ. Nó đang <em>nháp</em>, rồi hoặc <em>không hợp lệ</em> (kèm một lý do) hoặc <em>chờ duyệt</em> / <em>đã xác nhận</em> (kèm một bản ghi đã lưu), và có thể <em>bị huỷ</em> (kèm bản ghi và một lý do). Một <strong>discriminated union</strong> (union có nhãn) mô hình hoá đúng điều đó: một trường chung mà literal của nó nói bạn đang ở trường hợp nào, và dữ liệu theo trường hợp chỉ tồn tại ở chỗ có nghĩa. Bài này dựng <code>BookingState</code> của LabFlow trên <code>BookingRecord</code> của Chương 4 — tệp bạn sẽ hoàn thành ở Lab 5 — và thêm <strong>type predicate</strong>, phép thu hẹp có tên dùng lại được.</p>

<h3>Khuôn mẫu: một nhãn chung, dữ liệu theo thành viên</h3>
${ma('typescript', CODE.labelState)}
${ra(OUT['11-label'])}
<p>Mọi thành viên có một trường <code>step</code> với một literal <em>khác nhau</em> — <code>'draft'</code>, <code>'invalid'</code>, <code>'pending'</code>, v.v. Trường đó là <strong>discriminant</strong> (nhãn). Một <code>switch (state.step)</code> thu hẹp cả object theo từng case: trong <code>case 'invalid'</code> object có <code>code</code>; trong <code>case 'pending'</code> nó có <code>record</code>; trong <code>case 'cancelled'</code> nó có cả <code>record</code> lẫn <code>reason</code>. Bạn không viết ép kiểu và không <code>?.</code> — nhãn làm việc đó. Dữ liệu theo thành viên mới là mấu chốt: một <code>draft</code> không thể mang <code>record</code>, vì chưa có lượt đặt nào.</p>

<h3>Vì sao nhãn quan trọng: không nhãn, không thu hẹp</h3>
<p>Chạm một trường chỉ sống trên vài thành viên, mà chưa thử nhãn trước:</p>
${ma('typescript', CODE.nonarrowBad)}
${ra(OUT['12-nonarrow'])}
<p><strong>TS2339</strong>, và thông báo gọi tên thành viên không có <code>record</code>: <code>{ step: "draft" }</code>. Union trung thực — <code>record</code> không có trên mọi thành viên, nên bạn không được đọc nó cho tới khi đã thu hẹp về một thành viên có nó. Đó là toàn bộ sự an toàn của khuôn mẫu: dáng của một <code>draft</code> không dùng được như thể nó là một <code>pending</code>.</p>

<h3>Type predicate: đặt tên cho một phép thu hẹp</h3>
<p>Bạn sẽ hỏi “lượt đặt này còn sống không?” ở nhiều chỗ. Một hàm <code>boolean</code> thường sẽ trả lời — nhưng không <em>thu hẹp</em>. Một <strong>type predicate</strong> (vị từ kiểu) thì có, bằng cách trả về <code>tham số is Kiểu</code>:</p>
${ma('typescript', CODE.predicateActive)}
${ra(OUT['13-predicate'])}
<p><code>isActive(state): state is ActiveState</code> nói với tsc: kết quả <code>true</code> nghĩa là tham số là một <code>ActiveState</code>. Nên trong <code>if (isActive(s))</code>, <code>s</code> thu hẹp về <code>ActiveState</code> và <code>s.record.id</code> dùng được — y như thể bạn đã thử <code>s.step</code> tại chỗ, nhưng có một cái tên dùng lại được.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — type predicate là một lời hứa tsc không bao giờ kiểm.</strong> Phần trả về <code>is</code> nói kết quả <code>true</code> <em>nghĩa là</em> gì; tsc tin nó và không kiểm thân hàm. Viết sai điều kiện thì nó vẫn biên dịch, rồi sập lúc chạy:</p>
${ma('typescript', CODE.lie)}
${ra(OUT['14-lie-tsc'])}
${ra(OUT['15-lie-run'])}
<p>tsc báo <strong>0 lỗi</strong> — nó tin phần trả về <code>is</code>. Lúc chạy <code>isCancelled</code> trả <code>true</code> cho một lượt đặt <em>pending</em> (điều kiện sai), nên <code>s.reason</code> là <code>undefined</code> và <code>.toUpperCase()</code> ném lỗi. Một predicate đáng tin bằng đúng thân hàm của nó: giữ nó là một phép thử đơn giản, rõ ràng, và kiểm nó. Đây cùng một thoả thuận như <code>as</code> ở 1.2 — bạn đang nói với tsc một điều nó nhận bằng niềm tin.</p>
</div>

<h3>Predicate và <code>Array.filter</code></h3>
${ma('typescript', CODE.filterLive)}
${ra(OUT['16-filter'])}
<p>Vì <code>isActive</code> là predicate, <code>states.filter(isActive)</code> có kiểu <code>ActiveState[]</code> — tsc thu hẹp cả mảng, nên <code>.map(s =&gt; s.record.id)</code> không cần guard. So với một helper có tên trả <code>boolean</code> thường:</p>
${ma('typescript', CODE.filterNamed)}
${ra(OUT['17-filter-named'])}
<p>Một hàm <code>boolean</code> có tên <strong>không</strong> thu hẹp: <code>filter(liveFlag)</code> vẫn là <code>BookingState[]</code>, nên gán nó cho <code>Active[]</code> là TS2322. Cùng điều kiện đó viết tại chỗ — <code>filter(s =&gt; s.step === 'confirmed')</code> — <em>thì</em> thu hẹp, vì từ TypeScript 5.5 tsc <strong>tự suy ra một type predicate</strong> cho một arrow guard đơn giản. Quy tắc nhớ: guard viết tại chỗ thu hẹp tự động; guard có tên dùng lại thì phải khai <code>s is T</code>.</p>

<h3>Giải phẫu một discriminated union</h3>
${BANG_VI}
<p><strong>Từ Java sang (PRO192):</strong> đây là phiên bản TypeScript của một sealed hierarchy — một sealed interface với một record cho mỗi trường hợp, khớp bằng một <code>switch</code> pattern. Khác ở chỗ union này <em>structural</em> (4.1): trình biên dịch thu hẹp theo giá trị literal của một trường, không lớp cha chung và không có gì để khởi tạo.</p>

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Discriminated union là gì?”</strong> Một union của các kiểu object cùng một trường kiểu literal (discriminant); thử trường đó thu hẹp về một thành viên duy nhất, với các trường riêng của nó. <strong>“Type predicate là gì?”</strong> Một hàm trả về <code>x is T</code> thu hẹp tham số tại chỗ gọi; tsc tin <code>is</code> và không kiểm thân — nên một cái sai vẫn biên dịch và chạy sai. <strong>“Vì sao chọn discriminated union hơn trường optional?”</strong> Trường optional để tổ hợp bất khả tồn tại (một draft có record); union bắt mỗi trường hợp mang đúng dữ liệu của nó, và tsc ép tuân thủ.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-3/practice/start/record.ts</code> — trả về bản ghi lượt đặt khi một trạng thái có nó. Nó không biên dịch:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['18-pr-start'])}
<ol>
<li>Thành viên nào không có <code>record</code>? Thu hẹp bằng <code>'record' in state</code> để hàm trả về bản ghi ở chỗ có nó và <code>null</code> ở chỗ khác.</li>
<li>tsc phải sạch.</li>
</ol>
<p><strong>Lời giải</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc sạch (không output). Code Lab thêm: union <code>BookingState</code> đầy đủ và <code>describe</code>, một type predicate <code>isActive</code>, một predicate nói dối phải bị loại, và phép thu hẹp <code>filter</code>. Giờ bạn đã có mọi mảnh của <code>src/rules/state.ts</code> ở Lab 5 — trừ phần kiểm tra đầy đủ, nằm ở 5.4.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">discriminated union (union có nhãn)</span><span class="v">Union của các object cùng một trường literal (discriminant / nhãn).</span></div>
  <div class="kv"><span class="k">discriminant (nhãn)</span><span class="v">Trường chung mà literal chọn thành viên: <code>step</code>, <code>ok</code>, <code>kind</code>.</span></div>
  <div class="kv"><span class="k">type predicate (vị từ kiểu)</span><span class="v">Hàm trả <code>x is T</code> — thu hẹp dùng lại được; tsc tin <code>is</code>.</span></div>
  <div class="kv"><span class="k">inferred predicate</span><span class="v">Từ TS 5.5, một arrow guard đơn giản trong <code>filter</code> thu hẹp mảng tự động.</span></div>
  <div class="kv"><span class="k">illegal state (trạng thái bất hợp lệ)</span><span class="v">Một tổ hợp kiểu cấm — một <code>draft</code> có <code>record</code>: TS2339 / TS2353.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Discriminated union dùng chung một trường literal; một <code>switch</code> trên nó thu hẹp cả object theo từng case, với dữ liệu theo thành viên.</li>
<li>Đọc một trường chỉ-của-thành-viên mà chưa thu hẹp là TS2339 — <code>draft</code> không có <code>record</code>.</li>
<li>Một type predicate (<code>s is ActiveState</code>) đặt tên cho một phép thu hẹp; tsc tin <code>is</code> và không bao giờ kiểm thân — một cái nói dối biên dịch sạch rồi sập lúc chạy.</li>
<li><code>filter</code> với một predicate thu hẹp mảng; một helper <code>boolean</code> có tên thì không (TS2322); một arrow guard tại chỗ được suy ra là predicate (TS 5.5+).</li>
<li>Đây chính là <code>BookingState</code> của LabFlow — dữ liệu của Lab 5.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Discriminated Unions', 'Khuôn mẫu discriminant và kiểm tra đầy đủ. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'TypeScript Handbook — Using type predicates', 'Hàm trả về x is T và cách chúng thu hẹp. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates')}
${nguon('📘', 'TypeScript 5.5 — Inferred type predicates', 'Arrow guard đơn giản trong filter/find được suy ra là predicate. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#inferred-type-predicates')}
</div>
`,
};
