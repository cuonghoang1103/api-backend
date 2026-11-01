/**
 * TypeScript · Chương 4 · 4.1 — Dáng object: thuộc tính bắt buộc, optional, readonly. Slug giữ: typescript-4-1-dang-object.
 * BÀI MỞ CHƯƠNG 4 (soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md). Mọi code/output lấy từ ./_ma-ts-04-1.mjs
 * (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2 — demo4/ts-04-1/).
 */
import G from '../giang/ts-04-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-04-1.mjs';

const BANG_EN = `<table>
<thead><tr><th>You write</th><th>Creating the object</th><th>Reading it</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>capacity: number</code></td><td>must be there (TS2741 / TS2739)</td><td><code>number</code> — no check</td><td>every real lab has it — the default choice</td></tr>
<tr><td><code>equipment?: string[]</code></td><td>may be left out</td><td><code>string[] | undefined</code> — check first (TS18048)</td><td>“not known yet” is a real state, different from empty</td></tr>
<tr><td><code>note: string | null</code></td><td>must be there, may be <code>null</code></td><td>check for <code>null</code></td><td>the database column is nullable (2.1)</td></tr>
<tr><td><code>readonly code: LabCode</code></td><td>set once</td><td>reassigning it is TS2540</td><td>identity: ids, codes, creation times</td></tr>
<tr><td><code>readonly equipment: readonly string[]</code></td><td>set once</td><td>no reassign, no <code>push</code> (TS2339)</td><td>a list that other objects may share</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn viết</th><th>Khi tạo object</th><th>Khi đọc</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>capacity: number</code></td><td>bắt buộc có (TS2741 / TS2739)</td><td><code>number</code> — không cần kiểm</td><td>phòng lab thật nào cũng có — lựa chọn mặc định</td></tr>
<tr><td><code>equipment?: string[]</code></td><td>được bỏ qua</td><td><code>string[] | undefined</code> — kiểm trước (TS18048)</td><td>“chưa biết” là một trạng thái thật, khác với rỗng</td></tr>
<tr><td><code>note: string | null</code></td><td>bắt buộc có, được là <code>null</code></td><td>kiểm <code>null</code></td><td>cột CSDL cho phép NULL (2.1)</td></tr>
<tr><td><code>readonly code: LabCode</code></td><td>gán một lần</td><td>gán lại là TS2540</td><td>danh tính: id, mã, thời điểm tạo</td></tr>
<tr><td><code>readonly equipment: readonly string[]</code></td><td>gán một lần</td><td>không gán lại, không <code>push</code> (TS2339)</td><td>danh sách có thể bị object khác dùng chung</td></tr>
</tbody>
</table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Required keys</div><div class="lz-d">every property without <code>?</code> must be there — TS2741 (one) / TS2739 (several)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Each value</div><div class="lz-d">checked against its property type, nested shapes too — TS2322</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Extra keys</div><div class="lz-d">only for a literal written right there — TS2353, TS2561 “Did you mean”</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Afterwards</div><div class="lz-d">readonly blocks reassigning (TS2540); optional must be checked (TS18048)</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Khoá bắt buộc</div><div class="lz-d">thuộc tính nào không có <code>?</code> phải có mặt — TS2741 (một) / TS2739 (nhiều)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Từng giá trị</div><div class="lz-d">kiểm theo kiểu của thuộc tính, cả dáng lồng bên trong — TS2322</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Khoá thừa</div><div class="lz-d">chỉ với literal viết ngay tại chỗ — TS2353, TS2561 “Did you mean”</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Về sau</div><div class="lz-d">readonly chặn gán lại (TS2540); optional phải kiểm (TS18048)</div></div>
</div>`;

