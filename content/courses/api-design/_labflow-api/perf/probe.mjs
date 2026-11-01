// perf/probe.mjs — bài 8.4: "người dùng giả" đo SLI như một trang trạng thái
// Cứ 100 ms gọi GET /v2/labs (timeout 1 s). Request TỐT = mã 2xx VÀ nhanh hơn 300 ms.
const URL_ = process.env.URL ?? 'http://localhost:4000/v2/labs';
const SECONDS = Number(process.env.SECONDS ?? 30);
const SLO = Number(process.env.SLO ?? 99.9);
let good = 0, total = 0;
const codes = {};
const end = Date.now() + SECONDS * 1000;
while (Date.now() < end) {
  const a = performance.now();
  let status = 'timeout';
  try { const r = await fetch(URL_, { signal: AbortSignal.timeout(1000) }); await r.text(); status = r.status; } catch { /* timeout / mạng */ }
  const ms = performance.now() - a;
  total++;
  codes[status] = (codes[status] ?? 0) + 1;
  if (typeof status === 'number' && status < 300 && ms < 300) good++;
  await new Promise((r) => setTimeout(r, 100));
}
const sli = (100 * good) / total;
console.log(`${total} request · tốt ${good} · mã ${JSON.stringify(codes)}`);
console.log(`SLI (2xx và < 300 ms): ${sli.toFixed(2)}% · SLO ${SLO}% ⇒ ${sli >= SLO ? 'ĐẠT' : 'TRƯỢT'}`);
const budget = 30 * 24 * 60 * (1 - SLO / 100);                // phút được phép hỏng mỗi 30 ngày
const used = (SECONDS / 60) * (1 - sli / 100);                // phút "hỏng" trong lần đo này
console.log(`Ngân sách lỗi 30 ngày ở SLO ${SLO}%: ${budget.toFixed(1)} phút · lần đo này đã dùng ${used.toFixed(2)} phút (${((100 * used) / budget).toFixed(1)}%)`);
