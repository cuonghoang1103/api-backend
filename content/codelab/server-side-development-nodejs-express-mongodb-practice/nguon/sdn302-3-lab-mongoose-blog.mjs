/** SDN302 · Lab Chương 3 — Tầng dữ liệu blog bằng Mongoose: 3 schema có validation + tham chiếu, service tạo/lọc/phân trang/populate, đếm bình luận, lỗi có mã trạng thái. Đề "bản in". */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;

const L1 = cs({
  ten: 'Lab 3 · warm-up — model the blog before writing queries', kho: 'EASY', phut: 6, dangBai: 'lab',
  en: 'Model-first: decide the shape of the documents, then the queries follow.',
  vi: 'Mô hình trước: quyết định hình dạng document, truy vấn sẽ theo sau.',
  cau: [
    q('m1', ['Where should a post\'s comments live?', 'Bình luận của một bài viết nên nằm ở đâu?'],
      ['In their own collection, each comment referencing its post and its user', 'Embedded in the post as an array — one read gets everything', 'Embedded in the user document', 'In a comma-separated string field on the post'],
      ['Comments grow without limit and are written by many users: reference them (and count them with countDocuments).', 'Bình luận tăng không giới hạn và do nhiều người viết: hãy tham chiếu (và đếm bằng countDocuments).']),
    q('m2', ['A post has 0–5 tags shown with it. Where?', 'Một bài có 0–5 tag hiện cùng nó. Ở đâu?'],
      ['An array of strings inside the post', 'A Tag collection referenced by id', 'One document per tag in the comments collection', 'In the author\'s document'],
      ['Small, bounded, read together: embed.', 'Nhỏ, có giới hạn, đọc cùng nhau: nhúng.']),
    qn('m3', ['Which queries need <code>populate</code>? (choose all)', 'Truy vấn nào cần <code>populate</code>? (chọn hết)'],
      ['The post list showing each author\'s name', 'A post page showing every commenter\'s name', 'Counting the comments of a post', 'Filtering posts by tag'],
      [0, 1], ['Counting and filtering on the post\'s own fields need no join.', 'Đếm và lọc trên field của chính bài viết không cần nối.']),
  ],
  goiY: [['Bounded + read together ⇒ embed.', 'Có giới hạn + đọc cùng ⇒ nhúng.'], ['Unbounded or shared ⇒ reference.', 'Không giới hạn hoặc dùng chung ⇒ tham chiếu.']],
  loi: [['Embedding comments.', 'Nhúng bình luận.'], ['Populating to count.', 'Populate để đếm.']],
  tns: [tn('model-first', 'mô hình trước')],
  kn: ['data modelling'],
});

