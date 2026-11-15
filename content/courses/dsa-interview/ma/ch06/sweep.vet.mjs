// Bảng vết "cần bao nhiêu phòng" — hai góc nhìn, cả hai chạy THẬT:
//  vetQuet: quét sự kiện +1/−1 (cùng thời điểm: −1 trước +1 vì khoảng nửa mở [bắt đầu, kết thúc)).
//  vetHeapPhong: duyệt cuộc họp theo giờ bắt đầu, min-heap giờ trả phòng.
export function vetQuet(intervals) {
  const ev = [];
  intervals.forEach(([s, e], k) => { ev.push({ t: s, d: +1, k }); ev.push({ t: e, d: -1, k }); });
  ev.sort((a, b) => a.t - b.t || a.d - b.d);
  const dang = new Set();
  let cur = 0, best = 0;
  return ev.map(({ t, d, k }) => {
    cur += d;
    if (d > 0) dang.add(k); else dang.delete(k);
    best = Math.max(best, cur);
    const [s, e] = intervals[k];
    return { t, d, ten: `[${s},${e})`, cur, best, dang: [...dang].sort((x, y) => x - y).map((j) => `[${intervals[j][0]},${intervals[j][1]})`) };
  });
}

export function vetHeapPhong(intervals) {
  const s = [...intervals].sort((a, b) => a[0] - b[0]);
  const h = [];                                     // giữ dạng đã sắp để in; phép toán như min-heap (đỉnh = h[0])
  return s.map(([start, end]) => {
    const truoc = [...h];
    let viec;
    if (h.length && h[0] <= start) { const x = h.shift(); viec = `reuse the room free at ${x}`; }
    else viec = h.length ? `earliest free at ${h[0]} > ${start} ⇒ open a new room` : 'no room yet ⇒ open room 1';
    h.push(end); h.sort((a, b) => a - b);
    return { hop: `[${start},${end})`, truoc, viec, sau: [...h], phong: h.length };
  });
}
