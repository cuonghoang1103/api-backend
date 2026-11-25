/**
 * 4.7 — Lab Chương 4: làm nhanh năm truy vấn chậm của CT Shop (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s04-7-lab'] (MongoDB 8.0.38, ch4.don 1.000.000 đơn; kịch bản demo/s04/s04-7-lab.txt) — lời giải che trong <details>.
 * Công cụ đo phát cho người học = ../_demo/lab4-do.js (chép nguyên vào DO_MA); lời giải = ../_demo/lab4-giai.js (chép nguyên vào GIAI_MA).
 * Sửa tệp nào thì chép lại. Số đối chiếu (tất định): trước — 5 truy vấn đều COLLSCAN 1.000.000 tài liệu; sau — Q1 10/10/10, Q2 50/50/50,
 * Q3 49 khoá/20 tài liệu SORT_MERGE, Q4 1044/1044/1044, Q5 PROJECTION_COVERED 19 khoá 0 tài liệu; 4 index, mỗi index ≥ 1 lượt dùng.
 * Gắn với dự án xuyên khoá: mốc 4 (mgo-moc-4) — lab này là bản tập dượt.
 */
import { lenh, ma, loiGiai, kv } from '../_chung.mjs';

const DO_MA = `// Lab 4.7 — năm truy vấn chậm của CT Shop trên ch4.don (1.000.000 đơn, nạp bằng don-trieu.js).
// Dùng: docker exec mgo-lab mongosh --quiet ch4 --eval "load('/demo/lab4-do.js'); doHet()"
// doHet() chạy explain('executionStats') cho cả năm truy vấn và in: index được chọn, có SORT trong bộ nhớ không, keys/docs/nReturned, ms.
const TRUY_VAN = {
  Q1_lichSuKhach: () => db.don.find({ khach: 'KH01234' }).sort({ ngay: -1 }).limit(10),
  Q2_hangChoGiao: () => db.don.find({ trangThai: 'PAID', tinh: 'Hà Nội' }).sort({ ngay: 1 }).limit(50),
  Q3_donLonGanDay: () => db.don.find({ trangThai: { $in: ['PAID', 'SHIPPED'] }, tong: { $gte: 15000000 }, ngay: { $gte: ISODate('2026-10-01') } }).sort({ tong: -1 }).limit(20),
  Q4_donCoSanPham: () => db.don.find({ 'items.sp': 'SP042', ngay: { $gte: ISODate('2026-06-01') } }, { _id: 1, ngay: 1 }),
  Q5_tomTatKhach: () => db.don.find({ khach: 'KH04321' }, { _id: 0, ngay: 1, tong: 1, trangThai: 1 }).sort({ ngay: -1 }),
};
function do1(ten) {
  const x = TRUY_VAN[ten]().explain('executionStats');
  const st = []; let p = x.queryPlanner.winningPlan, ix;
  const di = (p) => { if (!p) return; st.push(p.stage); ix = ix || p.indexName; di(p.inputStage); (p.inputStages || []).forEach(di); };
  di(p);
  const e = x.executionStats;
  return { ten, index: ix || '—', keHoach: [...new Set(st)].join('←'), n: e.nReturned, keys: e.totalKeysExamined, docs: e.totalDocsExamined, ms: e.executionTimeMillis };
}
function doHet() { return Object.keys(TRUY_VAN).map(do1); }`;

const GIAI_MA = `// LỜI GIẢI Lab 4.7 (khoá MongoDB — cuongthai.com/courses/mongodb). Tự thiết kế index của bạn TRƯỚC rồi mới mở tệp này.
// Dùng: docker exec mgo-lab mongosh --quiet ch4 --eval "load('/demo/lab4-giai.js'); taoIndexLab4()"
// Chạy hai lần vẫn an toàn: createIndex với đúng key + tuỳ chọn đã có thì chỉ trả lại tên, không dựng lại.
function taoIndexLab4() {
  return [
    // Q1 (E khach, S ngay) + Q5 (E khach, S ngay, trả ngay/tong/trangThai, bỏ _id ⇒ được phủ) — MỘT index cho cả hai.
    db.don.createIndex({ khach: 1, ngay: -1, tong: 1, trangThai: 1 }),
    // Q2: E trangThai, E tinh, S ngay (tăng dần — đơn chờ lâu nhất trước).
    db.don.createIndex({ trangThai: 1, tinh: 1, ngay: 1 }),
    // Q3: E trangThai ($in ⇒ SORT_MERGE), S tong (giảm dần), R ngay.
    db.don.createIndex({ trangThai: 1, tong: -1, ngay: 1 }),
    // Q4: multikey trên items.sp (E) + R ngay.
    db.don.createIndex({ 'items.sp': 1, ngay: 1 }),
  ];
}`;

