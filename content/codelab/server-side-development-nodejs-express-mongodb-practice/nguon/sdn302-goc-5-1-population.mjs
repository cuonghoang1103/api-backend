/** SDN302 · Slot 5.1 (slide gốc) — Mongoose population (buổi 12–13): ref + populate, select, nhiều path, populate bình luận ("comments.user"),
 *  và câu hỏi về exec(callback) bị bỏ, ref = tên model, chi phí truy vấn — đã chạy thật trên Mongoose 8.24.8 (09/11/2026). */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const SEED = `const an = await User.create({ name: 'An', email: 'an@fpt.edu.vn' });
const binh = await User.create({ name: 'Binh', email: 'binh@fpt.edu.vn' });
const post = await Post.create({ title: 'Hello Mongo', author: an._id });
await Comment.create({ post: post._id, user: binh._id, text: 'Nice!' });
await Comment.create({ post: post._id, user: an._id, text: 'Thanks' });
const strip = (d) => JSON.parse(JSON.stringify(d, (k, v) => (k === '_id' || k === '__v' ? undefined : v)));`;

/* ── 1 ── schema + populate */
const E1 = bai({
  ten: 'Populate the author and the users of the comments', kho: 'MEDIUM', phut: 20, lib: ['mongoose'],
  en: J`<p>Syllabus sessions 12–13: "use population to cross-reference users within a comment" and "populate the comments with the users' information".</p>
<ol><li>Model <code>User</code>: <code>name</code> (String, required), <code>email</code> (String).</li>
<li>Model <code>Post</code>: <code>title</code> (String, required), <code>author</code> — an ObjectId referencing <code>User</code>.</li>
<li>Model <code>Comment</code> (its own collection, like <code>comment.js</code> in Slot 6): <code>post</code> — ObjectId ref <code>Post</code>, <code>user</code> — ObjectId ref <code>User</code>, <code>text</code> — String.</li>
<li><code>async function getPost(id)</code> — the post with <code>author</code> populated with <b>only</b> <code>name</code>.</li>
<li><code>async function getComments(postId)</code> — the comments of that post (in creation order), each with <code>user</code> populated with only <code>name</code>.</li></ol>
<p>Use <code>await</code> — never <code>exec(callback)</code>, which Mongoose 7+ rejects.</p>`,
  vi: J`<p>Buổi 12–13 của syllabus: "dùng population để tham chiếu người dùng trong bình luận" và "populate bình luận với thông tin người dùng".</p>
<ol><li>Model <code>User</code>: <code>name</code> (String, bắt buộc), <code>email</code> (String).</li>
<li>Model <code>Post</code>: <code>title</code> (String, bắt buộc), <code>author</code> — ObjectId tham chiếu <code>User</code>.</li>
<li>Model <code>Comment</code> (collection riêng, như <code>comment.js</code> ở buổi 6): <code>post</code> — ObjectId ref <code>Post</code>, <code>user</code> — ObjectId ref <code>User</code>, <code>text</code> — String.</li>
<li><code>async function getPost(id)</code> — bài viết với <code>author</code> được populate <b>chỉ</b> lấy <code>name</code>.</li>
<li><code>async function getComments(postId)</code> — các bình luận của bài đó (theo thứ tự tạo), mỗi bình luận có <code>user</code> được populate chỉ lấy <code>name</code>.</li></ol>
<p>Dùng <code>await</code> — không bao giờ <code>exec(callback)</code>, Mongoose 7+ đã bỏ.</p>`,
  yc: [
    ['<code>{ type: mongoose.Schema.Types.ObjectId, ref: \'User\' }</code> — <code>ref</code> is the <b>model name</b>.', '<code>{ type: mongoose.Schema.Types.ObjectId, ref: \'User\' }</code> — <code>ref</code> là <b>tên model</b>.'],
    ['<code>.populate(\'author\', \'name\')</code>; <code>Comment.find({ post: postId }).populate(\'user\', \'name\')</code>.', '<code>.populate(\'author\', \'name\')</code>; <code>Comment.find({ post: postId }).populate(\'user\', \'name\')</code>.'],
  ],
  viDu: [['strip(await getPost(post._id))', '{"title":"Hello Mongo","author":{"name":"An"}}', 'ids removed by strip() for readability.', 'strip() bỏ id cho dễ đọc.'], ['strip(await getComments(post._id)).map((c) => c.user.name + ": " + c.text)', '["Binh: Nice!","An: Thanks"]', 'Each comment shows who wrote it.', 'Mỗi bình luận hiện người viết.']],
  goiY: [
    ['Comments live in their own collection: find them by <code>post</code>, then populate <code>user</code>. (When comments are embedded in the post, the same idea is written <code>populate(\'comments.user\')</code>.)', 'Bình luận nằm ở collection riêng: tìm theo <code>post</code>, rồi populate <code>user</code>. (Khi bình luận nhúng trong bài, cùng ý đó viết là <code>populate(\'comments.user\')</code>.)'],
    ['The second argument of <code>populate</code> is the field selection.', 'Đối số thứ hai của <code>populate</code> là danh sách trường cần lấy.'],
  ],
  loi: [
    ['<code>ref: \'users\'</code> (the collection name): populate cannot find the model.', '<code>ref: \'users\'</code> (tên collection): populate không tìm thấy model.'],
    ['A <code>user</code> field declared as plain ObjectId without <code>ref</code>: populate has nowhere to look.', 'Trường <code>user</code> khai báo ObjectId trần, thiếu <code>ref</code>: populate không biết tìm ở đâu.'],
    ['Forgetting <code>await</code>: you return a Query, not the post.', 'Quên <code>await</code>: trả về một Query chứ không phải bài viết.'],
  ],
  gt: [
    'A reference stores only an ObjectId; <code>populate(path, select)</code> replaces it with the referenced document, reading only the selected fields. Each populated path costs one extra query (<code>_id: { $in: [...] }</code>), so select only what the page shows.',
    'Tham chiếu chỉ lưu ObjectId; <code>populate(path, select)</code> thay nó bằng tài liệu được tham chiếu, chỉ đọc các trường đã chọn. Mỗi path được populate tốn thêm một truy vấn (<code>_id: { $in: [...] }</code>), nên chỉ chọn những trường trang cần hiện.',
  ],
  kn: ['populate', 'ref'],
  tns: [tn('population', 'điền tham chiếu', 'thay ObjectId bằng tài liệu'), tn('reference', 'tham chiếu')],
  dau: J`const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({ name: { type: String, required: true }, email: String }));
const Post = mongoose.model('Post', new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));
const Comment = mongoose.model('Comment', new mongoose.Schema({
  post: mongoose.Schema.Types.ObjectId,
  user: mongoose.Schema.Types.ObjectId,
  text: String,
}));

async function getPost(id) {
  return Post.findById(id).populate('author');
}
async function getComments(postId) {
  return Comment.find({ post: postId });
}
`,
  giai: J`const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = mongoose.model('User', new Schema({
  name: { type: String, required: true },
  email: String,
}));

const Post = mongoose.model('Post', new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },     // ref = the MODEL name
}));

const Comment = mongoose.model('Comment', new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
}));

async function getPost(id) {
  return await Post.findById(id).populate('author', 'name');   // only the author's name
}

async function getComments(postId) {
  return await Comment.find({ post: postId }).populate('user', 'name');   // who wrote each comment
}
`,
  chuanBi: SEED,
  cases: [
    { goi: `strip(await getPost(post._id))`, moTa: ['getPost: author → { name } only', 'getPost: author → chỉ { name }'] },
    { goi: `strip(await getComments(post._id)).map((c) => c.user)`, moTa: ['Each comment carries its user\'s name only', 'Mỗi bình luận mang đúng tên người viết'] },
    { goi: `strip(await getComments(post._id)).map((c) => c.user.name + ': ' + c.text)`, an: true },
    { goi: `(await getPost(new mongoose.Types.ObjectId())) === null`, an: true },
    { goi: `(await getComments(new mongoose.Types.ObjectId())).length`, an: true },
  ],
});