export default {
  title: '4.1 — Object shapes: required, optional & readonly properties|||4.1 — Dáng object: thuộc tính bắt buộc, optional & readonly',
  slug: 'typescript-4-1-dang-object',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 4: mô tả dữ liệu LabFlow (phòng lab, người dùng, lượt đặt) bằng dáng object. JavaScript nhận mọi khoá nên lỗi gõ "capasity" thành NaN im lặng; TypeScript kiểm khoá bắt buộc (TS2741, TS2739), giá trị (TS2322), khoá thừa của literal (TS2353, TS2561 "Did you mean") — nhưng chỉ với literal viết tại chỗ: qua một biến thì typo thành TS2741, và nếu ai đó thêm ? để tắt lỗi thì 0 lỗi, Node in "free seats: -12". Optional: vắng mặt khác rỗng (TS18048, ?. và ??); readonly (TS2540) chỉ là nông — mảng dùng chung vẫn bị push (đo thật hai phòng cùng nhận GPU) ⇒ readonly string[] (TS2339) và spread; dáng lồng; typing theo cấu trúc (khác Java).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Object shapes: required, optional &amp; readonly properties</h2>
<p class="lead">Almost every value in a real app is an object: a lab room, a user, a booking, a request body. TypeScript describes an object by its <strong>shape</strong> (dáng) — which properties it has and the type of each. This lesson builds the first piece of LabFlow’s data model, the <code>Lab</code>, and shows the four rules tsc applies to every object — required, excess, optional, readonly — each with the real error, and the one place where the checking quietly switches off.</p>

<h3>After Chapter 4 you can…</h3>
<ul>
<li><strong>Model data precisely</strong>: required, optional and read-only properties, nested shapes — and know which one a field needs (this lesson).</li>
<li><strong>Choose between <code>interface</code> and <code>type</code></strong> with a reason, and avoid the silent merge of two interfaces with the same name (4.2).</li>
<li><strong>Build big types from small ones</strong> with <code>extends</code> and <code>&amp;</code> — a shared <code>Entity</code> with <code>id</code> and <code>createdAt</code> — and read the error when two pieces disagree (4.3).</li>
<li><strong>Type a dictionary</strong>: an open index signature versus <code>Record&lt;LabCode, Lab&gt;</code>, where tsc proves every lab has an entry (4.4).</li>
<li><strong>Pass Lab 4</strong>: LabFlow’s data model in <code>src/rules/model.ts</code>, where eight wrong uses must be refused.</li>
</ul>
<p>Why it matters: the data model is the part of a project everybody touches — the API returns it, the React form fills it, the database stores it. In a group project (SWP391, the capstone) one wrong field name or one “made optional to make the error go away” spreads to every screen. Interviewers ask “what is structural typing?”, “interface or type?”, “what does <code>readonly</code> really protect?” — you will answer with output you ran.</p>

<h3>JavaScript takes any key</h3>
<p>An admin form creates a lab. Someone types <code>capasity</code> instead of <code>capacity</code>:</p>
${ma('javascript', CODE.typoJs)}
${ra(OUT['11-js-typo'])}
<p>No error, exit code 0. In JavaScript an object accepts any key, so the typo is simply a new property; <code>lab.capacity</code> is <code>undefined</code> and <code>undefined - 12</code> is <code>NaN</code>. Worse, the wrong key is <em>saved</em> — the next screen reads <code>capacity</code> and finds nothing.</p>

<h3>Describe the shape once, give it a name</h3>
<p>A type alias (bí danh kiểu) gives the shape a name: each line is <code>name: Type</code>. <code>code</code> uses <code>LabCode</code> from Chapter 2, so only the three real labs fit:</p>
${ma('typescript', CODE.shapeLab)}
${ma('typescript', CODE.shapeUse)}
${ra(OUT['12-shape'])}
<p>You can also write the shape in place (<code>inline</code> above) — it means exactly the same — but a name is shorter, appears in every error message, and is the one place to change later. Lesson 4.2 shows the other way to name a shape, <code>interface</code>.</p>

<h3>Rule 1 — every required property must be there</h3>
${ma('typescript', CODE.missing)}
${ra(OUT['13-missing'])}
<p>Three messages to learn by heart. <strong>TS2741</strong>: exactly one property is missing, and tsc names it. <strong>TS2739</strong>: several are missing, listed after the colon. <strong>TS2322</strong> on line 5 points at column 64 — the value <code>'40'</code> — because a form field is text and <code>capacity</code> wants a number. Notice how tsc printed the object’s own type: <code>{ code: "AL-301"; name: string; }</code> — the literal <code>"AL-301"</code> was kept because the target property is <code>LabCode</code>.</p>

<h3>Rule 2 — no unknown keys in a literal (excess property check)</h3>
${ma('typescript', CODE.excess)}
${ra(OUT['14-excess'])}
<p>An object literal assigned straight to a <code>Lab</code> may only contain the keys <code>Lab</code> declares. An unknown key is <strong>TS2353</strong>; a key that looks like a known one gets <strong>TS2561 … Did you mean to write 'capacity'?</strong> — the JavaScript bug from the start of the lesson, caught with a suggestion. This check has a name, the <em>excess property check</em> (kiểm thuộc tính thừa), and one important limit.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the typo-catcher only works on a fresh literal, and <code>?</code> switches off what is left.</strong> Build the object first, then use it as a <code>Lab</code>:</p>
${ma('typescript', CODE.freshStrict)}
${ra(OUT['15-fresh-strict'])}
<p>The variable <code>fromForm</code> is not a “fresh” literal any more, so the excess check does not run: no TS2561, no “Did you mean”. tsc still refuses — but only because <code>capacity</code> is <em>required</em> and missing (TS2741). Now watch what a tired teammate does with that error: “the seed does not compile, make it optional”:</p>
${ma('typescript', CODE.freshLoose)}
${ra(OUT['16-fresh-loose'])}
<p><strong>0 errors, and the screen says −12 free seats.</strong> <code>capacity?</code> made the typo legal, tsc then complained about <code>lab.capacity - booked</code> (possibly undefined), so <code>?? 0</code> was added — every step “fixed an error” and together they rebuilt the JavaScript bug. Two habits: type the object where it is created (<code>const fromForm: Lab = { … }</code>, so the literal is fresh), and never make a property optional to silence tsc — make it optional only when “missing” is true in the real world.</p>
</div>

<h3>Rule 3 — optional properties: absent is not empty</h3>
<p>Not every lab has its equipment recorded yet. <code>equipment?: string[]</code> says the key may be absent; reading it gives <code>string[] | undefined</code>:</p>
${ma('typescript', CODE.optional)}
${ra(OUT['17-optional'])}
<p>Same TS18048 as an optional parameter in 3.1 — the type makes “might be missing” visible. The fix should keep the two different answers apart: <em>not recorded</em> (<code>undefined</code>) and <em>recorded, nothing there</em> (<code>[]</code>):</p>
${ma('typescript', CODE.optionalFixed)}
${ra(OUT['18-optional-run'])}
<p>Three labs, three different lines. For a quick number, <code>lab.equipment?.length ?? 0</code> (2.1) is fine — but notice it prints 0 for both BE-202 and AL-301, so do not use it where the difference matters. The last line shows the JSON: an absent property is simply not there. (Optional <code>?:</code> is not the same as <code>: string[] | undefined</code> — with the second the key must be written; lesson 2.1 measured it.)</p>

<h3>Rule 4 — readonly, and why it is shallow</h3>
<p><code>readonly</code> before a property means: set when the object is created, never reassigned. A lab’s code identifies the room — it should never change:</p>
${ma('typescript', CODE.roShallow)}
${ra(OUT['19-ro-tsc'])}
<p>Two TS2540 — reassigning <code>code</code> and reassigning <code>equipment</code>. Renaming the lab is allowed (<code>name</code> is not readonly). But line 17, <code>be201.equipment.push(…)</code>, compiles: <strong><code>readonly</code> protects the property, not the array inside it.</strong> Run it:</p>
${ma('typescript', CODE.roRun)}
${ra(OUT['20-ro-run'])}
<p>Both labs were created from the same <code>STANDARD</code> array, so “add a GPU to BE-201” also added it to BE-202 — a shared reference (Node.js 1.3). Make the array itself read-only (<code>readonly string[]</code>, lesson 2.2) and change it by building a new object with spread:</p>
${ma('typescript', CODE.roDeep)}
${ra(OUT['21-ro-deep'])}
<p>Now <code>push</code> does not exist on the type (TS2339), and the update on line 14 creates a new lab and a new list — <code>STANDARD</code> is untouched. Like every type, <code>readonly</code> is erased before Node runs (0.4): it stops <em>your code</em> from changing the object, it does not lock memory (<code>Object.freeze</code> does that, at runtime — 2.2).</p>

<h3>Nested shapes: name the inner one</h3>
${ma('typescript', CODE.nested)}
${ra(OUT['22-nested'])}
<p>Properties can be objects; tsc checks them all the way down and points at the exact column (<code>floor: '2'</code>). Because the inner shape has a name, <code>Place</code>, the second message says “required in type 'Place'” instead of a long anonymous type. Name a nested shape as soon as it appears twice or appears in errors.</p>

<h3>Shape, not name: structural typing</h3>
${ma('typescript', CODE.structural)}
${ra(OUT['23-structural'])}
<p><code>Classroom</code> never mentions <code>Lab</code>, yet <code>freeSeats(room, 15)</code> compiles: tsc only asks “does this value have at least what <code>Lab</code> needs?” This is <strong>structural typing</strong> (typing theo cấu trúc). The extra <code>projector</code> is fine because <code>room</code> is a variable, not a fresh literal — the same rule as the trap above, this time working for you: data with more fields (a database row, an API response) can be passed wherever a smaller shape is enough. The function’s parameter list also shows destructuring: the type goes after the whole pattern, <code>({ name, capacity }: Lab)</code>.</p>
<p><strong>Coming from Java (PRO192):</strong> Java is <em>nominal</em> — a <code>Classroom</code> is a <code>Lab</code> only if it says <code>extends</code>/<code>implements</code>. TypeScript describes JavaScript objects, which have no class name to compare, so it compares shapes. A consequence: two types with the same shape are interchangeable; Chapter 16 shows “branded” types for when that is not what you want.</p>

<h3>Which property form, when</h3>
${BANG_EN}

<h3>🗺 How tsc reads an object literal</h3>
${FLOW_EN}

<h3>💼 Interview corner</h3>
<p><strong>“What is structural typing?”</strong> Compatibility by shape, not by declared name: any value with the required properties fits. Mention the excess property check as the exception for fresh literals. <strong>“Does <code>readonly</code> make an object immutable?”</strong> No — it is compile-time only and shallow: nested arrays and objects can still change unless their own types are read-only; <code>Object.freeze</code> is the runtime (also shallow) version. <strong>“Optional or <code>| null</code>?”</strong> Optional when the key may be absent (a form, a PATCH); <code>| null</code> when the field is always there but may be empty (a nullable column).</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-1/practice/start/user.ts</code> — a teammate’s <code>User</code>. tsc refuses one line; Node crashes on another:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['24-pr-start'])}
${ra(OUT['25-pr-start-run'])}
<ol>
<li>Change only the <strong>type</strong> so it says what is true: lecturers have no student code, and an id never changes. Run tsc: which two new errors appear, and why are they good news?</li>
<li>Fix the code so the file compiles and prints both users.</li>
</ol>
<p><strong>Step 1 — real output</strong> after <code>readonly id</code> and <code>studentCode?: string</code>:</p>
${ra(OUT['26-pr-step1'])}
<p>Both are bugs the old type hid: <code>an.id = 99</code> (TS2540) and the crash Node showed (TS18048). <strong>Solution:</strong> delete the reassignment and handle the missing code:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['27-pr-sol'])}
<p><strong>Done when:</strong> tsc prints nothing and Node prints two lines, the second with <code>(lecturer)</code>. Code Lab has four more: a lab type with required and optional fields, the typo through a variable, a shared array behind <code>readonly</code>, and a nested <code>Place</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">object type / shape</span><span class="v">The list of properties and their types: <code>{ code: LabCode; capacity: number }</code>.</span></div>
  <div class="kv"><span class="k">type alias</span><span class="v"><code>type Lab = { … }</code> — a name for a type.</span></div>
  <div class="kv"><span class="k">excess property check</span><span class="v">A fresh object literal may not carry unknown keys (TS2353, TS2561). Off for values that went through a variable.</span></div>
  <div class="kv"><span class="k">optional property (<code>?</code>)</span><span class="v">The key may be absent; reading gives <code>T | undefined</code>.</span></div>
  <div class="kv"><span class="k">readonly property</span><span class="v">Set once, reassigning is TS2540. Shallow and compile-time only.</span></div>
  <div class="kv"><span class="k">structural typing</span><span class="v">A value fits a type if it has the required properties — names of types do not matter.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>JavaScript accepted <code>capasity</code> and printed <code>NaN</code>; a typed literal gets TS2561 “Did you mean to write 'capacity'?”.</li>
