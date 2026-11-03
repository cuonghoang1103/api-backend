/**
 * TypeScript · Chương 7 · 7.4 — Template literal types (kiểu chuỗi mẫu). Slug giữ: typescript-7-4-template-literal-types.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-07-4.mjs (demo7/ts-07-4, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-07-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-07-4.mjs';

const BANG_EN = `<table>
<thead><tr><th>Pattern</th><th>Produces</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>&#96;booking:&#36;{Action}&#96;</code></td><td>one string per union member</td><td>event names</td></tr>
<tr><td><code>&#96;&#36;{A}.&#36;{B}&#96;</code></td><td>every combination of two unions</td><td>message keys <code>hero.en</code></td></tr>
<tr><td><code>Uppercase&lt;S&gt;</code> / <code>Capitalize&lt;S&gt;</code></td><td>transform the string type</td><td><code>'BE-201'</code>, <code>'Created'</code></td></tr>
<tr><td><code>[K in keyof T as &#96;get&#36;{…}&#96;]</code></td><td>rename each key</td><td><code>getCode</code>, <code>getCapacity</code></td></tr>
<tr><td><code>&#96;&#36;{Resource}:&#36;{Method}&#96;</code></td><td>a closed set of valid keys</td><td>permission keys</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Mẫu</th><th>Sinh ra</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>&#96;booking:&#36;{Action}&#96;</code></td><td>một chuỗi mỗi thành viên union</td><td>tên sự kiện</td></tr>
<tr><td><code>&#96;&#36;{A}.&#36;{B}&#96;</code></td><td>mọi tổ hợp của hai union</td><td>khoá câu chữ <code>hero.en</code></td></tr>
<tr><td><code>Uppercase&lt;S&gt;</code> / <code>Capitalize&lt;S&gt;</code></td><td>biến đổi kiểu chuỗi</td><td><code>'BE-201'</code>, <code>'Created'</code></td></tr>
<tr><td><code>[K in keyof T as &#96;get&#36;{…}&#96;]</code></td><td>đổi tên mỗi khoá</td><td><code>getCode</code>, <code>getCapacity</code></td></tr>
<tr><td><code>&#96;&#36;{Resource}:&#36;{Method}&#96;</code></td><td>một tập khoá hợp lệ đóng</td><td>khoá quyền</td></tr>
</tbody>
</table>`;

export default {
  title: '7.4 — Template literal types|||7.4 — Template literal types (kiểu chuỗi mẫu)',
  slug: 'typescript-7-4-template-literal-types',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Template literal type dựng KIỂU CHUỖI từ kiểu khác, như template string dựng giá trị: `booking:${Action}` sinh một chuỗi mỗi action ("booking:created" | … ); hai union trong một mẫu sinh MỌI tổ hợp (cartesian). Helper dựng sẵn Uppercase/Capitalize biến đổi kiểu chuỗi. Đổi tên khoá bằng `as` trong mapped type ({ [K in keyof T as `get${Capitalize<K & string>}`]: … }) sinh getCode/getCapacity. Dùng để làm tên sự kiện/khoá quyền an toàn: gõ sai "booking:creatd" ⇒ TS2820 "Did you mean". Đây là EventName của Lab 7. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Template literal types</h2>
<p class="lead">A <strong>template literal type</strong> builds a <em>string type</em> out of other types, the way a template string builds a value. <code>&#96;booking:&#36;{Action}&#96;</code> turns a union of actions into a union of event names; two unions in one template make every combination; <code>Uppercase</code> and friends transform the string; and <code>as</code> in a mapped type renames keys. The payoff: event names, route keys and permission strings become a closed, checked set — the <code>EventName</code> you build on in Lab 7.</p>

<h3>One string per union member</h3>
${ma('typescript', CODE.namesNames)}
${ra(OUT['11-names'])}
<p><code>&#96;booking:&#36;{BookingAction}&#96;</code> reads like a template string, but at the type level: for each member of <code>BookingAction</code> it produces <code>'booking:' + member</code>, so the type is <code>'booking:created' | 'booking:confirmed' | 'booking:cancelled'</code>. Add an action and the event names grow with it — one source of truth for the whole set.</p>

<h3>Two unions: every combination</h3>
${ma('typescript', CODE.combosGrid)}
${ra(OUT['12-combos'])}
<p>With two unions in one template, the type is the <em>cartesian product</em> — <code>2 × 2 = 4</code> keys. A <code>Record&lt;MessageKey, string&gt;</code> then forces every combination to have a value (4.4 / 7.1), so a missing <code>'footer.vi'</code> would be a compile error. This is how a translation table or a design-token map stays complete.</p>

<h3>Transforming the string: <code>Uppercase</code>, <code>Capitalize</code></h3>
${ma('typescript', CODE.intrinsicLoud)}
${ra(OUT['13-intrinsic'])}
<p>TypeScript ships four intrinsic string types — <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code> — that transform a string type. Combined with a template, <code>&#96;get&#36;{Capitalize&lt;'code'&gt;}&#96;</code> is <code>'getCode'</code>. These are the building blocks for the key renaming next.</p>

<h3>Renaming keys with <code>as</code></h3>
${ma('typescript', CODE.keyremapGetters)}
${ra(OUT['14-keyremap'])}
<p>In a mapped type, <code>[K in keyof T as …]</code> computes a <em>new key</em> for each field (7.1 renamed the value; this renames the key). <code>Getters&lt;Lab&gt;</code> has <code>getCode</code> and <code>getCapacity</code>, each a function returning the original field. This is exactly how a library turns a data shape into a shape of <code>getX</code> methods or <code>onX</code> handlers.</p>

<div class="pitfall co-tieu-de">
<p><strong>The payoff: a typo in a built name is caught.</strong> Because the event names are a closed union, a misspelling is refused with a suggestion:</p>
${ma('typescript', CODE.typoName)}
${ra(OUT['15-typo'])}
<p><strong>TS2820 … Did you mean '"booking:created"'?</strong> A plain <code>string</code> would accept <code>'booking:creatd'</code> and the handler would silently never fire. The template literal type makes the set exact, so the editor autocompletes the names and the compiler catches the typo — the whole value of Lab 7’s typed <code>on</code>/<code>emit</code>.</p>
</div>

<h3>Which pattern, when</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“What is a template literal type?”</strong> A string type built from other types — <code>&#96;booking:&#36;{Action}&#96;</code> — producing one literal per union member, or every combination with two unions. <strong>“What is key remapping?”</strong> <code>[K in keyof T as NewKey]</code> in a mapped type, which renames each property — often with a template and <code>Capitalize</code>. <strong>“Why not just <code>string</code>?”</strong> A template literal type is a closed set, so typos are compile errors and the editor can autocomplete; <code>string</code> accepts anything.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-4/practice/start/key.ts</code> — a <code>PermissionKey</code> should be <code>'&lt;resource&gt;:&lt;method&gt;'</code>, but it is typed <code>string</code>, so a malformed key slips:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>Make <code>PermissionKey</code> a template literal type <code>&#96;&#36;{Resource}:&#36;{Method}&#96;</code>.</li>
<li>Then <code>'labget'</code> (no separator) is a compile error:</li>
</ol>
${ra(OUT['17-pr-step1'])}
<p><strong>Solution</strong> — only valid keys:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Done when:</strong> <code>'labget'</code> is TS2820 and the two valid keys run. Code Lab adds: event names from a union, the cartesian product, <code>Uppercase</code>/<code>Capitalize</code>, and getter keys with <code>as</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">template literal type</span><span class="v"><code>&#96;booking:&#36;{Action}&#96;</code> — a string type built from other types.</span></div>
  <div class="kv"><span class="k">cartesian product</span><span class="v">Two unions in one template → every combination.</span></div>
  <div class="kv"><span class="k">intrinsic string types</span><span class="v"><code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>.</span></div>
  <div class="kv"><span class="k">key remapping (<code>as</code>)</span><span class="v"><code>[K in keyof T as NewKey]</code> — rename each property.</span></div>
  <div class="kv"><span class="k">closed string set</span><span class="v">A finite union of literals; a typo is TS2820.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>&#96;booking:&#36;{Action}&#96;</code> makes one event name per action — one source of truth.</li>
<li>Two unions in one template give the cartesian product (message keys, route keys).</li>
<li><code>Uppercase</code>/<code>Capitalize</code> transform the string type; <code>as</code> renames mapped keys (<code>getCode</code>).</li>
<li>A template literal type is a closed set: a typo is TS2820, with a suggestion — the basis of Lab 7’s typed events.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Template Literal Types', 'Building string types, intrinsic helpers, and key remapping. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html')}
${nguon('📘', 'TypeScript Handbook — Mapped Types: Key Remapping via as', 'Renaming keys in a mapped type with as. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as')}
${lienKet({ khoa: 'api-design', bai: 'api-2-4-i18n', title: 'Message keys that cannot be mistyped — API Design 2.4: Internationalised messages', sub: 'Same: a closed set of message keys with a value for every one, so a missing or misspelled key is caught, not shipped. Different: there the keys live in a translation catalogue checked at build/review time; here two unions in a template literal give the key type (<code>&#96;&#36;{Resource}:&#36;{Field}&#96;</code>) and a <code>Record</code> over it forces a value for every combination, with a typo refused at compile time as TS2820.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Template literal types (kiểu chuỗi mẫu)</h2>
<p class="lead">Một <strong>template literal type</strong> dựng một <em>kiểu chuỗi</em> từ kiểu khác, như một template string dựng một giá trị. <code>&#96;booking:&#36;{Action}&#96;</code> biến một union action thành một union tên sự kiện; hai union trong một mẫu cho mọi tổ hợp; <code>Uppercase</code> và bạn bè biến đổi chuỗi; và <code>as</code> trong một mapped type đổi tên khoá. Phần thưởng: tên sự kiện, khoá route và chuỗi quyền thành một tập đóng, được kiểm — chính <code>EventName</code> bạn dựng trên ở Lab 7.</p>

<h3>Một chuỗi mỗi thành viên union</h3>
${ma('typescript', CODE.namesNames)}
${ra(OUT['11-names'])}
<p><code>&#96;booking:&#36;{BookingAction}&#96;</code> đọc như một template string, nhưng ở tầng kiểu: với mỗi thành viên của <code>BookingAction</code> nó sinh <code>'booking:' + thành viên</code>, nên kiểu là <code>'booking:created' | 'booking:confirmed' | 'booking:cancelled'</code>. Thêm một action thì các tên sự kiện lớn theo — một nguồn sự thật cho cả tập.</p>

<h3>Hai union: mọi tổ hợp</h3>
${ma('typescript', CODE.combosGrid)}
${ra(OUT['12-combos'])}
<p>Với hai union trong một mẫu, kiểu là <em>tích Descartes</em> — <code>2 × 2 = 4</code> khoá. Một <code>Record&lt;MessageKey, string&gt;</code> rồi ép mọi tổ hợp phải có giá trị (4.4 / 7.1), nên thiếu <code>'footer.vi'</code> sẽ là lỗi biên dịch. Đây là cách một bảng dịch hay một bản đồ design-token giữ đủ.</p>

<h3>Biến đổi chuỗi: <code>Uppercase</code>, <code>Capitalize</code></h3>
${ma('typescript', CODE.intrinsicLoud)}
${ra(OUT['13-intrinsic'])}
<p>TypeScript dựng sẵn bốn kiểu chuỗi nội tại — <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code> — biến đổi một kiểu chuỗi. Kết hợp với một mẫu, <code>&#96;get&#36;{Capitalize&lt;'code'&gt;}&#96;</code> là <code>'getCode'</code>. Đây là mảnh ghép cho việc đổi tên khoá ngay dưới.</p>

<h3>Đổi tên khoá bằng <code>as</code></h3>
${ma('typescript', CODE.keyremapGetters)}
${ra(OUT['14-keyremap'])}
<p>Trong một mapped type, <code>[K in keyof T as …]</code> tính một <em>khoá mới</em> cho mỗi trường (7.1 đổi tên giá trị; cái này đổi tên khoá). <code>Getters&lt;Lab&gt;</code> có <code>getCode</code> và <code>getCapacity</code>, mỗi cái một hàm trả về trường gốc. Đây đúng là cách một thư viện biến một dáng dữ liệu thành một dáng method <code>getX</code> hay handler <code>onX</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Phần thưởng: một lỗi gõ trong tên đã dựng bị bắt.</strong> Vì các tên sự kiện là một union đóng, một lỗi gõ bị từ chối kèm gợi ý:</p>
${ma('typescript', CODE.typoName)}
${ra(OUT['15-typo'])}
<p><strong>TS2820 … Did you mean '"booking:created"'?</strong> Một <code>string</code> trơn sẽ nhận <code>'booking:creatd'</code> và handler âm thầm không bao giờ chạy. Template literal type làm tập này chính xác, nên editor tự gợi tên và trình biên dịch bắt lỗi gõ — chính giá trị của <code>on</code>/<code>emit</code> có kiểu ở Lab 7.</p>
</div>

<h3>Mẫu nào, khi nào</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Template literal type là gì?”</strong> Một kiểu chuỗi dựng từ kiểu khác — <code>&#96;booking:&#36;{Action}&#96;</code> — sinh một literal mỗi thành viên union, hoặc mọi tổ hợp với hai union. <strong>“Key remapping là gì?”</strong> <code>[K in keyof T as NewKey]</code> trong một mapped type, đổi tên mỗi thuộc tính — thường với một mẫu và <code>Capitalize</code>. <strong>“Sao không dùng luôn <code>string</code>?”</strong> Template literal type là một tập đóng, nên lỗi gõ là lỗi biên dịch và editor gợi ý được; <code>string</code> nhận bất cứ gì.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-4/practice/start/key.ts</code> — một <code>PermissionKey</code> nên là <code>'&lt;resource&gt;:&lt;method&gt;'</code>, nhưng nó có kiểu <code>string</code>, nên một khoá sai dạng lọt:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>Làm <code>PermissionKey</code> một template literal type <code>&#96;&#36;{Resource}:&#36;{Method}&#96;</code>.</li>
<li>Rồi <code>'labget'</code> (không dấu phân cách) là lỗi biên dịch:</li>
</ol>
${ra(OUT['17-pr-step1'])}
<p><strong>Lời giải</strong> — chỉ khoá hợp lệ:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Đạt khi:</strong> <code>'labget'</code> là TS2820 và hai khoá hợp lệ chạy. Code Lab thêm: tên sự kiện từ một union, tích Descartes, <code>Uppercase</code>/<code>Capitalize</code>, và khoá getter với <code>as</code>.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">template literal type</span><span class="v"><code>&#96;booking:&#36;{Action}&#96;</code> — một kiểu chuỗi dựng từ kiểu khác.</span></div>
  <div class="kv"><span class="k">tích Descartes</span><span class="v">Hai union trong một mẫu → mọi tổ hợp.</span></div>
  <div class="kv"><span class="k">kiểu chuỗi nội tại</span><span class="v"><code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>.</span></div>
  <div class="kv"><span class="k">key remapping (<code>as</code>)</span><span class="v"><code>[K in keyof T as NewKey]</code> — đổi tên mỗi thuộc tính.</span></div>
  <div class="kv"><span class="k">tập chuỗi đóng</span><span class="v">Một union hữu hạn các literal; lỗi gõ là TS2820.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>&#96;booking:&#36;{Action}&#96;</code> làm một tên sự kiện mỗi action — một nguồn sự thật.</li>
<li>Hai union trong một mẫu cho tích Descartes (khoá câu chữ, khoá route).</li>
<li><code>Uppercase</code>/<code>Capitalize</code> biến đổi kiểu chuỗi; <code>as</code> đổi tên khoá ánh xạ (<code>getCode</code>).</li>
<li>Template literal type là một tập đóng: lỗi gõ là TS2820, kèm gợi ý — nền của sự kiện có kiểu ở Lab 7.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Template Literal Types', 'Dựng kiểu chuỗi, helper nội tại, và đổi tên khoá. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html')}
${nguon('📘', 'TypeScript Handbook — Mapped Types: Key Remapping via as', 'Đổi tên khoá trong một mapped type bằng as. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as')}
${lienKet({ khoa: 'api-design', bai: 'api-2-4-i18n', title: 'Khoá câu chữ không thể gõ sai — API Design 2.4: Thông điệp đa ngôn ngữ', sub: 'Giống: một tập khoá câu chữ đóng với một giá trị cho mỗi khoá, nên một khoá thiếu hay gõ sai bị bắt chứ không lên sản phẩm. Khác: ở đó các khoá nằm trong một danh mục bản dịch được kiểm lúc build/soát; ở đây hai union trong một template literal cho kiểu khoá (<code>&#96;&#36;{Resource}:&#36;{Field}&#96;</code>) và một <code>Record</code> qua nó ép mọi tổ hợp phải có giá trị, với một lỗi gõ bị từ chối lúc biên dịch là TS2820.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
