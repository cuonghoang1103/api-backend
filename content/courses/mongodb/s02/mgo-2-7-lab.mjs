/**
 * 2.7 — Lab Chương 2: bộ truy vấn API đơn hàng CT Shop (soạn 24/11/2026, agent mgo).
 * Lời giải chạy thật: ../_ma.mjs OUT['s02-7-lab'] (MongoDB 8.0.38, kịch bản demo/s02/s02-7-lab.txt, bản sao lab2) — che trong <details>.
 * Mã lời giải = ../_demo/lab2-giai.js (chép nguyên vào GIAI_MA dưới đây khi soạn; sửa tệp thì chép lại).
 * Gắn với dự án xuyên khoá: mốc 2 (mgo-moc-2) yêu cầu bộ truy vấn CRUD của đề tài — lab này là bản tập dượt.
 */
import { lenh, ma, loiGiai, kv } from '../_chung.mjs';

const GIAI_MA = `// LỜI GIẢI Lab Chương 2 (khoá MongoDB — cuongthai.com/courses/mongodb). Làm bài của bạn TRƯỚC rồi mới mở tệp này.
// Dùng trong mongosh:  use lab2  rồi  load('/demo/lab2-giai.js')
// Chưa dùng transaction (Chương 6): đặt hàng giữ chỗ từng món bằng cập nhật có điều kiện, món nào hụt thì HOÀN lại các món đã giữ.

// (1) Đơn của một khách, mới nhất trước, phân trang keyset theo (createdAt, _id). conTro = null cho trang đầu.
function donCuaKhach(khach, { trangThai, conTro = null, co = 5 } = {}) {
  const loc = { customerId: khach };
  if (trangThai) loc.status = trangThai;
  if (conTro) loc.$or = [{ createdAt: { $lt: conTro.createdAt } }, { createdAt: conTro.createdAt, _id: { $lt: conTro._id } }];
  const ds = db.orders.find(loc, { status: 1, total: 1, createdAt: 1, soMon: { $size: '$items' } })
    .sort({ createdAt: -1, _id: -1 }).limit(co + 1).toArray();   // lấy dư 1 để biết còn trang sau không
  const conNua = ds.length > co;
  if (conNua) ds.pop();
  const cuoi = ds[ds.length - 1];
  return { ds, conTroTiep: conNua ? { createdAt: cuoi.createdAt, _id: cuoi._id } : null };
}

// (2) Danh mục theo loại + khoảng giá, sắp theo tên kiểu tiếng Việt.
function timSanPham(loai, giaTu, giaDen) {
  return db.products.find({ category: loai, price: { $gte: Decimal128(String(giaTu)), $lte: Decimal128(String(giaDen)) } },
    { name: 1, price: 1, stock: 1 }).sort({ name: 1 }).collation({ locale: 'vi' }).toArray();
}

// (3) Đặt hàng: [{ productId, qty }]. Giữ chỗ từng món (nguyên tử trên từng tài liệu), hụt ⇒ hoàn lại, không tạo đơn.
function datHang(khach, mon) {
  const daGiu = [];
  for (const m of mon) {
    const sp = db.products.findOneAndUpdate({ _id: m.productId, stock: { $gte: m.qty } },
      { $inc: { stock: -m.qty } }, { projection: { name: 1, price: 1 }, returnDocument: 'after' });
    if (!sp) {
      for (const g of daGiu) db.products.updateOne({ _id: g.productId }, { $inc: { stock: g.qty } });
      return { ok: false, lyDo: \`hết hàng: \${m.productId}\`, daHoan: daGiu.map((g) => g.productId) };
    }
    daGiu.push({ productId: sp._id, name: sp.name, price: sp.price, qty: NumberInt(m.qty) });
  }
  const so = db.counters.findOneAndUpdate({ _id: 'orders' }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: 'after' }).seq;
  const tong = daGiu.reduce((s, g) => s + Number(g.price.toString()) * g.qty, 0);
  const kh = db.customers.findOne({ _id: khach }, { city: 1 });
  db.orders.insertOne({ _id: so, customerId: khach, status: 'PENDING', items: daGiu, total: Decimal128(String(tong)),
    shipTo: { city: kh ? kh.city : null }, createdAt: new Date() });
  return { ok: true, donSo: so, tong };
}

// (4) Huỷ đơn: CHỈ khi đang PENDING (cập nhật có điều kiện), rồi trả hàng về kho bằng một bulkWrite.
function huyDon(so) {
  const don = db.orders.findOneAndUpdate({ _id: so, status: 'PENDING' }, { $set: { status: 'CANCELLED', cancelledAt: new Date() } });
  if (!don) return { ok: false, lyDo: 'không có đơn PENDING số ' + so };
  const r = db.products.bulkWrite(don.items.map((m) => ({ updateOne: { filter: { _id: m.productId }, update: { $inc: { stock: m.qty } } } })), { ordered: false });
  return { ok: true, traKho: r.modifiedCount };
}`;

