/** SDN302 · 0.5 — Ngân hàng đề tài project: thang 6 phép kiểm (cỡ 3–5 tài nguyên, quan hệ thật, CRUD đủ, cần đăng nhập, có luật kiểm tra, demo được), thiết kế dữ liệu trước route. */
import { doiDau, KHOA, bai, cs, q, qn, bang1, tn } from './_sdn.mjs';

const J = String.raw;

const E1 = cs({
  ten: 'Score a project topic before committing', kho: 'EASY', phut: 6,
  en: 'The 6-test rubric of lesson 0.5: right size, real relationships, full CRUD, needs auth, has validation, demoable.',
  vi: 'Thang 6 phép kiểm của bài 0.5: đúng cỡ, quan hệ thật, CRUD đủ, cần đăng nhập, có luật kiểm tra, demo được.',
  cau: [
    q('r1', ['"A notes API": one resource, notes. Which test fails first, and why does it matter?', '"API ghi chú": một tài nguyên, notes. Phép kiểm nào trượt trước, và vì sao quan trọng?'],
      ['Real relationships — nothing to populate, so CLO5 cannot be shown', 'Full CRUD — a notes API has no way to delete a note', 'Demoable — notes cannot be shown in a Postman collection', 'Needs auth — notes are never private, so login is pointless'],
      ['Population is a headline outcome the project must show; one collection has nothing to populate.', 'Population là chuẩn đầu ra chính mà project phải thể hiện; một collection thì không có gì để populate.']),
    q('r2', ['"A full e-learning platform" with 15 resources (courses, lessons, quizzes, payments, chats…). Verdict?', '"Một nền tảng e-learning đầy đủ" với 15 tài nguyên (khoá học, bài học, quiz, thanh toán, chat…). Kết luận?'],
      ['Fails "right size" (3–5 resources): finish small and rich instead', 'Perfect: more resources always means a higher project grade', 'Fine, as long as you skip authentication to save some time', 'Fails only "demoable", because the demo would be too long'],
      ['"Small enough to finish, rich enough to show every CLO."', '"Đủ nhỏ để làm xong, đủ giàu để thể hiện mọi CLO."']),
    q('r3', ['What does the ★ note recommend doing FIRST?', 'Ghi chú ★ khuyên làm gì TRƯỚC TIÊN?'],
      ['Sketch the Mongoose schemas and their references, then write the routes', 'Write all the routes, then add the schemas that make them work', 'Design the React pages first', 'Pick the hosting provider'],
      ['Model-first: once the data is right, one resource → one router with GET/POST/PUT/DELETE.', 'Mô hình trước: dữ liệu đúng rồi thì một tài nguyên → một router với GET/POST/PUT/DELETE.']),
    qn('r4', ['Which topics from the bank pass "real relationships"? (choose all)', 'Đề tài nào trong ngân hàng qua phép "quan hệ thật"? (chọn hết)'],
      ['Blog API — comment → user & post', 'Event booking — booking → event & user', 'Job board — application → job & candidate', 'A counter API that stores one number'],
      [0, 1, 2], ['Each has a child document referencing two parents — perfect for <code>populate</code>.', 'Mỗi cái có một document con tham chiếu hai cha — rất hợp với <code>populate</code>.']),
  ],
  goiY: [['Which CLO needs references?', 'CLO nào cần tham chiếu?'], ['3–5 resources.', '3–5 tài nguyên.']],
  loi: [['Choosing a one-collection topic.', 'Chọn đề tài một collection.'], ['Choosing a 15-resource topic.', 'Chọn đề tài 15 tài nguyên.']],
  tns: [tn('resource', 'tài nguyên', 'một loại đối tượng của API: users, posts…'), tn('rubric', 'thang chấm')],
  kn: ['project scoping'],
});