const GIAI_EN = `
<p><strong>The design, one line per query</strong> (classify every field, then write the index — the "why" is what the reviewer asks for):</p>
<table>
<thead><tr><th>Query</th><th>E / S / R</th><th>Index</th><th>Why this order</th></tr></thead>
<tbody>
<tr><td>Q1 customer history, newest 10</td><td>E khach · S ngay</td><td rowspan="2"><code>{ khach: 1, ngay: -1, tong: 1, trangThai: 1 }</code></td><td rowspan="2">Q1 uses the prefix (khach, ngay); Q5 needs ngay, tong, trangThai from the index to be covered — one index serves both, so no extra write cost</td></tr>
<tr><td>Q5 customer summary (no _id)</td><td>E khach · S ngay · returned tong, trangThai</td></tr>
<tr><td>Q2 PAID in Hà Nội, oldest first</td><td>E trangThai · E tinh · S ngay</td><td><code>{ trangThai: 1, tinh: 1, ngay: 1 }</code></td><td>two equalities then the sort; <code>limit(50)</code> stops after 50 keys</td></tr>
<tr><td>Q3 PAID/SHIPPED ≥ 15 M since October, by total</td><td>E trangThai ($in) · S tong · R ngay</td><td><code>{ trangThai: 1, tong: -1, ngay: 1 }</code></td><td>$in before the sort field ⇒ SORT_MERGE; ngay is the range, last</td></tr>
<tr><td>Q4 orders containing SP042 since June</td><td>E items.sp · R ngay</td><td><code>{ 'items.sp': 1, ngay: 1 }</code></td><td>multikey (one array field only); cannot be covered, FETCH is expected</td></tr>
</tbody></table>
<p><strong>The whole solution file</strong> (<code>_demo/lab4-giai.js</code>):</p>
${ma('javascript', GIAI_MA)}
<p><strong>Before</strong> — all five queries are COLLSCANs over 1,000,000 documents, four of them with an in-memory SORT:</p>
${lenh('s04-7-lab', 0)}
<p><strong>Build twice</strong> — the second run returns the same names and builds nothing: <code>createIndex</code> with an identical key and options is a no-op, so the script is safe in a deployment pipeline. Asking for the same key with <em>different</em> options (here <code>unique</code>) is an error, not a silent change — changing an index means drop + create in a migration:</p>
${lenh('s04-7-lab', 1)}
${lenh('s04-7-lab', 2)}
${lenh('s04-7-lab', 3)}
<p><strong>After</strong> — every query is an IXSCAN with keys ≈ docs ≈ nReturned and no SORT stage; Q3 reads 49 keys for 20 results through SORT_MERGE; Q5 is covered (0 documents):</p>
${lenh('s04-7-lab', 4)}
<p><strong>Cost and usage</strong> — 91.9 MB of new indexes next to 164.4 MB of data (write it in the README), and after running the five queries each index has at least one use, so none is unused:</p>
${lenh('s04-7-lab', 5)}
${lenh('s04-7-lab', 6)}
<p><strong>What this design does not handle</strong> (README): Q3 with a long <code>$in</code> list would merge many branches — measure if statuses multiply; Q4 reads every matching order (1,044) — if the screen only needs a count per month, an aggregation over the same index or a pre-computed counter (Lesson 3.3) is cheaper; and the 5-index write cost was not measured on this collection yet (advanced task).</p>
`;

