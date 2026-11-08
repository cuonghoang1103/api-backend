/**
 * sdn-03-1 — SDN302 · Chapter 3 · Lesson 3.1 "NoSQL, MongoDB & CRUD" (slide EN, kiểu FU, đợt 5 — 01/11/2026). MỘT deck, HAI tập:
 *   3.1a (sdn-3-1)   = slide 1–18: NoSQL vs quan hệ, document / collection / database, BSON, chạy MongoDB + mongosh, CRUD đủ 4 thao tác, toán tử truy vấn,
 *                      mảng + đường chấm, sort/limit/count, toán tử cập nhật, matchedCount vs modifiedCount, bẫy thiếu $set, bẫy không schema, bài tập, tự kiểm.
 *   3.1b (sdn-3-1-2) = slide 19–31: ObjectId (12 byte, thời điểm tạo, chuỗi ≠ ObjectId) · nhúng vs tham chiếu (đo thật: đọc, đổi tên, dung lượng, N+1) ·
 *                      giới hạn 16 MB (thật) · luật chọn · chỉ mục: COLLSCAN → IXSCAN (200 000 document, thật), unique, chỉ mục không giúp trường khác · bài tập · tự kiểm.
 * Nguồn: content/academy/SDN302.mjs › sdn302-3-1-mongodb-crud (mỏng ⇒ BỔ SUNG phần lớn: BSON, mongosh, toán tử, cập nhật, ObjectId, chỉ mục + explain, đo nhúng/tham chiếu).
 * Output THẬT MongoDB 7.0.37 (Docker mongo:7) + mongosh 2.9.2 + driver mongodb 7.7.0 (Node 22.23.3): that/s3/{connect,crud,query,update,schemaless,bson,exercise-a,
 * objectid,embed-ref,too-large,index}. Số khoá: index 45 ms → 1 ms (200 000 → 1 document); embed-ref 262,5 / 465,4 ms · 8,4 / 6,9 / 941,7 ms · 217 vs 1 · 436 129 vs 244 000 byte.
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, vsd, ma, ra, js, term, cot, mg, gay } from './_sdn-chung.mjs';

export const deck = { key: 'sdn-03-1', code: 'SDN 3.1', title: 'NoSQL, MongoDB & CRUD', sub: 'SDN302 — Node.js, Express & MongoDB' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const M = (ten, a, b, n = 100) => gay(ra(`s3/${ten}`, a, b), n);
const nb = (l) => l.replace(/^ +/, (m) => '&#160;'.repeat(m.length));

/** Bảng ↔ document cạnh nhau (SVG). */
function bangVsDoc() {
  const w = 1110, h = 300;
  let s = `<svg data-k="bangdoc" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" xml:space="preserve">`;
  const cot = ['id', 'name', 'price'], rows = [['1', 'Clean Code', '25'], ['2', 'Pen', '2'], ['3', 'Lamp', '30']];
  s += `<text x="0" y="22" font-size="21" font-weight="800" fill="${LAM}">Table products (SQL): fixed columns</text>`;
  cot.forEach((c, i) => { s += `<rect x="${i * 150}" y="36" width="150" height="44" fill="${LAM}"/><text x="${i * 150 + 14}" y="66" font-size="20" font-weight="700" fill="#fff">${c}</text>`; });
  rows.forEach((r, j) => r.forEach((v, i) => { s += `<rect x="${i * 150}" y="${80 + j * 44}" width="150" height="44" fill="#fff" stroke="#cbd5e1"/><text x="${i * 150 + 14}" y="${110 + j * 44}" font-size="20" fill="#333">${v}</text>`; }));
  s += `<text x="0" y="250" font-size="19" fill="#555">every row has exactly these 3 columns</text>`;
  s += `<text x="520" y="22" font-size="21" font-weight="800" fill="${NODE}">Collection products (MongoDB): documents</text>`;
  const docs = [["{ _id: 1, name: 'Clean Code', price: 25,", "  tags: ['tech'], author: { name: 'Martin' } }"], ["{ _id: 2, name: 'Pen', price: 2 }"], ["{ _id: 3, name: 'Lamp', price: 30, tags: ['home'] }"]];
  let y = 40;
  docs.forEach((d) => { const hh = 18 + d.length * 26; s += `<g data-k="doc"><rect x="520" y="${y}" width="590" height="${hh}" rx="10" fill="#f0fdf4" stroke="${NODE}" stroke-width="2.5"/>` + d.map((l, i) => `<text x="534" y="${y + 30 + i * 26}" font-size="18.5" font-family="Menlo,monospace" fill="#14532d">${nb(l)}</text>`).join('') + '</g>'; y += hh + 12; });
  s += `<text x="520" y="${y + 22}" font-size="19" fill="#555">each document carries its own fields</text>`;
  return s + '</svg>';
}

