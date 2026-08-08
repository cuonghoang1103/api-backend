/**
 * Next.js & React — Chương 5: useEffect & đồng bộ với bên ngoài.
 * Song ngữ EN/VI. Escape: backtick→&#96;, `${`→\${, < >→&lt; &gt; trong code.
 * Output effect đã CHẠY THẬT (react-dom/client + act, scratchpad/nextjs-verify/c5.mjs):
 *   - vòng đời deps/cleanup: ["effect 1","cleanup 1","effect 2","cleanup 2"]
 *   - StrictMode dev mount: ["run","clean","run"]  (effect chạy hai lần ở dev)
 */

export default {
  title: 'Chapter 5 — useEffect: synchronising with the outside world|||Chương 5 — useEffect: đồng bộ với bên ngoài',
  description: 'Effect chạy SAU render để đồng bộ component với thứ bên ngoài React. Mảng phụ thuộc, hàm dọn dẹp, chạy hai lần ở dev, đua fetch, và những effect bạn KHÔNG nên viết.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — What an effect is, and when it runs|||5.1 — Effect là gì, và chạy khi nào',
      slug: 'nextjs-5-1-effect-la-gi',
      type: 'VIDEO',
      isFreePreview: false,
      // Video: "Mastering React's useEffect".
      video: { url: 'https://youtu.be/dH6i3GurZW8', durationSeconds: 0 },
      description: 'Effect là chỗ để đồng bộ component với hệ thống bên ngoài React — sau khi render đã lên màn hình. Render vẫn thuần; effect mới có tác dụng phụ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Effects reach outside React — after the render</h2>
<p class="lead">Chapter 2 said render must be pure: no side effects during render. But real apps must talk to the outside world — a browser API, a subscription, a timer, sometimes the network. <code>useEffect</code> is the sanctioned place for that. It runs your code <em>after</em> React has rendered and committed to the DOM, not during.</p>

<h3>What "synchronise with an external system" means</h3>
<p>An effect exists to keep something <em>outside</em> React in step with your component's state. The React docs frame it exactly this way — an effect synchronises with an external system:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Good uses of an effect</span><span class="v">Subscribe to a WebSocket or an event; start/stop a timer; manually control a non-React widget (a map, a chart); set the document title; connect to a browser API.</span></div>
  <div class="kv"><span class="k">NOT effects</span><span class="v">Transforming data for render (do it during render); responding to a click (do it in the handler); deriving state from props. Lesson 5.4 is entirely about these.</span></div>
</div>

<h3>The shape</h3>
<pre><code>import { useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() =&gt; {
    const conn = createConnection(roomId);   <span class="tok-comment">// side effect: open a connection</span>
    conn.connect();
    return () =&gt; conn.disconnect();           <span class="tok-comment">// cleanup: close it</span>
  }, [roomId]);                               <span class="tok-comment">// dependencies</span>

  return &lt;h1&gt;Welcome to {roomId}&lt;/h1&gt;;
}</code></pre>
<p>Three parts, each with a job: the <strong>setup function</strong> (runs the effect), the optional <strong>cleanup function</strong> it returns (undoes the effect), and the <strong>dependency array</strong> (decides when to re-run). The next lesson takes the last two apart; here, just fix the timing in your head.</p>

<h3>When exactly does it run?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">React renders your component (calls the function, builds the element tree).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">React commits the changes to the real DOM — the screen updates.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Then</b> React runs your effects. The user has already seen the new screen.</div></div>
</div>
<p>This ordering is the whole point: effects never block the paint. It also means an effect cannot decide what the UI looks like — by the time it runs, the UI is already on screen. If you find yourself wanting an effect to change what renders, that logic almost always belongs in render itself or in an event handler.</p>

<div class="callout warn">
<p><strong>The dependency array is not optional flavour — it changes behaviour completely.</strong> <code>useEffect(fn, [x])</code> re-runs when <code>x</code> changes. <code>useEffect(fn, [])</code> runs once after the first render. <code>useEffect(fn)</code> with <em>no</em> array runs after <em>every</em> render — usually a bug, and a classic cause of infinite loops when the effect also sets state. Next lesson makes the three cases precise.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Synchronizing with Effects</span><span class="lc-sub">The official mental model for useEffect. Read this once slowly; it reframes everything.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — useEffect API</span><span class="lc-sub">Every parameter, every edge case, with runnable examples.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Effect với ra bên ngoài React — sau khi render</h2>
<p class="lead">Chương 2 nói render phải thuần: không tác dụng phụ trong lúc render. Nhưng app thật phải nói chuyện với thế giới bên ngoài — một API trình duyệt, một subscription, một timer, đôi khi là mạng. <code>useEffect</code> là chỗ được phép làm điều đó. Nó chạy code của bạn <em>sau</em> khi React đã render và commit vào DOM, không phải trong lúc render.</p>

<h3>"Đồng bộ với một hệ thống bên ngoài" nghĩa là gì</h3>
<p>Một effect tồn tại để giữ một thứ <em>bên ngoài</em> React bước cùng nhịp với state của component. Tài liệu React diễn đạt đúng như vậy — một effect đồng bộ với một hệ thống bên ngoài:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng effect ĐÚNG</span><span class="v">Subscribe một WebSocket hay sự kiện; bật/tắt một timer; điều khiển tay một widget không-phải-React (bản đồ, biểu đồ); đặt tiêu đề trang; kết nối tới một API trình duyệt.</span></div>
  <div class="kv"><span class="k">KHÔNG phải effect</span><span class="v">Biến đổi dữ liệu để render (làm trong lúc render); phản hồi một cú click (làm trong handler); suy state từ props. Bài 5.4 dành trọn cho những cái này.</span></div>