const GIAI_EN = `
<p><strong>The whole solution file</strong> (<code>_demo/lab2-giai.js</code>, loaded in mongosh with <code>load()</code>):</p>
${ma('javascript', GIAI_MA)}
<p><strong>1. First page of KH0066's orders</strong> — newest first, no items, with an item count, plus the cursor for the next page:</p>
${lenh('s02-7-lab', 0)}
<p><strong>Walking every page</strong> with the cursor: 4 pages of 5, 20 orders, 0 duplicates — and no empty fifth page, because the function fetches <code>co + 1</code> documents to know whether another page exists:</p>
${lenh('s02-7-lab', 1)}
<p><strong>2. Catalogue search</strong> — accessories between 500,000 and 2,000,000 VND, Vietnamese order (Đế tản nhiệt after Chuột, not after Webcam):</p>
${lenh('s02-7-lab', 2)}
<p><strong>3. Placing orders.</strong> Stock before; an order that asks for 3 backpacks when only 2 exist — refused, and the mouse reserved a moment earlier is given back:</p>
${lenh('s02-7-lab', 3)}
${lenh('s02-7-lab', 4)}
${lenh('s02-7-lab', 5)}
<p>Stock unchanged. A valid order then gets number 2001 from the counter and reduces both stocks:</p>
${lenh('s02-7-lab', 6)}
${lenh('s02-7-lab', 7)}
${lenh('s02-7-lab', 8)}
<p><strong>4. Cancelling.</strong> The first cancel succeeds and returns 2 lines to stock; the second is refused (no longer PENDING) — so stock cannot be returned twice; order 2 was PAID, so it cannot be cancelled here:</p>
${lenh('s02-7-lab', 9)}
${lenh('s02-7-lab', 10)}
<p><strong>5. Concurrency proof.</strong> Stock of SP027 set to 3; four processes (file <code>_demo/lab2-tranh.js</code>) each try to buy one unit twice — 8 attempts for 3 units:</p>
${lenh('s02-7-lab', 11)}
${lenh('s02-7-lab', 12)}
${lenh('s02-7-lab', 13)}
<p>Exactly 3 orders, 5 refusals, stock 0 — the order of the lines changes from run to run, the totals never do. Order numbers are unique too (the counter). Replace the conditional update in <code>datHang</code> with <code>findOne</code> + <code>if</code> and run this again to see it oversell.</p>
<p><strong>What this solution does not protect against</strong> (write it in your README): if the process crashes between reserving stock and inserting the order, the stock stays reserved with no order — the compensation never runs. Two orders racing for the last unit are safe (the conditional update decides), but the whole "reserve all + insert order" is not atomic. Chapter 6 rewrites <code>datHang</code> with a transaction; until then, a periodic job that finds "reserved but no order" is the usual safety net.</p>
`;

