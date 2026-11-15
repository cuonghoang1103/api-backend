// Bảng vết Floyd (LC 142) trên danh sách n nút, đuôi trỏ về chỉ số pos. Làm việc với CHỈ SỐ nút (next(i) = i+1, nút cuối → pos)
// để in được vị trí; đây đúng là thuật toán trên con trỏ, chỉ thay "nút" bằng "chỉ số của nút".
export function vetFloyd(n, pos) {
  const next = (i) => (i + 1 < n ? i + 1 : pos);
  const pha1 = [];
  let slow = 0, fast = 0, buoc = 0;
  pha1.push({ buoc, slow, fast });
  do {
    slow = next(slow);
    fast = next(next(fast));
    buoc++;
    pha1.push({ buoc, slow, fast });
  } while (slow !== fast);
  const gap = slow;
  const pha2 = [];
  let p = 0, q = gap, b2 = 0;
  pha2.push({ buoc: b2, p, q });
  while (p !== q) {
    p = next(p); q = next(q); b2++;
    pha2.push({ buoc: b2, p, q });
  }
  return { pha1, pha2, gap, vao: p };
}
