/**
 * TypeScript · Chương 4 · 4.2 — interface hay type alias. Slug giữ: typescript-4-2-interface-vs-type.
 * Soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md. Mọi code/output lấy từ ./_ma-ts-04-2.mjs (labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2 —
 * demo4/ts-04-2/). Số đếm interface/type của backend cuongthai.com: git ls-files "src/*.ts" (bỏ .d.ts, test) + grep, commit 88ec543b0, 01/11/2026.
 */
import G from '../giang/ts-04-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-04-2.mjs';

const BANG_EN = `<table>
<thead><tr><th>Question</th><th><code>interface</code></th><th><code>type</code> alias</th></tr></thead>
<tbody>
<tr><td>Name an object shape</td><td>✓</td><td>✓ — same checks, same messages (measured)</td></tr>
<tr><td>Same name declared twice</td><td><strong>merges silently</strong> — the error appears where objects are created</td><td>TS2300 on both declarations</td></tr>
<tr><td>Union, literal union, tuple, function type</td><td>✗ (TS1005 — not even valid syntax)</td><td>✓</td></tr>
<tr><td>Build on another type</td><td><code>extends</code> — only object shapes with known members (TS2312 for a union); conflicts reported at the declaration (4.3)</td><td><code>&amp;</code> with anything, union included; conflicts found later (4.3)</td></tr>
<tr><td>Computed types (<code>Partial&lt;T&gt;</code>, mapped, conditional — Ch7–8)</td><td>✗</td><td>✓ — Prisma’s generated models are type aliases</td></tr>
<tr><td>Add fields to a library’s type (augmentation)</td><td>✓ — merging is the point (Ch10)</td><td>✗</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Câu hỏi</th><th><code>interface</code></th><th><code>type</code> alias</th></tr></thead>
<tbody>
<tr><td>Đặt tên một dáng object</td><td>✓</td><td>✓ — cùng phép kiểm, cùng thông báo (đã đo)</td></tr>
<tr><td>Khai báo cùng tên hai lần</td><td><strong>gộp âm thầm</strong> — lỗi hiện ở chỗ tạo object</td><td>TS2300 ở cả hai khai báo</td></tr>
<tr><td>Union, union literal, tuple, kiểu hàm</td><td>✗ (TS1005 — sai cả cú pháp)</td><td>✓</td></tr>
<tr><td>Dựng trên một kiểu khác</td><td><code>extends</code> — chỉ dáng object biết rõ thành viên (TS2312 với union); xung đột báo ngay ở khai báo (4.3)</td><td><code>&amp;</code> với bất cứ gì, kể cả union; xung đột lộ ra muộn (4.3)</td></tr>
<tr><td>Kiểu tính toán (<code>Partial&lt;T&gt;</code>, mapped, conditional — Ch7–8)</td><td>✗</td><td>✓ — model Prisma sinh ra là type alias</td></tr>
<tr><td>Thêm trường vào kiểu của thư viện (augmentation)</td><td>✓ — gộp chính là mục đích (Ch10)</td><td>✗</td></tr>
</tbody>
</table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Is it an object shape?</div><div class="lz-d">no — a union, tuple, function, computed type ⇒ <code>type</code></div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Adding to a library’s type?</div><div class="lz-d">yes ⇒ <code>interface</code> inside <code>declare global</code> / <code>declare module</code> (Ch10)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">A named entity, props, DTO</div><div class="lz-d">⇒ <code>interface</code> (this course’s convention; <code>extends</code> reports conflicts early)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Whatever you pick</div><div class="lz-d">one name per shape, never declared twice — be consistent</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Có phải dáng object?</div><div class="lz-d">không — union, tuple, hàm, kiểu tính toán ⇒ <code>type</code></div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Thêm vào kiểu của thư viện?</div><div class="lz-d">có ⇒ <code>interface</code> trong <code>declare global</code> / <code>declare module</code> (Ch10)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Một thực thể, props, DTO có tên</div><div class="lz-d">⇒ <code>interface</code> (quy ước của khoá; <code>extends</code> báo xung đột sớm)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chọn gì cũng được</div><div class="lz-d">mỗi dáng một tên, không khai báo hai lần — nhất quán</div></div>
</div>`;