const GIAI_VI = `
<p><strong>Toàn bộ tệp lời giải</strong> (<code>_demo/lab2-giai.js</code>, nạp trong mongosh bằng <code>load()</code>):</p>
${ma('javascript', GIAI_MA)}
<p><strong>1. Trang đầu đơn của KH0066</strong> — mới nhất trước, không kèm món, có số món, cộng con trỏ cho trang sau:</p>
${lenh('s02-7-lab', 0)}
<p><strong>Duyệt hết các trang</strong> bằng con trỏ: 4 trang mỗi trang 5 đơn, 20 đơn, 0 trùng — và không có trang thứ năm rỗng, vì hàm lấy <code>co + 1</code> tài liệu để biết còn trang sau hay không:</p>
${lenh('s02-7-lab', 1)}
<p><strong>2. Tìm trong danh mục</strong> — phụ kiện từ 500.000 tới 2.000.000 đồng, thứ tự tiếng Việt (Đế tản nhiệt đứng sau Chuột, không phải sau Webcam):</p>
${lenh('s02-7-lab', 2)}
<p><strong>3. Đặt hàng.</strong> Tồn kho trước; một đơn đòi 3 balo trong khi chỉ còn 2 — bị từ chối, và con chuột vừa giữ chỗ được trả lại:</p>
${lenh('s02-7-lab', 3)}
${lenh('s02-7-lab', 4)}
${lenh('s02-7-lab', 5)}
<p>Tồn kho không đổi. Một đơn hợp lệ sau đó nhận số 2001 từ bộ đếm và trừ tồn cả hai món:</p>
${lenh('s02-7-lab', 6)}
${lenh('s02-7-lab', 7)}
${lenh('s02-7-lab', 8)}
<p><strong>4. Huỷ đơn.</strong> Lần huỷ đầu thành công và trả 2 dòng về kho; lần thứ hai bị từ chối (không còn PENDING) — nên hàng không thể bị trả về hai lần; đơn 2 đang PAID nên không huỷ được ở đây:</p>
${lenh('s02-7-lab', 9)}
${lenh('s02-7-lab', 10)}
<p><strong>5. Chứng minh khi tranh chấp.</strong> Tồn SP027 đặt về 3; bốn tiến trình (tệp <code>_demo/lab2-tranh.js</code>) mỗi tiến trình thử mua một chiếc hai lần — 8 lượt cho 3 chiếc:</p>
${lenh('s02-7-lab', 11)}
${lenh('s02-7-lab', 12)}
${lenh('s02-7-lab', 13)}
<p>Đúng 3 đơn, 5 lượt từ chối, tồn 0 — thứ tự các dòng đổi theo mỗi lần chạy, còn tổng thì không bao giờ đổi. Số đơn cũng không trùng (nhờ bộ đếm). Thử thay cập nhật có điều kiện trong <code>datHang</code> bằng <code>findOne</code> + <code>if</code> rồi chạy lại để thấy nó bán quá số hàng.</p>
<p><strong>Những gì lời giải này không bảo vệ được</strong> (hãy ghi vào README): nếu tiến trình sập giữa lúc giữ hàng và lúc chèn đơn, hàng vẫn bị giữ mà không có đơn — bước hoàn lại không bao giờ chạy. Hai đơn tranh nhau chiếc cuối cùng thì an toàn (cập nhật có điều kiện quyết định), nhưng cả cụm "giữ hết + chèn đơn" không nguyên tử. Chương 6 viết lại <code>datHang</code> bằng transaction; trước đó, một job định kỳ tìm "đã giữ hàng mà không có đơn" là tấm lưới an toàn thường dùng.</p>
`;