const L2 = bai({
  ten: 'Lab 3 — The data layer of a blog with Mongoose', kho: 'HARD', phut: 85, dangBai: 'lab', lib: ['mongoose'],
  en: J`<p>Write the three models and the service functions of a blog. No HTTP here: the next chapter will put routes on top of these functions. The full brief is in the statement.</p>`,
  vi: J`<p>Viết ba model và các hàm service của một blog. Ở đây không có HTTP: chương sau sẽ đặt route lên trên các hàm này. Đề đầy đủ nằm trong tờ đề.</p>`,
  yc: [['Follow the brief.', 'Làm theo tờ đề.'], ['Export everything listed in "Submission".', 'Export mọi thứ liệt kê trong "Nộp bài".']],
  viDu: [['await listPosts({ tag: \'node\', limit: 2 })', '{"total":3,"page":1,"pages":2,"items":[{ title, tags, author: { _id, name }, commentCount }, …]}', 'Only published posts, newest first.', 'Chỉ bài đã đăng, mới nhất trước.']],
  goiY: [['Build the filter, then run <code>countDocuments(filter)</code> and the page query with <code>Promise.all</code>.', 'Dựng bộ lọc, rồi chạy <code>countDocuments(filter)</code> và truy vấn trang bằng <code>Promise.all</code>.'], ['<code>const err = (status, message) => Object.assign(new Error(message), { status });</code>', '<code>const err = (status, message) => Object.assign(new Error(message), { status });</code>']],
  loi: [['<code>ref: \'user\'</code> instead of the model name <code>\'User\'</code>.', '<code>ref: \'user\'</code> thay vì tên model <code>\'User\'</code>.'], ['Reading <code>.length</code> of an un-awaited query.', 'Đọc <code>.length</code> của truy vấn chưa await.'], ['Populating the whole user (email leaks) instead of <code>\'name\'</code>.', 'Populate nguyên người dùng (lộ email) thay vì <code>\'name\'</code>.']],
  gt: ['Schemas carry the rules (so invalid documents never reach MongoDB), references model the relationships, and the services combine filtering, paging, populate with field lists and counting — the whole of Chapter 3 behind functions that a controller can call.', 'Schema mang luật (nên document sai không bao giờ tới MongoDB), tham chiếu mô hình hoá quan hệ, và service kết hợp lọc, phân trang, populate kèm danh sách field và đếm — toàn bộ Chương 3 nằm sau các hàm mà controller có thể gọi.'],
  kn: ['Mongoose', 'populate', 'pagination'],
  tns: [tn('data layer', 'tầng dữ liệu'), tn('pagination', 'phân trang')],
  banIn: {
    tieuDe: { en: 'Lab 3 — Blog data layer (Mongoose)', vi: 'Lab 3 — Tầng dữ liệu blog (Mongoose)' },
    phu: { en: 'Mongoose 8 · schemas · populate · 85 minutes · 10 marks', vi: 'Mongoose 8 · schema · populate · 85 phút · 10 điểm' },
    moTa: { en: '<p>Three models — <code>User</code>, <code>Post</code>, <code>Comment</code> — and five functions. Errors that the API will turn into HTTP answers are thrown as <code>Error</code> objects with a <code>status</code> property (404, 409…). The grader calls your functions directly.</p>', vi: '<p>Ba model — <code>User</code>, <code>Post</code>, <code>Comment</code> — và năm hàm. Lỗi mà API sẽ biến thành câu trả lời HTTP được ném dưới dạng <code>Error</code> có thuộc tính <code>status</code> (404, 409…). Máy chấm gọi thẳng các hàm của bạn.</p>' },
    yeuCauChung: [{ en: 'Model names exactly <code>User</code>, <code>Post</code>, <code>Comment</code>; all three with <code>{ timestamps: true }</code>.', vi: 'Tên model đúng <code>User</code>, <code>Post</code>, <code>Comment</code>; cả ba có <code>{ timestamps: true }</code>.' }, { en: 'Every query is awaited; no raw user documents with emails leave the data layer through populate.', vi: 'Mọi truy vấn đều được await; không document người dùng có email nào rời tầng dữ liệu qua populate.' }],
    cayThuMuc: 'answer.js   ← models + services\nlib/        ← provided (Mongoose stand-in)',
    moHinh: [
      { ten: 'User', truong: [['name', 'String', { en: 'required, trimmed, 2–50', vi: 'bắt buộc, trim, 2–50' }], ['email', 'String', { en: 'required, unique, lower-case, must contain @', vi: 'bắt buộc, duy nhất, chữ thường, phải có @' }]] },
      { ten: 'Post', truong: [['title', 'String', { en: 'required, trimmed, 3–120', vi: 'bắt buộc, trim, 3–120' }], ['body', 'String', { en: 'default ""', vi: 'mặc định ""' }], ['author', 'ObjectId → User', { en: 'required', vi: 'bắt buộc' }], ['tags', '[String]', { en: 'lower-case strings', vi: 'chuỗi chữ thường' }], ['status', 'String', { en: "'draft' | 'published', default 'draft'", vi: "'draft' | 'published', mặc định 'draft'" }]] },
      { ten: 'Comment', truong: [['text', 'String', { en: 'required, trimmed, 1–500', vi: 'bắt buộc, trim, 1–500' }], ['user', 'ObjectId → User', { en: 'required', vi: 'bắt buộc' }], ['post', 'ObjectId → Post', { en: 'required', vi: 'bắt buộc' }]] },
    ],
    chucNang: [
      { ten: { en: 'Schemas and validation', vi: 'Schema và validation' }, diem: 2, yeuCau: [{ en: 'The rules of the data model above; invalid documents are rejected with Mongoose\'s ValidationError.', vi: 'Các luật của mô hình dữ liệu ở trên; document sai bị từ chối với ValidationError của Mongoose.' }] },
      { ten: { en: 'createPost(authorId, data)', vi: 'createPost(authorId, data)' }, diem: 2, yeuCau: [
        { en: 'Unknown or malformed author id ⇒ throw status 404 <code>"Author not found"</code>.', vi: 'Id tác giả lạ hoặc dị dạng ⇒ ném status 404 <code>"Author not found"</code>.' },
        { en: 'Accept only <code>title</code>, <code>body</code>, <code>tags</code>, <code>status</code> from <code>data</code>; tags are trimmed, lower-cased and de-duplicated; return the created post.', vi: 'Chỉ nhận <code>title</code>, <code>body</code>, <code>tags</code>, <code>status</code> từ <code>data</code>; tag được trim, chữ thường và bỏ trùng; trả bài vừa tạo.' }] },
      { ten: { en: 'listPosts(options)', vi: 'listPosts(options)' }, diem: 2.5, yeuCau: [
        { en: '<code>{ tag, q, page = 1, limit = 10 }</code> — only <b>published</b> posts; <code>tag</code> exact (lower-case); <code>q</code> = title contains, case-insensitive; newest first.', vi: '<code>{ tag, q, page = 1, limit = 10 }</code> — chỉ bài <b>đã đăng</b>; <code>tag</code> khớp đúng (chữ thường); <code>q</code> = tiêu đề chứa, không phân biệt hoa thường; mới nhất trước.' },
        { en: 'Return <code>{ total, page, pages, items }</code>; each item <code>{ _id, title, tags, createdAt, author: { _id, name }, commentCount }</code>.', vi: 'Trả <code>{ total, page, pages, items }</code>; mỗi item <code>{ _id, title, tags, createdAt, author: { _id, name }, commentCount }</code>.' }] },
      { ten: { en: 'getPostWithComments(id)', vi: 'getPostWithComments(id)' }, diem: 2, yeuCau: [
        { en: 'Malformed or unknown id ⇒ <code>null</code>.', vi: 'Id dị dạng hoặc không có ⇒ <code>null</code>.' },
        { en: '<code>{ post, comments }</code>: post with <code>author: { _id, name }</code>; comments oldest first with <code>user: { _id, name }</code>.', vi: '<code>{ post, comments }</code>: bài với <code>author: { _id, name }</code>; bình luận cũ nhất trước với <code>user: { _id, name }</code>.' }] },
      { ten: { en: 'addComment(postId, userId, text)', vi: 'addComment(postId, userId, text)' }, diem: 1.5, yeuCau: [
        { en: 'Post missing ⇒ 404 <code>"Post not found"</code>; post is a draft ⇒ 409 <code>"Cannot comment on a draft"</code>; user missing ⇒ 404 <code>"User not found"</code>.', vi: 'Không có bài ⇒ 404 <code>"Post not found"</code>; bài là nháp ⇒ 409 <code>"Cannot comment on a draft"</code>; không có người dùng ⇒ 404 <code>"User not found"</code>.' },
        { en: 'Return the comment with <code>user</code> populated (<code>name</code> only).', vi: 'Trả bình luận với <code>user</code> đã populate (chỉ <code>name</code>).' }] },
    ],
    truDiem: [{ en: 'An email visible in any result: −1.', vi: 'Một email lộ trong bất kỳ kết quả nào: −1.' }],
    nopBai: { en: '<code>module.exports = { User, Post, Comment, createPost, listPosts, getPostWithComments, addComment };</code>', vi: '<code>module.exports = { User, Post, Comment, createPost, listPosts, getPostWithComments, addComment };</code>' },
  },
  dau: J`const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = mongoose.model('User', new Schema({ name: String, email: String }));
const Post = mongoose.model('Post', new Schema({ title: String, author: { type: Schema.Types.ObjectId, ref: 'user' }, tags: [String] }));
const Comment = mongoose.model('Comment', new Schema({ text: String, user: Schema.Types.ObjectId, post: Schema.Types.ObjectId }));

async function createPost(authorId, data) { return Post.create({ ...data, author: authorId }); }
async function listPosts() { const items = Post.find(); return { total: items.length, items }; }
async function getPostWithComments(id) { return Post.findById(id); }
async function addComment(postId, userId, text) { return Comment.create({ post: postId, user: userId, text }); }

module.exports = { User, Post, Comment, createPost, listPosts, getPostWithComments, addComment };
`,
  giai: J`const mongoose = require('mongoose');
const { Schema } = mongoose;

// ── models: the rules live here ──
const User = mongoose.model('User', new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /@/ },
}, { timestamps: true }));

const Post = mongoose.model('Post', new Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  body: { type: String, default: '' },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },     // ref = MODEL name
  tags: [{ type: String, lowercase: true, trim: true }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true }));

const Comment = mongoose.model('Comment', new Schema({
  text: { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true }));

const fail = (status, message) => Object.assign(new Error(message), { status });
const escape = (s) => String(s).replace(/[.*+?^@{}()|[\]\\]/g, '\\$&');

// ── services ──
async function createPost(authorId, data = {}) {
  if (!mongoose.isValidObjectId(authorId) || !(await User.exists({ _id: authorId }))) throw fail(404, 'Author not found');
  const { title, body, status } = data;
  const tags = Array.isArray(data.tags) ? [...new Set(data.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))] : [];
  return await Post.create({ title, body, status, tags, author: authorId });
}

async function listPosts({ tag, q, page = 1, limit = 10 } = {}) {
  const filter = { status: 'published' };
  if (tag) filter.tags = String(tag).toLowerCase();
  if (q) filter.title = { $regex: escape(q), $options: 'i' };
  const [total, posts] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
      .select('title tags createdAt author').populate('author', 'name'),
  ]);
  const counts = await Promise.all(posts.map((p) => Comment.countDocuments({ post: p._id })));
  const items = posts.map((p, i) => ({ _id: p._id, title: p.title, tags: p.tags, createdAt: p.createdAt, author: p.author, commentCount: counts[i] }));
  return { total, page, pages: Math.ceil(total / limit), items };
}

async function getPostWithComments(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const [post, comments] = await Promise.all([
    Post.findById(id).populate('author', 'name'),
    Comment.find({ post: id }).sort({ createdAt: 1 }).populate('user', 'name'),
  ]);
  return post ? { post, comments } : null;
}

async function addComment(postId, userId, text) {
  const post = mongoose.isValidObjectId(postId) ? await Post.findById(postId) : null;
  if (!post) throw fail(404, 'Post not found');
  if (post.status !== 'published') throw fail(409, 'Cannot comment on a draft');
  if (!mongoose.isValidObjectId(userId) || !(await User.exists({ _id: userId }))) throw fail(404, 'User not found');
  const c = await Comment.create({ post: postId, user: userId, text });
  return await c.populate('user', 'name');
}

module.exports = { User, Post, Comment, createPost, listPosts, getPostWithComments, addComment };
`,
  chuanBi: `const { User, Post, Comment, createPost, listPosts, getPostWithComments, addComment } = module.exports;
const err = (p) => p.then((v) => ({ ok: __json(v) }), (e) => ({ name: e.name, status: e.status || null, message: e.name === 'ValidationError' ? Object.keys(e.errors).sort().join(',') : e.message }));
const an = await User.create({ name: 'An', email: 'AN@x.com' }); const binh = await User.create({ name: 'Binh', email: 'binh@x.com' });
const mk = async (author, title, tags, status = 'published') => { const p = await Post.create({ title, tags, status, author: author._id }); await __sleep(5); return p; };
const p1 = await mk(an, 'Node event loop', ['node']); const p2 = await mk(binh, 'Express routing', ['node', 'express']); const p3 = await mk(an, 'Draft about Mongo', ['mongo'], 'draft'); const p4 = await mk(binh, 'Mongoose populate', ['node', 'mongo']);
await Comment.create({ text: 'Great', user: binh._id, post: p1._id }); await __sleep(5); await Comment.create({ text: 'Thanks', user: an._id, post: p1._id }); await Comment.create({ text: 'Nice', user: an._id, post: p4._id });
const brief = (r) => r.ok ? { total: r.ok.total, page: r.ok.page, pages: r.ok.pages, items: r.ok.items.map((i) => i.title + ' / ' + i.author.name + ' / ' + i.commentCount + ' / ' + Object.keys(i).sort().join(',')) } : r;`,
  cases: [
    { goi: `[await err(User.create({ name: 'A', email: 'nope' })), await err(Post.create({ title: 'Hi', status: 'secret' })), await err(Comment.create({}))]`, nhom: 'f1', moTa: ['Invalid users, posts and comments are rejected', 'Người dùng, bài, bình luận sai bị từ chối'] },
    { goi: `[(await User.findById(an._id)).email, (await err(User.create({ name: 'Copy', email: 'an@x.com' }))).name]`, nhom: 'f1', an: true },
    { goi: `[await err(createPost(new mongoose.Types.ObjectId(), { title: 'Ghost post' })), await err(createPost('abc', { title: 'Ghost post' }))]`, nhom: 'f2', moTa: ['Unknown / malformed author → 404', 'Tác giả lạ / dị dạng → 404'] },
    { goi: `await (async () => { const r = await err(createPost(an._id, { title: 'New one', tags: [' Node ', 'node', 'API'], author: binh._id, status: 'published' })); return r.ok ? [r.ok.title, r.ok.tags, String(r.ok.author) === String(an._id), r.ok.status] : r; })()`, nhom: 'f2', moTa: ['Tags normalised, author from the argument', 'Tag được chuẩn hoá, tác giả lấy từ đối số'] },
    { goi: `[brief(await err(listPosts())), brief(await err(listPosts({ tag: 'node', limit: 2 }))), brief(await err(listPosts({ tag: 'node', limit: 2, page: 2 })))]`, nhom: 'f3', moTa: ['Published only, newest first, paging, counts', 'Chỉ bài đã đăng, mới nhất trước, phân trang, số bình luận'] },
    { goi: `[brief(await err(listPosts({ q: 'MONGO' }))), JSON.stringify(await listPosts()).includes('@x.com')]`, nhom: 'f3', an: true },
    { goi: `await (async () => { const r = await getPostWithComments(String(p1._id)); return [r.post.title, r.post.author.name, r.comments.map((c) => c.text + ':' + c.user.name), JSON.stringify(r).includes('@x.com')]; })()`, nhom: 'f4', moTa: ['Post + author name + comments oldest first', 'Bài + tên tác giả + bình luận cũ nhất trước'] },
    { goi: `[await getPostWithComments('abc'), await getPostWithComments(new mongoose.Types.ObjectId())]`, nhom: 'f4', an: true },
    { goi: `[await err(addComment(p3._id, an._id, 'Hello')), await err(addComment(new mongoose.Types.ObjectId(), an._id, 'Hello')), await err(addComment(p2._id, new mongoose.Types.ObjectId(), 'Hello'))]`, nhom: 'f5', moTa: ['Draft → 409; missing post / user → 404', 'Nháp → 409; thiếu bài / người dùng → 404'] },
    { goi: `await (async () => { const r = await err(addComment(p2._id, an._id, '  First comment  ')); return r.ok ? [r.ok.text, r.ok.user] : r; })()`, nhom: 'f5', an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-3-lab-mongoose-blog',
  ten: 'Lab 3 — Blog data layer with Mongoose',
  khoa: KHOA,
  baiHoc: 'sdn302-3-2-mongoose',
  de: [L1, L2],
});