const GIAI_VI = `
<p><strong>Thiết kế, mỗi truy vấn một dòng</strong> (xếp từng trường vào loại, rồi mới viết index — phần "vì sao" là thứ người review sẽ hỏi):</p>
<table>
<thead><tr><th>Truy vấn</th><th>E / S / R</th><th>Index</th><th>Vì sao thứ tự này</th></tr></thead>
<tbody>
<tr><td>Q1 lịch sử khách, 10 đơn mới nhất</td><td>E khach · S ngay</td><td rowspan="2"><code>{ khach: 1, ngay: -1, tong: 1, trangThai: 1 }</code></td><td rowspan="2">Q1 dùng tiền tố (khach, ngay); Q5 cần ngay, tong, trangThai có trong index để được phủ — một index phục vụ cả hai, không tốn thêm chi phí ghi</td></tr>
<tr><td>Q5 tóm tắt khách (không _id)</td><td>E khach · S ngay · trả tong, trangThai</td></tr>
<tr><td>Q2 PAID ở Hà Nội, cũ nhất trước</td><td>E trangThai · E tinh · S ngay</td><td><code>{ trangThai: 1, tinh: 1, ngay: 1 }</code></td><td>hai điều kiện bằng rồi tới sắp xếp; <code>limit(50)</code> dừng sau 50 khoá</td></tr>
<tr><td>Q3 PAID/SHIPPED ≥ 15 triệu từ tháng 10, theo tổng</td><td>E trangThai ($in) · S tong · R ngay</td><td><code>{ trangThai: 1, tong: -1, ngay: 1 }</code></td><td>$in đứng trước trường sắp xếp ⇒ SORT_MERGE; ngay là khoảng, đứng cuối</td></tr>
<tr><td>Q4 đơn có SP042 từ tháng 6</td><td>E items.sp · R ngay</td><td><code>{ 'items.sp': 1, ngay: 1 }</code></td><td>multikey (chỉ một trường mảng); không phủ được, có FETCH là bình thường</td></tr>
</tbody></table>
<p><strong>Toàn bộ tệp lời giải</strong> (<code>_demo/lab4-giai.js</code>):</p>
${ma('javascript', GIAI_MA)}
<p><strong>Trước</strong> — cả năm truy vấn đều là COLLSCAN qua 1.000.000 tài liệu, bốn cái còn có SORT trong bộ nhớ:</p>
${lenh('s04-7-lab', 0)}
<p><strong>Dựng hai lần</strong> — lần thứ hai trả lại đúng các tên đó và không dựng gì: <code>createIndex</code> với key và tuỳ chọn y hệt là không làm gì cả, nên kịch bản an toàn trong quy trình triển khai. Xin cùng key mà <em>khác</em> tuỳ chọn (ở đây <code>unique</code>) là lỗi, không phải thay đổi âm thầm — muốn đổi index thì xoá + tạo trong một migration:</p>
${lenh('s04-7-lab', 1)}
${lenh('s04-7-lab', 2)}
${lenh('s04-7-lab', 3)}
<p><strong>Sau</strong> — truy vấn nào cũng là IXSCAN với số khoá ≈ số tài liệu ≈ nReturned và không có tầng SORT; Q3 đọc 49 khoá cho 20 kết quả qua SORT_MERGE; Q5 được phủ (0 tài liệu):</p>
${lenh('s04-7-lab', 4)}
<p><strong>Cái giá và mức dùng</strong> — 91,9 MB index mới bên cạnh 164,4 MB dữ liệu (ghi vào README), và sau khi chạy năm truy vấn, index nào cũng có ít nhất một lượt dùng, không có index thừa:</p>
${lenh('s04-7-lab', 5)}
${lenh('s04-7-lab', 6)}
<p><strong>Thiết kế này chưa lo được gì</strong> (README): Q3 với danh sách <code>$in</code> dài sẽ phải trộn nhiều nhánh — hãy đo nếu số trạng thái tăng; Q4 đọc mọi đơn khớp (1.044) — nếu màn hình chỉ cần số đếm theo tháng, một aggregation trên cùng index hoặc bộ đếm tính sẵn (Bài 3.3) sẽ rẻ hơn; và chi phí ghi của 5 index chưa được đo trên collection này (việc nâng cao).</p>
`;

