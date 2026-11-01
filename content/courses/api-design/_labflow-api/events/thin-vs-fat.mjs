// events/thin-vs-fat.mjs — bài 10.3: CÙNG 300 sự kiện của LabFlow, consumer đọc theo hai kiểu hợp đồng:
//   mỏng (thin): sự kiện chỉ có id ⇒ consumer phải gọi lại GET /v2/bookings/{id} để biết chuyện gì xảy ra
//   dày (fat):   sự kiện chở trạng thái LÚC XẢY RA (data đầy đủ, không dữ liệu cá nhân)
// Consumer chạy SAU một nhịp (như hàng đợi đang dồn): 200 lượt đặt được tạo, 100 trong số đó bị huỷ ngay.
const BASE = process.env.BASE ?? 'http://localhost:4000';
const H = { authorization: 'Bearer tok_lan', 'content-type': 'application/json' };
for (let i = 0; i < 200; i++) {
  const start = new Date(Date.UTC(2026, 11, 1 + Math.floor(i / 5), 1 + (i % 5) * 2)).toISOString();
  const end = new Date(Date.parse(start) + 7200000).toISOString();
  const b = await (await fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: H, body: JSON.stringify({ labId: 'lab_2', period: { start, end } }) })).json();
  if (i % 2 === 0) await fetch(`${BASE}/v2/bookings/${b.id}/cancel`, { method: 'POST', headers: H });
}
const { data: events } = await (await fetch(`${BASE}/v2/events?after=0&limit=100`, { headers: H })).json().then(async (p1) => {
  let all = p1.data, next = p1.next;
  for (;;) { const p = await (await fetch(`${BASE}/v2/events?after=${next}&limit=100`, { headers: H })).json(); if (!p.data.length) break; all = all.concat(p.data); next = p.next; }
  return { data: all };
});
const thin = events.map((e) => ({ ...e, data: { id: e.data.id } }));
const bytes = (xs) => xs.reduce((s, e) => s + Buffer.byteLength(JSON.stringify(e)), 0);
console.log(`${events.length} sự kiện: ${events.filter((e) => e.type.endsWith('created.v1')).length} created, ${events.filter((e) => e.type.endsWith('cancelled.v1')).length} cancelled`);
console.log(`kích thước: mỏng ${bytes(thin)} B (${Math.round(bytes(thin) / events.length)} B/sự kiện) · dày ${bytes(events)} B (${Math.round(bytes(events) / events.length)} B/sự kiện)`);

// Consumer "gửi email xác nhận" cho mỗi booking.created
let calls = 0, t0 = performance.now(), wrong = 0;
for (const e of thin) if (e.type.endsWith('created.v1')) {
  const b = await (await fetch(`${BASE}/v2/bookings/${e.data.id}`, { headers: H })).json(); calls++;
  if (b.status !== 'PENDING') wrong++;                         // email "đã đặt" nhưng đọc ra trạng thái của BÂY GIỜ
}
console.log(`mỏng: ${calls} lần gọi lại API trong ${(performance.now() - t0).toFixed(0)} ms · ${wrong} email "đã đặt" đọc phải trạng thái CANCELLED`);
t0 = performance.now(); wrong = 0;
for (const e of events) if (e.type.endsWith('created.v1') && e.data.status !== 'PENDING') wrong++;
console.log(`dày:  0 lần gọi lại API trong ${(performance.now() - t0).toFixed(1)} ms · ${wrong} sai — mỗi sự kiện nói đúng điều đã xảy ra lúc đó`);
