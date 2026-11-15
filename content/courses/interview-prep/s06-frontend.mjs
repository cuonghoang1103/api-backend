/**
 * IT Interview Prep — Chương 6: Vòng kỹ thuật frontend (soạn 15/11/2026).
 * Khoá chữ (không slide ảnh), khuôn Mục 0 + helper ./_pv.mjs. GIỮ slug bài của khung cũ (pv-6-1 … pv-6-4).
 * LUẬT: backtick → &#96;; không viết "${" trong chữ hay code mẫu; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 * Code mẫu đặt trong hằng template riêng, dòng đóng đứng một mình, đưa qua ma() (tự thoát < > &).
 */
import { ma, ra, lienKet, nguon, yt, flow, stack, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ 6.1 — React ═══════════════════════ */
const MA_KEY = `
// Bug seen in a real notes app: the read-only editor kept showing note 1
// after the user clicked note 2, because the editor only reads content on mount.
function SharedNoteViewer({ note }) {
  const editor = useEditor({ content: note.body, editable: false });
  return <EditorContent editor={editor} />;
}

// Fix: give it a key, so React unmounts the old viewer and mounts a new one.
<SharedNoteViewer key={note.id} note={note} />
`;

const MA_RACE = `
function UserCard({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const ctrl = new AbortController();          // 1. one controller per run
    fetch('/api/users/' + userId, { signal: ctrl.signal })
      .then((r) => r.json())
      .then(setUser)
      .catch((e) => { if (e.name !== 'AbortError') throw e; });
    return () => ctrl.abort();                   // 2. cleanup cancels the old request
  }, [userId]);                                  // 3. re-run only when userId changes
  return user ? <p>{user.name}</p> : <p>Loading…</p>;
}
`;

const L61 = {
  title: '6.1 — React questions: state, render, effects, keys — and the bugs behind them|||6.1 — Câu hỏi React: state, render, effect, key — và những lỗi thật phía sau',
  slug: 'pv-6-1-react',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mười câu React hay gặp nhất ở vòng thực tập/fresher (re-render, state là ảnh chụp, key, useEffect và cleanup, effect không cần thiết, controlled input, nơi đặt state, memo, stale closure, cuộc đua fetch) — mỗi câu có câu trả lời mẫu, câu đào sâu và lỗi trả lời hay gặp, kèm một lỗi thật của dự án web cá nhân.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>React questions: what interviewers ask, and the bugs that make the questions real</h2>
<p class="lead">Nearly every frontend or fullstack internship interview has a React block. The questions are surprisingly stable: how rendering works, what state is, what <code>useEffect</code> really does, why lists need keys. Interviewers do not want definitions recited; they want to hear that you have met the bug behind each concept. This lesson gives you ten questions, a sample answer for each (hidden — answer out loud first), the follow-ups that come next, and the weak answers that cost points.</p>

<h3>An everyday picture: a whiteboard menu in a café</h3>
${doiThuong('en', 'A café writes today’s menu on a whiteboard. When a dish sells out, the staff do not repaint the whole board — they look at what changed and wipe and rewrite one line. React is that staff member: your component describes what the board should say for the current data (state and props); React compares it with what is on the board now and changes only the lines that differ. Every React interview question is some version of "when does the staff look again, and what do they compare?"')}

<h3>The mental model in four steps</h3>
${flow([
  ['1 · Trigger', 'state or props change', 'Calling a setter (setCount) or a parent passing new props schedules a render. Changing a normal variable does nothing.'],
  ['2 · Render', 'React calls your function', 'The component runs top to bottom and returns JSX — a description, not the screen. It must be pure: same inputs, same output, no side effects.'],
  ['3 · Commit', 'React updates the DOM', 'It compares the new description with the previous one (reconciliation) and applies only the differences.'],
  ['4 · Effects', 'after the screen updates', 'useEffect callbacks run after commit — the place to talk to the outside world (fetch, subscriptions, timers).'],
])}

<h3>Ten questions</h3>
${qa('en', { so: '6.1-1', q: 'What happens when you call setState? Does the value change immediately?', chu: 'whether you understand that state is a snapshot per render.',
  a: '<p>No. Calling <code>setCount(count + 1)</code> does not change <code>count</code> in the current render — it asks React to render again with a new value. Inside the current function call, <code>count</code> is a constant, a snapshot of that render. React also <strong>batches</strong> several updates in the same event into one render. If the new value depends on the old one, use the updater form <code>setCount(c =&gt; c + 1)</code>; calling <code>setCount(count + 1)</code> three times in one click only adds one.</p>',
  sau: ['What does console.log(count) print right after setCount?', 'Why does the updater form fix the triple-increment case?', 'What is automatic batching in React 18+?'],
  loi: '"setState is asynchronous." Half true and it hides the real idea — the value is fixed for that render.' })}
${qa('en', { so: '6.1-2', q: 'Why does React need a key on list items, and what is wrong with key={index}?', chu: 'identity of components between renders.',
  a: '<p>The key tells React which item is which between renders, so it can keep the right component (and its state) attached to the right data. With <code>key={index}</code>, inserting or deleting at the top shifts every index: React thinks item 0 is still the same component, so typed input, checkbox state or focus jumps to the wrong row. Use a stable id from the data. Index is acceptable only for a static list that never reorders.</p>',
  sau: ['What happens to the state of a component when its key changes?', 'Can you use a key on purpose to reset a form?'],
  loi: '"Keys make rendering faster." Speed is a side effect; correctness is the point.' })}
${qa('en', { so: '6.1-3', q: 'Explain useEffect: when does it run, what are dependencies, what is cleanup?', chu: 'the timing model and resource leaks.',
  a: '<p>The callback runs <strong>after</strong> the component commits to the screen. With no dependency array it runs after every render; with <code>[]</code> once after mount; with <code>[userId]</code> after mount and whenever <code>userId</code> changes. The function you return is the <strong>cleanup</strong>: React calls it before running the effect again and when the component unmounts — this is where you clear timers, unsubscribe and abort requests. In development with StrictMode React deliberately mounts, cleans up and mounts again once, to expose effects that lack a correct cleanup.</p>',
  sau: ['Why does my effect run twice in development?', 'What happens if you forget a dependency?', 'useEffect vs useLayoutEffect?'],
  loi: 'Describing it as "componentDidMount". It is a synchronisation with external systems, and that framing explains dependencies.' })}
${qa('en', { so: '6.1-4', q: 'When should you NOT use useEffect?', chu: 'whether you write derived state or real side effects.',
  a: '<p>When the value can be <strong>computed during render</strong>. A classic mistake: keeping <code>fullName</code> in state and syncing it with an effect from <code>firstName</code> and <code>lastName</code>. That causes an extra render and can be stale for one frame. Just compute <code>const fullName = first + " " + last</code>. Also do not use an effect to respond to a user event — put the logic in the event handler. Effects are for synchronising with something outside React: the network, the DOM API, a WebSocket, a timer.</p>',
  sau: ['How would you filter a list based on a search box without an effect?', 'When is useMemo appropriate instead?'],
  loi: 'Answering "never use effects" — fetching and subscriptions still need them (or a library that wraps them).' })}
${qa('en', { so: '6.1-5', q: 'Controlled vs uncontrolled inputs — which do you use and why?', chu: 'forms, the most common real UI task.',
  a: '<p>A <strong>controlled</strong> input takes its value from state (<code>value</code> + <code>onChange</code>) — React is the single source of truth, so validation, formatting and conditional UI are easy. An <strong>uncontrolled</strong> input keeps its own value in the DOM and you read it with a ref or from the form on submit — less re-rendering, good for large forms. Libraries like React Hook Form use uncontrolled inputs for performance and still give you validation (often with a Zod schema shared with the backend).</p>',
  sau: ['Why does Vietnamese typing (IME) sometimes break a controlled input that transforms text on every keystroke?', 'How do you reset an uncontrolled form?'],
  loi: 'Saying one is always better. The trade-off is the answer.' })}
${qa('en', { so: '6.1-6', q: 'Where should state live? Props drilling, Context, or a global store?', chu: 'architecture judgement at a junior level.',
  a: '<p>Keep state as close as possible to where it is used. When two siblings need it, <strong>lift it up</strong> to their common parent. If many distant components need the same rarely-changing value (theme, current user, language), use <strong>Context</strong>. For frequently-changing app-wide client state, a small store (Zustand, Redux Toolkit) avoids re-render storms. And separate <strong>server state</strong> (data from the API) — that belongs in a fetching cache such as TanStack Query, not in a global store you update by hand. Filters that should survive a refresh belong in the URL.</p>',
  sau: ['Why does putting a frequently changing value in Context re-render everything below?', 'What is the difference between client state and server state?'],
  loi: '"I use Redux for everything." It sounds like a tutorial habit, not a decision.' })}
${qa('en', { so: '6.1-7', q: 'What do React.memo, useMemo and useCallback do, and when do you use them?', chu: 'whether you optimise by measurement.',
  a: '<p><code>React.memo</code> skips re-rendering a component when its props are shallowly equal. <code>useMemo</code> caches a computed value between renders; <code>useCallback</code> caches a function so its identity stays the same — useful mainly when it is passed to a memoised child or used as an effect dependency. I use them <strong>after measuring</strong> with the React Profiler shows a slow render, not by default: they cost memory and make the code harder to read, and newer tooling (the React Compiler) can add memoisation automatically.</p>',
  sau: ['Why would React.memo not help if the parent passes a new object literal every render?', 'How do you find what is slow?'],
  loi: 'Wrapping everything in useMemo "for performance" without a measurement.' })}
${qa('en', { so: '6.1-8', q: 'What is a stale closure? Give an example.', chu: 'closures — JavaScript fundamentals inside React.',
  a: '<p>A function captures the variables of the render in which it was created. If a <code>setInterval</code> is created once in an effect with <code>[]</code> and logs <code>count</code>, it will log the initial value forever, because it closed over the first render’s snapshot. Fixes: include <code>count</code> in the dependencies (and clean up the interval), use the updater form <code>setCount(c =&gt; c + 1)</code>, or keep the latest value in a <code>useRef</code>.</p>',
  sau: ['Why does the ESLint rule react-hooks/exhaustive-deps exist?', 'When is a ref the right fix?'],
  loi: 'Not being able to connect it to closures in plain JavaScript.' })}
${qa('en', { so: '6.1-9', q: 'You open note 1, then click note 2, but the viewer still shows note 1. Why, and how do you fix it?', chu: 'debugging a real bug with the identity model.',
  a: '<p>This happened in a real personal web platform. The read-only rich-text viewer (TipTap) reads its <code>content</code> only when the editor is created — on mount. Switching notes passed new props to the <em>same</em> component instance, so the editor never reloaded. The fix is one attribute: <code>key={note.id}</code>, which makes React treat each note as a new component, unmount the old editor and mount a fresh one.</p>' + ma('jsx', MA_KEY),
  sau: ['What else could you do instead of a key? (call editor.commands.setContent in an effect)', 'What does the key cost?'],
  loi: 'Guessing "a caching problem" without reasoning about component identity.' })}
${qa('en', { so: '6.1-10', q: 'A user switches quickly between profiles and sometimes sees the wrong user. What is happening?', chu: 'race conditions in data fetching.',
  a: '<p>Two requests are in flight; the older one finishes last and overwrites the newer result. Fix: cancel or ignore the stale request in the effect cleanup with an <code>AbortController</code> (or a flag), or use a data-fetching library such as TanStack Query that keys results by query and handles this for you.</p>' + ma('jsx', MA_RACE),
  sau: ['How would TanStack Query avoid this?', 'What are staleTime and gcTime?'],
  loi: '"Add a loading spinner." It hides the symptom; the wrong data still arrives.' })}

${bay('en', 'reciting definitions from the docs.', 'Interviewers have heard "React is a library for building user interfaces with a virtual DOM" hundreds of times. They remember the candidate who says "I hit this: my note viewer kept the old note until I added a key". Attach a real bug or a small experiment to every concept you claim.')}
${keXau('en', 'React escapes text you render with <code>{value}</code>, which blocks most cross-site scripting (XSS). The hole is <code>dangerouslySetInnerHTML</code>: rendering user-written HTML (a comment, a rich-text note) without sanitising it lets an attacker run script in other users’ browsers and steal their session. If you must render HTML, sanitise it first (for example with DOMPurify) — and say so in the interview, it is a strong signal.')}
${neu('en', 'the interviewer asks about class components, which you never learnt? Say so honestly, then map what you know: "lifecycle methods like componentDidMount became effects; this.state became useState". Many Vietnamese codebases still contain class components, so it is worth reading one example before the interview.')}

${thucHanh('en', { phut: '30–40', steps: [
  'Answer the ten questions out loud, recording yourself on your phone, before opening any sample answer. Mark the ones where you paused more than five seconds.',
  'Reproduce bug 6.1-2 in a tiny Vite app: a list with key={index}, an input in each row, a button that adds an item at the top. Watch the typed text jump rows, then fix it with a stable id.',
  'Reproduce bug 6.1-10: fetch from a fake API with a random delay and switch quickly; then add the AbortController cleanup.',
], dat: 'you can answer all ten without notes in under two minutes each, and you have two small repositories that show the bugs and the fixes.' })}
${thuatNgu('en', [
  ['Render', 'React calling your component function to get a description of the UI.'],
  ['Commit', 'React applying the differences to the real DOM.'],
  ['Reconciliation', 'Comparing the new description with the previous one to find what changed.'],
  ['Snapshot (state)', 'The fixed value of state during one render.'],
  ['Cleanup', 'The function returned from an effect; it undoes what the effect did.'],
  ['Stale closure', 'A function still using variables from an old render.'],
  ['Server state', 'Data owned by the server and cached on the client (TanStack Query).'],
])}
${tomTat('en', [
  'Rendering is trigger → render (pure) → commit → effects; most questions are about this order.',
  'State is a snapshot per render; use the updater form when the next value depends on the previous one.',
  'Keys are identity: stable ids keep state on the right row, and changing a key remounts a component.',
  'Effects synchronise with the outside world; derived values are computed during render.',
  'Optimise with memo only after measuring; separate server state from client state.',
  'Attach a real bug to each concept — it is what interviewers remember.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'react', bai: 'rx-2-1-use-state', L: 'en', title: 'React 2.1 — useState and re-rendering', sub: 'Snapshots, updater functions and batching, measured.' }),
  lienKet({ khoa: 'react', bai: 'rx-4-1-use-effect', L: 'en', title: 'React 4.1 — useEffect, dependencies and cleanup', sub: 'When it runs and why StrictMode runs it twice.' }),
  lienKet({ khoa: 'react', bai: 'rx-9-4-phong-van', L: 'en', title: 'React 9.4 — 20 React interview questions', sub: 'The React course’s own question bank, deeper on testing.' }),
  lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-8-1-usestate-useeffect', academy: true, L: 'en', title: 'Academy · FER202 8.1 — useState and useEffect', sub: 'The school version of the same hooks — what FER202 exams expect.' }),
  yt('f3yRqkOFSCk', 'techsith', 'React Hooks Interview Questions and answers', 13, 'en'),
  nguon('📘', 'react.dev — You Might Not Need an Effect', 'The official guide to removing unnecessary effects.', 'https://react.dev/learn/you-might-not-need-an-effect'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Câu hỏi React: người phỏng vấn hỏi gì, và những lỗi thật làm câu hỏi có nghĩa</h2>
<p class="lead">Gần như mọi buổi phỏng vấn thực tập frontend hay fullstack đều có một đoạn React. Câu hỏi ổn định tới bất ngờ: render chạy thế nào, state là gì, <code>useEffect</code> thật ra làm gì, vì sao danh sách cần key. Người phỏng vấn không muốn nghe đọc định nghĩa; họ muốn nghe rằng bạn đã gặp cái lỗi nằm sau mỗi khái niệm. Bài này cho bạn mười câu hỏi, câu trả lời mẫu cho từng câu (giấu sẵn — tự nói thành tiếng trước), các câu đào sâu sẽ tới tiếp, và những kiểu trả lời yếu làm mất điểm.</p>

<h3>Liên tưởng đời thường: bảng thực đơn viết phấn ở quán cà phê</h3>
${doiThuong('vi', 'Một quán cà phê viết thực đơn hôm nay lên bảng trắng. Khi một món hết, nhân viên không sơn lại cả bảng — họ nhìn xem chỗ nào đổi rồi lau và viết lại đúng một dòng. React chính là nhân viên đó: component của bạn mô tả bảng NÊN ghi gì với dữ liệu hiện tại (state và props); React so với cái đang ghi trên bảng và chỉ sửa những dòng khác nhau. Mọi câu hỏi React khi phỏng vấn đều là một biến thể của "lúc nào nhân viên nhìn lại, và họ so cái gì với cái gì?"')}

<h3>Mô hình tư duy bốn bước</h3>
${flow([
  ['1 · Kích hoạt', 'state hoặc props đổi', 'Gọi hàm setter (setCount) hoặc component cha truyền props mới sẽ lên lịch một lần render. Đổi một biến thường thì không có gì xảy ra.'],
  ['2 · Render', 'React gọi hàm của bạn', 'Component chạy từ trên xuống và trả về JSX — một bản MÔ TẢ, chưa phải màn hình. Nó phải thuần (pure): cùng đầu vào, cùng đầu ra, không tác dụng phụ.'],
  ['3 · Commit (áp vào)', 'React cập nhật DOM', 'Nó so bản mô tả mới với bản trước (reconciliation — đối chiếu) và chỉ áp những chỗ khác nhau.'],
  ['4 · Effect', 'sau khi màn hình đã cập nhật', 'Hàm trong useEffect chạy sau commit — chỗ để nói chuyện với thế giới bên ngoài (gọi API, đăng ký sự kiện, hẹn giờ).'],
])}

<h3>Mười câu hỏi</h3>
${qa('vi', { so: '6.1-1', q: 'Khi gọi setState chuyện gì xảy ra? Giá trị có đổi ngay không?', chu: 'bạn có hiểu state là một ẢNH CHỤP theo từng lần render không.',
  a: '<p>Không. Gọi <code>setCount(count + 1)</code> không làm <code>count</code> đổi trong lần render hiện tại — nó nhờ React render lại với giá trị mới. Bên trong lần gọi hàm hiện tại, <code>count</code> là một hằng, ảnh chụp của lần render đó. React còn <strong>gom (batch)</strong> nhiều lần cập nhật trong cùng một sự kiện thành một lần render. Nếu giá trị mới phụ thuộc giá trị cũ, dùng dạng hàm cập nhật <code>setCount(c =&gt; c + 1)</code>; gọi <code>setCount(count + 1)</code> ba lần trong một cú bấm chỉ cộng được một.</p>',
  sau: ['console.log(count) ngay sau setCount in ra gì?', 'Vì sao dạng hàm cập nhật sửa được trường hợp cộng ba lần?', 'Automatic batching (gom tự động) trong React 18 trở đi là gì?'],
  loi: '"setState là bất đồng bộ." Đúng một nửa và che mất ý chính — giá trị bị cố định cho lần render đó.' })}
${qa('vi', { so: '6.1-2', q: 'Vì sao React cần key cho phần tử danh sách, và key={index} sai ở đâu?', chu: 'danh tính (identity) của component giữa các lần render.',
  a: '<p>Key cho React biết phần tử nào là phần tử nào giữa các lần render, để nó giữ đúng component (và state của component đó) gắn với đúng dữ liệu. Với <code>key={index}</code>, chèn hoặc xoá ở đầu danh sách làm mọi chỉ số dịch đi: React tưởng phần tử 0 vẫn là component cũ, nên chữ đã gõ, ô tích hay con trỏ nhảy sang nhầm dòng. Hãy dùng id ổn định từ dữ liệu. Index chỉ chấp nhận được với danh sách tĩnh, không bao giờ đổi thứ tự.</p>',
  sau: ['State của một component ra sao khi key của nó đổi?', 'Có thể cố tình dùng key để reset một form không?'],
  loi: '"Key giúp render nhanh hơn." Nhanh chỉ là phụ; đúng mới là chính.' })}
${qa('vi', { so: '6.1-3', q: 'Giải thích useEffect: chạy lúc nào, dependency là gì, cleanup là gì?', chu: 'mô hình thời điểm và rò rỉ tài nguyên.',
  a: '<p>Hàm callback chạy <strong>sau khi</strong> component đã commit lên màn hình. Không có mảng dependency (phụ thuộc) thì chạy sau mọi lần render; <code>[]</code> thì một lần sau khi mount (gắn vào); <code>[userId]</code> thì sau khi mount và mỗi khi <code>userId</code> đổi. Hàm bạn return là <strong>cleanup</strong> (dọn dẹp): React gọi nó trước khi chạy effect lần nữa và khi component unmount (gỡ ra) — đây là chỗ xoá timer, huỷ đăng ký, huỷ request. Ở môi trường dev có StrictMode, React cố tình mount, cleanup rồi mount lại một lần để lộ ra những effect thiếu cleanup đúng.</p>',
  sau: ['Vì sao effect của em chạy hai lần ở dev?', 'Quên một dependency thì sao?', 'useEffect khác useLayoutEffect thế nào?'],
  loi: 'Mô tả nó là "componentDidMount". Nó là việc ĐỒNG BỘ với hệ thống bên ngoài, và cách nhìn đó giải thích được dependency.' })}
${qa('vi', { so: '6.1-4', q: 'Khi nào KHÔNG nên dùng useEffect?', chu: 'bạn viết state dẫn xuất hay tác dụng phụ thật.',
  a: '<p>Khi giá trị <strong>tính được ngay trong lúc render</strong>. Lỗi kinh điển: giữ <code>fullName</code> trong state rồi đồng bộ nó bằng một effect từ <code>firstName</code> và <code>lastName</code>. Làm vậy tốn thêm một lần render và có thể cũ đi một khung hình. Chỉ cần tính <code>const fullName = first + " " + last</code>. Cũng đừng dùng effect để phản ứng với một sự kiện người dùng — đặt logic vào hàm xử lý sự kiện. Effect dành cho việc đồng bộ với thứ nằm ngoài React: mạng, API của DOM, WebSocket, timer.</p>',
  sau: ['Em lọc một danh sách theo ô tìm kiếm thế nào mà không cần effect?', 'Khi nào useMemo hợp hơn?'],
  loi: 'Trả lời "không bao giờ dùng effect" — gọi API và đăng ký sự kiện vẫn cần nó (hoặc một thư viện bọc nó).' })}
${qa('vi', { so: '6.1-5', q: 'Input controlled và uncontrolled — em dùng loại nào và vì sao?', chu: 'form — việc giao diện thật hay gặp nhất.',
  a: '<p>Input <strong>controlled</strong> (có kiểm soát) lấy giá trị từ state (<code>value</code> + <code>onChange</code>) — React là nguồn sự thật duy nhất, nên kiểm hợp lệ, định dạng và hiện giao diện theo điều kiện đều dễ. Input <strong>uncontrolled</strong> tự giữ giá trị trong DOM và bạn đọc nó bằng ref hoặc từ form khi submit — ít render lại hơn, hợp với form lớn. Thư viện như React Hook Form dùng input uncontrolled cho nhanh mà vẫn kiểm hợp lệ được (thường bằng một schema Zod dùng chung với backend).</p>',
  sau: ['Vì sao gõ tiếng Việt (bộ gõ IME) đôi khi làm hỏng một input controlled biến đổi chữ ở mỗi phím?', 'Reset một form uncontrolled thế nào?'],
  loi: 'Nói một loại luôn tốt hơn. Câu trả lời đúng là sự đánh đổi.' })}
${qa('vi', { so: '6.1-6', q: 'State nên đặt ở đâu? Truyền props, Context hay store toàn cục?', chu: 'óc phán đoán kiến trúc ở mức junior.',
  a: '<p>Giữ state càng gần nơi dùng càng tốt. Khi hai component anh em cùng cần, <strong>đưa lên (lift up)</strong> component cha chung. Nếu nhiều component xa nhau cần cùng một giá trị ít đổi (theme, người dùng hiện tại, ngôn ngữ), dùng <strong>Context</strong>. Với state phía client đổi thường xuyên và dùng khắp app, một store nhỏ (Zustand, Redux Toolkit) tránh được bão render lại. Và tách <strong>server state</strong> (dữ liệu từ API) riêng — chỗ của nó là bộ đệm gọi dữ liệu như TanStack Query, không phải một store toàn cục bạn tự cập nhật tay. Bộ lọc cần sống sót qua F5 thì đặt trên URL.</p>',
  sau: ['Vì sao đặt một giá trị đổi liên tục vào Context làm render lại mọi thứ bên dưới?', 'Client state khác server state thế nào?'],
  loi: '"Em dùng Redux cho mọi thứ." Nghe như thói quen từ tutorial, không phải một quyết định.' })}
${qa('vi', { so: '6.1-7', q: 'React.memo, useMemo và useCallback làm gì, khi nào dùng?', chu: 'bạn tối ưu dựa trên đo đạc hay theo cảm tính.',
  a: '<p><code>React.memo</code> bỏ qua việc render lại một component khi props của nó bằng nhau ở mức nông. <code>useMemo</code> nhớ một giá trị đã tính giữa các lần render; <code>useCallback</code> nhớ một hàm để danh tính của nó giữ nguyên — có ích chủ yếu khi hàm được truyền xuống một component con đã memo, hoặc dùng làm dependency của effect. Em dùng chúng <strong>sau khi đo</strong> bằng React Profiler thấy có lần render chậm, không dùng mặc định: chúng tốn bộ nhớ, làm code khó đọc hơn, và công cụ mới (React Compiler) có thể tự thêm memo.</p>',
  sau: ['Vì sao React.memo vô dụng nếu cha truyền một object mới tinh mỗi lần render?', 'Em tìm chỗ chậm thế nào?'],
  loi: 'Bọc mọi thứ bằng useMemo "cho nhanh" mà không đo gì.' })}
${qa('vi', { so: '6.1-8', q: 'Stale closure là gì? Cho ví dụ.', chu: 'closure — kiến thức JavaScript nền nằm bên trong React.',
  a: '<p>Một hàm "bắt" (capture) các biến của lần render mà nó được tạo ra. Nếu một <code>setInterval</code> được tạo một lần trong effect với <code>[]</code> và in <code>count</code>, nó sẽ in giá trị ban đầu mãi mãi, vì nó đóng gói ảnh chụp của lần render đầu tiên. Cách sửa: thêm <code>count</code> vào dependency (và dọn interval), dùng dạng hàm cập nhật <code>setCount(c =&gt; c + 1)</code>, hoặc giữ giá trị mới nhất trong một <code>useRef</code>.</p>',
  sau: ['Vì sao có luật ESLint react-hooks/exhaustive-deps?', 'Khi nào ref là cách sửa đúng?'],
  loi: 'Không nối được nó với closure trong JavaScript thuần.' })}
${qa('vi', { so: '6.1-9', q: 'Mở ghi chú 1, rồi bấm sang ghi chú 2, nhưng khung xem vẫn hiện ghi chú 1. Vì sao, sửa thế nào?', chu: 'gỡ một lỗi thật bằng mô hình danh tính.',
  a: '<p>Chuyện này đã xảy ra thật trên một nền tảng web cá nhân. Khung xem văn bản giàu định dạng chỉ-đọc (TipTap) chỉ đọc <code>content</code> lúc editor được tạo — tức lúc mount. Đổi ghi chú chỉ truyền props mới vào CÙNG một component đang sống, nên editor không bao giờ nạp lại. Cách sửa là đúng một thuộc tính: <code>key={note.id}</code>, khiến React coi mỗi ghi chú là một component mới, gỡ editor cũ và gắn một editor mới tinh.</p>' + ma('jsx', MA_KEY),
  sau: ['Ngoài key còn cách nào? (gọi editor.commands.setContent trong một effect)', 'Dùng key thì tốn gì?'],
  loi: 'Đoán bừa "lỗi cache" mà không suy luận về danh tính component.' })}
${qa('vi', { so: '6.1-10', q: 'Người dùng chuyển nhanh giữa các hồ sơ và thỉnh thoảng thấy nhầm người. Chuyện gì đang xảy ra?', chu: 'race condition (cuộc đua) khi gọi dữ liệu.',
  a: '<p>Hai request đang bay cùng lúc; request cũ về SAU và ghi đè kết quả mới. Cách sửa: huỷ hoặc bỏ qua request đã cũ trong cleanup của effect bằng <code>AbortController</code> (hoặc một cờ), hoặc dùng thư viện gọi dữ liệu như TanStack Query — nó gắn kết quả theo khoá truy vấn và lo việc này giúp bạn.</p>' + ma('jsx', MA_RACE),
  sau: ['TanStack Query tránh chuyện này thế nào?', 'staleTime và gcTime là gì?'],
  loi: '"Thêm vòng xoay đang tải." Nó che triệu chứng; dữ liệu sai vẫn tới.' })}

${bay('vi', 'đọc lại định nghĩa trong tài liệu.', 'Người phỏng vấn đã nghe "React là thư viện xây giao diện dùng virtual DOM" hàng trăm lần. Họ nhớ ứng viên nói "em từng dính cái này: khung xem ghi chú giữ ghi chú cũ cho tới khi em thêm key". Gắn một lỗi thật hoặc một thí nghiệm nhỏ vào mọi khái niệm bạn tự nhận là biết.')}
${keXau('vi', 'React tự thoát (escape) chữ bạn render bằng <code>{value}</code>, chặn được phần lớn tấn công XSS (chèn mã script vào trang). Lỗ hổng nằm ở <code>dangerouslySetInnerHTML</code>: render HTML do người dùng viết (bình luận, ghi chú định dạng) mà không làm sạch cho phép kẻ tấn công chạy script trong trình duyệt của người khác và lấy cắp phiên đăng nhập. Nếu buộc phải render HTML, làm sạch trước (ví dụ bằng DOMPurify) — và nói ra điều đó khi phỏng vấn, đó là tín hiệu mạnh.')}
${neu('vi', 'người phỏng vấn hỏi về class component, thứ bạn chưa từng học? Nói thật, rồi nối sang cái bạn biết: "các hàm vòng đời như componentDidMount giờ thành effect; this.state thành useState". Nhiều codebase ở Việt Nam vẫn còn class component, nên đọc trước một ví dụ là đáng.')}

${thucHanh('vi', { phut: '30–40', steps: [
  'Trả lời mười câu thành tiếng, tự ghi âm bằng điện thoại, TRƯỚC khi mở bất kỳ câu mẫu nào. Đánh dấu câu nào bạn ngập ngừng quá năm giây.',
  'Tái hiện lỗi 6.1-2 trong một app Vite nhỏ: danh sách dùng key={index}, mỗi dòng một ô input, một nút thêm phần tử lên đầu. Nhìn chữ đã gõ nhảy dòng, rồi sửa bằng id ổn định.',
  'Tái hiện lỗi 6.1-10: gọi một API giả có độ trễ ngẫu nhiên và chuyển thật nhanh; rồi thêm cleanup dùng AbortController.',
], dat: 'bạn trả lời được cả mười câu không cần ghi chú, mỗi câu dưới hai phút, và có hai kho mã nhỏ cho thấy lỗi và cách sửa.' })}
${thuatNgu('vi', [
  ['Render', 'React gọi hàm component của bạn để lấy bản mô tả giao diện.'],
  ['Commit (áp vào)', 'React áp những chỗ khác nhau vào DOM thật.'],
  ['Reconciliation (đối chiếu)', 'So bản mô tả mới với bản trước để tìm chỗ đổi.'],
  ['Snapshot (ảnh chụp state)', 'Giá trị cố định của state trong một lần render.'],
  ['Cleanup (dọn dẹp)', 'Hàm trả về từ effect; nó gỡ bỏ những gì effect đã làm.'],
  ['Stale closure (closure cũ)', 'Một hàm vẫn dùng biến của một lần render cũ.'],
  ['Server state (state phía máy chủ)', 'Dữ liệu do máy chủ sở hữu, được đệm ở client (TanStack Query).'],
])}
${tomTat('vi', [
  'Render là kích hoạt → render (thuần) → commit → effect; phần lớn câu hỏi xoay quanh thứ tự này.',
  'State là ảnh chụp theo từng lần render; dùng dạng hàm cập nhật khi giá trị sau phụ thuộc giá trị trước.',
  'Key là danh tính: id ổn định giữ state đúng dòng, và đổi key là gắn lại component từ đầu.',
  'Effect để đồng bộ với thế giới bên ngoài; giá trị dẫn xuất thì tính ngay khi render.',
  'Chỉ memo sau khi đo; tách server state khỏi client state.',
  'Gắn một lỗi thật vào mỗi khái niệm — đó là thứ người phỏng vấn nhớ.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'react', bai: 'rx-2-1-use-state', title: 'React 2.1 — useState và render lại', sub: 'Ảnh chụp, hàm cập nhật và gom cập nhật, có đo thật.' }),
  lienKet({ khoa: 'react', bai: 'rx-4-1-use-effect', title: 'React 4.1 — useEffect, dependency và cleanup', sub: 'Chạy lúc nào và vì sao StrictMode chạy hai lần.' }),
  lienKet({ khoa: 'react', bai: 'rx-9-4-phong-van', title: 'React 9.4 — 20 câu phỏng vấn React', sub: 'Ngân hàng câu hỏi riêng của khoá React, sâu hơn về test.' }),
  lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-8-1-usestate-useeffect', academy: true, title: 'Academy · FER202 8.1 — useState và useEffect', sub: 'Bản ở trường của đúng hai hook này — đề FER202 đòi gì.' }),
  yt('f3yRqkOFSCk', 'techsith', 'React Hooks Interview Questions and answers', 13),
  nguon('📘', 'react.dev — You Might Not Need an Effect', 'Hướng dẫn chính thức để bỏ những effect không cần thiết (tiếng Anh).', 'https://react.dev/learn/you-might-not-need-an-effect'),
])}
</div>
`,
};

/* ═══════════════════════ 6.2 — Next.js ═══════════════════════ */
const MA_PUBLIC = `
// BEFORE — the key is baked into the JavaScript bundle at build time
// and anyone can read it in DevTools. If the variable is missing during
// "next build", the bundle silently gets undefined.
const res = await fetch('https://api.giphy.com/v1/gifs/search?api_key='
  + process.env.NEXT_PUBLIC_GIPHY_API_KEY + '&q=' + q);

// AFTER — the browser calls our own backend; the key stays server-side
// as a runtime environment variable, responses can be cached,
// and rotating the key needs a restart, not a rebuild.
const res = await fetch('/api/v1/gifs/search?q=' + encodeURIComponent(q));
`;

const MA_RSC = `
// app/posts/[id]/page.tsx — a Server Component (the default)
export default async function PostPage({ params }) {
  const post = await db.post.findUnique({ where: { id: Number(params.id) } });
  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton postId={post.id} initialLikes={post.likes} />
    </article>
  );
}

// components/LikeButton.tsx — needs state and onClick, so it is a Client Component
'use client';
export function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  return <button onClick={() => setLikes(likes + 1)}>♥ {likes}</button>;
}
`;

const L62 = {
  title: '6.2 — Next.js questions: rendering strategies, Server Components, environment variables and stale builds|||6.2 — Câu hỏi Next.js: các cách render, Server Component, biến môi trường và bản build cũ',
  slug: 'pv-6-2-nextjs',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mười câu Next.js hay gặp (React vs Next, CSR/SSR/SSG/ISR, Server vs Client Component, ranh giới props, cache và revalidate, lỗi hydration, NEXT_PUBLIC bị nướng lúc build, middleware và refresh token, thư mục public, ảnh) kèm sự cố thật của một dự án Next.js chạy production.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Next.js questions — where the page is made, and what that breaks</h2>
<p class="lead">If a posting says "React", the interview often drifts into Next.js, because most Vietnamese product companies building with React now use it. Next.js questions are almost all about one idea: <strong>where and when a page is produced</strong> — on the server or in the browser, at build time or at request time. Get that idea right and you can answer questions you have never seen. This lesson has ten questions and several incidents from a real Next.js site in production.</p>

<h3>An everyday picture: a bakery</h3>
${doiThuong('en', 'A bakery can bake bread at dawn and keep it on the shelf (static generation — fast, but baked before you arrived), bake on order when you walk in (server-side rendering — fresh, but you wait), bake at dawn and replace a tray every hour (incremental regeneration), or sell you a bread kit to bake at home (client-side rendering — the shop is quick, but you do the work). Next.js lets each page choose; every interview question is about which oven is used and what it costs.')}

<h3>Four ways a page gets made</h3>
${bang(['Strategy', 'When HTML is produced', 'Good for', 'Cost'], [
  ['CSR (client-side rendering)', 'In the browser, after JavaScript loads', 'Dashboards behind a login', 'Blank page until JS runs; weak SEO'],
  ['SSR (server-side rendering)', 'On the server, for every request', 'Personalised or fast-changing pages', 'Server work per request; slower first byte'],
  ['SSG (static generation)', 'At build time, once', 'Docs, blog posts, landing pages', 'Stale until the next build'],
  ['ISR (incremental static regeneration)', 'At build, then regenerated in the background after N seconds or on demand', 'Product pages, course pages', 'Some users see slightly old data'],
])}

<h3>Ten questions</h3>
${qa('en', { so: '6.2-1', q: 'What does Next.js add on top of React?', chu: 'whether you know what a framework is for.',
  a: '<p>React is a library for building UI out of components; it does not decide routing, data loading, rendering on the server or bundling. Next.js is a framework around React that does: file-based routing (the <code>app</code> folder), server rendering and static generation, Server Components, data fetching with caching, image and font optimisation, route handlers for small APIs, and a production build. In short: React draws the UI; Next.js decides where and when that UI is produced and delivered.</p>',
  sau: ['When would you NOT use Next.js? (a small internal SPA, or when the backend team already serves the app)'],
  loi: '"Next.js is React with SEO." True but shallow.' })}
${qa('en', { so: '6.2-2', q: 'Explain CSR, SSR, SSG and ISR. Which would you choose for a course page?', chu: 'the rendering trade-off.',
  a: '<p>See the table above. For a public course page that changes a few times a day and must be indexed by search engines, I would generate it statically and revalidate — ISR or on-demand revalidation when an admin edits the course. For "my progress" inside the page, which is personal, I would render that part on the client or on the server per request. The key point: the choice is per page, even per component.</p>',
  sau: ['How do you trigger revalidation after an admin edits a course?', 'What does a search engine see with pure CSR?'],
  loi: 'Picking SSR for everything "because it is the newest".' })}
${qa('en', { so: '6.2-3', q: 'Server Components vs Client Components — what is the difference and how do you decide?', chu: 'the App Router mental model.',
  a: '<p>In the App Router every component is a <strong>Server Component</strong> by default: it runs only on the server, can be async, can read the database or secrets directly, and sends no JavaScript for itself to the browser. A <strong>Client Component</strong> starts with <code>"use client"</code>; it is pre-rendered on the server too, then hydrated in the browser, so it can use state, effects and event handlers. Rule: keep things on the server, and push <code>"use client"</code> down to the smallest interactive leaf — the like button, not the whole page.</p>' + ma('tsx', MA_RSC),
  sau: ['Can a Client Component import a Server Component?', 'What can you pass as props across the boundary?'],
  loi: 'Thinking Client Components render only in the browser — they are also rendered on the server for the first HTML.' })}
${qa('en', { so: '6.2-4', q: 'What can and cannot cross from a Server Component to a Client Component as props?', chu: 'serialisation.',
  a: '<p>Props crossing the boundary must be <strong>serialisable</strong>: strings, numbers, booleans, plain objects and arrays, dates (as values the framework can serialise) and JSX passed as <code>children</code>. Functions cannot be passed (except Server Actions), and neither can class instances like a database client. A common error is passing an <code>onClick</code> from a server page into a client button — the fix is to define the handler inside the Client Component.</p>',
  sau: ['How do you let a client form call server code? (a Server Action)'],
  loi: 'Not knowing why the error "Functions cannot be passed directly to Client Components" happens.' })}
${qa('en', { so: '6.2-5', q: 'What is a hydration error and what usually causes it?', chu: 'SSR + client consistency.',
  a: '<p>Hydration is React attaching event handlers to server-rendered HTML in the browser. It expects the first client render to produce exactly the same markup. A mismatch error appears when it does not: rendering <code>Date.now()</code> or <code>Math.random()</code> during render, reading <code>window</code> or <code>localStorage</code> during render, a theme chosen differently on the server and client, or invalid HTML nesting such as a <code>div</code> inside a <code>p</code>. Fixes: read browser-only values in an effect after mount, or render that part only on the client.</p>',
  sau: ['How do you avoid a light-mode flash for a dark-mode user?'],
  loi: 'Silencing the warning instead of finding the different value.' })}
${qa('en', { so: '6.2-6', q: 'What does the NEXT_PUBLIC_ prefix do, and what is the risk?', chu: 'build time vs run time — a real outage pattern.',
  a: '<p>Variables starting with <code>NEXT_PUBLIC_</code> are <strong>inlined into the JavaScript bundle at build time</strong>. Two consequences. First, they are public: anyone can read them in DevTools, so a third-party API key must never be <code>NEXT_PUBLIC_</code>. Second, changing them requires a rebuild — a restart does nothing, and if the variable was missing during the build, the bundle simply contains <code>undefined</code>. A real case: a GIF picker called GIPHY directly from the browser with a <code>NEXT_PUBLIC_</code> key; when the variable was missing at build time it fell back to a revoked public key and returned 403. The fix was a small authenticated backend proxy route: the key stays a runtime server variable, responses are cached, and rotating the key needs a restart, not a rebuild.</p>' + ma('ts', MA_PUBLIC),
  sau: ['Where does a server-only variable get read in Next.js?', 'How would you rotate a leaked key?'],
  loi: '"I put the key in .env so it is secret." Not if it is NEXT_PUBLIC_.' })}
${qa('en', { so: '6.2-7', q: 'How does caching and revalidation work for fetched data?', chu: 'whether you know the behaviour depends on the version.',
  a: '<p>Next.js can cache the result of server data fetches and the rendered output of routes, and revalidate them by time (<code>revalidate: 60</code>) or on demand (<code>revalidatePath</code>, <code>revalidateTag</code>) after a mutation. The defaults changed between major versions — Next 14 cached fetches by default, Next 15 made them uncached by default — so an honest answer is: "I check the docs for the version we use, and I always revalidate after writes." Stale data after an edit is the classic symptom of forgetting that.</p>',
  sau: ['A user edits their profile and still sees the old name. Where do you look?'],
  loi: 'Claiming one fixed caching rule regardless of version.' })}
${qa('en', { so: '6.2-8', q: 'A user is logged out silently after one day although the cookie lasts seven days. How do you investigate?', chu: 'auth across Next.js and the API — a real incident.',
  a: '<p>This happened on a real site: the access JWT expired after 24 hours while the cookie lived seven days, and the refresh route the frontend called did not exist on the backend — so every authenticated call returned 401 after a day. Investigation: open the Network tab, find the first 401, decode the token to read <code>exp</code>, check whether a refresh request happens and what it returns. Fix: a real <code>POST /auth/refresh</code> on the backend that re-checks the account, plus an HTTP-client interceptor that refreshes once on 401 and retries.</p>',
  sau: ['Where should the token live — localStorage or an HttpOnly cookie?', 'How do you avoid two tabs refreshing at the same time?'],
  loi: 'Making the token last 30 days — it trades a bug for a security hole.' })}
${qa('en', { so: '6.2-9', q: 'You replaced a file in the public folder, but the running server returns 404 for it. Why?', chu: 'how the production server treats static files.',
  a: '<p>On a real project, a production Next.js server read the list of files in <code>public/</code> when it started. A rebuilt asset bundle got a new hashed filename, the running server did not know it, and returned 404 — the page sat on its loading screen with no error at all. The lesson: after changing <code>public/</code>, restart the server, and kill the old process by port, not by name, because the process renames itself. In Docker production this cannot happen — every deploy is a new container.</p>',
  sau: ['How would you notice this from monitoring rather than from a user?'],
  loi: 'Clearing the browser cache and hoping.' })}
${qa('en', { so: '6.2-10', q: 'Why use next/image instead of a plain img tag?', chu: 'performance and layout stability.',
  a: '<p><code>next/image</code> serves resized, modern-format images, lazy-loads below the fold, and requires a width and height (or fill) so the browser reserves space — that prevents layout shift (CLS). It also lets you mark the hero image as priority for a faster Largest Contentful Paint. The trade-off is configuration for remote domains, and for some cases (already-optimised CDN images) a plain <code>img</code> with explicit dimensions is fine.</p>',
  sau: ['What are LCP and CLS? (Lesson 6.3)'],
  loi: 'Not mentioning the reserved space — that is the main visible benefit.' })}

${bay('en', 'answering Next.js questions with Pages Router knowledge only.', 'Many tutorials still teach <code>getServerSideProps</code> and <code>getStaticProps</code>. They work in the old Pages Router, but if the company uses the App Router the vocabulary is Server Components, <code>"use client"</code>, layouts and Server Actions. Ask which router they use, and know the mapping between the two.')}
${keXau('en', 'Server Actions and route handlers are <strong>public HTTP endpoints</strong>, even if no button in your UI calls them. An attacker can call them directly with any arguments. Every action must check authentication and authorisation on the server and validate its input — hiding a button is not access control.')}
${neu('en', 'the dark theme breaks colours inside one feature of your app after you add it? On a real site the global dark theme put the class <code>dark</code> on the html element, which switched on every Tailwind <code>dark:</code> utility inside a notes feature that had its own three-theme switcher. The fix was to rename the global class to <code>theme-dark</code> and reserve <code>dark:</code> for the notes wrapper. Good story for "tell me about a CSS bug".')}

${thucHanh('en', { phut: '30–40', steps: [
  'Answer the ten questions out loud and record yourself. Mark every pause over five seconds.',
  'In a fresh Next.js app, make one page static, one dynamic, and one with revalidate: 30. Show the difference by printing the render time on each page.',
  'Build a page that is a Server Component with one small Client Component button. Try passing an onClick from the server page and read the error message.',
  'Write in three sentences the NEXT_PUBLIC_ story above as your own STAR story if you have a similar one; otherwise explain the rule to a friend.',
], dat: 'you can draw the four rendering strategies from memory and explain the Server/Client boundary with your own working example.' })}
${thuatNgu('en', [
  ['SSR / SSG / ISR / CSR', 'Server-side rendering, static generation, incremental regeneration, client-side rendering.'],
  ['Server Component', 'Runs only on the server; can be async; sends no JS for itself.'],
  ['Client Component', 'Marked "use client"; pre-rendered then hydrated; can use state and events.'],
  ['Hydration', 'React attaching interactivity to server-rendered HTML.'],
  ['Revalidation', 'Refreshing cached data or pages by time or on demand.'],
  ['Inlined at build time', 'Replaced by its literal value inside the bundle — needs a rebuild to change.'],
  ['Server Action', 'A server function called from a form or client code — a public endpoint.'],
])}
${tomTat('en', [
  'Every Next.js question is about where and when a page is produced: browser or server, build or request.',
  'Choose rendering per page: static and revalidated for public content, dynamic for personal data.',
  'Keep components on the server and push "use client" down to small interactive leaves.',
  'NEXT_PUBLIC_ values are public and baked at build time — never put third-party keys there.',
  'Caching defaults changed between versions; always revalidate after writes.',
  'Actions and route handlers are public endpoints — check auth and validate input on the server.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'nextjs', bai: 'nextjs-9-1-mac-dinh-la-server-component', L: 'en', title: 'Next.js 9.1 — The default is a Server Component', sub: 'The boundary explained step by step.' }),
  lienKet({ khoa: 'nextjs', bai: 'nextjs-17-1-bon-cach-render', L: 'en', title: 'Next.js 17.1 — Four ways a page gets made', sub: 'CSR, SSR, SSG and ISR measured.' }),
  lienKet({ khoa: 'nextjs', bai: 'nextjs-20-2-env-next-public', L: 'en', title: 'Next.js 20.2 — Environment variables and the NEXT_PUBLIC trap', sub: 'The build-time vs run-time rule in depth.' }),
  yt('Qdkg_mrniLk', 'ByteGrad', 'When and where to add "use client" (Client vs Server Components)', 11, 'en'),
  nguon('📘', 'Next.js docs — Server and Client Components', 'The official explanation, for the version you use.', 'https://nextjs.org/docs/app/getting-started/server-and-client-components'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Câu hỏi Next.js — trang được làm ra ở đâu, và điều đó làm hỏng cái gì</h2>
<p class="lead">Nếu tin tuyển dụng ghi "React", buổi phỏng vấn thường trôi sang Next.js, vì phần lớn công ty sản phẩm ở Việt Nam làm với React giờ đều dùng nó. Câu hỏi Next.js gần như đều xoay quanh một ý: <strong>trang được làm ra ở đâu và lúc nào</strong> — trên máy chủ hay trong trình duyệt, lúc build hay lúc có request. Nắm đúng ý đó là bạn trả lời được cả những câu chưa từng gặp. Bài này có mười câu hỏi và vài sự cố của một trang Next.js thật đang chạy production.</p>

<h3>Liên tưởng đời thường: một tiệm bánh mì</h3>
${doiThuong('vi', 'Tiệm bánh có thể nướng từ sáng sớm rồi bày lên kệ (SSG — sinh tĩnh: lấy nhanh, nhưng nướng trước khi bạn tới), nướng theo đơn khi bạn bước vào (SSR — render phía máy chủ: nóng hổi, nhưng phải chờ), nướng từ sáng rồi cứ mỗi giờ thay một khay (ISR — tái sinh dần), hoặc bán cho bạn bộ bột để về nhà tự nướng (CSR — render phía client: tiệm làm nhanh, nhưng bạn phải tự làm). Next.js cho mỗi trang tự chọn; mọi câu hỏi phỏng vấn đều là về chuyện dùng lò nào và trả giá gì.')}

<h3>Bốn cách một trang được làm ra</h3>
${bang(['Cách', 'HTML được tạo lúc nào', 'Hợp với', 'Cái giá'], [
  ['CSR (render phía client)', 'Trong trình duyệt, sau khi JavaScript tải xong', 'Bảng điều khiển sau đăng nhập', 'Trang trắng tới khi JS chạy; SEO yếu'],
  ['SSR (render phía máy chủ)', 'Trên máy chủ, ở mỗi request', 'Trang cá nhân hoá hoặc đổi nhanh', 'Máy chủ làm việc mỗi request; byte đầu chậm hơn'],
  ['SSG (sinh tĩnh)', 'Lúc build, một lần', 'Tài liệu, bài blog, trang giới thiệu', 'Cũ cho tới lần build sau'],
  ['ISR (tái sinh tĩnh dần)', 'Lúc build, rồi tái sinh ngầm sau N giây hoặc khi được gọi', 'Trang sản phẩm, trang khoá học', 'Một số người thấy dữ liệu hơi cũ'],
])}

<h3>Mười câu hỏi</h3>
${qa('vi', { so: '6.2-1', q: 'Next.js thêm gì lên trên React?', chu: 'bạn có biết framework sinh ra để làm gì.',
  a: '<p>React là thư viện dựng giao diện từ các component; nó không quyết định định tuyến, nạp dữ liệu, render trên máy chủ hay đóng gói. Next.js là một framework quanh React làm những việc đó: định tuyến theo thư mục (thư mục <code>app</code>), render trên máy chủ và sinh tĩnh, Server Component, gọi dữ liệu có cache, tối ưu ảnh và font, route handler cho API nhỏ, và một bản build production. Nói gọn: React vẽ giao diện; Next.js quyết định giao diện được làm ra và giao đi ở đâu, lúc nào.</p>',
  sau: ['Khi nào KHÔNG nên dùng Next.js? (một SPA nội bộ nhỏ, hoặc khi đội backend đã phục vụ sẵn ứng dụng)'],
  loi: '"Next.js là React có SEO." Đúng nhưng nông.' })}
${qa('vi', { so: '6.2-2', q: 'Giải thích CSR, SSR, SSG và ISR. Em chọn gì cho một trang khoá học?', chu: 'sự đánh đổi khi render.',
  a: '<p>Xem bảng ở trên. Với một trang khoá học công khai, đổi vài lần một ngày và phải được máy tìm kiếm lập chỉ mục, em sẽ sinh tĩnh rồi revalidate — ISR, hoặc revalidate theo yêu cầu khi admin sửa khoá. Phần "tiến độ của tôi" trong trang thì mang tính cá nhân, em render phía client hoặc phía máy chủ theo từng request. Điểm mấu chốt: chọn theo từng trang, thậm chí từng component.</p>',
  sau: ['Kích hoạt revalidate sau khi admin sửa khoá thế nào?', 'Máy tìm kiếm thấy gì với CSR thuần?'],
  loi: 'Chọn SSR cho mọi thứ "vì nó mới nhất".' })}
${qa('vi', { so: '6.2-3', q: 'Server Component và Client Component khác nhau thế nào, quyết định ra sao?', chu: 'mô hình tư duy của App Router.',
  a: '<p>Trong App Router mọi component mặc định là <strong>Server Component</strong>: chỉ chạy trên máy chủ, có thể async, đọc thẳng CSDL hay bí mật, và không gửi JavaScript của chính nó xuống trình duyệt. <strong>Client Component</strong> mở đầu bằng <code>"use client"</code>; nó cũng được render trước trên máy chủ, rồi hydrate (gắn tương tác) trong trình duyệt, nên dùng được state, effect và xử lý sự kiện. Luật: giữ mọi thứ ở máy chủ, đẩy <code>"use client"</code> xuống chiếc lá tương tác nhỏ nhất — cái nút thích, không phải cả trang.</p>' + ma('tsx', MA_RSC),
  sau: ['Client Component có import được Server Component không?', 'Được truyền gì làm props qua ranh giới?'],
  loi: 'Tưởng Client Component chỉ render trong trình duyệt — nó cũng được render trên máy chủ để ra HTML đầu tiên.' })}
${qa('vi', { so: '6.2-4', q: 'Thứ gì được và không được truyền từ Server Component sang Client Component qua props?', chu: 'tuần tự hoá (serialization).',
  a: '<p>Props đi qua ranh giới phải <strong>tuần tự hoá được</strong>: chuỗi, số, boolean, object và mảng thường, ngày tháng (ở dạng framework tuần tự hoá được) và JSX truyền qua <code>children</code>. Không truyền được hàm (trừ Server Action), cũng không truyền được đối tượng của class như client CSDL. Lỗi hay gặp: truyền <code>onClick</code> từ trang phía máy chủ vào nút phía client — cách sửa là định nghĩa hàm xử lý ngay trong Client Component.</p>',
  sau: ['Làm sao cho một form phía client gọi được code phía máy chủ? (Server Action)'],
  loi: 'Không biết vì sao có lỗi "Functions cannot be passed directly to Client Components".' })}
${qa('vi', { so: '6.2-5', q: 'Lỗi hydration là gì, thường do đâu?', chu: 'sự nhất quán giữa SSR và client.',
  a: '<p>Hydration là việc React gắn xử lý sự kiện vào HTML đã render sẵn từ máy chủ, ngay trong trình duyệt. Nó mong lần render đầu ở client ra ĐÚNG y hệt markup đó. Lỗi lệch xuất hiện khi không khớp: render <code>Date.now()</code> hay <code>Math.random()</code> trong lúc render, đọc <code>window</code> hay <code>localStorage</code> trong lúc render, theme được chọn khác nhau giữa máy chủ và client, hoặc HTML lồng sai như <code>div</code> trong <code>p</code>. Cách sửa: đọc giá trị chỉ-có-ở-trình-duyệt trong effect sau khi mount, hoặc render phần đó chỉ ở client.</p>',
  sau: ['Tránh chớp sáng chế độ sáng với người dùng chế độ tối thế nào?'],
  loi: 'Tắt cảnh báo thay vì đi tìm giá trị bị khác.' })}
${qa('vi', { so: '6.2-6', q: 'Tiền tố NEXT_PUBLIC_ làm gì, rủi ro ở đâu?', chu: 'lúc build vs lúc chạy — một kiểu sự cố thật.',
  a: '<p>Biến bắt đầu bằng <code>NEXT_PUBLIC_</code> được <strong>nướng thẳng vào gói JavaScript lúc build</strong>. Hai hệ quả. Một, nó công khai: ai cũng đọc được trong DevTools, nên khoá API của bên thứ ba không bao giờ được là <code>NEXT_PUBLIC_</code>. Hai, đổi nó phải build lại — khởi động lại không có tác dụng gì, và nếu biến thiếu lúc build thì gói chỉ chứa <code>undefined</code>. Một vụ thật: ô chọn GIF gọi thẳng GIPHY từ trình duyệt với khoá <code>NEXT_PUBLIC_</code>; khi biến thiếu lúc build, nó lùi về một khoá công khai đã bị thu hồi và nhận 403. Cách sửa là một tuyến proxy nhỏ ở backend có xác thực: khoá nằm yên là biến môi trường lúc chạy của máy chủ, phản hồi được cache, và đổi khoá chỉ cần khởi động lại, không cần build lại.</p>' + ma('ts', MA_PUBLIC),
  sau: ['Biến chỉ-dành-cho-máy-chủ được đọc ở đâu trong Next.js?', 'Em xoay vòng một khoá bị lộ thế nào?'],
  loi: '"Em để khoá trong .env nên nó bí mật." Không, nếu nó là NEXT_PUBLIC_.' })}
${qa('vi', { so: '6.2-7', q: 'Cache và revalidate dữ liệu đã gọi hoạt động thế nào?', chu: 'bạn có biết hành vi phụ thuộc phiên bản không.',
  a: '<p>Next.js có thể cache kết quả các lần gọi dữ liệu phía máy chủ và đầu ra đã render của các route, rồi revalidate theo thời gian (<code>revalidate: 60</code>) hoặc theo yêu cầu (<code>revalidatePath</code>, <code>revalidateTag</code>) sau khi ghi dữ liệu. Mặc định đã đổi giữa các bản lớn — Next 14 cache fetch mặc định, Next 15 chuyển sang mặc định không cache — nên câu trả lời trung thực là: "Em xem tài liệu đúng phiên bản đội đang dùng, và em luôn revalidate sau khi ghi." Dữ liệu cũ sau khi sửa là triệu chứng kinh điển của việc quên điều đó.</p>',
  sau: ['Người dùng sửa hồ sơ mà vẫn thấy tên cũ. Em tìm ở đâu?'],
  loi: 'Khẳng định một luật cache cố định bất kể phiên bản.' })}
${qa('vi', { so: '6.2-8', q: 'Người dùng bị đăng xuất âm thầm sau một ngày dù cookie sống bảy ngày. Em điều tra thế nào?', chu: 'xác thực xuyên Next.js và API — một sự cố thật.',
  a: '<p>Chuyện này xảy ra trên một trang thật: JWT truy cập hết hạn sau 24 giờ trong khi cookie sống bảy ngày, và tuyến refresh mà frontend gọi lại không tồn tại ở backend — nên sau một ngày mọi lời gọi có xác thực đều trả 401. Điều tra: mở thẻ Network, tìm cái 401 đầu tiên, giải mã token đọc <code>exp</code>, xem có request refresh không và nó trả gì. Cách sửa: một tuyến <code>POST /auth/refresh</code> thật ở backend có kiểm lại tài khoản, cộng một interceptor ở HTTP client refresh một lần khi gặp 401 rồi thử lại.</p>',
  sau: ['Token nên nằm ở đâu — localStorage hay cookie HttpOnly?', 'Tránh hai tab cùng refresh một lúc thế nào?'],
  loi: 'Cho token sống 30 ngày — đổi một lỗi lấy một lỗ hổng bảo mật.' })}
${qa('vi', { so: '6.2-9', q: 'Em thay một tệp trong thư mục public, nhưng server đang chạy trả 404 cho nó. Vì sao?', chu: 'server production đối xử với tệp tĩnh thế nào.',
  a: '<p>Ở một dự án thật, server Next.js production đọc danh sách tệp trong <code>public/</code> lúc nó khởi động. Gói tài nguyên dựng lại có tên băm mới, server đang chạy không biết, trả 404 — trang đứng ở màn hình tải mà không có lỗi nào cả. Bài học: đổi <code>public/</code> thì khởi động lại server, và diệt tiến trình cũ theo CỔNG chứ không theo tên, vì tiến trình tự đổi tên. Trong production chạy Docker thì không dính, vì mỗi lần deploy là một container mới.</p>',
  sau: ['Làm sao nhận ra chuyện này từ giám sát thay vì từ người dùng báo?'],
  loi: 'Xoá cache trình duyệt rồi cầu may.' })}
${qa('vi', { so: '6.2-10', q: 'Vì sao dùng next/image thay vì thẻ img thường?', chu: 'hiệu năng và sự ổn định bố cục.',
  a: '<p><code>next/image</code> phục vụ ảnh đã đổi cỡ, định dạng hiện đại, tải lười phần dưới màn hình, và đòi chiều rộng/cao (hoặc fill) để trình duyệt giữ chỗ trước — chặn được xô lệch bố cục (CLS). Nó cũng cho bạn đánh dấu ảnh chính là priority để Largest Contentful Paint nhanh hơn. Cái giá là phải cấu hình tên miền ảnh từ xa, và với vài trường hợp (ảnh CDN đã tối ưu) thì một thẻ <code>img</code> có kích thước rõ ràng vẫn ổn.</p>',
  sau: ['LCP và CLS là gì? (Bài 6.3)'],
  loi: 'Không nhắc chuyện giữ chỗ — đó là lợi ích thấy được rõ nhất.' })}

${bay('vi', 'trả lời câu Next.js bằng kiến thức Pages Router thôi.', 'Nhiều tutorial vẫn dạy <code>getServerSideProps</code> và <code>getStaticProps</code>. Chúng chạy trong Pages Router cũ, nhưng nếu công ty dùng App Router thì từ vựng là Server Component, <code>"use client"</code>, layout và Server Action. Hãy hỏi họ dùng router nào, và biết cách đối chiếu giữa hai bên.')}
${keXau('vi', 'Server Action và route handler là <strong>endpoint HTTP công khai</strong>, kể cả khi không nút nào trên giao diện gọi tới. Kẻ tấn công gọi thẳng được với bất kỳ đối số nào. Mọi action phải kiểm xác thực và phân quyền phía máy chủ và kiểm hợp lệ đầu vào — giấu một cái nút không phải là kiểm soát truy cập.')}
${neu('vi', 'theme tối làm hỏng màu bên trong một tính năng sau khi bạn thêm nó? Trên một trang thật, theme tối toàn cục gắn lớp <code>dark</code> lên thẻ html, thế là bật hết mọi tiện ích <code>dark:</code> của Tailwind bên trong tính năng ghi chú — vốn có bộ chuyển ba theme riêng. Cách sửa là đổi tên lớp toàn cục thành <code>theme-dark</code> và dành <code>dark:</code> riêng cho khung ghi chú. Một câu chuyện hay cho câu "kể về một lỗi CSS".')}

${thucHanh('vi', { phut: '30–40', steps: [
  'Trả lời mười câu thành tiếng và tự ghi âm. Đánh dấu mọi lần ngập ngừng quá năm giây.',
  'Trong một app Next.js mới, làm một trang tĩnh, một trang động, và một trang có revalidate: 30. Chứng minh khác biệt bằng cách in thời điểm render lên từng trang.',
  'Dựng một trang Server Component có một nút Client Component nhỏ. Thử truyền onClick từ trang phía máy chủ xuống và đọc thông báo lỗi.',
  'Viết lại câu chuyện NEXT_PUBLIC_ ở trên thành ba câu theo lời của bạn (hoặc câu chuyện tương tự của bạn); nếu không có, giải thích luật này cho một người bạn.',
], dat: 'bạn vẽ được bốn cách render mà không nhìn tài liệu và giải thích được ranh giới Server/Client bằng ví dụ chạy được của chính mình.' })}
${thuatNgu('vi', [
  ['SSR / SSG / ISR / CSR', 'Render phía máy chủ, sinh tĩnh, tái sinh dần, render phía client.'],
  ['Server Component', 'Chỉ chạy trên máy chủ; có thể async; không gửi JS của chính nó xuống.'],
  ['Client Component', 'Đánh dấu "use client"; render trước rồi hydrate; dùng được state và sự kiện.'],
  ['Hydration (gắn tương tác)', 'React gắn tương tác vào HTML đã render từ máy chủ.'],
  ['Revalidation (làm mới cache)', 'Làm mới dữ liệu hoặc trang đã cache theo thời gian hoặc theo yêu cầu.'],
  ['Nướng lúc build (inline)', 'Bị thay bằng giá trị cụ thể ngay trong gói JS — muốn đổi phải build lại.'],
  ['Server Action', 'Hàm phía máy chủ gọi từ form hoặc code client — một endpoint công khai.'],
])}
${tomTat('vi', [
  'Mọi câu Next.js đều xoay quanh chuyện trang được làm ở đâu và lúc nào: trình duyệt hay máy chủ, lúc build hay lúc request.',
  'Chọn cách render theo từng trang: tĩnh + revalidate cho nội dung công khai, động cho dữ liệu cá nhân.',
  'Giữ component ở máy chủ, đẩy "use client" xuống những chiếc lá tương tác nhỏ.',
  'Giá trị NEXT_PUBLIC_ là công khai và bị nướng lúc build — không bao giờ để khoá bên thứ ba ở đó.',
  'Mặc định cache đã đổi giữa các phiên bản; luôn revalidate sau khi ghi.',
  'Action và route handler là endpoint công khai — kiểm xác thực và đầu vào phía máy chủ.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'nextjs', bai: 'nextjs-9-1-mac-dinh-la-server-component', title: 'Next.js 9.1 — Mặc định là Server Component', sub: 'Ranh giới giải thích từng bước.' }),
  lienKet({ khoa: 'nextjs', bai: 'nextjs-17-1-bon-cach-render', title: 'Next.js 17.1 — Bốn cách một trang được làm ra', sub: 'CSR, SSR, SSG và ISR có đo đạc.' }),
  lienKet({ khoa: 'nextjs', bai: 'nextjs-20-2-env-next-public', title: 'Next.js 20.2 — Biến môi trường và bẫy NEXT_PUBLIC', sub: 'Luật lúc build vs lúc chạy, đi sâu.' }),
  yt('Qdkg_mrniLk', 'ByteGrad', 'When and where to add "use client" (Client vs Server Components)', 11),
  nguon('📘', 'Tài liệu Next.js — Server and Client Components', 'Giải thích chính thức, đọc đúng phiên bản bạn dùng (tiếng Anh).', 'https://nextjs.org/docs/app/getting-started/server-and-client-components'),
])}
</div>
`,
};

/* ═══════════════════════ 6.3 — Trình duyệt ═══════════════════════ */
const MA_BLOB = `
// A preview of a file the user just picked has a URL like "blob:https://site/1a2b…".
// The helper prefixed the CDN base onto every URL, producing
// "https://cdn.example/blob:https://site/1a2b…" → 400, broken image.
export function getMediaUrl(u) {
  if (!u) return '';
  if (u.startsWith('blob:') || u.startsWith('data:')) return u;   // already renderable
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return CDN_BASE + '/' + u;                                       // bare storage key
}
`;

const L63 = {
  title: '6.3 — Browser, HTML/CSS and performance: the rendering path, Core Web Vitals, accessibility and browser security|||6.3 — Trình duyệt, HTML/CSS và hiệu năng: đường render, Core Web Vitals, khả năng tiếp cận và bảo mật trình duyệt',
  slug: 'pv-6-3-trinh-duyet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Những câu "nền tảng web" mà người phỏng vấn frontend dùng để phân biệt người chỉ biết framework với người hiểu trình duyệt: gõ URL rồi chuyện gì xảy ra, critical rendering path, LCP/INP/CLS, box model/flex/grid, khả năng tiếp cận, XSS, CORS, cookie, cache — kèm lỗi thật ở URL blob: và nginx nuốt Cache-Control.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>The browser itself: the questions that separate framework users from web developers</h2>
<p class="lead">After the React block, a good interviewer often asks something that no framework hides: "What happens when you type a URL?", "Why is this page slow?", "Why does CORS block my request?". These questions test whether you understand the platform underneath React. They are also where Vietnamese candidates lose the most points, because school courses rarely cover them. This lesson gives the model, nine questions, and two real production bugs.</p>

<h3>An everyday picture: building flat-pack furniture</h3>
${doiThuong('en', 'A browser receiving a page is like someone assembling flat-pack furniture from a delivery. The instructions (HTML) say which parts exist; the style sheet (CSS) says the size and colour of each; the person cannot start assembling (paint the screen) until both have arrived, and if a helper (JavaScript) keeps walking in and moving parts around, the work starts over. Performance work is mostly about delivering the instructions early, not making the builder wait for a slow helper, and reserving space for parts that arrive late.')}

<h3>The critical rendering path</h3>
${flow([
  ['1 · Network', 'DNS → TCP → TLS → HTTP request', 'Find the server, open a connection, encrypt it, ask for the HTML. A CDN near the user shortens all of this.'],
  ['2 · Parse HTML → DOM', 'the tree of elements', 'Parsing stops at a normal &lt;script&gt; tag until it downloads and runs — that is why scripts use defer or async.'],
  ['3 · Parse CSS → CSSOM', 'the tree of styles', 'CSS is render-blocking: nothing is painted until the CSS needed for the page is ready.'],
  ['4 · Render tree → layout', 'compute size and position', 'Changing geometry (width, top, font size) forces layout again — expensive when repeated.'],
  ['5 · Paint → composite', 'pixels on the screen', 'Animating transform and opacity can skip layout and paint, which is why they are smooth.'],
])}

<h3>Core Web Vitals, the numbers Google uses</h3>
${bang(['Metric', 'Measures', 'Good (75th percentile)', 'Usual fixes'], [
  ['LCP — Largest Contentful Paint', 'when the main content appears', '≤ 2.5 s', 'Fast server or CDN, preload the hero image, avoid render-blocking resources'],
  ['INP — Interaction to Next Paint', 'how fast the page responds to clicks and typing', '≤ 200 ms', 'Less JavaScript on the main thread, split long tasks, defer non-urgent work'],
  ['CLS — Cumulative Layout Shift', 'how much the layout jumps', '≤ 0.1', 'Width and height on images and video, reserved space for ads and embeds'],
])}
<p>INP replaced the older First Input Delay as a Core Web Vital in March 2024 — mentioning that shows you read current material.</p>

<h3>Nine questions</h3>
${qa('en', { so: '6.3-1', q: 'What happens, step by step, when you type a URL and press Enter?', chu: 'the full picture, and where you can go deeper.',
  a: '<p>The browser checks its cache; resolves the domain name through DNS to an IP address; opens a TCP connection (or QUIC for HTTP/3) and does a TLS handshake for HTTPS; sends the HTTP request; the request may pass a CDN and a reverse proxy such as nginx before reaching the application server, which returns HTML. The browser then parses HTML into the DOM, CSS into the CSSOM, builds the render tree, lays out, paints and composites, while fetching images, scripts and fonts in parallel. Then JavaScript runs and, in a React app, hydrates the page.</p>',
  sau: ['Where would a 502 come from in that chain?', 'What is cached, and where?'],
  loi: 'Stopping at "the server sends back HTML" — the rendering half is the frontend half.' })}
${qa('en', { so: '6.3-2', q: 'What do defer and async do on a script tag?', chu: 'render blocking.',
  a: '<p>A plain script blocks HTML parsing while it downloads and runs. <code>async</code> downloads in parallel and runs as soon as it arrives, in any order — good for independent scripts like analytics. <code>defer</code> downloads in parallel and runs after parsing finishes, in document order — good for your own app code. Modules (<code>type="module"</code>) are deferred by default.</p>',
  sau: ['Why put CSS in the head but scripts at the end or with defer?'],
  loi: 'Mixing up which one keeps order.' })}
${qa('en', { so: '6.3-3', q: 'A page has a poor LCP. How do you investigate?', chu: 'measure first.',
  a: '<p>Measure first: Lighthouse and the Performance panel in Chrome DevTools for lab data, PageSpeed Insights or real-user data for field data. Identify which element is the LCP element — usually a hero image or a heading. Then check the four parts of its timeline: time to first byte (server, CDN, cache), resource load delay (is the image discovered late, e.g. set by JavaScript?), load time (size and format), and render delay (render-blocking CSS or JS). Fix the biggest part first.</p>',
  sau: ['What is the difference between lab data and field data?'],
  loi: '"Minify everything." Without knowing which element and which phase, it is guessing.' })}
${qa('en', { so: '6.3-4', q: 'Explain the CSS box model, and when you use Flexbox versus Grid.', chu: 'CSS basics that many skip.',
  a: '<p>Every element is a box: content, padding, border, margin. <code>box-sizing: border-box</code> makes width include padding and border, which is why most resets use it. Flexbox lays out items along <strong>one axis</strong> — a toolbar, a row of buttons, centring something. Grid lays out in <strong>two dimensions</strong> — a page layout, a card gallery with rows and columns. I often use Grid for the page skeleton and Flexbox inside components.</p>',
  sau: ['How do you centre a div both ways?', 'What is specificity, and why is !important a smell?'],
  loi: '"I just use Tailwind classes." Tailwind is CSS; the interviewer wants the model under it.' })}
${qa('en', { so: '6.3-5', q: 'What does accessibility mean for a frontend developer, concretely?', chu: 'whether you build for everyone.',
  a: '<p>Use semantic HTML first: <code>button</code> for actions, <code>a</code> for navigation, real headings in order, <code>label</code> tied to every input. Every image that carries meaning has <code>alt</code> text. Everything works with the keyboard and focus is visible. Colour contrast is sufficient. ARIA attributes only where HTML has no native element. I check with the keyboard alone, with Lighthouse’s accessibility audit, and ideally a screen reader. The reference is the W3C’s WCAG guidelines.</p>',
  sau: ['Why is a div with onClick worse than a button?'],
  loi: 'Answering only "add aria labels".' })}
${qa('en', { so: '6.3-6', q: 'What is XSS and how do you prevent it in a React app?', chu: 'the most common web vulnerability on the frontend side.',
  a: '<p>Cross-site scripting is when an attacker gets their script to run in another user’s browser on your site — usually by storing HTML or JavaScript in a field that is later rendered without escaping. It can steal session tokens or act as the user. In React, text rendered with curly braces is escaped automatically. The risks are <code>dangerouslySetInnerHTML</code>, building URLs from user input (<code>javascript:</code> links), and third-party scripts. Defences: sanitise any HTML with a library such as DOMPurify, validate URLs, keep tokens in HttpOnly cookies, and add a Content Security Policy.</p>',
  sau: ['Stored vs reflected XSS?', 'What does a Content Security Policy do?'],
  loi: '"React prevents XSS." Mostly — but not in the three places above.' })}
${qa('en', { so: '6.3-7', q: 'Your frontend calls the API and the browser says "blocked by CORS policy". What is going on?', chu: 'a misunderstanding almost every junior has.',
  a: '<p>The browser enforces the same-origin policy: a page from one origin (scheme + host + port) may not read responses from another origin unless that server allows it with CORS headers such as <code>Access-Control-Allow-Origin</code>. For non-simple requests (JSON body, custom headers) the browser first sends a preflight OPTIONS request. The fix is on the <strong>server</strong>: allow the specific frontend origin, the methods and headers, and credentials if cookies are used. CORS is a browser rule, not server security — curl or Postman are not affected — so it never replaces authentication.</p>',
  sau: ['Why can you not use "*" together with credentials?', 'How does a dev proxy avoid CORS locally?'],
  loi: 'Installing a browser extension that disables CORS and calling it fixed.' })}
${qa('en', { so: '6.3-8', q: 'Where should an auth token live in the browser, and what do HttpOnly, Secure and SameSite do?', chu: 'security trade-offs.',
  a: '<p><code>localStorage</code> is readable by any script on the page, so one XSS bug leaks the token. An <strong>HttpOnly</strong> cookie cannot be read by JavaScript; <strong>Secure</strong> sends it only over HTTPS; <strong>SameSite=Lax or Strict</strong> stops most cross-site requests from carrying it, which defends against CSRF. A common, defensible design: a short-lived access token plus a refresh token in an HttpOnly, Secure, SameSite cookie, with a refresh endpoint.</p>',
  sau: ['If you use cookies, what do you still need against CSRF?'],
  loi: 'Claiming one place is perfectly safe — each has a threat it does not cover.' })}
${qa('en', { so: '6.3-9', q: 'Image previews of a file the user just picked are broken (400). The images work after upload. What could it be?', chu: 'debugging with the URL in front of you — a real bug.',
  a: '<p>In a real app, a helper that builds media URLs prefixed the CDN address onto every value — including the temporary <code>blob:</code> URL the browser creates for a local file preview — producing an invalid address. The fix: return <code>blob:</code> and <code>data:</code> URLs as they are, and only prefix bare storage keys. The habit that finds this in a minute: open the failing request in the Network tab and read the URL.</p>' + ma('ts', MA_BLOB),
  sau: ['When should you call URL.revokeObjectURL?'],
  loi: 'Blaming the CDN without looking at the actual URL.' })}

${bay('en', 'trusting the framework config when a proxy sits in front.', 'On a real site, <code>next.config.js</code> set a one-week cache header for a 94 MB folder of game assets — and it never took effect, because nginx in front removed every Cache-Control header and added <code>no-store</code>. The rule: the layer closest to the user wins. Verify headers with <code>curl -I</code> against the real URL, not by reading config.')}
${keXau('en', 'an attacker who finds a stored XSS on a site where the session token sits in localStorage can send that token to their own server and use the account from anywhere. A real interview answer that mentions HttpOnly cookies, sanitising user HTML and a Content Security Policy as layers is the kind that gets remembered.')}
${neu('en', 'a landscape video in a feed shows huge black bars above and below? On a real site, the video carousel forced a tall phone-shaped frame for every video. The fix was to read the real ratio (videoWidth and videoHeight after loadedmetadata, or stored metadata) and use it as the CSS aspect-ratio, keeping the tall frame only for portrait videos — which also reserves space and avoids layout shift.')}

${thucHanh('en', { phut: '30–40', steps: [
  'Explain "type a URL and press Enter" out loud in under three minutes; record it and check you covered network, server and rendering.',
  'Run Lighthouse on a page you built. Write down the LCP element, the LCP time, CLS and one concrete fix for each.',
  'Use only the keyboard on your own project: can you reach and use every button? Fix one problem you find.',
  'Run <code>curl -I</code> on one of your deployed pages and read every header; explain Cache-Control and any security headers.',
], dat: 'you have a Lighthouse report with your own notes, one accessibility fix committed, and a three-minute recording of the URL question.' })}
${thuatNgu('en', [
  ['Critical rendering path', 'The steps from bytes to pixels: DOM, CSSOM, render tree, layout, paint, composite.'],
  ['Render-blocking', 'A resource the browser must load before it can paint (CSS, synchronous scripts).'],
  ['LCP / INP / CLS', 'Loading, responsiveness and visual stability metrics (Core Web Vitals).'],
  ['Same-origin policy', 'The browser rule that pages may not read responses from other origins by default.'],
  ['CORS / preflight', 'Server headers that relax that rule / the OPTIONS request sent first.'],
  ['XSS', 'Injected script running in other users’ browsers on your site.'],
  ['HttpOnly / Secure / SameSite', 'Cookie flags: hidden from JS / HTTPS only / not sent cross-site.'],
])}
${tomTat('en', [
  'Know the full URL journey: DNS, TCP/TLS, HTTP, proxy, server, then DOM, CSSOM, layout, paint.',
  'CSS and synchronous scripts block rendering; defer and async change when scripts run.',
  'Core Web Vitals are LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; measure before fixing.',
  'Accessibility starts with semantic HTML and keyboard use, checked against WCAG.',
  'CORS is a browser rule fixed on the server; it is not authentication.',
  'Layer defences against XSS: escaping, sanitising, HttpOnly cookies, CSP.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', L: 'en', title: 'Networking 0.2 — What happens when you type a URL', sub: 'The network half of question 6.3-1, in depth.' }),
  lienKet({ khoa: 'nextjs', bai: 'nextjs-17-5-core-web-vitals', L: 'en', title: 'Next.js 17.5 — Core Web Vitals', sub: 'How Google measures "good", applied to a Next.js app.' }),
  lienKet({ khoa: 'authentication', bai: 'auth-4-5-cat-token-o-dau', L: 'en', title: 'Authentication 4.5 — Where to keep a token in the browser', sub: 'The trade-offs of question 6.3-8, measured.' }),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-8-1-cdn', L: 'en', title: 'Networking 8.1 — How a CDN works', sub: 'Why the edge and the proxy decide caching.' }),
  yt('F0NYT7DIlDQ', 'Chrome for Developers', 'Understanding performance with Core Web Vitals', 9, 'en'),
  nguon('📘', 'web.dev — Web Vitals', 'Google’s reference for the metrics and thresholds.', 'https://web.dev/articles/vitals'),
  nguon('📘', 'MDN — Critical rendering path', 'Mozilla’s explanation of every step.', 'https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Chính cái trình duyệt: những câu tách người dùng framework khỏi lập trình viên web</h2>
<p class="lead">Sau đoạn React, người phỏng vấn giỏi hay hỏi thứ mà không framework nào che được: "Gõ một URL rồi chuyện gì xảy ra?", "Vì sao trang này chậm?", "Vì sao CORS chặn request của em?". Những câu này kiểm tra bạn có hiểu nền tảng nằm dưới React không. Đây cũng là chỗ ứng viên Việt Nam mất điểm nhiều nhất, vì môn ở trường hiếm khi dạy tới. Bài này cho bạn mô hình, chín câu hỏi, và hai lỗi production thật.</p>

<h3>Liên tưởng đời thường: lắp đồ nội thất tháo rời</h3>
${doiThuong('vi', 'Trình duyệt nhận một trang giống như một người lắp tủ tháo rời mua online. Tờ hướng dẫn (HTML) nói có những bộ phận nào; bảng kích thước (CSS) nói to nhỏ, màu sắc từng cái; người lắp không thể bắt đầu ráp (vẽ lên màn hình) khi chưa có đủ cả hai, và nếu một người phụ (JavaScript) cứ đi vào xê dịch đồ thì phải làm lại từ đầu. Tối ưu hiệu năng phần lớn là: giao hướng dẫn sớm, đừng bắt người lắp chờ người phụ chậm chạp, và chừa sẵn chỗ cho bộ phận tới muộn.')}

<h3>Critical rendering path (đường render then chốt)</h3>
${flow([
  ['1 · Mạng', 'DNS → TCP → TLS → request HTTP', 'Tìm máy chủ, mở kết nối, mã hoá nó, xin HTML. Một CDN ở gần người dùng rút ngắn tất cả những bước này.'],
  ['2 · Phân tích HTML → DOM', 'cây các phần tử', 'Việc phân tích DỪNG ở một thẻ &lt;script&gt; thường cho tới khi tải và chạy xong — vì vậy script dùng defer hoặc async.'],
  ['3 · Phân tích CSS → CSSOM', 'cây các kiểu dáng', 'CSS chặn render: chưa vẽ gì cho tới khi CSS cần cho trang sẵn sàng.'],
  ['4 · Cây render → layout', 'tính kích thước và vị trí', 'Đổi hình học (width, top, cỡ chữ) buộc layout chạy lại — đắt khi lặp lại nhiều lần.'],
  ['5 · Paint → composite', 'điểm ảnh lên màn hình', 'Hiệu ứng bằng transform và opacity có thể bỏ qua layout và paint, vì vậy chúng mượt.'],
])}

<h3>Core Web Vitals, những con số Google dùng</h3>
${bang(['Chỉ số', 'Đo cái gì', 'Tốt (phân vị 75)', 'Cách sửa thường gặp'], [
  ['LCP — Largest Contentful Paint', 'lúc nội dung chính hiện ra', '≤ 2,5 giây', 'Máy chủ/CDN nhanh, preload ảnh chính, tránh tài nguyên chặn render'],
  ['INP — Interaction to Next Paint', 'trang phản hồi bấm, gõ nhanh tới đâu', '≤ 200 ms', 'Bớt JavaScript trên luồng chính, chia nhỏ việc dài, hoãn việc không gấp'],
  ['CLS — Cumulative Layout Shift', 'bố cục nhảy nhiều tới đâu', '≤ 0,1', 'Đặt width và height cho ảnh, video; giữ chỗ cho quảng cáo và khung nhúng'],
])}
<p>INP thay First Input Delay cũ trong bộ Core Web Vitals từ tháng 3/2024 — nhắc điều đó cho thấy bạn đọc tài liệu mới.</p>

<h3>Chín câu hỏi</h3>
${qa('vi', { so: '6.3-1', q: 'Gõ một URL rồi nhấn Enter, từng bước chuyện gì xảy ra?', chu: 'bức tranh trọn vẹn, và chỗ nào bạn đào sâu được.',
  a: '<p>Trình duyệt xem cache của nó; phân giải tên miền qua DNS ra địa chỉ IP; mở kết nối TCP (hoặc QUIC với HTTP/3) và bắt tay TLS cho HTTPS; gửi request HTTP; request có thể đi qua CDN và một reverse proxy như nginx trước khi tới máy chủ ứng dụng, nơi trả HTML về. Rồi trình duyệt phân tích HTML thành DOM, CSS thành CSSOM, dựng cây render, layout, paint và composite, trong lúc song song tải ảnh, script và font. Sau đó JavaScript chạy và, với app React, hydrate trang.</p>',
  sau: ['Trong chuỗi đó, một lỗi 502 sinh ra ở đâu?', 'Cái gì được cache, ở đâu?'],
  loi: 'Dừng ở "máy chủ trả HTML về" — nửa render mới là nửa của frontend.' })}
${qa('vi', { so: '6.3-2', q: 'defer và async trên thẻ script làm gì?', chu: 'chặn render.',
  a: '<p>Một script thường chặn việc phân tích HTML trong lúc tải và chạy. <code>async</code> tải song song và chạy ngay khi tới, thứ tự bất kỳ — hợp với script độc lập như thống kê. <code>defer</code> tải song song và chạy sau khi phân tích xong, đúng thứ tự trong tài liệu — hợp với code ứng dụng của bạn. Module (<code>type="module"</code>) mặc định đã là defer.</p>',
  sau: ['Vì sao để CSS trong head nhưng script ở cuối hoặc kèm defer?'],
  loi: 'Nhầm cái nào giữ thứ tự.' })}
${qa('vi', { so: '6.3-3', q: 'Một trang có LCP kém. Em điều tra thế nào?', chu: 'đo trước.',
  a: '<p>Đo trước: Lighthouse và bảng Performance trong Chrome DevTools cho dữ liệu phòng thí nghiệm, PageSpeed Insights hoặc dữ liệu người dùng thật cho dữ liệu thực địa. Xác định phần tử nào là phần tử LCP — thường là ảnh chính hoặc một tiêu đề. Rồi xem bốn khúc trong dòng thời gian của nó: thời gian tới byte đầu (máy chủ, CDN, cache), độ trễ phát hiện tài nguyên (ảnh có bị phát hiện muộn không, ví dụ do JavaScript gán?), thời gian tải (cỡ và định dạng), và độ trễ render (CSS hay JS chặn render). Sửa khúc lớn nhất trước.</p>',
  sau: ['Dữ liệu phòng thí nghiệm khác dữ liệu thực địa thế nào?'],
  loi: '"Nén hết lại." Không biết phần tử nào, khúc nào thì chỉ là đoán.' })}
${qa('vi', { so: '6.3-4', q: 'Giải thích box model của CSS, và khi nào dùng Flexbox, khi nào dùng Grid.', chu: 'CSS cơ bản mà nhiều người bỏ qua.',
  a: '<p>Mọi phần tử là một cái hộp: nội dung, padding, border, margin. <code>box-sizing: border-box</code> làm width tính luôn padding và border, vì vậy hầu hết bộ reset dùng nó. Flexbox xếp phần tử theo <strong>một trục</strong> — thanh công cụ, một hàng nút, canh giữa một thứ. Grid xếp theo <strong>hai chiều</strong> — bố cục trang, bộ sưu tập thẻ có hàng và cột. Em hay dùng Grid cho khung trang và Flexbox bên trong từng component.</p>',
  sau: ['Canh giữa một div theo cả hai chiều thế nào?', 'Specificity (độ ưu tiên) là gì, vì sao !important là dấu hiệu xấu?'],
  loi: '"Em chỉ dùng class Tailwind." Tailwind chính là CSS; người phỏng vấn muốn mô hình nằm dưới nó.' })}
${qa('vi', { so: '6.3-5', q: 'Khả năng tiếp cận (accessibility) với lập trình viên frontend cụ thể là gì?', chu: 'bạn có làm cho mọi người dùng không.',
  a: '<p>Dùng HTML có ngữ nghĩa trước: <code>button</code> cho hành động, <code>a</code> cho điều hướng, tiêu đề đúng thứ tự, <code>label</code> gắn với mọi ô nhập. Ảnh nào mang ý nghĩa đều có chữ <code>alt</code>. Mọi thứ dùng được bằng bàn phím và thấy rõ vị trí focus. Độ tương phản màu đủ. Chỉ dùng thuộc tính ARIA khi HTML không có phần tử sẵn. Em kiểm bằng cách chỉ dùng bàn phím, bằng mục accessibility của Lighthouse, và lý tưởng là một trình đọc màn hình. Chuẩn tham chiếu là WCAG của W3C.</p>',
  sau: ['Vì sao một div có onClick tệ hơn một button?'],
  loi: 'Chỉ trả lời "thêm aria-label".' })}
${qa('vi', { so: '6.3-6', q: 'XSS là gì và em chặn nó trong app React thế nào?', chu: 'lỗ hổng web phổ biến nhất ở phía frontend.',
  a: '<p>Cross-site scripting là khi kẻ tấn công khiến script của họ chạy trong trình duyệt của người dùng khác trên trang của bạn — thường bằng cách lưu HTML hay JavaScript vào một trường mà sau đó được render không thoát. Nó có thể lấy cắp token phiên hoặc thao tác thay người dùng. Trong React, chữ render bằng ngoặc nhọn được thoát tự động. Rủi ro nằm ở <code>dangerouslySetInnerHTML</code>, dựng URL từ dữ liệu người dùng (link <code>javascript:</code>), và script bên thứ ba. Phòng: làm sạch mọi HTML bằng thư viện như DOMPurify, kiểm URL, giữ token trong cookie HttpOnly, và thêm Content Security Policy.</p>',
  sau: ['XSS lưu trữ (stored) khác XSS phản xạ (reflected) thế nào?', 'Content Security Policy làm gì?'],
  loi: '"React chặn XSS rồi." Phần lớn thôi — không chặn ở ba chỗ trên.' })}
${qa('vi', { so: '6.3-7', q: 'Frontend gọi API và trình duyệt báo "blocked by CORS policy". Chuyện gì đang xảy ra?', chu: 'hiểu lầm mà junior nào cũng có.',
  a: '<p>Trình duyệt áp chính sách cùng nguồn gốc (same-origin policy): một trang từ một origin (giao thức + host + cổng) không được đọc phản hồi từ origin khác, trừ khi máy chủ kia cho phép bằng header CORS như <code>Access-Control-Allow-Origin</code>. Với request không đơn giản (thân JSON, header tự đặt), trình duyệt gửi trước một request OPTIONS gọi là preflight. Cách sửa nằm ở <strong>máy chủ</strong>: cho phép đúng origin của frontend, các method và header, và credentials nếu dùng cookie. CORS là luật của trình duyệt, không phải bảo mật máy chủ — curl hay Postman không bị ảnh hưởng — nên nó không bao giờ thay được xác thực.</p>',
  sau: ['Vì sao không dùng được "*" cùng credentials?', 'Proxy lúc dev tránh CORS ở máy mình thế nào?'],
  loi: 'Cài một tiện ích trình duyệt tắt CORS rồi coi như đã sửa.' })}
${qa('vi', { so: '6.3-8', q: 'Token xác thực nên nằm ở đâu trong trình duyệt, và HttpOnly, Secure, SameSite làm gì?', chu: 'sự đánh đổi về bảo mật.',
  a: '<p><code>localStorage</code> thì script nào trên trang cũng đọc được, nên một lỗi XSS là lộ token. Cookie <strong>HttpOnly</strong> thì JavaScript không đọc được; <strong>Secure</strong> chỉ gửi qua HTTPS; <strong>SameSite=Lax hoặc Strict</strong> chặn phần lớn request chéo trang mang cookie theo, chống được CSRF. Một thiết kế phổ biến, bảo vệ được: access token sống ngắn cộng refresh token trong cookie HttpOnly, Secure, SameSite, kèm một endpoint refresh.</p>',
  sau: ['Dùng cookie thì chống CSRF còn cần gì nữa?'],
  loi: 'Khẳng định một chỗ an toàn tuyệt đối — chỗ nào cũng có một mối đe doạ nó không che được.' })}
${qa('vi', { so: '6.3-9', q: 'Ảnh xem trước của tệp người dùng vừa chọn bị hỏng (400). Sau khi upload thì ảnh lại hiện. Có thể là gì?', chu: 'gỡ lỗi khi URL nằm ngay trước mắt — một lỗi thật.',
  a: '<p>Trong một app thật, hàm dựng URL media gắn địa chỉ CDN vào trước MỌI giá trị — kể cả URL <code>blob:</code> tạm thời mà trình duyệt tạo cho ảnh xem trước của tệp trên máy — sinh ra một địa chỉ vô nghĩa. Cách sửa: trả nguyên URL <code>blob:</code> và <code>data:</code>, chỉ gắn tiền tố cho key lưu trữ trần. Thói quen tìm ra lỗi này trong một phút: mở request hỏng trong thẻ Network và ĐỌC cái URL.</p>' + ma('ts', MA_BLOB),
  sau: ['Khi nào nên gọi URL.revokeObjectURL?'],
  loi: 'Đổ cho CDN mà không nhìn URL thật.' })}

${bay('vi', 'tin cấu hình của framework khi có một proxy đứng trước.', 'Trên một trang thật, <code>next.config.js</code> đặt header cache một tuần cho một thư mục 94 MB tài nguyên game — và nó chưa từng có hiệu lực ngày nào, vì nginx đứng trước gỡ mọi header Cache-Control rồi dán <code>no-store</code>. Luật: tầng gần người dùng nhất thắng. Kiểm header bằng <code>curl -I</code> lên URL thật, đừng đọc cấu hình rồi tin.')}
${keXau('vi', 'kẻ tấn công tìm được một lỗi XSS lưu trữ trên trang mà token phiên nằm trong localStorage sẽ gửi token đó về máy chủ của họ và dùng tài khoản từ bất cứ đâu. Một câu trả lời phỏng vấn nêu ra các lớp phòng thủ — cookie HttpOnly, làm sạch HTML người dùng, Content Security Policy — là kiểu câu được nhớ.')}
${neu('vi', 'một video ngang trong bảng tin hiện hai dải đen khổng lồ trên và dưới? Trên một trang thật, băng chuyền video ép mọi video vào khung dọc kiểu điện thoại. Cách sửa: đọc tỉ lệ thật (videoWidth và videoHeight sau sự kiện loadedmetadata, hoặc siêu dữ liệu đã lưu) rồi dùng làm aspect-ratio của CSS, chỉ giữ khung dọc cho video dọc — vừa đẹp vừa giữ chỗ trước, tránh xô lệch bố cục.')}

${thucHanh('vi', { phut: '30–40', steps: [
  'Giải thích "gõ URL rồi nhấn Enter" thành tiếng dưới ba phút; ghi âm lại và kiểm bạn đã nói đủ mạng, máy chủ và render.',
  'Chạy Lighthouse trên một trang bạn làm. Ghi phần tử LCP, thời gian LCP, CLS, và một cách sửa cụ thể cho mỗi cái.',
  'Chỉ dùng bàn phím trên dự án của bạn: có tới được và dùng được mọi nút không? Sửa một lỗi bạn tìm ra.',
  'Chạy <code>curl -I</code> lên một trang đã deploy của bạn và đọc từng header; giải thích Cache-Control và các header bảo mật nếu có.',
], dat: 'bạn có một báo cáo Lighthouse kèm ghi chú của mình, một bản sửa accessibility đã commit, và bản ghi ba phút cho câu hỏi URL.' })}
${thuatNgu('vi', [
  ['Critical rendering path (đường render then chốt)', 'Các bước từ byte tới điểm ảnh: DOM, CSSOM, cây render, layout, paint, composite.'],
  ['Render-blocking (chặn render)', 'Tài nguyên trình duyệt phải tải xong mới vẽ được (CSS, script đồng bộ).'],
  ['LCP / INP / CLS', 'Chỉ số tải, độ phản hồi và độ ổn định hình ảnh (Core Web Vitals).'],
  ['Same-origin policy (chính sách cùng nguồn gốc)', 'Luật trình duyệt: mặc định trang không được đọc phản hồi từ origin khác.'],
  ['CORS / preflight', 'Header phía máy chủ nới luật đó / request OPTIONS gửi trước.'],
  ['XSS (chèn script chéo trang)', 'Script bị chèn chạy trong trình duyệt của người dùng khác trên trang bạn.'],
  ['HttpOnly / Secure / SameSite', 'Cờ của cookie: JS không đọc được / chỉ qua HTTPS / không gửi chéo trang.'],
])}
${tomTat('vi', [
  'Nắm trọn hành trình của URL: DNS, TCP/TLS, HTTP, proxy, máy chủ, rồi DOM, CSSOM, layout, paint.',
  'CSS và script đồng bộ chặn render; defer và async đổi thời điểm script chạy.',
  'Core Web Vitals: LCP ≤ 2,5 giây, INP ≤ 200 ms, CLS ≤ 0,1; đo trước khi sửa.',
  'Khả năng tiếp cận bắt đầu từ HTML có ngữ nghĩa và dùng được bằng bàn phím, đối chiếu WCAG.',
  'CORS là luật trình duyệt, sửa ở máy chủ; nó không phải xác thực.',
  'Chống XSS nhiều lớp: thoát chữ, làm sạch HTML, cookie HttpOnly, CSP.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', title: 'Networking 0.2 — Gõ một URL rồi nhấn Enter thì chuyện gì xảy ra', sub: 'Nửa mạng của câu 6.3-1, đi sâu.' }),
  lienKet({ khoa: 'nextjs', bai: 'nextjs-17-5-core-web-vitals', title: 'Next.js 17.5 — Core Web Vitals', sub: 'Google đo "tốt" thế nào, áp vào app Next.js.' }),
  lienKet({ khoa: 'authentication', bai: 'auth-4-5-cat-token-o-dau', title: 'Authentication 4.5 — Cất token ở đâu trong trình duyệt', sub: 'Sự đánh đổi của câu 6.3-8, có đo thật.' }),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-8-1-cdn', title: 'Networking 8.1 — CDN hoạt động thế nào', sub: 'Vì sao edge và proxy quyết định chuyện cache.' }),
  yt('F0NYT7DIlDQ', 'Chrome for Developers', 'Understanding performance with Core Web Vitals', 9),
  nguon('📘', 'web.dev — Web Vitals', 'Tài liệu tham chiếu của Google về các chỉ số và ngưỡng (tiếng Anh).', 'https://web.dev/articles/vitals'),
  nguon('📘', 'MDN — Critical rendering path', 'Giải thích của Mozilla cho từng bước (tiếng Anh).', 'https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path'),
])}
</div>
`,
};

/* ═══════════════════════ 6.4 — Bài tập về nhà frontend ═══════════════════════ */
const README_EN = `
# Doctor Finder — take-home for <Company>

Live demo: https://<your-demo>.vercel.app        Time spent: ~7 hours over 2 days

## Run it
npm ci && npm run dev        # http://localhost:5173
npm test                     # 14 tests, Vitest + Testing Library

## What is done
- Search by name (debounced 300 ms), filter by specialty, sort by rating
- Loading, empty and error states; retry button on error
- Keyboard accessible; Lighthouse accessibility 100, performance 96 (mobile)

## Decisions
- TanStack Query for server state (cache + retry); URL query string for filters
  so a refresh or a shared link keeps them
- No UI library: the spec asked for a small bundle (gzip 61 kB)

## Not done / with more time
- Pagination is client-side; with 10,000 doctors I would page on the server
- No end-to-end test; I would add one Playwright test for search → detail

## AI use
I used an AI assistant for the initial test boilerplate and for CSS grid ideas.
I wrote and can explain every component; the commit history shows the steps.
`;

const README_VI = `
# Doctor Finder — bài làm ở nhà cho <Công ty>

Bản chạy thử: https://<demo-cua-ban>.vercel.app    Thời gian: ~7 giờ trong 2 ngày

## Chạy
npm ci && npm run dev        # http://localhost:5173
npm test                     # 14 test, Vitest + Testing Library

## Đã làm
- Tìm theo tên (debounce 300 ms), lọc theo chuyên khoa, sắp theo đánh giá
- Trạng thái đang tải, rỗng và lỗi; có nút thử lại khi lỗi
- Dùng được bằng bàn phím; Lighthouse accessibility 100, performance 96 (mobile)

## Quyết định
- TanStack Query cho server state (cache + thử lại); bộ lọc đặt trên query string
  của URL để F5 hay gửi link vẫn giữ được
- Không dùng thư viện UI: đề yêu cầu gói nhỏ (gzip 61 kB)

## Chưa làm / nếu có thêm thời gian
- Phân trang đang ở client; với 10.000 bác sĩ em sẽ phân trang ở máy chủ
- Chưa có test end-to-end; em sẽ thêm một test Playwright cho tìm → xem chi tiết

## Dùng AI
Em dùng trợ lý AI cho khung test ban đầu và gợi ý CSS grid.
Em tự viết và giải thích được mọi component; lịch sử commit cho thấy từng bước.
`;

const L64 = {
  title: '6.4 — Take-home frontend assignments: scope, README, tests, deploy — and the review call afterwards|||6.4 — Bài tập về nhà frontend: phạm vi, README, test, deploy — và buổi review sau đó',
  slug: 'pv-6-4-bai-tap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Làm bài tập frontend ở nhà sao cho nổi bật mà không ôm đồm: đọc đề và hỏi lại, chia thời gian, bốn trạng thái của mọi màn hình, README như mẫu, vài test có ý nghĩa, deploy một đường link, lịch sử commit sạch, nói thật về AI — và tám câu hay gặp trong buổi review bài.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Take-home frontend assignments: how to stand out without overbuilding</h2>
<p class="lead">Many frontend internship processes in Vietnam replace live coding with a small take-home: "build a page that lists X from this API, with search and filters, in three days". It looks easy, which is the trap — everybody can make it work. What separates candidates is everything around the working code: what you chose not to build, how the app behaves when the API fails, how easy it is to run, and whether you can defend every line in the review call afterwards.</p>

<h3>An everyday picture: a trial dish at a restaurant</h3>
${doiThuong('en', 'A cook applying to a restaurant is asked to make one dish at home and bring it. The head chef does not only taste it; they look at the plate, ask why you chose that sauce, and whether you could make it for fifty people on a Friday night. A take-home is that dish. The taste is "it works"; the plate is the README and the states of the UI; the questions are the review call.')}

<h3>A timeline for a three-day assignment</h3>
${flow([
  ['Hour 0–1', 'read, ask, plan', 'Read the brief twice. Send one email with your clarifying questions and your assumptions. Write the list of must-haves and nice-to-haves.'],
  ['Day 1', 'the skeleton end to end', 'Fetch real data and show it, ugly but complete. Commit early with clear messages.'],
  ['Day 2', 'states, quality, tests', 'Loading, empty, error and success for every screen; keyboard and labels; a handful of meaningful tests.'],
  ['Day 3 (half)', 'polish, deploy, README', 'Deploy to a free host, write the README, read your own code as a reviewer, then stop.'],
])}

<h3>What reviewers actually check</h3>
${bang(['Area', 'Weak submission', 'Strong submission'], [
  ['Runs', '"Works on my machine", missing steps', 'npm ci and one command; a live link'],
  ['States', 'Only the happy path', 'Loading, empty, error with retry, success'],
  ['Structure', 'One 600-line component', 'Small components, data fetching separated from display'],
  ['Tests', 'None, or a snapshot of everything', 'A few tests of behaviour a user cares about'],
  ['Accessibility', 'Divs with onClick', 'Buttons, labels, keyboard works'],
  ['Git', 'One commit "done"', 'Readable steps: feat, fix, test, docs'],
  ['README', 'Missing', 'Run, decisions, trade-offs, not-done, AI use'],
])}
<p>A README in this spirit — short, honest and specific — is often the first thing the reviewer reads:</p>
${ra(README_EN)}

<h3>Questions from the review call</h3>
${qa('en', { so: '6.4-1', q: 'Walk me through your code — where would you start?', chu: 'whether you can give a map before details.',
  a: '<p>Start with the shape, not the first file: "The app has three parts: the data layer (a hook around TanStack Query that calls the API), the page that owns the filters in the URL, and presentational components that only receive props. Let me open the hook first, because everything flows from it." Then follow one user action end to end.</p>',
  sau: ['Why did you put the filters in the URL?'], loi: 'Scrolling through files in alphabetical order.' })}
${qa('en', { so: '6.4-2', q: 'What would you change with another week?', chu: 'honest self-assessment and priorities.',
  a: '<p>Name two or three things in priority order, each with a reason: "Server-side pagination first, because the client-side version will not scale past a few thousand items; then an end-to-end test of the main flow; then extracting the filter bar into a reusable component." It shows you know the weak spots — which they have already seen.</p>',
  sau: ['Which of these is risky right now?'], loi: '"Nothing, I think it is complete."' })}
${qa('en', { so: '6.4-3', q: 'How would this behave with 10,000 items?', chu: 'scaling thinking on the frontend.',
  a: '<p>Rendering 10,000 rows would make the page slow — long initial render and slow interactions. Two levels of fix: fetch fewer (server-side pagination or infinite scrolling with a cursor), and render fewer (virtualise the list so only visible rows are in the DOM). Searching should then happen on the server too, with a debounce on the input.</p>',
  sau: ['What is list virtualisation?'], loi: '"I would add React.memo."' })}
${qa('en', { so: '6.4-4', q: 'Why did you choose this library?', chu: 'decisions with reasons.',
  a: '<p>Answer with the problem it solved and the alternative you rejected: "I used TanStack Query because the brief needed caching between the list and the detail page and a retry on failure; doing it by hand with useEffect would have meant re-implementing cache keys and race handling. I did not add Redux because there is no shared client state beyond the filters, which live in the URL."</p>',
  sau: ['What would you do without any library?'], loi: '"Because everyone uses it."' })}
${qa('en', { so: '6.4-5', q: 'Change this: make the sort remember the user’s last choice.', chu: 'whether the code is really yours — live modification.',
  a: '<p>Think aloud: "Where is the sort state? In the URL. To remember it across visits I can store the last choice in localStorage and use it as the default when the URL has none — reading it after mount to avoid a hydration mismatch." Then make the change in small steps and run the app. This is the moment where AI-written code that you do not understand falls apart.</p>',
  sau: ['What happens if localStorage is unavailable (private mode)?'], loi: 'Freezing because you have never read that part of your own code.' })}
${qa('en', { so: '6.4-6', q: 'How did you test it, and what did you choose not to test?', chu: 'testing judgement.',
  a: '<p>"I tested behaviour a user sees: typing in search filters the list, the error state shows a retry button that refetches, the empty state appears for no results. I mocked the network at the HTTP level with MSW, not the hook, so the tests survive refactoring. I did not test styling or third-party library internals."</p>',
  sau: ['Why mock at the network level?'], loi: '"I did not have time to test."' })}
${qa('en', { so: '6.4-7', q: 'Did you use AI? How?', chu: 'honesty and judgement — asked more and more often.',
  a: '<p>Say exactly what you used it for and what you checked: "Yes — for test boilerplate and CSS grid ideas. I reviewed and rewrote what it suggested; I can explain every component, and the commit history shows how it evolved." Many companies allow AI; almost none forgive hiding it.</p>',
  sau: ['Show me a suggestion from the AI that you rejected, and why.'], loi: 'Denying it when the code style obviously changes from file to file.' })}
${qa('en', { so: '6.4-8', q: 'What would you do if the API returned errors half of the time?', chu: 'resilience and user experience.',
  a: '<p>Show a clear error state with a retry, retry automatically a limited number of times with backoff for idempotent GET requests, keep showing the last good data where possible instead of a blank screen, and report the error to monitoring. And I would tell the backend team with an example request — the frontend should not hide a broken API forever.</p>',
  sau: ['Why only for idempotent requests?'], loi: 'Retrying forever without a limit.' })}

${bay('en', 'building every "bonus" feature and missing the basics.', 'Dark mode, animations and a custom design system impress nobody if the app shows a blank screen when the API is slow, or the reviewer cannot run it. Finish the must-haves with all four states, deploy, write the README — then, if time remains, add one bonus and say so.')}
${keXau('en', 'a take-home that comes with a repository you must <em>run</em> before you start is a known malware route against developers (the "Contagious Interview" campaign from Lesson 0.9). Read <code>package.json</code> scripts before installing, run unknown projects in a container or VM, and never paste real API keys or your own tokens into a take-home repository — use the test keys they give you, and do not commit <code>.env</code>.')}
${neu('en', 'the deadline is in three days but you have exams? Reply the same day, thank them, and ask honestly for a later date — "I have a final exam on Wednesday; could I submit on Saturday instead?". Most companies agree. Submitting a rushed version on time is worse than a good version one day late that you asked for.')}

${thucHanh('en', { phut: '120–180', steps: [
  'Pick a free public API (for example a country list or a public library catalogue) and give yourself the brief: list, search with debounce, one filter, detail view.',
  'Time-box it to six hours in total. Implement all four states for the list and the detail.',
  'Write three behaviour tests with Testing Library and MSW, deploy to a free host, and write a README using the template above.',
  'Ask a friend to do the review call with the eight questions; record it.',
], dat: 'a public repository with a live link, a README with decisions and not-done, three passing tests, and a recording of a review where you modified code live.' })}
${thuatNgu('en', [
  ['Take-home', 'An assignment done at home over a few days, followed by a review.'],
  ['Brief / spec', 'The written description of what to build.'],
  ['Time-box', 'A fixed amount of time you allow yourself for a task.'],
  ['Four UI states', 'Loading, empty, error and success — every data screen needs them.'],
  ['MSW (Mock Service Worker)', 'A tool that intercepts network requests in tests and dev.'],
  ['Virtualisation', 'Rendering only the visible rows of a long list.'],
])}
${tomTat('en', [
  'Everyone makes a take-home work; you stand out with states, structure, tests, README and a live link.',
  'Ask clarifying questions early, time-box, and finish must-haves before bonuses.',
  'The README states how to run it, decisions, trade-offs, what is not done, and how AI was used.',
  'Prepare for the review call: map first, priorities for "another week", scaling to many items, live changes.',
  'Treat unknown repositories as untrusted: read scripts, run in isolation, never commit secrets.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'react', bai: 'rx-14-4-phong-van', L: 'en', title: 'React 14.4 — Production checklist and interview questions', sub: 'The quality bar a reviewer applies to a React take-home.' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-1-kim-tu-thap', L: 'en', title: 'Testing 0.2 — The test pyramid', sub: 'Which tests are worth writing in a small take-home.' }),
  yt('HgC57v69AEs', 'Sean Allen', 'Software Dev Job Interview — Take Home Project Questions', 8, 'en'),
  nguon('📘', 'Front End Interview Handbook', 'A free guide to frontend interview formats, including take-homes.', 'https://www.frontendinterviewhandbook.com/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Bài tập về nhà frontend: nổi bật mà không ôm đồm</h2>
<p class="lead">Nhiều quy trình thực tập frontend ở Việt Nam thay code trực tiếp bằng một bài nhỏ làm ở nhà: "dựng một trang liệt kê X từ API này, có tìm kiếm và bộ lọc, trong ba ngày". Trông dễ, và đó chính là cái bẫy — ai cũng làm cho nó chạy được. Thứ phân biệt các ứng viên là mọi thứ xung quanh đoạn code chạy được: bạn chọn KHÔNG làm gì, app cư xử ra sao khi API lỗi, chạy lên dễ tới mức nào, và bạn có bảo vệ được từng dòng trong buổi review sau đó không.</p>

<h3>Liên tưởng đời thường: món ăn thử tay nghề ở nhà hàng</h3>
${doiThuong('vi', 'Một đầu bếp xin vào nhà hàng được giao làm một món ở nhà rồi mang tới. Bếp trưởng không chỉ nếm; họ nhìn cách bày đĩa, hỏi vì sao chọn nước sốt đó, và liệu bạn có nấu được cho năm mươi người vào tối thứ Sáu không. Bài làm ở nhà chính là món đó. Vị là "nó chạy được"; cách bày là README và các trạng thái của giao diện; câu hỏi là buổi review.')}

<h3>Lịch làm cho một bài ba ngày</h3>
${flow([
  ['Giờ 0–1', 'đọc, hỏi, lập kế hoạch', 'Đọc đề hai lần. Gửi một email gồm các câu hỏi làm rõ và những giả định của bạn. Viết danh sách việc bắt buộc và việc thêm.'],
  ['Ngày 1', 'bộ khung chạy từ đầu tới cuối', 'Gọi dữ liệu thật và hiện ra, xấu nhưng trọn vẹn. Commit sớm với thông điệp rõ ràng.'],
  ['Ngày 2', 'trạng thái, chất lượng, test', 'Đang tải, rỗng, lỗi và thành công cho mọi màn hình; bàn phím và nhãn; vài test có ý nghĩa.'],
  ['Ngày 3 (nửa ngày)', 'đánh bóng, deploy, README', 'Deploy lên một host miễn phí, viết README, đọc lại code của mình như một người review, rồi DỪNG.'],
])}

<h3>Người review thật sự kiểm gì</h3>
${bang(['Mảng', 'Bài nộp yếu', 'Bài nộp mạnh'], [
  ['Chạy được', '"Máy em chạy được", thiếu bước', 'npm ci và một lệnh; có link chạy thử'],
  ['Trạng thái', 'Chỉ đường suôn sẻ', 'Đang tải, rỗng, lỗi có nút thử lại, thành công'],
  ['Cấu trúc', 'Một component 600 dòng', 'Component nhỏ, phần gọi dữ liệu tách khỏi phần hiển thị'],
  ['Test', 'Không có, hoặc snapshot toàn bộ', 'Vài test về hành vi mà người dùng quan tâm'],
  ['Khả năng tiếp cận', 'Div kèm onClick', 'Button, label, dùng bàn phím được'],
  ['Git', 'Một commit "done"', 'Các bước đọc được: feat, fix, test, docs'],
  ['README', 'Không có', 'Cách chạy, quyết định, đánh đổi, chưa làm, dùng AI'],
])}
<p>Một README theo tinh thần này — ngắn, thật, cụ thể — thường là thứ đầu tiên người review đọc:</p>
${ra(README_VI)}

<h3>Câu hỏi trong buổi review</h3>
${qa('vi', { so: '6.4-1', q: 'Dẫn anh đi qua code của em — em bắt đầu từ đâu?', chu: 'bạn có đưa ra bản đồ trước chi tiết không.',
  a: '<p>Bắt đầu bằng hình dạng, không phải tệp đầu tiên: "App có ba phần: tầng dữ liệu (một hook bọc TanStack Query gọi API), trang giữ bộ lọc trên URL, và các component trình bày chỉ nhận props. Em mở hook trước, vì mọi thứ chảy ra từ đó." Rồi đi theo MỘT hành động của người dùng từ đầu tới cuối.</p>',
  sau: ['Vì sao em đặt bộ lọc trên URL?'], loi: 'Cuộn qua các tệp theo thứ tự bảng chữ cái.' })}
${qa('vi', { so: '6.4-2', q: 'Có thêm một tuần em sẽ đổi gì?', chu: 'tự đánh giá trung thực và thứ tự ưu tiên.',
  a: '<p>Nêu hai ba thứ theo thứ tự ưu tiên, mỗi thứ một lý do: "Đầu tiên phân trang ở máy chủ, vì bản ở client không chịu nổi quá vài nghìn phần tử; rồi một test end-to-end cho luồng chính; rồi tách thanh lọc thành component dùng lại được." Nó cho thấy bạn biết điểm yếu — thứ họ đã thấy rồi.</p>',
  sau: ['Cái nào trong số đó đang rủi ro ngay bây giờ?'], loi: '"Không có gì ạ, em nghĩ là xong rồi."' })}
${qa('vi', { so: '6.4-3', q: 'Với 10.000 phần tử thì app này ra sao?', chu: 'tư duy mở rộng ở frontend.',
  a: '<p>Render 10.000 dòng làm trang chậm — render lần đầu lâu và tương tác ì. Hai mức sửa: lấy ít hơn (phân trang ở máy chủ, hoặc cuộn vô tận với cursor), và vẽ ít hơn (ảo hoá danh sách — virtualise — để chỉ những dòng đang thấy nằm trong DOM). Tìm kiếm khi đó cũng nên làm ở máy chủ, kèm debounce trên ô nhập.</p>',
  sau: ['Ảo hoá danh sách là gì?'], loi: '"Em sẽ thêm React.memo."' })}
${qa('vi', { so: '6.4-4', q: 'Vì sao em chọn thư viện này?', chu: 'quyết định có lý do.',
  a: '<p>Trả lời bằng vấn đề nó giải và lựa chọn bạn đã loại: "Em dùng TanStack Query vì đề cần cache giữa trang danh sách và trang chi tiết và thử lại khi lỗi; tự làm bằng useEffect nghĩa là tự viết lại khoá cache và xử lý cuộc đua. Em không thêm Redux vì ngoài bộ lọc ra không có state client dùng chung, mà bộ lọc thì nằm trên URL."</p>',
  sau: ['Không có thư viện nào thì em làm sao?'], loi: '"Vì ai cũng dùng."' })}
${qa('vi', { so: '6.4-5', q: 'Sửa giúp anh: cho phần sắp xếp nhớ lựa chọn lần trước của người dùng.', chu: 'code có thật là của bạn không — sửa trực tiếp.',
  a: '<p>Nghĩ thành tiếng: "State sắp xếp đang ở đâu? Ở URL. Để nhớ qua các lần ghé, em lưu lựa chọn cuối vào localStorage và dùng làm mặc định khi URL không có — đọc nó sau khi mount để tránh lệch hydration." Rồi sửa từng bước nhỏ và chạy app. Đây là khoảnh khắc code do AI viết mà bạn không hiểu sụp đổ.</p>',
  sau: ['Nếu localStorage không dùng được (chế độ ẩn danh) thì sao?'], loi: 'Đứng hình vì chưa từng đọc phần đó trong chính code của mình.' })}
${qa('vi', { so: '6.4-6', q: 'Em test thế nào, và chọn không test cái gì?', chu: 'óc phán đoán về test.',
  a: '<p>"Em test hành vi người dùng thấy: gõ tìm kiếm thì danh sách lọc, trạng thái lỗi hiện nút thử lại và bấm thì gọi lại, không có kết quả thì hiện trạng thái rỗng. Em giả lập mạng ở tầng HTTP bằng MSW chứ không giả lập hook, nên test sống sót qua refactor. Em không test kiểu dáng hay phần bên trong của thư viện bên thứ ba."</p>',
  sau: ['Vì sao giả lập ở tầng mạng?'], loi: '"Em không có thời gian viết test."' })}
${qa('vi', { so: '6.4-7', q: 'Em có dùng AI không? Dùng thế nào?', chu: 'trung thực và óc phán đoán — được hỏi ngày càng nhiều.',
  a: '<p>Nói đúng bạn dùng để làm gì và đã kiểm gì: "Có ạ — cho khung test và gợi ý CSS grid. Em đọc lại và viết lại những gì nó gợi ý; em giải thích được mọi component, và lịch sử commit cho thấy nó phát triển ra sao." Nhiều công ty cho phép dùng AI; gần như không công ty nào bỏ qua việc giấu nó.</p>',
  sau: ['Cho anh xem một gợi ý của AI mà em đã bỏ, và vì sao.'], loi: 'Chối khi văn phong code rõ ràng đổi từ tệp này sang tệp khác.' })}
${qa('vi', { so: '6.4-8', q: 'Nếu API trả lỗi một nửa số lần thì em làm gì?', chu: 'khả năng chịu lỗi và trải nghiệm người dùng.',
  a: '<p>Hiện trạng thái lỗi rõ ràng kèm nút thử lại, tự thử lại một số lần có giới hạn với độ giãn (backoff) cho các request GET idempotent, giữ hiện dữ liệu tốt gần nhất khi có thể thay vì màn trắng, và báo lỗi về hệ thống giám sát. Và em sẽ báo đội backend kèm một request ví dụ — frontend không nên che một API hỏng mãi mãi.</p>',
  sau: ['Vì sao chỉ với request idempotent?'], loi: 'Thử lại mãi mãi không giới hạn.' })}

${bay('vi', 'làm mọi tính năng "thưởng" mà bỏ sót phần cơ bản.', 'Chế độ tối, hiệu ứng động, hệ thiết kế riêng chẳng gây ấn tượng với ai nếu app hiện màn trắng khi API chậm, hoặc người review không chạy lên được. Hoàn thành phần bắt buộc với đủ bốn trạng thái, deploy, viết README — rồi nếu còn thời gian, thêm MỘT thứ thưởng và nói rõ.')}
${keXau('vi', 'một bài làm ở nhà đi kèm kho mã bạn phải <em>chạy</em> trước khi bắt đầu là đường lây mã độc đã biết nhắm vào lập trình viên (chiến dịch "Contagious Interview" ở bài 0.9). Đọc phần scripts trong <code>package.json</code> trước khi cài, chạy dự án lạ trong container hoặc máy ảo, và không bao giờ dán khoá API thật hay token của chính bạn vào kho bài làm — dùng khoá thử họ đưa, và không commit <code>.env</code>.')}
${neu('vi', 'hạn nộp là ba ngày nữa nhưng bạn đang thi? Trả lời ngay trong ngày, cảm ơn, và thành thật xin lùi hạn — "Em có bài thi cuối kỳ hôm thứ Tư; em xin nộp vào thứ Bảy được không ạ?". Đa số công ty đồng ý. Nộp đúng hạn một bản vội vàng còn tệ hơn nộp muộn một ngày một bản tốt mà bạn đã xin phép.')}

${thucHanh('vi', { phut: '120–180', steps: [
  'Chọn một API công khai miễn phí (ví dụ danh sách quốc gia hoặc danh mục thư viện công khai) và tự giao đề: danh sách, tìm kiếm có debounce, một bộ lọc, trang chi tiết.',
  'Giới hạn tổng cộng sáu giờ. Làm đủ bốn trạng thái cho danh sách và chi tiết.',
  'Viết ba test hành vi bằng Testing Library và MSW, deploy lên host miễn phí, và viết README theo mẫu ở trên.',
  'Nhờ một người bạn đóng vai buổi review với tám câu hỏi; ghi âm lại.',
], dat: 'một kho mã công khai có link chạy thử, README có quyết định và phần chưa làm, ba test chạy xanh, và bản ghi một buổi review trong đó bạn sửa code trực tiếp.' })}
${thuatNgu('vi', [
  ['Take-home (bài làm ở nhà)', 'Bài làm ở nhà trong vài ngày, sau đó có buổi review.'],
  ['Brief / spec (đề bài / đặc tả)', 'Bản mô tả bằng chữ những gì phải làm.'],
  ['Time-box (khung thời gian)', 'Lượng thời gian cố định bạn tự cho phép cho một việc.'],
  ['Bốn trạng thái giao diện', 'Đang tải, rỗng, lỗi và thành công — màn dữ liệu nào cũng cần.'],
  ['MSW (Mock Service Worker)', 'Công cụ chặn request mạng trong test và lúc dev.'],
  ['Virtualisation (ảo hoá danh sách)', 'Chỉ vẽ những dòng đang thấy của một danh sách dài.'],
])}
${tomTat('vi', [
  'Ai cũng làm bài ở nhà chạy được; bạn nổi bật nhờ trạng thái, cấu trúc, test, README và link chạy thử.',
  'Hỏi làm rõ sớm, giới hạn thời gian, xong phần bắt buộc trước phần thưởng.',
  'README nói cách chạy, quyết định, đánh đổi, phần chưa làm, và đã dùng AI thế nào.',
  'Chuẩn bị buổi review: bản đồ trước, ưu tiên cho "thêm một tuần", mở rộng tới nhiều phần tử, sửa trực tiếp.',
  'Coi kho mã lạ là không tin cậy: đọc scripts, chạy cô lập, không commit bí mật.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'react', bai: 'rx-14-4-phong-van', title: 'React 14.4 — Checklist production và câu hỏi phỏng vấn', sub: 'Chuẩn chất lượng người review áp lên một bài React làm ở nhà.' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-1-kim-tu-thap', title: 'Testing 0.2 — Kim tự tháp test', sub: 'Test nào đáng viết trong một bài làm ở nhà nhỏ.' }),
  yt('HgC57v69AEs', 'Sean Allen', 'Software Dev Job Interview — Take Home Project Questions', 8),
  nguon('📘', 'Front End Interview Handbook', 'Cẩm nang miễn phí về các dạng phỏng vấn frontend, có cả bài làm ở nhà (tiếng Anh).', 'https://www.frontendinterviewhandbook.com/'),
])}
</div>
`,
};

/* ═══════════════════════ 6.5 — Lab: mock frontend ═══════════════════════ */
const DE_LIVE_EN = `
LIVE TASK (20 minutes, shared editor or your own laptop with screen share)

You get: an array of students  [{ id, name, score }]  (score 0–10)
Build:  <StudentSearch students={...} />
  1. A text input "Search by name" — filter case-insensitively
  2. Filtering waits 300 ms after the user stops typing (debounce)
  3. A checkbox "Passed only" (score >= 5)
  4. An empty state: No student matches "<query>".
  5. Accessible: the input has a label, everything works with the keyboard
Talk while you code. You may ask questions at any time.
`;

const DE_LIVE_VI = `
BÀI TRỰC TIẾP (20 phút, trình soạn thảo chung hoặc laptop của bạn chia sẻ màn hình)

Bạn có: một mảng sinh viên  [{ id, name, score }]  (điểm 0–10)
Dựng:   <StudentSearch students={...} />
  1. Ô nhập "Tìm theo tên" — lọc không phân biệt hoa thường
  2. Việc lọc chờ 300 ms sau khi người dùng ngừng gõ (debounce)
  3. Ô tích "Chỉ người đạt" (điểm >= 5)
  4. Trạng thái rỗng: Không có sinh viên nào khớp "<từ khoá>".
  5. Tiếp cận được: ô nhập có label, mọi thứ dùng được bằng bàn phím
Vừa code vừa nói. Bạn được hỏi bất cứ lúc nào.
`;

const MA_LOI_GIAI = `
import { useEffect, useMemo, useState } from 'react';

function useDebounce(value, ms) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);              // a new keystroke cancels the old timer
  }, [value, ms]);
  return debounced;
}

export default function StudentSearch({ students }) {
  const [q, setQ] = useState('');
  const [onlyPassed, setOnlyPassed] = useState(false);
  const dq = useDebounce(q, 300);

  const shown = useMemo(() => {                 // derived during render, no extra state
    const needle = dq.trim().toLowerCase();
    return students.filter((s) =>
      s.name.toLowerCase().includes(needle) && (!onlyPassed || s.score >= 5));
  }, [students, dq, onlyPassed]);

  return (
    <section>
      <label htmlFor="q">Search by name</label>
      <input id="q" value={q} onChange={(e) => setQ(e.target.value)} />
      <label>
        <input type="checkbox" checked={onlyPassed}
               onChange={(e) => setOnlyPassed(e.target.checked)} /> Passed only
      </label>
      {shown.length === 0
        ? <p role="status">No student matches "{dq}".</p>
        : <ul>{shown.map((s) => <li key={s.id}>{s.name} — {s.score}</li>)}</ul>}
    </section>
  );
}
`;

const L65 = {
  title: '6.5 — Lab: a 45-minute frontend mock interview with a script, a live task and a score sheet|||6.5 — Lab: buổi phỏng vấn thử frontend 45 phút có kịch bản, bài code trực tiếp và phiếu chấm',
  slug: 'pv-6-5-lab-mock-frontend',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab chương 6: một buổi phỏng vấn thử frontend trọn vẹn 45 phút theo kịch bản cho người đóng vai phỏng vấn — giới thiệu, câu hỏi React/Next.js/trình duyệt, bài code trực tiếp StudentSearch có debounce, câu hỏi ngược — kèm phiếu chấm, gợi ý từng bậc và lời giải.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab</span>
<h2>Lab — a 45-minute frontend mock interview</h2>
<p class="lead">Reading answers is not the same as giving them under a clock while someone watches. In this lab you run a complete frontend interview: a friend (a classmate, a senior, or you yourself with a timer and a camera) plays the interviewer with the script below. You answer, code a small component live, and score the recording with the sheet at the end. Do it twice, a few days apart, and compare the scores.</p>

<h3>The situation</h3>
<p>You have applied for a frontend or fullstack internship at a product company that uses React and Next.js. The first technical round is a 45-minute video call with one engineer. They will ask about React, a little about the browser, give you a small live task, and leave time for your questions.</p>
${flow([
  ['0–5 min', 'introduction', 'Interviewer introduces themself. You give a 60-second self-introduction focused on one frontend project (Chapter 2).'],
  ['5–20 min', 'concept questions', 'Four or five questions from Lessons 6.1–6.3, with one follow-up each.'],
  ['20–40 min', 'live task', 'StudentSearch below. The interviewer answers questions but does not give the solution.'],
  ['40–45 min', 'your questions', 'You ask two real questions about the team (Lesson 2.4).'],
])}

<h3>Script for the person playing the interviewer</h3>
<ol>
<li>"Thanks for joining. Could you introduce yourself and one project you are proud of?"</li>
<li>Pick four: 6.1-1 (setState), 6.1-2 (keys), 6.1-3 (useEffect), 6.2-3 (Server vs Client Components), 6.2-6 (NEXT_PUBLIC), 6.3-1 (type a URL), 6.3-7 (CORS). After each answer, ask one follow-up from the lesson.</li>
<li>Share the live task. If the candidate is silent for more than two minutes, ask "What are you thinking right now?". If stuck after eight minutes, give hint 1; after twelve, hint 2.</li>
<li>At the end of the task: "How would you test this?" and "What changes with 50,000 students?".</li>
<li>"What questions do you have for me?"</li>
</ol>
${ra(DE_LIVE_EN)}
<details><summary>Hint 1 — where the debounced value comes from</summary>
<p>Keep two values: what the user typed (<code>q</code>, updated on every keystroke so the input stays responsive) and a debounced copy that changes 300 ms after typing stops. Filter with the debounced copy.</p>
</details>
<details><summary>Hint 2 — the debounce hook</summary>
<p>An effect that depends on the typed value starts a <code>setTimeout</code>; its cleanup clears the timer, so every new keystroke cancels the previous one. The filtered list is computed during render (useMemo), not stored in state.</p>
</details>
<details><summary>Reference solution</summary>
${ma('jsx', MA_LOI_GIAI)}
<p>Points a strong candidate says out loud: the input stays controlled and responsive while filtering is debounced; the cleanup cancels the previous timer; the filtered list is derived, not duplicated in state; the key is the stable id; the empty state uses <code>role="status"</code> so screen readers announce it. For Vietnamese names, a stronger version also ignores diacritics by normalising both strings (NFD) and removing the combining accent marks — mention it even if you do not code it.</p>
</details>

<h3>Score sheet (out of 20)</h3>
${rubric('en', [
  ['Self-introduction', 'Over 2 minutes or no project', 'A project, but vague about your role', '60–90 s, one project, your role and one result'],
  ['Concept answers', 'Definitions only', 'Correct, but no example', 'Correct, with a real bug or experiment'],
  ['Follow-ups', 'Bluffed', 'Partly answered', 'Answered or said "I don’t know, here is how I’d find out"'],
  ['Thinking out loud', 'Long silences', 'Talked sometimes', 'Explained plan before coding, narrated decisions'],
  ['Clarifying questions', 'None', 'One', 'Asked about inputs, edge cases, accessibility'],
  ['Working solution', 'Does not run', 'Runs with a bug', 'All five requirements met'],
  ['Code quality', 'Duplicated state, no keys', 'Some issues', 'Derived list, cleanup, stable keys'],
  ['Testing / scale answer', 'None', 'Vague', 'Named concrete tests and server-side paging or virtualisation'],
  ['Your questions', 'None', 'Generic (salary only)', 'Two specific questions about the team'],
  ['Calm and honest', 'Defensive or bluffing', 'Nervous but fine', 'Calm, admits gaps, recovers from mistakes'],
])}
${bay('en', 'scoring yourself from memory instead of from the recording.', 'Everybody remembers their interview as better than it was. Watch the recording at 1.5× speed with the sheet open and count actual silences and actual "um"s. The second mock, compared with the first, is where you see progress.')}
${keXau('en', 'if a "company" asks you to do the live task by installing their own remote-control or screen-recording software, or by cloning and running a private repository on your laptop, stop and verify them first (Lesson 0.9). A real company uses a known tool — a shared online editor, a video call with screen share — and never needs admin access to your machine.')}
${neu('en', 'you cannot finish the live task in time? Say where you are and what remains: "The filter and the checkbox work; the debounce is not wired yet — I would add a hook with a timer and a cleanup." Interviewers score the path, not only the destination; a clear status report is part of the path.')}
${thucHanh('en', { phut: '60–90', steps: [
  'Find a partner and give them this lesson’s script. Set up a video call with screen sharing and record it (with their permission).',
  'Run the 45 minutes without pausing. Do not look at the hints or solution yourself.',
  'Score the recording with the sheet. Write the three lowest criteria and one action for each.',
  'Repeat the mock three to five days later with different questions from the list, and compare the totals.',
], dat: 'two recorded mocks with score sheets, and the second total is higher than the first.' })}
${thuatNgu('en', [
  ['Mock interview', 'A rehearsal interview under real conditions, scored afterwards.'],
  ['Debounce', 'Waiting until input stops for a short time before acting on it.'],
  ['Derived state', 'A value computed from other state during render instead of stored.'],
  ['Score sheet / rubric', 'A list of criteria with levels, used to score consistently.'],
  ['Screen share', 'Showing your screen in a video call — the normal way to do live coding remotely.'],
])}
${tomTat('en', [
  'Practise the whole format — introduction, concepts, live task, your questions — under a clock.',
  'In the live task, talk before and while coding; ask about inputs and edge cases.',
  'A clean solution keeps the input responsive, debounces with cleanup, derives the list and uses stable keys.',
  'Score from the recording, not from memory, and repeat to see progress.',
  'Real companies never need you to install their software or run their private code on your machine.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'react', bai: 'rx-9-4-phong-van', L: 'en', title: 'React 9.4 — 20 React interview questions', sub: 'More questions for the interviewer to pick from.' }),
  lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-8-ex13-useeffect', academy: true, L: 'en', title: 'Academy · FER202 Exercise 13 — useEffect (data fetching)', sub: 'A school exercise that warms up the same hooks.' }),
  yt('j7CG7awlrQA', 'Scrimba', 'Mock Junior Front End Web Developer Interview', 67, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab</span>
<h2>Lab — buổi phỏng vấn thử frontend 45 phút</h2>
<p class="lead">Đọc câu trả lời không giống với nói ra câu trả lời khi đồng hồ chạy và có người nhìn. Trong lab này bạn chạy trọn một buổi phỏng vấn frontend: một người bạn (bạn cùng lớp, anh chị khoá trên, hoặc chính bạn với đồng hồ hẹn giờ và camera) đóng vai người phỏng vấn theo kịch bản dưới đây. Bạn trả lời, code một component nhỏ trực tiếp, rồi chấm bản ghi bằng phiếu ở cuối bài. Làm hai lần, cách nhau vài ngày, rồi so điểm.</p>

<h3>Tình huống</h3>
<p>Bạn đã nộp đơn thực tập frontend hoặc fullstack ở một công ty sản phẩm dùng React và Next.js. Vòng kỹ thuật đầu tiên là một cuộc gọi video 45 phút với một kỹ sư. Họ sẽ hỏi về React, một chút về trình duyệt, giao một bài nhỏ code trực tiếp, và chừa thời gian cho câu hỏi của bạn.</p>
${flow([
  ['0–5 phút', 'giới thiệu', 'Người phỏng vấn tự giới thiệu. Bạn giới thiệu 60 giây, tập trung vào một dự án frontend (Chương 2).'],
  ['5–20 phút', 'câu hỏi khái niệm', 'Bốn năm câu từ bài 6.1–6.3, mỗi câu một câu đào sâu.'],
  ['20–40 phút', 'bài code trực tiếp', 'StudentSearch bên dưới. Người phỏng vấn trả lời câu hỏi nhưng không đưa lời giải.'],
  ['40–45 phút', 'câu hỏi của bạn', 'Bạn hỏi hai câu thật về đội (bài 2.4).'],
])}

<h3>Kịch bản cho người đóng vai phỏng vấn</h3>
<ol>
<li>"Cảm ơn em đã tham gia. Em giới thiệu bản thân và một dự án em tự hào nhé?"</li>
<li>Chọn bốn câu: 6.1-1 (setState), 6.1-2 (key), 6.1-3 (useEffect), 6.2-3 (Server vs Client Component), 6.2-6 (NEXT_PUBLIC), 6.3-1 (gõ URL), 6.3-7 (CORS). Sau mỗi câu trả lời, hỏi một câu đào sâu lấy từ bài.</li>
<li>Gửi đề bài trực tiếp. Nếu ứng viên im lặng quá hai phút, hỏi "Em đang nghĩ gì vậy?". Nếu bí sau tám phút, đưa gợi ý 1; sau mười hai phút, gợi ý 2.</li>
<li>Cuối bài: "Em test cái này thế nào?" và "Với 50.000 sinh viên thì đổi gì?".</li>
<li>"Em có câu hỏi gì cho anh/chị không?"</li>
</ol>
${ra(DE_LIVE_VI)}
<details><summary>Gợi ý 1 — giá trị đã debounce lấy từ đâu</summary>
<p>Giữ hai giá trị: thứ người dùng gõ (<code>q</code>, cập nhật mỗi phím để ô nhập luôn mượt) và một bản sao đã debounce, chỉ đổi 300 ms sau khi ngừng gõ. Lọc theo bản sao đã debounce.</p>
</details>
<details><summary>Gợi ý 2 — hook debounce</summary>
<p>Một effect phụ thuộc vào giá trị đã gõ, khởi động một <code>setTimeout</code>; cleanup của nó xoá timer, nên mỗi phím mới huỷ timer trước. Danh sách đã lọc được tính trong lúc render (useMemo), không lưu vào state.</p>
</details>
<details><summary>Lời giải tham khảo</summary>
${ma('jsx', MA_LOI_GIAI)}
<p>Những điểm ứng viên mạnh nói thành tiếng: ô nhập vẫn controlled và mượt trong khi việc lọc được debounce; cleanup huỷ timer trước; danh sách lọc là giá trị dẫn xuất, không nhân bản vào state; key là id ổn định; trạng thái rỗng dùng <code>role="status"</code> để trình đọc màn hình đọc lên. Với tên tiếng Việt, bản tốt hơn còn bỏ qua dấu bằng cách chuẩn hoá cả hai chuỗi (NFD) rồi bỏ các dấu thanh tách rời — hãy nhắc tới dù không kịp code.</p>
</details>

<h3>Phiếu chấm (thang 20)</h3>
${rubric('vi', [
  ['Tự giới thiệu', 'Quá 2 phút hoặc không có dự án', 'Có dự án nhưng mơ hồ về vai trò', '60–90 giây, một dự án, vai trò của bạn và một kết quả'],
  ['Trả lời khái niệm', 'Chỉ có định nghĩa', 'Đúng nhưng không có ví dụ', 'Đúng, kèm một lỗi thật hoặc thí nghiệm'],
  ['Câu đào sâu', 'Chém gió', 'Trả lời được một phần', 'Trả lời được hoặc nói "em chưa biết, em sẽ tìm hiểu thế này"'],
  ['Nghĩ thành tiếng', 'Im lặng lâu', 'Thỉnh thoảng nói', 'Nói kế hoạch trước khi code, thuật lại các quyết định'],
  ['Câu hỏi làm rõ', 'Không có', 'Một câu', 'Hỏi về đầu vào, trường hợp biên, khả năng tiếp cận'],
  ['Lời giải chạy được', 'Không chạy', 'Chạy nhưng có lỗi', 'Đủ cả năm yêu cầu'],
  ['Chất lượng code', 'State nhân bản, không có key', 'Vài vấn đề', 'Danh sách dẫn xuất, có cleanup, key ổn định'],
  ['Trả lời test / mở rộng', 'Không có', 'Mơ hồ', 'Nêu test cụ thể và phân trang máy chủ hoặc ảo hoá'],
  ['Câu hỏi của bạn', 'Không có', 'Chung chung (chỉ hỏi lương)', 'Hai câu cụ thể về đội'],
  ['Bình tĩnh và trung thực', 'Phòng thủ hoặc chém gió', 'Run nhưng ổn', 'Bình tĩnh, nhận chỗ chưa biết, gỡ lại sau khi sai'],
])}
${bay('vi', 'tự chấm theo trí nhớ thay vì theo bản ghi.', 'Ai cũng nhớ buổi phỏng vấn của mình tốt hơn thực tế. Xem lại bản ghi ở tốc độ 1,5× với phiếu chấm mở sẵn và đếm số lần im lặng, số tiếng "ờ" thật sự. Buổi thử thứ hai, so với buổi đầu, là nơi bạn thấy mình tiến bộ.')}
${keXau('vi', 'nếu một "công ty" bắt bạn làm bài trực tiếp bằng cách cài phần mềm điều khiển từ xa hay quay màn hình của riêng họ, hoặc clone và chạy một kho mã riêng tư trên laptop, hãy dừng lại và xác minh họ trước (bài 0.9). Công ty thật dùng công cụ phổ biến — một trình soạn thảo online dùng chung, một cuộc gọi video chia sẻ màn hình — và không bao giờ cần quyền quản trị máy bạn.')}
${neu('vi', 'bạn không làm kịp bài trực tiếp? Nói rõ mình đang ở đâu và còn gì: "Phần lọc và ô tích đã chạy; debounce chưa nối — em sẽ thêm một hook có timer và cleanup." Người phỏng vấn chấm cả con đường chứ không chỉ đích đến; một bản báo cáo tình trạng rõ ràng là một phần của con đường đó.')}
${thucHanh('vi', { phut: '60–90', steps: [
  'Tìm một người cùng tập và đưa họ kịch bản của bài này. Dựng một cuộc gọi video chia sẻ màn hình và ghi lại (khi họ đồng ý).',
  'Chạy đủ 45 phút không dừng. Bản thân bạn không xem gợi ý hay lời giải.',
  'Chấm bản ghi bằng phiếu. Viết ra ba tiêu chí thấp nhất và một hành động cho mỗi cái.',
  'Lặp lại buổi thử sau ba tới năm ngày với các câu khác trong danh sách, rồi so tổng điểm.',
], dat: 'hai buổi thử có ghi hình kèm phiếu chấm, và tổng điểm lần hai cao hơn lần một.' })}
${thuatNgu('vi', [
  ['Mock interview (phỏng vấn thử)', 'Buổi phỏng vấn tập trong điều kiện thật, chấm lại sau.'],
  ['Debounce', 'Chờ tới khi đầu vào ngừng một lúc ngắn rồi mới xử lý.'],
  ['Derived state (state dẫn xuất)', 'Giá trị tính từ state khác trong lúc render thay vì lưu riêng.'],
  ['Score sheet / rubric (phiếu chấm)', 'Danh sách tiêu chí có các mức, để chấm nhất quán.'],
  ['Screen share (chia sẻ màn hình)', 'Cho người khác xem màn hình của bạn trong cuộc gọi — cách thường dùng để code trực tiếp từ xa.'],
])}
${tomTat('vi', [
  'Tập trọn định dạng — giới thiệu, khái niệm, bài trực tiếp, câu hỏi của bạn — với đồng hồ chạy.',
  'Trong bài trực tiếp, nói trước và trong khi code; hỏi về đầu vào và trường hợp biên.',
  'Lời giải sạch giữ ô nhập mượt, debounce có cleanup, danh sách dẫn xuất và key ổn định.',
  'Chấm theo bản ghi, không theo trí nhớ, và lặp lại để thấy tiến bộ.',
  'Công ty thật không bao giờ cần bạn cài phần mềm của họ hay chạy code riêng của họ trên máy bạn.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'react', bai: 'rx-9-4-phong-van', title: 'React 9.4 — 20 câu phỏng vấn React', sub: 'Thêm câu hỏi cho người đóng vai phỏng vấn chọn.' }),
  lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-8-ex13-useeffect', academy: true, title: 'Academy · FER202 Exercise 13 — useEffect (gọi dữ liệu)', sub: 'Một bài tập ở trường để làm nóng đúng những hook này.' }),
  yt('j7CG7awlrQA', 'Scrimba', 'Mock Junior Front End Web Developer Interview', 67),
])}
</div>
`,
};

/* ═══════════════════════ 6.6 — Quiz ═══════════════════════ */
const Q66 = {
  title: '6.6 — Chapter 6 check|||6.6 — Kiểm tra Chương 6',
  slug: 'pv-6-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về React, Next.js, trình duyệt và bài làm ở nhà frontend — mỗi câu giải thích vì sao đáp án đúng và vì sao phương án hấp dẫn nhất sai.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Chapter 6 check — the frontend round</h2>
<p class="lead">Ten situations from real frontend interviews and real bugs. Read every explanation, including for the ones you get right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the render → commit → effect order and state as a snapshot.</li>
<li>I can explain why keys matter and fix a key={index} bug.</li>
<li>I can choose between CSR, SSR, SSG and ISR for a given page and explain Server vs Client Components.</li>
<li>I know why NEXT_PUBLIC_ variables are public and baked at build time.</li>
<li>I can describe the critical rendering path, Core Web Vitals, CORS and XSS defences.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm tra Chương 6 — vòng frontend</h2>
<p class="lead">Mười tình huống từ phỏng vấn frontend thật và lỗi thật. Đọc mọi lời giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được thứ tự render → commit → effect và state là một ảnh chụp.</li>
<li>Tôi giải thích được vì sao key quan trọng và sửa được lỗi key={index}.</li>
<li>Tôi chọn được giữa CSR, SSR, SSG, ISR cho một trang và giải thích được Server vs Client Component.</li>
<li>Tôi biết vì sao biến NEXT_PUBLIC_ là công khai và bị nướng lúc build.</li>
<li>Tôi mô tả được critical rendering path, Core Web Vitals, CORS và các lớp chống XSS.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('A button calls setCount(count + 1) three times in one click handler. count was 0. What is shown after the click?|||Một nút gọi setCount(count + 1) ba lần trong cùng một hàm xử lý cú bấm. count đang là 0. Sau cú bấm màn hình hiện gì?', [
        '3, because each call adds one|||3, vì mỗi lần gọi cộng một',
        '0, because state updates are lost inside handlers|||0, vì cập nhật state bị mất trong hàm xử lý',
        '1, because count is a snapshot of this render, so all three calls set the same value|||1, vì count là ảnh chụp của lần render này, nên cả ba lần đều đặt cùng một giá trị',
        'It throws an error for updating state three times|||Báo lỗi vì cập nhật state ba lần',
      ], 2, 'EN: Within one render count is the constant 0, so each call asks for 0 + 1. "3" is the tempting answer; it would only be true with the updater form setCount(c => c + 1).|||VI: Trong một lần render count là hằng 0, nên mỗi lần gọi đều xin 0 + 1. "3" là đáp án hấp dẫn; nó chỉ đúng với dạng hàm cập nhật setCount(c => c + 1).'),
      cau('Users type into inputs in a list rendered with key={index}. After "Add to top", their typed text appears in the wrong rows. Best fix?|||Người dùng gõ vào các ô nhập trong một danh sách render với key={index}. Sau khi bấm "Thêm lên đầu", chữ đã gõ hiện nhầm dòng. Cách sửa tốt nhất?', [
        'Use a stable id from the data as the key|||Dùng id ổn định từ dữ liệu làm key',
        'Wrap each row in React.memo|||Bọc mỗi dòng bằng React.memo',
        'Use Math.random() as the key so every row is unique|||Dùng Math.random() làm key để dòng nào cũng khác',
        'Add the item at the bottom instead|||Thêm phần tử xuống cuối thay vì lên đầu',
      ], 0, 'EN: The key is identity; a stable id keeps each row’s state attached to its data. Math.random() looks unique but changes every render, so React remounts every row and the typed text is lost. Moving the item avoids the symptom, not the bug.|||VI: Key là danh tính; id ổn định giữ state của mỗi dòng gắn đúng dữ liệu. Math.random() trông như duy nhất nhưng đổi ở mọi lần render, nên React gắn lại mọi dòng và chữ đã gõ biến mất. Dời phần tử chỉ né triệu chứng, không sửa lỗi.'),
      cau('A component stores fullName in state and updates it in a useEffect whenever firstName or lastName changes. What would a reviewer suggest?|||Một component lưu fullName trong state và cập nhật nó trong useEffect mỗi khi firstName hay lastName đổi. Người review sẽ góp ý gì?', [
        'Add fullName to the dependency array|||Thêm fullName vào mảng dependency',
        'Use useLayoutEffect so it updates before paint|||Dùng useLayoutEffect để cập nhật trước khi vẽ',
        'Move it into Context|||Chuyển nó vào Context',
        'Compute fullName during render; it is derived state, not a side effect|||Tính fullName ngay khi render; đó là state dẫn xuất, không phải tác dụng phụ',
      ], 3, 'EN: Effects are for the outside world; a value computable from props/state should be computed in render, which removes an extra render and a stale frame. useLayoutEffect only hides the stale frame and keeps the unnecessary state.|||VI: Effect dành cho thế giới bên ngoài; giá trị tính được từ props/state thì tính khi render, bỏ được một lần render thừa và một khung hình cũ. useLayoutEffect chỉ che khung hình cũ và vẫn giữ state thừa.'),
      cau('A public course page changes a few times a day and must rank on Google; a "my progress" box inside it is personal. Which plan fits best?|||Một trang khoá học công khai đổi vài lần một ngày và phải lên Google; hộp "tiến độ của tôi" bên trong là thông tin cá nhân. Kế hoạch nào hợp nhất?', [
        'Client-side render the whole page|||Render toàn bộ trang phía client',
        'Static generation with revalidation for the page, and the personal box rendered per user|||Sinh tĩnh có revalidate cho trang, còn hộp cá nhân render theo từng người',
        'Server-render the whole page on every request with no cache|||Render phía máy chủ toàn bộ trang ở mọi request, không cache',
        'Static generation only, rebuilt once a month|||Chỉ sinh tĩnh, build lại mỗi tháng một lần',
      ], 1, 'EN: Rendering is chosen per part: cacheable public content is static and revalidated, personal data is rendered per user. Full SSR without cache works but wastes server work on content that is the same for everyone. Pure CSR hurts SEO.|||VI: Cách render được chọn theo từng phần: nội dung công khai cache được thì sinh tĩnh và revalidate, dữ liệu cá nhân render theo từng người. SSR toàn bộ không cache vẫn chạy nhưng phí sức máy chủ cho nội dung giống nhau với mọi người. CSR thuần làm hại SEO.'),
      cau('After a deploy, the GIF picker returns 403. The code reads process.env.NEXT_PUBLIC_GIPHY_API_KEY in the browser. You add the variable to the server and restart the container. Still 403. Why?|||Sau một lần deploy, ô chọn GIF trả 403. Code đọc process.env.NEXT_PUBLIC_GIPHY_API_KEY trong trình duyệt. Bạn thêm biến vào máy chủ và khởi động lại container. Vẫn 403. Vì sao?', [
        'GIPHY blocks requests from Vietnam|||GIPHY chặn request từ Việt Nam',
        'The container needs a reboot of the whole VPS|||Container cần khởi động lại cả VPS',
        'NEXT_PUBLIC_ values are inlined at build time, so the bundle still has the old value; the real fix is a backend proxy that keeps the key server-side|||Giá trị NEXT_PUBLIC_ bị nướng lúc build, nên gói JS vẫn mang giá trị cũ; cách sửa thật là một proxy ở backend giữ khoá phía máy chủ',
        'The browser cached the 403 response forever|||Trình duyệt cache phản hồi 403 vĩnh viễn',
      ], 2, 'EN: A restart cannot change a value baked into the bundle; it needs a rebuild — and a third-party key should not be public at all, hence the proxy. Browser caching is the tempting guess, but the request itself carries the wrong key.|||VI: Khởi động lại không đổi được giá trị đã nướng vào gói JS; phải build lại — và khoá bên thứ ba vốn không nên công khai, nên mới cần proxy. Cache trình duyệt là phỏng đoán hấp dẫn, nhưng chính request đang mang sai khoá.'),
      cau('Your page from localhost:3000 calls an API on localhost:4000 and the console says "blocked by CORS policy". Where is the correct fix?|||Trang của bạn ở localhost:3000 gọi API ở localhost:4000 và console báo "blocked by CORS policy". Sửa đúng ở đâu?', [
        'In the frontend, by adding a mode: "no-cors" option|||Ở frontend, thêm tuỳ chọn mode: "no-cors"',
        'On the API server, by allowing the frontend origin (and credentials if cookies are used)|||Ở máy chủ API, cho phép origin của frontend (và credentials nếu dùng cookie)',
        'By installing a browser extension that disables CORS|||Cài một tiện ích trình duyệt tắt CORS',
        'By switching from fetch to axios|||Đổi từ fetch sang axios',
      ], 1, 'EN: CORS is the server telling the browser which origins may read its responses. "no-cors" is the tempting trap: the request goes out but the response becomes opaque and unreadable. An extension only fixes your own browser.|||VI: CORS là máy chủ nói với trình duyệt origin nào được đọc phản hồi của nó. "no-cors" là cái bẫy hấp dẫn: request vẫn đi nhưng phản hồi thành mờ, không đọc được. Tiện ích chỉ sửa trình duyệt của riêng bạn.'),
      cau('Lighthouse shows LCP 4.8 s on mobile; the LCP element is a hero image whose URL is set by JavaScript after the page loads. Most effective first step?|||Lighthouse báo LCP 4,8 giây trên mobile; phần tử LCP là ảnh chính mà URL được JavaScript gán sau khi trang tải. Bước đầu hiệu quả nhất?', [
        'Make the image discoverable in the HTML (or preload it) and mark it high priority|||Cho ảnh xuất hiện ngay trong HTML (hoặc preload) và đánh dấu ưu tiên cao',
        'Minify all CSS files|||Nén tất cả tệp CSS',
        'Add React.memo to the hero component|||Thêm React.memo cho component ảnh chính',
        'Lower the CLS score|||Giảm điểm CLS',
      ], 0, 'EN: The delay is resource discovery: the browser cannot start downloading an image it learns about only after JS runs. Minifying CSS is a generic tip that does not touch the biggest phase. CLS is a different metric.|||VI: Độ trễ nằm ở khâu phát hiện tài nguyên: trình duyệt không thể tải một ảnh mà nó chỉ biết tới sau khi JS chạy. Nén CSS là mẹo chung chung, không chạm vào khúc lớn nhất. CLS là một chỉ số khác.'),
      cau('A comment feature renders user HTML with dangerouslySetInnerHTML so that bold and links work. What is the minimum responsible change?|||Tính năng bình luận render HTML của người dùng bằng dangerouslySetInnerHTML để chữ đậm và link hoạt động. Thay đổi tối thiểu có trách nhiệm là gì?', [
        'Nothing — React escapes everything automatically|||Không cần gì — React tự thoát mọi thứ',
        'Store the token in localStorage instead of a cookie|||Cất token trong localStorage thay vì cookie',
        'Only allow logged-in users to comment|||Chỉ cho người đã đăng nhập bình luận',
        'Sanitise the HTML with a library such as DOMPurify before rendering, ideally plus a CSP|||Làm sạch HTML bằng thư viện như DOMPurify trước khi render, tốt hơn nữa là thêm CSP',
      ], 3, 'EN: React escapes curly-brace text, but dangerouslySetInnerHTML is exactly the exception, so stored XSS is open. Limiting to logged-in users still lets any account attack others. localStorage makes a stolen token easier, not harder.|||VI: React thoát chữ trong ngoặc nhọn, nhưng dangerouslySetInnerHTML chính là ngoại lệ, nên XSS lưu trữ đang mở. Chỉ cho người đã đăng nhập thì tài khoản nào cũng vẫn tấn công được người khác. localStorage làm token dễ bị lấy hơn, không khó hơn.'),
      cau('In the take-home review the interviewer asks you to change the sort to remember the last choice, in a file an AI assistant wrote for you. What is the best behaviour?|||Trong buổi review bài làm ở nhà, người phỏng vấn nhờ bạn sửa phần sắp xếp để nhớ lựa chọn lần trước, trong một tệp trợ lý AI đã viết cho bạn. Cách xử sự tốt nhất?', [
        'Say the AI wrote it so you are not responsible for it|||Nói AI viết nên bạn không chịu trách nhiệm phần đó',
        'Think out loud, find where sort state lives, make the change in small steps and run it — having read your own code beforehand|||Nghĩ thành tiếng, tìm state sắp xếp nằm ở đâu, sửa từng bước nhỏ và chạy thử — vì bạn đã đọc kỹ code của mình từ trước',
        'Ask for time to do it at home|||Xin thời gian về nhà làm',
        'Rewrite the whole component from scratch|||Viết lại toàn bộ component từ đầu',
      ], 1, 'EN: Submitted code is your code; the review checks that you understand and can change it. Deferring to "do it at home" signals you cannot. Rewriting everything wastes the time and hides the decision.|||VI: Code đã nộp là code của bạn; buổi review kiểm bạn hiểu và sửa được nó. "Về nhà làm" là tín hiệu bạn không làm được. Viết lại toàn bộ thì phí thời gian và che mất quyết định.'),
      cau('Next.js config sets Cache-Control max-age one week for /playground, but curl -I on production shows no-store. What is the most likely cause?|||Cấu hình Next.js đặt Cache-Control max-age một tuần cho /playground, nhưng curl -I lên production lại thấy no-store. Nguyên nhân khả dĩ nhất?', [
        'The browser ignores max-age above one day|||Trình duyệt bỏ qua max-age trên một ngày',
        'Next.js only applies headers in development|||Next.js chỉ áp header ở môi trường dev',
        'A reverse proxy in front (for example nginx) replaces the header — the layer closest to the user wins|||Một reverse proxy đứng trước (ví dụ nginx) thay header — tầng gần người dùng nhất thắng',
        'curl does not show cache headers|||curl không hiện header cache',
      ], 2, 'EN: Headers set by the app can be removed or overwritten by the proxy in front; verify at the real URL. "Only in development" is the tempting wrong answer — Next.js does apply them in production, they are simply overwritten later.|||VI: Header do ứng dụng đặt có thể bị proxy đứng trước gỡ hoặc ghi đè; hãy kiểm ở URL thật. "Chỉ ở dev" là đáp án sai hấp dẫn — Next.js có áp ở production, chỉ là bị ghi đè sau đó.'),
    ],
  },
};

export default {
  title: 'Chapter 6 — Frontend technical round|||Chương 6 — Vòng kỹ thuật frontend',
  description: 'React (render, state, key, effect, nơi đặt state, memo, cuộc đua fetch), Next.js (bốn cách render, Server/Client Component, NEXT_PUBLIC, cache, hydration), trình duyệt (critical rendering path, Core Web Vitals, CSS, khả năng tiếp cận, XSS, CORS, cookie), bài làm ở nhà frontend, buổi phỏng vấn thử 45 phút và quiz.',
  lessons: [L61, L62, L63, L64, L65, Q66],
};
