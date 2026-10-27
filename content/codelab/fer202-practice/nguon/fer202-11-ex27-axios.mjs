/**
 * FER202 · Exercise 27 — axios: AxiosDemo (loading/error/data) của handout + mở rộng: custom hook useAxios có refetch.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const cho = (ms = 200) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';
const AX = ['axios'];

const POSTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  userId: (i % 3) + 1,
  title: ['sunt aut facere', 'qui est esse', 'ea molestias quasi', 'eum et est occaecati', 'nesciunt quas odio', 'dolorem eum magni', 'magnam facilis autem', 'dolorem dolore est'][i],
  body: 'Lorem ipsum ' + (i + 1),
}));

export default doiDau({
  slug: 'fer202-11-ex27-axios',
  ten: 'Exercise 27 — axios',
  khoa: KHOA,
  baiHoc: 'fer202-11-ex27-axios',
  de: [
    reactNho({
      tieuDe: 'AxiosDemo: loading, error and data (handout)',
      doKho: 'EASY', phut: 12, thuVien: AX,
      jsonServer: { base: B, db: { posts: POSTS } },
      khaiNiem: ['axios in useEffect', 'three UI states', 'params'], the: ['axios', 'exercise-27'],
      moTa: {
        en: '<p>The handout\'s <code>AxiosDemo</code> component, against our json-server instead of JSONPlaceholder. Fetch the first <b>5</b> posts with <code>axios.get(url, { params: { _limit: 5 } })</code> and render exactly one of three states: loading, error, or the list. A <b>Reload</b> button fetches again.</p>',
        vi: '<p>Component <code>AxiosDemo</code> của handout, gọi json-server của ta thay vì JSONPlaceholder. Tải <b>5</b> bài đầu bằng <code>axios.get(url, { params: { _limit: 5 } })</code> và hiển thị đúng một trong ba trạng thái: đang tải, lỗi, hoặc danh sách. Nút <b>Reload</b> tải lại.</p>',
      },
      yeuCau: [
        { en: '<code>#loading</code> <code>Loading posts...</code>; <code>#error</code> <code>Failed to load posts</code>; <code>li.post</code> with <code>h3</code> (title) and <code>p</code> (body).', vi: '<code>#loading</code> <code>Loading posts...</code>; <code>#error</code> <code>Failed to load posts</code>; <code>li.post</code> có <code>h3</code> (tiêu đề) và <code>p</code> (nội dung).' },
        { en: '<code>#btn-reload</code> re-runs the request (a <code>reloadKey</code> state in the dependency array).', vi: '<code>#btn-reload</code> chạy lại request (state <code>reloadKey</code> nằm trong mảng phụ thuộc).' },
      ],
      viDu: [{ input: 'server has 8 posts', output: '5 li.post', explanation: '_limit=5 is applied by the server.|||Server áp _limit=5.' }],
      goiY: ["const res = await axios.get('http://localhost:9999/posts', { params: { _limit: 5 } });", 'const [reloadKey, setReloadKey] = useState(0); useEffect(…, [reloadKey]); onClick={() => setReloadKey((k) => k + 1)}'],
      loiHayGap: ['Hiện cả "Loading" lẫn danh sách cùng lúc ⇒ quên tắt loading ở nhánh lỗi (dùng finally).', 'Tải hết rồi slice(0, 5) ở client ⇒ đúng hình nhưng phí băng thông.'],
      thuatNgu: [{ en: 'UI state', vi: 'trạng thái giao diện (loading/error/data)' }],
      giaiThich: '<p>Mỗi request có ba trạng thái loại trừ nhau. Render bằng early return (loading → error → data) giúp không bao giờ hiện hai trạng thái cùng lúc. Đổi một state phụ thuộc là cách đơn giản để "chạy lại effect".</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AxiosDemo() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:9999/posts').then((res) => setPosts(res.data.slice(0, 5)));
  }, []);
  return <ul>{posts.map((p) => <li key={p.id} className="post"><h3>{p.title}</h3></li>)}</ul>;
}
`,
      giai: `// src/App.js — AxiosDemo: ba trạng thái + tải lại bằng reloadKey
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AxiosDemo() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(false);
    axios
      .get('http://localhost:9999/posts', { params: { _limit: 5 } })
      .then((res) => { if (!ignore) setPosts(res.data); })
      .catch(() => { if (!ignore) setError(true); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [reloadKey]);

  let content;
  if (loading) content = <p id="loading">Loading posts...</p>;
  else if (error) content = <p id="error">Failed to load posts</p>;
  else {
    content = (
      <ul>
        {posts.map((p) => (
          <li key={p.id} className="post">
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <button id="btn-reload" type="button" onClick={() => setReloadKey((k) => k + 1)}>Reload</button>
      {content}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Five posts from the server', kiem: 'so-luong', selector: 'li.post', giaTri: 5, truoc: [cho()] },
        { moTa: 'Uses _limit=5', kiem: 'goi-fetch', khop: '/posts\\?_limit=5', truoc: [cho()] },
        { moTa: 'Loading state', jsonServer: { base: B, db: { posts: POSTS }, treMs: 1200 }, kiem: 'text', selector: '#loading', giaTri: 'Loading posts...' },
        { moTa: 'Error state', jsonServer: { base: B, db: {} }, kiem: 'text', selector: '#error', giaTri: 'Failed to load posts', truoc: [cho()] },
        { an: true, moTa: 'Reload fetches again', kiem: 'goi-fetch', khop: '/posts', min: 2, max: 2, truoc: [cho(), click('#btn-reload'), cho()] },
        { an: true, moTa: 'Title and body rendered', kiem: 'danh-sach-text', selector: 'li.post:first-child h3, li.post:first-child p', mongDoi: ['sunt aut facere', 'Lorem ipsum 1'], truoc: [cho()] },
      ],
    }),
    reactNho({
      tieuDe: 'A reusable useAxios hook with refetch',
      doKho: 'HARD', phut: 18, thuVien: AX,
      jsonServer: { base: B, db: { posts: POSTS, users: [{ id: 1, name: 'Leanne' }, { id: 2, name: 'Ervin' }, { id: 3, name: 'Clementine' }] } },
      khaiNiem: ['custom hook', 'generic data fetching', 'stable params', 'refetch'], the: ['axios', 'custom-hooks', 'exercise-27'],
      moTa: {
        en: '<p>Two widgets repeat the same loading/error/data code. Extract <code>useAxios(url, params)</code> returning <code>{ data, loading, error, refetch }</code>. It refetches when <code>url</code> or the <b>content</b> of <code>params</code> changes (compare <code>JSON.stringify(params)</code> — a new object literal every render must not cause an infinite loop).</p>',
        vi: '<p>Hai widget lặp lại cùng đoạn loading/error/data. Rút thành <code>useAxios(url, params)</code> trả <code>{ data, loading, error, refetch }</code>. Nó tải lại khi <code>url</code> hoặc <b>nội dung</b> của <code>params</code> đổi (so <code>JSON.stringify(params)</code> — object literal mới mỗi lần render không được gây vòng lặp vô hạn).</p>',
      },
      yeuCau: [
        { en: 'Widget 1 <code>#users</code>: <code>li.user</code> from <code>/users</code>. Widget 2 <code>#posts</code>: posts of the selected user (<code>#user-filter</code> select 1/2/3) via <code>params: { userId }</code>, rows <code>li.post</code>, button <code>#refresh-posts</code> calls <code>refetch</code>.', vi: 'Widget 1 <code>#users</code>: <code>li.user</code> từ <code>/users</code>. Widget 2 <code>#posts</code>: bài của user đang chọn (select <code>#user-filter</code> 1/2/3) qua <code>params: { userId }</code>, dòng <code>li.post</code>, nút <code>#refresh-posts</code> gọi <code>refetch</code>.' },
        { en: 'Each widget shows its own <code>.loading</code> / <code>.error</code>.', vi: 'Mỗi widget có <code>.loading</code> / <code>.error</code> riêng.' },
      ],
      viDu: [{ input: 'select user 2', output: 'posts 2, 5, 8 · one new request', explanation: 'The effect depends on [url, JSON.stringify(params), tick].|||Effect phụ thuộc [url, JSON.stringify(params), tick].' }],
      goiY: ['const key = JSON.stringify(params ?? {}); const [tick, setTick] = useState(0); useEffect(() => { … axios.get(url, { params: JSON.parse(key) }) … }, [url, key, tick]);', 'refetch = useCallback(() => setTick((t) => t + 1), []) — hoặc đơn giản () => setTick(…)'],
      loiHayGap: ['Đưa thẳng object <code>params</code> vào mảng phụ thuộc ⇒ mỗi render là object mới ⇒ gọi API vô hạn.', 'Hook trả về JSX ⇒ đó là component, không phải hook; hook trả DỮ LIỆU.'],
      thuatNgu: [{ en: 'referential equality', vi: 'so sánh theo tham chiếu: hai object giống nội dung vẫn khác nhau' }],
      giaiThich: '<p>React so mảng phụ thuộc bằng <code>Object.is</code>: object literal mới mỗi lần render luôn "khác". Chuyển nó thành chuỗi JSON (giá trị nguyên thuỷ) để so theo NỘI DUNG. Đây là tiền thân của thư viện như SWR/TanStack Query.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import axios from 'axios';

function useAxios(url, params) {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get(url, { params }).then((r) => setData(r.data));
  }, [url, params]);
  return { data };
}

export default function App() {
  const [userId, setUserId] = useState(1);
  const users = useAxios('http://localhost:9999/users');
  const posts = useAxios('http://localhost:9999/posts', { userId });
  return (
    <div>
      <ul id="users">{(users.data || []).map((u) => <li key={u.id} className="user">{u.name}</li>)}</ul>
      <select id="user-filter" value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
        <option value="1">1</option><option value="2">2</option><option value="3">3</option>
      </select>
      <ul id="posts">{(posts.data || []).map((p) => <li key={p.id} className="post">{p.title}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — useAxios: so params theo NỘI DUNG (JSON), refetch bằng bộ đếm
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

function useAxios(url, params) {
  const key = JSON.stringify(params ?? {});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    axios
      .get(url, { params: JSON.parse(key) })
      .then((res) => { if (!ignore) setData(res.data); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [url, key, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

function Status({ state }) {
  if (state.loading) return <p className="loading">Loading...</p>;
  if (state.error) return <p className="error">{state.error}</p>;
  return null;
}

export default function App() {
  const [userId, setUserId] = useState(1);
  const users = useAxios('http://localhost:9999/users');
  const posts = useAxios('http://localhost:9999/posts', { userId });

  return (
    <div>
      <section>
        <h2>Users</h2>
        <Status state={users} />
        <ul id="users">{(users.data ?? []).map((u) => <li key={u.id} className="user">{u.name}</li>)}</ul>
      </section>
      <section>
        <h2>Posts</h2>
        <select id="user-filter" value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button id="refresh-posts" type="button" onClick={posts.refetch}>Refresh</button>
        <Status state={posts} />
        <ul id="posts">{(posts.data ?? []).map((p) => <li key={p.id} className="post">{p.title}</li>)}</ul>
      </section>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Users widget', kiem: 'danh-sach-text', selector: 'li.user', mongDoi: ['Leanne', 'Ervin', 'Clementine'], truoc: [cho()] },
        { moTa: 'Posts for user 1', kiem: 'danh-sach-text', selector: 'li.post', mongDoi: ['sunt aut facere', 'eum et est occaecati', 'magnam facilis autem'], truoc: [cho()] },
        { moTa: 'Changing the filter refetches', kiem: 'so-luong', selector: 'li.post', giaTri: 3, truoc: [cho(), { hanhDong: 'doi', selector: '#user-filter', giaTri: '2' }, cho()] },
        { moTa: 'No infinite loop (exactly 2 requests on mount)', kiem: 'goi-fetch', khop: 'localhost:9999', min: 2, max: 2, truoc: [cho(500)] },
        { an: true, moTa: 'refetch sends one more posts request', kiem: 'goi-fetch', khop: '/posts\\?userId=1', min: 2, max: 2, truoc: [cho(), click('#refresh-posts'), cho()] },
        { an: true, moTa: 'Error state per widget', jsonServer: { base: B, db: { users: [{ id: 1, name: 'Leanne' }] } }, kiem: 'danh-sach-text', selector: '.error', mongDoi: ['Request failed with status code 404'], truoc: [cho()] },
        { an: true, moTa: 'A useAxios hook returns data, not JSX', kiem: 'ma-nguon', khop: 'function\\s+useAxios[\\s\\S]*return\\s*\\{\\s*data' },
      ],
    }),
  ],
});
