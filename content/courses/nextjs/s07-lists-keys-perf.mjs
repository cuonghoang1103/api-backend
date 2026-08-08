/**
 * Next.js & React — Chương 7: Danh sách, key, reconciliation & hiệu năng render.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output đã CHẠY THẬT (react-dom/client + act, scratchpad/nextjs-verify/c7.mjs):
 *   - React.memo: con thường render 3 lần / con memo render 1 (props không đổi)
 *   - reconciliation đổi type div→section: ["mount","unmount","mount"] (remount)
 */

export default {
  title: 'Chapter 7 — Lists, keys & render performance|||Chương 7 — Danh sách, key & hiệu năng render',
  description: 'React quyết cái gì render lại thế nào: reconciliation theo vị trí + type, key làm danh tính trong danh sách (và bug key-theo-chỉ-số), vì sao component render lại, React.memo, và đo trước khi tối ưu.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Reconciliation: how React decides what changed|||7.1 — Reconciliation: React quyết cái gì đã đổi',
      slug: 'nextjs-7-1-reconciliation',
      type: 'VIDEO',
      isFreePreview: false,
      // Video: "Understanding React's UI Rendering Process".
      video: { url: 'https://youtu.be/i793Qm6kv3U', durationSeconds: 0 },
      description: 'React so cây element mới với cây cũ theo vị trí và type: cùng type thì cập nhật tại chỗ (giữ state), khác type thì gỡ và dựng lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>How React turns a new description into minimal DOM changes</h2>
<p class="lead">Chapter 1 said you describe the UI and React updates the DOM. This lesson is <em>how</em>. After a render, React holds two element trees — the previous one and the new one — and walks them together, deciding at each position: update this node, or throw it away and build a new one. That process is <strong>reconciliation</strong>.</p>

<h3>The rule: compare by position, then by type</h3>
<p>At each spot in the tree, React looks at the element that was there before and the element that is there now:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Same type</span><span class="v">(both <code>&lt;div&gt;</code>, or both <code>&lt;Profile&gt;</code>) → React <strong>keeps the same DOM node / component instance</strong> and just updates the changed attributes and children. State is preserved.</span></div>
  <div class="kv"><span class="k">Different type</span><span class="v">(<code>&lt;div&gt;</code> became <code>&lt;section&gt;</code>, or <code>&lt;Login&gt;</code> became <code>&lt;Dashboard&gt;</code>) → React <strong>destroys the old subtree and builds a new one</strong>. State and effects are reset.</span></div>
</div>

<h3>Seeing it happen</h3>
<p>A child component logs "mount" on mount and "unmount" on unmount. We render it inside a <code>&lt;div&gt;</code>, then flip the wrapper to a <code>&lt;section&gt;</code> — same position, different type. Captured live:</p>
<div class="out">["mount","unmount","mount"]</div>
<p>Read the sequence: first mount inside the <code>&lt;div&gt;</code>; then when the wrapper type changed to <code>&lt;section&gt;</code>, React <strong>unmounted the old child and mounted a fresh one</strong>. The child had no reason to be recreated — its own code was identical — but because its parent's <em>type</em> changed, everything below was torn down and rebuilt, losing any state and re-running any effects. Same type would have kept it alive and just patched it.</p>

<h3>Why this matters in practice</h3>
<p>This explains a whole family of "my input lost its text" / "my component reset for no reason" bugs. If you conditionally render the same component under two different wrappers, or swap its element type, React remounts it and its state vanishes:</p>
<pre><code><span class="tok-comment">// ❌ two different types at the same position → remount, state lost on toggle</span>
{isWide ? &lt;section&gt;&lt;Editor /&gt;&lt;/section&gt; : &lt;div&gt;&lt;Editor /&gt;&lt;/div&gt;}

<span class="tok-comment">// ✅ keep the type stable; vary the class instead</span>
&lt;div className={isWide ? 'wide' : 'narrow'}&gt;&lt;Editor /&gt;&lt;/div&gt;</code></pre>
<p>Position and type are React's notion of "is this the same thing?" Keep them stable and state survives; change them and state resets. The next lesson is about how React tells items in a <em>list</em> apart — which needs one more thing than position: the key.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Preserving and Resetting State</span><span class="lc-sub">Exactly when React keeps vs resets state, with the position-and-type rule spelled out.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>React biến một mô tả mới thành thay đổi DOM tối thiểu thế nào</h2>
<p class="lead">Chương 1 nói bạn mô tả UI và React cập nhật DOM. Bài này là <em>bằng cách nào</em>. Sau một render, React giữ hai cây element — cây trước và cây mới — và đi song song chúng, quyết ở mỗi vị trí: cập nhật nút này, hay vứt đi và dựng nút mới. Quá trình đó là <strong>reconciliation</strong>.</p>

<h3>Quy tắc: so theo vị trí, rồi theo type</h3>
<p>Ở mỗi chỗ trong cây, React nhìn element đã ở đó trước và element đang ở đó bây giờ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cùng type</span><span class="v">(đều <code>&lt;div&gt;</code>, hay đều <code>&lt;Profile&gt;</code>) → React <strong>giữ cùng nút DOM / instance component</strong> và chỉ cập nhật các thuộc tính và con đã đổi. State được giữ.</span></div>
  <div class="kv"><span class="k">Khác type</span><span class="v">(<code>&lt;div&gt;</code> thành <code>&lt;section&gt;</code>, hay <code>&lt;Login&gt;</code> thành <code>&lt;Dashboard&gt;</code>) → React <strong>huỷ nhánh cũ và dựng nhánh mới</strong>. State và effect bị reset.</span></div>
</div>

<h3>Nhìn nó xảy ra</h3>
<p>Một component con log "mount" lúc mount và "unmount" lúc unmount. Ta render nó trong một <code>&lt;div&gt;</code>, rồi lật cái bọc thành <code>&lt;section&gt;</code> — cùng vị trí, khác type. Ghi trực tiếp:</p>
<div class="out">["mount","unmount","mount"]</div>
<p>Đọc trình tự: đầu tiên mount trong <code>&lt;div&gt;</code>; rồi khi type cái bọc đổi thành <code>&lt;section&gt;</code>, React <strong>gỡ con cũ và mount một con mới tinh</strong>. Con chẳng có lý do gì để bị tạo lại — code của chính nó y hệt — nhưng vì <em>type</em> của cha nó đổi, mọi thứ bên dưới bị phá và dựng lại, mất mọi state và chạy lại mọi effect. Cùng type thì đã giữ nó sống và chỉ vá.</p>

<h3>Vì sao điều này quan trọng trên thực tế</h3>
<p>Điều này giải thích cả một họ bug "input mất chữ" / "component tự reset vô cớ". Nếu bạn render có điều kiện cùng một component dưới hai cái bọc khác nhau, hay tráo type element của nó, React remount nó và state biến mất:</p>
<pre><code><span class="tok-comment">// ❌ hai type khác nhau ở cùng vị trí → remount, mất state khi toggle</span>
{isWide ? &lt;section&gt;&lt;Editor /&gt;&lt;/section&gt; : &lt;div&gt;&lt;Editor /&gt;&lt;/div&gt;}

<span class="tok-comment">// ✅ giữ type ổn định; đổi class thay vì đổi type</span>
&lt;div className={isWide ? 'wide' : 'narrow'}&gt;&lt;Editor /&gt;&lt;/div&gt;</code></pre>
<p>Vị trí và type là cách React hiểu "cái này có phải cùng một thứ không?" Giữ chúng ổn định thì state sống sót; đổi chúng thì state reset. Bài sau nói về cách React phân biệt các phần tử trong một <em>danh sách</em> — việc cần thêm một thứ nữa ngoài vị trí: key.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Preserving and Resetting State</span><span class="lc-sub">Chính xác khi nào React giữ vs reset state, với quy tắc vị-trí-và-type nói rõ.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Keys: identity in a list|||7.2 — Key: danh tính trong danh sách',
      slug: 'nextjs-7-2-key',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Trong một danh sách, vị trí không đủ để React biết phần tử nào là phần tử nào. Key làm danh tính — và dùng chỉ số làm key sẽ hỏng khi danh sách sắp lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Why lists need keys — and why the index is the wrong one</h2>
<p class="lead">Reconciliation matches elements by position. That breaks down for a list, because items get inserted, removed and reordered — position alone can't tell React "this row is still the same row, it just moved". The <code>key</code> prop gives each item a stable identity so React can track it across those changes.</p>

<h3>What a key does</h3>
<p>When React reconciles a list, it matches old and new items <em>by key</em>, not by position. A stable key lets it say "the item with key <code>42</code> is still here, just at a new index — keep its DOM node and its state, only move it". Without keys, React falls back to position and gets it wrong the moment the list changes shape.</p>
<pre><code>{todos.map((todo) =&gt; (
  &lt;TodoRow key={todo.id} todo={todo} /&gt;   <span class="tok-comment">// stable id from the data — correct</span>
))}</code></pre>

<h3>The index-as-key bug, concretely</h3>
<p>Using the array index as a key looks fine and works — until the list reorders or an item is inserted or removed from the front. Then the keys no longer identify items; they identify <em>positions</em>, and React attaches the wrong state to the wrong item:</p>
<pre><code>{todos.map((todo, i) =&gt; (
  &lt;TodoRow key={i} todo={todo} /&gt;   <span class="tok-comment">// ❌ key = position, not identity</span>
))}</code></pre>
<p>Picture a list of rows, each with an internal checkbox or a text input (its own state). You tick the second row, then delete the first row. With <code>key={i}</code>, every remaining row shifts up one index — so the row that was index 2 is now index 1. React matches by key (=index), sees "index 1 still exists", and <strong>keeps index 1's old state</strong> — which belonged to a different todo. The checkbox you ticked now appears on the wrong row. The data is fine; the <em>state React kept</em> is attached to the wrong item.</p>

<h3>The rule for keys</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Do</span><span class="v">use a stable, unique id that comes from the data: <code>item.id</code>, a database key, a slug.</span></div>
  <div class="kv"><span class="k">Don't</span><span class="v">use the array index when the list can reorder, or have items inserted/removed anywhere but the end.</span></div>
  <div class="kv"><span class="k">Don't</span><span class="v">use <code>Math.random()</code> or a fresh value each render — that gives every item a new key every time, so React remounts the whole list on every render (slow, and all state lost).</span></div>
  <div class="kv"><span class="k">OK</span><span class="v">index is acceptable only for a static list that never reorders and whose items have no internal state.</span></div>
</div>
<p>Keys must be unique among <em>siblings</em> (not globally) and stable across renders. If your data has no natural id, generate one when the item is created and store it with the item — not in the key expression at render time.</p>

<div class="pitfall">
<p><strong>The tell of a key bug:</strong> state or focus "jumping" to the wrong row after an insert, delete or sort — a checkbox ticks the wrong item, an input keeps text from a deleted neighbour, an animation plays on the wrong card. When list items misbehave after the list changes, suspect <code>key={index}</code> first. Switching to <code>key={item.id}</code> usually fixes it outright.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Vì sao danh sách cần key — và vì sao chỉ số là key sai</h2>
<p class="lead">Reconciliation khớp element theo vị trí. Điều đó đổ vỡ với một danh sách, vì phần tử bị chèn, xoá và sắp lại — riêng vị trí không thể nói với React "hàng này vẫn là hàng cũ, chỉ là đã dịch chỗ". Prop <code>key</code> cho mỗi phần tử một danh tính ổn định để React theo dõi nó qua những thay đổi đó.</p>

<h3>Một key làm gì</h3>
<p>Khi React reconcile một danh sách, nó khớp phần tử cũ và mới <em>theo key</em>, không phải theo vị trí. Một key ổn định cho phép nó nói "phần tử có key <code>42</code> vẫn ở đây, chỉ ở một chỉ số mới — giữ nút DOM và state của nó, chỉ di chuyển thôi". Không có key, React quay về vị trí và làm sai ngay khi danh sách đổi hình dạng.</p>
<pre><code>{todos.map((todo) =&gt; (
  &lt;TodoRow key={todo.id} todo={todo} /&gt;   <span class="tok-comment">// id ổn định từ dữ liệu — đúng</span>
))}</code></pre>

<h3>Bug chỉ-số-làm-key, cụ thể</h3>
<p>Dùng chỉ số mảng làm key trông ổn và chạy được — cho tới khi danh sách sắp lại hoặc một phần tử bị chèn/xoá ở đầu. Khi đó các key không còn định danh phần tử; chúng định danh <em>vị trí</em>, và React gắn nhầm state vào nhầm phần tử:</p>
<pre><code>{todos.map((todo, i) =&gt; (
  &lt;TodoRow key={i} todo={todo} /&gt;   <span class="tok-comment">// ❌ key = vị trí, không phải danh tính</span>
))}</code></pre>
<p>Hình dung một danh sách hàng, mỗi hàng có một checkbox hay một ô nhập nội bộ (state riêng của nó). Bạn tick hàng thứ hai, rồi xoá hàng đầu. Với <code>key={i}</code>, mọi hàng còn lại dịch lên một chỉ số — nên hàng từng là chỉ số 2 giờ là chỉ số 1. React khớp theo key (=chỉ số), thấy "chỉ số 1 vẫn tồn tại", và <strong>giữ state cũ của chỉ số 1</strong> — vốn thuộc về một todo khác. Checkbox bạn tick giờ hiện trên nhầm hàng. Dữ liệu thì ổn; <em>state mà React giữ</em> bị gắn nhầm phần tử.</p>

<h3>Quy tắc cho key</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên</span><span class="v">dùng một id ổn định, duy nhất từ dữ liệu: <code>item.id</code>, một khoá database, một slug.</span></div>
  <div class="kv"><span class="k">Đừng</span><span class="v">dùng chỉ số mảng khi danh sách có thể sắp lại, hoặc bị chèn/xoá ở chỗ khác ngoài cuối.</span></div>
  <div class="kv"><span class="k">Đừng</span><span class="v">dùng <code>Math.random()</code> hay một giá trị mới mỗi render — nó cho mỗi phần tử một key mới mỗi lần, nên React remount cả danh sách mỗi render (chậm, và mất hết state).</span></div>
  <div class="kv"><span class="k">Được</span><span class="v">chỉ số chỉ chấp nhận được cho một danh sách tĩnh không bao giờ sắp lại và phần tử không có state nội bộ.</span></div>
</div>
<p>Key phải duy nhất giữa các <em>anh em</em> (không phải toàn cục) và ổn định qua các render. Nếu dữ liệu không có id tự nhiên, sinh một cái khi phần tử được tạo và lưu nó cùng phần tử — không phải trong biểu thức key lúc render.</p>

<div class="pitfall">
<p><strong>Dấu hiệu của bug key:</strong> state hay focus "nhảy" sang nhầm hàng sau một lần chèn, xoá hay sắp — một checkbox tick nhầm phần tử, một input giữ chữ của hàng xóm đã xoá, một hiệu ứng chạy trên nhầm card. Khi phần tử danh sách cư xử lạ sau khi danh sách đổi, hãy nghi <code>key={index}</code> trước. Đổi sang <code>key={item.id}</code> thường sửa dứt điểm.</p>
</div>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Why components re-render|||7.3 — Vì sao component render lại',
      slug: 'nextjs-7-3-vi-sao-render-lai',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một component render lại khi state của nó đổi, khi cha render lại, hoặc khi context nó đọc đổi. Cha render → cả con render theo, mặc định.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>The three reasons a component re-renders</h2>
<p class="lead">Before optimising anything, you need to know what actually causes a re-render. There are exactly three triggers, and the second one surprises people the most: a component re-renders whenever its parent does, whether or not its props changed.</p>

<h3>The triggers</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Its own state changed</b> — a setter was called (Chapter 3).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Its parent re-rendered</b> — by default, when a component renders, React renders <em>all</em> of its children too, recursively.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>A context it reads changed</b> — every consumer of a context re-renders when the provider's value changes (Chapter 6).</div></div>
</div>

<h3>Trigger 2 is the one to internalise</h3>
<p>When a component re-renders, React re-renders its entire subtree by default — <strong>even children whose props did not change.</strong> A counter at the top of your page, incrementing on each click, re-renders every component below it on every click. Usually this is completely fine: rendering is just calling functions to build element objects, and it's fast. React then reconciles (Lesson 7.1) and touches the DOM only where something actually changed — so a re-render is not a repaint.</p>
<p>This is the key correction to a common misconception: <strong>"re-render" does not mean "update the DOM".</strong> It means "call the component function again to get a fresh description". Most re-renders produce an identical description, React diffs it against the old one, finds no change, and does nothing to the DOM. Re-rendering is cheap far more often than beginners fear.</p>

<h3>When it's actually a problem</h3>
<p>Re-rendering only becomes a performance issue when a component's render is <em>expensive</em> — it sorts a big list, does heavy computation, or renders thousands of nodes — and it re-renders often for no visible change. That is the narrow case the next lesson's tools address. Two guiding facts:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">State lives as low as possible</span><span class="v">keep state in the smallest component that needs it (Chapter 3). A setter high in the tree re-renders everything below; a setter in a leaf re-renders only the leaf.</span></div>
  <div class="kv"><span class="k">Most re-renders are free</span><span class="v">don't optimise a re-render you haven't measured. A cheap component re-rendering often costs nothing worth fixing.</span></div>
</div>
<p>So the first tool against "too many re-renders" is not <code>React.memo</code> — it is <em>where you put your state</em>. Lower state = smaller re-render radius. Reach for memoisation only when structure alone isn't enough and a profiler proves a real cost.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Ba lý do một component render lại</h2>
<p class="lead">Trước khi tối ưu bất cứ thứ gì, bạn cần biết cái gì thật sự gây render lại. Có đúng ba nguyên nhân, và nguyên nhân thứ hai làm người ta bất ngờ nhất: một component render lại mỗi khi cha nó render lại, dù props của nó có đổi hay không.</p>

<h3>Các nguyên nhân</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>State của chính nó đổi</b> — một setter được gọi (Chương 3).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Cha nó render lại</b> — mặc định, khi một component render, React render <em>tất cả</em> các con của nó, đệ quy.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Một context nó đọc đổi</b> — mọi consumer của một context render lại khi value của provider đổi (Chương 6).</div></div>
</div>

<h3>Nguyên nhân 2 là cái cần thấm</h3>
<p>Khi một component render lại, React render lại cả nhánh cây của nó mặc định — <strong>kể cả các con mà props không đổi.</strong> Một bộ đếm ở đầu trang, tăng mỗi cú click, render lại mọi component bên dưới nó ở mỗi cú click. Thường điều này hoàn toàn ổn: render chỉ là gọi hàm để dựng object element, và nó nhanh. React rồi reconcile (Bài 7.1) và chạm DOM chỉ ở chỗ thật sự đổi — nên một render lại không phải một lần vẽ lại.</p>
<p>Đây là chỗ chỉnh quan trọng cho một hiểu lầm phổ biến: <strong>"render lại" không có nghĩa "cập nhật DOM".</strong> Nó nghĩa là "gọi lại hàm component để lấy một mô tả mới". Phần lớn render lại cho ra một mô tả y hệt, React so nó với cái cũ, thấy không đổi, và không làm gì với DOM. Render lại rẻ hơn nhiều so với nỗi sợ của người mới.</p>

<h3>Khi nào nó thật sự là vấn đề</h3>
<p>Render lại chỉ thành vấn đề hiệu năng khi render của một component <em>đắt</em> — nó sắp một danh sách lớn, làm tính toán nặng, hay render hàng nghìn nút — và nó render lại thường xuyên mà chẳng có thay đổi nhìn thấy. Đó là ca hẹp mà công cụ bài sau nhắm tới. Hai sự thật dẫn đường:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">State nằm càng thấp càng tốt</span><span class="v">giữ state trong component nhỏ nhất cần nó (Chương 3). Một setter cao trên cây render lại mọi thứ bên dưới; một setter ở một lá chỉ render lại cái lá.</span></div>
  <div class="kv"><span class="k">Phần lớn render lại là miễn phí</span><span class="v">đừng tối ưu một render lại bạn chưa đo. Một component rẻ render lại thường xuyên chẳng tốn gì đáng sửa.</span></div>
</div>
<p>Vậy công cụ đầu tiên chống "quá nhiều render lại" không phải <code>React.memo</code> — mà là <em>bạn đặt state ở đâu</em>. State thấp hơn = bán kính render lại nhỏ hơn. Với tới memo hoá chỉ khi riêng cấu trúc chưa đủ và một profiler chứng minh một chi phí thật.</p>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — React.memo & skipping re-renders|||7.4 — React.memo & bỏ qua render lại',
      slug: 'nextjs-7-4-react-memo',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'React.memo bọc một component để nó bỏ qua render lại khi props không đổi về tham chiếu — hữu ích nhưng cần props ổn định mới hiệu quả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Telling a component to skip a re-render</h2>
<p class="lead">Lesson 7.3 said a child re-renders whenever its parent does, even with unchanged props. <code>React.memo</code> is how you opt a component out of that: wrap it, and React will skip its re-render when its props are the same as last time.</p>

<h3>What React.memo does</h3>
<pre><code>const Row = React.memo(function Row({ label }) {
  return &lt;li&gt;{label}&lt;/li&gt;;
});</code></pre>
<p>A memoised component compares its new props to its previous props (a shallow <code>Object.is</code> check per prop). If they are all equal, React <strong>reuses last render's output and skips calling the function.</strong> Captured live — a plain child and a memoised child, both under a parent that re-renders three times, with an unchanged prop:</p>
<div class="out">PLAIN child renders (3 parent renders): 3
MEMO  child renders (props unchanged):   1</div>
<p>The plain child rendered on all three parent renders; the memoised child rendered <strong>once</strong> and then skipped the two re-renders where its prop didn't change. That is the whole feature — skip work when the inputs are identical.</p>

<h3>The catch: props must be referentially stable</h3>
<p><code>React.memo</code> compares props with <code>Object.is</code>, so it only helps if the props actually stay equal between renders. Pass a fresh object, array or function as a prop and the memo is defeated — the prop is a new reference every render, so the comparison always says "changed":</p>
<pre><code><span class="tok-comment">// ❌ memo useless — a new object and a new function every render</span>
&lt;Row label="x" style={{ margin: 4 }} onClick={() =&gt; go()} /&gt;

<span class="tok-comment">// ✅ stabilise the references so memo can actually skip</span>
const style = useMemo(() =&gt; ({ margin: 4 }), []);
const onClick = useCallback(() =&gt; go(), []);
&lt;Row label="x" style={style} onClick={onClick} /&gt;</code></pre>
<p>This is why <code>React.memo</code>, <code>useMemo</code> and <code>useCallback</code> travel together: memoising a component is pointless unless its object/function props are also memoised. This coupling is a big part of why the manual approach is fiddly — and why React 19's compiler aims to do it for you.</p>

<h3>When to reach for it</h3>
<p>Use <code>React.memo</code> when a component is <em>expensive to render</em> (a big list row, a heavy chart) <em>and</em> re-renders often with unchanged props. Do not wrap every component in it: the prop comparison itself costs a little, and for cheap components it's slower than just re-rendering. As always — measure first (next lesson), then memo the few components a profiler flags, not everything on principle.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — the feed and message lists memoise their row components, because a list of hundreds of items re-rendering every row on each parent update is measurable, and each row is non-trivial (media, formatting). The stable-reference discipline follows: row callbacks are <code>useCallback</code>'d, and item objects come straight from the store so their reference is stable until the item actually changes. Cheap components elsewhere on the site are left un-memoised on purpose.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Bảo một component bỏ qua một lần render lại</h2>
<p class="lead">Bài 7.3 nói một con render lại mỗi khi cha render lại, dù props không đổi. <code>React.memo</code> là cách bạn cho một component thoát khỏi điều đó: bọc nó, và React sẽ bỏ qua render lại nó khi props của nó giống lần trước.</p>

<h3>React.memo làm gì</h3>
<pre><code>const Row = React.memo(function Row({ label }) {
  return &lt;li&gt;{label}&lt;/li&gt;;
});</code></pre>
<p>Một component memo hoá so props mới với props trước (một phép so nông <code>Object.is</code> mỗi prop). Nếu tất cả bằng nhau, React <strong>tái dùng output của render trước và bỏ qua việc gọi hàm.</strong> Ghi trực tiếp — một con thường và một con memo, cả hai dưới một cha render lại ba lần, với một prop không đổi:</p>
<div class="out">PLAIN child renders (3 parent renders): 3
MEMO  child renders (props unchanged):   1</div>
<p>Con thường render ở cả ba render của cha; con memo render <strong>một</strong> lần rồi bỏ qua hai render mà prop không đổi. Đó là toàn bộ tính năng — bỏ qua việc khi đầu vào y hệt.</p>

<h3>Cái bẫy: props phải ổn định về tham chiếu</h3>
<p><code>React.memo</code> so props bằng <code>Object.is</code>, nên nó chỉ giúp nếu props thật sự giữ bằng nhau giữa các render. Truyền một object, mảng hay hàm mới làm prop là memo bị vô hiệu — prop là một tham chiếu mới mỗi render, nên phép so luôn nói "đã đổi":</p>
<pre><code><span class="tok-comment">// ❌ memo vô dụng — một object mới và một hàm mới mỗi render</span>
&lt;Row label="x" style={{ margin: 4 }} onClick={() =&gt; go()} /&gt;

<span class="tok-comment">// ✅ ổn định tham chiếu để memo thật sự bỏ qua được</span>
const style = useMemo(() =&gt; ({ margin: 4 }), []);
const onClick = useCallback(() =&gt; go(), []);
&lt;Row label="x" style={style} onClick={onClick} /&gt;</code></pre>
<p>Vì thế <code>React.memo</code>, <code>useMemo</code> và <code>useCallback</code> đi cùng nhau: memo hoá một component là vô nghĩa trừ khi các prop object/hàm của nó cũng được memo hoá. Sự ràng buộc này là một phần lớn lý do cách thủ công lằng nhằng — và vì sao compiler của React 19 nhắm làm nó hộ bạn.</p>

<h3>Khi nào với tới nó</h3>
<p>Dùng <code>React.memo</code> khi một component <em>đắt để render</em> (một hàng danh sách lớn, một biểu đồ nặng) <em>và</em> render lại thường xuyên với props không đổi. Đừng bọc mọi component vào nó: bản thân phép so props tốn một chút, và với component rẻ thì nó chậm hơn là cứ render lại. Như mọi khi — đo trước (bài sau), rồi memo vài component mà profiler chỉ ra, không phải mọi thứ theo nguyên tắc.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — danh sách feed và tin nhắn memo hoá các component hàng của chúng, vì một danh sách hàng trăm phần tử render lại từng hàng ở mỗi cập nhật cha là đo được, và mỗi hàng không tầm thường (media, định dạng). Kỷ luật tham-chiếu-ổn-định theo sau: callback của hàng được <code>useCallback</code>, và object phần tử tới thẳng từ store nên tham chiếu của chúng ổn định cho tới khi phần tử thật sự đổi. Các component rẻ ở nơi khác trên site được để không-memo có chủ đích.</p>
</div>
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Measure, don\'t guess|||7.5 — Đo, đừng đoán',
      slug: 'nextjs-7-5-do-dung-doan',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Dùng React DevTools Profiler để tìm render lại thật sự tốn kém trước khi tối ưu. Tối ưu sớm làm code chậm hơn và khó đọc hơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Optimise what the profiler shows, not what you fear</h2>
<p class="lead">Everything in this chapter is a tool, and every tool is misused when applied without measurement. The single most important performance habit in React is the same as in Node: <strong>measure first.</strong> Reach for the profiler before <code>React.memo</code>, not after sprinkling it everywhere.</p>

<h3>The React DevTools Profiler</h3>
<p>Install React Developer Tools (a browser extension) and you get a <strong>Profiler</strong> tab. Hit record, interact with your app, stop, and it shows you — per commit — which components re-rendered, how long each took, and <em>why</em> each one rendered (props changed, state changed, parent rendered, context changed). This turns "I think this is slow" into "this component rendered 40 times and took 8ms each; here's why". You optimise from that, not from a hunch.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Record</b> a real interaction (typing, scrolling, opening a modal).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Read the flamegraph</b> — wide, frequently-highlighted bars are the components costing you time.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Check "why did this render?"</b> — DevTools tells you the trigger, so you fix the actual cause.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Apply the smallest fix</b> — usually moving state lower, sometimes a stable key, occasionally memo. Then re-measure.</div></div>
</div>

<h3>The order of fixes — cheapest and most effective first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Move state down</span><span class="v">shrink the re-render radius by keeping state in the component that needs it (Chapter 3). Free, and often the whole fix.</span></div>
  <div class="kv"><span class="k">2. Fix keys</span><span class="v">a bad key can remount whole subtrees every render; a good one avoids it. Also free.</span></div>
  <div class="kv"><span class="k">3. Lift content up / children as props</span><span class="v">a subtree passed as <code>children</code> doesn't re-render when the parent's state changes — a structural trick before any memo.</span></div>
  <div class="kv"><span class="k">4. Memoise</span><span class="v">React.memo / useMemo / useCallback on the specific expensive components the profiler flagged, with stable props.</span></div>
</div>

<h3>Why premature optimisation actively hurts</h3>
<p>Wrapping everything in <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> before measuring makes things <em>worse</em>: every wrapper adds a dependency comparison and memory overhead on every render, and the code becomes noisier and harder to change. You pay a real, constant cost to avoid re-renders that were free anyway. The discipline is: write it plainly, measure with the profiler, and optimise the few places that measurement proves matter.</p>

<div class="callout ok">
<p><strong>Stage 2 complete.</strong> You now understand how React works under the surface: effects synchronise with the outside world and clean up after themselves; the hooks toolbox covers refs, memoisation, reducers, context and your own hooks; and reconciliation, keys and re-render rules explain what actually updates and when. <strong>Progress Test 2</strong> covers everything so far. Stage 3 changes the game: Next.js, the App Router, and Server Components — where your React runs on a server before it ever reaches the browser.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — memo</span><span class="lc-sub">When memo helps, when it doesn't, and the stable-props requirement in detail.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Render and Commit</span><span class="lc-sub">The render → commit pipeline, the exact model behind this whole chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Tối ưu cái profiler chỉ ra, không phải cái bạn sợ</h2>
<p class="lead">Mọi thứ trong chương này là một công cụ, và mọi công cụ đều bị dùng sai khi áp mà không đo. Thói quen hiệu năng quan trọng nhất trong React giống hệt trong Node: <strong>đo trước.</strong> Với tới profiler trước <code>React.memo</code>, không phải sau khi rắc nó khắp nơi.</p>

<h3>React DevTools Profiler</h3>
<p>Cài React Developer Tools (một extension trình duyệt) và bạn có một tab <strong>Profiler</strong>. Bấm ghi, tương tác với app, dừng, và nó cho bạn xem — theo từng commit — component nào render lại, mỗi cái mất bao lâu, và <em>vì sao</em> mỗi cái render (props đổi, state đổi, cha render, context đổi). Việc này biến "tôi nghĩ cái này chậm" thành "component này render 40 lần và mỗi lần mất 8ms; đây là lý do". Bạn tối ưu từ đó, không phải từ linh cảm.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ghi</b> một tương tác thật (gõ, cuộn, mở một modal).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đọc flamegraph</b> — các thanh rộng, hay được tô sáng là các component tốn thời gian của bạn.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Xem "vì sao cái này render?"</b> — DevTools cho biết nguyên nhân, để bạn sửa đúng gốc.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Áp bản vá nhỏ nhất</b> — thường là đưa state xuống thấp, đôi khi một key ổn định, thỉnh thoảng memo. Rồi đo lại.</div></div>
</div>

<h3>Thứ tự các bản vá — rẻ nhất và hiệu quả nhất trước</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Đưa state xuống</span><span class="v">thu nhỏ bán kính render lại bằng cách giữ state trong component cần nó (Chương 3). Miễn phí, và thường là cả bản vá.</span></div>
  <div class="kv"><span class="k">2. Sửa key</span><span class="v">một key tồi có thể remount cả nhánh cây mỗi render; một key tốt tránh điều đó. Cũng miễn phí.</span></div>
  <div class="kv"><span class="k">3. Nâng nội dung lên / children làm prop</span><span class="v">một nhánh cây truyền làm <code>children</code> không render lại khi state của cha đổi — một mẹo cấu trúc trước bất kỳ memo nào.</span></div>
  <div class="kv"><span class="k">4. Memo hoá</span><span class="v">React.memo / useMemo / useCallback trên đúng các component đắt mà profiler chỉ ra, với props ổn định.</span></div>
</div>

<h3>Vì sao tối ưu sớm gây hại thật sự</h3>
<p>Bọc mọi thứ trong <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> trước khi đo làm mọi thứ <em>tệ hơn</em>: mỗi cái bọc thêm một phép so phụ thuộc và chi phí bộ nhớ ở mỗi render, và code trở nên ồn ào và khó đổi hơn. Bạn trả một chi phí thật, cố định để tránh những render lại vốn miễn phí. Kỷ luật là: viết thẳng, đo bằng profiler, và tối ưu vài chỗ mà phép đo chứng minh có ý nghĩa.</p>

<div class="callout ok">
<p><strong>Hoàn thành Giai đoạn 2.</strong> Giờ bạn hiểu React hoạt động dưới bề mặt: effect đồng bộ với thế giới bên ngoài và tự dọn dẹp; bộ đồ nghề hooks phủ ref, memo hoá, reducer, context và hook tự viết; và reconciliation, key cùng luật render lại giải thích cái gì thật sự cập nhật và khi nào. <strong>Bài kiểm tra tiến độ 2</strong> phủ mọi thứ tới đây. Giai đoạn 3 đổi cuộc chơi: Next.js, App Router, và Server Components — nơi React của bạn chạy trên một server trước khi kịp tới trình duyệt.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — memo</span><span class="lc-sub">Khi memo giúp, khi không, và yêu cầu props ổn định chi tiết.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener">
  <span class="lc-ico">🖼️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Render and Commit</span><span class="lc-sub">Ống render → commit, chính mô hình đằng sau cả chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.6 quiz ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra chương 7',
      slug: 'nextjs-7-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về reconciliation, key, vì sao component render lại, React.memo và đo hiệu năng.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 7: reconciliation by position and type, keys and the index-key bug, why components re-render, React.memo, and measuring before optimising.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 7: reconciliation theo vị trí và type, key và bug key-theo-chỉ-số, vì sao component render lại, React.memo, và đo trước khi tối ưu.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'At a given position, React reuses the existing DOM node / component instance when…|||Ở một vị trí cho trước, React tái dùng nút DOM / instance component đang có khi…',
            options: [
              'the element type is the same as before|||type của element giống trước',
              'the element type is different|||type của element khác',
              'always, regardless of type|||luôn luôn, bất kể type',
              'never|||không bao giờ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You wrap the same <Editor/> in a <div> vs a <section> based on a flag. What happens on toggle?|||Bạn bọc cùng <Editor/> trong <div> vs <section> theo một cờ. Chuyện gì xảy ra khi toggle?',
            options: [
              'Nothing; state is preserved|||Không gì; state được giữ',
              'Editor remounts and loses its state (different parent type)|||Editor remount và mất state (type cha khác)',
              'React throws an error|||React ném lỗi',
              'Only the class changes|||Chỉ class đổi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does a list need keys?|||Vì sao một danh sách cần key?',
            options: [
              'For CSS styling|||Để tạo kiểu CSS',
              'So React can track item identity across insert/remove/reorder, not just position|||Để React theo dõi danh tính phần tử qua chèn/xoá/sắp lại, không chỉ vị trí',
              'To sort the list|||Để sắp xếp danh sách',
              'Keys are optional and do nothing|||Key là tuỳ chọn và không làm gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Using key={index}, you tick row 2\'s checkbox then delete row 1. What goes wrong?|||Dùng key={index}, bạn tick checkbox hàng 2 rồi xoá hàng 1. Sai chỗ nào?',
            options: [
              'Nothing|||Không gì',
              'State attaches by position, so the tick appears on the wrong remaining row|||State gắn theo vị trí, nên dấu tick hiện trên nhầm hàng còn lại',
              'The whole list is deleted|||Cả danh sách bị xoá',
              'The app crashes|||App sập',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which is a BAD choice of key?|||Cái nào là lựa chọn key TỒI?',
            options: [
              'item.id from the database|||item.id từ database',
              'a unique slug|||một slug duy nhất',
              'Math.random() computed at render time|||Math.random() tính lúc render',
              'a stable uuid stored with the item|||một uuid ổn định lưu cùng phần tử',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Which is NOT one of the three reasons a component re-renders?|||Cái nào KHÔNG phải một trong ba lý do một component render lại?',
            options: [
              'Its own state changed|||State của chính nó đổi',
              'Its parent re-rendered|||Cha nó render lại',
              'A context it reads changed|||Một context nó đọc đổi',
              'The browser window was resized|||Cửa sổ trình duyệt bị đổi kích thước',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Does "re-render" mean "update the DOM"?|||"Render lại" có nghĩa là "cập nhật DOM" không?',
            options: [
              'Yes, always|||Có, luôn luôn',
              'No — it means call the component again; React then diffs and touches the DOM only where something changed|||Không — nó nghĩa là gọi lại component; React rồi so và chạm DOM chỉ ở chỗ đổi',
              'Only in production|||Chỉ ở production',
              'Only for memoised components|||Chỉ cho component memo hoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A plain child and a React.memo child both sit under a parent that re-renders 3 times with an unchanged prop. How many times does each render?|||Một con thường và một con React.memo cùng nằm dưới một cha render lại 3 lần với prop không đổi. Mỗi cái render mấy lần?',
            options: [
              'Plain 3, memo 1|||Thường 3, memo 1',
              'Plain 1, memo 3|||Thường 1, memo 3',
              'Both 3|||Cả hai 3',
              'Both 1|||Cả hai 1',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'React.memo is defeated when you pass a prop that is…|||React.memo bị vô hiệu khi bạn truyền một prop mà…',
            options: [
              'a string|||là một chuỗi',
              'a number|||là một số',
              'a fresh object/array/function created every render|||là object/mảng/hàm mới tạo mỗi render',
              'a boolean|||là một boolean',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'The FIRST tool against too many re-renders should be…|||Công cụ ĐẦU TIÊN chống render lại quá nhiều nên là…',
            options: [
              'wrap everything in React.memo|||bọc mọi thứ trong React.memo',
              'measure with the Profiler and move state lower / fix keys before memoising|||đo bằng Profiler và đưa state xuống thấp / sửa key trước khi memo',
              'add useMemo to every value|||thêm useMemo cho mọi giá trị',
              'disable StrictMode|||tắt StrictMode',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
