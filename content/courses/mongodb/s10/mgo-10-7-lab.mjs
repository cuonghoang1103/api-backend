/**
 * 10.7 — Lab: xoá nhầm lúc 14:03 — khôi phục không mất đơn nào (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s10-7-lab'] (kịch bản demo/s10/s10-7-lab.txt). Khối: 0 dựng sự cố · 1 cách ngây thơ (restore --drop) ⇒ CHƯA ĐẠT · 2 lời giải PITR ⇒ ĐẠT.
 * Tệp lab (nhúng nguyên văn bên dưới, SINH từ _demo/ bằng scratchpad/mgo/tmp/lab10-sinh.py): lab10-su-co.sh, lab10-su-co.js, lab10-cham.sh, lab10-ngay-tho.sh, lab10-giai.sh.
 * Mọi container phụ giới hạn 2 GB/2 CPU, --network none; dọn: docker rm -f mgo-l10kp; db lab10 drop; rm -rf /tmp/mgo-lab10.
 */
import { lenh, ma, loiGiai } from '../_chung.mjs';

const K = 's10-7-lab';
const SU_CO_SH = `#!/usr/bin/env bash
# Lab 10.7 — dựng sự cố trên mgo-lab (database lab10). Sau khi chạy:
#   /tmp/mgo-lab10/goc/       bản sao lưu 02:00 (mongodump --oplog, cả máy) — đây là bản sao lưu đêm qua
#   /tmp/mgo-lab10/.dap-an    vân tay từng đơn ĐÚNG (để lab10-cham.sh chấm — đừng mở trước khi làm)
# Rồi tự khôi phục sao cho lab10.orders đủ mọi đơn, mỗi đơn đúng trạng thái mới nhất, không mất đơn nào ghi sau 14:03.
set -euo pipefail
L=/tmp/mgo-lab10; rm -rf $L; mkdir -p $L
chay() { docker exec mgo-lab mongosh --quiet --eval "var PHA='$1'" /demo/lab10-su-co.js; }
chay nap
docker exec mgo-lab sh -c 'rm -rf /tmp/lab10-goc && mongodump --oplog --out /tmp/lab10-goc --quiet'
docker cp -q mgo-lab:/tmp/lab10-goc $L/goc; docker exec mgo-lab rm -rf /tmp/lab10-goc
echo "02:00 — đã sao lưu cả máy vào $L/goc"
chay a
# Vân tay đúng = mỗi đơn một dòng "_id md5(EJSON)": đơn bị xoá lấy trạng thái NGAY TRƯỚC 14:03, đơn còn lại lấy trạng thái cuối cùng.
vt() { docker exec mgo-lab mongosh --quiet lab10 --eval "db.orders.find($1).forEach(d => print(d._id + ' ' + require('crypto').createHash('md5').update(EJSON.stringify(d, { relaxed: false })).digest('hex')))"; }
vt '{ ngay: { $lt: ISODate("2026-10-20") } }' > $L/.dap-an
chay xoa
chay b
vt '{}' >> $L/.dap-an
echo "sự cố đã xảy ra. Khách bắt đầu gọi: \\"đơn tôi biến mất\\". Bản sao lưu: $L/goc — chúc may mắn."`;
const SU_CO_JS = `// Lab 10.7 — dựng sự cố "xoá nhầm lúc 14:03" trên database lab10 (chạy bởi lab10-su-co.sh, KHÔNG chạy tay).
// Pha (biến PHA): 'nap' = nạp 3000 đơn · 'a' = ứng dụng chạy sau bản sao lưu · 'xoa' = lệnh xoá nhầm · 'b' = ứng dụng chạy tiếp sau sự cố.
// TẤT ĐỊNH (LCG) ⇒ chạy lại ra đúng cùng một sự cố.
const d = db.getSiblingDB('lab10');
let seed = 1403 + { nap: 0, a: 1, b: 2, xoa: 3 }[PHA];
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const TT = ['NEW', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const goc = Date.UTC(2026, 9, 1);
const donMoi = (id) => ({ _id: id, khach: 'KH' + String(int(1, 300)).padStart(4, '0'), trangThai: 'NEW',
  tong: NumberDecimal(String(int(50, 5000) * 1000)), ngay: new Date(), ghiChu: [] });
if (PHA === 'nap') {
  d.dropDatabase();
  const docs = [];
  for (let i = 1; i <= 3000; i++) docs.push({ _id: i, khach: 'KH' + String(int(1, 300)).padStart(4, '0'), trangThai: TT[int(1, 4)],
    tong: NumberDecimal(String(int(50, 5000) * 1000)), ngay: new Date(goc + Math.floor(rnd() * 50 * 86400000)), ghiChu: [] });
  d.orders.insertMany(docs);
  d.orders.createIndex({ khach: 1, ngay: -1 });
  print(\`lab10.orders: \${d.orders.countDocuments()} đơn, \${d.orders.countDocuments({ ngay: { $lt: ISODate('2026-10-20') } })} đơn trước 20/10\`);
} else if (PHA === 'a' || PHA === 'b') {
  const tu = PHA === 'a' ? 3001 : 3101, soMoi = PHA === 'a' ? 100 : 60, soSua = PHA === 'a' ? 200 : 150;
  let sua = 0, truot = 0;
  for (let i = 0; i < soMoi; i++) d.orders.insertOne(donMoi(tu + i));
  for (let k = 0; k < soSua; k++) {
    const id = int(1, tu + soMoi - 1);
    const r = d.orders.updateOne({ _id: id }, { $set: { trangThai: TT[int(1, 4)] }, $push: { ghiChu: \`pha \${PHA} lượt \${k}\` } });
    r.matchedCount ? sua++ : truot++;
  }
  print(\`pha \${PHA}: \${soMoi} đơn mới, \${sua} lần sửa trúng, \${truot} lần sửa trượt (matched 0 — đơn đã không còn)\`);
} else if (PHA === 'xoa') {
  const r = d.orders.deleteMany({ ngay: { $lt: ISODate('2026-10-20') } });   // định chạy trên lab10.orders_luu_tru, gõ nhầm collection
  print(\`14:03 — deleteMany: \${r.deletedCount} đơn bị xoá\`);
}`;
const CHAM = `#!/usr/bin/env bash
# Lab 10.7 — chấm: so vân tay từng đơn của lab10.orders hiện tại với đáp án do lab10-su-co.sh lưu. Mã thoát 0 = đạt.
set -uo pipefail
L=/tmp/mgo-lab10
docker exec mgo-lab mongosh --quiet lab10 --eval "db.orders.find().forEach(d => print(d._id + ' ' + require('crypto').createHash('md5').update(EJSON.stringify(d, { relaxed: false })).digest('hex')))" > $L/.hien-tai
read dung thieu thua lech < <(awk 'NR == FNR { da[$1] = $2; next } { ht[$1] = $2 }
  END { for (k in da) { if (!(k in ht)) t++; else if (da[k] == ht[k]) d++; else l++ } for (k in ht) if (!(k in da)) th++;
        print d + 0, t + 0, th + 0, l + 0 }' $L/.dap-an $L/.hien-tai)
echo "đúng $dung / $(wc -l < $L/.dap-an) đơn | thiếu $thieu | thừa $thua | sai nội dung $lech"
[ "$thieu$thua$lech" = 000 ] && echo "ĐẠT: không mất đơn nào, không đơn nào sai trạng thái" && exit 0
echo "CHƯA ĐẠT"; exit 1`;
const NGAY_THO = `#!/usr/bin/env bash
# Lab 10.7 — cách NGÂY THƠ (đừng làm thế này với hệ thống thật): đè bản sao lưu 02:00 lên lab10 bằng --drop.
docker cp -q /tmp/mgo-lab10/goc mgo-lab:/tmp/lab10-goc
docker exec mgo-lab mongorestore --drop --nsInclude 'lab10.*' /tmp/lab10-goc 2>&1 | tail -1
docker exec mgo-lab rm -rf /tmp/lab10-goc`;
const GIAI = `#!/usr/bin/env bash
# Lab 10.7 — LỜI GIẢI: khôi phục tới thời điểm (PITR) trên MÁY NHÁP, rồi chỉ chép lại các đơn bị xoá vào máy thật.
# Không đụng vào mọi thứ ứng dụng đã ghi sau 14:03 trên máy thật.
set -euo pipefail
L=/tmp/mgo-lab10
# 1. Tìm lệnh xoá trong oplog: mục applyOps đầu tiên chứa thao tác 'd' trên lab10.orders, SAU thời điểm bản sao lưu.
GOC_TS=$(docker run --rm --memory 2g --memory-swap 2g --cpus 2 -v $L/goc:/g:ro mongo:8.0 bsondump --quiet /g/oplog.bson | head -1 | sed -E 's/.*"t":([0-9]+),"i":([0-9]+).*/\\1 \\2/')
set -- $GOC_TS
MOC=$(docker exec mgo-lab mongosh --quiet local --eval "
  const x = db.oplog.rs.find({ ts: { \\$gt: Timestamp({ t: $1, i: $2 }) }, op: 'c', 'o.applyOps': { \\$elemMatch: { op: 'd', ns: 'lab10.orders' } } })
    .sort({ \\$natural: 1 }).limit(1).next();
  print(x.ts.t + ':' + x.ts.i + ' ' + x.wall.toISOString())")
echo "1. lệnh xoá đầu tiên: ts $MOC"
# 2. Lấy oplog từ lúc sao lưu tới giờ (ra thư mục riêng, đổi tên thành oplog.bson như mongorestore cần).
docker exec mgo-lab sh -c "rm -rf /tmp/l10op && mongodump -d local -c oplog.rs --query '{\\"ts\\":{\\"\\$gte\\":{\\"\\$timestamp\\":{\\"t\\":$1,\\"i\\":$2}}}}' --out /tmp/l10op --quiet"
mkdir -p $L/oplog; docker cp -q mgo-lab:/tmp/l10op/local/oplog.rs.bson $L/oplog/oplog.bson; docker exec mgo-lab rm -rf /tmp/l10op
echo "2. oplog từ bản sao lưu tới giờ: $(du -h $L/oplog/oplog.bson | cut -f1)"
# 3. Máy nháp: bản 02:00 + phát lại oplog tới NGAY TRƯỚC lệnh xoá.
docker rm -f mgo-l10kp >/dev/null 2>&1
docker run -d --memory 2g --memory-swap 2g --cpus 2 --name mgo-l10kp --network none mongo:8.0 >/dev/null
until docker exec mgo-l10kp mongosh --quiet --eval 1 >/dev/null 2>&1; do sleep 1; done
docker cp -q $L/goc mgo-l10kp:/goc; docker cp -q $L/oplog mgo-l10kp:/oplog
docker exec mgo-l10kp mongorestore --oplogReplay /goc --quiet            # cả máy: --oplogReplay không đi chung --nsInclude
docker exec mgo-l10kp mongorestore --oplogReplay --oplogLimit "\${MOC%% *}" /oplog --quiet
echo "3. máy nháp ở thời điểm ngay trước lệnh xoá: $(docker exec mgo-l10kp mongosh --quiet lab10 --eval 'db.orders.countDocuments()') đơn"
# 4. Chỉ chép những đơn KHÔNG còn trên máy thật (đúng các đơn bị xoá) — insert, không ghi đè ⇒ đơn sau 14:03 an toàn.
docker exec mgo-lab mongosh --quiet lab10 --eval 'db.orders.find({}, { _id: 1 }).forEach(d => print(d._id))' > $L/con.txt
docker exec -e CON="$(tr '\\n' ',' < $L/con.txt)" mgo-l10kp mongosh --quiet lab10 --eval '
  const con = process.env.CON.split(",").filter(Boolean).map(Number);
  const n = db.orders.aggregate([{ $match: { _id: { $nin: con } } }, { $out: "can_tra_lai" }]).toArray() && db.can_tra_lai.countDocuments();
  print("4. đơn cần trả lại:", n)'
docker exec mgo-l10kp mongodump -d lab10 -c can_tra_lai --archive --quiet |
  docker exec -i mgo-lab mongorestore --archive --nsFrom 'lab10.can_tra_lai' --nsTo 'lab10.orders' 2>&1 | tail -1
docker rm -f mgo-l10kp >/dev/null; rm -rf $L/oplog $L/con.txt`;

