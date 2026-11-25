/**
 * 7.6 — Lab Chương 7: sống sót khi mất một máy mà không mất đơn hàng (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s07-6-lab'] (cụm rs1 ba container ../_demo/rs/compose.yaml + mạng ứng dụng "ud"; MongoDB 8.0.38; Node 22 + driver 7.9.1).
 * Tệp lab (phát cho người học): _demo/node/lab7.mjs (bộ chạy + đối chiếu, THU_MA), lab7-ngay-tho.mjs (NGAY_MA), lab7-giai.mjs (lời giải, GIAI_MA — che),
 * _demo/rs/hon-loan.sh (gây sự cố). Ba tệp chép nguyên vào bài bằng scratchpad/mgo/tmp/dung-lab7.py từ tmp/lab7-khung.mjs — sửa tệp thì chạy lại script đó.
 * Số đo: split-brain 20 s ⇒ bản ngây thơ báo khách thành công 1423 đơn, KHÔNG một lỗi nào, MẤT 478 (đúng 478 tài liệu trong rollback/…/removed.*.bson trên r1);
 * lời giải 0 mất · 0 trùng · 0 báo sai, một đơn chờ ~20 s; giết primary ⇒ lời giải vẫn 0/0/0 (lỗi đầu: connect timed out 5000 ms ⇒ thử lại), một đơn chờ ~16 s.
 */
