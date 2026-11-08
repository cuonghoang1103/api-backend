/**
 * sdn-03-2 — SDN302 · Chapter 3 · Lesson 3.2 "Mongoose: schemas, models & population" (slide EN, kiểu FU, đợt 5 — 01/11/2026). MỘT deck, HAI tập:
 *   3.2a (sdn-3-2)   = slide 1–17: ODM là gì, driver vs Mongoose (thật), connect, schema + model, tên collection, trim/ép kiểu/default/timestamps, ValidationError,
 *                      kiểu + validator, CRUD async, findByIdAndUpdate trả bản CŨ (returnDocument 'after', new: true bị cảnh báo ở Mongoose 9), update bỏ qua validator
 *                      (runValidators), quên await ⇒ Query, unique không phải validator (E11000, thêm muộn ⇒ chỉ mục không dựng được), bài tập, tự kiểm, tóm tắt.
 *   3.2b (sdn-3-2-2) = slide 18–29: ref + populate (id ⇒ document), populate lộ password (thật), chọn trường, populate = thêm 1 truy vấn $in (thật),
 *                      select: false + '+password', nhiều đường + lồng nhau (thật), N+1: 201 truy vấn 155,9 ms vs 3 truy vấn 4,6 ms (thật), lean, bài tập, tự kiểm, tóm tắt.
 * Nguồn: content/academy/SDN302.mjs › sdn302-3-2-mongoose (mỏng ⇒ bổ sung phần lớn). Output THẬT Mongoose 9.11.4 + MongoDB 7.0.37 (Node 22.23.3): that/s3m/*.
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, vsd, ma, ra, js, term, cot, gay } from './_sdn-chung.mjs';

export const deck = { key: 'sdn-03-2', code: 'SDN 3.2', title: 'Mongoose: schemas, models & population', sub: 'SDN302 — Node.js, Express & MongoDB' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const R = (ten, a, b, n = 104) => gay(ra(`s3m/${ten}`, a, b), n);
const T = (ten, a, b, o = {}) => term(R(ten, a, b, o.n ?? 104), { title: o.title ?? `node ${ten}.js · Mongoose 9.11.4 · real`, sm: o.sm ?? true, hl: o.hl });

/** Người gác cửa: request ⇒ Mongoose (schema) ⇒ MongoDB (SVG). */
function gacCua() {
  return flow([
    { t: 'Your code', s: "{ price: 'two dollars' }", mau: LAM },
    { t: 'Mongoose schema', s: 'checks type, rules', mau: NODE },
    { t: 'MongoDB', s: 'stores what passes', mau: TIM },
  ], { h: 150, fs: 22 });
}

