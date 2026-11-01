// estimate.mjs — bài 11.1: ước lượng nhanh (back-of-the-envelope) cho LabFlow, rồi đối chiếu với SỐ ĐÃ ĐO ở các chương trước
// npx autocannon -c 50 -d 10 -j http://localhost:4000/v2/labs > perf/bench-labs.json   (đo công suất trước)
// node interview/estimate.mjs      — sửa các GIẢ ĐỊNH ngay dưới đây rồi chạy lại
import { readFileSync } from 'node:fs';
import pg from 'pg';

const A = {                                                         // GIẢ ĐỊNH (nói to trong phỏng vấn, không phải số liệu thật của trường)
  students: 30_000, dailyActive: 0.2,                               // 30.000 sinh viên, 20% dùng mỗi ngày
  readsPerUser: 12, bookingsPerUser: 1, loginsPerUser: 1,           // mỗi người một ngày
  spikeShare: 0.5, spikeSec: 60,                                    // 50% người dùng trong ngày dồn vào phút mở đăng ký 07:00
  spikeReadsPerUser: 10,                                            // trong phút đó mỗi người bấm F5 ~10 lần
  years: 3,
};
let bench = null;
try { bench = JSON.parse(readFileSync(new URL('../perf/bench-labs.json', import.meta.url))); } catch {}
const MEASURED = {                                                  // số ĐÃ ĐO trên laptop soạn bài (một tiến trình Node)
  'GET /v2/labs (bài 11.1, autocannon)': Math.round(bench?.requests?.average ?? 0),
  'đăng nhập scrypt bất đồng bộ (bài 8.2)': 114,
  'báo cáo dùng phòng sau khi sửa (Lab 8)': 4_532,
};
if (bench) console.log(`autocannon GET /v2/labs: ${Math.round(bench.requests.average)} req/s trung bình · p50 ${bench.latency.p50} ms · p99 ${bench.latency.p99} ms · non-2xx ${bench.non2xx}\n`);
const fmt = (x, d = 1) => x.toLocaleString('en-US', { maximumFractionDigits: d });

const dau = A.students * A.dailyActive;
const perDay = { reads: dau * A.readsPerUser, bookings: dau * A.bookingsPerUser, logins: dau * A.loginsPerUser };
console.log(`DAU = ${fmt(A.students)} × ${A.dailyActive} = ${fmt(dau)} người/ngày`);
console.log('                 mỗi ngày     trung bình/s   đỉnh (phút 07:00)/s');
const spikeUsers = dau * A.spikeShare;
const spike = { reads: spikeUsers * A.spikeReadsPerUser / A.spikeSec, bookings: spikeUsers * A.bookingsPerUser / A.spikeSec, logins: spikeUsers * A.loginsPerUser / A.spikeSec };
for (const k of ['reads', 'bookings', 'logins'])
  console.log(`${k.padEnd(14)} ${fmt(perDay[k]).padStart(10)}   ${fmt(perDay[k] / 86_400, 2).padStart(12)}   ${fmt(spike[k]).padStart(12)}`);
console.log(`⇒ trung bình nhỏ tới mức vô nghĩa; thiết kế theo ĐỈNH: ~${fmt(spike.reads)} đọc/s, ~${fmt(spike.logins)} đăng nhập/s, ~${fmt(spike.bookings)} lượt đặt/s`);

let bytesPerRow = 0;
try {                                                               // đo kích thước thật của bảng bookings 1 triệu dòng (Chương 3)
  const c = new pg.Client({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow' });
  await c.connect();
  const r = (await c.query("SELECT count(*)::int AS n, pg_total_relation_size('bookings')::bigint AS b FROM bookings")).rows[0];
  bytesPerRow = Number(r.b) / r.n; await c.end();
  console.log(`\nbảng bookings đo thật: ${fmt(r.n, 0)} dòng, ${fmt(Number(r.b) / 1e6)} MB kể cả chỉ mục ⇒ ${fmt(bytesPerRow, 0)} byte/lượt đặt`);
  console.log(`lưu trữ ${A.years} năm: ${fmt(perDay.bookings * 365 * A.years, 0)} lượt đặt × ${fmt(bytesPerRow, 0)} B ≈ ${fmt(perDay.bookings * 365 * A.years * bytesPerRow / 1e6)} MB`);
} catch (e) { console.log(`\n(không đo được kích thước bảng: ${e.message})`); }

console.log('\nđối chiếu với số đã đo trên MỘT tiến trình Node:');
for (const [name, rps] of Object.entries(MEASURED)) if (rps) console.log(`  ${name.padEnd(42)} ${fmt(rps, 0).padStart(7)}/s`);
const need = { 'đọc': [spike.reads, MEASURED['GET /v2/labs (bài 11.1, autocannon)']], 'đăng nhập': [spike.logins, 114] };
for (const [k, [want, have]] of Object.entries(need)) if (have) console.log(`  ${k}: cần ${fmt(want)}/s, một tiến trình làm được ${fmt(have, 0)}/s ⇒ dùng ${fmt(100 * want / have, 0)}% công suất`);