/* ── 2 ── câu hỏi */
const E2 = cs({
  ten: 'Population facts checked for real', kho: 'EASY', phut: 8,
  en: 'Questions on the official Slot 5.1 slides — every answer was checked on Mongoose 8.', vi: 'Câu hỏi về slide gốc Slot 5.1 — mọi đáp án đã kiểm trên Mongoose 8.',
  cau: [
    q('p1', ['<code>Post.find().populate(\'author\').exec((err, posts) =&gt; …)</code> on Mongoose 8…', '<code>Post.find().populate(\'author\').exec((err, posts) =&gt; …)</code> trên Mongoose 8…'],
      ['fails: "Query.prototype.exec() no longer accepts a callback"', 'works exactly like await', 'prints the posts twice', 'returns the posts without population'],
      ['Callbacks were removed in Mongoose 7 — use <code>await</code>.', 'Callback bị bỏ từ Mongoose 7 — dùng <code>await</code>.']),
    q('p2', ['What does <code>ref</code> contain?', '<code>ref</code> chứa gì?'],
      ['The model name given to mongoose.model()', 'The collection name in MongoDB', 'The field name', 'An ObjectId'],
      ['mongoose.model(\'User\', …) ⇒ ref: \'User\'.', 'mongoose.model(\'User\', …) ⇒ ref: \'User\'.']),
    q('p3', ['How many queries does <code>Post.find().populate(\'author\')</code> send?', '<code>Post.find().populate(\'author\')</code> gửi bao nhiêu truy vấn?'],
      ['Two: posts, then users with _id $in [...]', 'One, using $lookup', 'One per post', 'None until you read post.author'],
      ['Seen in the debug log of a real run.', 'Thấy trong log debug của lần chạy thật.']),
    q('p4', ['The referenced user was deleted. After populate, <code>post.author</code> is…', 'User được tham chiếu đã bị xoá. Sau populate, <code>post.author</code> là…'],
      ['null', 'the old ObjectId', 'an empty object {}', 'an error is thrown'],
      ['Checked: a dangling reference populates to null — handle it in the view.', 'Đã kiểm: tham chiếu "treo" thành null — nhớ xử lý trong view.']),
    qn('p5', ['Valid ways to control population? (choose all)', 'Cách hợp lệ để điều khiển population? (chọn hết)'],
      ['populate({ path: \'author\', select: \'name email -_id\' })', '.populate(\'author\').populate(\'editor\')', 'populate({ path: \'author\', populate: { path: \'company\' } })', 'populate(\'author\', { join: true })'], [0, 1, 2],
      ['select, several paths and nested population all ran for real; there is no join option.', 'select, nhiều path và populate lồng đều chạy thật; không có tuỳ chọn join.']),
  ],
  goiY: [['Mongoose 7 removed callbacks everywhere.', 'Mongoose 7 bỏ callback ở mọi nơi.'], ['Population is done by Mongoose in JavaScript, not by MongoDB.', 'Population do Mongoose làm bằng JavaScript, không phải MongoDB.']],
  loi: [['Believing populate uses $lookup.', 'Tin rằng populate dùng $lookup.'], ['Putting the collection name in ref.', 'Đặt tên collection vào ref.']],
  kn: ['populate'],
});

export default doiDau({
  slug: 'sdn302-goc-5-1-population',
  ten: 'Slot 5.1 Mongoose population (official slides)',
  khoa: KHOA,
  baiHoc: 'sdn302-goc-5-1-population',
  de: [E2, E1],
});
