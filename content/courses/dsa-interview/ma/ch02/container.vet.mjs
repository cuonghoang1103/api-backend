// Bảng vết Container With Most Water: chạy thuật toán THẬT, ghi từng vòng (l, r, diện tích, kỷ lục, con trỏ nào đi).
export function vetContainer(h) {
  const hang = [];
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    const area = Math.min(h[l], h[r]) * (r - l);
    const moi = area > best;
    best = Math.max(best, area);
    const viec = h[l] < h[r] ? 'l++' : 'r--';
    hang.push({ l, r, area, best, moi, viec });
    if (viec === 'l++') l++; else r--;
  }
  return hang;
}