<li>Missing properties: TS2741 (one) / TS2739 (several); wrong value: TS2322, also inside nested shapes.</li>
<li>The excess check only covers fresh literals. Through a variable, only <em>required</em> properties still protect you — making them optional to silence tsc gave 0 errors and “−12 free seats”.</li>
<li><code>?</code> means “may be absent”, which is not “empty”: keep <code>undefined</code> and <code>[]</code> apart.</li>
<li><code>readonly</code> stops reassignment (TS2540) but not <code>push</code> on a shared array — two labs got the same GPU. Use <code>readonly string[]</code> (TS2339) and update with spread.</li>
<li>Types compare by shape (structural typing), not by name as in Java.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Object Types', 'Property modifiers (optional, readonly), excess property checks, extending and intersecting. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Type Compatibility', 'Structural typing: “x is compatible with y if y has at least the same members as x”. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/type-compatibility.html')}
${lienKet({ khoa: 'react', bai: 'rx-1-2-props', title: 'The same rules for component props — React 1.2: Props and their TypeScript types', sub: 'Same: a props object is described by a shape with required, optional (?) and read-only properties, and tsc catches a missing or misspelled prop before the browser runs. Different: here the shape is LabFlow’s data model — the fresh-literal limit of the typo check, “optional to silence an error”, and why readonly does not protect a shared array.', cta: 'OPEN REACT LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Dáng object: thuộc tính bắt buộc, optional &amp; readonly</h2>
<p class="lead">Gần như mọi giá trị trong một ứng dụng thật là object: một phòng lab, một người dùng, một lượt đặt, một body của request. TypeScript mô tả object bằng <strong>dáng</strong> (shape) của nó — có những thuộc tính nào và mỗi thuộc tính kiểu gì. Bài này dựng mảnh đầu tiên của mô hình dữ liệu LabFlow, kiểu <code>Lab</code>, và cho thấy bốn luật tsc áp cho mọi object — bắt buộc, thừa, optional, readonly — luật nào cũng kèm lỗi thật, cùng một chỗ việc kiểm tra lặng lẽ tắt đi.</p>

<h3>Học xong Chương 4 bạn làm được…</h3>
<ul>
<li><strong>Mô hình hoá dữ liệu chính xác</strong>: thuộc tính bắt buộc, optional, chỉ đọc, dáng lồng nhau — và biết trường nào cần loại nào (bài này).</li>
<li><strong>Chọn giữa <code>interface</code> và <code>type</code></strong> có lý do, và tránh việc hai interface trùng tên âm thầm gộp làm một (4.2).</li>
<li><strong>Ghép kiểu lớn từ kiểu nhỏ</strong> bằng <code>extends</code> và <code>&amp;</code> — một <code>Entity</code> dùng chung có <code>id</code> và <code>createdAt</code> — và đọc được lỗi khi hai mảnh mâu thuẫn (4.3).</li>
<li><strong>Gõ kiểu cho một từ điển</strong>: index signature mở so với <code>Record&lt;LabCode, Lab&gt;</code>, nơi tsc chứng minh phòng nào cũng có mục (4.4).</li>
<li><strong>Qua Lab 4</strong>: mô hình dữ liệu LabFlow trong <code>src/rules/model.ts</code>, nơi tám cách dùng sai phải bị từ chối.</li>
</ul>
<p>Vì sao quan trọng: mô hình dữ liệu là phần cả nhóm cùng chạm vào — API trả nó, form React điền nó, CSDL lưu nó. Trong đồ án nhóm (SWP391, đồ án tốt nghiệp), một tên trường sai hay một lần “cho optional để hết lỗi” lan ra mọi màn hình. Nhà tuyển dụng hay hỏi “structural typing là gì?”, “interface hay type?”, “<code>readonly</code> thật sự bảo vệ cái gì?” — bạn sẽ trả lời bằng output tự chạy.</p>

<h3>JavaScript nhận mọi khoá</h3>
<p>Một form quản trị tạo phòng lab. Ai đó gõ <code>capasity</code> thay vì <code>capacity</code>:</p>
${ma('javascript', CODE.typoJs)}
${ra(OUT['11-js-typo'])}
<p>Không lỗi, exit code 0. Trong JavaScript object nhận mọi khoá, nên lỗi gõ chỉ đơn giản là một thuộc tính mới; <code>lab.capacity</code> là <code>undefined</code> và <code>undefined - 12</code> là <code>NaN</code>. Tệ hơn, khoá sai được <em>lưu lại</em> — màn hình sau đọc <code>capacity</code> và chẳng thấy gì.</p>

<h3>Mô tả dáng một lần, đặt cho nó một cái tên</h3>
<p>Type alias (bí danh kiểu) đặt tên cho một dáng: mỗi dòng là <code>tên: Kiểu</code>. <code>code</code> dùng <code>LabCode</code> của Chương 2, nên chỉ ba phòng thật mới khớp:</p>
${ma('typescript', CODE.shapeLab)}
${ma('typescript', CODE.shapeUse)}
${ra(OUT['12-shape'])}
<p>Bạn cũng có thể viết dáng ngay tại chỗ (<code>inline</code> ở trên) — nghĩa y hệt — nhưng một cái tên thì ngắn hơn, xuất hiện trong mọi thông báo lỗi, và là chỗ duy nhất phải sửa về sau. Bài 4.2 cho thấy cách đặt tên dáng thứ hai, <code>interface</code>.</p>

<h3>Luật 1 — thuộc tính bắt buộc nào cũng phải có</h3>
${ma('typescript', CODE.missing)}
${ra(OUT['13-missing'])}
<p>Ba thông báo nên thuộc lòng. <strong>TS2741</strong>: thiếu đúng một thuộc tính, tsc gọi tên nó. <strong>TS2739</strong>: thiếu nhiều, liệt kê sau dấu hai chấm. <strong>TS2322</strong> ở dòng 5 chỉ vào cột 64 — giá trị <code>'40'</code> — vì ô trong form là chữ còn <code>capacity</code> cần số. Để ý cách tsc in kiểu của chính object: <code>{ code: "AL-301"; name: string; }</code> — literal <code>"AL-301"</code> được giữ vì thuộc tính đích là <code>LabCode</code>.</p>

<h3>Luật 2 — không có khoá lạ trong literal (kiểm thuộc tính thừa)</h3>
${ma('typescript', CODE.excess)}
${ra(OUT['14-excess'])}
<p>Một object literal gán thẳng cho <code>Lab</code> chỉ được chứa các khoá <code>Lab</code> khai báo. Khoá lạ là <strong>TS2353</strong>; khoá trông giống một khoá đã biết thì được <strong>TS2561 … Did you mean to write 'capacity'?</strong> — đúng bug JavaScript đầu bài, bị bắt kèm gợi ý. Phép kiểm này có tên, <em>excess property check</em> (kiểm thuộc tính thừa), và có một giới hạn quan trọng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — bộ bắt lỗi gõ chỉ chạy với literal “tươi”, và <code>?</code> tắt nốt phần còn lại.</strong> Dựng object trước, rồi mới dùng nó làm <code>Lab</code>:</p>
${ma('typescript', CODE.freshStrict)}
${ra(OUT['15-fresh-strict'])}
<p>Biến <code>fromForm</code> không còn là literal “tươi” (fresh), nên phép kiểm khoá thừa không chạy: không TS2561, không “Did you mean”. tsc vẫn từ chối — nhưng chỉ vì <code>capacity</code> là <em>bắt buộc</em> mà bị thiếu (TS2741). Giờ xem một đồng đội mệt mỏi xử lý lỗi đó thế nào: “seed không biên dịch được, cho nó optional”:</p>
${ma('typescript', CODE.freshLoose)}
${ra(OUT['16-fresh-loose'])}
<p><strong>0 lỗi, và màn hình báo −12 chỗ trống.</strong> <code>capacity?</code> làm lỗi gõ thành hợp lệ, tsc liền phàn nàn ở <code>lab.capacity - booked</code> (có thể undefined), thế là thêm <code>?? 0</code> — bước nào cũng “sửa được một lỗi” và gộp lại chúng dựng lại đúng bug JavaScript. Hai thói quen: gõ kiểu cho object ngay chỗ tạo nó (<code>const fromForm: Lab = { … }</code>, để literal còn “tươi”), và đừng bao giờ cho thuộc tính optional để tsc im — chỉ optional khi “thiếu” là sự thật ngoài đời.</p>
</div>

<h3>Luật 3 — thuộc tính optional: vắng mặt không phải rỗng</h3>
<p>Không phải phòng nào cũng đã ghi thiết bị. <code>equipment?: string[]</code> nói khoá có thể vắng; đọc nó được <code>string[] | undefined</code>:</p>
${ma('typescript', CODE.optional)}
${ra(OUT['17-optional'])}
<p>Cùng TS18048 như tham số optional ở 3.1 — kiểu làm cho “có thể thiếu” hiện ra. Cách sửa nên giữ tách hai câu trả lời khác nhau: <em>chưa ghi</em> (<code>undefined</code>) và <em>đã ghi, không có gì</em> (<code>[]</code>):</p>
${ma('typescript', CODE.optionalFixed)}
${ra(OUT['18-optional-run'])}
<p>Ba phòng, ba dòng khác nhau. Cần nhanh một con số thì <code>lab.equipment?.length ?? 0</code> (2.1) là được — nhưng để ý nó in 0 cho cả BE-202 lẫn AL-301, nên đừng dùng ở chỗ sự khác biệt quan trọng. Dòng cuối là JSON: thuộc tính vắng mặt thì đơn giản là không có. (Optional <code>?:</code> không giống <code>: string[] | undefined</code> — với cách sau khoá phải được viết ra; bài 2.1 đã đo.)</p>

<h3>Luật 4 — readonly, và vì sao nó chỉ là “nông”</h3>
<p><code>readonly</code> trước thuộc tính nghĩa là: gán khi tạo object, không bao giờ gán lại. Mã phòng là danh tính của phòng — không bao giờ nên đổi:</p>
${ma('typescript', CODE.roShallow)}
${ra(OUT['19-ro-tsc'])}
<p>Hai TS2540 — gán lại <code>code</code> và gán lại <code>equipment</code>. Đổi tên phòng thì được (<code>name</code> không readonly). Nhưng dòng 17, <code>be201.equipment.push(…)</code>, biên dịch được: <strong><code>readonly</code> bảo vệ thuộc tính, không bảo vệ mảng bên trong nó.</strong> Chạy thử:</p>
${ma('typescript', CODE.roRun)}
${ra(OUT['20-ro-run'])}
<p>Hai phòng được tạo từ cùng một mảng <code>STANDARD</code>, nên “thêm GPU cho BE-201” cũng thêm luôn cho BE-202 — một tham chiếu dùng chung (Node.js 1.3). Hãy cho chính mảng chỉ đọc (<code>readonly string[]</code>, bài 2.2) và thay đổi bằng cách dựng object mới với spread:</p>
${ma('typescript', CODE.roDeep)}
${ra(OUT['21-ro-deep'])}
<p>Giờ <code>push</code> không có trên kiểu (TS2339), và phép cập nhật ở dòng 14 tạo một phòng mới với một danh sách mới — <code>STANDARD</code> không bị đụng. Như mọi kiểu, <code>readonly</code> bị xoá trước khi Node chạy (0.4): nó chặn <em>code của bạn</em> sửa object, chứ không khoá bộ nhớ (<code>Object.freeze</code> làm việc đó, lúc chạy — 2.2).</p>

<h3>Dáng lồng nhau: đặt tên cho dáng bên trong</h3>
${ma('typescript', CODE.nested)}
${ra(OUT['22-nested'])}
<p>Thuộc tính có thể là object; tsc kiểm tới tận cùng và chỉ đúng cột (<code>floor: '2'</code>). Vì dáng bên trong có tên, <code>Place</code>, thông báo thứ hai nói “required in type 'Place'” thay vì một kiểu vô danh dài dòng. Hãy đặt tên cho dáng lồng ngay khi nó xuất hiện hai lần hoặc hiện trong lỗi.</p>

<h3>Dáng, không phải tên: structural typing</h3>
${ma('typescript', CODE.structural)}
${ra(OUT['23-structural'])}
<p><code>Classroom</code> không hề nhắc tới <code>Lab</code>, vậy mà <code>freeSeats(room, 15)</code> biên dịch được: tsc chỉ hỏi “giá trị này có ít nhất những gì <code>Lab</code> cần không?” Đó là <strong>structural typing</strong> (typing theo cấu trúc). <code>projector</code> thừa vẫn được vì <code>room</code> là một biến, không phải literal tươi — cùng luật với cái bẫy ở trên, lần này giúp bạn: dữ liệu nhiều trường hơn (một hàng CSDL, một response API) truyền được vào mọi chỗ chỉ cần dáng nhỏ hơn. Danh sách tham số của hàm còn cho thấy destructuring: kiểu đặt sau cả mẫu, <code>({ name, capacity }: Lab)</code>.</p>
<p><strong>Từ Java sang (PRO192):</strong> Java là <em>nominal</em> (theo tên) — <code>Classroom</code> chỉ là <code>Lab</code> khi nó ghi <code>extends</code>/<code>implements</code>. TypeScript mô tả object JavaScript, vốn không có tên lớp để so, nên nó so dáng. Hệ quả: hai kiểu cùng dáng thì thay được cho nhau; Chương 16 có kiểu “branded” cho lúc bạn không muốn vậy.</p>

<h3>Dạng thuộc tính nào, khi nào</h3>
${BANG_VI}

<h3>🗺 tsc đọc một object literal thế nào</h3>
${FLOW_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Structural typing là gì?”</strong> Tương thích theo dáng, không theo tên khai báo: giá trị nào có đủ thuộc tính bắt buộc thì khớp. Nhắc thêm kiểm thuộc tính thừa là ngoại lệ cho literal tươi. <strong>“<code>readonly</code> có làm object bất biến không?”</strong> Không — nó chỉ có lúc biên dịch và nông: mảng, object lồng bên trong vẫn đổi được trừ khi kiểu của chính chúng là chỉ đọc; <code>Object.freeze</code> là bản lúc chạy (cũng nông). <strong>“Optional hay <code>| null</code>?”</strong> Optional khi khoá có thể vắng (form, PATCH); <code>| null</code> khi trường luôn có nhưng có thể rỗng (cột cho phép NULL).</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-1/practice/start/user.ts</code> — kiểu <code>User</code> của một đồng đội. tsc từ chối một dòng; Node sập ở một dòng khác:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['24-pr-start'])}
${ra(OUT['25-pr-start-run'])}
<ol>
<li>Chỉ sửa <strong>kiểu</strong> cho nó nói đúng sự thật: giảng viên không có mã sinh viên, và id không bao giờ đổi. Chạy tsc: hai lỗi mới nào hiện ra, và vì sao đó là tin tốt?</li>
<li>Sửa code để tệp biên dịch được và in cả hai người dùng.</li>
</ol>
<p><strong>Bước 1 — output thật</strong> sau khi thêm <code>readonly id</code> và <code>studentCode?: string</code>:</p>
${ra(OUT['26-pr-step1'])}
<p>Cả hai đều là bug mà kiểu cũ che đi: <code>an.id = 99</code> (TS2540) và cú sập Node vừa cho thấy (TS18048). <strong>Lời giải:</strong> xoá phép gán lại và xử lý mã bị thiếu:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['27-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không in gì và Node in hai dòng, dòng thứ hai có <code>(lecturer)</code>. Code Lab có thêm bốn bài: kiểu phòng lab với trường bắt buộc và optional, lỗi gõ đi qua một biến, mảng dùng chung sau <code>readonly</code>, và dáng lồng <code>Place</code>.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">object type / shape (dáng)</span><span class="v">Danh sách thuộc tính và kiểu của chúng: <code>{ code: LabCode; capacity: number }</code>.</span></div>
  <div class="kv"><span class="k">type alias (bí danh kiểu)</span><span class="v"><code>type Lab = { … }</code> — một cái tên cho một kiểu.</span></div>
  <div class="kv"><span class="k">excess property check (kiểm thuộc tính thừa)</span><span class="v">Literal tươi không được mang khoá lạ (TS2353, TS2561). Tắt với giá trị đã đi qua một biến.</span></div>
  <div class="kv"><span class="k">optional property (<code>?</code>)</span><span class="v">Khoá có thể vắng; đọc ra được <code>T | undefined</code>.</span></div>
  <div class="kv"><span class="k">readonly property (thuộc tính chỉ đọc)</span><span class="v">Gán một lần, gán lại là TS2540. Nông và chỉ có lúc biên dịch.</span></div>
  <div class="kv"><span class="k">structural typing (typing theo cấu trúc)</span><span class="v">Giá trị khớp một kiểu nếu có đủ thuộc tính bắt buộc — tên kiểu không quan trọng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>JavaScript nhận <code>capasity</code> và in <code>NaN</code>; một literal có kiểu thì nhận TS2561 “Did you mean to write 'capacity'?”.</li>
<li>Thiếu thuộc tính: TS2741 (một) / TS2739 (nhiều); giá trị sai: TS2322, kể cả trong dáng lồng.</li>
<li>Kiểm khoá thừa chỉ áp cho literal tươi. Qua một biến, chỉ còn thuộc tính <em>bắt buộc</em> bảo vệ bạn — cho chúng optional để tsc im thì ra 0 lỗi và “−12 chỗ trống”.</li>
<li><code>?</code> nghĩa là “có thể vắng”, không phải “rỗng”: giữ tách <code>undefined</code> và <code>[]</code>.</li>
<li><code>readonly</code> chặn gán lại (TS2540) nhưng không chặn <code>push</code> vào mảng dùng chung — hai phòng cùng nhận một GPU. Dùng <code>readonly string[]</code> (TS2339) và cập nhật bằng spread.</li>
<li>Kiểu so theo dáng (structural typing), không theo tên như Java.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Object Types', 'Bổ ngữ thuộc tính (optional, readonly), kiểm thuộc tính thừa, mở rộng và giao kiểu. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Type Compatibility', 'Structural typing: “x tương thích với y nếu y có ít nhất các thành viên của x”. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/type-compatibility.html')}
${lienKet({ khoa: 'react', bai: 'rx-1-2-props', title: 'Cùng luật cho props của component — React 1.2: Props và kiểu TypeScript', sub: 'Giống: object props được mô tả bằng một dáng có thuộc tính bắt buộc, optional (?) và chỉ đọc, tsc bắt prop thiếu hay gõ sai trước khi trình duyệt chạy. Khác: ở đây dáng là mô hình dữ liệu LabFlow — giới hạn “literal tươi” của bộ bắt lỗi gõ, “cho optional để hết lỗi”, và vì sao readonly không bảo vệ mảng dùng chung.', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
