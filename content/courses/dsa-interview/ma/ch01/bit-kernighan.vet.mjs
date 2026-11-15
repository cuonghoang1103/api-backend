// Bảng vết n & (n − 1): chạy THẬT, mỗi vòng ghi n, n − 1, n & (n − 1) dạng nhị phân.
export function vetKernighan(n, rong = 8) {
  const b = (x) => (x >>> 0).toString(2).padStart(rong, '0');
  const hang = [];
  let buoc = 0;
  while (n !== 0) {
    const m = n & (n - 1);
    buoc++;
    hang.push({ buoc, n, bn: b(n), n1: n - 1, bn1: b(n - 1), m, bm: b(m) });
    n = m;
  }
  return hang;
}
