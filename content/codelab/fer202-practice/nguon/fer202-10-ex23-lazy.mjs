/**
 * FER202 · Exercise 23 — Lazy loading hai tính năng User và Post (mỗi cái fetch API), Suspense + fallback.
 * Thêm: preload khi rê chuột/focus, và trắc nghiệm "nên lazy cái gì".
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const click = (selector) => ({ hanhDong: 'click', selector });
const cho = (ms) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';
const DB = {
  users: [{ id: 1, name: 'Leanne Graham' }, { id: 2, name: 'Ervin Howell' }, { id: 3, name: 'Clementine Bauch' }],
  posts: [{ id: 1, title: 'sunt aut facere' }, { id: 2, title: 'qui est esse' }],
};

const DELAY = `// src/utils/withDelay.js (cho sẵn) — giả lập mạng chậm
export const withDelay = (factory, ms) => () =>
  Promise.all([factory(), new Promise((r) => setTimeout(r, ms))]).then(([module]) => module);
`;
const USER = `// src/features/User.js (cho sẵn) — tính năng User: tự tải dữ liệu khi mount
import { useEffect, useState } from 'react';

export default function User() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('http://localhost:9999/users').then((r) => r.json()).then(setUsers);
  }, []);
  return <ul id="users">{users.map((u) => <li key={u.id} className="user">{u.name}</li>)}</ul>;
}
`;
const POST = `// src/features/Post.js (cho sẵn) — tính năng Post
import { useEffect, useState } from 'react';

export default function Post() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:9999/posts').then((r) => r.json()).then(setPosts);
  }, []);
  return <ul id="posts">{posts.map((p) => <li key={p.id} className="post">{p.title}</li>)}</ul>;
}
`;
const FILES = { 'src/utils/withDelay.js': DELAY, 'src/features/User.js': USER, 'src/features/Post.js': POST };

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-10-ex23-lazy',
  ten: 'Exercise 23 — Lazy loading',
  khoa: KHOA,
  baiHoc: 'fer202-10-ex23-lazy',
  de: [
    reactNho({
      tieuDe: 'Lazy User and Post features (handout)',
      doKho: 'MEDIUM', phut: 12,
      them: FILES, jsonServer: { base: B, db: DB },
      khaiNiem: ['lazy features', 'Suspense + data fetching', 'chunk loads once'], the: ['lazy', 'exercise-23'],
      moTa: {
        en: '<p>The handout exercise: two features, <b>User</b> and <b>Post</b>, each fetching its own data. Load each feature lazily only when its tab is opened (simulated 600 ms network), with one <code>Suspense</code> fallback. Switching back to a tab that was already loaded must not show the fallback again.</p>',
        vi: '<p>Bài của handout: hai tính năng <b>User</b> và <b>Post</b>, mỗi cái tự tải dữ liệu. Tải lười từng tính năng chỉ khi mở tab của nó (giả lập mạng 600 ms), dùng một fallback <code>Suspense</code>. Quay lại tab đã tải thì không được hiện fallback nữa.</p>',
      },
      yeuCau: [
        { en: 'Tabs <code>#tab-users</code>, <code>#tab-posts</code> (no tab open at first ⇒ <code>#hint</code> <code>Choose a tab</code>). Fallback <code>#loading</code> <code>Loading feature...</code>.', vi: 'Tab <code>#tab-users</code>, <code>#tab-posts</code> (ban đầu chưa mở tab ⇒ <code>#hint</code> <code>Choose a tab</code>). Fallback <code>#loading</code> <code>Loading feature...</code>.' },
        { en: '<code>const User = lazy(withDelay(() =&gt; import("./features/User"), 600))</code> and the same for Post.', vi: '<code>const User = lazy(withDelay(() =&gt; import("./features/User"), 600))</code> và tương tự cho Post.' },
      ],
      viDu: [{ input: 'Users → Posts → Users', output: 'fallback twice (first time each), then instant', explanation: 'A lazy component resolves its Promise only once.|||Component lazy chỉ giải Promise một lần.' }],
      goiY: ['{tab === "users" && <User />}{tab === "posts" && <Post />} trong một <Suspense>', 'Fallback chỉ hiện khi chunk CHƯA tải; dữ liệu fetch bên trong do component tự lo.'],
      loiHayGap: ['Import tĩnh User/Post ở đầu App ⇒ cả hai vào bundle chính.', 'Tạo lazy trong hàm xử lý click ⇒ mỗi lần bấm một component mới, tải lại.'],
      thuatNgu: [{ en: 'feature chunk', vi: 'chunk chứa trọn một tính năng' }],
      giaiThich: '<p>Tách theo tính năng: người chỉ xem User không phải tải mã của Post. Suspense lo phần chờ CHUNK; mỗi tính năng tự lo phần chờ DỮ LIỆU của nó.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';
import User from './features/User';
import Post from './features/Post';

export default function App() {
  const [tab, setTab] = useState(null);
  return (
    <div>
      <button id="tab-users" onClick={() => setTab('users')}>Users</button>
      <button id="tab-posts" onClick={() => setTab('posts')}>Posts</button>
      {tab === 'users' && <User />}
      {tab === 'posts' && <Post />}
    </div>
  );
}
`,
      giai: `// src/App.js — mỗi tính năng một chunk, tải khi mở tab
import { Suspense, lazy, useState } from 'react';
import { withDelay } from './utils/withDelay';

const User = lazy(withDelay(() => import('./features/User'), 600));
const Post = lazy(withDelay(() => import('./features/Post'), 600));

export default function App() {
  const [tab, setTab] = useState(null);
  return (
    <div>
      <button id="tab-users" type="button" onClick={() => setTab('users')}>Users</button>
      <button id="tab-posts" type="button" onClick={() => setTab('posts')}>Posts</button>
      {tab === null && <p id="hint">Choose a tab</p>}
      <Suspense fallback={<p id="loading">Loading feature...</p>}>
        {tab === 'users' && <User />}
        {tab === 'posts' && <Post />}
      </Suspense>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Hint before choosing', kiem: 'text', selector: '#hint', giaTri: 'Choose a tab' },
        { moTa: 'Fallback while the feature loads', kiem: 'text', selector: '#loading', giaTri: 'Loading feature...', truoc: [click('#tab-users')] },
        { moTa: 'Users feature with data', kiem: 'danh-sach-text', selector: 'li.user', mongDoi: ['Leanne Graham', 'Ervin Howell', 'Clementine Bauch'], truoc: [click('#tab-users'), cho(900)] },
        { moTa: 'Posts feature with data', kiem: 'so-luong', selector: 'li.post', giaTri: 2, truoc: [click('#tab-posts'), cho(900)] },
        { an: true, moTa: 'Already loaded tab is instant', kiem: 'khong-ton-tai', selector: '#loading', truoc: [click('#tab-users'), cho(900), click('#tab-posts'), cho(900), click('#tab-users')] },
        { an: true, moTa: 'Post not fetched until its tab opens', kiem: 'goi-fetch', khop: '/posts', min: 0, max: 0, truoc: [click('#tab-users'), cho(900)] },
        { an: true, moTa: 'No static imports of the features', kiem: 'ma-nguon', khop: 'import\\s+(User|Post)\\s+from', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Preload a chunk on hover or focus',
      doKho: 'HARD', phut: 16,
      them: FILES, jsonServer: { base: B, db: DB },
      khaiNiem: ['preloading', 'memoised import promise', 'perceived performance'], the: ['lazy', 'exercise-23'],
      moTa: {
        en: '<p>Make tabs feel instant: start downloading a feature\'s chunk as soon as the user <b>hovers or focuses</b> its tab, before the click. Write <code>lazyWithPreload(factory)</code> that returns a lazy component with a <code>.preload()</code> method — both must share the SAME promise so the chunk downloads once.</p>',
        vi: '<p>Làm tab có cảm giác tức thì: bắt đầu tải chunk của tính năng ngay khi người dùng <b>rê chuột hoặc focus</b> vào tab, trước khi bấm. Viết <code>lazyWithPreload(factory)</code> trả về component lazy có phương thức <code>.preload()</code> — hai đường dùng CHUNG một promise để chunk chỉ tải một lần.</p>',
      },
      yeuCau: [
        { en: 'Same UI as before (<code>#tab-users</code>, <code>#tab-posts</code>, <code>#loading</code>, 600 ms delay). <code>onMouseEnter</code> and <code>onFocus</code> call <code>X.preload()</code>.', vi: 'Giao diện như bài trước (<code>#tab-users</code>, <code>#tab-posts</code>, <code>#loading</code>, trễ 600 ms). <code>onMouseEnter</code> và <code>onFocus</code> gọi <code>X.preload()</code>.' },
        { en: 'Focus a tab, wait ~0.7 s, click ⇒ the fallback never appears.', vi: 'Focus tab, đợi ~0,7 s, bấm ⇒ fallback không hề hiện.' },
      ],
      viDu: [{ input: 'focus Posts, wait, click Posts', output: 'posts shown immediately', explanation: 'lazy(load) and preload() both call load(), which caches the promise.|||lazy(load) và preload() cùng gọi load(), hàm này nhớ promise.' }],
      goiY: ['function lazyWithPreload(factory) { let p = null; const load = () => (p ??= factory()); const C = lazy(load); C.preload = load; return C; }', '<button onMouseEnter={Post.preload} onFocus={Post.preload} …>'],
      loiHayGap: ['preload gọi thẳng <code>factory()</code> còn lazy gọi lại factory lần nữa ⇒ tải hai lần (chậm và tốn).', 'Preload MỌI thứ lúc khởi động ⇒ mất lợi ích của chia nhỏ.'],
      thuatNgu: [{ en: 'preload', vi: 'tải trước tài nguyên sắp cần' }, { en: 'perceived performance', vi: 'tốc độ người dùng cảm nhận' }],
      giaiThich: '<p>Người dùng mất ~200–300 ms từ lúc rê chuột tới lúc bấm — đủ để tải trước chunk nhỏ. Ghi nhớ promise bảo đảm cả preload lẫn lazy dùng chung một lần tải.</p>',
      dau: `// src/App.js — STARTER
import { Suspense, lazy, useState } from 'react';
import { withDelay } from './utils/withDelay';

const User = lazy(withDelay(() => import('./features/User'), 600));
const Post = lazy(withDelay(() => import('./features/Post'), 600));

export default function App() {
  const [tab, setTab] = useState(null);
  return (
    <div>
      <button id="tab-users" onClick={() => setTab('users')}>Users</button>
      <button id="tab-posts" onClick={() => setTab('posts')}>Posts</button>
      <Suspense fallback={<p id="loading">Loading feature...</p>}>
        {tab === 'users' && <User />}
        {tab === 'posts' && <Post />}
      </Suspense>
    </div>
  );
}
`,
      giai: `// src/App.js — lazyWithPreload: lazy và preload dùng CHUNG một promise
import { Suspense, lazy, useState } from 'react';
import { withDelay } from './utils/withDelay';

function lazyWithPreload(factory) {
  let promise = null;
  const load = () => {
    if (!promise) promise = factory();
    return promise;
  };
  const Component = lazy(load);
  Component.preload = load;
  return Component;
}

const User = lazyWithPreload(withDelay(() => import('./features/User'), 600));
const Post = lazyWithPreload(withDelay(() => import('./features/Post'), 600));

export default function App() {
  const [tab, setTab] = useState(null);
  return (
    <div>
      <button id="tab-users" type="button" onMouseEnter={User.preload} onFocus={User.preload} onClick={() => setTab('users')}>Users</button>
      <button id="tab-posts" type="button" onMouseEnter={Post.preload} onFocus={Post.preload} onClick={() => setTab('posts')}>Posts</button>
      <Suspense fallback={<p id="loading">Loading feature...</p>}>
        {tab === 'users' && <User />}
        {tab === 'posts' && <Post />}
      </Suspense>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Preloaded tab opens without fallback', kiem: 'khong-ton-tai', selector: '#loading', truoc: [{ hanhDong: 'focus', selector: '#tab-posts' }, cho(800), click('#tab-posts')] },
        { moTa: 'Preloaded tab shows data', kiem: 'so-luong', selector: 'li.post', giaTri: 2, truoc: [{ hanhDong: 'focus', selector: '#tab-posts' }, cho(800), click('#tab-posts'), cho(200)] },
        { moTa: 'Without preload the fallback still works', kiem: 'ton-tai', selector: '#loading', truoc: [click('#tab-users')] },
        { an: true, moTa: 'preload wired to hover and focus', kiem: 'ma-nguon', khop: '^(?=[\\s\\S]*onMouseEnter=\\{\\s*\\w+\\.preload)(?=[\\s\\S]*onFocus=\\{\\s*\\w+\\.preload)' },
        { an: true, moTa: 'Promise is memoised', kiem: 'ma-nguon', khop: '(if\\s*\\(\\s*!\\s*\\w+\\s*\\)\\s*\\w+\\s*=\\s*factory\\(\\)|\\?\\?=\\s*factory\\(\\))' },
      ],
    }),
    tinh({
      tieuDe: 'What should be lazy-loaded?',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['bundle size', 'route splitting', 'too many chunks'], the: ['lazy', 'quiz', 'exercise-23'],
      moTa: {
        en: '<p>Slot 15 warns against lazy-loading everything: each chunk is one more request and one more spinner. Decide, for each case, whether lazy loading helps. Think about how big the code is, how often it is needed and whether it is visible on first load.</p>',
        vi: '<p>Slot 15 cảnh báo không nên lazy mọi thứ: mỗi chunk là thêm một request và một vòng xoay chờ. Với từng trường hợp, quyết định lazy có giúp không. Nghĩ tới mã nặng cỡ nào, có thường cần không và có hiện ngay lúc mở trang không.</p>',
      },
      goiY: ['Lợi ích lớn nhất: route ít người vào + thư viện nặng.', 'Thứ hiện ngay khi mở trang (header, nút) không nên lazy.'],
      loiHayGap: ['Lazy cả component 1 KB ⇒ thêm request còn chậm hơn.', 'Lazy phần nằm trên màn hình đầu ⇒ trang nhấp nháy fallback.'],
      giaiThich: '<p>Lazy khi: mã lớn, ít dùng, không cần ngay. Không lazy khi: nhỏ, luôn hiện, hoặc cần ngay khi tải trang.</p>',
      thuatNgu: [{ en: 'above the fold', vi: 'phần thấy ngay khi mở trang, chưa cuộn' }],
      cauHoi: [
        q('q1', 'An admin dashboard route used by 2% of users', [['a', 'Lazy-load it'], ['b', 'Keep it in the main bundle']], ['a'], '98% of users never download it.|||98% người dùng không phải tải nó.'),
        q('q2', 'The site header and navbar', [['a', 'Lazy-load it'], ['b', 'Keep it in the main bundle']], ['b'], 'Visible immediately on every page.|||Hiện ngay ở mọi trang.'),
        q('q3', 'A rich-text editor (300 KB) shown only after clicking "Write a post"', [['a', 'Lazy-load it'], ['b', 'Keep it in the main bundle']], ['a'], 'Heavy and on demand — a perfect candidate.|||Nặng và dùng theo yêu cầu — ứng viên lý tưởng.'),
        q('q4', 'A 20-line Button component used everywhere', [['a', 'Lazy-load it'], ['b', 'Keep it in the main bundle']], ['b'], 'Tiny and always needed; a separate request costs more than it saves.|||Nhỏ và luôn cần; request riêng tốn hơn phần tiết kiệm.'),
        q('q5', 'Which are good reasons to code-split? (choose all)', [['a', 'Faster first load'], ['b', 'Users download only what they use'], ['c', 'Fewer HTTP requests overall'], ['d', 'Heavy third-party libraries used on one page']], [['a', 'b', 'd']], 'Splitting usually ADDS requests; the trade-off is worth it only for big, rarely used code.|||Chia nhỏ thường THÊM request; chỉ đáng khi mã lớn, ít dùng.', true),
      ],
    }),
  ],
});
