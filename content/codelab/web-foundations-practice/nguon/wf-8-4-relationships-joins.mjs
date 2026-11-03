/** Bộ luyện bài 8.4 — Quan hệ và JOIN. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  INNER/LEFT JOIN bằng JS (có chỉ mục Map), đếm con kể cả 0, gom dòng phẳng của JOIN thành object lồng (việc ORM làm),
 *  nhiều-nhiều qua bảng nối, luật ON DELETE, và phát hiện N+1 trong nhật ký truy vấn. Dữ liệu: blog.sql. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 8.4 — Quan hệ và JOIN.</em> Các bài làm lại bằng JavaScript việc CSDL và ORM làm với các bảng trỏ vào nhau — dùng đúng dữ liệu blog của chương.</p>';
const USERS = '[{ id: 1, name: "Lan" }, { id: 2, name: "Minh" }, { id: 3, name: "An" }]';
const POSTS = '[{ id: 1, user_id: 1, title: "Hello World" }, { id: 2, user_id: 1, title: "Learning SQL" }, { id: 3, user_id: 2, title: "Draft Post" }, { id: 4, user_id: 2, title: "Node.js Basics" }, { id: 5, user_id: 1, title: "Old Announcement" }, { id: 6, user_id: null, title: "Orphan Draft" }]';

export default doiDau({
  slug: 'wf-8-4-relationships-joins',
  ten: '8.4 Quan hệ và JOIN',
  baiHoc: 'Nền tảng Web — Bài 8.4 Relationships and JOINs',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'INNER JOIN và LEFT JOIN bằng chỉ mục Map, đếm dòng con kể cả 0, gom dòng phẳng của JOIN thành object lồng như ORM, nhiều-nhiều qua bảng nối, mô phỏng ON DELETE CASCADE/RESTRICT/SET NULL, và tìm N+1 trong nhật ký truy vấn — 6 bài.',
  de: [
    {
      tieuDe: 'INNER JOIN',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['INNER JOIN', 'chỉ mục bằng Map'], tienQuyet: ['Map', 'flatMap'], the: ['javascript', 'sql', 'join'],
      moTa: `${BAI}<p>Viết ${c('innerJoin(left, right, leftKey, rightKey, pick)')}: với mỗi dòng ${c('l')} của ${c('left')} (theo thứ tự) và MỖI dòng ${c('r')} của ${c('right')} có ${c('l[leftKey] === r[rightKey]')} (theo thứ tự của right), trả ${c('pick(l, r)')}. Giá trị null/undefined không bao giờ khớp. Dựng một ${c('Map')} từ giá trị khoá sang danh sách dòng bên phải trước, đừng lồng hai vòng lặp.</p>`,
      yeuCau: ['Chỉ cặp khớp.', 'null không khớp null.', 'Nhiều dòng phải khớp ⇒ nhiều kết quả.'],
      dauVao: 'left, right: object[]; leftKey, rightKey: string; pick: (l, r) => any.', dauRa: 'any[].',
      rangBuoc: ['Độ phức tạp O(n + m), không O(n × m).'],
      viDu: [{ input: 'innerJoin(posts, users, "user_id", "id", (p, u) => p.title + " — " + u.name)', output: '5 dòng, "Orphan Draft" biến mất', explanation: 'Như INNER JOIN trong bài.' }],
      goiY: ['const index = new Map(); for (const r of right) { if (r[rightKey] == null) continue; … push }', 'left.flatMap((l) => (index.get(l[leftKey]) ?? []).map((r) => pick(l, r)))'],
      khoiDau: { 'main.js': `// Bài 8.4 — INNER JOIN
function innerJoin(left, right, leftKey, rightKey, pick) {
  return left.map((l) => pick(l, right.find((r) => r[rightKey] == l[leftKey])));
}
` },
      loiGiai: { 'main.js': `// Bài 8.4 — dựng chỉ mục cho bên phải một lần, rồi tra cho từng dòng bên trái (hash join)
function innerJoin(left, right, leftKey, rightKey, pick) {
  const index = new Map();
  for (const r of right) {
    const k = r[rightKey];
    if (k === null || k === undefined) continue;             // NULL không bao giờ khớp
    if (!index.has(k)) index.set(k, []);
    index.get(k).push(r);
  }
  return left.flatMap((l) => (index.get(l[leftKey]) ?? []).map((r) => pick(l, r)));
}
` },
      giaiThich: `<p>Đây gần như đúng thuật toán "hash join" mà PostgreSQL dùng cho bảng lớn. Code khởi đầu sai ba chỗ: giữ cả dòng không khớp (thành pick với undefined), chỉ lấy dòng khớp đầu tiên, và dùng == nên null khớp undefined.</p>`,
      loiHayGap: ['find chỉ lấy một dòng khớp.', 'Cho null khớp null.', 'Hai vòng lặp lồng — chậm với bảng lớn.'],
      thamKhao: 'https://www.postgresql.org/docs/current/planner-optimizer.html',
      kiem: [
        { moTa: 'Posts with authors; the orphan disappears|||Bài kèm tác giả; bài mồ côi biến mất', goi: 'innerJoin(' + POSTS + ', ' + USERS + ', "user_id", "id", (p, u) => p.title + " — " + u.name)', mongDoi: ['Hello World — Lan', 'Learning SQL — Lan', 'Draft Post — Minh', 'Node.js Basics — Minh', 'Old Announcement — Lan'] },
        { moTa: 'One left row, several matches|||Một dòng trái, nhiều dòng khớp', goi: 'innerJoin(' + USERS + ', ' + POSTS + ', "id", "user_id", (u, p) => u.name + ":" + p.id)', mongDoi: ['Lan:1', 'Lan:2', 'Lan:5', 'Minh:3', 'Minh:4'] },
        { moTa: 'NULL never matches|||NULL không bao giờ khớp', goi: 'innerJoin([{ k: null }, { k: 1 }], [{ k: null }, { k: 1 }], "k", "k", (a, b) => [a.k, b.k])', mongDoi: [[1, 1]] },
      ],
    },
    {
      tieuDe: 'LEFT JOIN',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['LEFT JOIN', 'NULL bên thiếu'], tienQuyet: ['Map', 'flatMap'], the: ['javascript', 'sql', 'join'],
      moTa: `${BAI}<p>Viết ${c('leftJoin(left, right, leftKey, rightKey, pick)')} như bài trước nhưng GIỮ mọi dòng bên trái: dòng không có cặp gọi ${c('pick(l, null)')} đúng một lần.</p>`,
      yeuCau: ['Mọi dòng trái xuất hiện ít nhất một lần.', 'Không cặp ⇒ pick(l, null).'],
      dauVao: 'như innerJoin.', dauRa: 'any[].',
      rangBuoc: ['O(n + m).'],
      viDu: [{ input: 'leftJoin(posts, users, …, (p, u) => [p.title, u?.name ?? null])', output: '6 dòng, ["Orphan Draft", null] ở cuối', explanation: 'Như LEFT JOIN trong bài.' }],
      goiY: ['const matches = index.get(l[leftKey]) ?? [];', 'return matches.length ? matches.map((r) => pick(l, r)) : [pick(l, null)];'],
      khoiDau: { 'main.js': `// Bài 8.4 — LEFT JOIN
function leftJoin(left, right, leftKey, rightKey, pick) {
  return left.filter((l) => right.some((r) => r[rightKey] === l[leftKey])).map((l) => pick(l, null));
}
` },
      loiGiai: { 'main.js': `// Bài 8.4 — như INNER JOIN, nhưng dòng trái không có cặp vẫn ở lại với NULL
function leftJoin(left, right, leftKey, rightKey, pick) {
  const index = new Map();
  for (const r of right) {
    const k = r[rightKey];
    if (k === null || k === undefined) continue;
    if (!index.has(k)) index.set(k, []);
    index.get(k).push(r);
  }
  return left.flatMap((l) => {
    const matches = index.get(l[leftKey]) ?? [];
    return matches.length ? matches.map((r) => pick(l, r)) : [pick(l, null)];
  });
}
` },
      giaiThich: `<p>Chọn LEFT hay INNER bằng câu hỏi của bài: "dòng bên trái có thể tồn tại không cặp, và tôi có muốn thấy nó không?". Hàm ${c('pick')} nhận null là chỗ bạn quyết định hiển thị gì — "(chưa có tác giả)" chẳng hạn.</p>`,
      loiHayGap: ['Bỏ dòng không cặp (thành INNER).', 'Gọi pick(l, null) cả khi đã có cặp.'],
      thamKhao: 'https://sqlite.org/lang_select.html#special_handling_of_cross_join_',
      kiem: [
        { moTa: 'Every post stays|||Mọi bài ở lại', goi: 'leftJoin(' + POSTS + ', ' + USERS + ', "user_id", "id", (p, u) => [p.title, u ? u.name : null])', mongDoi: [['Hello World', 'Lan'], ['Learning SQL', 'Lan'], ['Draft Post', 'Minh'], ['Node.js Basics', 'Minh'], ['Old Announcement', 'Lan'], ['Orphan Draft', null]] },
        { moTa: 'Users with their posts, An with none|||Người dùng kèm bài, An không có', goi: 'leftJoin(' + USERS + ', ' + POSTS + ', "id", "user_id", (u, p) => u.name + ":" + (p ? p.id : "-"))', mongDoi: ['Lan:1', 'Lan:2', 'Lan:5', 'Minh:3', 'Minh:4', 'An:-'] },
        { moTa: 'NULL keys and empty right side|||Khoá NULL và bên phải rỗng', goi: '[leftJoin([{ k: null }], [{ k: null }], "k", "k", (a, b) => b), leftJoin([{ k: 1 }, { k: 2 }], [], "k", "k", (a, b) => [a.k, b])]', mongDoi: [[null], [[1, null], [2, null]]] },
      ],
    },
    {
      tieuDe: 'Đếm con, kể cả số không',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['LEFT JOIN + GROUP BY', 'count(cột)'], tienQuyet: ['Map', 'map'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('countChildren(parents, children, fk, as)')} trả MỖI dòng cha (theo thứ tự) dưới dạng bản sao có thêm thuộc tính tên ${c('as')} = số dòng con có ${c('child[fk] === parent.id')} — kể cả 0. Kết quả sắp theo số đếm giảm dần, bằng nhau thì giữ thứ tự cũ. Đây là ${c('SELECT users.*, count(posts.id) … LEFT JOIN … GROUP BY users.id ORDER BY … DESC')} của bài.</p>`,
      yeuCau: ['Giữ cha có 0 con.', 'Không sửa dữ liệu vào.', 'Sắp giảm dần, ổn định.'],
      dauVao: 'parents, children: object[]; fk: string; as: string.', dauRa: 'object[].',
      rangBuoc: ['Đếm một lượt qua children (Map), không filter cho từng cha.'],
      viDu: [{ input: 'countChildren(users, posts, "user_id", "posts")', output: '[{ id: 1, name: "Lan", posts: 3 }, { id: 2, …, posts: 2 }, { id: 3, name: "An", posts: 0 }]', explanation: 'An ở lại với 0 — INNER JOIN sẽ làm cô biến mất.' }],
      goiY: ['const counts = new Map(); for (const ch of children) counts.set(ch[fk], (counts.get(ch[fk]) ?? 0) + 1);', 'parents.map((p) => ({ ...p, [as]: counts.get(p.id) ?? 0 })).toSorted((a, b) => b[as] - a[as])'],
      khoiDau: { 'main.js': `// Bài 8.4 — đếm con
function countChildren(parents, children, fk, as) {
  return parents.filter((p) => children.some((c) => c[fk] === p.id))
    .map((p) => ({ ...p, [as]: children.filter((c) => c[fk] === p.id).length }));
}
` },
      loiGiai: { 'main.js': `// Bài 8.4 — đếm một lượt, rồi gắn số đếm cho MỌI cha (thiếu thì 0)
function countChildren(parents, children, fk, as) {
  const counts = new Map();
  for (const ch of children) {
    const k = ch[fk];
    if (k === null || k === undefined) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return parents
    .map((p) => ({ ...p, [as]: counts.get(p.id) ?? 0 }))    // LEFT JOIN: không con ⇒ 0
    .toSorted((a, b) => b[as] - a[as]);                     // ổn định khi bằng nhau
}
` },
      giaiThich: `<p>Code khởi đầu là phiên bản INNER JOIN: An biến mất, và bảng điều khiển không bao giờ cho thấy ai chưa hoạt động. Nó còn chậm: lọc cả mảng con cho từng cha là O(n × m).</p>`,
      loiHayGap: ['Bỏ cha có 0 con.', 'Lọc mảng con cho từng cha.', 'Sửa trực tiếp object cha.'],
      thamKhao: 'https://www.postgresql.org/docs/current/tutorial-agg.html',
      kiem: [
        { moTa: 'Posts per user, An included|||Số bài mỗi người, có An', goi: 'countChildren(' + USERS + ', ' + POSTS + ', "user_id", "posts")', mongDoi: [{ id: 1, name: 'Lan', posts: 3 }, { id: 2, name: 'Minh', posts: 2 }, { id: 3, name: 'An', posts: 0 }] },
        { moTa: 'Comments per post; ties keep order; input untouched|||Bình luận mỗi bài; bằng nhau giữ thứ tự; dữ liệu vào nguyên vẹn', chuanBi: 'const P = ' + POSTS + '; const C = [{ post_id: 1 }, { post_id: 1 }, { post_id: 4 }, { post_id: 4 }, { post_id: 2 }]; const r = countChildren(P, C, "post_id", "comments");', goi: '[r.map((p) => p.id + ":" + p.comments), "comments" in P[0]]', mongDoi: [['1:2', '4:2', '2:1', '3:0', '5:0', '6:0'], false] },
        { moTa: 'NULL foreign keys are not counted; no children|||Khoá ngoại NULL không được đếm; không có con', goi: '[countChildren([{ id: 1 }], [{ u: null }, { u: 1 }], "u", "n"), countChildren([{ id: 7 }, { id: 8 }], [], "u", "n")]', mongDoi: [[{ id: 1, n: 1 }], [{ id: 7, n: 0 }, { id: 8, n: 0 }]] },
      ],
    },
    {
      tieuDe: 'Gom dòng JOIN thành object lồng',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['dòng phẳng', 'object lồng', 'việc ORM làm'], tienQuyet: ['Map', 'object'], the: ['javascript', 'sql', 'orm'],
      moTa: `${BAI}<p>Một ${c('users LEFT JOIN posts')} trả các dòng PHẲNG: ${c('{ user_id, name, post_id, title }')} — mỗi người lặp lại một lần cho mỗi bài, người không có bài thì ${c('post_id')} và ${c('title')} là null. Viết ${c('nest(rows)')} trả ${c('[{ id, name, posts: [{ id, title }] }]')}: mỗi người một object theo thứ tự xuất hiện đầu tiên, ${c('posts')} theo thứ tự dòng, người không có bài thì ${c('posts: []')} (không có phần tử null).</p>`,
      yeuCau: ['Một object mỗi user_id.', 'Không có bài null.', 'Giữ thứ tự.'],
      dauVao: 'rows: { user_id, name, post_id, title }[].', dauRa: 'object[].',
      rangBuoc: ['Một lượt qua rows.'],
      viDu: [{ input: 'nest(kết quả LEFT JOIN của blog)', output: '[{ id: 1, name: "Lan", posts: [3 bài] }, …, { id: 3, name: "An", posts: [] }]', explanation: 'Đây là việc include: { posts: true } của Prisma trả cho bạn.' }],
      goiY: ['const byId = new Map(); for (const r of rows) { if (!byId.has(r.user_id)) byId.set(r.user_id, { id: r.user_id, name: r.name, posts: [] }); … }', 'if (r.post_id !== null) byId.get(r.user_id).posts.push({ id: r.post_id, title: r.title });'],
      khoiDau: { 'main.js': `// Bài 8.4 — gom dòng JOIN thành object lồng
function nest(rows) {
  return rows.map((r) => ({ id: r.user_id, name: r.name, posts: [{ id: r.post_id, title: r.title }] }));
}
` },
      loiGiai: { 'main.js': `// Bài 8.4 — dòng phẳng (user lặp lại) → mỗi user một object với mảng posts
function nest(rows) {
  const byId = new Map();                                    // Map giữ thứ tự xuất hiện
  for (const r of rows) {
    if (!byId.has(r.user_id)) byId.set(r.user_id, { id: r.user_id, name: r.name, posts: [] });
    if (r.post_id !== null && r.post_id !== undefined) {     // LEFT JOIN không có bài ⇒ bỏ
      byId.get(r.user_id).posts.push({ id: r.post_id, title: r.title });
    }
  }
  return [...byId.values()];
}
` },
      giaiThich: `<p>JSON lồng là thứ front-end muốn; dòng phẳng là thứ SQL trả. Ở giữa luôn có một bước gom như thế này — trong ORM, trong ${c('json_agg')} của PostgreSQL, hoặc trong mã của bạn. Quên bỏ dòng null là lỗi kinh điển: An hiện ra với một "bài" trống.</p>`,
      loiHayGap: ['Mỗi dòng một user (user lặp lại).', 'posts: [{ id: null, title: null }] cho người không có bài.'],
      thamKhao: 'https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries',
      kiem: [
        { moTa: 'The blog, nested|||Blog, đã lồng', goi: 'nest([{ user_id: 1, name: "Lan", post_id: 1, title: "Hello World" }, { user_id: 1, name: "Lan", post_id: 2, title: "Learning SQL" }, { user_id: 2, name: "Minh", post_id: 3, title: "Draft Post" }, { user_id: 1, name: "Lan", post_id: 5, title: "Old Announcement" }, { user_id: 3, name: "An", post_id: null, title: null }])', mongDoi: [{ id: 1, name: 'Lan', posts: [{ id: 1, title: 'Hello World' }, { id: 2, title: 'Learning SQL' }, { id: 5, title: 'Old Announcement' }] }, { id: 2, name: 'Minh', posts: [{ id: 3, title: 'Draft Post' }] }, { id: 3, name: 'An', posts: [] }] },
        { moTa: 'No rows|||Không có dòng', goi: 'nest([])', mongDoi: [] },
        { moTa: 'Users who appear later keep their first position|||Người xuất hiện lại giữ vị trí đầu tiên', goi: 'nest([{ user_id: 2, name: "Minh", post_id: 3, title: "A" }, { user_id: 1, name: "Lan", post_id: 1, title: "B" }, { user_id: 2, name: "Minh", post_id: 4, title: "C" }]).map((u) => u.name + ":" + u.posts.map((p) => p.id).join(","))', mongDoi: ['Minh:3,4', 'Lan:1'] },
      ],
    },
    {
      tieuDe: 'Nhiều-nhiều và luật xoá',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['bảng nối', 'ON DELETE'], tienQuyet: ['filter', 'Set'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Hai hàm. (1) ${c('tagsOf(posts, tags, postTags)')}: trả mỗi bài (theo thứ tự) dạng ${c('{ title, tags }')} với ${c('tags')} là TÊN thẻ sắp chữ cái, chỉ những bài có ít nhất một thẻ. (2) ${c('deleteParent(parentId, children, fk, rule)')} mô phỏng xoá dòng cha: ${c('rule')} là ${c('"cascade"')} ⇒ trả ${c('{ ok: true, children: <không còn con của cha đó> }')}; ${c('"restrict"')} ⇒ nếu còn con thì ${c('{ ok: false, error: "FOREIGN KEY constraint failed" }')}, không thì như cascade; ${c('"set null"')} ⇒ các con của cha đó có ${c('fk')} = null. Không sửa mảng vào.</p>`,
      yeuCau: ['Tên thẻ sắp chữ cái.', 'Ba luật xoá.', 'Không đột biến.'],
      dauVao: 'xem mô tả.', dauRa: 'xem mô tả.',
      rangBuoc: ['Hai hàm trong cùng tệp.'],
      viDu: [{ input: 'deleteParent(2, comments, "user_id", "restrict")', output: '{ ok: false, error: "FOREIGN KEY constraint failed" }', explanation: 'Xoá Minh bị từ chối trong bài.' }],
      goiY: ['const names = new Map(tags.map((t) => [t.id, t.name]));', 'children.map((ch) => ch[fk] === parentId ? { ...ch, [fk]: null } : { ...ch })'],
      khoiDau: { 'main.js': `// Bài 8.4 — nhiều-nhiều và luật xoá
function tagsOf(posts, tags, postTags) {
  return posts.map((p) => ({ title: p.title, tags: [] }));
}
function deleteParent(parentId, children, fk, rule) {
  return { ok: true, children };
}
` },
      loiGiai: { 'main.js': `// Bài 8.4 — bảng nối giữ các cặp; khoá ngoại quyết định chuyện gì xảy ra khi xoá cha
function tagsOf(posts, tags, postTags) {
  const names = new Map(tags.map((t) => [t.id, t.name]));
  return posts
    .map((p) => ({
      title: p.title,
      tags: postTags.filter((pt) => pt.post_id === p.id).map((pt) => names.get(pt.tag_id)).sort(),
    }))
    .filter((p) => p.tags.length > 0);                       // như JOIN: bài không thẻ không có dòng
}

function deleteParent(parentId, children, fk, rule) {
  const mine = children.filter((ch) => ch[fk] === parentId);
  if (rule === 'restrict' && mine.length > 0) return { ok: false, error: 'FOREIGN KEY constraint failed' };
  if (rule === 'set null') {
    return { ok: true, children: children.map((ch) => (ch[fk] === parentId ? { ...ch, [fk]: null } : { ...ch })) };
  }
  return { ok: true, children: children.filter((ch) => ch[fk] !== parentId).map((ch) => ({ ...ch })) };   // cascade
}
` },
      giaiThich: `<p>Hai bảng nối của bài (post_tags) và ba luật ON DELETE tóm lại thành hai hàm. Câu hỏi thiết kế cho mỗi khoá ngoại: dòng con có ý nghĩa khi không còn cha không? Không (bình luận của bài) ⇒ cascade; có, và cần giữ lịch sử (bình luận của người dùng) ⇒ restrict; có, quan hệ tuỳ chọn (tác giả của bài) ⇒ set null.</p>`,
      loiHayGap: ['Quên sắp tên thẻ.', 'restrict vẫn xoá.', 'Sửa trực tiếp mảng con.'],
      thamKhao: 'https://sqlite.org/foreignkeys.html#fk_actions',
      kiem: [
        { moTa: 'Posts with their tags|||Bài kèm thẻ', goi: 'tagsOf(' + POSTS + ', [{ id: 1, name: "sql" }, { id: 2, name: "beginner" }, { id: 3, name: "node" }], [{ post_id: 1, tag_id: 2 }, { post_id: 2, tag_id: 1 }, { post_id: 2, tag_id: 2 }, { post_id: 4, tag_id: 3 }, { post_id: 4, tag_id: 2 }])', mongDoi: [{ title: 'Hello World', tags: ['beginner'] }, { title: 'Learning SQL', tags: ['beginner', 'sql'] }, { title: 'Node.js Basics', tags: ['beginner', 'node'] }] },
        { moTa: 'Cascade and restrict like the lesson|||Cascade và restrict như bài', chuanBi: 'const C = [{ id: 1, post_id: 1, user_id: 2 }, { id: 2, post_id: 1, user_id: 3 }, { id: 3, post_id: 4, user_id: 1 }];', goi: '[deleteParent(1, C, "post_id", "cascade").children.map((c) => c.id), deleteParent(2, C, "user_id", "restrict"), deleteParent(9, C, "user_id", "restrict").ok]', mongDoi: [[3], { ok: false, error: 'FOREIGN KEY constraint failed' }, true] },
        { moTa: 'SET NULL keeps children; input untouched|||SET NULL giữ con; dữ liệu vào nguyên vẹn', chuanBi: 'const P = [{ id: 1, user_id: 2 }, { id: 2, user_id: 1 }]; const r = deleteParent(2, P, "user_id", "set null");', goi: '[r.children, P[0].user_id]', mongDoi: [[{ id: 1, user_id: null }, { id: 2, user_id: 1 }], 2] },
      ],
    },
    {
      tieuDe: 'Tìm N+1 trong nhật ký truy vấn',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['N+1', 'chuẩn hoá truy vấn', 'nhật ký truy vấn'], tienQuyet: ['regex', 'Map', 'sort'], the: ['javascript', 'sql', 'hiệu năng'],
      moTa: `${BAI}<p>Viết ${c('findNPlusOne(log, threshold = 5)')}: ${c('log')} là mảng câu SQL đã chạy trong MỘT request (có thể có giá trị đã điền vào). Chuẩn hoá mỗi câu thành "khuôn": thay chuỗi trong nháy đơn bằng ${c('?')}, thay số (nguyên hoặc thập phân, không nằm trong tên như ${c('t1')}) bằng ${c('?')}, gộp danh sách ${c('IN (?, ?, ?)')} thành ${c('IN (?)')}, gộp khoảng trắng thành một dấu cách, trim. Trả mảng ${c('{ template, count }')} cho các khuôn xuất hiện ≥ ${c('threshold')} lần, sắp theo ${c('count')} giảm dần rồi ${c('template')} tăng dần.</p>`,
      yeuCau: ['Chuỗi và số → ?.', 'IN (…) gộp lại.', 'Khoảng trắng chuẩn hoá.', 'Đúng ngưỡng và thứ tự.'],
      dauVao: 'log: string[]; threshold?: number.', dauRa: '{ template, count }[].',
      rangBuoc: ["Chuỗi có thể chứa '' (nháy kép trong SQL)."],
      viDu: [{ input: '1 SELECT bài + 1000 SELECT name FROM users WHERE id = 1, 2, …', output: '[{ template: "SELECT name FROM users WHERE id = ?", count: 1000 }]', explanation: 'Đúng 1001 truy vấn của bài.' }],
      goiY: ["sql.replace(/'(?:[^']|'')*'/g, '?').replace(/\\b\\d+(?:\\.\\d+)?\\b/g, '?')", "replace(/IN\\s*\\(\\s*\\?(?:\\s*,\\s*\\?)*\\s*\\)/gi, 'IN (?)').replace(/\\s+/g, ' ').trim()"],
      khoiDau: { 'main.js': `// Bài 8.4 — tìm N+1
function findNPlusOne(log, threshold = 5) {
  const counts = {};
  for (const q of log) counts[q] = (counts[q] ?? 0) + 1;
  return Object.entries(counts).filter(([, n]) => n >= threshold).map(([template, count]) => ({ template, count }));
}
` },
      loiGiai: { 'main.js': `// Bài 8.4 — cùng một khuôn truy vấn lặp lại N lần trong một request = dấu hiệu N+1
function normalize(sql) {
  return sql
    .replace(/'(?:[^']|'')*'/g, '?')                                     // 'chuỗi' → ?
    .replace(/\\b\\d+(?:\\.\\d+)?\\b/g, '?')                               // số → ? (không đụng t1, user_2)
    .replace(/IN\\s*\\(\\s*\\?(?:\\s*,\\s*\\?)*\\s*\\)/gi, 'IN (?)')         // IN (?, ?, ?) → IN (?)
    .replace(/\\s+/g, ' ')
    .trim();
}
function findNPlusOne(log, threshold = 5) {
  const counts = new Map();
  for (const q of log) {
    const t = normalize(q);
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, n]) => n >= threshold)
    .map(([template, count]) => ({ template, count }))
    .sort((a, b) => b.count - a.count || (a.template < b.template ? -1 : a.template > b.template ? 1 : 0));
}
` },
      giaiThich: `<p>Đây là cách các công cụ như Sentry, Bullet (Rails) hay nhật ký truy vấn của Prisma (Bài 8.5) nhận ra N+1: không phải nhìn một truy vấn chậm, mà đếm một khuôn lặp lại theo số dòng. Chuẩn hoá giá trị là bước then chốt — ${c('WHERE id = 1')} và ${c('WHERE id = 2')} là cùng một truy vấn.</p>`,
      loiHayGap: ['So nguyên văn — mỗi id là một câu khác.', 'Thay cả số trong tên bảng (t1 → t?).', 'Quên gộp IN.'],
      thamKhao: 'https://docs.sentry.io/product/issues/issue-details/performance-issues/n-one-queries/',
      kiem: [
        { moTa: 'The lesson feed: 1 + N queries|||Bảng tin của bài: 1 + N truy vấn', chuanBi: 'const L = ["SELECT id, title, user_id FROM posts ORDER BY id"]; for (let i = 1; i <= 1000; i++) L.push("SELECT name FROM users WHERE id = " + ((i % 100) + 1));', goi: 'findNPlusOne(L)', mongDoi: [{ template: 'SELECT name FROM users WHERE id = ?', count: 1000 }] },
        { moTa: 'Strings, decimals, whitespace, IN lists|||Chuỗi, số thập phân, khoảng trắng, danh sách IN', chuanBi: 'const L = []; for (let i = 0; i < 3; i++) L.push("SELECT * FROM t1 WHERE name = \'O\'\'Brien\' AND price > 9.5"); for (let i = 0; i < 3; i++) L.push("SELECT  *   FROM posts WHERE user_id IN (" + [1, 2, 3].slice(0, i + 1).join(", ") + ")");', goi: 'findNPlusOne(L, 3)', mongDoi: [{ template: 'SELECT * FROM posts WHERE user_id IN (?)', count: 3 }, { template: 'SELECT * FROM t1 WHERE name = ? AND price > ?', count: 3 }] },
        { moTa: 'Below the threshold: nothing|||Dưới ngưỡng: không có gì', goi: 'findNPlusOne(["SELECT 1", "SELECT 2", "SELECT 3"])', mongDoi: [] },
      ],
    },
  ],
});