/** ObjectId 12 byte (SVG). */
function objectId() {
  const w = 1110, h = 170, hex = '6ae653b24618d5d7f403ce99';
  const part = [[0, 8, 'timestamp: 4 bytes', 'seconds since 1970', LAM], [8, 18, 'random: 5 bytes', 'per process', TIM], [18, 24, 'counter: 3 bytes', '+1 per id', CAM]];
  let s = `<svg data-k="oid" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  const cw = 44;
  part.forEach(([a, b, t, sub, mau]) => {
    const x = 30 + a * cw;
    s += `<rect x="${x}" y="10" width="${(b - a) * cw - 6}" height="62" rx="10" fill="${mau}18" stroke="${mau}" stroke-width="3"/>`;
    for (let i = a; i < b; i++) s += `<text x="${30 + i * cw + 15}" y="52" font-size="30" font-family="Menlo,monospace" font-weight="700" fill="${mau}">${hex[i]}</text>`;
    s += `<text x="${x + ((b - a) * cw) / 2 - 3}" y="106" text-anchor="middle" font-size="21" font-weight="800" fill="${mau}">${t}</text><text x="${x + ((b - a) * cw) / 2 - 3}" y="134" text-anchor="middle" font-size="18" fill="#555">${sub}</text>`;
  });
  return s + '</svg>';
}

/** Nhúng vs tham chiếu: hoá đơn và bảng giá (SVG). */
function nhungThamChieu() {
  const w = 1110, h = 300;
  let s = `<svg data-k="nhung" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" xml:space="preserve"><defs><marker id="ms31" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  s += `<text x="0" y="24" font-size="22" font-weight="800" fill="${NODE}">Embedded: copies inside the order</text>`;
  s += `<g data-k="don"><rect x="0" y="40" width="500" height="230" rx="12" fill="#f0fdf4" stroke="${NODE}" stroke-width="3"/>`;
  ["{ _id: 1,", "  items: [", "    { productId: 7, name: 'Product 7',", "      price: 16, qty: 1 },", "    { productId: 2, name: 'Product 2', … }", "  ] }"].forEach((l, i) => { s += `<text x="16" y="${76 + i * 32}" font-size="19" font-family="Menlo,monospace" fill="#14532d">${nb(l)}</text>`; });
  s += '</g>';
  s += `<text x="580" y="24" font-size="22" font-weight="800" fill="${LAM}">Referenced: only the id</text>`;
  s += `<g data-k="don"><rect x="580" y="40" width="240" height="150" rx="12" fill="#eff6ff" stroke="${LAM}" stroke-width="3"/>`;
  ["{ _id: 1,", "  items: [", "   { productId: 7 },", "   { productId: 2 } ] }"].forEach((l, i) => { s += `<text x="592" y="${74 + i * 30}" font-size="17.5" font-family="Menlo,monospace" fill="#1e3a8a">${nb(l)}</text>`; });
  s += '</g>';
  s += `<g data-k="sp"><rect x="890" y="40" width="220" height="150" rx="12" fill="#fff" stroke="${LAM}" stroke-width="3"/><text x="904" y="72" font-size="19" font-weight="800" fill="${LAM}">products</text>`;
  ["{ _id: 7,", "  name: 'Product 7',", "  price: 16 }"].forEach((l, i) => { s += `<text x="902" y="${104 + i * 28}" font-size="17" font-family="Menlo,monospace" fill="#333">${nb(l)}</text>`; });
  s += '</g>';
  s += `<line x1="800" y1="128" x2="886" y2="110" stroke="#b85a2b" stroke-width="3" marker-end="url(#ms31)"/>`;
  s += `<text x="580" y="232" font-size="20" fill="#555">read = order, then look up products</text><text x="580" y="262" font-size="20" fill="#555">rename = change one product document</text>`;
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Chapter 3 — MongoDB & Mongoose', bai: '3.1' }, [
  // ───── PHẦN A (sdn-3-1): slide 1–18 ─────
  { cover: true, t: 'NoSQL, MongoDB<br>& CRUD', sub: 'Documents instead of rows, run for real in mongosh. Then: ids, modelling and indexes.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: two(box('Part 1 (this video)', '<ul><li>NoSQL and the document model</li><li>document · collection · database · BSON</li><li>Run MongoDB, connect with mongosh</li><li>CRUD + query and update operators</li><li>The trap of “no schema”</li></ul>', 'xanh'),
    box('Part 2 (next video)', '<ul><li>ObjectId: what the 24 characters mean</li><li>Embed or reference? Measured</li><li>The 16 MB document limit</li><li>Indexes: COLLSCAN vs IXSCAN</li></ul>', 'lam')) +
    box('Before this', 'DBI202: tables, rows, primary and foreign keys. We compare every idea to that.', '') +
    box('Everything here runs for real', 'MongoDB 7.0.37 in Docker, mongosh 2.9.2. Every output on these slides was copied from a real run.', 'lam') },

  { t: 'Picture a filing cabinet', to: true, giua: true, body: three(
    box('Spreadsheet = SQL table', 'Fixed columns. Every row has the same fields. To combine two sheets you JOIN them.', 'lam'),
    box('Folder of forms = collection', 'Each form (document) is a complete record. Two forms may have different fields.', 'xanh'),
    box('Cabinet = database', 'One MongoDB server holds many databases; each holds many collections.', '')) +
    `<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('NoSQL', '“not only SQL”: databases that do not use tables')} ${kw('document', 'one record, shaped like JSON')} ${kw('collection', 'a group of documents')}</div>` +
    box('Why MongoDB?', 'No fixed schema at the database level: good for app data that changes shape quickly. That freedom is also its main trap (slide 16).', 'xanh') },

  { t: 'Relational vs MongoDB', to: true, giua: true, body: bang(['Relational (SQL)', 'MongoDB'], [
    ['Table', 'Collection'], ['Row', 'Document'], ['Column', 'Field'], ['Primary key', '<code class="i">_id</code> (added for you)'],
    ['JOIN across tables', 'Embed a sub-document <b>or</b> reference + populate'],
  ], { co: 25 }) + bangVsDoc() },

  { t: 'One document', to: true, giua: true, body: two(js(`{
  "_id": "665f...",
  "name": "Clean Code",
  "price": 25,
  "tags": ["tech", "programming"],
  "author": { "name": "Martin" }
}`), cot(box('_id', 'Every document has one. If you do not give it, MongoDB creates an ObjectId.', 'lam'),
    box('Arrays and nested objects', '<code class="i">tags</code> is an array, <code class="i">author</code> is an object, <b>inside</b> the document.', 'xanh'),
    box('No JOIN to read them', 'One read returns the product with its tags and author.', ''))) },

  { t: 'JSON on screen, BSON on disk', body: mg(M('bson', 1, 1, 118) + '\n' + M('bson', 6, 20, 118), { sm: true }) +
    box('', '<b>BSON = Binary JSON</b>: more types than JSON (<b>int, double, date, ObjectId, decimal</b>). This document: 136 bytes.', 'xanh') },

  { t: 'Run MongoDB, connect with mongosh', body: two(cot(term(`$ docker run -d --name mongo -p 27017:27017 mongo:7\n9941bf1f8810…   (container id)`, { title: 'terminal · real (MongoDB 7.0.37)', sm: true }),
    box('mongosh', 'The MongoDB shell: type JavaScript commands, get real answers. Inside the container: <code class="i">docker exec -it mongo mongosh</code>.', 'lam'),
    box('Other ways', '<b>MongoDB Atlas</b>: a free cloud cluster. <b>MongoDB Compass</b>: a GUI that does the same CRUD with the mouse, using the same connection string.', '')),
  mg(ra('s3/connect', 1, 21), { sm: true })) + box('Notice', 'Database <b>shop</b> did not exist until the first insert. MongoDB creates databases and collections lazily.', 'xanh') },

  { t: 'Create: insertOne and insertMany', body: mg(M('crud', 1, 1, 104) + '\n' + M('crud', 3, 4, 104) + '\n' + M('crud', 6, 18, 104), { sm: true }) +
    box('Read the reply', '<b>acknowledged: true</b>: the server confirmed the write. <b>insertedId(s)</b>: an ObjectId generated for each document; they differ only at the end.', 'xanh') },

  { t: 'Read: find with a filter', body: mg(M('crud', 19, 28, 104), { sm: true }) + three(
    box('Filter', '<code class="i">{ price: { $gt: 20 } }</code>: “price greater than 20”.', 'lam'),
    box('Projection', '<code class="i">{ tags: 0 }</code>: hide that field. <code class="i">{ name: 1 }</code>: show only that.', 'xanh'),
    box('find vs findOne', '<code class="i">find</code> returns a list (a cursor), <code class="i">findOne</code> one document or <code class="i">null</code>.', '')) +
    box('SQL twin', '<code class="i">SELECT * FROM products WHERE price &gt; 20</code> (without the tags column).', 'lam') },

  { t: 'Query operators', body: two(bang(['Operator', 'Means'], [
    ['$gt · $gte', '&gt; · ≥'], ['$lt · $lte', '&lt; · ≤'], ['$ne', 'not equal'], ['$in', 'one of a list'], ['$or', 'any of several conditions'], ['$exists', 'the field is there (or not)'],
  ], { co: 21 }), mg(M('query', 1, 6, 64), { sm: true })) + box('Rule', 'Conditions inside one object are AND. Use <code class="i">$or</code> for OR.', 'xanh') },

  { t: 'Arrays, nested fields, sort and count', body: mg(M('query', 7, 17, 104), { sm: true }) + three(
    box('Array', '<code class="i">{ tags: \'gift\' }</code> matches if the array <b>contains</b> it.', 'lam'),
    box('Dot path', '<code class="i">\'author.name\'</code> reaches into a nested object. Quote it.', 'xanh'),
    box('sort · limit', '<code class="i">-1</code> = high to low. countDocuments counts without fetching.', '')) },

  { t: 'Update operators', body: mg(M('update', 1, 18, 104), { sm: true }) + three(
    box('$set', 'Set a field (create it if missing).', 'lam'), box('$inc · $push', 'Add to a number · append to an array.', 'xanh'), box('updateMany', 'Every match, not just the first.', '')) },

  { t: 'Read the update result', to: true, giua: true, body: mg(M('update', 19, 28, 104)) + two(
    box('matchedCount: 0 is not an error', 'Nothing had name “Ghost”. The command succeeds and changes nothing. Always check the counts.', 'do2'),
    box('Forgot $set?', 'Without an operator MongoDB refuses the update. <code class="i">replaceOne</code> exists for replacing a whole document on purpose.', '')) },

  { t: 'Delete', to: true, giua: true, body: mg(ra('s3/crud', 37, 40) + '\n' + ra('s3/update', 29, 30)) + two(
    box('deleteOne · deleteMany', 'Same filters as find. deletedCount tells you how many went.', 'xanh'),
    box('Careful', '<code class="i">deleteMany({})</code> with an empty filter deletes <b>every</b> document in the collection.', 'do2')) +
    bang(['C', 'R', 'U', 'D'], [['insertOne · insertMany', 'find · findOne · countDocuments', 'updateOne · updateMany', 'deleteOne · deleteMany']], { co: 21 }) },

  { t: 'The trap: no schema in the database', body: two(mg(M('schemaless', 1, 19, 60), { sm: true }), cot(mg(M('schemaless', 20, 27, 60), { sm: true }),
    box('Three silent mistakes', '<b>prcie</b>: a typo, accepted. <b>\'30\'</b>: a string, so $gt 20 does not match it. <b>prodcuts</b>: a new collection, created on the spot.', 'do2'),
    box('The fix', 'Mongoose schemas reject these before they reach MongoDB (lesson 3.2).', 'xanh'))) },

  { t: 'Exercise: three queries', body: box('Your task', 'Products: Pen 2 (office), Mug 8 (kitchen, gift), Lamp 30 (home, gift), Stapler 6 (office). Write: 1) gifts under 10, name and price only · 2) every office product +1 · 3) the two cheapest after that.', '') +
    `<div data-k="dapan">${mg(M('exercise-a', 1, 12, 104), { sm: true })}</div>` },

  { t: 'Check yourself (part 1)', to: true, giua: true, body: `<ol>
<li>Which MongoDB word matches a SQL <b>row</b>?</li>
<li><code class="i">updateOne</code> returns matchedCount 0. Did it fail?</li>
<li>You stored price as <code class="i">'30'</code>. Does <code class="i">{ price: { $gt: 20 } }</code> find it?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. A document. &nbsp;2. No: nothing matched, so nothing changed. &nbsp;3. No: a string is not compared with numbers.', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}` },

  { t: 'Summary (part 1)', to: true, giua: true, body: `<ul>
<li>MongoDB stores <b>documents</b> (BSON) in <b>collections</b>, inside a <b>database</b></li>
<li>No schema in the database: typos and wrong types are accepted silently</li>
<li>CRUD: insertOne/Many · find + filter + projection · updateOne/Many + $set $inc $push · deleteOne/Many</li>
<li>Read the counts: matchedCount, modifiedCount, deletedCount</li>
</ul>
${bang(['C', 'R', 'U', 'D'], [['insertOne · insertMany', 'find · findOne · countDocuments', 'updateOne · updateMany', 'deleteOne · deleteMany']], { co: 21 })}
${box('Next video', 'Part 2: ObjectId, embedding vs referencing (measured), the 16 MB limit and indexes.', 'lam')}` },

  // ───── PHẦN B (sdn-3-1-2): slide 19–31 ─────
  { cover: true, t: 'MongoDB, part 2:<br>ids, modelling, indexes', sub: 'Three decisions that decide whether your data is fast, correct, and still small next year.' },

  { t: 'ObjectId: 12 bytes with a meaning', to: true, giua: true, body: objectId() + mg(M('objectid', 1, 1, 104) + '\n' + M('objectid', 5, 7, 104) + '\n' + M('objectid', 16, 17, 104), { sm: true }) +
    box('Read it', 'Three ids made in the same second share the first 8 characters; the counter at the end goes 99 → 9a → 9b. getTimestamp() prints UTC time.', 'xanh') },

  { t: 'A string is not an ObjectId', to: true, giua: true, body: mg(M('objectid', 18, 25, 104)) + two(
    box('Why it matters', '<code class="i">req.params.id</code> is always a string (lesson 2.1). The shell and the driver do not convert it for you.', 'do2'),
    box('Mongoose helps', 'Mongoose casts the string to an ObjectId, and throws a CastError if it is not 24 hex characters (lesson 4.1).', 'xanh')) },

  { t: 'Embed or reference?', to: true, giua: true, body: nhungThamChieu() + two(
    box('Like a receipt', 'A receipt copies the price of that day, and should never change: embed.', 'xanh'),
    box('Like a price list', 'Shared data, changed in one place, seen by everyone: reference.', 'lam')) },

  { t: 'Measured: reading orders', body: js(gay(ma('s3/embed-ref', 13, 16), 104), { sm: true }) + term(ra('s3/embed-ref', 1, 8), { title: 'node embed-ref.js · 2,000 orders · median of 5 runs · real', sm: true }) + two(
    box('One order at a time', 'Embedded needs 1 query, referenced needs 2: about 1.8× slower here.', 'lam'),
    box('The real danger', 'A lookup <b>per order</b>: 2,001 queries, over 900 ms. That is the N+1 problem.', 'do2')) },

  { t: 'Measured: changing shared data', to: true, giua: true, body: term(ra('s3/embed-ref', 9, 12), { title: 'node embed-ref.js · real' }) + three(
    box('Rename a product', 'Embedded: <b>217</b> orders rewritten. Referenced: <b>1</b> document.', 'do2'),
    box('Size', 'Copies cost space: 436,129 bytes vs 244,000 bytes for the same orders.', ''),
    box('But…', 'An order <b>should</b> keep the old name and price. Some copies are correct on purpose.', 'xanh')) +
    js(gay(ma('s3/embed-ref', 47, 48), 104), { sm: true }) },

  { t: 'The 16 MB limit', to: true, giua: true, body: mg(M('too-large', 1, 4, 104)) + two(
    box('What happened', 'One user, every order pushed into one array. At 15 orders of about 1 MB the 16th push was refused.', 'do2'),
    box('The rule', 'Never embed what grows without limit: a user’s orders, a post’s comments. Reference them.', 'xanh')) +
    `<div style="display:flex;gap:12px">${kw('16,777,216 bytes', '= 16 MB, the hard limit for one document')}</div>` },

  { t: 'The rule of thumb', to: true, giua: true, body: bang(['Embed when…', 'Reference when…'], [
    ['the data is read together with its parent', 'the data is shared by many parents'],
    ['it stays small and bounded (a few tags)', 'it grows without limit (orders, comments)'],
    ['it is a snapshot (price on the receipt)', 'it changes and every reader must see the change'],
  ], { co: 24 }) + box('“Data that is read together is stored together”', 'Getting this right avoids both giant documents and needless populate calls. PostgreSQL 17.3 compares the same choice with JSONB.', 'xanh') +
    flow([{ t: 'Read together?', s: 'yes → embed', mau: NODE }, { t: 'Grows forever?', s: 'yes → reference', mau: DO }, { t: 'Shared + changes?', s: 'yes → reference', mau: LAM }, { t: 'Snapshot?', s: 'yes → copy it', mau: CAM }], { h: 130, fs: 20 }) },

  { t: 'Indexes: the book index', body: two(cot(mg(M('index', 1, 20, 60), { sm: true })), cot(
    box('Without an index', '<b>COLLSCAN</b>: read all 200,000 documents to find 1. 45 ms.', 'do2'),
    box('With an index on sku', '<b>IXSCAN</b>: 1 key, 1 document. 1 ms.', 'xanh'),
    box('Like a book', 'Look up the word in the index at the back, jump to the page. MongoDB indexes are B-trees.', 'lam'),
    js(`const e = db.products.find({ sku: 'P-123456' })\n  .explain('executionStats');`, { sm: true }))) },

  { t: 'What an index does and does not do', to: true, giua: true, body: two(mg(M('index', 21, 33, 60), { sm: true }), cot(
    box('Only for its field', 'The sku index does nothing for a query on price: still 200,000 documents.', 'do2'),
    box('_id is free', 'Every collection has an index on <code class="i">_id</code> already.', 'lam'),
    box('unique: true', 'The index also refuses a second document with the same sku (duplicate key, lesson 4.1).', 'xanh'),
    box('Not free', 'Every insert and update must update each index too. Index what you search, sort or join on.', ''))) },

  { t: 'Exercise: embed or reference?', to: true, giua: true, body: `<ol><li>A blog post’s <b>comments</b> (could be thousands)</li><li>A user’s <b>address</b> (one, read with the user)</li><li>The <b>price</b> on an order line</li><li>A product’s <b>category</b> name, shared by 500 products</li></ol>
<div data-k="dapan">${bang(['Case', 'Choice', 'Why'], [['comments', 'reference', 'grows without limit'], ['address', 'embed', 'small, read together'], ['price on the order', 'embed (copy)', 'a snapshot that must not change'], ['category', 'reference', 'shared, changed in one place']], { co: 21 })}</div>` },

  { t: 'Check yourself (part 2)', to: true, giua: true, body: `<ol>
<li>What do the first 8 hex characters of an ObjectId store?</li>
<li>Explain shows COLLSCAN and docsExamined = 200,000. What is missing?</li>
<li>Why reference a user’s orders instead of embedding them?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The creation time (seconds). &nbsp;2. An index on the queried field. &nbsp;3. They grow without limit: 16 MB, and every read drags them along.', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}
${box('Go deeper', 'PostgreSQL course 17.3: the same 2,000 orders as tables, documents and JSONB, with indexes on both sides.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>MongoDB stores <b>documents</b> (BSON) in <b>collections</b>; no schema in the database</li>
<li>CRUD: insert / find / update with operators / delete; read the counts</li>
<li>ObjectId = time + random + counter; a string is not an ObjectId</li>
<li>Embed what is read together and bounded; reference what is shared or grows</li>
<li>An index turns COLLSCAN into IXSCAN, for its own field only</li>
</ul>
${box('Next', 'Lesson 3.2: Mongoose, a schema in front of MongoDB, validation, and population.', 'lam')}
${box('Practise', 'Repeat every mongosh command of this lesson on your own machine, then change one value and predict the output first.', 'xanh')}` },
]);