</div>

<h3>Hình dạng</h3>
<pre><code>import { useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() =&gt; {
    const conn = createConnection(roomId);   <span class="tok-comment">// tác dụng phụ: mở kết nối</span>
    conn.connect();
    return () =&gt; conn.disconnect();           <span class="tok-comment">// dọn dẹp: đóng nó</span>
  }, [roomId]);                               <span class="tok-comment">// phụ thuộc</span>

  return &lt;h1&gt;Chào phòng {roomId}&lt;/h1&gt;;
}</code></pre>
<p>Ba phần, mỗi phần một việc: <strong>hàm setup</strong> (chạy effect), <strong>hàm cleanup</strong> tuỳ chọn nó trả về (hoàn tác effect), và <strong>mảng phụ thuộc</strong> (quyết khi nào chạy lại). Bài sau mổ xẻ hai phần cuối; ở đây, chỉ cần ghim đúng thời điểm vào đầu.</p>

<h3>Chính xác thì nó chạy khi nào?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">React render component của bạn (gọi hàm, dựng cây element).</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">React commit thay đổi vào DOM thật — màn hình cập nhật.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Rồi</b> React mới chạy các effect. Người dùng đã thấy màn hình mới.</div></div>
</div>
<p>Thứ tự này chính là điểm mấu chốt: effect không bao giờ chặn việc vẽ màn hình. Nó cũng nghĩa là effect không thể quyết UI trông thế nào — tới lúc nó chạy, UI đã ở trên màn hình rồi. Nếu bạn thấy mình muốn một effect đổi cái được render, logic đó gần như luôn thuộc về chính render hoặc một handler sự kiện.</p>

<div class="callout warn">
<p><strong>Mảng phụ thuộc không phải gia vị tuỳ chọn — nó đổi hành vi hoàn toàn.</strong> <code>useEffect(fn, [x])</code> chạy lại khi <code>x</code> đổi. <code>useEffect(fn, [])</code> chạy một lần sau render đầu. <code>useEffect(fn)</code> <em>không</em> có mảng chạy sau <em>mỗi</em> lần render — thường là bug, và là nguyên nhân kinh điển của vòng lặp vô tận khi effect còn set state. Bài sau làm rõ chính xác ba trường hợp.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/learn/synchronizing-with-effects" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">react.dev — Synchronizing with Effects</span><span class="lc-sub">Mô hình tư duy chính thức cho useEffect. Đọc chậm một lần; nó định hình lại mọi thứ.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — API useEffect</span><span class="lc-sub">Mọi tham số, mọi ca biên, kèm ví dụ chạy được.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Dependencies & cleanup|||5.2 — Phụ thuộc & dọn dẹp',
      slug: 'nextjs-5-2-phu-thuoc-don-dep',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Mảng phụ thuộc quyết khi effect chạy lại; cleanup chạy trước mỗi lần chạy lại VÀ khi unmount. Xem thứ tự thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>The dependency array and the cleanup function, precisely</h2>
<p class="lead">These two features are where useEffect is won or lost. The dependency array decides <em>when</em> the effect re-runs; the cleanup function undoes the previous run before the next one. Get them right and effects are predictable; get them wrong and you get stale data, leaks and double-subscriptions.</p>

<h3>The three dependency cases</h3>
<pre><code>useEffect(() =&gt; { /* ... */ });          <span class="tok-comment">// no array → after EVERY render</span>
useEffect(() =&gt; { /* ... */ }, []);      <span class="tok-comment">// empty → once, after the first render</span>
useEffect(() =&gt; { /* ... */ }, [a, b]); <span class="tok-comment">// listed → whenever a or b changes</span></code></pre>
<p>React compares each dependency to its previous value with <code>Object.is</code> (like <code>===</code>). If every dependency is unchanged, it skips the effect. The rule that keeps you out of trouble: <strong>every value from component scope that the effect uses — props, state, functions — must be in the array.</strong> The ESLint rule <code>react-hooks/exhaustive-deps</code> enforces this; do not silence it by deleting a dependency, because a missing dependency is how the effect reads a <em>stale</em> value (the snapshot rule from Chapter 3, back again).</p>

<h3>Cleanup runs before the next effect, and on unmount</h3>
<p>The function you return from an effect is its cleanup. React runs it in two situations: right before re-running the effect (to undo the previous run), and when the component unmounts (to undo the last run). This is a real, captured run — the same effect with dependency <code>dep</code> going <code>1</code> → (unchanged) → <code>2</code> → unmount produced exactly this order:</p>
<pre><code>render dep=1   → <span class="tok-comment">effect runs</span>
render dep=1   → <span class="tok-comment">(unchanged — effect skipped)</span>
render dep=2   → <span class="tok-comment">cleanup of 1, then effect of 2</span>
unmount        → <span class="tok-comment">cleanup of 2</span></code></pre>
<div class="out">["effect 1","cleanup 1","effect 2","cleanup 2"]</div>
<p>Read the order carefully: when <code>dep</code> changed from 1 to 2, React <strong>cleaned up the old effect before running the new one</strong>. That is why a subscription effect must return a matching unsubscribe — otherwise every change stacks another live subscription on top of the old ones. The second render (dep unchanged) did nothing at all: <code>Object.is(1, 1)</code> is true, so the effect was skipped.</p>

