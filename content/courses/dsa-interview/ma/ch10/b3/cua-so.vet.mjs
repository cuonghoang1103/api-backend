// Bảng vết cửa sổ cố định k: chạy THẬT bản lỗi (s < n − k) hoặc bản đúng (s <= n − k), ghi trạng thái từng bước,
// kể cả lần kiểm điều kiện vòng lặp làm vòng dừng (đó là chỗ lỗi lệch một nằm).
export function vetCuaSo(nums, k, { loi = false } = {}) {
  const n = nums.length;
  const hang = [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  hang.push({ s: 0, tu: 0, den: k - 1, sum, best, dk: 'init' });
  for (let s = 1; ; s++) {
    const tiep = loi ? s < n - k : s <= n - k;
    const dk = `${s} ${loi ? '&lt;' : '&lt;='} ${n - k}`;
    if (!tiep) { hang.push({ s, tu: null, den: null, sum: null, best, dk: `${dk} ⇒ false, stop` }); break; }
    sum += nums[s + k - 1] - nums[s - 1];
    best = Math.max(best, sum);
    hang.push({ s, tu: s, den: s + k - 1, sum, best, dk: `${dk} ⇒ true` });
  }
  return hang;
}