const POSTMORTEM = `# Postmortem — mất đơn lab10.orders ngày 24/11/2026 (mẫu, viết KHÔNG đổ lỗi cá nhân)
## Tóm tắt     14:03 một lệnh deleteMany chạy nhầm collection xoá 1120 đơn trước 20/10; 14:41 khôi phục xong, 0 đơn mất.
## Ảnh hưởng   38 phút khách không xem được đơn cũ; 60 lần cập nhật trạng thái trong lúc đó bị "matched 0" (đã xử lý lại).
## Dòng thời gian (giờ VN)
  02:00 sao lưu đêm (mongodump --oplog) · 14:03 lệnh xoá · 14:09 tổng đài báo · 14:12 xác nhận trong oplog (ts …)
  14:20 máy nháp: bản 02:00 + oplog tới ts lệnh xoá · 14:35 chép 1120 đơn về · 14:41 đối soát xong
## Nguyên nhân gốc   chạy lệnh tay trên production bằng tài khoản có quyền remove; không có bước "đếm trước khi xoá".
## Điều làm tốt      bản sao lưu có --oplog và đã được thử khôi phục tự động; oplog còn đủ cửa sổ.
## Việc cần làm (có người nhận + hạn)
  1. Tài khoản cá nhân trên production chỉ đọc; thao tác sửa qua script đã review (ai: …, hạn: …)
  2. Script xoá hàng loạt: in countDocuments + hỏi xác nhận + giới hạn số tài liệu (ai: …, hạn: …)
  3. Diễn tập PITR mỗi quý theo đúng runbook này (ai: …, hạn: …)`;