<h3>The mental model: each effect is a fresh setup+cleanup pair</h3>
<p>Don't think of an effect as "run on mount, clean on unmount". Think of it as: <em>every time the dependencies change, React tears down the old version and sets up a new one.</em> An effect and its cleanup are a matched pair that describes one synchronised state; when the inputs change, React swaps the whole pair. If your cleanup perfectly undoes your setup, the effect is correct no matter how many times it runs.</p>

<div class="pitfall">
<p><strong>Objects and functions as dependencies re-trigger every render.</strong> <code>{ }</code>, <code>[ ]</code> and <code>() =&gt; {}</code> created during render are a <em>new reference</em> each time, so <code>Object.is</code> always says "changed" and the effect runs on every render. If an effect depends on an object or a function, either move it inside the effect, or memoise it with <code>useMemo</code>/<code>useCallback</code> (Chapter 6). This is one of the most common "why does my effect loop?" causes.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Mảng phụ thuộc và hàm dọn dẹp, cho chính xác</h2>
<p class="lead">Hai tính năng này là nơi useEffect thắng hay thua. Mảng phụ thuộc quyết <em>khi nào</em> effect chạy lại; hàm cleanup hoàn tác lần chạy trước đó trước lần kế. Làm đúng thì effect dự đoán được; làm sai thì bạn được dữ liệu cũ, rò rỉ và subscribe nhân đôi.</p>

<h3>Ba trường hợp phụ thuộc</h3>
<pre><code>useEffect(() =&gt; { /* ... */ });          <span class="tok-comment">// không mảng → sau MỖI render</span>
useEffect(() =&gt; { /* ... */ }, []);      <span class="tok-comment">// rỗng → một lần, sau render đầu</span>
useEffect(() =&gt; { /* ... */ }, [a, b]); <span class="tok-comment">// liệt kê → mỗi khi a hoặc b đổi</span></code></pre>
<p>React so mỗi phụ thuộc với giá trị trước bằng <code>Object.is</code> (như <code>===</code>). Nếu mọi phụ thuộc không đổi, nó bỏ qua effect. Quy tắc giữ bạn khỏi rắc rối: <strong>mọi giá trị từ phạm vi component mà effect dùng — props, state, hàm — đều phải nằm trong mảng.</strong> Luật ESLint <code>react-hooks/exhaustive-deps</code> ép điều này; đừng làm nó im bằng cách xoá một phụ thuộc, vì một phụ thuộc thiếu chính là cách effect đọc một giá trị <em>cũ</em> (quy tắc ảnh chụp từ Chương 3, quay lại).</p>

<h3>Cleanup chạy trước effect kế, và khi unmount</h3>
<p>Hàm bạn trả về từ một effect là cleanup của nó. React chạy nó trong hai tình huống: ngay trước khi chạy lại effect (để hoàn tác lần trước), và khi component bị gỡ (để hoàn tác lần cuối). Đây là một lần chạy THẬT đã ghi lại — cùng một effect với phụ thuộc <code>dep</code> đi <code>1</code> → (không đổi) → <code>2</code> → unmount cho ra đúng thứ tự này:</p>
<pre><code>render dep=1   → <span class="tok-comment">effect chạy</span>
render dep=1   → <span class="tok-comment">(không đổi — bỏ qua effect)</span>
render dep=2   → <span class="tok-comment">cleanup của 1, rồi effect của 2</span>
unmount        → <span class="tok-comment">cleanup của 2</span></code></pre>
<div class="out">["effect 1","cleanup 1","effect 2","cleanup 2"]</div>
<p>Đọc kỹ thứ tự: khi <code>dep</code> đổi từ 1 sang 2, React <strong>dọn dẹp effect cũ TRƯỚC khi chạy effect mới</strong>. Vì thế một effect subscribe phải trả về một unsubscribe khớp — nếu không mỗi lần đổi lại chồng thêm một subscription sống lên đống cũ. Lần render thứ hai (dep không đổi) chẳng làm gì cả: <code>Object.is(1, 1)</code> là true, nên effect bị bỏ qua.</p>

<h3>Mô hình tư duy: mỗi effect là một cặp setup+cleanup mới tinh</h3>
<p>Đừng nghĩ effect là "chạy lúc mount, dọn lúc unmount". Hãy nghĩ: <em>mỗi khi phụ thuộc đổi, React phá bản cũ và dựng bản mới.</em> Một effect và cleanup của nó là một cặp khớp mô tả một trạng thái đồng bộ; khi đầu vào đổi, React tráo cả cặp. Nếu cleanup hoàn tác hoàn hảo setup, effect đúng bất kể chạy bao nhiêu lần.</p>

<div class="pitfall">
<p><strong>Object và hàm làm phụ thuộc kích hoạt lại mỗi render.</strong> <code>{ }</code>, <code>[ ]</code> và <code>() =&gt; {}</code> tạo trong lúc render là một <em>tham chiếu mới</em> mỗi lần, nên <code>Object.is</code> luôn nói "đã đổi" và effect chạy mỗi render. Nếu một effect phụ thuộc một object hay một hàm, hoặc đưa nó vào trong effect, hoặc ghi nhớ nó bằng <code>useMemo</code>/<code>useCallback</code> (Chương 6). Đây là một trong những nguyên nhân "sao effect của tôi lặp?" phổ biến nhất.</p>
</div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Why effects run twice in dev|||5.3 — Vì sao effect chạy hai lần ở dev',
      slug: 'nextjs-5-3-chay-hai-lan-dev',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'StrictMode cố ý mount rồi unmount rồi mount lại ở dev để lộ effect thiếu cleanup. Cách vá không phải là tắt nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>"My effect runs twice!" — that is React helping you</h2>
