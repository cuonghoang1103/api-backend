// Bảng vết LC 523: chạy thuật toán THẬT (số dư tiền tố + chỉ số ĐẦU TIÊN), ghi trạng thái từng vòng.
export function vet523(nums, k) {
  const first = new Map([[0, -1]]);
  const hang = [];
  let rem = 0;
  for (let i = 0; i < nums.length; i++) {
    rem = (rem + nums[i]) % k;
    const truoc = '{' + [...first].map(([r, j]) => `${r}:${j}`).join(', ') + '}';
    const j = first.get(rem);
    let kq;
    if (j === undefined) { first.set(rem, i); kq = 'moi'; }
    else if (i - j >= 2) kq = 'ok';
    else kq = 'ngan';
    hang.push({ i, x: nums[i], rem, truoc, j: j ?? null, kq });
    if (kq === 'ok') break;
  }
  return hang;
}
