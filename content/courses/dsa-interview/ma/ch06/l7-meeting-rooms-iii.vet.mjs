// Bảng vết Meeting Rooms III: chạy THẬT hai heap (phòng trống theo số phòng; phòng bận theo [giờ trống, số phòng]).
export function vetPhongIII(n, meetings) {
  const s = [...meetings].sort((a, b) => a[0] - b[0]);
  let free = Array.from({ length: n }, (_, r) => r);           // giữ dạng đã sắp để in (min-heap ⇒ đỉnh = phần tử đầu)
  let busy = [];                                                // [giờ trống, phòng], đã sắp
  const used = new Array(n).fill(0);
  const sapBusy = () => busy.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return s.map(([start, end]) => {
    const tra = [];
    while (busy.length && busy[0][0] <= start) { const [t, r] = busy.shift(); free.push(r); tra.push(`room ${r} (free at ${t})`); }
    free.sort((a, b) => a - b);
    let viec;
    if (free.length) {
      const r = free.shift(); busy.push([end, r]); used[r]++;
      viec = `room ${r} ⇒ busy until ${end}`;
    } else {
      const [t, r] = busy.shift(); const moi = t + (end - start); busy.push([moi, r]); used[r]++;
      viec = `none free ⇒ wait for room ${r} at ${t}, runs [${t},${moi})`;
    }
    sapBusy();
    return { hop: `[${start},${end})`, tra, viec, free: [...free], busy: busy.map(([t, r]) => `${t}·r${r}`), used: [...used] };
  });
}