<p class="lead">In development, you will see effects run twice on mount. This surprises everyone. It is not a bug and you must not "fix" it by removing StrictMode — it is React deliberately stress-testing your cleanup so a real bug shows up on your machine instead of in production.</p>

<h3>What StrictMode does</h3>
<p>Next.js turns on React <strong>StrictMode</strong> in development. For every component, on its first mount, StrictMode runs each effect, immediately runs its cleanup, then runs the effect again — mount, unmount, mount. Captured live from a real render in dev:</p>
<div class="out">["run","clean","run"]</div>
<p>So an effect that logs "run" on setup and "clean" on cleanup produces <strong>run → clean → run</strong> on a single mount in development. In production this does not happen — the effect runs once. StrictMode is a dev-only x-ray.</p>

<h3>Why on earth would React do this?</h3>
<p>Because it is the cheapest possible way to catch the most common effect bug: <strong>a setup with no matching cleanup.</strong> If your effect opens a connection, starts an interval, or adds a listener but doesn't return a cleanup that closes it, running it twice leaves <em>two</em> connections, two intervals, two listeners — and the bug is visible immediately, on your machine, instead of as a slow leak in production. An effect that survives being run twice with no ill effect is a correct effect.</p>
<pre><code>useEffect(() =&gt; {
  const id = setInterval(tick, 1000);
  return () =&gt; clearInterval(id);   <span class="tok-comment">// ← without this, StrictMode leaves 2 intervals running</span>
}, []);</code></pre>

<h3>The fix is always the same: make the effect idempotent</h3>
<p>Don't try to detect "is this the second run?" — that fights the tool. Instead, make setup and cleanup a perfect pair, so running the pair any number of times leaves the world in the same state:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Subscribe</span><span class="v">return an unsubscribe.</span></div>
  <div class="kv"><span class="k">setInterval / setTimeout</span><span class="v">return a clearInterval / clearTimeout.</span></div>
  <div class="kv"><span class="k">addEventListener</span><span class="v">return a removeEventListener with the same function.</span></div>
  <div class="kv"><span class="k">Open a connection</span><span class="v">return a close/disconnect.</span></div>
</div>
<p>If you cannot write a cleanup for something, that is a strong sign it should not be in an effect at all — for example, a one-off action that should live in an event handler. The next lesson is exactly that list of "effects that shouldn't be effects".</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it</strong> — the site runs with StrictMode on in dev. Socket.IO connections, event listeners on <code>window</code>, and IntersectionObservers in the feed all pair their setup with a cleanup, precisely so the double-invoke leaves exactly one live connection/observer. When a new feature "connects twice" or a listener fires twice in dev, the fix is never to disable StrictMode — it is to add the missing cleanup.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>"Effect của tôi chạy hai lần!" — đó là React đang giúp bạn</h2>
<p class="lead">Ở môi trường phát triển, bạn sẽ thấy effect chạy hai lần lúc mount. Điều này làm ai cũng bất ngờ. Nó không phải bug và bạn không được "sửa" bằng cách bỏ StrictMode — đó là React cố ý thử sức cleanup của bạn để một bug thật lộ ra trên máy bạn thay vì ở production.</p>

<h3>StrictMode làm gì</h3>
<p>Next.js bật React <strong>StrictMode</strong> ở dev. Với mỗi component, ở lần mount đầu, StrictMode chạy mỗi effect, chạy cleanup của nó ngay, rồi chạy effect lần nữa — mount, unmount, mount. Ghi trực tiếp từ một render thật ở dev:</p>
<div class="out">["run","clean","run"]</div>
<p>Vậy một effect log "run" lúc setup và "clean" lúc cleanup cho ra <strong>run → clean → run</strong> trong một lần mount ở dev. Ở production điều này không xảy ra — effect chạy một lần. StrictMode là một tia X chỉ có ở dev.</p>

<h3>Vì cớ gì React lại làm vậy?</h3>
<p>Vì đó là cách rẻ nhất có thể để bắt bug effect phổ biến nhất: <strong>một setup không có cleanup khớp.</strong> Nếu effect của bạn mở một kết nối, khởi động một interval, hay thêm một listener mà không trả về cleanup để đóng nó, chạy hai lần để lại <em>hai</em> kết nối, hai interval, hai listener — và bug hiện ra ngay, trên máy bạn, thay vì rò rỉ chậm ở production. Một effect sống sót qua hai lần chạy mà không gây hại là một effect đúng.</p>
<pre><code>useEffect(() =&gt; {
  const id = setInterval(tick, 1000);
  return () =&gt; clearInterval(id);   <span class="tok-comment">// ← thiếu dòng này, StrictMode để lại 2 interval chạy</span>
}, []);</code></pre>

<h3>Cách vá luôn giống nhau: làm effect idempotent</h3>
<p>Đừng cố dò "đây có phải lần chạy thứ hai không?" — làm vậy là chống lại công cụ. Thay vào đó, làm setup và cleanup thành một cặp hoàn hảo, để chạy cặp đó bao nhiêu lần cũng để thế giới ở cùng một trạng thái:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Subscribe</span><span class="v">trả về một unsubscribe.</span></div>
  <div class="kv"><span class="k">setInterval / setTimeout</span><span class="v">trả về một clearInterval / clearTimeout.</span></div>
  <div class="kv"><span class="k">addEventListener</span><span class="v">trả về một removeEventListener với cùng hàm.</span></div>
  <div class="kv"><span class="k">Mở một kết nối</span><span class="v">trả về một close/disconnect.</span></div>