const E2 = bai({
  ten: 'Automate the 6-test rubric: scoreTopic(topic)', kho: 'MEDIUM', phut: 15, lib: [],
  en: J`<p>A topic is described as</p>
<pre>{ name, resources: [{ name, refs: ['User', …] }, …], crud: true|false, ownerOnlyActions: true|false,
  rules: ['unique email', …], demo: { postman: true|false, page: true|false } }</pre>
<p>Write <code>scoreTopic(topic)</code> → <code>{ score, failed }</code> where <code>score</code> is the number of passed tests (0–6) and <code>failed</code> the names of the failed tests, in this order:</p>
<ol><li><code>"right size"</code> — 3 to 5 resources;</li>
<li><code>"real relationships"</code> — at least one resource has a ref to <b>another resource of the topic</b>;</li>
<li><code>"full CRUD"</code> — <code>crud === true</code>;</li>
<li><code>"needs auth"</code> — <code>ownerOnlyActions === true</code>;</li>
<li><code>"has validation"</code> — at least one rule;</li>
<li><code>"demoable"</code> — Postman AND a small page.</li></ol>`,
  vi: J`<p>Một đề tài được mô tả là</p>
<pre>{ name, resources: [{ name, refs: ['User', …] }, …], crud: true|false, ownerOnlyActions: true|false,
  rules: ['unique email', …], demo: { postman: true|false, page: true|false } }</pre>
<p>Viết <code>scoreTopic(topic)</code> → <code>{ score, failed }</code> với <code>score</code> là số phép kiểm đạt (0–6) và <code>failed</code> là tên các phép trượt, theo thứ tự:</p>
<ol><li><code>"right size"</code> — 3 tới 5 tài nguyên;</li>
<li><code>"real relationships"</code> — ít nhất một tài nguyên có ref tới <b>một tài nguyên khác của đề tài</b>;</li>
<li><code>"full CRUD"</code> — <code>crud === true</code>;</li>
<li><code>"needs auth"</code> — <code>ownerOnlyActions === true</code>;</li>
<li><code>"has validation"</code> — ít nhất một luật;</li>
<li><code>"demoable"</code> — có Postman VÀ một trang nhỏ.</li></ol>`,
  yc: [['A ref to a model that is not in <code>resources</code> (e.g. <code>"Payment"</code> missing) does not count — and a resource referencing ITSELF does not count either.', 'Ref tới model không có trong <code>resources</code> (vd thiếu <code>"Payment"</code>) không tính — và tài nguyên tham chiếu CHÍNH NÓ cũng không tính.'], ['Missing fields count as failing (<code>refs</code>, <code>rules</code>, <code>demo</code> may be absent).', 'Field thiếu tính là trượt (<code>refs</code>, <code>rules</code>, <code>demo</code> có thể vắng).']],
  viDu: [['Blog API: User, Post (refs User), Comment (refs User, Post), crud, owner-only, rules ["unique email"], demo both', '{"score":6,"failed":[]}', 'Passes everything.', 'Qua hết.'], ['Notes API: one resource, crud, no auth, no rules, Postman only', '{"score":1,"failed":["right size","real relationships","needs auth","has validation","demoable"]}', 'Only CRUD passes.', 'Chỉ CRUD qua.']],
  goiY: [['<code>const names = new Set(resources.map((r) => r.name));</code> then <code>resources.some((r) => (r.refs || []).some((x) => x !== r.name && names.has(x)))</code>', '<code>const names = new Set(resources.map((r) => r.name));</code> rồi <code>resources.some((r) => (r.refs || []).some((x) => x !== r.name && names.has(x)))</code>'], ['Build an array of [name, passed] pairs, then derive both outputs from it.', 'Dựng mảng các cặp [tên, đạt], rồi suy ra cả hai đầu ra từ nó.']],
  loi: [['Counting refs to models that do not exist in the topic — populate would fail with MissingSchemaError.', 'Đếm ref tới model không có trong đề tài — populate sẽ hỏng với MissingSchemaError.'], ['<code>if (topic.crud)</code> passing for the string "no".', '<code>if (topic.crud)</code> đạt với chuỗi "no".']],
  gt: ['The rubric becomes six independent predicates evaluated in a fixed order; the score and the failure list come from the same table, so they can never disagree. The relationship test checks the reference graph against the topic\'s own models, which is exactly what <code>populate</code> will need.', 'Thang chấm thành sáu mệnh đề độc lập đánh giá theo thứ tự cố định; điểm và danh sách trượt lấy từ cùng một bảng nên không bao giờ mâu thuẫn. Phép kiểm quan hệ đối chiếu đồ thị tham chiếu với chính các model của đề tài — đúng thứ <code>populate</code> sẽ cần.'],
  kn: ['predicates', 'Set'],
  tns: [tn('reference graph', 'đồ thị tham chiếu')],
  dau: J`function scoreTopic(topic) {
  const failed = [];
  if (topic.resources.length < 3) failed.push('right size');
  if (!topic.resources.some((r) => r.refs.length)) failed.push('real relationships');
  if (!topic.crud) failed.push('full CRUD');
  return { score: 6 - failed.length, failed };
}
`,
  giai: J`function scoreTopic(topic) {
  const resources = topic.resources || [];
  const names = new Set(resources.map((r) => r.name));
  const demo = topic.demo || {};
  // [test name, passed?] — one table drives both outputs
  const tests = [
    ['right size', resources.length >= 3 && resources.length <= 5],
    ['real relationships', resources.some((r) => (r.refs || []).some((x) => x !== r.name && names.has(x)))],
    ['full CRUD', topic.crud === true],
    ['needs auth', topic.ownerOnlyActions === true],
    ['has validation', Array.isArray(topic.rules) && topic.rules.length > 0],
    ['demoable', demo.postman === true && demo.page === true],
  ];
  const failed = tests.filter(([, ok]) => !ok).map(([name]) => name);
  return { score: tests.length - failed.length, failed };
}
`,
  chuanBi: `const blog = { name: 'Blog API', resources: [{ name: 'User', refs: [] }, { name: 'Post', refs: ['User'] }, { name: 'Comment', refs: ['User', 'Post'] }], crud: true, ownerOnlyActions: true, rules: ['unique email'], demo: { postman: true, page: true } };`,
  cases: [
    { goi: `scoreTopic(blog)`, moTa: ['The Blog API passes all six', 'Blog API qua cả sáu'] },
    { goi: `scoreTopic({ name: 'Notes', resources: [{ name: 'Note' }], crud: true, demo: { postman: true } })`, moTa: ['The notes API passes only CRUD', 'API ghi chú chỉ qua CRUD'] },
    { goi: `scoreTopic({ ...blog, resources: [{ name: 'Order', refs: ['Payment'] }, { name: 'Item', refs: ['Item'] }, { name: 'User' }] })`, an: true },
    { goi: `scoreTopic({ ...blog, resources: [1, 2, 3, 4, 5, 6].map((i) => ({ name: 'R' + i, refs: i > 1 ? ['R1'] : [] })), crud: 'yes', rules: [] })`, an: true },
    { goi: `scoreTopic({ name: 'Empty' })`, an: true },
  ],
});

