// Bảng vết LC 56: sau khi sắp theo điểm đầu, mỗi khoảng được gộp vào khoảng cuối hay mở khoảng mới.
export function vetMergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  const hang = [];
  for (const [s, e] of sorted) {
    const last = out[out.length - 1];
    const lastTruoc = last ? `[${last[0]}, ${last[1]}]` : '—';
    let hanhDong;
    if (last && s <= last[1]) {
      hanhDong = e > last[1] ? `extend: ${s} ≤ ${last[1]}, end → ${e}` : `inside: ${s} ≤ ${last[1]}, end stays ${last[1]}`;
      last[1] = Math.max(last[1], e);
    } else {
      hanhDong = last ? `new: ${s} > ${last[1]}` : 'new: first interval';
      out.push([s, e]);
    }
    hang.push({ cur: `[${s}, ${e}]`, lastTruoc, hanhDong, out: JSON.stringify(out) });
  }
  return { sorted, hang };
}