</div>
<p>Nếu bạn không viết được cleanup cho một thứ, đó là dấu hiệu mạnh rằng nó không nên nằm trong một effect chút nào — ví dụ, một hành động một-lần đáng lẽ ở trong một handler sự kiện. Bài sau đúng là danh sách những "effect không nên là effect" đó.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào</strong> — site chạy với StrictMode bật ở dev. Kết nối Socket.IO, listener trên <code>window</code>, và IntersectionObserver trong feed đều ghép setup với một cleanup, chính xác để cú double-invoke để lại đúng một kết nối/observer sống. Khi một tính năng mới "kết nối hai lần" hay một listener nổ hai lần ở dev, cách vá không bao giờ là tắt StrictMode — mà là thêm cleanup còn thiếu.</p>
</div>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Effects you should NOT write|||5.4 — Những effect bạn KHÔNG nên viết',
      slug: 'nextjs-5-4-effect-khong-nen-viet',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Phần lớn effect người mới viết là thừa: suy state trong effect, đồng bộ props→state, chạy logic sự kiện trong effect. Cách bỏ chúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Most effects beginners write shouldn't exist</h2>
<p class="lead">useEffect is powerful, so people reach for it constantly — and most of those reaches are wrong. The React team wrote a whole page called "You Might Not Need an Effect" because the overuse is that common. Here are the effects to delete, and what to do instead. An AI assistant will happily write all three; recognising them is a big part of the judgement this course is for.</p>

<h3>Anti-pattern 1 — deriving state in an effect</h3>
<pre><code><span class="tok-comment">// ❌ an effect to compute state from other state</span>
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
useEffect(() =&gt; { setTotal(items.reduce((s, i) =&gt; s + i.price, 0)); }, [items]);

<span class="tok-comment">// ✅ just compute it during render — no effect, no extra state</span>
const [items, setItems] = useState([]);
const total = items.reduce((s, i) =&gt; s + i.price, 0);</code></pre>
<p>This is the derived-state rule from Chapter 3 wearing effect clothing. Computing during render is simpler, always in sync, and avoids an extra render (the effect version renders once with the old total, then again after the effect sets the new one).</p>

<h3>Anti-pattern 2 — syncing props into state</h3>
<pre><code><span class="tok-comment">// ❌ copying a prop into state and "keeping it in sync" with an effect</span>
function Profile({ user }) {
  const [name, setName] = useState(user.name);
  useEffect(() =&gt; { setName(user.name); }, [user.name]);   <span class="tok-comment">// fights the prop</span>

<span class="tok-comment">// ✅ if it's really just the prop, use the prop; if you need editable local state,</span>
<span class="tok-comment">//    reset it with a key instead (Chapter 7).</span>
}</code></pre>
<p>Copying props into state creates two sources of truth that you then spend effects trying to reconcile — exactly the bug React is built to prevent. Use the prop directly, or, when you truly need a local editable copy that resets when the prop changes, give the component a <code>key</code> so React remounts it (Chapter 7).</p>

<h3>Anti-pattern 3 — putting event logic in an effect</h3>
<pre><code><span class="tok-comment">// ❌ react to a state change with an effect to send an analytics event</span>
useEffect(() =&gt; {
  if (submitted) fetch('/api/track', { method: 'POST' });
}, [submitted]);

<span class="tok-comment">// ✅ the event caused it — do it in the handler where the event happened</span>
function handleSubmit() {
  setSubmitted(true);
  fetch('/api/track', { method: 'POST' });
}</code></pre>
<p>If something should happen <em>because the user did X</em>, that logic belongs in the handler for X, not in an effect watching a state flag. Effects are for synchronising with external systems, not for reacting to events — the handler already knows the event happened, with all its context.</p>

<h3>The test: "am I synchronising, or reacting?"</h3>
<p>Before writing an effect, ask what it is for. If the answer is "keep an external system in step with my state" (a subscription, the document title, a non-React widget) — it's a real effect. If the answer is "compute a value", "copy a prop", or "respond to a click" — it is not an effect, and there is a simpler place for it. When in doubt, read the react.dev page below; it has a decision tree for exactly this.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">The single most valuable page for writing good React. Read it after this lesson; you will delete effects.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Phần lớn effect người mới viết lẽ ra không nên tồn tại</h2>
<p class="lead">useEffect mạnh, nên người ta với tay tới nó liên tục — và phần lớn những cú với đó là sai. Đội React viết hẳn một trang tên "You Might Not Need an Effect" vì lạm dụng phổ biến tới mức đó. Đây là những effect cần xoá, và làm gì thay thế. Một trợ lý AI sẽ vui vẻ viết cả ba; nhận ra chúng là một phần lớn cái phán đoán mà khoá này hướng tới.</p>

<h3>Phản mẫu 1 — suy state trong một effect</h3>
<pre><code><span class="tok-comment">// ❌ một effect để tính state từ state khác</span>
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
useEffect(() =&gt; { setTotal(items.reduce((s, i) =&gt; s + i.price, 0)); }, [items]);

<span class="tok-comment">// ✅ chỉ cần tính trong lúc render — không effect, không state thừa</span>
const [items, setItems] = useState([]);
const total = items.reduce((s, i) =&gt; s + i.price, 0);</code></pre>
<p>Đây là quy tắc state-suy-ra từ Chương 3 khoác áo effect. Tính trong lúc render thì đơn giản hơn, luôn đồng bộ, và tránh một lần render thừa (bản effect render một lần với total cũ, rồi render lần nữa sau khi effect set giá trị mới).</p>

