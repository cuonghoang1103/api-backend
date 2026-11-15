// Bảng vết cho cả Chương 4: chạy ĐÚNG khuôn firstTrue (giống lower-bound.ts) và ghi lo/mid/hi từng vòng.
// ok(i) trả true/false; giaTri(i) (tuỳ chọn) = chữ hiện trong cột "giá trị ở mid".
export function vetFirstTrue(lo, hi, ok, giaTri = () => '') {
  const hang = [];
  let vong = 0;
  while (lo < hi) {
    vong++;
    const mid = lo + Math.floor((hi - lo) / 2);
    const t = ok(mid);
    const truoc = { lo, hi };
    if (t) hi = mid; else lo = mid + 1;
    hang.push({ vong, lo: truoc.lo, hi: truoc.hi, mid, t, gt: giaTri(mid), loMoi: lo, hiMoi: hi });
  }
  return { hang, ketQua: lo };
}

// Các biến thể SAI của khuôn — chạy tới khi dừng hoặc chạm trần vòng (để thấy nó kẹt).
//  'lo=mid'      : else lo = mid (quên +1)
//  'lo<=hi'      : while (lo <= hi) nhưng vẫn hi = mid
export function vetSai(kieu, lo, hi, ok, tran = 6) {
  const hang = [];
  let vong = 0;
  while (kieu === 'lo<=hi' ? lo <= hi : lo < hi) {
    if (vong === tran) { hang.push({ ket: true }); break; }
    vong++;
    const mid = lo + Math.floor((hi - lo) / 2);
    const t = ok(mid);
    const truoc = { lo, hi };
    if (t) hi = mid; else lo = kieu === 'lo=mid' ? mid : mid + 1;
    hang.push({ vong, lo: truoc.lo, hi: truoc.hi, mid, t, loMoi: lo, hiMoi: hi });
  }
  return hang;
}
