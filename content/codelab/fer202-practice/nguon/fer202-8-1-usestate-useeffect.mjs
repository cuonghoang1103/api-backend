/**
 * FER202 · 8.1 — useState & useEffect (bài luyện React).
 * Dễ → khó: khởi tạo lười từ localStorage → effect đồng bộ (deps) → effect có cleanup (listener) → tải dữ liệu
 * khi mount → useRef (focus + giá trị trước) → custom hook useLocalStorage.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const B = 'http://localhost:9999';

export default doiDau({
  slug: 'fer202-8-1-usestate-useeffect',
  ten: '8.1 useState & useEffect',
  khoa: KHOA,
  baiHoc: 'fer202-8-1-usestate-useeffect',
  de: [
    reactNho({
      tieuDe: 'Lazy initial state from localStorage',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['useState initializer', 'localStorage', 'JSON.parse'], the: ['hooks', 'useState'],
      moTa: {
        en: '<p>A "visits" counter that starts from the value saved in localStorage key <code>visits</code> (or 0). Read storage ONCE with a lazy initializer <code>useState(() =&gt; …)</code>, not on every render.</p>',
        vi: '<p>Bộ đếm "lượt ghé" bắt đầu từ giá trị lưu ở localStorage khoá <code>visits</code> (hoặc 0). Đọc storage MỘT lần bằng khởi tạo lười <code>useState(() =&gt; …)</code>, không đọc mỗi lần render.</p>',
      },
      yeuCau: [
        { en: '<code>#visits</code> shows the number; <code>#btn-visit</code> adds 1 (two fast clicks = +2) and the value is saved to <code>visits</code>.', vi: '<code>#visits</code> hiện số; <code>#btn-visit</code> cộng 1 (bấm nhanh hai lần = +2) và giá trị được lưu vào <code>visits</code>.' },
        { en: 'Corrupted storage (not a number) ⇒ start from 0.', vi: 'Storage hỏng (không phải số) ⇒ bắt đầu từ 0.' },
      ],
      viDu: [{ input: 'localStorage.visits = "41", click once', output: '42 (saved)', explanation: 'useState(() => Number(localStorage.getItem("visits")) || 0)|||useState(() => Number(localStorage.getItem("visits")) || 0)' }],
      goiY: ['const [visits, setVisits] = useState(() => { const n = Number(localStorage.getItem("visits")); return Number.isFinite(n) ? n : 0; });', 'Bấm: setVisits((v) => v + 1); ghi storage trong useEffect(() => localStorage.setItem("visits", String(visits)), [visits]).'],
      loiHayGap: ['<code>useState(Number(localStorage.getItem(\'visits\')))</code> ⇒ đọc storage ở MỌI lần render (thừa, có thể chậm).', 'Quên đổi chuỗi sang số ⇒ "41" + 1 = "411".'],
      thuatNgu: [{ en: 'lazy initializer', vi: 'hàm khởi tạo chỉ chạy một lần lúc mount' }],
      giaiThich: '<p>Truyền HÀM cho <code>useState</code> khiến React chỉ gọi nó ở lần render đầu. Biểu thức truyền thẳng thì bị tính lại mỗi lần render dù kết quả bị bỏ qua.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [visits, setVisits] = useState(0);
  return (
    <div>
      <p id="visits">{visits}</p>
      <button id="btn-visit" onClick={() => setVisits(visits + 1)}>Visit</button>
    </div>
  );
}
`,
      giai: `// src/App.js — khởi tạo LƯỜI: hàm chỉ chạy ở lần render đầu
import { useEffect, useState } from 'react';

function readVisits() {
  const n = Number(localStorage.getItem('visits'));
  return Number.isFinite(n) ? n : 0; // null ⇒ 0, "abc" ⇒ NaN ⇒ 0
}

export default function App() {
  const [visits, setVisits] = useState(readVisits); // truyền HÀM, không gọi

  useEffect(() => {
    localStorage.setItem('visits', String(visits)); // ghi sau mỗi lần đổi
  }, [visits]);

  const visit = () => setVisits((v) => v + 1); // dạng hàm ⇒ bấm nhanh 2 lần vẫn đúng

  return (
    <div>
      <p id="visits">{visits}</p>
      <button id="btn-visit" type="button" onClick={visit}>Visit</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Starts from the saved value', khoCucBo: { visits: '41' }, kiem: 'text', selector: '#visits', giaTri: '41' },
        { moTa: 'Click adds 1 and saves', khoCucBo: { visits: '41' }, kiem: 'kho-cuc-bo', khoa: 'visits', khop: '^42$', truoc: [click('#btn-visit')] },
        { moTa: 'Corrupted storage ⇒ 0', khoCucBo: { visits: 'abc' }, kiem: 'text', selector: '#visits', giaTri: '0' },
        { an: true, moTa: 'Survives a reload', kiem: 'text', selector: '#visits', giaTri: '2', truoc: [click('#btn-visit', 2), { hanhDong: 'tai-lai' }] },
        { an: true, moTa: 'Lazy initializer (function passed to useState)', kiem: 'ma-nguon', khop: 'useState\\(\\s*(\\(\\)\\s*=>|readVisits|function)' },
      ],
    }),
    reactNho({
      tieuDe: 'useEffect with dependencies: sync the document title',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['useEffect', 'dependency array', 'synchronising with outside systems'], the: ['hooks', 'useEffect'],
      moTa: {
        en: '<p>An inbox shows unread messages. Keep the browser tab title in sync: <code>(3) Inbox</code>, or just <code>Inbox</code> when there are none. The effect must run only when the count changes.</p>',
        vi: '<p>Hộp thư hiển thị số thư chưa đọc. Giữ tiêu đề tab đồng bộ: <code>(3) Inbox</code>, hoặc chỉ <code>Inbox</code> khi không còn thư. Effect chỉ được chạy khi số đếm đổi.</p>',
      },
      yeuCau: [
        { en: '<code>#unread</code> + <code>#btn-read</code> (−1, not below 0) + <code>#btn-new</code> (+1). <code>document.title</code> follows; <code>#title</code> shows it too.', vi: '<code>#unread</code> + <code>#btn-read</code> (−1, không dưới 0) + <code>#btn-new</code> (+1). <code>document.title</code> theo kịp; <code>#title</code> cũng hiện nó.' },
        { en: 'Dependency array <code>[unread]</code>.', vi: 'Mảng phụ thuộc <code>[unread]</code>.' },
      ],
      viDu: [{ input: 'unread 3 → read one', output: 'title "(2) Inbox"', explanation: 'Effects run AFTER the commit, so the DOM/title update follows the screen.|||Effect chạy SAU commit nên tiêu đề cập nhật theo màn hình.' }],
      goiY: ['useEffect(() => { document.title = unread ? ´(@{unread}) Inbox´ : "Inbox"; }, [unread]);', 'Để test nhìn thấy: hiển thị luôn chuỗi tiêu đề trong #title (tính cùng công thức).'],
      loiHayGap: ['Đặt <code>document.title = …</code> thẳng trong thân component ⇒ chạy cả khi render không được commit; effect là chỗ đúng.', 'Quên mảng phụ thuộc ⇒ chạy sau MỌI lần render.'],
      thuatNgu: [{ en: 'external system', vi: 'hệ thống bên ngoài React (DOM, tiêu đề, storage, mạng)' }],
      giaiThich: '<p><code>useEffect</code> dùng để đồng bộ React với thứ bên ngoài (tiêu đề tab). Mảng phụ thuộc cho React biết khi nào cần đồng bộ lại.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [unread, setUnread] = useState(3);
  return (
    <div>
      <p id="unread">{unread}</p>
      <button id="btn-read" onClick={() => setUnread(unread - 1)}>Read one</button>
      <button id="btn-new" onClick={() => setUnread(unread + 1)}>New mail</button>
    </div>
  );
}
`,
      giai: `// src/App.js — useEffect đồng bộ tiêu đề tab mỗi khi unread đổi
import { useEffect, useState } from 'react';

const titleFor = (n) => (n > 0 ? ´(@{n}) Inbox´ : 'Inbox');

export default function App() {
  const [unread, setUnread] = useState(3);

  useEffect(() => {
    document.title = titleFor(unread);
  }, [unread]); // chỉ chạy lại khi unread đổi

  return (
    <div>
      <p id="unread">{unread}</p>
      <p id="title">{titleFor(unread)}</p>
      <button id="btn-read" type="button" onClick={() => setUnread((n) => Math.max(0, n - 1))}>Read one</button>
      <button id="btn-new" type="button" onClick={() => setUnread((n) => n + 1)}>New mail</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'document.title set on mount', kiem: 'ma-nguon', khop: 'useEffect\\([\\s\\S]*document\\.title\\s*=[\\s\\S]*\\[\\s*unread\\s*\\]' },
        { moTa: 'Reading one ⇒ (2) Inbox', kiem: 'text', selector: '#title', giaTri: '(2) Inbox', truoc: [click('#btn-read')] },
        { moTa: 'Never below 0; title "Inbox"', kiem: 'danh-sach-text', selector: '#unread, #title', mongDoi: ['0', 'Inbox'], truoc: [click('#btn-read', 5)] },
      ],
    }),
    reactNho({
      tieuDe: 'Effect with cleanup: a keyboard shortcut',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['addEventListener', 'cleanup function', 'stale closures'], the: ['hooks', 'useEffect'],
      moTa: {
        en: '<p>Press <b>/</b> anywhere to focus the search box (like GitHub). Subscribe to <code>keydown</code> on <code>document</code> in an effect, and <b>remove</b> the listener in the cleanup — otherwise every re-mount adds another listener.</p>',
        vi: '<p>Nhấn <b>/</b> ở bất kỳ đâu để focus ô tìm (như GitHub). Đăng ký <code>keydown</code> trên <code>document</code> trong effect, và <b>gỡ</b> listener trong cleanup — nếu không mỗi lần mount lại sẽ thêm một listener.</p>',
      },
      yeuCau: [
        { en: '<code>#search</code> receives focus on <b>/</b> (and the "/" is not typed); <code>#shortcut-count</code> counts how many times the shortcut fired.', vi: '<code>#search</code> nhận focus khi nhấn <b>/</b> (và không gõ ký tự "/"); <code>#shortcut-count</code> đếm số lần phím tắt chạy.' },
        { en: 'A <code>#toggle</code> button unmounts/mounts the search panel; after remounting, one "/" still counts once (cleanup works).', vi: 'Nút <code>#toggle</code> gỡ/gắn lại khung tìm; sau khi gắn lại, một lần "/" vẫn chỉ đếm một (cleanup hoạt động).' },
      ],
      viDu: [{ input: 'toggle off, toggle on, press "/"', output: 'Shortcut used 1 time', explanation: 'Without cleanup the old listener would still run.|||Không có cleanup thì listener cũ vẫn chạy.' }],
      goiY: ['useEffect(() => { const onKey = (e) => { if (e.key === "/") { e.preventDefault(); ref.current.focus(); setCount(c => c + 1); } }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, []);', 'Dùng useRef cho ô tìm.'],
      loiHayGap: ['Không return cleanup ⇒ listener nhân lên sau mỗi lần mount; StrictMode ở dev lộ lỗi ngay.', 'Đăng ký listener trong thân component (không trong effect) ⇒ thêm mới mỗi lần render.'],
      thuatNgu: [{ en: 'cleanup', vi: 'hàm dọn dẹp chạy khi unmount hoặc trước khi effect chạy lại' }, { en: 'subscription', vi: 'đăng ký nghe sự kiện' }],
      giaiThich: '<p>Mọi thứ effect "mở" (listener, interval, kết nối) phải được "đóng" trong hàm cleanup. React gọi cleanup khi component bị gỡ và trước mỗi lần chạy lại effect.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

function SearchPanel() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <input id="search" placeholder="Press / to search" />
      <p id="shortcut-count">Shortcut used {count} times</p>
    </div>
  );
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button id="toggle" onClick={() => setShow(!show)}>Toggle panel</button>
      {show && <SearchPanel />}
    </div>
  );
}
`,
      giai: `// src/App.js — listener mở trong effect, ĐÓNG trong cleanup
import { useEffect, useRef, useState } from 'react';

function SearchPanel() {
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault(); // không gõ "/" vào ô
        inputRef.current.focus();
        setCount((c) => c + 1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey); // gỡ khi unmount
  }, []);

  return (
    <div>
      <input id="search" ref={inputRef} placeholder="Press / to search" />
      <p id="shortcut-count">Shortcut used {count} times</p>
    </div>
  );
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button id="toggle" type="button" onClick={() => setShow((s) => !s)}>Toggle panel</button>
      {show && <SearchPanel />}
    </div>
  );
}
`,
      kiem: [
        { moTa: '"/" focuses the search box', kiem: 'focus', selector: '#search', truoc: [{ hanhDong: 'phim', selector: '#toggle', phim: '/' }] },
        { moTa: 'Counter increments', kiem: 'text', selector: '#shortcut-count', giaTri: 'Shortcut used 1 times', truoc: [{ hanhDong: 'phim', selector: '#toggle', phim: '/' }] },
        { moTa: 'After remount, one key press counts once', kiem: 'text', selector: '#shortcut-count', giaTri: 'Shortcut used 1 times', truoc: [click('#toggle'), click('#toggle'), { hanhDong: 'phim', selector: '#toggle', phim: '/' }] },
        { an: true, moTa: 'Cleanup removes the listener', kiem: 'ma-nguon', khop: 'return\\s*\\(\\)\\s*=>\\s*document\\.removeEventListener\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'Fetch on mount with loading and error states',
      doKho: 'MEDIUM', phut: 12, jsonServer: { base: B, db: { courses: [{ id: 1, title: 'React Basics' }, { id: 2, title: 'React Router' }, { id: 3, title: 'Redux Toolkit' }] } },
      khaiNiem: ['useEffect + fetch', 'async function inside effect', 'loading/error'], the: ['hooks', 'useEffect', 'fetch'],
      moTa: {
        en: '<p>Load <code>GET http://localhost:9999/courses</code> once when the component mounts. Show <code>#loading</code> while waiting, the list when done, and <code>#error</code> if the request fails (check <code>res.ok</code>!).</p>',
        vi: '<p>Tải <code>GET http://localhost:9999/courses</code> một lần khi component mount. Hiện <code>#loading</code> lúc chờ, danh sách khi xong, và <code>#error</code> nếu request lỗi (nhớ kiểm <code>res.ok</code>!).</p>',
      },
      yeuCau: [
        { en: 'Define an async function INSIDE the effect and call it (the effect itself must not be async). Dependency array <code>[]</code>.', vi: 'Khai báo hàm async BÊN TRONG effect rồi gọi (bản thân effect không được async). Mảng phụ thuộc <code>[]</code>.' },
        { en: '<code>ul#courses li</code>; error text <code>Could not load courses</code>.', vi: '<code>ul#courses li</code>; chữ lỗi <code>Could not load courses</code>.' },
      ],
      viDu: [{ input: 'server answers 404', output: 'Could not load courses', explanation: 'fetch only rejects on network errors — 404 resolves, so check res.ok.|||fetch chỉ reject khi lỗi mạng — 404 vẫn resolve, nên phải kiểm res.ok.' }],
      goiY: ['useEffect(() => { async function load() { … } load(); }, []);', 'try { const res = await fetch(url); if (!res.ok) throw new Error(res.status); setCourses(await res.json()); } catch { setError(true); } finally { setLoading(false); }'],
      loiHayGap: ['<code>useEffect(async () =&gt; …)</code> ⇒ effect trả Promise, React cảnh báo và cleanup hỏng.', 'Không có mảng phụ thuộc + setState trong effect ⇒ vòng lặp gọi API vô hạn.'],
      thuatNgu: [{ en: 'on mount', vi: 'khi component vừa xuất hiện' }],
      giaiThich: '<p>Effect chạy sau lần render đầu; <code>[]</code> nghĩa là chỉ một lần. Ba state (dữ liệu, đang tải, lỗi) mô tả đầy đủ vòng đời của request.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';

export default function App() {
  const [courses, setCourses] = useState([]);
  useEffect(async () => {
    const res = await fetch('http://localhost:9999/courses');
    setCourses(await res.json());
  });
  return <ul id="courses">{courses.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;
}
`,
      giai: `// src/App.js — hàm async BÊN TRONG effect; [] ⇒ chạy một lần; kiểm res.ok
import { useEffect, useState } from 'react';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:9999/courses');
        if (!res.ok) throw new Error(´HTTP @{res.status}´);
        setCourses(await res.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p id="loading">Loading...</p>;
  if (error) return <p id="error">Could not load courses</p>;
  return <ul id="courses">{courses.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;
}
`,
      kiem: [
        { moTa: 'Courses listed', kiem: 'danh-sach-text', selector: '#courses li', mongDoi: ['React Basics', 'React Router', 'Redux Toolkit'] },
        { moTa: 'Loading shown while waiting', jsonServer: { base: B, db: { courses: [] }, treMs: 1500 }, kiem: 'ton-tai', selector: '#loading' },
        { moTa: 'HTTP error ⇒ #error', jsonServer: { base: B, db: {} }, kiem: 'text', selector: '#error', giaTri: 'Could not load courses' },
        { an: true, moTa: 'Only one request (no infinite loop)', kiem: 'goi-fetch', khop: '/courses', min: 1, max: 1, truoc: [{ hanhDong: 'cho', ms: 300 }] },
        { an: true, moTa: 'The effect callback is not async', kiem: 'ma-nguon', khop: 'useEffect\\(\\s*async', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'useRef: autofocus and the previous value',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['useRef DOM', 'useRef value', 'usePrevious'], the: ['hooks', 'useRef'],
      moTa: {
        en: '<p>Two uses of <code>useRef</code>: (1) focus the amount input on mount; (2) remember the previous amount between renders to show "was 100 → now 150" — a ref changes without causing a render.</p>',
        vi: '<p>Hai cách dùng <code>useRef</code>: (1) focus ô số tiền khi mount; (2) nhớ số tiền trước đó giữa các lần render để hiện "was 100 → now 150" — ref đổi mà không gây render.</p>',
      },
      yeuCau: [
        { en: '<code>#amount</code> (number input) focused on mount; buttons <code>#plus50</code> and <code>#minus50</code>.', vi: '<code>#amount</code> (ô số) được focus khi mount; nút <code>#plus50</code> và <code>#minus50</code>.' },
        { en: '<code>#change</code>: "was X → now Y" (X = value of the previous render). Write a <code>usePrevious(value)</code> hook.', vi: '<code>#change</code>: "was X → now Y" (X = giá trị ở lần render trước). Viết hook <code>usePrevious(value)</code>.' },
      ],
      viDu: [{ input: '100 → +50', output: 'was 100 → now 150', explanation: 'The ref is updated in an effect after render, so during render it still holds the old value.|||Ref được cập nhật trong effect SAU render, nên lúc render nó vẫn giữ giá trị cũ.' }],
      goiY: ['function usePrevious(value) { const ref = useRef(); useEffect(() => { ref.current = value; }, [value]); return ref.current; }', 'Focus: const inputRef = useRef(null); useEffect(() => inputRef.current.focus(), []);'],
      loiHayGap: ['Lưu giá trị trước bằng useState ⇒ thêm một lần render mỗi lần đổi.', 'Gán <code>ref.current = value</code> trong thân component ⇒ lúc đọc đã là giá trị mới.'],
      thuatNgu: [{ en: 'mutable ref', vi: 'hộp giá trị đổi được, sống qua các lần render' }],
      giaiThich: '<p><code>useRef</code> trả về cùng một object <code>{ current }</code> suốt đời component: gắn vào thẻ để có nút DOM, hoặc dùng làm "biến instance". Cập nhật ref trong effect (sau render) để lần render sau vẫn đọc được giá trị cũ.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [amount, setAmount] = useState(100);
  return (
    <div>
      <input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button id="plus50" onClick={() => setAmount(amount + 50)}>+50</button>
      <button id="minus50" onClick={() => setAmount(amount - 50)}>−50</button>
      <p id="change">now {amount}</p>
    </div>
  );
}
`,
      giai: `// src/App.js — useRef cho nút DOM (focus) và cho giá trị trước (usePrevious)
import { useEffect, useRef, useState } from 'react';

function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value; // cập nhật SAU render ⇒ trong render ta còn thấy giá trị cũ
  }, [value]);
  return ref.current;
}

export default function App() {
  const [amount, setAmount] = useState(100);
  const prev = usePrevious(amount);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input id="amount" ref={inputRef} type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button id="plus50" type="button" onClick={() => setAmount((a) => a + 50)}>+50</button>
      <button id="minus50" type="button" onClick={() => setAmount((a) => a - 50)}>−50</button>
      <p id="change">{prev === undefined ? ´now @{amount}´ : ´was @{prev} → now @{amount}´}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Amount input focused on mount', kiem: 'focus', selector: '#amount' },
        { moTa: 'Shows previous and current', kiem: 'text', selector: '#change', giaTri: 'was 100 → now 150', truoc: [click('#plus50')] },
        { moTa: 'Previous follows each change', kiem: 'text', selector: '#change', giaTri: 'was 150 → now 100', truoc: [click('#plus50'), { hanhDong: 'cho', ms: 50 }, click('#minus50')] },
        { an: true, moTa: 'usePrevious custom hook', kiem: 'ma-nguon', khop: 'function\\s+usePrevious\\s*\\([\\s\\S]*useRef\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'Custom hook: useLocalStorage',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['custom hook', 'generic state + persistence', 'JSON'], the: ['hooks', 'custom-hooks'],
      moTa: {
        en: '<p>Extract the "state that survives a reload" pattern into <code>useLocalStorage(key, initialValue)</code> returning <code>[value, setValue]</code> — exactly like <code>useState</code>, including functional updates. Use it for a notes app and a "compact view" switch.</p>',
        vi: '<p>Rút mẫu "state còn sau khi tải lại" thành <code>useLocalStorage(key, initialValue)</code> trả về <code>[value, setValue]</code> — y như <code>useState</code>, kể cả cập nhật dạng hàm. Dùng nó cho app ghi chú và công tắc "xem gọn".</p>',
      },
      yeuCau: [
        { en: 'Lazy read with JSON.parse (corrupted ⇒ initialValue); write with JSON.stringify in an effect on <code>[key, value]</code>.', vi: 'Đọc lười bằng JSON.parse (hỏng ⇒ initialValue); ghi bằng JSON.stringify trong effect theo <code>[key, value]</code>.' },
        { en: 'Notes: <code>#note-input</code> + <code>#btn-add</code> ⇒ <code>li.note</code> (key <code>notes</code>); switch <code>#compact</code> (key <code>compact</code>) adds class <code>compact</code> to <code>#notes</code>.', vi: 'Ghi chú: <code>#note-input</code> + <code>#btn-add</code> ⇒ <code>li.note</code> (khoá <code>notes</code>); công tắc <code>#compact</code> (khoá <code>compact</code>) thêm class <code>compact</code> cho <code>#notes</code>.' },
      ],
      viDu: [{ input: 'add 2 notes, reload', output: 'both notes still there', explanation: 'setNotes((n) => [...n, text]) works because the hook returns React\'s own setter.|||setNotes((n) => [...n, text]) chạy được vì hook trả về chính hàm đặt của React.' }],
      goiY: ['function useLocalStorage(key, initialValue) { const [value, setValue] = useState(() => { try { const raw = localStorage.getItem(key); return raw === null ? initialValue : JSON.parse(raw); } catch { return initialValue; } }); useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]); return [value, setValue]; }', 'Dùng: const [notes, setNotes] = useLocalStorage("notes", []);'],
      loiHayGap: ['Tự viết setValue riêng không hỗ trợ dạng hàm ⇒ <code>setNotes(n =&gt; …)</code> lưu nguyên một hàm.', 'Đặt tên không bắt đầu bằng <code>use</code> ⇒ linter không kiểm luật hooks.'],
      thuatNgu: [{ en: 'custom hook', vi: 'hàm use… gom state + effect để dùng lại' }],
      giaiThich: '<p>Custom hook là hàm JavaScript gọi hook khác — mỗi component dùng nó có state RIÊNG. Trả về đúng setter của React nên mọi cách dùng của <code>useState</code> (kể cả dạng hàm) đều chạy.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [compact, setCompact] = useState(false);
  const [text, setText] = useState('');
  return (
    <div>
      <input id="note-input" value={text} onChange={(e) => setText(e.target.value)} />
      <button id="btn-add" onClick={() => setNotes([...notes, text])}>Add</button>
      <label><input id="compact" type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /> Compact</label>
      <ul id="notes">{notes.map((n, i) => <li key={i} className="note">{n}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — useLocalStorage: giống useState nhưng còn sau khi tải lại trang
import { useEffect, useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initialValue : JSON.parse(raw);
    } catch {
      return initialValue; // JSON hỏng
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue]; // setter gốc của React ⇒ hỗ trợ cả setValue(prev => …)
}

export default function App() {
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [compact, setCompact] = useLocalStorage('compact', false);
  const [text, setText] = useState('');

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setNotes((n) => [...n, { id: Date.now() + Math.random(), text: t }]);
    setText('');
  };

  return (
    <div>
      <input id="note-input" value={text} onChange={(e) => setText(e.target.value)} />
      <button id="btn-add" type="button" onClick={add}>Add</button>
      <label><input id="compact" type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /> Compact</label>
      <ul id="notes" className={compact ? 'compact' : ''}>{notes.map((n) => <li key={n.id} className="note">{n.text}</li>)}</ul>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Notes survive a reload', kiem: 'danh-sach-text', selector: '.note', mongDoi: ['Buy milk', 'Call mom'], truoc: [nhap('#note-input', 'Buy milk'), click('#btn-add'), nhap('#note-input', 'Call mom'), click('#btn-add'), { hanhDong: 'tai-lai' }] },
        { moTa: 'Compact switch survives a reload', kiem: 'ton-tai', selector: '#notes.compact', truoc: [{ hanhDong: 'chon-o', selector: '#compact' }, { hanhDong: 'tai-lai' }] },
        { moTa: 'Stored as JSON', kiem: 'kho-cuc-bo', khoa: 'compact', khop: '^true$', truoc: [{ hanhDong: 'chon-o', selector: '#compact' }] },
        { an: true, moTa: 'Corrupted JSON falls back to the initial value', khoCucBo: { notes: '[oops' }, kiem: 'so-luong', selector: '.note', giaTri: 0 },
        { an: true, moTa: 'A useLocalStorage hook is defined and used twice', kiem: 'ma-nguon', khop: 'function\\s+useLocalStorage[\\s\\S]*useLocalStorage\\([\\s\\S]*useLocalStorage\\(' },
      ],
    }),
  ],
});