export default {
  title: '4.7 — Lab: make five slow CT Shop queries fast|||4.7 — Lab: làm nhanh năm truy vấn chậm của CT Shop',
  slug: 'mgo-4-7-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab 90 phút trên một triệu đơn: năm truy vấn thật của CT Shop (lịch sử khách, hàng chờ giao, đơn lớn gần đây với $in, đơn có một sản phẩm, tóm tắt khách) đều đang COLLSCAN. Đo trước bằng công cụ lab4-do.js, xếp trường vào E/S/R, thiết kế ít index nhất có thể (hai truy vấn dùng chung một index, một truy vấn được phủ), kịch bản tạo index chạy hai lần vẫn an toàn, đo sau, chứng minh không có index thừa — rubric 10 điểm, câu hỏi bảo vệ, lời giải chạy thật được che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab</span>
<h2>Lab: make five slow CT Shop queries fast</h2>
<p class="lead">This is the ticket you will get in your first months at work, in its most common form: "these five screens are slow". You have a million orders, five real queries and no index except <code>_id</code>. Your job is the whole cycle of this chapter — measure, classify, design the fewest indexes that fix everything, prove it with numbers, and show what the fix costs.</p>

<h3>Setup</h3>
<p>Lab running (Lesson 0.2) and the million orders loaded (Lesson 4.1): <code>docker exec mgo-lab mongosh --quiet /demo/don-trieu.js</code>. Start from a clean collection: <code>db.getSiblingDB('ch4').don.dropIndexes()</code>. The measuring tool <code>_demo/lab4-do.js</code> defines the five queries and runs <code>explain('executionStats')</code> on each:</p>
${ma('javascript', DO_MA)}
<p>Run it with <code>docker exec mgo-lab mongosh --quiet ch4 --eval "load('/demo/lab4-do.js'); console.table(doHet())"</code>.</p>

<h3>The five queries</h3>
<ol>
<li><strong>Q1 — Customer history:</strong> the 10 newest orders of one customer.</li>
<li><strong>Q2 — Delivery queue:</strong> PAID orders in Hà Nội, oldest first, 50 per page.</li>
<li><strong>Q3 — Large recent orders:</strong> PAID or SHIPPED, total ≥ 15 million, since 1 October 2026, largest first, 20 per page.</li>
<li><strong>Q4 — Orders containing a product</strong> (recall of a faulty product): SP042 since 1 June 2026, only <code>_id</code> and date.</li>
<li><strong>Q5 — Customer summary:</strong> date, total and status of all orders of one customer, newest first, without <code>_id</code>.</li>
</ol>

<h3>Tasks</h3>
<ol>
<li><strong>Measure before</strong>: the table from <code>doHet()</code> — plan, keys, docs, nReturned, ms — saved in <code>DO-TRUOC.md</code>.</li>
<li><strong>Classify</strong>: for each query, write every field as E, S or R (and "returned" for Q5).</li>
<li><strong>Design</strong> the fewest indexes that make all five fast. Each index needs one sentence of "why this order".</li>
<li><strong>Script</strong> <code>tao-index.js</code> that creates them and is safe to run twice. Run it twice and show it.</li>
<li><strong>Measure after</strong> with the same tool. Every query: IXSCAN, keys ≈ docs ≈ nReturned, no SORT; Q5 covered.</li>
<li><strong>Cost and usage</strong>: index sizes vs data size; <code>$indexStats</code> after running the queries for real, showing no index with 0 uses.</li>
</ol>
<p><strong>Advanced:</strong> measure insert time of 100,000 orders with and without your indexes (Lesson 4.1 method); find the case where Q3 would be better as E–R–S (Lesson 4.3) by changing the total threshold.</p>

<h3>Rubric (10 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Before/after tables with the five counters for all five queries, on the million-order dataset</td><td>2</td></tr>
<tr><td>Correct E/S/R classification for every field, including <code>$in</code> as equality and the sort direction of Q2 and Q3</td><td>2</td></tr>
<tr><td>All five queries IXSCAN with keys ≈ docs ≈ nReturned and no SORT stage</td><td>2</td></tr>
<tr><td>Q5 covered (PROJECTION_COVERED, 0 documents) <em>and</em> Q1 + Q5 served by the same index — four indexes in total</td><td>2</td></tr>
<tr><td>Script safe to run twice (shown); sizes and <code>$indexStats</code> after real runs (not explain)</td><td>2</td></tr>
</tbody></table>
<p><strong>Common deductions:</strong> five separate single-field indexes (−3, Lessons 4.2–4.3); range before sort in Q3 (−2); Q5 "covered" with <code>_id</code> still returned (−1); a separate index for Q1 next to the Q5 one (−1, redundant prefix, Lesson 4.5); <code>$indexStats</code> read after explain only, showing 0 everywhere (−1 — explain is not counted).</p>

<h3>Defend your design (questions a reviewer will ask)</h3>
<ul>
<li>"Why is <code>tong</code> before <code>ngay</code> in the Q3 index but after it in the Q1 index?"</li>
<li>"Q4 still has a FETCH. Is that a problem? Could it be covered?"</li>
<li>"Your indexes add about 90 MB. The production server has 8 GB of RAM and 40 GB of orders. What do you check?"</li>
<li>"Next month someone adds <code>tinh</code> to the response of Q5. What happens to it?"</li>
<li>"How do you deploy these indexes to production with 40 GB of orders without slowing the shop down?"</li>
</ul>

<h3>Solution</h3>
${loiGiai('Open only after your indexes are measured — full solution, run on MongoDB 8.0', GIAI_EN)}

<h3>Connect it to your project</h3>
<p>Milestone 4 of the course project (<code>mgo-moc-4</code>) is this lab on your own topic: at least 100,000 generated documents, the five most important queries with explain before and after, one compound index designed with ESR and explained in the README, and an index script safe to run twice. Advanced: one covered query and the insert-speed measurement. Reuse <code>lab4-do.js</code> — replace <code>TRUY_VAN</code> with your queries.</p>

<h3>🗂 Key terms</h3>
${kv([
  ['Before/after measurement', 'The same counters for the same queries on the same data, before and after the change — the only acceptable proof.'],
  ['Idempotent script', 'Safe to run several times: createIndex with an identical spec does nothing the second time.'],
  ['IndexKeySpecsConflict', 'Error when an index with the same name/key but different options already exists.'],
  ['Shared index', 'One compound index serving several queries through its prefixes.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab</span>
<h2>Lab: làm nhanh năm truy vấn chậm của CT Shop</h2>
<p class="lead">Đây là phiếu việc bạn sẽ nhận trong mấy tháng đầu đi làm, ở dạng hay gặp nhất: "năm màn hình này chạy chậm". Bạn có một triệu đơn, năm truy vấn thật và không có index nào ngoài <code>_id</code>. Việc của bạn là trọn vòng của chương này — đo, phân loại, thiết kế ít index nhất mà sửa được hết, chứng minh bằng số, và chỉ ra cách sửa đó tốn những gì.</p>

<h3>Chuẩn bị</h3>
<p>Lab đang chạy (Bài 0.2) và đã nạp một triệu đơn (Bài 4.1): <code>docker exec mgo-lab mongosh --quiet /demo/don-trieu.js</code>. Bắt đầu từ collection sạch: <code>db.getSiblingDB('ch4').don.dropIndexes()</code>. Công cụ đo <code>_demo/lab4-do.js</code> định nghĩa năm truy vấn và chạy <code>explain('executionStats')</code> cho từng cái:</p>
${ma('javascript', DO_MA)}
<p>Chạy bằng <code>docker exec mgo-lab mongosh --quiet ch4 --eval "load('/demo/lab4-do.js'); console.table(doHet())"</code>.</p>

<h3>Năm truy vấn</h3>
<ol>
<li><strong>Q1 — Lịch sử khách:</strong> 10 đơn mới nhất của một khách.</li>
<li><strong>Q2 — Hàng chờ giao:</strong> đơn PAID ở Hà Nội, cũ nhất trước, 50 đơn mỗi trang.</li>
<li><strong>Q3 — Đơn lớn gần đây:</strong> PAID hoặc SHIPPED, tổng ≥ 15 triệu, từ 01/10/2026, lớn nhất trước, 20 đơn mỗi trang.</li>
<li><strong>Q4 — Đơn có một sản phẩm</strong> (thu hồi hàng lỗi): SP042 từ 01/06/2026, chỉ cần <code>_id</code> và ngày.</li>
<li><strong>Q5 — Tóm tắt khách:</strong> ngày, tổng và trạng thái của mọi đơn của một khách, mới nhất trước, không có <code>_id</code>.</li>
</ol>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Đo trước</strong>: bảng từ <code>doHet()</code> — kế hoạch, số khoá, số tài liệu, nReturned, ms — lưu vào <code>DO-TRUOC.md</code>.</li>
<li><strong>Phân loại</strong>: với mỗi truy vấn, xếp từng trường vào E, S hay R (và "trả về" cho Q5).</li>
<li><strong>Thiết kế</strong> ít index nhất làm cả năm truy vấn nhanh. Mỗi index cần một câu "vì sao thứ tự này".</li>
<li><strong>Kịch bản</strong> <code>tao-index.js</code> tạo các index đó và chạy hai lần vẫn an toàn. Chạy hai lần và đưa ra kết quả.</li>
<li><strong>Đo sau</strong> bằng cùng công cụ. Truy vấn nào cũng: IXSCAN, số khoá ≈ số tài liệu ≈ nReturned, không có SORT; Q5 được phủ.</li>
<li><strong>Cái giá và mức dùng</strong>: cỡ index so với cỡ dữ liệu; <code>$indexStats</code> sau khi chạy thật các truy vấn, cho thấy không index nào 0 lượt dùng.</li>
</ol>
<p><strong>Nâng cao:</strong> đo thời gian chèn 100.000 đơn khi có và không có các index của bạn (cách của Bài 4.1); tìm trường hợp Q3 tốt hơn khi là E–R–S (Bài 4.3) bằng cách đổi ngưỡng tổng tiền.</p>

<h3>Rubric (10 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Bảng trước/sau đủ năm bộ đếm cho cả năm truy vấn, trên bộ một triệu đơn</td><td>2</td></tr>
<tr><td>Phân loại E/S/R đúng cho mọi trường, gồm cả <code>$in</code> là điều kiện bằng và chiều sắp xếp của Q2, Q3</td><td>2</td></tr>
<tr><td>Cả năm truy vấn đều IXSCAN với số khoá ≈ số tài liệu ≈ nReturned và không có tầng SORT</td><td>2</td></tr>
<tr><td>Q5 được phủ (PROJECTION_COVERED, 0 tài liệu) <em>và</em> Q1 + Q5 dùng chung một index — tổng cộng bốn index</td><td>2</td></tr>
<tr><td>Kịch bản chạy hai lần vẫn an toàn (có đưa ra); cỡ index và <code>$indexStats</code> sau khi chạy thật (không phải explain)</td><td>2</td></tr>
</tbody></table>
<p><strong>Lỗi hay bị trừ:</strong> năm index một trường riêng lẻ (−3, Bài 4.2–4.3); khoảng đứng trước sắp xếp ở Q3 (−2); Q5 "được phủ" mà vẫn trả <code>_id</code> (−1); một index riêng cho Q1 bên cạnh index của Q5 (−1, tiền tố thừa, Bài 4.5); đọc <code>$indexStats</code> sau khi chỉ chạy explain, ra 0 hết (−1 — explain không được đếm).</p>

<h3>Bảo vệ thiết kế (câu hỏi người review sẽ đặt)</h3>
<ul>
<li>"Vì sao <code>tong</code> đứng trước <code>ngay</code> trong index của Q3 nhưng đứng sau trong index của Q1?"</li>
<li>"Q4 vẫn có FETCH. Có sao không? Có phủ được không?"</li>
<li>"Các index của bạn thêm chừng 90 MB. Máy chủ production có 8 GB RAM và 40 GB đơn hàng. Bạn kiểm gì?"</li>
<li>"Tháng sau có người thêm <code>tinh</code> vào phản hồi của Q5. Chuyện gì xảy ra với nó?"</li>
<li>"Bạn đưa các index này lên production có 40 GB đơn hàng thế nào để cửa hàng không bị chậm?"</li>
</ul>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi đã đo các index của bạn — lời giải đầy đủ, chạy trên MongoDB 8.0', GIAI_VI)}

<h3>Nối vào dự án của bạn</h3>
<p>Mốc 4 của dự án khoá học (<code>mgo-moc-4</code>) chính là lab này trên đề tài của bạn: ít nhất 100.000 tài liệu sinh tự động, năm truy vấn quan trọng nhất có explain trước và sau, một index phức hợp thiết kế theo ESR và giải thích trong README, và kịch bản tạo index chạy hai lần vẫn an toàn. Nâng cao: một truy vấn được phủ và phép đo tốc độ chèn. Hãy dùng lại <code>lab4-do.js</code> — thay <code>TRUY_VAN</code> bằng các truy vấn của bạn.</p>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Đo trước/sau', 'Cùng các bộ đếm, cho cùng các truy vấn, trên cùng dữ liệu, trước và sau thay đổi — bằng chứng duy nhất được chấp nhận.'],
  ['Kịch bản idempotent', 'Chạy nhiều lần vẫn an toàn: createIndex với đặc tả y hệt thì lần thứ hai không làm gì.'],
  ['IndexKeySpecsConflict', 'Lỗi khi đã có index cùng tên/key nhưng khác tuỳ chọn.'],
  ['Index dùng chung', 'Một index phức hợp phục vụ nhiều truy vấn nhờ các tiền tố của nó.'],
])}
</div>
`,
};
