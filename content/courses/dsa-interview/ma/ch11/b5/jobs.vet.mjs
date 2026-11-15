// Bảng vết LC 1235: sắp theo giờ kết thúc, chạy DP + tìm nhị phân THẬT, ghi mỗi bước: việc, j (số việc kết thúc kịp), bỏ / lấy, dp.
export function vetLichViec(start, end, profit) {
  const n = start.length;
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => end[a] - end[b]);
  const ends = idx.map((i) => end[i]);
  const dp = new Array(n + 1).fill(0);
  const hang = [];
  for (let i = 1; i <= n; i++) {
    const job = idx[i - 1];
    let lo = 0, hi = i - 1;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (ends[mid] > start[job]) hi = mid; else lo = mid + 1; }
    const bo = dp[i - 1], lay = profit[job] + dp[lo];
    dp[i] = Math.max(bo, lay);
    hang.push({ i, job, s: start[job], e: end[job], p: profit[job], j: lo, bo, lay, dp: [...dp.slice(0, i + 1)] });
  }
  return hang;
}