export default {
  title: '2.7 — Lab: the CT Shop order API queries|||2.7 — Lab: bộ truy vấn API đơn hàng CT Shop',
  slug: 'mgo-2-7-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab 90–120 phút: viết bốn hàm phía sau API đơn hàng CT Shop — danh sách đơn của khách phân trang keyset (createdAt, _id), tìm danh mục theo loại và khoảng giá sắp tiếng Việt, đặt hàng giữ chỗ từng món bằng cập nhật có điều kiện và hoàn lại khi thiếu hàng, huỷ đơn chỉ khi PENDING và trả kho bằng bulkWrite — có rubric 10 điểm, bài kiểm tranh chấp, lời giải chạy thật được che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab</span>
<h2>Lab: the CT Shop order API queries</h2>
<p class="lead">You will write the four database functions behind CT Shop's order API — the exact queries an Express or Spring controller would call. Everything needed was taught in Lessons 2.1–2.6: projection, arrays, conditional updates, <code>findOneAndUpdate</code>, <code>bulkWrite</code>, collation and keyset pagination. Work on a copy so you can reset at will.</p>

<h3>Setup</h3>
<p>With the lab container running (Lesson 0.2), copy CT Shop into a database <code>lab2</code> and create the order counter:</p>
${ma('javascript', `use lab2
for (const c of ['customers', 'products', 'orders'])
  db.getSiblingDB('ctshop').getCollection(c).aggregate([{ $out: { db: 'lab2', coll: c } }])
db.counters.insertOne({ _id: 'orders', seq: 2000 })`)}
<p>Write your functions in a file (for example <code>lab2.js</code> in the course's <code>_demo</code> folder, which the container sees as <code>/demo</code>) and load it with <code>load('/demo/lab2.js')</code> after each change.</p>

<h3>Tasks</h3>
<ol>
<li><strong><code>donCuaKhach(khach, { trangThai, conTro, co })</code></strong> — orders of one customer, optionally filtered by status, <strong>newest first</strong>, page size <code>co</code>. Return <code>{ ds, conTroTiep }</code>: the page (without <code>items</code>, but with a computed <code>soMon</code> = number of items) and a cursor for the next page, or <code>null</code> on the last page. Keyset pagination on <code>(createdAt, _id)</code> — no <code>skip</code>. Prove: walking all pages of KH0066 (20 orders) with size 5 returns 20 distinct orders and no empty page.</li>
<li><strong><code>timSanPham(loai, giaTu, giaDen)</code></strong> — products of a category in a price range (inclusive), with <code>name</code>, <code>price</code>, <code>stock</code>, sorted by name in <strong>Vietnamese</strong> order. Prices are Decimal128 — compare correctly.</li>
<li><strong><code>datHang(khach, mon)</code></strong> — <code>mon</code> is <code>[{ productId, qty }]</code>. For each line, reserve stock with a <strong>conditional atomic update</strong>; if any line cannot be reserved, give back the lines already reserved and return <code>{ ok: false, lyDo }</code> without creating an order. Otherwise take the next number from <code>counters</code>, insert the order (status PENDING, items with the name and price <em>at purchase time</em>, total as Decimal128, <code>createdAt</code>) and return <code>{ ok: true, donSo }</code>.</li>
<li><strong><code>huyDon(so)</code></strong> — cancel an order <strong>only if it is PENDING</strong> (atomically: two cancels of the same order must not both succeed), then return all its items to stock with <strong>one</strong> <code>bulkWrite</code>.</li>
<li><strong>Concurrency proof</strong> — set one product's stock to 3, start 4 mongosh processes at the same time (as in Lesson 2.5) that each call <code>datHang</code> for 1 unit of it twice. Show the result: exactly 3 orders contain it, stock 0.</li>
<li><strong>README</strong> (10–15 lines): the indexes these four functions will need (guess now, verify in Chapter 4), and one failure your <code>datHang</code> does not handle.</li>
</ol>

<h3>Rubric (10 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Pagination: keyset on (createdAt, _id), newest first, no <code>skip</code>; all pages = 20 distinct, no empty last page; projection without items + <code>soMon</code></td><td>2</td></tr>
<tr><td>Catalogue: Decimal128 range inclusive, Vietnamese collation for the sort</td><td>1</td></tr>
<tr><td><code>datHang</code>: conditional update per line (no read-then-check), compensation on failure, number from <code>findOneAndUpdate</code> with <code>returnDocument: 'after'</code>, items copy name/price</td><td>3</td></tr>
<tr><td><code>huyDon</code>: status condition in the filter; one <code>bulkWrite</code>; second cancel refused</td><td>2</td></tr>
<tr><td>Concurrency proof with 4 parallel processes, result shown; README names indexes and an unhandled failure</td><td>2</td></tr>
</tbody></table>
<p><strong>Common deductions:</strong> <code>findOne</code> of the product followed by <code>if (stock &gt;= qty)</code> (−3, it oversells — your concurrency proof should show it); <code>skip((page − 1) * size)</code>; sorting by <code>createdAt</code> without <code>_id</code>; <code>price: { $gte: 500000 }</code> written as a string from a form; cancelling with <code>findOne</code> + <code>updateOne</code> (two cancels both return stock).</p>

<h3>Solution</h3>
${loiGiai('Open only after your version runs — full solution, run on MongoDB 8.0', GIAI_EN)}

<h3>Connect it to your project</h3>
<p>Milestone 2 of the course project (<code>mgo-moc-2</code>) asks for the same skills on your own topic: a queries file with at least 8 named operations, at least one conditional atomic update that must not race (stock, seats, appointment slots, coupon uses…), one array update with <code>$push</code>/<code>$pull</code> or <code>arrayFilters</code>, and a list query with keyset pagination. Reuse your concurrency proof script — the defence committee will ask "what if two users click at the same time?".</p>

<h3>🗂 Key terms</h3>
${kv([
  ['Compensation', 'Undoing earlier steps by hand when a later step fails (give back reserved stock) — the non-transactional way.'],
  ['Cursor (pagination)', 'The sort key of the last item returned, sent back by the client to get the next page.'],
  ['State-guarded update', 'An update whose filter includes the allowed current state (<code>status: \'PENDING\'</code>), making transitions atomic.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab</span>
<h2>Lab: bộ truy vấn API đơn hàng CT Shop</h2>
<p class="lead">Bạn sẽ viết bốn hàm cơ sở dữ liệu đứng sau API đơn hàng của CT Shop — đúng những truy vấn mà một controller Express hay Spring sẽ gọi. Mọi thứ cần thiết đã được dạy ở Bài 2.1–2.6: projection, mảng, cập nhật có điều kiện, <code>findOneAndUpdate</code>, <code>bulkWrite</code>, collation và phân trang keyset. Hãy làm trên bản sao để lúc nào cũng đặt lại được.</p>

<h3>Chuẩn bị</h3>
<p>Khi container lab đang chạy (Bài 0.2), chép CT Shop sang database <code>lab2</code> và tạo bộ đếm đơn:</p>
${ma('javascript', `use lab2
for (const c of ['customers', 'products', 'orders'])
  db.getSiblingDB('ctshop').getCollection(c).aggregate([{ $out: { db: 'lab2', coll: c } }])
db.counters.insertOne({ _id: 'orders', seq: 2000 })`)}
<p>Viết các hàm vào một tệp (ví dụ <code>lab2.js</code> trong thư mục <code>_demo</code> của khoá, container thấy nó ở <code>/demo</code>) và nạp bằng <code>load('/demo/lab2.js')</code> sau mỗi lần sửa.</p>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong><code>donCuaKhach(khach, { trangThai, conTro, co })</code></strong> — đơn của một khách, có thể lọc theo trạng thái, <strong>mới nhất trước</strong>, cỡ trang <code>co</code>. Trả về <code>{ ds, conTroTiep }</code>: trang kết quả (không kèm <code>items</code>, nhưng có trường tính <code>soMon</code> = số món) và con trỏ cho trang sau, hoặc <code>null</code> ở trang cuối. Phân trang keyset trên <code>(createdAt, _id)</code> — không dùng <code>skip</code>. Chứng minh: duyệt hết các trang của KH0066 (20 đơn) với cỡ 5 trả về 20 đơn khác nhau và không có trang rỗng.</li>
<li><strong><code>timSanPham(loai, giaTu, giaDen)</code></strong> — sản phẩm của một loại trong khoảng giá (tính cả hai đầu), gồm <code>name</code>, <code>price</code>, <code>stock</code>, sắp theo tên theo thứ tự <strong>tiếng Việt</strong>. Giá là Decimal128 — hãy so sánh cho đúng.</li>
<li><strong><code>datHang(khach, mon)</code></strong> — <code>mon</code> là <code>[{ productId, qty }]</code>. Với mỗi dòng, giữ hàng bằng một <strong>cập nhật nguyên tử có điều kiện</strong>; nếu có dòng không giữ được, trả lại các dòng đã giữ và trả về <code>{ ok: false, lyDo }</code> mà không tạo đơn. Nếu đủ, lấy số tiếp theo từ <code>counters</code>, chèn đơn (trạng thái PENDING, các món kèm tên và giá <em>tại thời điểm mua</em>, tổng tiền kiểu Decimal128, <code>createdAt</code>) và trả về <code>{ ok: true, donSo }</code>.</li>
<li><strong><code>huyDon(so)</code></strong> — huỷ đơn <strong>chỉ khi đang PENDING</strong> (nguyên tử: hai lần huỷ cùng một đơn không được cùng thành công), rồi trả mọi món về kho bằng <strong>một</strong> lệnh <code>bulkWrite</code>.</li>
<li><strong>Chứng minh khi tranh chấp</strong> — đặt tồn của một sản phẩm là 3, khởi động 4 tiến trình mongosh cùng lúc (như Bài 2.5), mỗi tiến trình gọi <code>datHang</code> mua 1 chiếc sản phẩm đó hai lần. Cho thấy kết quả: đúng 3 đơn chứa nó, tồn bằng 0.</li>
<li><strong>README</strong> (10–15 dòng): các chỉ mục mà bốn hàm này sẽ cần (đoán bây giờ, kiểm ở Chương 4), và một tình huống lỗi mà <code>datHang</code> của bạn chưa xử lý.</li>
</ol>

<h3>Rubric (10 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Phân trang: keyset trên (createdAt, _id), mới nhất trước, không <code>skip</code>; mọi trang = 20 đơn khác nhau, không có trang cuối rỗng; projection bỏ items + có <code>soMon</code></td><td>2</td></tr>
<tr><td>Danh mục: khoảng Decimal128 tính cả hai đầu, collation tiếng Việt khi sắp</td><td>1</td></tr>
<tr><td><code>datHang</code>: cập nhật có điều kiện cho từng dòng (không đọc-rồi-kiểm), hoàn lại khi lỗi, số đơn từ <code>findOneAndUpdate</code> với <code>returnDocument: 'after'</code>, món hàng chép tên/giá</td><td>3</td></tr>
<tr><td><code>huyDon</code>: điều kiện trạng thái nằm trong bộ lọc; một <code>bulkWrite</code>; lần huỷ thứ hai bị từ chối</td><td>2</td></tr>
<tr><td>Chứng minh tranh chấp với 4 tiến trình song song, có kết quả; README nêu chỉ mục và một lỗi chưa xử lý</td><td>2</td></tr>
</tbody></table>
<p><strong>Lỗi hay bị trừ điểm:</strong> <code>findOne</code> sản phẩm rồi <code>if (stock &gt;= qty)</code> (−3, nó bán quá số hàng — bài chứng minh tranh chấp của bạn sẽ cho thấy điều đó); <code>skip((trang − 1) * co)</code>; sắp theo <code>createdAt</code> mà không có <code>_id</code>; <code>price: { $gte: 500000 }</code> viết thành chuỗi lấy từ biểu mẫu; huỷ bằng <code>findOne</code> + <code>updateOne</code> (hai lần huỷ đều trả hàng về kho).</p>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi bản của bạn đã chạy — lời giải đầy đủ, chạy trên MongoDB 8.0', GIAI_VI)}

<h3>Nối vào dự án của bạn</h3>
<p>Mốc 2 của dự án khoá học (<code>mgo-moc-2</code>) đòi đúng những kỹ năng này trên đề tài của bạn: một tệp truy vấn có ít nhất 8 thao tác đặt tên, ít nhất một cập nhật nguyên tử có điều kiện không được đua nhau (tồn kho, ghế, khung giờ hẹn, lượt dùng mã giảm giá…), một cập nhật mảng bằng <code>$push</code>/<code>$pull</code> hoặc <code>arrayFilters</code>, và một truy vấn danh sách phân trang keyset. Hãy dùng lại script chứng minh tranh chấp — hội đồng bảo vệ sẽ hỏi "nếu hai người cùng bấm một lúc thì sao?".</p>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Hoàn lại (compensation)', 'Tự tay đảo ngược các bước trước khi một bước sau lỗi (trả hàng đã giữ) — cách làm không có transaction.'],
  ['Con trỏ (phân trang)', 'Khoá sắp xếp của mục cuối cùng đã trả, client gửi lại để lấy trang sau.'],
  ['Cập nhật có chốt trạng thái', 'Lệnh cập nhật có bộ lọc chứa trạng thái hiện tại được phép (<code>status: \'PENDING\'</code>), khiến việc chuyển trạng thái là nguyên tử.'],
])}
</div>
`,
};