const E3 = cs({
  ten: 'Which rubric test does each topic fail?', kho: 'MEDIUM', phut: 8, loai: 'table',
  en: 'Four topics, each with exactly one weakness. Name the failed test.',
  vi: 'Bốn đề tài, mỗi cái đúng một điểm yếu. Gọi tên phép kiểm trượt.',
  bang: [bang1('t1', ['Topic → failed test', 'Đề tài → phép kiểm trượt'], [{ ma: 'de', ten: 'Topic' }, { ma: 't', ten: 'Failed test', luaChon: ['right size', 'real relationships', 'full CRUD', 'needs auth', 'has validation', 'demoable'] }], [
    { o: { de: 'Recipe sharing: users, recipes, favourites — but anyone can edit or delete any recipe without logging in' }, a: { t: 'needs auth' } },
    { o: { de: 'Expense tracker: users, wallets, transactions — amounts can be negative or text, emails can repeat' }, a: { t: 'has validation' } },
    { o: { de: 'Movie reviews: movies, reviews, users — reviews can be created and listed, never edited or removed' }, a: { t: 'full CRUD' } },
    { o: { de: 'Fitness log: users, workouts, exercises — works only from the student\'s laptop, no Postman collection, no page' }, a: { t: 'demoable' } },
  ], ['Owner-only actions are the reason to log in (CLO6); rules such as "unique email, price > 0" are the reason for validation; create/read/update/delete must all be demoable; and a judge must be able to see it run end-to-end.', 'Hành động chỉ-chủ-sở-hữu là lý do để đăng nhập (CLO6); luật như "email duy nhất, giá > 0" là lý do để kiểm tra; tạo/đọc/sửa/xoá đều phải demo được; và giám khảo phải xem được nó chạy từ đầu tới cuối.'])],
  goiY: [['Look for the one thing the description says is missing.', 'Tìm thứ duy nhất mà mô tả nói là thiếu.'], ['"anyone can edit" = no auth.', '"ai cũng sửa được" = không có đăng nhập.']],
  loi: [['Confusing validation with auth.', 'Lẫn kiểm tra với đăng nhập.'], ['Ignoring the demo test.', 'Bỏ qua phép kiểm demo.']],
  tns: [tn('owner-only action', 'hành động chỉ chủ sở hữu làm được')],
  kn: ['project scoping'],
});

