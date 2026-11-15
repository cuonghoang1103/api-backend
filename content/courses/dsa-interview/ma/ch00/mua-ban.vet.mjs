// Bảng vết LC 121: chạy thuật toán thật, ghi minSoFar/best trước-sau từng ngày.
export function vetMuaBan(prices) {
  let minSoFar = Infinity, best = 0;
  return prices.map((p, i) => {
    const loiNeuBan = minSoFar === Infinity ? null : p - minSoFar;
    best = Math.max(best, loiNeuBan ?? 0);
    const minTruoc = minSoFar;
    minSoFar = Math.min(minSoFar, p);
    return { i, p, minTruoc, loiNeuBan, best, minSau: minSoFar };
  });
}