export default {
  title: '10.7 — Lab: the 14:03 accidental delete — restore with zero order loss|||10.7 — Lab: xoá nhầm lúc 14:03 — khôi phục không mất đơn nào',
  slug: 'mgo-10-7-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab chương 10, chấm tự động: một script dựng sự cố thật trên lab — 3.000 đơn, bản sao lưu 02:00 có --oplog, ứng dụng tiếp tục ghi và sửa đơn, 14:03 một deleteMany chạy nhầm xoá 1.120 đơn, sau đó ứng dụng vẫn chạy (60 đơn mới, 60 lần sửa trượt vì đơn đã mất). Cách ngây thơ "đè bản 02:00 bằng --drop" bị chấm CHƯA ĐẠT: đúng 2.740/3.160, thiếu 160 đơn, 260 đơn sai trạng thái. Bạn phải khôi phục để cả 3.160 đơn đúng từng byte so với đáp án. Lời giải che: tìm lệnh xoá trong oplog, PITR trên máy nháp, chỉ chép lại các đơn bị xoá — ĐẠT 3.160/3.160 trong khoảng 13 giây. Kèm rubric 10 điểm, câu hỏi bảo vệ và mẫu postmortem.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.7 · Lab</span>
<h2>Lab: the 14:03 accidental delete — restore with zero order loss</h2>
<p class="lead">This is the incident from Lesson 10.1, made harder and graded by a script. At 14:03 someone meant to clean up an archive collection and ran the delete on <code>lab10.orders</code> instead. The shop did not stop: new orders kept arriving and staff kept updating statuses — including some updates that silently matched nothing because the order was gone. Your job is to bring <code>lab10.orders</code> back so that <strong>every one of the 3,160 orders</strong> is exactly right: deleted orders as they were just before 14:03, everything else as it is now.</p>

<h3>Setup</h3>
<ul>
<li>Lab from Lesson 0.2 running (<code>mgo-lab</code>, a replica set — the oplog is what makes this possible). Work in <code>_demo/</code>.</li>
<li><code>./lab10-su-co.sh</code> creates the incident (deterministic: same incident every run) and leaves the 02:00 backup in <code>/tmp/mgo-lab10/goc</code>. Run it again to start over.</li>
<li><code>./lab10-cham.sh</code> grades the current state of <code>lab10.orders</code> against a fingerprint of every correct order (don't open <code>.dap-an</code>). Exit code 0 = pass.</li>
</ul>
<details><summary>Show the incident script (lab10-su-co.sh)</summary>
${ma('bash', SU_CO_SH)}
</details>
<details><summary>Show what the "application" does (lab10-su-co.js)</summary>
${ma('js', SU_CO_JS)}
</details>
<details><summary>Show the grader (lab10-cham.sh)</summary>
${ma('bash', CHAM)}
</details>
${lenh(K, 0)}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">02:00</span><span class="lz-t">full backup with --oplog</span><span class="lz-d">3,000 orders</span></div>
  <div class="lz-step"><span class="lz-k">02:00–14:03</span><span class="lz-t">100 new orders, 200 status updates</span><span class="lz-d">in the oplog, not in the backup</span></div>
  <div class="lz-step"><span class="lz-k">14:03</span><span class="lz-t">deleteMany on the wrong collection</span><span class="lz-d">1,120 orders gone</span></div>
  <div class="lz-step"><span class="lz-k">After 14:03</span><span class="lz-t">60 new orders, 150 updates (60 match nothing)</span><span class="lz-d">must survive your recovery</span></div>
</div>

<h3>First, the wrong way</h3>
${ma('bash', NGAY_THO)}
${lenh(K, 1)}
<p>Restoring the 02:00 backup with <code>--drop</code> is what a panicked team does first. The grader shows why it fails: 2,740 of 3,160 correct, <strong>160 orders missing</strong> (the 100 created between 02:00 and 14:03 and the 60 after — the backup never had them) and <strong>260 orders with the wrong content</strong> (every status change made today, before and after 14:03, rolled back). The customers who called about missing orders now have them back; a different 160 customers are about to call.</p>

<h3>Tasks</h3>
<ol>
<li>Run <code>./lab10-su-co.sh</code> to recreate the incident.</li>
<li>Find the delete in the oplog: its timestamp, how many entries, which namespace. Write down the timestamp.</li>
<li>Build the state just before the delete on a <strong>scratch</strong> mongod (container <code>mgo-*</code>, <code>--network none</code>, 2 GB) — never on <code>mgo-lab</code>.</li>
<li>Decide exactly which documents to copy back, and copy them without overwriting anything written after 14:03.</li>
<li>Run <code>./lab10-cham.sh</code> until it says ĐẠT. Then write a five-line postmortem (template below).</li>
<li>Make your recovery a script that runs end to end in one command — the next incident will happen at night.</li>
</ol>

<h3>Rubric (10 points)</h3>
<table>
<tr><th>Points</th><th>Criterion</th></tr>
<tr><td>3</td><td>Grader passes: 3,160/3,160, 0 missing, 0 extra, 0 wrong content</td></tr>
<tr><td>2</td><td>Correct stopping point found from the oplog (timestamp of the first delete entry, not a wall-clock guess)</td></tr>
<tr><td>2</td><td>Production touched only by inserts of the missing orders — no <code>--drop</code>, no overwrite of orders changed after 14:03</td></tr>
<tr><td>1</td><td>Recovery is one script, re-runnable from a fresh <code>lab10-su-co.sh</code></td></tr>
<tr><td>1</td><td>Scratch server limited (memory, network) and removed afterwards</td></tr>
<tr><td>1</td><td>Postmortem: timeline, root cause without blame, at least two actions with owners</td></tr>
</table>

<h3>Defence questions</h3>
<ol>
<li>Why does <code>mongorestore --oplogReplay</code> refuse <code>--nsInclude</code>, and how did that shape your solution?</li>
<li>Phase b made 60 updates that "matched 0". Your restored orders don't contain them. Is that correct? What would you tell the business?</li>
<li>What if the oplog window had been shorter than the time since the 02:00 backup?</li>
<li>Your <code>--oplogLimit</code> is one timestamp. What happens if you use the wall-clock time "14:03:00" instead?</li>
<li>How would you prevent this incident, not just recover from it?</li>
</ol>

<h3>Solution</h3>
${loiGiai('Show the solution script (lab10-giai.sh)', ma('bash', GIAI))}
${loiGiai('Show the run: ĐẠT 3,160/3,160', `${lenh(K, 2)}
<p>Four steps, about 13 seconds on the lab. (1) The first <code>applyOps</code> entry after the backup that contains a delete on <code>lab10.orders</code> gives the stopping timestamp. (2) The oplog since the backup is dumped to its own file. (3) On the scratch container the full 02:00 backup is restored with its own oplog, then the extra oplog is replayed with <code>--oplogLimit</code> = the delete's timestamp: 3,100 orders, the state one moment before 14:03. (4) The orders that exist on the scratch server but not in production are exactly the deleted ones (1,120); they are dumped and <em>inserted</em> into production — nothing that exists there is touched.</p>
<p>Defence answers in short: (1) oplog replay applies operations for all namespaces in order; filtering would leave a half-applied state — so restore the whole instance on a scratch server and filter when copying back; (2) yes: those updates never happened (they matched nothing); list the 60 attempts from application logs so staff can redo them; (3) the gap between the backup and the oldest oplog entry cannot be recovered — orders written then would be lost; hence oplog sizing/archiving and alerting on the window (Lesson 10.2); (4) you may include a few deletes or miss writes in the same second — the oplog timestamp is exact; (5) read-only personal accounts on production, reviewed scripts for bulk changes with a dry-run count, and a restore drill every quarter.</p>`)}

<h3>Postmortem template</h3>
${ma('text', POSTMORTEM)}

<h3>Extensions</h3>
<ul>
<li>Delay instead of restore: add a delayed hidden member (Lesson 7.3) with 1 hour delay and recover the deleted orders from it without any backup.</li>
<li>Make the incident an <code>updateMany</code> that sets every status to CANCELLED (Lesson 10.1, practice 3) and extend the solution: which orders get their old status back?</li>
<li>Time it on 1 million orders (<code>don-trieu.js</code>): how long does each step take, and which one would you optimise first?</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.7 · Lab</span>
<h2>Lab: xoá nhầm lúc 14:03 — khôi phục không mất đơn nào</h2>
<p class="lead">Đây là sự cố ở Bài 10.1, được làm khó hơn và chấm bằng script. Lúc 14:03, một người định dọn một collection lưu trữ nhưng lại chạy lệnh xoá lên <code>lab10.orders</code>. Cửa hàng không dừng lại: đơn mới vẫn tới, nhân viên vẫn cập nhật trạng thái, trong đó có những lần cập nhật lặng lẽ không khớp gì vì đơn đã mất. Việc của bạn là đưa <code>lab10.orders</code> trở lại sao cho <strong>từng đơn trong 3.160 đơn</strong> đều đúng tuyệt đối: đơn bị xoá trở về đúng như ngay trước 14:03, mọi đơn khác giữ nguyên như hiện tại.</p>

<h3>Chuẩn bị</h3>
<ul>
<li>Lab của Bài 0.2 đang chạy (<code>mgo-lab</code>, là replica set; chính oplog làm cho việc này khả thi). Làm việc trong <code>_demo/</code>.</li>
<li><code>./lab10-su-co.sh</code> dựng sự cố (tất định: lần nào chạy cũng ra đúng một sự cố) và để bản sao lưu 02:00 ở <code>/tmp/mgo-lab10/goc</code>. Chạy lại để làm lại từ đầu.</li>
<li><code>./lab10-cham.sh</code> chấm trạng thái hiện tại của <code>lab10.orders</code> theo vân tay của từng đơn đúng (đừng mở <code>.dap-an</code>). Mã thoát 0 = đạt.</li>
</ul>
<details><summary>Xem script dựng sự cố (lab10-su-co.sh)</summary>
${ma('bash', SU_CO_SH)}
</details>
<details><summary>Xem "ứng dụng" làm gì (lab10-su-co.js)</summary>
${ma('js', SU_CO_JS)}
</details>
<details><summary>Xem script chấm (lab10-cham.sh)</summary>
${ma('bash', CHAM)}
</details>
${lenh(K, 0)}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">02:00</span><span class="lz-t">sao lưu cả máy có --oplog</span><span class="lz-d">3.000 đơn</span></div>
  <div class="lz-step"><span class="lz-k">02:00–14:03</span><span class="lz-t">100 đơn mới, 200 lần đổi trạng thái</span><span class="lz-d">có trong oplog, không có trong bản sao lưu</span></div>
  <div class="lz-step"><span class="lz-k">14:03</span><span class="lz-t">deleteMany nhầm collection</span><span class="lz-d">mất 1.120 đơn</span></div>
  <div class="lz-step"><span class="lz-k">Sau 14:03</span><span class="lz-t">60 đơn mới, 150 lần sửa (60 lần không khớp gì)</span><span class="lz-d">phải còn nguyên sau khi bạn khôi phục</span></div>
</div>

<h3>Trước hết, cách sai</h3>
${ma('bash', NGAY_THO)}
${lenh(K, 1)}
<p>Đè bản sao lưu 02:00 bằng <code>--drop</code> là việc một nhóm đang hoảng sẽ làm đầu tiên. Script chấm cho thấy vì sao nó hỏng: đúng 2.740 trên 3.160, <strong>thiếu 160 đơn</strong> (100 đơn tạo giữa 02:00 và 14:03 cùng 60 đơn sau đó; bản sao lưu chưa từng có chúng) và <strong>260 đơn sai nội dung</strong> (mọi lần đổi trạng thái hôm nay, cả trước và sau 14:03, đều bị quay ngược). Những khách đã gọi vì mất đơn giờ có lại đơn; một nhóm 160 khách khác sắp gọi tới.</p>

<h3>Nhiệm vụ</h3>
<ol>
<li>Chạy <code>./lab10-su-co.sh</code> để dựng lại sự cố.</li>
<li>Tìm lệnh xoá trong oplog: dấu thời gian, bao nhiêu mục, namespace nào. Ghi lại dấu thời gian.</li>
<li>Dựng trạng thái ngay trước lệnh xoá trên một mongod <strong>nháp</strong> (container <code>mgo-*</code>, <code>--network none</code>, 2 GB), không bao giờ trên <code>mgo-lab</code>.</li>
<li>Quyết định chính xác tài liệu nào cần chép về, rồi chép mà không ghi đè thứ gì được ghi sau 14:03.</li>
<li>Chạy <code>./lab10-cham.sh</code> tới khi nó báo ĐẠT. Rồi viết postmortem năm dòng (mẫu bên dưới).</li>
<li>Biến cách khôi phục của bạn thành một script chạy trọn trong một lệnh, vì sự cố sau sẽ xảy ra vào ban đêm.</li>
</ol>

<h3>Rubric (10 điểm)</h3>
<table>
<tr><th>Điểm</th><th>Tiêu chí</th></tr>
<tr><td>3</td><td>Qua script chấm: 3.160/3.160, thiếu 0, thừa 0, sai nội dung 0</td></tr>
<tr><td>2</td><td>Điểm dừng đúng, tìm từ oplog (dấu thời gian của mục xoá đầu tiên, không đoán theo giờ đồng hồ)</td></tr>
<tr><td>2</td><td>Production chỉ bị chạm bằng insert các đơn thiếu: không <code>--drop</code>, không ghi đè đơn đã đổi sau 14:03</td></tr>
<tr><td>1</td><td>Khôi phục là một script, chạy lại được từ một lần <code>lab10-su-co.sh</code> mới</td></tr>
<tr><td>1</td><td>Máy nháp có giới hạn (bộ nhớ, mạng) và được xoá sau khi xong</td></tr>
<tr><td>1</td><td>Postmortem: dòng thời gian, nguyên nhân gốc không đổ lỗi, ít nhất hai việc cần làm có người nhận</td></tr>
</table>

<h3>Câu hỏi bảo vệ</h3>
<ol>
<li>Vì sao <code>mongorestore --oplogReplay</code> không chịu đi chung <code>--nsInclude</code>, và điều đó định hình lời giải của bạn thế nào?</li>
<li>Pha b có 60 lần cập nhật "matched 0". Các đơn bạn khôi phục không chứa chúng. Thế có đúng không? Bạn sẽ báo gì với nghiệp vụ?</li>
<li>Nếu cửa sổ oplog ngắn hơn khoảng thời gian từ bản sao lưu 02:00 tới giờ thì sao?</li>
<li><code>--oplogLimit</code> của bạn là một dấu thời gian. Nếu dùng giờ đồng hồ "14:03:00" thay vào thì chuyện gì xảy ra?</li>
<li>Bạn sẽ ngăn sự cố này thế nào, chứ không chỉ khôi phục sau khi nó xảy ra?</li>
</ol>

<h3>Lời giải</h3>
${loiGiai('Xem script lời giải (lab10-giai.sh)', ma('bash', GIAI))}
${loiGiai('Xem lượt chạy: ĐẠT 3.160/3.160', `${lenh(K, 2)}
<p>Bốn bước, khoảng 13 giây trên lab. (1) Mục <code>applyOps</code> đầu tiên sau bản sao lưu có thao tác xoá trên <code>lab10.orders</code> cho ta dấu thời gian dừng. (2) Oplog từ lúc sao lưu được dump ra tệp riêng. (3) Trên container nháp, khôi phục toàn bộ bản 02:00 cùng oplog của nó, rồi phát lại phần oplog thêm với <code>--oplogLimit</code> = dấu thời gian lệnh xoá: 3.100 đơn, đúng trạng thái một khoảnh khắc trước 14:03. (4) Các đơn có trên máy nháp mà không có trên production chính là các đơn bị xoá (1.120); chúng được dump ra rồi <em>insert</em> vào production, không đụng tới thứ gì đang có ở đó.</p>
<p>Trả lời bảo vệ, ngắn gọn: (1) phát lại oplog áp dụng thao tác của mọi namespace theo đúng thứ tự; lọc bớt sẽ để lại trạng thái áp dụng dở dang, nên khôi phục cả máy trên máy nháp rồi lọc khi chép về; (2) đúng: các lần cập nhật đó chưa từng xảy ra (không khớp gì); lấy danh sách 60 lần thử từ log ứng dụng để nhân viên làm lại; (3) khoảng trống giữa bản sao lưu và mục oplog cũ nhất không khôi phục được, đơn ghi trong khoảng đó sẽ mất; vì thế phải tính cỡ/lưu trữ oplog và cảnh báo theo cửa sổ (Bài 10.2); (4) bạn có thể lỡ gồm vài lệnh xoá hoặc bỏ sót các lần ghi trong cùng giây đó, còn dấu thời gian oplog thì chính xác; (5) tài khoản cá nhân trên production chỉ được đọc, script sửa hàng loạt phải qua review và có bước đếm thử, và diễn tập khôi phục mỗi quý.</p>`)}

<h3>Mẫu postmortem</h3>
${ma('text', POSTMORTEM)}

<h3>Mở rộng</h3>
<ul>
<li>Trễ thay vì khôi phục: thêm một thành viên hidden có độ trễ 1 giờ (Bài 7.3) và cứu các đơn bị xoá từ nó mà không cần bản sao lưu nào.</li>
<li>Đổi sự cố thành một lệnh <code>updateMany</code> đặt mọi trạng thái thành CANCELLED (Bài 10.1, thực hành 3) và mở rộng lời giải: những đơn nào được trả lại trạng thái cũ?</li>
<li>Bấm giờ trên 1 triệu đơn (<code>don-trieu.js</code>): mỗi bước mất bao lâu, và bạn tối ưu bước nào trước?</li>
</ul>
</div>
`,
};