import { lenh, ma, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's07-6-lab';

const THU_MA = `// Lab 7.6 — BỘ CHẠY + ĐỐI CHIẾU (phát sẵn, KHÔNG sửa): "sống sót khi mất một máy mà không mất đơn nào".
// Ứng dụng đặt đơn liên tục vào replica set rs1; trong lúc chạy, rs/hon-loan.sh cắt primary khỏi hai máy kia (split-brain) hoặc giết nó.
//   docker compose -p mgo-rs run --rm -e CHE_DO=ngay-tho app node lab7.mjs   # dùng lab7-ngay-tho.mjs (bản "cho nhanh" hay gặp)
//   docker compose -p mgo-rs run --rm -e CHE_DO=cua-ban  app node lab7.mjs   # dùng lab7-cua-ban.mjs — bài làm của bạn
// Biến: GIAY (thời lượng đặt đơn, 40), CHO (giây chờ cụm lành lại rồi mới đối chiếu, 45), NHAN (tiền tố mã đơn).
// Đối chiếu cuối: (1) đơn đã báo khách "thành công" mà không còn trong DB = MẤT; (2) một mã đơn có >1 tài liệu = TRÙNG
//                 (khách bị trừ tiền hai lần); (3) đơn báo khách "thất bại" mà thật ra đã nằm trong DB = BÁO SAI.
import { MongoClient } from 'mongodb';

const CHE_DO = process.env.CHE_DO ?? 'giai';
const GIAY = Number(process.env.GIAY ?? 40), CHO = Number(process.env.CHO ?? 45), NHAN = process.env.NHAN ?? CHE_DO;
const impl = await import(\`./lab7-\${CHE_DO}.mjs\`);   // tệp cài đặt: xuất URI (chuỗi kết nối) và datDon(don, maDon, log) ⇒ true/false
const URI = impl.URI;
const client = new MongoClient(URI);
await client.connect();
const don = client.db().collection('don7');
await don.createIndex({ maDon: 1 });   // CỐ Ý không unique ở bản ngây thơ để thấy được trùng; bản giải dùng _id = maDon (luôn duy nhất)
const gio = () => new Date().toLocaleTimeString('vi-VN', { hour12: false, timeZone: 'Asia/Saigon' });
const t0 = Date.now(), s = () => \`\${gio()} \${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s\`;
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));
console.log(\`\${s()} CHE_DO=\${CHE_DO}: đặt đơn trong \${GIAY}s\`);

const baoOk = [], baoLoi = [];
let lanLoi = 0;
const log = (e, them = '') => { lanLoi++; if (lanLoi === 1) console.log(\`\${s()} lỗi đầu: \${e.name} \${e.message.slice(0, 70)}\${them}\`); };

let i = 0;
while (Date.now() - t0 < GIAY * 1000) {
  const maDon = \`\${NHAN}-\${String(++i).padStart(5, '0')}\`, b = Date.now();
  const ok = await impl.datDon(don, maDon, log);
  (ok ? baoOk : baoLoi).push(maDon);
  if (Date.now() - b > 2000) console.log(\`\${s()} đơn \${maDon} chờ \${Date.now() - b} ms rồi \${ok ? 'thành công' : 'THẤT BẠI'}\`);
  await ngu(20);
}
console.log(\`\${s()} hết giờ: \${i} đơn — báo khách thành công \${baoOk.length}, thất bại \${baoLoi.length}; số lần gặp lỗi \${lanLoi}\`);
console.log(\`\${s()} chờ \${CHO}s cho cụm lành (bầu lại, rollback xong) rồi đối chiếu bằng đọc majority...\`);
await ngu(CHO * 1000);
const dem = new Map();
for await (const d of don.find({ maDon: { $regex: \`^\${NHAN}-\` } }, { projection: { maDon: 1 }, readConcern: { level: 'majority' } })) {
  dem.set(d.maDon, (dem.get(d.maDon) ?? 0) + 1);
}
const mat = baoOk.filter((m) => !dem.has(m));
const trung = [...dem].filter(([, n]) => n > 1).map(([m]) => m);
const baoSai = baoLoi.filter((m) => dem.has(m));
console.log(\`\${s()} ĐỐI CHIẾU: MẤT \${mat.length}\${mat.length ? ' (' + mat.slice(0, 3).join(', ') + '…)' : ''} · TRÙNG \${trung.length}\${trung.length ? ' (' + trung.slice(0, 3).join(', ') + ')' : ''} · BÁO SAI \${baoSai.length}\`);
console.log(mat.length + trung.length + baoSai.length === 0 ? 'ĐẠT: không mất, không trùng, không báo sai.' : 'KHÔNG ĐẠT.');
await client.close();`;
const NGAY_MA = `// Lab 7.6 — bản NGÂY THƠ (kiểu cấu hình "cho nhanh" hay gặp ở dự án cũ). Chạy: CHE_DO=ngay-tho node lab7.mjs
export const URI = 'mongodb://r1:27017,r2:27017,r3:27017/ct7?replicaSet=rs1&w=1&retryWrites=false';

export async function datDon(don, maDon, log) {
  try { await don.insertOne({ maDon, luc: new Date() }); return true; }
  catch (e) {
    log(e);
    // "Khách bấm Đặt lại": ứng dụng tạo lần ghi MỚI (_id mới) cho cùng mã đơn.
    try { await don.insertOne({ maDon, luc: new Date(), lanHai: true }); return true; } catch { return false; }
  }
}`;
const GIAI_MA = `// Lab 7.6 — LỜI GIẢI. Bốn ý, mỗi ý một bài của Chương 6–7:
//  (1) w:majority — lần ghi đã báo thành công thì nằm trên đa số, không bao giờ bị rollback (Bài 6.3);
//  (2) _id = mã đơn — thử lại bao nhiêu lần cũng chỉ một tài liệu; E11000 ở lần thử lại nghĩa là lần trước ĐÃ ghi (Bài 2.1, 6.5);
//  (3) lỗi mạng / hết giờ / primary nhường chức = "chưa biết" ⇒ thử lại CÙNG _id, giãn dần, hạn 60 s mới báo khách thất bại (Bài 7.2);
//  (4) socketTimeoutMS + connectTimeoutMS: socket chết im lặng, hay lần nối lại tới máy đã mất, không giữ yêu cầu hàng chục giây (Bài 7.2).
export const URI = 'mongodb://r1:27017,r2:27017,r3:27017/ct7?replicaSet=rs1&w=majority&retryWrites=true&socketTimeoutMS=5000&connectTimeoutMS=5000&serverSelectionTimeoutMS=15000';
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

export async function datDon(don, maDon, log) {
  const han = Date.now() + 60_000;
  for (let lan = 1; ; lan++) {
    try { await don.insertOne({ _id: maDon, maDon, luc: new Date() }); return true; }
    catch (e) {
      if (e.code === 11000) return true;            // lần thử trước đã ghi xong — đơn này có rồi
      log(e, ' ⇒ thử lại cùng _id');
      if (Date.now() > han) return false;           // thật sự không ghi được trong 60 s ⇒ báo khách thất bại (và đơn KHÔNG có trong DB)
      await ngu(Math.min(200 * lan, 2000));
    }
  }
}`;

const GIAI_EN = `<p>The solution is one file, <code>_demo/node/lab7-giai.mjs</code>. Four ideas, each from Chapters 6–7: <strong>w: "majority"</strong>, so an order reported as saved is on a majority and can never be rolled back (Lesson 6.3); <strong><code>_id</code> = order number</strong>, so any number of retries produce one document, and E11000 on a retry means the earlier attempt succeeded (Lessons 2.1, 6.5); <strong>retry the same <code>_id</code></strong> with growing pauses on every error that means "unknown" — network errors, timeouts, "primary stepped down" — for up to 60 seconds before telling the customer it failed (Lesson 7.2); and <strong><code>socketTimeoutMS</code> and <code>connectTimeoutMS</code></strong>, so neither a socket that died silently nor a reconnect to a vanished host holds a request for tens of seconds (Lesson 7.2 measured over 30 seconds without them).</p>
${ma('js', GIAI_MA)}
<p>Run on the lab: during the split-brain, the first error was <code>MongoWriteConcernError</code> "Primary stepped down while waiting for replication": the isolated r1 had applied the insert but could not get a majority, stepped down after about ten seconds and interrupted the wait. The retries with the same <code>_id</code> went on until the new primary was found; that one order took about 20 seconds, and the check found 0 lost, 0 duplicated, 0 wrongly reported. With the primary killed instead, the first error was a connection timeout after 5,000 ms (the <code>connectTimeoutMS</code> of the solution), the retry succeeded, and again 0 / 0 / 0.</p>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}`;

const GIAI_VI = `<p>Lời giải là một tệp, <code>_demo/node/lab7-giai.mjs</code>. Bốn ý, mỗi ý từ Chương 6–7: <strong>w: "majority"</strong>, để đơn đã báo là lưu nằm trên đa số và không bao giờ bị rollback (Bài 6.3); <strong><code>_id</code> = mã đơn</strong>, để thử lại bao nhiêu lần cũng chỉ một tài liệu, và E11000 ở lần thử lại nghĩa là lần trước đã thành công (Bài 2.1, 6.5); <strong>thử lại cùng <code>_id</code></strong>, giãn dần, với mọi lỗi mang nghĩa "chưa biết" — lỗi mạng, hết giờ, "primary đã nhường chức" — trong tối đa 60 giây rồi mới báo khách thất bại (Bài 7.2); và <strong><code>socketTimeoutMS</code> và <code>connectTimeoutMS</code></strong>, để cả socket chết im lặng lẫn lần nối lại tới máy đã mất đều không giữ yêu cầu hàng chục giây (Bài 7.2 đo được hơn 30 giây khi không đặt).</p>
${ma('js', GIAI_MA)}
<p>Chạy trên lab: trong lúc split-brain, lỗi đầu tiên là <code>MongoWriteConcernError</code> "Primary stepped down while waiting for replication": r1 bị cô lập đã áp dụng lệnh chèn nhưng không gom được đa số, sau chừng mười giây thì nhường chức và cắt ngang việc chờ. Các lần thử lại cùng <code>_id</code> tiếp tục tới khi tìm được primary mới; riêng đơn đó mất khoảng 20 giây, và đối chiếu ra 0 mất, 0 trùng, 0 báo sai. Khi giết hẳn primary thay vì cắt mạng, lỗi đầu tiên là hết giờ nối sau 5.000 ms (chính <code>connectTimeoutMS</code> của lời giải), lần thử lại thành công, và cũng 0 / 0 / 0.</p>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}`;

export default {
  title: '7.6 — Lab: survive a node failure without losing an order|||7.6 — Lab: sống sót khi mất một máy mà không mất đơn hàng',
  slug: 'mgo-7-6-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab chạy thật trên replica set ba container: một ứng dụng đặt đơn liên tục, kịch bản gây sự cố cắt primary khỏi hai máy kia trong khi ứng dụng VẪN nối được nó (split-brain), rồi giết hẳn primary. Bản cấu hình "cho nhanh" (w:1, không thử lại đúng cách) báo khách thành công 1.423 đơn mà không gặp một lỗi nào, và mất 478 — đúng 478 tài liệu nằm trong tệp rollback. Nhiệm vụ: viết lớp đặt đơn để đối chiếu ra 0 mất, 0 trùng, 0 báo sai qua cả hai sự cố. Rubric 10 điểm, câu hỏi bảo vệ, lời giải che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab</span>
<h2>Lab: survive a node failure without losing an order</h2>
<p class="lead">Everything in Chapters 6 and 7 comes together in one question a customer would ask: "I got the confirmation — is my order really there?" In this lab an application places orders continuously into the three-container replica set while a script breaks the cluster for real. You first watch a common "fast" configuration lose hundreds of confirmed orders, then write the order-placing code that loses none.</p>

<h3>Setup</h3>
<ol>
<li>Files (in the lesson resources, folder <code>_demo/</code>): <code>rs/compose.yaml</code>, <code>rs/hon-loan.sh</code>, <code>node/lab7.mjs</code>, <code>node/lab7-ngay-tho.mjs</code>. Install the driver once: <code>cd _demo/node &amp;&amp; npm install</code>.</li>
<li>Start the cluster: <code>cd _demo/rs &amp;&amp; docker compose -p mgo-rs up -d --wait</code>, then <code>bash hon-loan.sh cho-primary</code>.</li>
<li>The compose file has a second network, <code>ud</code> ("application network"), shared only by r1 and the app container — like an application server in the same server room as r1. <code>hon-loan.sh cat-mang r1</code> unplugs r1 from the replica-set network: r2 and r3 lose r1, but the application can still talk to it. That is a <strong>split-brain</strong>: for about ten seconds the old primary still believes it is primary.</li>
<li><code>lab7.mjs</code> is the test harness — do not change it. It places one order every ~20 ms for <code>GIAY</code> seconds by calling <code>datDon(don, maDon, log)</code> from the file chosen by <code>CHE_DO</code>, records what it told the customer, waits <code>CHO</code> seconds for the cluster to heal, then reads everything back with read concern majority and counts: <strong>LOST</strong> (told "success", not in the database), <strong>DUPLICATE</strong> (one order number, several documents — the customer charged twice), <strong>WRONGLY REPORTED</strong> (told "failed" but the order exists).</li>
</ol>
${ma('js', THU_MA)}

<h3>Step 1 — watch the naive version fail</h3>
${ma('js', NGAY_MA)}
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>During twenty seconds of split-brain the application kept writing to r1 with <code>w: 1</code>; r1 acknowledged every one. r2 and r3 elected a new primary and continued without those writes. When r1 came back it rolled them back to match the majority. Result: <strong>1,423 orders confirmed to customers, 478 of them do not exist</strong> — and exactly 478 documents sit in a rollback file on r1's disk that nobody will open unless they know to. The application did not see a single error during the whole run: one order simply waited about ten seconds, then "succeeded".</p>

<h3>Tasks</h3>
<ol>
<li>Copy <code>lab7-ngay-tho.mjs</code> to <code>lab7-cua-ban.mjs</code>. Change <code>URI</code> and <code>datDon</code> — nothing else — so that the harness prints <code>ĐẠT</code> (pass).</li>
<li>Run it against the split-brain: start <code>docker compose -p mgo-rs run --rm -e CHE_DO=cua-ban -e GIAY=40 -e CHO=40 app node lab7.mjs</code>; after 10 s, <code>bash hon-loan.sh cat-mang r1</code>; after 20 s more, <code>bash hon-loan.sh noi-mang r1</code>.</li>
<li>Run it against a crash: same command with <code>-e NHAN=giet</code>; after 10 s <code>bash hon-loan.sh giet</code>; after 15 s <code>bash hon-loan.sh bat r1</code>.</li>
<li>Run each scenario three times. Record, for each run, the three counts and the longest time one order waited.</li>
<li>Write a short incident note (half a page): what the naive version did wrong, in the order the failure unfolded, and which line of your code prevents each problem.</li>
</ol>

<h3>Rubric (10 points)</h3>
<table>
<thead><tr><th>Points</th><th>Criterion</th></tr></thead>
<tbody>
<tr><td>3</td><td>0 LOST in all six runs (both scenarios × 3). Any lost order = 0 for this line.</td></tr>
<tr><td>2</td><td>0 DUPLICATE in all runs, and the reason is structural (a unique key), not luck.</td></tr>
<tr><td>1</td><td>0 WRONGLY REPORTED: a customer told "failed" really has no order.</td></tr>
<tr><td>1</td><td>No request hangs without bound: a socket or operation timeout, and a deadline after which the customer gets an answer.</td></tr>
<tr><td>1</td><td>Retries only on errors that mean "unknown"; validation errors and duplicates are not retried blindly.</td></tr>
<tr><td>2</td><td>Incident note: correct timeline (partition → w:1 acknowledged on isolated primary → election → rollback), and each fix tied to the failure it prevents.</td></tr>
</tbody>
</table>

<h3>Defend your design (questions a reviewer will ask)</h3>
<ul>
<li>Why is <code>retryWrites=true</code> alone not enough to pass?</li>
<li>Your <code>datDon</code> waited 20 seconds for one order. What would you show the customer meanwhile, and what does the HTTP layer return if the 60-second deadline expires?</li>
<li>Where would the order number come from in a real API — and why must the client, not the server, generate it if the client may retry?</li>
<li>Could you keep <code>w: 1</code> and still pass, if you read the rollback files and re-insert them? Why is that a bad plan?</li>
<li>What changes if the order also charges a card through a payment gateway?</li>
</ul>

<h3>Solution</h3>
${loiGiai('Open only after your own version passes both scenarios three times — full solution, run on MongoDB 8.0', GIAI_EN)}

<h3>Connect it to your project</h3>
<p>In your course project (milestone 7), put the same harness in front of your own "create" endpoint: run a load script, break the cluster with <code>hon-loan.sh</code>, and include the counts in your milestone report. If your project uses Spring Boot, the same four ideas apply — Lesson 8.4 shows them with Spring Data MongoDB.</p>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-3-2-failover', title: 'Distributed Systems 3.2 — Failover and split-brain', sub: 'Two leaders accepting writes: the general problem, and GitHub 2018 as a case study' })}

<h3>🗂 Key terms</h3>
${kv([
  ['Split-brain', 'Two members both acting as primary for a while (the isolated old one until it steps down); writes to the minority side are rolled back.'],
  ['Rollback file', 'rollback/&lt;uuid&gt;/removed.&lt;time&gt;.bson on the old primary: writes undone after a failover.'],
  ['Idempotent create', 'Creating with a client-chosen unique key, so retries yield one document and E11000 means "already done".'],
  ['Unknown outcome', 'Network error, timeout or step-down during a write: it may or may not have been applied.'],
  ['Chaos test', 'Breaking a system on purpose under load and checking invariants afterwards.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab</span>
<h2>Lab: sống sót khi mất một máy mà không mất đơn hàng</h2>
<p class="lead">Mọi thứ của Chương 6 và 7 gom lại trong một câu khách hàng sẽ hỏi: "Tôi nhận được xác nhận rồi — đơn của tôi có thật sự nằm đó không?" Trong lab này một ứng dụng đặt đơn liên tục vào replica set ba container trong khi một kịch bản làm hỏng cụm thật sự. Bạn xem trước một cấu hình "cho nhanh" hay gặp làm mất hàng trăm đơn đã xác nhận, rồi viết đoạn mã đặt đơn không làm mất đơn nào.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>Tệp (trong tài nguyên bài, thư mục <code>_demo/</code>): <code>rs/compose.yaml</code>, <code>rs/hon-loan.sh</code>, <code>node/lab7.mjs</code>, <code>node/lab7-ngay-tho.mjs</code>. Cài driver một lần: <code>cd _demo/node &amp;&amp; npm install</code>.</li>
<li>Chạy cụm: <code>cd _demo/rs &amp;&amp; docker compose -p mgo-rs up -d --wait</code>, rồi <code>bash hon-loan.sh cho-primary</code>.</li>
<li>Tệp compose có mạng thứ hai, <code>ud</code> ("mạng ứng dụng"), chỉ r1 và container ứng dụng dùng chung — như một máy chủ ứng dụng đặt cùng phòng máy với r1. <code>hon-loan.sh cat-mang r1</code> rút r1 khỏi mạng replica set: r2 và r3 mất r1, nhưng ứng dụng vẫn nói chuyện được với nó. Đó là <strong>split-brain</strong> (não chia đôi): trong chừng mười giây, primary cũ vẫn tin mình là primary.</li>
<li><code>lab7.mjs</code> là bộ chạy thử — không sửa. Nó đặt một đơn mỗi ~20 ms trong <code>GIAY</code> giây bằng cách gọi <code>datDon(don, maDon, log)</code> từ tệp do <code>CHE_DO</code> chọn, ghi lại nó đã báo khách điều gì, chờ <code>CHO</code> giây cho cụm lành, rồi đọc lại tất cả với read concern majority và đếm: <strong>MẤT</strong> (báo "thành công" mà không có trong database), <strong>TRÙNG</strong> (một mã đơn, nhiều tài liệu — khách bị trừ tiền hai lần), <strong>BÁO SAI</strong> (báo "thất bại" mà đơn lại có).</li>
</ol>
${ma('js', THU_MA)}

<h3>Bước 1 — xem bản ngây thơ hỏng</h3>
${ma('js', NGAY_MA)}
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>Trong hai mươi giây split-brain, ứng dụng vẫn ghi vào r1 với <code>w: 1</code>; r1 xác nhận từng lệnh. r2 và r3 bầu primary mới và chạy tiếp mà không có các lần ghi đó. Khi r1 quay lại, nó rollback chúng cho khớp với đa số. Kết quả: <strong>1.423 đơn đã báo khách thành công, 478 đơn trong số đó không tồn tại</strong> — và đúng 478 tài liệu nằm trong một tệp rollback trên đĩa của r1 mà không ai mở ra nếu không biết phải tìm. Ứng dụng không gặp một lỗi nào suốt lượt chạy: chỉ có một đơn chờ chừng mười giây rồi "thành công".</p>

<h3>Nhiệm vụ</h3>
<ol>
<li>Chép <code>lab7-ngay-tho.mjs</code> thành <code>lab7-cua-ban.mjs</code>. Đổi <code>URI</code> và <code>datDon</code> — không đổi gì khác — để bộ chạy in <code>ĐẠT</code>.</li>
<li>Chạy với split-brain: chạy <code>docker compose -p mgo-rs run --rm -e CHE_DO=cua-ban -e GIAY=40 -e CHO=40 app node lab7.mjs</code>; sau 10 s, <code>bash hon-loan.sh cat-mang r1</code>; thêm 20 s nữa, <code>bash hon-loan.sh noi-mang r1</code>.</li>
<li>Chạy với máy sập: cùng lệnh kèm <code>-e NHAN=giet</code>; sau 10 s <code>bash hon-loan.sh giet</code>; sau 15 s <code>bash hon-loan.sh bat r1</code>.</li>
<li>Chạy mỗi kịch bản ba lần. Ghi lại với từng lần: ba con số đối chiếu và thời gian lâu nhất một đơn phải chờ.</li>
<li>Viết một ghi chú sự cố ngắn (nửa trang): bản ngây thơ sai ở đâu, theo đúng thứ tự sự cố diễn ra, và dòng nào trong mã của bạn chặn từng vấn đề.</li>
</ol>

<h3>Rubric (10 điểm)</h3>
<table>
<thead><tr><th>Điểm</th><th>Tiêu chí</th></tr></thead>
<tbody>
<tr><td>3</td><td>0 MẤT ở cả sáu lần chạy (hai kịch bản × 3). Mất một đơn = 0 điểm dòng này.</td></tr>
<tr><td>2</td><td>0 TRÙNG ở mọi lần chạy, và lý do nằm ở cấu trúc (khoá duy nhất), không phải may mắn.</td></tr>
<tr><td>1</td><td>0 BÁO SAI: khách được báo "thất bại" thì thật sự không có đơn.</td></tr>
<tr><td>1</td><td>Không yêu cầu nào treo vô hạn: có timeout cho socket hoặc thao tác, và một hạn chót sau đó khách nhận được câu trả lời.</td></tr>
<tr><td>1</td><td>Chỉ thử lại với lỗi mang nghĩa "chưa biết"; lỗi kiểm hợp lệ và trùng khoá không bị thử lại mù quáng.</td></tr>
<tr><td>2</td><td>Ghi chú sự cố: đúng dòng thời gian (cắt mạng → w:1 được primary cô lập xác nhận → bầu chọn → rollback), và mỗi cách sửa gắn với đúng sự cố nó chặn.</td></tr>
</tbody>
</table>

<h3>Bảo vệ thiết kế (câu hỏi người review sẽ đặt)</h3>
<ul>
<li>Vì sao chỉ <code>retryWrites=true</code> thì chưa đủ để đạt?</li>
<li><code>datDon</code> của bạn chờ 20 giây cho một đơn. Trong lúc đó bạn hiện gì cho khách, và lớp HTTP trả gì nếu hết hạn 60 giây?</li>
<li>Trong một API thật, mã đơn lấy từ đâu — và vì sao phải do client sinh, không phải máy chủ, nếu client có thể thử lại?</li>
<li>Giữ <code>w: 1</code> rồi đọc tệp rollback và chèn lại thì có đạt được không? Vì sao đó là kế hoạch tồi?</li>
<li>Nếu đặt đơn còn trừ tiền thẻ qua một cổng thanh toán thì thay đổi gì?</li>
</ul>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi bản của bạn đã đạt cả hai kịch bản ba lần — lời giải đầy đủ, đã chạy trên MongoDB 8.0', GIAI_VI)}

<h3>Nối vào dự án của bạn</h3>
<p>Trong dự án của khoá (mốc 7), đặt cùng bộ chạy này trước endpoint "tạo" của chính bạn: chạy một kịch bản tải, làm hỏng cụm bằng <code>hon-loan.sh</code>, và đưa ba con số đối chiếu vào báo cáo mốc. Nếu dự án dùng Spring Boot, bốn ý đó vẫn giữ nguyên — Bài 8.4 làm lại với Spring Data MongoDB.</p>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-3-2-failover', title: 'Hệ thống phân tán 3.2 — Chuyển đổi dự phòng và split-brain', sub: 'Hai leader cùng nhận ghi: bài toán chung, và GitHub 2018 làm ví dụ' })}

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Split-brain', 'Hai thành viên cùng hành xử như primary trong một lúc (primary cũ bị cô lập cho tới khi nhường chức); lần ghi phía thiểu số bị rollback.'],
  ['Tệp rollback', 'rollback/&lt;uuid&gt;/removed.&lt;time&gt;.bson trên primary cũ: các lần ghi bị hoàn tác sau chuyển dự phòng.'],
  ['Tạo idempotent', 'Tạo bằng khoá duy nhất do client chọn, để thử lại chỉ ra một tài liệu và E11000 nghĩa là "đã xong".'],
  ['Kết quả chưa biết', 'Lỗi mạng, hết giờ hay primary nhường chức giữa lúc ghi: có thể đã áp dụng, có thể chưa.'],
  ['Kiểm thử hỗn loạn', 'Cố ý làm hỏng hệ thống khi đang chịu tải rồi kiểm các bất biến sau đó.'],
])}
</div>
`,
};
