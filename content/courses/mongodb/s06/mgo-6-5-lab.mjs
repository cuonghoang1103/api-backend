/**
 * 6.5 — Lab Chương 6: chuyển tiền và giữ hàng không bao giờ âm (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s06-5-lab'] (MongoDB 8.0.38, mgo-lab; Node 22 + driver mongodb 7.9.1; kịch bản demo/s06/s06-5-lab.txt).
 * Tệp lab (phát cho người học): _demo/node/lab6-thu.mjs (bộ bắn + kiểm bất biến, chép nguyên vào THU_MA), lab6-ngay-tho.mjs (NGAY_MA),
 * lab6-giai.mjs (lời giải, GIAI_MA — che trong <details>). Sửa tệp thì chép lại bằng scratchpad/mgo/tmp/dung-lab6.py.
 * Số tất định: 354 yêu cầu (200 chuyển + 100 đơn + gửi lại trùng, LCG 20261124); ngây thơ 0/5 bất biến (tổng tiền, ví âm, kho âm, ok trùng, DB lệch);
 * lời giải 5/5, callback chạy hàng nghìn lần cho vài trăm yêu cầu (số đổi — ví SHOP là tài liệu nóng).
 */
import { lenh, ma, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's06-5-lab';

const THU_MA = `// Lab 6.5 — BỘ BẮN ĐỒNG THỜI + KIỂM BẤT BIẾN (phát sẵn, KHÔNG sửa). Chạy: node lab6-thu.mjs ./<tệp-cài-đặt>.mjs
// Tệp cài đặt xuất: chuanBi(db) (tuỳ chọn), chuyenTien(ctx, { maGD, tu, den, tien }), datHang(ctx, { maDon, khach, mon: [{ sp, sl }] })
//   ctx = { client, db }. Mỗi hàm trả 'ok' | 'thieu-tien' | 'het-hang' | 'trung' (đã xử lý rồi). Ném lỗi = 'loi'.
// Dữ liệu: 20 ví V00…V19 mỗi ví 1.000.000 đ + ví SHOP 0 đ; 5 sản phẩm K1…K5 mỗi mã tồn 20, giá 100.000 đ.
// Tải: 200 lệnh chuyển + 100 đơn (LCG cố định ⇒ ai chạy cũng cùng bộ lệnh), ~20% bị GỬI LẠI cùng mã (giả lập khách bấm hai lần / client thử lại).
import { MongoClient } from 'mongodb';

const impl = await import(new URL(process.argv[2] ?? './lab6-giai.mjs', import.meta.url));
const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const db = client.db('lab6');
await db.dropDatabase();
const VI = Array.from({ length: 20 }, (_, i) => 'V' + String(i).padStart(2, '0'));
await db.collection('vi').insertMany([...VI.map((_id) => ({ _id, du: 1000000 })), { _id: 'SHOP', du: 0 }]);
await db.collection('kho').insertMany(['K1', 'K2', 'K3', 'K4', 'K5'].map((_id) => ({ _id, ton: 20, gia: 100000 })));
if (impl.chuanBi) await impl.chuanBi(db);

let x = 20261124;
const r = (n) => { x = (x * 1103515245 + 12345) % 2147483648; return (x >>> 8) % n; }; // lấy bit cao: bit thấp của LCG lặp chu kỳ ngắn
const lenh = [];
for (let i = 0; i < 200; i++) {
  const tu = VI[r(20)]; let den = VI[r(20)]; if (den === tu) den = 'V' + String((+tu.slice(1) + 1) % 20).padStart(2, '0');
  const l = { loai: 'chuyen', maGD: 'GD' + i, tu, den, tien: (r(8) + 1) * 50000 };
  lenh.push(l); if (r(5) === 0) lenh.push({ ...l });
}
for (let i = 0; i < 100; i++) {
  const mon = Array.from({ length: r(3) + 1 }, () => ({ sp: 'K' + (r(5) + 1), sl: r(3) + 1 }));
  const l = { loai: 'don', maDon: 'DH' + i, khach: VI[r(20)], mon };
  lenh.push(l); if (r(5) === 0) lenh.push({ ...l, mon: mon.map((m) => ({ ...m })) });
}
for (let i = lenh.length - 1; i > 0; i--) { const j = r(i + 1); [lenh[i], lenh[j]] = [lenh[j], lenh[i]]; }

const ctx = { client, db };
const t0 = Date.now();
const kq = await Promise.all(lenh.map((l) => (l.loai === 'chuyen' ? impl.chuyenTien(ctx, l) : impl.datHang(ctx, l)).catch((e) => 'loi: ' + e.message)));
const dem = {}; for (const k of kq) { const t = k.startsWith('loi') ? 'loi' : k; dem[t] = (dem[t] ?? 0) + 1; }
console.log(\`\${lenh.length} yêu cầu đồng thời trong \${Date.now() - t0} ms:\`, JSON.stringify(dem));
if (impl.thongKe) console.log('  hàm trong transaction đã chạy', impl.thongKe.lanChay, 'lần (gồm các lần withTransaction tự thử lại)');
const loiDau = kq.find((k) => k.startsWith('loi')); if (loiDau) console.log('  lỗi đầu tiên:', loiDau.slice(0, 120));

// ── Kiểm bất biến ──
const vi = await db.collection('vi').find().toArray();
const kho = await db.collection('kho').find().toArray();
const tong = vi.reduce((s, v) => s + v.du, 0);
const mgdOk = new Set(lenh.filter((l, i) => l.loai === 'chuyen' && kq[i] === 'ok').map((l) => l.maGD));
const mdOk = new Set(lenh.filter((l, i) => l.loai === 'don' && kq[i] === 'ok').map((l) => l.maDon));
const soOkChuyen = lenh.filter((l, i) => l.loai === 'chuyen' && kq[i] === 'ok').length;
const soOkDon = lenh.filter((l, i) => l.loai === 'don' && kq[i] === 'ok').length;
// Dựng lại số dư + tồn kho chỉ từ các yêu cầu được báo 'ok' — phải khớp DB.
const duKyVong = Object.fromEntries([...VI.map((v) => [v, 1000000]), ['SHOP', 0]]);
const tonKyVong = { K1: 20, K2: 20, K3: 20, K4: 20, K5: 20 };
const daTinh = new Set();
lenh.forEach((l, i) => {
  if (kq[i] !== 'ok') return;
  const ma = l.maGD ?? l.maDon; if (daTinh.has(ma)) return; daTinh.add(ma);
  if (l.loai === 'chuyen') { duKyVong[l.tu] -= l.tien; duKyVong[l.den] += l.tien; }
  else { const tien = l.mon.reduce((s, m) => s + m.sl * 100000, 0); duKyVong[l.khach] -= tien; duKyVong.SHOP += tien; for (const m of l.mon) tonKyVong[m.sp] -= m.sl; }
});
const kiem = [
  ['tổng tiền giữ nguyên 20.000.000', tong === 20000000, \`tổng = \${tong}\`],
  ['không ví nào âm', vi.every((v) => v.du >= 0), vi.filter((v) => v.du < 0).map((v) => \`\${v._id}=\${v.du}\`).join(' ') || 'ok'],
  ['không mã hàng nào âm', kho.every((k) => k.ton >= 0), kho.map((k) => \`\${k._id}=\${k.ton}\`).join(' ')],
  ['mỗi mã GD/mã đơn được báo ok đúng MỘT lần', soOkChuyen === mgdOk.size && soOkDon === mdOk.size, \`chuyển ok \${soOkChuyen} lần / \${mgdOk.size} mã, đơn ok \${soOkDon} lần / \${mdOk.size} mã\`],
  ['DB khớp đúng các yêu cầu báo ok', vi.every((v) => v.du === duKyVong[v._id]) && kho.every((k) => k.ton === tonKyVong[k._id]),
    \`lệch ví: \${vi.filter((v) => v.du !== duKyVong[v._id]).length}, lệch kho: \${kho.filter((k) => k.ton !== tonKyVong[k._id]).length}\`],
];
for (const [ten, dat, chiTiet] of kiem) console.log(dat ? '✅' : '❌', ten.padEnd(44), chiTiet);
console.log(\`ĐẠT \${kiem.filter((k) => k[1]).length}/\${kiem.length} bất biến\`);
await client.close();`;

const NGAY_MA = `// Lab 6.5 — cài đặt NGÂY THƠ (phát sẵn để thấy nó hỏng): đọc → kiểm → ghi, không transaction, không chống gửi trùng.
export async function chuyenTien({ db }, { maGD, tu, den, tien }) {
  const a = await db.collection('vi').findOne({ _id: tu });
  if (a.du < tien) return 'thieu-tien';
  await db.collection('vi').updateOne({ _id: tu }, { $set: { du: a.du - tien } });
  const b = await db.collection('vi').findOne({ _id: den });
  await db.collection('vi').updateOne({ _id: den }, { $set: { du: b.du + tien } });
  await db.collection('giaoDich').insertOne({ maGD, tu, den, tien });
  return 'ok';
}

export async function datHang({ db }, { maDon, khach, mon }) {
  for (const m of mon) {
    const k = await db.collection('kho').findOne({ _id: m.sp });
    if (k.ton < m.sl) return 'het-hang';
  }
  const tien = mon.reduce((s, m) => s + m.sl * 100000, 0);
  const v = await db.collection('vi').findOne({ _id: khach });
  if (v.du < tien) return 'thieu-tien';
  for (const m of mon) await db.collection('kho').updateOne({ _id: m.sp }, { $inc: { ton: -m.sl } });
  await db.collection('vi').updateOne({ _id: khach }, { $inc: { du: -tien } });
  await db.collection('vi').updateOne({ _id: 'SHOP' }, { $inc: { du: tien } });
  await db.collection('don').insertOne({ maDon, khach, mon, tien });
  return 'ok';
}`;

const GIAI_MA = `// Lab 6.5 — LỜI GIẢI. Ba ý: (1) kiểm và trừ trong CÙNG một lệnh có điều kiện ($gte), (2) mọi lệnh của một yêu cầu trong MỘT transaction,
// (3) chống gửi trùng bằng index duy nhất trên mã GD/mã đơn — chèn bản ghi trong chính transaction đó; trùng (E11000) ⇒ trả 'trung', không làm lại.
export const thongKe = { lanChay: 0 };

export async function chuanBi(db) {
  await db.collection('giaoDich').createIndex({ maGD: 1 }, { unique: true });
  await db.collection('don').createIndex({ maDon: 1 }, { unique: true });
}

class TuChoi extends Error {} // lỗi nghiệp vụ: huỷ transaction, KHÔNG thử lại

async function trongTransaction(client, viec) {
  const session = client.startSession();
  try {
    await session.withTransaction(async () => { thongKe.lanChay++; await viec(session); },
      { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
    return 'ok';
  } catch (e) {
    if (e instanceof TuChoi) return e.message;
    if (e.code === 11000) return 'trung';
    throw e;
  } finally {
    await session.endSession();
  }
}

export function chuyenTien({ client, db }, { maGD, tu, den, tien }) {
  return trongTransaction(client, async (session) => {
    await db.collection('giaoDich').insertOne({ maGD, tu, den, tien, luc: new Date() }, { session }); // trùng ⇒ E11000 ngay đầu
    const r = await db.collection('vi').updateOne({ _id: tu, du: { $gte: tien } }, { $inc: { du: -tien } }, { session });
    if (r.modifiedCount !== 1) throw new TuChoi('thieu-tien');
    await db.collection('vi').updateOne({ _id: den }, { $inc: { du: tien } }, { session });
  });
}

export function datHang({ client, db }, { maDon, khach, mon }) {
  const tien = mon.reduce((s, m) => s + m.sl * 100000, 0);
  return trongTransaction(client, async (session) => {
    await db.collection('don').insertOne({ maDon, khach, mon, tien, luc: new Date() }, { session });
    for (const m of mon) {
      const r = await db.collection('kho').updateOne({ _id: m.sp, ton: { $gte: m.sl } }, { $inc: { ton: -m.sl } }, { session });
      if (r.modifiedCount !== 1) throw new TuChoi('het-hang');
    }
    const v = await db.collection('vi').updateOne({ _id: khach, du: { $gte: tien } }, { $inc: { du: -tien } }, { session });
    if (v.modifiedCount !== 1) throw new TuChoi('thieu-tien');
    await db.collection('vi').updateOne({ _id: 'SHOP' }, { $inc: { du: tien } }, { session });
  });
}`;

const GIAI_EN = `<p>The solution is one file, <code>_demo/node/lab6-giai.mjs</code>. Three ideas, each one from this chapter: the check and the change in one conditional update (Lesson 6.1); every write of one request inside one transaction with explicit snapshot / majority (Lessons 6.2–6.4); and deduplication by a unique index on the request's identifier, inserted <em>first</em> inside the same transaction, so a duplicate fails fast with E11000 and is answered <code>'trung'</code> instead of being applied again (Lesson 6.3).</p>
${ma('js', GIAI_MA)}
${lenh(K, 1)}
<p>All five invariants hold. Read the line about the callback: it ran thousands of times for a few hundred requests. Most of those retries are orders colliding on <strong>one document</strong> — the <code>SHOP</code> wallet that every order credits (Lesson 6.1: a hot document is a queue). Two real-world improvements, for the advanced task: credit the shop through an append-only ledger (one document per order, summed by aggregation) instead of <code>$inc</code> on one wallet; and put the request's own ledger line in the same transaction so the books can always be rebuilt.</p>
<p>Why the duplicate check is inserted first: if the order record were inserted last, a duplicate request would first fight for stock and the wallet (more conflicts), and a concurrent duplicate could pass the stock check before failing. Inserted first, the second copy of a request conflicts with the first on the unique index entry, waits for it through the retry, and then gets E11000. A request that was refused (<code>thieu-tien</code>, <code>het-hang</code>) leaves no record — its transaction was aborted — so a client may legitimately retry it later.</p>`;

const GIAI_VI = `<p>Lời giải là một tệp, <code>_demo/node/lab6-giai.mjs</code>. Ba ý, mỗi ý lấy từ chương này: kiểm và đổi trong một lệnh cập nhật có điều kiện (Bài 6.1); mọi lần ghi của một yêu cầu nằm trong một transaction với snapshot / majority ghi rõ (Bài 6.2–6.4); và chống trùng bằng index duy nhất trên mã của yêu cầu, chèn <em>đầu tiên</em> trong cùng transaction, để bản trùng thất bại nhanh bằng E11000 và được trả <code>'trung'</code> thay vì bị áp dụng lần nữa (Bài 6.3).</p>
${ma('js', GIAI_MA)}
${lenh(K, 1)}
<p>Cả năm bất biến đều giữ. Đọc dòng về callback: nó chạy hàng nghìn lần cho vài trăm yêu cầu. Phần lớn các lần thử lại đó là các đơn va nhau ở <strong>một tài liệu</strong> — ví <code>SHOP</code> mà đơn nào cũng cộng vào (Bài 6.1: tài liệu nóng là một hàng đợi). Hai cải tiến sát thực tế, cho nhiệm vụ nâng cao: ghi có cho shop qua một sổ cái chỉ-thêm (mỗi đơn một tài liệu, cộng bằng aggregation) thay vì <code>$inc</code> vào một ví; và đặt dòng sổ cái của chính yêu cầu vào cùng transaction để sổ sách luôn dựng lại được.</p>
<p>Vì sao bản ghi chống trùng được chèn đầu tiên: nếu chèn bản ghi đơn ở cuối, một yêu cầu trùng sẽ đi tranh kho và ví trước (thêm xung đột), và một bản trùng chạy song song có thể qua được phần kiểm kho rồi mới hỏng. Chèn đầu tiên thì bản sao thứ hai của một yêu cầu va với bản đầu ngay ở mục index duy nhất, chờ nó qua vòng thử lại, rồi nhận E11000. Một yêu cầu bị từ chối (<code>thieu-tien</code>, <code>het-hang</code>) không để lại bản ghi nào — transaction của nó đã bị huỷ — nên client có quyền thử lại nó sau.</p>`;

export default {
  title: '6.5 — Lab: transfers and stock reservations that never go negative|||6.5 — Lab: chuyển tiền và giữ hàng không bao giờ âm',
  slug: 'mgo-6-5-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab 90 phút: cài đặt chuyenTien và datHang cho một ví điện tử + cửa hàng nhỏ để 354 yêu cầu bắn đồng thời (có cả yêu cầu gửi lại trùng) giữ đủ năm bất biến: tổng tiền không đổi, không ví âm, không kho âm, mỗi mã giao dịch được áp dụng đúng một lần, DB khớp đúng các yêu cầu đã báo thành công. Bản ngây thơ phát sẵn trượt cả 5 (chạy thật); bộ thử phát sẵn; rubric 10 điểm, câu hỏi bảo vệ, lời giải che (5/5 chạy thật).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab</span>
<h2>Lab: transfers and stock reservations that never go negative</h2>
<p class="lead">A small e-wallet and shop: 20 customer wallets, one shop wallet, five products. Two operations — transfer money between wallets, and place an order that reserves several products and pays from the customer's wallet. Your job is to implement them so that 354 requests fired <em>at the same time</em>, a fifth of them sent twice (a customer double-tapping "Pay", a client retrying after a timeout), leave the books exactly right. This is the backend core of every wallet, ticketing and booking project you will work on.</p>

<h3>Setup</h3>
<p>Lab running (Lesson 0.2). In <code>_demo/node</code> (run <code>npm install</code> once — Lesson 2.1) you have three files: <code>lab6-thu.mjs</code> — the load generator and invariant checker, do not change it; <code>lab6-ngay-tho.mjs</code> — a naive implementation; and <code>lab6-giai.mjs</code> — the solution, do not open it yet. Create <code>lab6-cua-ban.mjs</code> for your implementation and run <code>node lab6-thu.mjs ./lab6-cua-ban.mjs</code>. The checker rebuilds the database <code>lab6</code> on every run, so you can run it as often as you like.</p>
<p><strong>The contract.</strong> Your module exports <code>chuyenTien(ctx, { maGD, tu, den, tien })</code> and <code>datHang(ctx, { maDon, khach, mon: [{ sp, sl }] })</code>, and optionally <code>chuanBi(db)</code> (called once after the data is loaded — create indexes there). <code>ctx</code> is <code>{ client, db }</code>. Each function returns <code>'ok'</code>, <code>'thieu-tien'</code> (insufficient funds), <code>'het-hang'</code> (out of stock) or <code>'trung'</code> (this <code>maGD</code>/<code>maDon</code> was already processed). Every product costs 100,000 đ; an order pays <code>sl × 100,000</code> from the customer's wallet to <code>SHOP</code>.</p>
<p>The naive implementation reads, checks and writes in separate steps, with no transaction and no duplicate protection:</p>
${ma('js', NGAY_MA)}
${lenh(K, 0)}
<p>All five invariants broken: money created out of nothing (the total grew by millions), wallets far below zero, stock dozens of units below zero, requests reported "ok" twice for the same code, and a database that no longer matches what customers were told.</p>
<details><summary>The checker (read it to know exactly what is tested)</summary>
${ma('js', THU_MA)}
</details>

<h3>Tasks</h3>
<ol>
<li><strong>Diagnose</strong> the naive file: for each of the five broken invariants, name the line(s) responsible and the lesson of this chapter that explains it. Write it in <code>LAB6.md</code>.</li>
<li><strong>Implement</strong> <code>lab6-cua-ban.mjs</code> until the checker prints <code>ĐẠT 5/5</code>.</li>
<li><strong>Repeat</strong> the run three times. Concurrency bugs hide; 5/5 once is not proof. Paste the three outputs.</li>
<li><strong>Count retries:</strong> export a counter of how many times your transaction callback ran (as the solution's <code>thongKe</code>) and explain the number — which document causes most of the conflicts?</li>
<li><strong>Explain the duplicates:</strong> a request is sent twice and both copies arrive at the same moment. Walk through what each copy does in your code and why only one is applied.</li>
</ol>
<p><strong>Advanced:</strong> remove the hot <code>SHOP</code> document (append-only ledger) and measure the callback count again; make <code>'trung'</code> return the <em>original</em> outcome; add a sixth invariant — the sum of the ledger equals each wallet's balance change.</p>

<h3>Rubric (10 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>5/5 invariants in three consecutive runs; outputs pasted</td><td>3</td></tr>
<tr><td>Checks inside conditional updates (<code>$gte</code> in the filter, <code>modifiedCount</code> read), no read-then-write</td><td>2</td></tr>
<tr><td>One transaction per request, <code>{ session }</code> on every operation, business refusals abort without retry</td><td>2</td></tr>
<tr><td>Duplicates handled with a unique index inside the transaction (not a <code>findOne</code> check before it)</td><td>2</td></tr>
<tr><td><code>LAB6.md</code>: diagnosis of the naive file + explanation of the retry count and the duplicate walk-through</td><td>1</td></tr>
</tbody></table>
<p><strong>Common deductions:</strong> checking for a duplicate with <code>findOne</code> before inserting (−2: two concurrent copies both see "not found"); a missing <code>{ session }</code> on one call (−2: the 5/5 may still pass by luck — the code reviewer will not); side effects such as <code>console.log('đã trừ tiền')</code> inside the callback counted as "sent" (−1); catching every error as <code>'thieu-tien'</code> (−1: real errors hidden).</p>

<h3>Defend your design (questions a reviewer will ask)</h3>
<ul>
<li>"Why not just put <code>{ du: { $gte: tien } }</code> in the filter and skip the transaction?"</li>
<li>"A transfer is refused for insufficient funds. The client retries an hour later with the same <code>maGD</code>. What happens, and is that what you want?"</li>
<li>"The commit returns <code>UnknownTransactionCommitResult</code>. Can the customer be charged twice?"</li>
<li>"Under load, your callback ran ten times per request. What would you change in the data model?"</li>
<li>"Would your code still be correct with <code>w: 1</code>? With a failover in the middle of the test?"</li>
</ul>

<h3>Solution</h3>
${loiGiai('Open only after your own run shows 5/5 three times — full solution, run on MongoDB 8.0', GIAI_EN)}

<h3>Connect it to your project</h3>
<p>Milestone 6 of the course project (<code>mgo-moc-6</code>) is this lab on your own topic: the one operation of your product that must touch several documents atomically, implemented with a transaction and a duplicate-proof identifier, plus a load script in the style of <code>lab6-thu.mjs</code> that checks your own invariants.</p>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-9-2-idempotency-key', title: 'Distributed Systems 9.2 — Idempotency keys across services', sub: 'The same maGD idea when the payment is in another service' })}

<h3>🗂 Key terms</h3>
${kv([
  ['Invariant', 'A property that must hold after every operation, whatever the interleaving (total money constant, stock ≥ 0).'],
  ['Idempotency key', 'A client-chosen identifier (maGD, maDon) that makes a retried request apply at most once.'],
  ['Load generator', 'A script that fires many concurrent requests to expose race conditions.'],
  ['Hot document', 'One document most requests write to; the main source of transaction retries here.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab</span>
<h2>Lab: chuyển tiền và giữ hàng không bao giờ âm</h2>
<p class="lead">Một ví điện tử kiêm cửa hàng nhỏ: 20 ví khách, một ví shop, năm sản phẩm. Hai thao tác — chuyển tiền giữa các ví, và đặt một đơn giữ nhiều sản phẩm rồi trả bằng ví của khách. Việc của bạn là cài đặt chúng sao cho 354 yêu cầu bắn <em>cùng một lúc</em>, một phần năm trong đó bị gửi hai lần (khách bấm "Thanh toán" hai lần, client thử lại sau khi hết giờ chờ), để lại sổ sách đúng tuyệt đối. Đây là phần lõi backend của mọi dự án ví, bán vé, đặt chỗ mà bạn sẽ làm.</p>

<h3>Chuẩn bị</h3>
<p>Lab đang chạy (Bài 0.2). Trong <code>_demo/node</code> (chạy <code>npm install</code> một lần — Bài 2.1) có ba tệp: <code>lab6-thu.mjs</code> — bộ bắn tải và kiểm bất biến, đừng sửa; <code>lab6-ngay-tho.mjs</code> — một cài đặt ngây thơ; và <code>lab6-giai.mjs</code> — lời giải, chưa mở vội. Tạo <code>lab6-cua-ban.mjs</code> cho cài đặt của bạn và chạy <code>node lab6-thu.mjs ./lab6-cua-ban.mjs</code>. Bộ kiểm dựng lại database <code>lab6</code> mỗi lần chạy, nên bạn chạy bao nhiêu lần cũng được.</p>
<p><strong>Hợp đồng.</strong> Mô-đun của bạn xuất <code>chuyenTien(ctx, { maGD, tu, den, tien })</code> và <code>datHang(ctx, { maDon, khach, mon: [{ sp, sl }] })</code>, và tuỳ chọn <code>chuanBi(db)</code> (gọi một lần sau khi nạp dữ liệu — tạo index ở đó). <code>ctx</code> là <code>{ client, db }</code>. Mỗi hàm trả <code>'ok'</code>, <code>'thieu-tien'</code>, <code>'het-hang'</code> hoặc <code>'trung'</code> (mã <code>maGD</code>/<code>maDon</code> này đã được xử lý). Mọi sản phẩm giá 100.000 đ; một đơn trả <code>sl × 100.000</code> từ ví khách sang <code>SHOP</code>.</p>
<p>Cài đặt ngây thơ đọc, kiểm và ghi ở các bước tách rời, không transaction, không chống trùng:</p>
${ma('js', NGAY_MA)}
${lenh(K, 0)}
<p>Cả năm bất biến đều vỡ: tiền tự sinh ra từ hư không (tổng tăng hàng triệu), ví âm sâu, kho xuống hàng chục đơn vị dưới 0, yêu cầu được báo "ok" hai lần cho cùng một mã, và database không còn khớp với những gì đã trả lời khách.</p>
<details><summary>Bộ kiểm (đọc để biết chính xác cái gì được thử)</summary>
${ma('js', THU_MA)}
</details>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Chẩn đoán</strong> tệp ngây thơ: với mỗi bất biến bị vỡ, chỉ ra dòng chịu trách nhiệm và bài nào của chương này giải thích nó. Ghi vào <code>LAB6.md</code>.</li>
<li><strong>Cài đặt</strong> <code>lab6-cua-ban.mjs</code> tới khi bộ kiểm in <code>ĐẠT 5/5</code>.</li>
<li><strong>Lặp lại</strong> ba lần. Lỗi đồng thời hay ẩn nấp; một lần 5/5 chưa phải bằng chứng. Dán cả ba output.</li>
<li><strong>Đếm số lần thử lại:</strong> xuất một bộ đếm số lần callback transaction của bạn chạy (như <code>thongKe</code> của lời giải) và giải thích con số — tài liệu nào gây phần lớn xung đột?</li>
<li><strong>Giải thích chuyện trùng:</strong> một yêu cầu bị gửi hai lần và hai bản tới cùng lúc. Đi qua từng bước mỗi bản làm gì trong mã của bạn và vì sao chỉ một bản được áp dụng.</li>
</ol>
<p><strong>Nâng cao:</strong> bỏ tài liệu nóng <code>SHOP</code> (sổ cái chỉ-thêm) rồi đo lại số lần callback chạy; cho <code>'trung'</code> trả về kết quả <em>ban đầu</em>; thêm bất biến thứ sáu — tổng sổ cái bằng thay đổi số dư của từng ví.</p>

<h3>Rubric (10 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>5/5 bất biến trong ba lần chạy liên tiếp; dán output</td><td>3</td></tr>
<tr><td>Phần kiểm nằm trong lệnh cập nhật có điều kiện (<code>$gte</code> trong bộ lọc, có đọc <code>modifiedCount</code>), không đọc-rồi-ghi</td><td>2</td></tr>
<tr><td>Mỗi yêu cầu một transaction, <code>{ session }</code> ở mọi thao tác, từ chối nghiệp vụ thì huỷ không thử lại</td><td>2</td></tr>
<tr><td>Chống trùng bằng index duy nhất bên trong transaction (không phải kiểm bằng <code>findOne</code> trước đó)</td><td>2</td></tr>
<tr><td><code>LAB6.md</code>: chẩn đoán tệp ngây thơ + giải thích số lần thử lại và đường đi của bản trùng</td><td>1</td></tr>
</tbody></table>
<p><strong>Lỗi hay bị trừ điểm:</strong> kiểm trùng bằng <code>findOne</code> trước khi chèn (−2: hai bản đồng thời cùng thấy "chưa có"); thiếu <code>{ session }</code> ở một lời gọi (−2: 5/5 vẫn có thể qua nhờ may — người review thì không bỏ qua); hiệu ứng phụ kiểu <code>console.log('đã trừ tiền')</code> trong callback được coi như "đã gửi" (−1); bắt mọi lỗi thành <code>'thieu-tien'</code> (−1: giấu lỗi thật).</p>

<h3>Bảo vệ thiết kế (câu hỏi người review sẽ đặt)</h3>
<ul>
<li>"Sao không chỉ đặt <code>{ du: { $gte: tien } }</code> trong bộ lọc rồi bỏ transaction?"</li>
<li>"Một lần chuyển bị từ chối vì thiếu tiền. Một giờ sau client thử lại với cùng <code>maGD</code>. Chuyện gì xảy ra, và đó có phải điều bạn muốn?"</li>
<li>"Lệnh commit trả về <code>UnknownTransactionCommitResult</code>. Khách có thể bị trừ tiền hai lần không?"</li>
<li>"Khi tải nặng, callback của bạn chạy mười lần mỗi yêu cầu. Bạn sẽ đổi gì trong mô hình dữ liệu?"</li>
<li>"Mã của bạn còn đúng với <code>w: 1</code> không? Với một lần chuyển dự phòng giữa lúc thử?"</li>
</ul>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi lần chạy của chính bạn đạt 5/5 ba lần — lời giải đầy đủ, chạy trên MongoDB 8.0', GIAI_VI)}

<h3>Nối vào dự án của bạn</h3>
<p>Mốc 6 của dự án khoá (<code>mgo-moc-6</code>) là lab này trên đề tài của bạn: một thao tác của sản phẩm phải chạm nhiều tài liệu một cách nguyên tử, cài bằng transaction và mã định danh chống trùng, kèm một script tải kiểu <code>lab6-thu.mjs</code> kiểm các bất biến của riêng bạn.</p>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-9-2-idempotency-key', title: 'Hệ phân tán 9.2 — Idempotency key xuyên dịch vụ', sub: 'Cùng ý tưởng maGD khi phần thanh toán nằm ở dịch vụ khác' })}

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Bất biến (invariant)', 'Tính chất phải đúng sau mọi thao tác, bất kể thứ tự xen kẽ (tổng tiền không đổi, kho ≥ 0).'],
  ['Idempotency key', 'Mã do client chọn (maGD, maDon) để một yêu cầu bị thử lại chỉ được áp dụng tối đa một lần.'],
  ['Bộ bắn tải', 'Script bắn nhiều yêu cầu đồng thời để làm lộ tranh chấp dữ liệu.'],
  ['Tài liệu nóng', 'Một tài liệu mà phần lớn yêu cầu đều ghi vào; nguồn chính của các lần thử lại transaction ở đây.'],
])}
</div>
`,
};