const E4 = bai({
  ten: 'Model first, routes follow: planApi(model)', kho: 'HARD', phut: 20, lib: [],
  en: J`<p>The ★ advice: design the data model, and "the routes almost write themselves". Write <code>planApi(model)</code> where <code>model</code> maps a model name to its reference fields, e.g.</p>
<pre>{ User: {}, Post: { author: 'User' }, Comment: { user: 'User', post: 'Post' } }</pre>
<p>Return</p>
<pre>{ routes: ['GET /api/users', 'POST /api/users', 'GET /api/users/:id', 'PUT /api/users/:id', 'DELETE /api/users/:id', …],
  populate: ['Comment.post → Post', 'Comment.user → User', 'Post.author → User'],
  dangling: ['Order.payment → Payment'] }</pre>
<ul><li>routes: for every model in input order, the five CRUD routes on the plural, lower-case path (add <code>s</code>; a name ending in <code>y</code> after a consonant becomes <code>ies</code>: <code>Category</code> → <code>categories</code>);</li>
<li>populate: every reference whose target model exists, as <code>"Model.field → Target"</code>, sorted alphabetically;</li>
<li>dangling: references to models that do not exist, same format, sorted.</li></ul>`,
  vi: J`<p>Lời khuyên ★: thiết kế mô hình dữ liệu, và "route gần như tự viết ra". Viết <code>planApi(model)</code> với <code>model</code> ánh xạ tên model tới các field tham chiếu của nó, vd</p>
<pre>{ User: {}, Post: { author: 'User' }, Comment: { user: 'User', post: 'Post' } }</pre>
<p>Trả</p>
<pre>{ routes: ['GET /api/users', 'POST /api/users', 'GET /api/users/:id', 'PUT /api/users/:id', 'DELETE /api/users/:id', …],
  populate: ['Comment.post → Post', 'Comment.user → User', 'Post.author → User'],
  dangling: ['Order.payment → Payment'] }</pre>
<ul><li>routes: với mỗi model theo thứ tự đầu vào, năm route CRUD trên đường số nhiều, chữ thường (thêm <code>s</code>; tên kết thúc bằng <code>y</code> sau phụ âm thành <code>ies</code>: <code>Category</code> → <code>categories</code>);</li>
<li>populate: mọi tham chiếu có model đích tồn tại, dạng <code>"Model.field → Target"</code>, sắp theo bảng chữ cái;</li>
<li>dangling: tham chiếu tới model không tồn tại, cùng dạng, có sắp.</li></ul>`,
  yc: [['The order of the five routes is exactly: GET list, POST, GET one, PUT, DELETE.', 'Thứ tự năm route đúng là: GET danh sách, POST, GET một, PUT, DELETE.'], ['Use the arrow character <code>→</code> with one space on each side.', 'Dùng ký tự mũi tên <code>→</code> với một khoảng trắng mỗi bên.']],
  viDu: [['planApi({ Category: {}, Product: { category: \'Category\' } })', '{"routes":["GET /api/categories","POST /api/categories","GET /api/categories/:id","PUT /api/categories/:id","DELETE /api/categories/:id","GET /api/products",…],"populate":["Product.category → Category"],"dangling":[]}', 'Category → categories.', 'Category → categories.']],
  goiY: [['<code>const plural = (n) => { const s = n.toLowerCase(); return /[^aeiou]y$/.test(s) ? s.slice(0, -1) + \'ies\' : s + \'s\'; };</code>', '<code>const plural = (n) => { const s = n.toLowerCase(); return /[^aeiou]y$/.test(s) ? s.slice(0, -1) + \'ies\' : s + \'s\'; };</code>'], ['<code>Object.entries(model).forEach(([name, refs]) => Object.entries(refs).forEach(([field, target]) => …))</code>', '<code>Object.entries(model).forEach(([name, refs]) => Object.entries(refs).forEach(([field, target]) => …))</code>']],
  loi: [['<code>Category</code> → <code>categorys</code>.', '<code>Category</code> → <code>categorys</code>.'], ['Listing a populate path to a model that does not exist — that is the MissingSchemaError of lesson 3.2 waiting to happen.', 'Liệt kê đường populate tới model không tồn tại — đó là MissingSchemaError của bài 3.2 đang chờ xảy ra.']],
  gt: ['Once the models and their references are known, the API surface is mechanical: five routes per resource, and one populate per reference. Dangling references are design bugs found before a single route is written — the whole argument for model-first design.', 'Khi đã biết các model và tham chiếu, bề mặt API là việc máy móc: năm route cho mỗi tài nguyên, một populate cho mỗi tham chiếu. Tham chiếu treo là lỗi thiết kế được phát hiện trước khi viết route nào — toàn bộ lý lẽ cho thiết kế mô hình trước.'],
  kn: ['data modelling', 'REST conventions'],
  tns: [tn('dangling reference', 'tham chiếu treo', 'trỏ tới model không có'), tn('model-first', 'mô hình trước')],
  dau: J`function planApi(model) {
  const routes = [];
  for (const name of Object.keys(model)) {
    const path = '/api/' + name.toLowerCase() + 's';
    routes.push('GET ' + path, 'POST ' + path);
  }
  return { routes, populate: [], dangling: [] };
}
`,
  giai: J`const plural = (name) => {
  const s = name.toLowerCase();
  return /[^aeiou]y$/.test(s) ? s.slice(0, -1) + 'ies' : s + 's';   // category ⇒ categories, survey ⇒ surveys
};

function planApi(model) {
  const routes = [];
  const populate = [];
  const dangling = [];
  for (const [name, refs] of Object.entries(model)) {
    const path = '/api/' + plural(name);
    // one resource ⇒ one router with the five CRUD routes
    routes.push('GET ' + path, 'POST ' + path, 'GET ' + path + '/:id', 'PUT ' + path + '/:id', 'DELETE ' + path + '/:id');
    for (const [field, target] of Object.entries(refs || {})) {
      const line = name + '.' + field + ' → ' + target;
      (Object.prototype.hasOwnProperty.call(model, target) ? populate : dangling).push(line);
    }
  }
  populate.sort();
  dangling.sort();
  return { routes, populate, dangling };
}
`,
  cases: [
    { goi: `planApi({ User: {}, Post: { author: 'User' }, Comment: { user: 'User', post: 'Post' } })`, moTa: ['The blog model', 'Mô hình blog'] },
    { goi: `planApi({ Category: {}, Product: { category: 'Category' } }).routes.slice(0, 6)`, moTa: ['Category → categories', 'Category → categories'] },
    { goi: `planApi({ User: {}, Order: { user: 'User', payment: 'Payment' }, Survey: { owner: 'User', template: 'Template' } })`, an: true },
    { goi: `planApi({})`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-ngan-hang-de-tai',
  ten: '0.5 Project topic bank & how to choose',
  khoa: KHOA,
  baiHoc: 'sdn302-ngan-hang-de-tai',
  de: [E1, E3, E2, E4],
});
