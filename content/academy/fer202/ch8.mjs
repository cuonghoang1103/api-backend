/**
 * FER202 · Chapter 8 additions — Hooks (Slot 9–10, 46 slides: rules of hooks,
 * built-in & custom hooks, useState, useEffect + cleanup, lifecycle of effects,
 * useContext, useReducer) plus Exercises 12 (useState), 13 (useEffect),
 * 14 (useContext) and 15 (useReducer). Grounded slide-by-slide in
 * Slot9,10_Hooks.pptx. Spliced into Chapter 8 before its quiz; existing
 * 8.1 / 8.2 lessons untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;

const SLIDES = {
  title: '8.3 — Slide by slide: Hooks (Slot 9–10)|||8.3 — Học theo từng slide: Hooks (Slot 9–10)',
  slug: 'fer202-8-3-slot9-hooks-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 46 slide Slot 9–10: Hooks là gì & Rules of Hooks, hooks dựng sẵn & custom, useState (đếm/input/toggle), useEffect + cleanup & dependency array, vòng đời của Effect, useContext (chia sẻ & cập nhật dữ liệu), và useReducer (state phức tạp) — kèm code song ngữ.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 8 · Lesson 8.3 · Slot 9–10 deck (46 slides)</span>
<h2>Hooks, slide by slide</h2>
<p class="lead">Hooks are the modern way to give function components state, side-effects, context and more. This is the biggest deck in the course — take it in the four blocks it is built from: <strong>useState</strong>, <strong>useEffect</strong>, <strong>useContext</strong>, <strong>useReducer</strong>. Exercises 12–15 follow, one per hook.</p>`,
      `<span class="eyebrow">Chương 8 · Bài 8.3 · Bộ slide Slot 9–10 (46 slide)</span>
<h2>Hooks, theo từng slide</h2>
<p class="lead">Hooks là cách hiện đại để cho function component có state, side-effect, context và hơn nữa. Đây là bộ slide lớn nhất môn — học theo bốn khối nó được dựng: <strong>useState</strong>, <strong>useEffect</strong>, <strong>useContext</strong>, <strong>useReducer</strong>. Exercise 12–15 theo sau, mỗi hook một bài.</p>`,
    ),
    walkHead('slot9_10', 1, 46),
    walk('slot9_10', [
      [1, 'Introducing Hooks', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>The map: what Hooks are, the rules of Hooks, built-in and custom hooks, then useState, useEffect, useContext and useReducer in depth.</p>`, `<p>Bản đồ: Hooks là gì, quy tắc Hooks, hook dựng sẵn và custom, rồi useState, useEffect, useContext và useReducer đi sâu.</p>`],
      [3, 'What are Hooks?', `<p><strong>Hooks are functions that let you "hook into" React features from function components</strong> — state, lifecycle, context — without writing a class. Introduced in React 16.8. They are why modern React is written with functions, not classes.</p>`, `<p><strong>Hooks là các hàm cho phép bạn "móc vào" các tính năng của React từ function component</strong> — state, lifecycle, context — mà không cần viết class. Ra mắt ở React 16.8. Đó là lý do React hiện đại viết bằng hàm, không phải class.</p>`],
      [4, 'Rules of Hooks', `<p>Two rules, always: (1) <strong>Only call Hooks at the top level</strong> — never inside loops, conditions or nested functions. (2) <strong>Only call Hooks from React functions</strong> — components or custom Hooks. React relies on the <em>call order</em> being the same every render, which is why these rules exist.</p>`, `<p>Hai quy tắc, luôn luôn: (1) <strong>Chỉ gọi Hook ở cấp cao nhất</strong> — không bao giờ trong vòng lặp, điều kiện hay hàm lồng. (2) <strong>Chỉ gọi Hook từ hàm React</strong> — component hoặc custom Hook. React dựa vào <em>thứ tự gọi</em> giống nhau ở mỗi render, đó là lý do có các quy tắc này.</p>`],
      [5, 'Built-in Hooks', `<p>State: <code>useState</code>, <code>useReducer</code>. Effects: <code>useEffect</code>, <code>useLayoutEffect</code>. Context: <code>useContext</code>. Performance: <code>useMemo</code>, <code>useCallback</code>. Refs: <code>useRef</code>. This deck focuses on the four you use most.</p>`, `<p>State: <code>useState</code>, <code>useReducer</code>. Effect: <code>useEffect</code>, <code>useLayoutEffect</code>. Context: <code>useContext</code>. Hiệu năng: <code>useMemo</code>, <code>useCallback</code>. Ref: <code>useRef</code>. Bộ slide này tập trung bốn hook dùng nhiều nhất.</p>`],
      [6, 'Built-in Hooks — cont’d', `<p>More detail on the effect/ref hooks: <code>useRef</code> holds a mutable value that survives renders without causing a re-render; <code>useLayoutEffect</code> is like <code>useEffect</code> but fires synchronously after DOM mutations (for measuring layout).</p>`, `<p>Chi tiết hơn về hook effect/ref: <code>useRef</code> giữ một giá trị thay đổi được, tồn tại qua các render mà không gây re-render; <code>useLayoutEffect</code> giống <code>useEffect</code> nhưng chạy đồng bộ sau khi DOM đổi (để đo layout).</p>`],
      [7, 'Built-in Hooks — cont’d', `<p>Performance hooks: <code>useMemo</code> caches a computed value, <code>useCallback</code> caches a function, both keyed by a dependency array — used to avoid needless recomputation/re-renders (Advanced chapter).</p>`, `<p>Hook hiệu năng: <code>useMemo</code> cache một giá trị tính được, <code>useCallback</code> cache một hàm, cả hai theo mảng phụ thuộc — dùng để tránh tính lại/re-render thừa (chương Nâng cao).</p>`],
      [8, 'Custom Hooks', `<p>A <strong>custom Hook</strong> is a function whose name starts with <code>use</code> that calls other Hooks — the way you extract and reuse stateful logic between components (e.g. <code>useFetch(url)</code>, <code>useToggle()</code>). This is the modern replacement for HOCs and render props.</p>`, `<p><strong>Custom Hook</strong> là một hàm tên bắt đầu bằng <code>use</code> và gọi các Hook khác — cách bạn tách và tái dùng logic có state giữa các component (ví dụ <code>useFetch(url)</code>, <code>useToggle()</code>). Đây là bản thay thế hiện đại cho HOC và render prop.</p>`],
      [9, 'React Hooks vs Classes', `<p>Function + Hooks vs class: less boilerplate (no <code>this</code>, no <code>bind</code>), related logic grouped together (not split across lifecycle methods), and easier reuse via custom Hooks. Same capabilities, simpler code.</p>`, `<p>Function + Hooks so với class: ít rườm rà hơn (không <code>this</code>, không <code>bind</code>), logic liên quan gom lại (không rải khắp các lifecycle method), và dễ tái dùng qua custom Hook. Cùng khả năng, code đơn giản hơn.</p>`],
      [10, 'Maintaining state with useState', `<p><code>const [state, setState] = useState(initial)</code>. It returns the current value and a setter; calling the setter queues a re-render with the new value. The argument is the initial value (used only on first render).</p>`, `<p><code>const [state, setState] = useState(initial)</code>. Nó trả về giá trị hiện tại và một hàm set; gọi hàm set xếp hàng một re-render với giá trị mới. Đối số là giá trị ban đầu (chỉ dùng ở render đầu).</p>`],
      [11, 'useState — cont’d (multiple state)', `<p>Call <code>useState</code> as many times as you need — one per independent piece of state: <code>const [name, setName] = useState(''); const [age, setAge] = useState(0);</code>. Keep unrelated values in separate state variables.</p>`, `<p>Gọi <code>useState</code> bao nhiêu lần tuỳ nhu cầu — mỗi mảnh state độc lập một cái: <code>const [name, setName] = useState(''); const [age, setAge] = useState(0);</code>. Giữ các giá trị không liên quan ở biến state riêng.</p>`],
      [12, 'useState — cont’d (object state)', `<p>For object state, <strong>never mutate</strong> — create a new object with spread: <code>setUser(u =&gt; ({ ...u, name: 'An' }))</code>. Unlike class <code>setState</code>, <code>useState</code> does not merge, so you spread the old value yourself.</p>`, `<p>Với state là object, <strong>không sửa tại chỗ</strong> — tạo object mới bằng spread: <code>setUser(u =&gt; ({ ...u, name: 'An' }))</code>. Khác <code>setState</code> của class, <code>useState</code> không tự gộp, nên bạn tự spread giá trị cũ.</p>`],
      [13, 'useState — cont’d (updater form)', `<p>When the new value depends on the old, use the updater: <code>setCount(c =&gt; c + 1)</code> (see Chapter 6, "state as a snapshot"). Lazy initial state: pass a function <code>useState(() =&gt; expensiveInit())</code> to compute the initial value only once.</p>`, `<p>Khi giá trị mới phụ thuộc giá trị cũ, dùng updater: <code>setCount(c =&gt; c + 1)</code> (xem Chương 6, "state là ảnh chụp"). Khởi tạo lười: truyền một hàm <code>useState(() =&gt; expensiveInit())</code> để tính giá trị đầu chỉ một lần.</p>`],
      [14, 'Exercise 12: useState', `<p>Hand-off to <strong>Exercise 12</strong> — counter, controlled input, toggle visibility. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 12</strong> — counter, input controlled, toggle hiện/ẩn. Đề đầy đủ ở các bài kế.</p>`],
      [15, 'useEffect — initialization & cleanup', `<p><code>useEffect(setup, deps)</code> runs a side-effect after render. Return a <strong>cleanup</strong> function to undo it (unsubscribe, clear a timer). Effects are for things outside React: fetching, subscriptions, timers, manual DOM.</p>`, `<p><code>useEffect(setup, deps)</code> chạy một side-effect sau render. Trả về một hàm <strong>cleanup</strong> để dọn (huỷ subscribe, xoá timer). Effect dành cho thứ ngoài React: fetch, subscription, timer, DOM thủ công.</p>`],
      [16, 'useEffect — the dependency array', `<p>The second argument controls when the effect re-runs: omit it → after <em>every</em> render; <code>[]</code> → once after mount; <code>[a, b]</code> → whenever <code>a</code> or <code>b</code> changes. Getting deps right is the core skill of useEffect.</p>`, `<p>Đối số thứ hai điều khiển khi nào effect chạy lại: bỏ trống → sau <em>mỗi</em> render; <code>[]</code> → một lần sau mount; <code>[a, b]</code> → mỗi khi <code>a</code> hoặc <code>b</code> đổi. Đặt đúng deps là kỹ năng cốt lõi của useEffect.</p>`],
      [17, 'useEffect — run once (mount)', `<p><code>useEffect(() =&gt; { … }, [])</code> — the classic "on mount" effect, equivalent to <code>componentDidMount</code>. Use it to fetch initial data or set up a one-time subscription.</p>`, `<p><code>useEffect(() =&gt; { … }, [])</code> — effect "khi mount" kinh điển, tương đương <code>componentDidMount</code>. Dùng để lấy dữ liệu ban đầu hoặc set up một subscription một lần.</p>`],
      [18, 'useEffect — cleanup on unmount', `<p>The returned function runs before the component unmounts (and before each re-run): <code>useEffect(() =&gt; { const id = setInterval(...); return () =&gt; clearInterval(id); }, [])</code>. Forgetting cleanup leaks timers/listeners.</p>`, `<p>Hàm trả về chạy trước khi component unmount (và trước mỗi lần chạy lại): <code>useEffect(() =&gt; { const id = setInterval(...); return () =&gt; clearInterval(id); }, [])</code>. Quên cleanup là rò rỉ timer/listener.</p>`],
      [19, 'useEffect — re-run on dependency change', `<p><code>useEffect(() =&gt; { fetchUser(id); }, [id])</code> re-fetches whenever <code>id</code> changes. React runs the cleanup of the previous effect, then the new one — so old subscriptions are always torn down first.</p>`, `<p><code>useEffect(() =&gt; { fetchUser(id); }, [id])</code> fetch lại mỗi khi <code>id</code> đổi. React chạy cleanup của effect trước, rồi effect mới — nên subscription cũ luôn bị dọn trước.</p>`],
      [20, 'useEffect — data fetching pattern', `<p>Fetch inside the effect with an async function: define <code>async function load(){…}</code> then call it; or add an <code>AbortController</code> in cleanup to cancel an in-flight request when deps change. This is exactly Exercise 13.</p>`, `<p>Fetch bên trong effect bằng một hàm async: định nghĩa <code>async function load(){…}</code> rồi gọi; hoặc thêm <code>AbortController</code> trong cleanup để huỷ request đang bay khi deps đổi. Đây đúng là Exercise 13.</p>`],
      [21, 'useEffect — pitfalls', `<p>Common bug: an object/array/function in the dependency array is recreated every render, so the effect never stops running. Fix by moving it inside the effect, or memoising with <code>useMemo</code>/<code>useCallback</code>. Also: do not <code>setState</code> unconditionally inside an effect with no deps — infinite loop.</p>`, `<p>Lỗi thường gặp: một object/mảng/hàm trong mảng phụ thuộc bị tạo lại mỗi render, nên effect chạy mãi. Sửa bằng cách đưa nó vào trong effect, hoặc memo hoá bằng <code>useMemo</code>/<code>useCallback</code>. Cũng vậy: đừng <code>setState</code> vô điều kiện trong effect không deps — lặp vô tận.</p>`],
      [22, 'Exercise 13: useEffect', `<p>Hand-off to <strong>Exercise 13</strong> — fetch and display posts by user id, refetch when the id changes. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 13</strong> — fetch và hiển thị bài viết theo user id, fetch lại khi id đổi. Đề đầy đủ ở các bài kế.</p>`],
      [23, 'Lifecycle of reactive effects', `<p>Section: an effect has its own lifecycle, separate from the component's. Think of it as a <strong>synchronisation</strong> between React and an external system, not as a "run on mount / update".</p>`, `<p>Phân mục: một effect có vòng đời riêng, tách khỏi vòng đời component. Hãy coi nó như một <strong>đồng bộ hoá</strong> giữa React và một hệ thống bên ngoài, không phải "chạy khi mount / update".</p>`],
      [24, 'Lifecycle — start & stop', `<p>An effect <strong>starts synchronising</strong> and later <strong>stops synchronising</strong>. The setup starts it; the cleanup stops it. Over the component's life this start/stop can happen many times.</p>`, `<p>Một effect <strong>bắt đầu đồng bộ</strong> rồi sau đó <strong>dừng đồng bộ</strong>. Phần setup bắt đầu; phần cleanup dừng. Suốt đời component, chu kỳ bắt đầu/dừng này có thể lặp nhiều lần.</p>`],
      [25, 'The lifecycle of an Effect', `<p>Example: a chat effect connects to <code>roomId</code>. When <code>roomId</code> changes, React stops the old connection (cleanup) and starts a new one (setup) — keeping the connection in sync with the current prop.</p>`, `<p>Ví dụ: một effect chat kết nối tới <code>roomId</code>. Khi <code>roomId</code> đổi, React dừng kết nối cũ (cleanup) và mở kết nối mới (setup) — giữ kết nối đồng bộ với prop hiện tại.</p>`],
      [26, 'The lifecycle of an Effect — cont’d', `<p>Every value from the component used inside the effect (props, state) must be in the dependency array — they are the effect's inputs. The linter (eslint-plugin-react-hooks) enforces this; trust it.</p>`, `<p>Mọi giá trị của component dùng trong effect (props, state) phải nằm trong mảng phụ thuộc — chúng là đầu vào của effect. Linter (eslint-plugin-react-hooks) ép điều này; hãy tin nó.</p>`],
      [27, 'Thinking from the Effect’s perspective', `<p>Do not ask "when does this run?" Ask "what does this effect synchronise, and what does it need to do that?". That reframing makes the dependency array obvious and prevents most bugs.</p>`, `<p>Đừng hỏi "khi nào cái này chạy?". Hãy hỏi "effect này đồng bộ cái gì, và cần gì để làm việc đó?". Cách nghĩ lại này làm mảng phụ thuộc trở nên hiển nhiên và ngừa phần lớn lỗi.</p>`],
      [28, 'One start/stop cycle at a time', `<p>Reason about a single synchronise/desynchronise cycle in isolation, not the whole timeline. If one cycle is correct (setup does X, cleanup undoes X), the whole sequence is correct.</p>`, `<p>Suy luận về một chu kỳ đồng bộ/ngắt đồng bộ đơn lẻ, không phải cả dòng thời gian. Nếu một chu kỳ đúng (setup làm X, cleanup hoàn tác X), cả chuỗi sẽ đúng.</p>`],
      [29, 'Sharing data with useContext', `<p><code>const value = useContext(MyContext)</code> reads the nearest provider's value from a function component — no <code>&lt;Consumer&gt;</code> render prop needed. This is the modern way to consume context.</p>`, `<p><code>const value = useContext(MyContext)</code> đọc giá trị của provider gần nhất từ function component — khỏi cần render prop <code>&lt;Consumer&gt;</code>. Đây là cách hiện đại để dùng context.</p>`],
      [30, 'useContext — create & provide', `<p>Three steps: <code>const Ctx = createContext(default)</code>; wrap the tree in <code>&lt;Ctx.Provider value={data}&gt;</code>; call <code>useContext(Ctx)</code> anywhere below. Any consumer re-renders when the provider's <code>value</code> changes.</p>`, `<p>Ba bước: <code>const Ctx = createContext(default)</code>; bọc cây trong <code>&lt;Ctx.Provider value={data}&gt;</code>; gọi <code>useContext(Ctx)</code> ở bất cứ đâu bên dưới. Mọi consumer re-render khi <code>value</code> của provider đổi.</p>`],
      [31, 'useContext — cont’d', `<p>Use it for truly global data: theme, current user, language, permissions. Avoid putting fast-changing values in one big context — every consumer re-renders on any change (split contexts instead).</p>`, `<p>Dùng cho dữ liệu thực sự toàn cục: theme, user hiện tại, ngôn ngữ, quyền. Tránh nhét giá trị đổi nhanh vào một context lớn — mọi consumer re-render mỗi lần đổi (hãy tách context).</p>`],
      [32, 'Sharing fetched data', `<p>A common pattern: a provider fetches data in a <code>useEffect</code> and exposes it via context, so many components read the same fetched data without each fetching it.</p>`, `<p>Mẫu phổ biến: một provider fetch dữ liệu trong <code>useEffect</code> và phơi qua context, để nhiều component đọc cùng dữ liệu đã fetch mà không cái nào tự fetch.</p>`],
      [33, 'useContext — cont’d', `<p>Combine context with <code>useState</code>/<code>useReducer</code> in the provider so consumers get both the data and functions to update it — a lightweight alternative to Redux for small apps.</p>`, `<p>Kết hợp context với <code>useState</code>/<code>useReducer</code> trong provider để consumer nhận cả dữ liệu lẫn hàm cập nhật — một lựa chọn nhẹ thay Redux cho app nhỏ.</p>`],
      [34, 'useContext — cont’d', `<p>Pattern: a custom Hook wrapping context, e.g. <code>function useAuth() { return useContext(AuthContext); }</code>, so components import <code>useAuth()</code> instead of the raw context — cleaner and easier to refactor.</p>`, `<p>Mẫu: một custom Hook bọc context, ví dụ <code>function useAuth() { return useContext(AuthContext); }</code>, để component import <code>useAuth()</code> thay cho context thô — gọn và dễ refactor hơn.</p>`],
      [35, 'useContext — cont’d', `<p>Nesting providers: wrap the app in multiple providers (theme, auth, cart). Order matters only if one depends on another; otherwise they compose freely.</p>`, `<p>Lồng provider: bọc app trong nhiều provider (theme, auth, cart). Thứ tự chỉ quan trọng khi cái này phụ thuộc cái kia; nếu không, chúng ghép tự do.</p>`],
      [36, 'Updating stateful context data', `<p>Put the setter in the context value: <code>&lt;Ctx.Provider value={{ user, setUser }}&gt;</code>. A consumer calls <code>setUser(...)</code> to update the shared state, and every consumer re-renders with the new value.</p>`, `<p>Đưa hàm set vào giá trị context: <code>&lt;Ctx.Provider value={{ user, setUser }}&gt;</code>. Consumer gọi <code>setUser(...)</code> để cập nhật state dùng chung, và mọi consumer re-render với giá trị mới.</p>`],
      [37, 'Exercise 14: useContext', `<p>Hand-off to <strong>Exercise 14</strong> — a light/dark theme via context. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 14</strong> — theme sáng/tối qua context. Đề đầy đủ ở các bài kế.</p>`],
      [38, 'useReducer — scaling state', `<p><code>const [state, dispatch] = useReducer(reducer, initialState)</code>. When state logic gets complex (many related transitions), a reducer centralises it: you <code>dispatch({ type })</code> actions and a pure <code>reducer(state, action)</code> returns the next state.</p>`, `<p><code>const [state, dispatch] = useReducer(reducer, initialState)</code>. Khi logic state phức tạp (nhiều chuyển trạng thái liên quan), reducer gom lại: bạn <code>dispatch({ type })</code> action và một <code>reducer(state, action)</code> thuần trả về state kế.</p>`],
      [39, 'useReducer — the reducer function', `<p>A reducer is a pure function with a <code>switch</code> on <code>action.type</code>: <code>function counter(state, action) { switch(action.type){ case 'INCREMENT': return { count: state.count + 1 }; … } }</code>. Same idea as Redux (Chapter 12).</p>`, `<p>Reducer là một hàm thuần với <code>switch</code> theo <code>action.type</code>: <code>function counter(state, action) { switch(action.type){ case 'INCREMENT': return { count: state.count + 1 }; … } }</code>. Cùng ý với Redux (Chương 12).</p>`],
      [40, 'useReducer — dispatch', `<p>Trigger changes by dispatching actions: <code>&lt;button onClick={() =&gt; dispatch({ type: 'INCREMENT' })}&gt;+&lt;/button&gt;</code>. Components describe <em>what happened</em> (the action), the reducer decides <em>how state changes</em>.</p>`, `<p>Kích hoạt thay đổi bằng dispatch action: <code>&lt;button onClick={() =&gt; dispatch({ type: 'INCREMENT' })}&gt;+&lt;/button&gt;</code>. Component mô tả <em>chuyện gì xảy ra</em> (action), reducer quyết định <em>state đổi thế nào</em>.</p>`],
      [41, 'useReducer — cont’d (payload)', `<p>Actions can carry data: <code>dispatch({ type: 'ADD_TODO', payload: text })</code>, read in the reducer as <code>action.payload</code>. Keeps all update logic in one testable place.</p>`, `<p>Action có thể mang dữ liệu: <code>dispatch({ type: 'ADD_TODO', payload: text })</code>, đọc trong reducer là <code>action.payload</code>. Giữ mọi logic cập nhật ở một chỗ dễ test.</p>`],
      [42, 'useReducer — cont’d (vs useState)', `<p>Prefer <code>useReducer</code> when: state has many sub-values, the next state depends on the previous in complex ways, or updates are scattered — it makes them predictable. Prefer <code>useState</code> for simple, independent values.</p>`, `<p>Nên dùng <code>useReducer</code> khi: state có nhiều giá trị con, state kế phụ thuộc state trước theo cách phức tạp, hoặc cập nhật rải rác — nó làm chúng dễ đoán. Dùng <code>useState</code> cho giá trị đơn giản, độc lập.</p>`],
      [43, 'useReducer — cont’d (with context)', `<p>Combine <code>useReducer</code> + context to share complex state app-wide: provide <code>{ state, dispatch }</code> and any component can dispatch — a Redux-like architecture with zero libraries.</p>`, `<p>Kết hợp <code>useReducer</code> + context để chia sẻ state phức tạp toàn app: cung cấp <code>{ state, dispatch }</code> và bất kỳ component nào cũng dispatch được — kiến trúc kiểu Redux mà không cần thư viện.</p>`],
      [44, 'Exercise 15: useReducer', `<p>Hand-off to <strong>Exercise 15</strong> — a counter and a question-bank managed with a reducer. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 15</strong> — một counter và một ngân hàng câu hỏi quản lý bằng reducer. Đề đầy đủ ở các bài kế.</p>`],
      [45, 'Lab 4: all Hooks', `<p>Points to the larger lab combining useState, useEffect, useContext and useReducer. Practise it with Exercises 12–15 and the practice project.</p>`, `<p>Trỏ tới bài lab lớn gộp useState, useEffect, useContext và useReducer. Luyện qua Exercise 12–15 và dự án luyện tập.</p>`],
      [46, 'Summary', `<p>Recap: Hooks add React features to function components; obey the two rules; <code>useState</code> for local state (updater form, no auto-merge), <code>useEffect</code> for side-effects (deps array + cleanup, think "synchronise"), <code>useContext</code> to share data without drilling, <code>useReducer</code> for complex state via actions + a pure reducer. Extract reusable logic into custom Hooks.</p>`, `<p>Tóm tắt: Hooks thêm tính năng React cho function component; tuân hai quy tắc; <code>useState</code> cho state cục bộ (dạng updater, không tự gộp), <code>useEffect</code> cho side-effect (mảng deps + cleanup, nghĩ "đồng bộ"), <code>useContext</code> chia sẻ dữ liệu không drilling, <code>useReducer</code> cho state phức tạp qua action + reducer thuần. Tách logic tái dùng thành custom Hook.</p>`],
    ]),
    books([
      ['reactdoc', '“State: A Component’s Memory”, “Synchronizing with Effects”, “Scaling Up with Reducer and Context”', '“State: A Component’s Memory”, “Synchronizing with Effects”, “Scaling Up with Reducer and Context”'],
    ]),
  ].join('\n'),
};

/* ═══════════ Exercises 12–15 ═══════════ */
const EX12 = {
  title: 'Exercise 12 — useState (counter, input, toggle)|||Exercise 12 — useState (counter, input, toggle)',
  slug: 'fer202-8-ex12-usestate',
  type: 'EXERCISE',
  description: 'Ba bài useState: counter tăng khi bấm, ô input controlled hiển thị realtime, và toggle hiện/ẩn text.',
  content: bi(
    `<span class="eyebrow">Chapter 8 · Exercise 12 · Slot 9–10 slide 14</span>
<h2>useState — three small components</h2>
<pre><code class="language-javascript"><span class="hljs-comment">// 1) Counter</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Counter</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [n, setN] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>);
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setN(c =&gt; c + 1)}&gt;Count: {n}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></span>;
}
<span class="hljs-comment">// 2) Controlled input — text updates in real time</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Echo</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [text, setText] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">return</span> (<span class="language-xml"><span class="hljs-tag">&lt;&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{text}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setText(e.target.value)} /&gt;<span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{text}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;/&gt;</span></span>);
}
<span class="hljs-comment">// 3) Toggle visibility</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Toggle</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [show, setShow] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">return</span> (<span class="language-xml"><span class="hljs-tag">&lt;&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setShow(s =&gt; !s)}&gt;{show ? &#x27;Hide&#x27; : &#x27;Show&#x27;}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>{show &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Now you see me<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>}<span class="hljs-tag">&lt;/&gt;</span></span>);
}</code></pre>
<div class="out"><b>Result:</b> the counter increments per click, the paragraph mirrors the input as you type, and the button hides/shows the text.</div>
<h3>The other four tasks of the handout (Todo List · Color Switcher · Search Filter · Drag and Drop)</h3><p>The school handout lists seven small components; the three above are the first ones. The rest use the same four-step loop (state → JSX → event calls the setter → React re-renders). All code below was run for real.</p><h4>4) Todo List — add and delete</h4><pre><code class="language-javascript">import { useState } from 'react';

export default function TodoList() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);

  const add = () =&gt; {
    if (text.trim() === '') return;
    setTodos([...todos, { id: Date.now(), title: text.trim() }]);
    setText('');
  };
  const remove = (id) =&gt; setTodos(todos.filter((t) =&gt; t.id !== id));

  return (
    &lt;div&gt;
      &lt;input
        value={text}
        onChange={(e) =&gt; setText(e.target.value)}
        placeholder="Việc cần làm"
      /&gt;
      &lt;button onClick={add}&gt;Thêm&lt;/button&gt;
      &lt;ul&gt;
        {todos.map((t) =&gt; (
          &lt;li key={t.id}&gt;
            {t.title} &lt;button onClick={() =&gt; remove(t.id)}&gt;Xoá&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}</code></pre><p>Never <code>push</code> into the state array: create a new array with <code>[...todos, item]</code> / <code>filter</code> so React sees a new reference.</p><h4>5) Color Switcher</h4><pre><code class="language-javascript">import { useState } from 'react';

export default function ColorSwitcher() {
  const [color, setColor] = useState('red');
  return (
    &lt;div&gt;
      &lt;select value={color} onChange={(e) =&gt; setColor(e.target.value)}&gt;
        &lt;option value="red"&gt;red&lt;/option&gt;
        &lt;option value="blue"&gt;blue&lt;/option&gt;
        &lt;option value="green"&gt;green&lt;/option&gt;
        &lt;option value="yellow"&gt;yellow&lt;/option&gt;
      &lt;/select&gt;
      &lt;div style={{ background: color, height: 120, marginTop: 12 }}&gt;
        Màu: {color}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre><p>One state (<code>color</code>) drives both the dropdown and the background.</p><h4>6) Search Filter</h4><pre><code class="language-javascript">import { useState } from 'react';

const FRUITS = [
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Orange',
  'Grape',
];

export default function SearchFilter() {
  const [query, setQuery] = useState('');
  const shown = FRUITS.filter((f) =&gt;
    f.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    &lt;div&gt;
      &lt;input
        value={query}
        onChange={(e) =&gt; setQuery(e.target.value)}
        placeholder="Tìm trái cây..."
      /&gt;
      &lt;ul&gt;
        {shown.map((f) =&gt; (
          &lt;li key={f}&gt;{f}&lt;/li&gt;
        ))}
      &lt;/ul&gt;
      {shown.length === 0 &amp;&amp; &lt;p&gt;Không có kết quả&lt;/p&gt;}
    &lt;/div&gt;
  );
}</code></pre><p>The filtered list is <em>derived</em> from <code>query</code> while rendering — it does not need its own state.</p><h4>7) Drag and Drop List</h4><pre><code class="language-javascript">import { useState } from 'react';

export default function DragList() {
  const [items, setItems] = useState([
    'Học React',
    'Làm Exercise 12',
    'Ôn thi PE',
    'Ngủ sớm',
  ]);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (index) =&gt; setDragging(index);

  const handleDragOver = (e, index) =&gt; {
    e.preventDefault();
    if (dragging === null || dragging === index) return;
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(index, 0, moved);
    setItems(next);
    setDragging(index);
  };

  const handleDragEnd = () =&gt; setDragging(null);

  return (
    &lt;ul&gt;
      {items.map((item, index) =&gt; (
        &lt;li
          key={item}
          draggable
          onDragStart={() =&gt; handleDragStart(index)}
          onDragOver={(e) =&gt; handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            opacity: dragging === index ? 0.4 : 1,
            cursor: 'grab',
          }}
        &gt;
          {item}
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre><p>Two states (<code>items</code>, <code>dragging</code>) + three events; <code>splice</code> cuts the dragged item out and inserts it at the new index (on a copy of the array).</p><div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Build the three</span><span class="lc-sub">Counter, Echo, Toggle — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 8 · Exercise 12 · Slot 9–10 slide 14</span>
<h2>useState — ba component nhỏ</h2>
<pre><code class="language-javascript"><span class="hljs-comment">// 1) Counter</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Counter</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [n, setN] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>);
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setN(c =&gt; c + 1)}&gt;Count: {n}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></span>;
}
<span class="hljs-comment">// 2) Input controlled — text đổi theo thời gian thực</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Echo</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [text, setText] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">return</span> (<span class="language-xml"><span class="hljs-tag">&lt;&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{text}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setText(e.target.value)} /&gt;<span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{text}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;/&gt;</span></span>);
}
<span class="hljs-comment">// 3) Toggle hiện/ẩn</span>
<span class="hljs-keyword">function</span> <span class="hljs-title function_">Toggle</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [show, setShow] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">return</span> (<span class="language-xml"><span class="hljs-tag">&lt;&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setShow(s =&gt; !s)}&gt;{show ? &#x27;Ẩn&#x27; : &#x27;Hiện&#x27;}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>{show &amp;&amp; <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Giờ bạn thấy tôi<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>}<span class="hljs-tag">&lt;/&gt;</span></span>);
}</code></pre>
<div class="out"><b>Kết quả:</b> counter tăng mỗi lần bấm, đoạn văn phản chiếu input khi gõ, và nút ẩn/hiện text.</div>
<h3>Bốn bài còn lại của đề trường (Todo List · Color Switcher · Search Filter · Drag and Drop)</h3><p>Đề của trường có bảy component nhỏ; ba bài ở trên là ba bài đầu. Các bài còn lại cùng một vòng bốn bước (state → JSX → sự kiện gọi hàm set → React vẽ lại). Mọi code dưới đây đã chạy thật.</p><h4>4) Todo List — thêm và xoá</h4><pre><code class="language-javascript">import { useState } from 'react';

export default function TodoList() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);

  const add = () =&gt; {
    if (text.trim() === '') return;
    setTodos([...todos, { id: Date.now(), title: text.trim() }]);
    setText('');
  };
  const remove = (id) =&gt; setTodos(todos.filter((t) =&gt; t.id !== id));

  return (
    &lt;div&gt;
      &lt;input
        value={text}
        onChange={(e) =&gt; setText(e.target.value)}
        placeholder="Việc cần làm"
      /&gt;
      &lt;button onClick={add}&gt;Thêm&lt;/button&gt;
      &lt;ul&gt;
        {todos.map((t) =&gt; (
          &lt;li key={t.id}&gt;
            {t.title} &lt;button onClick={() =&gt; remove(t.id)}&gt;Xoá&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}</code></pre><p>Đừng <code>push</code> vào mảng state: tạo mảng mới bằng <code>[...todos, việc]</code> / <code>filter</code> để React thấy một tham chiếu mới.</p><h4>5) Color Switcher — đổi màu nền</h4><pre><code class="language-javascript">import { useState } from 'react';

export default function ColorSwitcher() {
  const [color, setColor] = useState('red');
  return (
    &lt;div&gt;
      &lt;select value={color} onChange={(e) =&gt; setColor(e.target.value)}&gt;
        &lt;option value="red"&gt;red&lt;/option&gt;
        &lt;option value="blue"&gt;blue&lt;/option&gt;
        &lt;option value="green"&gt;green&lt;/option&gt;
        &lt;option value="yellow"&gt;yellow&lt;/option&gt;
      &lt;/select&gt;
      &lt;div style={{ background: color, height: 120, marginTop: 12 }}&gt;
        Màu: {color}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre><p>Một state (<code>color</code>) điều khiển cả danh sách thả xuống lẫn màu nền.</p><h4>6) Search Filter — lọc khi gõ</h4><pre><code class="language-javascript">import { useState } from 'react';

const FRUITS = [
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Orange',
  'Grape',
];

export default function SearchFilter() {
  const [query, setQuery] = useState('');
  const shown = FRUITS.filter((f) =&gt;
    f.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    &lt;div&gt;
      &lt;input
        value={query}
        onChange={(e) =&gt; setQuery(e.target.value)}
        placeholder="Tìm trái cây..."
      /&gt;
      &lt;ul&gt;
        {shown.map((f) =&gt; (
          &lt;li key={f}&gt;{f}&lt;/li&gt;
        ))}
      &lt;/ul&gt;
      {shown.length === 0 &amp;&amp; &lt;p&gt;Không có kết quả&lt;/p&gt;}
    &lt;/div&gt;
  );
}</code></pre><p>Danh sách đã lọc được <em>tính ra</em> từ <code>query</code> ngay lúc vẽ — không cần state riêng.</p><h4>7) Drag and Drop List — kéo thả</h4><pre><code class="language-javascript">import { useState } from 'react';

export default function DragList() {
  const [items, setItems] = useState([
    'Học React',
    'Làm Exercise 12',
    'Ôn thi PE',
    'Ngủ sớm',
  ]);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (index) =&gt; setDragging(index);

  const handleDragOver = (e, index) =&gt; {
    e.preventDefault();
    if (dragging === null || dragging === index) return;
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(index, 0, moved);
    setItems(next);
    setDragging(index);
  };

  const handleDragEnd = () =&gt; setDragging(null);

  return (
    &lt;ul&gt;
      {items.map((item, index) =&gt; (
        &lt;li
          key={item}
          draggable
          onDragStart={() =&gt; handleDragStart(index)}
          onDragOver={(e) =&gt; handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            opacity: dragging === index ? 0.4 : 1,
            cursor: 'grab',
          }}
        &gt;
          {item}
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre><p>Hai state (<code>items</code>, <code>dragging</code>) + ba sự kiện; <code>splice</code> cắt phần tử đang kéo ra và chèn vào chỉ số mới (trên bản sao của mảng).</p><div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Dựng cả ba</span><span class="lc-sub">Counter, Echo, Toggle — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

const EX13 = {
  title: 'Exercise 13 — useEffect (data fetching)|||Exercise 13 — useEffect (lấy dữ liệu)',
  slug: 'fer202-8-ex13-useeffect',
  type: 'EXERCISE',
  description: 'Fetch danh sách bài viết theo userId từ JSONPlaceholder khi mount và fetch lại khi userId đổi — đúng mẫu useEffect + async + dependency.',
  content: bi(
    `<span class="eyebrow">Chapter 8 · Exercise 13 · Slot 9–10 slide 22</span>
<h2>useEffect — fetch posts by user</h2>
<p class="lead"><b>Goal:</b> a <code>UserPosts</code> component that fetches posts for a <code>userId</code> when it mounts and refetches when <code>userId</code> changes.</p>
<pre><code class="language-javascript"><span class="hljs-keyword">function</span> <span class="hljs-title function_">UserPosts</span>(<span class="hljs-params">{ userId }</span>) {
  <span class="hljs-keyword">const</span> [posts, setPosts] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>([]);
  <span class="hljs-keyword">const</span> [loading, setLoading] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>);

  <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-keyword">let</span> active = <span class="hljs-literal">true</span>;
    <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">true</span>);
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">load</span>(<span class="hljs-params"></span>) {
      <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(
        <span class="hljs-string">\`https://jsonplaceholder.typicode.com/posts?userId=<span class="hljs-subst">\${userId}</span>\`</span>);
      <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>();
      <span class="hljs-keyword">if</span> (active) { <span class="hljs-title function_">setPosts</span>(data); <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>); }
    }
    <span class="hljs-title function_">load</span>();
    <span class="hljs-keyword">return</span> <span class="hljs-function">() =&gt;</span> { active = <span class="hljs-literal">false</span>; };   <span class="hljs-comment">// ignore a stale response</span>
  }, [userId]);                         <span class="hljs-comment">// refetch when userId changes</span>

  <span class="hljs-keyword">if</span> (loading) <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Loading…<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{posts.map(p =&gt; <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{p.id}</span>&gt;</span>{p.title}<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}<span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span></span>;
}</code></pre>
<div class="pitfall"><b>Trap:</b> put <code>userId</code> in the dependency array or the list never updates when the prop changes. The <code>active</code> flag in cleanup prevents a slow earlier response from overwriting a newer one (a race).</div><h3>The other three tasks of the handout (Countdown Timer · Window Resize · Form Validation)</h3><p>Same rule for all of them: the dependency array lists every value the effect reads, and whatever the effect starts (interval, listener) must be undone in the cleanup. All code below was run for real.</p><h4>2) Countdown Timer</h4><pre><code class="language-javascript">import { useState, useEffect } from 'react';

function CountdownTimer({ initialValue }) {
  const [timeRemaining, setTimeRemaining] = useState(initialValue);

  useEffect(() =&gt; {
    if (timeRemaining &lt;= 0) return;
    const timerId = setInterval(() =&gt; {
      setTimeRemaining((prev) =&gt; prev - 1);
    }, 1000);
    return () =&gt; clearInterval(timerId);
  }, [timeRemaining]);

  return &lt;p&gt;Time Remaining: {timeRemaining}&lt;/p&gt;;
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    &lt;div&gt;
      &lt;button onClick={() =&gt; setShow(!show)}&gt;
        {show ? 'Gỡ timer' : 'Gắn lại timer'}
      &lt;/button&gt;
      {show &amp;&amp; &lt;CountdownTimer initialValue={5} /&gt;}
    &lt;/div&gt;
  );
}</code></pre><p><code>if (timeRemaining &lt;= 0) return</code> stops it at 0; the cleanup clears the interval each second because <code>timeRemaining</code> is in the array.</p><h4>3) Window Resize Listener</h4><pre><code class="language-javascript">import { useState, useEffect } from 'react';

export default function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() =&gt; {
    const handleResize = () =&gt; {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () =&gt; window.removeEventListener('resize', handleResize);
  }, []);

  return (
    &lt;p&gt;
      Window size: {size.width} x {size.height}
    &lt;/p&gt;
  );
}</code></pre><p>Every <code>addEventListener</code> needs a matching <code>removeEventListener</code> with the <em>same function</em>; forgetting it leaks one listener per mount (measured: 1 → 4 handlers after three remounts).</p><h4>4) Form Input Validation</h4><pre><code class="language-javascript">import { useState, useEffect } from 'react';

function ValidatedInput({ validationFunction, errorMessage }) {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() =&gt; {
    setIsValid(validationFunction(value));
  }, [value, validationFunction]);

  return (
    &lt;div&gt;
      &lt;input
        type="text"
        value={value}
        onChange={(e) =&gt; setValue(e.target.value)}
        style={{ borderColor: isValid ? '' : 'red' }}
      /&gt;
      {!isValid &amp;&amp; &lt;p style={{ color: 'red' }}&gt;{errorMessage}&lt;/p&gt;}
    &lt;/div&gt;
  );
}

const isEmail = (v) =&gt; v === '' || /^\\S+@\\S+\\.\\S+$/.test(v);

export default function App() {
  return (
    &lt;ValidatedInput
      validationFunction={isEmail}
      errorMessage="Email chưa đúng định dạng"
    /&gt;
  );
}</code></pre><p>Works as the handout asks (useEffect). In real projects <code>isValid</code> can simply be computed while rendering — no extra state, no extra render. Never write <code>useEffect(async () =&gt; …)</code>: put the async function inside the effect.</p>`,
    `<span class="eyebrow">Chương 8 · Exercise 13 · Slot 9–10 slide 22</span>
<h2>useEffect — fetch bài viết theo user</h2>
<p class="lead"><b>Mục tiêu:</b> component <code>UserPosts</code> fetch bài viết cho một <code>userId</code> khi mount và fetch lại khi <code>userId</code> đổi.</p>
<pre><code class="language-javascript"><span class="hljs-keyword">function</span> <span class="hljs-title function_">UserPosts</span>(<span class="hljs-params">{ userId }</span>) {
  <span class="hljs-keyword">const</span> [posts, setPosts] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>([]);
  <span class="hljs-keyword">const</span> [loading, setLoading] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>);

  <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-keyword">let</span> active = <span class="hljs-literal">true</span>;
    <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">true</span>);
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">load</span>(<span class="hljs-params"></span>) {
      <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(
        <span class="hljs-string">\`https://jsonplaceholder.typicode.com/posts?userId=<span class="hljs-subst">\${userId}</span>\`</span>);
      <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>();
      <span class="hljs-keyword">if</span> (active) { <span class="hljs-title function_">setPosts</span>(data); <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>); }
    }
    <span class="hljs-title function_">load</span>();
    <span class="hljs-keyword">return</span> <span class="hljs-function">() =&gt;</span> { active = <span class="hljs-literal">false</span>; };   <span class="hljs-comment">// bỏ qua response cũ</span>
  }, [userId]);                         <span class="hljs-comment">// fetch lại khi userId đổi</span>

  <span class="hljs-keyword">if</span> (loading) <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Đang tải…<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{posts.map(p =&gt; <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{p.id}</span>&gt;</span>{p.title}<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}<span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span></span>;
}</code></pre>
<div class="pitfall"><b>Bẫy:</b> đưa <code>userId</code> vào mảng phụ thuộc, nếu không danh sách không cập nhật khi prop đổi. Cờ <code>active</code> trong cleanup ngăn một response cũ về chậm ghi đè response mới (race).</div><h3>Ba bài còn lại của đề trường (Countdown Timer · Window Resize · Form Validation)</h3><p>Cùng một luật cho cả ba: mảng dependency liệt kê mọi giá trị effect đọc, và thứ gì effect bật lên (interval, listener) phải được tắt trong cleanup. Mọi code dưới đây đã chạy thật.</p><h4>2) Countdown Timer — đếm ngược</h4><pre><code class="language-javascript">import { useState, useEffect } from 'react';

function CountdownTimer({ initialValue }) {
  const [timeRemaining, setTimeRemaining] = useState(initialValue);

  useEffect(() =&gt; {
    if (timeRemaining &lt;= 0) return;
    const timerId = setInterval(() =&gt; {
      setTimeRemaining((prev) =&gt; prev - 1);
    }, 1000);
    return () =&gt; clearInterval(timerId);
  }, [timeRemaining]);

  return &lt;p&gt;Time Remaining: {timeRemaining}&lt;/p&gt;;
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    &lt;div&gt;
      &lt;button onClick={() =&gt; setShow(!show)}&gt;
        {show ? 'Gỡ timer' : 'Gắn lại timer'}
      &lt;/button&gt;
      {show &amp;&amp; &lt;CountdownTimer initialValue={5} /&gt;}
    &lt;/div&gt;
  );
}</code></pre><p><code>if (timeRemaining &lt;= 0) return</code> dừng ở 0; cleanup xoá interval mỗi giây vì <code>timeRemaining</code> nằm trong mảng.</p><h4>3) Window Resize Listener</h4><pre><code class="language-javascript">import { useState, useEffect } from 'react';

export default function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() =&gt; {
    const handleResize = () =&gt; {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () =&gt; window.removeEventListener('resize', handleResize);
  }, []);

  return (
    &lt;p&gt;
      Window size: {size.width} x {size.height}
    &lt;/p&gt;
  );
}</code></pre><p>Mỗi <code>addEventListener</code> phải có <code>removeEventListener</code> với <em>đúng cùng một hàm</em>; quên là rò rỉ một listener mỗi lần mount (đo thật: 1 → 4 handler sau ba lần gỡ/gắn).</p><h4>4) Form Input Validation — kiểm tra ô nhập</h4><pre><code class="language-javascript">import { useState, useEffect } from 'react';

function ValidatedInput({ validationFunction, errorMessage }) {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() =&gt; {
    setIsValid(validationFunction(value));
  }, [value, validationFunction]);

  return (
    &lt;div&gt;
      &lt;input
        type="text"
        value={value}
        onChange={(e) =&gt; setValue(e.target.value)}
        style={{ borderColor: isValid ? '' : 'red' }}
      /&gt;
      {!isValid &amp;&amp; &lt;p style={{ color: 'red' }}&gt;{errorMessage}&lt;/p&gt;}
    &lt;/div&gt;
  );
}

const isEmail = (v) =&gt; v === '' || /^\\S+@\\S+\\.\\S+$/.test(v);

export default function App() {
  return (
    &lt;ValidatedInput
      validationFunction={isEmail}
      errorMessage="Email chưa đúng định dạng"
    /&gt;
  );
}</code></pre><p>Chạy đúng như đề (useEffect). Dự án thật nên tính <code>isValid</code> ngay lúc vẽ — khỏi state phụ, khỏi vẽ lại thừa. Đừng viết <code>useEffect(async () =&gt; …)</code>: đặt hàm async bên trong effect.</p>`,
  ),
};

const EX14 = {
  title: 'Exercise 14 — useContext (theme)|||Exercise 14 — useContext (theme)',
  slug: 'fer202-8-ex14-usecontext',
  type: 'EXERCISE',
  description: 'Tạo ThemeContext sáng/tối, provider bọc app, và component đọc theme bằng useContext + nút đổi theme.',
  content: bi(
    `<span class="eyebrow">Chapter 8 · Exercise 14 · Slot 9–10 slide 37</span>
<h2>useContext — a light/dark theme</h2>
<pre><code class="language-javascript"><span class="hljs-keyword">const</span> themes = {
  <span class="hljs-attr">light</span>: { <span class="hljs-attr">foreground</span>: <span class="hljs-string">&#x27;#000000&#x27;</span>, <span class="hljs-attr">background</span>: <span class="hljs-string">&#x27;#eeeeee&#x27;</span> },
  <span class="hljs-attr">dark</span>:  { <span class="hljs-attr">foreground</span>: <span class="hljs-string">&#x27;#ffffff&#x27;</span>, <span class="hljs-attr">background</span>: <span class="hljs-string">&#x27;#61dafb&#x27;</span> },
};
<span class="hljs-keyword">const</span> <span class="hljs-title class_">ThemeContext</span> = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">createContext</span>(themes.<span class="hljs-property">light</span>);

<span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [dark, setDark] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ThemeContext.Provider</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{dark</span> ? <span class="hljs-attr">themes.dark</span> <span class="hljs-attr">:</span> <span class="hljs-attr">themes.light</span>}&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setDark(d =&gt; !d)}&gt;Toggle theme<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Toolbar</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">ThemeContext.Provider</span>&gt;</span></span>
  );
}

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Toolbar</span>(<span class="hljs-params"></span>) {           <span class="hljs-comment">// no props drilled through here</span>
  <span class="hljs-keyword">const</span> theme = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">ThemeContext</span>);
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{{</span> <span class="hljs-attr">color:</span> <span class="hljs-attr">theme.foreground</span>, <span class="hljs-attr">background:</span> <span class="hljs-attr">theme.background</span> }}&gt;</span>Hello<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>;
}</code></pre>
<div class="out"><b>Result:</b> <code>Toolbar</code> reads the theme straight from context — no props passed through intermediate components. Toggling at the top updates every consumer.</div><h3>The full handout: ThemeProvider + useTheme, and the shopping cart</h3><p>The handout wants a ThemeProvider that owns the state and a toggle function, a <code>useTheme</code> hook, and a second exercise: a cart shared by <code>DishesList</code> and <code>Cart</code>. Both run as shown.</p><h4>1) Theme with ThemeProvider and useTheme</h4><pre><code class="language-javascript">import { createContext, useContext, useState } from 'react';

const themes = {
  light: { foreground: '#000000', background: '#eeeeee' },
  dark: { foreground: '#ffffff', background: '#61dafb' },
};

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [name, setName] = useState('light');
  const toggle = () =&gt;
    setName((n) =&gt; (n === 'light' ? 'dark' : 'light'));
  return (
    &lt;ThemeContext.Provider
      value={{ name, theme: themes[name], toggle }}
    &gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error('useTheme phải dùng bên trong ThemeProvider');
  return ctx;
}

function Theme() {
  const { name, theme, toggle } = useTheme();
  return (
    &lt;div
      style={{
        background: theme.background,
        color: theme.foreground,
        padding: 16,
      }}
    &gt;
      &lt;p&gt;Theme hiện tại: {name}&lt;/p&gt;
      &lt;button
        onClick={toggle}
        style={{
          background: theme.foreground,
          color: theme.background,
        }}
      &gt;
        Đổi theme
      &lt;/button&gt;
    &lt;/div&gt;
  );
}

export default function App() {
  return (
    &lt;ThemeProvider&gt;
      &lt;Theme /&gt;
    &lt;/ThemeProvider&gt;
  );
}</code></pre><p>The hook throws a clear error when used outside the provider.</p><h4>2–3) Cart with CartContext (dishes list, remove, total, clear)</h4><pre><code class="language-javascript">import { createContext, useContext, useState } from 'react';

const dishes = [
  { id: 0, name: 'Uthappizza', price: '4.99' },
  { id: 1, name: 'Zucchipakoda', price: '1.99' },
  { id: 2, name: 'Vadonut', price: '1.99' },
  { id: 3, name: 'ElaiCheese Cake', price: '2.99' },
];

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (dish) =&gt; setCartItems((items) =&gt; [...items, dish]);
  const removeFromCart = (index) =&gt;
    setCartItems((items) =&gt; items.filter((_, i) =&gt; i !== index));
  const clearCart = () =&gt; setCartItems([]);
  const total = cartItems.reduce((sum, d) =&gt; sum + Number(d.price), 0);
  return (
    &lt;CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, total }}
    &gt;
      {children}
    &lt;/CartContext.Provider&gt;
  );
}

const useCart = () =&gt; useContext(CartContext);

function DishesList() {
  const { addToCart, cartItems } = useCart();
  return (
    &lt;div&gt;
      &lt;h3&gt;Dishes ({cartItems.length} trong giỏ)&lt;/h3&gt;
      {dishes.map((d) =&gt; (
        &lt;p key={d.id}&gt;
          {d.name} - \${d.price}{' '}
          &lt;button onClick={() =&gt; addToCart(d)}&gt;Add to Cart&lt;/button&gt;
        &lt;/p&gt;
      ))}
    &lt;/div&gt;
  );
}

function Cart() {
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  return (
    &lt;div&gt;
      &lt;h3&gt;
        Cart: {cartItems.length} món - Tổng \${total.toFixed(2)}
      &lt;/h3&gt;
      {cartItems.map((d, i) =&gt; (
        &lt;p key={i}&gt;
          {d.name}{' '}
          &lt;button onClick={() =&gt; removeFromCart(i)}&gt;Remove&lt;/button&gt;
        &lt;/p&gt;
      ))}
      &lt;button onClick={clearCart}&gt;Clear Cart&lt;/button&gt;
    &lt;/div&gt;
  );
}

export default function App() {
  return (
    &lt;CartProvider&gt;
      &lt;DishesList /&gt;
      &lt;Cart /&gt;
    &lt;/CartProvider&gt;
  );
}</code></pre><p>The data gives <code>price</code> as a <em>string</em>: without <code>Number(...)</code> the total becomes the text "04.991.99". The total is computed while rendering, so count and value update live.</p>`,
    `<span class="eyebrow">Chương 8 · Exercise 14 · Slot 9–10 slide 37</span>
<h2>useContext — theme sáng/tối</h2>
<pre><code class="language-javascript"><span class="hljs-keyword">const</span> themes = {
  <span class="hljs-attr">light</span>: { <span class="hljs-attr">foreground</span>: <span class="hljs-string">&#x27;#000000&#x27;</span>, <span class="hljs-attr">background</span>: <span class="hljs-string">&#x27;#eeeeee&#x27;</span> },
  <span class="hljs-attr">dark</span>:  { <span class="hljs-attr">foreground</span>: <span class="hljs-string">&#x27;#ffffff&#x27;</span>, <span class="hljs-attr">background</span>: <span class="hljs-string">&#x27;#61dafb&#x27;</span> },
};
<span class="hljs-keyword">const</span> <span class="hljs-title class_">ThemeContext</span> = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">createContext</span>(themes.<span class="hljs-property">light</span>);

<span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [dark, setDark] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ThemeContext.Provider</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{dark</span> ? <span class="hljs-attr">themes.dark</span> <span class="hljs-attr">:</span> <span class="hljs-attr">themes.light</span>}&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setDark(d =&gt; !d)}&gt;Đổi theme<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Toolbar</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">ThemeContext.Provider</span>&gt;</span></span>
  );
}

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Toolbar</span>(<span class="hljs-params"></span>) {           <span class="hljs-comment">// không props nào bị khoan qua đây</span>
  <span class="hljs-keyword">const</span> theme = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">ThemeContext</span>);
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{{</span> <span class="hljs-attr">color:</span> <span class="hljs-attr">theme.foreground</span>, <span class="hljs-attr">background:</span> <span class="hljs-attr">theme.background</span> }}&gt;</span>Hello<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>;
}</code></pre>
<div class="out"><b>Kết quả:</b> <code>Toolbar</code> đọc theme thẳng từ context — không props nào truyền qua các component trung gian. Toggle ở trên cập nhật mọi consumer.</div><h3>Đủ đề trường: ThemeProvider + useTheme và giỏ hàng</h3><p>Đề cần một ThemeProvider giữ state và hàm toggle, hook <code>useTheme</code>, và bài hai: giỏ hàng dùng chung giữa <code>DishesList</code> và <code>Cart</code>. Cả hai chạy đúng như bên dưới.</p><h4>1) Theme với ThemeProvider và useTheme</h4><pre><code class="language-javascript">import { createContext, useContext, useState } from 'react';

const themes = {
  light: { foreground: '#000000', background: '#eeeeee' },
  dark: { foreground: '#ffffff', background: '#61dafb' },
};

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [name, setName] = useState('light');
  const toggle = () =&gt;
    setName((n) =&gt; (n === 'light' ? 'dark' : 'light'));
  return (
    &lt;ThemeContext.Provider
      value={{ name, theme: themes[name], toggle }}
    &gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error('useTheme phải dùng bên trong ThemeProvider');
  return ctx;
}

function Theme() {
  const { name, theme, toggle } = useTheme();
  return (
    &lt;div
      style={{
        background: theme.background,
        color: theme.foreground,
        padding: 16,
      }}
    &gt;
      &lt;p&gt;Theme hiện tại: {name}&lt;/p&gt;
      &lt;button
        onClick={toggle}
        style={{
          background: theme.foreground,
          color: theme.background,
        }}
      &gt;
        Đổi theme
      &lt;/button&gt;
    &lt;/div&gt;
  );
}

export default function App() {
  return (
    &lt;ThemeProvider&gt;
      &lt;Theme /&gt;
    &lt;/ThemeProvider&gt;
  );
}</code></pre><p>Hook ném lỗi rõ ràng khi dùng ngoài Provider.</p><h4>2–3) Giỏ hàng bằng CartContext (danh sách món, xoá, tổng, làm rỗng)</h4><pre><code class="language-javascript">import { createContext, useContext, useState } from 'react';

const dishes = [
  { id: 0, name: 'Uthappizza', price: '4.99' },
  { id: 1, name: 'Zucchipakoda', price: '1.99' },
  { id: 2, name: 'Vadonut', price: '1.99' },
  { id: 3, name: 'ElaiCheese Cake', price: '2.99' },
];

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (dish) =&gt; setCartItems((items) =&gt; [...items, dish]);
  const removeFromCart = (index) =&gt;
    setCartItems((items) =&gt; items.filter((_, i) =&gt; i !== index));
  const clearCart = () =&gt; setCartItems([]);
  const total = cartItems.reduce((sum, d) =&gt; sum + Number(d.price), 0);
  return (
    &lt;CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, total }}
    &gt;
      {children}
    &lt;/CartContext.Provider&gt;
  );
}

const useCart = () =&gt; useContext(CartContext);

function DishesList() {
  const { addToCart, cartItems } = useCart();
  return (
    &lt;div&gt;
      &lt;h3&gt;Dishes ({cartItems.length} trong giỏ)&lt;/h3&gt;
      {dishes.map((d) =&gt; (
        &lt;p key={d.id}&gt;
          {d.name} - \${d.price}{' '}
          &lt;button onClick={() =&gt; addToCart(d)}&gt;Add to Cart&lt;/button&gt;
        &lt;/p&gt;
      ))}
    &lt;/div&gt;
  );
}

function Cart() {
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  return (
    &lt;div&gt;
      &lt;h3&gt;
        Cart: {cartItems.length} món - Tổng \${total.toFixed(2)}
      &lt;/h3&gt;
      {cartItems.map((d, i) =&gt; (
        &lt;p key={i}&gt;
          {d.name}{' '}
          &lt;button onClick={() =&gt; removeFromCart(i)}&gt;Remove&lt;/button&gt;
        &lt;/p&gt;
      ))}
      &lt;button onClick={clearCart}&gt;Clear Cart&lt;/button&gt;
    &lt;/div&gt;
  );
}

export default function App() {
  return (
    &lt;CartProvider&gt;
      &lt;DishesList /&gt;
      &lt;Cart /&gt;
    &lt;/CartProvider&gt;
  );
}</code></pre><p>Dữ liệu cho <code>price</code> là <em>chuỗi</em>: không có <code>Number(...)</code> thì tổng thành chuỗi "04.991.99". Tổng tính ngay lúc vẽ nên số món và giá trị cập nhật tức thì.</p>`,
  ),
};

const EX15 = {
  title: 'Exercise 15 — useReducer (counter & question bank)|||Exercise 15 — useReducer (counter & ngân hàng câu hỏi)',
  slug: 'fer202-8-ex15-usereducer',
  type: 'EXERCISE',
  description: 'Quản lý state bằng useReducer: counter (INCREMENT/DECREMENT/RESET) và một Question Bank với reducer + dispatch.',
  content: bi(
    `<span class="eyebrow">Chapter 8 · Exercise 15 · Slot 9–10 slide 44</span>
<h2>useReducer — counter &amp; question bank</h2>
<pre><code class="language-javascript"><span class="hljs-keyword">function</span> <span class="hljs-title function_">counterReducer</span>(<span class="hljs-params">state, action</span>) {
  <span class="hljs-keyword">switch</span> (action.<span class="hljs-property">type</span>) {
    <span class="hljs-keyword">case</span> <span class="hljs-string">&#x27;INCREMENT&#x27;</span>: <span class="hljs-keyword">return</span> { <span class="hljs-attr">count</span>: state.<span class="hljs-property">count</span> + <span class="hljs-number">1</span> };
    <span class="hljs-keyword">case</span> <span class="hljs-string">&#x27;DECREMENT&#x27;</span>: <span class="hljs-keyword">return</span> { <span class="hljs-attr">count</span>: state.<span class="hljs-property">count</span> - <span class="hljs-number">1</span> };
    <span class="hljs-keyword">case</span> <span class="hljs-string">&#x27;RESET&#x27;</span>:     <span class="hljs-keyword">return</span> { <span class="hljs-attr">count</span>: <span class="hljs-number">0</span> };
    <span class="hljs-attr">default</span>:          <span class="hljs-keyword">return</span> state;
  }
}

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Counter</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [state, dispatch] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useReducer</span>(counterReducer, { <span class="hljs-attr">count</span>: <span class="hljs-number">0</span> });
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{state.count}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch({ type: &#x27;DECREMENT&#x27; })}&gt;-<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch({ type: &#x27;INCREMENT&#x27; })}&gt;+<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch({ type: &#x27;RESET&#x27; })}&gt;Reset<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</code></pre>
<p><b>Question Bank:</b> hold <code>{ questions, current, score }</code> in one <code>initialState</code>; a reducer handles <code>ANSWER</code>, <code>NEXT</code>, <code>RESTART</code>. All quiz logic lives in the pure reducer — the component just dispatches.</p>
<div class="callout"><span class="badge">★ Why a reducer here</span> A quiz has several related transitions on shared state (current question, score, finished). A reducer keeps them in one predictable, testable place — the same pattern you meet again as Redux in Chapter 12.</div>
<h3>Question Bank — the reducer cases the handout leaves empty</h3><p>The handout gives <code>initialState</code> and three empty cases. One filled-in version that runs: choosing an answer changes <code>selectedOption</code> and <code>score</code> together, and the guard line stops a second click from adding points again (without it, three clicks give "Score: 5 / 3").</p><h4>SELECT_OPTION · NEXT_QUESTION · RESTART_QUIZ</h4><pre><code class="language-javascript">import { useReducer } from 'react';

const initialState = {
  questions: [
    {
      id: 1,
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'],
      answer: 'Canberra',
    },
    {
      id: 2,
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Mars',
    },
    {
      id: 3,
      question: 'Which language runs in every web browser?',
      options: ['Java', 'C', 'Python', 'JavaScript'],
      answer: 'JavaScript',
    },
  ],
  currentQuestion: 0,
  selectedOption: '',
  score: 0,
  showScore: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_OPTION': {
      // đã chọn rồi thì thôi
      if (state.selectedOption) return state;
      const correct =
        state.questions[state.currentQuestion].answer ===
        action.payload;
      return {
        ...state,
        selectedOption: action.payload,
        score: correct ? state.score + 1 : state.score,
      };
    }
    case 'NEXT_QUESTION': {
      const last = state.currentQuestion === state.questions.length - 1;
      return last
        ? { ...state, showScore: true }
        : {
            ...state,
            currentQuestion: state.currentQuestion + 1,
            selectedOption: '',
          };
    }
    case 'RESTART_QUIZ':
      return initialState;
    default:
      return state;
  }
}

export default function QuestionBank() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const q = state.questions[state.currentQuestion];

  if (state.showScore) {
    return (
      &lt;div&gt;
        &lt;h3&gt;
          Điểm: {state.score} / {state.questions.length}
        &lt;/h3&gt;
        &lt;button onClick={() =&gt; dispatch({ type: 'RESTART_QUIZ' })}&gt;
          Làm lại
        &lt;/button&gt;
      &lt;/div&gt;
    );
  }

  return (
    &lt;div&gt;
      &lt;p&gt;
        Câu {state.currentQuestion + 1} / {state.questions.length}
      &lt;/p&gt;
      &lt;h3&gt;{q.question}&lt;/h3&gt;
      {q.options.map((opt) =&gt; (
        &lt;div key={opt}&gt;
          &lt;button
            onClick={() =&gt;
              dispatch({ type: 'SELECT_OPTION', payload: opt })
            }
          &gt;
            {opt}
          &lt;/button&gt;
          {state.selectedOption === opt &amp;&amp;
            (opt === q.answer ? ' ✅ đúng' : ' ❌ sai')}
        &lt;/div&gt;
      ))}
      {state.selectedOption &amp;&amp; state.selectedOption !== q.answer &amp;&amp; (
        &lt;p&gt;Đáp án đúng: {q.answer}&lt;/p&gt;
      )}
      {state.selectedOption &amp;&amp; (
        &lt;button onClick={() =&gt; dispatch({ type: 'NEXT_QUESTION' })}&gt;
          Câu tiếp
        &lt;/button&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre><p>Always return a <em>new</em> object and keep a <code>default</code>. The counter variant that mutates state and returns it logs the new number but the screen stays at 0.</p><div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Build the reducer</span><span class="lc-sub">Counter &amp; quiz — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 8 · Exercise 15 · Slot 9–10 slide 44</span>
<h2>useReducer — counter &amp; ngân hàng câu hỏi</h2>
<pre><code class="language-javascript"><span class="hljs-keyword">function</span> <span class="hljs-title function_">counterReducer</span>(<span class="hljs-params">state, action</span>) {
  <span class="hljs-keyword">switch</span> (action.<span class="hljs-property">type</span>) {
    <span class="hljs-keyword">case</span> <span class="hljs-string">&#x27;INCREMENT&#x27;</span>: <span class="hljs-keyword">return</span> { <span class="hljs-attr">count</span>: state.<span class="hljs-property">count</span> + <span class="hljs-number">1</span> };
    <span class="hljs-keyword">case</span> <span class="hljs-string">&#x27;DECREMENT&#x27;</span>: <span class="hljs-keyword">return</span> { <span class="hljs-attr">count</span>: state.<span class="hljs-property">count</span> - <span class="hljs-number">1</span> };
    <span class="hljs-keyword">case</span> <span class="hljs-string">&#x27;RESET&#x27;</span>:     <span class="hljs-keyword">return</span> { <span class="hljs-attr">count</span>: <span class="hljs-number">0</span> };
    <span class="hljs-attr">default</span>:          <span class="hljs-keyword">return</span> state;
  }
}

<span class="hljs-keyword">function</span> <span class="hljs-title function_">Counter</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [state, dispatch] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useReducer</span>(counterReducer, { <span class="hljs-attr">count</span>: <span class="hljs-number">0</span> });
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{state.count}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch({ type: &#x27;DECREMENT&#x27; })}&gt;-<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch({ type: &#x27;INCREMENT&#x27; })}&gt;+<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> dispatch({ type: &#x27;RESET&#x27; })}&gt;Reset<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</code></pre>
<p><b>Ngân hàng câu hỏi:</b> giữ <code>{ questions, current, score }</code> trong một <code>initialState</code>; một reducer xử lý <code>ANSWER</code>, <code>NEXT</code>, <code>RESTART</code>. Mọi logic quiz nằm trong reducer thuần — component chỉ dispatch.</p>
<div class="callout"><span class="badge">★ Vì sao dùng reducer ở đây</span> Một quiz có nhiều chuyển trạng thái liên quan trên state dùng chung (câu hiện tại, điểm, kết thúc). Reducer giữ chúng ở một chỗ dễ đoán, dễ test — đúng mẫu bạn gặp lại ở Redux (Chương 12).</div>
<h3>Question Bank — các case reducer mà đề để trống</h3><p>Đề cho <code>initialState</code> và ba case để trống. Một bản điền đủ, chạy được: chọn đáp án đổi cùng lúc <code>selectedOption</code> và <code>score</code>, và dòng bảo vệ chặn lần bấm thứ hai cộng điểm nữa (bỏ dòng đó, bấm ba lần ra "Điểm: 5 / 3").</p><h4>SELECT_OPTION · NEXT_QUESTION · RESTART_QUIZ</h4><pre><code class="language-javascript">import { useReducer } from 'react';

const initialState = {
  questions: [
    {
      id: 1,
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'],
      answer: 'Canberra',
    },
    {
      id: 2,
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Mars',
    },
    {
      id: 3,
      question: 'Which language runs in every web browser?',
      options: ['Java', 'C', 'Python', 'JavaScript'],
      answer: 'JavaScript',
    },
  ],
  currentQuestion: 0,
  selectedOption: '',
  score: 0,
  showScore: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_OPTION': {
      // đã chọn rồi thì thôi
      if (state.selectedOption) return state;
      const correct =
        state.questions[state.currentQuestion].answer ===
        action.payload;
      return {
        ...state,
        selectedOption: action.payload,
        score: correct ? state.score + 1 : state.score,
      };
    }
    case 'NEXT_QUESTION': {
      const last = state.currentQuestion === state.questions.length - 1;
      return last
        ? { ...state, showScore: true }
        : {
            ...state,
            currentQuestion: state.currentQuestion + 1,
            selectedOption: '',
          };
    }
    case 'RESTART_QUIZ':
      return initialState;
    default:
      return state;
  }
}

export default function QuestionBank() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const q = state.questions[state.currentQuestion];

  if (state.showScore) {
    return (
      &lt;div&gt;
        &lt;h3&gt;
          Điểm: {state.score} / {state.questions.length}
        &lt;/h3&gt;
        &lt;button onClick={() =&gt; dispatch({ type: 'RESTART_QUIZ' })}&gt;
          Làm lại
        &lt;/button&gt;
      &lt;/div&gt;
    );
  }

  return (
    &lt;div&gt;
      &lt;p&gt;
        Câu {state.currentQuestion + 1} / {state.questions.length}
      &lt;/p&gt;
      &lt;h3&gt;{q.question}&lt;/h3&gt;
      {q.options.map((opt) =&gt; (
        &lt;div key={opt}&gt;
          &lt;button
            onClick={() =&gt;
              dispatch({ type: 'SELECT_OPTION', payload: opt })
            }
          &gt;
            {opt}
          &lt;/button&gt;
          {state.selectedOption === opt &amp;&amp;
            (opt === q.answer ? ' ✅ đúng' : ' ❌ sai')}
        &lt;/div&gt;
      ))}
      {state.selectedOption &amp;&amp; state.selectedOption !== q.answer &amp;&amp; (
        &lt;p&gt;Đáp án đúng: {q.answer}&lt;/p&gt;
      )}
      {state.selectedOption &amp;&amp; (
        &lt;button onClick={() =&gt; dispatch({ type: 'NEXT_QUESTION' })}&gt;
          Câu tiếp
        &lt;/button&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre><p>Luôn trả về object <em>mới</em> và giữ nhánh <code>default</code>. Bản bộ đếm sửa thẳng state rồi trả về chính nó thì Console in số mới nhưng màn hình vẫn là 0.</p><div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Dựng reducer</span><span class="lc-sub">Counter &amp; quiz — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [SLIDES, EX12, EX13, EX14, EX15];