<h3>Phản mẫu 2 — đồng bộ props vào state</h3>
<pre><code><span class="tok-comment">// ❌ chép một prop vào state rồi "giữ đồng bộ" bằng một effect</span>
function Profile({ user }) {
  const [name, setName] = useState(user.name);
  useEffect(() =&gt; { setName(user.name); }, [user.name]);   <span class="tok-comment">// đánh nhau với prop</span>

<span class="tok-comment">// ✅ nếu thật ra chỉ là prop, dùng prop; nếu cần state cục bộ sửa được,</span>
<span class="tok-comment">//    reset nó bằng một key thay vì effect (Chương 7).</span>
}</code></pre>
<p>Chép props vào state tạo hai nguồn sự thật mà bạn rồi phải tốn effect để hoà giải — đúng cái bug React sinh ra để ngăn. Dùng prop trực tiếp, hoặc, khi thật sự cần một bản sao cục bộ sửa được mà reset khi prop đổi, cho component một <code>key</code> để React remount nó (Chương 7).</p>

<h3>Phản mẫu 3 — đặt logic sự kiện trong một effect</h3>
<pre><code><span class="tok-comment">// ❌ phản ứng một thay đổi state bằng effect để gửi sự kiện analytics</span>
useEffect(() =&gt; {
  if (submitted) fetch('/api/track', { method: 'POST' });
}, [submitted]);

<span class="tok-comment">// ✅ sự kiện gây ra nó — làm trong handler nơi sự kiện xảy ra</span>
function handleSubmit() {
  setSubmitted(true);
  fetch('/api/track', { method: 'POST' });
}</code></pre>
<p>Nếu một thứ nên xảy ra <em>vì người dùng làm X</em>, logic đó thuộc về handler của X, không phải một effect canh một cờ state. Effect để đồng bộ với hệ thống bên ngoài, không phải để phản ứng sự kiện — handler đã biết sự kiện xảy ra rồi, với đủ ngữ cảnh của nó.</p>

<h3>Phép thử: "mình đang đồng bộ, hay đang phản ứng?"</h3>
<p>Trước khi viết một effect, hãy hỏi nó để làm gì. Nếu câu trả lời là "giữ một hệ thống bên ngoài bước cùng state của mình" (một subscription, tiêu đề trang, một widget không-phải-React) — đó là effect thật. Nếu câu trả lời là "tính một giá trị", "chép một prop", hay "phản hồi một cú click" — nó không phải effect, và có một chỗ đơn giản hơn cho nó. Khi phân vân, đọc trang react.dev bên dưới; nó có một cây quyết định cho đúng việc này.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">Trang giá trị nhất để viết React tốt. Đọc sau bài này; bạn sẽ xoá bớt effect.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Fetching data & the race condition|||5.5 — Fetch dữ liệu & cuộc đua',
      slug: 'nextjs-5-5-fetch-va-cuoc-dua',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Fetch trong effect thì phải chống đua bằng cờ bỏ-qua trong cleanup — và trong Next.js, phần lớn việc này chuyển sang Server Components.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Fetching in an effect — and the bug that hides in it</h2>
<p class="lead">The most common effect people write is "fetch data when this component mounts or its id changes". It works, and it hides a race condition that only shows up when responses come back out of order. You must handle it, and then — in Next.js — you will often not write this effect at all.</p>

<h3>The naive version, and why it races</h3>
<pre><code>function Profile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() =&gt; {
    fetch(&#96;/api/users/\${userId}&#96;)
      .then(r =&gt; r.json())
      .then(setUser);           <span class="tok-comment">// ❌ what if userId changed while this was in flight?</span>
  }, [userId]);
}</code></pre>
<p>Imagine <code>userId</code> goes 1 → 2 quickly. Two fetches are now in flight. If the response for <strong>1</strong> arrives <em>after</em> the response for 2 (networks do this), <code>setUser</code> runs last with user 1's data — and you show the wrong profile, with no error anywhere. This is a race condition, and it is invisible until it bites a real user on a slow connection.</p>

