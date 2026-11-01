// perf/book.mjs — tạo n lượt đặt (Cô Lan, phòng labId) cho các kịch bản đo của Chương 10; mỗi lần gọi dùng khung giờ mới
const BASE = process.env.BASE ?? 'http://localhost:4000';
let day = Math.floor(Math.random() * 3000);              // mỗi tiến trình một vùng khung giờ riêng ⇒ không 409
export async function book(n, labId = 'lab_3', base = BASE) {
  const ids = [];
  for (let i = 0; i < n; i++, day++) {
    const start = new Date(Date.UTC(2027, 1, 1 + Math.floor(day / 5), 1 + (day % 5) * 2)).toISOString();
    const r = await fetch(`${base}/v2/bookings`, { method: 'POST', headers: { authorization: 'Bearer tok_lan', 'content-type': 'application/json' },
      body: JSON.stringify({ labId, period: { start, end: new Date(Date.parse(start) + 7200000).toISOString() } }) });
    ids.push((await r.json()).id);
  }
  return ids;
}
