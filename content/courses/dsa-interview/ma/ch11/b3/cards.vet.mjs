// Bảng vết LC 1423: chạy THẬT bản "trượt từ trái sang phải", ghi các thẻ đang cầm + tổng sau từng bước.
export function vetBocThe(cards, k) {
  const n = cards.length;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += cards[i];
  let best = sum;
  const cam = (r) => [...Array.from({ length: k - r }, (_, i) => i), ...Array.from({ length: r }, (_, i) => n - 1 - i)];
  const hang = [{ r: 0, tra: null, lay: null, sum, best, cam: cam(0) }];
  for (let r = 1; r <= k; r++) {
    sum += cards[n - r] - cards[k - r];
    best = Math.max(best, sum);
    hang.push({ r, tra: k - r, lay: n - r, sum, best, cam: cam(r) });
  }
  return hang;
}