<h3>The fix: an "ignore" flag in the cleanup</h3>
<pre><code>useEffect(() =&gt; {
  let ignore = false;
  fetch(&#96;/api/users/\${userId}&#96;)
    .then(r =&gt; r.json())
    .then(data =&gt; { if (!ignore) setUser(data); });   <span class="tok-comment">// only apply if still current</span>
  return () =&gt; { ignore = true; };                      <span class="tok-comment">// cleanup marks this fetch stale</span>
}, [userId]);</code></pre>
<p>Now, when <code>userId</code> changes, React runs the cleanup of the old effect first (Lesson 5.2) — setting its <code>ignore</code> to <code>true</code> — before starting the new one. The stale response still arrives, but its <code>if (!ignore)</code> is now false, so it is dropped. Only the current request updates state. This same flag also handles the StrictMode double-run cleanly, which is a bonus of doing it right.</p>

<h3>In Next.js, you often skip this entirely</h3>
<p>Everything above is client-side fetching, and it is genuinely fiddly — loading states, error states, races, caching. This is a big reason the Next.js App Router exists. In a <strong>Server Component</strong> (Chapters 9–10) you fetch data on the server, before the page is sent, with a plain <code>await</code> and no effect, no <code>useState</code>, no race:</p>
<pre><code>// A Server Component — runs on the server
async function Profile({ userId }) {
  const user = await getUser(userId);   <span class="tok-comment">// just await; no effect, no loading state to juggle</span>
  return &lt;h1&gt;{user.name}&lt;/h1&gt;;
}</code></pre>
<p>You still use effect-based fetching for data that must load <em>in response to user interaction after the page is live</em> (typeahead search, infinite scroll), and libraries like TanStack Query (Chapter 14) wrap the races and caching for you. But the default "load the page's data" case moves to the server. Learn the effect version — you'll need it, and it teaches the mechanics — then be glad Next.js lets you avoid it for most pages.</p>

<div class="callout ok">
<p><strong>Effects, in one paragraph.</strong> An effect synchronises an external system with your state; it runs after render, re-runs when its dependencies change, and cleans up before each re-run and on unmount. In dev it runs twice to prove your cleanup is right. Most effects you're tempted to write are really derived state, event logic, or data fetching that belongs on the server. Next up, Chapter 6: the rest of the hooks — <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code>, <code>useReducer</code>, <code>useContext</code>, and writing your own.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Fetch trong một effect — và cái bug ẩn trong đó</h2>
<p class="lead">Effect phổ biến nhất người ta viết là "fetch dữ liệu khi component này mount hoặc id của nó đổi". Nó chạy được, và giấu một cuộc đua chỉ lộ ra khi các phản hồi về không đúng thứ tự. Bạn phải xử lý nó, và rồi — trong Next.js — bạn sẽ thường không viết effect này chút nào.</p>

<h3>Bản ngây thơ, và vì sao nó đua</h3>
<pre><code>function Profile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() =&gt; {
    fetch(&#96;/api/users/\${userId}&#96;)
      .then(r =&gt; r.json())
      .then(setUser);           <span class="tok-comment">// ❌ nếu userId đổi khi cái này còn đang bay thì sao?</span>
  }, [userId]);
}</code></pre>
<p>Hình dung <code>userId</code> đi 1 → 2 thật nhanh. Hai fetch giờ đang bay. Nếu phản hồi cho <strong>1</strong> về <em>sau</em> phản hồi cho 2 (mạng vẫn thế), <code>setUser</code> chạy cuối cùng với dữ liệu của user 1 — và bạn hiện sai hồ sơ, không lỗi ở đâu cả. Đây là một cuộc đua (race condition), và nó vô hình cho tới khi cắn một người dùng thật trên mạng chậm.</p>

