/**
 * FER202 · Exercise 26 — json-server: dựng REST API giả từ db.json.
 * Đề 1 sắp thứ tự các bước cài/chạy · Đề 2 đọc db.json và đoán kết quả request (điền bảng) ·
 * Đề 3 React dùng quan hệ (_expand / _embed) của json-server.
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const cho = (ms = 200) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';

const DB_TEXT = `{
  "posts": [
    { "id": 1, "title": "Hello json-server", "views": 120, "userId": 1 },
    { "id": 2, "title": "React + axios",     "views": 340, "userId": 2 },
    { "id": 3, "title": "Routing in React",  "views": 90,  "userId": 1 },
    { "id": 4, "title": "Redux Toolkit",     "views": 510, "userId": 3 },
    { "id": 5, "title": "Testing React",     "views": 200, "userId": 2 }
  ],
  "users": [
    { "id": 1, "name": "An" }, { "id": 2, "name": "Binh" }, { "id": 3, "name": "Cuong" }
  ],
  "comments": [
    { "id": 1, "postId": 2, "body": "Nice" },
    { "id": 2, "postId": 2, "body": "Thanks" },
    { "id": 3, "postId": 4, "body": "Great intro" }
  ]
}`;
const DB = JSON.parse(DB_TEXT);

export default doiDau({
  slug: 'fer202-11-ex26-json-server',
  ten: 'Exercise 26 — json-server',
  khoa: KHOA,
  baiHoc: 'fer202-11-ex26-json-server',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'Set up a fake REST API with json-server',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['npm', 'db.json', 'watch mode', 'port'], the: ['json-server', 'order', 'exercise-26'],
      moTa: {
        en: '<p>You need a backend for the fetch/axios exercises before the real API exists. Put the steps in the right order, from installing the tool to calling it from React.</p>',
        vi: '<p>Bạn cần backend cho các bài fetch/axios khi API thật chưa có. Hãy xếp các bước đúng thứ tự, từ cài công cụ tới gọi nó từ React.</p>',
      },
      goiY: ['Không thể chạy server khi chưa có tệp dữ liệu.', 'Kiểm bằng trình duyệt trước khi viết code React.'],
      loiHayGap: ['Chạy React và json-server cùng cổng 3000 ⇒ xung đột cổng; dùng --port 9999.', 'Quên --watch ⇒ sửa db.json tay không thấy cập nhật.'],
      giaiThich: '<p>Cài → tạo db.json → chạy với --watch và cổng riêng → mở thử URL → gọi từ React.</p>',
      thuatNgu: [{ en: 'mock API', vi: 'API giả để phát triển giao diện trước' }],
      cauHoi: [
        o('s1', 'Order the steps', [
          ['c', 'Run <code>npx json-server --watch db.json --port 9999</code>'],
          ['e', 'Call <code>http://localhost:9999/posts</code> from React with axios'],
          ['a', 'Install: <code>npm install -g json-server</code> (or use npx)'],
          ['d', 'Open <code>http://localhost:9999/posts</code> in the browser to check the JSON'],
          ['b', 'Create <code>db.json</code> with collections such as <code>posts</code> and <code>users</code>'],
        ], ['a', 'b', 'c', 'd', 'e'], 'Install → data file → start server → check in browser → use from React.|||Cài → tệp dữ liệu → chạy server → thử bằng trình duyệt → dùng từ React.'),
      ],
    }),
    tinh({
      loai: 'table',
      tieuDe: 'Predict json-server responses from db.json',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['routes from collections', 'filters', '_sort/_order/_limit', 'q search', 'POST ids'], the: ['json-server', 'table', 'exercise-26'],
      moTa: {
        en: `<p>json-server serves this <code>db.json</code>:</p><pre>${DB_TEXT.replace(/</g, '&lt;')}</pre><p>For each request fill what the server returns. Requests are independent (each starts from this file).</p>`,
        vi: `<p>json-server phục vụ <code>db.json</code> này:</p><pre>${DB_TEXT.replace(/</g, '&lt;')}</pre><p>Với mỗi request, điền kết quả server trả về. Các request độc lập (đều bắt đầu từ tệp này).</p>`,
      },
      bang: [{
        ma: 'r', de: 'What comes back?',
        cot: [{ ma: 'req', ten: 'Request' }, { ma: 'ans', ten: 'Answer' }],
        hang: [
          { ma: 'all', o: { req: 'GET /posts — how many items?' } },
          { ma: 'user1', o: { req: 'GET /posts?userId=1 — how many items?' } },
          { ma: 'top', o: { req: 'GET /posts?_sort=views&_order=desc&_limit=1 — title?' } },
          { ma: 'one', o: { req: 'GET /posts/3 — title?' } },
          { ma: 'q', o: { req: 'GET /posts?q=react — how many items?' } },
          { ma: 'missing', o: { req: 'GET /posts/99 — status code?' } },
          { ma: 'post', o: { req: 'POST /posts {"title":"New"} — id of the created post?' } },
          { ma: 'embed', o: { req: 'GET /posts/2?_embed=comments — number of comments?' } },
        ],
        dapAn: {
          'all.ans': '5', 'user1.ans': '2', 'top.ans': 'Redux Toolkit', 'one.ans': 'Routing in React',
          'q.ans': '3', 'missing.ans': '404', 'post.ans': '6', 'embed.ans': '2',
        },
        giaiThich: 'q is a full-text search over all fields (case-insensitive): "React + axios", "Routing in React", "Testing React". POST gets the next id (6). _embed=comments attaches comments whose postId = 2.|||q tìm toàn văn trên mọi trường (không phân biệt hoa thường): "React + axios", "Routing in React", "Testing React". POST nhận id kế tiếp (6). _embed=comments gắn các comment có postId = 2.',
      }],
      goiY: ['Mỗi khoá cấp đầu của db.json là một route: /posts, /users, /comments.', '_sort + _order sắp xếp, _limit cắt, q tìm trong mọi trường.'],
      loiHayGap: ['Đếm "React" phân biệt hoa thường ⇒ thiếu kết quả.', 'Nghĩ GET /posts/99 trả mảng rỗng — nó trả 404 với object rỗng.'],
      giaiThich: '<p>json-server tạo REST API đầy đủ (GET/POST/PUT/PATCH/DELETE) từ các mảng trong db.json, kèm lọc, sắp xếp, phân trang, tìm kiếm và quan hệ qua <code>xxxId</code>.</p>',
      thuatNgu: [{ en: 'full-text search', vi: 'tìm chuỗi trong mọi trường' }],
    }),
    reactNho({
      tieuDe: 'Relationships: _expand=user and _embed=comments',
      doKho: 'MEDIUM', phut: 14, thuVien: ['axios'],
      jsonServer: { base: B, db: DB },
      khaiNiem: ['_expand', '_embed', 'one request instead of N'], the: ['json-server', 'axios', 'exercise-26'],
      moTa: {
        en: '<p>Show each post with its author\'s name and its number of comments using ONE request: <code>GET /posts?_expand=user&amp;_embed=comments</code>. <code>_expand=user</code> follows <code>userId</code> to attach <code>post.user</code>; <code>_embed=comments</code> attaches <code>post.comments</code> (comments whose <code>postId</code> matches).</p>',
        vi: '<p>Hiện mỗi bài viết kèm tên tác giả và số bình luận chỉ bằng MỘT request: <code>GET /posts?_expand=user&amp;_embed=comments</code>. <code>_expand=user</code> theo <code>userId</code> để gắn <code>post.user</code>; <code>_embed=comments</code> gắn <code>post.comments</code> (comment có <code>postId</code> khớp).</p>',
      },
      yeuCau: [
        { en: 'Rows <code>li.post</code>: <code>.title</code>, <code>.author</code> (<code>by Binh</code>), <code>.comments</code> (<code>2 comments</code> / <code>1 comment</code> / <code>No comments</code>).', vi: 'Dòng <code>li.post</code>: <code>.title</code>, <code>.author</code> (<code>by Binh</code>), <code>.comments</code> (<code>2 comments</code> / <code>1 comment</code> / <code>No comments</code>).' },
        { en: 'Exactly one HTTP request.', vi: 'Đúng một request HTTP.' },
      ],
      viDu: [{ input: 'post 2', output: 'React + axios · by Binh · 2 comments', explanation: 'axios.get(url, { params: { _expand: "user", _embed: "comments" } })|||axios.get(url, { params: { _expand: "user", _embed: "comments" } })' }],
      goiY: ["axios.get('http://localhost:9999/posts', { params: { _expand: 'user', _embed: 'comments' } })", 'const label = (n) => (n === 0 ? "No comments" : n === 1 ? "1 comment" : ´@{n} comments´);'],
      loiHayGap: ['Gọi /users/:id cho TỪNG bài ⇒ N+1 request, chậm.', 'Viết _expand=users (số nhiều) ⇒ json-server tìm trường usersId, không gắn được.'],
      thuatNgu: [{ en: 'N+1 problem', vi: '1 request danh sách + N request chi tiết — chậm' }],
      giaiThich: '<p>_expand đi theo khoá ngoại của CHÍNH bản ghi (post.userId → user); _embed gom bản ghi CON trỏ về nó (comments.postId → post). Một request thay cho hàng chục.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:9999/posts').then((r) => setPosts(r.data));
  }, []);
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id} className="post"><span className="title">{p.title}</span> <span className="author">by user {p.userId}</span></li>
      ))}
    </ul>
  );
}
`,
      giai: `// src/App.js — một request kèm quan hệ: _expand=user (cha) + _embed=comments (con)
import { useEffect, useState } from 'react';
import axios from 'axios';

const countLabel = (n) => (n === 0 ? 'No comments' : n === 1 ? '1 comment' : ´@{n} comments´);

export default function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:9999/posts', { params: { _expand: 'user', _embed: 'comments' } })
      .then((res) => setPosts(res.data));
  }, []);

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id} className="post">
          <span className="title">{p.title}</span>{' '}
          <span className="author">by {p.user?.name ?? 'unknown'}</span>{' '}
          <span className="comments">{countLabel(p.comments?.length ?? 0)}</span>
        </li>
      ))}
    </ul>
  );
}
`,
      kiem: [
        { moTa: 'Author names', kiem: 'danh-sach-text', selector: 'li.post .author', mongDoi: ['by An', 'by Binh', 'by An', 'by Cuong', 'by Binh'], truoc: [cho()] },
        { moTa: 'Comment counts', kiem: 'danh-sach-text', selector: 'li.post .comments', mongDoi: ['No comments', '2 comments', 'No comments', '1 comment', 'No comments'], truoc: [cho()] },
        { moTa: 'Uses _expand and _embed', kiem: 'goi-fetch', khop: '/posts\\?(?=.*_expand=user)(?=.*_embed=comments)', truoc: [cho()] },
        { an: true, moTa: 'Exactly one request', kiem: 'goi-fetch', khop: 'localhost:9999', min: 1, max: 1, truoc: [cho(300)] },
      ],
    }),
  ],
});
