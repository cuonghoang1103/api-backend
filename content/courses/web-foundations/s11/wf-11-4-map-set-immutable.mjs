/**
 * Bài 11.4 — Map, Set và bất biến (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (Chromium thật). Deck: scripts/slides-src/wf-11-4.mjs (13 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-11-4', 'Map, Set & immutability', 'Map, Set & bất biến', [
  [1, 'Map, Set & immutability',
    '<p>Two containers that fix real problems of plain objects and arrays, and one habit — replacing data instead of changing it — that React depends on completely.</p>',
    '<p>Hai kiểu chứa dữ liệu sửa những vấn đề thật của object và mảng thường, và một thói quen — THAY dữ liệu thay vì SỬA nó — mà React phụ thuộc hoàn toàn.</p>'],
  [2, 'After this lesson you can…',
    '<p>Choose Map or Set for the right job, explain why two identical-looking objects are not equal, and update nested data without touching the original. The last skill is the one that fixes the most common React complaint: "I changed the state but the screen did not update".</p>',
    '<p>Chọn Map hay Set cho đúng việc, giải thích vì sao hai object trông y hệt lại không bằng nhau, và cập nhật dữ liệu lồng nhau mà không chạm vào bản gốc. Kỹ năng cuối sửa lời than phổ biến nhất về React: "tôi đã đổi state mà màn hình không cập nhật".</p>'],
  [3, 'Objects turn keys into strings',
    '<p>Using an object as a dictionary has a hidden rule: keys become strings. The number 1 and the string "1" collide, and every object key becomes the same text "[object Object]" — so storing Minh overwrote Lan. No error, just lost data.</p>',
    '<p>Dùng object làm từ điển có một luật ẩn: khoá bị đổi thành chuỗi. Số 1 và chuỗi "1" đụng nhau, và mọi khoá là object đều thành cùng một chữ "[object Object]" — nên lưu Minh đã đè mất Lan. Không lỗi, chỉ mất dữ liệu.</p>'],
  [4, 'Map keeps keys as they are',
    '<p>A Map stores keys with their real type: four separate entries, including two different objects. It has a real <code>size</code>, always iterates in insertion order, and its methods say what they do: <code>set</code>, <code>get</code>, <code>has</code>, <code>delete</code>.</p>',
    '<p>Map lưu khoá với đúng kiểu thật: bốn mục riêng, kể cả hai object khác nhau. Nó có <code>size</code> thật, luôn duyệt theo thứ tự thêm vào, và các method nói đúng việc chúng làm: <code>set</code>, <code>get</code>, <code>has</code>, <code>delete</code>.</p>'],
  [5, 'Counting and converting',
    '<p>Counting words is the classic Map job: <code>get</code> the old count or 0, add one, <code>set</code>. One trap: <code>JSON.stringify</code> does not understand Map and prints <code>{}</code>. Convert with <code>Object.fromEntries</code> before sending it to an API.</p>',
    '<p>Đếm từ là việc kinh điển của Map: <code>get</code> số cũ hoặc 0, cộng một, <code>set</code>. Một bẫy: <code>JSON.stringify</code> không hiểu Map và in <code>{}</code>. Đổi bằng <code>Object.fromEntries</code> trước khi gửi lên API.</p>'],
  [6, 'Set',
    '<p>A Set keeps each value once: six tags become three. <code>has</code> is fast even for huge sets. New built-in methods give union, intersection and difference directly. A Set compares with the same rule as <code>===</code>, so two separate objects count as two members.</p>',
    '<p>Set giữ mỗi giá trị một lần: sáu thẻ còn ba. <code>has</code> nhanh kể cả với tập rất lớn. Các method mới có sẵn cho hợp, giao và hiệu. Set so sánh theo đúng luật của <code>===</code>, nên hai object riêng biệt tính là hai phần tử.</p>'],
  [7, 'Reference vs value',
    '<p>The most important slide. A variable does not contain an object; it holds a reference to it, like a name tag. <code>b = a</code> puts a second tag on the same object, so changing through <code>b</code> changes what <code>a</code> sees. And <code>const</code> only stops you moving the tag, not editing the object.</p>',
    '<p>Slide quan trọng nhất. Biến không CHỨA object; nó giữ một tham chiếu tới object, như một bảng tên. <code>b = a</code> gắn thêm một bảng tên lên CÙNG object, nên đổi qua <code>b</code> là đổi thứ <code>a</code> nhìn thấy. Và <code>const</code> chỉ cấm dời bảng tên, không cấm sửa object.</p>'],
  [8, 'Immutable object updates',
    '<p>Spread builds a new object, so <code>older</code> is a different object from <code>user</code>. But spread copies only the first level: the "copy" still shared <code>address</code>, and editing it changed the original city. Copy each level you change, or use <code>structuredClone</code> for a full deep copy.</p>',
    '<p>Spread tạo object mới, nên <code>older</code> là object khác <code>user</code>. Nhưng spread chỉ chép tầng đầu: "bản sao" vẫn dùng chung <code>address</code>, và sửa nó đã đổi luôn thành phố gốc. Chép từng tầng bạn đổi, hoặc dùng <code>structuredClone</code> để chép sâu toàn bộ.</p>'],
  [9, 'Immutable array updates',
    '<p><code>sort()</code> sorted the original and returned the same array. The newer <code>toSorted</code>, <code>toReversed</code> and <code>with</code> return new arrays and leave the original alone. Adding, removing and toggling todos without mutation uses spread, <code>filter</code> and <code>map</code>, and reuses untouched items.</p>',
    '<p><code>sort()</code> đã sắp xếp mảng gốc và trả về chính mảng đó. Các method mới <code>toSorted</code>, <code>toReversed</code> và <code>with</code> trả mảng mới, để nguyên mảng gốc. Thêm, xoá, đánh dấu todo mà không sửa dùng spread, <code>filter</code> và <code>map</code>, và dùng lại các phần tử không đổi.</p>'],
  [10, 'Mutating vs non-mutating methods',
    '<p>Keep this table in your head. The left column changes the array in place — fine for a local variable, a bug on React state. The right column returns something new. The three-line recipe at the bottom covers almost every list update you will write.</p>',
    '<p>Giữ bảng này trong đầu. Cột trái sửa mảng tại chỗ — ổn với biến cục bộ, là bug với state React. Cột phải trả về thứ mới. Công thức ba dòng ở dưới phủ gần hết mọi lần cập nhật danh sách bạn sẽ viết.</p>'],
  [11, 'freeze is shallow',
    '<p><code>Object.freeze</code> made the assignment throw in strict mode, but the inner array still accepted <code>push</code>: freezing is shallow, like spread. Use it for constants and to catch accidental writes, not as a deep lock.</p>',
    '<p><code>Object.freeze</code> làm phép gán ném lỗi ở strict mode, nhưng mảng bên trong vẫn nhận <code>push</code>: đóng băng là nông, giống spread. Dùng nó cho hằng số và để bắt lần ghi vô ý, không phải khoá sâu.</p>'],
  [12, 'Why React cares',
    '<p>A fifteen-line imitation of React’s check. After pushing into the existing array and setting the same object, the reference is unchanged, so the "render" is skipped although the data changed. Building a new object makes the check see a change. Real React uses <code>Object.is</code> the same way.</p>',
    '<p>Một bản bắt chước mười lăm dòng phép kiểm của React. Sau khi push vào mảng cũ rồi set lại chính object đó, tham chiếu không đổi, nên "render" bị bỏ qua dù dữ liệu đã đổi. Dựng object mới thì phép kiểm thấy thay đổi. React thật dùng <code>Object.is</code> đúng như vậy.</p>'],
  [13, 'Summary & practice',
    '<p>The practice functions are the ones you will write in every to-do or shopping app. The "Done when" checks are about references: the originals must be untouched, and unchanged items must be the very same objects.</p>',
    '<p>Các hàm luyện tập chính là những hàm bạn sẽ viết trong mọi app việc cần làm hay giỏ hàng. Phần "Xong khi" kiểm về tham chiếu: bản gốc phải nguyên vẹn, và các phần tử không đổi phải là chính các object cũ.</p>'],
]);

export default {
  title: '11.4 — Map, Set and immutability|||11.4 — Map, Set và tư duy bất biến',
  slug: 'wf-11-4-map-set-immutable',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Vì sao object làm từ điển dễ mất dữ liệu, Map và Set, tham chiếu khác giá trị, cập nhật object/mảng bất biến (spread, toSorted, structuredClone), spread và freeze chỉ nông, vì sao React cần điều này — chạy thật trong Chromium.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>The right container — and the habit of replacing instead of changing</h2>
<p class="lead">After this lesson you can choose between a plain object and a <code>Map</code> for a dictionary, remove duplicates and compare groups with <code>Set</code>, explain why <code>{ x: 1 } === { x: 1 }</code> is <code>false</code>, and update nested objects and arrays without touching the originals. The last skill is the one React relies on: React decides whether to redraw the screen by comparing references, so code that mutates state produces the most common beginner bug of all — "I changed the data but nothing updated".</p>

<h3>Problem 1 — an object as a dictionary loses data</h3>
${ma('javascript', CODE['11-4/object-as-map.mjs'])}
${ra(OUT['11-4/object-as-map'])}
<p>Object keys are always strings. JavaScript silently runs <code>String(key)</code> on whatever you use: the number <code>1</code> becomes <code>'1'</code> and collides with the real string; every object becomes the text <code>"[object Object]"</code>, so storing Minh overwrote Lan. The first two output lines show the damage. A <code>Map</code> (lines 3–4) keeps keys with their real type, so all four entries survive, including two object keys.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Key types</span><span class="v">Object: strings (and symbols) only. Map: anything — numbers, objects, DOM elements.</span></div>
  <div class="kv"><span class="k">Size</span><span class="v">Object: <code>Object.keys(o).length</code>. Map: <code>m.size</code>.</span></div>
  <div class="kv"><span class="k">Order</span><span class="v">Object: integer-like keys come first, then insertion order. Map: always insertion order.</span></div>
  <div class="kv"><span class="k">Surprise keys</span><span class="v">Object: inherits from <code>Object.prototype</code> (lesson 11.3), so <code>'toString' in o</code> is true. Map: starts truly empty.</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">Object: works. Map: convert first (next example).</span></div>
</div>

<h3>Map in practice</h3>
${ma('javascript', CODE['11-4/map-api.mjs'])}
${ra(OUT['11-4/map-api'])}
<p>The counting loop is the pattern to memorise: <code>freq.set(w, (freq.get(w) ?? 0) + 1)</code> — read the old count or 0, add one, store. <code>??</code> is the "nullish" operator: use the right side only when the left is <code>null</code> or <code>undefined</code> (unlike <code>||</code>, it keeps a real 0).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a Map sent to an API arrives empty.</strong> <code>JSON.stringify(map)</code> returns <code>{}</code> with no warning (output line 6), so the server receives nothing. Convert first with <code>Object.fromEntries(map)</code>, and back with <code>new Map(Object.entries(obj))</code>. The same applies to <code>localStorage</code>, which stores only strings.</p></div>

<h3>Set — each value once</h3>
${ma('javascript', CODE['11-4/set.mjs'])}
${ra(OUT['11-4/set'])}
<p>Turning an array into a Set and back (<code>[...new Set(arr)]</code>) is the shortest way to remove duplicates. <code>has</code> is fast even for a million items, whereas <code>array.includes</code> must scan the array. Modern browsers (the Chromium used here included) have <code>union</code>, <code>intersection</code> and <code>difference</code> built in. The last line is important: a Set uses <code>===</code>-style equality, so two separate objects with the same content are two members.</p>

<h3>The core idea: reference versus value</h3>
${ma('javascript', CODE['11-4/reference.mjs'])}
${ra(OUT['11-4/reference'])}
<p>Numbers, strings and booleans are <strong>values</strong>: copying one copies the value. Objects and arrays are different: a variable holds a <strong>reference</strong> — think of a name tag stuck on the object. <code>const b = a</code> does not copy anything; it sticks a second name tag on the <em>same</em> object, so changing <code>b.name</code> changes what <code>a</code> sees. And <code>===</code> on objects asks "are these the same object?", never "do they look alike?".</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Variables</span><span class="lz-t">a, b</span><span class="lz-d">Two name tags. Copying a variable copies the tag, not the object.</span></div>
<div class="lz-layer"><span class="lz-k">Memory</span><span class="lz-t">{ name: 'Minh' }</span><span class="lz-d">One object. Every tag sees the same contents.</span></div>
<div class="lz-layer"><span class="lz-k">Comparison</span><span class="lz-t">a === b</span><span class="lz-d">True only if both tags point at the very same object.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>const</code> does not mean "cannot change".</strong> <code>const config = { theme: 'light' }</code> then <code>config.theme = 'dark'</code> works (last output line). <code>const</code> only forbids pointing the name at a different object. To prevent edits you need <code>Object.freeze</code> (below) — or, better, the discipline of not mutating.</p></div>

<h3>Immutable updates for objects</h3>
<p><strong>Immutable</strong> update means: never change the existing object; build a new one that contains the change.</p>
${ma('javascript', CODE['11-4/immutable-update.mjs'])}
${ra(OUT['11-4/immutable-update'])}
<ol>
<li><code>{ ...user, age: 21 }</code> builds a new object: the original still says 20, and <code>user === older</code> is false.</li>
<li>Spread is <strong>shallow</strong>: it copies the first level only. <code>moved.address</code> is the <em>same</em> address object as <code>user.address</code>, so editing it changed the original — line 2 says Da Nang.</li>
<li>The correct version copies every level it changes: <code>{ ...user, address: { ...user.address, city: 'Hue' } }</code>. Line 3: the original kept its city (still Da Nang from step 2's accident), the new one says Hue.</li>
<li><code>structuredClone</code> makes a full deep copy; editing the clone did not touch <code>user</code>.</li>
</ol>

<h3>Immutable updates for arrays</h3>
${ma('javascript', CODE['11-4/array-immutable.mjs'])}
${ra(OUT['11-4/array-immutable'])}
<p><code>sort()</code> sorted the original in place and returned the very same array (<code>same? true</code>). The ES2023 methods <code>toSorted</code>, <code>toReversed</code> and <code>with(index, value)</code> do the same jobs but return new arrays. The todo example is the recipe you will use constantly:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Add</span><span class="lz-t">[...todos, item]</span><span class="lz-d">New array, old items + one.</span></div>
<div class="lz-step"><span class="lz-k">Remove</span><span class="lz-t">todos.filter(t =&gt; t.id !== id)</span><span class="lz-d">New array without that item.</span></div>
<div class="lz-step"><span class="lz-k">Update one</span><span class="lz-t">todos.map(t =&gt; t.id === id ? { ...t, done: true } : t)</span><span class="lz-d">New array; only the changed item is a new object, the rest are reused (<code>unchanged item reused? true</code>).</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mutate (avoid on state)</span><span class="v"><code>push</code>, <code>pop</code>, <code>shift</code>, <code>splice</code>, <code>sort</code>, <code>reverse</code>, <code>fill</code>, <code>arr[i] = x</code></span></div>
  <div class="kv"><span class="k">Return new (safe)</span><span class="v">spread, <code>map</code>, <code>filter</code>, <code>slice</code>, <code>concat</code>, <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code>, <code>with</code></span></div>
</div>

<h3>Object.freeze — also shallow</h3>
${ma('javascript', CODE['11-4/freeze.mjs'])}
${ra(OUT['11-4/freeze'])}
<p>In a module (strict mode) writing to a frozen property throws, which is a useful alarm during development. But the nested array was not frozen and accepted <code>push</code>. Freeze is a guard for constants, not a deep lock.</p>

<h3>Why React cares — a fifteen-line imitation</h3>
${ma('javascript', CODE['11-4/fake-react.mjs'])}
${ra(OUT['11-4/fake-react'])}
<p>React's <code>useState</code> setter does essentially this check with <code>Object.is</code>. Mutate the array and pass the same object back: the reference did not change, so React assumes nothing changed and skips re-rendering — the data is new, the screen is old. Build a new object and the change is seen. This is also why immutable updates are cheap to detect: comparing two references is one operation, no matter how big the data is.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>items.push(x); setItems(items)</code>.</strong> It is the classic React bug and it passes every test that only checks the data. Write <code>setItems([...items, x])</code> (or <code>setItems(prev =&gt; [...prev, x])</code>). In development, wrapping your initial data in <code>Object.freeze</code> turns an accidental mutation into an immediate error.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Write three pure functions (they must not change their inputs):</p>
<ul>
<li><code>toggleTodo(todos, id)</code> — returns a new array where that todo's <code>done</code> is flipped.</li>
<li><code>addTag(todo, tag)</code> — returns a new todo whose <code>tags</code> array contains the tag once (use a Set to avoid duplicates).</li>
<li><code>groupByStatus(todos)</code> — returns a <code>Map</code> with keys <code>'done'</code> and <code>'open'</code>, each holding an array of todos.</li>
</ul>
<p><strong>Done when:</strong> after <code>const next = toggleTodo(todos, 2)</code>, <code>todos[1].done</code> is unchanged, <code>next !== todos</code>, <code>next[0] === todos[0]</code> (untouched item reused) and <code>next[1] !== todos[1]</code>; <code>addTag</code> called twice with <code>'js'</code> gives one <code>'js'</code>; and <code>groupByStatus</code> returns a Map whose <code>size</code> is 2. Code Lab module 11.4 checks these references for you.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Map</span><span class="v">bảng ánh xạ — cặp khoá/giá trị, khoá giữ đúng kiểu.</span></div>
  <div class="kv"><span class="k">Set</span><span class="v">tập hợp — mỗi giá trị xuất hiện một lần.</span></div>
  <div class="kv"><span class="k">reference</span><span class="v">tham chiếu — "bảng tên" trỏ tới một object.</span></div>
  <div class="kv"><span class="k">primitive value</span><span class="v">giá trị nguyên thuỷ — số, chuỗi, boolean… chép là chép giá trị.</span></div>
  <div class="kv"><span class="k">mutate</span><span class="v">sửa tại chỗ — thay đổi chính object/mảng đang có.</span></div>
  <div class="kv"><span class="k">immutable update</span><span class="v">cập nhật bất biến — tạo bản mới chứa thay đổi, giữ nguyên bản cũ.</span></div>
  <div class="kv"><span class="k">shallow / deep copy</span><span class="v">chép nông / chép sâu — chỉ tầng đầu / mọi tầng.</span></div>
  <div class="kv"><span class="k">spread (...)</span><span class="v">toán tử trải — chép các phần tử/thuộc tính vào mảng/object mới.</span></div>
  <div class="kv"><span class="k">nullish (??)</span><span class="v">toán tử "rỗng" — lấy vế phải khi vế trái là null/undefined.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Use <strong>Map</strong> when keys are not plain strings or when you need size and guaranteed order; convert before JSON.</li>
  <li>Use <strong>Set</strong> for uniqueness and fast membership tests; it compares like <code>===</code>.</li>
  <li>Objects and arrays are handled by <strong>reference</strong>; <code>===</code> asks "same object?", and <code>const</code> does not freeze contents.</li>
  <li>Update immutably: spread, <code>map</code>, <code>filter</code>, <code>toSorted</code>, <code>with</code> — never <code>push</code>/<code>sort</code> on state.</li>
  <li>Spread and <code>Object.freeze</code> are <strong>shallow</strong>; copy each level you change or use <code>structuredClone</code>.</li>
  <li>React detects change by reference — a mutated object looks "unchanged".</li>
</ul>
${nguon('📘', 'javascript.info — Map and Set', 'Methods, iteration, and conversions to and from objects', 'https://javascript.info/map-set')}
${nguon('📗', 'react.dev — Updating Objects in State', 'The official explanation of why React needs new objects, with exercises', 'https://react.dev/learn/updating-objects-in-state')}
${lienKet({ khoa: 'react', bai: 'rx-2-3-object-array', title: 'React 2.3 — updating objects and arrays immutably', sub: 'Object.is, spread and toSorted inside real React components', cta: 'Open lesson' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-2-2-destructuring-spread-modules', title: 'FER202 (Academy) — destructuring, spread and modules', sub: 'The spread syntax as the FER202 syllabus teaches it', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Đúng loại "hộp chứa" — và thói quen THAY thay vì SỬA</h2>
<p class="lead">Học xong bài này bạn chọn được giữa object thường và <code>Map</code> cho một từ điển, xoá trùng và so sánh nhóm bằng <code>Set</code>, giải thích vì sao <code>{ x: 1 } === { x: 1 }</code> là <code>false</code>, và cập nhật object, mảng lồng nhau mà không chạm vào bản gốc. Kỹ năng cuối là thứ React dựa vào: React quyết định có vẽ lại màn hình hay không bằng cách so tham chiếu, nên code sửa trực tiếp state sinh ra bug phổ biến nhất của người mới — "tôi đã đổi dữ liệu mà chẳng có gì cập nhật".</p>

<h3>Vấn đề 1 — object làm từ điển làm mất dữ liệu</h3>
${ma('javascript', CODE['11-4/object-as-map.mjs'])}
${ra(OUT['11-4/object-as-map'])}
<p>Khoá của object luôn là chuỗi. JavaScript lặng lẽ chạy <code>String(key)</code> trên mọi thứ bạn dùng: số <code>1</code> thành <code>'1'</code> và đụng với chuỗi thật; mọi object thành chữ <code>"[object Object]"</code>, nên lưu Minh đã đè mất Lan. Hai dòng output đầu cho thấy thiệt hại. <code>Map</code> (dòng 3–4) giữ khoá đúng kiểu thật, nên cả bốn mục còn nguyên, kể cả hai khoá là object.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểu khoá</span><span class="v">Object: chỉ chuỗi (và symbol). Map: mọi thứ — số, object, phần tử DOM.</span></div>
  <div class="kv"><span class="k">Kích thước</span><span class="v">Object: <code>Object.keys(o).length</code>. Map: <code>m.size</code>.</span></div>
  <div class="kv"><span class="k">Thứ tự</span><span class="v">Object: khoá dạng số nguyên đứng trước, rồi theo thứ tự thêm. Map: luôn theo thứ tự thêm.</span></div>
  <div class="kv"><span class="k">Khoá bất ngờ</span><span class="v">Object: kế thừa từ <code>Object.prototype</code> (bài 11.3), nên <code>'toString' in o</code> là true. Map: rỗng thật sự.</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">Object: chạy được. Map: phải đổi trước (ví dụ sau).</span></div>
</div>

<h3>Map trong thực tế</h3>
${ma('javascript', CODE['11-4/map-api.mjs'])}
${ra(OUT['11-4/map-api'])}
<p>Vòng đếm là mẫu cần thuộc: <code>freq.set(w, (freq.get(w) ?? 0) + 1)</code> — đọc số cũ hoặc 0, cộng một, lưu lại. <code>??</code> là toán tử "nullish": chỉ dùng vế phải khi vế trái là <code>null</code> hoặc <code>undefined</code> (khác <code>||</code>, nó giữ được số 0 thật).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — Map gửi lên API tới nơi thì rỗng.</strong> <code>JSON.stringify(map)</code> trả <code>{}</code> mà không cảnh báo (dòng output 6), nên server nhận về không có gì. Đổi trước bằng <code>Object.fromEntries(map)</code>, và đổi ngược bằng <code>new Map(Object.entries(obj))</code>. Với <code>localStorage</code> cũng vậy, vì nó chỉ lưu chuỗi.</p></div>

<h3>Set — mỗi giá trị một lần</h3>
${ma('javascript', CODE['11-4/set.mjs'])}
${ra(OUT['11-4/set'])}
<p>Đổi mảng thành Set rồi đổi lại (<code>[...new Set(arr)]</code>) là cách ngắn nhất để xoá trùng. <code>has</code> nhanh kể cả với một triệu phần tử, còn <code>array.includes</code> phải quét cả mảng. Trình duyệt hiện đại (kể cả Chromium dùng ở đây) có sẵn <code>union</code>, <code>intersection</code> và <code>difference</code>. Dòng cuối quan trọng: Set so bằng kiểu <code>===</code>, nên hai object riêng có cùng nội dung là hai phần tử.</p>

<h3>Ý cốt lõi: tham chiếu và giá trị</h3>
${ma('javascript', CODE['11-4/reference.mjs'])}
${ra(OUT['11-4/reference'])}
<p>Số, chuỗi và boolean là <strong>giá trị</strong>: chép là chép giá trị. Object và mảng khác: biến giữ một <strong>tham chiếu</strong> — hãy nghĩ tới một bảng tên dán lên object. <code>const b = a</code> không chép gì; nó dán bảng tên thứ hai lên <em>cùng</em> object, nên đổi <code>b.name</code> là đổi thứ <code>a</code> nhìn thấy. Và <code>===</code> trên object hỏi "có phải cùng một object không?", không bao giờ hỏi "trông có giống nhau không?".</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Biến</span><span class="lz-t">a, b</span><span class="lz-d">Hai bảng tên. Chép biến là chép bảng tên, không chép object.</span></div>
<div class="lz-layer"><span class="lz-k">Bộ nhớ</span><span class="lz-t">{ name: 'Minh' }</span><span class="lz-d">Một object. Mọi bảng tên thấy cùng nội dung.</span></div>
<div class="lz-layer"><span class="lz-k">So sánh</span><span class="lz-t">a === b</span><span class="lz-d">Chỉ đúng khi cả hai bảng tên trỏ vào đúng một object.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>const</code> không có nghĩa "không đổi được".</strong> <code>const config = { theme: 'light' }</code> rồi <code>config.theme = 'dark'</code> vẫn chạy (dòng output cuối). <code>const</code> chỉ cấm trỏ cái tên sang object khác. Muốn chặn sửa thì cần <code>Object.freeze</code> (bên dưới) — hoặc tốt hơn, kỷ luật không sửa tại chỗ.</p></div>

<h3>Cập nhật bất biến cho object</h3>
<p>Cập nhật <strong>bất biến (immutable)</strong> nghĩa là: không bao giờ sửa object đang có; dựng object mới chứa thay đổi.</p>
${ma('javascript', CODE['11-4/immutable-update.mjs'])}
${ra(OUT['11-4/immutable-update'])}
<ol>
<li><code>{ ...user, age: 21 }</code> dựng object mới: bản gốc vẫn là 20, và <code>user === older</code> là false.</li>
<li>Spread là <strong>nông</strong>: chỉ chép tầng đầu. <code>moved.address</code> là <em>cùng</em> object địa chỉ với <code>user.address</code>, nên sửa nó đã đổi luôn bản gốc — dòng 2 ra Da Nang.</li>
<li>Bản đúng chép mọi tầng mà nó đổi: <code>{ ...user, address: { ...user.address, city: 'Hue' } }</code>. Dòng 3: bản gốc giữ thành phố của nó (vẫn là Da Nang do tai nạn ở bước 2), bản mới là Hue.</li>
<li><code>structuredClone</code> chép sâu toàn bộ; sửa bản sao không chạm tới <code>user</code>.</li>
</ol>

<h3>Cập nhật bất biến cho mảng</h3>
${ma('javascript', CODE['11-4/array-immutable.mjs'])}
${ra(OUT['11-4/array-immutable'])}
<p><code>sort()</code> sắp xếp tại chỗ mảng gốc và trả về chính mảng đó (<code>same? true</code>). Các method ES2023 <code>toSorted</code>, <code>toReversed</code> và <code>with(index, value)</code> làm cùng việc nhưng trả mảng mới. Ví dụ todo là công thức bạn sẽ dùng liên tục:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Thêm</span><span class="lz-t">[...todos, item]</span><span class="lz-d">Mảng mới, các phần tử cũ + một.</span></div>
<div class="lz-step"><span class="lz-k">Xoá</span><span class="lz-t">todos.filter(t =&gt; t.id !== id)</span><span class="lz-d">Mảng mới không có phần tử đó.</span></div>
<div class="lz-step"><span class="lz-k">Sửa một</span><span class="lz-t">todos.map(t =&gt; t.id === id ? { ...t, done: true } : t)</span><span class="lz-d">Mảng mới; chỉ phần tử bị đổi là object mới, phần còn lại dùng lại (<code>unchanged item reused? true</code>).</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Sửa tại chỗ (tránh với state)</span><span class="v"><code>push</code>, <code>pop</code>, <code>shift</code>, <code>splice</code>, <code>sort</code>, <code>reverse</code>, <code>fill</code>, <code>arr[i] = x</code></span></div>
  <div class="kv"><span class="k">Trả bản mới (an toàn)</span><span class="v">spread, <code>map</code>, <code>filter</code>, <code>slice</code>, <code>concat</code>, <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code>, <code>with</code></span></div>
</div>

<h3>Object.freeze — cũng chỉ nông</h3>
${ma('javascript', CODE['11-4/freeze.mjs'])}
${ra(OUT['11-4/freeze'])}
<p>Trong module (strict mode) ghi vào thuộc tính đã đóng băng sẽ ném lỗi — một chuông báo hữu ích khi phát triển. Nhưng mảng lồng bên trong không bị đóng băng và vẫn nhận <code>push</code>. Freeze là lính gác cho hằng số, không phải khoá sâu.</p>

<h3>Vì sao React quan tâm — bản bắt chước mười lăm dòng</h3>
${ma('javascript', CODE['11-4/fake-react.mjs'])}
${ra(OUT['11-4/fake-react'])}
<p>Hàm set của <code>useState</code> trong React làm đúng phép kiểm này bằng <code>Object.is</code>. Sửa mảng rồi đưa lại chính object đó: tham chiếu không đổi, nên React cho rằng không có gì thay đổi và bỏ qua render — dữ liệu mới, màn hình cũ. Dựng object mới thì thay đổi được nhìn thấy. Đây cũng là lý do cập nhật bất biến rẻ để phát hiện: so hai tham chiếu chỉ là một phép tính, dù dữ liệu lớn cỡ nào.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>items.push(x); setItems(items)</code>.</strong> Đây là bug React kinh điển và nó qua được mọi test chỉ kiểm dữ liệu. Hãy viết <code>setItems([...items, x])</code> (hoặc <code>setItems(prev =&gt; [...prev, x])</code>). Khi phát triển, bọc dữ liệu ban đầu trong <code>Object.freeze</code> sẽ biến một lần sửa vô ý thành lỗi ngay lập tức.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Viết ba hàm thuần (không được sửa đầu vào):</p>
<ul>
<li><code>toggleTodo(todos, id)</code> — trả mảng mới trong đó <code>done</code> của todo đó bị đảo.</li>
<li><code>addTag(todo, tag)</code> — trả todo mới có mảng <code>tags</code> chứa thẻ đúng một lần (dùng Set để tránh trùng).</li>
<li><code>groupByStatus(todos)</code> — trả về một <code>Map</code> có khoá <code>'done'</code> và <code>'open'</code>, mỗi khoá giữ một mảng todo.</li>
</ul>
<p><strong>Xong khi:</strong> sau <code>const next = toggleTodo(todos, 2)</code>, <code>todos[1].done</code> không đổi, <code>next !== todos</code>, <code>next[0] === todos[0]</code> (phần tử không đổi được dùng lại) và <code>next[1] !== todos[1]</code>; gọi <code>addTag</code> hai lần với <code>'js'</code> chỉ ra một <code>'js'</code>; và <code>groupByStatus</code> trả về Map có <code>size</code> là 2. Code Lab module 11.4 kiểm các tham chiếu này cho bạn.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Map</span><span class="v">bảng ánh xạ — cặp khoá/giá trị, khoá giữ đúng kiểu.</span></div>
  <div class="kv"><span class="k">Set</span><span class="v">tập hợp — mỗi giá trị xuất hiện một lần.</span></div>
  <div class="kv"><span class="k">reference</span><span class="v">tham chiếu — "bảng tên" trỏ tới một object.</span></div>
  <div class="kv"><span class="k">primitive value</span><span class="v">giá trị nguyên thuỷ — số, chuỗi, boolean… chép là chép giá trị.</span></div>
  <div class="kv"><span class="k">mutate</span><span class="v">sửa tại chỗ — thay đổi chính object/mảng đang có.</span></div>
  <div class="kv"><span class="k">immutable update</span><span class="v">cập nhật bất biến — tạo bản mới chứa thay đổi, giữ nguyên bản cũ.</span></div>
  <div class="kv"><span class="k">shallow / deep copy</span><span class="v">chép nông / chép sâu — chỉ tầng đầu / mọi tầng.</span></div>
  <div class="kv"><span class="k">spread (...)</span><span class="v">toán tử trải — chép các phần tử/thuộc tính vào mảng/object mới.</span></div>
  <div class="kv"><span class="k">nullish (??)</span><span class="v">toán tử "rỗng" — lấy vế phải khi vế trái là null/undefined.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Dùng <strong>Map</strong> khi khoá không phải chuỗi thường hoặc khi cần kích thước và thứ tự chắc chắn; đổi trước khi ra JSON.</li>
  <li>Dùng <strong>Set</strong> cho tính duy nhất và kiểm "có trong tập" nhanh; nó so như <code>===</code>.</li>
  <li>Object và mảng đi theo <strong>tham chiếu</strong>; <code>===</code> hỏi "cùng object?", và <code>const</code> không đóng băng nội dung.</li>
  <li>Cập nhật bất biến: spread, <code>map</code>, <code>filter</code>, <code>toSorted</code>, <code>with</code> — không bao giờ <code>push</code>/<code>sort</code> trên state.</li>
  <li>Spread và <code>Object.freeze</code> đều <strong>nông</strong>; chép từng tầng bạn đổi hoặc dùng <code>structuredClone</code>.</li>
  <li>React phát hiện thay đổi bằng tham chiếu — object bị sửa tại chỗ trông như "không đổi".</li>
</ul>
${nguon('📘', 'javascript.info — Map and Set', 'Method, cách duyệt, và chuyển đổi qua lại với object', 'https://javascript.info/map-set')}
${nguon('📗', 'react.dev — Updating Objects in State', 'Giải thích chính thức vì sao React cần object mới, có bài tập', 'https://react.dev/learn/updating-objects-in-state')}
${lienKet({ khoa: 'react', bai: 'rx-2-3-object-array', title: 'React 2.3 — cập nhật object và mảng bất biến', sub: 'Object.is, spread và toSorted trong component React thật', cta: 'Mở bài' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-2-2-destructuring-spread-modules', title: 'FER202 (Academy) — destructuring, spread và module', sub: 'Cú pháp spread theo đúng giáo trình FER202', cta: 'Mở bài' })}
</div>
`,
};