<h3>Cách vá: một cờ "bỏ qua" trong cleanup</h3>
<pre><code>useEffect(() =&gt; {
  let ignore = false;
  fetch(&#96;/api/users/\${userId}&#96;)
    .then(r =&gt; r.json())
    .then(data =&gt; { if (!ignore) setUser(data); });   <span class="tok-comment">// chỉ áp nếu vẫn còn hiện hành</span>
  return () =&gt; { ignore = true; };                      <span class="tok-comment">// cleanup đánh dấu fetch này đã cũ</span>
}, [userId]);</code></pre>
<p>Giờ, khi <code>userId</code> đổi, React chạy cleanup của effect cũ trước (Bài 5.2) — đặt <code>ignore</code> của nó thành <code>true</code> — trước khi bắt đầu cái mới. Phản hồi cũ vẫn về, nhưng <code>if (!ignore)</code> của nó giờ là false, nên nó bị bỏ. Chỉ request hiện hành cập nhật state. Chính cờ này cũng xử lý gọn cú double-run của StrictMode, một phần thưởng của việc làm đúng.</p>

<h3>Trong Next.js, bạn thường bỏ qua toàn bộ việc này</h3>
<p>Mọi thứ phía trên là fetch phía client, và nó thật sự lằng nhằng — trạng thái loading, trạng thái lỗi, đua, cache. Đây là lý do lớn khiến Next.js App Router tồn tại. Trong một <strong>Server Component</strong> (Chương 9–10) bạn fetch dữ liệu trên server, trước khi trang được gửi đi, bằng một <code>await</code> thuần, không effect, không <code>useState</code>, không đua:</p>
<pre><code>// Một Server Component — chạy trên server
async function Profile({ userId }) {
  const user = await getUser(userId);   <span class="tok-comment">// chỉ await; không effect, không loading state phải tung hứng</span>
  return &lt;h1&gt;{user.name}&lt;/h1&gt;;
}</code></pre>
<p>Bạn vẫn dùng fetch bằng effect cho dữ liệu phải tải <em>để đáp lại tương tác của người dùng sau khi trang đã sống</em> (tìm kiếm gợi ý, cuộn vô tận), và các thư viện như TanStack Query (Chương 14) bọc phần đua và cache hộ bạn. Nhưng trường hợp mặc định "tải dữ liệu của trang" chuyển sang server. Hãy học bản effect — bạn sẽ cần, và nó dạy cơ chế — rồi mừng vì Next.js cho phép bạn tránh nó với phần lớn trang.</p>

<div class="callout ok">
<p><strong>Effect, trong một đoạn.</strong> Một effect đồng bộ một hệ thống bên ngoài với state của bạn; nó chạy sau render, chạy lại khi phụ thuộc đổi, và dọn dẹp trước mỗi lần chạy lại và khi unmount. Ở dev nó chạy hai lần để chứng minh cleanup của bạn đúng. Phần lớn effect bạn bị cám dỗ viết thật ra là state suy ra, logic sự kiện, hoặc fetch dữ liệu thuộc về server. Tiếp theo, Chương 6: phần còn lại của hooks — <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code>, <code>useReducer</code>, <code>useContext</code>, và tự viết hook của bạn.</p>
</div>
</div>
`,
    },

    /* ─────────────────────────── 5.6 quiz ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra chương 5',
      slug: 'nextjs-5-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về effect chạy khi nào, phụ thuộc, cleanup, StrictMode chạy hai lần, đua fetch và effect không nên viết.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 5: when effects run, the dependency array, cleanup order, the StrictMode double-run, the fetch race, and effects you shouldn't write.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 5: effect chạy khi nào, mảng phụ thuộc, thứ tự cleanup, cú chạy-hai-lần của StrictMode, cuộc đua fetch, và effect không nên viết.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'When does a useEffect run relative to render?|||useEffect chạy khi nào so với render?',
            options: [
              'During render, before the DOM updates|||Trong lúc render, trước khi DOM cập nhật',
              'After React commits to the DOM — the screen has already updated|||Sau khi React commit vào DOM — màn hình đã cập nhật',
              'Only on the very first render, never again|||Chỉ ở lần render đầu tiên, không bao giờ nữa',
              'Before the component function is called|||Trước khi hàm component được gọi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'useEffect(fn, []) with an empty array runs…|||useEffect(fn, []) với mảng rỗng chạy…',
            options: [
              'after every render|||sau mỗi render',
              'once, after the first render|||một lần, sau render đầu',
              'never|||không bao giờ',
              'only on unmount|||chỉ khi unmount',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An effect with dependency dep goes 1 → (same 1) → 2 → unmount. What is the log order of "effect N"/"cleanup N"?|||Một effect có phụ thuộc dep đi 1 → (vẫn 1) → 2 → unmount. Thứ tự log "effect N"/"cleanup N" là gì?',
            options: [
              'effect 1, effect 2, cleanup 1, cleanup 2|||effect 1, effect 2, cleanup 1, cleanup 2',
              'effect 1, cleanup 1, effect 2, cleanup 2|||effect 1, cleanup 1, effect 2, cleanup 2',
              'effect 1, effect 1, effect 2, cleanup 2|||effect 1, effect 1, effect 2, cleanup 2',
              'effect 1, cleanup 2|||effect 1, cleanup 2',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When dep changes from 1 to 2, React runs cleanup of the old effect…|||Khi dep đổi từ 1 sang 2, React chạy cleanup của effect cũ…',
            options: [
              'after running the new effect|||sau khi chạy effect mới',
              'before running the new effect|||trước khi chạy effect mới',
              'never — cleanup only runs on unmount|||không bao giờ — cleanup chỉ chạy khi unmount',
              'at the same time as the new effect|||cùng lúc với effect mới',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In development you see an effect log run → clean → run on one mount. Why?|||Ở dev bạn thấy một effect log run → clean → run trong một lần mount. Vì sao?',
            options: [
              'A bug in your code|||Một bug trong code bạn',
              'StrictMode double-invokes effects in dev to surface a missing cleanup|||StrictMode chạy đôi effect ở dev để lộ cleanup còn thiếu',
              'The component rendered twice by accident|||Component render hai lần do vô tình',
              'React always runs effects twice, even in production|||React luôn chạy effect hai lần, kể cả production',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The correct way to handle the StrictMode double-run is to…|||Cách đúng để xử lý cú chạy-hai-lần của StrictMode là…',
            options: [
              'disable StrictMode|||tắt StrictMode',
              'detect the second run with a flag and skip it|||dò lần chạy thứ hai bằng cờ và bỏ qua',
              'write a matching cleanup so the effect is idempotent|||viết một cleanup khớp để effect idempotent',
              'move the effect into render|||chuyển effect vào render',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You have items in state and want their total. Best approach?|||Bạn có items trong state và muốn tổng của chúng. Cách tốt nhất?',
            options: [
              'A useEffect that calls setTotal when items changes|||Một useEffect gọi setTotal khi items đổi',
              'Compute const total = items.reduce(...) during render, no effect|||Tính const total = items.reduce(...) trong lúc render, không effect',
              'Store total in a ref|||Lưu total trong một ref',
              'Two separate state variables kept in sync|||Hai biến state riêng giữ đồng bộ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does an object literal { } in the dependency array make the effect run every render?|||Vì sao một object literal { } trong mảng phụ thuộc làm effect chạy mỗi render?',
            options: [
              'Objects are not allowed as dependencies|||Object không được phép làm phụ thuộc',
              'It is a new reference each render, so Object.is always sees a change|||Nó là tham chiếu mới mỗi render, nên Object.is luôn thấy thay đổi',
              'React re-reads objects continuously|||React đọc lại object liên tục',
              'It never runs the effect at all|||Nó không bao giờ chạy effect',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A fetch-on-userId effect can show the wrong data because…|||Một effect fetch theo userId có thể hiện sai dữ liệu vì…',
            options: [
              'fetch is always synchronous|||fetch luôn đồng bộ',
              'responses can arrive out of order (a race); the stale one may setState last|||phản hồi có thể về không đúng thứ tự (đua); cái cũ có thể setState cuối',
              'useState is too slow|||useState quá chậm',
              'effects cannot call fetch|||effect không gọi được fetch',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In Next.js App Router, the default "load this page\'s data" case is best done…|||Trong Next.js App Router, trường hợp mặc định "tải dữ liệu của trang này" tốt nhất là…',
            options: [
              'in a useEffect on the client with a race guard|||trong một useEffect ở client có chống đua',
              'in a Server Component with a plain await, no effect|||trong một Server Component với await thuần, không effect',
              'in a global variable|||trong một biến toàn cục',
              'it cannot be done in Next.js|||không làm được trong Next.js',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
