/** SDN302 · 8.1 — NestJS, Hono & aggregation pipeline (CLO2 + ★): đánh đổi framework, tiêm phụ thuộc kiểu Nest + định dạng lỗi của Nest, chuyển route Express sang Hono, $match/$group/$sort/$lookup. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const ORDERS = J`const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = mongoose.model('User', new Schema({ name: String, email: String }));
const Order = mongoose.model('Order', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  status: { type: String, enum: ['pending', 'paid', 'cancelled'] },
  paidAt: Date,
}));`;
const SEED = `const an = await User.create({ name: 'An', email: 'an@x.com' }); const binh = await User.create({ name: 'Binh', email: 'binh@x.com' }); const chi = await User.create({ name: 'Chi', email: 'chi@x.com' });
await Order.insertMany([
  { userId: an._id, amount: 120, status: 'paid', paidAt: new Date('2026-09-03T10:00:00Z') },
  { userId: binh._id, amount: 300, status: 'paid', paidAt: new Date('2026-09-20T10:00:00Z') },
  { userId: an._id, amount: 80, status: 'pending' },
  { userId: an._id, amount: 250, status: 'paid', paidAt: new Date('2026-10-05T10:00:00Z') },
  { userId: chi._id, amount: 40, status: 'cancelled' },
  { userId: binh._id, amount: 60, status: 'paid', paidAt: new Date('2026-10-28T10:00:00Z') },
]);`;

const E1 = cs({
  ten: 'Express, NestJS or Hono? Freedom vs guardrails', kho: 'EASY', phut: 8,
  en: 'Both frameworks are on the syllabus (CLO2). These questions check what each one is for.',
  vi: 'Cả hai framework đều có trong giáo trình (CLO2). Các câu hỏi kiểm xem mỗi cái để làm gì.',
  cau: [
    q('f1', ['What does NestJS add on top of Express?', 'NestJS thêm gì lên trên Express?'],
      ['TypeScript, dependency injection and an enforced module structure', 'A faster HTTP parser written in Rust that replaces Node\'s own', 'A built-in MongoDB server, so no database needs installing', 'One-command deployment to Cloudflare Workers and other edges'],
      ['It enforces the MVC layering you did by hand — useful when many developers share a large codebase.', 'Nó ép cấu trúc tầng MVC mà bạn đã tự làm — hữu ích khi nhiều lập trình viên chung một codebase lớn.']),
    q('f2', ['Where can Hono run that Express (on Node) typically does not?', 'Hono chạy được ở đâu mà Express (trên Node) thường không?'],
      ['Edge runtimes (Cloudflare Workers, Deno, Bun): it uses Web Request/Response', 'Inside MongoDB Atlas triggers only, next to the data itself', 'Only inside the browser, as a client-side routing library', 'Nowhere else: Hono is a Node-only framework like Express'],
      ['Hono\'s handlers return a standard Response, which is why the same app runs on many runtimes.', 'Handler của Hono trả về một Response chuẩn, nên cùng một app chạy được trên nhiều runtime.']),
    q('f3', ['A 3-resource class project. Should you rewrite it in NestJS "because it is advanced"?', 'Một project lớp 3 tài nguyên. Có nên viết lại bằng NestJS "vì nó nâng cao"?'],
      ['No — match the tool to the size; NestJS\'s structure is overhead here', 'Yes — NestJS is always the better choice than plain Express', 'Yes — Express cannot do authentication without NestJS on top', 'No — NestJS cannot connect to MongoDB, only to SQL databases'],
      ['"Frameworks trade freedom for guardrails" — neither is better in general.', '"Framework đánh đổi tự do lấy lan can" — không cái nào tốt hơn nói chung.']),
    q('f4', ['Why use <code>Order.aggregate([...])</code> instead of <code>Order.find()</code> + a JavaScript loop to compute totals per user?', 'Vì sao dùng <code>Order.aggregate([...])</code> thay vì <code>Order.find()</code> + vòng lặp JavaScript để tính tổng theo người dùng?'],
      ['MongoDB groups the orders itself; only the small result reaches Node', 'aggregate keeps working even without a database connection', 'find cannot filter by status, so the totals would be wrong', 'JavaScript cannot add the amounts precisely enough for money'],
      ['Pulling every order into Node to loop over them wastes network and memory; the pipeline does it where the data lives.', 'Kéo mọi đơn hàng vào Node để lặp là phí mạng và bộ nhớ; pipeline làm việc đó ngay nơi dữ liệu nằm.']),
  ],
  goiY: [['Structure vs portability vs freedom.', 'Cấu trúc vs khả năng chạy nhiều nơi vs tự do.'], ['Where does the work happen?', 'Việc diễn ra ở đâu?']],
  loi: [['Thinking Hono is Node-only.', 'Tưởng Hono chỉ chạy Node.'], ['Choosing NestJS for every project.', 'Chọn NestJS cho mọi project.']],
  tns: [tn('dependency injection', 'tiêm phụ thuộc'), tn('edge runtime', 'môi trường chạy ở biên mạng'), tn('aggregation pipeline', 'đường ống tổng hợp')],
  kn: ['frameworks', 'aggregation'],
});

const E2 = bai({
  ten: 'Aggregation: total paid amount per user, biggest first', kho: 'MEDIUM', phut: 12, lib: ['mongoose', 'mongo-agg'],
  en: J`<p>Write <code>totalsByUser()</code> with the lesson's pipeline: only <code>status: 'paid'</code>, grouped by <code>userId</code>, summing <code>amount</code>, sorted by the total descending. Also count the orders. Each result row is</p>
<pre>{ _id: &lt;userId&gt;, total: 370, orders: 2 }</pre>`,
  vi: J`<p>Viết <code>totalsByUser()</code> bằng pipeline của bài: chỉ <code>status: 'paid'</code>, gom theo <code>userId</code>, cộng <code>amount</code>, sắp theo tổng giảm dần. Đếm thêm số đơn. Mỗi hàng kết quả là</p>
<pre>{ _id: &lt;userId&gt;, total: 370, orders: 2 }</pre>`,
  yc: [['<code>$match</code> → <code>$group</code> (<code>_id: \'$userId\'</code>, <code>total: { $sum: \'$amount\' }</code>, <code>orders: { $sum: 1 }</code>) → <code>$sort</code>.', '<code>$match</code> → <code>$group</code> (<code>_id: \'$userId\'</code>, <code>total: { $sum: \'$amount\' }</code>, <code>orders: { $sum: 1 }</code>) → <code>$sort</code>.'], ['Return <code>Order.aggregate(…)</code> (await it).', 'Trả <code>Order.aggregate(…)</code> (await nó).']],
  viDu: [['await totalsByUser()', '[{"_id":"<An>","total":370,"orders":2},{"_id":"<Binh>","total":360,"orders":2}]', 'Chi\'s order is cancelled; An\'s pending order is ignored.', 'Đơn của Chi đã huỷ; đơn đang chờ của An bị bỏ qua.']],
  goiY: [['Copy the lesson\'s pipeline and add the second accumulator.', 'Chép pipeline của bài và thêm bộ tích luỹ thứ hai.'], ['<code>$sum: 1</code> counts documents in the group.', '<code>$sum: 1</code> đếm số document trong nhóm.']],
  loi: [['<code>$match</code> AFTER <code>$group</code>: the status field no longer exists in the grouped rows.', '<code>$match</code> SAU <code>$group</code>: field status không còn trong các hàng đã gom.'], ['<code>_id: \'userId\'</code> without the <code>$</code> — every order lands in one group named "userId".', '<code>_id: \'userId\'</code> thiếu <code>$</code> — mọi đơn rơi vào một nhóm tên "userId".']],
  gt: ['Stages run in order on the documents flowing through: <code>$match</code> filters early (less work for the rest), <code>$group</code> collapses each user\'s orders into one row with accumulators, <code>$sort</code> orders the small result. <code>\'$amount\'</code> with a dollar means "the value of the field".', 'Các stage chạy theo thứ tự trên các document chảy qua: <code>$match</code> lọc sớm (bớt việc cho phần sau), <code>$group</code> gộp đơn của mỗi người thành một hàng với bộ tích luỹ, <code>$sort</code> sắp kết quả nhỏ. <code>\'$amount\'</code> có dấu đô la nghĩa là "giá trị của field".'],
  kn: ['$match', '$group', '$sort'],
  tns: [tn('stage', 'giai đoạn của pipeline'), tn('accumulator', 'bộ tích luỹ', '$sum, $avg, $max…')],
  dau: J`${ORDERS}

async function totalsByUser() {
  const orders = await Order.find();
  return orders;
}
`,
  giai: J`${ORDERS}

async function totalsByUser() {
  return await Order.aggregate([
    { $match: { status: 'paid' } },                                        // filter FIRST
    { $group: { _id: '$userId', total: { $sum: '$amount' }, orders: { $sum: 1 } } },
    { $sort: { total: -1 } },                                              // biggest total first
  ]);
}
`,
  chuanBi: SEED,
  cases: [
    { goi: `(await totalsByUser()).map((r) => [String(r._id) === String(an._id) ? 'An' : String(r._id) === String(binh._id) ? 'Binh' : '?', r.total, r.orders])`, moTa: ['An 370 (2 orders), Binh 360 (2)', 'An 370 (2 đơn), Binh 360 (2)'] },
    { goi: `Object.keys((await totalsByUser())[0]).sort()`, moTa: ['Each row is { _id, total, orders }', 'Mỗi hàng là { _id, total, orders }'] },
    { goi: `(await Order.create({ userId: chi._id, amount: 999, status: 'paid' }), (await totalsByUser()).map((r) => r.total))`, an: true },
    { goi: `(await Order.deleteMany({ status: 'paid' }), await totalsByUser())`, an: true },
  ],
});

const E3 = bai({
  ten: 'Aggregation with $lookup: top customers by name, and revenue per month', kho: 'MEDIUM', phut: 18, lib: ['mongoose', 'mongo-agg'],
  en: J`<p>Two reports, both computed inside MongoDB:</p>
<ol><li><code>topCustomers(limit)</code> — paid orders grouped by user, total descending, the first <code>limit</code> rows, then joined with <code>users</code> (<code>$lookup</code> + <code>$unwind</code>) and shaped with <code>$project</code> to <code>{ name, email, total }</code> (no <code>_id</code>);</li>
<li><code>revenueByMonth()</code> — paid orders grouped by the month of <code>paidAt</code>, rows <code>{ month: '2026-09', revenue, orders }</code> in chronological order.</li></ol>`,
  vi: J`<p>Hai báo cáo, đều tính bên trong MongoDB:</p>
<ol><li><code>topCustomers(limit)</code> — đơn đã trả gom theo người dùng, tổng giảm dần, lấy <code>limit</code> hàng đầu, rồi nối với <code>users</code> (<code>$lookup</code> + <code>$unwind</code>) và nặn bằng <code>$project</code> thành <code>{ name, email, total }</code> (không <code>_id</code>);</li>
<li><code>revenueByMonth()</code> — đơn đã trả gom theo tháng của <code>paidAt</code>, hàng <code>{ month: '2026-09', revenue, orders }</code> theo thứ tự thời gian.</li></ol>`,
  yc: [['<code>$lookup: { from: \'users\', localField: \'_id\', foreignField: \'_id\', as: \'user\' }</code> then <code>$unwind: \'$user\'</code>.', '<code>$lookup: { from: \'users\', localField: \'_id\', foreignField: \'_id\', as: \'user\' }</code> rồi <code>$unwind: \'$user\'</code>.'], ['Month key: <code>{ $dateToString: { format: \'%Y-%m\', date: \'$paidAt\' } }</code>.', 'Khoá tháng: <code>{ $dateToString: { format: \'%Y-%m\', date: \'$paidAt\' } }</code>.'], ['<code>$limit</code> BEFORE <code>$lookup</code>: join only the rows you keep.', '<code>$limit</code> TRƯỚC <code>$lookup</code>: chỉ nối những hàng bạn giữ.']],
  viDu: [['await topCustomers(1)', '[{"name":"An","email":"an@x.com","total":370}]', 'The best customer, with a name instead of an id.', 'Khách tốt nhất, có tên thay vì id.'], ['await revenueByMonth()', '[{"month":"2026-09","revenue":420,"orders":2},{"month":"2026-10","revenue":310,"orders":2}]', 'Two months of paid orders.', 'Hai tháng đơn đã trả.']],
  goiY: [['<code>$project: { _id: 0, name: \'$user.name\', email: \'$user.email\', total: 1 }</code>', '<code>$project: { _id: 0, name: \'$user.name\', email: \'$user.email\', total: 1 }</code>'], ['After grouping by month: <code>$sort: { _id: 1 }</code>, then <code>$project: { _id: 0, month: \'$_id\', revenue: 1, orders: 1 }</code>.', 'Sau khi gom theo tháng: <code>$sort: { _id: 1 }</code>, rồi <code>$project: { _id: 0, month: \'$_id\', revenue: 1, orders: 1 }</code>.']],
  loi: [['<code>from: \'User\'</code> — $lookup uses the COLLECTION name (<code>users</code>), not the model name.', '<code>from: \'User\'</code> — $lookup dùng tên COLLECTION (<code>users</code>), không phải tên model.'], ['Forgetting <code>$unwind</code>: <code>user</code> is an array and <code>$user.name</code> is an array of names.', 'Quên <code>$unwind</code>: <code>user</code> là mảng và <code>$user.name</code> là mảng tên.'], ['Comparing a string id inside <code>$match</code> — aggregate does not cast, so it never matches an ObjectId.', 'So id dạng chuỗi trong <code>$match</code> — aggregate không ép kiểu, nên không bao giờ khớp ObjectId.']],
  gt: ['<code>$lookup</code> is MongoDB\'s server-side join; placed after <code>$limit</code> it joins only the rows that survive. <code>$dateToString</code> turns each date into a group key, and <code>$project</code> renames <code>_id</code> to a meaningful field for the API. Note the difference with Mongoose: <code>populate</code> runs a second query from Node, <code>$lookup</code> runs inside the database.', '<code>$lookup</code> là phép nối phía server của MongoDB; đặt sau <code>$limit</code> thì chỉ nối các hàng còn lại. <code>$dateToString</code> biến mỗi ngày thành một khoá nhóm, còn <code>$project</code> đổi tên <code>_id</code> thành field có nghĩa cho API. Lưu ý khác với Mongoose: <code>populate</code> chạy truy vấn thứ hai từ Node, <code>$lookup</code> chạy trong CSDL.'],
  kn: ['$lookup', '$unwind', '$project', '$dateToString'],
  tns: [tn('$lookup', 'nối phía server'), tn('$unwind', 'bung mảng thành từng document')],
  dau: J`${ORDERS}

async function topCustomers(limit) {
  return Order.aggregate([
    { $group: { _id: '$userId', total: { $sum: '$amount' } } },
    { $lookup: { from: 'User', localField: '_id', foreignField: '_id', as: 'user' } },
  ]);
}
async function revenueByMonth() {
  return [];
}
`,
  giai: J`${ORDERS}

async function topCustomers(limit) {
  return await Order.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: '$userId', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $limit: limit },                                                     // keep only what we will show, then
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },   // join (COLLECTION name)
    { $unwind: '$user' },                                                  // [user] ⇒ user
    { $project: { _id: 0, name: '$user.name', email: '$user.email', total: 1 } },
  ]);
}

async function revenueByMonth() {
  return await Order.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } }, revenue: { $sum: '$amount' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },                                                 // '2026-09' < '2026-10'
    { $project: { _id: 0, month: '$_id', revenue: 1, orders: 1 } },
  ]);
}
`,
  chuanBi: SEED,
  cases: [
    { goi: `[await topCustomers(1), await topCustomers(5)]`, moTa: ['Top customers with names (limit 1 and 5)', 'Khách hàng hàng đầu kèm tên (limit 1 và 5)'] },
    { goi: `await revenueByMonth()`, moTa: ['Revenue per month, chronological', 'Doanh thu theo tháng, theo thời gian'] },
    { goi: `(await Order.create({ userId: chi._id, amount: 500, status: 'paid', paidAt: new Date('2026-08-15T00:00:00Z') }), [await topCustomers(2), await revenueByMonth()])`, an: true },
  ],
});

const E4 = bai({
  ten: 'NestJS-style layers without decorators: DI and Nest\'s error format', kho: 'MEDIUM', phut: 18, lib: [],
  en: J`<p>NestJS enforces the controller/service split with dependency injection. Decorators need TypeScript, so here you write the same classes in plain JavaScript and do the injection by hand:</p>
<ul><li><code>class NotFoundException extends Error</code> — <code>new NotFoundException('Product 9 not found')</code>; <code>getStatus()</code> → 404; <code>getResponse()</code> → <code>{ statusCode: 404, message: 'Product 9 not found', error: 'Not Found' }</code> (Nest's exact shape);</li>
<li><code>class ProductService</code> — <code>constructor(repo)</code>; <code>findAll()</code>; <code>findOne(id)</code> throws <code>NotFoundException(´Product @{id} not found´)</code> when <code>repo.findById(id)</code> is null;</li>
<li><code>class ProductController</code> — <code>constructor(productService)</code>; <code>findAll()</code> and <code>findOne(id)</code> just delegate (a Nest controller holds no logic);</li>
<li><code>toHttp(fn)</code> — like Nest's exception filter: awaits <code>fn()</code> ⇒ <code>{ status: 200, body }</code>; an exception with <code>getStatus</code> ⇒ <code>{ status, body: getResponse() }</code>; anything else ⇒ <code>{ status: 500, body: { statusCode: 500, message: 'Internal server error' } }</code>.</li></ul>`,
  vi: J`<p>NestJS ép tách controller/service bằng tiêm phụ thuộc. Decorator cần TypeScript, nên ở đây bạn viết cùng các lớp đó bằng JavaScript thuần và tự tiêm bằng tay:</p>
<ul><li><code>class NotFoundException extends Error</code> — <code>new NotFoundException('Product 9 not found')</code>; <code>getStatus()</code> → 404; <code>getResponse()</code> → <code>{ statusCode: 404, message: 'Product 9 not found', error: 'Not Found' }</code> (đúng hình dạng của Nest);</li>
<li><code>class ProductService</code> — <code>constructor(repo)</code>; <code>findAll()</code>; <code>findOne(id)</code> ném <code>NotFoundException(´Product @{id} not found´)</code> khi <code>repo.findById(id)</code> là null;</li>
<li><code>class ProductController</code> — <code>constructor(productService)</code>; <code>findAll()</code> và <code>findOne(id)</code> chỉ uỷ quyền (controller của Nest không chứa logic);</li>
<li><code>toHttp(fn)</code> — như exception filter của Nest: await <code>fn()</code> ⇒ <code>{ status: 200, body }</code>; ngoại lệ có <code>getStatus</code> ⇒ <code>{ status, body: getResponse() }</code>; còn lại ⇒ <code>{ status: 500, body: { statusCode: 500, message: 'Internal server error' } }</code>.</li></ul>`,
  yc: [['In Nest the same code would read <code>@Controller(\'products\') class ProductController { constructor(private service: ProductService) {} @Get(\':id\') findOne(@Param(\'id\') id) { … } }</code> — the container calls <code>new ProductController(service)</code> for you.', 'Trong Nest cùng đoạn mã sẽ là <code>@Controller(\'products\') class ProductController { constructor(private service: ProductService) {} @Get(\':id\') findOne(@Param(\'id\') id) { … } }</code> — container gọi <code>new ProductController(service)</code> giúp bạn.'], ['<code>toHttp</code> must never leak the message of an unexpected error.', '<code>toHttp</code> không bao giờ được lộ thông báo của lỗi bất ngờ.']],
  viDu: [['await toHttp(() => controller.findOne(9))', '{"status":404,"body":{"statusCode":404,"message":"Product 9 not found","error":"Not Found"}}', 'Nest\'s default 404 body.', 'Thân 404 mặc định của Nest.'], ['await toHttp(() => controller.findAll())', '{"status":200,"body":[…]}', 'Delegated to the service, then to the repo.', 'Uỷ quyền cho service, rồi cho repo.']],
  goiY: [['<code>class NotFoundException extends Error { constructor(message) { super(message); this.name = \'NotFoundException\'; } getStatus() { return 404; } getResponse() { return { statusCode: 404, message: this.message, error: \'Not Found\' }; } }</code>', '<code>class NotFoundException extends Error { constructor(message) { super(message); this.name = \'NotFoundException\'; } getStatus() { return 404; } getResponse() { return { statusCode: 404, message: this.message, error: \'Not Found\' }; } }</code>'], ['<code>async function toHttp(fn) { try { return { status: 200, body: await fn() }; } catch (e) { … } }</code>', '<code>async function toHttp(fn) { try { return { status: 200, body: await fn() }; } catch (e) { … } }</code>']],
  loi: [['Creating the service INSIDE the controller (<code>this.service = new ProductService(realRepo)</code>): no injection, impossible to test with a fake repo.', 'Tạo service BÊN TRONG controller (<code>this.service = new ProductService(realRepo)</code>): không tiêm, không thể kiểm với repo giả.'], ['Returning <code>null</code> from <code>findOne</code> and answering 200 — Nest code throws an HttpException instead.', 'Trả <code>null</code> từ <code>findOne</code> và trả 200 — mã Nest ném HttpException thay vào đó.']],
  gt: ['Constructor injection is the heart of NestJS: classes declare what they need, a container builds them. Writing it by hand shows that it is just "pass the dependency in", which is also why everything is testable with a fake repo. HttpExceptions carry their status and response body, and a single filter turns any exception into Nest\'s standard JSON — the same idea as the central error handler in Express.', 'Tiêm qua constructor là trái tim của NestJS: lớp khai báo thứ nó cần, container dựng chúng. Tự viết tay cho thấy nó chỉ là "truyền phụ thuộc vào", cũng là lý do mọi thứ kiểm được với repo giả. HttpException mang theo mã và thân trả lời, và một filter duy nhất biến mọi ngoại lệ thành JSON chuẩn của Nest — cùng ý tưởng với error handler trung tâm của Express.'],
  kn: ['NestJS', 'dependency injection', 'exception filters'],
  tns: [tn('IoC container', 'bộ chứa đảo ngược điều khiển', 'tự tạo và tiêm các lớp'), tn('exception filter', 'bộ lọc ngoại lệ')],
  dau: J`class NotFoundException extends Error {}

class ProductService {
  constructor() { this.repo = { findAll: async () => [], findById: async () => null }; }
  async findAll() { return this.repo.findAll(); }
  async findOne(id) { return this.repo.findById(id); }
}

class ProductController {
  constructor() { this.service = new ProductService(); }
  findAll() { return this.service.findAll(); }
  findOne(id) { return this.service.findOne(id); }
}

async function toHttp(fn) {
  return { status: 200, body: await fn() };
}
`,
  giai: J`// Nest's built-in exception, rebuilt: it carries its status AND its response body
class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundException';
  }
  getStatus() { return 404; }
  getResponse() { return { statusCode: 404, message: this.message, error: 'Not Found' }; }
}

// @Injectable() class ProductService — business logic, depends on a repository
class ProductService {
  constructor(repo) { this.repo = repo; }                 // injected, never created here
  async findAll() { return this.repo.findAll(); }
  async findOne(id) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException(´Product @{id} not found´);
    return product;
  }
}

// @Controller('products') — no logic, just delegation
class ProductController {
  constructor(productService) { this.productService = productService; }
  findAll() { return this.productService.findAll(); }
  findOne(id) { return this.productService.findOne(id); }
}

// the default exception filter, in one function
async function toHttp(fn) {
  try {
    return { status: 200, body: await fn() };
  } catch (e) {
    if (e && typeof e.getStatus === 'function') return { status: e.getStatus(), body: e.getResponse() };
    return { status: 500, body: { statusCode: 500, message: 'Internal server error' } };   // never leak e.message
  }
}
`,
  chuanBi: `const data = [{ id: 1, name: 'Book' }, { id: 2, name: 'Pen' }]; const repo = { calls: 0, findAll: async () => { repo.calls++; return data; }, findById: async (id) => { repo.calls++; return data.find((p) => p.id === Number(id)) || null; } };
const controller = new ProductController(new ProductService(repo));`,
  cases: [
    { goi: `[await toHttp(() => controller.findAll()), repo.calls]`, moTa: ['findAll → 200 through service and repo', 'findAll → 200 qua service và repo'] },
    { goi: `await toHttp(() => controller.findOne(9))`, moTa: ['Missing → Nest’s 404 body', 'Không có → thân 404 của Nest'] },
    { goi: `[await toHttp(() => controller.findOne('2')), new NotFoundException('x') instanceof Error, new NotFoundException('x').getStatus()]`, moTa: ['findOne(2) → 200; the exception is an Error with status 404', 'findOne(2) → 200; ngoại lệ là Error có mã 404'] },
    { goi: `await toHttp(() => new ProductController(new ProductService({ findAll: async () => { throw new Error('ECONNREFUSED 10.0.0.5:27017'); } })).findAll())`, an: true },
    { goi: `await toHttp(async () => { throw new NotFoundException('Order 7 not found'); })`, an: true },
  ],
});

const E5 = bai({
  ten: 'Port an Express router to Hono (and test it with app.request)', kho: 'HARD', phut: 22, lib: ['hono'],
  en: J`<p>Rewrite this Express code as a Hono app — same behaviour, Hono style (handlers <b>return</b> a Response):</p>
<pre>GET  /api/products          → 200 list; ?q= filters names (case-insensitive)
GET  /api/products/:id      → 200 product · 404 { error: "Product not found" }
POST /api/products          → 201 product · 400 { error: "Invalid JSON" } · 400 { error: "name and price required" }
any unknown route           → 404 { error: "Not found" }
any thrown error            → 500 { error: "Internal Server Error" }</pre>
<p>Also add a middleware that sets the header <code>X-Powered-By: Hono</code> on every response. Export <code>module.exports = app;</code> — the grader calls <code>await app.request('/api/products/1')</code>, Hono's own test helper.</p>`,
  vi: J`<p>Viết lại đoạn Express này thành app Hono — cùng hành vi, kiểu Hono (handler <b>trả về</b> một Response):</p>
<pre>GET  /api/products          → 200 danh sách; ?q= lọc tên (không phân biệt hoa thường)
GET  /api/products/:id      → 200 sản phẩm · 404 { error: "Product not found" }
POST /api/products          → 201 sản phẩm · 400 { error: "Invalid JSON" } · 400 { error: "name and price required" }
route lạ bất kỳ             → 404 { error: "Not found" }
lỗi ném ra bất kỳ           → 500 { error: "Internal Server Error" }</pre>
<p>Thêm một middleware đặt header <code>X-Powered-By: Hono</code> cho mọi response. Export <code>module.exports = app;</code> — máy chấm gọi <code>await app.request('/api/products/1')</code>, công cụ test có sẵn của Hono.</p>`,
  yc: [['<code>const { Hono } = require(\'hono\'); const app = new Hono();</code>', '<code>const { Hono } = require(\'hono\'); const app = new Hono();</code>'], ['Body: <code>await c.req.json()</code> throws on invalid JSON — catch it and answer 400.', 'Thân: <code>await c.req.json()</code> ném lỗi khi JSON hỏng — bắt và trả 400.'], ['<code>app.notFound(…)</code> and <code>app.onError(…)</code> for the last two rows; middleware: <code>app.use(\'*\', async (c, next) => { await next(); c.header(…); })</code>.', '<code>app.notFound(…)</code> và <code>app.onError(…)</code> cho hai hàng cuối; middleware: <code>app.use(\'*\', async (c, next) => { await next(); c.header(…); })</code>.']],
  viDu: [['await app.request(\'/api/products/1\')', '200 {"id":1,"name":"Book","price":25}  X-Powered-By: Hono', 'c.req.param(\'id\') is a string, like req.params.id.', 'c.req.param(\'id\') là chuỗi, như req.params.id.'], ['await app.request(\'/api/products\', { method: \'POST\', body: \'{oops\' })', '400 {"error":"Invalid JSON"}', 'No express.json() in Hono — you parse on demand.', 'Hono không có express.json() — bạn tự parse khi cần.']],
  goiY: [['Express <code>res.status(404).json(x)</code> ⇒ Hono <code>return c.json(x, 404)</code>.', 'Express <code>res.status(404).json(x)</code> ⇒ Hono <code>return c.json(x, 404)</code>.'], ['<code>let body; try { body = await c.req.json(); } catch { return c.json({ error: \'Invalid JSON\' }, 400); }</code>', '<code>let body; try { body = await c.req.json(); } catch { return c.json({ error: \'Invalid JSON\' }, 400); }</code>']],
  loi: [['Forgetting <code>return</code> before <code>c.json(…)</code>: Hono throws "Context is not finalized".', 'Quên <code>return</code> trước <code>c.json(…)</code>: Hono ném "Context is not finalized".'], ['Using <code>req, res</code> parameters out of habit — a Hono handler receives one Context <code>c</code>.', 'Dùng tham số <code>req, res</code> theo thói quen — handler Hono nhận một Context <code>c</code>.'], ['Setting the header before <code>await next()</code> and then losing it because the handler builds a new Response — set it after.', 'Đặt header trước <code>await next()</code> rồi mất vì handler dựng Response mới — đặt sau.']],
  gt: ['The concepts are the same as Express — routes, params, middleware, a 404 handler, an error handler — but Hono speaks the Web standard: handlers return a Response, the body is parsed on demand, and testing needs no server (<code>app.request</code>). That is exactly what lets Hono run on edge runtimes where Node\'s <code>http</code> module does not exist.', 'Các khái niệm giống Express — route, tham số, middleware, handler 404, error handler — nhưng Hono nói theo chuẩn Web: handler trả Response, thân được parse khi cần, và kiểm thử không cần server (<code>app.request</code>). Đó đúng là thứ cho phép Hono chạy trên edge runtime nơi module <code>http</code> của Node không tồn tại.'],
  kn: ['Hono', 'Web standard Request/Response'],
  tns: [tn('Context', 'ngữ cảnh request trong Hono', 'c'), tn('app.request', 'gửi request thử không cần server')],
  dau: J`const { Hono } = require('hono');
const products = [{ id: 1, name: 'Book', price: 25 }, { id: 2, name: 'Pen', price: 2 }];

const app = new Hono();
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (c) => {
  const p = products.find((x) => x.id === c.req.param('id'));
  c.json(p);
});

module.exports = app;
`,
  giai: J`const { Hono } = require('hono');
const products = [{ id: 1, name: 'Book', price: 25 }, { id: 2, name: 'Pen', price: 2 }];

const app = new Hono();

// middleware: let the handler run, THEN decorate its response
app.use('*', async (c, next) => {
  await next();
  c.header('X-Powered-By', 'Hono');
});

app.get('/api/products', (c) => {
  const q = (c.req.query('q') || '').toLowerCase();
  return c.json(q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products);
});

app.get('/api/products/:id', (c) => {
  const p = products.find((x) => x.id === Number(c.req.param('id')));   // params are strings
  if (!p) return c.json({ error: 'Product not found' }, 404);
  return c.json(p);                                                      // ALWAYS return a Response
});

app.post('/api/products', async (c) => {
  let body;
  try { body = await c.req.json(); } catch { return c.json({ error: 'Invalid JSON' }, 400); }   // parse on demand
  const { name, price } = body || {};
  if (typeof name !== 'string' || !name.trim() || typeof price !== 'number') return c.json({ error: 'name and price required' }, 400);
  const product = { id: products.reduce((m, p) => Math.max(m, p.id), 0) + 1, name, price };
  products.push(product);
  return c.json(product, 201);
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => c.json({ error: 'Internal Server Error' }, 500));

module.exports = app;
`,
  chuanBi: `const app = module.exports; const go = async (url, init) => { const r = await app.request(url, init); const out = await __honoRes(r); out.poweredBy = r.headers.get('x-powered-by'); return out; };`,
  cases: [
    { goi: `[await go('/api/products/1'), await go('/api/products/9')]`, moTa: ['GET :id → 200 / 404, with X-Powered-By', 'GET :id → 200 / 404, kèm X-Powered-By'] },
    { goi: `await go('/api/products?q=PE')`, moTa: ['?q filters case-insensitively', '?q lọc không phân biệt hoa thường'] },
    { goi: `[await go('/api/products', { method: 'POST', body: JSON.stringify({ name: 'Ruler', price: 3 }) }), await go('/api/products', { method: 'POST', body: '{oops' }), await go('/api/products', { method: 'POST', body: '{}' })]`, moTa: ['POST → 201; bad JSON → 400; missing fields → 400', 'POST → 201; JSON hỏng → 400; thiếu field → 400'] },
    { goi: `await go('/api/nope')`, moTa: ['Unknown route → JSON 404', 'Route lạ → 404 JSON'] },
    { goi: `[await go('/api/products/abc'), (await go('/api/products')).body.length]`, an: true },
    { goi: `(app.get('/api/boom', () => { throw new Error('secret stack'); }), await go('/api/boom'))`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-8-1-nestjs-hono',
  ten: '8.1 NestJS, Hono & the aggregation pipeline',
  khoa: KHOA,
  baiHoc: 'sdn302-8-1-nestjs-hono',
  de: [E1, E2, E3, E4, E5],
});