export const slides = lamDeck({ chuong: 'Chapter 3 — MongoDB & Mongoose', bai: '3.2' }, [
  // ───── PHẦN A (sdn-3-2): slide 1–17 ─────
  { cover: true, t: 'Mongoose:<br>schemas, models & population', sub: 'A shape for your flexible documents: rules that run before MongoDB sees the data.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: two(box('Part 1 (this video)', '<ul><li>ODM: what Mongoose adds</li><li>Connect, schema, model</li><li>Validation, run for real</li><li>CRUD with async / await</li><li>Four traps that cost marks</li></ul>', 'xanh'),
    box('Part 2 (next video)', '<ul><li>References and <b>populate</b></li><li>Choosing fields, hiding passwords</li><li>What populate really costs</li><li>The N+1 problem, measured</li></ul>', 'lam')) +
    box('CLO5', 'REST API with Express, MongoDB, Mongoose <b>and population</b>: the headline outcome of the course.', '') +
    box('Installed for this lesson', 'mongoose 9.11.4 (with the official driver mongodb 7.7.0), MongoDB 7.0.37, Node.js 22.', 'lam') },

  { t: 'Why Mongoose? A guard at the door', to: true, giua: true, body: gacCua() + three(
    box('ODM', 'Object Data Modeling: a library that maps JavaScript objects to MongoDB documents.', 'lam'),
    box('Schema', 'The shape: which fields, which types, which rules.', 'xanh'),
    box('Model', 'A class built from a schema. You call <code class="i">Product.create()</code>, <code class="i">Product.find()</code>.', '')) +
    box('Lesson 3.1 left a hole', 'MongoDB accepted a typo field and a price stored as text. Mongoose closes that hole in your code.', 'do2') },

  { t: 'Driver vs Mongoose, run for real', body: js(ma('s3m/driver-vs-odm', 11, 21), { sm: true }) + T('driver-vs-odm', 2, 4) + three(
    box('Driver', 'Stored a price of “two dollars” and the typo prcie.', 'do2'), box('Mongoose', 'Refused: cannot cast to Number.', 'xanh'), box('Strict mode', 'Unknown field prcie silently dropped.', 'lam')) },

  { t: 'Schema and model', body: js(ma('s3m/schema', 1, 14), { sm: false }) + two(
    box('mongoose.connect', 'One connection for the whole app, opened once at start-up. Database <b>shop</b> on the local MongoDB.', 'lam'),
    box('Model name → collection', '<code class="i">\'Product\'</code> becomes collection <b>products</b>: lower case, plural (real output, next slide).', 'xanh')) },

  { t: 'A valid document, transformed', to: true, giua: true, body: two(T('schema', 1, 11), cot(
    box('trim', '<code class="i">\'  Clean Code  \'</code> → <code class="i">\'Clean Code\'</code>', 'xanh'),
    box('Cast', 'The string <code class="i">\'25\'</code> became the number 25.', 'lam'),
    box('default · timestamps', 'category filled with \'book\'; createdAt and updatedAt added.', ''),
    box('__v', 'The version key Mongoose adds. Leave it alone.', 'lam'))) },

  { t: 'An invalid document, rejected', to: true, giua: true, body: js(ma('s3m/schema', 19, 24)) + T('schema', 12, 15, { sm: false }) + two(
    box('ValidationError', 'One error, with <b>every</b> broken field in <code class="i">err.errors</code>. Nothing reached MongoDB.', 'xanh'),
    box('Use it', 'In lesson 4.1 this becomes a 400 response with one message per field.', 'lam')) },

  { t: 'Types and validators', to: true, giua: true, body: two(bang(['Type', 'Example'], [
    ['String', "name: String"], ['Number', 'price: Number'], ['Boolean', 'inStock: Boolean'], ['Date', 'createdAt: Date'], ['ObjectId', "author: { type: …ObjectId, ref: 'User' }"], ['[String]', "tags: [String]"],
  ], { co: 20 }), bang(['Validator', 'Rule'], [
    ['required', 'must be present'], ['min · max', 'number range'], ['minlength · maxlength', 'string length'], ['enum', 'one of a list'], ['match', 'a regular expression'], ['validate', 'your own function'],
  ], { co: 20 })) + box('Not a validator', '<code class="i">unique: true</code> builds an index. It behaves differently (slide 13).', 'do2') },

  { t: 'CRUD with async / await', body: js(ma('s3m/crud', 9, 21), { sm: true }) + box('Always await', 'Every call goes to the database and returns later. <code class="i">await</code> waits for the answer.', 'lam') },

  { t: 'CRUD output: the update surprise', to: true, giua: true, body: T('crud', 1, 8, { n: 112 }) + three(
    box('Default: the OLD document', 'findByIdAndUpdate returned price 25, the value <b>before</b> the update.', 'do2'),
    box("returnDocument: 'after'", 'Returns the updated document: 35.', 'xanh'),
    box('new: true', 'Old tutorials use it. Mongoose 9 still runs it, with a deprecation warning.', '')) },

  { t: 'Trap: updates skip validators', to: true, giua: true, body: js(ma('s3m/crud', 23, 26)) + T('crud', 9, 11, { sm: false }) + two(
    box('price -1 accepted', 'Validators run on save and create, <b>not</b> on update by default.', 'do2'),
    box('Fix', 'Pass <code class="i">{ runValidators: true }</code> to every update (lesson 4.1 does).', 'xanh')) },

  { t: 'Trap: the forgotten await', body: js(ma('s3m/await-trap', 9, 17), { sm: true }) + T('await-trap', 1, 5) + two(
    box('What you got', 'A <b>Query</b> object: a plan for a request, not the data. <code class="i">.length</code> and <code class="i">.price</code> are undefined.', 'do2'),
    box('In Express', 'Lesson 0.5: <code class="i">res.json(User.find())</code> crashed with a 500 “circular structure”.', 'lam')) },

  { t: 'Trap: unique is not a validator', body: js(ma('s3m/unique', 2, 2) + '\n' + ma('s3m/unique', 9, 16), { sm: true }) + T('unique', 2, 5) + two(
    box('Refused by MongoDB', 'Error code <b>11000</b> (duplicate key), a MongoServerError, not a ValidationError. Lesson 4.1 turns it into 409.', 'lam'),
    box('Where the rule lives', '<code class="i">unique</code> asks MongoDB to build the index <b>email_1</b>. The index does the refusing.', 'xanh')) },

  { t: 'Trap: unique added too late', body: js(gay(ma('s3m/unique-late', 6, 13), 110), { sm: true }) + T('unique-late', 2, 4) + two(
    box('What happened', 'Two old duplicates block the index build (11000). No index ⇒ no rule: a third copy was accepted.', 'do2'),
    box('Fix', 'Add unique before data exists, or clean duplicates first, then check <code class="i">getIndexes()</code>.', 'xanh')) },

  { t: 'Exercise: a Book schema', to: true, giua: true, body: box('Your task', 'title: required, trimmed · pages: at least 1 · genre: novel or tech, default tech. Create <code class="i">{ title: \'  Node  \', pages: 0, genre: \'poem\' }</code>: which errors? Then a valid book: what are title and genre?', '') +
    `<div data-k="dapan">${js(ma('s3m/exercise', 3, 7), { sm: true })}${T('exercise', 1, 4)}</div>` },

  { t: 'Check yourself (part 1)', to: true, giua: true, body: `<ol>
<li>Model <code class="i">'Category'</code>: what is the collection called?</li>
<li><code class="i">findByIdAndUpdate(id, { price: 30 })</code> returns a document. Old or new?</li>
<li>Why does <code class="i">const list = Product.find(); list.length</code> print undefined?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. categories. &nbsp;2. The old one, unless returnDocument: \'after\'. &nbsp;3. No await: list is a Query, not an array.', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}` },

  { t: 'Summary (part 1)', to: true, giua: true, body: `<ul>
<li>Mongoose = ODM: a <b>schema</b> checks data before MongoDB sees it</li>
<li>Model name → collection (lower case, plural); trim, cast, default, timestamps</li>
<li>Always <b>await</b>; updates need <code class="i">runValidators</code> and <code class="i">returnDocument: 'after'</code></li>
<li><code class="i">unique</code> is an index, not a validator: create it before the data exists</li>
</ul>
${flow([{ t: 'Schema', s: 'shape + rules', mau: NODE }, { t: 'Model', s: 'Product.create / find', mau: LAM }, { t: 'MongoDB', s: 'only valid data', mau: TIM }], { h: 120, fs: 21 })}
${box('Next video', 'Part 2: references, populate, hiding passwords, and the N+1 problem.', 'lam')}` },

  // ───── PHẦN B (sdn-3-2-2): slide 18–29 ─────
  { cover: true, t: 'Mongoose, part 2:<br>references & population', sub: 'Mongoose’s answer to JOIN, what it costs, and what it can leak.' },

  { t: 'A reference stores only the id', body: js(ma('s3m/populate', 3, 7)) + T('populate', 1, 5, { sm: false }) + two(
    box('ref: \'User\'', 'Tells Mongoose which model this id belongs to. MongoDB itself stores just an ObjectId.', 'lam'),
    box('Like a foreign key, not enforced', 'Delete the user and the post still holds its id: populate then gives <code class="i">author: null</code> (real run, dangling.js).', 'do2')) },

  { t: 'populate: the id becomes a document', body: js(ma('s3m/populate', 16, 18), { sm: true }) + two(T('populate', 6, 15, { n: 60 }), cot(
    box('2) It worked…', 'author is now the full user document.', 'xanh'),
    box('…and leaked the password hash', 'populate returns <b>every</b> field unless you choose. Never send this to a client.', 'do2'),
    box('3) Choose fields', '<code class="i">populate(\'author\', \'name -_id\')</code> ⇒ only the name.', 'lam'))) + T('populate', 16, 16) },

  { t: 'What populate really does', to: true, giua: true, body: T('populate', 17, 17, { sm: false, n: 112 }) + flow([
    { t: 'posts.findOne', s: 'query 1: the post', mau: LAM }, { t: 'collect author ids', s: 'inside Mongoose', mau: NODE }, { t: 'users.find', s: 'query 2: { _id: { $in: ids } }', mau: TIM }, { t: 'merge', s: 'id → document', mau: CAM },
  ], { h: 150, fs: 20 }) + two(
    box('Not a JOIN', 'MongoDB never joins here. Mongoose sends a <b>second query</b> and stitches the results in Node.js.', 'lam'),
    box('One extra query per path', 'Cheap when done once for a whole list. Deadly when done once per item (slide 24).', 'do2')) },

  { t: 'Hide secrets at the schema', to: true, giua: true, body: js(ma('s3m/select-false', 3, 6)) + two(T('select-false', 2, 7, { n: 60 }), T('select-false', 8, 14, { n: 60 })) +
    box('select: false', 'The password never leaves the database unless a query asks for it with <code class="i">\'+password\'</code>, e.g. the login check (lesson 5.1).', 'xanh') },

  { t: 'Several paths, and nested populate', body: js(ma('s3m/populate-deep', 19, 25), { sm: true }) + T('populate-deep', 1, 7) + two(
    box('Two paths', 'Chain populate calls: the comment’s author <b>and</b> its post.', 'xanh'),
    box('Nested', 'populate inside populate: the comment’s post, then that post’s author.', 'lam')) },

  { t: 'The N+1 problem with Mongoose', body: js(ma('s3m/n-plus-one', 20, 31).replace('{ p.author = await', '{\n      p.author = await').replace('; p.comments = await', ';\n      p.comments = await'), { sm: true }) + T('n-plus-one', 1, 3, { sm: false }) },

  { t: 'Read the N+1 numbers', to: true, giua: true, body: T('n-plus-one', 2, 3, { sm: false, title: 'node n-plus-one.js · 100 posts · median of 5 runs · real' }) + three(
    box('201 queries', '1 for the list + 2 for each of the 100 posts. 155.9 ms on a local database.', 'do2'),
    box('3 queries', 'One list, one populate ($in), one grouped count. 4.6 ms.', 'xanh'),
    box('Over a network', 'Each extra query adds a round trip. On a real server the gap grows.', '')) +
    box('The sign of N+1', 'An <code class="i">await</code> query inside a <code class="i">for</code> loop. Load for the whole list once, then join in memory.', 'lam') +
    box('Same problem everywhere', 'Prisma, SQL, any ORM: the Node.js course measures it again in lesson 7.4.', '') },

  { t: 'lean() and toJSON: lighter and safer', body: js(ma('s3m/lean', 10, 11), { sm: true }) + js(ma('s3m/tojson', 3, 4).replace('{ transform: (doc, ret) => {', '{\n  transform: (doc, ret) => {'), { sm: true }) + two(
    cot(T('lean', 2, 5, { n: 60 }), box('lean()', 'Plain objects, no .save(): about half the time for 5,000 documents here. For read-only lists; Handlebars needs it (4.2).', 'xanh')),
    cot(T('tojson', 2, 3, { n: 60 }), box('toJSON transform', 'Strips the password on every res.json. A safety net, not a replacement for field lists.', 'lam'))) },

  { t: 'Exercise: comments with names', to: true, giua: true, body: box('Your task', 'Comment has <code class="i">author</code> (User) and <code class="i">post</code> (Post). Load one comment with only the author’s <b>name</b> and the post’s <b>title</b>. Then: the post’s author name, through the post.', '') +
    `<div data-k="dapan">${T('populate-deep', 1, 7)}${box('', 'Two populate calls with field lists; then <code class="i">populate({ path: \'post\', populate: { path: \'author\' } })</code>.', 'xanh')}</div>` },

  { t: 'Check yourself (part 2)', to: true, giua: true, body: `<ol>
<li>How many queries does <code class="i">Post.find().populate('author')</code> send?</li>
<li>populate returned the password hash. Name two fixes.</li>
<li>A loop does <code class="i">await User.findById()</code> for each of 50 posts. How many queries in total?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Two: the posts, then the users with $in. &nbsp;2. A field list in populate, or select: false in the schema. &nbsp;3. 51.', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}` },

  { t: 'Summary (part 2)', to: true, giua: true, body: `<ul>
<li>A reference stores an ObjectId + <code class="i">ref</code>; <b>populate</b> swaps it for the document</li>
<li>populate = one extra query with <code class="i">$in</code>, stitched in Node.js</li>
<li>Always choose fields; hide secrets with <code class="i">select: false</code></li>
<li>Never query inside a loop: populate or group once (N+1)</li>
</ul>
${box('Next', 'Lesson 4.1: put it all together in a REST API with MVC layers.', 'lam')}
${box('Go deeper', 'Node.js course 7.4 shows the same N+1 problem with Prisma and PostgreSQL.', 'xanh')}` },
]);
