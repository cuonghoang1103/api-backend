// Bảng vết LC 136 (XOR dồn): chạy thuật toán THẬT, ghi acc trước/sau từng vòng dưới dạng nhị phân.
export function vetXor(nums, rong = 4) {
  const b = (x) => (x >>> 0).toString(2).padStart(rong, '0').slice(-rong);
  let acc = 0;
  return nums.map((x, i) => {
    const truoc = acc;
    acc ^= x;
    return { i, x, bx: b(x), truoc, btruoc: b(truoc), sau: acc, bsau: b(acc) };
  });
}