export default {
  title: '4.2 — interface vs type alias|||4.2 — interface hay type alias',
  slug: 'typescript-4-2-interface-vs-type',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai cách đặt tên cho một dáng object: interface và type alias cho cùng phép kiểm, cùng thông báo (TS2741 đo cho cả hai). Khác biệt thật: hai interface cùng tên âm thầm GỘP (tsc 0 lỗi ở khai báo, lỗi TS2741 "phone is missing" hiện ở chỗ tạo object, Node vẫn chạy) còn type trùng tên báo TS2300; chỉ type đặt tên được union, tuple, kiểu hàm (interface ⇒ TS1005), interface không extends được union (TS2312); khi nào gộp là mục đích (augmentation Request của Express — đoạn thật từ backend cuongthai.com). Số đo thật trên backend website: 896 tệp, 1.460 interface, 890 type alias. Quy ước của khoá: interface cho dáng có tên, type cho mọi thứ còn lại.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>interface vs type alias</h2>
<p class="lead">TypeScript has two ways to give a shape a name: <code>interface Lab { … }</code> and <code>type Lab = { … }</code>. For a plain object they do the same job, and online arguments about them are mostly noise. But there are three real differences — one of them a silent trap — and this lesson measures each, then gives you a rule so you stop hesitating.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li>Read and write both spellings and know they check objects the same way.</li>
<li>Recognise the <strong>declaration merging</strong> trap: two interfaces with one name silently become one bigger type.</li>
<li>Know what only a <code>type</code> can name (unions, tuples, function types, computed types) and what only an <code>interface</code> can do (augment a library’s type).</li>
<li>Apply one convention in your project — the one LabFlow uses in <code>src/rules/model.ts</code> for Lab 4.</li>
</ul>
<p>In a team the question “interface or type?” comes up in every code review. A clear answer saves arguments; knowing the merge trap saves an afternoon of hunting an error that points at the wrong line. It is also one of the most common TypeScript interview questions.</p>

<h3>Two spellings, the same checks</h3>
${ma('typescript', CODE.both)}
${ra(OUT['11-both'])}
<p>An interface has no <code>=</code> and its body is a list of members; a type alias names <em>any</em> type with <code>=</code>. For the same object both give the same TS2741, only the name in the message differs. Line 18 shows they are interchangeable: by structural typing (4.1) a <code>LabI</code> is a <code>LabT</code> because the shapes match.</p>

<h3>Difference 1 — interfaces with the same name merge</h3>
<p>A long <code>models.ts</code>. At the top, the <code>User</code> every screen uses. Much later, someone writing the SMS feature declares “their” <code>User</code> — not knowing the name is taken:</p>
${ma('typescript', CODE.merge)}
${ra(OUT['12-merge'])}
<p>The second declaration is <em>not</em> an error. TypeScript merges both into one <code>User</code> with four properties (this is called <strong>declaration merging</strong>, gộp khai báo). The error appears where an object is created — line 17 — and says <code>phone</code> is missing, without a word about the second declaration on line 13. In a real project that creation line is in another file, and every <code>User</code> in the codebase now demands a phone number.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — merging hides the cause and does not stop the program.</strong> The types are erased, so Node runs the file as if nothing happened:</p>
${ra(OUT['13-merge-run'])}
<p>Exit code 0: a red build, a green runtime, and an error message pointing at innocent code. The same mistake with type aliases fails loudly, at both declarations:</p>
${ma('typescript', CODE.dup)}
${ra(OUT['14-dup'])}
<p>TS2300 <em>Duplicate identifier</em> names the real problem. If an interface error says a property is “missing” that you never wrote, search the project for a second declaration with the same name.</p>
</div>

<h3>When merging is exactly what you want</h3>
<p>Merging exists for one good reason: adding members to a type you do not own. This is real code from this website’s backend — after the login middleware runs, every Express request carries the user, so the project adds those fields to Express’s own <code>Request</code> interface:</p>
${ma('typescript', CODE.excerpt)}
<p>Express’s type definitions declare <code>interface Request</code> inside <code>namespace Express</code>; this file declares it again, and the two merge — now <code>req.userId</code> type-checks in every route. Only an interface can do this. Chapter 10 builds the same augmentation for LabFlow; until then, treat a second declaration of your own interface as a bug.</p>

<h3>Difference 2 — only a type alias can name a union, a tuple or a function</h3>
${ma('typescript', CODE.union)}
${ra(OUT['15-union'])}
<p>The first three lines are things you used in Chapters 2–3: a literal union, a tuple, a function type. An <code>interface</code> cannot express them at all — the last line is not even valid syntax (TS1005 <em>'{' expected</em>). And an interface cannot build on a union either:</p>
${ma('typescript', CODE.extunion)}
${ra(OUT['16-extunion'])}
<p>TS2312: an interface may only <code>extends</code> object types whose members are known. A type alias combines anything with <code>&amp;</code> — line 6 compiles. You will need this in Chapter 5, where a booking’s state <em>is</em> a union.</p>

<h3>Difference 3 — <code>extends</code> and <code>&amp;</code> report conflicts at different places</h3>
<p>Both build a bigger shape from smaller ones. The TypeScript team’s Performance wiki lists why interfaces are preferred for composing object shapes: an interface “creates a single flat object type that detects property conflicts”, while an intersection “just recursively merges properties, and in some cases produce[s] never”; interfaces also display better in messages and their relationships are cached. Lesson 4.3 measures the conflict case on LabFlow’s <code>Entity</code>.</p>

<h3>What real projects do: measured on this website</h3>
<p>The backend of cuongthai.com (Express + Prisma, 896 non-test <code>.ts</code> files at commit 88ec543b0, counted with <code>git ls-files</code> + <code>grep</code> on 1 Nov 2026) has <strong>1,460 <code>interface</code></strong> declarations and <strong>890 <code>type</code> aliases</strong>. Only 123 of those aliases are a plain object <code>= {</code>; 224 start with a string literal — unions such as roles and statuses. The pattern is the usual one: interfaces for named shapes, type aliases for unions and everything computed. Prisma’s generated client goes the other way for its models (<code>export type User = $Result.DefaultSelection&lt;…&gt;</code>) because they are computed types — something only <code>type</code> can name.</p>

<h3>The rule this course uses</h3>
<p><strong><code>interface</code> for a named object shape</strong> — an entity, component props, a request or response body. <strong><code>type</code> for everything else</strong> — unions, literal unions, tuples, function types, <code>&amp;</code> compositions, anything computed. LabFlow’s <code>model.ts</code> follows it: <code>interface Lab</code>, <code>interface User extends Entity</code>, but <code>type BookingStatus = 'PENDING' | …</code> and <code>type BookingView = BookingRecord &amp; { … }</code>. Teams that use <code>type</code> for everything are fine too — consistency matters more than the choice.</p>

<h3>interface or type — what actually differs</h3>
${BANG_EN}

<h3>🗺 Choosing in four questions</h3>
${FLOW_EN}

<h3>💼 Interview corner</h3>
<p><strong>“interface or type?”</strong> Say both name object shapes with the same checks; then the three differences: interfaces merge (useful for augmenting libraries, a trap otherwise — duplicate type aliases are TS2300), only <code>type</code> names unions/tuples/functions/computed types, and <code>extends</code> reports property conflicts at the declaration while <code>&amp;</code> can silently produce <code>never</code>. Finish with your convention. <strong>“What is declaration merging?”</strong> Same-named interfaces (and namespaces) in one scope combine into one declaration; it is how <code>Express.Request</code> gets a <code>user</code> field.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-2/practice/start/booking.ts</code>: a booking created with every field the model has — and tsc says two fields are missing that nobody remembers adding:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Why does the error mention <code>title</code> and <code>allDay</code>?</li>
<li>Fix it without deleting the calendar feature: the calendar’s view of a booking needs a title, an all-day flag and the time range.</li>
</ol>
<p><strong>Solution and real output.</strong> The second <code>interface Booking</code> merged into the first. The calendar view is a different shape, so it gets its own name and a small conversion function:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Done when:</strong> tsc prints nothing, Node prints the label and the event, and the project has exactly one <code>interface Booking</code>. Code Lab has three more: a type-alias duplicate to rename, a union an interface cannot hold, and the augmentation of a library-style interface.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">interface</span><span class="v">A named object shape: <code>interface Lab { code: LabCode; … }</code>. Can <code>extends</code>, can merge.</span></div>
  <div class="kv"><span class="k">type alias</span><span class="v">A name for any type: <code>type BookingStatus = 'PENDING' | 'CONFIRMED'</code>.</span></div>
  <div class="kv"><span class="k">declaration merging</span><span class="v">Two interfaces with the same name in one scope become one. No error at the declarations.</span></div>
  <div class="kv"><span class="k">module augmentation</span><span class="v">Merging on purpose to add members to a library’s interface (Express <code>Request</code>) — Ch10.</span></div>
  <div class="kv"><span class="k">TS2300 · TS2312</span><span class="v">Duplicate identifier (two type aliases) · an interface extending a non-object type such as a union.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>For an object shape, <code>interface</code> and <code>type</code> give the same checks and interchangeable types (both TS2741 in the same place).</li>
<li>Same-named interfaces merge silently: the error showed up at the creation line (“phone is missing”) and Node still ran. Duplicate type aliases are TS2300.</li>
<li>Only <code>type</code> names unions, tuples, function types and computed types; an interface cannot extend a union (TS2312).</li>
<li>Merging is right for augmenting a library’s type — this website adds <code>user</code>/<code>userId</code> to Express’s <code>Request</code>.</li>
<li>This website’s backend: 1,460 interfaces, 890 type aliases. Course rule: interface for named shapes, type for the rest — and never one name twice.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Everyday Types: Differences Between Type Aliases and Interfaces', 'The official comparison, including merging and extending. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('📘', 'TypeScript Handbook — Declaration Merging', 'How same-named interfaces and namespaces combine; module augmentation. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html')}
${nguon('📗', 'TypeScript wiki — Performance: Preferring Interfaces Over Intersections', 'Interfaces detect property conflicts and are cached; intersections can produce never. Read 1 Nov 2026.', 'https://github.com/microsoft/TypeScript/wiki/Performance')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-1-2-generate-viet-gi', title: 'Who writes your types — Prisma 1.2: What prisma generate actually writes', sub: 'Same: a model becomes a named TypeScript type that every query result is checked against. Different: Prisma generates computed type aliases (export type User = $Result.DefaultSelection&lt;…&gt;) — something an interface cannot express; here you write the hand-made shapes yourself and choose interface or type on purpose.', cta: 'OPEN PRISMA LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>interface hay type alias</h2>
<p class="lead">TypeScript có hai cách đặt tên cho một dáng: <code>interface Lab { … }</code> và <code>type Lab = { … }</code>. Với một object bình thường chúng làm cùng một việc, và tranh cãi trên mạng phần lớn là ồn ào. Nhưng có ba khác biệt thật — một trong số đó là cái bẫy âm thầm — và bài này đo từng cái, rồi cho bạn một quy tắc để khỏi lưỡng lự.</p>

<h3>Bạn sẽ làm được gì, và vì sao quan trọng</h3>
<ul>
<li>Đọc và viết cả hai cách, biết rằng chúng kiểm object giống nhau.</li>
<li>Nhận ra bẫy <strong>declaration merging</strong> (gộp khai báo): hai interface trùng tên âm thầm thành một kiểu lớn hơn.</li>
<li>Biết thứ chỉ <code>type</code> đặt tên được (union, tuple, kiểu hàm, kiểu tính toán) và việc chỉ <code>interface</code> làm được (bổ sung kiểu của thư viện).</li>
<li>Áp một quy ước cho dự án — đúng quy ước LabFlow dùng trong <code>src/rules/model.ts</code> của Lab 4.</li>
</ul>
<p>Trong nhóm, câu “interface hay type?” xuất hiện ở mọi buổi review code. Một câu trả lời rõ ràng tiết kiệm tranh cãi; biết bẫy gộp tiết kiệm một buổi chiều đi tìm một lỗi chỉ sai dòng. Đây cũng là một trong những câu phỏng vấn TypeScript phổ biến nhất.</p>

<h3>Hai cách viết, cùng phép kiểm</h3>
${ma('typescript', CODE.both)}
${ra(OUT['11-both'])}
<p>Interface không có <code>=</code> và thân là danh sách thành viên; type alias đặt tên cho <em>bất kỳ</em> kiểu nào bằng <code>=</code>. Với cùng một object cả hai cho cùng TS2741, chỉ khác cái tên trong thông báo. Dòng 18 cho thấy chúng thay được cho nhau: theo structural typing (4.1), một <code>LabI</code> là một <code>LabT</code> vì dáng khớp nhau.</p>

<h3>Khác biệt 1 — interface trùng tên thì gộp lại</h3>
<p>Một tệp <code>models.ts</code> dài. Trên đầu là <code>User</code> mọi màn hình dùng. Mãi về sau, người viết tính năng SMS khai báo <code>User</code> “của mình” — không biết tên đã có người dùng:</p>
${ma('typescript', CODE.merge)}
${ra(OUT['12-merge'])}
<p>Khai báo thứ hai <em>không</em> phải lỗi. TypeScript gộp cả hai thành một <code>User</code> bốn thuộc tính (gọi là <strong>declaration merging</strong>, gộp khai báo). Lỗi hiện ở chỗ tạo object — dòng 17 — và nói thiếu <code>phone</code>, không một chữ nào về khai báo thứ hai ở dòng 13. Trong dự án thật dòng tạo object đó nằm ở tệp khác, và mọi <code>User</code> trong codebase giờ đòi số điện thoại.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — gộp khai báo giấu nguyên nhân và không làm chương trình dừng.</strong> Kiểu bị xoá, nên Node chạy tệp như chưa có gì xảy ra:</p>
${ra(OUT['13-merge-run'])}
<p>Exit code 0: build đỏ, chạy xanh, và thông báo lỗi chỉ vào code vô tội. Cùng lỗi đó với type alias thì hỏng ầm ĩ, ở cả hai khai báo:</p>
${ma('typescript', CODE.dup)}
${ra(OUT['14-dup'])}
<p>TS2300 <em>Duplicate identifier</em> gọi đúng tên vấn đề. Nếu lỗi của một interface nói thiếu một thuộc tính bạn chưa từng viết, hãy tìm trong dự án một khai báo thứ hai cùng tên.</p>
</div>

<h3>Khi gộp chính là điều bạn muốn</h3>
<p>Gộp khai báo tồn tại vì một lý do chính đáng: thêm thành viên vào một kiểu bạn không sở hữu. Đây là code thật trong backend của chính website này — sau khi middleware đăng nhập chạy, request Express nào cũng mang theo người dùng, nên dự án thêm các trường đó vào chính interface <code>Request</code> của Express:</p>
${ma('typescript', CODE.excerpt)}
<p>Bộ khai báo kiểu của Express khai <code>interface Request</code> trong <code>namespace Express</code>; tệp này khai lại, hai cái gộp làm một — giờ <code>req.userId</code> qua kiểm ở mọi route. Chỉ interface làm được việc này. Chương 10 dựng đúng phép bổ sung này cho LabFlow; trước đó, hãy coi việc khai báo lại interface của chính mình là bug.</p>

<h3>Khác biệt 2 — chỉ type alias đặt tên được union, tuple hay hàm</h3>
${ma('typescript', CODE.union)}
${ra(OUT['15-union'])}
<p>Ba dòng đầu là thứ bạn đã dùng ở Chương 2–3: union literal, tuple, kiểu hàm. <code>interface</code> hoàn toàn không diễn đạt được — dòng cuối thậm chí sai cú pháp (TS1005 <em>'{' expected</em>). Và interface cũng không dựng được trên một union:</p>
${ma('typescript', CODE.extunion)}
${ra(OUT['16-extunion'])}
<p>TS2312: interface chỉ được <code>extends</code> kiểu object biết rõ thành viên. Type alias ghép được mọi thứ bằng <code>&amp;</code> — dòng 6 biên dịch được. Bạn sẽ cần điều này ở Chương 5, nơi trạng thái của lượt đặt <em>chính là</em> một union.</p>

<h3>Khác biệt 3 — <code>extends</code> và <code>&amp;</code> báo xung đột ở hai chỗ khác nhau</h3>
<p>Cả hai đều dựng dáng lớn từ dáng nhỏ. Trang wiki Performance của đội TypeScript nêu vì sao nên chọn interface khi ghép dáng object: interface “tạo một kiểu object phẳng duy nhất, phát hiện xung đột thuộc tính”, còn intersection “chỉ gộp thuộc tính theo đệ quy, và có lúc ra never”; interface còn hiển thị gọn hơn trong thông báo và quan hệ giữa chúng được lưu đệm. Bài 4.3 đo trường hợp xung đột trên <code>Entity</code> của LabFlow.</p>

<h3>Dự án thật làm gì: đo trên chính website này</h3>
<p>Backend của cuongthai.com (Express + Prisma, 896 tệp <code>.ts</code> không phải test ở commit 88ec543b0, đếm bằng <code>git ls-files</code> + <code>grep</code> ngày 1/11/2026) có <strong>1.460 khai báo <code>interface</code></strong> và <strong>890 <code>type</code> alias</strong>. Chỉ 123 alias là object thường <code>= {</code>; 224 alias bắt đầu bằng một chuỗi literal — các union như vai trò, trạng thái. Đúng khuôn quen thuộc: interface cho dáng có tên, type alias cho union và mọi thứ tính toán. Client do Prisma sinh ra thì ngược lại cho các model (<code>export type User = $Result.DefaultSelection&lt;…&gt;</code>) vì đó là kiểu tính toán — thứ chỉ <code>type</code> đặt tên được.</p>

<h3>Quy tắc khoá này dùng</h3>
<p><strong><code>interface</code> cho dáng object có tên</strong> — một thực thể, props của component, body request hay response. <strong><code>type</code> cho mọi thứ còn lại</strong> — union, union literal, tuple, kiểu hàm, ghép bằng <code>&amp;</code>, mọi thứ tính toán. <code>model.ts</code> của LabFlow theo đúng vậy: <code>interface Lab</code>, <code>interface User extends Entity</code>, nhưng <code>type BookingStatus = 'PENDING' | …</code> và <code>type BookingView = BookingRecord &amp; { … }</code>. Nhóm nào dùng <code>type</code> cho tất cả cũng ổn — nhất quán quan trọng hơn lựa chọn.</p>

<h3>interface hay type — thật sự khác ở đâu</h3>
${BANG_VI}

<h3>🗺 Chọn bằng bốn câu hỏi</h3>
${FLOW_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“interface hay type?”</strong> Nói cả hai đều đặt tên dáng object với cùng phép kiểm; rồi ba khác biệt: interface gộp lại (có ích khi bổ sung thư viện, là bẫy trong trường hợp khác — type alias trùng là TS2300), chỉ <code>type</code> đặt tên được union/tuple/hàm/kiểu tính toán, và <code>extends</code> báo xung đột thuộc tính ngay ở khai báo còn <code>&amp;</code> có thể âm thầm ra <code>never</code>. Kết bằng quy ước của bạn. <strong>“Declaration merging là gì?”</strong> Các interface (và namespace) cùng tên trong một phạm vi gộp thành một khai báo; đó là cách <code>Express.Request</code> có thêm trường <code>user</code>.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-2/practice/start/booking.ts</code>: một lượt đặt được tạo với đủ mọi trường của model — vậy mà tsc báo thiếu hai trường không ai nhớ đã thêm:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Vì sao lỗi nhắc tới <code>title</code> và <code>allDay</code>?</li>
<li>Sửa mà không xoá tính năng lịch: góc nhìn của lịch về một lượt đặt cần tiêu đề, cờ cả ngày và khoảng giờ.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> <code>interface Booking</code> thứ hai đã gộp vào cái thứ nhất. Góc nhìn của lịch là một dáng khác, nên nó có tên riêng và một hàm chuyển đổi nhỏ:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không in gì, Node in nhãn và sự kiện, và dự án có đúng một <code>interface Booking</code>. Code Lab có thêm ba bài: một type alias trùng cần đổi tên, một union mà interface không chứa nổi, và phép bổ sung một interface kiểu thư viện.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">interface</span><span class="v">Một dáng object có tên: <code>interface Lab { code: LabCode; … }</code>. Có thể <code>extends</code>, có thể gộp.</span></div>
  <div class="kv"><span class="k">type alias (bí danh kiểu)</span><span class="v">Một tên cho bất kỳ kiểu nào: <code>type BookingStatus = 'PENDING' | 'CONFIRMED'</code>.</span></div>
  <div class="kv"><span class="k">declaration merging (gộp khai báo)</span><span class="v">Hai interface cùng tên trong một phạm vi thành một. Không lỗi ở khai báo.</span></div>
  <div class="kv"><span class="k">module augmentation (bổ sung module)</span><span class="v">Gộp có chủ ý để thêm thành viên vào interface của thư viện (<code>Request</code> của Express) — Ch10.</span></div>
  <div class="kv"><span class="k">TS2300 · TS2312</span><span class="v">Định danh trùng (hai type alias) · interface extends một kiểu không phải object, ví dụ union.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Với dáng object, <code>interface</code> và <code>type</code> cho cùng phép kiểm và kiểu thay được cho nhau (cả hai TS2741 ở cùng chỗ).</li>
<li>Interface trùng tên gộp âm thầm: lỗi hiện ở dòng tạo object (“phone is missing”) và Node vẫn chạy. Type alias trùng là TS2300.</li>
<li>Chỉ <code>type</code> đặt tên được union, tuple, kiểu hàm và kiểu tính toán; interface không extends được union (TS2312).</li>
<li>Gộp là đúng khi bổ sung kiểu của thư viện — website này thêm <code>user</code>/<code>userId</code> vào <code>Request</code> của Express.</li>
<li>Backend website này: 1.460 interface, 890 type alias. Quy tắc của khoá: interface cho dáng có tên, type cho phần còn lại — và không bao giờ một tên hai lần.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Everyday Types: Differences Between Type Aliases and Interfaces', 'Bảng so sánh chính thức, gồm cả gộp và mở rộng. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('📘', 'TypeScript Handbook — Declaration Merging', 'Interface và namespace cùng tên gộp lại thế nào; module augmentation. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html')}
${nguon('📗', 'TypeScript wiki — Performance: Preferring Interfaces Over Intersections', 'Interface phát hiện xung đột thuộc tính và được lưu đệm; intersection có thể ra never. Đọc ngày 1/11/2026.', 'https://github.com/microsoft/TypeScript/wiki/Performance')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-1-2-generate-viet-gi', title: 'Ai viết kiểu cho bạn — Prisma 1.2: prisma generate thật sự viết ra cái gì', sub: 'Giống: một model thành một kiểu TypeScript có tên, mọi kết quả truy vấn được kiểm theo nó. Khác: Prisma sinh type alias tính toán (export type User = $Result.DefaultSelection&lt;…&gt;) — thứ interface không diễn đạt được; ở đây bạn tự viết các dáng làm tay và chọn interface hay type có chủ ý.', cta: 'MỞ BÀI PRISMA →' })}
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-9-3-interfaces" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 9.3 — Interfaces and types</span><span class="lc-sub">Typing a real REST API with Omit/Partial/Record and a kind-tagged loading state</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-9-3-interfaces" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 9.3 — interface và type</span><span class="lc-sub">Gắn kiểu cho một REST API thật bằng Omit/Partial/Record và trạng thái tải có trường kind</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
};
