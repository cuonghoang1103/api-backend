/**
 * Next.js & React — Chương 7: Danh sách, key, reconciliation & hiệu năng render.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output đã CHẠY THẬT (react-dom/client + act, scratchpad/nextjs-verify/c7.mjs):
 *   - React.memo: con thường render 3 lần / con memo render 1 (props không đổi)
 *   - reconciliation đổi type div→section: ["mount","unmount","mount"] (remount)
 */

import G07_1 from './giang/nxj-07-1.mjs';
import G07_2 from './giang/nxj-07-2.mjs';
import G07_3 from './giang/nxj-07-3.mjs';
import G07_4 from './giang/nxj-07-4.mjs';
import G07_5 from './giang/nxj-07-5.mjs';
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
${G07_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> This chapter is a quick React refresher &mdash; the same topic is taught in depth in the <a href="/courses/react">React</a> course (Chapter 1 for lists and keys, Chapter 11 for reconciliation, Chapter 8 for performance). Skim it or skip ahead to <strong>Chapter 8</strong>, where the Next.js-specific material starts. Remember: Next.js is a <em>framework built on React</em> &mdash; every component, prop, state and hook here is still plain React.</div>
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
<pre><code class="language-html"><span class="tok-comment">// ❌ two different types at the same position → remount, state lost on toggle</span>
{isWide ? &lt;section&gt;&lt;Editor /&gt;&lt;/section&gt; : &lt;div&gt;&lt;Editor /&gt;&lt;/div&gt;}

<span class="tok-comment">// ✅ keep the type stable; vary the class instead</span>
&lt;div className={isWide ? 'wide' : 'narrow'}&gt;&lt;Editor /&gt;&lt;/div&gt;</code></pre>
<p>Position and type are React's notion of "is this the same thing?" Keep them stable and state survives; change them and state resets. The next lesson is about how React tells items in a <em>list</em> apart — which needs one more thing than position: the key.</p>

<h3>How React decides what to keep</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Compare position by position</b> — React walks the old tree and the new tree together. It does not search — it looks at the same slot in both.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Same type, same position → keep the node</b> — The DOM element stays, its state stays, and only the changed attributes are written. This is the fast path.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Different type → destroy and rebuild</b> — A <code>&lt;div&gt;</code> that becomes a <code>&lt;section&gt;</code> loses everything inside it, including every child&#39;s state.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Inside a list, the key overrides position</b> — Keys let React match items that moved. Without them it falls back to position, which is why reordering loses state.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a conditional that swaps the wrapper element and silently resets everything inside.</strong> <code>{isWide ? &lt;div className="wide"&gt;{form}&lt;/div&gt; : &lt;section&gt;{form}&lt;/section&gt;}</code> looks like a styling choice. To React the type changed, so it unmounts the whole subtree and mounts a new one: every input clears, every open dropdown closes, every scroll position resets, and any component state inside is gone. It happens at exactly one moment — the width crossing a breakpoint — so it reproduces as &quot;the form clears when I resize the window&quot;. Keep the element type stable and change the class instead, or hoist the shared subtree so it is not re-created.</p></div>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">react.dev — Preserving and resetting state</span><span class="lc-sub">Position, type and key — the three things that decide whether state survives.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/rendering-lists#why-does-react-need-keys" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">react.dev — Why does React need keys</span><span class="lc-sub">The matching algorithm, explained with the list case that motivates it.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Render a list and change one item in the middle; use React DevTools' highlight-updates to see which nodes React actually touched.</li>
<li>Change an element's <code>type</code> (for example a <code>&lt;div&gt;</code> to a <code>&lt;section&gt;</code>) and observe React tears down and rebuilds that subtree.</li>
<li>Describe in one line how React decides what changed: compare the new tree to the old by position and type.</li>
</ol>
<p><strong>Done when:</strong> you can watch reconciliation in DevTools and explain the diff by position and type.</p></div>

<h3>🔬 Measured: reconciliation in a real Next.js app (React 19.3.0 · Next.js 16.4.6)</h3>
<p>One page, three experiments: the lesson's mount/unmount log, the same component at the same slot with different props, and the breakpoint wrapper. A second page defines a component inside another component. A <code>MutationObserver</code> on the real DOM counts what React actually wrote.</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';
import { useWindowWidth } from '@/lib/useWindowWidth';

const nk: string[] = [];                                   <span class="tok-comment">  // nhật ký mount/unmount (đo)</span>
if (typeof window !== 'undefined') Object.assign(window, { __nk: nk });

<span class="tok-comment">// 1 — đoạn đo của bài: con ghi "mount" lúc gắn, "unmount" lúc gỡ</span>
function Child() {
  useEffect(() =&gt; {
    nk.push('mount');
    return () =&gt; { nk.push('unmount'); };
  }, []);
  return &lt;span&gt;con&lt;/span&gt;;
}

<span class="tok-comment">// 2 — cùng type, cùng vị trí: React coi là CÙNG một component</span>
function DemNguoi({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  return &lt;button id="dem" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;{ten}: {n}&lt;/button&gt;;
}

<span class="tok-comment">// 3 — Editor có state riêng (chữ trong ô)</span>
function Editor({ id }: { id: string }) {
  const [text, setText] = useState('');
  return &lt;input id={id} value={text} onChange={(e) =&gt; setText(e.target.value)} className="border px-1" /&gt;;
}

export default function DoiChieu() {
  const [laSection, setLaSection] = useState(false);
  const [laAn, setLaAn] = useState(true);
  const isWide = useWindowWidth() &gt;= 768;
  return (
    &lt;div id="vung" className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;div id="vung-boc"&gt;
        &lt;button id="lat" onClick={() =&gt; setLaSection(!laSection)} className="rounded border px-2"&gt;lật bọc&lt;/button&gt;{' '}
        {laSection ? &lt;section id="boc"&gt;&lt;Child /&gt;&lt;/section&gt; : &lt;div id="boc"&gt;&lt;Child /&gt;&lt;/div&gt;}
      &lt;/div&gt;
      &lt;div&gt;
        &lt;button id="doi-nguoi" onClick={() =&gt; setLaAn(!laAn)} className="rounded border px-2"&gt;đổi người&lt;/button&gt;{' '}
        {laAn ? &lt;DemNguoi ten="An" /&gt; : &lt;DemNguoi ten="Bình" /&gt;}
      &lt;/div&gt;
      &lt;div id="sai"&gt;❌ {isWide ? &lt;section&gt;&lt;Editor id="e-type" /&gt;&lt;/section&gt; : &lt;div&gt;&lt;Editor id="e-type" /&gt;&lt;/div&gt;}&lt;/div&gt;
      &lt;div id="dung"&gt;✅ &lt;div className={isWide ? 'wide' : 'narrow'}&gt;&lt;Editor id="e-class" /&gt;&lt;/div&gt;&lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function Long() {
  const [q, setQ] = useState('');
  function OTim() {                                        <span class="tok-comment">  // ✗ component định nghĩa BÊN TRONG component khác</span>
    return &lt;input id="o-tim" value={q} onChange={(e) =&gt; setQ(e.target.value)} className="border px-1" /&gt;;
  }
  return &lt;div className="space-x-2 p-6 font-sans text-lg"&gt;&lt;OTim /&gt;&lt;span id="q"&gt;q = {q}&lt;/span&gt;&lt;/div&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|doi-chieu'
✓ Compiled successfully in 922ms
├ ○ /doi-chieu
├ ○ /doi-chieu/long
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint -f json src/app/doi-chieu/long/page.tsx | node tom-eslint.cjs
9:60 error react-hooks/static-components — Error: Cannot create components during render</div>
<p>Measured in Chromium (Playwright) — the log is <code>window.__nk</code>, the DOM records come from a <code>MutationObserver</code>:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /doi-chieu → %{http_code}\\n' localhost:3001/doi-chieu
next start GET /doi-chieu → 200
$ curl -s -o /dev/null -w 'next dev GET /doi-chieu → %{http_code}\\n' localhost:3000/doi-chieu
next dev GET /doi-chieu → 200

next start · after load            : ["mount"]
next start · after "lật bọc"       : ["mount","unmount","mount"]   DOM: -DIV +SECTION
next dev   · after load            : ["mount","unmount","mount"]
next dev   · after "lật bọc"       : ["mount","unmount","mount","unmount","mount","unmount","mount"]
DemNguoi: 3 clicks, then switch    : "An: 3" → "Bình: 3"   DOM: 4 × text
typed "Xin chào", 640 → 1000 px    : type swap "" (-DIV +SECTION) · class swap "Xin chào" (class)
/doi-chieu/long, type "abc"        : q = a · value "a" · focus BODY</div>
<p>The lesson's log is exactly right on <code>next start</code>: one <code>unmount</code> and one <code>mount</code>, and the DOM saw just two records — the <code>&lt;div&gt;</code> removed, a <code>&lt;section&gt;</code> added. Under <code>next dev</code>, Strict Mode already logs mount → unmount → mount at load and the flip adds four entries (the freshly mounted child is Strict-checked too), so read lifecycle logs on a production build. Two things the lesson does not show: the <b>same type at the same slot is the same component</b> — Bình inherited An's count of 3, and only one text node changed (lesson 7.2 fixes this with a key); and a component <b>defined inside another component</b> is a new type on every render — after the first key the input was replaced, focus fell back to <code>&lt;body&gt;</code>, and only "a" arrived. ESLint's <code>react-hooks/static-components</code> flags it; <code>tsc</code> and <code>next build</code> do not.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># open /doi-chieu: click "lật bọc", click the counter 3 times then "đổi người"; type in both boxes and resize the window across 768 px</span>
<span class="tok-comment"># in DevTools console: window.__nk</span>
npx eslint src/app/doi-chieu/long/page.tsx</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-1-virtual-dom" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.1 — How React updates the screen</span><span class="lc-sub">Elements, render and commit, reconciliation, fiber</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-2-key-identity" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.2 — key and component identity</span><span class="lc-sub">When React keeps state and when it throws it away</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 3.2 — Fragments & conditional rendering</span><span class="lc-sub">Where a type change slips in unnoticed</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reconciliation</span><span class="v">React diffing the new element tree against the previous one.</span></div>
  <div class="kv"><span class="k">Diffing</span><span class="v">Comparing by position and element type to find changes.</span></div>
  <div class="kv"><span class="k">Same type = update</span><span class="v">Same type in the same slot: React updates props in place.</span></div>
  <div class="kv"><span class="k">Different type = replace</span><span class="v">A changed type tears down and rebuilds the subtree.</span></div>
  <div class="kv"><span class="k">Virtual DOM</span><span class="v">The in-memory tree React diffs before touching the real DOM.</span></div>
  <div class="kv"><span class="k">Minimal DOM ops</span><span class="v">The output is the smallest set of real DOM changes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Reconciliation is how React compares the new element tree to the old one to find what changed.</li><li>Same type in the same position = update in place; a different type = tear down and rebuild.</li><li>React computes the minimal set of real DOM operations from that diff.</li><li>Understanding this explains why keys matter and why some updates are cheap.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">react.dev — Preserving and Resetting State</span><span class="lc-sub">Exactly when React keeps vs resets state, with the position-and-type rule spelled out.</span></span>
</a>
</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Chương này là phần ôn nhanh React &mdash; cùng chủ đề được dạy kỹ ở khoá <a href="/courses/react">React</a> (Chương 1 phần danh sách và key, Chương 11 phần reconciliation, Chương 8 phần hiệu năng). Đọc lướt hoặc chuyển thẳng sang <strong>Chương 8</strong>, nơi bắt đầu phần riêng của Next.js. Nhớ: Next.js là <em>framework dựng trên React</em> &mdash; mọi component, props, state, hook ở đây vẫn là React thuần.</div>
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
<pre><code class="language-html"><span class="tok-comment">// ❌ hai type khác nhau ở cùng vị trí → remount, mất state khi toggle</span>
{isWide ? &lt;section&gt;&lt;Editor /&gt;&lt;/section&gt; : &lt;div&gt;&lt;Editor /&gt;&lt;/div&gt;}

<span class="tok-comment">// ✅ giữ type ổn định; đổi class thay vì đổi type</span>
&lt;div className={isWide ? 'wide' : 'narrow'}&gt;&lt;Editor /&gt;&lt;/div&gt;</code></pre>
<p>Vị trí và type là cách React hiểu "cái này có phải cùng một thứ không?" Giữ chúng ổn định thì state sống sót; đổi chúng thì state reset. Bài sau nói về cách React phân biệt các phần tử trong một <em>danh sách</em> — việc cần thêm một thứ nữa ngoài vị trí: key.</p>

<h3>React quyết định giữ lại cái gì như thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>So sánh theo từng vị trí</b> — React đi song song trên cây cũ và cây mới. Nó không đi tìm — nó nhìn vào cùng một ô ở cả hai bên.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Cùng kiểu, cùng vị trí → giữ nút DOM</b> — Phần tử DOM ở lại, state của nó ở lại, và chỉ những thuộc tính đã đổi mới được ghi. Đây là đường nhanh.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Khác kiểu → phá đi dựng lại</b> — Một <code>&lt;div&gt;</code> biến thành <code>&lt;section&gt;</code> là mất sạch mọi thứ bên trong, kể cả state của từng đứa con.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Trong một danh sách, key đè lên vị trí</b> — Key cho phép React ghép được các phần tử đã dời chỗ. Không có key thì nó lùi về dùng vị trí, và đó là lý do đổi thứ tự làm mất state.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một điều kiện đổi thẻ bọc và âm thầm đặt lại sạch sẽ mọi thứ bên trong.</strong> <code>{isWide ? &lt;div className="wide"&gt;{form}&lt;/div&gt; : &lt;section&gt;{form}&lt;/section&gt;}</code> trông như một lựa chọn về giao diện. Với React thì kiểu đã đổi, nên nó gỡ cả cây con ra và gắn một cây mới vào: mọi ô nhập trắng trơn, mọi menu đang mở đóng lại, mọi vị trí cuộn về đầu, và mọi state của component bên trong biến mất. Nó xảy ra ở đúng một thời điểm — chiều rộng vượt qua một điểm ngắt — nên nó tái hiện dưới dạng &quot;form bị xoá trắng khi tôi kéo cửa sổ&quot;. Hãy giữ kiểu phần tử ổn định và đổi class thay thế, hoặc nâng cây con dùng chung lên để nó không bị tạo lại.</p></div>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">react.dev — Giữ và đặt lại state</span><span class="lc-sub">Vị trí, kiểu và key — ba thứ quyết định state có sống sót hay không.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/rendering-lists#why-does-react-need-keys" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">react.dev — Vì sao React cần key</span><span class="lc-sub">Thuật toán ghép cặp, giải thích qua đúng trường hợp danh sách đã sinh ra nó.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Render một danh sách và đổi một item ở giữa; dùng highlight-updates của React DevTools để thấy React thật sự chạm node nào.</li>
<li>Đổi <code>type</code> của một element (ví dụ <code>&lt;div&gt;</code> thành <code>&lt;section&gt;</code>) và quan sát React gỡ và dựng lại cây con đó.</li>
<li>Mô tả một dòng cách React quyết định cái gì đổi: so cây mới với cây cũ theo vị trí và type.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn xem được reconciliation trong DevTools và giải thích phép so theo vị trí và type.</p></div>

<h3>🔬 Đo thật: reconciliation trong một ứng dụng Next.js thật (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một trang, ba thí nghiệm: nhật ký mount/unmount của bài, cùng một component ở cùng ô nhưng props khác, và thẻ bọc đổi theo điểm ngắt. Trang thứ hai định nghĩa một component bên trong component khác. Một <code>MutationObserver</code> trên DOM thật đếm React đã thật sự ghi gì.</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';
import { useWindowWidth } from '@/lib/useWindowWidth';

const nk: string[] = [];                                   <span class="tok-comment">  // nhật ký mount/unmount (đo)</span>
if (typeof window !== 'undefined') Object.assign(window, { __nk: nk });

<span class="tok-comment">// 1 — đoạn đo của bài: con ghi "mount" lúc gắn, "unmount" lúc gỡ</span>
function Child() {
  useEffect(() =&gt; {
    nk.push('mount');
    return () =&gt; { nk.push('unmount'); };
  }, []);
  return &lt;span&gt;con&lt;/span&gt;;
}

<span class="tok-comment">// 2 — cùng type, cùng vị trí: React coi là CÙNG một component</span>
function DemNguoi({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  return &lt;button id="dem" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;{ten}: {n}&lt;/button&gt;;
}

<span class="tok-comment">// 3 — Editor có state riêng (chữ trong ô)</span>
function Editor({ id }: { id: string }) {
  const [text, setText] = useState('');
  return &lt;input id={id} value={text} onChange={(e) =&gt; setText(e.target.value)} className="border px-1" /&gt;;
}

export default function DoiChieu() {
  const [laSection, setLaSection] = useState(false);
  const [laAn, setLaAn] = useState(true);
  const isWide = useWindowWidth() &gt;= 768;
  return (
    &lt;div id="vung" className="space-y-2 p-6 font-sans text-lg"&gt;
      &lt;div id="vung-boc"&gt;
        &lt;button id="lat" onClick={() =&gt; setLaSection(!laSection)} className="rounded border px-2"&gt;lật bọc&lt;/button&gt;{' '}
        {laSection ? &lt;section id="boc"&gt;&lt;Child /&gt;&lt;/section&gt; : &lt;div id="boc"&gt;&lt;Child /&gt;&lt;/div&gt;}
      &lt;/div&gt;
      &lt;div&gt;
        &lt;button id="doi-nguoi" onClick={() =&gt; setLaAn(!laAn)} className="rounded border px-2"&gt;đổi người&lt;/button&gt;{' '}
        {laAn ? &lt;DemNguoi ten="An" /&gt; : &lt;DemNguoi ten="Bình" /&gt;}
      &lt;/div&gt;
      &lt;div id="sai"&gt;❌ {isWide ? &lt;section&gt;&lt;Editor id="e-type" /&gt;&lt;/section&gt; : &lt;div&gt;&lt;Editor id="e-type" /&gt;&lt;/div&gt;}&lt;/div&gt;
      &lt;div id="dung"&gt;✅ &lt;div className={isWide ? 'wide' : 'narrow'}&gt;&lt;Editor id="e-class" /&gt;&lt;/div&gt;&lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { useState } from 'react';

export default function Long() {
  const [q, setQ] = useState('');
  function OTim() {                                        <span class="tok-comment">  // ✗ component định nghĩa BÊN TRONG component khác</span>
    return &lt;input id="o-tim" value={q} onChange={(e) =&gt; setQ(e.target.value)} className="border px-1" /&gt;;
  }
  return &lt;div className="space-x-2 p-6 font-sans text-lg"&gt;&lt;OTim /&gt;&lt;span id="q"&gt;q = {q}&lt;/span&gt;&lt;/div&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|doi-chieu'
✓ Compiled successfully in 922ms
├ ○ /doi-chieu
├ ○ /doi-chieu/long
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint -f json src/app/doi-chieu/long/page.tsx | node tom-eslint.cjs
9:60 error react-hooks/static-components — Error: Cannot create components during render</div>
<p>Đo trên Chromium (Playwright) — nhật ký là <code>window.__nk</code>, bản ghi DOM lấy từ một <code>MutationObserver</code>:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /doi-chieu → %{http_code}\\n' localhost:3001/doi-chieu
next start GET /doi-chieu → 200
$ curl -s -o /dev/null -w 'next dev GET /doi-chieu → %{http_code}\\n' localhost:3000/doi-chieu
next dev GET /doi-chieu → 200

next start · vừa tải               : ["mount"]
next start · sau "lật bọc"         : ["mount","unmount","mount"]   DOM: -DIV +SECTION
next dev   · vừa tải               : ["mount","unmount","mount"]
next dev   · sau "lật bọc"         : ["mount","unmount","mount","unmount","mount","unmount","mount"]
DemNguoi: bấm 3 lần rồi đổi người  : "An: 3" → "Bình: 3"   DOM: 4 × text
gõ "Xin chào", 640 → 1000 px       : type swap "" (-DIV +SECTION) · class swap "Xin chào" (class)
/doi-chieu/long, gõ "abc"          : q = a · value "a" · focus BODY</div>
<p>Nhật ký của bài đúng y trên <code>next start</code>: một <code>unmount</code>, một <code>mount</code>, và DOM chỉ có hai bản ghi — gỡ <code>&lt;div&gt;</code>, thêm <code>&lt;section&gt;</code>. Dưới <code>next dev</code>, Strict Mode đã ghi mount → unmount → mount ngay lúc tải và một lần lật thêm bốn dòng (con mới gắn cũng bị thử lại), nên hãy đọc nhật ký vòng đời trên bản production. Hai điều bài chưa nói: <b>cùng type cùng ô là cùng một component</b> — Bình thừa hưởng bộ đếm 3 của An, và chỉ một nút chữ đổi (bài 7.2 sửa bằng key); và component <b>định nghĩa bên trong component khác</b> là một type mới ở mỗi lần render — sau phím đầu, ô nhập bị thay, tiêu điểm rơi về <code>&lt;body&gt;</code>, chỉ chữ "a" tới nơi. ESLint <code>react-hooks/static-components</code> bắt được; <code>tsc</code> và <code>next build</code> thì không.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># mở /doi-chieu: bấm "lật bọc", bấm bộ đếm 3 lần rồi "đổi người"; gõ vào cả hai ô rồi kéo cửa sổ qua mốc 768 px</span>
<span class="tok-comment"># trong console DevTools: window.__nk</span>
npx eslint src/app/doi-chieu/long/page.tsx</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-1-virtual-dom" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.1 — React cập nhật màn hình thế nào</span><span class="lc-sub">Element, render và commit, reconciliation, fiber</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-2-key-identity" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.2 — key và danh tính component</span><span class="lc-sub">Khi nào React giữ state, khi nào vứt đi</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 3.2 — Fragment & render có điều kiện</span><span class="lc-sub">Chỗ rất dễ đổi type mà không để ý</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reconciliation</span><span class="v">React so cây element mới với cây trước đó.</span></div>
  <div class="kv"><span class="k">Diffing</span><span class="v">So theo vị trí và type của element để tìm thay đổi.</span></div>
  <div class="kv"><span class="k">Cùng type = cập nhật</span><span class="v">Cùng type ở cùng vị trí: React cập nhật prop tại chỗ.</span></div>
  <div class="kv"><span class="k">Khác type = thay</span><span class="v">Type đổi thì gỡ và dựng lại cây con.</span></div>
  <div class="kv"><span class="k">Virtual DOM</span><span class="v">Cây trong bộ nhớ mà React so trước khi chạm DOM thật.</span></div>
  <div class="kv"><span class="k">Thao tác DOM tối thiểu</span><span class="v">Kết quả là tập thay đổi DOM thật nhỏ nhất.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Reconciliation là cách React so cây element mới với cây cũ để tìm cái gì đổi.</li><li>Cùng type ở cùng vị trí = cập nhật tại chỗ; khác type = gỡ và dựng lại.</li><li>React tính ra tập thao tác DOM thật nhỏ nhất từ phép so đó.</li><li>Hiểu điều này giải thích vì sao key quan trọng và vì sao vài cập nhật rẻ.</li></ul>

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
${G07_2}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Why lists need keys — and why the index is the wrong one</h2>
<p class="lead">Reconciliation matches elements by position. That breaks down for a list, because items get inserted, removed and reordered — position alone can't tell React "this row is still the same row, it just moved". The <code>key</code> prop gives each item a stable identity so React can track it across those changes.</p>

<h3>What a key does</h3>
<p>When React reconciles a list, it matches old and new items <em>by key</em>, not by position. A stable key lets it say "the item with key <code>42</code> is still here, just at a new index — keep its DOM node and its state, only move it". Without keys, React falls back to position and gets it wrong the moment the list changes shape.</p>
<pre><code class="language-typescript">{todos.map((todo) =&gt; (
  &lt;TodoRow key={todo.id} todo={todo} /&gt;   <span class="tok-comment">// stable id from the data — correct</span>
))}</code></pre>

<h3>The index-as-key bug, concretely</h3>
<p>Using the array index as a key looks fine and works — until the list reorders or an item is inserted or removed from the front. Then the keys no longer identify items; they identify <em>positions</em>, and React attaches the wrong state to the wrong item:</p>
<pre><code class="language-typescript">{todos.map((todo, i) =&gt; (
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
<h3>What a key is for</h3>
<div class="lz-map">
  <div class="lz-stage">Identity across renders — not uniqueness for its own sake</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">It answers &quot;is this the same item?&quot;</div><div class="lz-nsub">Not &quot;where is it in the array?&quot;. A stable id means React can follow an item that moved from position 1 to position 4.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">It must come from the data</div><div class="lz-nsub">A database id, a slug, a uuid generated when the item was created — anything that belongs to the item rather than to its current position.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Unique among siblings, not globally</div><div class="lz-nsub">Two different lists can both use key &quot;1&quot;. React only compares within one parent.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">It also resets state on purpose</div><div class="lz-nsub">Changing a component&#39;s key forces a remount. That is the idiomatic way to clear a form when the selected record changes.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — generating a key inside render, so it changes every time.</strong> <code>key={crypto.randomUUID()}</code> or <code>key={Math.random()}</code> makes the warning disappear and guarantees the worst possible behaviour: every key is new on every render, so React matches nothing, unmounts every row and mounts a fresh one. The list rebuilds completely on each keystroke — every input loses focus mid-typing, every animation restarts, and performance collapses on long lists. The symptom (&quot;the input loses focus after each character&quot;) looks nothing like the cause. If your data genuinely has no id, generate one <em>when the item is created</em> and store it alongside the item.</p></div>
<a class="link-card dl" href="https://react.dev/learn/rendering-lists#rules-of-keys" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">react.dev — Rules of keys</span><span class="lc-sub">The four rules, including why generating keys during render is forbidden.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state#resetting-a-form-with-a-key" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Resetting a form with a key</span><span class="lc-sub">Using a key deliberately, as a feature rather than a warning to silence.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Render an editable list using the array index as <code>key</code>, type into one row, then delete a row above it — watch the text jump to the wrong row.</li>
<li>Switch the key to a stable id and confirm the bug disappears.</li>
<li>Explain why a key must be stable and unique among siblings, and why the index is not.</li>
</ol>
<p><strong>Done when:</strong> you can reproduce the index-key bug and fix it with a stable id.</p></div>

<h3>🔬 Measured: keys in a real Next.js app (React 19.3.0 · Next.js 16.4.6)</h3>
<p>The same list twice — <code>key={i}</code> and <code>key={m.id}</code> — each row with its own tick and note; a page with random keys; and a list with a duplicate id:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

type Muc = { id: number; ten: string };
const BAN_DAU: Muc[] = [{ id: 1, ten: 'An' }, { id: 2, ten: 'Bình' }, { id: 3, ten: 'Chi' }];
const gan: Record&lt;string, number&gt; = {};                   <span class="tok-comment">  // đếm lần GẮN (mount) mỗi danh sách — để đo</span>
if (typeof window !== 'undefined') Object.assign(window, { __gan: gan });

<span class="tok-comment">// mỗi hàng có state RIÊNG: ô tick + ô ghi chú</span>
function Hang({ ten, nhom }: { ten: string; nhom: string }) {
  const [tick, setTick] = useState(false);
  const [ghi, setGhi] = useState('');
  useEffect(() =&gt; { gan[nhom] = (gan[nhom] ?? 0) + 1; }, [nhom]);
  return (
    &lt;li className="flex items-center gap-2"&gt;
      &lt;input type="checkbox" checked={tick} onChange={(e) =&gt; setTick(e.target.checked)} /&gt;
      &lt;span className="w-12"&gt;{ten}&lt;/span&gt;
      &lt;input value={ghi} onChange={(e) =&gt; setGhi(e.target.value)} className="w-24 border px-1" /&gt;
    &lt;/li&gt;
  );
}

<span class="tok-comment">// 7.1: cùng type cùng ô ⇒ chung state · key khác ⇒ hai component khác nhau</span>
function DemNguoi({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  return &lt;button id="dem" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;{ten}: {n}&lt;/button&gt;;
}

export default function KhoaDs() {
  const [ds, setDs] = useState(BAN_DAU);
  const [laAn, setLaAn] = useState(true);
  return (
    &lt;div className="grid grid-cols-2 gap-x-6 gap-y-2 p-6 font-sans text-lg"&gt;
      &lt;div id="cot-i"&gt;&lt;p className="font-bold"&gt;key={'{i}'}&lt;/p&gt;
        &lt;ul id="ds-i"&gt;{ds.map((m, i) =&gt; &lt;Hang key={i} ten={m.ten} nhom="i" /&gt;)}&lt;/ul&gt;&lt;/div&gt;
      &lt;div id="cot-id"&gt;&lt;p className="font-bold"&gt;key={'{m.id}'}&lt;/p&gt;
        &lt;ul id="ds-id"&gt;{ds.map((m) =&gt; &lt;Hang key={m.id} ten={m.ten} nhom="id" /&gt;)}&lt;/ul&gt;&lt;/div&gt;
      &lt;p&gt;&lt;button id="xoa-dau" onClick={() =&gt; setDs(ds.slice(1))} className="rounded border px-2"&gt;xoá dòng đầu&lt;/button&gt;&lt;/p&gt;
      &lt;p&gt;&lt;button id="doi-nguoi" onClick={() =&gt; setLaAn(!laAn)} className="rounded border px-2"&gt;đổi người&lt;/button&gt;{' '}
        {laAn ? &lt;DemNguoi key="an" ten="An" /&gt; : &lt;DemNguoi key="binh" ten="Bình" /&gt;}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

const gan = { i: 0, nn: 0 };                              <span class="tok-comment">  // đếm lần GẮN mỗi ô — để đo</span>
if (typeof window !== 'undefined') Object.assign(window, { __ganNN: gan });

function Dong({ id, ghi, doi, nhom }: { id: string; ghi: string; doi: (v: string) =&gt; void; nhom: 'i' | 'nn' }) {
  useEffect(() =&gt; { gan[nhom]++; }, [nhom]);
  return &lt;li&gt;&lt;input id={id} value={ghi} onChange={(e) =&gt; doi(e.target.value)} className="w-40 border px-1" /&gt;&lt;/li&gt;;
}

export default function NgauNhien() {
  const [a, setA] = useState(['', '', '']);
  const [b, setB] = useState(['', '', '']);
  const sua = (ds: string[], dat: (x: string[]) =&gt; void, i: number) =&gt; (v: string) =&gt; dat(ds.map((g, j) =&gt; (j === i ? v : g)));
  return (
    &lt;div className="grid grid-cols-2 gap-6 p-6 font-sans text-lg"&gt;
      &lt;ul&gt;&lt;li className="font-bold"&gt;key={'{i}'}&lt;/li&gt;
        {a.map((g, i) =&gt; &lt;Dong key={i} id={&#96;i-\${i}&#96;} ghi={g} doi={sua(a, setA, i)} nhom="i" /&gt;)}&lt;/ul&gt;
      &lt;ul&gt;&lt;li className="font-bold"&gt;key={'{Math.random()}'}&lt;/li&gt;
        {b.map((g, i) =&gt; &lt;Dong key={Math.random()} id={&#96;nn-\${i}&#96;} ghi={g} doi={sua(b, setB, i)} nhom="nn" /&gt;)}&lt;/ul&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
const ds = [{ id: 1, ten: 'An' }, { id: 1, ten: 'Bình' }, { id: 2, ten: 'Chi' }]; <span class="tok-comment">  // ✗ hai phần tử cùng id 1</span>

export default function Trung() {
  return &lt;ul className="p-6 font-sans text-lg"&gt;{ds.map((m) =&gt; &lt;li key={m.id}&gt;{m.ten}&lt;/li&gt;)}&lt;/ul&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|khoa-ds'
✓ Compiled successfully in 884ms
├ ○ /khoa-ds
├ ○ /khoa-ds/ngau-nhien
├ ○ /khoa-ds/trung
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint -f json src/app/khoa-ds/ngau-nhien/page.tsx | node tom-eslint.cjs
21:37 error react-hooks/purity — Error: Cannot call impure function during render
$ npx eslint -f json src/app/khoa-ds/page.tsx | node tom-eslint.cjs; echo "khoa-ds/page.tsx: $(npx eslint src/app/khoa-ds/page.tsx | grep -c error) lỗi"
khoa-ds/page.tsx: 0 lỗi</div>
<p>Measured in Chromium — tick Bình and write "ghi B" on Bình in both lists, then delete the first row; a <code>MutationObserver</code> records what React did to each list:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /khoa-ds → %{http_code}\\n' localhost:3001/khoa-ds
next start GET /khoa-ds → 200
$ curl -s -o /dev/null -w 'next dev GET /khoa-ds/trung → %{http_code}\\n' localhost:3000/khoa-ds/trung
next dev GET /khoa-ds/trung → 200

before (both lists)           : An ☐ · Bình ☑ "ghi B" · Chi ☐
after "xoá dòng đầu", key={i} : Bình ☐ · Chi ☑ "ghi B"   DOM: -LI(Chi), text An→Bình, text Bình→Chi
after "xoá dòng đầu", key=id  : Bình ☑ "ghi B" · Chi ☐   DOM: -LI(An)
DemNguoi with keys            : An: 3 → Bình: 0 → An: 0
type "abc", key={i}           : "abc" · focus #i-0 · 3 mounts
type "abc", key={Math.random()}: "a" · focus BODY · 15 mounts
/khoa-ds/trung, next dev      : Encountered two children with the same key, &#96;1&#96;. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.</div>
<p>Exactly the lesson's bug, with the mechanism visible: with index keys React removed the <b>last</b> <code>&lt;li&gt;</code> and rewrote the text of the two it kept — those were An's and Bình's old nodes, carrying their state, so Bình's tick now sits on Chi. With id keys there is one record: remove An's row. Two extras the lesson does not show: ESLint does <b>not</b> flag <code>key={i}</code> (0 errors), while <code>key={Math.random()}</code> is flagged by <code>react-hooks/purity</code>; and the random-key list was remounted on <b>every</b> render of the page — 15 mounts, including renders caused by typing in the other list. Keys only need to be unique among siblings: both lists use keys 1 and 2 under different parents and the dev console stays clean.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># open /khoa-ds: tick Bình in both lists, type in Bình's box, click "xoá dòng đầu"</span>
<span class="tok-comment"># open /khoa-ds/ngau-nhien: click the first box of each list and type</span>
npx eslint src/app/khoa-ds</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-3-danh-sach" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.3 — Rendering lists and keys</span><span class="lc-sub">map, stable keys, and the key={index} bug</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-2-key-identity" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.2 — key and component identity</span><span class="lc-sub">When React keeps state and when it throws it away</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 3.2 — Fragments & conditional rendering</span><span class="lc-sub">map an array into a list, with keys</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">key</span><span class="v">A stable identity React uses to match list items across renders.</span></div>
  <div class="kv"><span class="k">Stable id</span><span class="v">A value tied to the data (a database id), not its position.</span></div>
  <div class="kv"><span class="k">Index as key</span><span class="v">Fragile — reorders/inserts make React reuse the wrong item.</span></div>
  <div class="kv"><span class="k">Identity</span><span class="v">Which item is which, so state and DOM follow the right row.</span></div>
  <div class="kv"><span class="k">Unique among siblings</span><span class="v">Keys only need to be unique within one list.</span></div>
  <div class="kv"><span class="k">State corruption</span><span class="v">A wrong key moves input state to the wrong item.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A <code>key</code> gives each list item a stable identity so React tracks it across renders.</li><li>Use a stable id from the data, not the array index, when the list can reorder or change length.</li><li>An index key corrupts per-item state when items are inserted, removed or reordered.</li><li>Keys only need to be unique among siblings in the same list.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Vì sao danh sách cần key — và vì sao chỉ số là key sai</h2>
<p class="lead">Reconciliation khớp element theo vị trí. Điều đó đổ vỡ với một danh sách, vì phần tử bị chèn, xoá và sắp lại — riêng vị trí không thể nói với React "hàng này vẫn là hàng cũ, chỉ là đã dịch chỗ". Prop <code>key</code> cho mỗi phần tử một danh tính ổn định để React theo dõi nó qua những thay đổi đó.</p>

<h3>Một key làm gì</h3>
<p>Khi React reconcile một danh sách, nó khớp phần tử cũ và mới <em>theo key</em>, không phải theo vị trí. Một key ổn định cho phép nó nói "phần tử có key <code>42</code> vẫn ở đây, chỉ ở một chỉ số mới — giữ nút DOM và state của nó, chỉ di chuyển thôi". Không có key, React quay về vị trí và làm sai ngay khi danh sách đổi hình dạng.</p>
<pre><code class="language-typescript">{todos.map((todo) =&gt; (
  &lt;TodoRow key={todo.id} todo={todo} /&gt;   <span class="tok-comment">// id ổn định từ dữ liệu — đúng</span>
))}</code></pre>

<h3>Bug chỉ-số-làm-key, cụ thể</h3>
<p>Dùng chỉ số mảng làm key trông ổn và chạy được — cho tới khi danh sách sắp lại hoặc một phần tử bị chèn/xoá ở đầu. Khi đó các key không còn định danh phần tử; chúng định danh <em>vị trí</em>, và React gắn nhầm state vào nhầm phần tử:</p>
<pre><code class="language-typescript">{todos.map((todo, i) =&gt; (
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
<h3>Key dùng để làm gì</h3>
<div class="lz-map">
  <div class="lz-stage">Danh tính xuyên qua các lần render — không phải tính duy nhất cho có</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nó trả lời &quot;có phải cùng một phần tử không?&quot;</div><div class="lz-nsub">Chứ không phải &quot;nó nằm ở đâu trong mảng?&quot;. Một id ổn định cho phép React theo dấu một phần tử đã dời từ vị trí 1 sang vị trí 4.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Nó phải đến từ dữ liệu</div><div class="lz-nsub">Một id trong cơ sở dữ liệu, một slug, một uuid sinh ra lúc phần tử được tạo — bất cứ thứ gì thuộc về phần tử chứ không thuộc về vị trí hiện tại của nó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Duy nhất giữa các anh em, không cần duy nhất toàn cục</div><div class="lz-nsub">Hai danh sách khác nhau đều dùng key &quot;1&quot; được. React chỉ so sánh trong phạm vi một phần tử cha.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nó cũng dùng để đặt lại state một cách có chủ đích</div><div class="lz-nsub">Đổi key của một component là ép nó gắn lại từ đầu. Đó là cách đúng điệu để xoá trắng một form khi bản ghi được chọn đổi.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — sinh key ngay trong lúc render, nên nó đổi mỗi lần.</strong> <code>key={crypto.randomUUID()}</code> hay <code>key={Math.random()}</code> làm cảnh báo biến mất và bảo đảm hành vi tệ nhất có thể: mọi key đều mới ở mọi lần render, nên React chẳng ghép được gì, gỡ mọi dòng ra rồi gắn dòng mới vào. Danh sách dựng lại hoàn toàn ở mỗi lần gõ phím — mọi ô nhập mất tiêu điểm giữa chừng, mọi hoạt ảnh chạy lại từ đầu, và hiệu năng sụp đổ với danh sách dài. Triệu chứng (&quot;ô nhập mất tiêu điểm sau mỗi ký tự&quot;) chẳng giống nguyên nhân chút nào. Nếu dữ liệu của bạn thật sự không có id, hãy sinh một cái <em>lúc phần tử được tạo ra</em> rồi lưu nó cùng phần tử.</p></div>
<a class="link-card dl" href="https://react.dev/learn/rendering-lists#rules-of-keys" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">react.dev — Luật của key</span><span class="lc-sub">Bốn luật, gồm cả lý do vì sao cấm sinh key trong lúc render.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/learn/preserving-and-resetting-state#resetting-a-form-with-a-key" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Đặt lại một form bằng key</span><span class="lc-sub">Dùng key một cách có chủ đích, như một tính năng chứ không phải một cảnh báo cần dập.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Render một danh sách sửa được dùng chỉ số mảng làm <code>key</code>, gõ vào một dòng, rồi xoá một dòng phía trên — xem chữ nhảy sang dòng sai.</li>
<li>Đổi key sang một id ổn định và xác nhận bug biến mất.</li>
<li>Giải thích vì sao key phải ổn định và duy nhất giữa các anh em, và vì sao chỉ số thì không.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tái hiện được bug key-theo-chỉ-số và sửa bằng một id ổn định.</p></div>

<h3>🔬 Đo thật: key trong một ứng dụng Next.js thật (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Cùng một danh sách hai lần — <code>key={i}</code> và <code>key={m.id}</code> — mỗi hàng có ô tích và ghi chú riêng; một trang dùng key ngẫu nhiên; và một danh sách có id trùng:</p>
<pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

type Muc = { id: number; ten: string };
const BAN_DAU: Muc[] = [{ id: 1, ten: 'An' }, { id: 2, ten: 'Bình' }, { id: 3, ten: 'Chi' }];
const gan: Record&lt;string, number&gt; = {};                   <span class="tok-comment">  // đếm lần GẮN (mount) mỗi danh sách — để đo</span>
if (typeof window !== 'undefined') Object.assign(window, { __gan: gan });

<span class="tok-comment">// mỗi hàng có state RIÊNG: ô tick + ô ghi chú</span>
function Hang({ ten, nhom }: { ten: string; nhom: string }) {
  const [tick, setTick] = useState(false);
  const [ghi, setGhi] = useState('');
  useEffect(() =&gt; { gan[nhom] = (gan[nhom] ?? 0) + 1; }, [nhom]);
  return (
    &lt;li className="flex items-center gap-2"&gt;
      &lt;input type="checkbox" checked={tick} onChange={(e) =&gt; setTick(e.target.checked)} /&gt;
      &lt;span className="w-12"&gt;{ten}&lt;/span&gt;
      &lt;input value={ghi} onChange={(e) =&gt; setGhi(e.target.value)} className="w-24 border px-1" /&gt;
    &lt;/li&gt;
  );
}

<span class="tok-comment">// 7.1: cùng type cùng ô ⇒ chung state · key khác ⇒ hai component khác nhau</span>
function DemNguoi({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  return &lt;button id="dem" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;{ten}: {n}&lt;/button&gt;;
}

export default function KhoaDs() {
  const [ds, setDs] = useState(BAN_DAU);
  const [laAn, setLaAn] = useState(true);
  return (
    &lt;div className="grid grid-cols-2 gap-x-6 gap-y-2 p-6 font-sans text-lg"&gt;
      &lt;div id="cot-i"&gt;&lt;p className="font-bold"&gt;key={'{i}'}&lt;/p&gt;
        &lt;ul id="ds-i"&gt;{ds.map((m, i) =&gt; &lt;Hang key={i} ten={m.ten} nhom="i" /&gt;)}&lt;/ul&gt;&lt;/div&gt;
      &lt;div id="cot-id"&gt;&lt;p className="font-bold"&gt;key={'{m.id}'}&lt;/p&gt;
        &lt;ul id="ds-id"&gt;{ds.map((m) =&gt; &lt;Hang key={m.id} ten={m.ten} nhom="id" /&gt;)}&lt;/ul&gt;&lt;/div&gt;
      &lt;p&gt;&lt;button id="xoa-dau" onClick={() =&gt; setDs(ds.slice(1))} className="rounded border px-2"&gt;xoá dòng đầu&lt;/button&gt;&lt;/p&gt;
      &lt;p&gt;&lt;button id="doi-nguoi" onClick={() =&gt; setLaAn(!laAn)} className="rounded border px-2"&gt;đổi người&lt;/button&gt;{' '}
        {laAn ? &lt;DemNguoi key="an" ten="An" /&gt; : &lt;DemNguoi key="binh" ten="Bình" /&gt;}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { useEffect, useState } from 'react';

const gan = { i: 0, nn: 0 };                              <span class="tok-comment">  // đếm lần GẮN mỗi ô — để đo</span>
if (typeof window !== 'undefined') Object.assign(window, { __ganNN: gan });

function Dong({ id, ghi, doi, nhom }: { id: string; ghi: string; doi: (v: string) =&gt; void; nhom: 'i' | 'nn' }) {
  useEffect(() =&gt; { gan[nhom]++; }, [nhom]);
  return &lt;li&gt;&lt;input id={id} value={ghi} onChange={(e) =&gt; doi(e.target.value)} className="w-40 border px-1" /&gt;&lt;/li&gt;;
}

export default function NgauNhien() {
  const [a, setA] = useState(['', '', '']);
  const [b, setB] = useState(['', '', '']);
  const sua = (ds: string[], dat: (x: string[]) =&gt; void, i: number) =&gt; (v: string) =&gt; dat(ds.map((g, j) =&gt; (j === i ? v : g)));
  return (
    &lt;div className="grid grid-cols-2 gap-6 p-6 font-sans text-lg"&gt;
      &lt;ul&gt;&lt;li className="font-bold"&gt;key={'{i}'}&lt;/li&gt;
        {a.map((g, i) =&gt; &lt;Dong key={i} id={&#96;i-\${i}&#96;} ghi={g} doi={sua(a, setA, i)} nhom="i" /&gt;)}&lt;/ul&gt;
      &lt;ul&gt;&lt;li className="font-bold"&gt;key={'{Math.random()}'}&lt;/li&gt;
        {b.map((g, i) =&gt; &lt;Dong key={Math.random()} id={&#96;nn-\${i}&#96;} ghi={g} doi={sua(b, setB, i)} nhom="nn" /&gt;)}&lt;/ul&gt;
    &lt;/div&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
const ds = [{ id: 1, ten: 'An' }, { id: 1, ten: 'Bình' }, { id: 2, ten: 'Chi' }]; <span class="tok-comment">  // ✗ hai phần tử cùng id 1</span>

export default function Trung() {
  return &lt;ul className="p-6 font-sans text-lg"&gt;{ds.map((m) =&gt; &lt;li key={m.id}&gt;{m.ten}&lt;/li&gt;)}&lt;/ul&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|khoa-ds'
✓ Compiled successfully in 884ms
├ ○ /khoa-ds
├ ○ /khoa-ds/ngau-nhien
├ ○ /khoa-ds/trung
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint -f json src/app/khoa-ds/ngau-nhien/page.tsx | node tom-eslint.cjs
21:37 error react-hooks/purity — Error: Cannot call impure function during render
$ npx eslint -f json src/app/khoa-ds/page.tsx | node tom-eslint.cjs; echo "khoa-ds/page.tsx: $(npx eslint src/app/khoa-ds/page.tsx | grep -c error) lỗi"
khoa-ds/page.tsx: 0 lỗi</div>
<p>Đo trên Chromium — tích Bình và ghi "ghi B" vào hàng Bình ở cả hai danh sách, rồi xoá hàng đầu; một <code>MutationObserver</code> ghi lại React đã làm gì với từng danh sách:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /khoa-ds → %{http_code}\\n' localhost:3001/khoa-ds
next start GET /khoa-ds → 200
$ curl -s -o /dev/null -w 'next dev GET /khoa-ds/trung → %{http_code}\\n' localhost:3000/khoa-ds/trung
next dev GET /khoa-ds/trung → 200

trước (cả hai danh sách)       : An ☐ · Bình ☑ "ghi B" · Chi ☐
sau "xoá dòng đầu", key={i}   : Bình ☐ · Chi ☑ "ghi B"   DOM: -LI(Chi), text An→Bình, text Bình→Chi
sau "xoá dòng đầu", key=id    : Bình ☑ "ghi B" · Chi ☐   DOM: -LI(An)
DemNguoi có key               : An: 3 → Bình: 0 → An: 0
gõ "abc", key={i}             : "abc" · focus #i-0 · 3 mounts
gõ "abc", key={Math.random()} : "a" · focus BODY · 15 mounts
/khoa-ds/trung, next dev      : Encountered two children with the same key, &#96;1&#96;. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.</div>
<p>Đúng lỗi của bài, và thấy rõ cơ chế: với key bằng chỉ số, React gỡ thẻ <code>&lt;li&gt;</code> <b>cuối cùng</b> và viết lại chữ của hai thẻ còn giữ — đó là nút cũ của An và Bình, mang theo state, nên dấu tích của Bình giờ nằm ở Chi. Với key bằng id chỉ có một bản ghi: gỡ hàng của An. Hai điều bài chưa nói: ESLint <b>không</b> báo <code>key={i}</code> (0 lỗi), còn <code>key={Math.random()}</code> bị <code>react-hooks/purity</code> bắt; và danh sách key ngẫu nhiên bị gắn lại ở <b>mọi</b> lần render của trang — 15 lần gắn, kể cả khi bạn gõ ở danh sách bên kia. Key chỉ cần duy nhất giữa anh em: hai danh sách khác cha cùng dùng key 1 và 2, console dev vẫn sạch.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># mở /khoa-ds: tích Bình ở cả hai cột, gõ vào ô của Bình, bấm "xoá dòng đầu"</span>
<span class="tok-comment"># mở /khoa-ds/ngau-nhien: bấm ô đầu của từng danh sách rồi gõ</span>
npx eslint src/app/khoa-ds</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-3-danh-sach" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.3 — Hiển thị danh sách và key</span><span class="lc-sub">map, key ổn định, và bug key={index}</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-2-key-identity" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.2 — key và danh tính component</span><span class="lc-sub">Khi nào React giữ state, khi nào vứt đi</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-3-2-fragments-conditional" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · 3.2 — Fragment & render có điều kiện</span><span class="lc-sub">map biến mảng thành danh sách, kèm key</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">key</span><span class="v">Một danh tính ổn định React dùng để khớp item qua các lần render.</span></div>
  <div class="kv"><span class="k">Id ổn định</span><span class="v">Giá trị gắn với dữ liệu (id trong DB), không phải vị trí.</span></div>
  <div class="kv"><span class="k">Chỉ số làm key</span><span class="v">Mong manh — sắp lại/chèn khiến React dùng nhầm item.</span></div>
  <div class="kv"><span class="k">Danh tính</span><span class="v">Item nào là item nào, để state và DOM theo đúng dòng.</span></div>
  <div class="kv"><span class="k">Duy nhất giữa anh em</span><span class="v">Key chỉ cần duy nhất trong một danh sách.</span></div>
  <div class="kv"><span class="k">Hỏng state</span><span class="v">Key sai làm state của input chuyển sang item sai.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một <code>key</code> cho mỗi item một danh tính ổn định để React theo dõi qua các render.</li><li>Dùng id ổn định từ dữ liệu, không phải chỉ số mảng, khi danh sách có thể sắp lại hoặc đổi độ dài.</li><li>Key theo chỉ số làm hỏng state từng item khi item bị chèn, xoá hoặc sắp lại.</li><li>Key chỉ cần duy nhất giữa các anh em trong cùng một danh sách.</li></ul>

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
${G07_3}
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
<h3>The four reasons a component renders</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Its own state changed</b> — A setter was called with a value that is not identical to the previous one.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Its parent rendered</b> — By default, a parent render re-renders every child, whether or not its props changed. This is normal and usually cheap.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>A context it reads changed</b> — Every consumer of that context, anywhere in the subtree.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Its key changed</b> — Which is not a re-render at all — it is an unmount and a mount, and state does not survive it.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — assuming a re-render is a performance problem.</strong> &quot;This component rendered 40 times&quot; sounds alarming and usually costs nothing: React&#39;s render is a function call producing objects, and the expensive part — writing to the DOM — only happens for what actually changed. Optimising on render <em>count</em> leads to <code>memo</code> and <code>useCallback</code> sprinkled everywhere, which adds comparisons, adds code, and often makes things slower. Measure duration, not frequency: the React DevTools profiler shows how many milliseconds each render took. A component rendering 40 times at 0.2ms is fine; one rendering twice at 300ms is the actual problem.</p></div>
<a class="link-card dl" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Render and commit</span><span class="lc-sub">What a render actually does, and why most of them are cheap.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/Profiler" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Profiler</span><span class="lc-sub">Measuring render duration programmatically, when the DevTools panel is not enough.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a <code>console.log</code> to a child and confirm it re-renders whenever its parent does, even if its props did not change.</li>
<li>Move state down into the child that uses it and watch the parent stop re-rendering unrelated siblings.</li>
<li>List the three triggers for a re-render: state change, parent render, context change.</li>
</ol>
<p><strong>Done when:</strong> you can name why a component re-renders and reduce needless renders by moving state.</p></div>

<h3>🔬 Measured: why components re-render (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Four boxes on one page, one per cause. Every component counts its committed renders in a <code>useEffect</code> with no dependency array (it runs after every commit):</p>
<pre><code class="language-tsx">'use client';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const dem: Record&lt;string, number&gt; = {};                   <span class="tok-comment">  // số lần render ĐÃ commit mỗi component — để đo</span>
const ms: number[] = [];                                  <span class="tok-comment">  // thời gian một lần bấm → commit xong (ms)</span>
if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __ms: ms });
function useDem(ten: string) {
  useEffect(() =&gt; { dem[ten] = (dem[ten] ?? 0) + 1; });   <span class="tok-comment">  // không mảng phụ thuộc ⇒ chạy sau MỖI commit</span>
}

<span class="tok-comment">// A — nguyên nhân 2: cha render ⇒ mọi con render, props có đổi hay không</span>
function ConKhongProp() { useDem('conKhongProp'); return &lt;p&gt;con không prop&lt;/p&gt;; }
function ConPropCoDinh({ nhan }: { nhan: string }) { useDem('conPropCoDinh'); return &lt;p&gt;con prop cố định: {nhan}&lt;/p&gt;; }
function ChaGiuState() {
  const [n, setN] = useState(0);
  const t0 = useRef(0);
  useDem('cha');
  useLayoutEffect(() =&gt; { if (t0.current) ms.push(performance.now() - t0.current); });
  return (
    &lt;section id="a" className="rounded border p-2"&gt;
      &lt;button id="cha-bam" onClick={() =&gt; { t0.current = performance.now(); setN(n + 1); }} className="rounded border px-2"&gt;cha: {n}&lt;/button&gt;
      &lt;ConKhongProp /&gt;
      &lt;ConPropCoDinh nhan="cố định" /&gt;
    &lt;/section&gt;
  );
}

<span class="tok-comment">// B — dời state xuống: chỉ cái nút giữ state, anh em không render</span>
function NutDem() { const [n, setN] = useState(0); useDem('nutDem'); return &lt;button id="nut-dem" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;nút: {n}&lt;/button&gt;; }
function AnhEm() { useDem('anhEm'); return &lt;p&gt;anh em của nút&lt;/p&gt;; }

<span class="tok-comment">// C — nguyên nhân 3: context đổi ⇒ chỗ đọc render, dù cha của nó không render</span>
const Ctx = createContext(0);
function KhoCtx({ children }: { children: ReactNode }) {
  const [v, setV] = useState(0);
  return &lt;Ctx value={v}&gt;&lt;button id="ctx-bam" onClick={() =&gt; setV(v + 1)} className="rounded border px-2"&gt;context: {v}&lt;/button&gt;{children}&lt;/Ctx&gt;;
}
function DocCtx() { const v = useContext(Ctx); useDem('docCtx'); return &lt;p&gt;đọc context: {v}&lt;/p&gt;; }
function KhongDocCtx() { useDem('khongDocCtx'); return &lt;p&gt;không đọc context&lt;/p&gt;; }

<span class="tok-comment">// D — nguyên nhân 4: key đổi ⇒ không phải render lại, mà gỡ + gắn</span>
const gan = { conKey: 0 };
if (typeof window !== 'undefined') Object.assign(window, { __gan: gan });
function ConKey() {
  const [n, setN] = useState(0);
  useEffect(() =&gt; { gan.conKey++; }, []);
  return &lt;button id="con-key" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;state riêng: {n}&lt;/button&gt;;
}
function DoiKey() {
  const [k, setK] = useState(0);
  return &lt;p&gt;&lt;button id="doi-key" onClick={() =&gt; setK(k + 1)} className="rounded border px-2"&gt;đổi key&lt;/button&gt; &lt;ConKey key={k} /&gt;&lt;/p&gt;;
}

export default function ViSao() {
  return (
    &lt;div className="grid grid-cols-2 gap-3 p-4 font-sans text-base"&gt;
      &lt;ChaGiuState /&gt;
      &lt;section id="b" className="rounded border p-2"&gt;&lt;NutDem /&gt;&lt;AnhEm /&gt;&lt;/section&gt;
      &lt;section id="c" className="rounded border p-2"&gt;&lt;KhoCtx&gt;&lt;DocCtx /&gt;&lt;KhongDocCtx /&gt;&lt;/KhoCtx&gt;&lt;/section&gt;
      &lt;section id="d" className="rounded border p-2"&gt;&lt;DoiKey /&gt;&lt;/section&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|vi-sao'
✓ Compiled successfully in 1074ms
├ ○ /vi-sao
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi</div>
<p>Measured in Chromium, three clicks per box:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /vi-sao → %{http_code}\\n' localhost:3001/vi-sao
next start GET /vi-sao → 200
$ curl -s -o /dev/null -w 'next dev GET /vi-sao → %{http_code}\\n' localhost:3000/vi-sao
next dev GET /vi-sao → 200

after load (every counter)        : 1   (next dev: 2 — Strict Mode)
A · 3 clicks on "cha"              : cha 4 · ConKhongProp 4 · ConPropCoDinh 4
A · DOM records (MutationObserver) : text 0→1 @cha-bam, text 1→2 @cha-bam, text 2→3 @cha-bam
A · click → commit (ms)            : 0.4 · 0.3 · 0.2   (next dev: 1.0 · 0.6 · 0.6)
B · 3 clicks on "nút"              : NutDem 4 · AnhEm 1
C · 3 clicks on "context"          : DocCtx 4 · KhongDocCtx 1
D · 2 clicks inside, then new key  : "state riêng: 2" → "state riêng: 0" · mounts 1 → 2</div>
<p>Cause 2 exactly as described: both children rendered with their parent — the one with no props and the one whose prop never changes. Yet the DOM saw only three records, the counter text: nine renders, three writes, each click well under a millisecond on the course machine. Moving the state into the button left its sibling at one render. The context box adds a detail worth keeping: the sibling that does not read the context stayed at one because <code>children</code> was created by the page, which never re-rendered — the "children as props" trick of lesson 7.5. Under <code>next dev</code> every counter starts at 2 (Strict Mode runs mount effects twice) and clicks are slower — count and time on <code>next start</code>.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># open /vi-sao, click each button 3 times, then in the DevTools console:</span>
window.__dem
window.__ms</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-1-virtual-dom" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.1 — How React updates the screen</span><span class="lc-sub">Elements, render and commit</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-2-4-dat-state" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 2.4 — Where state should live</span><span class="lc-sub">Lifting state up, one source of truth, derived state</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">The optimisation side, next lesson</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Re-render</span><span class="v">React re-running a component to recompute its UI.</span></div>
  <div class="kv"><span class="k">State change</span><span class="v">The component's own state updates — it re-renders.</span></div>
  <div class="kv"><span class="k">Parent render</span><span class="v">A parent re-rendering re-renders its children by default.</span></div>
  <div class="kv"><span class="k">Context change</span><span class="v">Consumers re-render when the context value changes.</span></div>
  <div class="kv"><span class="k">Props unchanged</span><span class="v">A child still re-renders with the parent unless memoized.</span></div>
  <div class="kv"><span class="k">Move state down</span><span class="v">Push state to where it is used to limit the render area.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A component re-renders for three reasons: its state changed, its parent re-rendered, or a context it reads changed.</li><li>By default a parent re-render re-renders all children, even with unchanged props.</li><li>Moving state down to the component that uses it shrinks the re-render area.</li><li>Re-rendering is usually cheap — do not optimise before you measure.</li></ul>

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
<h3>Bốn lý do một component render lại</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>State của chính nó đã đổi</b> — Một setter được gọi với một giá trị không y hệt giá trị trước đó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Cha của nó đã render</b> — Mặc định, một lần render của cha sẽ render lại mọi đứa con, bất kể props có đổi hay không. Đây là chuyện bình thường và thường là rẻ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Một context nó đọc đã đổi</b> — Mọi chỗ tiêu thụ context đó, ở bất cứ đâu trong cây con.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Key của nó đã đổi</b> — Cái này thì hoàn toàn không phải render lại — nó là gỡ ra rồi gắn vào, và state không sống sót qua đó.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — cho rằng cứ render lại là có vấn đề hiệu năng.</strong> &quot;Component này render 40 lần&quot; nghe thì đáng báo động mà thường chẳng tốn gì: một lần render của React là một lời gọi hàm sinh ra các object, còn phần đắt đỏ — ghi vào DOM — chỉ xảy ra với đúng phần đã đổi. Tối ưu theo SỐ LẦN render dẫn tới việc rắc <code>memo</code> và <code>useCallback</code> khắp nơi, thêm phép so sánh, thêm mã, và thường làm mọi thứ chậm đi. Hãy đo thời lượng, đừng đo tần suất: profiler của React DevTools cho biết mỗi lần render mất bao nhiêu mili giây. Một component render 40 lần với 0,2ms mỗi lần thì không sao; một cái render hai lần với 300ms mỗi lần mới là vấn đề thật.</p></div>
<a class="link-card dl" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Render và commit</span><span class="lc-sub">Một lần render thật ra làm gì, và vì sao phần lớn chúng là rẻ.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/Profiler" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Profiler</span><span class="lc-sub">Đo thời lượng render bằng mã, khi bảng DevTools không đủ.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một <code>console.log</code> vào một con và xác nhận nó render lại mỗi khi cha render, kể cả khi prop của nó không đổi.</li>
<li>Chuyển state xuống đúng con dùng nó và xem cha thôi render lại các anh em không liên quan.</li>
<li>Liệt kê ba nguyên nhân render lại: state đổi, cha render, context đổi.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi tên được vì sao một component render lại và giảm render thừa bằng cách dời state.</p></div>

<h3>🔬 Đo thật: vì sao component render lại (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Bốn khối trên một trang, mỗi khối một nguyên nhân. Mỗi component đếm số lần render đã commit bằng một <code>useEffect</code> không có mảng phụ thuộc (chạy sau mỗi commit):</p>
<pre><code class="language-tsx">'use client';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const dem: Record&lt;string, number&gt; = {};                   <span class="tok-comment">  // số lần render ĐÃ commit mỗi component — để đo</span>
const ms: number[] = [];                                  <span class="tok-comment">  // thời gian một lần bấm → commit xong (ms)</span>
if (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __ms: ms });
function useDem(ten: string) {
  useEffect(() =&gt; { dem[ten] = (dem[ten] ?? 0) + 1; });   <span class="tok-comment">  // không mảng phụ thuộc ⇒ chạy sau MỖI commit</span>
}

<span class="tok-comment">// A — nguyên nhân 2: cha render ⇒ mọi con render, props có đổi hay không</span>
function ConKhongProp() { useDem('conKhongProp'); return &lt;p&gt;con không prop&lt;/p&gt;; }
function ConPropCoDinh({ nhan }: { nhan: string }) { useDem('conPropCoDinh'); return &lt;p&gt;con prop cố định: {nhan}&lt;/p&gt;; }
function ChaGiuState() {
  const [n, setN] = useState(0);
  const t0 = useRef(0);
  useDem('cha');
  useLayoutEffect(() =&gt; { if (t0.current) ms.push(performance.now() - t0.current); });
  return (
    &lt;section id="a" className="rounded border p-2"&gt;
      &lt;button id="cha-bam" onClick={() =&gt; { t0.current = performance.now(); setN(n + 1); }} className="rounded border px-2"&gt;cha: {n}&lt;/button&gt;
      &lt;ConKhongProp /&gt;
      &lt;ConPropCoDinh nhan="cố định" /&gt;
    &lt;/section&gt;
  );
}

<span class="tok-comment">// B — dời state xuống: chỉ cái nút giữ state, anh em không render</span>
function NutDem() { const [n, setN] = useState(0); useDem('nutDem'); return &lt;button id="nut-dem" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;nút: {n}&lt;/button&gt;; }
function AnhEm() { useDem('anhEm'); return &lt;p&gt;anh em của nút&lt;/p&gt;; }

<span class="tok-comment">// C — nguyên nhân 3: context đổi ⇒ chỗ đọc render, dù cha của nó không render</span>
const Ctx = createContext(0);
function KhoCtx({ children }: { children: ReactNode }) {
  const [v, setV] = useState(0);
  return &lt;Ctx value={v}&gt;&lt;button id="ctx-bam" onClick={() =&gt; setV(v + 1)} className="rounded border px-2"&gt;context: {v}&lt;/button&gt;{children}&lt;/Ctx&gt;;
}
function DocCtx() { const v = useContext(Ctx); useDem('docCtx'); return &lt;p&gt;đọc context: {v}&lt;/p&gt;; }
function KhongDocCtx() { useDem('khongDocCtx'); return &lt;p&gt;không đọc context&lt;/p&gt;; }

<span class="tok-comment">// D — nguyên nhân 4: key đổi ⇒ không phải render lại, mà gỡ + gắn</span>
const gan = { conKey: 0 };
if (typeof window !== 'undefined') Object.assign(window, { __gan: gan });
function ConKey() {
  const [n, setN] = useState(0);
  useEffect(() =&gt; { gan.conKey++; }, []);
  return &lt;button id="con-key" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;state riêng: {n}&lt;/button&gt;;
}
function DoiKey() {
  const [k, setK] = useState(0);
  return &lt;p&gt;&lt;button id="doi-key" onClick={() =&gt; setK(k + 1)} className="rounded border px-2"&gt;đổi key&lt;/button&gt; &lt;ConKey key={k} /&gt;&lt;/p&gt;;
}

export default function ViSao() {
  return (
    &lt;div className="grid grid-cols-2 gap-3 p-4 font-sans text-base"&gt;
      &lt;ChaGiuState /&gt;
      &lt;section id="b" className="rounded border p-2"&gt;&lt;NutDem /&gt;&lt;AnhEm /&gt;&lt;/section&gt;
      &lt;section id="c" className="rounded border p-2"&gt;&lt;KhoCtx&gt;&lt;DocCtx /&gt;&lt;KhongDocCtx /&gt;&lt;/KhoCtx&gt;&lt;/section&gt;
      &lt;section id="d" className="rounded border p-2"&gt;&lt;DoiKey /&gt;&lt;/section&gt;
    &lt;/div&gt;
  );
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|vi-sao'
✓ Compiled successfully in 1074ms
├ ○ /vi-sao
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi</div>
<p>Đo trên Chromium, mỗi khối bấm ba lần:</p>
<div class="out">$ curl -s -o /dev/null -w 'next start GET /vi-sao → %{http_code}\\n' localhost:3001/vi-sao
next start GET /vi-sao → 200
$ curl -s -o /dev/null -w 'next dev GET /vi-sao → %{http_code}\\n' localhost:3000/vi-sao
next dev GET /vi-sao → 200

vừa tải (mọi bộ đếm)              : 1   (next dev: 2 — Strict Mode)
A · 3 cú "cha"                    : cha 4 · ConKhongProp 4 · ConPropCoDinh 4
A · bản ghi DOM (MutationObserver) : text 0→1 @cha-bam, text 1→2 @cha-bam, text 2→3 @cha-bam
A · bấm → commit (ms)              : 0.4 · 0.3 · 0.2   (next dev: 1.0 · 0.6 · 0.6)
B · 3 cú "nút"                    : NutDem 4 · AnhEm 1
C · 3 cú "context"                : DocCtx 4 · KhongDocCtx 1
D · bấm 2 lần, rồi đổi key        : "state riêng: 2" → "state riêng: 0" · mounts 1 → 2</div>
<p>Nguyên nhân 2 đúng như bài: cả hai con render cùng cha — con không props lẫn con có prop không bao giờ đổi. Vậy mà DOM chỉ có ba bản ghi, là chữ trên nút đếm: chín lần render, ba lần ghi, mỗi cú bấm chưa tới một mili giây trên máy của khoá. Dời state vào nút thì anh em của nó đứng yên ở một lần. Khối context cho thêm một chi tiết đáng nhớ: anh em không đọc context đứng yên ở một vì <code>children</code> do trang tạo ra, mà trang không render lại — mẹo "children làm prop" của bài 7.5. Dưới <code>next dev</code> mọi bộ đếm khởi đầu là 2 (Strict Mode chạy effect gắn hai lần) và mỗi cú bấm chậm hơn — đếm và đo trên <code>next start</code>.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># mở /vi-sao, bấm mỗi nút 3 lần, rồi trong console DevTools:</span>
window.__dem
window.__ms</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-1-virtual-dom" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.1 — React cập nhật màn hình thế nào</span><span class="lc-sub">Element, render và commit</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-2-4-dat-state" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 2.4 — State nên ở đâu</span><span class="lc-sub">Nâng state lên, một nguồn sự thật, state dẫn xuất</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">Phần tối ưu, học ở bài sau</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Render lại</span><span class="v">React chạy lại một component để tính lại UI của nó.</span></div>
  <div class="kv"><span class="k">State đổi</span><span class="v">State của chính component cập nhật — nó render lại.</span></div>
  <div class="kv"><span class="k">Cha render</span><span class="v">Cha render lại thì mặc định render lại các con.</span></div>
  <div class="kv"><span class="k">Context đổi</span><span class="v">Consumer render lại khi giá trị context đổi.</span></div>
  <div class="kv"><span class="k">Prop không đổi</span><span class="v">Con vẫn render lại cùng cha trừ khi được memo.</span></div>
  <div class="kv"><span class="k">Dời state xuống</span><span class="v">Đẩy state xuống nơi dùng nó để thu hẹp vùng render.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một component render lại vì ba lý do: state của nó đổi, cha render lại, hoặc context nó đọc đổi.</li><li>Mặc định cha render lại thì render lại mọi con, kể cả khi prop không đổi.</li><li>Dời state xuống đúng component dùng nó sẽ thu hẹp vùng render lại.</li><li>Render lại thường rẻ — đừng tối ưu trước khi đo.</li></ul>

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
${G07_4}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Telling a component to skip a re-render</h2>
<p class="lead">Lesson 7.3 said a child re-renders whenever its parent does, even with unchanged props. <code>React.memo</code> is how you opt a component out of that: wrap it, and React will skip its re-render when its props are the same as last time.</p>

<h3>What React.memo does</h3>
<pre><code class="language-javascript">const Row = React.memo(function Row({ label }) {
  return &lt;li&gt;{label}&lt;/li&gt;;
});</code></pre>
<p>A memoised component compares its new props to its previous props (a shallow <code>Object.is</code> check per prop). If they are all equal, React <strong>reuses last render's output and skips calling the function.</strong> Captured live — a plain child and a memoised child, both under a parent that re-renders three times, with an unchanged prop:</p>
<div class="out">PLAIN child renders (3 parent renders): 3
MEMO  child renders (props unchanged):   1</div>
<p>The plain child rendered on all three parent renders; the memoised child rendered <strong>once</strong> and then skipped the two re-renders where its prop didn't change. That is the whole feature — skip work when the inputs are identical.</p>

<h3>The catch: props must be referentially stable</h3>
<p><code>React.memo</code> compares props with <code>Object.is</code>, so it only helps if the props actually stay equal between renders. Pass a fresh object, array or function as a prop and the memo is defeated — the prop is a new reference every render, so the comparison always says "changed":</p>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ memo useless — a new object and a new function every render</span>
&lt;Row label="x" style={{ margin: 4 }} onClick={() =&gt; go()} /&gt;

<span class="tok-comment">// ✅ stabilise the references so memo can actually skip</span>
const style = useMemo(() =&gt; ({ margin: 4 }), []);
const onClick = useCallback(() =&gt; go(), []);
&lt;Row label="x" style={style} onClick={onClick} /&gt;</code></pre>
<p>This is why <code>React.memo</code>, <code>useMemo</code> and <code>useCallback</code> travel together: memoising a component is pointless unless its object/function props are also memoised. This coupling is a big part of why the manual approach is fiddly — and why <b>React Compiler 1.0</b> — released, and switched on in Next.js 16 with <code>reactCompiler: true</code> (lesson 6.2) — does it for you. Measured in the 🔬 section below.</p>

<h3>When to reach for it</h3>
<p>Use <code>React.memo</code> when a component is <em>expensive to render</em> (a big list row, a heavy chart) <em>and</em> re-renders often with unchanged props. Do not wrap every component in it: the prop comparison itself costs a little, and for cheap components it's slower than just re-rendering. As always — measure first (next lesson), then memo the few components a profiler flags, not everything on principle.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — the feed and message lists memoise their row components, because a list of hundreds of items re-rendering every row on each parent update is measurable, and each row is non-trivial (media, formatting). The stable-reference discipline follows: row callbacks are <code>useCallback</code>'d, and item objects come straight from the store so their reference is stable until the item actually changes. Cheap components elsewhere on the site are left un-memoised on purpose.</p>
</div>
<h3>What React.memo actually does</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It compares props shallowly</b> — <code>Object.is</code> on each prop. If all are identical, React skips rendering this component and its subtree.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>So every prop must be stable</b> — One inline object, array or arrow function is enough to make the comparison fail every time — and then you pay for the comparison and get nothing.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It does not help with context or state</b> — A memoised component still re-renders when its own state changes or when a context it reads changes. Memo only guards the props path.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>It is worth it when the subtree is expensive</b> — A big list, a chart, a heavy table. For a small component, the comparison can cost more than the render.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — wrapping a component in <code>memo</code> while a parent passes it a new function each render.</strong> <code>export default memo(Row)</code> with <code>&lt;Row onSelect={() =&gt; select(id)} /&gt;</code> in the parent memoises nothing: the arrow is a new function identity on every parent render, so the shallow comparison fails and <code>Row</code> re-renders exactly as often as before — plus a props comparison per row. On a 500-row table that is 500 wasted comparisons per render. Memo only pays off when the whole props object is stable, which usually means <code>useCallback</code> for handlers and <code>useMemo</code> for objects at the same time. Profile first: if the profiler does not show this component as expensive, do not memo it.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — memo</span><span class="lc-sub">How the comparison works, and the section on when you should not use it.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useCallback#should-you-add-usecallback-everywhere" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Should you add useCallback everywhere?</span><span class="lc-sub">The companion answer: useCallback and memo only work as a pair.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Wrap a pure child in <code>React.memo</code> and confirm it skips re-render when its props are unchanged.</li>
<li>Pass an inline object or arrow function as a prop and watch memo stop working; fix it with <code>useMemo</code>/<code>useCallback</code>.</li>
<li>Write one sentence on when <code>React.memo</code> is worth it and when it is noise.</li>
</ol>
<p><strong>Done when:</strong> you can memoize a component and avoid the inline-prop pitfall that defeats it.</p></div>

<h3>🔬 Measured: React.memo in a real Next.js app (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Six children under one parent (counting committed renders), and a 500-row table that re-renders for an unrelated counter — plain rows, memo rows with a new arrow, memo rows with <code>useCallback</code>. The same two pages are also built in a copy of the lab with <code>reactCompiler: true</code>:</p>
<pre><code class="language-tsx">'use client';
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const dem: Record&lt;string, number&gt; = {};                   <span class="tok-comment">  // số lần render ĐÃ commit — để đo</span>
if (typeof window !== 'undefined') Object.assign(window, { __dem: dem });
function useDem(ten: string) {
  useEffect(() =&gt; { dem[ten] = (dem[ten] ?? 0) + 1; });
}
function go() {}

type P = { label: string; style?: { margin: number }; onClick?: () =&gt; void };
function Thuong({ label }: P) { useDem('thuong'); return &lt;li&gt;thường · {label}&lt;/li&gt;; }
const Memo = memo(function Memo({ label }: P) { useDem('memo'); return &lt;li&gt;memo · {label}&lt;/li&gt;; });
const MemoInline = memo(function MemoInline({ label }: P) { useDem('memoInline'); return &lt;li&gt;memo + prop viết thẳng · {label}&lt;/li&gt;; });
const MemoOnDinh = memo(function MemoOnDinh({ label }: P) { useDem('memoOnDinh'); return &lt;li&gt;memo + useMemo/useCallback · {label}&lt;/li&gt;; });

const Ctx = createContext(0);
const MemoDocCtx = memo(function MemoDocCtx({ label }: P) { const v = useContext(Ctx); useDem('memoDocCtx'); return &lt;li&gt;memo đọc context · {label} · {v}&lt;/li&gt;; });
const MemoState = memo(function MemoState({ label }: P) {
  const [n, setN] = useState(0);
  useDem('memoState');
  return &lt;li&gt;&lt;button id="memo-state" onClick={() =&gt; setN(n + 1)} className="rounded border px-1"&gt;memo có state · {label}: {n}&lt;/button&gt;&lt;/li&gt;;
});

export default function MemoCon() {
  const [n, setN] = useState(0);
  const [v, setV] = useState(0);
  const style = useMemo(() =&gt; ({ margin: 4 }), []);
  const onClick = useCallback(() =&gt; go(), []);
  return (
    &lt;Ctx value={v}&gt;
      &lt;div className="space-y-1 p-4 font-sans text-base"&gt;
        &lt;p className="space-x-2"&gt;
          &lt;button id="cha" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;cha: {n}&lt;/button&gt;
          &lt;button id="ctx" onClick={() =&gt; setV(v + 1)} className="rounded border px-2"&gt;context: {v}&lt;/button&gt;
        &lt;/p&gt;
        &lt;ul&gt;
          &lt;Thuong label="x" /&gt;
          &lt;Memo label="x" /&gt;
          &lt;MemoInline label="x" style={{ margin: 4 }} onClick={() =&gt; go()} /&gt;
          &lt;MemoOnDinh label="x" style={style} onClick={onClick} /&gt;
          &lt;MemoDocCtx label="x" /&gt;
          &lt;MemoState label="x" /&gt;
        &lt;/ul&gt;
      &lt;/div&gt;
    &lt;/Ctx&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';

<span class="tok-comment">// 500 hàng "không tầm thường": định dạng tiền + ngày theo tiếng Việt ở mỗi lần render</span>
const HANG = Array.from({ length: 500 }, (_, i) =&gt; ({ id: i, ten: &#96;Bác sĩ \${i + 1}&#96;, luong: 9_000_000 + i * 7919, ngay: new Date(2026, i % 12, 1 + (i % 28)) }));
type R = (typeof HANG)[number];
type Kieu = 'thuong' | 'memoHong' | 'memoDung';
const ms: Record&lt;Kieu, number[]&gt; = { thuong: [], memoHong: [], memoDung: [] };    <span class="tok-comment">  // bấm → commit (ms)</span>
if (typeof window !== 'undefined') Object.assign(window, { __ms: ms });

function Hang({ r, onSelect }: { r: R; onSelect: (id: number) =&gt; void }) {
  return (
    &lt;tr onClick={() =&gt; onSelect(r.id)}&gt;
      &lt;td&gt;{r.ten}&lt;/td&gt;&lt;td&gt;{r.luong.toLocaleString('vi-VN')} ₫&lt;/td&gt;&lt;td&gt;{r.ngay.toLocaleDateString('vi-VN')}&lt;/td&gt;
    &lt;/tr&gt;
  );
}
const HangMemo = memo(Hang);

function Bang({ kieu }: { kieu: Kieu }) {
  const [n, setN] = useState(0);                          <span class="tok-comment">  // một bộ đếm KHÔNG liên quan tới các hàng</span>
  const [, setChon] = useState(-1);
  const t0 = useRef(0);
  useLayoutEffect(() =&gt; { if (t0.current) { ms[kieu].push(performance.now() - t0.current); t0.current = 0; } });
  const onSelect = useCallback((id: number) =&gt; setChon(id), []);
  return (
    &lt;div className="h-40 overflow-hidden rounded border p-1 text-xs"&gt;
      &lt;button id={&#96;b-\${kieu}&#96;} onClick={() =&gt; { t0.current = performance.now(); setN(n + 1); }} className="rounded border px-2"&gt;{kieu}: {n}&lt;/button&gt;
      &lt;table&gt;&lt;tbody&gt;
        {HANG.map((r) =&gt;
          kieu === 'thuong' ? &lt;Hang key={r.id} r={r} onSelect={(id) =&gt; setChon(id)} /&gt;
          : kieu === 'memoHong' ? &lt;HangMemo key={r.id} r={r} onSelect={(id) =&gt; setChon(id)} /&gt;
          : &lt;HangMemo key={r.id} r={r} onSelect={onSelect} /&gt;)}
      &lt;/tbody&gt;&lt;/table&gt;
    &lt;/div&gt;
  );
}

export default function BangMemo() {
  return &lt;div className="grid grid-cols-3 gap-2 p-2 font-sans"&gt;&lt;Bang kieu="thuong" /&gt;&lt;Bang kieu="memoHong" /&gt;&lt;Bang kieu="memoDung" /&gt;&lt;/div&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|memo-con'
✓ Compiled successfully in 1053ms
├ ○ /memo-con
├ ○ /memo-con/bang
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/memo-con &amp;&amp; echo 'eslint: 0 lỗi'
eslint: 0 lỗi
$ grep -n reactCompiler next.config.ts
4:  reactCompiler: true,                       // bật React Compiler (babel-plugin-react-compiler)
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|memo-con'
✓ Compiled successfully in 1262ms
├ ○ /memo-con
├ ○ /memo-con/bang
$ grep -l memo_cache_sentinel .next/static/chunks/*.js | xargs grep -l 'memo + prop' | wc -l | xargs echo 'chunk memo-con đã qua Compiler:'
chunk memo-con đã qua Compiler: 1</div>
<p>Measured in Chromium (next start):</p>
<div class="out">$ curl -s -o /dev/null -w 'c1 next start GET /memo-con → %{http_code}\\n' localhost:3001/memo-con
c1 next start GET /memo-con → 200
$ curl -s -o /dev/null -w 'c6 (Compiler) next start GET /memo-con → %{http_code}\\n' localhost:3002/memo-con
c6 (Compiler) next start GET /memo-con → 200

2 clicks on "cha" (3 parent renders): plain 3 · memo 1 · memo+inline 3 · memo+useMemo/useCallback 1
2 clicks on "context"               : memo reading context 3 · memo 1
2 clicks inside MemoState           : 3
React Compiler, 2 clicks on "cha"   : plain 1 · memo+inline 1 · (context still 3)
500 rows, ms per click (median of 25): plain 5.5 · memo+new arrow 5.8 · memo+useCallback 0.3
… same, with React Compiler          : plain 1.0 · memo+new arrow 1.0 · memo+useCallback 0.3</div>
<p>The lesson's numbers hold: plain 3, memo 1. An inline object and arrow made memo useless (3, same as plain), and <code>useMemo</code>/<code>useCallback</code> brought it back to 1. Memo did not block context (3) or the component's own state (3). On 500 rows the broken memo was slightly <b>slower</b> than no memo — every row still rendered, plus 500 failed comparisons — while stable props skipped the whole table. ESLint reported nothing about the inline props. With React Compiler on, the plain child and the inline-prop child rendered once, and the plain table dropped to about a millisecond: the compiler caches elements and inline values for you — context still re-renders its consumers.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># open /memo-con: click "cha" twice, "context" twice; then in the console: window.__dem</span>
<span class="tok-comment"># open /memo-con/bang: click each button ~25 times; then: window.__ms</span>
<span class="tok-comment"># then npm i -D babel-plugin-react-compiler, add reactCompiler: true to next.config.ts, rebuild and compare</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-2-memo" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.2 — memo, useMemo, useCallback</span><span class="lc-sub">Only where the measurement says so, and React Compiler</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-1-do" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.1 — Measuring with the React Profiler</span><span class="lc-sub">200 doctors, one click, real numbers</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">Slides + optimisation practice</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React.memo</span><span class="v">Wraps a component to skip re-render when props are shallow-equal.</span></div>
  <div class="kv"><span class="k">Shallow equality</span><span class="v">Props compared by reference; new references look changed.</span></div>
  <div class="kv"><span class="k">Inline prop trap</span><span class="v">A new object/function each render defeats memo.</span></div>
  <div class="kv"><span class="k">Pairs with useCallback/useMemo</span><span class="v">Stabilise props so memo can actually skip.</span></div>
  <div class="kv"><span class="k">Pure component</span><span class="v">Output depends only on props — the case memo fits.</span></div>
  <div class="kv"><span class="k">Overuse cost</span><span class="v">Memo everywhere adds comparison overhead for no gain.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>React.memo</code> skips a child's re-render when its props are shallow-equal.</li><li>It only helps for pure children whose props are referentially stable.</li><li>Inline objects and arrow functions create new references each render and defeat memo — stabilise them with <code>useMemo</code>/<code>useCallback</code>.</li><li>Do not wrap everything in memo; the comparison itself costs something.</li></ul>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Bảo một component bỏ qua một lần render lại</h2>
<p class="lead">Bài 7.3 nói một con render lại mỗi khi cha render lại, dù props không đổi. <code>React.memo</code> là cách bạn cho một component thoát khỏi điều đó: bọc nó, và React sẽ bỏ qua render lại nó khi props của nó giống lần trước.</p>

<h3>React.memo làm gì</h3>
<pre><code class="language-javascript">const Row = React.memo(function Row({ label }) {
  return &lt;li&gt;{label}&lt;/li&gt;;
});</code></pre>
<p>Một component memo hoá so props mới với props trước (một phép so nông <code>Object.is</code> mỗi prop). Nếu tất cả bằng nhau, React <strong>tái dùng output của render trước và bỏ qua việc gọi hàm.</strong> Ghi trực tiếp — một con thường và một con memo, cả hai dưới một cha render lại ba lần, với một prop không đổi:</p>
<div class="out">PLAIN child renders (3 parent renders): 3
MEMO  child renders (props unchanged):   1</div>
<p>Con thường render ở cả ba render của cha; con memo render <strong>một</strong> lần rồi bỏ qua hai render mà prop không đổi. Đó là toàn bộ tính năng — bỏ qua việc khi đầu vào y hệt.</p>

<h3>Cái bẫy: props phải ổn định về tham chiếu</h3>
<p><code>React.memo</code> so props bằng <code>Object.is</code>, nên nó chỉ giúp nếu props thật sự giữ bằng nhau giữa các render. Truyền một object, mảng hay hàm mới làm prop là memo bị vô hiệu — prop là một tham chiếu mới mỗi render, nên phép so luôn nói "đã đổi":</p>
<pre><code class="language-javascript"><span class="tok-comment">// ❌ memo vô dụng — một object mới và một hàm mới mỗi render</span>
&lt;Row label="x" style={{ margin: 4 }} onClick={() =&gt; go()} /&gt;

<span class="tok-comment">// ✅ ổn định tham chiếu để memo thật sự bỏ qua được</span>
const style = useMemo(() =&gt; ({ margin: 4 }), []);
const onClick = useCallback(() =&gt; go(), []);
&lt;Row label="x" style={style} onClick={onClick} /&gt;</code></pre>
<p>Vì thế <code>React.memo</code>, <code>useMemo</code> và <code>useCallback</code> đi cùng nhau: memo hoá một component là vô nghĩa trừ khi các prop object/hàm của nó cũng được memo hoá. Sự ràng buộc này là một phần lớn lý do cách thủ công lằng nhằng — và vì sao <b>React Compiler 1.0</b> — đã phát hành, bật trong Next.js 16 bằng <code>reactCompiler: true</code> (bài 6.2) — làm hộ bạn. Số đo ở mục 🔬 bên dưới.</p>

<h3>Khi nào với tới nó</h3>
<p>Dùng <code>React.memo</code> khi một component <em>đắt để render</em> (một hàng danh sách lớn, một biểu đồ nặng) <em>và</em> render lại thường xuyên với props không đổi. Đừng bọc mọi component vào nó: bản thân phép so props tốn một chút, và với component rẻ thì nó chậm hơn là cứ render lại. Như mọi khi — đo trước (bài sau), rồi memo vài component mà profiler chỉ ra, không phải mọi thứ theo nguyên tắc.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — danh sách feed và tin nhắn memo hoá các component hàng của chúng, vì một danh sách hàng trăm phần tử render lại từng hàng ở mỗi cập nhật cha là đo được, và mỗi hàng không tầm thường (media, định dạng). Kỷ luật tham-chiếu-ổn-định theo sau: callback của hàng được <code>useCallback</code>, và object phần tử tới thẳng từ store nên tham chiếu của chúng ổn định cho tới khi phần tử thật sự đổi. Các component rẻ ở nơi khác trên site được để không-memo có chủ đích.</p>
</div>
<h3>React.memo thật ra làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó so props theo kiểu nông</b> — Dùng <code>Object.is</code> trên từng prop. Nếu tất cả đều y hệt, React bỏ qua việc render component này và cả cây con của nó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nên mọi prop đều phải ổn định</b> — Một object, mảng hay arrow function viết thẳng cũng đủ làm phép so hỏng ở mọi lần — và thế là bạn trả tiền cho phép so mà chẳng được gì.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó không giúp gì với context hay state</b> — Một component đã memo vẫn render lại khi state của chính nó đổi hoặc khi một context nó đọc đổi. Memo chỉ canh gác con đường props.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó đáng dùng khi cây con đắt đỏ</b> — Một danh sách lớn, một biểu đồ, một bảng nặng. Với một component nhỏ, phép so có thể tốn hơn cả việc render.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — bọc một component trong <code>memo</code> trong khi cha truyền cho nó một hàm mới ở mỗi lần render.</strong> <code>export default memo(Row)</code> đi cùng <code>&lt;Row onSelect={() =&gt; select(id)} /&gt;</code> ở cha thì chẳng ghi nhớ được gì: cái arrow là một danh tính hàm mới ở mọi lần cha render, nên phép so nông hỏng và <code>Row</code> render lại đúng bằng số lần như trước — cộng thêm một phép so props cho mỗi dòng. Trên một bảng 500 dòng thì đó là 500 phép so lãng phí mỗi lần render. Memo chỉ có lãi khi cả object props đều ổn định, và thường điều đó nghĩa là phải dùng <code>useCallback</code> cho handler và <code>useMemo</code> cho object cùng lúc. Hãy đo trước: nếu profiler không cho thấy component này đắt đỏ thì đừng memo nó.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — memo</span><span class="lc-sub">Phép so hoạt động ra sao, và mục nói về khi nào bạn KHÔNG nên dùng nó.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useCallback#should-you-add-usecallback-everywhere" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">react.dev — Có nên thêm useCallback ở mọi nơi?</span><span class="lc-sub">Câu trả lời đi kèm: useCallback và memo chỉ chạy khi đi thành cặp.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Bọc một con thuần trong <code>React.memo</code> và xác nhận nó bỏ qua render lại khi prop không đổi.</li>
<li>Truyền một object hoặc arrow inline làm prop và xem memo ngừng hoạt động; sửa bằng <code>useMemo</code>/<code>useCallback</code>.</li>
<li>Viết một câu khi nào <code>React.memo</code> đáng dùng và khi nào chỉ là nhiễu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn memo được một component và tránh bẫy prop inline làm nó vô hiệu.</p></div>

<h3>🔬 Đo thật: React.memo trong một ứng dụng Next.js thật (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Sáu component con dưới một cha (đếm số lần render đã commit), và một bảng 500 hàng render lại vì một bộ đếm không liên quan — hàng thường, hàng memo nhận hàm mũi tên mới, hàng memo với <code>useCallback</code>. Hai trang này cũng được dựng trong một bản sao lab bật <code>reactCompiler: true</code>:</p>
<pre><code class="language-tsx">'use client';
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const dem: Record&lt;string, number&gt; = {};                   <span class="tok-comment">  // số lần render ĐÃ commit — để đo</span>
if (typeof window !== 'undefined') Object.assign(window, { __dem: dem });
function useDem(ten: string) {
  useEffect(() =&gt; { dem[ten] = (dem[ten] ?? 0) + 1; });
}
function go() {}

type P = { label: string; style?: { margin: number }; onClick?: () =&gt; void };
function Thuong({ label }: P) { useDem('thuong'); return &lt;li&gt;thường · {label}&lt;/li&gt;; }
const Memo = memo(function Memo({ label }: P) { useDem('memo'); return &lt;li&gt;memo · {label}&lt;/li&gt;; });
const MemoInline = memo(function MemoInline({ label }: P) { useDem('memoInline'); return &lt;li&gt;memo + prop viết thẳng · {label}&lt;/li&gt;; });
const MemoOnDinh = memo(function MemoOnDinh({ label }: P) { useDem('memoOnDinh'); return &lt;li&gt;memo + useMemo/useCallback · {label}&lt;/li&gt;; });

const Ctx = createContext(0);
const MemoDocCtx = memo(function MemoDocCtx({ label }: P) { const v = useContext(Ctx); useDem('memoDocCtx'); return &lt;li&gt;memo đọc context · {label} · {v}&lt;/li&gt;; });
const MemoState = memo(function MemoState({ label }: P) {
  const [n, setN] = useState(0);
  useDem('memoState');
  return &lt;li&gt;&lt;button id="memo-state" onClick={() =&gt; setN(n + 1)} className="rounded border px-1"&gt;memo có state · {label}: {n}&lt;/button&gt;&lt;/li&gt;;
});

export default function MemoCon() {
  const [n, setN] = useState(0);
  const [v, setV] = useState(0);
  const style = useMemo(() =&gt; ({ margin: 4 }), []);
  const onClick = useCallback(() =&gt; go(), []);
  return (
    &lt;Ctx value={v}&gt;
      &lt;div className="space-y-1 p-4 font-sans text-base"&gt;
        &lt;p className="space-x-2"&gt;
          &lt;button id="cha" onClick={() =&gt; setN(n + 1)} className="rounded border px-2"&gt;cha: {n}&lt;/button&gt;
          &lt;button id="ctx" onClick={() =&gt; setV(v + 1)} className="rounded border px-2"&gt;context: {v}&lt;/button&gt;
        &lt;/p&gt;
        &lt;ul&gt;
          &lt;Thuong label="x" /&gt;
          &lt;Memo label="x" /&gt;
          &lt;MemoInline label="x" style={{ margin: 4 }} onClick={() =&gt; go()} /&gt;
          &lt;MemoOnDinh label="x" style={style} onClick={onClick} /&gt;
          &lt;MemoDocCtx label="x" /&gt;
          &lt;MemoState label="x" /&gt;
        &lt;/ul&gt;
      &lt;/div&gt;
    &lt;/Ctx&gt;
  );
}</code></pre><pre><code class="language-tsx">'use client';
import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';

<span class="tok-comment">// 500 hàng "không tầm thường": định dạng tiền + ngày theo tiếng Việt ở mỗi lần render</span>
const HANG = Array.from({ length: 500 }, (_, i) =&gt; ({ id: i, ten: &#96;Bác sĩ \${i + 1}&#96;, luong: 9_000_000 + i * 7919, ngay: new Date(2026, i % 12, 1 + (i % 28)) }));
type R = (typeof HANG)[number];
type Kieu = 'thuong' | 'memoHong' | 'memoDung';
const ms: Record&lt;Kieu, number[]&gt; = { thuong: [], memoHong: [], memoDung: [] };    <span class="tok-comment">  // bấm → commit (ms)</span>
if (typeof window !== 'undefined') Object.assign(window, { __ms: ms });

function Hang({ r, onSelect }: { r: R; onSelect: (id: number) =&gt; void }) {
  return (
    &lt;tr onClick={() =&gt; onSelect(r.id)}&gt;
      &lt;td&gt;{r.ten}&lt;/td&gt;&lt;td&gt;{r.luong.toLocaleString('vi-VN')} ₫&lt;/td&gt;&lt;td&gt;{r.ngay.toLocaleDateString('vi-VN')}&lt;/td&gt;
    &lt;/tr&gt;
  );
}
const HangMemo = memo(Hang);

function Bang({ kieu }: { kieu: Kieu }) {
  const [n, setN] = useState(0);                          <span class="tok-comment">  // một bộ đếm KHÔNG liên quan tới các hàng</span>
  const [, setChon] = useState(-1);
  const t0 = useRef(0);
  useLayoutEffect(() =&gt; { if (t0.current) { ms[kieu].push(performance.now() - t0.current); t0.current = 0; } });
  const onSelect = useCallback((id: number) =&gt; setChon(id), []);
  return (
    &lt;div className="h-40 overflow-hidden rounded border p-1 text-xs"&gt;
      &lt;button id={&#96;b-\${kieu}&#96;} onClick={() =&gt; { t0.current = performance.now(); setN(n + 1); }} className="rounded border px-2"&gt;{kieu}: {n}&lt;/button&gt;
      &lt;table&gt;&lt;tbody&gt;
        {HANG.map((r) =&gt;
          kieu === 'thuong' ? &lt;Hang key={r.id} r={r} onSelect={(id) =&gt; setChon(id)} /&gt;
          : kieu === 'memoHong' ? &lt;HangMemo key={r.id} r={r} onSelect={(id) =&gt; setChon(id)} /&gt;
          : &lt;HangMemo key={r.id} r={r} onSelect={onSelect} /&gt;)}
      &lt;/tbody&gt;&lt;/table&gt;
    &lt;/div&gt;
  );
}

export default function BangMemo() {
  return &lt;div className="grid grid-cols-3 gap-2 p-2 font-sans"&gt;&lt;Bang kieu="thuong" /&gt;&lt;Bang kieu="memoHong" /&gt;&lt;Bang kieu="memoDung" /&gt;&lt;/div&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|memo-con'
✓ Compiled successfully in 1053ms
├ ○ /memo-con
├ ○ /memo-con/bang
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx eslint src/app/memo-con &amp;&amp; echo 'eslint: 0 lỗi'
eslint: 0 lỗi
$ grep -n reactCompiler next.config.ts
4:  reactCompiler: true,                       // bật React Compiler (babel-plugin-react-compiler)
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|memo-con'
✓ Compiled successfully in 1262ms
├ ○ /memo-con
├ ○ /memo-con/bang
$ grep -l memo_cache_sentinel .next/static/chunks/*.js | xargs grep -l 'memo + prop' | wc -l | xargs echo 'chunk memo-con đã qua Compiler:'
chunk memo-con đã qua Compiler: 1</div>
<p>Đo trên Chromium (next start):</p>
<div class="out">$ curl -s -o /dev/null -w 'c1 next start GET /memo-con → %{http_code}\\n' localhost:3001/memo-con
c1 next start GET /memo-con → 200
$ curl -s -o /dev/null -w 'c6 (Compiler) next start GET /memo-con → %{http_code}\\n' localhost:3002/memo-con
c6 (Compiler) next start GET /memo-con → 200

2 cú "cha" (cha render 3 lần)        : plain 3 · memo 1 · memo+inline 3 · memo+useMemo/useCallback 1
2 cú "context"                       : memo reading context 3 · memo 1
2 cú trong MemoState                 : 3
React Compiler, 2 cú "cha"           : plain 1 · memo+inline 1 · (context still 3)
500 hàng, ms mỗi cú (trung vị 25 cú): plain 5.5 · memo+new arrow 5.8 · memo+useCallback 0.3
… cùng trang, có React Compiler      : plain 1.0 · memo+new arrow 1.0 · memo+useCallback 0.3</div>
<p>Số của bài đúng: thường 3, memo 1. Object và hàm mũi tên viết thẳng làm memo vô dụng (3, như con thường), <code>useMemo</code>/<code>useCallback</code> đưa về 1. Memo không chặn context (3) hay state riêng (3). Với 500 hàng, memo hỏng còn <b>chậm hơn</b> không memo một chút — hàng nào cũng vẫn render, cộng 500 phép so thất bại — còn props ổn định thì cả bảng được bỏ qua. ESLint không báo gì về prop viết thẳng. Bật React Compiler, con thường và con nhận prop viết thẳng chỉ render một lần, bảng hàng thường còn khoảng một mili giây: compiler tự giữ phần tử và giá trị viết thẳng cho bạn — context vẫn làm chỗ đọc render lại.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npx next start -p 3001
<span class="tok-comment"># mở /memo-con: bấm "cha" hai lần, "context" hai lần; rồi trong console: window.__dem</span>
<span class="tok-comment"># mở /memo-con/bang: bấm mỗi nút ~25 lần; rồi: window.__ms</span>
<span class="tok-comment"># rồi npm i -D babel-plugin-react-compiler, thêm reactCompiler: true vào next.config.ts, dựng lại và so</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-2-memo" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.2 — memo, useMemo, useCallback</span><span class="lc-sub">Chỉ ở chỗ số đo bảo cần, và React Compiler</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-1-do" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.1 — Đo bằng React Profiler</span><span class="lc-sub">200 bác sĩ, một cú bấm, số đo thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">Slide + bài luyện tối ưu</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React.memo</span><span class="v">Bọc một component để bỏ render lại khi prop bằng nhau nông.</span></div>
  <div class="kv"><span class="k">Bằng nhau nông</span><span class="v">Prop so theo tham chiếu; tham chiếu mới trông như đã đổi.</span></div>
  <div class="kv"><span class="k">Bẫy prop inline</span><span class="v">Một object/hàm mới mỗi render làm memo vô hiệu.</span></div>
  <div class="kv"><span class="k">Đi cặp useCallback/useMemo</span><span class="v">Ổn định prop để memo thật sự bỏ qua được.</span></div>
  <div class="kv"><span class="k">Component thuần</span><span class="v">Output chỉ phụ thuộc prop — trường hợp memo hợp.</span></div>
  <div class="kv"><span class="k">Chi phí lạm dụng</span><span class="v">Memo khắp nơi thêm chi phí so sánh mà không được gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>React.memo</code> bỏ render lại một con khi prop của nó bằng nhau nông.</li><li>Nó chỉ giúp cho con thuần có prop ổn định về tham chiếu.</li><li>Object và arrow inline tạo tham chiếu mới mỗi render và làm memo vô hiệu — ổn định chúng bằng <code>useMemo</code>/<code>useCallback</code>.</li><li>Đừng bọc mọi thứ trong memo; chính phép so đã tốn chi phí.</li></ul>

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
${G07_5}
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

<h3>Measuring before optimising</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Record a profile of the real interaction</b> — React DevTools → Profiler → record, do the slow thing, stop. You get every render with its duration.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Read duration, not count</b> — Sort by the widest bar. The component at the top is where the time is, regardless of how many times anything rendered.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Ask why it rendered</b> — The profiler tells you: props changed, state changed, parent rendered, context changed. That answer picks the fix for you.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Change one thing, re-record</b> — If the bar did not shrink, revert it. An optimisation you cannot measure is a complication you cannot justify.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — profiling a development build and optimising something that does not exist in production.</strong> The development build ships extra checks, warnings and StrictMode&#39;s double invocation, so components render twice and each render is measurably slower. Optimising against those numbers leads you to memoise things that were never a problem, and hides the ones that are. Profile a production build when you want real numbers — and build it with <code>next build --profile</code>: a plain <code>next build &amp;&amp; next start</code> ships React without its profiling timers, so the DevTools Profiler and <code>&lt;Profiler&gt;</code> record nothing (measured below) — and use the development profiler only for the &quot;why did this render?&quot; answer, which is accurate in both. The same caution applies to Lighthouse: run it against the built app, never against <code>next dev</code>.</p></div>
<a class="link-card dl" href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">Installing and using the profiler, including the &quot;why did this render&quot; panel.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Optimizing</span><span class="lc-sub">The Next.js side: what the framework already does before you optimise anything yourself.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Open React DevTools Profiler, record an interaction, and read which components rendered and how long each took.</li>
<li>Add an artificial slow component, confirm the profiler flags it, then optimise and re-measure.</li>
<li>Write down one metric before and after a change to prove the optimisation helped.</li>
</ol>
<p><strong>Done when:</strong> you can profile a real interaction and justify an optimisation with before/after numbers.</p></div>

<h3>🔬 Measured: profiling a slow component (React 19.3.0 · Next.js 16.4.6)</h3>
<p>A fake chart busy for 30 ms per render, beside a search box: on the left the box's state lives in the parent, on the right it was moved into the box. <code>&lt;Profiler onRender&gt;</code> records React's <code>actualDuration</code> (the same number the DevTools Profiler shows); the browser's Event Timing API records how long each keystroke took to paint (entries ≥ 16 ms only).</p>
<pre><code class="language-tsx">'use client';
import { Profiler, useState, type ProfilerOnRenderCallback } from 'react';

<span class="tok-comment">// số đo: Profiler API (cùng nguồn actualDuration với tab Profiler của React DevTools) + số lần BieuDo render + Event Timing của trình duyệt</span>
const prof: { id: string; phase: string; ms: number }[] = [];
const dem = { bieuDo: 0 };
if (typeof window !== 'undefined') Object.assign(window, { __prof: prof, __dem: dem });
const ghi: ProfilerOnRenderCallback = (id, phase, actualDuration) =&gt; {
  prof.push({ id, phase, ms: Math.round(actualDuration * 10) / 10 });
};

function cham(ms: number) {                               <span class="tok-comment">  // "component chậm giả": bận đúng ms mili giây</span>
  const t = performance.now();
  while (performance.now() - t &lt; ms) { /* bận */ }
}
function BieuDo() {
  cham(30);
  dem.bieuDo++;
  return &lt;p className="text-sm"&gt;📈 biểu đồ (chậm giả 30 ms)&lt;/p&gt;;
}

<span class="tok-comment">// TRƯỚC: state của ô tìm nằm ở cha ⇒ mỗi phím render lại cả BieuDo</span>
function Truoc() {
  const [q, setQ] = useState('');
  return (
    &lt;Profiler id="truoc" onRender={ghi}&gt;
      &lt;input id="o-truoc" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="trước" className="border px-1" /&gt;
      &lt;BieuDo /&gt;
    &lt;/Profiler&gt;
  );
}

<span class="tok-comment">// SAU: dời state xuống đúng ô tìm ⇒ BieuDo không bị kéo theo</span>
function OTim() {
  const [q, setQ] = useState('');
  return &lt;input id="o-sau" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="sau" className="border px-1" /&gt;;
}
function Sau() {
  return (
    &lt;Profiler id="sau" onRender={ghi}&gt;
      &lt;OTim /&gt;
      &lt;BieuDo /&gt;
    &lt;/Profiler&gt;
  );
}

export default function DoThu() {
  return &lt;div className="grid grid-cols-2 gap-4 p-4 font-sans"&gt;&lt;div&gt;&lt;Truoc /&gt;&lt;/div&gt;&lt;div&gt;&lt;Sau /&gt;&lt;/div&gt;&lt;/div&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|do-thu'
✓ Compiled successfully in 1205ms
├ ○ /do-thu
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build -- --profile
&gt; next build --profile
✓ Compiled successfully in 3.1s
├ ○ /do-thu
$ grep -l 'react-dom-profiling\\|__REACT_DEVTOOLS\\|onPostCommit' .next/static/chunks/*.js | head -3 | wc -l | xargs echo 'chunk có mã profiling:'
chunk có mã profiling: 2</div>
<p>Typing "abcde" in each box, in Chromium:</p>
<div class="out">$ curl -s -o /dev/null -w 'next dev GET /do-thu → %{http_code}\\n' localhost:3000/do-thu
next dev GET /do-thu → 200
$ curl -s -o /dev/null -w 'next start GET /do-thu → %{http_code}\\n' localhost:3001/do-thu
next start GET /do-thu → 200
$ curl -s -o /dev/null -w 'next start (build --profile) GET /do-thu → %{http_code}\\n' localhost:3002/do-thu
next start (build --profile) GET /do-thu → 200

--profile · before: BieuDo renders / ms : 5 · 30 · 30 · 30 · 30 · 30 · keydown [32, 32, 32, 32, 32]
--profile · after : BieuDo renders / ms : 0 · 0 · 0 · 0 · 0.1 · 0 · keydown [16]
next dev  · before                      : 10 · 60.3 · 60 · 60.1 · 60.1 · 60 · keydown [72, 64, 64, 64, 64]
next start (plain build) · before       : 5 · (no onRender call) · keydown [32, 32, 32, 32, 32]</div>
<p>The profiler pointed straight at the chart: five renders, 30 ms each, every keystroke about 32 ms to paint. The cheapest fix — moving the state into the box — took the chart out of the picture: zero renders, commits near 0 ms. Two measured surprises: under <code>next dev</code> the chart rendered <b>10</b> times for 5 keystrokes at about 60 ms each (Strict Mode's double render and dev checks), so dev numbers exaggerate; and on a plain <code>next build &amp;&amp; next start</code> the Profiler was <b>silent</b> — React's production build carries no profiling timers. <code>next build --profile</code> fixes that for measuring; ship the normal build.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build -- --profile &amp;&amp; npx next start -p 3002
<span class="tok-comment"># open /do-thu, type in each box, then in the console: window.__prof</span>
<span class="tok-comment"># compare with a plain build (npm run build &amp;&amp; npx next start) and with npx next dev</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-1-do" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.1 — Measuring with the React Profiler</span><span class="lc-sub">200 doctors, one click, real numbers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">Why dev runs things twice</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">Apply it where it counts, after measuring</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Profiler</span><span class="v">React DevTools tab that records render time per component.</span></div>
  <div class="kv"><span class="k">Measure first</span><span class="v">Find the real bottleneck before optimising anything.</span></div>
  <div class="kv"><span class="k">Bottleneck</span><span class="v">The component or work that actually costs the time.</span></div>
  <div class="kv"><span class="k">Highlight updates</span><span class="v">A DevTools option that flashes what re-rendered.</span></div>
  <div class="kv"><span class="k">Before/after</span><span class="v">Compare numbers to prove a change helped.</span></div>
  <div class="kv"><span class="k">Premature optimisation</span><span class="v">Optimising by guess, usually the wrong thing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Measure before you optimise: use the React DevTools Profiler to find the real bottleneck.</li><li>Most re-renders are cheap; guessing usually optimises the wrong thing.</li><li>Flag slow components with highlight-updates and the Profiler, then fix the one that matters.</li><li>Prove every optimisation with a before/after number.</li></ul>

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

<h3>Đo trước khi tối ưu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ghi lại một hồ sơ của thao tác thật</b> — React DevTools → Profiler → ghi, làm cái thao tác chậm đó, dừng. Bạn nhận được mọi lần render kèm thời lượng.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đọc thời lượng, đừng đọc số lần</b> — Sắp theo thanh dài nhất. Component đứng đầu chính là chỗ thời gian nằm, bất kể thứ gì đã render bao nhiêu lần.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Hỏi vì sao nó render</b> — Profiler nói cho bạn: props đổi, state đổi, cha render, context đổi. Chính câu trả lời đó chọn giùm bạn cách sửa.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đổi một thứ, rồi ghi lại lần nữa</b> — Nếu cái thanh không ngắn đi thì hãy hoàn tác. Một phép tối ưu bạn không đo được là một sự phức tạp bạn không biện minh được.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đo trên bản dựng phát triển rồi đi tối ưu một thứ không hề tồn tại trên production.</strong> Bản dựng phát triển mang theo các phép kiểm phụ, các cảnh báo và việc gọi hai lần của StrictMode, nên component render hai lần và mỗi lần render chậm hơn hẳn một cách đo được. Tối ưu theo những con số đó dẫn bạn đi ghi nhớ những thứ chưa từng là vấn đề, và giấu đi những thứ thật sự là vấn đề. Hãy đo trên bản dựng production khi bạn muốn con số thật — và dựng nó bằng <code>next build --profile</code>: bản <code>next build &amp;&amp; next start</code> thường bỏ bộ đếm giờ của React, nên tab Profiler của DevTools lẫn <code>&lt;Profiler&gt;</code> không ghi được gì (đo ở dưới) — và chỉ dùng profiler ở môi trường phát triển cho câu trả lời &quot;vì sao cái này render?&quot;, vốn chính xác ở cả hai. Cùng lời dặn ấy áp cho Lighthouse: hãy chạy nó với ứng dụng đã dựng, đừng bao giờ chạy với <code>next dev</code>.</p></div>
<a class="link-card dl" href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">Cài và dùng profiler, gồm cả bảng &quot;vì sao cái này render&quot;.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tối ưu hoá</span><span class="lc-sub">Phía Next.js: framework đã làm sẵn những gì trước khi bạn tự tối ưu bất cứ thứ gì.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở React DevTools Profiler, ghi một tương tác, và đọc xem component nào đã render và mỗi cái tốn bao lâu.</li>
<li>Thêm một component chậm giả, xác nhận profiler đánh dấu nó, rồi tối ưu và đo lại.</li>
<li>Ghi một chỉ số trước và sau một thay đổi để chứng minh tối ưu có tác dụng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn profile được một tương tác thật và biện minh một tối ưu bằng số liệu trước/sau.</p></div>

<h3>🔬 Đo thật: profile một component chậm (React 19.3.0 · Next.js 16.4.6)</h3>
<p>Một biểu đồ giả bận 30 ms mỗi lần render, đặt cạnh ô tìm kiếm: bên trái state của ô nằm ở cha, bên phải đã dời vào ô. <code>&lt;Profiler onRender&gt;</code> ghi <code>actualDuration</code> của React (cùng con số tab Profiler của DevTools hiển thị); Event Timing của trình duyệt ghi mỗi phím mất bao lâu tới lần vẽ (chỉ mục ≥ 16 ms).</p>
<pre><code class="language-tsx">'use client';
import { Profiler, useState, type ProfilerOnRenderCallback } from 'react';

<span class="tok-comment">// số đo: Profiler API (cùng nguồn actualDuration với tab Profiler của React DevTools) + số lần BieuDo render + Event Timing của trình duyệt</span>
const prof: { id: string; phase: string; ms: number }[] = [];
const dem = { bieuDo: 0 };
if (typeof window !== 'undefined') Object.assign(window, { __prof: prof, __dem: dem });
const ghi: ProfilerOnRenderCallback = (id, phase, actualDuration) =&gt; {
  prof.push({ id, phase, ms: Math.round(actualDuration * 10) / 10 });
};

function cham(ms: number) {                               <span class="tok-comment">  // "component chậm giả": bận đúng ms mili giây</span>
  const t = performance.now();
  while (performance.now() - t &lt; ms) { /* bận */ }
}
function BieuDo() {
  cham(30);
  dem.bieuDo++;
  return &lt;p className="text-sm"&gt;📈 biểu đồ (chậm giả 30 ms)&lt;/p&gt;;
}

<span class="tok-comment">// TRƯỚC: state của ô tìm nằm ở cha ⇒ mỗi phím render lại cả BieuDo</span>
function Truoc() {
  const [q, setQ] = useState('');
  return (
    &lt;Profiler id="truoc" onRender={ghi}&gt;
      &lt;input id="o-truoc" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="trước" className="border px-1" /&gt;
      &lt;BieuDo /&gt;
    &lt;/Profiler&gt;
  );
}

<span class="tok-comment">// SAU: dời state xuống đúng ô tìm ⇒ BieuDo không bị kéo theo</span>
function OTim() {
  const [q, setQ] = useState('');
  return &lt;input id="o-sau" value={q} onChange={(e) =&gt; setQ(e.target.value)} placeholder="sau" className="border px-1" /&gt;;
}
function Sau() {
  return (
    &lt;Profiler id="sau" onRender={ghi}&gt;
      &lt;OTim /&gt;
      &lt;BieuDo /&gt;
    &lt;/Profiler&gt;
  );
}

export default function DoThu() {
  return &lt;div className="grid grid-cols-2 gap-4 p-4 font-sans"&gt;&lt;div&gt;&lt;Truoc /&gt;&lt;/div&gt;&lt;div&gt;&lt;Sau /&gt;&lt;/div&gt;&lt;/div&gt;;
}</code></pre><div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|do-thu'
✓ Compiled successfully in 1205ms
├ ○ /do-thu
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npm run build -- --profile
&gt; next build --profile
✓ Compiled successfully in 3.1s
├ ○ /do-thu
$ grep -l 'react-dom-profiling\\|__REACT_DEVTOOLS\\|onPostCommit' .next/static/chunks/*.js | head -3 | wc -l | xargs echo 'chunk có mã profiling:'
chunk có mã profiling: 2</div>
<p>Gõ "abcde" vào từng ô, trên Chromium:</p>
<div class="out">$ curl -s -o /dev/null -w 'next dev GET /do-thu → %{http_code}\\n' localhost:3000/do-thu
next dev GET /do-thu → 200
$ curl -s -o /dev/null -w 'next start GET /do-thu → %{http_code}\\n' localhost:3001/do-thu
next start GET /do-thu → 200
$ curl -s -o /dev/null -w 'next start (build --profile) GET /do-thu → %{http_code}\\n' localhost:3002/do-thu
next start (build --profile) GET /do-thu → 200

--profile · trước: BieuDo render / ms : 5 · 30 · 30 · 30 · 30 · 30 · keydown [32, 32, 32, 32, 32]
--profile · sau  : BieuDo render / ms : 0 · 0 · 0 · 0 · 0.1 · 0 · keydown [16]
next dev  · trước                     : 10 · 60.3 · 60 · 60.1 · 60.1 · 60 · keydown [72, 64, 64, 64, 64]
next start (bản thường) · trước       : 5 · (onRender không được gọi) · keydown [32, 32, 32, 32, 32]</div>
<p>Profiler chỉ thẳng vào biểu đồ: năm lần render, mỗi lần 30 ms, mỗi phím khoảng 32 ms mới vẽ xong. Cách sửa rẻ nhất — dời state vào ô — đưa biểu đồ ra khỏi cuộc chơi: không lần render nào, commit gần 0 ms. Hai bất ngờ đo được: dưới <code>next dev</code>, biểu đồ render <b>10</b> lần cho 5 phím, mỗi lần khoảng 60 ms (Strict Mode render đôi và kiểm tra của dev), nên số đo ở dev phóng đại; và trên bản <code>next build &amp;&amp; next start</code> thường, Profiler <b>im lặng</b> — bản production của React không mang bộ đếm giờ. <code>next build --profile</code> sửa được khi cần đo; phát hành vẫn dùng bản thường.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build -- --profile &amp;&amp; npx next start -p 3002
<span class="tok-comment"># mở /do-thu, gõ vào từng ô, rồi trong console: window.__prof</span>
<span class="tok-comment"># so với bản thường (npm run build &amp;&amp; npx next start) và với npx next dev</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-1-do" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.1 — Đo bằng React Profiler</span><span class="lc-sub">200 bác sĩ, một cú bấm, số đo thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">Vì sao dev chạy hai lần</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a1-1-performance" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy FER202 · A1.1 — memo, useMemo & useCallback</span><span class="lc-sub">Áp đúng chỗ, sau khi đo</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Profiler</span><span class="v">Tab React DevTools ghi thời gian render từng component.</span></div>
  <div class="kv"><span class="k">Đo trước</span><span class="v">Tìm đúng nút cổ chai trước khi tối ưu bất cứ gì.</span></div>
  <div class="kv"><span class="k">Nút cổ chai</span><span class="v">Component hoặc việc thật sự tốn thời gian.</span></div>
  <div class="kv"><span class="k">Highlight updates</span><span class="v">Tuỳ chọn DevTools nhấp nháy cái đã render lại.</span></div>
  <div class="kv"><span class="k">Trước/sau</span><span class="v">So số liệu để chứng minh một thay đổi có ích.</span></div>
  <div class="kv"><span class="k">Tối ưu sớm</span><span class="v">Tối ưu theo phỏng đoán, thường nhầm chỗ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đo trước khi tối ưu: dùng React DevTools Profiler để tìm đúng nút cổ chai.</li><li>Phần lớn render lại là rẻ; đoán mò thường tối ưu nhầm chỗ.</li><li>Đánh dấu component chậm bằng highlight-updates và Profiler, rồi sửa đúng cái quan trọng.</li><li>Chứng minh mọi tối ưu bằng một con số trước/sau.</li></ul>

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
